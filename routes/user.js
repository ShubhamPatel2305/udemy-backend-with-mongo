const { Router } = require("express");
const router = Router();
const { User,Course } = require("../db/index");
const {userSignupValidationsMiddleware}= require("../middleware/UserMiddleware");

// User Routes
router.post('/signup', userSignupValidationsMiddleware, (req, res) => {
    // Implement user signup logic
    //all checks done add user to db
    const user=new User(req.body);
    user.save((err,user)=>{
        if(err){
            return res.status(500).json({message:"Internal Server Error"});
        }
        res.status(200).json({message:"User Created"});
    });
});

router.post('/signin', (req, res) => {
    // user login uses uname and pass
});

router.get('/courses', (req, res) => {
    // Implement listing all courses logic
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
});

module.exports = router