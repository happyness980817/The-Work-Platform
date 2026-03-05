export interface AppContext {
  isLoggedIn: boolean;
  role: "client" | "facilitator" | "admin";
  name: string;
  userId: string;
  avatar: string;
}
