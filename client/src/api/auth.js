export const logout = async () => {
  try {
    const response = await fetch("/auth/logout", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
