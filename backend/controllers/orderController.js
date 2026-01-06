import Course from "../models/courseModel.js";
import razorpay from 'razorpay'
import User from "../models/userModel.js";
import crypto from 'crypto';
import dotenv from "dotenv"
dotenv.config()
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
})

export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Add check for course price
    if (course.price === undefined || course.price === null || isNaN(course.price) || course.price <= 0) {
      return res.status(400).json({ message: "Course price is invalid or not set." });
    }

    const options = {
      amount: course.price * 100, // in paisa
      currency: 'INR',
      receipt: `${courseId}.toString()`,
    };

    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json(order);
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: `Order creation failed ${err}` });

  }
};



export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // Verify signature using HMAC SHA256
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update user and course enrollment
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Ensure courseId is a string for comparison
      if (!user.enrolledCourses.map(id => id.toString()).includes(courseId.toString())) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      const course = await Course.findById(courseId).populate("lectures");
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!course.enrolledStudents.map(id => id.toString()).includes(userId.toString())) {
        console.log("Enrolling user:", userId.toString(), "into course:", courseId.toString());
        course.enrolledStudents.push(userId);
        await course.save();
        console.log("User enrolled. Updated enrolledStudents:", course.enrolledStudents.map(id => id.toString()));
      }

      return res.status(200).json({ message: "Payment verified and enrollment successful" });
    } else {
      return res.status(400).json({ message: "Payment verification failed (invalid signature)" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error during payment verification" });
  }
};
