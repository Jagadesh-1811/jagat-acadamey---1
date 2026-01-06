import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setModuleData, toggleModuleExpand, addModule, updateModule, removeModule } from '../../redux/moduleSlice';
import { setLectureData } from '../../redux/lectureSlice';
import ModuleCard from '../../components/ModuleCard';

function CreateLecture() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const dispatch = useDispatch();

  const { moduleData, expandedModules } = useSelector(state => state.module);
  const { token } = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [lectureInputs, setLectureInputs] = useState({}); // moduleId -> lectureTitle

  // Fetch modules and their lectures
  useEffect(() => {
    const fetchModules = async () => {
      if (courseId && token) {
        try {
          const result = await axios.get(
            `${serverUrl}/api/module/course/${courseId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          dispatch(setModuleData(result.data.modules));

          // Extract all lectures from modules and populate lectureSlice
          const allLectures = result.data.modules.flatMap(module => module.lectures || []);
          dispatch(setLectureData(allLectures));

        } catch (error) {
          console.error('Error fetching modules:', error);
          if (error.response?.status !== 404) {
            toast.error(error.response?.data?.message || 'Failed to fetch modules');
          }
        }
      }
    };

    if (courseId && token) {
      fetchModules();
    }
  }, [courseId, token, dispatch]);

  // Create new module
  const handleCreateModule = async () => {
    if (!newModuleTitle.trim()) {
      toast.error('Module title is required');
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/module/create/${courseId}`,
        {
          title: newModuleTitle,
          description: newModuleDescription
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(addModule(result.data.module));
      toast.success('Module created successfully');
      setShowModuleModal(false);
      setNewModuleTitle('');
      setNewModuleDescription('');
    } catch (error) {
      console.error('Error creating module:', error);
      toast.error(error.response?.data?.message || 'Failed to create module');
    } finally {
      setLoading(false);
    }
  };

  // Update module
  const handleUpdateModule = async (moduleId, data) => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/module/${moduleId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(updateModule(result.data.module));
      toast.success('Module updated successfully');
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error(error.response?.data?.message || 'Failed to update module');
    }
  };

  // Delete module
  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Delete this module and all its lectures?')) return;

    try {
      await axios.delete(
        `${serverUrl}/api/module/${moduleId}?deleteLectures=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(removeModule(moduleId));
      toast.success('Module deleted successfully');
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error(error.response?.data?.message || 'Failed to delete module');
    }
  };

  // Create lecture in module
  const handleCreateLecture = async (moduleId) => {
    const lectureTitle = lectureInputs[moduleId];

    if (!lectureTitle?.trim()) {
      toast.error('Lecture title is required');
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/module/${moduleId}/lecture`,
        { lectureTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh modules to get updated lectures
      const modulesResult = await axios.get(
        `${serverUrl}/api/module/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setModuleData(modulesResult.data.modules));

      // Extract all lectures from modules and update lectureSlice
      const allLectures = modulesResult.data.modules.flatMap(module => module.lectures || []);
      dispatch(setLectureData(allLectures));

      toast.success('Lecture created successfully');
      setLectureInputs(prev => ({ ...prev, [moduleId]: '' }));
    } catch (error) {
      console.error('Error creating lecture:', error);
      toast.error(error.response?.data?.message || 'Failed to create lecture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium mb-4"
            onClick={() => navigate(`/addcourses/${courseId}`)}
          >
            <ArrowBackIcon /> Back to Course
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Course Modules & Lectures</h1>
              <p className="text-gray-600 mt-2">Organize your course content into modules and lectures</p>
            </div>

            <button
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-black text-white font-semibold shadow-lg transition-all hover:bg-gray-800"
              onClick={() => setShowModuleModal(true)}
            >
              <AddIcon /> Create Module
            </button>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {moduleData.length === 0 ? (
            <div className="bg-white shadow-lg rounded-xl p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No modules created yet</p>
              <p className="text-gray-400 text-sm">Start by creating your first module to organize lectures</p>
            </div>
          ) : (
            moduleData.map((module) => (
              <div key={module._id}>
                <ModuleCard
                  module={module}
                  isExpanded={expandedModules[module._id]}
                  onToggle={() => dispatch(toggleModuleExpand(module._id))}
                  onEdit={handleUpdateModule}
                  onDelete={handleDeleteModule}
                  onAddLecture={() => { }} // Handled inline below
                  onEditLecture={(lectureId) => {
                    console.log('Navigating to edit lecture:', lectureId, 'in course:', courseId);
                    if (!lectureId) {
                      toast.error('Lecture ID is missing');
                      return;
                    }
                    if (!courseId) {
                      toast.error('Course ID is missing');
                      return;
                    }
                    navigate(`/editlecture/${courseId}/${lectureId}`);
                  }}
                  lectures={module.lectures || []}
                />

                {/* Lecture Input for this module (shown when expanded) */}
                {expandedModules[module._id] && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 mt-2 ml-8">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter lecture title..."
                        className="flex-1 border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={lectureInputs[module._id] || ''}
                        onChange={(e) => setLectureInputs(prev => ({
                          ...prev,
                          [module._id]: e.target.value
                        }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleCreateLecture(module._id);
                          }
                        }}
                      />
                      <button
                        className="px-6 py-3 rounded-md bg-black text-white font-medium shadow hover:bg-gray-800"
                        onClick={() => handleCreateLecture(module._id)}
                        disabled={loading}
                      >
                        {loading ? <ClipLoader size={20} color="white" /> : 'Add Lecture'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Create Module Modal */}
        {showModuleModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowModuleModal(false)}
          >
            <div
              className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Module</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Introduction to Python"
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Brief description of this module..."
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    rows="3"
                    value={newModuleDescription}
                    onChange={(e) => setNewModuleDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium"
                  onClick={() => {
                    setShowModuleModal(false);
                    setNewModuleTitle('');
                    setNewModuleDescription('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-6 py-3 rounded-lg bg-black text-white font-medium shadow hover:bg-gray-800"
                  onClick={handleCreateModule}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={20} color="white" /> : 'Create Module'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateLecture;
