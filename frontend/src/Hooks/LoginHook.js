import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginAction, signUpAction } from "../ReduxToolkit/Slices/authSlice"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom"
import { getLoggedUserDataAction } from "../ReduxToolkit/Slices/userSlice"


const LoginHook = () => {

  const navigateTo = useNavigate()

  const dispatch = useDispatch()
  const loginResponse = useSelector(state => state.authReducer.loginResponse)
  const loginResponseIsLoading = useSelector(state => state.authReducer.loginResponseIsLoading)

  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [showRequiredEmail, setShowRequiredEmail] = useState(false)
  const [showRequiredPassword, setShowRequiredPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginIsClicked, setLoginIsClicked] = useState(false)

  const emailRef = useRef()
  const passwordRef = useRef()

  const emailOnChangeHandle = (e) => {
    setEmailValue(e.target.value)
    setShowRequiredEmail(false)
    emailRef.current.style.border = "1px solid #0d6efd"
  }

  const passwordOnChangeHandle = (e) => {
    setPasswordValue(e.target.value)
    setShowRequiredPassword(false)
    passwordRef.current.style.border = "1px solid #0d6efd"
  }

  const showPasswordOnMouseDownHandle = () => {
    setShowPassword(true)
  }

  const showPasswordOnMouseUpHandle = () => {
    setShowPassword(false)
  }

  const loginOnClickHandle = async (e) => {
    if (!emailValue || !passwordValue) {
      if (!emailValue) {
        setShowRequiredEmail(true)
        emailRef.current.style.border = "2px solid red"
      }
      if (!passwordValue) {
        setShowRequiredPassword(true)
        passwordRef.current.style.border = "2px solid red"
      }
      return
    }

    await dispatch(loginAction({
      data: {
        email: emailValue,
        password: passwordValue
      },
      log: "LoginHook"
    }))
    setLoginIsClicked(true)
  }

  // enter keydown
  const passwordOnKeyDownHandle = (e) => {
    if (e.keyCode === 13) {
      loginOnClickHandle()
    }
  }

  // // enter keydown for email field
  const emailOnKeyDownHandle = (e) => {
    if (e.keyCode === 13) {
      loginOnClickHandle()
    }
  }

  useEffect(() => {
    if (loginIsClicked) {
      if (loginResponse?.status === 200) {

        // store user data to localStorage
        localStorage.setItem("userData", JSON.stringify(loginResponse?.data?.data))
        localStorage.setItem("token", loginResponse?.data?.token)
  
        // reset fields
        setPasswordValue("")
        setEmailValue("")
  
        // notifications
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Login Success!',
          showConfirmButton: false,
          timer: 1500
        })
  
        // navigation
        setTimeout(() => {
          navigateTo("/chats")
        }, 1500);
  
      } else if (loginResponse?.response?.data?.error) {
        if (loginResponse?.response?.data?.error?.statusMessage) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: `${loginResponse?.response?.data?.error?.statusMessage}!`,
            showConfirmButton: false,
            timer: 1500
          })
        } else {
          loginResponse?.response?.data?.error.map(item => {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: `${item.msg}!`,
              showConfirmButton: false,
              timer: 1500
            })
          })
        }
      } else if (loginResponse?.message === "Network Error") {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Offline Server OR Network Error!',
          showConfirmButton: false,
          timer: 2500
        })
      }
    }
    setLoginIsClicked(false)
  }, [loginIsClicked])
  


  return [emailValue, emailRef, emailOnChangeHandle, passwordValue, passwordRef, passwordOnChangeHandle, loginOnClickHandle, showRequiredEmail, showRequiredPassword, showPassword, showPasswordOnMouseDownHandle, showPasswordOnMouseUpHandle, loginResponseIsLoading, passwordOnKeyDownHandle, emailOnKeyDownHandle]
}

export default LoginHook