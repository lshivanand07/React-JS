import validateSignup from '../src/components/validations/validations';

describe('validateSignup', () => {
  test('returns errors for empty fields', () => {
    const result = validateSignup({
      user_name: '',
      email: '',
      role: '',
      password: '',
    });

    expect(result.user_name).toBe('Name is required');
    expect(result.email).toBe('Email field is mandatory');
    expect(result.role).toBe('please select user type');
    expect(result.password).toBe('Password field is mandatory*');
  });

  test('returns error for invalid email', () => {
    const result = validateSignup({
      user_name: 'Shiva',
      email: 'shivagmail.com',
      role: 'User',
      password: 'Password@1',
    });

    expect(result.email).toBe('please enter valid email');
  });

  test('returns error for short password', () => {
    const result = validateSignup({
      user_name: 'Shiva',
      email: 'shiva@gmail.com',
      role: 'User',
      password: 'Pass@1',
    });

    expect(result.password).toBe(
      'Password must be at least 8 characters long.'
    );
  });

  test('returns error for invalid password pattern', () => {
    const result = validateSignup({
      user_name: 'Shiva',
      email: 'shiva@gmail.com',
      role: 'User',
      password: 'password',
    });

    expect(result.password).toBe(
      'Must contain at least one uppercase letter,  Must contain at least one lowercase letter,  Must contain at least one digit'
    );
  });

  test('returns no errors for valid input', () => {
    const result = validateSignup({
      user_name: 'Shiva',
      email: 'shiva@gmail.com',
      role: 'User',
      password: 'Password@1',
    });

    expect(result).toEqual({});
  });
});