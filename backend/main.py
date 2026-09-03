from fastapi import FastAPI

app = FastAPI(
    title="CloudShield AI",
    description="Intelligent Cloud Security Monitoring Platform",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "project": "CloudShield AI",
        "status": "running",
        "message": "Cloud security monitoring platform is online"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }