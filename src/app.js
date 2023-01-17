const express= require('express');
const path=require('path')
const app=express();
const port =process.env.PORT || 3000;
const hbs=require('hbs');
const bcrypt=require('bcryptjs');
// database connection
require("./db/conn")
// require the database schema
const Customer=require('./models/model')
// use to resolve the json formate
app.use(express.json())
// use to get the html value from inputs
app.use(express.urlencoded({extended:false}))

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

    app.get('/',(req,res)=>{
        res.render('index');
        })
    app.get('/about',(req,res)=>{
        res.render('about');
        })
    app.get('/register',(req,res)=>{
        res.render('register');
        })
        app.post('/register',async(req,res)=>{
       try{
        const password=req.body.password;
        const cpassword=req.body.Cpassword;
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
                const token= await registeremployee.generateAutoToken();
                console.log(`the token is ${token}`)
                const registered=await registeremployee.save();
                console.log(`the token is ${token}`)
                
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
        if(isMatch){
            res.status(201).render('index');
        }else{
            res.send("Email or Password is invalid")
        }
    }catch(err){
        res.status(404).send("Email or Password is invalid")
    }
 })


app.listen(port,()=>{
       console.log(`listening from the port no ${port} ......`)
})