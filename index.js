const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const app = express();

//---------------------required file------------------------
const connectDB = require("./config/db");
dotenv.config();
//calling database funcation
connectDB();

//Meddelware
app.use(methodOverride('_method'));
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
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
app.get("/join", (req , res)=>{
    res.render("user/join");
})


const PORT= process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`server successful conected on port http://localhost:${PORT}/`);
});