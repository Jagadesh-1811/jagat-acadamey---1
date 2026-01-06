import jwt from "jsonwebtoken";
import { verifyFirebaseToken } from "../utils/firebaseAdmin.js";
import User from "../models/userModel.js";

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token not found or invalid' });
    }

    const token = authHeader.split(' ')[1];

    // Try Firebase token first
    const firebaseResult = await verifyFirebaseToken(token);

    if (firebaseResult.success) {
      // Firebase token verified
      // console.log('✅ Firebase token verified for:', firebaseResult.email);

      // Check if this is a firebase-sync request (signup flow)
      const isFirebaseSyncRequest = req.path === '/firebase-sync' || req.originalUrl.includes('/firebase-sync');

      // Allow firebase-sync to proceed even without email verification
      // This is crucial because we need to create the MongoDB user BEFORE email is verified
      if (!firebaseResult.emailVerified && !isFirebaseSyncRequest) {
        return res.status(403).json({
          message: 'Email not verified. Please check your inbox and verify your email.'
        });
      }

      // Find user by Firebase UID
      const user = await User.findOne({ firebaseUid: firebaseResult.uid });

      if (!user) {
        // Allow firebase-sync endpoint to proceed even if user doesn't exist yet
        // This is crucial for the first sync!
        if (isFirebaseSyncRequest) {
          req.firebaseUid = firebaseResult.uid;
          req.userEmail = firebaseResult.email;
          return next();
        }

        return res.status(404).json({
          message: 'User not found in database. Please sign up or sync account.'
        });
      }

      req.userId = user._id;
      req.firebaseUid = firebaseResult.uid;
      req.userEmail = firebaseResult.email;
      next();
    } else {
      // console.log('⚠️ Firebase verification failed:', firebaseResult.error); // Quiet this log

      // ERROR LOGGING only if NOT "no kid claim" (which is expected for legacy tokens)
      if (firebaseResult.error && !firebaseResult.error.includes('has no "kid" claim')) {
        console.log('⚠️ Firebase verification failed:', firebaseResult.error);
      }

      // DIAGNOSTIC LOGGING
      if (firebaseResult.error === 'Firebase Admin not initialized') {
        console.error('SERVER CONFIG ERROR: Firebase Admin SDK is NOT running.');
        console.error('Check: FIREBASE_PROJECT_ID is ' + (process.env.FIREBASE_PROJECT_ID ? 'SET' : 'MISSING'));
      }

      // Fall back to JWT for backward compatibility (existing users)
      try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!verifiedToken) {
          return res.status(400).json({ message: "Invalid token" });
        }

        req.userId = verifiedToken.userId;
        // console.log('✅ JWT token verified (legacy)');
        next();
      } catch (jwtError) {
        console.error('❌ Both Firebase and JWT verification failed for token:', token.substring(0, 10) + '...');
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
    }
  } catch (error) {
    console.error('❌ Authentication error:', error);
    return res.status(500).json({ message: `Authentication error: ${error.message}` });
  }
};

export default isAuth;