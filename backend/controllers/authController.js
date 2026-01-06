import { genToken } from "../configs/token.js"
import validator from "validator"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import User from "../models/userModel.js"

import sendMail, { sendVerificationEmail } from "../configs/Mail.js"


export const signUp = async (req, res) => {

    try {

        let { name, email, password, role } = req.body
        let existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({ message: "email already exist" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter valid Email" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Please enter a Strong Password" })
        }

        let hashPassword = await bcrypt.hash(password, 10)
        let user = await User.create({
            name,
            email,
            password: hashPassword,
            role,

        })
        let token = await genToken(user._id)
        return res.status(201).json({ user, token })

    } catch (error) {
        console.log("signUp error")
        return res.status(500).json({ message: `signUp Error ${error}` })
    }
}

// Signup with email verification (sends verification link via Brevo)
export const signupWithVerification = async (req, res) => {
    try {
        const { name, email, password, role, frontendUrl } = req.body

        // Validate inputs
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" })
        }

        let existUser = await User.findOne({ email })
        if (existUser) {
            // If user exists but not verified, resend verification email
            if (!existUser.emailVerified) {
                const verificationToken = crypto.randomBytes(32).toString('hex')
                existUser.verificationToken = verificationToken
                existUser.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
                await existUser.save()

                const clientUrl = frontendUrl || 'http://localhost:5173'
                await sendVerificationEmail(email, verificationToken, clientUrl)

                return res.status(200).json({
                    message: "Verification email resent. Please check your inbox.",
                    emailSent: true
                })
            }
            return res.status(400).json({ message: "Email already registered. Please login." })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" })
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex')

        // Hash password and create user
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role: role || 'student',
            emailVerified: false,
            verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })

        // Send verification email
        const clientUrl = frontendUrl || 'http://localhost:5173'
        const verificationLink = `${clientUrl}/verify-email/${verificationToken}`
        const emailSent = await sendVerificationEmail(email, verificationToken, clientUrl)

        // In development mode, always return the verification link
        // This helps when email service isn't configured
        const isDev = process.env.NODE_ENV !== 'production'

        return res.status(201).json({
            message: emailSent
                ? "Please check your email to verify your account!"
                : "Email service unavailable. Use the link below to verify.",
            emailSent: emailSent,
            userId: user._id,
            // Include verification link in development or if email failed
            ...(isDev || !emailSent ? { verificationLink } : {})
        })

    } catch (error) {
        console.error("signupWithVerification error:", error)
        return res.status(500).json({ message: `Signup error: ${error.message}` })
    }
}

// Verify email from link
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification link" })
        }

        // Mark email as verified
        user.emailVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpires = undefined
        await user.save()

        // Generate auth token so user is logged in
        const authToken = await genToken(user._id)

        return res.status(200).json({
            message: "Email verified successfully!",
            user,
            token: authToken
        })

    } catch (error) {
        console.error("verifyEmail error:", error)
        return res.status(500).json({ message: `Verification error: ${error.message}` })
    }
}

export const login = async (req, res) => {
    try {
        let { email, password } = req.body
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "user does not exist" })
        }
        let isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" })
        }
        let token = await genToken(user._id)
        return res.status(200).json({ user, token })

    } catch (error) {
        console.log("login error")
        return res.status(500).json({ message: `login Error ${error}` })
    }
}




export const logOut = async (req, res) => {
    try {
        await res.clearCookie("token")
        return res.status(200).json({ message: "logOut Successfully" })
    } catch (error) {
        return res.status(500).json({ message: `logout Error ${error}` })
    }
}


export const googleSignup = async (req, res) => {
    try {
        const { name, email, role } = req.body
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({
                name, email, role
            })
        }
        let token = await genToken(user._id)
        return res.status(200).json({ user, token })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `googleSignup  ${error}` })
    }

}


export const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) return res.status(401).json({ message: 'Unauthorized - no userId' })

        // Delete user account from database
        await User.findByIdAndDelete(userId)

        return res.status(200).json({ message: 'Account deleted successfully' })
    } catch (error) {
        console.error('deleteAccount error', error)
        return res.status(500).json({ message: `Delete account error ${error}` })
    }
}

// Email Link Sign-up/Sign-in (Passwordless authentication)
export const emailLinkSignup = async (req, res) => {
    try {
        const { name, email, role } = req.body

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        // Check if user already exists
        let user = await User.findOne({ email })

        if (!user) {
            // Create new user (no password needed for email link auth)
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                role: role || 'student',
                emailVerified: true // Email is verified via Firebase
            })
        }

        // Generate token
        let token = await genToken(user._id)

        return res.status(200).json({ user, token })

    } catch (error) {
        console.error("emailLinkSignup error:", error)
        return res.status(500).json({ message: `Email link signup error: ${error}` })
    }
}

// Supabase Auth Sync - Create or update user in MongoDB after Supabase email verification
export const supabaseSync = async (req, res) => {
    try {
        const { email, supabaseId, name, role } = req.body

        if (!email || !supabaseId) {
            return res.status(400).json({ message: "Email and Supabase ID are required" })
        }

        // Check if user already exists
        let user = await User.findOne({ email })

        if (!user) {
            // Create new user
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                role: role || 'student',
                supabaseId,
                emailVerified: true
            })
        } else {
            // Update existing user with Supabase ID if not set
            if (!user.supabaseId) {
                user.supabaseId = supabaseId
                user.emailVerified = true
                await user.save()
            }
        }

        // Generate JWT token
        let token = await genToken(user._id)

        return res.status(200).json({ user, token })

    } catch (error) {
        console.error("supabaseSync error:", error)
        return res.status(500).json({ message: `Supabase sync error: ${error}` })
    }
}

// Supabase Login - Verify user exists in MongoDB and return token
export const supabaseLogin = async (req, res) => {
    try {
        const { email, supabaseId } = req.body

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        // Find user in MongoDB
        let user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up first." })
        }

        // Update Supabase ID if not set
        if (supabaseId && !user.supabaseId) {
            user.supabaseId = supabaseId
            user.emailVerified = true
            await user.save()
        }

        // Generate JWT token
        let token = await genToken(user._id)

        return res.status(200).json({ user, token })

    } catch (error) {
        console.error("supabaseLogin error:", error)
        return res.status(500).json({ message: `Supabase login error: ${error}` })
    }
}

// Get educator status by email (for checking approval status)
export const getEducatorStatus = async (req, res) => {
    try {
        const { email } = req.query

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user) {
            return res.status(404).json({ message: "No account found with this email" })
        }

        if (user.role !== 'educator') {
            return res.status(404).json({ message: "No educator account found with this email" })
        }

        return res.status(200).json({
            email: user.email,
            role: user.role,
            approvalStatus: user.approvalStatus || 'pending',
            approvalNote: user.approvalNote || '',
            name: user.name
        })

    } catch (error) {
        console.error("getEducatorStatus error:", error)
        return res.status(500).json({ message: `Error checking status: ${error.message}` })
    }
}
