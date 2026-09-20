# API load test

`api-read-load.js` tests authenticated read endpoints only. It does not create, update, or delete financial data.

Run this against staging first, using a dedicated test account. Do not use a real customer account or run a large test against production without monitoring the API and database.

Install k6 from the official Grafana k6 installation guide, then run:

```powershell
k6 run -e BASE_URL=https://staging-api.example.com -e TEST_EMAIL=loadtest@example.com -e TEST_PASSWORD=replace-this load-tests/api-read-load.js
```

The default profile ramps to 5 virtual users for 30 seconds, then 20 users for two minutes. It fails when at least 1% of requests fail or when the 95th-percentile response time exceeds 700 ms. Adjust these thresholds only after recording a baseline and confirming your hosting and database capacity.
