const express = require('express');
const passport = require('passport');

const { PORT } = require('./configs/config')
const { connectToMongoDb } = require("./db/mongodb")


// Routers
const userRouter = require("./routes/user.routes")
const blogRouter =  require("./routes/blog.routes")


// server initialization
const app = express();


// MongoDb Database Connection
connectToMongoDb();


// Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use(passport.initialize());
require('./configs/passport');


// Route(s) and Routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the Blogging API");
})

// Error handler middleware
app.use((err, req, res, next) => {
    console.log(err.status, err);
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Internal server error.";
    res.status(errorStatus).send({
        message: errorMessage,
        data: null
    });
    next();
});

// server listener
app.listen(PORT, () => {
    console.log(`Server successfully started at PORT: ${PORT}...`);
});