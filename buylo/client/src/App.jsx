import { useRoutes  } from 'react-router-dom';
import './App.css'
import MainNav from './components/MainNav';

import { 
  CatalogPage, 
  ProductDetailsPage, 
  CartPage, 
  CheckoutPage, 
  SignUpPage, 
  LoginPage, 
  ProfilePage, 
  AdminDashboardPage, 
  EditProductPage 
} from './pages';





const App = () => {
  // const [ products, setProducts ] = useState([])

  let element = useRoutes([
    {
      path:"/",
      element:<CatalogPage />
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
      element:<LoginPage />
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
      <MainNav />

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
