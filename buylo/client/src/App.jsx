import { useRoutes, useLocation  } from 'react-router-dom';
import './App.css'
import MainNav from './components/MainNav';

import { useState } from 'react';

import { 
  CatalogPage, 
  ProductDetailsPage, 
  CartPage, 
  CheckoutPage, 
  SignUpPage, 
  LogInPage, 
  ProfilePage, 
  AdminDashboardPage, 
  EditProductPage 
} from './pages';





const App = () => {
 
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  let element = useRoutes([
    {
      path:"/",
      // element:<CatalogPage />
      element: <CatalogPage searchTerm={searchTerm} />
    },
    {
      path:"/product/:id",
      element:<ProductDetailsPage />
    },
    {
      path:"/cart",
      element:<CartPage />
    },
    {
      path:"/checkout",
      element:<CheckoutPage />
    },
    {
      path:"/signup",
      element:<SignUpPage />
    },
    {
      path:"/login",
      element:<LogInPage />
    },
    { 
      path:"/profile",
      element:<ProfilePage />
    },
    {
      path:"/admin",
      element:<AdminDashboardPage />
    },
    {
      path:"/admin/edit/:id",
      element:<EditProductPage />
    }


  ])


  return (
    <>     
      <MainNav
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showSearch={location.pathname === '/'}
      />

      {/* The <main> tag with "container" keeps your content centered and responsive */}
      <main className="container">
        {element}
      </main>
     
      <footer className="container">
        <small>© 2026 Buylo • Minimalist Shopping</small>
      </footer>
    </>
  );
}

export default App
