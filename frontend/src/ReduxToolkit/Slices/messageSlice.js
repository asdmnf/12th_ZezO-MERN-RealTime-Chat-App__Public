import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { usePostWithToken } from "../../Api/usePost"
import { useGetWithToken } from "../../Api/useGet"
import { usePutWithToken } from "../../Api/usePut"



// create message
export const craeteMessageAction = createAsyncThunk("messages/createessage", async ({data, log}, thunkApi) => {
  try {
    const res = await usePostWithToken(`/api/v1/messages/create-message`, data)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// get all chat messages
export const getAllChatMessagesAction = createAsyncThunk("messages/getAllChatMessages", async ({chatId, log}, thunkApi) => {
  try {
    const res = await useGetWithToken(`/api/v1/messages/get-all-chat-messages/${chatId}`)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// get specific messages
export const getSpecificMessageAction = createAsyncThunk("messages/getSpecificMessage", async ({messageId, log}, thunkApi) => {
  try {
    const res = await useGetWithToken(`/api/v1/messages/get-specific-message/${messageId}`)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// delete specific message
export const deleteSpecificMessageAction = createAsyncThunk("messages/deleteSpecificMessage", async ({data, log}, thunkApi) => {
  try {
    const res = await usePutWithToken(`/api/v1/messages/delete-specific-message`, data)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

const initialState = {
  createMessageResponse: [],
  createMessageResponseIsLoading: false,

  getAllChatMessagesData: [],
  getAllChatMessagesDataIsLoading: false,

  getSpecificMessageData: [],
  getSpecificMessageDataIsLoading: false,

  deleteSpecificMessageResponse: [],
  deleteSpecificMessageResponseIsLoading: false,

}

const messageSlice = createSlice({
  name: 'messages',

  initialState,

  reducers: {
    resetCreateMessageResponse(state) {
      state.createMessageResponse = []
    },
    resetGetAllChatMessagesData(state) {
      state.getAllChatMessagesData = []
    },
    resetGetSpecificMessageData(state) {
      state.getSpecificMessageData = []
    },
    resetDeleteSpecificMessageResponse(state) {
      state.deleteSpecificMessageResponse = []
    }
  },

  extraReducers: (builder) => {
    // createMessageResponse
    builder
    .addCase(craeteMessageAction.pending, (state, action) => { 
      state.createMessageResponseIsLoading = true
    })
    .addCase(craeteMessageAction.fulfilled, (state, action) => {
      state.createMessageResponseIsLoading = false
      state.createMessageResponse = action.payload
    })
    .addCase(craeteMessageAction.rejected, (state, action) => {
      state.createMessageResponseIsLoading = false
      state.createMessageResponse = action.payload
    })

    // getAllChatMessagesData
    builder
    .addCase(getAllChatMessagesAction.pending, (state, action) => { 
      state.getAllChatMessagesDataIsLoading = true
    })
    .addCase(getAllChatMessagesAction.fulfilled, (state, action) => {
      state.getAllChatMessagesDataIsLoading = false
      state.getAllChatMessagesData = action.payload
    })
    .addCase(getAllChatMessagesAction.rejected, (state, action) => {
      state.getAllChatMessagesDataIsLoading = false
      state.getAllChatMessagesData = action.payload
    })

    // getSpecificMessageData
    builder
    .addCase(getSpecificMessageAction.pending, (state, action) => { 
      state.getSpecificMessageDataIsLoading = true
    })
    .addCase(getSpecificMessageAction.fulfilled, (state, action) => {
      state.getSpecificMessageDataIsLoading = false
      state.getSpecificMessageData = action.payload
    })
    .addCase(getSpecificMessageAction.rejected, (state, action) => {
      state.getSpecificMessageDataIsLoading = false
      state.getSpecificMessageData = action.payload
    })

    // deleteSpecificMessageResponse
    builder
    .addCase(deleteSpecificMessageAction.pending, (state, action) => { 
      state.deleteSpecificMessageResponseIsLoading = true
    })
    .addCase(deleteSpecificMessageAction.fulfilled, (state, action) => {
      state.deleteSpecificMessageResponseIsLoading = false
      state.deleteSpecificMessageResponse = action.payload
    })
    .addCase(deleteSpecificMessageAction.rejected, (state, action) => {
      state.deleteSpecificMessageResponseIsLoading = false
      state.deleteSpecificMessageResponse = action.payload
    })
    
  }
})

export const {resetCreateMessageResponse, resetGetAllChatMessagesData, resetGetSpecificMessageData, resetDeleteSpecificMessageResponse}  = messageSlice.actions

export default messageSlice