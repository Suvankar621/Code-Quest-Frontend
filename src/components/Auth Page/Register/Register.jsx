import React from 'react'
import "./Register.css";

const Register = () => {
  return (
    <div className="register-container">
        <div className="Register">
        <form>
        <label htmlFor="name">Name:</label><br />
        <input type="text" name='name' /><br />

        <label htmlFor="email">Email:</label><br />
        <input type="email" name='email' /><br />

        <label htmlFor="password">Password:</label><br />
        <input type="password" name='password' /><br />
    </form>
        </div>

        <div className="image">
            <img src="Images/logoR.png" alt="" />
        </div>

</div>
  )
}

export default Register