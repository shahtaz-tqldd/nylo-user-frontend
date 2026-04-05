export const productName = (name?: string) => {
  return name?.split(" ").join("-").toLowerCase();
};
