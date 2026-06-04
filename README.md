# CardKeeper

**CardKeeper** is a full-stack web app that helps users store and manage their warranty cards. Warranty cards often get lost or forgotten — CardKeeper ensures you always have them backed up with images, expiration tracking, and email alerts.

---

## Features

-  **Warranty Card Management** – Add, view, edit, or delete warranty cards with metadata like brand, category, purchase price, etc.
-  **Image Uploads** – Upload and view scanned copies or pictures of your warranty cards (stored securely on AWS S3).
-  **Expiration Reminders** – Email alerts before your warranties expire.
-  **Remaining Days Tracker** – Know how many days are left on your warranties at a glance.
-  **Organized Storage** – Group cards by category or store for easy access.
-  **User Authentication** – Secure login and register system using JWT.

---

##  Tech Stack

###  Core Stack:
- **PostgreSQL** – Relational database to store warranty card data.
- **NestJS** – Progressive Node.js framework for building efficient and scalable server-side applications.
- **React.js** – Frontend framework for building user interfaces (Vite).
- **Node.js** – Runtime environment for the backend.

###  Other Libraries & Tools:
- **Prisma** – Next-generation ORM for Node.js and TypeScript.
- **AWS S3** – Cloud object storage for handling image uploads.
- **Nodemailer** – Sending email notifications.
- **JWT** – Secure authentication tokens.
- **bcrypt** – Password hashing.

---

##  Prerequisites

Before running the project, make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local instance or MongoDB Atlas cluster)

---

##  Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd CardKeeper
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

---

##  Environment Variables Configuration

### Server Environment Variables
Create a `.env` file in the **`server`** directory and add the following configuration:

```env
PORT=3000
DATABASE_URL=
TOKEN_SECRET=
EMAIL=
EMAIL_PASSWORD=
FRONT_END_HOSTED=
FRONT_END_LOCAL=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
```

### Client Environment Variables
Create a `.env` file in the **`client`** directory and add the following configuration:

```env
VITE_BACKEND_HOSTED=
VITE_BACKEND_LOCAL=
VITE_S3_BASE_URL=
```

> **Usage Notes:**
> 1. Never commit actual secrets to version control.
> 2. Ensure your `.env` files are added to your `.gitignore` in both client and server directories.

---

##  Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend client:**
   In a separate terminal, run:
   ```bash
   cd client
   npm run dev
   ```

Your app will be running! By default, the client is usually accessible at `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA), depending on your frontend setup.
