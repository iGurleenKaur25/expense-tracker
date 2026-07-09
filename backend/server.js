require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // in case you switch to Vite later
  process.env.CLIENT_URL,  // your deployed frontend URL, set this on Render/Railway
];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow requests with no origin (Postman, curl, server-to-server)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }
//       return callback(new Error("Not allowed by CORS: " + origin));
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isLocalhost = origin === "http://localhost:3000" || origin === "http://localhost:5173";
      const isVercelPreview = /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isLocalhost || isVercelPreview) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expense');
const loanRoutes = require('./routes/loan');
const paymentRoutes = require('./routes/payment');
const incomeRoutes = require('./routes/incomeRoutes');           // NEW
const notificationRoutes = require('./routes/notificationRoutes'); // NEW
// const advisorRoutes = require('./routes/advisor');          // NEW

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/income', incomeRoutes);                       // NEW
app.use('/api/notifications', notificationRoutes);          // NEW
// app.use('/api/advisor', advisorRoutes);                     // NEW

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log("mongoose connected"))
  .catch((err) => console.log("Connection failed:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server at ${PORT}`));