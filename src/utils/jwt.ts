import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const KEY = new TextEncoder().encode(process.env.JWT_KEY);

export async function Sign(userId: number | undefined) {
  const jwt = await new SignJWT({ userId: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(KEY);

  return jwt;
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return false;

  return await decrypt(session);
}

async function decrypt(input: string) {
  try {
    const { payload } = await jwtVerify(input, KEY, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (err) {
    console.log("token tidak valid!");
    return false;
  }
}
