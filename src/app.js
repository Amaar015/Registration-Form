// to include env file
require('dotenv').config();
const express= require('express');
const path=require('path')
const app=express();
// to initialize the port variable to env value from the env file
const port =process.env.PORT ;
// to include the handle bars
const hbs=require('hbs');
// to encrypt the password or secure data 
const bcrypt=require('bcryptjs');
const cookieparser=require("cookie-parser")
// to use auth methode
const auth=require('./midleware/auth');
// to include  database connection
require("./db/conn")
// to include/require the database schema
const Customer=require('./models/model')
// use to resolve the json formate
app.use(express.json())
// use to get the html value from inputs
app.use(express.urlencoded({extended:false}))
// using a cookies
app.use(cookieparser());
// select the path values
const templatePath=path.join(__dirname,'../template/views')
const partialsPath=path.join(__dirname,'../template/partials');
const static_path=path.join(__dirname,'../public')
app.use(express.static(static_path))
//  to set view engine
app.set('view engine','hbs');
// to register the partials
hbs.registerPartials(partialsPath);
app.set('views',templatePath);

// console.log(process.env.SECRET_KEY);

    app.get('/',(req,res)=>{
        res.render('index');
        })
        
    app.get('/secret',auth,(req,res)=>{
        console.log("this is the awesome cookies "+req.cookies.jwt);
        res.render('secret');
        })
    app.get('/about',auth,(req,res)=>{
        res.render('about');
        })
    app.get('/register',(req,res)=>{
        res.render('register');
        })

        // to get the user data and store it into the database
        app.post('/register',async(req,res)=>{
       try{
        const password=req.body.password;
        const cpassword=req.body.Cpassword;
        // === is used to comparrision of value and as well as datatype of the text
        if(password===cpassword){
                const registeremployee= new Customer({
                    first_name:req.body.fname,
                    Last_name:req.body.lname,
                    User_name:req.body.fname+" "+req.body.lname,
                    email:req.body.email,
                    Phone:req.body.phone,
                    password:req.body.password,
                    Confirmpassword:req.body.Cpassword
                }) 
                // to genrate the token by using the middle ware from models file generatetoken
                const token= await registeremployee.generateAutoToken();
                // console.log(`the token is ${token}`)
                 
                // use jwt cookies to store the token into the cookies
                res.cookie("jwt",token,{
                    //  expires to give the time from the date now and to give time in ms token in this time period the token is expires
                    expires:new Date(Date.now()+ 30000),
                    httpOnly:true
                });
                // console.log(cookie);

                const registered=await registeremployee.save();
                // console.log(`the token is ${registered}`)
                
                // alert("Employee data Saved")
                res.status(201).render("index")
      
            }else{
           res.send("Sorry! Password dose not match")
        }
           }catch(err){
          res.status(401).send(err)
          console.log("the page contain error")
       }  
    
        
        })
        
        app.get('/login',(req,res)=>{
            res.render('login');
    
            })
            app.get('/show',async(req,res)=>{
                res.render('show');
            })
            

            app.get('/logout',auth, async(req,res)=>{
                try{
                    req.user.tokens=req.user.tokens.filter((currElement)=>{
                        return currElement.token != req.token;
                    })
                    res.clearCookie("jwt");
                    console.log("Logout successfully");
                    await req.user.save();
                    res.render("login")
                }catch(err){
                    res.status(500).send(err);
                }
            })


        app.get('*',(req,res)=>{
    res.send("Opps Page dose not exists")
})


// authentication
// const jwt =require('jsonwebtoken');
// const createToken=async()=>{
//     const token =await jwt.sign({_id:"63b697dd7b7038e13936fc02"},"helloiamamaarhussnainrazaandhowareyou",{
//         expiresIn:"2 seconds"
//     })
     
//     // console.log(token);
//     const userVerify=await jwt.verify(token,"helloiamamaarhussnainrazaandhowareyou")
//     console.log(userVerify);
// }
// createToken();
// check validation
 app.post('/login',async(req,res)=>{
    try{
        const email=req.body.emails;
        const password=req.body.passwords;
        const useremail=await Customer.findOne({email})
        
        const isMatch=await bcrypt.compare(password,useremail.password)
        const token= await useremail.generateAutoToken();
                console.log(`the token is ${token}`)
                
                res.cookie("jwt",token,{
                    expires:new Date(Date.now()+ 3000000),
                    httpOnly:true
                });
        if(isMatch){
            res.status(201).render('index');
        }else{
            res.send("Email or Password is invalid")
        }
    }catch(err){
        res.status(404).send("Email or Password is invalid")
    }
 })


//  logout page


app.listen(port,()=>{
       console.log(`listening from the port no ${port} ......`)
})