const { findById } = require("../models/user");
const User = require("../models/user");
exports.userRegisterValidator =(req,res,next) => {
    // user name is not null
    req.check ("username","Username is required").notEmpty(); 

    //email is not null 
    req.check("email" , "email is required").notEmpty();
    req.check("email","Invalid Email").isEmail();

    //check password

    req.check ("password", "Password is required").notEmpty();
    req.check("password").isLength({min: 6}).withMessage("password must contain at least 6 character");

    req.check("password","Password must contain  One uppercase, one lower case,one number, one special").matches( /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,}$/, "i");

    //check error
    const errors = req.validationErrors();
    //if error show the first one as it happens
    if(errors){
        const firstError = errors.map((err) => err.msg)[0];
        return res.status(400).json({
            error: firstError,
        });
    }
    //process to next midd
    next();
};

exports.userById = async (req,res,next) => {
    User.findById(req._id).exec((err, user) => {
        if(err || !user) {
            return res.status(404).json({
                error : "User not found",
            });
        }
        //add user bobj in req with all user info
        req.user = user;
        next();
    });
}