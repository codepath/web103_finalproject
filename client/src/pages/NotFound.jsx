import '../App.css';

const Home = () => {

    return (
        <div className='home'>
            <div className='container-main'>
                    <div className='container-text'>
                        <div className="title"><h4>404 Error</h4></div>
                        <div className='subtitle'><h4>Page Not Found</h4></div>
                    </div>
                    <div className='container-button'>
                    <a href='/' role='button'>Return Home</a>
                    </div>
                </div>
        </div>
    );
};

export default Home;