const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /api/users/enroll
// @access  Private (Student)
const enrollInCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id; // From protect middleware

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: 'User or Course not found' });
    }

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: 'Enrolled in course successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get enrolled courses for a user
// @route   GET /api/users/enrolled-courses
// @access  Private (Student)
const getEnrolledCourses = async (req, res) => {
  const userId = req.user._id; // From protect middleware

  try {
    const user = await User.findById(userId).populate('enrolledCourses');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.enrolledCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark a lesson as complete
// @route   POST /api/users/progress
// @access  Private (Student)
const markLessonComplete = async (req, res) => {
  const { courseId, lessonId } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is enrolled in the course
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'You are not enrolled in this course' });
    }

    // Find or create progress entry for this course
    let courseProgress = user.courseProgress.find(
      (progress) => progress.courseId.toString() === courseId
    );

    if (!courseProgress) {
      user.courseProgress.push({
        courseId: courseId,
        completedLessons: [lessonId],
      });
    } else {
      // Check if lesson is already marked as complete
      if (!courseProgress.completedLessons.includes(lessonId)) {
        courseProgress.completedLessons.push(lessonId);
      }
    }

    await user.save();
    res.status(200).json({ message: 'Lesson marked as complete', courseProgress: user.courseProgress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get progress for a specific course
// @route   GET /api/users/progress/:courseId
// @access  Private (Student)
const getCourseProgress = async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const courseProgress = user.courseProgress.find(
      (progress) => progress.courseId.toString() === courseId
    );

    if (!courseProgress) {
      return res.status(200).json({ completedLessons: [] });
    }

    res.status(200).json(courseProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  enrollInCourse,
  getEnrolledCourses,
  markLessonComplete,
  getCourseProgress,
};
