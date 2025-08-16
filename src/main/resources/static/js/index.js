//Codigo para agregar animaciones y efectos
// Animación de aparición al hacer scroll
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
    reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            el.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Efecto hover en chips para ampliar la plantilla
document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('mouseenter', () => {
        chip.style.transform = 'scale(1.05)';
    });
    chip.addEventListener('mouseleave', () => {
        chip.style.transform = 'scale(1)';
    });
});
