document.addEventListener('DOMContentLoaded', function () {
    fetchUserData();
});


////////////////////

function fetchUserData() {
    fetch('/api/user/auth')
        .then(response => response.json())
        .then(currentUser => {
            const userInfoElement = document.getElementById('userInfoHeader');
            userInfoElement.innerHTML = `
                <span class="fw-bold">${currentUser.email}</span>
                <span>with roles: </span>
                ${currentUser.roles.map(role => `<span class="fw-normal me-2">${role.name}</span>`).join('')}
            `;

            const roleList = document.getElementById('userRoleList');
            roleList.innerHTML = '';

            currentUser.roles.forEach(role => {
                const listItem = document.createElement('li');
                listItem.className = 'nav-item';
                listItem.innerHTML = `
                    <a class="nav-link sidebar-nav"
                       data-role="${role.name}"
                       onclick="showSectionRoles(this); event.preventDefault();"
                       href="#">
                        ${role.name}
                    </a>
                `;
                roleList.appendChild(listItem);
            });

            const userTableBody = document.getElementById('userInfoPage');
            userTableBody.innerHTML = `
                    <tr class="text-secondary">
                        <th scope="row">${currentUser.id}</th>
                        <td>${currentUser.firstName}</td>
                        <td>${currentUser.lastName}</td>
                        <td>${currentUser.age}</td>
                        <td>${currentUser.email}</td>
                        <td>
                            ${currentUser.roles.map(role => `<span class="me-2">${role.name}</span>`).join('')}
                        </td>
                    </tr>
                `;

            if (currentUser.roles.some(role => role.name === 'ROLE_ADMIN')) {
                const links = document.querySelectorAll('.sidebar-nav');
                links.forEach(link => {
                    if (link.getAttribute('data-role') === 'ROLE_ADMIN') {
                        link.classList.add('active-link');
                    }
                });
                switchSectionByRole('ROLE_ADMIN');
                fetchUsers();
            } else if (currentUser.roles.length === 1 && currentUser.roles.some(role => role.name === 'ROLE_USER')) {
                const links = document.querySelectorAll('.sidebar-nav');
                links.forEach(link => {
                    if (link.getAttribute('data-role') === 'ROLE_USER') {
                        link.classList.add('active-link');
                    }
                });
                switchSectionByRole('ROLE_USER');
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
}

///////////////////////

function fetchUsers() {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const tableBody = document.querySelector('table tbody');
            tableBody.innerHTML = '';

            users.forEach(user => {
                const userRow = document.createElement('tr');
                userRow.setAttribute('data-user', JSON.stringify(user));
                userRow.innerHTML = `
                    <th scope="row">${user.id}</th>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => `<span>${role.name}</span>`).join(', ')}</td>
                    <td>
                        <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal"
                            data-bs-target="#modalEditUser" onclick="openEditModal(this)">
                            Edit
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal"
                            data-bs-target="#modalDeleteUser" onclick="openDeleteModal(this)">
                            Delete
                        </button>
                    </td>
                `;
                tableBody.appendChild(userRow);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

async function fetchRoles() {
    try {
        const response = await fetch('/api/roles');
        if (!response.ok) {
            throw new Error('Failed to fetch roles');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

///////////////////////

function openEditModal(buttonElement){
    // Извлекаем данные JSON из атрибута data-user
    const userData = buttonElement.closest('tr').getAttribute('data-user');
    const user = JSON.parse(userData);

    // Устанавливаем значения в модальном окне
    document.getElementById('id_edit').value = user.id;
    document.getElementById('id_edit_hidden').value = user.id;
    document.getElementById('firstName_edit').value = user.firstName;
    document.getElementById('lastName_edit').value = user.lastName;
    document.getElementById('age_edit').value = user.age;
    document.getElementById('email_edit').value = user.email;
    document.getElementById('password_edit').value = "";

    fetchRoles().then(roles => {
        const rolesSelect = document.getElementById('roles1_edit');

        // Очищаем предыдущие опции
        rolesSelect.innerHTML = '';

        // Заполняем выпадающий список доступными ролями
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.name;
            option.setAttribute('data-id', role.id);
            option.textContent = role.name;
            rolesSelect.appendChild(option);
        });

        // Отмечаем роли, которые соответствуют ролям пользователя
        user.roles.forEach(userRole => {
            Array.from(rolesSelect.options).forEach(option => {
                if (option.value === userRole.name) {
                    option.selected = true;
                }
            });
        });
    }).catch(error => {
        console.error('Error fetching roles:', error);
    });

    document.getElementById('btnEditUser').onclick = function () {
        saveEditedUser(user.id);
    };
}

function saveEditedUser(userId) {
    const updatedUser = {
        id: userId,
        firstName: document.getElementById('firstName_edit').value,
        lastName: document.getElementById('lastName_edit').value,
        age: Number(document.getElementById('age_edit').value),
        email: document.getElementById('email_edit').value,
        password: document.getElementById('password_edit').value,
        roles: getSelectedRoles('roles1_edit')
    };


    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    fetch(`/api/users`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken,
        },
        body: JSON.stringify(updatedUser),
    })
        .then(response => response.json())
        .then(() => {
            fetchUsers(); // Обновляем таблицу
            closeModal('modalEditUser'); // Закрываем модальное окно
        })
        .catch(error => console.error('Error edit user:', error));
}


/////////////////////////////////

function openDeleteModal(buttonElement){
    // Извлекаем данные JSON из атрибута data-user
    const userData = buttonElement.closest('tr').getAttribute('data-user');
    const user = JSON.parse(userData);

    // Устанавливаем значения в модальном окне
    document.getElementById('id_delete').value = user.id;
    document.getElementById('firstName_delete').value = user.firstName;
    document.getElementById('lastName_delete').value = user.lastName;
    document.getElementById('age_delete').value= user.age;
    document.getElementById('email_delete').value = user.email;

    const rolesSelect = document.getElementById('roles1_delete');
    rolesSelect.innerHTML = '';

    user.roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.name;
        option.textContent = role.name;
        option.selected = true;
        rolesSelect.appendChild(option);
    });

    document.getElementById('btnDeleteUser').onclick = function () {
        deleteUser(user.id);
    };
}

function deleteUser(userId) {
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken,
        },
    })
        .then((response) => {
            if (response.ok) {
                fetchUsers();
                closeModal('modalDeleteUser');
            } else {
                throw new Error(`Failed to delete user: ${response.status}`);
            }
        })
        .catch(error => console.error('Error delete user:', error));
}


////////////////////////

function formNewUser(){
    fetchRoles().then(roles => {
        const rolesSelect = document.getElementById('roles1_add');
        rolesSelect.innerHTML = '';
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.name;
            option.setAttribute('data-id', role.id);
            option.textContent = role.name;
            rolesSelect.appendChild(option);
        });
    }).catch(error => {
        console.error('Error fetching roles:', error);
    });

    document.getElementById('btnAddNewUser').onclick = function () {
        addNewUser();
    };
}

function addNewUser() {
    const newUser = {
        firstName: document.getElementById('firstName_add').value,
        lastName: document.getElementById('lastName_add').value,
        age: Number(document.getElementById('age_add').value),
        email: document.getElementById('email_add').value,
        password: document.getElementById('password_add').value,
        roles: getSelectedRoles('roles1_add')
    };


    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
    const usersTab = document.getElementById('users_tab');

    fetch(`/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken,
        },
        body: JSON.stringify(newUser),
    })
        .then((response) => {
            if (response.ok) {
                fetchUsers();
                document.getElementById('firstName_add').value = '';
                document.getElementById('lastName_add').value = '';
                document.getElementById('age_add').value = '';
                document.getElementById('email_add').value = '';
                document.getElementById('password_add').value = '';
                showSectionMainContent(usersTab);
            } else {
                throw new Error(`Failed to add new user: ${response.status}`);
            }
        })
        .catch(error => console.error('Error add user:', error));
}


///////////////////////

function getSelectedRoles(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    const selectedOptions = Array.from(selectElement.selectedOptions);
    return selectedOptions.map(option => ({
        id: Number(option.getAttribute('data-id')), // Извлекаем ID из data-id
        name: option.value
    }));
}


function closeModal(idModal) {
    const modal = document.getElementById(idModal);
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) {
        bootstrapModal.hide();
    }
}

/////////////////////
function showSectionMainContent(navElement) {
    const usersTab = document.getElementById('users_tab');
    const newUserTab = document.getElementById('new_user_tab');

    // Обновить активное меню
    const links = document.querySelectorAll('.main-content-nav');
    links.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    navElement.classList.add('active');
    navElement.setAttribute('aria-current',"page")

    // Показать соответствующую секцию
    if (navElement === usersTab) {
        document.getElementById('users_section').style.display = 'block';
        document.getElementById('new_user_section').style.display = 'none';
    } else if (navElement === newUserTab) {
        document.getElementById('users_section').style.display = 'none';
        document.getElementById('new_user_section').style.display = 'block';
        formNewUser();
    }
}


function showSectionRoles(navElement) {
    const roleName = navElement.getAttribute('data-role');
    // Обновить активное меню
    const links = document.querySelectorAll('.sidebar-nav');
    links.forEach(link => {link.classList.remove('active-link')});
    navElement.classList.add('active-link');

    switchSectionByRole(roleName);
}

function switchSectionByRole(roleName) {
    // Показать соответствующую секцию
    if (roleName === 'ROLE_ADMIN') {
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
    } else if (roleName === 'ROLE_USER') {
        document.getElementById('admin-panel').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
    }
}

