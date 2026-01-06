import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { setCreatorCourseData } from '../../redux/courseSlice';
import img1 from "../../assets/empty.jpg"
import { ClipLoader } from 'react-spinners';

function Courses() {
  let navigate = useNavigate()
  let dispatch = useDispatch()
  const [loading, setLoading] = useState(true);
  const [hoveredCourse, setHoveredCourse] = useState(null);

  const { creatorCourseData } = useSelector(state => state.course)
  const { token } = useSelector(state => state.user);

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        setLoading(true);
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { headers: { Authorization: `Bearer ${token}` } })
        await dispatch(setCreatorCourseData(result.data))
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to fetch courses")
      } finally {
        setLoading(false);
      }
    }
    getCreatorData()
  }, [token])

  const totalStudents = creatorCourseData?.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0) || 0;
  const publishedCount = creatorCourseData?.filter(c => c.isPublished).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <ArrowBackIcon className="w-5 h-5" />
            </button>
            <div>
              <h1>My Courses</h1>
              <p>Manage and organize your course content</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/createcourses")}
            className="admin-btn admin-btn-primary"
          >
            <AddIcon className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="admin-stat-card">
            <div className="flex items-center gap-3">
              <div className="admin-icon-box admin-icon-box-dark">
                <MenuBookIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="admin-stat-value">{creatorCourseData?.length || 0}</p>
                <p className="admin-stat-label">Total Courses</p>
              </div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="flex items-center gap-3">
              <div className="admin-icon-box admin-icon-box-light">
                <VisibilityIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="admin-stat-value">{publishedCount}</p>
                <p className="admin-stat-label">Published</p>
              </div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="flex items-center gap-3">
              <div className="admin-icon-box admin-icon-box-dark">
                <GroupIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="admin-stat-value">{totalStudents}</p>
                <p className="admin-stat-label">Students</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={40} color="#000" />
          </div>
        ) : creatorCourseData?.length === 0 ? (
          <div className="admin-card text-center py-16">
            <div className="admin-icon-box admin-icon-box-light w-20 h-20 mx-auto mb-4">
              <MenuBookIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-6">Create your first course to get started</p>
            <button
              onClick={() => navigate("/createcourses")}
              className="admin-btn admin-btn-primary"
            >
              <AddIcon className="w-4 h-4" />
              Create Course
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block admin-card p-0 overflow-hidden">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Price</th>
                    <th>Students</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creatorCourseData?.map((course, index) => (
                    <tr
                      key={index}
                      onMouseEnter={() => setHoveredCourse(course._id)}
                      onMouseLeave={() => setHoveredCourse(null)}
                      style={{
                        background: hoveredCourse === course._id ? '#fafafa' : 'white'
                      }}
                    >
                      <td>
                        <div className="flex items-center gap-4">
                          <img
                            src={course?.thumbnail || img1}
                            alt=""
                            className="w-20 h-12 object-cover rounded-lg border border-gray-200"
                            style={{
                              transform: hoveredCourse === course._id ? 'scale(1.05)' : 'scale(1)',
                              transition: 'transform 0.2s ease'
                            }}
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{course?.title}</p>
                            <p className="text-xs text-gray-500">{course?.category}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold">
                          {course?.price ? `₹${course.price}` : 'Free'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <GroupIcon className="text-gray-400" />
                          <span className="font-medium">{course?.enrolledStudents?.length || 0}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${course?.isPublished ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                          {course?.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/addcourses/${course?._id}`)}
                            className="admin-btn admin-btn-secondary py-2 px-3"
                          >
                            <EditIcon className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => navigate(`/admin/create-doubt-session/${course?._id}`)}
                            className="admin-btn admin-btn-ghost py-2 px-3"
                          >
                            + Doubt Session
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {creatorCourseData?.map((course, index) => (
                <div
                  key={index}
                  className="admin-card"
                  onClick={() => navigate(`/addcourses/${course?._id}`)}
                >
                  <div className="flex gap-4">
                    <img
                      src={course?.thumbnail || img1}
                      alt=""
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{course?.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{course?.category}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-semibold">
                          {course?.price ? `₹${course.price}` : 'Free'}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <GroupIcon className="w-3 h-3" />
                          {course?.enrolledStudents?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className={`admin-badge ${course?.isPublished ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                        {course?.isPublished ? "Published" : "Draft"}
                      </span>
                      <EditIcon className="text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <p className="text-center text-sm text-gray-400 mt-8">
          {creatorCourseData?.length > 0 ? 'Click on a course to edit its details' : ''}
        </p>
      </div>
    </div>
  );
}

export default Courses
