export const sanitizeInput = (value = "") =>
  String(value)
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

