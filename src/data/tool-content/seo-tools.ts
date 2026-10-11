import type { ToolCopyMap } from "./types";

export const seoToolsCopy: ToolCopyMap = {
  "meta-tag-generator": {
    intro:
      "Meta Tag Generator builds the block of tags that belongs in the head of a web page. Fill in the page title, description, keywords, author, page URL, share image, site name and Twitter handle, and it writes the standard meta tags together with the matching Open Graph and Twitter Card tags.\n\nYou also choose the robots directive, from index, follow to noindex, nofollow, and the Open Graph type: website, article, product or profile. The output updates as you type and is copied with one click, ready to paste into your template.",
    steps: [
      ["Fill in the page details", "Title and description are required; the rest are optional."],
      ["Choose robots and OG type", "Leave index, follow unless the page should stay out of search."],
      ["Copy the tags", "Paste them inside the head element of the page."],
    ],
    faqs: [
      ["Does the keywords meta tag still help rankings?", "No. Google has ignored it for many years. It does no harm, but your time is better spent on the title and description."],
      ["What size should the share image be?", "1200 by 630 pixels works for Facebook, LinkedIn, WhatsApp and large X cards."],
      ["Where do these tags go?", "Inside the head section of the HTML, on every page, with values specific to that page."],
    ],
    uses: [
      "Setting up tags for a new landing page",
      "Adding social share tags to a static site",
      "Creating a noindex block for thank-you and admin pages",
    ],
  },
  "robots-txt-generator": {
    intro:
      "Robots.txt Generator writes a robots.txt file from rules you build in a form. Each rule targets a user agent, either all crawlers or a specific one such as Googlebot, Bingbot, DuckDuckBot, Baiduspider or YandexBot, and lists the paths to allow and disallow, one per line.\n\nAdd as many rule groups as you need, then set the sitemap URL and an optional crawl delay. The finished file is shown below and can be copied. Save it as robots.txt in the root of your domain so it is reachable at yourdomain.com/robots.txt.",
    steps: [
      ["Add a rule", "Pick a user agent and enter allow and disallow paths."],
      ["Add the sitemap", "Enter the full URL of your XML sitemap."],
      ["Copy and upload", "Save the output as robots.txt at the site root."],
    ],
    faqs: [
      ["Does Disallow remove a page from Google?", "No. It stops crawling, but a blocked URL can still be indexed if other sites link to it. Use a noindex tag to keep a page out of results, and do not block that page in robots.txt or Google will never see the tag."],
      ["Does Google respect Crawl-delay?", "No. Googlebot ignores it. Bing and Yandex honour it."],
      ["Can robots.txt protect private content?", "No. The file is public and only advisory. Use authentication for anything sensitive."],
    ],
    uses: [
      "Keeping admin and cart URLs out of the crawl",
      "Pointing crawlers to a new sitemap",
      "Writing separate rules for one specific bot",
    ],
  },
  "keyword-density-checker": {
    intro:
      "Keyword Density Checker counts how often each word and phrase appears in a piece of text. Paste an article and it reports total words, characters and sentences, then lists the most frequent single words, two-word phrases and three-word phrases with their count and percentage.\n\nCommon stop words such as the, and, of are hidden by default so the real topics stand out; a toggle brings them back. A minimum word length setting filters out short words. Use the results to see what a page is actually about, and to spot a phrase that has been repeated too often.",
    steps: [
      ["Paste your content", "The body text of the page or draft."],
      ["Adjust the filters", "Set minimum word length and choose whether to show stop words."],
      ["Review the tables", "Check single words, bigrams and trigrams."],
    ],
    faqs: [
      ["What is a good keyword density?", "There is no target number. Search engines do not reward a particular percentage. Write naturally and use the tool to catch obvious over-repetition."],
      ["What are bigrams and trigrams?", "Phrases of two and three consecutive words. They reveal topics better than single words do."],
      ["Can it analyse a URL?", "No. Paste the text. That also lets you check drafts before they are published."],
    ],
    uses: [
      "Checking a draft for an over-used phrase",
      "Comparing your topic coverage with a competing article",
      "Finding the main themes in a long document",
    ],
  },
  "sitemap-generator": {
    intro:
      "Sitemap Generator builds a valid XML sitemap from a list of URLs you supply. Add pages one at a time, or open the bulk input and paste many URLs at once, one per line. Each entry can carry a priority from 0.1 to 1.0, a change frequency and a last-modified date.\n\nThe XML is previewed live and can be copied or downloaded as sitemap.xml. The tool does not crawl your website to discover pages; it formats the URLs you give it. Upload the file to your site root and submit it in Google Search Console.",
    steps: [
      ["Add your URLs", "Individually, or paste a list in bulk."],
      ["Set the optional fields", "Priority, change frequency and last modified."],
      ["Download sitemap.xml", "Upload it to your site and submit it to search engines."],
    ],
    faqs: [
      ["Does it crawl my site to find pages?", "No. You provide the URLs. Export them from your CMS or a crawler if you have many."],
      ["Do priority and changefreq matter?", "Google ignores both. It does use lastmod when the dates are accurate."],
      ["How many URLs can one sitemap hold?", "50,000 URLs or 50 MB uncompressed. Larger sites need several sitemaps and a sitemap index."],
    ],
    uses: [
      "Creating a sitemap for a small static website",
      "Listing new pages you want crawled quickly",
      "Producing a sitemap for a site whose CMS does not generate one",
    ],
  },
  "open-graph-tester": {
    intro:
      "Open Graph Tester shows how a link will look when it is shared. Enter the title, description, image URL, page URL, site name and type, and the tool draws preview cards in the style of Facebook and LinkedIn and of X (Twitter).\n\nIt is a preview of the values you type, which makes it ideal for testing wording and image crops before a page is published. It does not fetch a live URL to read its tags; use the Website Metadata Extractor for that.",
    steps: [
      ["Enter the Open Graph values", "Title, description, image URL and page URL."],
      ["Check the previews", "See how each network truncates the text."],
      ["Adjust and reuse", "Refine the wording, then put the same values in your page."],
    ],
    faqs: [
      ["What image size should I use?", "1200 by 630 pixels, with the important content away from the edges."],
      ["Why does a network show an old image after I change it?", "Networks cache previews. Use Facebook's Sharing Debugger or LinkedIn's Post Inspector to refresh the cache."],
      ["Do I need separate Twitter tags?", "X falls back to Open Graph tags, but you still need twitter:card to choose the card layout."],
    ],
    uses: [
      "Testing a headline before a campaign goes live",
      "Checking how long a description can be before it is cut",
      "Showing a client what a shared link will look like",
    ],
  },
  "meta-tag-analyzer": {
    intro:
      "Meta Tag Analyzer reads the HTML you paste and reports on the tags that matter for search and sharing. It extracts the title, meta description, robots and viewport tags, and the Open Graph title and description, then marks each as good, needing attention or missing, with the recommended length beside it.\n\nBecause it works on pasted source, it can check pages that are not public yet, such as a local build or a staging site behind a login. Copy the head section from View Source and paste it in.",
    steps: [
      ["Copy the page's head HTML", "Use View Source in your browser."],
      ["Paste and analyse", "Press Analyze Meta Tags."],
      ["Fix what is flagged", "Each check explains what is expected."],
    ],
    faqs: [
      ["Can I enter a URL instead?", "Not in this tool. Paste HTML, or use the Website Metadata Extractor to fetch a live page."],
      ["What title length is recommended?", "About 50 to 60 characters so it is not cut off in results."],
      ["Why is viewport checked?", "Without a viewport tag a page is not mobile-friendly, which affects how it is ranked on phones."],
    ],
    uses: [
      "Auditing a template before launch",
      "Checking a staging page that search tools cannot reach",
      "Reviewing a competitor's tags from their page source",
    ],
  },
  "title-tag-checker": {
    intro:
      "Title Tag Length Checker measures a page title and tells you whether it fits the space search engines give it. Type or paste the title and the character count updates immediately, with a warning when it exceeds 60 characters.\n\nAlongside the length it runs a few basic checks, such as stray whitespace and whether the title carries a brand or keyword. The title is the single most visible part of a search listing, so getting it to fit without truncation is worth a minute.",
    steps: [
      ["Enter the title", "Paste the text of your title tag."],
      ["Read the length", "Aim for 50 to 60 characters."],
      ["Edit until it fits", "Put the most important words first."],
    ],
    faqs: [
      ["Is the limit really 60 characters?", "The true limit is a pixel width of roughly 600 pixels, so wide letters use more room. 50 to 60 characters is a reliable guide."],
      ["Will Google always show my title?", "No. It sometimes rewrites titles, especially ones that are very long, stuffed with keywords or unlike the page content."],
      ["Should the brand go first or last?", "Last for most pages, so the topic leads. First on the home page."],
    ],
    uses: [
      "Trimming a blog post title to avoid truncation",
      "Checking product titles before a bulk upload",
      "Standardising a title format across a site",
    ],
  },
  "meta-description-checker": {
    intro:
      "Meta Description Length Checker counts the characters in a meta description and rates it against the 150 to 160 character range that generally displays in full. It also checks that the description is not empty and looks for action words that invite a click.\n\nA meta description does not affect ranking directly. Its job is to persuade a searcher to choose your result, which makes it a small piece of advertising copy for each page.",
    steps: [
      ["Paste the description", "The content of your meta description tag."],
      ["Check the count", "Aim for 150 to 160 characters."],
      ["Refine the wording", "Lead with the benefit and include a call to action."],
    ],
    faqs: [
      ["Does the description affect rankings?", "Not directly, but a better description earns more clicks."],
      ["Why did Google show different text?", "Google often builds its own snippet from page content when it judges that a better match for the query."],
      ["Should every page have a unique description?", "Yes. Duplicates waste the opportunity and are flagged in audits."],
    ],
    uses: [
      "Writing descriptions for new pages",
      "Fixing truncated descriptions found in an audit",
      "Checking lengths before a CMS import",
    ],
  },
  "serp-snippet-preview": {
    intro:
      "SERP Snippet Preview mocks up a Google desktop search result from a title, URL and meta description. As you edit the three fields the preview redraws, so you can judge how the listing reads as a whole and where text would be cut.\n\nSeeing the title, address and description together is more useful than counting characters alone: it shows whether the title and description repeat each other, and whether the first words give a reason to click.",
    steps: [
      ["Enter title, URL and description", "Use your real page values."],
      ["Study the preview", "Look for truncation and repetition."],
      ["Rewrite and compare", "Edit until the listing reads cleanly."],
    ],
    faqs: [
      ["Is the preview exactly what Google will show?", "No. It is an approximation. Google may rewrite titles and descriptions and changes its layout often."],
      ["Does it show the mobile layout?", "The preview follows the desktop layout. Mobile results wrap differently."],
      ["How is the URL displayed in Google?", "As a breadcrumb-style path, so short, readable URLs look better."],
    ],
    uses: [
      "Comparing two versions of a title",
      "Presenting proposed metadata to a client",
      "Checking a listing before publishing",
    ],
  },
  "schema-validator": {
    intro:
      "Schema Markup Validator checks a block of JSON-LD structured data. It first confirms the JSON parses, then looks for the @context and @type properties and runs type-specific checks: a Product should have a name and offers, an Article needs a headline and should name an author.\n\nIt is a quick first-pass check that catches syntax errors and the most commonly missing fields. It does not test every Schema.org rule or Google's full rich-result requirements, so finish with Google's Rich Results Test.",
    steps: [
      ["Paste JSON-LD", "Without the surrounding script tags."],
      ["Validate", "Press Validate Schema."],
      ["Fix flagged items", "Syntax errors must be fixed first."],
    ],
    faqs: [
      ["Does passing here guarantee rich results?", "No. Rich results depend on Google's own requirements and on page quality."],
      ["Why does it report invalid JSON?", "Usually a trailing comma, an unescaped quote inside text, or a missing bracket."],
      ["Which schema types are checked in detail?", "Product and Article have specific checks; other types get the general checks."],
    ],
    uses: [
      "Catching a syntax error before deploying markup",
      "Checking hand-edited JSON-LD",
      "Reviewing schema generated by a plugin",
    ],
  },
  "robots-txt-tester": {
    intro:
      "Robots.txt Tester tells you whether a URL path is allowed or blocked by a robots.txt file. Paste the file contents, enter a path such as /admin/page, choose a user agent, and it reports the verdict and the rule that decided it.\n\nMatching follows the rules Google documents: the most specific user-agent group applies, the longest matching path wins, and Allow wins a tie. The * wildcard and the $ end-of-URL anchor are supported. Test changes here before uploading them, because a mistaken Disallow can remove a whole section from search.",
    steps: [
      ["Paste your robots.txt", "The whole file."],
      ["Enter a path and user agent", "For example /blog/post and Googlebot."],
      ["Read the result", "Allowed or blocked, with the matching rule."],
    ],
    faqs: [
      ["Which rule wins when Allow and Disallow both match?", "The one with the longer path. If they are the same length, Allow wins."],
      ["Does a Googlebot group combine with the * group?", "No. A crawler follows only the most specific group that names it."],
      ["Can it fetch my live robots.txt?", "No. Paste the contents so you can also test a draft."],
    ],
    uses: [
      "Confirming a new Disallow does not block key pages",
      "Debugging a page reported as blocked in Search Console",
      "Checking wildcard rules before deployment",
    ],
  },
  "sitemap-validator": {
    intro:
      "Sitemap Validator checks the XML of a sitemap you paste. It verifies that the document is well-formed, that the sitemap namespace is declared, that at least one URL is present, that the total stays within the 50,000 URL limit, and that every url entry contains a loc element.\n\nA single unescaped ampersand or unclosed tag makes a whole sitemap unreadable to search engines, and this check finds that kind of fault in seconds. It validates structure; it does not request each URL to see whether it works.",
    steps: [
      ["Paste the sitemap XML", "The contents of sitemap.xml."],
      ["Validate", "Press Validate Sitemap."],
      ["Fix reported problems", "XML syntax errors come first."],
    ],
    faqs: [
      ["Why is my sitemap invalid XML?", "The usual cause is an ampersand in a URL, which must be written as &amp;."],
      ["Does it check that URLs return 200?", "No. It checks the file format only."],
      ["Can it validate a sitemap index?", "It is designed for standard URL sitemaps."],
    ],
    uses: [
      "Checking a hand-built sitemap before submitting",
      "Finding why Search Console cannot read a sitemap",
      "Verifying generator output",
    ],
  },
  "hreflang-generator": {
    intro:
      "Hreflang Generator writes the link tags that tell search engines which language or regional version of a page to show to which audience. Add a row for each version with its language code and URL, include an x-default for everyone else, and copy the generated tags.\n\nHreflang only works when it is reciprocal: every version must list all the versions, including itself. Paste the same full set of tags into the head of each page in the group.",
    steps: [
      ["Add each language version", "Choose the code and enter the URL."],
      ["Add x-default", "The fallback for unmatched languages."],
      ["Copy to every version", "The same set goes on all the pages."],
    ],
    faqs: [
      ["What is x-default for?", "It names the page to show users whose language or region matches none of the listed versions."],
      ["What format are the codes?", "A two-letter ISO 639-1 language, optionally followed by a region, such as en-GB or es-MX."],
      ["Why is my hreflang being ignored?", "Most often the return links are missing, or the URLs redirect or are not canonical."],
    ],
    uses: [
      "Launching a translated version of a site",
      "Separating US and UK English pages",
      "Fixing wrong-country results in search",
    ],
  },
  "schema-generator": {
    intro:
      "Schema Markup Generator creates JSON-LD structured data for five common types: FAQ, Article, Product, Organization and Local Business. Choose a type, complete the form for it, and press Generate to get markup built on Schema.org vocabulary.\n\nEmpty fields are left out of the result so the output stays clean. You can copy plain JSON or copy it already wrapped in script tags for pasting straight into a page. Structured data helps search engines understand a page and is a requirement for most rich results.",
    steps: [
      ["Choose a schema type", "FAQ, Article, Product, Organization or Local Business."],
      ["Fill in the fields", "Only completed fields are included."],
      ["Generate and copy", "Paste the script into your page's HTML."],
    ],
    faqs: [
      ["Where should JSON-LD go?", "Anywhere in the HTML; the head is conventional."],
      ["Will markup guarantee a rich result?", "No. It makes a page eligible. Google decides whether to show one."],
      ["Can I mark up content that is not on the page?", "No. Structured data must describe content visitors can see, or it risks a manual action."],
    ],
    uses: [
      "Adding product markup to a shop page",
      "Describing a local business with opening hours",
      "Marking up an article for better understanding by search engines",
    ],
  },
  "faq-schema-generator": {
    intro:
      "FAQ Schema Generator turns a list of questions and answers into FAQPage JSON-LD. Add as many pairs as you need and the markup is assembled for you, ready to copy with or without its script wrapper.\n\nThe questions and answers in the markup must match what is visible on the page. Note that since 2023 Google shows FAQ rich results only for well-known government and health sites; the markup is still valid and still helps machines read your content, but most sites should not expect expandable FAQs in results.",
    steps: [
      ["Add questions and answers", "One pair per row."],
      ["Copy the JSON-LD", "Choose the wrapped version to paste directly."],
      ["Add it to the page", "The same Q&A must be visible to visitors."],
    ],
    faqs: [
      ["Will I get FAQ rich results?", "Probably not. Google restricted them to authoritative government and health websites in 2023."],
      ["Is it still worth adding?", "It does no harm and gives search engines and AI systems a clean question-and-answer structure."],
      ["Can answers contain links?", "Yes. Basic HTML such as links and lists is permitted in answers."],
    ],
    uses: [
      "Marking up a support or help page",
      "Structuring product questions",
      "Preparing content for answer engines",
    ],
  },
  "article-schema-generator": {
    intro:
      "Article Schema Generator produces JSON-LD for written content. Select Article, BlogPosting or NewsArticle, then enter the headline, description, author, page URL, featured image, publication and modification dates, and the publisher's name and logo.\n\nThis markup tells search engines precisely who wrote a piece, who published it and when, instead of leaving them to infer it from the layout. Accurate dates and a named author are worth the effort.",
    steps: [
      ["Pick the article type", "Article, BlogPosting or NewsArticle."],
      ["Enter the details", "Headline, author, dates, image and publisher."],
      ["Copy the markup", "Paste it into the article page."],
    ],
    faqs: [
      ["Which type should I choose?", "BlogPosting for blog posts, NewsArticle for news reporting, Article for anything else."],
      ["What date format is required?", "ISO 8601, for example 2026-03-14, ideally with a time and time zone."],
      ["Should dateModified change on every edit?", "Only when the content changes meaningfully."],
    ],
    uses: [
      "Adding markup to blog posts",
      "Clarifying authorship for editorial content",
      "Keeping published and updated dates consistent in search",
    ],
  },
  "organization-schema-generator": {
    intro:
      "Organization Schema Generator creates JSON-LD describing a company or brand: its name, website, logo, description, phone, email and postal address, plus a list of social profile URLs output as sameAs links.\n\nPlaced on the home page, this markup helps search engines connect your website with your official profiles and can inform the knowledge panel shown for brand searches. Use the exact name and logo you use everywhere else.",
    steps: [
      ["Enter organisation details", "Name, URL, logo and contact information."],
      ["Add social profiles", "One URL per row."],
      ["Copy and place", "Add it to the home page only."],
    ],
    faqs: [
      ["Which pages need Organization schema?", "The home page is enough. Repeating it everywhere adds nothing."],
      ["What is sameAs?", "A list of other URLs that represent the same organisation, such as LinkedIn or Wikipedia pages."],
      ["Should a shop with a street address use this?", "A business that serves customers at a location is better described with LocalBusiness."],
    ],
    uses: [
      "Establishing a brand entity for a new website",
      "Linking official social accounts to a domain",
      "Supplying a logo for search results",
    ],
  },
  "redirect-checker": {
    intro:
      "Redirect Checker shows where a URL ends up. Enter an address and the tool requests it through an external service, follows any redirects and reports the starting URL and the final destination, or confirms that the URL loads directly.\n\nIt answers the practical question of whether an old link reaches the right page. It reports the start and end points and does not list every intermediate hop or the exact status code of each one. Because the request is made by a third-party service, sites that block automated requests cannot be checked.",
    steps: [
      ["Enter a URL", "Include https://."],
      ["Run the check", "Wait while redirects are followed."],
      ["Compare start and finish", "Confirm the destination is the page you expect."],
    ],
    faqs: [
      ["Does it show whether a redirect is 301 or 302?", "No. For exact status codes use your browser's network panel or the command curl -I."],
      ["What is the difference between 301 and 302?", "301 is permanent and passes ranking signals to the new URL. 302 is temporary."],
      ["Why can't a URL be checked?", "The site is blocking the external service, or it is not publicly reachable."],
    ],
    uses: [
      "Verifying redirects after a site migration",
      "Finding where a shortened link leads",
      "Checking that http and non-www versions resolve to one address",
    ],
  },
  "canonical-tag-checker": {
    intro:
      "Canonical Tag Checker fetches a public page and reads its rel=canonical link. It shows the URL you checked, the final URL after redirects, the canonical value, and whether the canonical points to the page itself.\n\nThe canonical tag tells search engines which address is the main version when the same content is reachable at several URLs, for example with tracking parameters. A missing or wrong canonical is a common cause of the wrong URL appearing in search. Pages are fetched through an external service, so sites that block such requests cannot be checked.",
    steps: [
      ["Enter a page URL", "A publicly accessible address."],
      ["Check", "The page is fetched and parsed."],
      ["Read the result", "Self-referencing, pointing elsewhere, or missing."],
    ],
    faqs: [
      ["Should every page have a canonical tag?", "Yes. A self-referencing canonical on each indexable page is good practice."],
      ["Is a canonical a command?", "No. It is a strong hint that Google can override if other signals disagree."],
      ["Can a canonical point to another domain?", "Yes. Cross-domain canonicals are used for syndicated content."],
    ],
    uses: [
      "Diagnosing duplicate-content warnings",
      "Checking parameter URLs after a template change",
      "Confirming syndicated articles credit the original",
    ],
  },
};
