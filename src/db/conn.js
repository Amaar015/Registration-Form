const mongoose=require('mongoose');
const url =process.env.URL_CONNECTION;

mongoose.set('strictQuery', false);
mongoose.connect(url, {useNewUrlParser:true,useUnifiedTopology:true,
                    //    useCreateIndex:true, useFindAndModify:true  
         })
.then(()=>{
    console.log("connection created successfuly ...")
}).catch((err)=>{
    console.log(`${err} occurs`)
})

