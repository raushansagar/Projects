import {DB_NAME} from '../constant.js';
import mongoose from 'mongoose';


const connectDB = async () => {
    try{
        const conn = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`Database Connected Sucessfully ${conn.connection.host}`);
    }
    catch(error){
        console.log(`DB Connections Error occures ${error}`);
    }
}

export { connectDB };