import express from"express";
import apiRoute from "./routes/route";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", apiRoute);
app.listen(PORT, () => {console.log("EL PUERTO ES: " + PORT)});