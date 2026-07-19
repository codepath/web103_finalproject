import { Link } from 'react-router';
import '../Pages_css/homePage.css';

const cards = [
    {
        img: 'src/assets/floriography.jpeg',
        alt: 'Floriography',
        title: 'Mood-based Discovery',
        description: 'Find the right flowers that convey the right emotions. Check out our flower dictionary to find the perfect blooms for any occasion.',
        linkText: 'Floriography',
        linkTo: '/dictionary',
    },
    {
        img: 'src/assets/bouquet.jpg',
        alt: 'Bouquet',
        title: 'Build a Bouquet',
        description: 'Build a bouquet that you love with our bouquet builder guide. A fun activity for a group or an individual.',
        linkText: 'Bouquet Guide',
        linkTo: '/bouquet',
    },
    {
        img: 'src/assets/hydrengea.jpg',
        alt: 'Flower Gallery',
        title: 'Flower Gallery',
        description: 'Like that flower! Take a picture to store it for later reference or scan the flower to know more about it!',
        linkText: 'Flower Gallery',
        linkTo: '/gallery',
    },
];

const HomePage = () => {
    return (
        <main>
            {cards.map((card) => (
                <div className="card" key={card.title}>
                    <div className="card-media">
                        <img src={card.img} alt={card.alt} />
                    </div>
                    <div className="card-content">
                        <h2>{card.title}</h2>
                        <p>{card.description}</p>
                        <Link to={card.linkTo}>{card.linkText}</Link>
                    </div>
                </div>
            ))}
        </main>
    );
};

export default HomePage;
