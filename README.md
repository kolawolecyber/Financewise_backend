# Financewise_backend
Financewise webApp backend to track down your expenses and save for the future

## Authentication

`POST /api/auth/login` sets the `financewise_token` HTTP-only cookie. The cookie is
`SameSite=Lax` by default and is marked `Secure` in production. The frontend must
send requests with credentials enabled (`credentials: "include"`); it should not
store an access token in `localStorage`. `POST /api/auth/logout` clears the cookie.

Bearer authorization remains accepted temporarily for existing clients migrating
to the cookie flow. Every protected controller scopes resource reads and writes to
the authenticated user's ID.

## Load testing

See [load-tests/README.md](load-tests/README.md) for the safe authenticated read-only k6 test.
