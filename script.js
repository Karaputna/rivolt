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

const form = document.querySelector("#contacts form");
const emailInput = document.querySelector("#contacts input[type='email']");
const formMessage = document.querySelector("#form-message");

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = type;
}

function checkEmail(email) {
  if (email === "") {
    return "Введіть email.";
  }
  if (!email.includes("@")) {
    return "Email має містити символ @.";
  }
  return "";
}

if (form && emailInput && formMessage) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    console.log("Email:", email);

    const error = checkEmail(email);
    if (error) {
      showMessage(error, "form-error");
    } else {
      showMessage("Дякуємо! Повідомлення надіслано.", "form-success");
      form.reset();
    }
  });

  emailInput.addEventListener("input", function () {
    const error = checkEmail(emailInput.value.trim());
    if (error) {
      showMessage(error, "form-error");
    } else {
      showMessage("Email виглядає правильно.", "form-success");
    }
  });
} else {
  console.log("Форму, поле email або #form-message не знайдено");
}