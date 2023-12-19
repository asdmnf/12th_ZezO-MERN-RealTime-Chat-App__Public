import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { signUpAction } from '../ReduxToolkit/Slices/authSlice';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

const SignUpHook = () => {

  const navigateTo = useNavigate()

  const dispatch = useDispatch()
  const signUpResponse = useSelector(state => state.authReducer.signUpResponse)
  const signUpResponseIsLoading = useSelector(state => state.authReducer.signUpResponseIsLoading)

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  const [profilePic, setProfilePic] = useState(undefined)

  // Formik
  const initialValues = {
    name: "",
    signupEmail: "",
    signupPassword: "",
    passwordConfirmation: "",
  }

  // Formik
  const validationSchema = Yup.object({ 
    name: Yup.string().required("Required"),
    signupEmail: Yup.string().email("Not Valid").required("Required"), 
    signupPassword: Yup.string().min(4, 'Must be at least 4 chars').required("Required"),
    passwordConfirmation: Yup.string().min(4, 'Must be at least 4 chars').required("Required"),
  })

  const showPasswordOnMouseDownHandle = () => {
    setShowPassword(true)
  }

  const showPasswordOnMouseUpHandle = () => {
    setShowPassword(false)
  }

  const showPasswordConfirmationOnMouseDownHandle = () => {
    setShowPasswordConfirmation(true)
  }

  const showPasswordConfirmationOnMouseUpHandle = () => {
    setShowPasswordConfirmation(false)
  }

  const fileInputOnChangeHandle = (e) => {
    if (e.target.files[0] === undefined) {
      setProfilePic(undefined)
    } else {
    // convert image to base64
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onloadend = () => {
      setProfilePic(reader.result)
    }
  }
  }

  const signUpOnClickHandle = async (values, {resetForm}) => { // Formik

    if (values.signupPassword !== values.passwordConfirmation) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Password Not Matched',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }

    dispatch(signUpAction({
      data: {
        name: values.name,
        email: values.signupEmail,
        password: values.signupPassword,
        passwordConfirmation: values.passwordConfirmation,
        profilePic: profilePic,
      },
      log: "SignUpHook" 
    })).then(res => { 
      if (res?.payload?.status === 201) {

        // store user data to localStorage
        localStorage.setItem("userData", JSON.stringify(res?.payload?.data?.data))
        localStorage.setItem("token", res?.payload?.data?.token)

        // reset fields
        resetForm() 
        setProfilePic(undefined)

        // notifications
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Congratulations!',
          showConfirmButton: false,
          timer: 1500
        })

        // navigation
        setTimeout(() => {
          navigateTo("/chats")
        }, 1500);

        // error notification
      } else if (res?.payload?.response?.data?.error) {
          if (res?.payload?.response?.data?.error?.statusMessage) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: `${res?.payload?.response?.data?.error?.statusMessage}!`,
              showConfirmButton: false,
              timer: 1500
            })
          } else {
            res?.payload?.response?.data?.error.map(item => {
              Swal.fire({
                position: 'center',
                icon: 'warning',
                title: `${item.msg}!`,
                showConfirmButton: false,
                timer: 1500
              })
            })
        }
          } else if (res?.payload?.message === "Network Error") {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Offline Server OR Network Error!',
              showConfirmButton: false,
              timer: 2500
            })
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Sign Up Failed! Try Again Later',
              showConfirmButton: false,
              timer: 2500
            })
          }
    })
  }



  return [validationSchema, initialValues, signUpOnClickHandle, showPassword, showPasswordOnMouseDownHandle, showPasswordOnMouseUpHandle, showPasswordConfirmation, showPasswordConfirmationOnMouseDownHandle, showPasswordConfirmationOnMouseUpHandle, fileInputOnChangeHandle, signUpResponseIsLoading]
}

export default SignUpHook