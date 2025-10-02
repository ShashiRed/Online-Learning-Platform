const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getEnrolledCourses,
  markLessonComplete,
  getCourseProgress,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/enroll', protect, enrollInCourse);
router.get('/enrolled-courses', protect, getEnrolledCourses);
router.post('/progress', protect, markLessonComplete);
router.get('/progress/:courseId', protect, getCourseProgress);

module.exports = router;
