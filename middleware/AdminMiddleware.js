const jwt=require('jsonwebtoken');
const { Admin } = require('../db/index')
const secret="secret";


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

module.exports=adminMiddleware;