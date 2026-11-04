const brandName = "RIVOLT";
const categories = ["Футболки", "Кофти та худі", "Новинки", "Популярне"];
const currentYear = new Date().getFullYear();

console.log("Бренд:", brandName);
console.log("Категорії:", categories);
console.log("Поточний рік:", currentYear);

const heroTitle = document.querySelector("#hero h1");
const yearEl = document.querySelector("#year");

if (heroTitle) {
  console.log("Заголовок сторінки:", heroTitle.textContent.trim());
}
if (yearEl) {
  yearEl.textContent = currentYear;
}

const productCards = document.querySelectorAll(".product");
console.log("Кількість карток товарів:", productCards.length);

const menuLinks = document.querySelectorAll("#main-menu a");
const themeToggle = document.getElementById("theme-toggle");
const menuToggle = document.getElementById("menu-toggle");
const mainMenu = document.getElementById("main-menu");
const htmlEl = document.documentElement;

function setActiveLink(activeLink) {
  menuLinks.forEach(function (link) {
    link.classList.remove("active");
  });
  activeLink.classList.add("active");
}

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    const current = htmlEl.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    htmlEl.setAttribute("data-theme", next);
  });
}

if (menuToggle && mainMenu) {
  menuToggle.addEventListener("click", function () {
    const isOpen = mainMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Закрити меню" : "Відкрити меню"
    );
  });
}

menuLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    setActiveLink(link);
    if (mainMenu && menuToggle) {
      mainMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Відкрити меню");
    }
  });
});

const form = document.querySelector("#contacts form");
const emailInput = document.querySelector("#contacts input[type='email']");
const phoneInput = document.querySelector("#contacts input[name='phone']");
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

function checkPhone(phone) {
  if (phone === "") return "Введіть номер телефону.";
  return /^\+380\d{9}$/.test(phone)
    ? ""
    : "Телефон має бути у форматі +380XXXXXXXXX.";
}

if (form && emailInput && phoneInput && formMessage) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = form.querySelector("input[type='text']");
    const messageInput = form.querySelector("textarea");
    const submitBtn = form.querySelector("button[type='submit']");

    const data = {
      name: nameInput ? nameInput.value.trim() : "",
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      message: messageInput ? messageInput.value.trim() : ""
    };
    console.log("Дані форми:", data);

    const emailError = checkEmail(data.email);
    if (emailError) {
      showMessage(emailError, "form-error");
      return;
    }

    const phoneError = checkPhone(data.phone);
    if (phoneError) {
      showMessage(phoneError, "form-error");
      return;
    }

    const oldText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Надсилання…";
    showMessage("", "");

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
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

  phoneInput.addEventListener("input", function () {
    const error = checkPhone(phoneInput.value.trim());
    if (error) {
      showMessage(error, "form-error");
    } else {
      showMessage("Телефон у правильному форматі.", "form-success");
    }
  });
} else {
  console.log("Форму, поля email/телефону або #form-message не знайдено");
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

const apiGrid = document.querySelector("#api-grid");
const apiMessage = document.querySelector("#api-message");

async function loadProjects() {
  try {
    const response = await fetch("http://localhost:3000/api/projects");
    if (!response.ok) {
      throw new Error("Статус " + response.status);
    }
    const projects = await response.json();
    apiGrid.innerHTML = "";

    projects.forEach(function (p) {
      const card = document.createElement("article");
      card.className = "product";

      const img = document.createElement("img");
      img.className = "thumb";
      img.src = p.image;
      img.alt = p.title;
      img.width = 400;
      img.height = 500;

      const title = document.createElement("h3");
      title.textContent = p.title;

      const price = document.createElement("p");
      price.className = "price";
      price.textContent = p.price + " ₴";

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(price);
      apiGrid.appendChild(card);
    });
  } catch (error) {
    console.log(error);
    apiMessage.textContent = "Не вдалося завантажити каталог. Перевірте, чи запущений сервер.";
  }
}

if (apiGrid && apiMessage) {
  loadProjects();
}