export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  organizationId: string;
  createdAt: Date;
}
