import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../../App'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import SchoolIcon from '@mui/icons-material/School';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import { useNavigate } from 'react-router-dom'

function EducatorApprovals() {
    const [educators, setEducators] = useState([])
    const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(null) // Track which educator action is loading
    const [filter, setFilter] = useState('pending') // 'pending', 'approved', 'rejected', 'all'
    const [rejectNote, setRejectNote] = useState('')
    const [showRejectModal, setShowRejectModal] = useState(null) // educatorId or null
    const navigate = useNavigate()

    const adminToken = localStorage.getItem('adminToken')

    useEffect(() => {
        fetchEducators()
    }, [filter])

    const fetchEducators = async () => {
        if (!adminToken) {
            navigate('/admin/login')
            return
        }

        setLoading(true)
        try {
            const response = await axios.get(
                `${serverUrl}/api/admin/data/educators?status=${filter}`,
                { headers: { Authorization: `Bearer ${adminToken}` } }
            )
            setEducators(response.data.educators)
            setCounts(response.data.counts)
        } catch (error) {
            console.error('Error fetching educators:', error)
            toast.error('Failed to fetch educators')
        }
        setLoading(false)
    }

    const handleApprove = async (educatorId) => {
        setActionLoading(educatorId)
        try {
            await axios.post(
                `${serverUrl}/api/admin/data/educators/${educatorId}/approve`,
                { note: 'Approved by admin' },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            )
            toast.success('Educator approved successfully!')
            fetchEducators()
        } catch (error) {
            console.error('Error approving educator:', error)
            toast.error(error.response?.data?.message || 'Failed to approve educator')
        }
        setActionLoading(null)
    }

    const handleReject = async (educatorId) => {
        if (!rejectNote.trim()) {
            toast.error('Please provide a rejection reason')
            return
        }

        setActionLoading(educatorId)
        try {
            await axios.post(
                `${serverUrl}/api/admin/data/educators/${educatorId}/reject`,
                { note: rejectNote },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            )
            toast.success('Educator rejected')
            setShowRejectModal(null)
            setRejectNote('')
            fetchEducators()
        } catch (error) {
            console.error('Error rejecting educator:', error)
            toast.error(error.response?.data?.message || 'Failed to reject educator')
        }
        setActionLoading(null)
    }

    const handleDelete = async (educatorId) => {
        if (!window.confirm('Are you sure you want to delete this educator account? This cannot be undone.')) {
            return
        }

        setActionLoading(educatorId)
        try {
            await axios.delete(
                `${serverUrl}/api/admin/data/educators/${educatorId}`,
                { headers: { Authorization: `Bearer ${adminToken}` } }
            )
            toast.success('Educator account deleted')
            fetchEducators()
        } catch (error) {
            console.error('Error deleting educator:', error)
            toast.error(error.response?.data?.message || 'Failed to delete educator')
        }
        setActionLoading(null)
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className='px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1'><AccessTimeIcon className="w-3 h-3" /> Pending</span>
            case 'approved':
                return <span className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1'><PersonAddOutlinedIcon className="w-3 h-3" /> Approved</span>
            case 'rejected':
                return <span className='px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1'><PersonAddDisabledIcon className="w-3 h-3" /> Rejected</span>
            default:
                return <span className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium'>Unknown</span>
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            {/* Header */}
            <div className='max-w-6xl mx-auto'>
                <div className='flex items-center justify-between mb-6'>
                    <div className='flex items-center gap-3'>
                        <div className='p-3 bg-black rounded-xl'>
                            <SchoolIcon className='text-white text-2xl' />
                        </div>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-800'>Educator Approvals</h1>
                            <p className='text-gray-600 text-sm'>Manage educator registration requests</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className='px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition'
                    >
                        Back to Dashboard
                    </button>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                    <div
                        className={`p-4 bg-white rounded-xl shadow cursor-pointer transition-all ${filter === 'pending' ? 'ring-2 ring-black' : 'hover:shadow-md'}`}
                        onClick={() => setFilter('pending')}
                    >
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-gray-100 rounded-lg'>
                                <AccessTimeIcon className='text-black' />
                            </div>
                            <div>
                                <p className='text-2xl font-bold text-gray-800'>{counts.pending}</p>
                                <p className='text-sm text-gray-500'>Pending</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`p-4 bg-white rounded-xl shadow cursor-pointer transition-all ${filter === 'approved' ? 'ring-2 ring-black' : 'hover:shadow-md'}`}
                        onClick={() => setFilter('approved')}
                    >
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-gray-100 rounded-lg'>
                                <PersonAddOutlinedIcon className='text-black' />
                            </div>
                            <div>
                                <p className='text-2xl font-bold text-gray-800'>{counts.approved}</p>
                                <p className='text-sm text-gray-500'>Approved</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`p-4 bg-white rounded-xl shadow cursor-pointer transition-all ${filter === 'rejected' ? 'ring-2 ring-black' : 'hover:shadow-md'}`}
                        onClick={() => setFilter('rejected')}
                    >
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-gray-100 rounded-lg'>
                                <PersonAddDisabledIcon className='text-black' />
                            </div>
                            <div>
                                <p className='text-2xl font-bold text-gray-800'>{counts.rejected}</p>
                                <p className='text-sm text-gray-500'>Rejected</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`p-4 bg-white rounded-xl shadow cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-black' : 'hover:shadow-md'}`}
                        onClick={() => setFilter('all')}
                    >
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-gray-100 rounded-lg'>
                                <SchoolIcon className='text-black' />
                            </div>
                            <div>
                                <p className='text-2xl font-bold text-gray-800'>{counts.total}</p>
                                <p className='text-sm text-gray-500'>Total</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Educators List */}
                <div className='bg-white rounded-xl shadow overflow-hidden'>
                    <div className='p-4 border-b bg-gray-50'>
                        <h2 className='font-semibold text-gray-800'>
                            {filter === 'all' ? 'All Educators' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Educators`}
                        </h2>
                    </div>

                    {loading ? (
                        <div className='flex items-center justify-center p-12'>
                            <ClipLoader size={40} color='#7c3aed' />
                        </div>
                    ) : educators.length === 0 ? (
                        <div className='p-12 text-center text-gray-500'>
                            <SchoolIcon className='text-4xl mx-auto mb-3 text-gray-300' />
                            <p>No {filter === 'all' ? '' : filter} educators found</p>
                        </div>
                    ) : (
                        <div className='divide-y'>
                            {educators.map((educator) => (
                                <div key={educator._id} className='p-4 hover:bg-gray-50 transition'>
                                    <div className='flex items-start justify-between gap-4'>
                                        <div className='flex items-start gap-4'>
                                            <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg'>
                                                {educator.name?.charAt(0).toUpperCase() || 'E'}
                                            </div>
                                            <div>
                                                <h3 className='font-semibold text-gray-800'>{educator.name}</h3>
                                                <p className='text-sm text-gray-500'>{educator.email}</p>
                                                <p className='text-xs text-gray-400 mt-1'>
                                                    Registered: {formatDate(educator.createdAt)}
                                                </p>
                                                {educator.approvalNote && (
                                                    <p className='text-xs text-gray-600 mt-1 italic'>
                                                        Note: {educator.approvalNote}
                                                    </p>
                                                )}
                                                {educator.approvedAt && (
                                                    <p className='text-xs text-green-600 mt-1'>
                                                        Approved: {formatDate(educator.approvedAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-3'>
                                            {getStatusBadge(educator.approvalStatus)}

                                            {educator.approvalStatus === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(educator._id)}
                                                        disabled={actionLoading === educator._id}
                                                        className='p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50'
                                                        title='Approve'
                                                    >
                                                        {actionLoading === educator._id ? <ClipLoader size={16} color='white' /> : <CheckIcon />}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowRejectModal(educator._id)}
                                                        disabled={actionLoading === educator._id}
                                                        className='p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50'
                                                        title='Reject'
                                                    >
                                                        <CloseIcon />
                                                    </button>
                                                </>
                                            )}

                                            <button
                                                onClick={() => handleDelete(educator._id)}
                                                disabled={actionLoading === educator._id}
                                                className='p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-600 transition disabled:opacity-50'
                                                title='Delete'
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-xl p-6 w-full max-w-md mx-4'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Reject Educator Application</h3>
                        <p className='text-sm text-gray-600 mb-4'>Please provide a reason for rejection. This will be shown to the educator.</p>
                        <textarea
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            placeholder='Enter rejection reason...'
                            className='w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-red-400 focus:outline-none'
                            rows={3}
                        />
                        <div className='flex gap-3 mt-4'>
                            <button
                                onClick={() => {
                                    setShowRejectModal(null)
                                    setRejectNote('')
                                }}
                                className='flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(showRejectModal)}
                                disabled={actionLoading === showRejectModal}
                                className='flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50'
                            >
                                {actionLoading === showRejectModal ? <ClipLoader size={20} color='white' /> : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EducatorApprovals
