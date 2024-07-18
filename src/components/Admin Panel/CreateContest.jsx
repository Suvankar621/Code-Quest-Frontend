import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Dashboard from './Dashboard';
import HackethonCard from '../Card/HackethonCard';
import { toast } from 'react-toastify';
import { server } from '../../Contants';
import './CreateContest.css';

const CreateContest = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    questions: [{ questionText: '', judges: [{ email: '' }, { email: '' }] }]
  });
  const [contests, setContests] = useState([]);
  const isAdmin = true;
console.log(formData)
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data } = await axios.get(`${server}/api/v1/contest/mycontests`, {
          withCredentials: true
        });
        setContests(data.contests);
      } catch (error) {
        console.error('There was an error fetching the contests!', error);
      }
    };
    fetchContests();
  }, [modalIsOpen]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('question')) {
      const index = parseInt(name.split('-')[1]);
      const updatedQuestions = [...formData.questions];
      updatedQuestions[index].questionText = value;
      setFormData({
        ...formData,
        questions: updatedQuestions
      });
    } else if (name.startsWith('judge')) {
      const [fieldName, questionIndex, judgeIndex] = name.split('-');
      const updatedQuestions = [...formData.questions];
      updatedQuestions[questionIndex].judges[judgeIndex].email = value;
      setFormData({
        ...formData,
        questions: updatedQuestions
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { questionText: '', judges: [{ email: '' }, { email: '' }] }]
    });
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endTime = new Date(`${formData.endDate}T${formData.endTime}`);

    const contestData = {
      title: formData.title,
      questions: formData.questions.map(q => ({
        questionText: q.questionText,
        judges: q.judges.map(j => ({ email: j.email }))
      })),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    };

    try {
      const { data } = await axios.post(`${server}/api/v1/contest/create`, contestData, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      console.log('Contest created:', data.message);
      toast.success(data.message);
      closeModal();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error('There was an error creating the contest!', error);
    }
  };

  return (
    <>
      <Dashboard />
      <div className='createContest'>
        <button className="create-button" onClick={openModal}>Create</button>
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Create Contest" className="modal" overlayClassName="overlay">
          <h2 className="modal-title">Create Contest</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="form-label" htmlFor="title">Contest Title:</label>
              <input type="text" id="title" name="title" className="form-input" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="startDate">Start Date:</label>
              <input type="date" id="startDate" name="startDate" className="form-input" value={formData.startDate} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="startTime">Start Time:</label>
              <input type="time" id="startTime" name="startTime" className="form-input" value={formData.startTime} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="endDate">End Date:</label>
              <input type="date" id="endDate" name="endDate" className="form-input" value={formData.endDate} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="endTime">End Time:</label>
              <input type="time" id="endTime" name="endTime" className="form-input" value={formData.endTime} onChange={handleInputChange} required />
            </div>
            {formData.questions.map((question, index) => (
              <div key={index} className="form-group">
                <label className="form-label" htmlFor={`question-${index}`}>Question {index + 1}:</label>
                <textarea
                  id={`question-${index}`}
                  name={`question-${index}`}
                  className="form-textarea"
                  value={question.questionText}
                  onChange={handleInputChange}
                  required
                ></textarea>
                {isAdmin && (
                  <div>
                    {question.judges.map((judge, judgeIndex) => (
                      <div key={judgeIndex}>
                        <label className="form-label">Judge {judgeIndex + 1}'s Email:</label>
                        <input
                          type="email"
                          name={`judge-${index}-${judgeIndex}`}
                          className="form-input"
                          value={judge.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-judge-button"
                      onClick={() => {
                        const updatedQuestions = [...formData.questions];
                        updatedQuestions[index].judges.push({ email: '' });
                        setFormData({ ...formData, questions: updatedQuestions });
                      }}
                    >
                      Add Judge
                    </button>
                    {question.judges.length > 1 && (
                      <button
                        type="button"
                        className="remove-judge-button"
                        onClick={() => {
                          const updatedQuestions = [...formData.questions];
                          updatedQuestions[index].judges.pop();
                          setFormData({ ...formData, questions: updatedQuestions });
                        }}
                      >
                        Remove Judge
                      </button>
                    )}
                  </div>
                )}
                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveQuestion(index)}
                  >
                    Remove Question
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-button" onClick={handleAddQuestion}>Add Question</button>
            <div className="form-buttons">
              <button type="submit" className="submit-button">Submit</button>
              <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
      <div className="contest-list">
        {contests.map((contest, index) => (
          <div key={index} className="contest-card">
            <HackethonCard id={contest._id} title={contest.title} startTime={contest.startTime} isAdmin={isAdmin} />
          </div>
        ))}
      </div>
    </>
  );
};

export default CreateContest;
