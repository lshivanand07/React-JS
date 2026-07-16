import api from './api';

interface Login {
  email: string;
  password: string;
}

async function fetchLoginDetails(loginData: Login) {
  const response = await api.post('/login', loginData);
  return response.data;
}

export default fetchLoginDetails;
