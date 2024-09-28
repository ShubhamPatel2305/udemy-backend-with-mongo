const user={
    uid: 1,
    uname: "user1",
    pass: "password",
    courses: [
        {
            courseId: 1,
            cname: "course1",
            description: "description1",
            price: 100
        },
        {
            courseId: 2,
            cname: "course2",
            description: "description2",
            price: 200
        }
    ]
}


//check if user has a course of course id 3 in its array of courses or not
let courseId=3;
let courseExists=false;
for(let i=0;i<user.courses.length;i++){
    if(user.courses[i].courseId===courseId){
        courseExists=true;
        break;
    }
}