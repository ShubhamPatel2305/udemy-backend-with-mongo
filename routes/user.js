const { Router } = require("express");
const router = Router();
const { User,Course } = require("../db/index");
const {userInputValidationMiddleware,userSignupValidationsMiddleware,userLoginValidationsMiddleware, userValidateTokenMiddleware, userCourseValidationMiddleware}= require("../middleware/UserMiddleware");

// User Routes
router.post('/signup',userInputValidationMiddleware ,userSignupValidationsMiddleware, (req, res) => {
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

router.post('/signin',userInputValidationMiddleware,userLoginValidationsMiddleware, (req, res) => {
    // all checks done generate token and send
    const token=jwt.sign({uname:req.body.uname},secret);
    res.status(200).json({token});
});

router.get('/courses', userValidateTokenMiddleware, (req, res) => {
    //token verification done by middleware just display courses
    Course.find({},(err,courses)=>{
        if(err){
            return res.status(500).json({message:"Internal Server Error"});
        }
        res.status(200).json(courses);
    });
});

router.post('/courses/:courseId', userValidateTokenMiddleware, (req, res) => {
    //user token verification done
    //course purchase logic first check if course exists if exists store all course dataand add it to user 
    //courses array and user token verification is already done
    const courseId=req.params.courseId;
    Course.findOne({cid:courseId},(err,data)=>{
        if(err || !data){
            res.status(404).send("No such course found");
        }
        //check if user is already purchased this course, no need of jwt token verification
        const token=req.headers["authorization"];
        const uname=jwt.decode(token).uname;
        const user=User.findOne({uname});
        let courseExists=false;
        for(let i=0;i<user.courses.length;i++){
            if(user.courses[i].cid===courseId){
                courseExists=true;
                break;
            }
        }
        if(courseExists){
            res.status(400).send("Course already purchased");
        }
        //add course to user courses array
        user.courses.push(data);
        user.save((err,user)=>{
            if(err){
                return res.status(500).json({message:"Internal Server Error"});
            }
            res.status(200).json({message:"Course Purchased"});
        });
    })
    
});

router.get('/purchasedCourses', userValidateTokenMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
    //user token verification done
    const token=req.headers["authorization"];
    const uname=jwt.decode(token).uname;
    const user=User.findOne({uname});
    res.status(200).json(user.courses);
});

module.exports = router