const {Router}=require('express');
const {Admin}=require('../db/index');
const {adminMiddlewar, adminLoginMiddleware, adminAddCourseMiddleware}=require('../middleware/AdminMiddleware');
const jwt=require('jsonwebtoken');
const secret="secret";

const router=Router();

// Admin Login
router.post('/login',adminLoginMiddleware,(req,res)=>{
    const token=jwt.sign({uname:req.body.uname},secret);
    res.json({token});
});

//get all courses list
router.get("/courses",adminMiddlewar,(req,res)=>{
    Course.find({},(err,courses)=>{
        if(err){
            return res.status(500).json({message:"Cannot access courses in db"});
        }
        res.json(courses);
    });
});

//add a new course
router.post("/addcourse",adminAddCourseMiddleware,(req,res)=>{
    const course=new Course(req.body);
    course.save((err,course)=>{
        if(err){
            return res.status(500).json({message:"Cannot add course to db"});
        }
        res.json(course);
    });
});

module.exports=router;