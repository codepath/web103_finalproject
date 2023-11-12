export const getSchools = async () => {
  try {
    const response = await fetch("/api/schools", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getSchoolById = async (id) => {
  try {
    const response = await fetch(`/api/schools/${id}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
