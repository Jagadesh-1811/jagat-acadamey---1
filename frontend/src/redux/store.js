import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import courseSlice from "./courseSlice"
import lectureSlice from "./lectureSlice"
import reviewSlice from "./reviewSlice"

const preloadedState = {
    user: {
        userData: null,
        token: localStorage.getItem('token') || null
    }
};

export const store = configureStore({
    reducer:{
        user:userSlice,
        course:courseSlice,
        lecture:lectureSlice,
        review:reviewSlice
    },
    preloadedState
})