import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
    try {
        // Check if Firebase Admin is already initialized
        if (admin.apps.length > 0) {
            console.log('✅ Firebase Admin already initialized');
            return admin;
        }

        // Get credentials from environment variables
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const projectId = process.env.FIREBASE_PROJECT_ID;

        if (!privateKey || !clientEmail || !projectId) {
            console.error('❌ Firebase Admin credentials missing in environment variables');
            console.error('Required: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
            return null;
        }

        // Initialize with service account
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                privateKey,
                clientEmail,
            }),
        });

        console.log('✅ Firebase Admin SDK initialized successfully');
        return admin;
    } catch (error) {
        console.error('❌ Firebase Admin initialization error:', error.message);
        return null;
    }
};

// Initialize on module load
const firebaseAdmin = initializeFirebaseAdmin();

// Verify Firebase ID token
export const verifyFirebaseToken = async (idToken) => {
    try {
        if (!firebaseAdmin) {
            throw new Error('Firebase Admin not initialized');
        }

        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        return {
            success: true,
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
        };
    } catch (error) {
        // Suppress "no kid claim" error as it simply means it's a legacy token (not Firebase)
        if (error.message && !error.message.includes('has no "kid" claim')) {
            console.error('❌ Token verification error:', error.message);
        }
        return {
            success: false,
            error: error.message,
        };
    }
};

// Get user by Firebase UID
export const getFirebaseUser = async (uid) => {
    try {
        if (!firebaseAdmin) {
            throw new Error('Firebase Admin not initialized');
        }

        const userRecord = await firebaseAdmin.auth().getUser(uid);
        return {
            success: true,
            user: {
                uid: userRecord.uid,
                email: userRecord.email,
                emailVerified: userRecord.emailVerified,
                displayName: userRecord.displayName,
                photoURL: userRecord.photoURL,
            },
        };
    } catch (error) {
        console.error('❌ Get Firebase user error:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
};

// Create custom token for user
export const createCustomToken = async (uid) => {
    try {
        if (!firebaseAdmin) {
            throw new Error('Firebase Admin not initialized');
        }

        const customToken = await firebaseAdmin.auth().createCustomToken(uid);
        return {
            success: true,
            token: customToken,
        };
    } catch (error) {
        console.error('❌ Create custom token error:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
};

export default firebaseAdmin;
