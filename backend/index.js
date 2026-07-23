import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/connection.js";
import userRoute from "./routes/user.js";
import companyRoute from "./routes/company.js";
import jobRoute from "./routes/job.js";
import applicationRoute from "./routes/application.js";

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:'https://ai-based-job-portal-web-app-frontend.onrender.com',
    credentials:true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);



app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})
