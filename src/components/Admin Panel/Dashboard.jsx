import React, { useContext } from 'react'

import "./Dashboard.css"
import { Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Context } from '../../Context';

const Dashboard = () => {

const {isAuthenticated}=useContext(Context)
if(!isAuthenticated){
  return <Navigate to={"/"} />
}
  return (
    <div className="App">
        <ToastContainer/>
      <div className="nav-buttons">
      <Link to={"/dashboard"}  >Dashboard</Link>
        <Link to={"/create"} >Create</Link>
      
        <Link to={"/leaderboard"} >Leaderboard</Link>
      </div>
      <div className="component-container">
      hii
      </div>
    </div>
  )
}

export default Dashboard