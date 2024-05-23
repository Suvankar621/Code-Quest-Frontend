
import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Navbar from './components/Navbar/Navbar';
import Login from './components/Auth Page/Login/Login';
import Register from './components/Auth Page/Register/Register';
import Hero from './components/Hero/Hero';
import Main from './components/Main/Main';
import { ToastContainer, toast } from 'react-toastify';
import { Context } from './Context';
import { useEffect, useState } from 'react';
import axios from 'axios';



function App() {
  
  const [isAuthenticated,setisAuthenticated]=useState(false)
  const [isLoader,setisLoader]=useState(false)

 
  useEffect(() => {
      axios.get("https://code-quest-backend.onrender.com/api/v1/users/me",
      {
        
      withCredentials: true
      }).then((res)=>{
        toast.error(res.data.message)
        setisAuthenticated(true);
      }).catch(()=>{
        setisAuthenticated(false)
       
      })
  }, [])
  

  return (
   <Context.Provider value={{isAuthenticated,setisAuthenticated,isLoader,setisLoader}}>
    
    <div className='App'>
    <ToastContainer/>
    <BrowserRouter>
  
      <Navbar/>
     
      <Routes>
        {isAuthenticated?<Route path='/' element={<Main />} />:<Route path='/' element={<Hero />} />}
        {/* <Route path='/' element={<Hero/>} /> */}
        
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
    </Routes>
    </BrowserRouter>
    </div>
    </Context.Provider>
  );
}

export default App;
