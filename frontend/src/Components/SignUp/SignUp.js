import { Formik, Field, Form, ErrorMessage } from "formik";
import SignUpHook from "../../Hooks/SignUpHook";

const SignUp = () => {

  const [
    validationSchema,
    initialValues,
    signUpOnClickHandle,
    showPassword,
    showPasswordOnMouseDownHandle,
    showPasswordOnMouseUpHandle,
    showPasswordConfirmation,
    showPasswordConfirmationOnMouseDownHandle,
    showPasswordConfirmationOnMouseUpHandle,
    fileInputOnChangeHandle,
    signUpResponseIsLoading
  ] = SignUpHook();

  return (
    <div className="login">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={signUpOnClickHandle}
      >
        <Form>
          <div className="label-input">
            <label htmlFor="name">
              Name{" "}
              <span className="text-danger">
                *{" "}
                <ErrorMessage name="name" component="span" className="error" />
              </span>
            </label>
            <Field type="text" name="name" id="name" placeholder="Enter Name" />
          </div>
          <div className="label-input">
            <label htmlFor="signupEmail">
              Email{" "}
              <span className="text-danger">
                *{" "}
                <ErrorMessage
                  name="signupEmail"
                  component="span"
                  className="error"
                />
              </span>
            </label>
            <Field
              type="email"
              name="signupEmail"
              id="signupEmail"
              placeholder="Enter Email"
            />
          </div>
          <div className="label-input">
            <label htmlFor="signupPassword">
              Password{" "}
              <span className="text-danger">
                *{" "}
                <ErrorMessage
                  name="signupPassword"
                  component="span"
                  className="error"
                />
              </span>
            </label>
            <Field
              type={showPassword ? "text" : "password"}
              name="signupPassword"
              id="signupPassword"
              placeholder="Enter Password"
            />
            <i
              className="show-password fa-solid fa-eye"
              onMouseDown={showPasswordOnMouseDownHandle}
              onMouseUp={showPasswordOnMouseUpHandle}
            ></i>
          </div>
          <div className="label-input">
            <label htmlFor="passwordConfirmation">
              Password Confirmition{" "}
              <span className="text-danger">
                *{" "}
                <ErrorMessage
                  name="passwordConfirmation"
                  component="span"
                  className="error"
                />
              </span>
            </label>
            <Field
              type={showPasswordConfirmation ? "text" : "password"}
              name="passwordConfirmation"
              id="passwordConfirmation"
              placeholder="Enter Password Confirmation"
            />
            <i
              className="show-password fa-solid fa-eye"
              onMouseDown={showPasswordConfirmationOnMouseDownHandle}
              onMouseUp={showPasswordConfirmationOnMouseUpHandle}
            ></i>
          </div>
          <div className="label-input">
            <label htmlFor="profile-pic">Upload Profile Picture</label>
            <input
              className="profile-pic"
              type="file"
              name="profile-pic"
              id="profile-pic"
              onChange={fileInputOnChangeHandle}
            />
          </div>
          <div className="">
            <button disabled={signUpResponseIsLoading ? true : false} type="submit" className="d-flex justify-content-center align-items-center">
          {
            signUpResponseIsLoading ? <span className="login-spinner spinner-border text-light"></span> : "Sign Up"
          }
        </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default SignUp;
