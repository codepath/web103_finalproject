import '../styles/accountSettings.css';

const AccountSettings = () => {
    const handleDeleteUser = async () => {
        try {
          const userIdToDelete = 2; // ID of the user to be deleted
    
          const response = await fetch(`http://localhost:3001/users/${userIdToDelete}`, {
            method: 'DELETE',
          });
    
          if (response.ok) {
            // User deleted successfully
            console.log('User deleted successfully.');
          } else {
            // Failed to delete user
            console.error('Failed to delete user.');
          }
        } catch (error) {
          console.error('Error while deleting user:', error);
        }
      };
    
    return (
        <>
        <div class="wrapper bg-white mt-sm-5">
    <h4 class="pb-4 border-bottom">Account settings</h4>
    {/* removed this div for now since we do not have images for profile accounts currently*/}
    {/* <div class="d-flex align-items-start py-3 border-bottom">
        <img src="https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            class="img" alt="" />
        <div class="pl-sm-4 pl-2" id="img-section">
            <b>Profile Photo</b>
            <p>Accepted file type .png. Less than 1MB</p>
            <button class="btn button border"><b>Upload</b></button>
        </div>
    </div> */}
    <div class="py-2">
        <div class="row py-2">
            <div class="col-md-6">
                <label for="firstname">First Name</label>
                <input type="text" class="bg-light form-control" placeholder="" />
            </div>
            <div class="col-md-6 pt-md-0 pt-3">
                <label for="lastname">Last Name</label>
                <input type="text" class="bg-light form-control" placeholder="" />
            </div>
        </div>
        <div class="row py-2">
            <div class="col-md-6">
                <label for="email">Email Address</label>
                <input type="text" class="bg-light form-control" placeholder="" />
            </div>
            <div class="col-md-6 pt-md-0 pt-3">
                <label for="phone">Phone Number</label>
                <input type="tel" class="bg-light form-control" placeholder="" />
            </div>
        </div>
        <div class="row py-2">
            <div class="col-md-6">
                <label for="phone">Address</label>
                <input type="tel" class="bg-light form-control" placeholder="" />
            </div>
            <div class="col-md-6">
                <label for="phone">City</label>
                <input type="tel" class="bg-light form-control" placeholder="" />
            </div>
        </div>
        <div class="row py-2">
            <div class="col-md-6 pt-md-0 pt-3" id="lang">
                <label for="language">State</label>
                <div class="arrow">
                    <select name="language" id="language" class="bg-light">
                        <option value="TX" selected>TX</option>
                        <option value="FL">FL</option>
                        <option value="CA">CA</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
            <div class="col-md-6">
                <label for="phone">Zip</label>
                <input type="tel" class="bg-light form-control" placeholder="" />
            </div>
        </div>
        <div class="py-3 pb-4 border-bottom">
            <button class="buttonLogIn">Save Changes</button>
            {/* we do not need a cancel button right now */}
            {/* <button class="buttonLogIn">Cancel</button> */}
        </div>
        <div class="d-sm-flex align-items-center pt-3" id="deactivate">
            <div>
                <b>Deactivate your account</b>
                <p>This will delete your account and its records</p>
            </div>
            <div class="ml-auto">
                <button class="buttonLogIn" onClick={handleDeleteUser}>Deactivate</button>
            </div>
        </div>
    </div>
</div>
        </>
    );

}

export default AccountSettings;