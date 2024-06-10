import React, { useEffect, useState } from 'react';
import "./Judge.css";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SolutionPage = () => {
  const [userSubmissions, setUserSubmissions] = useState({});
  const [scores, setScores] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios.get(`https://code-quest-backend.onrender.com/api/v1/contest/getcontest/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      },
    }).then((res) => {
      const submissions = res.data.contest.submissions;
      const submissionsByUser = groupSubmissionsByUser(submissions);
      setUserSubmissions(submissionsByUser);
    }).catch((error) => {
      console.error('Error fetching submissions:', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id,scores,userSubmissions]);

  const groupSubmissionsByUser = (submissions) => {
    const groupedSubmissions = {};
    submissions.forEach(submission => {
      if (!groupedSubmissions[submission.userId]) {
        groupedSubmissions[submission.userId] = [];
      }
      groupedSubmissions[submission.userId].push(submission);
    });
    return groupedSubmissions;
  };

  const handleScoreChange = (e, submissionId) => {
    const score = e.target.value;
    setScores({ ...scores, [submissionId]: score });
  };

  const handleSubmitScore = async (e, submissionId) => {
    e.preventDefault();
    const score = scores[submissionId];
    try {
      const res = await axios.post(`https://code-quest-backend.onrender.com/api/v1/contest/score/${id}/${submissionId}`, {
        score
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        },
      });
      console.log('Score submitted successfully:', res.data);
      alert('Score submitted successfully');
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Error submitting score');
    }
  };

  return (
    <>
      <h2>Answer Submissions</h2>
      {Object.keys(userSubmissions).map(userId => (
        <div className="containersss" key={userId}>
          <h3>User: {userId}</h3>
          {userSubmissions[userId].map((submission) => (
            <div className="submission" key={submission._id}>
              <p className="submission-message">Answer: {submission.answer}</p>
              <form className="score-form" onSubmit={(e) => handleSubmitScore(e, submission._id)}>
                <label htmlFor={`score-${submission._id}`}>Score:</label>
                <input
                  type="number"
                  value={submission.score }
                  id={`score-${submission._id}`}
                  name={`score-${submission._id}`}
                  min="0"
                  max="100"
                  required
                  onChange={(e) => handleScoreChange(e, submission._id)}
                />
                {!submission.score ? (
                  <button type="submit">Submit Score</button>
                ) : (
                  <button disabled id='disabled' type="submit">Submit Score</button>
                )}
              </form>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default SolutionPage;
