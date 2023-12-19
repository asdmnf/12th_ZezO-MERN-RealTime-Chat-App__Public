import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { useGetWithToken } from "../../Api/useGet"
import { usePutWithToken } from "../../Api/usePut"


// search all users
export const searchUsersAction = createAsyncThunk("users/searchUsers", async ({keyword, log}, thunkApi) => {
  try {
    const res = await useGetWithToken(`/api/v1/users/?keyword=${keyword}`)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// get logged user data
export const getLoggedUserDataAction = createAsyncThunk("users/getLoggedUserData", async ({log}, thunkApi) => {
  try {
    const res = await useGetWithToken(`/api/v1/users/logged-user-data`)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// update logged user profile picture
export const updateLoggedUserProfilePictureAction = createAsyncThunk("users/updateLoggedUserProfilePicture", async ({data, log}, thunkApi) => {
  try {
    const res = await usePutWithToken(`/api/v1/users/update-profile-picture`, data)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

const initialState = {
  usersData: [],
  usersDataIsLoading: false,

  loggedUserData: [],
  loggedUserDataIsLoading: false,

  updateloggedUserProfilePictureResponse: [],
  updateloggedUserProfilePictureResponseIsLoading: false,

  onlineUsersData: []
}

const userSlice = createSlice({
  name: 'users',

  initialState,

  reducers: { 
    resetUserData(state) {
      state.usersData = []
    },
    onlineUsers(state, action) { 
      console.log(action.payload, "onlineUsersLocalAction")
      state.onlineUsersData = action.payload
    }
  },

  extraReducers: (builder) => {
    // usersData
    builder
    .addCase(searchUsersAction.pending, (state, action) => { 
      state.usersDataIsLoading = true
    })
    .addCase(searchUsersAction.fulfilled, (state, action) => {
      state.usersDataIsLoading = false
      state.usersData = action.payload
    })
    .addCase(searchUsersAction.rejected, (state, action) => {
      state.usersDataIsLoading = false
      state.usersData = action.payload
    })

    // loggedUserData
    builder
    .addCase(getLoggedUserDataAction.pending, (state, action) => { 
      state.loggedUserDataIsLoading = true
    })
    .addCase(getLoggedUserDataAction.fulfilled, (state, action) => {
      state.loggedUserDataIsLoading = false
      state.loggedUserData = action.payload
    })
    .addCase(getLoggedUserDataAction.rejected, (state, action) => {
      state.loggedUserDataIsLoading = false
      state.loggedUserData = action.payload
    })

    // updateloggedUserProfilePictureResponse
    builder
    .addCase(updateLoggedUserProfilePictureAction.pending, (state, action) => { 
      state.updateloggedUserProfilePictureResponseIsLoading = true
    })
    .addCase(updateLoggedUserProfilePictureAction.fulfilled, (state, action) => {
      state.updateloggedUserProfilePictureResponseIsLoading = false
      state.updateloggedUserProfilePictureResponse = action.payload
    })
    .addCase(updateLoggedUserProfilePictureAction.rejected, (state, action) => {
      state.updateloggedUserProfilePictureResponseIsLoading = false
      state.updateloggedUserProfilePictureResponse = action.payload
    })
  }
})

export const {resetUserData, onlineUsers}  = userSlice.actions

export default userSlice