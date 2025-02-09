import express from "express";
import userRoutes from './routes/user.js'
import dotenv  from "dotenv";


dotenv.config()


const app=express();
app.use(express.json())

// routes
app.use("/user",userRoutes)


const start = async()=>{
  try {
    app.listen({port:3000,host:"0.0.0.0"},(err,addr)=>{
        if(err){
            console.log("error starting server ", err);
            
        }
        else{
            console.log(`server started at http://localhost:3000`);
            
        }
    })
    
  } catch (error) {
    console.log(error,"error staring server",error);
    
  }
    
}

start()