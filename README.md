> **Read this entire file before starting setup.** It walks you through tools to install, services to run (including the database), and where every secret belongs.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-007396?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![JWT](https://img.shields.io/badge/JWT-Spring%20Security-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

# Guide Touristique

A full-stack travel guide web application: search destinations, see photos and weather, read short descriptions, find restaurants and hotels (including maps), and sign in with JWT-backed accounts.

## 📑 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [Clone the repo](#1-clone-the-repo)
  - [Backend setup](#2-backend-setup)
  - [Frontend setup](#3-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Keys](#-api-keys)
- [Running the project](#-running-the-project)
- [Available Scripts](#-available-scripts)
- [Team](#-team)

## 📖 About

**Guide Touristique** is a monorepo-style project with a **React** (Create React App) client and a **Spring Boot** API. The backend secures routes with **Spring Security** and **JWT**, talks to external travel/geo providers through **Spring WebClient** (WebFlux), and persists users and roles in **MongoDB**.

## ✨ Features

| Area | What you can do |
|------|------------------|
| **Search** | Search for a city or country from the home experience |
| **Photos** | View **Unsplash** images for the location |
| **Weather** | View a **7-day forecast** via **Open-Meteo** (no API key on the frontend) |
| **Context** | Read a **Wikipedia**-based description of the place |
| **Restaurants** | Find restaurants (backend uses **Geoapify**; UI can show lists and map-related flows depending on the page) |
| **Hotels** | Browse and search hotels and open **LiteAPI**-backed hotel details, with **Leaflet / React-Leaflet** maps on detail views |
| **Auth** | **Register** and **login**; JWT is stored and sent on API requests |

## 🧰 Tech Stack

| Layer | Technology |
|--------|------------|
| **Frontend** | React (Create React App), React Router DOM, Axios, Leaflet, React-Leaflet, MUI (login/register UI) |
| **Backend** | Spring Boot 3.x, Spring Security (JWT), Spring Web (`spring-boot-starter-web`), Spring WebFlux / WebClient (`spring-boot-starter-webflux`) |
| **Database** | **MongoDB** (Spring Data MongoDB — not JDBC/`spring.datasource`) |
| **Build (backend)** | Maven |
| **Build (frontend)** | npm, `react-scripts` |

## 🗂️ Project Structure

Repository root contains the frontend and backend folders below (names match this repo).

```text
projet_guide_touristique/
├── guide_touristique_frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── package.json
│   └── src/
│       ├── api/
│       │   ├── AxiosInstance.js
│       │   ├── countryService.js
│       │   ├── externalClients.js
│       │   ├── index.js
│       │   ├── liteApiApi.js
│       │   ├── locationService.js
│       │   ├── placesService.js
│       │   ├── unsplashService.js
│       │   ├── weatherService.js
│       │   ├── wikipediaApi.js
│       │   └── wikipediaService.js
│       ├── components/
│       │   ├── Footer.jsx
│       │   └── Navbar.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── hooks/
│       │   ├── useLiteApi.js
│       │   ├── useUnsplash.js
│       │   └── useWikipedia.js
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── HomePage.jsx
│       │   ├── HotelDetailPage.jsx
│       │   ├── Hotels.jsx
│       │   ├── HotelsPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   └── RestaurantsPage.jsx
│       ├── service/
│       │   └── authService.js
│       ├── App.jsx
│       ├── App.css
│       ├── App.test.js
│       ├── index.css
│       ├── index.js
│       ├── reportWebVitals.js
│       └── setupTests.js
│
└── guideTouristique/
    ├── mvnw
    ├── mvnw.cmd
    ├── pom.xml
    └── src/main/
        ├── java/com/saad/guideTouristique/
        │   ├── GuideTouristiqueApplication.java
        │   ├── config/
        │   │   └── WebClientConfig.java
        │   ├── controllers/
        │   │   ├── AuthController.java
        │   │   ├── HomeController.java
        │   │   ├── LiteApiController.java
        │   │   ├── PlacesController.java
        │   │   └── TestController.java
        │   ├── models/
        │   │   ├── ERole.java
        │   │   ├── Role.java
        │   │   └── User.java
        │   ├── payload/
        │   │   ├── request/
        │   │   │   ├── LoginRequest.java
        │   │   │   └── SignupRequest.java
        │   │   └── response/
        │   │       ├── HotelDetailDTO.java
        │   │       ├── HotelSummaryDTO.java
        │   │       ├── JwtResponse.java
        │   │       ├── MessageResponse.java
        │   │       └── PlaceDTO.java
        │   ├── repository/
        │   │   ├── RoleRepository.java
        │   │   └── UserRepository.java
        │   ├── security/
        │   │   ├── WebSecurityConfig.java
        │   │   ├── jwt/
        │   │   │   ├── AuthEntryPointJwt.java
        │   │   │   ├── AuthTokenFilter.java
        │   │   │   └── JwtUtils.java
        │   │   └── services/
        │   │       ├── UserDetailsImpl.java
        │   │       └── UserDetailsServiceImpl.java
        │   └── services/
        │       ├── GeoapifyService.java
        │       └── LiteApiService.java
        └── resources/
            └── application.properties
```

## ✅ Prerequisites

Install the following before you run anything:

| Tool | Minimum / project expectation | Notes |
|------|------------------------------|--------|
| **Node.js** | **18.x or newer** (recommended for current React tooling) | Use LTS if unsure |
| **npm** | Comes with Node | Version **9+** typical with Node 18+ |
| **Java JDK** | **17** | Matches `java.version` in `pom.xml` |
| **Maven** | **3.8+** | Or use the included **`mvnw` / `mvnw.cmd`** wrapper |
| **Git** | Recent stable | Any version that supports your hosting platform |
| **MongoDB** | **Running instance reachable at `localhost:27017`** | Required by `application.properties` defaults |

> **MongoDB:** The backend uses **Spring Data MongoDB**, not SQL. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) (or run Mongo in Docker) and ensure it listens on the host/port you configure.

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone [TODO: fill this in — your GitHub repository URL]
cd [TODO: fill this in — your project folder name]
```

### 2. Backend setup

1. **Start MongoDB** on your machine (default in this project: `localhost:27017`).

2. Open the backend folder:

   ```bash
   cd guideTouristique
   ```

3. **Edit** `src/main/resources/application.properties` and set every property your team needs. The project currently expects **MongoDB** and **JWT** settings plus third-party keys (see [Environment Variables](#-environment-variables)).

   > **Warning:** Never commit real API keys or JWT secrets. Replace any sample values before pushing, and add `application.properties` to `.gitignore` if you switch to a local, untracked copy.

4. **Run** the Spring Boot application with Maven:

   ```bash
   mvn spring-boot:run
   ```

   On Windows, you can use the wrapper instead:

   ```bash
   mvnw.cmd spring-boot:run
   ```

   The API is served at **`http://localhost:8080`** (context paths may add `/api` on the frontend — see `AxiosInstance.js`).

### 3. Frontend setup

1. Open the frontend folder:

   ```bash
   cd guide_touristique_frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a **`.env`** file in `guide_touristique_frontend/` (same folder as `package.json`). See [Environment Variables](#-environment-variables).

   > **Warning:** Do **not** commit `.env`. Keep it only on your machine or in a secure secrets manager.

4. Start the dev server:

   ```bash
   npm start
   ```

## 🔐 Environment Variables

### Backend — `guideTouristique/src/main/resources/application.properties`

This project uses **MongoDB** and custom JWT property names (not `jwt.secret` / `jwt.expiration`). Copy this checklist and fill in your own values:

```properties
# Application
spring.application.name=guideTouristique

# MongoDB
spring.data.mongodb.database=guideTouristique_db
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017

# JWT (names used by JwtUtils / security config)
saad.app.jwtSecret=[TODO: Base64-encoded secret suitable for HS256 — generate a new one]
saad.app.jwtExpirationMs=86400000

# Third-party APIs (backend)
geoapify.api.key=[TODO: your Geoapify key]
liteapi.key=[TODO: your LiteAPI key]
```

> **Note:** If your checked-in `application.properties` contains a typo on the first line (for example a stray prefix before `spring.application.name`), fix it so the key is exactly `spring.application.name`.

The following are **not used** in this repository (no `spring-boot-starter-jdbc` / JPA datasource):

```properties
# Not applicable — project uses MongoDB, not spring.datasource.*
# spring.datasource.url=
# spring.datasource.username=
# spring.datasource.password=
```

### Frontend — `guide_touristique_frontend/.env`

```bash
REACT_APP_UNSPLASH_KEY=[TODO: your Unsplash Access Key]
# Optional / documentation: backend API origin (see note below)
REACT_APP_API_URL=http://localhost:8080
```

> **Note:** In the current codebase, the Axios client uses a **hardcoded** `baseURL` in `src/api/AxiosInstance.js` (`http://localhost:8080/api`). Only **`REACT_APP_UNSPLASH_KEY`** is read in `src/api/externalClients.js`. To use `REACT_APP_API_URL`, update `AxiosInstance.js` to build `baseURL` from `process.env` (for example ``${process.env.REACT_APP_API_URL}/api``).

Other public APIs used from the browser (**Open-Meteo**, **Nominatim**, **Wikipedia**) do not require keys in `.env` for the flows implemented here.

## 🔑 API Keys

| API | Sign up | Put the secret in… | Variable / property name |
|-----|---------|--------------------|---------------------------|
| **Geoapify** | [https://www.geoapify.com/](https://www.geoapify.com/) (Geoapify dashboard) | `guideTouristique/src/main/resources/application.properties` | `geoapify.api.key` |
| **LiteAPI** | [https://app.liteapi.travel/](https://app.liteapi.travel/) | `guideTouristique/src/main/resources/application.properties` | `liteapi.key` |
| **Unsplash** | [https://unsplash.com/developers](https://unsplash.com/developers) | `guide_touristique_frontend/.env` | `REACT_APP_UNSPLASH_KEY` |

> **Security:** Rotate any key that was ever committed to Git. Treat `saad.app.jwtSecret` like a password.

## ▶️ Running the project

You need **both** processes running at the same time during development:

| Service | URL | Command | Working directory |
|---------|-----|---------|-------------------|
| **Backend (Spring Boot)** | `http://localhost:8080` | `mvn spring-boot:run` (or `mvnw.cmd spring-boot:run` on Windows) | `guideTouristique/` |
| **Frontend (React)** | `http://localhost:3000` | `npm start` | `guide_touristique_frontend/` |

Open **`http://localhost:3000`** in the browser. The UI calls the API under **`http://localhost:8080/api`** (per `AxiosInstance.js`).

## 📜 Available Scripts

### Frontend (`guide_touristique_frontend/`)

| Script | Command | Purpose |
|--------|---------|---------|
| Start dev server | `npm start` | Runs CRA dev server (hot reload) |
| Production build | `npm run build` | Optimized build in `build/` |
| Tests | `npm test` | Jest / React Testing Library |
| Eject (irreversible) | `npm run eject` | Ejects CRA configuration |

### Backend (`guideTouristique/`)

| Action | Command |
|--------|---------|
| Run application | `mvn spring-boot:run` |
| Run with wrapper (Windows) | `mvnw.cmd spring-boot:run` |
| Run with wrapper (Unix) | `./mvnw spring-boot:run` |

## 👥 Team

| Member | Role |
|--------|------|
| @username | [TODO: Role] |
| @username | [TODO: Role] |
| @username | [TODO: Role] |

---

*If a section still says `[TODO]`, replace it with your real repository URL, team roster, and any deployment-specific notes.*
