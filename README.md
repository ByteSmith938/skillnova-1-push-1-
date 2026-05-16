# SkillNova 🚀

SkillNova is a full-stack workshop management platform designed to streamline student registrations, workshop administration, payment verification, and team communication.

It enables students to discover workshops, register quickly through QR-based access, and upload payment proof, while administrators can manage registrations, approve payments, monitor analytics, and collaborate through internal team channels.

---

## 🌐 Live Demo

Frontend: https://your-vercel-url.vercel.app  
Backend API: https://your-render-url.onrender.com

---

## 📌 Features

### Student Features
- Browse available workshops
- View workshop details
- QR-based workshop access
- Register for workshops
- Upload payment screenshot
- Receive registration confirmation

### Admin Features
- Secure admin authentication
- Workshop creation and management
- View enrolled students
- Approve / reject payments
- View payment screenshots
- Edit student details
- Registration analytics dashboard
- Internal admin team chat

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- React Router DOM
- Fetch API

### Backend
- Node.js
- Express.js
- REST API Architecture

### Database
- MongoDB Atlas
- Mongoose ODM

### Authentication & Security
- JWT Authentication
- bcrypt password hashing
- Protected admin routes
- CORS configuration
- Environment variables (.env)

### Cloud Services
- Cloudinary (payment screenshot storage)
- MongoDB Atlas (cloud database)

### Deployment
- Vercel (frontend hosting)
- Render (backend hosting)

### Version Control
- Git
- GitHub

---

## 🏗 System Architecture

```text
Student/Admin Browser
        ↓
Frontend (React + Vite)
        ↓
HTTPS API Requests
        ↓
Backend (Node.js + Express)
        ↓
 ┌────────────────────┬────────────────────┐
 ↓                    ↓
MongoDB Atlas         Cloudinary
(Database)            (Image Storage)
```

---

## 🔄 Application Flow

### Student Registration Flow

```text
Student scans QR code
→ Opens workshop page
→ React frontend loads workshop data
→ Student fills registration form
→ Uploads payment screenshot
→ Backend receives request
→ Screenshot uploaded to Cloudinary
→ Cloudinary returns image URL
→ Student details saved in MongoDB
→ Success response shown
```

---

### Admin Login Flow

```text
Admin enters credentials
→ Frontend sends POST request
→ Backend validates admin
→ Password checked with bcrypt
→ JWT token generated
→ Token returned to frontend
→ Dashboard access granted
```

---

### Payment Approval Flow

```text
Admin dashboard loads students
→ Admin reviews screenshot
→ Clicks Approve / Reject
→ Backend updates payment status
→ MongoDB document updated
→ UI refreshes instantly
```

---

## 📂 Project Structure

```bash
skillnova/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙ Environment Variables

### Frontend (.env)

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

---

### Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 Installation & Setup

### Clone Repository

```bash
git clone https://github.com/your-username/skillnova.git
cd skillnova
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

or

```bash
node server.js
```

Backend runs on:

```bash
http://localhost:5000
```

---

## API Endpoints

### Public Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /workshops/public | Fetch workshops |
| GET | /workshops/public/:id | Fetch workshop details |
| POST | /register | Student registration |

---

### Admin Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /admin/login | Admin login |
| GET | /students | Fetch all students |
| GET | /students/:id | Fetch student details |
| PUT | /students/:id | Update student |
| DELETE | /students/:id | Delete student |
| PUT | /students/:id/payment-status | Update payment status |

---

### Chat Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /chat/channels | Fetch channels |
| GET | /chat/messages | Fetch messages |
| POST | /chat/messages | Send message |

---

## Security Features

- JWT-based admin authentication
- bcrypt password hashing
- Protected admin-only endpoints
- CORS restrictions
- Environment variable secret management
- Backend validation for sensitive actions

---

## Future Improvements

- Email confirmations
- Payment gateway integration
- Role-based access control
- Real-time chat using Socket.IO
- Workshop seat limits
- Search & filtering
- Admin audit logs
- Docker deployment
- CI/CD pipeline

---

## Screenshots

_Add screenshots here_

Example:

- Homepage
- Workshop details
- Registration form
- Admin dashboard
- Student details page
- Analytics dashboard

---

## Learning Outcomes

This project helped build practical experience in:

- Full-stack MERN development
- REST API design
- Authentication systems
- MongoDB schema design
- Cloud file storage
- Frontend-backend integration
- Deployment workflows
- Debugging production issues
- Environment variable management

---

## Author

**Pranit Kumar**

GitHub: https://github.com/your-username

---

## License

This project is for educational and portfolio purposes.
