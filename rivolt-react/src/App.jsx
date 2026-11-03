import Header from "./components/Header";
import Card from "./components/Card";
import Footer from "./components/Footer";

const projects = [
  { id: 1, title: 'Футболка "Static"', text: "799 ₴", image: "/images/tshirt-static.jpg" },
  { id: 2, title: 'Футболка "Concrete"', text: "849 ₴", image: "/images/tshirt-concrete.jpg" },
  { id: 3, title: "Худі", text: "1299 ₴", image: "/images/hoodie.jpg" },
];

function App() {
  return (
    <>
      <Header />
      <main>
        <section id="tshirts">
          <h2>Футболки</h2>
          <div className="grid">
            {projects.map((p) => (
              <Card key={p.id} {...p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;