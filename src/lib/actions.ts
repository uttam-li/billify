"use server";

import { authOption, getServerAuthSession } from "./auth";
import { db } from "./db";

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

export async function getUserOrganization() {
  let session = 'data'
  return {
    // props: {
      session
    // }
  }
}