import http from "k6/http";
import { check, fail, sleep } from "k6";

const baseUrl = (__ENV.BASE_URL || "").replace(/\/$/, "");
const email = __ENV.TEST_EMAIL;
const password = __ENV.TEST_PASSWORD;

if (!baseUrl || !email || !password) {
  throw new Error("BASE_URL, TEST_EMAIL, and TEST_PASSWORD are required.");
}

export const options = {
  stages: [
    { duration: "30s", target: 5 },
    { duration: "2m", target: 20 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<700"],
  },
};

export function setup() {
  const response = http.post(
    `${baseUrl}/api/auth/login`,
    JSON.stringify({ email, password }),
    { headers: { "Content-Type": "application/json" }, tags: { name: "login" } },
  );

  if (!check(response, { "login succeeds": (res) => res.status === 200 })) {
    fail(`Login failed with HTTP ${response.status}.`);
  }

  return { token: response.json("token") };
}

export default function ({ token }) {
  const params = { headers: { Authorization: `Bearer ${token}` } };
  const requests = [
    ["transactions", `${baseUrl}/api/transactions`],
    ["budgets", `${baseUrl}/api/budgets`],
    ["expenses", `${baseUrl}/api/expenses`],
    ["goals", `${baseUrl}/api/goals`],
    ["categories", `${baseUrl}/api/categories`],
    ["profile settings", `${baseUrl}/api/profile/settings`],
  ];

  for (const [name, url] of requests) {
    const response = http.get(url, { ...params, tags: { name } });
    check(response, { [`${name} returns 200`]: (res) => res.status === 200 });
  }

  sleep(1);
}
