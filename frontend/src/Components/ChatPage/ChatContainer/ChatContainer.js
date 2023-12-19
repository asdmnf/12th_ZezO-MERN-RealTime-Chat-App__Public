import './ChatContainer.css'

const ChatContainer = (props) => {
  return (
    <div className="chat-container shadow">
      <div className='chat-container_header d-flex justify-content-between align-items-center'>
        <div className="d-flex align-items-center">
          <div className="chat-container_header-back-icon">
          {props.backIcon}
          </div>
          <div className="chat-container_header-chat-image">
            <img src={props.chatImage} alt="" />
          </div>
          <div className="chat-container_header-title">
            {props.title}
          </div>
        </div>
        <div className="chat-container_header-icon">
          {props.icons}
        </div>
      </div>
      <div className="chat-container_content" ref={props.containerRef}> 
        {props.content}
      </div>
    </div>
  )
}

export default ChatContainer