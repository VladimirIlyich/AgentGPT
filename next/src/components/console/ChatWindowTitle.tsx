import React from "react";

import type { LLMModelNames } from "../../types";
import { QWEN_35_PLUS, QWEN_MAX } from "../../types";

export const ChatWindowTitle = ({ model }: { model: LLMModelNames }) => {
  if (model === QWEN_MAX) {
    return (
      <>
        Agent<span className="text-amber-500">Qwen-Max</span>
      </>
    );
  }

  if (model === QWEN_35_PLUS) {
    return (
      <>
        Agent
        <span className="text-neutral-400">
          Qwen<span className="text-amber-500">3.5-Plus</span>
        </span>
      </>
    );
  }

  return (
    <>
      Agent<span className="text-neutral-400">Qwen3.5-Flash</span>
    </>
  );
};
