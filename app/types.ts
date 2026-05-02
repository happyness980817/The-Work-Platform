export interface AppContext {
  isLoggedIn: boolean;
  role: 'client' | 'facilitator';
  isEditor: boolean;
  name: string;
  userId: string;
  avatar: string;
}
