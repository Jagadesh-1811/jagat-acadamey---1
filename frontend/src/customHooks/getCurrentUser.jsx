import { useEffect } from "react"
import { serverUrl } from "../App"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice"
const getCurrentUser = ()=>{
    let dispatch = useDispatch()
    const { token } = useSelector(state => state.user)
   
    useEffect(()=> {
        const fetchUser = async () => {
            try {
                if (token) {
                    let result = await axios.get(serverUrl + "/api/user/currentuser" , {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    dispatch(setUserData(result.data))
                }

            } catch (error) {
                console.log(error)
                dispatch(setUserData(null))
            }
        }
        fetchUser()
    },[token])
}

export default getCurrentUser