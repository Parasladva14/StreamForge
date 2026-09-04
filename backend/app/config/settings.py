from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "StreamForge"
    VERSION: str = "1.0.0"

    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/streamforge"

    KAFKA_BOOTSTRAP_SERVER: str = "localhost:9092"

    class Config:
        env_file = ".env"


settings = Settings()