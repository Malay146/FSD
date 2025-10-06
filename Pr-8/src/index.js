const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.set("views", path.join(__dirname, "../views")); 
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public/stylesheets")));
app.use(express.static(path.join(__dirname, "../public/javascripts")));

const dataFilePath = path.join(__dirname, "../data.json");

app.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  res.render("index", { count: data.count });
});

app.post("/update", (req, res) => {
  const { count } = req.body;
  fs.writeFileSync(dataFilePath, JSON.stringify({ count }));
  res.status(200).json({ message: "Count updated successfully" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
