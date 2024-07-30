import express from"express";
import { ApiRouter } from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", ApiRouter);
app.listen(PORT, () => {console.log("EL PUERTO ES: " + PORT)});