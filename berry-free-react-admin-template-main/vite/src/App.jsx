import { RouterProvider } from 'react-router-dom';

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
