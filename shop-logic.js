// Логіка кошика та фільтрації без доступу до DOM.
// Працює і в браузері (глобальний об'єкт RivoltShop), і в Node.js (для тестів).
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.RivoltShop = api;
  }
})(typeof self !== "undefined" ? self : this, function () {
  const STORAGE_KEY = "rivolt-cart";
  const MAX_QUANTITY = 99;

  function addItem(cart, product) {
    const existing = cart.find(function (item) {
      return item.id === product.id;
    });

    if (existing) {
      return cart.map(function (item) {
        return item.id === product.id
          ? Object.assign({}, item, {
              quantity: Math.min(item.quantity + 1, MAX_QUANTITY)
            })
          : item;
      });
    }

    return cart.concat([
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      }
    ]);
  }

  function changeQuantity(cart, id, delta) {
    return cart
      .map(function (item) {
        return item.id === id
          ? Object.assign({}, item, {
              quantity: Math.min(item.quantity + delta, MAX_QUANTITY)
            })
          : item;
      })
      .filter(function (item) {
        return item.quantity > 0;
      });
  }

  function removeItem(cart, id) {
    return cart.filter(function (item) {
      return item.id !== id;
    });
  }

  function clearCart() {
    return [];
  }

  function getTotals(cart) {
    let count = 0;
    let sum = 0;
    cart.forEach(function (item) {
      count += item.quantity;
      sum += item.price * item.quantity;
    });
    return { count: count, sum: sum };
  }

  // Залишає лише коректні позиції: дані з localStorage можна змінити вручну.
  function sanitizeCart(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
      .filter(function (item) {
        return (
          item &&
          typeof item.id === "string" &&
          item.id !== "" &&
          typeof item.title === "string" &&
          typeof item.image === "string" &&
          Number.isFinite(item.price) &&
          item.price >= 0 &&
          Number.isInteger(item.quantity) &&
          item.quantity >= 1
        );
      })
      .map(function (item) {
        return {
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: Math.min(item.quantity, MAX_QUANTITY)
        };
      });
  }

  function loadCart(storage) {
    if (!storage) return [];
    try {
      const saved = storage.getItem(STORAGE_KEY);
      return saved ? sanitizeCart(JSON.parse(saved)) : [];
    } catch (error) {
      return [];
    }
  }

  // Повертає true, якщо запис вдався (сховище може бути заблоковане або повне).
  function saveCart(storage, cart) {
    if (!storage) return false;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(cart));
      return true;
    } catch (error) {
      return false;
    }
  }

  // filters: { category: "all" | "tshirts" | "hoodies", maxPrice: число або null, query: рядок }
  function filterProducts(products, filters) {
    const category = filters.category || "all";
    const maxPrice = Number.isFinite(filters.maxPrice) ? filters.maxPrice : null;
    const query = (filters.query || "").trim().toLowerCase();

    return products.filter(function (product) {
      if (category !== "all" && product.category !== category) return false;
      if (maxPrice !== null && product.price > maxPrice) return false;
      if (query !== "" && product.title.toLowerCase().indexOf(query) === -1) {
        return false;
      }
      return true;
    });
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    MAX_QUANTITY: MAX_QUANTITY,
    addItem: addItem,
    changeQuantity: changeQuantity,
    removeItem: removeItem,
    clearCart: clearCart,
    getTotals: getTotals,
    sanitizeCart: sanitizeCart,
    loadCart: loadCart,
    saveCart: saveCart,
    filterProducts: filterProducts
  };
});
