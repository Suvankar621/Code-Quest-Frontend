import React, {  useState } from 'react';
import { useParams } from 'react-router-dom';
import './Submission.css';
import axios from 'axios';


const Submission = () => {
  const { id } = useParams();
  const [answer, setAnswer] = useState("");
//   const [submissionFiles, setSubmissionFiles] = useState([]); 


//   const handleFileChange = (event) => {
//     setSubmissionFiles(event.target.files);
//   };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
//     const formData = new FormData();
//     formData.append('answer', answer);
//     for (const file of submissionFiles) {
//       formData.append('submissionFiles', file);
//     }

    try {
      const {data} = await axios.post(`https://code-quest-backend.onrender.com/api/v1/contest/submit/${id}`,{
        answer
      }, {
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true
    });
    console.log(data.message)

    
    } catch (err) {
        console.log(err.response.data.message)
    }
  };



  return (
    <section className="participant-panel">
      <div className='containers1' >
        <h2>Submit Your Work</h2>
        <form id="submissionForm" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <h3>Q) jbjdsjdsjhdshhhhhhhhhhhhhhhhhhhhh</h3>
          </div>
          <div className="form-group">
            <label className="label1" htmlFor="submissionMessage">Write Your Answer Here:</label>
            <textarea
              id="submissionMessage"
              name="submissionMessage"
              rows="5"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            ></textarea>
          </div>
          {/* <div className="form-group">
            <label className="label1" htmlFor="submissionFiles">Or Add Files Here:</label>
            <input
              type="file"
              id="submissionFiles"
              name="submissionFiles[]"
              multiple
              onChange={handleFileChange}
              
            />
          </div> */}
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </section>
  );
};

export default Submission;
