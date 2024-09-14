// src/app/Nav.js
import React from "react";
import Link from "next/link";

function Nav() {
  return (
    <div className="w-full h-16 bg-gray-800 text-white fixed top-0 left-0">
      <div className="flex items-center justify-between h-full px-4">
        <h1 className="text-xl font-bold">Whether Prec</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/FavoritePage"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Favorite
              </Link>
            </li>
            <li>
              <Link
                href="https://github.com/kirdzaza"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Nav;
