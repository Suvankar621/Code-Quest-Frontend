import React, { useContext } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Context } from "../../Context";

const Navbar = () => {
  const {isAuthenticated,setisAuthenticated}=useContext(Context)
  return (
    <div className="navbar">
      <h1>CodeQuest</h1>
      <div className="auth-buttons">
        {isAuthenticated?  <div>
          <Link to={"/logout"}>
            <input type="button" value="Logout" className="login_btn" />
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
