const {User, Course}= require('../db/index')
const jwt=require('jsonwebtoken');
const z=require('zod');
const secret="secret";

const userSchema=z.object({
    uname:z.string().min(4),
    pass:z.string().min(8)
});

function userValidationsMiddleware(req,res,next){
    // input validations
    const result=userSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({message:"Invalid Input"});
    }
    next();
}

function userCourseValidationMiddleware(req,res,next){
    // input validations
    if(!req.body.cid){
        return res.status(400).json({message:"Invalid Input"});
    }

    //check is cid enered is valid i.e a course with that cid exists
    Course.findOne({cid:req.body.cid},(err,course)=>{
        if(err || !course){
            return res.status(400).json({message:"Invalid Course"});
        }
        next();
    });
}

//export
module.exports={
    userValidationsMiddleware,
    userCourseValidationMiddleware
};