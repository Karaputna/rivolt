const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const projects = [
  { id: 1, title: 'Футболка "Static"', price: 799, image: "images/tshirt-static.jpg.jpg" },
  { id: 2, title: 'Футболка "Concrete"', price: 849, image: "images/tshirt-concrete.jpg.jpg" },
  { id: 3, title: 'Футболка "Riot"', price: 799, image: "images/tshirt-riot.jpg.jpg" },
  { id: 4, title: 'Худі "Shadow"', price: 1899, image: "images/hoodie-shadow.jpg.jpg" }
];

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.get("/api/projects/:id", (req, res) => {
  const project = projects.find((p) => p.id === Number(req.params.id));
  if (!project) {
    return res.status(404).json({ error: "Проєкт не знайдено" });
  }
  res.json(project);
});

app.post("/api/contact", (req, res) => {
  console.log("Нове повідомлення:", req.body);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log("Сервер працює: http://localhost:" + PORT);
});
