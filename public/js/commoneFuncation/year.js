const Selectyear = document.querySelector(".year");
Selectyear.textContent = new Date().getFullYear();


// ----------------------for nav bar responsive----------------------------
const menuBtn = document.getElementById("menuBtn");
const navLink = document.querySelector(".nav-link");
const loginLink = document.querySelector(".login-link");

menuBtn.addEventListener("click", () => {
    navLink.classList.toggle("active");
    loginLink.classList.toggle("active");
});