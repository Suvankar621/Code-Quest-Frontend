import React, { useContext, useState } from 'react'
import "./Login.css"
import { Context } from '../../../Context';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const {isAuthenticated,setisAuthenticated}=useContext(Context)
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
        const { data } = await axios.post(
            "https://code-quest-backend.onrender.com/api/v1/users/login",
            {  email, password },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        toast.success(data.message);
        setisAuthenticated(true);
        

        
   
    } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        setisAuthenticated(false);
    }
 
};
if(isAuthenticated){
  return <Navigate to={"/"} />
}
  return (
    <div className="login_container">
        <div className="login">
            <div className="text">
            <h1>Welcome back!</h1>
            <p>Enter your Credentials to access your account</p>
            </div>
           
            <form onSubmit={onSubmitHandler}>
                <div className="email">
                <label>Email address</label><br />
                <input type="email" onChange={(e)=>setEmail(e.target.value)}  /><br />
                </div>

                <div className="pass">
                <label >Password</label><br />
                <input type="password" onChange={(e)=>setPassword(e.target.value)}  /><br />
                </div>

            
                <input type="checkbox" id='checkbox' /> 
                <span >Forget Password</span><br />
                
                <button type='submit' className='btnn'>Login</button>
            </form>
            
        </div>
        <div className="Image">
            <h1>Compete For The Prestigious Title Of “World’s Best Coder”</h1>
            <img src="Images/Login_img.png" alt="" />
        </div>
   
    </div>
  )
}

export default Login