import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';


const MonthlyQuiz = () => {
    const { userData, token } = useSelector((state) => state.user);
    const [quiz, setQuiz] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isQuizActive, setIsQuizActive] = useState(false);
    const [isQuizClosed, setIsQuizClosed] = useState(false);
    const [isLastDayOfMonth, setIsLastDayOfMonth] = useState(false);

    const countdownTimerRef = useRef(null);

    useEffect(() => {
        const checkDateAndFetchQuiz = async () => {
            if (!userData || !userData.enrolledCourses || userData.enrolledCourses.length === 0) {
                setQuiz(null);
                setIsLastDayOfMonth(false);
                return;
            }
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth(); // 0-indexed
            const lastDay = new Date(year, month + 1, 0).getDate(); // Get last day of current month

            if (today.getDate() === lastDay && month !== 1) { // month 1 is February
                setIsLastDayOfMonth(true);

                if (Array.isArray(userData?.enrolledCourses) && userData.enrolledCourses.length > 0) {
                    let foundQuiz = null;
                    let latestSchedule = null;

                    for (const course of userData.enrolledCourses) {
                        try {
                            const { data } = await axios.get(`${serverUrl}/api/quiz/course/${course._id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            
                            const courseMonthlyQuiz = data.quizzes.find(q => {
                                const quizScheduleDate = new Date(q.schedule);
                                return quizScheduleDate.getDate() === lastDay && quizScheduleDate.getMonth() === month;
                            });

                            if (courseMonthlyQuiz) {
                                const currentQuizSchedule = new Date(courseMonthlyQuiz.schedule);
                                if (!latestSchedule || currentQuizSchedule.getTime() > latestSchedule.getTime()) {
                                    latestSchedule = currentQuizSchedule;
                                    foundQuiz = courseMonthlyQuiz;
                                }
                            }
                        } catch (error) {
                            console.error(`Error fetching quizzes for course ${course._id}:`, error);
                            // Continue to next course even if one fails
                        }
                    }

                    if (foundQuiz) {
                        setQuiz(foundQuiz);
                        // Clear previous countdown interval before starting a new one
                        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
                        countdownTimerRef.current = startCountdown(new Date(foundQuiz.schedule));
                    } else {
                        setQuiz(null);
                        // Clear any existing countdown if no quiz is found
                        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
                        setTimeRemaining(0);
                        setIsQuizActive(false);
                        setIsQuizClosed(false);
                    }

                } else {
                    setQuiz(null);
                    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
                    setTimeRemaining(0);
                    setIsQuizActive(false);
                    setIsQuizClosed(false);
                }
            } else {
                setIsLastDayOfMonth(false);
                setQuiz(null);
                if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
                setTimeRemaining(0);
                setIsQuizActive(false);
                setIsQuizClosed(false);
            }
        };

        const startCountdown = (scheduleDate) => {
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current); // Clear previous timer

            const updateCountdown = () => {
                const now = new Date();
                const quizStartTime = new Date(scheduleDate);
                quizStartTime.setHours(22, 0, 0, 0); // Set to 10 PM on the scheduled day
                const quizEndTime = new Date(scheduleDate);
                quizEndTime.setHours(23, 0, 0, 0); // Set to 11 PM on the scheduled day

                const diffToStart = quizStartTime.getTime() - now.getTime();
                const diffToEnd = quizEndTime.getTime() - now.getTime();

                if (diffToStart > 0) {
                    setTimeRemaining(diffToStart);
                    setIsQuizActive(false);
                    setIsQuizClosed(false);
                } else if (diffToEnd > 0) {
                    setTimeRemaining(diffToEnd);
                    setIsQuizActive(true);
                    setIsQuizClosed(false);
                } else {
                    setTimeRemaining(0);
                    setIsQuizActive(false);
                    setIsQuizClosed(true);
                    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current); // Quiz closed, stop countdown
                }
            };

            updateCountdown(); // Initial call
            countdownTimerRef.current = setInterval(updateCountdown, 1000);
            return countdownTimerRef.current; // Return the interval ID for cleanup
        };

        checkDateAndFetchQuiz();
        const fetchInterval = setInterval(checkDateAndFetchQuiz, 60 * 60 * 1000); // Check for quiz every hour

        return () => {
            clearInterval(fetchInterval);
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        };
    }, [userData?.enrolledCourses]);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!isLastDayOfMonth || !quiz) {
        return null; // Don't render if not the last day or no quiz found
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-lg shadow-xl mb-8 mx-auto max-w-4xl"
        >
            <h2 className="text-3xl font-extrabold text-center mb-4">Quiz of the Month!</h2>
            <p className="text-center text-lg mb-6">Join the Monthly Quiz (10PM–11PM)</p>

            <div className="bg-white bg-opacity-10 p-4 rounded-md mb-4">
                <p className="text-lg font-semibold">Instructions: <span className="font-normal">{quiz?.instructions}</span></p>
                <p className="text-lg font-semibold">Rewards: <span className="font-normal">{quiz?.rewards}</span></p>
                <p className="text-lg font-semibold">Scheduled: <span className="font-normal">{quiz?.schedule ? new Date(quiz.schedule).toLocaleString() : 'N/A'}</span></p>
            </div>

            <div className="text-center mb-6">
                {isQuizClosed ? (
                    <motion.button
                        className="bg-gray-500 text-white font-bold py-3 px-8 rounded-full text-xl cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled
                    >
                        Quiz Closed
                    </motion.button>
                ) : (
                    <motion.button
                        className={`font-bold py-3 px-8 rounded-full text-xl ${isQuizActive ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 cursor-not-allowed'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => isQuizActive && window.open(quiz?.quizLink, '_blank')}
                        disabled={!isQuizActive}
                    >
                        {isQuizActive ? "Start Quiz Now!" : `Starts in ${formatTime(timeRemaining)}`}
                    </motion.button>
                )}
            </div>

            {isQuizClosed && quiz?.liveSessionLink && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-center mt-4"
                >
                    <p className="text-lg">Join the post-quiz discussion:</p>
                    <a
                        href={quiz?.liveSessionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:underline text-xl font-semibold"
                    >
                        Live Session Link
                    </a>
                </motion.div>
            )}
        </motion.div>
    );
};

export default MonthlyQuiz;
