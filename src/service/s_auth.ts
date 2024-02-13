import { pb } from "./s_pb";

interface AuthUser {
  id: string;
  email: string;
}

export type AuthState = AuthUser | null;

export class AuthService {
  public static i = new AuthService();
  private constructor() {}

  async observe(
    data: (d?: AuthState) => void,
    error: (e: string) => void
  ): Promise<void> {
    pb.authStore.onChange(async (_) => data(await AuthService.i.get()));
    data(await AuthService.i.get());
  }

  async get(): Promise<AuthState> {
    if (!pb.authStore.isValid) return null;
    pb.authStore.isValid;
    return { id: pb.authStore.model.id, email: pb.authStore.model.email };
  }

  async logout() {
    await pb.authStore.clear();
  }

  async login() {
    await pb.collection("users").authWithOAuth2({ provider: "google" });
  }
}
