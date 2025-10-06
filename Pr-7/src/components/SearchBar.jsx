import React from 'react'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const SearchBar = () => {

  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const route = input.trim().toLowerCase();

      if (["home", "about", "contact"].includes(route)) {
        navigate(route === "home" ? "/" : `/${route}`);
      } else {
        alert("Page not found!");
      }
    }
  };

  return (
    <div className="w-[40%] rounded-full relative m-8">
        <input
          type="text"
          className="h-14 w-full rounded-full bg-slate-600 px-6 py-2 text-[1.5vw] font-light outline-none"
          placeholder="Type page name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <IoSearchOutline className="z-10 text-[2rem] absolute top-3 right-[3%]" />
      </div>
  )
}

export default SearchBar