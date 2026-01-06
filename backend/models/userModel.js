import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String

    },
    description: {
      type: String
    },
    role: {
      type: String,
      enum: ["educator", "student", "user"],
      required: true
    },
    // Approval status for educators - students are auto-approved
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return this.role === "educator" ? "pending" : "approved";
      }
    },
    approvalNote: {
      type: String,
      default: ""
    },
    approvedAt: {
      type: Date
    },
    photoUrl: {
      type: String,
      default: ""
    },
    enrolledCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true // Allows null values to coexist for existing users
    },
    supabaseId: {
      type: String,
      sparse: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String
    },
    verificationTokenExpires: {
      type: Date
    }

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
