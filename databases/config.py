import importlib
import os
from typing import Any


class Config:
    def __init__(self):
        self.PROFILE = os.getenv("PROFILE", "local")
        basic_application = importlib.import_module("config.application")
        self.config: dict = basic_application.config

    def get(self, key: str, default: Any = None) -> Any:
        return self.config.get(key, default)
