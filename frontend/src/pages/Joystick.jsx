import React,{ useState,useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser} from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie'
import { Joystick } from 'react-joystick-component';
import axios from 'axios'

// import './App.css'

import io from 'socket.io-client'

// const socket=io.connect('http://localhost:4000')

function joystick({username,token,setUsername,setToken}) {
  const [socket,setSocket]=useState(null)
  const [Data,setData]=useState([])
  const navigate=useNavigate()
  const cookies=new Cookies()
  
  const handleMove=(event)=>{
    const {x,y,direction,distance}=event
      const data={x:x,y:y,direction:direction,distance:distance}
      // console.log(data)
      if(socket){
        socket.emit('joystickmove',data)
      }
  }

  const logout=()=>{
    cookies.remove("TOKEN",{path:"/"});
    cookies.remove("USER",{path:"/"});
    setUsername('')
    navigate('/auth')
    // window.location.href="/" 
    }
  const disconnect=()=>{
    socket.disconnect()
    setSocket(null)
    setData([])
    console.log('Socket.Io server disconnected.....')
  }  
  const connect=()=>{
    const newSocket=io('http://localhost:4000',{
        auth:{token:token},
        extraHeaders:{Authorization:`Bearer ${token}`}
    })
    setSocket(newSocket)
  }
  // useEffect(()=>{
  //   const newSocket=io('http://localhost:4000',{
  //       auth:{token:token},
  //       extraHeaders:{Authorization:`Bearer ${token}`}
  //   })

  //   setSocket(newSocket)
  //   return ()=>{
  //       newSocket.disconnect()
  //       console.log('hi')
  //   }
  // },[])  

  // useEffect(()=>{
  //   const handleJoystickMove=(event)=>{
  //     const {x,y}=event
  //     const data={x:x,y:y}
  //     console.log(data)
      // if(socket){
      //   socket.emit('mousemove',data)
      // }
    // }
    // window.addEventListener('handleMove',handleJoystickMove)
    // window.addEventListener('mousemove',handleMouseMove)
    // return()=>{
    //   window.removeEventListener('mousemove',handleMouseMove)
    // }
  // },[socket])

  useEffect(()=>{
    if(socket){
       socket.on('connect',()=>{
        console.log('connected to socket.IO server.....')
        socket.on('joystickmove',handleReceiveJoystickMove)
       })
    }
    const handleReceiveJoystickMove=(data)=>{
      // console.log('Receive joystick move data',data)
      setData(data)
    }
  },[socket,Data])
  return (
    <>
        <div className='flex flex-row items-center justify-between p-2'>
            <div>
                <button className=" rounded-full py-2 px-3 flex items-center" >
                    <i ><FontAwesomeIcon icon={faUser} className=" text-white mr-2"/></i>    
                      <p className='text-white font-semibold mr-3 hover:underline'>{username}</p>
                </button>
            </div>        
                    
            <div><button onClick={logout} className='rounded-full'>Logout</button></div>
        </div>
        <br/>  
        <div className='flex flex-col items-center justify-center text-center'>
            <button onClick={socket?(disconnect):(connect)} className={`rounded-full ${socket ? 'text-red-500':'text-green-500'}`}> {socket?(<>Disconnect</>):(<>Connect</>)}</button>
            <h4 className='p-3'>Joystick Movement: x, y, direction, distance</h4>
            <br/>
            <Joystick size={100} sticky={false} baseColor="black" stickColor="grey" move={handleMove}></Joystick>
            <br/>
            <p>{Data.x}</p>
            <p>{Data.y}</p>
            <p>{Data.direction}</p>
            <p>{Data.distance}</p>
        </div>
        </>
  )
}

export default joystick
