interface userData {
  username: string;
  password: string;
}

const baseUrl = "/api";

// Login
export async function Login({ username, password }: userData) {
  const url = `${baseUrl}/login`;
  const data = { username, password };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
  }
}

// Register
export async function Register({ username, password }: userData) {
  const url = `${baseUrl}/register`;
  const data = { username, password };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
  }
}

// logout
export function Logout() {
  const url = `${baseUrl}/logout`;
  return fetch(url);
}
