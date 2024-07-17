import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../Context";
import Loading from "../Loader/Loading";
import "./Submission.css";
import { server } from "../../Contants";

const Submission = ({ question }) => {
  const { user, isLoader, setisLoader } = useContext(Context);
  const { id } = useParams();
  const [isAnswered, setIsAnswered] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formError, setFormError] = useState(null);
  const [qId, setqId] = useState(null);
  const [isTeamSubmitted, setisTeamSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if any file is selected
    if (selectedFiles.length === 0) {
      setFormError('Please select at least one file to upload.');
      return;
    } else {
      setFormError(null);
    }
console.log(formError)
    try {
      setisLoader(true);

      // Iterate over selectedFiles and upload each file to Cloudinary
      const uploads = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "codequest");
        formData.append("cloud_name","dcvy5h2nh");

        const { data } = await axios.post(
          "https://api.cloudinary.com/v1_1/dcvy5h2nh/raw/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Handle Cloudinary response and submit to your backend
        const { secure_url } = data;
        const submissionData = {
          questionId: qId,
          fileUrl: secure_url,
        };

        const response = await axios.post(
          `${server}/api/v1/contest/submit/${id}/${qId}`,
          submissionData,
          {
            withCredentials: true,
          }
        );

        return response.data;
      });

      // Wait for all uploads to complete
      await Promise.all(uploads);

      toast.success("Files submitted successfully");
      setIsAnswered(true);
      setisLoader(false);
    } catch (err) {
      if (err.response) {
        console.error("Server Error:", err.response.data);
        toast.error(
          err.response?.data?.message || "Submission failed. Please try again."
        );
      } else {
        console.error("Network Error:", err.message);
        toast.error("Network error. Please check your connection.");
      }
      setisLoader(false);
    }
  };

  useEffect(() => {
    const fetchContestData = async () => {
      if (!user || !user._id) {
        console.error("User not available");
        return;
      }

      try {
        const res = await axios.get(
          `${server}/api/v1/contest/getcontest/${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data && res.data.contest) {
          const contestData = res.data.contest;
          const hasSubmitted = contestData.questions.some(question =>
            question.submissions.some(submission => submission.userId === user._id)
          );

          setisTeamSubmitted(res.data.contest.questions.some(question => 
            question.submissions.some(submission => submission.userId === user._id)
          ));
          res.data.contest.registeredTeams.forEach(team => {
            team.members.forEach(member => {
              if(member.email===user.email){
                console.log(member.email);
                setisTeamSubmitted(true)
                return;
              }
            
         
            });
          });

          // const memberdata=contestData.questions.some(q => q.userId==user._id);
          // console.log(memberdata)

          setIsAnswered(hasSubmitted);
          // setIsAnswered(memberdata)
        } else {
          setIsAnswered(false);
        }
      } catch (err) {
        console.error("Error fetching contest data:", err);
        setIsAnswered(false);
      }
    };

    fetchContestData();
  }, [id, user]);

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...filesArray]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  if (isLoader) {
    return <Loading />;
  }
console.log(isTeamSubmitted)
  return (
    <>
      {isAnswered === null ? (
        <div>Loading...</div>
      ) : !isAnswered ? (
        <section className="participant-panel">
          <div className="containers1">
            <h2>Submit Your Work</h2>
            <form id="submissionForm" onSubmit={handleSubmit} encType="multipart/form-data">
              {question.map((q,i) => (
                <div key={q._id} className="form-group">
                  <h3>Q{i+1}) {q.questionText}</h3>

                 {!isTeamSubmitted?<label className="label1" htmlFor={`fileInput-${q._id}`}>
                    Upload File:
                  </label>:<></>}
              

                  {!isTeamSubmitted? <input
                    id={`fileInput-${q._id}`}
                    type="file"
                    onChange={handleFileChange}
                    accept="*"
                    multiple
                    onClick={()=>setqId(q._id)}
                  />:<></>}
                 
                  
                </div>
              ))}

             
              {selectedFiles.length === 0 && 
               !isTeamSubmitted?
              <div className="error-message">Please select at least one file.</div>:<></>}
         
              {!isTeamSubmitted? <div className="selected-files">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <span>{file.name}</span>
                    <button type="button" onClick={() => handleRemoveFile(index)}>Remove</button>
                  </div>
                ))}
              </div>:<></>}
             
           
             {!isTeamSubmitted?<div className="form-group">
                 <button type="submit" className="submit-btn">
                   Submit
                 </button>
               </div>:<></>}
                 
             
            </form>
          </div>
        </section>
      ) : (
        <div className="rsub">Your submission has already been received.</div>
      )}
    </>
  );
};

export default Submission;
