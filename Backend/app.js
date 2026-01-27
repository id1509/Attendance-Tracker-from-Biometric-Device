const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");
const userRouter = require("./routes/userRouter");
const db = require("./config/mongooseConnection");

const flash = require("connect-flash");
const cors = require("cors");
require("dotenv").config();

// Import Supabase client
const supabase = require("./supabaseClient");

// CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(flash());

// Routes
app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("Backend running at http://localhost:3000");
});