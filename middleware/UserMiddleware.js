const {User, Course}= require('../db/index')
const jwt=require('jsonwebtoken');
const z=require('zod');
const secret="secret";

const userSchema=z.object({
    uname:z.string().min(4),
    pass:z.string().min(8)
});

function userInputValidationMiddleware(req,res,next){
    // input validations
    const result=userSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({message:"Invalid Input"});
    }
    next();
}

function userSignupValidationsMiddleware(req,res,next){
    // check if user already exists
    const uname=req.body.uname;
    const user=User.findOne({uname});
    if(user){
        return res.status(400).json({message:"User Already Exists"});
    }
    next();
}

function userLoginValidationsMiddleware(req,res,next){
    //check if user exists in db by checking both uname and pass
    const uname=req.body.uname;
    const pass=req.body.pass;
    const user=User.findOne({uname,pass});
    if(!user){
        return res.status(400).json({message:"Invalid Credentials"});
    }
    next();
}

//middleware to verify that user trying to get course list has valid jwt token and that token user exists in db
function userValidateTokenMiddleware(req,res,next){
    const token=req.headers["authorization"];
    if(!token){
        res.status(404).send("No token is given in headers");
    }
    jwt.verify(token,secret,(err,data)=>{
        if(err){
            res.status(404).send("Invalid Token");
        }
        const uname=data.uname;
        const user=User.findOne({uname});
        if(!user){
            res.status(404).send("User does not exist");
        }
        next();
    });
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
    userInputValidationMiddleware,
    userSignupValidationsMiddleware,
    userLoginValidationsMiddleware,
    userValidateTokenMiddleware,
    userCourseValidationMiddleware
};