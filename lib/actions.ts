"use server";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { authOption, getServerAuthSession } from "./auth";

export async function getUserSession() {
  const session = await getServerAuthSession();

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
