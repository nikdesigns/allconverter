import type { ToolCopyMap } from "./types";

export const developerToolsCopy: ToolCopyMap = {
  "json-formatter": {
    intro:
      "JSON Formatter parses JSON and prints it back either beautified, with an indent width you choose, or minified onto a single line. It runs live: as you type or paste, the output and a Valid JSON or JSON Error indicator update together.\n\nParsing uses the browser's strict JSON parser, so the tool accepts exactly what JSON.parse accepts. Comments, trailing commas and single-quoted strings are reported as errors, with the parser's message telling you where it stopped. A Sample button loads example data if you want to see the output first.",
    steps: [
      ["Paste JSON", "Put your data in the input pane."],
      ["Choose the output", "Beautify with 2 or 4 spaces, or Minify."],
      ["Copy", "Copy the formatted result."],
    ],
    faqs: [
      ["Why is my JSON reported as invalid?", "The most common causes are a trailing comma, single quotes instead of double quotes, unquoted keys, or a comment."],
      ["Does it support JSON5 or comments?", "No. Only standard JSON is accepted."],
      ["Does formatting change my data?", "No. Only whitespace changes. Key order and values are preserved."],
    ],
    uses: [
      "Reading a minified API response",
      "Finding the syntax error in a config file",
      "Minifying JSON before embedding it in code",
    ],
  },
  "base64-encoder": {
    intro:
      "Base64 Encoder / Decoder converts text to Base64 and back. Encoding handles UTF-8 properly, so accented letters, non-Latin scripts and emoji survive the round trip instead of turning into question marks.\n\nThe conversion is live, and a Swap button moves the output into the input and flips the direction, which is handy for checking a result. Base64 makes binary-unsafe content safe to carry inside text formats such as JSON, URLs and email; it adds about a third to the length and provides no secrecy.",
    steps: [
      ["Pick a direction", "Encode or Decode."],
      ["Enter the text", "Output appears as you type."],
      ["Copy or swap", "Copy the result, or swap to reverse it."],
    ],
    faqs: [
      ["Is Base64 a form of encryption?", "No. It is a reversible encoding that anyone can decode."],
      ["Why does decoding fail?", "The input contains characters outside the Base64 alphabet, has lost its = padding, or is URL-safe Base64 using - and _ in place of + and /."],
      ["Can it encode files?", "This tool works on text. Use Image to Base64 for image files."],
    ],
    uses: [
      "Building a Basic authentication header",
      "Decoding a value found in a config or token",
      "Embedding small text payloads in a URL or JSON field",
    ],
  },
  "url-encoder": {
    intro:
      "URL Encoder / Decoder percent-encodes text for use in web addresses and decodes it again. Two encoding modes cover the two situations you meet in practice. The default keeps the characters that give a URL its structure, such as slashes, colons and question marks, and is right for cleaning up a whole address. Ticking 'Encode all characters' also escapes those, which is what you need for a single query parameter value.\n\nResults update live and a Swap button reverses the operation.",
    steps: [
      ["Choose encode or decode", "Select the direction."],
      ["Paste the text or URL", "Tick 'Encode all characters' when encoding a parameter value."],
      ["Copy the result", "Use the copy button."],
    ],
    faqs: [
      ["When do I need to encode everything?", "When the text is going inside a parameter, for example a URL passed as a redirect target. Otherwise its own ? and & would break the outer URL."],
      ["Why is a space sometimes + and sometimes %20?", "%20 is the general URL encoding. The plus sign is a form-submission convention used only in query strings."],
      ["What causes a 'malformed' decode error?", "A percent sign that is not followed by two hexadecimal digits."],
    ],
    uses: [
      "Passing a return URL as a query parameter",
      "Reading an encoded link from a log",
      "Fixing links that contain spaces or non-Latin characters",
    ],
  },
  "uuid-generator": {
    intro:
      "UUID Generator creates up to 50 identifiers at a time in three kinds. Version 4 is fully random and is the right choice in almost every case. Version 1 is time-based; this implementation builds it from the current time and random bytes, without a network card address. Nil gives the all-zeros UUID used as a placeholder.\n\nRandom values come from the browser's cryptographic generator. Options let you output uppercase letters or strip the dashes, and you can copy one identifier or the whole list.",
    steps: [
      ["Choose a version", "v4, v1 or nil."],
      ["Set count and format", "Enter 1 to 50 and choose uppercase or no-dash output if needed."],
      ["Copy", "Copy single UUIDs or all of them."],
    ],
    faqs: [
      ["Can two v4 UUIDs collide?", "In theory, but with 122 random bits the chance is negligible for any realistic volume."],
      ["Should I use v1 or v4?", "v4 unless you specifically need identifiers that sort roughly by creation time."],
      ["Is a GUID the same as a UUID?", "Yes. GUID is Microsoft's name for the same 128-bit format."],
    ],
    uses: [
      "Creating primary keys for test data",
      "Generating correlation IDs for tracing requests",
      "Filling fixtures and mock API responses",
    ],
  },
  "regex-tester": {
    intro:
      "Regex Tester runs a regular expression against sample text and highlights every match as you type. It uses your browser's JavaScript regex engine, so results match what the same pattern does in JavaScript and TypeScript code.\n\nFlags g, i, m and s can be switched on and off, capture groups are listed for each match, and a replace panel shows the outcome of substituting with references such as $1 and $2. Ready-made patterns for email, URL, IPv4, dates and hex colours are included as starting points.",
    steps: [
      ["Enter a pattern", "Type the expression and choose flags."],
      ["Add test text", "Matches are highlighted immediately."],
      ["Try a replacement", "Open the replace panel and use $1, $2 for groups."],
    ],
    faqs: [
      ["Will my pattern behave the same in Python or PHP?", "Mostly, but not always. This tool uses JavaScript syntax; features such as lookbehind, named groups and possessive quantifiers differ between engines."],
      ["What does the g flag do?", "It finds every match instead of stopping at the first."],
      ["Why does . not match a line break?", "By default it does not. Enable the s flag to make the dot match newlines."],
    ],
    uses: [
      "Debugging a validation pattern before shipping it",
      "Working out a find-and-replace for a text editor",
      "Extracting fields from log lines",
    ],
  },
  "color-converter": {
    intro:
      "Color Converter takes a HEX colour and shows it in the other notations developers need: RGB, RGBA, HSL, HSLA, HSV and a ready-to-paste CSS custom property. Type a hex code or use the colour picker, and every format updates with its own copy button.\n\nIt also reports the contrast ratio of the colour against white and against black, with a marker showing whether each pairing reaches the 4.5:1 level WCAG AA requires for body text. That tells you at once whether the colour can carry white or black text.",
    steps: [
      ["Enter or pick a colour", "Type a hex value or use the picker."],
      ["Read the formats", "All notations are listed together."],
      ["Copy what you need", "Click copy beside any value."],
    ],
    faqs: [
      ["What is the difference between HSL and HSV?", "Both describe hue and saturation, but HSL uses lightness while HSV uses value (brightness). Design tools often show HSV; CSS uses HSL."],
      ["What contrast ratio do I need?", "4.5:1 for normal text and 3:1 for large text under WCAG AA."],
      ["Can I enter RGB and get HEX?", "Input is by hex code or picker. Use the picker to match an RGB value visually."],
    ],
    uses: [
      "Translating a brand colour into CSS formats",
      "Checking whether white text is readable on a button colour",
      "Getting HSL values to build tints and shades",
    ],
  },
  "html-entity-encoder": {
    intro:
      "HTML Entity Encoder replaces the characters that have special meaning in HTML with their entity codes, so the less-than sign becomes &lt;, the ampersand becomes &amp; and quotes become &quot;. Decode mode turns entities back into characters.\n\nEncoding is what stops text from being interpreted as markup. Use it when you want to show code on a web page, or when inserting user-supplied text into HTML. A reference list of common entities sits below the tool for quick lookup.",
    steps: [
      ["Choose Encode or Decode", "Select the mode."],
      ["Enter the text", "The converted version appears below."],
      ["Copy", "Paste it into your HTML."],
    ],
    faqs: [
      ["Which characters must always be encoded?", "The less-than sign and ampersand in text, plus quotation marks inside attribute values."],
      ["Does encoding prevent XSS?", "Encoding output for the context it is placed in is the main defence, but it must be done for every untrusted value, and attributes, URLs and scripts each need their own handling."],
      ["Do I need to encode accented letters?", "No, not on a page served as UTF-8."],
    ],
    uses: [
      "Displaying a code sample in a blog post",
      "Preparing text for an HTML email template",
      "Decoding entities in scraped content",
    ],
  },
  "css-minifier": {
    intro:
      "CSS Minifier / Beautifier works in both directions. Minify strips comments, line breaks and unnecessary spaces to produce the smallest equivalent stylesheet. Beautify does the reverse, expanding compressed CSS into one declaration per line with indentation so it can be read and edited.\n\nThe original and output sizes are shown so you can see the saving. The tool works on the text of your CSS; it does not merge duplicate rules, remove unused selectors or rewrite values.",
    steps: [
      ["Paste CSS", "Add the stylesheet to the input."],
      ["Choose Minify or Beautify", "Switch modes at the top."],
      ["Copy the output", "Check the size and copy."],
    ],
    faqs: [
      ["Does minifying change how styles behave?", "No. Only whitespace and comments are removed."],
      ["How much smaller will my CSS be?", "Typically 15 to 30 percent, more if the file is heavily commented."],
      ["Does it remove unused CSS?", "No. That requires analysing your HTML, which tools such as PurgeCSS do at build time."],
    ],
    uses: [
      "Shrinking a stylesheet for a site without a build step",
      "Reading a minified file from someone else's site",
      "Tidying CSS before pasting into a CMS",
    ],
  },
  "password-generator": {
    intro:
      "Password Generator creates random passwords from the character types you select: uppercase letters, lowercase letters, numbers and symbols. A slider sets the length, a strength meter rates the result from Weak to Strong, and a new password is generated whenever you change a setting.\n\nRandomness comes from the browser's cryptographic generator, not Math.random. A Bulk button produces ten passwords at once for setting up several accounts. Nothing is stored or sent anywhere.",
    steps: [
      ["Set the length", "16 or more is a good default."],
      ["Choose character types", "Keep all four on unless a site forbids symbols."],
      ["Copy", "Copy the password or generate a batch of ten."],
    ],
    faqs: [
      ["How long should a password be?", "At least 16 random characters for important accounts. Length matters more than symbol variety."],
      ["Is it safe to generate passwords in a browser?", "Yes. They are created on your device and are not transmitted."],
      ["Why turn symbols off?", "Some systems reject certain symbols. Add length to compensate."],
    ],
    uses: [
      "Creating a unique password for a new account",
      "Generating API secrets for development",
      "Replacing reused passwords after a breach notice",
    ],
  },
  "strong-password-generator": {
    intro:
      "Strong Password Generator produces high-entropy passwords using the browser's cryptographic random source. Every character type you tick is guaranteed to appear at least once, so the result always satisfies sites that demand an uppercase letter, a lowercase letter, a digit and a symbol.\n\nSet the length with the slider and watch the strength rating. For accounts that protect money, email or other accounts, use 20 characters or more and store the password in a manager instead of trying to memorise it.",
    steps: [
      ["Choose a length", "20 or more for critical accounts."],
      ["Keep all character types on", "Each selected type is included at least once."],
      ["Copy to your password manager", "Do not reuse it elsewhere."],
    ],
    faqs: [
      ["What makes a password strong?", "Length and unpredictability. A long random string cannot be guessed or found in leaked password lists."],
      ["Do I need to change strong passwords regularly?", "Current guidance is to change them only when there is evidence of compromise."],
      ["Is a password enough?", "Add two-factor authentication wherever it is offered."],
    ],
    uses: [
      "Securing an email or banking login",
      "Setting a database or server root password",
      "Creating an encryption passphrase for backups",
    ],
  },
  "jwt-inspector": {
    intro:
      "JWT Inspector decodes a JSON Web Token and shows its header and payload as formatted JSON. It highlights the signing algorithm, and if the token has exp or iat claims it converts them into readable dates and tells you whether the token has expired.\n\nDecoding happens entirely in your browser. The tool does not verify the signature, so it shows what a token claims, not whether the token is genuine. Avoid pasting production tokens into any online tool that sends data to a server; this one does not.",
    steps: [
      ["Paste a token", "It must have three dot-separated parts."],
      ["Read header and payload", "Claims are shown as JSON."],
      ["Check expiry", "See whether the exp time has passed."],
    ],
    faqs: [
      ["Is the content of a JWT secret?", "No. The header and payload are only Base64URL-encoded. Anyone holding the token can read them."],
      ["Does this verify the signature?", "No. Verification needs the secret or public key and should be done by your server."],
      ["What do exp and iat mean?", "Expiration time and issued-at time, both in seconds since 1 January 1970 UTC."],
    ],
    uses: [
      "Checking why an API rejects a token",
      "Confirming which scopes or roles a token carries",
      "Seeing when a session token expires",
    ],
  },
  "uuid-validator": {
    intro:
      "UUID Validator checks whether a string is a correctly formed UUID and reports which version it is. It accepts the standard 8-4-4-4-12 hyphenated form and the urn:uuid: prefixed form, and gives live feedback as you type.\n\nThe version is read from the first digit of the third group and the variant from the fourth group, so the tool can tell a random v4 identifier from a time-based v1 or the nil UUID. A canonical lowercase copy is available to paste elsewhere.",
    steps: [
      ["Paste a UUID", "With or without the urn:uuid: prefix."],
      ["Read the verdict", "Valid or invalid, with the detected version."],
      ["Copy the normalised form", "Use the copy button."],
    ],
    faqs: [
      ["How is the version determined?", "From the 13th hexadecimal digit, the first character of the third group."],
      ["Are uppercase UUIDs valid?", "Yes. Hex digits are case-insensitive, though lowercase is the recommended output form."],
      ["Is a UUID without dashes valid?", "It carries the same value, but the canonical text format includes the dashes."],
    ],
    uses: [
      "Checking IDs in an import file before loading",
      "Debugging an API that rejects an identifier",
      "Confirming a library is producing v4 UUIDs",
    ],
  },
  "md5-generator": {
    intro:
      "MD5 Generator computes the 128-bit MD5 digest of the text you enter and shows it as 32 hexadecimal characters. The hash is recalculated as you type.\n\nMD5 is fast and still widely used for checksums and cache keys, but it is cryptographically broken: different inputs with the same hash can be produced deliberately. Use it to detect accidental changes, never to store passwords or to prove that a file has not been tampered with.",
    steps: [
      ["Enter text", "Type or paste the input."],
      ["Read the hash", "The 32-character digest appears below."],
      ["Copy", "Use the copy button."],
    ],
    faqs: [
      ["Is MD5 safe for passwords?", "No. Use bcrypt, scrypt or Argon2, which are deliberately slow and salted."],
      ["Can an MD5 hash be reversed?", "Not mathematically, but common inputs are found instantly in lookup tables."],
      ["Why does my hash differ from another tool's?", "Usually a trailing newline or a different text encoding. This tool hashes the UTF-8 bytes of exactly what is in the box."],
    ],
    uses: [
      "Generating a Gravatar hash from an email address",
      "Creating cache keys from content",
      "Comparing two strings for accidental differences",
    ],
  },
  "sha1-generator": {
    intro:
      "SHA1 Generator computes the 160-bit SHA-1 digest of your text using the Web Crypto API and displays it as 40 hexadecimal characters.\n\nSHA-1 is still what Git uses to name commits and objects, and it appears in many older protocols. Practical collision attacks exist, so it is no longer acceptable for digital signatures or certificates. Choose SHA-256 for anything new that relies on collision resistance.",
    steps: [
      ["Enter text", "Type or paste the input."],
      ["Read the digest", "A 40-character hash is shown."],
      ["Copy", "Use the copy button."],
    ],
    faqs: [
      ["Is SHA-1 still secure?", "Not against deliberate collisions. It remains fine for non-adversarial checksums."],
      ["Why does Git use SHA-1?", "For historical reasons, as a content identifier. Git is moving to SHA-256."],
      ["How long is a SHA-1 hash?", "160 bits, written as 40 hex characters."],
    ],
    uses: [
      "Reproducing a legacy system's hash values",
      "Verifying an older download checksum",
      "Understanding how Git object IDs are formed",
    ],
  },
  "sha256-generator": {
    intro:
      "SHA256 Generator computes the SHA-256 digest of your text with the browser's built-in Web Crypto API. The result is 64 hexadecimal characters and is recalculated live as you edit the input.\n\nSHA-256 is the current general-purpose standard: it underpins TLS certificates, software checksums, Bitcoin and most API request signing. It is designed to be fast, which is exactly why it must not be used on its own to store passwords.",
    steps: [
      ["Enter text", "Type or paste the input."],
      ["Read the digest", "A 64-character hash appears."],
      ["Copy", "Use the copy button."],
    ],
    faqs: [
      ["Can SHA-256 be decrypted?", "No. It is a one-way function. Short or common inputs can still be guessed by trying candidates."],
      ["Is SHA-256 suitable for passwords?", "Not alone. Use a slow, salted algorithm such as bcrypt or Argon2."],
      ["Does it hash files?", "This tool hashes text. A file's checksum must be computed from the file's bytes."],
    ],
    uses: [
      "Producing a checksum for a string or config value",
      "Testing a webhook signature implementation",
      "Creating deterministic IDs from content",
    ],
  },
  "sha512-generator": {
    intro:
      "SHA512 Generator computes the SHA-512 digest of your text through the Web Crypto API, giving a 512-bit result shown as 128 hexadecimal characters.\n\nSHA-512 belongs to the same SHA-2 family as SHA-256. It offers a larger security margin and is often faster than SHA-256 on 64-bit processors, at the cost of a longer output. For most applications SHA-256 is already more than sufficient, so pick SHA-512 when a specification asks for it.",
    steps: [
      ["Enter text", "Type or paste the input."],
      ["Read the digest", "A 128-character hash is displayed."],
      ["Copy", "Use the copy button."],
    ],
    faqs: [
      ["Is SHA-512 more secure than SHA-256?", "It has a larger margin, but both are considered secure today."],
      ["Why is the output so long?", "512 bits need 128 hex characters to write out."],
      ["Should I use it for password storage?", "No. It is fast by design. Use bcrypt or Argon2."],
    ],
    uses: [
      "Meeting a specification that mandates SHA-512",
      "Generating HMAC test vectors",
      "Comparing digest lengths when choosing an algorithm",
    ],
  },
  "bcrypt-generator": {
    intro:
      "Bcrypt Generator hashes a password with bcrypt and can verify a password against an existing hash. A cost factor from 6 to 14 controls how much work each hash takes: every step up doubles the time, which is what makes bcrypt resistant to brute-force guessing.\n\nA random salt is generated for every hash and stored inside the output, so hashing the same password twice gives different strings and both verify correctly. The work is done in your browser with the bcryptjs library.",
    steps: [
      ["Enter a password", "Type the text to hash."],
      ["Choose a cost factor", "10 to 12 is typical for web applications."],
      ["Hash or verify", "Copy the hash, or paste a hash and plain text to check them."],
    ],
    faqs: [
      ["What cost factor should I use?", "The highest your server can afford, usually 10 to 12, aiming for roughly a quarter of a second per hash."],
      ["Why do I get a different hash each time?", "A new random salt is used for every hash. Verification reads the salt from the hash itself."],
      ["Is there a password length limit?", "bcrypt only uses the first 72 bytes of the input."],
    ],
    uses: [
      "Creating a hash to seed an admin user in a database",
      "Checking that an application's stored hash matches a password",
      "Comparing hashing time at different cost factors",
    ],
  },
  "url-parser": {
    intro:
      "URL Parser splits a web address into its parts: protocol, host, hostname, port, origin, pathname, query string and fragment. Query parameters are listed separately as name and value pairs, decoded so you can read them.\n\nEach part has its own copy button. Parsing uses the same URL implementation as the browser, so what you see is exactly how a browser would interpret the address. The URL must include its protocol, such as https://, to be parsed.",
    steps: [
      ["Paste a URL", "Include the protocol."],
      ["Read the components", "Each part is shown on its own row."],
      ["Copy a part", "Use the copy button beside it."],
    ],
    faqs: [
      ["What is the difference between host and hostname?", "Host includes the port when one is specified; hostname never does."],
      ["Is the fragment sent to the server?", "No. Everything after # stays in the browser."],
      ["Why is my URL invalid?", "It is probably missing the protocol. Add https:// at the start."],
    ],
    uses: [
      "Reading tracking parameters on a long link",
      "Debugging a redirect URL",
      "Extracting the origin for a CORS setting",
    ],
  },
  "user-agent-parser": {
    intro:
      "User Agent Parser reads a browser's user agent string and identifies the browser and version, the operating system, the device type and the rendering engine. It starts with your own browser's string filled in, and you can paste any other string to analyse it.\n\nUser agent strings are notoriously misleading, since most browsers claim to be several others for compatibility. A parser untangles that. Bear in mind that modern browsers increasingly freeze or shorten these strings for privacy.",
    steps: [
      ["See your own browser", "Your current user agent is analysed automatically."],
      ["Paste another string", "Take one from server logs or analytics."],
      ["Copy the string", "Use the copy button if you need to share it."],
    ],
    faqs: [
      ["Why does Chrome's user agent mention Safari and Mozilla?", "Historic compatibility. Sites once sniffed for those names, so newer browsers included them to be served the same pages."],
      ["Can I rely on the user agent for feature detection?", "No. Test for the feature itself in JavaScript or CSS."],
      ["Can a user agent be faked?", "Easily. Treat it as a hint, not as proof."],
    ],
    uses: [
      "Identifying the browser behind an error in server logs",
      "Reproducing a bug reported from a specific device",
      "Checking what your browser reveals to websites",
    ],
  },
  "cidr-calculator": {
    intro:
      "CIDR Calculator works out the details of an IPv4 network from CIDR notation such as 192.168.1.0/24. It returns the network address, the broadcast address, the first and last usable host, the subnet mask and the number of addresses in the block.\n\nThe prefix length after the slash says how many leading bits identify the network: /24 leaves 8 bits for hosts, which is 256 addresses and 254 usable hosts. The calculator validates the address and requires a prefix between 0 and 32.",
    steps: [
      ["Enter a CIDR block", "For example 10.0.0.0/16."],
      ["Calculate", "Press the button to see the results."],
      ["Use the values", "Copy the range or mask into your configuration."],
    ],
    faqs: [
      ["Why are two addresses not usable?", "The first address identifies the network and the last is the broadcast address."],
      ["How many hosts does a /28 hold?", "16 addresses, 14 of them usable."],
      ["Does it support IPv6?", "No. This calculator handles IPv4 only."],
    ],
    uses: [
      "Planning subnets for a cloud VPC",
      "Writing a firewall or security-group rule",
      "Checking whether an IP falls inside a range",
    ],
  },
  "cron-generator": {
    intro:
      "Cron Expression Generator builds a five-field cron schedule from separate inputs for minute, hour, day of month, month and day of week. As you fill them in, the full expression is assembled and a plain-English description of when it runs is shown beneath.\n\nPresets cover the common cases: every minute, every hour, daily at midnight, every Monday at 9am, the first of each month and every 15 minutes. The syntax is the standard five-field form used by Unix cron, GitHub Actions and most schedulers.",
    steps: [
      ["Start from a preset", "Or type values into the five fields."],
      ["Check the description", "Confirm the schedule reads as you intend."],
      ["Copy the expression", "Paste it into your crontab or pipeline."],
    ],
    faqs: [
      ["What does */5 mean?", "Every fifth unit, so */5 in the minute field runs every five minutes."],
      ["Which number is Sunday?", "0. Days of the week run from 0 for Sunday to 6 for Saturday."],
      ["Which time zone does cron use?", "The time zone of the machine or service running it, which is often UTC on hosted platforms."],
    ],
    uses: [
      "Scheduling a nightly database backup",
      "Setting a workflow trigger in a CI pipeline",
      "Running a report every weekday morning",
    ],
  },
  "cron-parser": {
    intro:
      "Cron Expression Parser translates a cron expression into a sentence you can read, so 0 9 * * 1 becomes 'at 09:00 on Monday'. It breaks the expression into its five fields and labels the allowed range of each.\n\nIt is the quickest way to check an unfamiliar schedule found in a crontab, a deployment file or a ticket before trusting it. The parser understands standard five-field expressions with numbers, asterisks and step values.",
    steps: [
      ["Paste an expression", "Five space-separated fields."],
      ["Read the explanation", "The schedule is described in plain English."],
      ["Adjust if needed", "Edit a field and watch the description change."],
    ],
    faqs: [
      ["What are the five fields?", "Minute, hour, day of month, month and day of week, in that order."],
      ["Does it support seconds or year fields?", "No. Six- and seven-field formats used by Quartz and some other schedulers are not parsed."],
      ["What happens when both day fields are set?", "In standard cron the job runs when either matches, which often surprises people."],
    ],
    uses: [
      "Understanding an inherited crontab",
      "Reviewing a schedule in a pull request",
      "Confirming a job will not run more often than intended",
    ],
  },
  "json-diff": {
    intro:
      "JSON Diff Tool compares two JSON documents and lists what differs between them: keys that were added, keys that were removed, and values that changed. Comparison is by structure, so differences in formatting, indentation or key order are ignored.\n\nNested objects are compared recursively and each difference is reported with its path. If the two documents contain the same data the tool says they are identical. Both inputs must be valid JSON.",
    steps: [
      ["Paste the original", "Into the JSON A pane."],
      ["Paste the modified version", "Into the JSON B pane."],
      ["Review the differences", "Added, removed and changed entries are listed."],
    ],
    faqs: [
      ["Does key order matter?", "No. Objects are compared by key, not by position."],
      ["Are arrays compared by position?", "Yes. An element inserted at the start shifts every later index and shows as multiple changes."],
      ["Why do I see an error instead of a diff?", "One of the inputs is not valid JSON."],
    ],
    uses: [
      "Comparing API responses between two environments",
      "Reviewing a change to a configuration file",
      "Checking what a migration altered in a record",
    ],
  },
  "json-escape": {
    intro:
      "JSON Escape / Unescape converts raw text into the form it must take inside a JSON string, and back. Escaping turns double quotes into backslash-quote, real line breaks into backslash-n, tabs into backslash-t and backslashes into double backslashes. Unescaping reverses it.\n\nYou need this whenever one piece of text has to travel inside another: a block of HTML in a JSON field, a multi-line message in a config value, or JSON nested inside JSON.",
    steps: [
      ["Choose Escape or Unescape", "Select the direction."],
      ["Paste the text", "The converted version appears in the output."],
      ["Copy", "Paste it between quotes in your JSON."],
    ],
    faqs: [
      ["Which characters must be escaped in JSON?", "The double quote, the backslash and control characters such as newline and tab."],
      ["Do I need to escape single quotes?", "No. JSON strings use double quotes only."],
      ["Why does unescaping fail?", "The input contains an invalid sequence, such as a lone backslash."],
    ],
    uses: [
      "Embedding a multi-line template in a JSON config",
      "Reading a log message that contains escaped JSON",
      "Preparing a request body by hand",
    ],
  },
  "xml-to-json": {
    intro:
      "XML to JSON converts an XML document into a JSON object using the browser's built-in XML parser. Elements become keys, nested elements become nested objects, and repeated sibling elements with the same name are collected into an array.\n\nConversion is live and malformed XML is reported as invalid instead of producing partial output. Because XML and JSON model data differently, details such as attribute handling and mixed text content follow this tool's conventions, so check the output shape before wiring it into code.",
    steps: [
      ["Paste XML", "Replace the sample document."],
      ["Check the JSON", "Output appears as you type."],
      ["Copy", "Use the copy button."],
    ],
    faqs: [
      ["How are repeated elements handled?", "Siblings with the same tag name are grouped into an array."],
      ["Why is every value a string?", "XML has no data types, so numbers and booleans arrive as text."],
      ["What makes XML invalid?", "Unclosed or mismatched tags, more than one root element, or unescaped ampersands and angle brackets in text."],
    ],
    uses: [
      "Reading a SOAP or RSS response in a JavaScript app",
      "Migrating configuration from XML to JSON",
      "Inspecting an XML export more comfortably",
    ],
  },
  "json-to-xml": {
    intro:
      "JSON to XML converts a JSON object into XML markup. Each key becomes an element, nested objects become nested elements, and arrays repeat the element once per item. Output is generated live as you edit the JSON.\n\nBecause JSON keys can contain characters that are not legal in XML element names, such as spaces or a leading digit, review the result when your keys are unusual. Invalid JSON is flagged instead of converted.",
    steps: [
      ["Paste JSON", "Replace the sample object."],
      ["Check the XML", "Output updates as you type."],
      ["Copy", "Use the copy button."],
    ],
    faqs: [
      ["How are arrays represented?", "The element is repeated for each array item."],
      ["Can I produce attributes instead of elements?", "No. Every key is written as a child element."],
      ["Does the output include an XML declaration?", "Check the output; add the declaration line yourself if the receiving system requires one."],
    ],
    uses: [
      "Feeding JSON data to a system that only accepts XML",
      "Creating test payloads for a SOAP service",
      "Generating a quick XML sample from an object",
    ],
  },
  "yaml-to-json": {
    intro:
      "YAML to JSON converts between YAML and JSON in both directions, using the js-yaml library. Paste YAML to get JSON, or press Swap to turn JSON into YAML. Conversion is live, and parse errors are shown with their message.\n\nYAML relies on indentation and has some surprising rules, such as unquoted yes and no becoming booleans in older parsers. Seeing the JSON equivalent is the fastest way to confirm what a YAML file actually means to a program.",
    steps: [
      ["Paste YAML or JSON", "Use Swap to change direction."],
      ["Review the output", "It updates as you type."],
      ["Copy", "Use the copy button."],
    ],
    faqs: [
      ["Why is my YAML failing to parse?", "Almost always indentation: tabs instead of spaces, or inconsistent nesting."],
      ["Are comments preserved?", "No. JSON has no comments, so they are dropped."],
      ["Is every JSON document valid YAML?", "Yes. YAML is a superset of JSON."],
    ],
    uses: [
      "Checking a Kubernetes or Docker Compose file",
      "Converting an OpenAPI spec between formats",
      "Debugging a CI configuration",
    ],
  },
  "csv-to-xml": {
    intro:
      "CSV to XML converts comma-separated data into an XML document. The first row supplies the element names, and every following row becomes one record element containing a child element per column.\n\nYou can name the root element and the row element, which default to records and record, to match what the receiving system expects. Output updates live. Values are split on commas, so fields that themselves contain commas should be cleaned up first.",
    steps: [
      ["Paste CSV", "Include a header row."],
      ["Name the elements", "Set the root and row element names."],
      ["Copy the XML", "Use the copy button."],
    ],
    faqs: [
      ["What if a header contains spaces?", "Spaces are not valid in XML element names. Rename the headers before converting."],
      ["Are quoted fields with commas supported?", "No. Each comma starts a new column."],
      ["Can I change the delimiter?", "The converter expects commas."],
    ],
    uses: [
      "Preparing a product feed from a spreadsheet export",
      "Importing tabular data into an XML-based system",
      "Creating sample XML for testing",
    ],
  },
  "html-to-markdown": {
    intro:
      "HTML to Markdown rewrites HTML as Markdown. It converts headings, bold, italic, strikethrough, inline code, preformatted blocks, links, images, list items, blockquotes and horizontal rules, then removes any remaining tags.\n\nThe converter is pattern-based and aimed at ordinary article markup. It does not convert tables or keep nested list indentation, and numbered lists come out as bullets, so expect to tidy complex pages by hand.",
    steps: [
      ["Paste HTML", "Replace the sample markup."],
      ["Review the Markdown", "Output updates as you type."],
      ["Copy", "Use the copy button."],
    ],
    faqs: [
      ["Are tables converted?", "No. Table markup is stripped to its text."],
      ["What happens to scripts and styles?", "Tags are removed. Check the output for stray CSS or script text from complex pages."],
      ["Are ordered lists numbered?", "List items are written as bullets regardless of list type."],
    ],
    uses: [
      "Moving a blog post into a Markdown-based site",
      "Turning web content into a README",
      "Cleaning rich text for a notes app",
    ],
  },
  "qr-code-generator": {
    intro:
      "QR Code Generator creates QR codes for eight kinds of content: URL, email, phone, SMS, WhatsApp, Wi-Fi login, UPI payment and business card. The code redraws instantly as you type or change settings.\n\nYou control the foreground and background colours, with six ready-made themes, plus the output size, the quiet margin and the error-correction level from L (7 percent) to H (30 percent). Download as PNG for general use or SVG for print, or copy the image to the clipboard. Codes are static and never expire.",
    steps: [
      ["Choose a content type", "URL, Wi-Fi, WhatsApp and so on."],
      ["Enter the details and style it", "Set colours, size and error correction."],
      ["Download", "Save as PNG or SVG and test it with a phone."],
    ],
    faqs: [
      ["Which error-correction level should I choose?", "M for screens. Q or H for print, or when a logo will cover part of the code."],
      ["Why won't my coloured code scan?", "Scanners need strong contrast with a dark foreground on a light background. Avoid light-on-dark and low-contrast pairs."],
      ["Do these QR codes expire or track scans?", "No. The content is encoded directly in the image; there is no redirect or tracking."],
    ],
    uses: [
      "Putting a menu or website link on printed material",
      "Sharing guest Wi-Fi without reading out a password",
      "Adding a contact card to a business card",
    ],
  },
  "sql-formatter": {
    intro:
      "SQL Formatter reformats a SQL statement so it is readable: keywords are uppercased and the main clauses, such as SELECT, FROM, WHERE, JOIN, GROUP BY and ORDER BY, are placed on their own lines with consistent indentation.\n\nIt is a rule-based formatter that runs in your browser. It does not connect to a database or validate the query, and it handles common SELECT, INSERT, UPDATE and DELETE statements best. Very dialect-specific syntax may need manual adjustment afterwards.",
    steps: [
      ["Paste the query", "Minified or messy SQL is fine."],
      ["Format", "Generate the reformatted version."],
      ["Copy", "Paste it back into your editor."],
    ],
    faqs: [
      ["Does it check my SQL for errors?", "No. It only changes layout and keyword case."],
      ["Which SQL dialects are supported?", "Standard clauses common to MySQL, PostgreSQL, SQL Server and SQLite."],
      ["Does formatting affect performance?", "No. Whitespace and case do not change how a query runs."],
    ],
    uses: [
      "Making a query from an ORM log readable",
      "Tidying SQL before a code review",
      "Preparing a query for documentation",
    ],
  },
  "sql-explainer": {
    intro:
      "SQL Explainer walks through a query clause by clause and describes in plain English what each part does: which tables are read, how they are joined, which rows are filtered, how results are grouped and in what order they are returned.\n\nThe explanation is produced by pattern rules in your browser, not by a language model or a database engine. It describes the structure of the statement you paste; it does not know your schema or data, and it is not a substitute for the database's own EXPLAIN plan.",
    steps: [
      ["Paste a query", "A SELECT statement works best."],
      ["Generate the explanation", "Each clause is described in turn."],
      ["Copy", "Use it in a comment or documentation."],
    ],
    faqs: [
      ["Is this the same as EXPLAIN in my database?", "No. EXPLAIN shows the execution plan chosen by the engine. This tool describes what the query text means."],
      ["Does it understand subqueries?", "It recognises common patterns, but deeply nested queries may be summarised loosely."],
      ["Is my query sent to a server?", "No. It is analysed in the page."],
    ],
    uses: [
      "Understanding a query written by someone else",
      "Learning what each SQL clause contributes",
      "Writing a comment that documents a report query",
    ],
  },
  "sql-optimizer": {
    intro:
      "SQL Query Optimizer scans a query for well-known performance anti-patterns and lists recommendations. Checks include SELECT *, a leading wildcard in LIKE, functions wrapped around columns in WHERE, missing WHERE or LIMIT clauses, and OR conditions that can block index use.\n\nIt is a static, rule-based review of the query text. It cannot see your tables, indexes or row counts, so treat its findings as a checklist to confirm with your database's EXPLAIN output.",
    steps: [
      ["Paste a query", "Add the statement to review."],
      ["Run the analysis", "Findings and suggestions are listed."],
      ["Verify with EXPLAIN", "Confirm each suggestion against the real execution plan."],
    ],
    faqs: [
      ["Will it rewrite my query?", "It gives recommendations and examples; applying them is up to you."],
      ["Why is SELECT * discouraged?", "It fetches columns you may not need, prevents index-only scans and breaks when the table changes."],
      ["Can it tell me which index to add?", "It can point to columns used in filters and joins, but the right index depends on your data."],
    ],
    uses: [
      "Reviewing a slow report query",
      "Checking queries during code review",
      "Learning common SQL performance pitfalls",
    ],
  },
  "json-validator": {
    intro:
      "JSON Validator checks whether text is valid JSON and tells you why if it is not. Press Validate and the tool either confirms the document and prints it neatly indented, or shows the parser's error message so you can find the fault.\n\nA Minify button outputs the same data on one line. Validation follows the strict JSON standard, which is what APIs and configuration loaders enforce.",
    steps: [
      ["Paste JSON", "Add the document to check."],
      ["Validate and format", "See valid or invalid, with details."],
      ["Copy", "Copy the formatted or minified output."],
    ],
    faqs: [
      ["What are the most common JSON errors?", "Trailing commas, single quotes, unquoted property names and missing closing brackets."],
      ["Can I validate against a schema?", "No. This checks syntax only, not structure or types."],
      ["Are duplicate keys an error?", "They parse without error, with the last value winning, which can hide mistakes."],
    ],
    uses: [
      "Checking a config file before deploying",
      "Validating a request body by hand",
      "Confirming exported data is well-formed",
    ],
  },
  "html-formatter": {
    intro:
      "HTML Formatter indents HTML so its structure is visible. Each element is placed on its own line and nested one level deeper than its parent, while inline elements such as links and emphasis are kept in the flow of their text and void elements such as img and br are handled without a closing tag.\n\nIt is intended for reading and editing markup that arrived minified or tangled. It does not fix invalid HTML such as unclosed tags.",
    steps: [
      ["Paste HTML", "Minified or unindented markup."],
      ["Format", "Press Format HTML."],
      ["Copy", "Use the copy button."],
    ],
    faqs: [
      ["Will formatting change how the page renders?", "It can, slightly: whitespace between inline elements is significant in HTML."],
      ["Does it validate my HTML?", "No. Use the W3C validator for that."],
      ["Does it format inline CSS and scripts?", "They are kept as they are. Use the CSS and JavaScript formatters for those."],
    ],
    uses: [
      "Inspecting a page's generated markup",
      "Cleaning up an email template",
      "Reading HTML produced by a WYSIWYG editor",
    ],
  },
  "css-formatter": {
    intro:
      "CSS Formatter puts each selector and each declaration on its own line with consistent indentation, turning a compressed stylesheet back into something you can scan. A Minify button does the opposite when you need the compact form.\n\nIt formats the text as written and leaves the order of rules and properties unchanged, so the cascade and the result on the page stay the same.",
    steps: [
      ["Paste CSS", "Add the stylesheet."],
      ["Format or minify", "Choose the output you need."],
      ["Copy", "Use the copy button."],
    ],
    faqs: [
      ["Does it reorder properties?", "No. Order is preserved."],
      ["Does it handle Sass or Less?", "It is written for plain CSS. Nested preprocessor syntax may not indent as expected."],
      ["Will it add missing semicolons?", "No. It does not repair invalid CSS."],
    ],
    uses: [
      "Reading a minified stylesheet",
      "Making diffs between CSS versions meaningful",
      "Standardising formatting before a commit",
    ],
  },
  "js-formatter": {
    intro:
      "JavaScript Formatter re-indents JavaScript so blocks, functions and objects line up by nesting level, and can also minify code by stripping comments and extra whitespace.\n\nIt works on the text of the code with simple rules, without fully parsing the language. That makes it good for making a minified snippet legible, but it is not a replacement for Prettier or a real minifier in a build pipeline, and unusual syntax may be laid out imperfectly.",
    steps: [
      ["Paste JavaScript", "Add the code."],
      ["Format or minify", "Choose the output."],
      ["Copy", "Use the copy button."],
    ],
    faqs: [
      ["Does it rename variables when minifying?", "No. It only removes whitespace and comments."],
      ["Can it restore original variable names?", "No. Names shortened by a minifier cannot be recovered without a source map."],
      ["Does it support TypeScript or JSX?", "It is designed for plain JavaScript."],
    ],
    uses: [
      "Reading a minified script to see what it does",
      "Tidying a snippet copied from a forum",
      "Shrinking a small inline script",
    ],
  },
};
