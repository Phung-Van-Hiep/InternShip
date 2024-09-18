import * as React from "react";
import {createBrowserRouter} from "react-router-dom";
import "../index.css";
import LoginPage from "../components/LoginPage";
import HomePageStudent from "../components/HomePageStudent";
import InformationPage from "../components/InformationPage";
import DetailStudent from "../components/DetailStudent";


const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/details",
    element: <DetailStudent />,
    children:[
      {path: "information", element: <InformationPage />},
    ]
  },
  {
    path: "/homepage",
    element: <HomePageStudent />,
  }
]);

export default router