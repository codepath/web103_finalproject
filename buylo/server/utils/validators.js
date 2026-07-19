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
