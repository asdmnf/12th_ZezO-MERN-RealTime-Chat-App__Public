import './MessageDateGroupCard.css'

const MessageDateGroupCard = (props) => {
  return (
    <div className={`messages-date-group shadow ${props.hideNewMessageGroup && props.children.includes("New Message(s)") ? "d-none" : ""}`} style={props.children.includes("New Message(s)") ? {backgroundColor: "#198754"} : {}}>
      {props.children}
    </div>
  )
}

export default MessageDateGroupCard