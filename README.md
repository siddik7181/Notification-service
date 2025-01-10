# Installation

## Run

```bash
docker-compose up -d
```

### Run stress test with k6

```bash
docker run --network notify --rm -i grafana/k6 run - <stress_test.js
```
