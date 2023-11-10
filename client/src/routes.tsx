import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import ErrorPage from './pages/ErrorPage';
import AddPage from './pages/AddPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'addgame', element: <AddPage /> }
      // { path: 'games/:slug', element: <GameDetailPage /> }
    ],
  },
]);

export default router;
