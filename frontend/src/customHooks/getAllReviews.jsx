import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setAllReview } from '../redux/reviewSlice'
import axios from 'axios'

const getAllReviews = () => {

   const dispatch = useDispatch()
   const { token } = useSelector(state => state.user);
  

  useEffect(()=>{
    const getAllReviews = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/review/allReview" , { headers: { Authorization: `Bearer ${token}` } })
        console.log(result.data)
        dispatch(setAllReview(result.data))
        
      } catch (error) {
        console.log(error)
      }
    }
    getAllReviews()
  },[token])
  
}

export default getAllReviews
