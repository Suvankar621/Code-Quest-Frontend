import React, { useContext, useState } from 'react'
import "./Register.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Context } from '../../../Context';
import { Navigate } from 'react-router-dom';
import Loading from '../../Loader/Loading';
import { server } from '../../../Contants';

const Register = () => {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [role,setRole]=useState("Participants");

  const {isAuthenticated,setisAuthenticated,isLoader,setisLoader}=useContext(Context)

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setisLoader(true)
        const { data } = await axios.post(
            `${server}/api/v1/users/new`, 
            { name, email, password, role },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        setisLoader(false);
        toast.success(data.message);
        setisAuthenticated(true);
        
        

        
   
    } catch (error) {
        setisLoader(false);
        toast.error(error.response?.data?.message || "An error occurred");
        setisAuthenticated(false);
    }
 
};
if(isAuthenticated){
  return <Navigate to={"/"} />
}
if(isLoader){
  return <Loading/>
}

  console.log(name,email,password,role)
  return (
    <div className="login_container">
      <ToastContainer/>
    <div className="login">
        <div className="text">
        <h1>Get Started Now</h1>
        </div>
       
        <form onSubmit={onSubmitHandler}>
          <div className="name">
          <label>Name</label><br />
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required /><br />
          </div>
          <div className="email">
          <label>Email address</label><br />
            <input type="email"  value={email} onChange={(e)=>setEmail(e.target.value)} required/><br />
          </div>
          <div className="pass">
            <label >Password</label><br />
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/><br />
          </div>
          
          
    
          {/* <div className="roleselect">
            <label htmlFor="roles">Choose Your Role</label><br />
            <select
                name="roles"
                id="roles"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
            >
              <option value="" disabled hidden> None</option>
              <option value="Participants">Participants</option>
              <option value="Organizer">Organizer</option>
              <option value="Judge">Judge</option>
            </select>
            <br />
        </div> */}
        

            <button className='btnn' type='submit' >Sign up</button>
        </form>
        
    </div>
    <div className="Image">
        <h1>Compete For The Prestigious Title Of “World’s Best Coder”</h1>
        <img src="Images/Login_img.png" alt="" />
    </div>

</div>
  )
}

export default Register