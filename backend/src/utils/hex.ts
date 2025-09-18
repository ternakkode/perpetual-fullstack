import { randomBytes } from "crypto";

export const generateHexId = (): string => {
  return randomBytes(16).toString('hex');
}