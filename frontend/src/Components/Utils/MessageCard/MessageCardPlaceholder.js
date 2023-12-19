import './MessageCardPlaceholder.css'

const MessageCardPlaceholder = (props) => {
  return (
    <div className={`message-card_placeholder d-flex align-items-center gap-2 my-3 ${props.isChatOwner ? "justify-content-end" : ""}`}>
      <span className={`message-card_placeholder-img-simulation ${props.isChatOwner ? "d-none" : ""} `}></span>
      <div className={`message-card_card-placeholder card py-2 px-3 fw-bold text-primary shadow-sm ${props.isChatOwner ? "message-card_placeholder_chat-owner" : ""}`} ></div>
    </div>
  )
}

export default MessageCardPlaceholder