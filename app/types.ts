export interface AppContext {
  isLoggedIn: boolean;
  role: "client" | "facilitator";
  isAdmin: boolean;
  name: string;
  username: string;
  userId: string;
  avatar: string;
}
