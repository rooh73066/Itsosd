const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const app = express();

//---------------------required file------------------------
const connectDB = require("./config/db");
dotenv.config();
//calling database funcation
connectDB();

//Meddelware
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
if (!process.env.JWT_SECRET) {
    throw new Error("Set JWT_SECRET in the environment before starting the server.");
}
const sessionSecret = process.env.SESSION_SECRET || process.env.JWT_SECRET;
app.use(session({
    name: "itsosd.sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
}));
app.use("/", authRoutes);
app.use("/api/auth", authRoutes);
// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


//routes
app.get("/", (req , res)=>{
    res.render("index");
})
app.get("/services", (req , res)=>{
    res.render("services");
})
app.get("/service" , (req , res)=>{
    res.render("service")
})
app.get("/about", (req , res)=>{
    res.render("about");
})
app.get("/contact", (req , res)=>{
    res.render("contact");
})
app.get("/sigin", (req , res)=>{
    res.render("user/sigin");
})
app.get("/sigup", (req , res)=>{
    res.render("user/signup");
})

const PORT= process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`server successful conected on port http://localhost:${PORT}/`);
});