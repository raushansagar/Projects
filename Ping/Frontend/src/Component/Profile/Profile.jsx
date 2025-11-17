import React, { useContext } from 'react'
import './Profile.css'
import { StoreContext } from '../../StoreContext/StoreContext'
import Footer from '../Footer/Footer';


const Profile = () => {

    const { user, allUser } = useContext(StoreContext);

    return (
        <>
            <div className='profile-container'>

                {/* PROFILE HEADER */}
                <div className="profile-heading">
                    <img src={user?.avatar || null} alt="" />
                    <div className="profile-name-details">
                        <h4>{user?.username}</h4>
                    </div>
                </div>



                {/* BASIC INFO SECTION */}
            <div className="profile-basic-info">
                <h3>Basic Info</h3>
                <div className="basic-info-box">
                    <div className="info-row">
                        <span className="label">Name</span>
                        <span className="value">{user?.username}</span>
                        <span className="edit">Edit</span>
                    </div>
                    <hr />
                    <div className="info-row">
                        <span className="label">Email</span>
                        <span className="value">{user?.email}</span>
                        <span className="edit">Edit</span>
                    </div>
                    <hr />
                    <div className="info-row">
                        <span className="label">Phone</span>
                        <span className="value">{user?.phone || "Add phone number"}</span>
                        <span className="edit">Edit</span>
                    </div>
                    <hr />
                    <div className="info-row">
                        <span className="label">Status Message</span>
                        <span className="value">{user?.statusMessage}</span>
                        <span className="edit">Edit</span>
                    </div>
                    <hr />
                    <div className="info-row">
                        <span className="label">Last Seen</span>
                        <span className="value">
                            {user?.isOnline ? "Online" : user?.lastSeen}
                        </span>
                        <span className="edit">Edit</span>
                    </div>
                    <hr />
                </div>
            </div>



                {/* FRIEND LIST SECTION */}
                <div className="profile-friends-section">
                    {/* <h3>Friends</h3> */}

                    {/* <div className="friends-list">
                        {user?.friends?.length === 0 ? (
                            <p>No friends added.</p>
                        ) : (
                            allUser
                                .filter(u => user.friends.includes(u._id))
                                .map(f => (
                                    <div className="friend-card" key={f._id}>
                                        <img src={f.avatar} alt="" />
                                        <div className="friend-details">
                                            <h4>{f.username}</h4>
                                            <p>{f.email}</p>
                                        </div>
                                        <span className="edit">View</span>
                                    </div>
                                ))
                        )}
                    </div> */}
                </div>

            </div>
            <Footer/>
        </>
    );
};

export default Profile;


