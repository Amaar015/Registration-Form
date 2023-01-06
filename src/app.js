const express= require('express');
const path=require('path')
const app=express();
const port =process.env.PORT || 3000;
const hbs=require('hbs');
// database connection
require("./db/conn")
const Customer=require('./models/model')
app.use(express.json())
app.use(express.urlencoded({extended:false}))

const templatePath=path.join(__dirname,'../template/views')
const partialsPath=path.join(__dirname,'../template/partials');
const static_path=path.join(__dirname,'../public')
app.use(express.static(static_path))
//  to set view engine
app.set('view engine','hbs');
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
                const registered=await registeremployee.save();
                alert("Employee data Saved")
                res.status(201).render("index")
      
            }else{
           res.send("Sorry! Password dose not match")
        }
           }catch(err){
          res.status(401).send(err)
       }  
    
        
        })
        
        app.get('/login',(req,res)=>{
            res.render('login');
    
            })
        app.get('*',(req,res)=>{
    res.send("Opps Page dose not exists")
})

// check validation
 app.post('/login',async(req,res)=>{
    try{
        const email=req.body.emails;
        const password=req.body.passwords;
        const useremail=await Customer.findOne({email})
        
        if(useremail.password===password){
            res.status(201).render('index');
        }else{
            res.send("Email or Password is invalid")
        }
    }catch(err){
        res.status(404).send("Invalid Email Adress")
    }
 })


app.listen(port,()=>{
       console.log(`listening from the port no ${port} ......`)
})