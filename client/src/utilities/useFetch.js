import axios from "axios";
import userInfo from "../dummydata/login";

const useFetch = async (request) => {
  const { URL, METHOD, BODY, COOKIE } = request;

  if (METHOD === "TESTING") {
    if (COOKIE === userInfo.token) {
      return {
        status: 200,
        message: "Valid Token Found: User Already Logged In",
      };
    }
    return { status: 400, message: "Invalid Token: User Not Logged In" };
  }

  if (METHOD === "GET") {
    const response = await axios.get(URL);
    return response;
  }

  if (METHOD === "POST") {
    const response = await axios.post(URL);
    return response;
  }

  if (METHOD === "PATCH" || METHOD === "PUT") {
    const response = await axios.patch(URL);
    return response;
  }

  if (METHOD === "DELETE") {
    const response = await axios.delete(URL);
    return response;
  }
};

export default useFetch;
