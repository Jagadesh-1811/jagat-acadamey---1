import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

// Create Super Admin (one-time setup)
export const setupSuperAdmin = async (req, res) => {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ role: "superadmin" });
        if (existingAdmin) {
            return res.status(400).json({ message: "Super admin already exists" });
        }

        // Default super admin credentials
        const defaultEmail = "admin@jagatacademy.com";
        const defaultPassword = "admin123";
        const defaultName = "Super Admin";

        const hashPassword = await bcrypt.hash(defaultPassword, 10);

        const admin = await Admin.create({
            name: defaultName,
            email: defaultEmail,
            password: hashPassword,
            role: "superadmin"
        });

        console.log("Super Admin created successfully");
        console.log(`Email: ${defaultEmail}`);
        console.log(`Password: ${defaultPassword}`);

        return res.status(201).json({
            message: "Super admin created successfully",
            email: defaultEmail
        });

    } catch (error) {
        console.error("Setup super admin error:", error);
        return res.status(500).json({ message: `Setup error: ${error}` });
    }
};

// Admin Login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login successful",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            token
        });

    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({ message: `Login error: ${error}` });
    }
};

// Verify Admin Token
export const verifyAdmin = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided", valid: false });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await Admin.findById(decoded.adminId).select("-password");
        if (!admin) {
            return res.status(401).json({ message: "Admin not found", valid: false });
        }

        return res.status(200).json({
            valid: true,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Invalid token", valid: false });
    }
};

// Admin Logout (client-side token removal, but we can invalidate if needed)
export const adminLogout = async (req, res) => {
    try {
        // For now, logout is handled client-side by removing the token
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: `Logout error: ${error}` });
    }
};
