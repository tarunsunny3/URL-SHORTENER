import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/auth.service";
import Alert from "../../common/Alert/Alert";
import { useAuth } from "../../common/AuthContext/AuthContext";

const Login = () => {
  const location = useLocation();

  const {checkCurrentUser, login} = useAuth()

  const navigate = useNavigate();
  const [state, setState] = useState({
    redirect: "",
    email: "",
    password: "",
    loading: false,
    message: "",
  });
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    const currentUser = checkCurrentUser();
    if (currentUser) {
      alert("Current user exists")
      navigate("/")
    }
  }, []);

  useEffect(() => {
    if(location.state && location.state.message)
      setAlertMessage(location.state.message)
  })

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const handleLogin = async (formValue: { email: any; password: any; }) => {
    const { email, password } = formValue;

    setState((prevState) => ({
      ...prevState,
      message: "",
      loading: true,
    }));
    try {
      await login(email, password);
      navigate("/dashboard")
    } catch (error: any) {
      const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setState((prevState) => ({
          ...prevState,
          loading: false,
          message: resMessage,
        }));
    }
  };

 
  const { loading, message } = state;

  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <div className="col-md-12">
      {
        alertMessage.length > 0 && <Alert message={alertMessage} variant="danger"/>
      }
      
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field name="email" type="text" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
