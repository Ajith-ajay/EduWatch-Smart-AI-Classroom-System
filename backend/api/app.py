from fastapi import FastAPI
from api.routes import router

app = FastAPI(title="EduWatch Backend")

app.include_router(router)