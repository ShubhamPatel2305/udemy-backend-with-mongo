const { Router } = require('express');
const { Admin, Course } = require('../db/index'); // Import Course model here
const { adminMiddleware, adminLoginMiddleware, adminAddCourseMiddleware } = require('../middleware/AdminMiddleware');
const jwt = require('jsonwebtoken');
const secret = "secret" // Use environment variable for secret

const router = Router();

// Admin Login
router.post('/login', adminLoginMiddleware, (req, res) => {
    const token = jwt.sign({ uname: req.body.uname }, secret);
    res.json({ token });
});

// Get all courses list
router.get("/courses", adminMiddleware, async (req, res) => {
    try {
        const course=await Course.find({});
        res.json(course);
    } catch (e) {
        return res.status(500).json({ message: "Cannot access courses in DB" });
    }
});

// Add a new course
router.post("/addcourse",adminMiddleware, adminAddCourseMiddleware, async (req, res) => {
    try {
        const course = new Course(req.body);
        const savedCourse = await course.save(); // Await the save operation
        res.status(201).json(savedCourse); // Return the saved course with a 201 status
    } catch (err) {
        console.error("Error adding course:", err); // Log the error for debugging
        res.status(500).json({ message: "Cannot add course to DB" });
    }
});


// Export the router
module.exports = router;
