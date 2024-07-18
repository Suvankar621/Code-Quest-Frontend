import React, { useContext, useEffect, useState } from 'react';
import "./HackethonCard.css";
import { Link } from 'react-router-dom';
import { Context } from '../../Context';
import axios from 'axios';
import { server } from '../../Contants';

const HackethonCard = ({ id, title, startTime, endTime, isAdmin, isJudge, isLeaderboard }) => {
  const [isReg, setisReg] = useState(false);
  const { user } = useContext(Context);

  const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const start = new Date(new Date(startTime).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const end = new Date(new Date(endTime).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  useEffect(() => {
    axios.get(`${server}/api/v1/contest/getcontest/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      },
    }).then((res) => {
      const userIsRegistered = res.data.contest.registeredTeams.some((team) =>
        team.members.some((member) => member.email === user.email)
      );

      // if(userIsRegistered){
      //   setisReg(userIsRegistered)

      // }else 
      if (res.data && res.data.contest.registeredTeams) {
        const userIsInTeam = res.data.contest.registeredTeams.some(
          (team) =>
            team.teamLeader.toString() === user._id||
            team.members.some((member) => member.email === user.email)
        );
        console.log(userIsInTeam)
        setisReg(userIsInTeam);
      } else {
        setisReg(false);
      }
     
      
      

      
    }).catch(() => {
      setisReg(false);
    });
  }, [id, user._id]);

  const nowDate = new Date(now);
  const isBlurred = nowDate < start || nowDate > end;
console.log(isReg)

  return (
    <div className={`${isBlurred ? 'event-cardBlur' : 'event-card'}`}>
      <img src="Images/event_img.png" alt="The Hacker" />
      
      <div className="event-details">
        <h4>H A C K A T H O N</h4>
        <h3>{title}</h3>
        <p>Hosted by CodeQuest</p>
        <h5>STARTS ON</h5>
        <h6>{start.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST (Asia/Kolkata)</h6>

        {isAdmin ? (
          <Link to={`/create`}>
            <button className="register-button">Created</button>
          </Link>
        ) : isReg && (!isJudge && !isLeaderboard) ? (
          <Link to={`/event/${id}`}>
            <button className="register-button">ENTER NOW</button>
          </Link>
        ) : isJudge ? (
          <Link to={`/solutions/${id}`}>
            <button className="register-button">Show Solutions</button>
          </Link>
        ) : isLeaderboard ? (
          <Link to={`/lead/${id}`}>
            <button className="register-button">Show Leaderboard</button>
          </Link>
        ) : (
          <Link to={`/event/${id}`}>
            <button className="register-button">REGISTER</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HackethonCard;
