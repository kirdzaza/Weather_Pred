
  <h3 align="center">Weather_Pred</h3>

 


<details>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![weather_prec](https://github.com/user-attachments/assets/e17eed65-288c-4b6d-8f84-ba01ac3687c1)


This project is designed to predict **Weather** and **Air Quality Index (AQI)** using stored **latitude** and **longitude** data. It leverages **Node.js**, **Next.js**, **Tailwind CSS**, and **MongoDB** to provide accurate, real-time predictions by integrating with external APIs.

### 🔑 Key Features:
- **Geolocation Data Storage**: Saves user-provided latitude and longitude coordinates in a MongoDB database.
- **API Integration**: Fetches real-time weather and AQI data from a third-party API based on stored coordinates.
- **Responsive UI**: Frontend styled with **Tailwind CSS** for a seamless and modern user experience.
- **Backend Powered by Node.js**: Handles requests and serves data using **Next.js** API routes.

### 💡 Use Cases:
- Display up-to-date weather conditions and AQI for specific geographic locations.
- Store and manage location coordinates for future weather and AQI predictions.

### 🛠️ Technologies Used:
- **Node.js** for backend development.
- **Next.js** for server-side rendering and API routes.
- **Tailwind CSS** for modern, responsive UI design.
- **MongoDB** for data storage and management.




### Built With


* [![Next][Next.js]][Next-url]
* [![Node.js][Node.js.com]][Node.js-url]
* [![TailwindCSS][TailwindCSS.com]][TailwindCSS-url]






### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key at [https://openweathermap.org/api](https://openweathermap.org/api)
2. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
3. Install NPM packages
   ```sh
   npm install i
   ```
4. Install Mongoose
   ```
   npm install mongoose
   ```
5. Enter your API in `.env file`
   ```
   NEXT_PUBLIC_WEATHER_API_KEY = 'ENTER YOUR API';
   MONGODB_URI = 'ENTER YOUR DATABASE URI'
   ```







<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[TailwindCSS.com]: https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[Node.js.com]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node.js-url]: https://nodejs.org/
