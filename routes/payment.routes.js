import express from "express";
import {
  checkout,
  paymentVerification,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.route("/checkout/:userId").get(checkout);

router.route("/verify").post(paymentVerification);

export default router;
