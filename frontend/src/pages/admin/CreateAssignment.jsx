import axios from 'axios'
import React, { useState } from 'react'
import { FaArrowLeft } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

function CreateAssignment() {
    const [loading, setLoading] = useState(false)
    const { courseId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.user);

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [referenceLink, setReferenceLink] = useState("")
    const [deadline, setDeadline] = useState("")

    const createAssignment = async () => {
      setLoading(true)
      try {
        const { data } = await axios.post(
            serverUrl + `/api/assignment/create/${courseId}`,
            { title, description, referenceLink, deadline },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        toast.success("Assignment Created")
        navigate(`/createlecture/${courseId}`)
        setLoading(false)
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to create assignment")
        setLoading(false)
      }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <FaArrowLeft className="text-gray-600 cursor-pointer" onClick={() => navigate(`/createlecture/${courseId}`)} />
                    <h2 className="text-xl font-semibold text-gray-800">Create New Assignment</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                            placeholder="e.g., Week 1 Project"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                            placeholder="Describe the assignment requirements..."
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference Link (Optional)</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                            placeholder="e.g., Google Doc or GitHub repo link"
                            onChange={(e) => setReferenceLink(e.target.value)}
                            value={referenceLink}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <input
                            type="datetime-local"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                            onChange={(e) => setDeadline(e.target.value)}
                            value={deadline}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-700 transition" disabled={loading} onClick={createAssignment}>
                        {loading ? <ClipLoader size={30} color='white' /> : "Create Assignment"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateAssignment