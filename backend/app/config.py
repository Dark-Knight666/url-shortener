from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    BASE_URL: str = "http://localhost:3000"
    APP_ENV: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
