import crypto from "crypto";
import { Payment } from "../models/payment.model.js";
import { User } from "../models/user.model.js";
import Razorpay from "razorpay";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const checkout = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const error = req.query.error || null;

  // console.log(userId);

  const options = {
    amount: 2000000, // amount in paise (20000 INR)
    currency: "INR",
  };

  try {
    const order = await razorpay.orders.create(options);

    // console.log("Oreder is: ", order);

    res.render("payment", { order, userId, error });
  } catch (error) {
    throw new ApiError(501, "Error creating Razorpay order");
  }
});

export const paymentVerification = asyncHandler(async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
    } = req.body;

    // console.log("razorpaySign:", razorpay_signature);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const razorpaySecret = process.env.RAZORPAY_SECRET;

    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(body.toString())
      .digest("hex");

    // console.log("Expected signature:", expectedSignature);
    // console.log("Received signature:", razorpay_signature);

    if (expectedSignature === razorpay_signature) {
      console.log("Payment is authentic");

      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        user: user_id,
      });

      await User.findByIdAndUpdate(user_id, { paymentStatus: true });

      res.render("redirecting", { user_id });
    } else {
      res.status(401).json({
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Please try again.",
    });
  }
});
