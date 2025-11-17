
import { dbName } from '../constant.js'
import mongoose  from 'mongoose';


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URL}/${dbName}`);
    console.log(`Database Connected Sucessfully ${conn.connection.host}`);
  }
  catch (error) {
    console.log(`DB Connections Error occures ${error}`);
  }
}


export { connectDB };