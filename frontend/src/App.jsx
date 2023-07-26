import React,{ useState,useEffect } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Joystick from './pages/Joystick'
import Auth from './pages/Auth'
import ProtectedRoutes from './ProtectedRoute'
import AuthRoute from './AuthRoute'
import Cookies from 'universal-cookie'



function App() {
  const cookies=new Cookies()
  const [token,setToken]=useState(()=>cookies.get('TOKEN')?cookies.get('TOKEN'):null)
  const [username,setUsername]=useState(()=>cookies.get('USER')?cookies.get('USER'):null)
  const [room,setRoom]=useState('')
  const [password,setPassword]=useState('')
  return (
    <BrowserRouter>
      <div className="App h-screen">
        <Routes>
          <Route 
            path='/auth' 
            element={
              <AuthRoute>
              <Auth 
                 username={username}
                 setUsername={setUsername}
                 setToken={setToken}
              />
              </AuthRoute>
            }
          />
          <Route
            path='/' 
            element={
              <ProtectedRoutes>
            <Joystick
            username={username}
            setUsername={setUsername}
            room={room}
            setRoom={setRoom}
            token={token}
            password={password}
            setPassword={setPassword}
          />
          </ProtectedRoutes>
          }/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
