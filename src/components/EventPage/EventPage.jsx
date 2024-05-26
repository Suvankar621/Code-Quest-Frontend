import React, { useContext } from 'react'
import "./EventPage.css"
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { Context } from '../../Context';


const EventPage = () => {
  const {user,setUser}=useContext(Context)

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
   
    setUser(res.data)
    console.log(user);

  }).catch((e)=>{
    console.log(e.response.data.message)
  });
  

};
  // useEffect(() => {
  //   const registerContest = async () => {
     
  //       const res = await axios.post(
  //         `https://code-quest-backend.onrender.com/api/v1/contest/register/${id}`,
  //         { withCredentials: true } // Configuration object
  //       );
  //       console.log(res.response.data.message);
    
  //   };

  //   if (id) {
  //     registerContest();
  //   }
   
  // }, [id])
  
  return (
    <>
    <div className='img'>  
        <img src="Images/Login_img.png" alt="" />
    </div>
    <section class="event-detailss">
    <div class="containers">
    <div class="event-infos">
    <h2>CodeQuest Hackathon 2024</h2>
    <span class="team-info">Allowed team size: 1-4</span>
    <p>Hosted by CodeQuest</p>
    <p><b>Opens on: June 07, 2024, 10:00 AM IST (Asia/Kolkata)</b></p>
    <p><b>Closes on: July 01, 2024, 11:59 PM IST (Asia/Kolkata)</b></p>
    </div>
    <div class="cta-buttonss">
      {user?<button class="cta-buttons_applied disabled" disabled onClick={registerContest}><b>Applied</b></button>:<button class="cta-buttons" onClick={registerContest}><b>Participate Now</b></button>}
    
    <div class="invite-friends">
    <input type="email" placeholder="Enter email" />
    <button class="invite-button">Invite</button>
    </div>
    </div>
    </div>
    </section>
     
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