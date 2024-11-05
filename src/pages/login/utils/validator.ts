export const validatePhone = (value: string) => {
  const regex = /^(\+251|0)\d{9}$/;
  return regex.test(value);
};
export const validatePass = (value: string) => {
  if (value.length < 6 || value.length > 14) {
    return false;
  } else {
    return true;
  }
};
export const slicePhoneNumber = (value: string) => {
  let phoneNumber = value;

  if (value.length === 10) {
    phoneNumber = value.slice(1);
  } else if (value.length === 13) {
    phoneNumber = value.slice(4);
  }
  return phoneNumber;
};
