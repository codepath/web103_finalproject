export const logout = async () => {
  try {
    const response = await fetch("/auth/logout", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getUserId = async () => {
  try {
    const response = await fetch("/auth/login/success", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
