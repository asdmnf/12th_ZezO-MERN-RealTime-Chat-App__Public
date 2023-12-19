import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addUserToGroupChatAction, createGroupChatAction, createSingleChatAction, getAllUserChatsAction, getSpecificChatAction, removeUserFromGroupChatAction, renameGroupChatAction, resetAddUserToGroupChatResponse, resetRemoveUserFromGroupChatResponse, resetRenameGroupChatResponse, resetSpecificChatData } from "../ReduxToolkit/Slices/chatSlice"
import { onlineUsers, resetUserData, searchUsersAction } from "../ReduxToolkit/Slices/userSlice"
import { debounce } from 'lodash';
import Swal from "sweetalert2"
import { craeteMessageAction, getAllChatMessagesAction, resetGetAllChatMessagesData } from "../ReduxToolkit/Slices/messageSlice";
import io from "socket.io-client"
import moment from "moment";


const ChatsPageHook = () => {

  const dispatch = useDispatch()

  // ------------------------------------------------------------------------------------------------------
  // ------------------------------------- infinite scroll ------------------------------------------------
  // ------------------------------------------------------------------------------------------------------


  const allUserChatsData = useSelector(state => state.chatReducer.allUserChatsData)
  const allUserChatsDataIsLoading = useSelector(state => state.chatReducer.allUserChatsDataIsLoading)

  const chatsContainerRef = useRef()
  // create single chat
  const [chatData, setChatData] = useState([])
  const [chatDataPage, setChatDataPage] = useState(1)
  const [endOfDataStatus, setEndOfDataStatus] = useState(false)

  useEffect(() => {
    if (allUserChatsData?.paginationData?.totalResults === chatData?.length) { 
      chatsContainerRef.current.removeEventListener("scroll", scrollHandle)
      setEndOfDataStatus(true)
      return
    }
    dispatch(getAllUserChatsAction({
      page: chatDataPage,
      log: "ChatsPageHook"
  })).then(res => { 
    if (res.payload.status === 200) {
      setChatData([...chatData, ...res.payload.data])
      chatsContainerRef.current.addEventListener("scroll", scrollHandle)
    }
  })
  }, [chatDataPage])

  const scrollHandle = () => {
    const { scrollHeight, clientHeight, scrollTop } = chatsContainerRef.current;

    if (clientHeight + scrollTop + 71 >= scrollHeight) {
      setChatDataPage(chatDataPage + 1)
      chatsContainerRef.current.removeEventListener("scroll", scrollHandle)
    }
  }
  

  // ------------------------------------------------------------------------------------------------------
  // ------------------------------------- offCanvas ------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------


    // single chat offCanvas
    const [singleChatOffCanvasShow, setSingleChatOffCanvasShow] = useState(false);

    const singleChatOffCanvasHandleShow = () => setSingleChatOffCanvasShow(true);
    const singleChatOffCanvasHandleClose = () => {
      setSingleChatOffCanvasShow(false)
      setOffCanvasSreachInputValue('')
      dispatch(resetUserData())
    };

    // group chat offCanvas
    const [groupChatOffCanvasShow, setGroupChatOffCanvasShow] = useState(false);

    const groupChatOffCanvasHandleShow = () => setGroupChatOffCanvasShow(true);
    const groupChatOffCanvasHandleClose = async () => {
      setGroupChatOffCanvasShow(false)

      setTimeout(() => {
        setOffCanvasSreachInputValue('')
        setOffCanvasGroupNameInputValue("")
        dispatch(resetUserData())
        setGroupChatSelectedUsers([])
        setGroupChatSelectedUsersId([])
        setUpdateGroupChatIconIsClicked(false)
      }, 300);

      if (renameGroupChatResponse?.status === 201 || addUserToGroupChatResponse?.status === 201 || removeUserFromGroupChatResponse?.status === 201) {
        setUpdatingDispatchLoader(true)
        await dispatch(getAllUserChatsAction({page: 1, log: "ChatsPageHook"})).then(res => {
          setUpdatingDispatchLoader(false)
          if (res.payload.status === 200) {
            setChatData(res.payload.data)
          }
        })
      }

      dispatch(resetRenameGroupChatResponse())
      dispatch(resetAddUserToGroupChatResponse())
      dispatch(resetRemoveUserFromGroupChatResponse())


    };
  
  // ------------------------------------------------------------------------------------------------------
  // ---------------------------------------------- search ------------------------------------------------
  // ------------------------------------------------------------------------------------------------------

  
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


  // ------------------------------------------------------------------------------------------------------
  // -------------------------------------- create single chat --------------------------------------------
  // ------------------------------------------------------------------------------------------------------


  // create single chat
  const createSingleChatResponse = useSelector(state => state.chatReducer.createSingleChatResponse)
  const createSingleChatResponseIsLoading = useSelector(state => state.chatReducer.createSingleChatResponseIsLoading)

  const [userCardonClickId, setUserCardonClickId] = useState('')
  const [chatCardonClickId, setChatCardonClickId] = useState('')
  const [chatCardActiveStatus, setChatCardActiveStatus] = useState(false)
  const [specificDispatchIsLoaded, setSpecificDispatchIsLoaded] = useState(false)
  const [updatingDispatchLoader, setUpdatingDispatchLoader] = useState(false);

  const chatCardRefs = useRef([])

  const userCardOnClickHandle = async (id) => {
    setUserCardonClickId(id)
    dispatch(createSingleChatAction({
      data: {
        otherUserId: id,
      },
      log: "ChatsPageHook"
    })).then(async (res) => {
      if (res.payload.status === 201) {
        singleChatOffCanvasHandleClose()
        setUpdatingDispatchLoader(true)
        await dispatch(getAllUserChatsAction({page: 1, log: "ChatsPageHook"})).then(res => {
          setUpdatingDispatchLoader(false)
          if (res.payload.status === 200) {
            setChatData(res.payload.data)
          }
        })
        setChatCardonClickId(res.payload.data.data._id)
        setChatCardActiveStatus(true)
        dispatch(resetUserData())

        setClickedChatCardData({
          _id: res.payload.data.data._id,
          isGroupChat: res.payload.data.data.isGroupChat,
          groupAdmin: res.payload.data.data.groupAdmin,
          profilePic: res.payload.data.data.users[1].profilePic,
          name: res.payload.data.data.users[1].name,
          users: res.payload.data.data.users[1],
        })

        setChatCardIsClicked(true)

        if (window.matchMedia('(max-width: 768px)').matches) {
          setIsMobileSize(!isMobileSize)
        }

      } else if (res.payload.status === 200) {
        singleChatOffCanvasHandleClose()
        let isFound = false
        chatData?.filter(async (item, index, arr) => {
          if (item._id === res.payload.data.data._id) {
            setChatCardonClickId(res.payload.data.data._id)
            setChatCardActiveStatus(true)
            chatCardRefs[index].scrollIntoView({ behavior: 'smooth' })
            isFound = true
          }
        })
        if (!isFound) {
          dispatch(
            getAllUserChatsAction({
              log: "ChatsPageHook",
            })
          ).then((res) => {
            if (res.payload.status === 200) {
              setChatData(res.payload.data);
              setSpecificDispatchIsLoaded(true)
            }
          });
        }
        dispatch(resetUserData())

        setClickedChatCardData({
          _id: res.payload.data.data._id,
          isGroupChat: res.payload.data.data.isGroupChat,
          groupAdmin: res.payload.data.data.groupAdmin,
          profilePic: res.payload.data.data.users[0]._id === JSON.parse(localStorage.getItem("userData"))._id ? res.payload.data.data.users[1].profilePic : res.payload.data.data.users[0].profilePic,
          name: res.payload.data.data.users[0]._id === JSON.parse(localStorage.getItem("userData"))._id ? res.payload.data.data.users[1].name : res.payload.data.data.users[0].name,
          users: res.payload.data.data.users[0]._id === JSON.parse(localStorage.getItem("userData"))._id ? res.payload.data.data.users[1] : res.payload.data.data.users[0],
        })

        setChatCardIsClicked(true)

        if (window.matchMedia('(max-width: 768px)').matches) {
          setIsMobileSize(!isMobileSize)
        }

        // get all chat messages
        await dispatch(getAllChatMessagesAction({
          chatId: res.payload.data.data._id,
          log: "ChatsPageHook"
        })).then(async (res) => {
          if (res.payload.status === 200) {

            // grouped messages
            const groupedChatMessages = await groupChatMessages(res.payload.data)
            setAllChatMessages(groupedChatMessages)
          }
        })
      }
    })
  }

  useEffect(() => { 
    if (specificDispatchIsLoaded) { 
      allUserChatsData?.data?.filter(async (item, index, arr) => { 
        if (item._id === createSingleChatResponse?.data?.data?._id) { 
          setChatCardonClickId(createSingleChatResponse?.data?.data?._id) 
          setChatCardActiveStatus(true) 
          chatCardRefs[index].scrollIntoView({ behavior: 'smooth' })
        }
      })
    }
    setSpecificDispatchIsLoaded(false)
  }, [specificDispatchIsLoaded])



  // ------------------------------------------------------------------------------------------------------
  // -------------------------------------- create group chat ---------------------------------------------
  // ------------------------------------------------------------------------------------------------------


  const offCanvasGroupNameInputRef = useRef() 

  const createGroupChatResponse = useSelector(state => state.chatReducer.createGroupChatResponse)
  const createGroupChatResponseIsLoading = useSelector(state => state.chatReducer.createGroupChatResponseIsLoading)

  const [offCanvasGroupNameInputValue, setOffCanvasGroupNameInputValue] = useState("")

  const [groupChatSelectedUsers, setGroupChatSelectedUsers] = useState([]) 
  const [groupChatSelectedUsersId, setGroupChatSelectedUsersId] = useState([]) 

  const offCanvasGroupNameInputOnChangeHandle = (e) => { 
    setOffCanvasGroupNameInputValue(e.target.value)
  }

  const deleteUserIconOnClickHandle = async (id, index) => { 
    if (updateGroupChatIconIsClicked) { 

      if (clickedChatCardData?.groupAdmin !== JSON.parse(localStorage.getItem("userData"))._id && id !== JSON.parse(localStorage.getItem("userData"))._id) { 
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'warning',
          title: 'Only Group Owner Can Do This'
        })
        return
      }

      if (id === JSON.parse(localStorage.getItem("userData"))._id) { 
        await Swal.fire({
          title: 'Are you sure to remove yourself from this chat?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, remove me!'
        }).then((result) => {
          if (result.isConfirmed) {
            setUserCardonClickId(id); 
            dispatch(
              removeUserFromGroupChatAction({
                data: {
                  groupChatId: clickedChatCardData?._id, 
                  userId: id,
                },
                log: "ChatsPageHook",
              })
            ).then( async (res) => {
              if (res.payload.status === 201) {
                dispatch(resetGetAllChatMessagesData()) 
                setClickedChatCardData(); 
                setChatCardIsClicked(false) 
                setAllChatMessages([]) 
                groupChatOffCanvasHandleClose() 
                setUpdatingDispatchLoader(true) 
                setIsMobileSize(false)
                await dispatch(getAllUserChatsAction({page: 1, log: "ChatsPageHook"})).then(res => {
                  setUpdatingDispatchLoader(false)
                  if (res.payload.status === 200) {
                    setChatData(res.payload.data)
                  }
                })
              }
            });
          }
        })
        return
      }

      setUserCardonClickId(id)
      dispatch(removeUserFromGroupChatAction({
        data: {
          groupChatId: clickedChatCardData?._id,
          userId: id
        },
        log: "ChatsPageHook"
      })).then(res => {
        if (res.payload.status === 201) {

          setGroupChatSelectedUsers(res.payload.data.data.users)
          setGroupChatSelectedUsersId(res.payload.data.data.users.map(item => item._id))

          setClickedChatCardData({ 
            _id: res.payload.data.data._id,
            isGroupChat: res.payload.data.data.isGroupChat,
            groupAdmin: res.payload.data.data.groupAdmin,
            profilePic: clickedChatCardData?.profilePic,
            name: res.payload.data.data.chatName,
            users: res.payload.data.data.users, 
          })
        }
      })
    } else { 
      const filteredGroupChatSelectedUsers = groupChatSelectedUsers.filter((item, i) => {
        return i !== index
      })
      setGroupChatSelectedUsers(filteredGroupChatSelectedUsers) 
      const filteredGroupChatSelectedUsersId = filteredGroupChatSelectedUsers.map(item => item._id)
      setGroupChatSelectedUsersId(filteredGroupChatSelectedUsersId) 
    }
  }

  const groupChatSearchResultsUserCardOnClickHandle = (id, profilePic, name, email) => {

      const repeatedSelectedUser = groupChatSelectedUsers.filter(item => {
        return item._id === id
        })
        if (repeatedSelectedUser.length) {
          return
        }

        if (updateGroupChatIconIsClicked) { 

          if (clickedChatCardData?.groupAdmin !== JSON.parse(localStorage.getItem("userData"))._id) { 
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })
            
            Toast.fire({
              icon: 'warning',
              title: 'Only Group Owner Can Do This'
            })
            return
          }
          setUserCardonClickId(id)
          dispatch(addUserToGroupChatAction({ 
            data: {
              groupChatId: clickedChatCardData?._id, 
              userId: id
            },
            log: "ChatsPageHook"
          })).then(res => {
            if (res.payload.status === 201) { 

              setGroupChatSelectedUsers(res.payload.data.data.users)
              setGroupChatSelectedUsersId(res.payload.data.data.users.map(item => item._id))

              setClickedChatCardData({ 
                _id: res.payload.data.data._id,
                isGroupChat: res.payload.data.data.isGroupChat,
                groupAdmin: res.payload.data.data.groupAdmin,
                profilePic: clickedChatCardData?.profilePic,
                name: res.payload.data.data.chatName,
                users: res.payload.data.data.users, 
              })
            }
          })
          return
        } else { 
          setGroupChatSelectedUsers([...groupChatSelectedUsers,{ 
            _id: id,
            profilePic: profilePic,
            name: name,
            email: email
          }])
          setGroupChatSelectedUsersId([...groupChatSelectedUsersId, id]) 
        }
  }

  const offCanvasCreateGroupChatOnClickHandle = async () => { 
    if (!offCanvasGroupNameInputValue) {
      offCanvasGroupNameInputRef.current.focus()
      offCanvasGroupNameInputRef.current.placeholder = "*Group Name Required"
      return
    }
    await dispatch(createGroupChatAction({ 
      data: {
        chatName: offCanvasGroupNameInputValue,
        users: groupChatSelectedUsersId
      },
      log: "ChatsPageHook"
    })).then(async (res) => { 
      if (res.payload.status === 201) {
        groupChatOffCanvasHandleClose() 
        setOffCanvasGroupNameInputValue("") 
        setGroupChatSelectedUsers([])
        setGroupChatSelectedUsersId([])
        setAllChatMessages([]) 
        setUpdatingDispatchLoader(true) 
        await dispatch(getAllUserChatsAction({page: 1, log: "ChatsPageHook"})).then(res => { 
          setUpdatingDispatchLoader(false)
          if (res.payload.status === 200) {
            setChatData(res.payload.data)
          }
        })
        setChatCardonClickId(res.payload.data.data._id) 
        setChatCardActiveStatus(true) 
        dispatch(resetUserData())

        setClickedChatCardData({ 
          _id: res.payload.data.data._id,
          isGroupChat: res.payload.data.data.isGroupChat,
          groupAdmin: res.payload.data.data.groupAdmin,
          profilePic: "https://uploads-ssl.webflow.com/628e4f5e9ef1f537daf6c9e2/6294a420b645545b1c6a3be1_Vector.png",
          name: res.payload.data.data.chatName,
          users: res.payload.data.data.users, 
        })

        setChatCardIsClicked(true) 
        if (window.matchMedia('(max-width: 768px)').matches) { 
          setIsMobileSize(!isMobileSize)
        }

        socket?.emit("join-chat-room", res.payload.data.data._id, res.payload.data.data.isGroupChat, res.payload.data.data.latestMessage)
      }
    })
    
  }
  

  // ------------------------------------------------------------------------------------------------------
  // ---------------------------------------- select and edit chat ----------------------------------------
  // ------------------------------------------------------------------------------------------------------


  const specificChatData = useSelector(state => state.chatReducer.specificChatData)
  const specificChatDataIsLoading = useSelector(state => state.chatReducer.specificChatDataIsLoading)

  // select chat
  const [clickedChatCardData,setClickedChatCardData] = useState()
  const [updateGroupChatIconIsClicked,setUpdateGroupChatIconIsClicked] = useState(false)

  const [chatCardIsClicked,setChatCardIsClicked] = useState(false)

  const [isMobileSize, setIsMobileSize] = useState(false) 

  const [groupOnlineUsers, setGroupOnlineUsers] = useState([]) 

  const [lastSeen, setLastSeen] = useState("") 

  const messagesContainerRef = useRef() 


  const chatCardOnClickHandle = async (id, isGroupChat, groupAdmin, profilePic, name, users) => {

    if (window.matchMedia('(max-width: 768px)').matches) { 
      setIsMobileSize(!isMobileSize)
    }

    setSendMessageInputValue("") 

    setClickedChatCardData()

    setChatCardIsClicked(true) 

    setChatCardonClickId(id) 
    setChatCardActiveStatus(true) 

    dispatch(getSpecificChatAction({
      chatId: id,
      log: "ChatsPageHook"
    })).then( res => {
      if (res.payload.status === 200) {

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

      }
    })

    // get all chat messages
    await dispatch(getAllChatMessagesAction({
      chatId: id,
      log: "ChatsPageHook"
    })).then(async (res) => {
      if (res.payload.status === 200) {

        // grouped messages
        const groupedChatMessages = await groupChatMessages(res.payload.data, isGroupChat)
        setAllChatMessages(groupedChatMessages)

      }
    })

    socket.emit("wait")

  }

  // edit group chat or show info for single chat
  const chatUserInfoIconOnClickHandle = () => { 
    if (!clickedChatCardData) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 700,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'info',
        title: 'Select Chat'
      })
      return
    }

    if (clickedChatCardData?.isGroupChat) { 
      setOffCanvasGroupNameInputValue(clickedChatCardData?.name)

      setGroupChatSelectedUsers(clickedChatCardData?.users)
      setGroupChatSelectedUsersId(clickedChatCardData?.users?.map(item => item._id))

      const test = chatData?.filter(item => item._id === clickedChatCardData?._id)
      if (test.length) { 
        setUpdateGroupChatIconIsClicked(true)
      }

      groupChatOffCanvasHandleShow()
    } else if (!clickedChatCardData?.isGroupChat) {
      Swal.fire({
        title: `<h3>Email: <span class="text-primary fw-bold">${clickedChatCardData?.users.email}</span></h3>`,
        imageUrl: `${clickedChatCardData?.profilePic}`,
        imageHeight: 200,
        imageAlt: `${clickedChatCardData?.name}`,
        showCloseButton: true,
      })
    }
  }

  // rename group chat
  const renameGroupChatResponse = useSelector(state => state.chatReducer.renameGroupChatResponse)
  const renameGroupChatResponseIsLoading = useSelector(state => state.chatReducer.renameGroupChatResponseIsLoading)
  const addUserToGroupChatResponse = useSelector(state => state.chatReducer.addUserToGroupChatResponse)
  const addUserToGroupChatResponseIsLoading = useSelector(state => state.chatReducer.addUserToGroupChatResponseIsLoading)
  const removeUserFromGroupChatResponse = useSelector(state => state.chatReducer.removeUserFromGroupChatResponse)
  const removeUserFromGroupChatResponseIsLoading = useSelector(state => state.chatReducer.removeUserFromGroupChatResponseIsLoading)

  const updateGroupNameButtonOnClickHandle = async () => {
    if (clickedChatCardData?.groupAdmin !== JSON.parse(localStorage.getItem("userData"))._id) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'warning',
        title: 'Only Group Owner Can Do This'
      })
      return
    }

    await dispatch(renameGroupChatAction({ 
      data: {
        groupChatId: clickedChatCardData?._id, 
        newGroupChatName: offCanvasGroupNameInputValue
      },
      log: "ChatsPageHook"
    })).then(async (res) => {
      if (res.payload.status === 201) {
        setClickedChatCardData({
          _id: res.payload.data.data._id,
          isGroupChat: res.payload.data.data.isGroupChat,
          groupAdmin: res.payload.data.data.groupAdmin,
          profilePic: clickedChatCardData?.profilePic,
          name: res.payload.data.data.chatName,
          users: res.payload.data.data.users, 
        })
      }
    })
  }



  // ------------------------------------------------------------------------------------------------------
  // ---------------------------------------- chat messages -----------------------------------------------
  // ------------------------------------------------------------------------------------------------------

  const getAllChatMessagesData = useSelector(state => state.messageReducer.getAllChatMessagesData)
  const getAllChatMessagesDataIsLoading = useSelector(state => state.messageReducer.getAllChatMessagesDataIsLoading)

  const createMessageResponse = useSelector(state => state.messageReducer.createMessageResponse)
  const createMessageResponseIsLoading = useSelector(state => state.messageReducer.createMessageResponseIsLoading)

  const sendMessageInputRef = useRef()

  const [sendMessageInputValue, setSendMessageInputValue] = useState('')

  const [allChatMessages, setAllChatMessages] = useState([])

  const [hideNewMessageGroup, setHideNewMessageGroup] = useState(false)


  // user preview on single and group chat
  const messageCardImageOnClickHandle = (email, profilePic, name) => {
    Swal.fire({
      title: `<h3>Email: <span class="text-primary fw-bold">${email}</span></h3>`,
      imageUrl: `${profilePic}`,
      imageHeight: 200,
      imageAlt: `${name}`,
      showCloseButton: true,
    })
  }

  // send messages

  const [typingData, setTypingData] = useState({})

  const [timeoutId, setTimeoutId] = useState(null);

  const sendMessageInputOnChangeHandle = (e) => {

    setSendMessageInputValue(e.target.value)

    setHideNewMessageGroup(true)

    socket?.emit("chat-typing", true, clickedChatCardData?._id) 

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => { 
      socket?.emit("chat-typing", false, clickedChatCardData?._id)
    }, 500);

    setTimeoutId(newTimeoutId); 

  }

  const sendMessageOnClickHandle = async () => {
    if (!sendMessageInputValue) {
      return
    }
    setSendMessageInputValue("")

    const receiver = clickedChatCardData?.isGroupChat ?
    clickedChatCardData?.users.filter(item => item._id !== JSON.parse(localStorage.getItem("userData"))._id)
    : 
    clickedChatCardData?.users._id

    await dispatch(craeteMessageAction({
      data: {
        message: sendMessageInputValue,
        belongingChatId: clickedChatCardData?._id,
        receiver: receiver
      },
      log: "ChatsPageHook"
    })).then(async res => {
      if (res.payload.status === 201) {

        socket.emit("new-message", res.payload.data.data, res.payload.data.data.belongingChat, clickedChatCardData?.users, clickedChatCardData?.isGroupChat)

      }
    })
  }

  // enter key
  const sendMessageInputOnKeyDownHandle = (e) => {
    if (e.keyCode === 13) {
      sendMessageOnClickHandle()
    }
  }

  const groupChatMessages = async (chatMessages, isGroupChat) => {
    let date 

    return chatMessages.reduce((result, message) => { 

      const currentDateTime = moment()
      const messageDateTime = moment(message?.createdAt)

      const isSameDay = currentDateTime.isSame(messageDateTime, "day")
      const isMoreThanDay = currentDateTime.diff(messageDateTime, "days") 
      const isSameWeek = currentDateTime.isSame(messageDateTime, "week")
      const isMoreThanWeek = currentDateTime.diff(messageDateTime, "weeks")

      if (isSameDay) {
        date = messageDateTime.format("[Today]")
      } else if (isMoreThanDay === 1) {
        date = messageDateTime.format("[Yesterday]")
      } else if (isMoreThanDay > 1 && isMoreThanDay < 5) {
        date = messageDateTime.format("dddd")
      } else if(isMoreThanDay >= 5 && isSameWeek) {
        date = messageDateTime.format("[Last] dddd")
      } else if (isMoreThanWeek >= 1) {
        date = messageDateTime.format("MMM DD, YYYY")
      } 

      if (isGroupChat) {

        const isCurrentUserInMessageSeenBy = message.seenBy.some(item => item._id === JSON.parse(localStorage.getItem("userData"))._id)

        if (!isCurrentUserInMessageSeenBy && message.sender._id !== JSON.parse(localStorage.getItem("userData"))._id) {
          date = "New Message(s)"
        }

      } else { 

        if ((message.seenStatus === "stored" || message.seenStatus === "delivered") && message.sender._id !== JSON.parse(localStorage.getItem("userData"))._id) {
          date = "New Message(s)" 
        }
      }
      
      if (!result[date]) { 
        result[date] = [] 
      }

      result[date].push(message)


      return result 
    }, {})
  }





  // ------------------------------------------------------------------------------------------------------
  // ------------------------------------------ socket.io -------------------------------------------------
  // ------------------------------------------------------------------------------------------------------

  const [socket, setSocket] = useState(null)

  useEffect(() => { 
    const socket = io("127.0.0.1:8000", {
      query: {
        userId: JSON.parse(localStorage.getItem("userData"))._id,
        name: JSON.parse(localStorage.getItem("userData")).name,
        email: JSON.parse(localStorage.getItem("userData")).email,
        profilePic: JSON.parse(localStorage.getItem("userData")).profilePic,
      }
    })
    socket.on("connect", () => {
      setSocket(socket)
      socket?.on("online-users", (users) => {
        dispatch(onlineUsers(users))
      })
    })

    return () => {
      socket.disconnect() 
      socket?.off("online-users") 
    }
  }, [])

  useEffect(() => {

    if (socket === null) return

    socket?.on("received-new-message", async (message) => {
      setAllChatMessages(prev => {

        if (prev["New Message(s)"]) {
          prev["New Message(s)"].push(message)
          return prev
        }

        if (!prev["Today"]) {
          prev["Today"] = []
        }
        prev["Today"].push(message)

        return prev
      })

      setRenderComponent(prev => !prev)


    })

    socket?.on("chat-typing-broadcast", (data) => {
      setTypingData(data) 
    })

    socket?.on("new-online-user", (userFullData) => { 
      if (userFullData._id === JSON.parse(localStorage.getItem("userData"))._id) return

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'success',
        title: `<img style="max-height: 30px" src=${userFullData.profilePic} /> <span class="text-primary fs-5" style="cursor: pointer">${userFullData.name}</span> Is Online Now`
      })
    })

    socket?.on("new-offline-user", (userFullData) => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'error',
        title: `<img style="max-height: 30px" src=${userFullData.profilePic} /> <span class="text-primary fs-5">${userFullData.name}</span> Go Offline`
      })
    })

    socket?.on("last-seen", (lastSeenDate) => { 
      setLastSeen(moment(lastSeenDate).format("[Today at] HH:mm"))
    })

    socket?.on('room-online-users', (roomOnlineUsers) => {
      setGroupOnlineUsers(roomOnlineUsers.filter(user => user._id !== JSON.parse(localStorage.getItem("userData"))._id))
    })


    socket?.on('realtime-seen-messages', async (allChatMessages, isGroupChat) => {

      // grouped messages
      const groupedChatMessages = await groupChatMessages(allChatMessages, isGroupChat)

      setAllChatMessages(groupedChatMessages)
    })

    socket?.on("realtime-chat-data-latest-message-and-counter", (newChatDocument) => {
      setChatData(prev => {
        const updatedChat = prev.map(item => {
          if (item._id === newChatDocument._id) {
            return newChatDocument
          }
          return item
        })
        return updatedChat
      })
    })


    return () => { // cleanup function
      socket?.off("received-new-message")
      socket?.off("new-online-user")
      socket?.off("new-offline-user")
      socket?.off("chat-typing-broadcast")
      socket?.off("last-seen")
      socket?.off("room-online-users")
      socket?.off("realtime-seen-messages")
      socket?.off("realtime-chat-data-latest-message-and-counter")
    }

  }, [socket])



  const onlineUsersData = useSelector(state => state.userReducer.onlineUsersData)

  const [renderComponent, setRenderComponent] = useState(false)


  // reset chat data while press escape key 
  const handleKeyPress = (event) => {
    if (event.key === 'Escape') {
      setClickedChatCardData()
      setChatCardIsClicked(false)
      setChatCardonClickId("")
      setChatCardActiveStatus(false)
      setAllChatMessages([])
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);


  return [allUserChatsData, allUserChatsDataIsLoading, singleChatOffCanvasShow, singleChatOffCanvasHandleShow, singleChatOffCanvasHandleClose, usersData, usersDataIsLoading, offCanvasSreachInputValue, offCanvasInputOnChangeHandle, userCardOnClickHandle, createSingleChatResponse, createSingleChatResponseIsLoading, userCardonClickId, chatCardOnClickHandle, chatCardonClickId, chatCardRefs, chatCardActiveStatus, chatData, chatsContainerRef, endOfDataStatus, groupChatOffCanvasShow, groupChatOffCanvasHandleShow, groupChatOffCanvasHandleClose, offCanvasGroupNameInputValue, offCanvasGroupNameInputOnChangeHandle, offCanvasGroupNameInputRef, deleteUserIconOnClickHandle, offCanvasCreateGroupChatOnClickHandle, groupChatSearchResultsUserCardOnClickHandle, groupChatSelectedUsers, groupChatSelectedUsersId, createGroupChatResponse, createGroupChatResponseIsLoading, updatingDispatchLoader, clickedChatCardData, chatUserInfoIconOnClickHandle, updateGroupNameButtonOnClickHandle, renameGroupChatResponseIsLoading, updateGroupChatIconIsClicked, removeUserFromGroupChatResponseIsLoading, addUserToGroupChatResponseIsLoading, getAllChatMessagesData, getAllChatMessagesDataIsLoading, sendMessageInputValue, sendMessageInputOnChangeHandle, sendMessageInputRef, sendMessageInputOnKeyDownHandle, sendMessageOnClickHandle, messageCardImageOnClickHandle, messagesContainerRef, allChatMessages, chatCardIsClicked, typingData, onlineUsersData, isMobileSize, setIsMobileSize, groupOnlineUsers, lastSeen, hideNewMessageGroup, socket, specificChatDataIsLoading, setChatData, setChatCardIsClicked, setChatCardonClickId, setChatCardActiveStatus, setClickedChatCardData, groupChatMessages, setAllChatMessages, createMessageResponseIsLoading]
}

export default ChatsPageHook