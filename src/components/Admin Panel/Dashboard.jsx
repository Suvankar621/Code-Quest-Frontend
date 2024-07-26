import React, { useContext } from 'react'

import "./Dashboard.css"
import { Link, Navigate } from 'react-router-dom';
import { Context } from '../../Context';


const Dashboard = () => {

const {isAuthenticated,user}=useContext(Context)
if(!isAuthenticated){
  return <Navigate to={"/"} />
}
  return (
   <>

    <div className="Apps">
      
      <div className="nav-buttons">
    
        {user.role!=="Participants" && user.role!=="Judge" ?
        <>
        <Link to={"/addjury"} >Add Jury Members</Link><Link to={"/create"} >Create Contest</Link><Link to={"/registeredmembers"} >Registered Users</Link>
        </>:<></>}
        <Link to={"/leaderboard"} >Leaderboard</Link>
      </div>
      <div className="component-container">
      {/* Content TODO */}
      </div>
    </div>
    </>
  )
}

export default Dashboard