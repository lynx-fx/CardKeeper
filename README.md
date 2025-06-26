# 🧾 CardKeeper

**CardKeeper** is a full-stack MERN (MongoDB, Express, React, Node.js) web app that helps users store and manage their warranty cards. Warranty cards often get lost or forgotten — CardKeeper ensures you always have them backed up with images, expiration tracking, and email alerts.

---

## 🚀 Features

- 📦 **Warranty Card Management** – Add, view, edit, or delete warranty cards with metadata like brand, category, purchase price, etc.
- 🖼️ **Image Uploads** – Upload and view scanned copies or pictures of your warranty cards.
- ⏰ **Expiration Reminders** – Email alerts before your warranties expire.
- 📅 **Remaining Days Tracker** – Know how many days are left on your warranties at a glance.
- 📂 **Organized Storage** – Group cards by category or store for easy access.
- 🔐 **User Authentication** – Secure login and register system using JWT.

---

## 🛠️ Tech Stack

### 🧩 MERN Stack:
- **MongoDB** – NoSQL database to store warranty card data.
- **Express.js** – Backend framework for routing and middleware.
- **React.js** – Frontend framework for building user interfaces.
- **Node.js** – Runtime environment for the backend.

### 🔧 Other Libraries & Tools:
- **Mongoose** – MongoDB ODM for schema and database interactions.
- **Multer** – File/image uploads handling.
- **Nodemailer** – Sending email notifications.
- **JWT** – Secure authentication tokens.
- **Joi** – Input validation.
- **dotenv** – Environment configuration.
- **bcrypt** – Password hashing.

---

# Environment Variables Configuration

```bash
    PORT=
    MONGODB_URI=
    HMAC_CODE=
    TOKEN_SECRET=
    EMAIL=
    EMAIL_PASSWORD=
```

## Usage Notes
1. Never commit actual secrets to version control
2. Keep this file in your project's root directory and add it to your `.gitignore`
