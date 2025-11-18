
import { app, server, express } from '../src/socket/socket.js';
import { connectDB } from './database/database.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router } from './routers/user.router.js';


// Enable CORS for your frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, 
}));


// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// API routes
app.use("/ping/v2", router);


// Start server after DB connection
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8081;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`❌ Error occurred while connecting to DB: ${error}`);
  });
