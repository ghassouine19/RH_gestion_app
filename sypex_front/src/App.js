import React from 'react';
import './App.css';
import { VisiteurRoute } from './routing/VisiteurRoute';
import {LoginRoute} from './routing/LoginRoute';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import {UserRoute} from "./routing/UserRoute";




const AppRoutes = ()=>{
  const routes = [...VisiteurRoute,
    ...LoginRoute,
      ...UserRoute
  ];
  return useRoutes(routes);
}

function App() {
  return (
      <>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>

      </>
  );
}

export default App;
