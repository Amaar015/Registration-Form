const jwt =require("jsonwebtoken");
const employees=require("../models/model");

const auth=async(req,res,next)=>{
    try{
         const token = req.cookies.jwt;
         const verifyUser=jwt.verify(token, process.env.SECRET_KEY);
         console.log(verifyUser)
         const user = await employees.findOne({_id:verifyUser._id});
         console.log(user);
         req.token=token;
         req.user=user;
         next();
    }catch(err){
         res.status(404).send(err)
    }
}

module.exports=auth;