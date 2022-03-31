// Basic regex to test if a password has at the requirements:
// The password must be eight characters or longer
// The password must contain at least 1 lowercase alphabetical character.
// The password must contain at least 1 uppercase alphabetical character.
// The password must contain at least 1 numeric character.
// The password must contain at least 1 special character.
// by rodaan@ambient.ai
const validatePassword = (password) => {
  const regx = /^(?=(?:[^a-z]*[a-z]){1})(?=(?:[^A-Z]*[A-Z]){1})(?=(?:\D*\d){1})(?=(?:[^!@#$%^&*)(]*[!@#$%^&*)(]){1}).{8,}$/;
  // const regx = /.{8,}$/
  return regx.test(password)
}

export default validatePassword;
