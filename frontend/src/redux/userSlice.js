import { createSlice } from "@reduxjs/toolkit"

const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null,
        token: null
    },
    reducers:{
        setUserData:(state,action)=>{
        state.userData=action.payload
        },
        setToken:(state,action)=>{
        state.token=action.payload
        localStorage.setItem('token', action.payload)
        }
    }
})

export const {setUserData, setToken}=userSlice.actions
export default userSlice.reducer