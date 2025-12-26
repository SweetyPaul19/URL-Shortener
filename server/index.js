require('dotenv').config();
const ConnectDB = require('./db/dbconnect');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors=require('cors');
const router = require('./routes/route');


//Creating express app
const app = express();
const PORT = 8000;

// Middleware

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/", router);


// Connect DB and start server
const startServer = async () => {
  await ConnectDB(); // Wait for DB connection
  app.listen(PORT, () => console.log(`Server running at ${PORT}`));
};

startServer();