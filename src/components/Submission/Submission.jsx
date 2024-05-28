import React from 'react'
import "./Submission.css"

const Submission = () => {
   
    

  return (
    <>
    <section class="participant-panel">
        <div class="containers1">
            <h2>Submit Your Work</h2>
            <form id="submissionForm" enctype="multipart/form-data">
                <div class="form-group">
                    {/* <label className='label1' for="teamName">Participant Name :</label>
                    <input type="text" id="teamName" name="teamName" required/> */}
                    <h3>Q)jbjdsjdsjhdshhhhhhhhhhhhhhhhhhhhh</h3>
                </div>
                <div class="form-group">
                    <label className='label1' for="submissionMessage">Write Your Answer Here :</label>
                    <textarea id="submissionMessage" name="submissionMessage" rows="5" required></textarea>
                </div>
                <div class="form-group">
                    <label className='label1' for="submissionFiles">Or Add Files Here :</label>
                    <input type="file" id="submissionFiles" name="submissionFiles[]" multiple required/>
                </div>
                <button type="submit" class="submit-btn">Submit</button>
            </form>
        </div>
    </section>
 
    </>
  )
}

export default Submission