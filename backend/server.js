import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import bodyParser from "body-parser";
import {
  errorHandler,
  notFound,
  uncaughtException,
} from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import { consoleLogger } from "./utils/logger.js";
import { CORS_OPTIONS } from "./constants/apiConstants.js";
import './models/UserModel.js';
import sequelize from './config/db.config.js';

uncaughtException();

const app = express();

app.use(express.json());
app.use(cors(CORS_OPTIONS));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "990mb" }));

routes(app);

app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 5000;
sequelize.sync().then(() => {
  console.log('Database & tables created!');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

const server = app.listen(
  port,
  consoleLogger.info(`Server running in mode on port http://localhost:${port}`)
);

export { app, server }; // Export both app and server
