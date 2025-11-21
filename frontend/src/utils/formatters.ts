export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // e.g., "10/1/2023"
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`; // e.g., "$50.00"
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};