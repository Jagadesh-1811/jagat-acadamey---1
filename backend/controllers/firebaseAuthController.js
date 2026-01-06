import { getFirebaseUser } from "../utils/firebaseAdmin.js";
import User from "../models/userModel.js";
import { genToken } from "../configs/token.js";

// Sync Firebase user to MongoDB
export const syncFirebaseUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const firebaseUid = req.firebaseUid; // Set by isAuth middleware

        console.log('🔄 syncFirebaseUser called:', { email, role, firebaseUid: firebaseUid?.substring(0, 10) + '...' });

        if (!firebaseUid || !email) {
            console.error('❌ Missing required fields:', { firebaseUid: !!firebaseUid, email: !!email });
            return res.status(400).json({
                message: "Firebase UID and email are required"
            });
        }

        // Check if user already exists by firebaseUid or email
        let user = await User.findOne({
            $or: [{ firebaseUid }, { email }]
        });

        console.log('🔍 Existing user found:', user ? { id: user._id, role: user.role, hasFirebaseUid: !!user.firebaseUid } : 'NO');

        if (!user) {
            // Create new user in MongoDB
            // IMPORTANT: Use the role from the request, or default to 'student'
            const userRole = role || 'student';
            const userApprovalStatus = userRole === 'educator' ? 'pending' : 'approved';

            console.log('📝 Creating new user with:', { email, role: userRole, approvalStatus: userApprovalStatus });

            user = await User.create({
                name: name || email.split('@')[0],
                email,
                role: userRole,
                approvalStatus: userApprovalStatus, // Explicitly set this
                firebaseUid,
                emailVerified: true, // Firebase handles verification
            });
            console.log('✅ New MongoDB user created:', { id: user._id, role: user.role, approvalStatus: user.approvalStatus });
        } else {
            // User exists
            let needsSave = false;

            // Update Firebase UID if not set
            if (!user.firebaseUid) {
                console.log('📝 Updating existing user with Firebase UID');
                user.firebaseUid = firebaseUid;
                user.emailVerified = true;
                needsSave = true;

                // If role is explicitly 'educator' and user is currently 'student', update
                if (role === 'educator' && user.role !== 'educator') {
                    console.log('📝 Upgrading user role from', user.role, 'to educator');
                    user.role = 'educator';
                    user.approvalStatus = 'pending';
                }
            }

            if (needsSave) {
                await user.save();
                console.log('✅ User updated:', { id: user._id, role: user.role, approvalStatus: user.approvalStatus });
            } else {
                console.log('ℹ️ User already has Firebase UID, no update needed');
            }
        }

        // Generate JWT token for backward compatibility
        const token = await genToken(user._id);

        console.log('✅ Sync complete, returning user:', { id: user._id, role: user.role, approvalStatus: user.approvalStatus });

        return res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                approvalStatus: user.approvalStatus,
                approvalNote: user.approvalNote,
                approvedAt: user.approvedAt,
            },
            token
        });

    } catch (error) {
        console.error("❌ syncFirebaseUser error:", error);
        return res.status(500).json({
            message: `Firebase sync error: ${error.message}`
        });
    }
};
