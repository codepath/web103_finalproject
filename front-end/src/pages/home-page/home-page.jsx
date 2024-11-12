import { useState } from "react";
import "../../css/home-page.css";
import salons from "../../data/salons";
import SalonBox from "./salon-box";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [searchPattern, setSearchPattern] = useState("");
    const [salonToDisplay, setSalonToDisplay] = useState(salons);
 
    const navigate = useNavigate();

    const onSearch = () => {
        let searchMap = salonToDisplay.filter((s) => s.name.startsWith(searchPattern));
        setSalonToDisplay(searchMap);
    }

    return (
        <> 
            {/* <div className="home-page-frame"> */}
                <div className="home-page-landing">
                    <p className="hpl-title">BOOKEZ</p>
                    <h2><i>Effortless Salon Booking at Your Fingertips</i></h2>

                    <div className="home-page-landing-explore-more">
                        <button className="button-light">Explore more</button>
                        <a className="button-info" href="#salon">Salons near me</a>
                    </div>
                </div>

                <div className="home-page-introduction">
                    <div className="home-page-introduction-description">
                        <h3>BOOKEZ is a dynamic platform that suggest you list of salons and allow you to book an appointment for hair and nail with favourite workers.</h3>
                        <h3><i>With BOOKEZ, you can</i></h3>
                        <div className="home-page-introduction-description-advantage">
                                <h4>&#9989; Book appointments with ease and precision.</h4>
                                <h4>&#9989; Get automatic reminders and avoid missed appointments.</h4>
                                <h4>&#9989; Customize for a perfect fit with your business.</h4>
                            {/* <div className="hpi-advantage-box">
                            </div>
                            <div className="hpi-advantage-box">

                            </div>
                            <div className="hpi-advantage-box">

                            </div> */}
                        </div>
                    </div>
                    <div className="home-page-introduction-image">
                        <img src="https://socialhousenews.com/wp-content/uploads/2024/03/salonn-850x560.jpeg" alt="salons"/>
                    </div>
                </div>

                <div className="home-page-salons" id="#salon">
                    <div className="home-page-salons-header">
                        <div className="hps-header">
                            <h1>List of Salons</h1>
                            <h5><i>Finding your favourite salons</i></h5>
                        </div>

                        <div className="hps-search-bar">
                            <input type="text" placeholder="Search" className="input-box" onChange={(e) => {setSearchPattern(e.target.value); onSearch()}} />
                        </div>
                    </div>
                    <div className="hps-list-of-salon">
                        {salonToDisplay.map((salon, index) => (
                            <SalonBox salon={salon} key={index} onClick={() => navigate(`/salon/${index}`)} />
                        ))}
                    </div>
                </div>
            {/* </div> */}
        </>
    )

}

export default HomePage;