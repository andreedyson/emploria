import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: string;
    image: string | null;
    createdAt: string | Date;
    companyId: string | null;
    departmentId: string | null;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    image: string | null;
    createdAt: string | Date;
    companyId: string | null;
    departmentId: string | null;
  }
}
