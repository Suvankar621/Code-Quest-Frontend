import React from 'react'
import "./HackethonCard.css"
import { Link } from 'react-router-dom'


const HackethonCard = ({id,title,startTime}) => {
 
  const storedRegistrationStatus = localStorage.getItem(`registrationStatus_${id}`);


 
  return (
    <div class="event-card">
            <img src="Images/event_img.png" alt="The Hacker"/>
            
            <div class="event-details">
                <h4>H A C K A T H O N</h4>
                <h3>{title}</h3>
                <p>Hosted by CodeQuest</p>
                <h5>STARTS ON</h5>
                <h6>{startTime}  IST (Asia/Kolkata)</h6>
              

                {storedRegistrationStatus === "true"? <Link to={`/event/${id}`}><button class="register-button ">ENTER NOW</button></Link>: <Link to={`/event/${id}`}><button class="register-button">REGISTER</button></Link>}
               
            </div>
    </div>
  )
}

export default HackethonCard