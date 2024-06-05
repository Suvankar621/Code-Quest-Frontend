import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Submission.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '../../Context';

const Submission = ({question}) => {
  const { user } = useContext(Context); // Ensure user context is available
  const { id } = useParams();
  const [answer, setAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(null); // null indicates loading state

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        `https://code-quest-backend.onrender.com/api/v1/contest/submit/${id}`,
        { answer },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setIsAnswered(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed. Please try again.");
    }
  };

  useEffect(() => {
    const fetchContestData = async () => {
      if (!user || !user._id) {
        console.error('User not available');
        return;
      }

      try {
        const res = await axios.get(
          `https://code-quest-backend.onrender.com/api/v1/contest/getcontest/${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (res.data && res.data.contest) {
          const contestData = res.data.contest;
          const hasSubmitted = contestData.submissions.some(submission => submission.userId === user._id);
          setIsAnswered(hasSubmitted);
        } else {
          setIsAnswered(false);
        }
      } catch (err) {
        console.error('Error fetching contest data:', err);
        setIsAnswered(false);
      }
    };

    fetchContestData();
  }, [id, user]);

  console.log('isAnswered:', isAnswered); // Enhanced logging for debugging

  return (
    <>
      {isAnswered === null ? (
        <div>Loading...</div>
      ) : !isAnswered ? (
        <section className="participant-panel">
          <div className="containers1">
            <h2>Submit Your Work</h2>
            <form id="submissionForm" onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <h3>Q) {question}</h3>
              </div>
              <div className="form-group">
                <label className="label1" htmlFor="submissionMessage">Write Your Answer Here:</label>
                <textarea
                  id="submissionMessage"
                  name="submissionMessage"
                  rows="5"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                ></textarea>
              </div>
              {/* <div className="form-group">
                <label className="label1" htmlFor="submissionFiles">Or Add Files Here:</label>
                <input
                  type="file"
                  id="submissionFiles"
                  name="submissionFiles[]"
                  multiple
                  onChange={handleFileChange}
                />
              </div> */}
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        </section>
      ) : (
        <div>Your submission has already been received.</div>
      )}
    </>
  );
};

export default Submission;
