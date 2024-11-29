import "./index.scss";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { createContext, React, useContext, useEffect, useState } from "react";

import Navigation from "./components/navigation/navigation";
import Footer from "./components/footer/footer";
import AboutUs from "./components/aboutUs/aboutUs";
import TermsOfUse from "./components/termsOfUse/termsOfUse";
import PrivacyPolicy from "./components/privacyPolicy/privacyPolicy";
import CookiePolicy from "./components/cookiePolicy/cookiePolicy";
import GamePage from "./components/gamePage/gamePage";
import UserPage from "./components/userPage/userPage";
import AllGamesPage from "./components/allGamesPage/allGamesPage";
import LoginPage from "./components/loginPage/loginPage";
import HomePage from "./components/homePage/homePage";
import { ScrollToTop } from "./logic/logic";
import SignUpPage from "./components/signUpPage/signUpPage";

import { auth } from "./config/Config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import PrivateRoute from "./components/sharedComponents/privateRoute";
import PasswordResetPage from "./components/passwordResetPage/passwordResetPage";
import TestingComponent from "./components/testingComponent";
import ErrorPage from "./components/errorPage/errorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <Navigation />
        <Outlet />
        <Footer />
      </>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about_us",
        element: <AboutUs />,
      },
      {
        path: "/terms_of_use",
        element: <TermsOfUse />,
      },
      {
        path: "/privacy_policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/cookie_policy",
        element: <CookiePolicy />,
      },
      {
        path: "/games/:gameId",
        element: <GamePage />,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <UserPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/allGames",
        element: <AllGamesPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signUp",
        element: <SignUpPage />,
      },
      {
        path: "/passwordReset",
        element: <PasswordResetPage />,
      },
      {
        path: "/testing",
        element: <TestingComponent />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function App({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userStatePopUp, setUserStatePopUp] = useState({
    logInPopUpState: false,
    signUpPopUpState: false,
    logOutPopUpState: false,
  });

  function signUp(auth, email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logIn(auth, email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    return auth.signOut();
  }
  function resetPassword(auth, email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signUp,
        logIn,
        logOut,
        resetPassword,
        userStatePopUp,
        setUserStatePopUp,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <App>
    <RouterProvider router={router} />
  </App>
);
