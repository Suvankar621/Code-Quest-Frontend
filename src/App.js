
import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Navbar from './components/Navbar/Navbar';
import Login from './components/Auth Page/Login/Login';
import Register from './components/Auth Page/Register/Register';
import Hero from './components/Hero/Hero';
import { useState } from 'react';
import Main from './components/Main/Main';

function App() {
  const [isAuthenticated,setisAuthenticated]=useState(true)
  return (
    <div className='App'>
    <BrowserRouter>
      <Navbar/>
      <Routes>
        {isAuthenticated?<Route path='/' element={<Main />} />:<Route path='/' element={<Hero />} />}
        
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
