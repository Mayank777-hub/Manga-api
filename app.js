const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 3900
const products_routes = require("./routers/products")
const deco_routes = require("./routers/Decoratives")
const food_routes = require("./routers/Food")
const mongoose = require("mongoose");
const Manga = require("./models/schema");
const deco = require("./models/Decoratives");  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVVXNlcmlkIjoiMzZmYTQxOGItZDYzOC00NTIzLTljMDUtOGUxMWQzMmFlNzc2IiwiZW1haWwiOiJtYW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJtYW4xNDA0IiwiaWF0IjoxNzY3NDIwOTgzLCJleHAiOjE3NzAwMTI5ODN9.sxlUFvKZV4TCuMWcXbY9wHcBVvt37qPrdW_0AMpUoZA
const cutefood = require("./models/Food")

const e =  path.join(__dirname,"mangatypes");
const d = path.join(__dirname,"Decorativetype");
const food = path.join(__dirname,"foodtypes");
require("dotenv").config();

const foodcat = async () => {
    const files = fs.readdirSync(food);
    for(const file of files){
        if(file.endsWith("json")){
       const filepath= path.join(food,file);
       const raw=fs.readFileSync(filepath);
       const jsondata =JSON.parse(raw);
       for(const entries of jsondata){
        const title = entries.Title;
        const exists = await cutefood.findOne({"Title": title });
if(!exists){
    cutefood.insertMany([entries]);
    console.log(`unique FoodItems ${title} data added successfully`);
}
else{
    console.log(`Fooditems  ${title} data cannot be added due to duplicated issue`);
}
       }
        }
    }
};
const unique = async () => {
    const files = fs.readdirSync(e);
    for(const file of files) {
        if(file.endsWith("json")){
       const filepath= path.join(e,file);
       const raw=fs.readFileSync(filepath);
       const jsondata =JSON.parse(raw) ;
    for(const entries of  jsondata){
    const title = entries.Type[0]?.Title;
    const exists = await Manga.findOne({"Type.Title": title });
if(!exists){
    Manga.insertMany([entries]);
    console.log(`unique Manga ${title} data added successfully`);
}
else{
    console.log(`Manga ${title} data cannot be added due to duplicated issue`);
}
    }
    
}
    }
};

const decorates = async () => {
    const files = fs.readdirSync(d);

    for (const file of files) {
        if (file.endsWith("json")) {

            const filepath = path.join(d, file);
            const raw = fs.readFileSync(filepath);
            const jsondata = JSON.parse(raw);

            for (const entry of jsondata) {

                const title = entry.Title;
                const exists = await deco.findOne({ Title: title });

                if (!exists) {
                    await deco.insertMany([entry]);
                    console.log(`Decorative item '${title}' added successfully`);
                } else {
                    console.log(`Duplicate - Decorative '${title}' skipped`);
                }
            }
        }
    }
};

// app.use((req, res, next) => {
//    console.log('=== REQUEST DEBUG ===');
//    console.log('Method:', req.method);
//    console.log('URL:', req.url);
//    console.log('Headers:', req.headers);
//    console.log('Body:', req.body);
//    console.log('Content-Type:', req.get('Content-Type'));
//    console.log('===================');
//    next();
//});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({
  origin: ["http://127.0.0.1:3000", "http://localhost:3000",'http://localhost:5173'],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials:true
}));

//app.get("/test-error", (req, res) => {
//    res.send(`
//      <html>
//        <body style="text-align:center;">
//          <h2>Oops! Something went wrong.</h2>
//          <img src="/2.png" style="width:300px; border-radius:10px;" />
//        </body>
//      </html>
//    `);
//});

//app.use("/uploads",express.static("public"));
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use(express.static("public"));
//app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", products_routes);
app.use("/decoratives",deco_routes);
app.use("/Fooditems",food_routes);
const start = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/MangaDB");
        console.log("MongoDB Connected!");
        await unique();
        await decorates();
        await foodcat();
        app.listen(port,
            () => {
                console.log(`Server listen on port ${port}`);
            });
    }
    catch (error) {
        console.log("Failed to connect Mongodb",error);
    }
};

 app.get("/", async (req, res) => {
    try {
   // await Manga.insertMany(all);
    res.send("Multiple manga  Data added Successfully!!!")
}
 catch(error){
    console.error("Insert error:", error);
    res.status(500).send("Error adding manga data");
}
});

start()
//const { createServer } = require('node:http');
//
//const hostname = '127.0.0.1';
//const port = 3400;
//
//const server = createServer((req, res) => {
//  res.statusCode = 200;
//  res.setHeader('Content-Type', 'text/plain');
//  res.end('Hello World');
//});
//
//server.listen(port, hostname, () => {
//  console.log(`Server running at http://${hostname}:${port}/`);
//});
