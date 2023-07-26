require("dotenv").config();
const express=require('express')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const app=express()
const http=require('http')
const server=http.createServer(app)
const {Server}=require('socket.io')
const userModel=require('./models/userModel')
const mongoose=require('mongoose')

const secretKey=process.env.secretKey

const io=new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST'],
    }
})
const cors=require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send('hello world')
})


//user endpoints
app.post("/register",async(req,res)=>{
    console.log(req.body)
    const {username,password}=req.body
    userModel.findOne({username:username})
    .then((existingUser)=>{
        if(existingUser){
            res.status(400).send({message:"Username already exists"});
        }else{
            console.log(password)
            bcrypt.hash(password,10)
            .then((hashedPassword)=>{
                const user=new userModel({
                    username:username,
                    password:hashedPassword,
                })
                user.save()
                .then((result)=>{
                    res.status(200).send({message:"User created successfully!"})
                })
                .catch((error)=>{
                    res.status(500).send({message:"Error creating User",error})
                })
            })
            .catch((e)=>{
                res.status(500).send({
                    message:"Password was not hashed successfully",e
                })
            })
        }
    })
    .catch((error)=>{
        res.status(500).send({
            message:"Error finding User",error
        })
    })
})

// app.post("/register", async (req, res) => {
//     try {
//       console.log(req.body);
//       const { username, password } = req.body;
  
//       const existingUser = await userModel.findOne({ username: username });
//       if (existingUser) {
//         return res.status(400).send({ message: "Username already exists" });
//       }
  
//       console.log(password);
//       console.log('hi')
//       const hashedPassword = await bcrypt.hash(password, 10);
//       console.log(hashedPassword)
//       console.log('hi')
//       const user = new userModel({
//         username: username,
//         password: hashedPassword,
//       });
  
//       const result = await user.save();
//       res.status(200).send({ message: "User created successfully!" });
//     } catch (error) {
//       if (error.message.includes("Password was not hashed successfully")) {
//         return res.status(500).send({
//           message: "Password was not hashed successfully",
//           error: error,
//         });
//       }
  
//       if (error.message.includes("Error finding User")) {
//         return res.status(500).send({
//           message: "Error finding User",
//           error: error,
//         });
//       }
  
//       return res.status(500).send({ message: "Error creating User", error: error });
//     }
//   });

app.post("/login",(req,res)=>{
    const {username,password}=req.body
    userModel.findOne({username:username})
    .then((User)=>{
        bcrypt.compare(password,User.password)
        .then((passwordCheck)=>{
            if(!passwordCheck){
                return res.status(400).send({message:"Password does not match!"})
            }

            const token=jwt.sign(
                {
                    userId:User._id,
                    userUsername:User.username,
                },
                secretKey,{expiresIn:"24h"}
            );
            res.status(200).send({
                message:"Login Successful",
                username:User.username,
                token,
            })
        })
        .catch((error)=>{
            res.status(400).send({
                message:"Password does not match",error
            })
        })

    })
    .catch((error)=>{
        res.status(404).send({
            message:"Username not found",error
        })
    })
})

io.use((socket,next)=>{
    try{
        const token=socket.handshake.auth.token
        if(!token){
            throw new Error('Authentication Failed')
        }
        const decoded=jwt.verify(token,secretKey)
        // console.log(decoded)
        socket.auth={user:decoded.userUsername}
        next();
    }catch(error){
        return next(new Error('Authentication failed.'))
    }
})

io.on('connection',(socket)=>{
    socket.on('joystickmove',(data)=>{
        // console.log('joystick movement',data)
        io.emit('joystickmove',data)
    })
    console.log('User connected:',socket.auth.user)
    socket.on('disconnect',()=>{
        console.log('User disconnected:',socket.auth.user)
    })
})

server.listen(4000,()=>{
    console.log('listening on port :4000')
})

//Mongdb Connection
const uri=process.env.mongodburl
const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(uri,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })


