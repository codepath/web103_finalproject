import { useEffect, useState } from 'react'
import { useRoutes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import AddBook from './pages/AddBook';
import BookDetails from './pages/BookDetails';
import EditBook from './pages/EditBook';
import ReadReview from './pages/ReadReview';
import AddReview from './pages/AddReview';
import EditReview from './pages/EditReview';

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/books');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }

    fetchBooks();
  }, [])

  let element = useRoutes([
    {
      path: '/',
      element: <Home data={books} />
    },
    {
      path: '/browse',
      element: <Browse data={books} />
    },
    {
      path: '/book/new',
      element: <AddBook />
    },
    {
      path: '/edit/:id',
      element: <EditBook data={books} />
    },
    {
      path: '/book/details/:id',
      element: <BookDetails />
    },
    {
      path: '/booksreviews/:id',
      element: <ReadReview />
    },
    {
      path: '/addreview/:book_id',
      element: <AddReview />
    },
    {
      path: '/editreview/:review_id',
      element: <EditReview />
    }
    

  ])

  return (
    <>
      <Navbar />
      {element}
    </>
  )
}

export default App
