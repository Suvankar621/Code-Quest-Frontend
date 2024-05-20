import React from 'react'
import "./Main.css"
import HackethonCard from '../Card/HackethonCard'

const Main = () => {
  return (
    <>
    <div className="top_container">
        <h1><span className="cq">CodeQuest</span><span className="sc"> 2024</span><br /><span className="sc">Welcome to</span><span className="cq"> CodeQuest,</span> <span className="rest">where innovation meets creativity!</span></h1>

        <img src="Images/Person_table.png" alt="" />
    </div>
    <p className='para'>Register now to secure your spot in the ultimate Hackathon  showdown!</p>
    <p className="btn_text">You have not participated yet.<span><button className='btn'><a href="#main_container"> Participate</a>  </button></span> </p>

    <div id="main_container">
        <h3>CHALLENGES</h3>

        <HackethonCard/>


    </div>
    </>
 
  )
}

export default Main