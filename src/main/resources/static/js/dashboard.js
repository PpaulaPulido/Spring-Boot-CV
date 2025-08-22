import { showAlert } from './functions.js';

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get('loginSuccess');
    
    if (loginSuccess) {
        showAlert({
            icon: 'success',
            title: '¡Sesión Iniciada!',
            html: 'Has iniciado sesión correctamente. ¡Bienvenido de nuevo!'
        }).then(() => {
            // Limpiar el parámetro de la URL sin recargar
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        });
    }

    // 2. Manejar logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            showAlert({
                icon: 'question',
                title: 'Cerrar sesión',
                html: '¿Estás seguro de que quieres cerrar sesión?',
                draggable: true
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/logout';
                }
            });
        });
    }

});