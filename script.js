const brandName = "RIVOLT";
const categories = ["Футболки", "Кофти та худі", "Новинки", "Популярне"];
let currentYear = new Date().getFullYear();

console.log("Бренд:", brandName);
console.log("Категорії:", categories);
console.log("Поточний рік:", currentYear);

const heroTitle = document.querySelector("#hero h1");
const yearEl = document.querySelector("#year");
console.log("Заголовок сторінки:", heroTitle.textContent.trim());

yearEl.textContent = currentYear;

const productCards = document.querySelectorAll(".product");
console.log("Кількість карток товарів:", productCards.length);

const menuLinks = document.querySelectorAll("#main-menu a");

function setActiveLink(activeLink) {
  menuLinks.forEach(function (link) {
    link.classList.remove("active");
  });
  activeLink.classList.add("active");
}

const themeToggle = document.getElementById("theme-toggle");
const menuToggle = document.getElementById("menu-toggle");
const mainMenu = document.getElementById("main-menu");
const htmlEl = document.documentElement;

themeToggle.addEventListener("click", function () {
  const current = htmlEl.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  htmlEl.setAttribute("data-theme", next);
});

menuToggle.addEventListener("click", function () {
  const isOpen = mainMenu.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Закрити меню" : "Відкрити меню"
  );
});

menuLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    setActiveLink(link);

    mainMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Відкрити меню");
  });
});
