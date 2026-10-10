export type UserRole =
  | "ATTENDEE"
  | "ORGANIZER"
  | "ADMIN";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  phone?: string | null;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  user: User;
};