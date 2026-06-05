import pytest

from reworkd_platform.schemas.agent import ModelSettings


@pytest.mark.parametrize(
    "settings",
    [
        {
            "model": "qwen-max",
            "max_tokens": 7000,
            "temperature": 0.5,
            "language": "french",
        },
        {
            "model": "qwen3.5-flash",
            "max_tokens": 3000,
        },
        {
            "model": "qwen3.5-plus",
            "max_tokens": 16000,
        },
    ],
)
def test_model_settings_valid(settings):
    result = ModelSettings(**settings)
    assert result.model == settings.get("model", "qwen3.5-flash")
    assert result.max_tokens == settings.get("max_tokens", 500)
    assert result.temperature == settings.get("temperature", 0.9)
    assert result.language == settings.get("language", "English")


@pytest.mark.parametrize(
    "settings",
    [
        {
            "model": "gpt-4-32k",
        },
        {
            "temperature": -1,
        },
        {
            "max_tokens": 8000,
        },
        {
            "model": "qwen-max",
            "max_tokens": 32000,
        },
    ],
)
def test_model_settings_invalid(settings):
    with pytest.raises(Exception):
        ModelSettings(**settings)


def test_model_settings_default():
    settings = ModelSettings(**{})
    assert settings.model == "qwen3.5-flash"
    assert settings.temperature == 0.9
    assert settings.max_tokens == 500
    assert settings.language == "English"
