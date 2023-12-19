import './ChatContainerHeaderPlaceholder.css'

const ChatContainerHeaderPlaceholder = () => {
  return (
    <div className='chat-container-header-placeholder'>
      <div className="row align-items-center">
        <span className="chat-container-header-placeholder_img-simulation col-3 text-bg-primary"></span>
        <div className="d-flex flex-column gap-1 col-9">
          <span className='chat-container-header-placeholder_name text-primary'></span>
          <span className='chat-container-header-placeholder_status text-primary'></span>
        </div>
      </div>
    </div>
  )
}

export default ChatContainerHeaderPlaceholder