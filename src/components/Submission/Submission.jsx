import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Submission.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '../../Context';

const Submission = ({ question, endTime }) => {
  const { user } = useContext(Context);
  const { id } = useParams();
  const [answers, setAnswers] = useState({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [submissionIds, setSubmissionIds] = useState({});

  useEffect(() => {
    const now = new Date();
    if (now > new Date(endTime)) {
      setIsEditable(false); // Disable editing after end time
    }
  }, [endTime]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      for (const [questionId, answer] of Object.entries(answers)) {
        const url = submissionIds[questionId]
          ? `https://code-quest-backend.onrender.com/api/v1/contest/update/${submissionIds[questionId]}`
          : `https://code-quest-backend.onrender.com/api/v1/contest/submit/${id}`;

        const method = submissionIds[questionId] ? 'put' : 'post';

        const { data } = await axios({
          method,
          url,
          data: { questionId, answer },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        toast.success(data.message);
        setIsAnswered(true);
        setIsEditable(false);
      }
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
            const submissionIdMap = {};

            userSubmissions.forEach(submission => {
              answerMap[submission.questionId] = submission.answer;
              submissionIdMap[submission.questionId] = submission._id;
            });

            setAnswers(answerMap);
            setSubmissionIds(submissionIdMap);
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
  }, [id, user, isEditable]);
  console.log(question)

  return (
    <div className="submission-container">
      <h2>Submit Your Work</h2>
      <form id="submissionForm" onSubmit={handleSubmit} encType="multipart/form-data">
        {question.map((question) => (
          <div key={question._id} className="form-group">
            <h3>Q) {question.questionText}</h3>
            <label className="label1" htmlFor={`submissionMessage-${question._id}`}>Write Your Answer Here:</label>
            <textarea
              id={`submissionMessage-${question._id}`}
              name={`submissionMessage-${question._id}`}
              rows="5"
              value={answers[question._id] || ''}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              required
              disabled={!isEditable && isAnswered} // Disable textarea when not editable and already answered
            ></textarea>
          </div>
        ))}
        <div className="form-group">
          {isAnswered ? (
            <button
              type="button"
              className="edit-btn"
              onClick={() => setIsEditable(!isEditable)} // Toggle isEditable on button click
            >
              {isEditable ? 'Cancel Edit' : 'Edit'}
            </button>
          ) : null}
          <button
            type="submit"
            className="submit-btn"
            disabled={!isEditable && isAnswered} // Disable submit button when not editable or if already answered
          >
            {isAnswered ? 'Save' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Submission;
