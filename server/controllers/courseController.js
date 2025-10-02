const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Admin
const createCourse = async (req, res) => {
  const { title, description, category, thumbnail, tags } = req.body;

  try {
    const course = new Course({
      title,
      description,
      category,
      thumbnail,
      tags,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Admin
const updateCourse = async (req, res) => {
  const { title, description, category, thumbnail, tags } = req.body;

  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      course.title = title;
      course.description = description;
      course.category = category;
      course.thumbnail = thumbnail;
      course.tags = tags;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      await course.remove();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollCourse = async (req, res) => {
  try {
    const User = require('../models/User');
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user.id);

    // Check if already enrolled
    if (user.enrolledCourses.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(req.params.id);
    await user.save();

    res.json({ message: 'Successfully enrolled in course', enrolledCourses: user.enrolledCourses });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a module to a course
// @route   POST /api/courses/:id/modules
// @access  Admin
const addModule = async (req, res) => {
  const { title } = req.body;
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      const newModule = {
        title,
        lessons: [],
      };
      course.modules.push(newModule);
      await course.save();
      res.status(201).json(course.modules);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a lesson to a module
// @route   POST /api/courses/:id/modules/:moduleId/lessons
// @access  Admin
const addLesson = async (req, res) => {
  const { title, videoUrl } = req.body;
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      const module = course.modules.id(req.params.moduleId);
      if (module) {
        const newLesson = {
          title,
          videoUrl,
        };
        module.lessons.push(newLesson);
        await course.save();
        res.status(201).json(module.lessons);
      } else {
        res.status(404).json({ message: 'Module not found' });
      }
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  addModule,
  addLesson,
};
