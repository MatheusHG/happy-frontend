import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import '../styles/pages/landing.css';
import '../styles/response/landing.css';

import logoImg from '../images/logo.svg';

function Landing() {
    return(
        <div id="page-landing">
            <div className="content-wrapper has-shown">
                <img src={logoImg} alt="Happy" />

                <main>
                <h1>Leve felicidade para o mundo</h1>
                <p>Visite orfanatos e mude o dia de muitas crianças.</p>
                </main>

                <div className="location has-shown">
                <strong>Campina Grande</strong>
                <span>Paraíba</span>
                </div>

                <Link to="/app" className="enter-app has-shown" style={{animationDelay: "300ms"}}>
                    <FiArrowRight size={26} color="rgba(0, 0, 0, 0.6)" />
                </Link>
            </div>
            </div>
    );
}

export default Landing;