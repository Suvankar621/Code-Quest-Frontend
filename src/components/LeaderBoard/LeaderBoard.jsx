import React, { useEffect, useState } from 'react';
import './LeaderBoardScore.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../Contants';

const LeaderBoard = () => {
    const [contest, setContest] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [sortedByQuestion, setSortedByQuestion] = useState(false); // State to track if sorting by question
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
                setContest(res.data.contest.questions.flatMap(question =>
                    question.submissions.map(submission => ({
                        ...submission,
                        questionId: question._id // Add questionId to each submission
                    }))
                ));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching contest data:', error);
                setContest([]);
                setLoading(false);
            }
        };

        fetchContestData();
    }, [id]);

    useEffect(() => {
        const fetchUserNames = async () => {
            try {
                const userNamesPromises = contest.map(submission =>
                    axios.get(`${server}/api/v1/users/user/${submission.userId}`, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }).then(userRes => ({
                        userId: submission.userId,
                        name: userRes.data.user.name
                    }))
                );

                const userNamesData = await Promise.all(userNamesPromises);
                const namesMap = userNamesData.reduce((acc, curr) => {
                    acc[curr.userId] = curr.name;
                    return acc;
                }, {});

                setUserNames(namesMap);
            } catch (error) {
                console.error('Error fetching user names:', error);
            }
        };

        if (contest.length > 0) {
            fetchUserNames();
        }
    }, [contest]);

    // Aggregate scores by user and calculate the average score
    const userScores = contest.reduce((acc, curr) => {
        const { userId, scores } = curr;

        if (!acc[userId]) {
            acc[userId] = { totalScore: 0, count: 0 };
        }

        // Adjust to access scores from submission correctly
        if (scores && scores.score1 !== null) {
            acc[userId].totalScore += scores.score1;
            acc[userId].count += 1;
        }

        return acc;
    }, {});

    const averageScores = Object.entries(userScores).map(([userId, { totalScore, count }]) => ({
        userId,
        averageScore: count > 0 ? totalScore / count : 0
    }));

    // Sort the average scores in descending order
    const sortedContest = averageScores.sort((a, b) => b.averageScore - a.averageScore);

    // Function to sort by question-wise scores
    const sortByQuestion = () => {
        const questionWiseScores = contest.reduce((acc, curr) => {
            const { questionId, userId, scores } = curr;

            if (!acc[questionId]) {
                acc[questionId] = {};
            }

            if (!acc[questionId][userId]) {
                acc[questionId][userId] = { totalScore: 0, count: 0 };
            }

            if (scores && scores.score1 !== null) {
                acc[questionId][userId].totalScore += scores.score1;
                acc[questionId][userId].count += 1;
            }

            return acc;
        }, {});

        const questionWiseAverageScores = Object.entries(questionWiseScores).map(([questionId, userScores]) => ({
            questionId,
            scores: Object.entries(userScores).map(([userId, { totalScore, count }]) => ({
                userId,
                averageScore: count > 0 ? totalScore / count : 0
            }))
        }));

        // Sort the average scores for each question in descending order
        const sortedQuestionWiseScores = questionWiseAverageScores.map(({ questionId, scores }) => ({
            questionId,
            scores: scores.sort((a, b) => b.averageScore - a.averageScore)
        }));

        setSortedByQuestion(sortedQuestionWiseScores);
    };

    // Reset sorting to overall leaderboard
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
                            {scores.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Team Name</th>
                                            <th>Average Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scores.map((e, idx) => (
                                            <tr key={e.userId}>
                                                <td>{idx + 1}</td>
                                                <td>{userNames[e.userId] || 'Loading...'}</td>
                                                <td>{e.averageScore.toFixed(2)}</td>
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
                                    <th>Participant Name</th>
                                    <th>Average Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedContest.map((e, index) => (
                                    <tr key={e.userId}>
                                        <td>{index + 1}</td>
                                        <td>{userNames[e.userId] || 'Loading...'}</td>
                                        <td>{e.averageScore.toFixed(2)}</td>
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
