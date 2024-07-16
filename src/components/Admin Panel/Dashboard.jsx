import React, { useContext } from 'react'

import "./Dashboard.css"
import { Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Context } from '../../Context';


const Dashboard = () => {

const {isAuthenticated,user}=useContext(Context)
if(!isAuthenticated){
  return <Navigate to={"/"} />
}
  return (
   
   
    <div className="Apps">
        <ToastContainer/>
      <div className="nav-buttons">
    
        {user.role!=="Participants"?
        <>
        <Link to={"/create"} >Create Contest</Link><Link to={"/addjury"} >Add Jury Members</Link>
        </>:<></>}
        <Link to={"/leaderboard"} >Leaderboard</Link>
      </div>
      <div className="component-container">
      {/* Content TODO */}
      </div>
    </div>
  
  )
}

export default Dashboard