const AUTH_COOKIE = "financewise_token";
const AUTH_MAX_AGE = 24 * 60 * 60 * 1000;

const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.AUTH_COOKIE_SAMESITE || "lax",
  maxAge: AUTH_MAX_AGE,
  path: "/",
});

module.exports = { AUTH_COOKIE, AUTH_MAX_AGE, getAuthCookieOptions };