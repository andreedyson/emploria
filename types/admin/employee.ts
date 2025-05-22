export type EmployeeColumnProps = {
  id: string;
  name: string;
  email: string;
  gender: string | null;
  position: string;
  isActive: boolean;
  image: string | null;
  phone: string | null;
  address: string | null;
  dateOfBirth: Date | null;
  department?: string;
  joinDate: Date;
};
