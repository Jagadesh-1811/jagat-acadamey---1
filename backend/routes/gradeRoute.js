import express from 'express';
import { assignGrade, getGradeForSubmission, getStudentGrades, getTeacherGrades, getStudentAverageGrade } from '../controllers/gradeController.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/assign', isAuth, assignGrade);
router.get('/submission/:submissionId', isAuth, getGradeForSubmission);
router.get('/student', isAuth, getStudentGrades);
router.get('/teacher', isAuth, getTeacherGrades);
router.get('/average', isAuth, getStudentAverageGrade);

export default router;