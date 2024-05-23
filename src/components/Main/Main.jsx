import React from 'react'
import "./Main.css"
import HackethonCard from '../Card/HackethonCard'

const Main = () => {
  return (
    <>
    <section class="hero">
        <div class="hero-content">
            <h1><b>CodeQuest 2024</b></h1>
            <h2>Welcome to CodeQuest, where innovation meets creativity!</h2>
            <p>Register now to secure your spot in the ultimate Hackathon  showdown!</p>
            <a href="#main_container"><button class="cta-button">Participate Now</button></a>
        </div>
        <div class="hero-image">
            <img src="Images/Person_table.png" alt="Person at computer"/>
        </div>
    </section>
 

    <div id="main_container">
        <h3>CHALLENGES</h3>
        <div className="card_items">
        <HackethonCard />
        <HackethonCard />
        <HackethonCard />
        </div>
        


    </div>
    </>
 
  )
}

export default Main