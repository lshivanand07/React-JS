import api from './api';

interface SignUp {
  user_name: string;
  email: string;
  role: string;
  password: string;
}
async function CreateUser(signUpData: SignUp) {
  const response = await api.post('/post-one-user', signUpData);
  return response.data;
}

export default CreateUser;
