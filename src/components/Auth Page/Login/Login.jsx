import React, { useContext, useState } from 'react';
import "./Login.css";
import { Context } from '../../../Context';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../Loader/Loading';
import { server } from '../../../Contants';

const Login = () => {
  const { isAuthenticated, setisAuthenticated, isLoader, setisLoader } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Check if the email address ends with @pursuitsoftware.com
    // if (!email.endsWith('@pursuitsoftware.com') && !email.endsWith('@pursuitsoftware.biz')) {
    //   toast.error('Please Enter Your Pursuit Software Official Mail');
    //   return;
    // }

    try {
      setisLoader(true);
      const { data } = await axios.post(
        `${server}/api/v1/users/login`,
        { email, password },
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

  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }
  if (isLoader) {
    return <Loading />
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
            <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder='example@pursuitsoftware.com' required /><br />
          </div>

          <div className="pass">
            <label>Password</label><br />
            <input type="password" onChange={(e) => setPassword(e.target.value)} required /><br />
          </div>

          <input type="checkbox" id='checkbox' />
          <span id='rm'>Remember me</span><br />

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

export default Login;
