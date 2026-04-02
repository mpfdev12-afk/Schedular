import React, { StrictMode, useEffect, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { toast } from "react-toastify";
import Home from "./pages/Home/Home.jsx";
import Calender from "./pages/Calender/Calender.jsx";
import Login from "./pages/Login/Login.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import Category from "./pages/Category/Category.jsx";
import SessionType from "./pages/SessionType/SessionType.jsx";
import Signin from "./pages/SignIn/Signin.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
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
import LoginasUser from "./pages/Login/LoginasUser.jsx";
import { FEATURES } from "./config/featureFlags.js";

// ─── Plug & Play Imports ───
const ZenZone = FEATURES.ZEN_ZONE
  ? React.lazy(() => import("./pages/ZenZone/ZenZone.jsx"))
  : null;
const MindfulnessZone = FEATURES.MINDFULNESS_ZONE
  ? React.lazy(() => import("./pages/MindfulnessZone/MindfulnessZone.jsx"))
  : null;
const DetoxDashboard = FEATURES.DETOX_MODE
  ? React.lazy(() => import("./pages/DetoxDashboard/DetoxDashboard.jsx"))
  : null;

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
      // ─── Plug & Play Routes ───
      ...(FEATURES.ZEN_ZONE
        ? [
            {
              path: "/zen-zone",
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <ZenZone />
                </Suspense>
              ),
            },
          ]
        : []),
      ...(FEATURES.MINDFULNESS_ZONE
        ? [
            {
              path: "/mindfulness",
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <MindfulnessZone />
                </Suspense>
              ),
            },
          ]
        : []),
      ...(FEATURES.DETOX_MODE
        ? [
            {
              path: "/detox",
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <DetoxDashboard />
                </Suspense>
              ),
            },
          ]
        : []),
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

// SW update notification — manual registration to bypass broken build scripts
function SWUpdateNotifier() {
  useEffect(() => {
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: 'none' })
        .then((registration) => {
          // Check for updates on a regular interval
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New content is available, show toast
                showUpdateToast(() => {
                  newWorker.postMessage({ type: "SKIP_WAITING" });
                  window.location.reload();
                });
              }
            });
          });

          if (registration.active) {
            console.log("Service Worker active");
          }
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const showUpdateToast = (onRefresh) => {
    toast.info(
      () => (
        <div>
          <strong>New version available!</strong>
          <br />
          <button
            style={{
              marginTop: 6,
              padding: "4px 12px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={onRefresh}
          >
            Refresh
          </button>
        </div>
      ),
      { autoClose: false, closeOnClick: false },
    );
  };

  return null;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <SWUpdateNotifier />
    </Provider>
  </StrictMode>,
);
