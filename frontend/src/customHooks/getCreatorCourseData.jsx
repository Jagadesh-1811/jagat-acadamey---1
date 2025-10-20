import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { setCreatorCourseData } from '../redux/courseSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const getCreatorCourseData = () => {
    const dispatch = useDispatch()
    const {userData, token} = useSelector(state=>state.user)

    useEffect(()=>{
    const getCreatorData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses" , {headers: { Authorization: `Bearer ${token}` }})
        
         await dispatch(setCreatorCourseData(result.data))

        
        console.log(result.data)
        
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || error.message || "An unexpected error occurred.")
      }
      
    }
    if(userData){ // Only call if userData exists
      getCreatorData()
    }
  },[userData, token])
}

export default getCreatorCourseData
