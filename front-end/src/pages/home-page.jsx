import "../css/home-page.css";
import salons from "../data/salons";

const HomePage = () => {

    return (
        <> 
            <div className="home-page-frame">
                <div className="home-page-landing">
                    <p>BOOKEZ</p>
                    <h2>Effortless Salon Booking at Your Fingertips</h2>

                    <div className="home-page-landing-explore-more">
                        <button className="button-light">Explore more</button>
                        <a className="button-info" href="#salon">Salons near me</a>
                    </div>
                </div>

                <div className="home-page-introduction">
                    <div className="home-page-introduction-description">
                        <h2>BOOKEZ is a dynamic platform that suggest you list of salons and allow you to book an appointment for hair and nail with favourite workers.</h2>
                    </div>
                    <div className="home-page-introduction-image">
                        <img src="https://socialhousenews.com/wp-content/uploads/2024/03/salonn-850x560.jpeg" alt="salons"/>
                    </div>
                </div>

                <div className="home-page-salons" id="#salon">
                    <div className="home-page-salons-header">
                        <div className="hps-header">
                            <h3>List of Salons</h3>
                            <h5>Finding your favourite salons</h5>
                        </div>

                        <div className="hps-search-bar">
                            <input />
                        </div>
                    </div>
                    <div>
                        List of salons render here.
                    </div>
                </div>
            </div>
        </>
    )

}

export default HomePage;