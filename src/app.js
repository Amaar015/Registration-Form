const express= require('express');
const path=require('path')
const app=express();
const port =process.env.PORT || 3000;
const hbs=require('hbs');

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
    
app.get('*',(req,res)=>{
    res.send("Opps Page dose not exists")
})
app.listen(port,()=>{
       console.log(`listening from the port no ${port} ......`)
})