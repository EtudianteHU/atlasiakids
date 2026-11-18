export const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

export const formatEUR = (n) =>
  Number(n || 0).toFixed(2).replace(".", ",") + " €";

export const parsePrice = (price) => {
  if (price == null || price === "") return 0;
  return Number(String(price).replace(",", "."));
};
