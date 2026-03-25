# 🌴 Tourix — South India Tourism Platform

A full-stack tourism and booking web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Explore the enchanting beauty of South India — from Kerala's backwaters to Tamil Nadu's temples, Karnataka's heritage to Goa's beaches.

> **All prices in Indian Rupees (₹)** | **28+ South Indian Destinations** | **South Indian Cultural Theme**

---

## ✨ Features

### 🏠 Pages
- **Home Page** — Hero section with search, stats, explore by experience, featured destinations, "Why South India" section, and CTA
- **Destinations Page** — Grid layout with search, category/state filters, sorting, and pagination
- **Destination Details** — Image gallery, interactive map (Leaflet), reviews & ratings, highlights, inclusions, booking sidebar
- **Login & Signup** — Secure JWT authentication with form validation
- **Booking Page** — Date picker, traveller count, price summary, instant confirmation
- **My Bookings** — Dashboard showing all bookings with cancel functionality

### ⚡ Core Functionality
- 🔍 Search destinations by name, location, or state
- 🏷️ Filter by category (Beach, Temple, Heritage, etc.) and state
- 📊 Sort by price, rating, or newest
- 📖 View detailed destination info with image gallery & map
- 👤 User registration and JWT-based authentication
- 🎫 Book trips with date, people count, and contact details
- ⭐ Write and read reviews for destinations
- ❌ Cancel bookings with instant status updates
- 📱 Fully responsive design

### 🎨 Design
- South India cultural color palette (Kerala green, temple gold, accent red)
- Dark mode with glassmorphism effects
- Smooth animations and micro-interactions
- `Playfair Display` + `Outfit` typography
- Custom scrollbar and loading states

---

## 🏗️ Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 18, Vite, React Router v6     |
| Styling    | Vanilla CSS (custom design system)  |
| State      | React Context API                   |
| HTTP       | Axios                               |
| Maps       | Leaflet.js + React-Leaflet          |
| Icons      | React Icons (Feather)               |
| Toasts     | React Hot Toast                     |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB + Mongoose                  |
| Auth       | JWT (jsonwebtoken) + bcryptjs       |
| Validation | Express Validator                   |

---

## 📁 Project Structure

```
Tourix/
├── backend/
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── destinationController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Destination.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── destinationRoutes.js
│   │   └── reviewRoutes.js
│   ├── seed/
│   │   ├── destinations.js  # 28 South Indian destinations
│   │   └── seeder.js        # Database seeder script
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DestinationCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── DestinationsPage.jsx
│   │   │   ├── DestinationDetailPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   └── MyBookingsPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── Navbar.css
│   │   ├── index.css        # Global design system
│   │   ├── main.jsx
│   │   └── App.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Setup & Run Instructions

### Prerequisites
- **Node.js** (v18 or later)
- **MongoDB** (local or MongoDB Atlas)
- **npm** (comes with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Tourix.git
cd Tourix
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Edit `.env` and set your MongoDB URI:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/tourix
JWT_SECRET=your_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

Seed the database with 28 destinations:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

The API will run at `http://localhost:5000`

### 3. Setup Frontend
Open a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`

### 4. Open in Browser
Visit **http://localhost:5173** and explore South India! 🌴

---

## 📡 API Endpoints

### Auth
| Method | Endpoint               | Description              | Auth |
| ------ | ---------------------- | ------------------------ | ---- |
| POST   | `/api/auth/register`   | Register new user        | ❌   |
| POST   | `/api/auth/login`      | Login & get token        | ❌   |
| GET    | `/api/auth/me`         | Get current user profile | ✅   |
| PUT    | `/api/auth/me`         | Update user profile      | ✅   |

### Destinations
| Method | Endpoint                      | Description               | Auth |
| ------ | ----------------------------- | ------------------------- | ---- |
| GET    | `/api/destinations`           | Get all (search, filter)  | ❌   |
| GET    | `/api/destinations/:id`       | Get single destination    | ❌   |
| GET    | `/api/destinations/categories`| Get all categories        | ❌   |
| GET    | `/api/destinations/states`    | Get all states            | ❌   |

### Bookings
| Method | Endpoint                    | Description          | Auth |
| ------ | --------------------------- | -------------------- | ---- |
| POST   | `/api/bookings`             | Create booking       | ✅   |
| GET    | `/api/bookings/my`          | Get user's bookings  | ✅   |
| GET    | `/api/bookings/:id`         | Get single booking   | ✅   |
| PUT    | `/api/bookings/:id/cancel`  | Cancel booking       | ✅   |

### Reviews
| Method | Endpoint                         | Description           | Auth |
| ------ | -------------------------------- | --------------------- | ---- |
| GET    | `/api/reviews/:destinationId`    | Get destination reviews | ❌ |
| POST   | `/api/reviews/:destinationId`    | Create review          | ✅  |
| DELETE | `/api/reviews/:id`               | Delete review          | ✅  |

---

## 🗺️ Destinations Covered

| State            | Destinations                                                           |
| ---------------- | ---------------------------------------------------------------------- |
| **Kerala**       | Alleppey, Munnar, Fort Kochi, Wayanad, Varkala, Thekkady, Kovalam, Athirappilly, Kumarakom, Bekal, Vagamon, Thrissur, Silent Valley |
| **Tamil Nadu**   | Meenakshi Temple, Ooty, Mahabalipuram, Kodaikanal, Rameswaram         |
| **Karnataka**    | Hampi, Coorg, Mysore, Gokarna                                         |
| **Andhra Pradesh** | Tirupati, Araku Valley                                               |
| **Telangana**    | Hyderabad Heritage                                                     |
| **Puducherry**   | French Quarter                                                         |
| **Goa**          | North Goa Beaches                                                      |

---

## 📝 License

This project is licensed under the MIT License.

---

Built with 💚 for South India tourism.
