require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
  })
);

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expense');
const loanRoutes = require('./routes/loan');
const paymentRoutes = require('./routes/payment');

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/payments', paymentRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("mongoose connected"))
.catch((err)=>console.log(err));


const PORT = process.env.PORT || 5000;
app.listen(PORT , () => console.log(`server at ${PORT}`));