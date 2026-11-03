import { useState, useEffect } from "react";
import Header from "./components/Header";
import Card from "./components/Card";
import Footer from "./components/Footer";

const projects = [
  { id: 1, title: 'Футболка "Static"', text: "799 ₴", image: "/images/tshirt-static.jpg", category: "Футболки" },
  { id: 2, title: 'Футболка "Concrete"', text: "849 ₴", image: "/images/tshirt-concrete.jpg", category: "Футболки" },
  { id: 3, title: "Худі", text: "1299 ₴", image: "rivolt-react/public/images/hoodie-voltage.jpg", category: "Худі" },
];

const categories = ["Усі", "Футболки", "Худі"];

function App() {
  const [theme, setTheme] = useState("dark");
  const [category, setCategory] = useState("Усі");
  const [name, setName] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const visible = projects.filter(
    (p) => category === "Усі" || p.category === category
  );

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <section id="tshirts">
          <h2>Каталог</h2>

          <div className="filters">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={c === category ? "active" : ""}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid">
            {visible.map((p) => (
              <Card key={p.id} {...p} />
            ))}
          </div>
        </section>

        <section id="greeting">
          <h2>Привітання</h2>
          <label htmlFor="name">Ваше імʼя</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введіть імʼя"
          />
          <p>{name ? `Привіт, ${name}!` : "Введіть імʼя, щоб привітатися."}</p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;