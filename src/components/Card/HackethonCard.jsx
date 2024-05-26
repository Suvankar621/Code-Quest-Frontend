import React, { useContext } from 'react'
import "./HackethonCard.css"
import { Link } from 'react-router-dom'
import { Context } from '../../Context'

const HackethonCard = ({id}) => {
  const {user}=useContext(Context)
  return (
    <div class="event-card">
            <img src="Images/event_img.png" alt="The Hacker"/>
            
            <div class="event-details">
                <h4>H A C K A T H O N</h4>
                <h3>CodeQuest 2024</h3>
                <p>Hosted by CodeQuest</p>
                <h5>STARTS ON</h5>
                <h6>June 07, 11:00 AM IST (Asia/Kolkata)</h6>
                {user? <Link to={`/event/${id}`}><button class="register-button ">ENTER NOW</button></Link>: <Link to={`/event/${id}`}><button class="register-button">REGISTER</button></Link>}
               
            </div>
    </div>
  )
}

export default HackethonCard