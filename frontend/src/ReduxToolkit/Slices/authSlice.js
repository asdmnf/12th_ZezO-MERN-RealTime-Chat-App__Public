import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { usePost, usePostWithImage } from "../../Api/usePost";


export const loginAction = createAsyncThunk("auth/login", async ({data, log}, thunkApi) => { 
  try {
    const res = await usePost("/api/v1/users/login", data)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})


export const signUpAction = createAsyncThunk("auth/signup", async ({data, log}, thunkApi) => {
  try {
    const res = await usePost("/api/v1/users/signup", data)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

const initialState = {
  // login initial values
  loginResponse: [],
  loginResponseIsLoading: false,

  // signup initial values
  signUpResponse: [],
  signUpResponseIsLoading: false
}


const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,

  extraReducers: (builder) => { 
    builder
    .addCase(loginAction.pending, (state, action) => { 
      state.loginResponseIsLoading = true
    })
    .addCase(loginAction.fulfilled, (state, action) => { 
      state.loginResponseIsLoading = false
      state.loginResponse = action.payload
    })
    .addCase(loginAction.rejected, (state, action) => { 
      state.loginResponseIsLoading = false
      state.loginResponse = action.payload
    })


    builder
    .addCase(signUpAction.pending, (state, action) => { 
      state.signUpResponseIsLoading = true
    })
    .addCase(signUpAction.fulfilled, (state, action) => { 
      state.signUpResponseIsLoading = false
      state.signUpResponse = action.payload
    })
    .addCase(signUpAction.rejected, (state, action) => { 
      state.signUpResponseIsLoading = false
      state.signUpResponse = action.payload
    })
  }
})

export default authSlice