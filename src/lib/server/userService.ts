import { API } from "$env/static/private";
import bcrypt from "bcrypt";

export async function getUser() {
  const url = `${API}/user-info`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    if (response.ok) {
      //user exists

      return {
        exists: true,
        //restaurants: [] // Placeholder, as the API doesn't return them here
      };
    } else if (response.status === 404) {
      return {
        exists: false,
        //restaurants: []
      };
    } else {
      const errorText = await response.text();
      console.error("Fetch error:", response.status, errorText);
      throw new Error(
        `Failed to check restaurant code. Status: ${response.status}`,
      );
    }
  } catch (error) {
    console.error("Network or other error:", error);
    throw error;
  }
}

// src/lib/server/userService.ts
// You'll need: npm i bcrypt @types/bcrypt
// Import your database client here (e.g., Prisma, Drizzle, Postgres.js)

export async function register(email: string, passwordRaw: string) {
  const response = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: passwordRaw }),
  });

  // The API should return the user object and a JWT/Session Token
  if (!response.ok) {
    // Read and return API error message
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }
  console.log(response.json);
  return response.json(); // { user: {...}, token: '...' }
}
export async function login(email: string, passwordRaw: string) {
  // 1. Find user
  // const user = await db.user.findUnique({ where: { email } });
  // if (!user) return null;

  // SIMULATION:
  const user = { id: "user_123", email, passwordHash: "$2b$10$..." };

  // 2. Compare password
  const isValid = await bcrypt.compare(passwordRaw, user.passwordHash);

  if (!isValid) return null;

  return { id: user.id, email: user.email, role: "USER" };
}
