const { Router } = require("express");
const jwt = require('jsonwebtoken');
const { User, Course } = require("../db/index");
const { 
    userInputValidationMiddleware,
    userSignupValidationsMiddleware,
    userLoginValidationsMiddleware,
    userValidateTokenMiddleware,
    userCourseValidationMiddleware 
} = require("../middleware/UserMiddleware");

const secret = "secret";
const router = Router();

// User Signup
router.post('/signup', userInputValidationMiddleware, userSignupValidationsMiddleware, async (req, res) => {
    // Implement user signup logic
    // All checks done, add user to db
    const user = new User(req.body);
    
    try {
        await user.save(); // Use await to save the user
        console.log(user);
        res.status(200).json({ message: "User Created" });
    } catch (err) {
        // Handle different types of errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// User Signin
router.post('/signin', userInputValidationMiddleware, userLoginValidationsMiddleware, (req, res) => {
    const token = jwt.sign({ uname: req.body.uname }, secret);
    res.status(200).json({ token });
});

// Get all courses
router.get('/courses', userValidateTokenMiddleware, async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
        
    }
});

// Purchase a course
router.post('/courses/:courseId', userValidateTokenMiddleware, async (req, res) => {
    const courseId = req.params.courseId;
    
    try {
        const course = await Course.findOne({ cid: courseId });
        if (!course) {
            return res.status(404).send("No such course found");
        }

        const token = req.headers["authorization"];
        const uname = jwt.decode(token).uname;

        const user = await User.findOne({ uname });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Check if the course has already been purchased
        const courseExist=false;
        for(let i=0;i<user.courses.length;i++){
            if(user.courses[i].courseId==courseId){
                courseExist=true;
                break;
            }
        }
        if(courseExist){
            return res.status(400).json({ message: "Course already purchased" });
        }

        // Add course to user courses array
        const courseDetails= await Course.findOne({cid:courseId});
        user.courses.push({cid:courseId, cname:courseDetails.cname, description:courseDetails.description, price:courseDetails.price }); // Ensure you push the correct structure
        await user.save();
        res.status(200).json({ message: "Course Purchased" });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get purchased courses
router.get('/   ', userValidateTokenMiddleware, async (req, res) => {
    const token = req.headers["authorization"];
    const uname = jwt.decode(token).uname;

    try {
        const user = await User.findOne({ uname });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user.courses);
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
