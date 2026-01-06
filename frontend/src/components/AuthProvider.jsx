import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUserData } from '../redux/userSlice';
import { auth, onAuthStateChanged } from '../../utils/Firebase';

/**
 * AuthProvider component that handles automatic Firebase token refresh
 * Firebase tokens expire after 1 hour, this component refreshes them every 55 minutes
 */
const AuthProvider = () => {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.user);
    const refreshIntervalRef = useRef(null);

    useEffect(() => {
        // Listen for Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Get fresh token
                    const newToken = await user.getIdToken(true); // Force refresh

                    // Update token in Redux and localStorage
                    dispatch(setToken(newToken));
                    localStorage.setItem('token', newToken);

                    console.log('✅ Firebase token refreshed successfully');

                    // Set up automatic refresh every 55 minutes (before 1 hour expiration)
                    if (refreshIntervalRef.current) {
                        clearInterval(refreshIntervalRef.current);
                    }

                    refreshIntervalRef.current = setInterval(async () => {
                        try {
                            const currentUser = auth.currentUser;
                            if (currentUser) {
                                const refreshedToken = await currentUser.getIdToken(true);
                                dispatch(setToken(refreshedToken));
                                localStorage.setItem('token', refreshedToken);
                                console.log('✅ Firebase token auto-refreshed');
                            }
                        } catch (refreshError) {
                            console.error('❌ Token refresh failed:', refreshError);
                        }
                    }, 55 * 60 * 1000); // 55 minutes

                } catch (error) {
                    console.error('❌ Error getting Firebase token:', error);
                }
            } else {
                // User is signed out
                if (refreshIntervalRef.current) {
                    clearInterval(refreshIntervalRef.current);
                }
            }
        });

        // Cleanup on unmount
        return () => {
            unsubscribe();
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [dispatch]);

    // Also refresh token when the app regains focus (user returns to tab)
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible' && auth.currentUser) {
                try {
                    const refreshedToken = await auth.currentUser.getIdToken(true);
                    dispatch(setToken(refreshedToken));
                    localStorage.setItem('token', refreshedToken);
                    console.log('✅ Token refreshed on tab focus');
                } catch (error) {
                    console.error('❌ Token refresh on focus failed:', error);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [dispatch]);

    return null; // This component doesn't render anything
};

export default AuthProvider;
