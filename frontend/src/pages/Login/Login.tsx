/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import fetchLoginDetails from '../../services/loginApi';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import withErrorHandling from '../../hoc/withErrorHandling';
import withLoader from '../../hoc/withLoader';
import homeImage from '../../assets/home.png';

interface LoginProps {
  loading: boolean;
  serverError: null;
  authenticated: boolean;
  errors: {
    email: string;
    password: string;
  };
  message: string;
  userLogin: () => void;
  loginData: {
    email: string;
    password: string;
  };
  setLoginData: (value: any) => void;
}

function Login({
  loading,
  serverError,
  authenticated,
  errors,
  message,
  userLogin,
  loginData,
  setLoginData,
}: LoginProps) {
  const handleChangeEvent = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setLoginData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  return (
    !loading &&
    !serverError &&
    !authenticated && (
      <div className="login-section">
        <div className="container">
          <div className="login-card">
            <div className="go-to-home">
              <button onClick={() => navigate('/')}>
                <img src={homeImage} alt="home" />
              </button>
            </div>
            <form className="login-div">
              <h1>Login</h1>

              <label htmlFor="email">Email</label>

              <input
                type="text"
                id="email"
                name="email"
                value={loginData.email}
                placeholder="Enter Email"
                onChange={handleChangeEvent}
              />

              {errors.email && <p className="error">{errors.email}</p>}

              <label htmlFor="password">Password</label>

              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                placeholder="Enter Password"
                onChange={handleChangeEvent}
              />

              {errors.password && <p className="error">{errors.password}</p>}

              <button onClick={userLogin} disabled={loading}>
                Login
              </button>

              {message && <p className="error">{message}</p>}
              <p>
                Do not have an account? <a href="/signup">Sign-Up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    )
  );
}

const EnhancedLogin = withLoader(withErrorHandling(Login));

function LoginContainer() {
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<any>({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const userLogin = async (event: React.SyntheticEvent<HTMLElement>) => {
    try {
      event.preventDefault();
      setErrors({ email: '', password: '' });
      setMessage('');
      setLoading(true);
      setServerError(false);
      if (!loginData.email && !loginData.password) {
        setErrors({
          email: 'Email fields required',
          password: 'Password fields required',
        });
        return;
      }
      if (!loginData.email) {
        setErrors({ email: 'Email fields required', password: '' });
        return;
      }
      if (!loginData.password) {
        setErrors({ email: '', password: 'Password fields required' });
        return;
      }

      const data = await fetchLoginDetails(loginData);
      console.log('data',data)
      if (data.token) {
        setAuthenticated(true);
        const userToken = {
          token: data.token,
          role: data.user.user_role,
        };
        localStorage.setItem('userToken', JSON.stringify(userToken));
        console.log(localStorage.getItem('userToken'));
        if (userToken.role === 'customer') {
          console.log('home');
          return navigate('/');
        }
        if (userToken.role === 'seller') {
          console.log('seller');
          return navigate('/seller-account');
        }

        if (userToken.role === 'admin') {
          console.log('admin');
          return navigate('/admin');
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EnhancedLogin
      loading={loading}
      serverError={serverError}
      authenticated={authenticated}
      errors={errors}
      message={message}
      userLogin={userLogin}
      loginData={loginData}
      setLoginData={setLoginData}
    />
  );
}

export default LoginContainer;
