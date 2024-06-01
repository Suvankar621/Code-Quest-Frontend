import React, { useContext, useEffect, useState } from 'react'
import "./HackethonCard.css"
import { Link } from 'react-router-dom'
import { Context } from '../../Context';
import axios from 'axios';



const HackethonCard = ({id,title,startTime,isAdmin,isJudge}) => {
  const [isReg,setisReg]=useState(false);
  const {contest,user}=useContext(Context);

  useEffect(() => {
    axios.get(`https://code-quest-backend.onrender.com/api/v1/contest/getcontest/${id}`,{
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
    },
     }).then((res)=>{
      if (res.data && res.data.contest.registeredUsers) {
        if (res.data.contest.registeredUsers.includes(user._id)) {
          setisReg(true);
        } else{
          setisReg(false)
        }
      }
    
     }).catch(()=>{
      setisReg(false)
     })

     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contest, user._id]);
  const StartTime = new Date(startTime);
  
console.log(isJudge)
  return (
    <div class="event-card">
            <img src="Images/event_img.png" alt="The Hacker"/>
            
            <div class="event-details">
                <h4>H A C K A T H O N</h4>
                <h3>{title}</h3>
                <p>Hosted by CodeQuest</p>
                <h5>STARTS ON</h5>
                <h6>{StartTime.toLocaleString()}  IST (Asia/Kolkata)</h6>
              
                {isAdmin ? (
  <Link to={`/create`}>
    <button className="register-button">Created</button>
  </Link>
) : isReg && !isJudge ? (
  <Link to={`/event/${id}`}>
    <button className="register-button">ENTER NOW</button>
  </Link>
): isJudge ? (
  <Link to={`/solutions/${id}`}>
    <button className="register-button">Show Solutions</button>
  </Link>
) : (
  <Link to={`/event/${id}`}>
    <button className="register-button">REGISTER</button>
  </Link>
)}
                {/* {isReg? <Link to={`/event/${id}`}><button class="register-button ">ENTER NOW</button></Link>: <Link to={`/event/${id}`}><button class="register-button">REGISTER</button></Link>} */}
               
            </div>
    </div>
  )
}

export default HackethonCard