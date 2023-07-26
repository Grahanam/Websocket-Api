import React,{useState} from "react"
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Auth=({setToken,setUsername})=>{
    const [username,setusername]=useState('')
    const [password,setPassword]=useState('')
    const [register,setRegister]=useState(false)
    let navigate=useNavigate()

    const Login=()=>{
        const options={
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({title:'React Hooks Post'})
        }
        const configuration = {
            method: "post",
            url: "http://localhost:4000/login",
            data: {
              username,
              password,
            },
          };
        axios(configuration)
        .then((result)=>{
            // console.log(result)
            // set the cookie
            // alert(result.data.message)
            cookies.set("TOKEN", result.data.token, {
                path: "/",
            });
            setToken(result.data.token)
            cookies.set("USER", result.data.username, {
                path: "/",
            });
            setUsername(result.data.username)
            // window.location.href = "/";
            setPassword('')
            setusername('')
            navigate('/',{replace:true})
        })
        .catch((err)=>{
            // console.log(err)
            console.log(err.response.data.message)
            alert(err.response.data.message)
        })
    }
    const Register=()=>{
        console.log(username,password)
        const configuration = {
            method: "post",
            url: "http://localhost:4000/register",
            data: {
              username,
              password,
            },
          };
        axios(configuration)
        .then((result)=>{
            console.log(result.data.message)
            alert(result.data.message)
            Login()
        })
        .catch((err)=>{
            console.log(err)
            alert(err.response.data.message)
        })
        setPassword('')
        setusername('')
    }
    
    return(
        <>
        <div className="flex items-center justify-center h-screen overflow-hidden ">
            <div className="w-72 flex flex-col">
            <h1>User Auth</h1>
            <br />
            <input className="m-1 p-1" type="text" placeholder="Enter Username ..." value={username} onChange={(e)=>setusername(e.target.value)}/>
            <input className="m-1 p-1" type="password" placeholder="Enter Password ..." value={password} onChange={(e)=>setPassword(e.target.value)} />
            {register?(
                <>
                    <button className="m-1" onClick={Register}>Register</button>
                    <div>Already User? <span onClick={()=>{
                        setRegister(!register)
                        setPassword('')
                        setusername('')
                        }} className="text-blue-500">Login</span></div>
                </>
            ):
            (<>
                <button className="m-1" onClick={Login}>Login</button>
                <div >New User? <span onClick={()=>{
                    setRegister(!register)
                    setPassword('')
                    setusername('')
                    }} className="text-blue-500">Register</span></div>
             </>
            )
            }
            </div>
            

        </div>
        </>
    )
}

export default Auth