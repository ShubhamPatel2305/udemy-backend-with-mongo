const { User, Course } = require('../db/index');
const jwt = require('jsonwebtoken');
const z = require('zod');
const secret = "secret";

const userSchema = z.object({
    uname: z.string().min(4),
    pass: z.string().min(8)
});

function userInputValidationMiddleware(req, res, next) {
    // Input validations
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: "Invalid Input" });
    }
    next();
}

async function userSignupValidationsMiddleware(req, res, next) {
    // Check if user already exists
    const uname = req.body.uname;
    try {
        const user = await User.findOne({ uname });
        if (user) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function userLoginValidationsMiddleware(req, res, next) {
    // Check if user exists in db by checking both uname and pass
    const { uname, pass } = req.body;
    try {
        const user = await User.findOne({ uname, pass });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Middleware to verify that user trying to get course list has valid JWT token and that token user exists in db
async function userValidateTokenMiddleware(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(404).send("No token is given in headers");
    }
    
    jwt.verify(token, secret, async (err, data) => {
        if (err) {
            return res.status(404).send("Invalid Token");
        }
        
        const uname = data.uname;
        try {
            const user = await User.findOne({ uname });
            if (!user) {
                return res.status(404).send("User does not exist");
            }
            next();
        } catch (err) {
            return res.status(500).send("Internal Server Error");
        }
    });
}

function userCourseValidationMiddleware(req, res, next) {
    // Input validations
    if (!req.body.cid) {
        return res.status(400).json({ message: "Invalid Input" });
    }

    // Check if cid entered is valid i.e. a course with that cid exists
    Course.findOne({ cid: req.body.cid }, (err, course) => {
        if (err || !course) {
            return res.status(400).json({ message: "Invalid Course" });
        }
        next();
    });
}

// Export
module.exports = {
    userInputValidationMiddleware,
    userSignupValidationsMiddleware,
    userLoginValidationsMiddleware,
    userValidateTokenMiddleware,
    userCourseValidationMiddleware
};
