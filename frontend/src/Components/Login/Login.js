import "./Login.css";
import LoginHook from "../../Hooks/LoginHook";

const Login = () => {
  const [
    emailValue,
    emailRef,
    emailOnChangeHandle,
    passwordValue,
    passwordRef,
    passwordOnChangeHandle,
    loginOnClickHandle,
    showRequiredEmail,
    showRequiredPassword,
    showPassword,
    showPasswordOnMouseDownHandle,
    showPasswordOnMouseUpHandle,
    loginResponseIsLoading,
    passwordOnKeyDownHandle,
    emailOnKeyDownHandle
  ] = LoginHook();

  return (
    <div className="login">
      <div className="label-input">
        <label htmlFor="login-email">
          Email{" "}
          <span className="text-danger">
            *{" "}
            <span className={`${showRequiredEmail ? "" : "d-none"}`}>
              Required
            </span>
          </span>
        </label>
        <input
          type="email"
          name="login-email"
          id="login-email"
          placeholder="Enter Email"
          value={emailValue}
          ref={emailRef}
          onChange={emailOnChangeHandle}
          onKeyDown={emailOnKeyDownHandle}
        />
      </div>
      <div className="label-input">
        <label htmlFor="login-password">
          Password{" "}
          <span className="text-danger">
            *{" "}
            <span className={`${showRequiredPassword ? "" : "d-none"}`}>
              Required
            </span>
          </span>
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="login-password"
          id="login-password"
          placeholder="Enter Password"
          value={passwordValue}
          ref={passwordRef}
          onChange={passwordOnChangeHandle}
          onKeyDown={passwordOnKeyDownHandle}
        />
        <i
          className="show-password fa-solid fa-eye"
          onMouseDown={showPasswordOnMouseDownHandle}
          onMouseUp={showPasswordOnMouseUpHandle}
        ></i>
      </div>
      <div className="">
        <button disabled={loginResponseIsLoading ? true : false} className="d-flex justify-content-center align-items-center" onClick={loginOnClickHandle}>
          {
            loginResponseIsLoading ? <span className="login-spinner spinner-border text-light"></span> : "Login"
          }
        </button>
      </div>
    </div>
  );
};

export default Login;
