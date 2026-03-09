export interface AppContext {
  isLoggedIn: boolean;
  role: "client" | "facilitator" | "admin";
  name: string;
  username: string;
  userId: string;
  avatar: string;
}
