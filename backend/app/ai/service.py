from app.config import settings
from app.ai.base import BaseAIProvider
from app.ai.mock_provider import MockProvider
from app.ai.watsonx_provider import WatsonxProvider

def get_ai_provider() -> BaseAIProvider:
    """
    Returns WatsonxProvider if valid credentials are set in .env,
    otherwise automatically falls back to MockProvider for offline demos.
    """
    if settings.WATSONX_API_KEY and settings.WATSONX_PROJECT_ID:
        try:
            return WatsonxProvider()
        except Exception as e:
            print(f"[AI Service] Could not initialize WatsonxProvider: {e}. Using MockProvider.")
            return MockProvider()
    return MockProvider()

ai_provider: BaseAIProvider = get_ai_provider()
