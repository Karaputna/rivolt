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

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") {
  htmlEl.setAttribute("data-theme", savedTheme);
}

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    const current = htmlEl.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    htmlEl.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return "Введіть коректний email, наприклад name@example.com.";
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

        if (data.name === "") {
      showMessage("Введіть ім'я.", "form-error");
      return;
    }

    if (data.message === "") {
      showMessage("Введіть повідомлення.", "form-error");
      return;
    }

    const consentInput = form.querySelector("#consent");
    if (consentInput && !consentInput.checked) {
      showMessage("Потрібна згода на обробку персональних даних.", "form-error");
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function () { console.log("Service worker зареєстровано"); })
      .catch(function (err) { console.log("Помилка service worker:", err); });
  });
}

// ===== Кошик і фільтрація (логіка — у shop-logic.js) =====
const shopCards = document.querySelectorAll("article.product[data-id]");
const cartList = document.querySelector("#cart-list");
const cartEmpty = document.querySelector("#cart-empty");
const cartSummary = document.querySelector("#cart-summary");
const cartTotalEl = document.querySelector("#cart-total");
const cartCountEl = document.querySelector("#cart-count");
const cartStatus = document.querySelector("#cart-status");
const cartBadge = document.querySelector("#cart-badge");
const cartClearBtn = document.querySelector("#cart-clear");

function getStorage() {
  try {
    return window.localStorage;
  } catch (error) {
    return null;
  }
}

function formatPrice(value) {
  return value + " ₴";
}

if (window.RivoltShop && shopCards.length > 0 && cartList) {
  const shop = window.RivoltShop;
  const storage = getStorage();
  let cart = shop.loadCart(storage);

  function announce(text) {
    if (cartStatus) cartStatus.textContent = text;
  }

  function updateCart(nextCart) {
    cart = nextCart;
    if (!shop.saveCart(storage, cart)) {
      console.log("Кошик не вдалося зберегти в localStorage.");
    }
    renderCart();
  }

  function makeButton(text, className, label, handler) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = text;
    button.setAttribute("aria-label", label);
    button.addEventListener("click", handler);
    return button;
  }

  function renderCart() {
    cartList.innerHTML = "";
    const totals = shop.getTotals(cart);

    cart.forEach(function (item) {
      const li = document.createElement("li");
      li.className = "cart-item";

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = "";
      img.width = 64;
      img.height = 80;

      const info = document.createElement("div");
      const title = document.createElement("h3");
      title.className = "cart-item-title";
      title.textContent = item.title;
      const price = document.createElement("p");
      price.className = "cart-item-price";
      price.textContent = formatPrice(item.price);
      info.appendChild(title);
      info.appendChild(price);

      const controls = document.createElement("div");
      controls.className = "cart-item-controls";

      const qty = document.createElement("span");
      qty.className = "cart-qty";
      qty.textContent = item.quantity;

      const lineSum = document.createElement("span");
      lineSum.className = "cart-line-sum";
      lineSum.textContent = formatPrice(item.price * item.quantity);

      controls.appendChild(
        makeButton("−", "qty-btn", "Зменшити кількість: " + item.title, function () {
          updateCart(shop.changeQuantity(cart, item.id, -1));
          announce("Кількість змінено: " + item.title);
        })
      );
      controls.appendChild(qty);
      controls.appendChild(
        makeButton("+", "qty-btn", "Збільшити кількість: " + item.title, function () {
          updateCart(shop.changeQuantity(cart, item.id, 1));
          announce("Кількість змінено: " + item.title);
        })
      );
      controls.appendChild(lineSum);
      controls.appendChild(
        makeButton("Видалити", "cart-remove", "Видалити з кошика: " + item.title, function () {
          updateCart(shop.removeItem(cart, item.id));
          announce("Видалено з кошика: " + item.title);
        })
      );

      li.appendChild(img);
      li.appendChild(info);
      li.appendChild(controls);
      cartList.appendChild(li);
    });

    const isEmpty = cart.length === 0;
    cartEmpty.hidden = !isEmpty;
    cartSummary.hidden = isEmpty;
    cartTotalEl.textContent = formatPrice(totals.sum);
    cartCountEl.textContent = totals.count;
    cartBadge.textContent = totals.count > 0 ? " (" + totals.count + ")" : "";
  }

  // Додавання з карток (делегування: працює для всіх секцій)
  shopCards.forEach(function (card) {
    const button = card.querySelector(".add-to-cart");
    if (!button) return;
    const titleText = card.querySelector("h3").textContent.trim();
    button.setAttribute("aria-label", "Додати в кошик: " + titleText);

    button.addEventListener("click", function () {
      updateCart(
        shop.addItem(cart, {
          id: card.dataset.id,
          title: titleText,
          price: Number(card.dataset.price),
          image: card.querySelector("img").getAttribute("src")
        })
      );
      announce("Додано в кошик: " + titleText);
      button.textContent = "Додано ✓";
      setTimeout(function () {
        button.textContent = "До кошика";
      }, 1200);
    });
  });

  if (cartClearBtn) {
    cartClearBtn.addEventListener("click", function () {
      updateCart(shop.clearCart());
      announce("Кошик очищено");
    });
  }

  // Синхронізація між вкладками
  window.addEventListener("storage", function (event) {
    if (event.key === shop.STORAGE_KEY) {
      cart = shop.loadCart(storage);
      renderCart();
    }
  });

  renderCart();

  // ----- Фільтрація -----
  const filterChips = document.querySelectorAll(".filter-chip");
  const priceSelect = document.querySelector("#filter-price");
  const queryInput = document.querySelector("#filter-query");
  const resetBtn = document.querySelector("#filter-reset");
  const resultEl = document.querySelector("#filter-result");
  const filterState = { category: "all", maxPrice: null, query: "" };

  const catalogProducts = [];
  const seenIds = {};
  shopCards.forEach(function (card) {
    if (seenIds[card.dataset.id]) return;
    seenIds[card.dataset.id] = true;
    catalogProducts.push({
      id: card.dataset.id,
      category: card.dataset.category,
      title: card.querySelector("h3").textContent.trim(),
      price: Number(card.dataset.price)
    });
  });

  function applyFilters() {
    const matched = shop.filterProducts(catalogProducts, filterState);
    const matchedIds = {};
    matched.forEach(function (product) {
      matchedIds[product.id] = true;
    });

    shopCards.forEach(function (card) {
      card.hidden = !matchedIds[card.dataset.id];
    });

    ["tshirts", "hoodies", "new", "bestsellers"].forEach(function (sectionId) {
      const section = document.getElementById(sectionId);
      if (!section) return;
      const visible = section.querySelectorAll("article.product:not([hidden])");
      section.hidden = visible.length === 0;
    });

    resultEl.textContent =
      matched.length === 0
        ? "Нічого не знайдено. Змініть фільтри або натисніть «Скинути»."
        : "Знайдено товарів: " + matched.length;
  }

  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      filterState.category = chip.dataset.category;
      filterChips.forEach(function (other) {
        other.setAttribute("aria-pressed", other === chip ? "true" : "false");
      });
      applyFilters();
    });
  });

  priceSelect.addEventListener("change", function () {
    filterState.maxPrice = priceSelect.value === "" ? null : Number(priceSelect.value);
    applyFilters();
  });

  queryInput.addEventListener("input", function () {
    filterState.query = queryInput.value;
    applyFilters();
  });

  resetBtn.addEventListener("click", function () {
    filterState.category = "all";
    filterState.maxPrice = null;
    filterState.query = "";
    priceSelect.value = "";
    queryInput.value = "";
    filterChips.forEach(function (chip) {
      chip.setAttribute("aria-pressed", chip.dataset.category === "all" ? "true" : "false");
    });
    applyFilters();
  });

  applyFilters();
} else {
  console.log("Кошик і фільтри не ініціалізовано: немає shop-logic.js або карток товарів.");
}
