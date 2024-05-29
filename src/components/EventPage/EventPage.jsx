import React, {  useContext, useEffect, useState } from 'react'
import "./EventPage.css"
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { Context } from '../../Context';
import { toast } from 'react-toastify';
import Submission from '../Submission/Submission';



const EventPage = () => {
  const now=new Date();
  // const {isRegistered,setisRegistered}=useContext(Context);
  const [isRegistered,setisRegistered]=useState(false)
  // const [isApplied,setisRegistered]=useState(false)
  const {contest,setcontest}=useContext(Context);
  const {user}=useContext(Context);
  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);


  const {id}=useParams();
  console.log(id)
  const registerContest =  () => {
     
    axios.get(
    `https://code-quest-backend.onrender.com/api/v1/contest/register/${id}`,
    { 
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
    },

     } // Configuration object
  ).then((res)=>{
    setisRegistered(true)
    toast.success(res.data.message)
    console.log(res.data.message);

  }).catch((e)=>{
   
    console.log(e.response.data.message)
    toast.error(e.response.data.message)
 
  });
  

};
  useEffect(() => {
   axios.get(`https://code-quest-backend.onrender.com/api/v1/contest/getcontest/${id}`,{
    withCredentials: true,
    headers: {
      "Content-Type": "application/json"
  },
   }).then((res)=>{
  
    setcontest(res.data.contest);
   }).catch(()=>{
    setcontest(null)
   })

     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (contest && contest.registeredUsers) {
      if (contest.registeredUsers.includes(user._id)) {
        setisRegistered(true);
      } else {
        setisRegistered(false);
      }
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contest, user._id]);
console.log(isRegistered)
  // console.log(contest)
  return (
    <>
 
    <div className='img'>  
        <img src="Images/Login_img.png" alt="" />
    </div>
    <section class="event-detailss">
    <div class="containers">
    <div class="event-infos">
    <h2>{contest.title}</h2>
    <span class="team-info">Allowed Individuals</span>
    <p>Hosted by CodeQuest</p>
    <p><b>Opens on: {startTime.toLocaleString()} IST (Asia/Kolkata)</b></p>
    <p><b>Closes on: {endTime.toLocaleString()} IST (Asia/Kolkata)</b></p>
    </div>
    <div class="cta-buttonss">
      {isRegistered ?<button class="cta-buttons_applied disabled" disabled ><b>Applied</b></button>:<button class="cta-buttons" onClick={registerContest}><b>Participate Now</b></button>}
    
    
    </div>
    </div>
 
    </section>
    {now >= startTime && now <= endTime && isRegistered?<Submission/>:null}
    
        <section class="challenge-details">
    <div class="containers">
    <h3>About Challenge</h3>
    <p><strong>1. Eligibility:</strong></p>
    <ul>
    <li>Open to individuals or teams of 1-4 members.</li>
    <li>Participants must adhere to the code of conduct throughout the event.</li>
    </ul>
    <p><strong>2. Registration:</strong></p>
    <ul>
    <li>All participants must register online before the deadline.</li>
    <li>Late registrations will not be accepted, so ensure you register on time.</li>
    </ul>
    <p><strong>3. Original Work:</strong></p>
    <ul>
    <li>All answers must be original and developed during the hackathon.</li>
    <li>Plagiarism or use of pre-existing answers will result in disqualification.</li>
    </ul>
    <p><strong>4. Code of Conduct:</strong></p>
    <ul>
    <li>Respect all participants, organizers, judges, and sponsors.</li>
    <li>Harassment, discrimination, or any form of misconduct will not be tolerated.</li>
    <li>Maintain a supportive and inclusive environment for all participants.</li>
    </ul>
    <p><strong>5. Submission Requirements:</strong></p>
    <ul>
    <li>Each team must submit their task by the specified deadline.</li>
    <li>Submissions should include a demo, presentation, and any required documentation.</li>
    </ul>
    <p><strong>6. Judging Criteria:</strong></p>
    <ul>
    <li>Projects will be evaluated based on creativity, technical complexity, innovation, and relevance to the theme.</li>
    <li>Judges' decisions are final and binding.</li>
    </ul>
    <p><strong>7. Teamwork:</strong></p>
    <ul>
    <li>Teams are encouraged to collaborate and leverage each other's strengths.</li>
    <li>Each team member should contribute meaningfully to the project.</li>
    </ul>
    <p><strong>8. Prizes:</strong></p>
    <ul>
    <li>Prizes will be awarded to the top-performing teams based on the judging criteria.</li>
    <li>Prizes are non-transferable and subject to applicable laws and regulations.</li>
    </ul>
    <p><strong>9. Disqualification:</strong></p>
    <ul>
    <li>Violation of any rules may result in immediate disqualification.</li>
    <li>Organizers reserve the right to disqualify any participant or team at their discretion.</li>
    </ul>
    <p><strong>10. Liability:</strong></p>
    <ul>
    <li>Organizers are not liable for any loss, damage, or injury incurred during the hackathon.</li>
    <li>Participants are responsible for their own belongings and well-being.</li>
    </ul>
    <p><strong>11. Changes to Rules:</strong></p>
    <ul>
    <li>Organizers reserve the right to modify or update the rules at any time, with prior notice to participants.</li>
    </ul>
    </div>
    </section>
   </>
  )
}

export default EventPage