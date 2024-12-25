const express = require('express');
const router = express.Router();

router.post('/foodData',(req,res)=>{
    try{
       console.log(global.appetite_items);
       res.send([global.appetite_items, global.appetiteCategory])
    }catch(error){
       console.error(error.message);
       res.send("Server Error");
    }
})

module.exports=router;