// src/app/Home.js
"use client"; // Ensure this file is marked as a Client Component

import React, { useState } from "react";
import api from "./api"; // Import the api function
import "./styles.css"; // Import your custom CSS
import Nav from "./Nav";

export default function Home() {
  const [coordinates, setCoordinates] = useState("");

  const handleSearch = () => {
    const [lat, lon] = coordinates.split(",").map((coord) => coord.trim());
    if (lat && lon) {
      api(lat, lon);
    } else {
      console.error("Invalid input");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-1 flex justify-center items-center p-4">
        <div className="search-container bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-md">
          <label
            htmlFor="inputname"
            className="block text-gray-800 font-semibold text-lg mb-4 text-center"
          >
            Find your weather data with Latitude and Longitude
          </label>
          <input
            type="text"
            id="inputname"
            name="inputname"
            className="block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 text-center"
            placeholder="15,100"
            value={coordinates}
            onChange={(e) => setCoordinates(e.target.value)}
          />
          <label className="block text-blue-500 text-sm mb-4 text-center">
            <a href="https://gist.github.com/metal3d/5b925077e66194551df949de64e910f6#file-country-coord-csv">
              Find
            </a>
          </label>
          <button
            type="button"
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </main>
    </div>
  );
}
