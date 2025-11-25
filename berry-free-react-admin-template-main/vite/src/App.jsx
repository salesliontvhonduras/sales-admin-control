import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';

import AuthProvider from './contexts/AuthContext';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import ThemeCustomization from 'themes';
import { SnackbarProvider } from 'notistack';



// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  useEffect(() => {
    // Evita volver atrás a pantallas previas tras logout/login
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <ThemeCustomization>
      <NavigationScroll>
        <>
            <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
             }}>
              <AuthProvider>
                  <RouterProvider router={router} />
              </AuthProvider>
           </SnackbarProvider>
        </>
      </NavigationScroll>
    </ThemeCustomization>
  );
}
