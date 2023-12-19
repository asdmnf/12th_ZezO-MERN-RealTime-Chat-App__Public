import './UserCardPlaceholder.css'
import Placeholder from 'react-bootstrap/Placeholder';


const UserCardPlaceholder = () => {
  return (
    <div className="placeholder-card card p-2 my-2">
      <div className="row align-items-center">
        <span className="placeholder-img-simulation col-3 text-bg-primary"></span>
        <div className="d-flex flex-column col-9">
          <Placeholder animation="glow" className='text-primary'>
            <Placeholder xs={4} />
          </Placeholder>
          <Placeholder animation="glow" className='text-primary'>
            <Placeholder xs={7} />
          </Placeholder>
        </div>
      </div>
    </div>
  );
}

export default UserCardPlaceholder