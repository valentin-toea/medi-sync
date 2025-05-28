export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: 'medic' | 'asistent' | 'rezident' | 'admin';
  specialty?: string; // Optional for non-medics
  phone?: string; // Optional
  parafa?: string; // Optional, only for medics
  cnp: string;
  firstName: string;
  lastName: string;
}
