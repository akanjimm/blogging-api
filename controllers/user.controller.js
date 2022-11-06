const userModel = require('../models/users');
const { generateJwtToken } = require('../utils/utils');

function signUp(req, res, next) {
    const userInfo = req.body;

    userModel.create({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        password: userInfo.password
    })
    .then((user) => {
        user.password = undefined;
        res.status(201).send({
            message: "User successfully created",
            data: {
                user
            },
            token: generateJwtToken(user)
        });
    })
    .catch((err) => {
        next(err);
    })
}

function signIn(req, res, next) {
    const signInInfo = req.body;

    // check if email and password are provided
    if (!signInInfo.email || !signInInfo.password) {
        return next(new Error("Email and password are required"))
    }

    userModel.findOne({email: signInInfo.email})
        .then(async (user) => {
            // check if a user object was retrieved from the database
            if (!user) {
                return next(new Error("User doesn't exist"));
            }

            // check if password inputed by password equal to that in the database
            const isPasswordVerified = await user.isPasswordVerified(signInInfo.password);
            if (!isPasswordVerified) {
                return next(new Error("Incorrect password"));
            }

            user.password = undefined;
            res.status(200).send({
                message: "User successfully signed in",
                data: {
                    user
                },
                token: generateJwtToken(user)
            });
        })
        .catch((err) => {
            next(err);
        })
}

module.exports = {
    signUp,
    signIn
}