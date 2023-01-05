const mongoose=require("mongoose");
const validator=require("validator")


const EmployeeSchema=new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
        minlength:3
    },
    Last_name:{
        type:String,
        required:true,
        minlength:3
    },
    User_name:{
        type:String,
        required:true,
        default:""
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Email is already present! please enter new email Id"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is Invalid")
            }
        }
        },
    Phone:{
        type:Number,
        // min:11,
        // max:11,
        required:true,
        // unique:true,
    },
    password:{
        type:String,
        required:true,
    },
       Confirmpassword:{
        type:String,
        required:true,
    }
})

// create a new collection 

const employees=new mongoose.mongoose.model("employees",EmployeeSchema);

module.exports=employees;