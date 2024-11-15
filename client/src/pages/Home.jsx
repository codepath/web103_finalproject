import '../App.css';
import '../css/Home.css';
import Main_Page from '../assets/Main_Page.jpg';

const Home = () => {

    return (
        <div className='home'>
            <div className='container-main'>
                    <div className='container-text'>
                    <div className="title"><h4>Plan your</h4></div>
                    <div className='subtitle'><h4>perfect </h4></div>
                    <div className="title"><h4>Gateway!</h4></div>
                    </div>
                    <div className='container-button'>
                    <a href='/destinations' role='button'>Discover</a>
                    </div>
                </div>
            <div className='main_page_pic'><img src={Main_Page} alt="Main" /></div>
        </div>
    );
};

export default Home;
