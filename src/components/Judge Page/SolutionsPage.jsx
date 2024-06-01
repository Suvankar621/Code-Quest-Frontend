import React, { useEffect, useState } from 'react';
import "./Judge.css";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SolutionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [scores, setScores] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios.get(`https://code-quest-backend.onrender.com/api/v1/contest/getcontest/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      },
    }).then((res) => {
      setSubmissions(res.data.contest.submissions);
    }).catch((error) => {
      console.error('Error fetching submissions:', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleScoreChange = (e, submissionId) => {
    setScores({
      ...scores,
      [submissionId]: e.target.value,
    });
  };

  const handleSubmitScore = (e, submissionId) => {
    e.preventDefault();
    const score = scores[submissionId];

    axios.post(`https://code-quest-backend.onrender.com/api/v1/contest/score/${id}/${submissionId}`, {
      score
    }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      },
    }).then((res) => {
      console.log('Score submitted successfully:', res.data);
      alert('Score submitted successfully');
    }).catch((error) => {
      console.error('Error submitting score:', error);
      alert('Error submitting score');
    });
  };

  return (
    <>
      <h2>Answer Submissions</h2>
      {submissions.map((submission) => (
        <div className="container" key={submission._id}>
          <div className="submission-list">
            <div className="submission">
              <h3>{submission.userId}</h3>
              <p className="submission-message">{submission.answer}</p>
              <form className="score-form" onSubmit={(e) => handleSubmitScore(e, submission._id)}>
                <label htmlFor={`score-${submission._id}`}>Score:</label>
                <input
                  type="number"
                  value={submission.score|| ''}
                  id={`score-${submission._id}`}
                  name={`score-${submission._id}`}
                  min="0"
                  max="100"
                  required
                  onChange={(e) => handleScoreChange(e, submission._id)}
                />
                <button type="submit">Submit Score</button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SolutionsPage;
