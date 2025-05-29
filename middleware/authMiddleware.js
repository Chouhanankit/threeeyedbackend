const asyncHandler = require("express-async-handler");
const User = require('../models/userModels')
const jwt = require('jsonwebtoken')


const protect = asyncHandler(async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        try {

            // GET TOKEN FROM REQUEST
            token = req.headers.authorization.split(" ")[1];

            // VERFIY TOKEN
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // GET USER FROM DB USING TOKEN BY ID
            req.user = await User.findById(decoded.id).select("-password")
            next();

        } catch (error) {
            res.status(401)
            throw new Error("Not Authorization || Invalid Token")
        }
    } else {
        res.status(401)
        throw new Error("Not Authorization || Not Found Token")
    }


})

module.exports = { protect }