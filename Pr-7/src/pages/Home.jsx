import React from "react";
import SearchBar from "../components/SearchBar";

const Home = () => {
  return (
    <div className="bg-slate-700 h-[90%] text-white flex flex-col items-center font-thin">
      <SearchBar />
      <div className="h-full w-full flex justify-center items-center flex-col">
        <h1 className="w-full text-[5vw] flex justify-center items-center font-normal">
          Welcome to My Website
        </h1>
        <p className="text-[1.5vw] m-4">This is the main content of the webpage.</p>
      </div>
    </div>
  );
};

export default Home;
