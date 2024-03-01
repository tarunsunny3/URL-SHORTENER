import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../../services/auth.service";
import axios, { AxiosError } from "axios";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    successful: false,
    message: "",
  });

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("This is not a valid email.").required("This field is required!"),
    password: Yup.string()
      .test(
        "len",
        "The password must be between 6 and 40 characters.",
        (val): boolean  => !!val && val.toString().length >= 6 && val.toString().length <= 40
      )
      .required("This field is required!"),
  });

  const handleRegister = async (formValue: { name: any; email: any; password: any; }) => {
    const { name, email, password } = formValue;

    setState({
      ...state,
      message: "",
      successful: false,
    });

  

    try {
      const response = await AuthService.register(name, email, password)
      setState({
        ...state,
        message: response.data.message,
        successful: true,
      });
    }catch (error) {
      if (axios.isAxiosError(error)) {

        const resMessage = error.response || error.status || ""
    
        setState({
          ...state,
          successful: false,
          message: resMessage.toString(),
        });
       
      } else {
        console.error(error);
      }
  }
}


  const { successful, message } = state;

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form>
            {!successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="name"> Name </label>
                  <Field name="name" type="text" className="form-control" />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email"> Email </label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password"> Password </label>
                  <Field name="password" type="password" className="form-control" />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className="form-group">
                <div
                  className={
                    successful ? "alert alert-success" : "alert alert-danger"
                  }
                  role="alert"
                >
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
export default Register;
