import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Submission.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '../../Context';

const Submission = ({ question }) => {
  const { user } = useContext(Context); // Ensure user context is available
  const { id } = useParams();
  const [answers, setAnswers] = useState({});
  const [isAnswered, setIsAnswered] = useState(null); // null indicates loading state

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      for (const [questionId, answer] of Object.entries(answers)) {
        const { data } = await axios.post(
          `https://code-quest-backend.onrender.com/api/v1/contest/submit/${id}`,
          { questionId, answer },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        toast.success(data.message);
      }
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
          const userSubmissions = contestData.submissions.filter(submission => submission.userId === user._id);

          if (userSubmissions.length > 0) {
            const answerMap = {};
            userSubmissions.forEach(submission => {
              answerMap[submission.questionId] = submission.answer;
            });
            setAnswers(answerMap);
            setIsAnswered(true);
          } else {
            setIsAnswered(false);
          }
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

  return (
    <>
      {isAnswered === null ? (
        <div>Loading...</div>
      ) : !isAnswered ? (
        <section className="participant-panel">
          <div className="containers1">
            <h2>Submit Your Work</h2>
            <form id="submissionForm" onSubmit={handleSubmit} encType="multipart/form-data">
              {question.map((q) => (
                <div key={q._id} className="form-group">
                  <h3>Q) {q.questionText}</h3>
                  <label className="label1" htmlFor={`submissionMessage-${q._id}`}>Your Answer:</label>
                  <textarea
                    id={`submissionMessage-${q._id}`}
                    name={`submissionMessage-${q._id}`}
                    rows="5"
                    value={answers[q._id] || ''}
                    onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                  ></textarea>
                </div>
              ))}
              <div className="form-group">
                <button type="submit" className="submit-btn">Submit</button>
              </div>
            </form>
          </div>
        </section>
      ) : <div>Your submission has already been received.</div>}
    </>
  );
};

export default Submission;
