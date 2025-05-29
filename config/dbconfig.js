const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`DB CONNECTION IS SUCCESSFULL ${conn.connection.host}`)
    } catch (error) {
        console.log("DB CONNECTION FAILED !!")
    }
} 

module.exports = { connectDB }