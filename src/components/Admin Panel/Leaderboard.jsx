import React, {  useEffect, useState } from 'react'
import Dashboard from './Dashboard'

import axios from 'axios';

const Leaderboard = () => {
  const [contests,setcontests]=useState([]);

  
 
  useEffect(() => {
    axios.get("https://code-quest-backend.onrender.com/api/v1/contest/getcontests",{
      withCredentials: true
    }).then((res)=>{
      setcontests(res.data.contests);

    }).catch(()=>{

    })
   
    
  }, [])
  console.log(contests)
  return (
    <>
    <Dashboard/>
    {/* {contests.map((e)=>(
      <div>{e}</div>
    ))} */}
    </>
  )
}

export default Leaderboard