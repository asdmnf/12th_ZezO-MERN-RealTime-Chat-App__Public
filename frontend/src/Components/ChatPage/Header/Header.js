import './Header.css'
import HeaderHook from '../../../Hooks/HeaderHook';
import SideOffCanvas from '../../Utils/SideOffCanvas/SideOffCanvas';
import { Link } from "react-router-dom"; 
import UserCard from '../../Utils/UserCard/UserCard';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';

const Header = (props) => {

  const [userName, userProfilePic, profileOnClickHandle, logOutOnClickHandle, show, OffCanvasHandleShow, OffCanvasHandleClose, offCanvasSreachInputValue, offCanvasInputOnChangeHandle, usersData, usersDataIsLoading, userCardOnClickHandle, allNotifications, momemtDateAndTime, notificationCardOnClickHandle, deleteNotificationIconOnClickHandle, collapseNotificationIconOnClickHandle, clearNotificationsIconOnClickHandle, deleteAllLoggedUserNotificationsResponseIsLoading, deleteSpecificNotificationResponseIsLoading, notificationCardClickedId, collapseNotificationIconIsClicked, collapseNotificationIconClickedId] = HeaderHook(props.socket, props.chatData, props.setChatData, props.chatCardRefs, props.setChatCardIsClicked, props.setChatCardonClickId, props.setChatCardActiveStatus, props.setClickedChatCardData, props.groupChatMessages, props.setAllChatMessages)

  return (
    <div className="chats-page_header shadow-lg">
      <div className="chats-page_header-inner d-flex flex-column flex-sm-row justify-content-between align-items-center">

        {/* add friends */}
        <div
          className="chats-page_header-inner-search"

          onClick={OffCanvasHandleShow}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          Add Friends
        </div>

        {/* logo */}
        <div className="chats-page_header-inner-logo">ZezO Chat App!</div>

        {/* notification and profile */}
        <div className="d-flex justify-content-center align-items-center">
          <div className="chats-page_header-inner-notification">

          {/* notification dropdown */}
          <div className="dropdown dropdown-menu-end">
              <div className="notification-dropdown_count-badge">
                <NotificationBadge count={allNotifications?.filter(item => item.isSeen === false).length} effect={Effect.SCALE}/>
              </div>
              <i
                className="fa-solid fa-bell"
                data-bs-toggle="dropdown"
              >
              </i>
              <ul className="dropdown-menu notification-dropdown_menu shadow mt-1">
                <div className={`notification-dropdown_clear-all-notification-icon d-flex justify-content-end ${allNotifications.length ? "" : "d-none"}`} title='clear all notifications' onClick={clearNotificationsIconOnClickHandle}>
                  <span className={`spinner-border text-primary me-1 ${deleteAllLoggedUserNotificationsResponseIsLoading ? "" : "d-none"}`} style={{"width" : "16px", "height": "16px"}}></span>
                  <i className="fa-solid fa-trash text-danger fs-6"></i>
                </div>
                {
                  allNotifications.length ? 
                    allNotifications?.map(item => {
                      return (
                        <UserCard
                          key={item._id}
                          id={item._id}
                          name={<span className='text-secondary'>
                                    New Message{" "}
                                    {
                                      item.belongingChat?.isGroupChat ?
                                        <span className='text-primary'>
                                          @{item.belongingChat.chatName}{" "}
                                        </span>
                                      :
                                      "" 
                                    }
                                    From{" "} 
                                  <span className='text-primary'>
                                    {item.fromUser.name}
                                  </span>
                                </span>}
                          content={item.messageContent}
                          updatedAt={item.updatedAt}
                          isSeen={item.isSeen}
                          isGroupMessageNotification={item.belongingChat?.isGroupChat}
                          isNotificationCard={true}
                          notificationDateAndTime={momemtDateAndTime(item.updatedAt)}
                          userCardOnClickHandle={() => notificationCardOnClickHandle(item.belongingChat._id, item._id, item.isSeen)}
                          deleteNotificationIconOnClickHandle={deleteNotificationIconOnClickHandle}
                          collapseNotificationIconOnClickHandle={collapseNotificationIconOnClickHandle}
                          onClickLoading={deleteSpecificNotificationResponseIsLoading}
                          onClickId={notificationCardClickedId}
                          // ------------------ collapse ------------
                          collapseNotificationIconIsClicked={collapseNotificationIconIsClicked}
                          collapseNotificationIconClickedId={collapseNotificationIconClickedId}
                          // ------------------ collapse ------------
                        >
                        </UserCard>
                      )
                    })
                  : 
                  !allNotifications.length ?
                  <span className="notification-dropdown_no-notification-icon">
                    <i className="fa-regular fa-bell-slash text-primary my-5 fs-1 opacity-50 shadow-none user-select-none d-flex flex-column justify-content-center text-center">
                      <span className="fs-5 fw-bold mt-2">No Notifications</span>
                    </i>
                  </span>
                  
                    : null
                }

              

              </ul>
            </div>

          </div>
          <div className="chats-page_header-inner-profile">
            {/* profile dropdown */}
            <div className="dropdown">
              <button
                type="button"
                className="btn btn-primary dropdown-toggle fw-bold"
                data-bs-toggle="dropdown"
              >
                <img
                  src={userProfilePic}
                  alt={userName}
                  className="chats-page_header-inner-profile-img"
                />
                {userName}
              </button>
              <ul className="dropdown-menu shadow">
                <li onClick={profileOnClickHandle}>
                  <Link className="dropdown-item">
                    Profile
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider"></hr>
                </li>
                <li onClick={logOutOnClickHandle}>
                  <Link className="dropdown-item">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>


      {/* add friends modal */}
      <SideOffCanvas
        show={show}
        handleClose={OffCanvasHandleClose}
        title="Find Friends"
        offCanvasSreachInputValue={offCanvasSreachInputValue}
        offCanvasInputOnChangeHandle={offCanvasInputOnChangeHandle}
        usersData={usersData}
        usersDataIsLoading={usersDataIsLoading}
        userCardOnClickHandle={userCardOnClickHandle}
      ></SideOffCanvas>

    </div>
  );
}

export default Header