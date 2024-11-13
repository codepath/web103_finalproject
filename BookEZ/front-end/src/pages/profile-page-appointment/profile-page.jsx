import "../../css/profile-page.css"
import IncomingAppointments from "./incoming-appointment";

const ProfilePage = () => {

    return (
        <> 
            <div className="profile-page-username">
                <h1>Username</h1>
                <button>Edit</button>
            </div>

            <div className="profile-page-all-details">
                <div className="profile-page-all-details-frame">
                    <h2>Full name</h2>
                    <div className="profile-details">
                        <h3>Person A</h3>
                        <button>Edit</button>
                    </div>
                </div>
                <div className="profile-page-all-details-frame">
                    <h2>Email</h2>
                    <div className="profile-details">
                        <h3>a.person@gmail.com</h3>
                        <button>Edit</button>
                    </div>
                </div>
                <div className="profile-page-all-details-frame">
                    <h2>Phone Number</h2>
                    <div className="profile-details">
                        <h3>686-8686-8686</h3>
                        <button>Edit</button>
                    </div>
                </div>
            </div>

            <div className="profile-page-incoming-appointment">
                <h1>Incoming appointment</h1>
                <div>
                    <IncomingAppointments />
                </div>
            </div>
        </>
    )

}

export default ProfilePage;