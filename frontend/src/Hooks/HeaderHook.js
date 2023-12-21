import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { resetUserData, searchUsersAction, updateLoggedUserProfilePictureAction } from "../ReduxToolkit/Slices/userSlice"
import { debounce } from 'lodash';
import { deleteAllLoggedUserNotificationsAction, deleteSpecificNotificationAction, getAllNotificationsAction, updateIsSeenNotificationAction } from "../ReduxToolkit/Slices/notificationSlice"
import moment from "moment"
import { getAllUserChatsAction, getSpecificChatAction } from "../ReduxToolkit/Slices/chatSlice"
import { getAllChatMessagesAction } from "../ReduxToolkit/Slices/messageSlice"


const HeaderHook = (socket, chatData, setChatData, chatCardRefs, setChatCardIsClicked, setChatCardonClickId, setChatCardActiveStatus, setClickedChatCardData, groupChatMessages, setAllChatMessages, setLastSeen) => {

  const dispatch = useDispatch()

  const navigateTo = useNavigate()

  const [renderComponent, setRenderComponent] = useState(false)

  // user info
  const userName = JSON.parse(localStorage.getItem('userData'))?.name
  const userEmail = JSON.parse(localStorage.getItem('userData'))?.email
  const userProfilePic = JSON.parse(localStorage.getItem('userData'))?.profilePic

  // profile
  const profileOnClickHandle = () => {
    Swal.fire({
      title: `<h3>Email: <span class="text-primary fw-bold">${userEmail}</span></h3>`,
      imageUrl: `${userProfilePic}`,
      imageHeight: 200,
      imageAlt: `${userName}`,
      showConfirmButton: true,
      confirmButtonText: "Chenge Image",
      showCloseButton: true, 
      preConfirm: async () => {
        await Swal.fire({
          title: 'Select image',
          input: 'file',
          inputAttributes: {
            'accept': 'image/*',
            'aria-label': 'Upload your profile picture'
          },
          showCloseButton: true,
          showLoaderOnConfirm: true,
          preConfirm: (file) => {
            if (!file) {
              return
            } else if (file) {
              const reader = new FileReader()
              reader.readAsDataURL(file)
              const promise = new Promise((resolve, reject) => {
                reader.onload = (e) => {
                  const edittedImage = e.target.result;
                  resolve(edittedImage);
                };
              });
              return promise.then(async (edittedImage) => {
                await dispatch(updateLoggedUserProfilePictureAction({
                  data: {
                    profilePic: edittedImage,
                  },
                  log: "HeaderHook"
                })).then((res) => { 
                  if (res.payload.status === 201) {
                    Swal.fire({
                      title: 'Image Updated Successfully',
                      imageAlt: 'Uploaded Image',
                      imageUrl: res?.payload?.data?.data?.profilePic,
                      imageHeight: 200,
                    })
                    localStorage.setItem("userData", JSON.stringify(res?.payload?.data?.data)) 
                    setRenderComponent(!renderComponent)
                  }
                })
              })
            }
          },
          allowOutsideClick: () => !Swal.isLoading()
        })
        
      }
    })
  }

  // logout
  const logOutOnClickHandle = () => {
    localStorage.removeItem('userData')
    localStorage.removeItem('token')
    navigateTo("/")
  }

  // offCanvas
  const [show, setShow] = useState(false);

  const OffCanvasHandleShow = () => setShow(true);
  const OffCanvasHandleClose = () => {
    setShow(false)
    setOffCanvasSreachInputValue('')
    // userSlice
    dispatch(resetUserData())
  };

  // search
  const usersData = useSelector(state => state.userReducer.usersData)
  const usersDataIsLoading = useSelector(state => state.userReducer.usersDataIsLoading)

  const [offCanvasSreachInputValue, setOffCanvasSreachInputValue] = useState('')

  const request = useCallback((keyword) => {
    if (keyword.length <= 1) {
      return
    }
    dispatch(searchUsersAction({
      keyword: keyword,
      log: "HeaderHook"
    }))
  }, [])

  const debouncedDispatch = useMemo(() => {
    return debounce(request, 500)
  }, [request])

  const offCanvasInputOnChangeHandle = (e) => {

    setOffCanvasSreachInputValue(e.target.value)


    if (e.target.value === "") {
      dispatch(resetUserData())
      return
    }

    debouncedDispatch(e.target.value)
  }

  const userCardOnClickHandle = (id) => {
    console.log(id)
  }


  // ------------------------------------------------------------------------------------------------------
  // ------------------------------------------ notifications ---------------------------------------------
  // ------------------------------------------------------------------------------------------------------

  const getAllNotificationsData = useSelector(state => state.notificationReducer.getAllNotificationsData)
  const getAllNotificationsDataIsLoading = useSelector(state => state.notificationReducer.getAllNotificationsDataIsLoading)
  const deleteAllLoggedUserNotificationsResponse = useSelector(state => state.notificationReducer.deleteAllLoggedUserNotificationsResponse)
  const deleteAllLoggedUserNotificationsResponseIsLoading = useSelector(state => state.notificationReducer.deleteAllLoggedUserNotificationsResponseIsLoading)
  const deleteSpecificNotificationResponse = useSelector(state => state.notificationReducer.deleteSpecificNotificationResponse)
  const deleteSpecificNotificationResponseIsLoading = useSelector(state => state.notificationReducer.deleteSpecificNotificationResponseIsLoading)
  const updateIsSeenNotificationResponse = useSelector(state => state.notificationReducer.updateIsSeenNotificationResponse)
  const updateIsSeenNotificationResponseIsLoading = useSelector(state => state.notificationReducer.updateIsSeenNotificationResponseIsLoading)
  const specificChatData = useSelector(state => state.chatReducer.specificChatData)
  const specificChatDataIsLoading = useSelector(state => state.chatReducer.specificChatDataIsLoading)
  const allUserChatsData = useSelector(state => state.chatReducer.allUserChatsData)
  const allUserChatsDataIsLoading = useSelector(state => state.chatReducer.allUserChatsDataIsLoading)



  const [allNotifications, setAllNotifications] = useState([])
  const [notificationCardClickedId, setNotificationCardClickedId] = useState("")
  const [collapseNotificationIconClickedId, setCollapseNotificationIconClickedId] = useState("")
  const [collapseNotificationIconIsClicked, setCollapseNotificationIconIsClicked] = useState(false)
  const [dispatchIsLoaded, setDispatchIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(getAllNotificationsAction({
      log: "HeaderHook"
    })).then(res => {
      if (res.payload.status === 200) {
        setAllNotifications(res.payload.data)
      }
    })
  }, [])


  useEffect(() => {

    if (socket === null) return

    socket?.on('message-notification', (notification) => {
      setAllNotifications(prev => [notification, ...prev])

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-start',
        width: "fit-content",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'info',
        title: `<img style="max-height: 30px" src=${notification.fromUser.profilePic} /> <span class="text-primary fs-5" style="cursor: pointer">${notification.fromUser.name}</span> Sent New Message ${notification.belongingChat.isGroupChat ? 
          `<span class="text-primary fs-5" style="cursor: pointer">@${notification.belongingChat.chatName}</span>` 
          : 
          ""}`
      })

    })

    return () => {
      socket?.off("message-notification")
    }
  }, [socket])
  



  // notificationDateAndTime
  const momemtDateAndTime = (dateAndTime) => {
    const currentDateTime = moment()
      const lastSeenDateTime = moment(dateAndTime)
      const isSameDay = currentDateTime.isSame(lastSeenDateTime, "day")
      const isMoreThanDay = currentDateTime.diff(lastSeenDateTime, "days")
      const isSameWeek = currentDateTime.isSame(lastSeenDateTime, "week")
      const isMoreThanWeek = currentDateTime.diff(lastSeenDateTime, "weeks")

      if (isSameDay) {
        return (lastSeenDateTime.format("[Today at] HH:mm"))
      } else if (isMoreThanDay === 1) {
        return (lastSeenDateTime.format("[Yesterday at] HH:mm"))
      } else if (isMoreThanDay > 1 && isMoreThanDay < 5) {
        return (lastSeenDateTime.format("ddd HH:mm"))
      } else if(isMoreThanDay >= 5 && isSameWeek) {
        return (lastSeenDateTime.format("[Last] ddd HH:mm"))
      } else if (isMoreThanWeek >= 1) {
        return (lastSeenDateTime.format("MMM DD HH:mm"))
      }
  }


  const clearNotificationsIconOnClickHandle = async () => {
    await dispatch(deleteAllLoggedUserNotificationsAction({
      log: "HeaderHook"
    })).then((res) => {
      if (res.payload.status === 201) {
        setAllNotifications([])
      }
    })
  }

  const deleteNotificationIconOnClickHandle = async (e, id) => {

    e.stopPropagation()

    setNotificationCardClickedId(id)

    await dispatch(deleteSpecificNotificationAction({
      notificationId: id,
      log: "HeaderHook",
    })).then((res) => {
      if (res.payload.status === 201) {
        dispatch(getAllNotificationsAction({
          log: "HeaderHook"
        })).then(res => {
          if (res.payload.status === 200) {
            setAllNotifications(res.payload.data)
          }
        })
      }
    })
  }

  const collapseNotificationIconOnClickHandle = async (e, id) => {

    e.stopPropagation()

    setCollapseNotificationIconClickedId(id)

    setCollapseNotificationIconIsClicked(true)

  }

  const notificationCardOnClickHandle = async (chatId, notificationId, isSeen) => {

    if (isSeen) return

    dispatch(updateIsSeenNotificationAction({
      notificationId: notificationId,
      log: "HeaderHook"
    }))
    .then(res => {
      if (res.payload.status === 201) {
        dispatch(getAllNotificationsAction({
          log: "HeaderHook"
        }))
        .then( res => {
          if (res.payload.status === 200) {
            setAllNotifications(res.payload.data)
          }
        })
      }
    })

    setClickedChatCardData() 

    setAllChatMessages([])

    setChatCardonClickId(chatId)
    setChatCardActiveStatus(true)

    dispatch(getSpecificChatAction({
      chatId: chatId,
      log: "HeaderHook"
    }))
    .then( async res => {
      if (res.payload.status === 200) {

          let isFound = false
          chatData?.filter(async (item, index, arr) => {
            if (item._id === res.payload.data._id) {
              chatCardRefs[index].scrollIntoView({ behavior: 'smooth' })
              isFound = true
            }
          })
          if (!isFound) {
            dispatch(
              getAllUserChatsAction({
                log: "HeaderHook",
              })
              )
              .then(async (allUserChatsRes) => {
                if (allUserChatsRes.payload.status === 200) {
                  setChatData(allUserChatsRes.payload.data)
                  setDispatchIsLoaded(true)
                }
              });
            }

      const groupChatProfilePicOrSingleChatProfilePic = res.payload.data.isGroupChat ? 
      "https://uploads-ssl.webflow.com/628e4f5e9ef1f537daf6c9e2/6294a420b645545b1c6a3be1_Vector.png" : 
      (
        res.payload.data.users[0]._id === JSON.parse(localStorage.getItem("userData"))._id ? 
        res.payload.data.users[1].profilePic : 
        res.payload.data.users[0].profilePic 
      )

      const groupChatNameOrSingleChatUserName = res.payload.data.isGroupChat ? 
      res.payload.data.chatName : 
      (
        res.payload.data.users[0]._id === JSON.parse(localStorage.getItem("userData"))._id ? 
        res.payload.data.users[1].name : 
        res.payload.data.users[0].name 
      )

      const groupChatUsersOrSingleChatUser = res.payload.data.isGroupChat ? 
      res.payload.data.users : 
      (
        res.payload.data.users[0]._id === JSON.parse(localStorage.getItem("userData"))._id ? 
        res.payload.data.users[1] : 
        res.payload.data.users[0]
      )

      socket?.emit("join-chat-room", res.payload.data._id, res.payload.data.isGroupChat, res.payload.data.latestMessage)

      setChatCardIsClicked(true)

      setClickedChatCardData({
        _id: res.payload.data._id,
        isGroupChat: res.payload.data.isGroupChat,
        groupAdmin: res.payload.data.groupAdmin,
        profilePic: groupChatProfilePicOrSingleChatProfilePic,
        name: groupChatNameOrSingleChatUserName,
        users: groupChatUsersOrSingleChatUser,
      })

      if (!res.payload.data.isGroupChat && groupChatUsersOrSingleChatUser.lastSeen) {
  
        const currentDateTime = moment()
        const lastSeenDateTime = moment(groupChatUsersOrSingleChatUser.lastSeen)
        const isSameDay = currentDateTime.isSame(lastSeenDateTime, "day")
        const isMoreThanDay = currentDateTime.diff(lastSeenDateTime, "days")
        const isSameWeek = currentDateTime.isSame(lastSeenDateTime, "week")
        const isMoreThanWeek = currentDateTime.diff(lastSeenDateTime, "weeks")
  
        if (isSameDay) {
          setLastSeen(lastSeenDateTime.format("[Today at] HH:mm"))
        } else if (isMoreThanDay === 1) {
          setLastSeen(lastSeenDateTime.format("[Yesterday at] HH:mm"))
        } else if (isMoreThanDay > 1 && isMoreThanDay < 5) {
          setLastSeen(lastSeenDateTime.format("ddd HH:mm"))
        } else if(isMoreThanDay >= 5 && isSameWeek) {
          setLastSeen(lastSeenDateTime.format("[Last] ddd HH:mm"))
        } else if (isMoreThanWeek >= 1) {
          setLastSeen(lastSeenDateTime.format("MMM DD HH:mm"))
        }
      }

          await dispatch(getAllChatMessagesAction({
            chatId: chatId,
            log: "HeaderHook"
          }))
          .then(async (res) => {
            if (res.payload.status === 200) {
              // grouped messages
              const groupedChatMessages = await groupChatMessages(res.payload.data, res.payload.data.isGroupChat) 
              setAllChatMessages(groupedChatMessages)
      
            }
          })

          socket.emit("wait")

      }
    })

  }

  useEffect(() => {
    if (dispatchIsLoaded) {
      chatData?.filter(async (item, index, arr) => {
        if (item._id === specificChatData?.data?._id) {
          setChatCardonClickId(specificChatData?.data?._id)
          setChatCardActiveStatus(true)
          chatCardRefs[index].scrollIntoView({ behavior: 'smooth' })
        }
      })
    }
    setDispatchIsLoaded(false)
  }, [dispatchIsLoaded])
  


  return [userName, userProfilePic, profileOnClickHandle, logOutOnClickHandle, show, OffCanvasHandleShow, OffCanvasHandleClose, offCanvasSreachInputValue, offCanvasInputOnChangeHandle, usersData, usersDataIsLoading, userCardOnClickHandle, allNotifications, momemtDateAndTime, notificationCardOnClickHandle, deleteNotificationIconOnClickHandle, collapseNotificationIconOnClickHandle, clearNotificationsIconOnClickHandle, deleteAllLoggedUserNotificationsResponseIsLoading, deleteSpecificNotificationResponseIsLoading, notificationCardClickedId, collapseNotificationIconIsClicked, collapseNotificationIconClickedId]
}

export default HeaderHook