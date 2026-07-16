import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import withErrorHandling from '../../hoc/withErrorHandling';
import withLoader from '../../hoc/withLoader';
import { CreateUser } from '../../services/userApi';
import './AdminAddUser.css';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validateSignup from '../../components/validations/validations';
import Button from '../../components/Buttons/Button';

interface CreateUserProps {
  userRegistration: () => void;
  message: any;
  createuserData: {
    user_name: string;
    email: string;
    role: string;
    password: string;
    age: number;
    phone: string;
    gender: string;
    dob: string;
  };
  setCreateuserData: (value: any) => void;
  showPopup: boolean;
  popupFunction: () => void;
}
function AddNewUser({
  userRegistration,
  message,
  createuserData,
  setCreateuserData,
  showPopup,
  popupFunction,
}: Readonly<CreateUserProps>) {
  const handleChangeEvent = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setCreateuserData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    
      <div className="container">
        <Breadcrumbs />
        <h1 className="add-user-heading">Add User</h1>
        <div>
          <form className="add-user">
            <div className="add-user-input">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                name="user_name"
                value={createuserData.user_name}
                onChange={handleChangeEvent}
              />
              <p className="error">{message?.user_name}</p>
            </div>
            <div className="add-user-input">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                placeholder="Enter email"
                name="email"
                value={createuserData.email}
                onChange={handleChangeEvent}
              />
              <p className="error">{message?.email}</p>
            </div>
            <div className="add-user-input">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                placeholder="EX: 918618581627"
                minLength={10}
                name="phone"
                value={createuserData.phone}
                onChange={handleChangeEvent}
              />
            </div>
            <div className="add-user-input">
              <label htmlFor="name">DOB</label>
              <input
                id="dob"
                type="date"
                placeholder="Date of Birth"
                name="dob"
                value={createuserData.dob}
                onChange={handleChangeEvent}
              />
            </div>
            <div className="add-user-input">
              <label htmlFor="Male">Gender</label>
              <div className="profile-radio-Btn">
                <input
                  type="radio"
                  id="Male"
                  name="gender"
                  value="Male"
                  checked={createuserData.gender === 'Male'}
                  onChange={handleChangeEvent}
                />
                <label htmlFor="Male">Male</label>
                <input
                  type="radio"
                  id="Female"
                  name="gender"
                  value="Female"
                  checked={createuserData.gender === 'Female'}
                  onChange={handleChangeEvent}
                />
                <label htmlFor="Female">Female</label>
              </div>
            </div>

            <div className="add-user-input">
              <label htmlFor="customer"> User Type</label>
              <div className="profile-radio-Btn">
                <input
                  type="radio"
                  id="customer"
                  name="role"
                  value="Customer"
                  checked={createuserData.role === 'Customer'}
                  onChange={handleChangeEvent}
                />
                <label htmlFor="customer">Customer</label>
                <input
                  type="radio"
                  id="seller"
                  name="role"
                  value="Seller"
                  checked={createuserData.role === 'Seller'}
                  onChange={handleChangeEvent}
                />
                <label htmlFor="seller">Seller</label>
              </div>
            </div>

            <div className="add-user-input">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="enter password"
                name="password"
                value={createuserData.password}
                onChange={handleChangeEvent}
              />
              <p className="error">{message?.password}</p>
            </div>

            <div className="add-user-input">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                placeholder="enter password"
                name="age"
                min={1}
                value={createuserData.age}
                onChange={handleChangeEvent}
              />
            </div>
          </form>
          <div className="create-user-btn">
            <Button text="Create User" onClick={userRegistration}></Button>
          </div>
        </div>
        {showPopup && (
          <div className="model-overlay">
            <div className="modal-container">
              <h4>{message?.message}</h4>
              <Button text="Ok" onClick={popupFunction}></Button>
            </div>
          </div>
        )}
      </div>
  );
}

const EnhancedAddUser = withLoader(withErrorHandling(AddNewUser));

function AdminCreateUser() {
  const navigate = useNavigate();

  const [createuserData, setCreateuserData] = useState({
    user_name: '',
    email: '',
    phone: '',
    role: '',
    age: 0,
    password: '',
    gender: '',
    dob: '',
  });
  const [message, setMessage] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  console.log(createuserData);
  console.log(message);
  const userRegistration = async (event: React.SyntheticEvent<HTMLElement>) => {
    try {
      event.preventDefault();
      setLoading(true);
      const error = validateSignup(createuserData);

      if (Object.keys(error).length > 0) {
        setMessage(error);
        return;
      }
      const data = await CreateUser(createuserData);
      setMessage(data);
      setShowPopup(true);
    } catch (error: any) {
      setMessage({
        message: error.response?.data?.message || 'Something went wrong',
      });
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const popupFunction = useCallback(() => {
    setShowPopup(false);
    navigate('/admin');
  }, []);
  return (
    <EnhancedAddUser
      loading={loading}
      //serverError={serverError}
      userRegistration={userRegistration}
      message={message}
      createuserData={createuserData}
      setCreateuserData={setCreateuserData}
      showPopup={showPopup}
      popupFunction={popupFunction}
    />
  );
}

export default AdminCreateUser;
