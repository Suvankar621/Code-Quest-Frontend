import React, { useContext, useEffect, useRef, useState } from "react";
import "./EventPage.css";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { Context } from "../../Context";
import { toast } from "react-toastify";
import Submission from "../Submission/Submission";
import { server } from "../../Contants";
import Loading from "../Loader/Loading";

const EventPage = () => {
  const now = new Date();
  const [isRegistered, setisRegistered] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [memberEmail, setMemberEmail] = useState({});
  const [members, setMembers] = useState([]);
  const [isTeamRegistered, setIsTeamRegistered] = useState(false);
  const { contest, setcontest } = useContext(Context);
  const { user, isAuthenticated } = useContext(Context);
  const { isLoader, setisLoader } = useContext(Context);
  const [isTeamSubmitted, setisTeamSubmitted] = useState(false);
  const { id } = useParams();

  const modalref = useRef();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/contest/getcontest/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setcontest(res.data.contest);
      })
      .catch(() => {
        setcontest(null);
      });
  }, [id, setcontest]);

  useEffect(() => {
    if (contest && contest.registeredTeams) {
      // Check if the user is registered in any team as a member
      const userIsRegistered = contest.registeredTeams.some((team) =>
        team.members.some((member) => member.email === user.email)
      );

      contest.registeredTeams.forEach((team) => {
        team.members.forEach((member) => {
          if (member.email === user.email) {
            console.log(member.email);
            setisTeamSubmitted(true);
            return;
          }
        });
      });
      console.log(userIsRegistered);
      setisRegistered(userIsRegistered);
      // setMembers(team.members)
      // TODO-----------------------------
      contest.registeredTeams.some((team) => {
        if (team.teamLeader.toString() === user._id.toString()) {
          setMembers(team.members);
          return true; // Exit the loop once we find the team leader
        }
        return false; // Continue to the next team if not found
      });

      // Check if the user is part of any team
      const userIsInTeam = contest.registeredTeams.some(
        (team) =>
          team.teamLeader.toString() === user._id ||
          team.members.some((member) => member.email === user.email)
      );
      setisRegistered(userIsInTeam);
      setIsTeamRegistered(userIsInTeam);
    }
  }, [contest, user]);

  const handleModalOpen = () => {
    modalref.current.classList.add("omodal");
    modalref.current.classList.remove("cmodal");
  };

  const handleModalClose = (e) => {
    e.preventDefault();
    modalref.current.classList.remove("omodal");
    modalref.current.classList.add("cmodal");
  };

  const handleMemberEmailChange = (e) => {
    setMemberEmail(e.target.value);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    setMembers([...members, { email: memberEmail }]);
    setMemberEmail(""); // Clear input field after adding member
  };
  console.log(members.length === 0);
  // console.log(memberEmail)
  // console.log(contest)
  // console.log(isRegistered)

  const registerTeam = (e) => {
    e.preventDefault();
    modalref.current.classList.remove("omodal");
    modalref.current.classList.add("cmodal");
    setisLoader(true);
    axios
      .post(
        `${server}/api/v1/contest/register/team/${id}`,
        { teamName, members },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsTeamRegistered(true);
        setisRegistered(true);
        setisLoader(false);
        toast.success(res.data.message);
      })
      .catch((e) => {
        setisLoader(false);
        setisRegistered(false);
        toast.error(e.response.data.message);
      });
  };
  if (isLoader) {
    return <Loading />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!contest) {
    return <div>Loading...</div>;
  }

  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);
  // console.log(isRegistered)
  return (
    <>
      <div className="img">
        <img src="Images/Login_img.png" alt="" />
      </div>
      <section className="event-detailss">
        <div className="containers">
          <div className="event-infos">
            <h2>{contest.title}</h2>
            <span className="team-info">Allowed Individuals</span>
            <p>Hosted by CodeQuest</p>
            <p>
              <b>Opens on: {startTime.toLocaleString()} IST (Asia/Kolkata)</b>
            </p>
            <p>
              <b>Closes on: {endTime.toLocaleString()} IST (Asia/Kolkata)</b>
            </p>
          </div>
          <div className="cta-buttonss">
            {isRegistered ? (
              <button className="cta-buttons_applied disabled" disabled>
                <b>Applied</b>
              </button>
            ) : (
              <button className="cta-buttons" onClick={handleModalOpen}>
                <b>Participate Now</b>
              </button>
            )}
          </div>
          {members.length !== 0 ? (
            <div className="mem">
              <h3>Registered Members</h3>
              <ol start="1">
                {members.map((item) => (
                  <li>{item.email}</li>
                ))}
              </ol>
              {/* {members.map((item,i)=>(
             <ol start="1">
               <li>{item.email}</li>
             </ol>
           ))} */}
            </div>
          ) : (
            <></>
          )}

          <div ref={modalref} className="cmodal">
            <form>
              <h1>Add Team Members</h1>
              <input
                type="text"
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter Your Team Name"
              />
              <input
                type="text"
                onChange={handleMemberEmailChange}
                placeholder="Member Email"
              />
              <button onClick={handleAddMember}>Add Members</button>
              <button onClick={registerTeam}>Register</button>
              <button id="close" onClick={handleModalClose}>
                X
              </button>
            </form>

            <div className="members">
              <ol start="1">
                {members.map((item) => (
                  <li>{item.email}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
      {now >= startTime &&
        now <= endTime &&
        (isRegistered || isTeamRegistered) && (
          <Submission question={contest.questions} endTime={endTime} />
        )}
      <section className="challenge-details">
        <div className="containers">
          <h3>About Challenge</h3>
          <p>
            <strong>1. Eligibility:</strong>
          </p>
          <ul>
            <li>Open to individuals or teams of 1-4 members.</li>
            <li>
              Participants must adhere to the code of conduct throughout the
              event.
            </li>
          </ul>
          {/* Other sections omitted for brevity */}
        </div>
      </section>
    </>
  );
};

export default EventPage;
