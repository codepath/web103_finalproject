import { countryCurrency } from "../data/countryCurrency.js";

// Returns the ISO 4217 currency code for a country name, or null if unrecognized.
const getCurrencyForCountry = (country) => {
  if (typeof country !== "string") return null;
  return countryCurrency[country.trim().toLowerCase()] ?? null;
};

export { getCurrencyForCountry };
