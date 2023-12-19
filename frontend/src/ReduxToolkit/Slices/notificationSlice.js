import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { usePostWithToken } from "../../Api/usePost"
import { useGetWithToken } from "../../Api/useGet"
import { useDeleteWithToken } from "../../Api/useDelete"
import { usePutWithToken } from "../../Api/usePut"


// create notification
export const craeteNotificationAction = createAsyncThunk("notifications/createNotification", async ({data, log}, thunkApi) => {
  try {
    const res = await usePostWithToken(`/api/v1/notifications/`, data)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// get all notifications
export const getAllNotificationsAction = createAsyncThunk("notifications/getAllNotifications", async ({log}, thunkApi) => { 
  try {
    const res = await useGetWithToken(`/api/v1/notifications/`)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// delete all logged user notifications
export const deleteAllLoggedUserNotificationsAction = createAsyncThunk("notifications/deleteAllLoggedUserNotifications", async ({log}, thunkApi) => {
  try {
    const res = await useDeleteWithToken(`/api/v1/notifications/delete-all-notifications`)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// delete specific notification
export const deleteSpecificNotificationAction = createAsyncThunk("notifications/deleteSpecificNotification", async ({notificationId, log}, thunkApi) => {
  try {
    const res = await useDeleteWithToken(`/api/v1/notifications/delete-one-notification/${notificationId}`)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// update isSeen notification
export const updateIsSeenNotificationAction = createAsyncThunk("notifications/updateIsSeenNotification", async ({notificationId, log}, thunkApi) => {
  try {
    const res = await usePutWithToken(`/api/v1/notifications/${notificationId}`)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

const initialState = {
  createNotificationResponse: [],
  createNotificationResponseIsLoading: false,

  getAllNotificationsData: [],
  getAllNotificationsDataIsLoading: false,

  deleteAllLoggedUserNotificationsResponse: [],
  deleteAllLoggedUserNotificationsResponseIsLoading: false,

  deleteSpecificNotificationResponse: [],
  deleteSpecificNotificationResponseIsLoading: false,

  updateIsSeenNotificationResponse: [],
  updateIsSeenNotificationResponseIsLoading: false,
}

const notificationSlice = createSlice({
  name: 'notifications',

  initialState,

  reducers: {
    resetCreateNotificationResponse(state) {
      state.createNotificationResponse = []
    },
    resetGetAllNotificationsData(state) {
      state.getAllNotificationsData = []
    },
    resetdeleteAllLoggedUserNotificationsResponse(state) {
      state.deleteAllLoggedUserNotificationsResponse = []
    },
    resetDeleteSpecificNotificationResponse(state) {
      state.deleteSpecificNotificationResponse = []
    }
  },

  extraReducers: (builder) => {
    // createNotificationResponse
    builder
    .addCase(craeteNotificationAction.pending, (state, action) => { 
      state.createNotificationResponseIsLoading = true
    })
    .addCase(craeteNotificationAction.fulfilled, (state, action) => {
      state.createNotificationResponseIsLoading = false
      state.createNotificationResponse = action.payload
    })
    .addCase(craeteNotificationAction.rejected, (state, action) => {
      state.createNotificationResponseIsLoading = false
      state.createNotificationResponse = action.payload
    })

    // getAllNotificationsData
    builder
    .addCase(getAllNotificationsAction.pending, (state, action) => { 
      state.getAllNotificationsDataIsLoading = true
    })
    .addCase(getAllNotificationsAction.fulfilled, (state, action) => {
      state.getAllNotificationsDataIsLoading = false
      state.getAllNotificationsData = action.payload
    })
    .addCase(getAllNotificationsAction.rejected, (state, action) => {
      state.getAllNotificationsDataIsLoading = false
      state.getAllNotificationsData = action.payload
    })

    // deleteAllLoggedUserNotificationsResponse
    builder
    .addCase(deleteAllLoggedUserNotificationsAction.pending, (state, action) => { 
      state.deleteAllLoggedUserNotificationsResponseIsLoading = true
    })
    .addCase(deleteAllLoggedUserNotificationsAction.fulfilled, (state, action) => {
      state.deleteAllLoggedUserNotificationsResponseIsLoading = false
      state.deleteAllLoggedUserNotificationsResponse = action.payload
    })
    .addCase(deleteAllLoggedUserNotificationsAction.rejected, (state, action) => {
      state.deleteAllLoggedUserNotificationsResponseIsLoading = false
      state.deleteAllLoggedUserNotificationsResponse = action.payload
    })

    // deleteSpecificNotificationResponse
    builder
    .addCase(deleteSpecificNotificationAction.pending, (state, action) => { 
      state.deleteSpecificNotificationResponseIsLoading = true
    })
    .addCase(deleteSpecificNotificationAction.fulfilled, (state, action) => {
      state.deleteSpecificNotificationResponseIsLoading = false
      state.deleteSpecificNotificationResponse = action.payload
    })
    .addCase(deleteSpecificNotificationAction.rejected, (state, action) => {
      state.deleteSpecificNotificationResponseIsLoading = false
      state.deleteSpecificNotificationResponse = action.payload
    })

    // updateIsSeenNotificationResponse
    builder
    .addCase(updateIsSeenNotificationAction.pending, (state, action) => { 
      state.updateIsSeenNotificationResponseIsLoading = true
    })
    .addCase(updateIsSeenNotificationAction.fulfilled, (state, action) => {
      state.updateIsSeenNotificationResponseIsLoading = false
      state.updateIsSeenNotificationResponse = action.payload
    })
    .addCase(updateIsSeenNotificationAction.rejected, (state, action) => {
      state.updateIsSeenNotificationResponseIsLoading = false
      state.updateIsSeenNotificationResponse = action.payload
    })
    
  }
})

export const {resetCreateNotificationResponse, resetGetAllNotificationsData, resetdeleteAllLoggedUserNotificationsResponse, resetDeleteSpecificNotificationResponse}  = notificationSlice.actions

export default notificationSlice