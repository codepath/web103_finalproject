import { useEffect, useState } from 'react'
import { useRoutes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/books');
        const data = await response.json();
        setBooks(data);
        console.log(data); // Log the fetched data, not 'books'
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }

    fetchBooks();
  }, [])

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element: <Home data={books} />
    },
    {
      path: "/browse",
      element: <Browse data={books} />
    },
    // {
    //   path: "/book/new",
    //   element: <AddBook />
    // },
    // {
    //   path: "/edit/:bookId",
    //   element: <EditBook data={books} />
    // },
    // {
    //   path: "/book/details/:bookId",
    //   element: <BookDetails data={books} />
    // }
  ])

  return (
    <>
      <Navbar />
      {element}
    </>
  )
}

export default App
