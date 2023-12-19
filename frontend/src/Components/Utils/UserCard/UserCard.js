import "./UserCard.css";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const UserCard = (props) => {
  return (
    <div
      className={`user-card card p-2 my-2 ${
        props.onClickLoading && props.onClickId === props.id
          ? "user-card_onclick-loading-effect"
          : ""
      } ${props.isActive && props.onClickId === props.id ? "active" : ""} ${
        props.groupChatSelectedUsersId?.includes(props.id) ||
        (props.isNotificationCard && props.isSeen)
          ? "active-but-notAllowed-effect"
          : ""
      }`}
      onClick={props.userCardOnClickHandle}
      style={{
        pointerEvents: `${props.onClickLoading ? "none" : "all"}`,
        backgroundColor: `${
          props.isNotificationCard && props.isSeen ? "#d2e3fc66" : ""
        }`,
      }}
      ref={props.cardRefs ? (el) => (props.cardRefs[props.index] = el) : null}
    >
      <div
        className={`new-messages-counter_notification-badge ${
          props.onClickId === props.id ? "d-none" : ""
        }`}
        style={props.isGroupChat ? { top: "12px", right: "66px" } : {}}
      >
        <NotificationBadge
          style={{ backgroundColor: "#198754" }}
          count={
            props.newMessagesCounter?.filter((item) =>
              item.receiver.includes(
                JSON.parse(localStorage.getItem("userData"))._id
              )
            ).length
          }
          effect={Effect.ROTATE_X}
        ></NotificationBadge>
      </div>
      <div
        className={`user-card_onclick-loading-spinner ${
          props.onClickLoading && props.onClickId === props.id
            ? "d-block"
            : "d-none"
        }`}
        style={
          props.enableGroupChatBadge
            ? { top: "33px", right: "22px" }
            : props.isNotificationCard
            ? { top: "35px", right: "7px" }
            : null
        }
      >
        <span
          className="spinner-border text-primary"
          style={
            props.enableGroupChatBadge
              ? { width: "25px", height: "25px" }
              : props.isNotificationCard
              ? { width: "20px", height: "20px" }
              : null
          }
        ></span>
      </div>
      <div
        className={`user-card_delete-icon ${
          props.showDeleteUserIcon ? "" : "d-none"
        } ${
          props.onClickLoading && props.onClickId === props.id ? "d-none" : ""
        }`}
        onClick={props.deleteUserIconOnClickHandle}
      >
        <i className="fa-solid fa-user-xmark shadow"></i>
      </div>
      <div
        className={`user-card_seen-icon ${
          props.isNotificationCard && props.isSeen ? "" : "d-none"
        }`}
      >
        <i className="fa-solid fa-circle-check"></i>
      </div>
      <div
        className={`user-card_notification-card-delete-icon d-flex ${
          props.isNotificationCard ? "" : "d-none"
        }`}
        title="delete"
        onClick={(e) => {
          props.deleteNotificationIconOnClickHandle(e, props.id);
        }}
      >
        <i className="fa-regular fa-circle-xmark text-danger"></i>
      </div>
      <div
        className={`user-card_group-badge ${
          props.enableGroupChatBadge ||
          (props.isNotificationCard && props.isGroupMessageNotification)
            ? ""
            : "d-none"
        }`}
        style={
          props.isNotificationCard && props.isGroupMessageNotification
            ? { top: "60px", left: "5px" }
            : {}
        }
      >
        <span className="badge bg-primary">Group</span>
      </div>
      <div
        className={`d-flex ${
          props.isNotificationCard ? "" : "align-items-center"
        }`}
      >
        <span
          className={`user-card_online-indicator shadow-sm ${
            props.isGroupChat ||
            JSON.parse(localStorage.getItem("userData"))._id === props.id ||
            props.isNotificationCard
              ? "d-none"
              : ""
          }`}
          style={{
            backgroundColor: `${
              props.onlineUsersData?.includes(
                props.singleChatUserId || props.id
              )
                ? "#198754"
                : "#6c757d"
            }`,
          }}
        ></span>
        <img
          className={`${props.isNotificationCard ? "d-none" : ""}`}
          src={props.profilePic}
          alt=""
        />
        <div
          className={`user-card_notification-icon ${
            props.isNotificationCard ? "" : "d-none"
          }`}
        >
          <i
            className={`fa-brands fa-facebook-messenger text-success m-auto`}
          ></i>
        </div>
        <div
          className={`user-card_info d-flex flex-column ms-2 ${
            props.isNotificationCard ? "w-100" : ""
          }`}
        >
          <span className="fw-bold text-primary">{props.name}</span>
          <span className="user-card_content">
            {`${props.content}`.length <= 30 ? (
              props.content
            ) : (
              <span>
                <span
                  className={`${
                    props.collapseNotificationIconIsClicked &&
                    props.collapseNotificationIconClickedId === props.id
                      ? "d-none"
                      : ""
                  }`}
                >
                  {props.content.slice(0, 31)}...
                  <i
                    className="fa-solid fa-sort-down"
                    onClick={(e) => {
                      props.collapseNotificationIconOnClickHandle(e, props.id);
                    }}
                  ></i>
                </span>
                <span>
                  <div
                    className={`${
                      props.collapseNotificationIconIsClicked &&
                      props.collapseNotificationIconClickedId === props.id
                        ? ""
                        : "d-none"
                    }`}
                  >
                    {props.content}
                  </div>
                </span>
              </span>
            )}
          </span>
        </div>
      </div>
      <div
        className={`user-card_group-admin ${
          props.groupAdmin === props.id ? "" : "d-none"
        }`}
        title="Group Admin"
      >
        <i
          className="fa-solid fa-crown shadow"
          style={
            props.groupAdmin === props.id &&
            JSON.parse(localStorage.getItem("userData"))._id === props.id
              ? { right: "102px" }
              : {}
          }
        ></i>
      </div>
      <div
        className={`user-card_group-admin ${
          JSON.parse(localStorage.getItem("userData"))._id === props.id
            ? ""
            : "d-none"
        }`}
        title="OMG! It's You"
      >
        <i className="fa-solid fa-user-secret shadow"></i>
      </div>
      <div
        className={`user-card_notification-date-and-time d-flex justify-content-end fw-bold text-secondary ${
          props.isNotificationCard ? "" : "d-none"
        }`}
      >
        {props.notificationDateAndTime}
      </div>
    </div>
  );
};

export default UserCard;
