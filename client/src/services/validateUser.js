import useFetch from "../utilities/useFetch";

const validateUser = async () => {
  const request = {
    URL: "",
    METHOD: "TESTING",
    BODY: "",
    COOKIE: "#####",
  };
  const response = await useFetch(request);
  if (response.status === 200) {
    console.log(response.message);
    return true;
  }
  console.log(response.message);
  return false;
};

export default validateUser;
