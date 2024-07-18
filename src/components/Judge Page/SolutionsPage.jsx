import React, { useContext, useEffect, useState } from 'react';
import './Judge.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../Contants';
import { Context } from '../../Context';

const SolutionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [teamScores, setTeamScores] = useState({}); // Track scores per team
  const { user } = useContext(Context);
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

        const userEmailAddress = user.email;

        // Assuming `res.data.contest.questions` is an array of questions with `judges` field
        const contestQuestions = res.data.contest.questions;

        // Filter questions where the user's email is included in the judges
        const filteredQuestions = contestQuestions.filter(question => {
          return question.judges.some(judge => judge.email === userEmailAddress);
        });

        // Set the filtered questions to state or do further processing
        setQuestions(filteredQuestions);
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
    const score = parseInt(e.target.value, 10); // Ensure score is parsed as integer
    if (score > 25) {
      alert('Maximum score allowed is 25.');
      return;
    }
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

  const groupedSubmissions = questions.reduce((acc, question) => {
    question.submissions.forEach((submission) => {
      if (!acc[submission.userId]) {
        acc[submission.userId] = { userId: submission.userId, submissions: [], questionId: question._id };
      }
      acc[submission.userId].submissions.push(submission);
    });
    return acc;
  }, {});

  return (
    <>
      <h2>Answer Submissions</h2>
      <section className="participant-panel">
        <div className="containers1">
          <h2>Submissions</h2>
          {Object.keys(groupedSubmissions).map((userId) => {
            const group = groupedSubmissions[userId];
            return (
              <div className="containersss" key={userId}>
                <h2><b>{userId}</b> </h2>
                {group.submissions.map((submission, i) => (
                  <div className="submission" key={submission._id}>
                    <p className="submission-message">
                      Answer {i + 1}: <a href={submission.file.url} target='__blanck'>{submission.file.url}</a>
                    </p>
                  </div>
                ))}
                <form
                  className="score-form"
                  onSubmit={(e) => handleSubmitScores(e, userId, group.questionId)}
                >
                  <label htmlFor={`score1-${userId}`}>Idea:</label>
                  <input
                    type="number"
                    value={teamScores[userId]?.score1 || ''}
                    id={`score1-${userId}`}
                    name={`score1-${userId}`}
                    min="0"
                    max="25" // Restrict maximum score to 25
                    required
                    onChange={(e) => handleScoreChange(e, userId, 'score1')}
                  />
                  <label htmlFor={`score2-${userId}`}>Architecture:</label>
                  <input
                    type="number"
                    value={teamScores[userId]?.score2 || ''}
                    id={`score2-${userId}`}
                    name={`score2-${userId}`}
                    min="0"
                    max="25" // Restrict maximum score to 25
                    required
                    onChange={(e) => handleScoreChange(e, userId, 'score2')}
                  />
                  <label htmlFor={`score3-${userId}`}>Completeness:</label>
                  <input
                    type="number"
                    value={teamScores[userId]?.score3 || ''}
                    id={`score3-${userId}`}
                    name={`score3-${userId}`}
                    min="0"
                    max="25" // Restrict maximum score to 25
                    required
                    onChange={(e) => handleScoreChange(e, userId, 'score3')}
                  />
                  <label htmlFor={`score4-${userId}`}>UI/UX:</label>
                  <input
                    type="number"
                    value={teamScores[userId]?.score4 || ''}
                    id={`score4-${userId}`}
                    name={`score4-${userId}`}
                    min="0"
                    max="25" // Restrict maximum score to 25
                    required
                    onChange={(e) => handleScoreChange(e, userId, 'score4')}
                  />
                  <button type="submit">Submit Scores</button>
                </form>
                <p>-----------------------------------------------------------------------</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default SolutionPage;
