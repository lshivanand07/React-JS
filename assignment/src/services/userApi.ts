import api from './api';

export async function fetchUserById() {
  const response = await api.get('/get-my-info');
  return response.data;
}

export async function fetchAllUser() {
  const response = await api.get('/get-all-users');
  return response.data;
}

interface CreateUserDataProp {
  user_name: string;
  email: string;
  role: string;
  password: string;
  age: number;
  gender: string;
  dob: string;
  phone: string;
}
export async function CreateUser(createuserData: CreateUserDataProp) {
  console.log('createUserData', createuserData);
  const response = await api.post('/post-one-user', createuserData);
  return response.data;
}

interface EditUserProps {
  user_name: string;
  dob: string;
  phone: string;
  gender: string;
  age: number;
}

export async function editUser(editedProfileData: EditUserProps) {
  console.log('api ', editedProfileData);
  const response = await api.put('/edit-one-user', editedProfileData);
  return response.data;
}

export async function deleteUser(user_id: number) {
  console.log('api ', user_id);
  const response = await api.delete(`/delete-one-user/${user_id}`);
  return response.data;
}
