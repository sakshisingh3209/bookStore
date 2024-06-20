const mongoose = require('mongoose');


const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to Mongodb Database ${mongoose.connection.host}`)
    } catch (err) {
        console.log(`MongoDb Error ${err}`);
    }
}

module.exports = connectDB;