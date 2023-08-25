
const mongoose = require('mongoose')
const colors = require('colors')

const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to mongoDb Database ${mongoose.connection.host}`.bgMagenta.white);

    }catch(error){
        console.log("MongoDb Connection Error".bgRed.white);
    }
}

module.exports = connectDb;