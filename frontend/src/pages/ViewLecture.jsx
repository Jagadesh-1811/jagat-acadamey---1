import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaPlayCircle,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaArrowLeft
} from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { userData, token } = useSelector((state) => state.user);
  const selectedCourse = courseData?.find((course) => course._id === courseId);

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [completedLectures, setCompletedLectures] = useState([]);
  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const navigate = useNavigate();
  const courseCreator = userData?._id === selectedCourse?.creator ? userData : null;

  // Fetch actual modules from backend
  useEffect(() => {
    const fetchModules = async () => {
      if (courseId && token) {
        setLoadingModules(true);
        try {
          const result = await axios.get(
            `${serverUrl}/api/module/course/${courseId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const fetchedModules = result.data.modules || [];
          setModules(fetchedModules);

          // Auto-select first lecture and expand first module
          if (fetchedModules[0]?.lectures?.[0]) {
            setSelectedLecture(fetchedModules[0].lectures[0]);
            setExpandedModules({ 0: true });
          }
        } catch (error) {
          console.error('Error fetching modules:', error);
          // Fallback will be handled separately
        } finally {
          setLoadingModules(false);
        }
      }
    };

    fetchModules();
  }, [courseId, token]); // Only fetch when courseId or token changes

  // Fallback: Use course lectures if no modules found
  useEffect(() => {
    if (!loadingModules && modules.length === 0 && selectedCourse?.lectures?.length > 0) {
      const moduleMap = {};
      selectedCourse.lectures.forEach((lecture, index) => {
        const moduleNum = Math.floor(index / 3) + 1;
        const moduleKey = `Module ${moduleNum}`;
        if (!moduleMap[moduleKey]) {
          moduleMap[moduleKey] = { title: moduleKey, lectures: [], _id: `synthetic-${moduleNum}` };
        }
        moduleMap[moduleKey].lectures.push({ ...lecture, moduleNumber: moduleNum });
      });
      const fallbackModules = Object.values(moduleMap);
      setModules(fallbackModules);
      if (fallbackModules[0]?.lectures[0]) {
        setSelectedLecture(fallbackModules[0].lectures[0]);
        setExpandedModules({ 0: true });
      }
    }
  }, [loadingModules, modules.length, selectedCourse?.lectures]);


  // Fetch user progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (userData?._id && courseId) {
        try {
          const response = await axios.get(
            `${serverUrl}/api/progress/${courseId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCompletedLectures(response.data.completedLectures || []);
        } catch (error) {
          console.error("Error fetching progress:", error);
          // Don't show error toast, just continue without progress
        }
      }
    };
    fetchProgress();
  }, [userData?._id, courseId, token]);

  // Toggle module expansion
  const toggleModule = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }));
  };

  // Mark lecture as completed
  const markAsCompleted = async (lectureId) => {
    try {
      await axios.post(
        `${serverUrl}/api/progress/complete`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompletedLectures(prev => [...prev, lectureId]);
      toast.success("Lecture marked as completed!");
    } catch (error) {
      console.error("Error marking lecture as completed:", error);
      toast.error("Failed to update progress");
    }
  };

  // Calculate total course duration and progress
  const calculateModuleDuration = (lectures) => {
    // This is placeholder - you should calculate from actual lecture durations
    const minutes = lectures.length * 3.5;
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <FaArrowLeft
              className="text-black w-5 h-5 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={() => navigate("/")}
            />
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-black">
                {selectedCourse?.title}
              </h1>
              <div className="mt-1 flex gap-4 text-sm text-gray-600">
                <span>Category: {selectedCourse?.category}</span>
                <span>•</span>
                <span>Level: {selectedCourse?.level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Video Player */}
          <div className="lg:w-2/3">
            <div className="bg-white border border-black rounded-lg overflow-hidden">
              {/* Video Player */}
              <div className="aspect-video bg-black">
                {selectedLecture?.videoUrl ? (
                  <video
                    src={selectedLecture.videoUrl}
                    controls
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white text-center p-4">
                    <p>Select a lecture to start watching</p>
                  </div>
                )}
              </div>

              {/* Lecture Info */}
              <div className="p-6 border-t border-black">
                <h2 className="text-xl md:text-2xl font-bold text-black mb-2">
                  {selectedLecture?.lectureTitle || "Select a lecture"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {selectedCourse?.title}
                </p>

                {selectedLecture && !completedLectures.includes(selectedLecture._id) && (
                  <button
                    onClick={() => markAsCompleted(selectedLecture._id)}
                    className="mt-4 px-4 py-2 bg-black text-white rounded transition-colors text-sm font-medium"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>

            {/* Instructor Info - Mobile */}
            {courseCreator && (
              <div className="lg:hidden mt-6 bg-white border border-black rounded-lg p-6">
                <h3 className="text-lg font-bold text-black mb-4">Instructor</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={courseCreator.photoUrl || '/default-avatar.png'}
                    alt="Instructor"
                    className="w-16 h-16 rounded-full object-cover border-2 border-black"
                  />
                  <div>
                    <h4 className="text-base font-semibold text-black">
                      {courseCreator.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {courseCreator.description || 'No bio available.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Module List */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-black rounded-lg overflow-hidden sticky top-24">
              <div className="p-6 border-b border-black">
                <h2 className="text-xl font-bold text-black">Course Content</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {modules.length} modules • {selectedCourse?.lectures?.length || 0} lectures
                </p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {loadingModules ? (
                  <div className="flex items-center justify-center p-8">
                    <ClipLoader size={30} color="#000" />
                    <span className="ml-2 text-gray-600">Loading modules...</span>
                  </div>
                ) : modules.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>No modules available yet.</p>
                    <p className="text-sm mt-1">Content will appear here once the instructor adds lectures.</p>
                  </div>
                ) : (
                  modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="border-b border-black">
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(moduleIndex)}
                        className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 text-left">
                          <h3 className="text-base font-semibold text-black mb-1">
                            {module.title}: {module.lectures[0]?.lectureTitle?.split('-')[0] || 'Course Module'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {calculateModuleDuration(module.lectures)} | {module.completedCount} / {module.lectures.length} lectures
                          </p>
                        </div>
                        <div className="ml-4 text-black">
                          {expandedModules[moduleIndex] ? (
                            <FaChevronUp className="w-4 h-4" />
                          ) : (
                            <FaChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </button>

                      {/* Module Lectures */}
                      {expandedModules[moduleIndex] && (
                        <div className="bg-gray-50">
                          {module.lectures.map((lecture, lectureIndex) => {
                            const isCompleted = completedLectures.includes(lecture._id);
                            const isSelected = selectedLecture?._id === lecture._id;

                            return (
                              <button
                                key={lectureIndex}
                                onClick={() => setSelectedLecture(lecture)}
                                className={`w-full px-6 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors border-l-4 ${isSelected
                                  ? 'border-black bg-gray-100'
                                  : 'border-transparent'
                                  }`}
                              >
                                <div className="text-gray-700">
                                  {isCompleted ? (
                                    <FaCheckCircle className="w-5 h-5 text-black" />
                                  ) : (
                                    <FaPlayCircle className="w-5 h-5" />
                                  )}
                                </div>
                                <div className="flex-1 text-left">
                                  <p className={`text-sm font-medium ${isSelected ? 'text-black' : 'text-gray-800'
                                    }`}>
                                    {lectureIndex + 1}. {lecture.lectureTitle}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Instructor Info - Desktop */}
              {courseCreator && (
                <div className="hidden lg:block p-6 border-t border-black bg-gray-50">
                  <h3 className="text-sm font-bold text-black mb-3">Instructor</h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={courseCreator.photoUrl || '/default-avatar.png'}
                      alt="Instructor"
                      className="w-12 h-12 rounded-full object-cover border-2 border-black"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-black">
                        {courseCreator.name}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                        {courseCreator.description || 'No bio available.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLecture;
