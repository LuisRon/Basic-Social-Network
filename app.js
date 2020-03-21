const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//db
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true})
.then(()=> console.log("Db connected"));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
})

//routes
const postRoutes = require("./routes/post");

//middleware
app.use(morgan("dev"));

app.use("/", postRoutes);

const port = process.env.PORT || 8080;
app.listen(port, ()=> {console.log(`A Node Js API is listening on port: ${port}`)});