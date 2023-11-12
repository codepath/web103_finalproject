export const getUser = async (id) => {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const updateUser = async (id, user) => {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
