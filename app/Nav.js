// src/app/Nav.js
import React from "react";

function Nav() {
  return (
    <div className="w-full h-16 bg-gray-800 text-white fixed top-0 left-0">
      <div className="flex items-center justify-between h-full px-4">
        <h1 className="text-xl font-bold">Whether Prec</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Favorite
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Nav;
