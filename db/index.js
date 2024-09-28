const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose); 

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:admin@cluster0.6c3q0.mongodb.net/udemy_clone", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Admin Schema
const AdminSchema = new mongoose.Schema({
    uname: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    pass: {
        type: String,
        required: true,
        minlength: 8
    }
});

// Course Schema
const CourseSchema = new mongoose.Schema({
    cid: {  // Define manually before plugin
        type: Number
    },
    cname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

// Apply auto-increment plugin to cid after defining it
CourseSchema.plugin(autoIncrement, {
    id: 'course_counter',
    inc_field: 'cid',
    start_seq: 1
});

// User Schema
const UserSchema = new mongoose.Schema({
    uid: {  // Define manually before plugin
        type: Number
    },
    uname: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    pass: {
        type: String,
        required: true,
        minlength: 8
    },
    courses: [
        {
            courseId: {
                type: Number,
                ref: 'Course',
                required: true
            },
            cname: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ]
});

// Apply auto-increment plugin to uid after defining it
UserSchema.plugin(autoIncrement, {
    id: 'user_counter',
    inc_field: 'uid',
    start_seq: 1
});

// Models
const Admin = mongoose.model('Admins', AdminSchema);
const Course = mongoose.model('Courses', CourseSchema);
const User = mongoose.model('Users', UserSchema);

module.exports = { Admin, Course, User };
