import express from 'express';
import { getCourseProgress, markLectureCompleted, getStudentProgress, updateLastAccessed } from '../controllers/progressController.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

// Get progress for a specific course
router.get('/:courseId', isAuth, getCourseProgress);

// Mark a lecture as completed
router.post('/complete', isAuth, markLectureCompleted);

// Get all progress for the authenticated student
router.get('/student/all', isAuth, getStudentProgress);

// Update last accessed lecture
router.post('/update-access', isAuth, updateLastAccessed);

export default router;
