import React, { useContext, useEffect } from 'react'
import "./HackethonCard.css"
import { Link } from 'react-router-dom'
import { Context } from '../../Context'

const HackethonCard = ({id,title,startTime}) => {
  const {setctitle}=useContext(Context);
  const storedRegistrationStatus = localStorage.getItem(`registrationStatus_${id}`);

 useEffect(() => {
  setctitle(title);
 }, [title, setctitle])
 
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