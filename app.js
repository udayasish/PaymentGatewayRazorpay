import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    limit: "16kb",
    extended: true,
  })
);

app.use(express.static("public"));

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Routes import
import userRouter from "./routes/users.routes.js";
import paymentRouter from "./routes/payment.routes.js";

//Routes declaration
app.get("/", (req, res) => {
  res.redirect("/auth/register");
});
app.use("/auth", userRouter);
app.use("/payment", paymentRouter);

export { app };
