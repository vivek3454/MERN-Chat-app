# MERN-CHAT

🚀 A simple chating app.

![MERN-CHAT](https://res.cloudinary.com/dtoeixvno/image/upload/v1697532482/r11j7z5spzu8b4aezx8t.png)

## Features

- 💡 **User Authentication**: Sign up, log in, logout.
- 🙋 **User Profile**: View profile.
- 🙋 **Chat**:  Chat in real time, delete chat, send photos, indicator for live users.

## Demo

![Demo](https://mern-chat-app-puce.vercel.app/)

---

## API Endpoints

### User Routes

- `POST /register`: Register a new user.
- `POST /login`: Log in a user.
- `GET /logout`: Log out a user.
- `GET /profile`: Getting user profile info.
- `GET /allusers`: Getting all users.

### Message Routes

- `DELETE /:messageId`: Delete a selected user message.
- `GET /:userId`: Get selected users messages.

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB
- Cors
- bcrypt
- Jsonwebtoken
- Dotenv
- ws
- Cookie-Parser

### Frontend

- React
- Tailwind & CSS
- React-Icons
- React-Router
- React-Toastify
- React-Redux
- Redux Toolkit

---

## Setup Guide

Follow these steps to set up the project on your local machine:

1. Clone the repository:
   ```
   git clone https://github.com/vivek3454/mern-chat-app.git
   cd mern-chat-app
   ```

2. Set up the backend:
   - Navigate to the `server` folder: `cd server`
   - Install dependencies: `npm install`
   - Set up environment variables: Create a `.env` file based on `.env.example.js` file.
   - Start the backend server: `npm start`

3. Set up the frontend:
   - Navigate to the client folder: `cd client`
   - Install dependencies: `npm install`
   - Set up environment variables: Create a `.env` file based on `.env.example.js` file.
   - Start the client server: `npm run dev`

4. Access the application:
   - Open your browser and visit: `http://localhost:5173`