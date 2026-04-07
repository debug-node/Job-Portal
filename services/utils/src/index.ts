import express from "express";
import dotenv from "dotenv";
import routes from "./routes.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/utils", routes);

// Email consumer runs as a utility function (called via endpoint)
// No background processes - prevents Redis quota exhaustion

app.listen(process.env.PORT, () => {
	console.log(
		`Utils Service is running on http://localhost:${process.env.PORT}`,
	);
});