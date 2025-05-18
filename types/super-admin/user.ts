export type SuperAdminCompanyUserProps = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  image: string | null;
  createdAt: Date;
  company: {
    id?: string;
    name?: string;
  };
};
