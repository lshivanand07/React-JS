/* eslint-disable @typescript-eslint/no-explicit-any */
import './MyProfile.css';
import { editUser, fetchUserById } from '../../services/userApi';
import { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import prsonImage from '../../assets/person.png';
import notAddressFound from '../../assets/notAddressFound.png';
import Button from '../../components/Buttons/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchUserAddressById } from '../../services/addressApi';
import withLoader from '../../hoc/withLoader';
import withErrorHandling from '../../hoc/withErrorHandling';
import AddressContainer from '../Addresses/Address';
import { useDispatch, useSelector } from 'react-redux';
import { setAddress } from '../../redux/slices/addressSlice';
import { setUser } from '../../redux/slices/userSlice';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import MobileMenu from '../../components/MobileMenu/MobileMenu';

interface MyProfileProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  fetchUserInfo: () => void;
  fetchAddressInfo: () => void;
  EditUserAddress: (value: string) => void;
  editedProfileData: {
    user_name: string;
    dob: string;
    phone: string;
    age: number;
    gender: string;
  };
  setEditedProfileData: (value: any) => void;
  handleLogout: () => void;
  userData: any;
  addressData: any[];
  showPopup: boolean;
  setShowPopup: (value: boolean) => void;
  editProfile: () => void;
  message: string;
}

function MyProfile({
  activeTab,
  setActiveTab,
  fetchUserInfo,
  fetchAddressInfo,
  EditUserAddress,
  setEditedProfileData,
  editedProfileData,
  handleLogout,
  userData,
  addressData,
  showPopup,
  setShowPopup,
  editProfile,
  message,
}: Readonly<MyProfileProps>) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setEditedProfileData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="profile-dashboard">
          <div className="dashboard-buttons">
            <div className="person-name-img">
              <img src={prsonImage} alt="person Img" />
              <h3>{userData?.user_name}</h3>
            </div>
            <Button text="Personal Info" onClick={fetchUserInfo}></Button>
            <Button text="Addresses" onClick={fetchAddressInfo}></Button>
            <Button text="Logout" onClick={handleLogout}></Button>
          </div>
          <div className="dashboard-info">
            <Breadcrumbs />
            {activeTab === 'profile' && userData && (
              <>
                <h1 className="dashboard-info-heading">My Profile</h1>
                <p>Email: {userData?.email}</p>
                <p>DOB: {userData?.dob}</p>
                <p>Age: {userData?.age}</p>
                <p>Gender: {userData?.gender}</p>
                <p>Phone: {userData?.phone}</p>
                <p>Role: {userData?.role}</p>
                <div className="edit-button">
                  <Button
                    text="Edit"
                    onClick={() => setActiveTab('editProfile')}
                  ></Button>
                </div>
              </>
            )}


            {activeTab === 'editProfile' && (
              <>
                <h3>Manage Profile</h3>
                <div className="edit-profile">
                  <h4 style={{ color: 'blue' }}>Edit Profile</h4>
                  <form className="profile-input">
                    <input
                      type="text"
                      placeholder={userData?.user_name}
                      name="user_name"
                      value={editedProfileData.user_name}
                      onChange={handleChange}
                    />
                    <input
                      type="date"
                      placeholder="Date of Birth"
                      name="dob"
                      value={editedProfileData.dob}
                      onChange={handleChange}
                    />
                    <input
                      type="tel"
                      placeholder="EX: 918618581627"
                      minLength={10}
                      name="phone"
                      value={editedProfileData.phone}
                      onChange={handleChange}
                    />
                    <input
                      type="number"
                      placeholder="Enter your age"
                      name="age"
                      value={editedProfileData.age}
                      onChange={handleChange}
                    />

                    <div>
                      Gender
                      <div className="profile-radio-Btn">
                        <input
                          type="radio"
                          id="Male"
                          name="gender"
                          value="Male"
                          checked={editedProfileData.gender === 'Male'}
                          onChange={handleChange}
                        />
                        <label htmlFor="Male">Male</label>
                        <input
                          type="radio"
                          id="Female"
                          name="gender"
                          value="Female"
                          checked={editedProfileData.gender === 'Female'}
                          onChange={handleChange}
                        />
                        <label htmlFor="Female">Female</label>
                      </div>
                    </div>
                  </form>

                  <div className="save-cancel-btn">
                    <Button text="Save" onClick={editProfile}></Button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'address' && addressData[0] && (
              <>
                <h1 className="dashboard-info-heading">My Address</h1>
                <div className="user-addresses"></div>
                {addressData.map((addressData) => (
                  <div className="address" key={addressData.address_id}>
                    <p>Address Status: {addressData?.user_address_status}</p>
                    <p>Country: {addressData?.country}</p>
                    <p>State: {addressData?.state}</p>
                    <p>Districts: {addressData?.districts}</p>
                    <p>City: {addressData?.city}</p>
                    <p>Street: {addressData?.street}</p>
                    <p>Landmark: {addressData?.landmark}</p>
                    <p>Pincode: {addressData?.pincode}</p>
                    <div className="edit-button">
                      <Button
                        text="Edit"
                        onClick={() =>
                          EditUserAddress(addressData?.user_address_status)
                        }
                      ></Button>
                    </div>
                  </div>
                ))}
                <Button
                  text="ADD ADDRESSES"
                  onClick={() => setActiveTab('addNewAddress')}
                ></Button>
              </>
            )}

            {activeTab === 'address' && !addressData[0] && (
              <div className="no-addresses-found">
                <img src={notAddressFound} alt="person Img" />
                <h3>No Addresses found in your account!</h3>
                <p>Add a delivery address.</p>
                <Button
                  text="ADD ADDRESSES"
                  onClick={() => setActiveTab('addNewAddress')}
                ></Button>
              </div>
            )}

            {(activeTab === 'addNewAddress' || activeTab === 'editAddress') && (
              <AddressContainer />
            )}

            {showPopup && (
              <div className="model-overlay">
                <div className="modal-container">
                  <h4>{message}</h4>
                  <Button
                    text="Ok"
                    onClick={() => setShowPopup(false)}
                  ></Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileMenu />
      <Footer />
    </div>
  );
}

const EnhancedMyProfile = withLoader(withErrorHandling(MyProfile));

function MyProfileContainer() {
  const navigate = useNavigate();
  const location = useLocation();

  const [serverError, setServerError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<
    'profile' | 'editProfile' | 'address' | 'addNewAddress' | 'editAddress'
  >('profile');

  const dispatch = useDispatch();
  const addressData = useSelector((state: any) => state.address.addressItem);

  const userData = useSelector((state: any) => state.user.userData);
  const [editedProfileData, setEditedProfileData] = useState<any>({});

  useEffect(() => {
    if (userData?.User_id) {
      setEditedProfileData({
        user_name: userData.user_name,
        dob: '',
        phone: userData.phone,
        gender: userData.gender,
        age: userData.age,
      });
    }
  }, [userData]);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const data = await fetchUserById();
      dispatch(setUser(data[0][0]));
      setActiveTab('profile');
      navigate('/profile');
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  };

  async function editProfile() {
    try {
      setLoading(true);
      if (editedProfileData.phone.length < 10) {
        setMessage('Phone number must be at least 10 digits');
        setShowPopup(true);
        return;
      }
      const data = await editUser(editedProfileData);
      console.log(data);
      setMessage(data.message);
      setShowPopup(true);
    } catch (error: any) {
      alert(JSON.stringify(error.response?.data?.message));
      setServerError(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchAddressInfo = async () => {
    try {
      setLoading(true);
      const data = await fetchUserAddressById();
      dispatch(setAddress(data[0]));
      setActiveTab('address');
      navigate('/address');

      if (!data[0][0]) {
        setActiveTab('address');
      }
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname === '/profile') {
      fetchUserInfo();
    } else {
      fetchAddressInfo();
    }
  }, []);

  function EditUserAddress(addressStatus: string) {
    setActiveTab('editAddress');
    navigate('/address', {
      state: {
        addressStatus: addressStatus,
      },
    });
    console.log('hi');
  }

  const handleLogout = useCallback(() => {
    localStorage.removeItem('userToken');
    navigate('/login');
  }, [navigate]);

  return (
    <EnhancedMyProfile
      serverError={serverError}
      loading={loading}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      fetchUserInfo={fetchUserInfo}
      setEditedProfileData={setEditedProfileData}
      editedProfileData={editedProfileData}
      fetchAddressInfo={fetchAddressInfo}
      EditUserAddress={EditUserAddress}
      handleLogout={handleLogout}
      userData={userData}
      addressData={addressData}
      setShowPopup={setShowPopup}
      showPopup={showPopup}
      editProfile={editProfile}
      message={message}
    />
  );
}

export default MyProfileContainer;
