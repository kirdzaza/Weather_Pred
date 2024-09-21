import React from "react";
import Link from "next/link";

function Nav() {
  return (
    <div className="w-full h-16 bg-gray-800 text-white fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <h1 className="text-xl font-bold">Weather Prec</h1>
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
                href="/getWeatherP"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Current Weather Page
              </Link>
            </li>
            <li>
              <Link
                href="/airQualityP"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Air Quality Page
              </Link>
            </li>
            <li>
              <Link
                href="/forecastP"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Forecast Page
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
