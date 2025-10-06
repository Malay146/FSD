import React from "react";
import { Routes, Route } from "react-router-dom";
import About from "./pages/about";
import Home from "./pages/home";
import Contact from "./pages/contact";
import Header from "./components/header";

const App = () => {
  return (
    <div className="h-screen font-[Montserrat]">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
};

export default App;
