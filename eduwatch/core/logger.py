# pyrefly: ignore [missing-import]
from loguru import logger
import sys

# Configure logger: JSON output for structured logs, rotate daily, keep 7 days
logger.remove()
logger.add(sys.stdout, level="INFO", format="{time} | {level} | {message}", enqueue=True)
logger.add("logs/eduwatch.log", rotation="00:00", retention="7 days", level="DEBUG", serialize=True, enqueue=True)

# Expose a convenient function
def get_logger():
    return logger
