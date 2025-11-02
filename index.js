const navLinks = document.querySelectorAll('.nav-links li a');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(link => link.classList.remove('active'));

        link.classList.add('active');
    });
});

const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('open');
});
