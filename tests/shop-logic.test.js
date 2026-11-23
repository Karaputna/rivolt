const test = require("node:test");
const assert = require("node:assert");
const shop = require("../shop-logic.js");

const riot = { id: "tshirt-riot", title: 'Футболка "Riot"', price: 799, image: "images/tshirt-riot.webp" };
const shadow = { id: "hoodie-shadow", title: 'Худі "Shadow"', price: 1899, image: "images/hoodie-shadow.webp" };

test("addItem: новий товар отримує кількість 1", function () {
  const cart = shop.addItem([], riot);
  assert.strictEqual(cart.length, 1);
  assert.strictEqual(cart[0].quantity, 1);
});

test("addItem: повторне додавання збільшує кількість, а не дублює рядок", function () {
  const cart = shop.addItem(shop.addItem([], riot), riot);
  assert.strictEqual(cart.length, 1);
  assert.strictEqual(cart[0].quantity, 2);
});

test("addItem: не змінює вхідний масив", function () {
  const before = [];
  shop.addItem(before, riot);
  assert.strictEqual(before.length, 0);
});

test("addItem: кількість обмежена 99", function () {
  let cart = [];
  for (let i = 0; i < 120; i++) cart = shop.addItem(cart, riot);
  assert.strictEqual(cart[0].quantity, 99);
});

test("changeQuantity: +1 і -1", function () {
  let cart = shop.addItem([], riot);
  cart = shop.changeQuantity(cart, riot.id, 1);
  assert.strictEqual(cart[0].quantity, 2);
  cart = shop.changeQuantity(cart, riot.id, -1);
  assert.strictEqual(cart[0].quantity, 1);
});

test("changeQuantity: зменшення до нуля прибирає позицію", function () {
  const cart = shop.changeQuantity(shop.addItem([], riot), riot.id, -1);
  assert.strictEqual(cart.length, 0);
});

test("removeItem і clearCart", function () {
  const cart = shop.addItem(shop.addItem([], riot), shadow);
  assert.strictEqual(shop.removeItem(cart, riot.id).length, 1);
  assert.strictEqual(shop.clearCart().length, 0);
});

test("getTotals: кількість і сума", function () {
  let cart = shop.addItem(shop.addItem([], riot), riot);
  cart = shop.addItem(cart, shadow);
  const totals = shop.getTotals(cart);
  assert.strictEqual(totals.count, 3);
  assert.strictEqual(totals.sum, 799 * 2 + 1899);
});

test("getTotals: порожній кошик", function () {
  assert.deepStrictEqual(shop.getTotals([]), { count: 0, sum: 0 });
});

function fakeStorage(initial) {
  const data = Object.assign({}, initial);
  return {
    getItem: function (k) { return k in data ? data[k] : null; },
    setItem: function (k, v) { data[k] = String(v); }
  };
}

test("saveCart + loadCart: кошик зберігається і читається", function () {
  const storage = fakeStorage();
  const cart = shop.addItem([], riot);
  assert.strictEqual(shop.saveCart(storage, cart), true);
  assert.deepStrictEqual(shop.loadCart(storage), cart);
});

test("loadCart: пошкоджений JSON дає порожній кошик", function () {
  const storage = fakeStorage({ [shop.STORAGE_KEY]: "{не json" });
  assert.deepStrictEqual(shop.loadCart(storage), []);
});

test("loadCart: некоректні позиції відкидаються", function () {
  const bad = JSON.stringify([
    { id: "a", title: "A", price: -5, image: "x", quantity: 1 },
    { id: "b", title: "B", price: 10, image: "x", quantity: 0 },
    { id: "c", title: "C", price: 10, image: "x", quantity: 2.5 },
    { id: "d", title: "D", price: "10", image: "x", quantity: 1 },
    { id: "ok", title: "OK", price: 10, image: "x", quantity: 1000 }
  ]);
  const cart = shop.loadCart(fakeStorage({ [shop.STORAGE_KEY]: bad }));
  assert.strictEqual(cart.length, 1);
  assert.strictEqual(cart[0].id, "ok");
  assert.strictEqual(cart[0].quantity, 99);
});

test("saveCart: помилка запису не кидає виняток", function () {
  const broken = { setItem: function () { throw new Error("QuotaExceededError"); } };
  assert.strictEqual(shop.saveCart(broken, []), false);
  assert.strictEqual(shop.saveCart(null, []), false);
});

const catalog = [
  { id: "tshirt-concrete", category: "tshirts", title: 'Футболка "Concrete"', price: 849 },
  { id: "tshirt-riot", category: "tshirts", title: 'Футболка "Riot"', price: 799 },
  { id: "hoodie-shadow", category: "hoodies", title: 'Худі "Shadow"', price: 1899 },
  { id: "sweatshirt-signal", category: "hoodies", title: 'Кофта "Signal"', price: 1599 },
  { id: "hoodie-voltage", category: "hoodies", title: 'Худі "Voltage"', price: 1999 }
];

function ids(list) { return list.map(function (p) { return p.id; }); }

test("filterProducts: без фільтрів повертає все", function () {
  assert.strictEqual(shop.filterProducts(catalog, { category: "all", maxPrice: null, query: "" }).length, 5);
});

test("filterProducts: за категорією", function () {
  assert.deepStrictEqual(ids(shop.filterProducts(catalog, { category: "tshirts" })), ["tshirt-concrete", "tshirt-riot"]);
});

test("filterProducts: за максимальною ціною (межа включно)", function () {
  assert.deepStrictEqual(ids(shop.filterProducts(catalog, { maxPrice: 849 })), ["tshirt-concrete", "tshirt-riot"]);
});

test("filterProducts: пошук без урахування регістру й зайвих пробілів", function () {
  assert.deepStrictEqual(ids(shop.filterProducts(catalog, { query: "  SHADOW " })), ["hoodie-shadow"]);
});

test("filterProducts: комбінація фільтрів", function () {
  const result = shop.filterProducts(catalog, { category: "hoodies", maxPrice: 1700, query: "кофта" });
  assert.deepStrictEqual(ids(result), ["sweatshirt-signal"]);
});

test("filterProducts: порожній результат", function () {
  assert.strictEqual(shop.filterProducts(catalog, { category: "tshirts", maxPrice: 500 }).length, 0);
});
