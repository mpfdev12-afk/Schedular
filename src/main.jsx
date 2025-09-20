import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Calender from "./pages/Calender/Calender.jsx";
import Login from "./pages/Login/Login.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import Category from "./pages/Category/Category.jsx";
import SessionType from "./pages/SessionType/SessionType.jsx";
import Signin from "./pages/SignIn/Signin.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import EventCard from "./components/Cards/EventCard.jsx";
import DashBoard from "./pages/DashBoard/DashBoard.jsx";
import AdvisorList from "./pages/AdvisorList/AdvisorList.jsx";
import Schedule from "./pages/Schedule/Schedule.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import RegisterForm from "./pages/SigninForm/SigninForm.jsx";
import RegisterAdvisor from "./pages/SigninForm/AdvisorSignIn.jsx";
import LoginAdvisor from "./pages/Login/LoginAdvisor.jsx";
import TopicsList from "./pages/Topics/Topics.jsx";
import CreateBatch from "./pages/CreateBatch/CreateBatch.jsx";
import Batches from "./pages/Batches/Batches.jsx";
import HabitSchedular from "./pages/HabitSchedular/HabitSchedular.jsx";
import QuickAppointment from "./pages/QuickAppointment/QuickAppointment.jsx";
import LearningMaterial from "./pages/LearningMaterial/LearningMaterial.jsx";
import AdvisorQuick from "./pages/AdvisorQuick/AdvisorQuick.jsx";
import AdvisorDashboard from "./pages/AdvisorDashboard/AdvisorDashboard.jsx";
import LoginasUser from "./pages/Login/LoginasUser.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/user/login",
        element: <Login />,
      },
      {
        path: "/loginConditon",
        element: <LoginasUser />,
      },
      {
        path: "/advisor/login",
        element: <LoginAdvisor />,
      },
      {
        path: "/advisor/:advisorId/createBatch",
        element: <CreateBatch />,
      },
      {
        path: "/advisor/:advisorId/:domain/quickAppointment",
        element: <AdvisorQuick />,
      },
      {
        path: "/Signin",
        element: <Signin />,
      },
      {
        path: "/category/:category/habbit-learning/personal/:topic",
        element: <AdvisorList />,
      },
      {
        path: "/calender/:id",
        element: <Calender />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/category/:category",
        element: <SessionType />,
      },
      {
        path: "/category/:category/:session",
        element: <TopicsList />,
      },
      {
        path: "/category/:category/habbit-learning/:isGroup/:topic",
        element: <Batches />,
      },
      {
        path: "/category/:category/habbit-learning/:isGroup",
        element: <TopicsList />,
      },
      {
        path: "/category/:category/habbit-learning",
        element: <HabitSchedular />,
      },
      {
        path: "/category/:category/quick-session/:topic",
        element: <QuickAppointment />,
      },
      {
        path: "/category/:category/learning/:topic",
        element: <LearningMaterial />,
      },
      {
        path: "/category/:category/habbit-learning/personal/:topic/:advisorId/:userId",
        element: <Schedule />,
      },
      {
        path: "/dashboard",
        element: <DashBoard />,
      },
      {
        path: "/user/signin",
        element: <RegisterForm />,
      },
      {
        path: "/advisor/signin",
        element: <RegisterAdvisor />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </StrictMode>
);
