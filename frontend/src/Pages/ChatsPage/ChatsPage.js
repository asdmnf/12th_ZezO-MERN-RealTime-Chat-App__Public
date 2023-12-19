import "./ChatsPage.css";
import ChatContainer from "../../Components/ChatPage/ChatContainer/ChatContainer";
import Header from "../../Components/ChatPage/Header/Header";
import ChatsPageHook from "../../Hooks/ChatsPageHook";
import UserCard from "../../Components/Utils/UserCard/UserCard";
import UserCardPlaceholder from "../../Components/Utils/UserCard/UserCardPlaceholder";
import SideOffCanvas from "../../Components/Utils/SideOffCanvas/SideOffCanvas";
import MessageCard from "../../Components/Utils/MessageCard/MessageCard";
import MessageCardPlaceholder from "../../Components/Utils/MessageCard/MessageCardPlaceholder";
import ScrollableFeed from 'react-scrollable-feed'
import moment from 'moment';
import MessageDateGroupCard from "../../Components/Utils/MessageDateGroupCard/MessageDateGroupCard";
import ChatContainerHeaderPlaceholder from "../../Components/ChatPage/ChatContainer/ChatContainerHeaderPlaceholder";

const ChatsPage = () => {

  const [allUserChatsData, allUserChatsDataIsLoading, singleChatOffCanvasShow, singleChatOffCanvasHandleShow, singleChatOffCanvasHandleClose, usersData, usersDataIsLoading, offCanvasSreachInputValue, offCanvasInputOnChangeHandle, userCardOnClickHandle, createSingleChatResponse, createSingleChatResponseIsLoading, userCardonClickId, chatCardOnClickHandle, chatCardonClickId, chatCardRefs, chatCardActiveStatus, chatData, chatsContainerRef, endOfDataStatus, groupChatOffCanvasShow, groupChatOffCanvasHandleShow, groupChatOffCanvasHandleClose, offCanvasGroupNameInputValue, offCanvasGroupNameInputOnChangeHandle, offCanvasGroupNameInputRef, deleteUserIconOnClickHandle, offCanvasCreateGroupChatOnClickHandle, groupChatSearchResultsUserCardOnClickHandle, groupChatSelectedUsers, groupChatSelectedUsersId, createGroupChatResponse, createGroupChatResponseIsLoading, updatingDispatchLoader, clickedChatCardData, chatUserInfoIconOnClickHandle, updateGroupNameButtonOnClickHandle, renameGroupChatResponseIsLoading, updateGroupChatIconIsClicked, removeUserFromGroupChatResponseIsLoading, addUserToGroupChatResponseIsLoading, getAllChatMessagesData, getAllChatMessagesDataIsLoading, sendMessageInputValue, sendMessageInputOnChangeHandle, sendMessageInputRef, sendMessageInputOnKeyDownHandle, sendMessageOnClickHandle, messageCardImageOnClickHandle, messagesContainerRef, allChatMessages, chatCardIsClicked, typingData, onlineUsersData, isMobileSize, setIsMobileSize, groupOnlineUsers, lastSeen, hideNewMessageGroup, socket, specificChatDataIsLoading, setChatData, setChatCardIsClicked, setChatCardonClickId, setChatCardActiveStatus, setClickedChatCardData, groupChatMessages, setAllChatMessages, createMessageResponseIsLoading] = ChatsPageHook()

  return (
    <div className="chats-page">
      {/* header */}
      <Header
        socket={socket}
        chatData={chatData}
        setChatData={setChatData}
        chatCardRefs={chatCardRefs}
        setChatCardIsClicked={setChatCardIsClicked}
        setChatCardonClickId={setChatCardonClickId}
        setChatCardActiveStatus={setChatCardActiveStatus}
        setClickedChatCardData={setClickedChatCardData}
        groupChatMessages={groupChatMessages}
        setAllChatMessages={setAllChatMessages}
      ></Header>

      {/* body */}
      <div className="chats-page_body row">
        <div className={`chats-page_body-left col-md-6 col-lg-5 col-xl-4 ${isMobileSize === true ? "d-none" : ""}`}>
          <ChatContainer
            title="Chats"
            icons={
              <div className="55">
                <i className="fa-solid fa-people-group" title="Group Chat" onClick={groupChatOffCanvasHandleShow}></i>
                <i className="fa-solid fa-user-plus" title="Single Chat" onClick={singleChatOffCanvasHandleShow}></i>
              </div>
          }
          containerRef={chatsContainerRef}
            content={
              (allUserChatsDataIsLoading && !chatData.length) || updatingDispatchLoader ? ( 
                <div className="55">
                  <UserCardPlaceholder></UserCardPlaceholder>
                  <UserCardPlaceholder></UserCardPlaceholder>
                  <UserCardPlaceholder></UserCardPlaceholder>
                  <UserCardPlaceholder></UserCardPlaceholder>
                  <UserCardPlaceholder></UserCardPlaceholder>
                  <UserCardPlaceholder></UserCardPlaceholder>
                  <UserCardPlaceholder></UserCardPlaceholder>
                </div>
              ) : (
                chatData?.length ? 
                  <> 
                {
                  chatData?.map((item, index) => {
                    return (
                      <UserCard
                        key={item._id}
                        name={item.isGroupChat ? item.chatName : (item.users[0]._id === JSON.parse(localStorage.getItem("userData"))._id ? item.users[1].name : item.users[0].name )}
                        content={
                          <span className={`${chatCardonClickId === item._id ? "" : ""} ${item.latestMessage?.message ? "" : "invisible"}`}>
                            <span className={`${item.latestMessage?.sender._id === JSON.parse(localStorage.getItem("userData"))._id ? "" : "d-none"} `}>
                              <span className={`fa-solid fa-check me-1 text-secondary ${item.latestMessage?.seenStatus === "delivered" || item.latestMessage?.seenStatus === "seen" ? "d-none" : ""}`}>
                              </span> 
                              <span className={`fa-solid fa-check-double me-1 ${item.latestMessage?.seenStatus === "delivered" || item.latestMessage?.seenStatus === "seen" ? "" : "d-none"} ${item.latestMessage?.seenStatus === "seen" ? "text-primary" : "text-secondary"}`} title={item.latestMessage?.seenBy?.map(item => item.name)}>
                              </span>
                            </span>
                            <span className={`text-primary me-1 ${item.isGroupChat ? "" : "d-none"}`}>
                              {item.latestMessage?.sender._id === JSON.parse(localStorage.getItem("userData"))._id ? "you" : item.latestMessage?.sender.name}:
                            </span>
                            {item.latestMessage?.message.length <= 20 ? item.latestMessage?.message : `${item.latestMessage?.message.slice(0, 20)}...`}
                          </span>
                          }
                        profilePic={item.isGroupChat ? "https://uploads-ssl.webflow.com/628e4f5e9ef1f537daf6c9e2/6294a420b645545b1c6a3be1_Vector.png" : (item.users[0]._id === JSON.parse(localStorage.getItem("userData"))._id ? item.users[1].profilePic : item.users[0].profilePic )}
                        userCardOnClickHandle={() => {chatCardOnClickHandle(item._id, item.isGroupChat, item.groupAdmin, item.isGroupChat ? "https://uploads-ssl.webflow.com/628e4f5e9ef1f537daf6c9e2/6294a420b645545b1c6a3be1_Vector.png" : (item.users[0]._id === JSON.parse(localStorage.getItem("userData"))._id ? item.users[1].profilePic : item.users[0].profilePic ), item.isGroupChat ? item.chatName : (item.users[0]._id === JSON.parse(localStorage.getItem("userData"))._id ? item.users[1].name : item.users[0].name ), item.isGroupChat ? item.users : (item.users[0]._id === JSON.parse(localStorage.getItem("userData"))._id ? item.users[1] : item.users[0]))}}
                        cardRefs={chatCardRefs} 
                        index={index}
                        id={item._id}
                        onClickId={chatCardonClickId}
                        isActive={chatCardActiveStatus} 
                        enableGroupChatBadge={item.isGroupChat ? true : false} 
                        onClickLoading={getAllChatMessagesDataIsLoading || specificChatDataIsLoading} 
                        // -------online indicator--------
                        onlineUsersData={onlineUsersData} 
                        singleChatUserId={item.isGroupChat ? "" : (item.users[0]._id === JSON.parse(localStorage.getItem("userData"))._id ? item.users[1]._id : item.users[0]._id)}
                        isGroupChat={item.isGroupChat}
                        // -------online indicator--------
                        newMessagesCounter={item.newMessagesCounter}
                      ></UserCard>
                    )
                  })
                }
                {
                  allUserChatsDataIsLoading ? 
                    <div className="55">
                      <UserCardPlaceholder></UserCardPlaceholder>
                      <UserCardPlaceholder></UserCardPlaceholder>
                      <UserCardPlaceholder></UserCardPlaceholder>
                      <UserCardPlaceholder></UserCardPlaceholder>
                      <UserCardPlaceholder></UserCardPlaceholder>
                      <UserCardPlaceholder></UserCardPlaceholder>
                      <UserCardPlaceholder></UserCardPlaceholder>
                    </div> 
                  : 
                  endOfDataStatus ? 
                  <span className="fa-solid fa-lock text-primary mt-5 opacity-50 shadow-none d-flex justify-content-center"></span> 
                    : ''  
                }
                  </>
                  : 
                  <span className="fa-solid fa-user-plus text-primary d-flex flex-column justify-content-center align-items-center h-100 user-select-none shadow-none fs-1 opacity-50" onClick={singleChatOffCanvasHandleShow}>
                    <span className="fs-6 mt-2 ">Select Friends To Start Chat</span>
                  </span>
              )
            }
          ></ChatContainer>

        </div>
        <div className={`chats-page_body-right col-md-6 col-lg-7 col-xl-8 ${isMobileSize === true ? "d-block" : ""}`}>
          <ChatContainer
            title= {
              <div className="d-flex flex-column">
                {
                  specificChatDataIsLoading ? 
                    <ChatContainerHeaderPlaceholder></ChatContainerHeaderPlaceholder>
                  : 
                    <span>{clickedChatCardData?.name || "Chat Preview"}</span>
                }
                {
                  typingData?.isTyping && clickedChatCardData?.isGroupChat ? 
                    <span className={`chat-typing-indicator`}>{typingData?.name} is typing ...</span>
                  : clickedChatCardData?.isGroupChat && chatCardIsClicked ? 
                    <span className={`chat-typing-indicator`}>
                      {groupOnlineUsers?.length === 0 ? "No Active Users Now" : groupOnlineUsers?.length === 1 ? "1 Active User" : `${groupOnlineUsers?.length} Active Users`}
                      <div className="chat-active-users-info">
                        {
                          groupOnlineUsers?.map(item => {
                            return (
                              <img key={item._id} src={item.profilePic} alt="" onClick={() => {
                                messageCardImageOnClickHandle(item.email, item.profilePic, item.name)
                              }} />
                            )
                          })
                        }
                      </div>
                    </span>
                    : null
                }

                {
                  typingData?.isTyping && !clickedChatCardData?.isGroupChat ? 
                    <span className={`chat-typing-indicator`}> typing ...</span>
                  : onlineUsersData?.includes(clickedChatCardData?.users._id) && !clickedChatCardData?.isGroupChat ?
                      <span className={`chat-typing-indicator`}>Online</span> : null
                }
                <span className={`chat-typing-indicator ${!onlineUsersData?.includes(clickedChatCardData?.users._id) && !clickedChatCardData?.isGroupChat && chatCardIsClicked ? "" : "d-none"} ${specificChatDataIsLoading ? "d-none" : ""}`}><span className="last-seen-span">Last Seen:</span> {lastSeen}</span>
              </div>}
            chatImage={clickedChatCardData?.profilePic}
            backIcon={
              <i className="fa-solid fa-arrow-left ms-0 me-3" onClick={() => {
                setIsMobileSize(!isMobileSize)
                }}>
              </i>
            }
            icons={<i className="fa-solid fa-circle-info" onClick={chatUserInfoIconOnClickHandle}></i>}
            containerRef={messagesContainerRef} 
            // react-scrollable-feed
            content={
              <>
                {
                  getAllChatMessagesDataIsLoading ? 
                    <div className="55">
                      <MessageCardPlaceholder></MessageCardPlaceholder>
                      <MessageCardPlaceholder isChatOwner={true}></MessageCardPlaceholder>
                      <MessageCardPlaceholder isChatOwner={true}></MessageCardPlaceholder>
                      <MessageCardPlaceholder></MessageCardPlaceholder>
                    </div>
                  :
                  Object.entries(allChatMessages)?.length ? 

                    <ScrollableFeed>
                      {Object.entries(allChatMessages)?.map(([key, value], index, obj) => {
                        return (
                          <div key={key}>
                            <MessageDateGroupCard
                            hideNewMessageGroup={hideNewMessageGroup}
                            >
                            {key.includes("New Message(s)") ? `${value.length} ` : ""}{key}
                            </MessageDateGroupCard>
                            {
                              value.map((item, i, arr) => {
                                return <MessageCard
                              key={item._id}
                              profilPic={item.sender.profilePic}
                              name={item.sender.name}
                              message={item.message}
                              seenStatus={item.seenStatus}
                              seenBy={item.seenBy}
                              createdAt={moment(item.createdAt).format("HH:mm")}
                              isChatOwner={item.sender._id === JSON.parse(localStorage.getItem("userData"))._id ? true : false}
                              messageCardImageOnClickHandle={() => messageCardImageOnClickHandle(item.sender.email, item.sender.profilePic, item.sender.name)} 
                              sameSender={i === 0 ? false : item.sender._id === arr[i - 1]?.sender._id} 
                              // -------online indicator--------
                              onlineUsersData={onlineUsersData}
                              id={item.sender._id}
                              // -------online indicator--------

                              // -------is last item--------
                              isLastItem={(index === obj.length - 1) && (i === arr.length - 1) ? true : false}
                              // -------is last item--------
                              
                              // -------seenByUserImageOnClickHandle--------
                              seenByUserImageOnClickHandle={messageCardImageOnClickHandle}
                              // -------seenByUserImageOnClickHandle--------
                            ></MessageCard>
                              })
                            }

                            <span className={`send-message_spinner spinner-border ${createMessageResponseIsLoading && (index === obj.length - 1) ? "" : "invisible"}`}></span>
                          </div>
                        )
                      })}
                      </ScrollableFeed>

                    : 
                      !Object.entries(allChatMessages)?.length && chatCardIsClicked ?
                        <span className="fa-solid fa-feather d-flex flex-column justify-content-center align-items-center h-100 text-primary opacity-50 user-select-none fs-1" onClick={() => {sendMessageInputRef.current.focus()}}>
                          <span className="mt-2 fs-4">Start Chat</span>
                        </span>
                        : 
                          <span className="fa-solid fa-comments d-flex flex-column justify-content-center align-items-center h-100 text-primary opacity-50 user-select-none fs-1">
                            <span className="mt-2 fs-4">Select Chat</span>
                          </span>
                }

                <div className={`chats-page_send-message-input d-flex justtify-content-center align-items-center ${Object.entries(allChatMessages)?.length || (!Object.entries(allChatMessages)?.length && chatCardIsClicked) ? "" : "d-none"}`}> 
                  <input className="shadow" type="text" placeholder="Type a Message" value={sendMessageInputValue} onChange={sendMessageInputOnChangeHandle} onKeyDown={sendMessageInputOnKeyDownHandle} ref={sendMessageInputRef} />
                  <button className="fa-solid fa-paper-plane" onClick={sendMessageOnClickHandle} ></button>
                </div>
              </>
              
            }
          ></ChatContainer>
        </div>
      </div>

      {/* single chat canvas */}
      <SideOffCanvas
        show={singleChatOffCanvasShow}
        handleClose={singleChatOffCanvasHandleClose}
        title="Single Chat"
        offCanvasSreachInputValue={offCanvasSreachInputValue}
        offCanvasInputOnChangeHandle={offCanvasInputOnChangeHandle}
        usersData={usersData}
        usersDataIsLoading={usersDataIsLoading}
        userCardOnClickHandle={userCardOnClickHandle} 
        onClickLoading={createSingleChatResponseIsLoading} 
        onClickId={userCardonClickId} 
        // -------online indicator--------
        onlineUsersData={onlineUsersData} 
        // -------online indicator--------
      ></SideOffCanvas>

      {/* group chat canvas */}
      <SideOffCanvas
        show={groupChatOffCanvasShow}
        handleClose={groupChatOffCanvasHandleClose}
        title="Group Chat"
        isGroupChat={true}
        deleteUserIconOnClickHandle={deleteUserIconOnClickHandle}
        offCanvasGroupNameInputValue={offCanvasGroupNameInputValue}
        offCanvasGroupNameInputOnChangeHandle={offCanvasGroupNameInputOnChangeHandle}
        offCanvasGroupNameInputRef={offCanvasGroupNameInputRef}
        offCanvasCreateGroupChatOnClickHandle={offCanvasCreateGroupChatOnClickHandle}
        offCanvasSreachInputValue={offCanvasSreachInputValue}
        offCanvasInputOnChangeHandle={offCanvasInputOnChangeHandle}
        usersData={usersData}
        usersDataIsLoading={usersDataIsLoading}
        userCardOnClickHandle={groupChatSearchResultsUserCardOnClickHandle}
        groupChatSelectedUsers={groupChatSelectedUsers} 
        groupChatSelectedUsersId={groupChatSelectedUsersId} 
        createGroupChatResponseIsLoading={createGroupChatResponseIsLoading} 
        updateGroupChatIconIsClicked={updateGroupChatIconIsClicked} 
        currentGroupChatNameInputValue={clickedChatCardData?.name} 
        updateGroupNameButtonOnClickHandle={updateGroupNameButtonOnClickHandle}
        renameGroupChatResponseIsLoading={renameGroupChatResponseIsLoading}
        onClickId={userCardonClickId}
        onClickLoading={removeUserFromGroupChatResponseIsLoading || addUserToGroupChatResponseIsLoading}
        groupAdmin={clickedChatCardData?.groupAdmin} 
        // -------online indicator--------
        onlineUsersData={onlineUsersData}
        // -------online indicator--------
      >
      </SideOffCanvas>
    </div>
  );
};

export default ChatsPage;
