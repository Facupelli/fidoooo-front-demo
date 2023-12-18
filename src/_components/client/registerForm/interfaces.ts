export interface RegisterAsCollaboratorForm {
  firstName: string;
  lastName: string;
  cuil: string;
  birthday: string;
  city: string;
  country: string;
  email: string;
  phoneNumber: string;
  password: string;
  repeatPassword: string;
  files?: File[];
}
