import './SideOffCanvas.css'
import { useRef } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import UserCard from '../UserCard/UserCard';
import UserCardPlaceholder from '../UserCard/UserCardPlaceholder';
import { useDispatch } from 'react-redux';
import { resetUserData } from '../../../ReduxToolkit/Slices/userSlice';


const SideOffCanvas = (props) => {

  const dispatch = useDispatch()

  const searchInputRef = useRef()

  return (
    <div className='sideOffCanvas'>
      <Offcanvas show={props.show} onHide={props.handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='text-primary fw-bold fs-3'>{props.title}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={`sideOffCanvas_group-input ${props.isGroupChat ? '' : 'd-none'} d-flex align-items-center`}>
            <input type="text" placeholder='Group Name' value={props.offCanvasGroupNameInputValue} onChange={props.offCanvasGroupNameInputOnChangeHandle} ref={props.offCanvasGroupNameInputRef} />
            <div className={`sideOffCanvas_group-button update-button ${props.updateGroupChatIconIsClicked ? "" : "d-none"}`}>
              <button className='55' onClick={props.updateGroupNameButtonOnClickHandle} disabled={props.renameGroupChatResponseIsLoading || props.currentGroupChatNameInputValue === props.offCanvasGroupNameInputValue ? true : false}>
                {
                  props.renameGroupChatResponseIsLoading ? <span className="group-chat-spinner spinner-border text-light"></span> : "Update"
                }
              </button>
            </div>
          </div>
          <div className={`sideOffCanvas_group-selected-users ${props.isGroupChat ? '' : 'd-none'}`}>
            {
              props.groupChatSelectedUsers?.length ? 
              (
                props.groupChatSelectedUsers?.map((item, index) => {
                  return (
                    <UserCard
                      key={item._id}
                      showDeleteUserIcon={true}
                      deleteUserIconOnClickHandle={() => {props.deleteUserIconOnClickHandle(item._id, index)}} 
                      profilePic={item.profilePic}
                      name={item.name}
                      content={item.email}
                      id={item._id}
                      onClickId={props.onClickId}
                      onClickLoading={props.onClickLoading}
                      groupAdmin={props.groupAdmin}
                      // -------online indicator--------
                      onlineUsersData={props.onlineUsersData}
                      // -------online indicator--------
                    ></UserCard>
                  );
                })
              ) : 
              <span className='fa-solid fa-users-gear d-flex flex-column justify-content-center align-items-center h-100 text-primary opacity-50 user-select-none fs-1' onClick={() => {
                searchInputRef.current.focus()
              }}>
                <span className='mt-2 fs-6'>Select 2 Friends at least</span>
              </span>
              
            }
          </div>
          <div className={`sideOffCanvas_group-button ${!props.isGroupChat ? 'd-none' : props.groupChatSelectedUsers?.length < 2 ? 'invisible' : ""} ${props.updateGroupChatIconIsClicked ? "invisible" : ""}`}> 
            <button onClick={props.offCanvasCreateGroupChatOnClickHandle} disabled={props.createGroupChatResponseIsLoading}>
              {
                props.createGroupChatResponseIsLoading ? <span className="group-chat-spinner spinner-border text-light"></span> : "Done"
              }
            </button>
          </div>
          <div className="sideOffCanvas_search">
            <i className={`fa-solid fa-magnifying-glass ${props.offCanvasSreachInputValue ? 'd-none' : ''}`}></i>
            <i className={`fa-solid fa-circle-xmark ${props.offCanvasSreachInputValue ? '' : "d-none"}`} onClick={async () => {
              await dispatch(resetUserData())
              searchInputRef.current.value = '';
              searchInputRef.current.focus()
            }}></i>
            <input type="text" placeholder='Name Or Email' value={props.offCanvasSreachInputValue} onChange={props.offCanvasInputOnChangeHandle} ref={searchInputRef} />
          </div>
          <div className="sideOffCanvas_search-results" style={{height: `${props.isGroupChat  ? "50%" : "92%"}`}}>
            {
              props.usersDataIsLoading ? (
                <div className="55">
                  <UserCardPlaceholder></UserCardPlaceholder>
                  <UserCardPlaceholder></UserCardPlaceholder>
                  <UserCardPlaceholder></UserCardPlaceholder>
                  <UserCardPlaceholder></UserCardPlaceholder>
                  <UserCardPlaceholder></UserCardPlaceholder>
                  <div className={`${props.isGroupChat  ? 'd-none' : ''}`}>
                    <UserCardPlaceholder></UserCardPlaceholder>
                    <UserCardPlaceholder></UserCardPlaceholder>
                    <UserCardPlaceholder></UserCardPlaceholder>
                    <UserCardPlaceholder></UserCardPlaceholder>
                    <UserCardPlaceholder></UserCardPlaceholder>
                  </div>
                </div>
              ) : (
                props.usersData?.data?.map(item => {
                  return <UserCard
                    key={item._id}
                    profilePic={item.profilePic}
                    name={item.name}
                    content={item.email}
                    userCardOnClickHandle={() => {props.userCardOnClickHandle(item._id, item.profilePic, item.name, item.email)}}
                    onClickLoading={props.onClickLoading} 
                    id={item._id}
                    onClickId={props.onClickId}
                    groupChatSelectedUsersId={props.groupChatSelectedUsersId}
                    // -------online indicator--------
                    onlineUsersData={props.onlineUsersData}
                    // -------online indicator--------
                ></UserCard>
                })
              )
            }
            <span className={`fa-solid fa-magnifying-glass text-primary d-flex flex-column justify-content-center align-items-center h-75 user-select-none shadow-none fs-1 opacity-50 ${!props.usersData?.data?.length && !props.usersDataIsLoading  ? '' : 'd-none'}`} onClick={() => {
              searchInputRef.current.focus()
            }} >
              <span className='fs-6 mt-2'>
                {
                  props.usersData?.status === 200 ? "Not Found" : "Find Friends" 
                }
                </span>
            </span>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

export default SideOffCanvas