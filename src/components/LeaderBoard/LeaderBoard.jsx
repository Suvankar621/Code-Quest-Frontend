import React, {  useEffect, useState } from 'react';
import './LeaderBoardScore.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../Contants';
// import { Context } from '../../Context';

const LeaderBoard = () => {
    const [contest, setContest] = useState([]);
    const [teamNames, setTeamNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [sortedByQuestion, setSortedByQuestion] = useState(false);
    // const [sortCategory, setSortCategory] = useState(null);
    const { id } = useParams();
    // const { user } = useContext(Context);

    const categoryNames = ['Idea', 'Architecture', 'Completeness', 'UI/UX'];

    useEffect(() => {
        const fetchContestData = async () => {
            try {
                const res = await axios.get(`${server}/api/v1/contest/getcontest/${id}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                setContest(res.data.contest.questions.flatMap(question =>
                    question.submissions.map(submission => ({
                        ...submission,
                        questionId: question._id
                    }))
                ));
                setLoading(false);

                // Fetch team names
                const teams = res.data.contest.registeredTeams;
                const teamNamesMap = teams.reduce((acc, team) => {
                    acc[team.teamLeader] = team.teamName;
                    team.members.forEach(member => {
                        acc[member._id] = team.teamName;
                    });
                    return acc;
                }, {});

                setTeamNames(teamNamesMap);
            } catch (error) {
                console.error('Error fetching contest data:', error);
                setContest([]);
                setLoading(false);
            }
        };

        fetchContestData();
    }, [id]);

    const aggregateScores = () => {
        const aggregatedScores = {};

        contest.forEach(entry => {
            const { userId, scores } = entry;

            if (!(userId in aggregatedScores)) {
                aggregatedScores[userId] = {
                    totalScore: 0,
                    teamName: teamNames[userId] || 'Loading...',
                    highestCategoryScore: 0,
                    highestCategoryName: ''
                };
            }

            if (scores) {
                const { score1 = 0, score2 = 0, score3 = 0, score4 = 0 } = scores;

                const highestScore = Math.max(score1, score2, score3, score4);

                if (score1 < 10 || score2 < 10 || score3 < 10 || score4 < 10) {
                    delete aggregatedScores[userId];
                    return;
                }

                aggregatedScores[userId].totalScore += score1 + score2 + score3 + score4;
                if (highestScore > aggregatedScores[userId].highestCategoryScore) {
                    aggregatedScores[userId].highestCategoryScore = highestScore;
                    aggregatedScores[userId].highestCategoryName = categoryNames[[score1, score2, score3, score4].indexOf(highestScore)];
                }
            }
        });

        return Object.values(aggregatedScores);
    };

    const sortByQuestion = () => {
        const questionWiseScores = contest.reduce((acc, curr) => {
            const { questionId, userId, scores } = curr;

            if (!acc[questionId]) {
                acc[questionId] = {};
            }

            if (!acc[questionId][userId]) {
                acc[questionId][userId] = {
                    totalScore: 0,
                    highestCategoryScore: 0,
                    highestCategoryName: ''
                };
            }

            if (scores) {
                const { score1 = 0, score2 = 0, score3 = 0, score4 = 0 } = scores;

                const highestScore = Math.max(score1, score2, score3, score4);

                if (score1 < 10 || score2 < 10 || score3 < 10 || score4 < 10) {
                    delete acc[questionId][userId];
                    return acc;
                }

                acc[questionId][userId].totalScore += score1 + score2 + score3 + score4;
                if (highestScore > acc[questionId][userId].highestCategoryScore) {
                    acc[questionId][userId].highestCategoryScore = highestScore;
                    acc[questionId][userId].highestCategoryName = categoryNames[[score1, score2, score3, score4].indexOf(highestScore)];
                }
            }

            return acc;
        }, {});

        const sortedQuestionWiseScores = Object.entries(questionWiseScores).map(([questionId, userScores]) => ({
            questionId,
            scores: Object.entries(userScores).map(([userId, { totalScore, highestCategoryScore, highestCategoryName }]) => ({
                userId,
                totalScore,
                highestCategoryScore,
                highestCategoryName
            }))
        }));

        setSortedByQuestion(sortedQuestionWiseScores);
    };

    const sortCategoryWise = (questionId, categoryIndex) => {
        const questionScores = sortedByQuestion.find(q => q.questionId === questionId);
        if (questionScores) {
            questionScores.scores.sort((a, b) => {
                const scoreA = contest.find(c => c.userId === a.userId && c.questionId === questionId).scores[`score${categoryIndex + 1}`] || 0;
                const scoreB = contest.find(c => c.userId === b.userId && c.questionId === questionId).scores[`score${categoryIndex + 1}`] || 0;
                return scoreB - scoreA;
            });
            setSortedByQuestion([...sortedByQuestion]);
        }
    };

    const resetSort = () => {
        setSortedByQuestion(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section className="leaderboard">
            <div className="container">
                <h2>Leaderboard</h2>
                {sortedByQuestion ? (
                    sortedByQuestion.map(({ questionId, scores }, index) => (
                        <div key={questionId}>
                            <h3>Question {index + 1}</h3>
                            <div>
                                {categoryNames.map((category, idx) => (
                                    <button key={idx} onClick={() => sortCategoryWise(questionId, idx)}>
                                        Sort by {category}
                                    </button>
                                ))}
                            </div>
                            {scores.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Team Name</th>
                                            <th>Total Score</th>
                                            <th>Highest Category Score</th>
                                            <th>Category Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scores
                                            .filter(e => e.totalScore >= 40)
                                            .map((e, idx) => (
                                                <tr key={e.userId}>
                                                    <td>{idx + 1}</td>
                                                    <td>{teamNames[e.userId] || 'Loading...'}</td>
                                                    <td>{e.totalScore}</td>
                                                    <td>{e.highestCategoryScore}</td>
                                                    <td>{e.highestCategoryName}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No submissions found for this question.</p>
                            )}
                        </div>
                    ))
                ) : (
                    <div>
                        <button onClick={sortByQuestion}>Sort by Question</button>
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Team Name</th>
                                    <th>Total Score</th>
                                    <th>Highest Category Score</th>
                                    <th>Category Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aggregateScores()
                                    .filter(e => e.totalScore >= 40)
                                    .map((e, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{e.teamName}</td>
                                            <td>{e.totalScore}</td>
                                            <td>{e.highestCategoryScore}</td>
                                            <td>{e.highestCategoryName}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {sortedByQuestion && (
                    <button onClick={resetSort}>Back to Overall Leaderboard</button>
                )}
            </div>
        </section>
    );
};

export default LeaderBoard;
