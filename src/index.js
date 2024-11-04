const express=require("express");
const Redis=require("ioredis");
const Queue=require("bull");

const queue=new Queue("email",{
    redis:{
        port:6379,
        host: '127.0.0.1'
    }
})



async function createQueueAddJob(){
    try{

        await queue.add({data:1233},{
            delay:2000,
            attempts:3,
            removeOnComplete:true,
            BackoffOpts:{
                type:"exponential",
                delay:2000
            }
        });

        await queue.add({data:1234},{
            delay:5000,
            attempts:3,
            removeOnComplete:true,
            BackoffOpts:{
                type:"exponential",
                delay:2000
            }
        })
    }
    catch(error){
        console.error("Error in queue adding:",error)
    }
}

createQueueAddJob()


function processJob(){
    queue.process(async(job)=>{
        console.log("Queue process job called:",job.data)
    })
}
processJob()

const app=express();





app.get("/",(req,res)=>{
    return res.json({message:"Welocme to the application"});
})




app.listen(3100,()=>{
    console.log("Server started at host:http://localhost:3100");
})


