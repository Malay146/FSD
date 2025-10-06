import React from "react";
import SearchBar from "../components/SearchBar";

const Contact = () => {
  return (
    <div className="bg-slate-700 w-screen h-[90%] text-white flex flex-col items-center font-normal">
      <SearchBar />
      <h1 className="w-full h-full text-[5rem] whitespace-nowrap flex justify-center items-center">
        Conatct
      </h1>
    </div>
  );
};

export default Contact;
