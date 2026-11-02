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
    form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = form.querySelector("input[type='text']");
    const messageInput = form.querySelector("textarea");
    const submitBtn = form.querySelector("button[type='submit']");

    // Крок 5: збираємо дані
    const data = {
      name: nameInput ? nameInput.value.trim() : "",
      email: emailInput.value.trim(),
      message: messageInput ? messageInput.value.trim() : ""
    };
    console.log("Дані форми:", data);

    const error = checkEmail(data.email);
    if (error) {
      showMessage(error, "form-error");
      return;
    }

    // Крок 8: стан завантаження
    const oldText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Надсилання…";
    showMessage("", "");

    try {
      // Кроки 6-7: POST і перевірка статусу
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Помилка сервера: " + response.status);
      }

      const result = await response.json();
      console.log("Відповідь сервера:", result);
      showMessage("Дякуємо! Повідомлення надіслано.", "form-success");
      form.reset();
    } catch (err) {
      console.log(err);
      showMessage("Не вдалося надіслати. Перевірте інтернет і спробуйте ще раз.", "form-error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = oldText;
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

const newsList = document.querySelector("#news-list");
const newsMessage = document.querySelector("#news-message");

async function loadNews() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
    if (!response.ok) {
      throw new Error("Статус " + response.status);
    }
    const posts = await response.json();
    newsList.innerHTML = "";
    posts.forEach(function (post) {
      const li = document.createElement("li");
      li.textContent = post.title;
      newsList.appendChild(li);
    });
  } catch (error) {
    console.log(error);
    newsMessage.textContent = "Не вдалося завантажити новини. Спробуйте пізніше.";
  }
}

if (newsList && newsMessage) {
  loadNews();
}