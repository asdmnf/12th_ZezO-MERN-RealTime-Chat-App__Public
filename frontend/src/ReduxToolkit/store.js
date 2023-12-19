import { configureStore } from '@reduxjs/toolkit'
import authSlice from './Slices/authSlice'
import userSlice from './Slices/userSlice'
import chatSlice from './Slices/chatSlice'
import messageSlice from './Slices/messageSlice'
import notificationSlice from './Slices/notificationSlice'


const store = configureStore({
  reducer: {
    authReducer: authSlice.reducer,
    userReducer: userSlice.reducer,
    chatReducer: chatSlice.reducer,
    messageReducer: messageSlice.reducer,
    notificationReducer: notificationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    })
  },
  devTools: true
})

export default store