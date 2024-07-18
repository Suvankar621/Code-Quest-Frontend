import React, { useContext, useEffect, useState } from 'react';
import './Main.css';
import HackethonCard from '../Card/HackethonCard';
import axios from 'axios';
import { server } from '../../Contants';
import { Context } from '../../Context';

const Main = () => {
  const [contests, setContests] = useState([]);
  const [filter, setFilter] = useState('all');
  const { user } = useContext(Context);
  const currentUserId = user._id; // Current user ID
  const currentUserEmail = user.email; // Current user email

  useEffect(() => {
    axios.get(`${server}/api/v1/contest/getcontests`, {
      withCredentials: true
    }).then((res) => {
      setContests(res.data.contests);
    }).catch(() => {
      // Handle error if needed
    });
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const isParticipated = (contest) => {
    return contest.registeredTeams.some(team => 
      team.teamLeader === currentUserId || team.members.some(member => member._id === currentUserId || member.email === currentUserEmail)
    );
  };

  const filteredContests = contests.filter((contest) => {
    if (filter === 'all') return true;
    if (filter === 'participated') return isParticipated(contest);
    if (filter === 'not-participated') return !isParticipated(contest);
    return true;
  });

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1><b>CodeQuest 2024</b></h1>
          <h2>Welcome to CodeQuest, where innovation meets creativity!</h2>
          <p>Register now to secure your spot in the ultimate Hackathon showdown!</p>
          <a href="#main_container"><button className="cta-button">Participate Now</button></a>
        </div>
        <div className="hero-image">
          <img src="Images/Person_table.png" alt="Person at computer" />
        </div>
      </section>

      <div id="main_container">
        <h3>CHALLENGES</h3>
        <div className="filter-container">
          <label htmlFor="filter">Filter: </label>
          <select id="filter" value={filter} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="participated">Participated</option>
            <option value="not-participated">Not Participated</option>
          </select>
        </div>
        <div className="card_items">
          {filteredContests.map((e) => (
            <HackethonCard
              key={e._id}
              id={e._id}
              title={e.title}
              endTime={e.endTime}
              startTime={new Date(e.startTime).toLocaleString()}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Main;
