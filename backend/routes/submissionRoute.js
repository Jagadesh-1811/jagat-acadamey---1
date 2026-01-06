
import express from 'express';
import { getSubmissions, submitAssignment } from '../controllers/submissionController.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/submit', isAuth, submitAssignment);
router.get('/:assignmentId', isAuth, getSubmissions);

export default router;
