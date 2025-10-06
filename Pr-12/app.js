const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index", { result: null, error: null });
});

app.post("/calculate", (req, res) => {
  let { num1, num2, operation } = req.body;

  // Convert inputs to numbers
  let n1 = parseFloat(num1);
  let n2 = parseFloat(num2);

  // Handle invalid inputs
  if (isNaN(n1) || isNaN(n2)) {
    return res.render("index", { result: null, error: "❌ Please enter valid numbers!" });
  }

  let result;
  switch (operation) {
    case "add":
      result = n1 + n2;
      break;
    case "subtract":
      result = n1 - n2;
      break;
    case "multiply":
      result = n1 * n2;
      break;
    case "divide":
      if (n2 === 0) {
        return res.render("index", { result: null, error: "⚠️ Cannot divide by zero!" });
      }
      result = n1 / n2;
      break;
    default:
      return res.render("index", { result: null, error: "❌ Invalid operation!" });
  }

  res.render("index", { result, error: null });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Calculator running at http://localhost:${PORT}`);
});
