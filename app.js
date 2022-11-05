const express = require('express');


// const connectToDb = require("./db/mongodb")

// Configs
require('dotenv').config();
const PORT = process.env.PORT || 8000;

// Routers
const userRouter = require("./routes/user.routes")
const blogRouter =  require("./routes/blog.routes")


// server initialization
const app = express();


// MongoDb Database Connection
// connectToMongoDB();


// Middlewares
app.use(express.json());


// Route(s) and Routers
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/blogs", blogRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the Blogging API");
})

//Error handler middleware
app.use((err, req, res, next) => {
    console.log(err);
    const errorStatus = err.status || 500;
    res.status(errorStatus).send(err.message);
    next();
});

// server listener
app.listen(PORT, () => {
    console.log(`Server successfully started at PORT: ${PORT}...`);
});