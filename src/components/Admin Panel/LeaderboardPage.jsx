import React, {  useEffect, useState } from 'react'

import "./LeaderBoard.css"
import { server } from '../../Contants';

import axios from 'axios';
import HackethonCard from '../Card/HackethonCard';
import Dashboard from './Dashboard';


const LeaderboardPage = () => {
  const [contests,setContests]=useState([]);
  const isLeaderboard=true;

  
 
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data } = await axios.get(`${server}/api/v1/contest/getcontests`, {
          withCredentials: true
        });
        setContests(data.contests);
      } catch (error) {
        console.error('There was an error fetching the contests!', error);
      }
    };
    fetchContests();
  }, [contests]);
  console.log(contests)
  return (
    <>
     <Dashboard/> 
    <div className="contest-lists">
    {contests.map((contest, index) => (
      <div key={index} className="contest-card">
        <HackethonCard id={contest._id} title={contest.title} startTime={contest.startTime} isLeaderboard={isLeaderboard}  />
      </div>
    ))}
  </div>
  </>
  )
}

export default LeaderboardPage