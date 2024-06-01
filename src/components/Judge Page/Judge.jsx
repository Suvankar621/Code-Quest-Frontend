import React, { useEffect, useState } from 'react'
import "./Judge.css"
import HackethonCard from '../Card/HackethonCard'
import axios from 'axios';
const Judge = () => {
    const isJudge=true;
    const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get('https://code-quest-backend.onrender.com/api/v1/contest/getcontests',{
            withCredentials: true
          });
        setContests(response.data.contests); // Assuming the contests are returned as an array in the 'contests' property
      } catch (error) {
        console.error('Error fetching contests:', error);
      }
    };

    fetchContests();
  }, []);
  return (
    <section className="judge-panel">
    {contests.map(contest => (
      <HackethonCard id={contest._id} title={contest.title} startTime={contest.startTime} isJudge={isJudge} />
    ))}
  </section>
  )
}

export default Judge