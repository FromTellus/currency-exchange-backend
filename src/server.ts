import express from "express";
import cors from "cors";
import countryRouter from "./routes/country";
import jwtRouter from "./routes/jwt";
import { requireJwtMiddleware } from "./middlewares/authMiddleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.use("/login", jwtRouter);
app.use(requireJwtMiddleware);
app.use("/country", countryRouter);

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
});
