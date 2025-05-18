export type SuperAdminCompanyUserProps = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  image: string | null;
  company: {
    id?: string;
    name?: string;
  };
};
