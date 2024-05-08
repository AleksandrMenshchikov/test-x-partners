import { createBrowserRouter } from 'react-router-dom';
import { SignupPage } from '../pages/SignupPage.tsx';
import { ErrorPage } from '../pages/ErrorPage.tsx';
import { RootPage } from '../pages/RootPage.tsx';
import { SigninPage } from '../pages/SigninPage.tsx';
import { PeoplePage } from '../pages/PeoplePage.tsx';
import { AccountPage } from '../pages/AccountPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/signin',
        element: <SigninPage />,
      },
      {
        path: '/people',
        element: <PeoplePage />,
      },
      {
        path: '/account',
        element: <AccountPage />,
      },
    ],
  },
]);
