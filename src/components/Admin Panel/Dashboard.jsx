import React, { useState ,useEffect} from 'react'
import "./Dashboard.css"

const Dashboard = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [contests, setContests] = useState([]);
    const [formValues, setFormValues] = useState({
        title: '',
        startDate: '',
        endDate: '',
        question: '',
    });

    useEffect(() => {
        const storedContests = JSON.parse(localStorage.getItem('contests')) || [];
        setContests(storedContests);
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newContests = [...contests];
        if (isEditing) {
            newContests[editingIndex] = formValues;
            setIsEditing(false);
            setEditingIndex(-1);
        } else {
            newContests.push(formValues);
        }
        setContests(newContests);
        localStorage.setItem('contests', JSON.stringify(newContests));
        setModalVisible(false);
        setFormValues({ title: '', startDate: '', endDate: '', question: '' });
    };

    const handleEdit = (index) => {
        setFormValues(contests[index]);
        setIsEditing(true);
        setEditingIndex(index);
        setModalVisible(true);
    };

    const handleDelete = (index) => {
        const newContests = contests.filter((_, i) => i !== index);
        setContests(newContests);
        localStorage.setItem('contests', JSON.stringify(newContests));
    };

    return (
        <div className="app">
            <header className="header">
                <div className="logo">CodeQuest</div>
                <nav>
                    <a href="#">Go to Contest</a>
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Contact Us</a>
                </nav>
            </header>
            <div className="container">
                <aside className="aside">
                    <ul>
                        <li><a href="create.html">Create</a></li>
                        <li><a href="#">Leaderboard</a></li>
                        <li><a href="index.html">Dashboard</a></li>
                    </ul>
                </aside>
                <main className="main">
                    <div className="dashboard-header">
                        <h1>Admin Dashboard</h1>
                        <button className="create-button" onClick={() => setModalVisible(true)}>Create</button>
                    </div>
                    <div className="dashboard-stats">
                        <div className="stat-card">
                            <h2>Total Submissions</h2>
                            <p>120</p>
                        </div>
                        <div className="stat-card">
                            <h2>Total Participants</h2>
                            <p>75</p>
                        </div>
                        <div className="stat-card">
                            <h2>Highest Score</h2>
                            <p>99</p>
                        </div>
                    </div>
                    <div className="contests">
                        <h2>Contests</h2>
                        <div id="contest-container">
                            {contests.map((contest, index) => (
                                <div className="contest-card" key={index}>
                                    <img src="hacker.png" alt="The Hacker" />
                                    <div className="contest-details">
                                        <h4>{contest.title}</h4>
                                        <h5>Start: {new Date(contest.startDate).toLocaleString()}</h5>
                                        <h6>End: {new Date(contest.endDate).toLocaleString()}</h6>
                                    </div>
                                    <div className="contest-actions">
                                        <button className="edit-btn" onClick={() => handleEdit(index)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
                        <h2>{isEditing ? 'Edit Contest' : 'Create Contest'}</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="title">Contest Title:</label>
                            <input type="text" id="title" value={formValues.title} onChange={handleInputChange} required />

                            <label htmlFor="startDate">Start Date:</label>
                            <input type="datetime-local" id="startDate" value={formValues.startDate} onChange={handleInputChange} required />

                            <label htmlFor="endDate">End Date:</label>
                            <input type="datetime-local" id="endDate" value={formValues.endDate} onChange={handleInputChange} required />

                            <div id="question-section">
                                <label htmlFor="question">Question:</label>
                                <textarea id="question" rows="4" value={formValues.question} onChange={handleInputChange}></textarea>
                            </div>

                            <button type="submit" className="btn-blue">{isEditing ? 'Update' : 'Create'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard