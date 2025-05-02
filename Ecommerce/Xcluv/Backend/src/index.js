import dotenv from 'dotenv';
import { app } from './app.js';
import cors from 'cors';
import { connectDB } from './db/database.js';
import { express } from './app.js';
import cookieParser from 'cookie-parser';




// add path on env
dotenv.config({
    path: '../.env'
});


// cors config
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
// }))


// cors config by both admin and frontend
const allowedOrigins = process.env.CORS_ORIGIN.split(",");

app.use(cors({
    origin: function (origin, callback) {

      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    
  }));



// middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());




import { router } from './routes/user.routers.js';

// user route deceleared
app.use("/xcluv/v2/users", router);





connectDB()
    .then(() => {
        app.listen(process.env.PORT || 2000, () => {
            console.log(`App is listing at port ❄️  ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log(` ✘ Error occures in connectDB ${error}`);
    })



