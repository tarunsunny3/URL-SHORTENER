import { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import 'chart.js/auto';

import AuthService from "./services/auth.service";
import IUser from './types/user.type';

import Login from "./components/LoginComponent/login.component";
import Register from "./components/RegisterComponent/register.component";
import Home from "./components/HomeComponent/home.component";
import UserDashboard from "./components/UserDashboard/userdashboard.component";
import UrlAnalytics from "./components/UrlAnalyticsComponent/urlAnalytics.component"
import ProtectedRoute from "./components/ProtectedRoute";

type Props = {};

type State = {
  currentUser: IUser | undefined
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }


  async logOut() {
    try {
      await AuthService.logout()
      this.setState({
        currentUser: undefined,
      });

    } catch (error) {
      this.setState({
        currentUser: undefined,
      });
    }

  }

  render() {
    const { currentUser } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand bg-white">
          <Link to={"/"} className="navbar-brand">
            miniURL
          </Link>
          {/* <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>
          </div> */}

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/dashboard"} className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={this.logOut}>
                  LogOut
                </button>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={

                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <UrlAnalytics />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>
      </div>
    );
  }
}

export default App;