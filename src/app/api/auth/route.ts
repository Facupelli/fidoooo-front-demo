import { adminAuth } from "@/lib/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = cookies().get("session")?.value ?? "";

  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  const decodedClaims = await adminAuth.verifySessionCookie(session, true);

  if (!decodedClaims) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  return NextResponse.json({ isLogged: true }, { status: 200 });
}

export async function POST() {
  const authorization = headers().get("Authorization");

  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];

    if (!idToken) {
      throw new Error("Unauthorized");
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (decodedToken) {
      //Generate session cookie
      // const expiresIn = 60 * 60 * 24 * 5 * 1000;
      // const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      //   expiresIn,
      // });
      // const options = {
      //   name: "session",
      //   value: sessionCookie,
      //   maxAge: expiresIn,
      //   httpOnly: true,
      //   secure: true,
      // };

      cookies().set({
        name: "token",
        value: idToken,
        secure: true,
        // httpOnly: true,
      });
    }
  }

  return NextResponse.json({}, { status: 200 });
}

export async function DELETE() {
  const idToken = cookies().get("token");

  if (!idToken) {
    throw new Error("Unauthorized");
  }

  const decodedToken = await adminAuth.verifyIdToken(idToken.value);

  if (decodedToken) {
    cookies().delete({ name: "token" });
  }

  return NextResponse.json({}, { status: 200 });
}
