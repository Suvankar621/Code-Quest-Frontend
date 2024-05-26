import React from 'react'
import "./Hero.css"
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Hero = () => {

  const clickhandler=()=>{
   
  }
  return (
    <div className='container'>
    <div className="Hero">
      <div className="text">
            <h1 className='type_text'><span className="el">Elevate your skills,</span> <span className="eyk">expand your knowledge,</span> <span className="rest">and push the boundaries of what's possible</span></h1>
            <p>Welcome to <span className="cq">CodeQuest</span>, where innovation meets collaboration! Join us for an electrifying event packed with creativity, coding, and competition.</p>
            <Link to={"/register"}><button className='btn' onClick={clickhandler}>Register</button></Link>
      </div>
      <img src="Images/LH.png" alt=""/>
    </div>
    <img src="Images/Wave.png" alt="" className='wave' />
    </div>
  )
}

export default Hero