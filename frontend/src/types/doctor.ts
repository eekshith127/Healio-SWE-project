export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience?: string;
  qualification?: string;
  description?: string;
}