export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isNameValid = (name) => {
  const nameRegex = /^[A-Za-z]+$/;
  return nameRegex.test(name.trim());
};

export const isProductNameValid = (name) => {
  const nameRegex = /^[A-Za-z0-9 .,''\-&:]+$/;
  return nameRegex.test(name.trim());
};

export const isUrlValid = (url) => {
  const urlRegex =
    /^https?:\/\/([\da-z\.-]+)\.([a-z]{2,6})(\/[\w\.-]*)*(\?[;&\w\.\+=\-]*)?\/?$/;
  return urlRegex.test(url.trim());
};

export const isAddressValid = (address) => {
  const addressRegex = /^\d+\s[\w\s.,-]+$/;
  return addressRegex.test(address.trim());
};

export const isPhoneNumberValid = (phone) => {
  const phoneRegex = /^\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phone.trim());
};
