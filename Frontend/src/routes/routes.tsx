import { createBrowserRouter, useLocation } from 'react-router-dom';
import {
  AccountDeactivePage,
  Error400Page,
  Error403Page,
  Error404Page,
  Error500Page,
  Error503Page,
  ErrorPage,
  HomePage,
  PasswordResetPage,
  ProjectsDashboardPage,
  SignInPage,
  SignUpPage,
  VerifyEmailPage,
  WelcomePage,
} from '../pages';
import { DashboardLayout, GuestLayout } from '../layouts';
import React, { ReactNode, useEffect } from 'react';
import UserPage from '../pages/User/UserPage.tsx';
import UserList from '../pages/User/UserList.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import TimelinePage from '../pages/Timeline/Timeline.tsx';
import Certificate from '../pages/certificate/Certificate.tsx';
import Test from '../pages/Test.tsx';
import Newsale from '../pages/Newsale/Newsale.tsx';
import ProductList from '../pages/Product/ProductList.tsx';
import ProductPage from '../pages/Product/ProductPage.tsx';
import GenerateGUIDPage from '../pages/Newsale/GenerateGUIDPage.tsx';
import ProudctStepForm from '../pages/Product/ProductStepForm.tsx';

// Custom scroll restoration function
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    }); // Scroll to the top when the location changes
  }, [pathname]);

  return null; // This component doesn't render anything
};

type PageProps = {
  children: ReactNode;
};

// Create an HOC to wrap your route components with ScrollToTop
const PageWrapper = ({ children }: PageProps) => {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
};

// Create the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <PageWrapper children={<GuestLayout />} />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: '',
        element: <HomePage />,
      },
    ],
  },
  {
    path: '/auth',
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'signup',
        element: <SignUpPage />,
      },
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'welcome',
        element: <WelcomePage />,
      },
      {
        path: 'verify-email',
        element: <VerifyEmailPage />,
      },
      {
        path: 'password-reset',
        element: <PasswordResetPage />,
      },
      {
        path: 'account-delete',
        element: <AccountDeactivePage />,
      },
    ],
  },
  {
    path: 'Certificate',
    element: <Certificate />,
  },
  {
    path: 'Certificate/:id',
    element: <Certificate />,
  },

  {
    element: <ProtectedRoute />, // <--- PROTECT ALL BELOW
    children: [
      {
        path: '/dashboards',
        element: <PageWrapper children={<DashboardLayout />} />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            path: 'default',
            element: <ProjectsDashboardPage />,
          },
        ],
      },

      {
        path: `/User`,
        element: (
          <PageWrapper>
            <DashboardLayout />
          </PageWrapper>
        ),
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'List',
            element: <UserList />,
          },
          {
            path: 'New',
            element: <UserPage />,
          },
          {
            path: 'Edit/:id',
            element: <UserPage />,
          },
          {
            path: 'Delete/:id',
            element: <UserPage />,
          },
          {
            path: 'ToggleActive/:id',
            element: <UserPage />,
          },
          {
            path: 'Detail/:id',
            element: <UserPage />,
          },
        ],
      },
    ],
  },

  {
    path: 'errors',
    errorElement: <ErrorPage />,
    children: [
      {
        path: '400',
        element: <Error400Page />,
      },
      {
        path: '403',
        element: <Error403Page />,
      },
      {
        path: '404',
        element: <Error404Page />,
      },
      {
        path: '500',
        element: <Error500Page />,
      },
      {
        path: '503',
        element: <Error503Page />,
      },
    ],
  },
  {
    path: `/Timeline`,
    element: (
      <PageWrapper>
        <DashboardLayout />
      </PageWrapper>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'Detail',
        element: <TimelinePage />,
      },
    ],
  },
  {
    path: '/Newsale',
    element: (
      <PageWrapper>
        <DashboardLayout />
      </PageWrapper>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'New',
        element: <GenerateGUIDPage />,
      },
      {
        path: 'Edit/:id',
        element: <Newsale />,
      },
    ],
  },
  {
    path: '/Test',
    element: (
      <PageWrapper>
        <DashboardLayout />
      </PageWrapper>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'New',
        element: <Test />,
      },
      {
        path: 'Edit/:id',
        element: <Test />,
      },
    ],
  },
  {
    path: `/Products`,
    element: (
      <PageWrapper>
        <DashboardLayout />
      </PageWrapper>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'List',
        element: <ProductList />,
      },
      {
        path: 'New',
        element: <ProudctStepForm />,
      },
      {
        path: 'Edit/:id',
        element: <ProudctStepForm />,
      },
      {
        path: 'Delete/:id',
        element: <ProudctStepForm />,
      },
      {
        path: 'ToggleActive/:id',
        element: <ProudctStepForm />,
      },
      {
        path: 'Detail/:id',
        element: <ProudctStepForm />,
      },
    ],
  },
]);

export default router;
