import './MessageCard.css'

const MessageCard = (props) => {
  return (
    <div className={`message-card d-flex align-items-center gap-2  ${props.isChatOwner ? "justify-content-end" : ""} ${!props.sameSender ? "mt-4" : ""}`}>
      <div className="message-card_image">
        <img className={`${props.isChatOwner ? "d-none" : ""} ${props.sameSender ? "invisible" : ""}`} src={props.profilPic} alt={props.name} title={props.name} onClick={props.messageCardImageOnClickHandle} />
        <span className={`message-card_online-indicator shadow-sm ${props.sameSender || props.isChatOwner ? "d-none" : ""}`} style={{backgroundColor: `${props.onlineUsersData?.includes(props.id) ? "#198754" : "#6c757d"}`}}></span>
      </div>
      <div className={`message-card_card card py-2 px-3 fw-bold text-primary shadow-sm ${props.isChatOwner ? "message-card_chat-owner" : ""} ${props.sameSender ? "message-card_same-sender" : ""}`} >
        <span className="message-card_message">{props.message} </span>
        <div className="message-card_info d-flex justify-content-end">
          <span className='message-card_time'>{props.createdAt}</span>
          <div className={`message-card_seen ${!props.isChatOwner ? "d-none" : ""}`}>
            <span className={`fa-solid fa-check ${props.seenStatus === "delivered" || props.seenStatus === "seen" ? "d-none" : ""}`}></span> 
            <span className={`fa-solid fa-check-double ${props.seenStatus === "delivered" || props.seenStatus === "seen" ? "" : "d-none"} ${props.seenStatus === "seen" ? "text-primary" : ""}`} title={props.seenBy?.map(item => item.name)}></span>
          </div>
        </div>
      </div>
      <div className={`message-card_seen-by ${props.isChatOwner && props.isLastItem ? "" : "d-none"}`}>
        {
          props.seenBy?.map(item => {
            return <img key={item._id} className='shadow-sm' src={item.profilePic} alt="" title={item.name} onClick={() => {
              props.seenByUserImageOnClickHandle(item.email, item.profilePic, item.name)
            }} />
          })
        }
      </div>
    </div>
  )
}

export default MessageCard