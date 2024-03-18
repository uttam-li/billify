'use client'

import { signIn, signOut, useSession } from "next-auth/react";
import { getServerAuthSession } from "../../lib/auth";

export default async function Home() {
  const session = await getServerAuthSession()
  console.log(session?.user?.name);
  return (
    <>
      <h1>Hello World</h1>
      <div>
        {session ? (
          <div>
            <button onClick={() => signOut()}>Sign-Out</button>
            <p>{session?.user?.email}</p>
          </div>
          
        ) : (
          <button onClick={() => signIn()}>Sign-In</button>
        )}
      </div>
    </>
  );
}
