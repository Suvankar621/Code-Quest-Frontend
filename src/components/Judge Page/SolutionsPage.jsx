import React, { useEffect, useState } from 'react';
import './Judge.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../Contants';

const SolutionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [teamScores, setTeamScores] = useState({}); // Track scores per team
  const { id } = useParams();

  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const res = await axios.get(`${server}/api/v1/contest/getcontest/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          },
        });
        setQuestions(res.data.contest.questions);
        initializeTeamScores(res.data.contest.registeredTeams);
      } catch (error) {
        console.error('Error fetching contest data:', error);
        setQuestions([]);
      }
    };

    fetchContestData();
  }, [id]);

  const initializeTeamScores = (teams) => {
    const initialScores = {};
    teams.forEach(team => {
      initialScores[team._id] = {
        score1: '',
        score2: '',
        score3: '',
        score4: ''
      };
    });
    setTeamScores(initialScores);
  };

  const handleScoreChange = (e, teamId, scoreField) => {
    const score = e.target.value;
    setTeamScores({
      ...teamScores,
      [teamId]: {
        ...teamScores[teamId],
        [scoreField]: score
      }
    });
  };

  const handleSubmitScores = async (e, teamId, questionId) => {
    e.preventDefault();
    const { score1, score2, score3, score4 } = teamScores[teamId];

    try {
      const res = await axios.post(
        `${server}/api/v1/contest/score/${id}/${questionId}/${teamId}`, // Assuming questions[0]._id is the first question's ID
        { score1, score2, score3, score4 },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );
      console.log('Scores submitted successfully:', res.data);
      alert('Scores submitted successfully');
      // Optional: Update local state or refresh data
    } catch (error) {
      console.error('Error submitting scores:', error);
      alert('Error submitting scores');
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }
  questions.forEach(e => {
    console.log(e.submissions)

  });
  
  return (
    <>
      <h2>Answer Submissions</h2>
      {questions.map((question) => (
        <div className="containersss" key={question._id}>
          <h3>Question: {question.questionText}</h3>
          {question.submissions.map((submission,i) => (
               <>
            <div className="submission" key={submission._id}>
              <h2><b>{submission.userId}</b> </h2>
              <p className="submission-message">Answer: {i} <a href={submission.file.url} target='__blanck'>{submission.file.url}</a></p>
              <form
                className="score-form"
                key={`form-${submission._id}`}
                onSubmit={(e) => handleSubmitScores(e, submission.userId, question._id)}
              >
                <label htmlFor={`score1-${submission.userId}`}>Score 1:</label>
                <input
                  type="number"
                  value={teamScores[submission.userId]?.score1 || ''}
                  id={`score1-${submission.userId}`}
                  name={`score1-${submission.userId}`}
                  min="0"
                  max="100"
                  required
                  onChange={(e) => handleScoreChange(e, submission.userId, 'score1')}
                />
                <label htmlFor={`score2-${submission.userId}`}>Score 2:</label>
                <input
                  type="number"
                  value={teamScores[submission.userId]?.score2 || ''}
                  id={`score2-${submission.userId}`}
                  name={`score2-${submission.userId}`}
                  min="0"
                  max="100"
                  required
                  onChange={(e) => handleScoreChange(e, submission.userId, 'score2')}
                />
                <label htmlFor={`score3-${submission.userId}`}>Score 3:</label>
                <input
                  type="number"
                  value={teamScores[submission.userId]?.score3 || ''}
                  id={`score3-${submission.userId}`}
                  name={`score3-${submission.userId}`}
                  min="0"
                  max="100"
                  required
                  onChange={(e) => handleScoreChange(e, submission.userId, 'score3')}
                />
                <label htmlFor={`score4-${submission.userId}`}>Score 4:</label>
                <input
                  type="number"
                  value={teamScores[submission.userId]?.score4 || ''}
                  id={`score4-${submission.userId}`}
                  name={`score4-${submission.userId}`}
                  min="0"
                  max="100"
                  required
                  onChange={(e) => handleScoreChange(e, submission.userId, 'score4')}
                />
                <button type="submit">Submit Scores</button>
              </form>
             
            </div>
             <p>-----------------------------------------------------------------------</p>
          </>
          ))}
        </div>
      ))}
    </>
  );
};

export default SolutionPage;
