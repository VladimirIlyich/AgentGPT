import { ENGLISH } from "./languages";
import type { ModelSettings } from "../types";
import { QWEN_35_FLASH } from "../types";

export const DEFAULT_LLM_MODEL = QWEN_35_FLASH;
export const LLM_MODEL_NAMES = [QWEN_35_FLASH, "qwen3.5-plus" as const, "qwen-max" as const];

export const DEFAULT_MAX_LOOPS_FREE = 25 as const;
export const DEFAULT_MAX_LOOPS_CUSTOM_API_KEY = 10 as const;

export const getDefaultModelSettings = (): ModelSettings => {
  return {
    customApiKey: "",
    language: ENGLISH,
    customModelName: QWEN_35_FLASH,
    customTemperature: 0.8,
    customMaxLoops: DEFAULT_MAX_LOOPS_FREE,
    maxTokens: 1250,
  };
};
