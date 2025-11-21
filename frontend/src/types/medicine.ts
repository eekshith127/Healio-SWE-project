export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  price: number;
  category: string;
  description: string;
  dosage: string;
  sideEffects: string[];
  prescriptionRequired: boolean;
  inStock: boolean;
}
