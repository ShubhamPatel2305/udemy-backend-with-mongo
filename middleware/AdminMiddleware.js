const jwt=require('jsonwebtoken');
const { Admin, Course } = require('../db/index')
const secret="secret";
const z=require('zod');

const adminSchema=z.object({
    uname:z.string().min(4),
    pass:z.string().min(8)
});

const courseSchema=z.object({
    cname:z.string().min(4),
    description:z.string().min(4),
    price:z.number().min(0)
})

function adminLoginMiddleware(req,res,next){
    // input validations
    const result=adminSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({message:"Invalid Input"});
    }
    next();
}


async function adminMiddleware(req,res,next){
    // input validations: 
    // check if token is present
    if(!req.headers.authorization){
        return res.status(401).json({message:"Token Absent"});
    }

    // check if token is valid using our secret 
    const token=req.headers['authorization'];
    jwt.verify(token,secret, async(err, data)=>{
        if(err){
            return res.status(401).json({message:"Invalid Token"});
        }

        // check if user is admin
        const admin=await Admin.findOne({uname:data.uname});
        if(!admin){
            return res.status(401).json({message:"Unauthorized User"});
        }
        // if all checks pass, proceed to next middleware
        next();
    });
}

async function adminAddCourseMiddleware(req,res,next){
    //validate course details input
    const result=courseSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({message:"Invalid Input"});
    }

    //check if course with same name already exists
    const cname=req.body.cname;
    const course= await Course.findOne({
        cname
    });
    if(course){
        return res.status(400).json({message:"Course already exists"});
    }
    next();
}

module.exports={adminMiddleware, adminLoginMiddleware,adminAddCourseMiddleware};