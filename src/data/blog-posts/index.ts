import type { BlogPost } from "@/types/blog";
import { pdfToolsPosts } from "./pdf-tools";
import { imageToolsPosts } from "./image-tools";
import { developerToolsPosts } from "./developer-tools";
import { seoToolsPosts } from "./seo-tools";
import { financePosts } from "./finance";
import { businessPosts } from "./business";
import { aiToolsPosts } from "./ai-tools";
import { audioToolsPosts } from "./audio-tools";
import { textToolsPosts } from "./text-tools";
import { imageToolsPillarPosts } from "./image-tools-pillar";
import { pdfToolsPillarPosts } from "./pdf-tools-pillar";
import { developerToolsPillarPosts } from "./developer-tools-pillar";

export { pdfToolsPosts, imageToolsPosts, developerToolsPosts, seoToolsPosts, financePosts, businessPosts, aiToolsPosts, audioToolsPosts, textToolsPosts };
export { imageToolsPillarPosts, pdfToolsPillarPosts, developerToolsPillarPosts };

export const allBlogPosts: BlogPost[] = [
  ...pdfToolsPosts,
  ...pdfToolsPillarPosts,
  ...imageToolsPosts,
  ...imageToolsPillarPosts,
  ...developerToolsPosts,
  ...developerToolsPillarPosts,
  ...seoToolsPosts,
  ...financePosts,
  ...businessPosts,
  ...aiToolsPosts,
  ...audioToolsPosts,
  ...textToolsPosts,
];
