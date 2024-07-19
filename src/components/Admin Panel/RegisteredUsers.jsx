import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '../../Contants';
import './RegisteredUsers.css';
import { Spinner } from '../Loader/Spinner';

const RegisteredUsers = () => {
    const [contest, setContest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [teamLeaders, setTeamLeaders] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const res = await axios.get(`${server}/api/v1/contest/getcontests`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (res.data && res.data.contests && res.data.contests.length > 0) {
                    const contestData = res.data.contests[0];
                    setContest(contestData);
                    const leaderIds = contestData.registeredTeams.map(team => team.teamLeader);
                    const leaderPromises = leaderIds.map(leaderId =>
                        axios.post(`${server}/api/v1/users/leadername`, { id: leaderId }, {
                            withCredentials: true,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    );

                    const leaderResponses = await Promise.all(leaderPromises);
                    const leaderEmails = leaderResponses.reduce((acc, leaderResponse) => {
                        acc[leaderResponse.data.user._id] = leaderResponse.data.user.email;
                        return acc;
                    }, {});

                    setTeamLeaders(leaderEmails);
                } else {
                    throw new Error('No contest data found.');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching contest data:', error);
                setError('No Users Found');
                setContest([]);
                setLoading(false);
            }
        };

        fetchContests();
    }, []);

    if (loading) {
        return <Spinner />
    }

    return (
        <section className="registered-users">
            <div className="container_reg">
                <h2>Registered Users</h2>
                {error ? (
                    <div className="error">{error}</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Team Name</th>
                                <th>Team Leader Email</th>
                                <th>Members</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contest.registeredTeams.map(team => (
                                <tr key={team.teamLeader}>
                                    <td>{team.teamName}</td>
                                    <td>{teamLeaders[team.teamLeader]}</td>
                                    <td>
                                        {team.members.length > 0 ? (
                                            <ul>
                                                {team.members.map((member, idx) => (
                                                    <li key={member._id}>{member.email}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>No members</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
};

export default RegisteredUsers;
