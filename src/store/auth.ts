import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { Models, ID, AppwriteException } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydreated: boolean;
  setHydrayed(): void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<{ success: boolean; error?: AppwriteException | null }>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydreated: false,
      setHydrayed() {
        set({ hydreated: true });
      },
      async verifySession() {
        try {
          const session = await account.getSession("current");
          set({ session });
        } catch (error: any) {
          console.log(`verfying session : `, error.message);
        }
      },
      async login(email, password) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserPrefs>({
              reputation: 0,
            });
          }

          set({ session, user, jwt });
          return { success: true };
        } catch (error: any) {
          console.log(`login : `, error.message);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
      async createAccount(name, email, password) {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error: any) {
          console.log(`register : `, error.message);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
      async logout() {
        try {
          await account.deleteSessions();
          set({ user: null, jwt: null, session: null });
          return { success: true };
        } catch (error: any) {
          console.log(`logout : `, error.message);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) {
            state?.setHydrayed();
          }
        };
      },
    }
  )
);
