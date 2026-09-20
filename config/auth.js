const AUTH_COOKIE = "financewise_token";
const AUTH_MAX_AGE = 24 * 60 * 60 * 1000;
const validSameSiteValues = ["lax", "strict", "none"];

const getAuthCookieOptions = () => {
  const defaultSameSite = process.env.NODE_ENV === "production" ? "none" : "lax";
  const sameSite = (process.env.AUTH_COOKIE_SAMESITE || defaultSameSite).toLowerCase();
  if (!validSameSiteValues.includes(sameSite)) {
    throw new Error("AUTH_COOKIE_SAMESITE must be lax, strict, or none.");
  }

  return {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" || sameSite === "none",
  sameSite,
  maxAge: AUTH_MAX_AGE,
  path: "/",
  };
};

module.exports = { AUTH_COOKIE, AUTH_MAX_AGE, getAuthCookieOptions };