import React, { useContext, useEffect, useRef, useState } from 'react';
import Dashboard from './Dashboard';
import { toast, ToastContainer } from 'react-toastify';
import Loading from '../Loader/Loading';
import { Context } from '../../Context';
import { server } from '../../Contants';
import axios from 'axios';
import "./Addjury.css";

const Addjury = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Judge");
  const [juryMembers, setJuryMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isLoader, setisLoader } = useContext(Context);

  const modal=useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setisLoader(true);
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
      setIsModalOpen(false)
      setisLoader(false);
      toast.success(data.message);
      setJuryMembers([...juryMembers, { name, email, role }]);
    } catch (error) {
      setisLoader(false);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
const allJury=[];
  useEffect(() => {
    const fetchJuryMembers = async () => {
      try {
        const { data } = await axios.get(`${server}/api/v1/users/jury`);
      
        setJuryMembers(data.user)
  
      } catch (error) {
        toast.error("Failed to load jury members");
      }
    };
    setJuryMembers(allJury)
    fetchJuryMembers();
  }, []);

  const deleteJuryMember = async (id) => {
    try {
      setisLoader(true);
      const { data } = await axios.delete(`${server}/api/v1/users/jury/${id}`, {
        withCredentials: true
      });
      setisLoader(false);
      toast.success(data.message);
      setJuryMembers(juryMembers.filter(member => member._id !== id));
    } catch (error) {
      setisLoader(false);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  if (isLoader) {
    return <Loading />;
  }

  return (
    <>
      <Dashboard />
      <div className="jury_container">
        <ToastContainer />
        <button className="add_jury_btn" onClick={() => setIsModalOpen(true)}>Add Jury</button>
        {isModalOpen && (
          <div ref={modal} className="modal">
            <div className="modal_content">
              <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
              <div className="jury_login">
                <div className="text">
                  <h1>Get Started Now</h1>
                </div>
                <form onSubmit={onSubmitHandler}>
                  <div className="jury_name">
                    <label>Name</label><br />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required /><br />
                  </div>
                  <div className="jury_email">
                    <label>Email address</label><br />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
                  </div>
                  <div className="jury_pass">
                    <label>Password</label><br />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
                  </div>
                  <button className="jury_btnn" type="submit">Add Jury</button>
                </form>
              </div>
            </div>
          </div>
        )}
        <div className="juryMembers">
          <h2>Jury Members</h2>
          <div className="jury_cards">
            {juryMembers.filter(member => member.role === 'Judge').map((member, index) => (
              <div className="jury_card" key={index}>
                <div className="jury_card_content">
                  <h3>{member.name}</h3>
                  <p>{member.email}</p>
                  <button className="delete_btn" onClick={() => deleteJuryMember(member._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
    
      </div>
    </>
  );
};

export default Addjury;
