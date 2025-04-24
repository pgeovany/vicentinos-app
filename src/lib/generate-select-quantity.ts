export const generateQuantityOptions = (max = 10) => {
  return Array.from({ length: max }, (_, i) => i + 1);
};
