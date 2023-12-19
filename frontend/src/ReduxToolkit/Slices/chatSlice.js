import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { useGetWithToken } from "../../Api/useGet"
import { usePostWithToken } from "../../Api/usePost"
import { usePutWithToken } from "../../Api/usePut"


// get all user chats data
export const getAllUserChatsAction = createAsyncThunk("chats/getAllUserChats", async ({page, limit, log}, thunkApi) => {
  try {
    const res = await useGetWithToken(`/api/v1/chats/?page=${page}&limit=${limit}`) 
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// get specific chat
export const getSpecificChatAction = createAsyncThunk("chats/getSpecificChat", async ({chatId, log}, thunkApi) => {
  try {
    const res = await useGetWithToken(`/api/v1/chats/${chatId}`)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// create single chat
export const createSingleChatAction = createAsyncThunk("chats/createSingleChat", async ({data, log}, thunkApi) => {
  try {
    const res = await usePostWithToken(`/api/v1/chats/create-single-chat`, data)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// create group chat
export const createGroupChatAction = createAsyncThunk("chats/createGroupChat", async ({data, log}, thunkApi) => {
  try {
    const res = await usePostWithToken(`/api/v1/chats/create-group-chat`, data)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// rename group chat
export const renameGroupChatAction = createAsyncThunk("chats/renameGroupChat", async ({data, log}, thunkApi) => {
  try {
    const res = await usePutWithToken(`/api/v1/chats/rename-group-chat`, data)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// add user to group chat
export const addUserToGroupChatAction = createAsyncThunk("chats/addUserToGroupChat", async ({data, log}, thunkApi) => {
  try {
    const res = await usePutWithToken(`/api/v1/chats/add-user-to-group-chat`, data)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})

// remove user from group chat
export const removeUserFromGroupChatAction = createAsyncThunk("chats/removeUserFromGroupChat", async ({data, log}, thunkApi) => {
  try {
    const res = await usePutWithToken(`/api/v1/chats/remove-user-from-group-chat`, data)
    return thunkApi.fulfillWithValue(res)
  } catch (err) {
    return thunkApi.rejectWithValue(err)
  }
})


const initialState = {
  allUserChatsData: [],
  allUserChatsDataIsLoading: false,

  specificChatData: [],
  specificChatDataIsLoading: false,

  createSingleChatResponse: [],
  createSingleChatResponseIsLoading: false,

  createGroupChatResponse: [],
  createGroupChatResponseIsLoading: false,

  renameGroupChatResponse: [],
  renameGroupChatResponseIsLoading: false,

  addUserToGroupChatResponse: [],
  addUserToGroupChatResponseIsLoading: false,

  removeUserFromGroupChatResponse: [],
  removeUserFromGroupChatResponseIsLoading: false,
}

const chatSlice = createSlice({
  name: 'chats',

  initialState,

  reducers: {
    resetUserChatsData(state) {
      state.allUserChatsData = []
    },
    resetSpecificChatData(state) {
      state.specificChatData = []
    },
    resetRenameGroupChatResponse(state) {
      state.renameGroupChatResponse = []
    },
    resetAddUserToGroupChatResponse(state) {
      state.addUserToGroupChatResponse = []
    },
    resetRemoveUserFromGroupChatResponse(state) {
      state.removeUserFromGroupChatResponse = []
    }
  },

  extraReducers: (builder) => {
    // allUserChatsData
    builder
    .addCase(getAllUserChatsAction.pending, (state, action) => { 
      state.allUserChatsDataIsLoading = true
    })
    .addCase(getAllUserChatsAction.fulfilled, (state, action) => {
      state.allUserChatsDataIsLoading = false
      state.allUserChatsData = action.payload
    })
    .addCase(getAllUserChatsAction.rejected, (state, action) => {
      state.allUserChatsDataIsLoading = false
      state.allUserChatsData = action.payload
    })

    // specificChatData
    builder
    .addCase(getSpecificChatAction.pending, (state, action) => { 
      state.specificChatDataIsLoading = true
    })
    .addCase(getSpecificChatAction.fulfilled, (state, action) => {
      state.specificChatDataIsLoading = false
      state.specificChatData = action.payload
    })
    .addCase(getSpecificChatAction.rejected, (state, action) => {
      state.specificChatDataIsLoading = false
      state.specificChatData = action.payload
    })

    // createSingleChatResponse
    builder
    .addCase(createSingleChatAction.pending, (state, action) => { 
      state.createSingleChatResponseIsLoading = true
    })
    .addCase(createSingleChatAction.fulfilled, (state, action) => {
      state.createSingleChatResponseIsLoading = false
      state.createSingleChatResponse = action.payload
    })
    .addCase(createSingleChatAction.rejected, (state, action) => {
      state.createSingleChatResponseIsLoading = false
      state.createSingleChatResponse = action.payload
    })

    // createGroupChatResponse
    builder
    .addCase(createGroupChatAction.pending, (state, action) => { 
      state.createGroupChatResponseIsLoading = true
    })
    .addCase(createGroupChatAction.fulfilled, (state, action) => {
      state.createGroupChatResponseIsLoading = false
      state.createGroupChatResponse = action.payload
    })
    .addCase(createGroupChatAction.rejected, (state, action) => {
      state.createGroupChatResponseIsLoading = false
      state.createGroupChatResponse = action.payload
    })

    // renameGroupChatResponse
    builder
    .addCase(renameGroupChatAction.pending, (state, action) => { 
      state.renameGroupChatResponseIsLoading = true
    })
    .addCase(renameGroupChatAction.fulfilled, (state, action) => {
      state.renameGroupChatResponseIsLoading = false
      state.renameGroupChatResponse = action.payload
    })
    .addCase(renameGroupChatAction.rejected, (state, action) => {
      state.renameGroupChatResponseIsLoading = false
      state.renameGroupChatResponse = action.payload
    })
    
    // addUserToGroupChatResponse
    builder
    .addCase(addUserToGroupChatAction.pending, (state, action) => { 
      state.addUserToGroupChatResponseIsLoading = true
    })
    .addCase(addUserToGroupChatAction.fulfilled, (state, action) => {
      state.addUserToGroupChatResponseIsLoading = false
      state.addUserToGroupChatResponse = action.payload
    })
    .addCase(addUserToGroupChatAction.rejected, (state, action) => {
      state.addUserToGroupChatResponseIsLoading = false
      state.addUserToGroupChatResponse = action.payload
    })

    // removeUserFromGroupChatResponse
    builder
    .addCase(removeUserFromGroupChatAction.pending, (state, action) => { 
      state.removeUserFromGroupChatResponseIsLoading = true
    })
    .addCase(removeUserFromGroupChatAction.fulfilled, (state, action) => {
      state.removeUserFromGroupChatResponseIsLoading = false
      state.removeUserFromGroupChatResponse = action.payload
    })
    .addCase(removeUserFromGroupChatAction.rejected, (state, action) => {
      state.removeUserFromGroupChatResponseIsLoading = false
      state.removeUserFromGroupChatResponse = action.payload
    })
    
  }
})

export const {resetUserChatsData, resetSpecificChatData, resetRenameGroupChatResponse, resetAddUserToGroupChatResponse, resetRemoveUserFromGroupChatResponse}  = chatSlice.actions

export default chatSlice