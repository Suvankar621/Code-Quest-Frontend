
import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Navbar from './components/Navbar/Navbar';
import Login from './components/Auth Page/Login/Login';
import Register from './components/Auth Page/Register/Register';
import Hero from './components/Hero/Hero';
import Main from './components/Main/Main';
import { ToastContainer } from 'react-toastify';
import { Context } from './Context';
import { useEffect, useState } from 'react';
import axios from 'axios';
import EventPage from './components/EventPage/EventPage';





function App() {
  
  const [isAuthenticated,setisAuthenticated]=useState(false)
  const [isLoader,setisLoader]=useState(false);
  const [user,setUser]=useState({});
  const [ctitle,setctitle]=useState("");
  

 
  useEffect(() => {
      axios.get("https://code-quest-backend.onrender.com/api/v1/users/me",
      {
        
      withCredentials: true
      }).then(()=>{
        setisAuthenticated(true);
      }).catch(()=>{
        setisAuthenticated(false)
       
      })
  }, [])
  

  return (
   <Context.Provider value={{isAuthenticated,setisAuthenticated,isLoader,setisLoader,user,setUser,ctitle,setctitle}}>
    
    <div className='App'>
    <ToastContainer/>
    <BrowserRouter>
  
      <Navbar/>
     
      <Routes>
        {isAuthenticated?<Route path='/' element={<Main />} />:<Route path='/' element={<Hero />} />}
        {/* <Route path='/' element={<Hero/>} /> */}
        
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/event/:id' element={<EventPage/>} />
    </Routes>
    </BrowserRouter>
    </div>
    </Context.Provider>
  );
}

export default App;
