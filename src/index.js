import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider, QueryClient } from 'react-query';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Pages/Account/login';
import Signup from './Pages/Account/signup';
import MainLayout from "./Layouts/MainLayout";
import Menu from "./Pages/menu";
import NewAbstract from "./Pages/Abstract/newAbstract";
import ListAbstract from "./Pages/Abstract/listAbstract";

const router = createBrowserRouter([
    {
        path: '/account/login',
        element: <Login/>
    },
    {
        path: '/account/signup',
        element: <Signup />
    },
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {
                path: '/',
                element: <Menu/>
            },
            {
                path:'/resumo/novo',
                element: <NewAbstract/>,
            },
            {
                path:'/resumos',
                element: <ListAbstract />,
            },
        ]
    }
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
