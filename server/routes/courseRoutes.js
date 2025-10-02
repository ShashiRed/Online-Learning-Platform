const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  addModule,
  addLesson,
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getCourses).post(protect, admin, createCourse);
router
  .route('/:id')
  .get(getCourseById)
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);
router.route('/:id/enroll').post(protect, enrollCourse);
router.route('/:id/modules').post(protect, admin, addModule);
router.route('/:id/modules/:moduleId/lessons').post(protect, admin, addLesson);

module.exports = router;
