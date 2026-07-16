/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './Signup.css';
import Button from '../../components/Buttons/Button';
import validateSignup from '../../components/validations/validations';
import withLoader from '../../hoc/withLoader';
import withErrorHandling from '../../hoc/withErrorHandling';
import CreateUser from '../../services/signUpApi';
import { useNavigate } from 'react-router-dom';
import homeImage from '../../assets/home.png';

interface SignupProps {
  userRegistration: () => void;
  message: any;
  signUpData: {
    user_name: string;
    email: string;
    role: string;
    password: string;
  };
  setSignUpData: (value: any) => void;
  showPopup: boolean;
  popupFunction: () => void;
}

function Signup({
  userRegistration,
  message,
  signUpData,
  setSignUpData,
  showPopup,
  popupFunction,
}: Readonly<SignupProps>) {
  const handleChangeEvent = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setSignUpData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  return (
    <div className="signup">
      <div className="container">
        <div className="go-to-home">
          <button onClick={() => navigate('/')}>
            <img src={homeImage} alt="home" />
          </button>
        </div>
        <form className="signup-div">
          <h1 className="sign-up-heading">Sign Up</h1>
          <label htmlFor="user_name">Name*: </label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={signUpData.user_name}
            onChange={handleChangeEvent}
            placeholder="Enter your name"
          />
          <p className="error">{message?.user_name}</p>
          <label htmlFor="user_email">Email*: </label>
          <input
            type="email"
            id="user_email"
            name="email"
            value={signUpData.email}
            onChange={handleChangeEvent}
            placeholder="Ex: shivu@gmail.com"
          />
          <p className="error">{message?.email}</p>
          <p>User Role</p>
          <div className="user-type">
            <input
              id="Customer"
              type="radio"
              name="role"
              value="Customer"
              checked={signUpData.role === 'Customer'}
              onChange={handleChangeEvent}
            />
            <label htmlFor="Customer">Customer</label>
            <input
              id="Seller"
              type="radio"
              name="role"
              value="Seller"
              checked={signUpData.role === 'Seller'}
              onChange={handleChangeEvent}
            />
            <label htmlFor="Seller">Seller</label>
          </div>
          <p className="error">{message?.role}</p>
          <label htmlFor="user_password">Password*: </label>
          <input
            type="text"
            id="user_password"
            name="password"
            value={signUpData.password}
            onChange={handleChangeEvent}
            placeholder="Enter your password"
          />
          <p className="error">{message?.password}</p>
          <Button text="Sign Up" onClick={userRegistration}></Button>
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>

        {showPopup && (
          <div className="model-overlay">
            <div className="modal-container">
              <h4>{message?.message}</h4>
              <Button text="Ok" onClick={popupFunction}></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const EnhancedSignup = withLoader(withErrorHandling(Signup));

function SignupContainer() {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    user_name: '',
    email: '',
    role: '',
    password: '',
  });
  const [message, setMessage] = useState<any>({});
  const [serverError, setServerError] = useState<any>(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const userRegistration = async (event: React.SyntheticEvent<HTMLElement>) => {
    try {
      event.preventDefault();
      setLoading(true);
      const error = validateSignup(signUpData);

      if (Object.keys(error).length > 0) {
        setMessage(error);
        return;
      }
      const data = await CreateUser(signUpData);
      setMessage(data);
      setShowPopup(true);
    } catch (error: any) {
      alert(JSON.stringify(error.response?.data?.message));
      setServerError(true);
    } finally {
      setLoading(false);
    }
  };

  function popupFunction() {
    setShowPopup(false);
    navigate('/');
  }

  return (
    <EnhancedSignup
      loading={loading}
      serverError={serverError}
      userRegistration={userRegistration}
      message={message}
      signUpData={signUpData}
      setSignUpData={setSignUpData}
      showPopup={showPopup}
      popupFunction={popupFunction}
    />
  );
}

export default SignupContainer;
