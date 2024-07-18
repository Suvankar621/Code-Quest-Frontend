import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Auth Page/Login/Login";
import Register from "./components/Auth Page/Register/Register";
import Hero from "./components/Hero/Hero";
import Main from "./components/Main/Main";
import { ToastContainer } from "react-toastify";
import { Context } from "./Context";
import { useEffect, useState } from "react";
import axios from "axios";
import EventPage from "./components/EventPage/EventPage";
import Judge from "./components/Judge Page/Judge";
import Dashboard from "./components/Admin Panel/Dashboard";
import CreateContest from "./components/Admin Panel/CreateContest";
import SolutionsPage from "./components/Judge Page/SolutionsPage";
import LeaderboardPage from "./components/Admin Panel/LeaderboardPage";
import LeaderBoard from "./components/LeaderBoard/LeaderBoard";
import { server } from "./Contants";
import Addjury from "./components/Admin Panel/Addjury";
import Chatbot from "./Chatbot/Chatbot";
import RegisteredUsers from "./components/Admin Panel/RegisteredUsers";



function App() {
  
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [isLoader, setisLoader] = useState(false);
  const [user, setUser] = useState({});
  const [contest, setcontest] = useState([]);
  // const [themeColor, setThemeColor] = useState('#FBE309');
  // const [isRegistered,setisRegistered]=useState(false)

  useEffect(() => {
    axios
      .get(`${server}/api/v1/users/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        setisAuthenticated(true);
      })
      .catch(() => {
        setisAuthenticated(false);
      });
  

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);


  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setisAuthenticated,
        isLoader,
        setisLoader,
        user,
        setUser,
        contest,
        setcontest,
      }}
    >
<ToastContainer
position="top-center"
/>
      <div className="App">
        <Chatbot/>
     
        <BrowserRouter>
          <Navbar />
          <Routes>
            {isAuthenticated ? (
              user.role === "Participants" ? (
                <Route path="/" element={<Main />} />
              ) : user.role === "Judge" ? (
                <Route path="/" element={<Judge />} />
              ) : user.role === "Organizer" ? (
                <Route path="/" element={<Dashboard />} />
              ) : (
                <Route path="/" element={<Hero />} />
              )
            ) : (
              <Route path="/" element={<Hero />} />
            )}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/event/:id" element={<EventPage />} />
          
           {isAuthenticated? <Route path="/registeredmembers" element={<RegisteredUsers />} />: 
           <Route path="/" element={<Hero />} />} {/*Admin */}
            {isAuthenticated ? (
              <Route path="/create" element={<CreateContest />} />
            ) : (
              <Route path="/" element={<Hero />} />
            )}
             {isAuthenticated ? (
              <Route path="/addjury" element={<Addjury />} />
            ) : (
              <Route path="/" element={<Hero />} />
            )}
            {isAuthenticated ? (
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            ) : (
              <Route path="/" element={<Hero />} />
            )}
            {isAuthenticated ? (
              <Route path="/dashboard" element={<Dashboard />} />
            ) : (
              <Route path="/" element={<Hero />} />
            )}
            {isAuthenticated ? (
              <Route path="/solutions/:id" element={<SolutionsPage />} />
            ) : (
              <Route path="/" element={<Hero />} />
            )}
            {isAuthenticated ? (
              <Route path="/lead/:id" element={<LeaderBoard />} />
            ) : (
              <Route path="/" element={<Hero />} />
            )}
        
            {!isAuthenticated && <Route path="*" element={<Navigate to="/" replace />} />}
          </Routes>
        </BrowserRouter>
      </div>
    </Context.Provider>
  );
}

export default App;
