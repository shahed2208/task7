const isAuthorized = async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      const course = await Course.findById(courseId);
  
      if (!course) {
        return res.status(404).json({ message: 'THIS LESSON IS NOT EXSIST' });
      }
  
      if (course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'you are NOT ALLOWED TO EDIT THIS LESSON' });
      }
  
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'wrong!' });
    }
  };