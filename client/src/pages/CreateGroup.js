import React, { useState, useEffect } from 'react';
import './CreateGroup.css'; // Ensure this points to the correct path

const CreateGroup = (props) => {
  const [group, setGroup] = useState({
    name: "",
    description: "",
    created_by: props.user.username, // Pre-fill with username
  });

  useEffect(() => {
    // Ensure the username is set when the component mounts or when `user` changes
    setGroup((prev) => ({
      ...prev,
      created_by: props.user.username,
    }));
  }, [props.user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createGroup = async (event) => {
    event.preventDefault();

    const groupData = {
      ...group,
      created_by: props.user.id, // Replace the username with the user ID for submission
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(groupData)
    };

    try {
      const response = await fetch(`${props.api_url}/api/groups`, options);
      if (response.ok) {
        window.location.href = '/'; // Redirect to home or appropriate page
      } else {
        console.error("Error creating group");
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  return (
    <div>
      <center><h3>Create New Group</h3></center>
      <form onSubmit={createGroup}>
        <label htmlFor="name">Group Name</label> <br />
        <input
          type="text"
          id="name"
          name="name"
          value={group.name}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="description">Description</label><br />
        <textarea
          rows="5"
          cols="50"
          id="description"
          name="description"
          value={group.description}
          onChange={handleChange}
          required
        ></textarea><br />

        <label htmlFor="created_by">Created By</label><br />
        <input
          type="text"
          id="created_by"
          name="created_by"
          value={group.created_by}
          readOnly // Make it uneditable
        /><br />

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default CreateGroup;
