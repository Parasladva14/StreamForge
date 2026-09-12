from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "StreamForge"
    VERSION: str = "1.0.0"

    DATABASE_URL: str = "mysql+pymysql://root:root@localhost:3306/streamforge"

    KAFKA_BOOTSTRAP_SERVER: str = "localhost:9092"
    KAFKA_TOPIC_TEMPERATURE: str = "truck-temperature"
    KAFKA_TOPIC_EVENTS: str = "fleet-events"

    SECRET_KEY: str = "streamforge_secret_key_change_in_production_fleet_monitoring"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

    class Config:
        env_file = ".env"
        extra = "allow"

    @property
    def cors_origins_list(self) -> list[str]:
        if not self.CORS_ORIGINS or self.CORS_ORIGINS.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()