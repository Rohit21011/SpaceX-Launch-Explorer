// src/routes/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import AppLayout from '../components/Layouts/AppLayout';
import AuthLayout from '../components/Layouts/AuthLayout';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Public pages
import Home from '../pages/Home';

// Private pages
import LaunchList from '../pages/launches/LaunchList';
import LaunchDetail from '../pages/launches/LaunchDetail';
import RocketList from '../pages/rockets/RocketList';
import RocketDetail from '../pages/rockets/RocketDetail';
import NotFound from '../pages/NotFound';

/**
 * Application routes configuration
 * Uses React Router v6 with createBrowserRouter
 */
export const router = createBrowserRouter([
  // Public routes with auth layout
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      }
    ]
  },
  
  // Main application routes with app layout
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      
      // Private routes
      {
        path: '/launches',
        element: (
          <PrivateRoute>
            <LaunchList />
          </PrivateRoute>
        )
      },
      {
        path: '/launches/:id',
        element: (
          <PrivateRoute>
            <LaunchDetail />
          </PrivateRoute>
        )
      },
      {
        path: '/rockets',
        element: (
          <PrivateRoute>
            <RocketList />
          </PrivateRoute>
        )
      },
      {
        path: '/rockets/:id',
        element: (
          <PrivateRoute>
            <RocketDetail />
          </PrivateRoute>
        )
      },
      
      // Not found
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);