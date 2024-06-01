import React, {  useEffect, useState } from 'react'
import "./Judge.css"
import { useParams } from 'react-router-dom'
import axios from 'axios'

const SolutionsPage = () => {
    const [submission,setsubmission]=useState([])

    const {id}=useParams()
    console.log(submission)
  useEffect(() => {
    axios.get(`https://code-quest-backend.onrender.com/api/v1/contest/getcontest/${id}`,{
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
    },
     }).then((res)=>{
        setsubmission(res.data.contest.submissions)
    
     }).catch(()=>{
   
     })

     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
   <>
<h2>Answer Submissions</h2>
   {
    submission.map((e)=>(
        <div class="container">
 
        <div class="submission-list">
            <div class="submission">
                <h3>{e.userId}</h3>
                <p class="submission-message">{e.answer}</p>
                <form class="score-form">
                    <label for="scoreAlpha">Score:</label>
                    <input type="number" value={e.score} id="scoreAlpha" name="scoreAlpha" min="0" max="100" required/>
                    <button type="submit">Submit Score</button>
                </form>
            </div>

          
        </div>
    </div>
    ))
   }
   </>
  )
}

export default SolutionsPage