const mongoose=require('mongoose')


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please provide Username"],
        unique:[true,"Username Exist"]
    },
    password:{
        type:String,
        required:[true,"Please provide Password"],
        unique:false
    }
})

const model=mongoose.model('User',userSchema)

module.exports=model
