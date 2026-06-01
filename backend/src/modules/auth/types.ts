export interface RegisterInput {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  organizationId: string;
  roleId: string;
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

export interface AuthResponseData {
  user: UserDTO;
  accessToken: string;
}
