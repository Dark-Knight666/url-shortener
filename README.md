# URL Shortener — HomeLab DevOps Capstone

Ein vollständiges DevOps-Projekt mit Next.js Frontend, FastAPI Backend und PostgreSQL Datenbank.
Deployed auf einem selbst aufgesetzten Kubernetes Cluster (kubeadm) in Hyper-V.

## Tech Stack

| Schicht | Technologie |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy, Python 3.12 |
| Datenbank | PostgreSQL 16 |
| Container | Docker, multi-stage builds |
| Orchestrierung | Kubernetes (kubeadm) |
| Ingress | Nginx Ingress Controller |
| CI/CD | Jenkins / GitHub Actions |

## EVA-Prinzip

- **Eingabe**: Langer URL wird eingegeben
- **Verarbeitung**: Backend generiert kurzen Code, speichert in PostgreSQL
- **Ausgabe**: Kurzer URL wird zurückgegeben und kann verwendet werden

## Projektstruktur

```
url-shortener/
├── frontend/          # Next.js App
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/app/
├── backend/           # FastAPI App
│   ├── Dockerfile
│   ├── .dockerignore
│   └── app/
├── k8s/               # Kubernetes Manifeste
│   ├── namespace.yaml
│   ├── postgres.yaml
│   ├── backend.yaml
│   ├── frontend.yaml
│   └── ingress.yaml
├── .gitignore
├── docker-compose.yml  # Lokale Entwicklung
└── README.md
```

## Lokale Entwicklung

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker-compose up -d
```

## Deployment auf Kubernetes

```bash
# 1. Namespace erstellen
kubectl apply -f k8s/namespace.yaml

# 2. Secrets anlegen (secrets.example.yaml kopieren und anpassen)
kubectl apply -f k8s/secrets.yaml

# 3. App deployen
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml

# 4. Status prüfen
kubectl get pods -n url-shortener
```
