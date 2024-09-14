// src/app/createPage.js

export default function createPage(lat, lon) {
  fetch("http://localhost:3000/api/createPage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      latitude: lat,
      longitude: lon,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      // Handle the response, e.g., update the UI
    })
    .catch((error) => {
      console.error("Error creating page:", error);
    });
}
