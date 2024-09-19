function openDeleteModal(buttonElement) {
    // Извлекаем данные JSON из атрибута data-user
    const userData = buttonElement.closest('tr').getAttribute('data-user');
    const user = JSON.parse(userData);
    // Устанавливаем значения в модальном окне
    document.getElementById('id').value = user.id;
    document.getElementById('firstName').value = user.firstName;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('age').value = user.age;
    document.getElementById('email').value = user.email;
    document.getElementById('roles1').innerHTML = user.roles.map(role => `<option value="${role.name}">${role.name}</option>`).join('');
    // Устанавливаем скрытое поле для ID пользователя
    document.getElementById('modal-hidden-user-id').value = user.id;
}

function openEditModal(buttonElement) {
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

    // Доступные роли
    const allOptions = document.querySelectorAll('#roles1_edit option');

    // Сброс всех выбранных ролей
    allOptions.forEach(option => option.selected = false);

    // Выбираем те роли, которые соответствуют ролям пользователя
    user.roles.forEach(userRole => {
        allOptions.forEach(option => {
            if (option.value === userRole.name) {
                option.selected = true;
            }
        });
    });
}

function showSectionRoles(navElement) {
    const roleName = navElement.getAttribute('data-role');

    // Обновить активное меню
    const links = document.querySelectorAll('.sidebar-nav');
    links.forEach(link => {link.classList.remove('active-link')});
    navElement.classList.add('active-link');

    // Показать соответствующую секцию
    if (roleName === 'ROLE_ADMIN') {
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
    } else if (roleName === 'ROLE_USER') {
        document.getElementById('admin-panel').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
    }
}

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
    }
}

// Установка активной ссылки при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.sidebar-nav');
    links.forEach(link => {
        if (link.getAttribute('data-role') === 'ROLE_ADMIN') {
            link.classList.add('active-link');
        }
    });
});