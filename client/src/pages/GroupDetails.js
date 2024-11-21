import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './GroupDetails.css';

const GroupDetails = (props) => {
    const { data, user, api_url } = props;
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [userVotes, setUserVotes] = useState(new Set());

    useEffect(() => {
        if (!data) {
            console.error("Data is undefined or null.");
            return;
        }

        // Get group details from data
        const result = data.find(item => item.id === parseInt(id));
        if (result) {
            setGroup({ id: result.id, name: result.name, description: result.description });
        }

        // Fetch proposed sessions and user votes for the group
        const fetchSessions = async () => {
            try {
                const response = await fetch(`${api_url}/api/sessions/group/${id}`);
                console.log(response.ok)
                if (response.ok) {
                    const data = await response.json();
                    setSessions(data);
                    setUserVotes(new Set(data.user_votes)); // Set the user's voted sessions
                } else {
                    console.error("Failed to fetch group sessions.");
                }
            } catch (error) {
                console.error("Error fetching group sessions:", error);
            }
        };

        fetchSessions();
    }, [data, id, api_url]);

    const voteForSession = async (sessionId) => {
        try {
            const response = await fetch(`${api_url}/api/sessions/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    user_id: user.id,
                }),
            });

            if (response.ok) {
                const updatedSession = await response.json();
                setSessions(prev => prev.map(session => 
                    session.id === updatedSession.id ? updatedSession : session
                ));
                setUserVotes(prev => new Set([...prev, sessionId]));
            } else {
                console.error("Failed to vote for session.");
            }
        } catch (error) {
            console.error("Error voting for session:", error);
        }
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const times = Array.from({ length: 12 }, (_, i) => `${8 + i}:00:00`);
    console.log(sessions)

    return (
        <div className="group-details">
            {group ? (
                <>
                    <h2>{group.name}</h2>
                    <p>{group.description}</p>

                    <div className="schedule-grid">
                        <div className="header-row">
                            <div className="time-slot"></div>
                            {days.map((day, index) => (
                                <div key={index} className="day-header">{day}</div>
                            ))}
                        </div>
                        {times.map((time, rowIndex) => (
                            <div key={rowIndex} className="time-row">
                                <div className="time-slot">{time}</div>
                                {days.map((day, colIndex) => {
                                    // Only proceed if sessions are available
                                    if (sessions.length === 0) {
                                        return (
                                            <div key={colIndex} className="cell" title="No sessions available yet.">
                                                {/* You could also display some message like "No sessions" */}
                                            </div>
                                        );
                                    }

                                    const matchingSession = sessions.find((session) => {
                                        // Extract the day name from the proposed date
                                        const sessionDate = new Date(session.proposed_date);
                                        const sessionDay = sessionDate.toLocaleString('en-US', { weekday: 'long' });
                                    
                                        //Log to see the values for debugging
                                        // console.log('Time:', typeof(time));
                                        // console.log('Session time:', typeof(session.proposed_time));
                                        // console.log('Day:', typeof(day));
                                        // console.log('Session Day:', typeof(sessionDay));
                                    
                                        // Compare the session day and the current loop day
                                        return sessionDay === day && session.proposed_time === time;
                                    });

                                    if (matchingSession) {
                                        const hasVoted = userVotes.has(matchingSession.id);
                                        return (
                                            <div
                                                key={colIndex}
                                                className={`cell ${hasVoted ? "voted" : ""}`}
                                                onClick={() => {
                                                    if (!hasVoted) {
                                                        voteForSession(matchingSession.id);
                                                    }
                                                }}
                                                title={`${matchingSession.total_votes} vote(s)`}
                                            >
                                                {matchingSession.total_votes}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                key={colIndex}
                                                className="cell"
                                                title="No session proposed"
                                            >
                                                {/* Empty cells for time slots without sessions */}
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        ))}

                    </div>

                    <Link to={`/groups/edit/${id}`}>
                        <button className="edit-group-btn">Edit Group</button>
                    </Link>
                </>
            ) : (
                <p>Loading group details...</p>
            )}
        </div>
    );
};

export default GroupDetails;
