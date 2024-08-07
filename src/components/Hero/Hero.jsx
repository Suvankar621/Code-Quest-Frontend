import React from 'react'
import "./Hero.css"
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';


const Hero = () => {
  // const{themeColor, setThemeColor}=useContext(Context)
  // const handleThemeChange = (event) => {
  //   const color = event.target.value;
  //   setThemeColor(color);
  //   document.documentElement.style.setProperty('--theme-color', color);
  // };
 
  // useEffect(() => {
  //   document.documentElement.style.setProperty('--theme-color', themeColor);
  // }, [themeColor]);
  return (
    <div className='container'>
    <div className="Hero">
      <div className="text">
            <h1 className='type_text'><span className="el">Elevate your skills,</span> <span className="eyk">expand your knowledge,</span> <span className="rest">and push the boundaries of what's possible</span></h1>
            <p>Welcome to <span className="cq">CodeQuest</span>, where innovation meets collaboration! Join us for an electrifying event packed with creativity, coding, and competition.</p>
            <Link to={"/register"}><button className='btn' >Register</button></Link>
            {/* <p className='ev' >Contest Date: <span>DD/MM/YY</span> </p>
            <p className='pmm'>Prize Money: <span className='money'>$500000</span> </p> */}
            
            {/* <h3 className='pm'>Price Money:- <span className="money">$5000000 </span></h3> */}
            {/* <div className="theme-selector">
            <h3>Colour Picker:</h3>
            <select onChange={handleThemeChange}>
              <option value="#FBE309">Default Yellow</option>
              <option value="#ffcccb">Pink</option>
              <option value="#add8e6">Light Blue</option>
              <option value="#90ee90">Light Green</option>
              <option value="#d3d3d3">Light Grey</option>
              <option value="#FFD700">Gold</option>
              <option value="#FF4500">Orange Red</option>
              <option value="#DA70D6">Orchid</option>
              <option value="#8A2BE2">Blue Violet</option>
              <option value="#5F9EA0">Cadet Blue</option>
            </select>
          </div> */}
      </div>
     
      <img src="Images/LH.png" alt=""/>

    </div>

    <img src="Images/Wave.png" alt="" className='wave' />
    <div className="scrollText">
      {/* <pre> Registration Start : 22/07/2024, Registration End : 29/07/2024, Contest Start : 01/08/2024, Contest End : 03/08/2024, Result Date : 01/09/2024  </pre> */}
    </div>
    </div>
  )
}

export default Hero