import React from 'react'
import "./Judge.css"
const Judge = () => {
  return (
    <section class="judge-panel">
        <div class="container">
            <h2>Answer Submissions</h2>
            <div class="submission-list">
                <div class="submission">
                    <h3>Sudipto Paul</h3>
                    <p class="submission-message">Our project aims to revolutionize the way we approach healthcare by integrating AI technology...</p>
                    <form class="score-form">
                        <label for="scoreAlpha">Score:</label>
                        <input type="number" id="scoreAlpha" name="scoreAlpha" min="0" max="100" required/>
                        <button type="submit">Submit Score</button>
                    </form>
                </div>
                <div class="submission">
                    <h3>Suman Saha</h3>
                    <p class="submission-message">Our project focuses on improving urban mobility through the development of a new app...</p>
                    <form class="score-form">
                        <label for="scoreBeta">Score:</label>
                        <input type="number" id="scoreBeta" name="scoreBeta" min="0" max="100" required/>
                        <button type="submit">Submit Score</button>
                    </form>
                </div>
              
            </div>
        </div>
    </section>
  )
}

export default Judge