import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import '../stylesheets/style.css'

const Header = () => {
  const [toggle, setToggle] = useState(true);

  const toggleMenu = () => {
    setToggle(!toggle)
  };

  return (
    <div className="h-[10%] bg-slate-900 text-white flex justify-around items-center text-[1.75rem] font-light ">
      <NavLink className={({isActive}) => isActive ? "btn-active hidden md:block" : "btn hidden md:block"} to="/">
        Home
      </NavLink>
      <NavLink className={({isActive}) => isActive ? "btn-active hidden md:block" : "btn hidden md:block"} to="/about">
        About
      </NavLink>
      <NavLink className={({isActive}) => isActive ? "btn-active hidden md:block" : "btn hidden md:block"} to="/Contact">
        Contact
      </NavLink>
      <div className="md:hidden flex flex-col w-screen justify-center items-center">
        {toggle ? (
          <IoMenu
            className="flex justify-center items-center text-[2.25rem]"
            onClick={toggleMenu}
          />
        ) : (
          <div className="relative mt-[7rem] px-6 pb-6 bg-slate-900 w-screen z-[999] justify-center items-center">
            <IoMdCloseCircle className="absolute top-[2rem] right-6 text-[2.25rem]" onClick={toggleMenu} />
            <div className="flex flex-col gap-6">
              <NavLink className={({isActive}) => isActive ? "mt-6 underline" : "mt-6 hover:underline"} to="/">
                Home
              </NavLink>
              <NavLink className={({isActive}) => isActive ? "underline" : "hover:underline"} to="/about">
                About
              </NavLink>
              <NavLink className={({isActive}) => isActive ? "underline" : "hover:underline"} to="/Contact">
                Contact
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
