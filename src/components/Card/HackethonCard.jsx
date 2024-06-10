import React, { useContext, useEffect, useState } from 'react';
import "./HackethonCard.css";
import { Link } from 'react-router-dom';
import { Context } from '../../Context';
import axios from 'axios';

const HackethonCard = ({ id, title, startTime, endTime, isAdmin, isJudge, isLeaderboard }) => {
  const [isReg, setisReg] = useState(false);
  const { user } = useContext(Context);

  const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const start = new Date(new Date(startTime).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const end = new Date(new Date(endTime).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  useEffect(() => {
    axios.get(`https://code-quest-backend.onrender.com/api/v1/contest/getcontest/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      },
    }).then((res) => {
      if (res.data && res.data.contest.registeredUsers) {
        setisReg(res.data.contest.registeredUsers.includes(user._id));
      } else {
        setisReg(false);
      }
    }).catch(() => {
      setisReg(false);
    });
  }, [id, user._id]);

  const nowDate = new Date(now);
  const isBlurred = nowDate < start || nowDate > end;
  console.log(nowDate,start,end);

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
