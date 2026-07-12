interface ValidationSignUp {
  user_name: string;
  email: string;
  role: string;
  password: string;
}

interface ValidationErrors {
  user_name?: string;
  email?: string;
  role?: string;
  password?: string;
}

const validateSignup = (signUpData: ValidationSignUp): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!signUpData.user_name.trim()) {
    errors.user_name = 'Name is required';
  }

  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

  if (signUpData.email === '') {
    errors.email = 'Email field is mandatory';
  } else if (!emailPattern.test(signUpData.email)) {
    errors.email = 'please enter valid email';
  }

  if (!signUpData.role) {
    errors.role = 'please select user type';
  }

  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z0-9])(?=.*[@$&])[A-Za-z0-9@$&]{8,}$/;
  if (signUpData.password === '') {
    errors.password = 'Password field is mandatory*';
  } else if (signUpData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  } else if (!passwordPattern.test(signUpData.password)) {
    errors.password =
      'Must contain at least one uppercase letter,  Must contain at least one lowercase letter,  Must contain at least one digit';
  }

  return errors;
};

export default validateSignup;
