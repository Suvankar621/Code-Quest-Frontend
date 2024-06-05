import React, { useEffect, useState } from 'react';
import "./LeaderBoardScore.css";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const LeaderBoard = () => {
    const [contest, setContest] = useState([]);
    const [userNames, setUserNames] = useState({});
    const { id } = useParams();
    
    useEffect(() => {
        const fetchContestData = async () => {
            try {
                const res = await axios.get(`https://code-quest-backend.onrender.com/api/v1/contest/getcontest/${id}`, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                setContest(res.data.contest.submissions);
            } catch (error) {
                setContest([]);
            }
        };

        fetchContestData();
    }, [id]);

    useEffect(() => {
        const fetchUserNames = async () => {
            try {
                const userNamesPromises = contest.map(submission =>
                    axios.get(`https://code-quest-backend.onrender.com/api/v1/users/user/${submission.userId}`, {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json"
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
                console.error("Error fetching user names:", error);
            }
        };

        if (contest.length > 0) {
            fetchUserNames();
        }
    }, [contest]);

    // Sort the contest array based on scores in descending order
    const sortedContest = contest.sort((a, b) => b.score - a.score);

    return (
        <section className="leaderboard">
            <div className="container">
                <h2>Leaderboard</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Participant Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedContest.map((e, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{userNames[e.userId] || 'Loading...'}</td>
                                <td>{e.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default LeaderBoard;
