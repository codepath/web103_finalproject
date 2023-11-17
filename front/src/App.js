import { useEffect, useState } from 'react'
import { useRoutes, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home';
import Browse from './pages/Browse';
import AddBook from './pages/AddBook';
import BookDetails from './pages/BookDetails';
import EditBook from './pages/EditBook';
import ReadReview from './pages/ReadReview';
import AddReview from './pages/AddReview';
import EditReview from './pages/EditReview';
import Login from './pages/Login'
import Avatar from './components/Avatar'

function App() {
  const API_URL = 'http://localhost:3001'
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState([])

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`${API_URL}/auth/login/success`, { credentials: 'include' })
      const json = await response.json()
      setUser(json.user)
    }
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/api/books`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
    getUser();
    fetchBooks();
  }, [API_URL])

  const logout = async () => {
    const url = `${API_URL}/auth/logout`
    const response = await fetch(url, { credentials: 'include' })
    await response.json()
    window.location.href = '/'
  }

  let element = useRoutes([
    {
      path: '/',
      element: user && user.id ? <Home user={user} data={books} /> : <Login api_url={API_URL} />
    },
    {
      path: '/browse',
      element: user && user.id ? <Browse user={user} data={books} /> : <Login api_url={API_URL} />
    },
    {
      path: '/book/new',
      element: user && user.id ? <AddBook user={user} api_url={API_URL} /> : <Login api_url={API_URL} />
    },
    {
      path: '/edit/:id',
      element: user && user.id ? <EditBook user={user} data={books} api_url={API_URL} /> : <Login api_url={API_URL} />
    },
    {
      path: '/book/details/:id',
      element: user && user.id ? <BookDetails user={user} data={books} api_url={API_URL} /> : <Login api_url={API_URL} />
    },
    {
      path: '/booksreviews/:id',
      element: user && user.id ? <ReadReview user={user} api_url={API_URL} /> : <Login api_url={API_URL} />
    },
    {
      path: '/addreview/:book_id',
      element: user && user.id ? <AddReview user={user} api_url={API_URL} /> : <Login api_url={API_URL} />
    },
    {
      path: '/editreview/:review_id',
      element: user && user.id ? <EditReview user={user} api_url={API_URL} /> : <Login api_url={API_URL} />
    },
    // {
    //   path: '/users/add/:book_id',
    //   element: user && user.id ? <AddUserToTrip user={user} api_url={API_URL} /> : <Login api_url={API_URL} />
    // },

  ])

  return (
    <>
      {
        user && user.id ?
          <div className="header-container">
            <div className="header-left">
              <Link to="/"><button id="homeBtn" >Home</button></Link>
              <Link to="/browse"><button id="browseBtn" >Browse</button></Link>
            </div>
            <div>
              <Avatar className='avatar' user={user} />
            </div>
            <div className="header-right">
              <button onClick={logout} className='logoutBtn'>Logout</button>
            </div>
          </div> : <></>
      }
      {element}
    </>
  )
}

export default App
