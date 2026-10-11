import type { ToolCopyMap } from "./types";
import { pdfToolsCopy } from "./pdf-tools";
import { imageToolsCopy } from "./image-tools";
import { textToolsCopy } from "./text-tools";
import { developerToolsCopy } from "./developer-tools";
import { seoToolsCopy } from "./seo-tools";
import { calculatorsCopy } from "./calculators";
import { unitConvertersCopy } from "./unit-converters";
import { aiToolsCopy } from "./ai-tools";
import { businessToolsCopy } from "./business-tools";
import { colorToolsCopy } from "./color-tools";
import { audioToolsCopy } from "./audio-tools";
import { videoToolsCopy } from "./video-tools";
import { networkToolsCopy } from "./network-tools";

export type { ToolCopy, ToolCopyMap } from "./types";

/** Hand-written page copy for every tool, keyed by tool slug. */
export const toolCopy: ToolCopyMap = {
  ...pdfToolsCopy,
  ...imageToolsCopy,
  ...textToolsCopy,
  ...developerToolsCopy,
  ...seoToolsCopy,
  ...calculatorsCopy,
  ...unitConvertersCopy,
  ...aiToolsCopy,
  ...businessToolsCopy,
  ...colorToolsCopy,
  ...audioToolsCopy,
  ...videoToolsCopy,
  ...networkToolsCopy,
};
