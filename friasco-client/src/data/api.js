export async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:8000/v1/users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.users;
    } else {
      console.error("Error fetching data");
      return []; // Return an empty array or handle the error as needed
    }
  } catch (error) {
    console.error("Error:", error);
    alert(error);
    return []; // Return an empty array or handle the error as needed
  }
}

export async function createUser(formData) {
  try {
    const response = await fetch("http://localhost:8000/v1/users/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      alert(message);
      throw new Error(message);
    } else {
      return response.ok;
    }
  } catch (error) {
    console.error("Error:", error);
    alert(error);
  }
}

export async function deleteUser(userId) {
  try {
    const response = await fetch(`http://localhost:8000/v1/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      alert(message);
      throw new Error(message);
    } else {
      return response.ok;
    }
  } catch (error) {
    console.error("Error: ", error);
    alert(error);
  }
}
