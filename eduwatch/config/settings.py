# settings.py – Pydantic configuration loader

from pydantic import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    """Application configuration loaded from environment variables or a .env file.
    Add any new configuration values here and reference them throughout the project.
    """

    # Core settings
    PROJECT_NAME: str = "EduWatch AI"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False

    # Database settings (example – can be replaced with actual DB connection string)
    DATABASE_URL: str = "sqlite:///./eduwatch.db"

    # JWT settings
    JWT_SECRET_KEY: str = "super-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Encryption key for face embeddings (must be 32 bytes for AES‑256)
    ENCRYPTION_KEY: str = "32byteslongencryptionkey1234567890"

    class Config:
        env_file = Path(__file__).parent.parent / ".env"
        env_file_encoding = "utf-8"
        extra = "allow"

# Singleton instance for import convenience
settings = Settings()

from pydantic import BaseSettings, Field
from pathlib import Path

class Settings(BaseSettings):
    """Application configuration loaded from environment variables or a .env file.
    Add any new configuration values here and reference them throughout the project.
    """

    # Core settings
    PROJECT_NAME: str = Field(default="EduWatch AI", description="Project name")
    # pyrefly: ignore [unexpected-keyword]
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    # pyrefly: ignore [unexpected-keyword]
    DEBUG: bool = Field(default=False, env="DEBUG")

    # Database settings (example – can be replaced with actual DB connection string)
    # pyrefly: ignore [unexpected-keyword]
    DATABASE_URL: str = Field(default="sqlite:///./eduwatch.db", env="DATABASE_URL")

    # JWT settings
    # pyrefly: ignore [unexpected-keyword]
    JWT_SECRET_KEY: str = Field(default="super-secret-key", env="JWT_SECRET_KEY")
    # pyrefly: ignore [unexpected-keyword]
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    # pyrefly: ignore [unexpected-keyword]
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60, env="ACCESS_TOKEN_EXPIRE_MINUTES")

    # Encryption key for face embeddings (must be 32 bytes for AES‑256)
    # pyrefly: ignore [unexpected-keyword]
    ENCRYPTION_KEY: str = Field(default="32byteslongencryptionkey1234567890", env="ENCRYPTION_KEY")

    class Config:
        env_file = Path(__file__).parent.parent / ".env"
        env_file_encoding = "utf-8"

# Singleton instance for import convenience
settings = Settings()
