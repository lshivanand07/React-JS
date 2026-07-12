/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '../../components/Buttons/Button';
import { useCallback, useEffect, useState } from 'react';
import { createUserAddress, editAddress } from '../../services/addressApi';
import './Address.css';
import withErrorHandling from '../../hoc/withErrorHandling';
import withLoader from '../../hoc/withLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface AddreessesProps {
  insertUserAddress: () => void;
  resetForm: () => void;
  message: string;
  showPopup: boolean;
  setShowPopup: (value: boolean) => void;
  address: {
    country: string;
    state: string;
    districts: string;
    city: string;
    street: string;
    landmark: string;
    pincode: string;
    user_address_status: string;
  };
  setAddress: (value: any) => void;
}

const Addresses = ({
  insertUserAddress,
  resetForm,
  message,
  showPopup,
  setShowPopup,
  address,
  setAddress,
}: AddreessesProps) => {
  const handleChangeEvent = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setAddress((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <h3>Manage Addresses</h3>
      <div className="add-address-div">
        <h4 className="add-new-address">ADD A NEW ADDRESS</h4>
        <form className="address-input">
          <select
            name="country"
            value={address.country}
            onChange={handleChangeEvent}
          >
            <option value="" disabled>
              Select your Country
            </option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="australia">australia</option>
            <option value="Afghanistan">Afghanistan</option>
            <option value="Algeria">Algeria</option>
            <option value="Argentina">Argentina</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Pakistan">Pakistan</option>
          </select>
          <input
            type="text"
            name="state"
            placeholder="Enter Your State"
            value={address.state}
            onChange={handleChangeEvent}
          />
          <input
            type="text"
            name="districts"
            placeholder="Enter Your districts"
            value={address.districts}
            onChange={handleChangeEvent}
          />
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChangeEvent}
            placeholder="Enter your city"
          />
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleChangeEvent}
            placeholder="Enter your Street"
          />
          <textarea
            className="landmark"
            rows={4}
            cols={10}
            name="landmark"
            value={address.landmark}
            onChange={handleChangeEvent}
            placeholder="Enter your Landmark"
          ></textarea>
          <input
            type="text"
            name="pincode"
            value={address.pincode}
            onChange={handleChangeEvent}
            placeholder="Enter your pincode"
            maxLength={6}
          />
          <div>
            Address type
            <div className="address-radio-Btn">
              <input
                type="radio"
                id="HOME"
                name="user_address_status"
                value="home"
                checked={address.user_address_status === 'home'}
                onChange={handleChangeEvent}
              />
              <label htmlFor="HOME">Home</label>
              <input
                type="radio"
                id="work"
                name="user_address_status"
                value="work"
                checked={address.user_address_status === 'work'}
                onChange={handleChangeEvent}
              />
              <label htmlFor="work">Work</label>
            </div>
          </div>
        </form>
        <div className="save-cancel-btn">
          <Button text="Save" onClick={insertUserAddress}></Button>
          <Button text="Cancel" onClick={resetForm}></Button>
        </div>

        {showPopup && (
          <div className="model-overlay">
            <div className="modal-container">
              <h4>{message}</h4>
              <Button text="Ok" onClick={() => setShowPopup(false)}></Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const EnhancedAddresses = withLoader(withErrorHandling(Addresses));

function AddressContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const userAddressStatus = location?.state?.addressStatus;

  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<Error | null>(null);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const addressData = useSelector((state: any) => state.address.addressItem);
  const [address, setAddress] = useState({
    country: '',
    state: '',
    districts: '',
    city: '',
    street: '',
    landmark: '',
    pincode: '',
    user_address_status: '',
  });

  useEffect(() => {
    const selectedAddress = addressData?.find(
      (value: any) => value.user_address_status === userAddressStatus
    );

    if (selectedAddress) {
      setAddress({
        country: selectedAddress.country || '',
        state: selectedAddress.state || '',
        districts: selectedAddress.districts || '',
        city: selectedAddress.city || '',
        street: selectedAddress.street || '',
        landmark: selectedAddress.landmark || '',
        pincode: selectedAddress.pincode || '',
        user_address_status: selectedAddress.user_address_status || '',
      });
    }
  }, [addressData, userAddressStatus]);

  const insertUserAddress = async () => {
    try {
      setLoading(true);
      console.log({
        address,
      });
      if (userAddressStatus) {
        const editData = await editAddress(address, userAddressStatus);
        console.log('editData ', editData.message);
        setMessage(editData.message);
      } else {
        const createData = await createUserAddress(address);
        setMessage(createData.message);
      }
      setShowPopup(true);
      navigate('/address');
    } catch (error: any) {
      alert(error.response?.data?.message);
      setServerError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setAddress({
      country: '',
      state: '',
      districts: '',
      city: '',
      street: '',
      landmark: '',
      pincode: '',
      user_address_status: '',
    });
  }, []);

  return (
    <EnhancedAddresses
      insertUserAddress={insertUserAddress}
      resetForm={resetForm}
      loading={loading}
      serverError={serverError}
      setAddress={setAddress}
      address={address}
      message={message}
      showPopup={showPopup}
      setShowPopup={setShowPopup}
      userAddressStatus={userAddressStatus}
    />
  );
}

export default AddressContainer;

