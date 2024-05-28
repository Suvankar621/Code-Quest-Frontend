import React, {  useEffect, useState } from 'react'
import "./Main.css"
import HackethonCard from '../Card/HackethonCard'
import axios from 'axios'



const Main = () => {
  
  const [contests,setcontests]=useState([]);
  
  
 
  useEffect(() => {
    axios.get("https://code-quest-backend.onrender.com/api/v1/contest/getcontests",{
      withCredentials: true
    }).then((res)=>{
      setcontests(res.data.contests);

    }).catch(()=>{

    })
   
    
  }, [])
  console.log(contests)
  return (
    <>
    <section class="hero">
        <div class="hero-content">
            <h1><b>CodeQuest 2024</b></h1>
            <h2>Welcome to CodeQuest, where innovation meets creativity!</h2>
            <p>Register now to secure your spot in the ultimate Hackathon  showdown!</p>
            <a href="#main_container"><button class="cta-button">Participate Now</button></a>
        </div>
        <div class="hero-image">
            <img src="Images/Person_table.png" alt="Person at computer"/>
        </div>
    </section>
 

    <div id="main_container">
        <h3>CHALLENGES</h3>
        <div className="card_items">
          {contests.map((e)=>(
            <HackethonCard id={e._id} title={e.title} startTime={e.startTime.toLocaleString()}/>
            
        
          ))}
     
       
        {/* <HackethonCard id={2} />
        <HackethonCard id={3} /> */}
        </div>
        


    </div>
    </>
 
  )
}

export default Main