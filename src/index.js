import express from"express";
import cors from 'cors';
import { ApiRouter } from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use("/api", ApiRouter);
app.listen(PORT, () => {console.log("EL PUERTO ES: " + PORT)});