import React, { useContext } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Context } from "../../Context";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../Loader/Loading";

const Navbar = () => {
  const {isAuthenticated,setisAuthenticated,isLoader,setisLoader}=useContext(Context)
  
  const onLogoutHandle = async (e) => {
    e.preventDefault();

    try {
      setisLoader(true)
       const {data}= await axios.get("https://code-quest-backend.onrender.com/api/v1/users/logout",
            {
                withCredentials: true
            }
        );
        toast.success(data.message);
        setisAuthenticated(false);
        setisLoader(false)
   
    } catch (error) {
      toast.error(error.response.data.message)
        setisAuthenticated(true)
    }

    
 
};
if(isLoader){
  return <Loading/>
}

  return (
    <div className="navbar">
      <h1>CodeQuest</h1>
      <div className="auth-buttons">
        {isAuthenticated?  <div>
          <Link to={"/"}>
            <input type="button" value="Logout" className="login_btn" onClick={onLogoutHandle} />
          </Link>
        </div>:<>
        <div>
          <Link to={"/login"}>
            <input type="button" value="Login" className="login_btn" />
          </Link>
        </div>
        <div>
          <Link to={"/register"}>
            <input type="button" value="Sign up" className="signup_btn" />
          </Link>
        </div>
        </>}
      
      </div>
    </div>
  );
};

export default Navbar;
