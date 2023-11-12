export const getSubjects = async () => {
  try {
    const response = await fetch("/api/subjects", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getSubjectById = async (id) => {
  try {
    const response = await fetch(`/api/subjects/${id}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
