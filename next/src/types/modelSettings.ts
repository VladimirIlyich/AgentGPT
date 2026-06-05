import { type Language } from "../utils/languages";

export const [QWEN_35_FLASH, QWEN_35_PLUS, QWEN_MAX] = [
  "qwen3.5-flash" as const,
  "qwen3.5-plus" as const,
  "qwen-max" as const,
];
export const LLM_MODEL_NAMES = [QWEN_35_FLASH, QWEN_35_PLUS, QWEN_MAX];
export type LLMModelNames = "qwen3.5-flash" | "qwen3.5-plus" | "qwen-max";

/** @deprecated Use LLMModelNames */
export type GPTModelNames = LLMModelNames;

export const MAX_TOKENS: Record<LLMModelNames, number> = {
  "qwen3.5-flash": 8000,
  "qwen3.5-plus": 32000,
  "qwen-max": 8000,
};

export interface ModelSettings {
  language: Language;
  customApiKey: string;
  customModelName: LLMModelNames;
  customTemperature: number;
  customMaxLoops: number;
  maxTokens: number;
}
