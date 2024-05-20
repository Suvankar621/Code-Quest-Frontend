import React from 'react'
import "./HackethonCard.css"

const HackethonCard = () => {
  return (
    <div class="event-card">
            <img src="Images/event_img.png" alt="The Hacker"/>
            <div class="event-details">
                <h4>H A C K A T H O N</h4>
                <h3>CodeQuest 2024</h3>
                <p>Hosted by CodeQuest</p>
                <h5>STARTS ON</h5>
                <h6>June 07, 11:00 AM IST (Asia/Kolkata)</h6>
                <button class="register-button">REGISTER</button>
            </div>
    </div>
  )
}

export default HackethonCard