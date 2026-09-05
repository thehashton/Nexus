import { neon } from "@/lib/neon";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
};

export async function getSession() {
  return neon.auth.getSession();
}

export async function signIn(email: string, password: string) {
  return neon.auth.signIn.email({
    email,
    password,
    rememberMe: true,
  });
}

export async function signUp(email: string, password: string, name: string) {
  return neon.auth.signUp.email({
    email,
    password,
    name,
  });
}

export async function signOut() {
  return neon.auth.signOut();
}
