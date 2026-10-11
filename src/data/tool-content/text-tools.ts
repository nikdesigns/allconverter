import type { ToolCopyMap } from "./types";

export const textToolsCopy: ToolCopyMap = {
  "word-counter": {
    intro:
      "Word Counter measures text as you type or paste it. It reports words, characters with and without spaces, sentences and paragraphs, and estimates reading time at 225 words per minute and speaking time at 130 words per minute.\n\nBelow the counts, a Top Keywords panel lists the words that appear most often, which makes repeated terms easy to spot. Counting happens live in the page, with no button to press, and the Clear button empties the box for the next piece of text.",
    steps: [
      ["Enter your text", "Type or paste it into the box."],
      ["Read the counts", "Words, characters, sentences, paragraphs and time estimates update instantly."],
      ["Check Top Keywords", "See which words you have used most."],
    ],
    faqs: [
      ["How is a word defined?", "Any run of characters separated by spaces or line breaks counts as one word, so hyphenated terms count once."],
      ["How accurate is the reading time?", "It assumes 225 words per minute, a typical adult silent reading speed. Technical material is read more slowly."],
      ["Does it count spaces as characters?", "Both figures are shown: one including spaces and one without."],
    ],
    uses: [
      "Keeping an essay or article inside a word limit",
      "Timing a speech or video script before recording",
      "Checking a meta description or post against a character limit",
    ],
  },
  "case-converter": {
    intro:
      "Case Converter rewrites text in ten different capitalisation styles at once: UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, SCREAMING_SNAKE and dot.case. Type once and every variant appears, each with its own copy button.\n\nThe first four are for prose and headings. The rest are naming conventions used in code, where a phrase like user first name has to become userFirstName, user_first_name or user-first-name depending on the language or file type.",
    steps: [
      ["Enter text", "Type or paste the words to convert."],
      ["Find the style you need", "All ten versions are shown together."],
      ["Copy", "Click the copy button beside the one you want."],
    ],
    faqs: [
      ["What is the difference between camelCase and PascalCase?", "camelCase starts with a lowercase letter (userName); PascalCase capitalises the first letter too (UserName)."],
      ["Does Title Case follow a style guide?", "It capitalises the first letter of every word. Style guides such as AP or Chicago keep short words like 'of' and 'the' lowercase, so adjust those by hand if needed."],
      ["Where is kebab-case used?", "In URLs, CSS class names and file names, where spaces are not allowed and hyphens are readable."],
    ],
    uses: [
      "Fixing text typed with Caps Lock on",
      "Turning a column heading into a variable name",
      "Making a URL-friendly version of a title",
    ],
  },
  "text-cleaner": {
    intro:
      "Text Cleaner applies a set of clean-up rules to messy text in one click. Twelve switches control what happens: trim leading and trailing spaces, collapse repeated spaces, collapse or remove blank lines, convert Windows line endings to Unix, and strip HTML tags, URLs, email addresses, numbers, punctuation or non-ASCII characters.\n\nThree gentle options are on by default (trim, single spaces, single line breaks) so pasted text is tidied without losing content. Turn on the removal options only when you want that content gone. The cleaned text appears beside the original for copying.",
    steps: [
      ["Paste the text", "Drop in content copied from a PDF, email or web page."],
      ["Choose the rules", "Tick the clean-up operations you want."],
      ["Clean and copy", "Press Clean Text and copy the result."],
    ],
    faqs: [
      ["Will 'Remove special chars' delete accented letters?", "Yes. It strips every non-ASCII character, including letters such as é and ñ and all emoji. Leave it off for non-English text."],
      ["How does Strip HTML tags work?", "It removes anything that looks like a tag in angle brackets and keeps the text between tags."],
      ["Why fix line endings?", "Windows uses a two-character line ending that can show up as stray symbols or break scripts on Linux and macOS."],
    ],
    uses: [
      "Tidying text copied out of a PDF with broken spacing",
      "Stripping markup from HTML to get plain copy",
      "Removing links and email addresses before sharing a document",
    ],
  },
  "lorem-ipsum-generator": {
    intro:
      "Lorem Ipsum Generator produces placeholder text for mock-ups and layouts. Choose whether you want paragraphs, sentences or words, set how many, and the text is generated immediately. A switch controls whether the output begins with the traditional 'Lorem ipsum dolor sit amet' opening.\n\nPress Regenerate for a different arrangement of the same Latin-style vocabulary. Dummy text is useful because readers are not distracted by meaning, so attention stays on typography, spacing and the balance of the design.",
    steps: [
      ["Choose the unit", "Paragraphs, sentences or words."],
      ["Set the amount", "Enter how many you need."],
      ["Copy", "Copy the text into your design or template."],
    ],
    faqs: [
      ["Is Lorem Ipsum real Latin?", "It is scrambled Latin derived from a passage by Cicero. It looks like language but has no coherent meaning."],
      ["Why not use real text?", "Real copy pulls reviewers into reading and commenting on wording when the question is about layout."],
      ["Should placeholder text reach production?", "No. Search the final build for 'lorem' before launch; leftover filler is a common mistake."],
    ],
    uses: [
      "Filling a website wireframe before copy is written",
      "Testing how a font handles long paragraphs",
      "Populating a database with sample content",
    ],
  },
  "markdown-to-html": {
    intro:
      "Markdown to HTML converts Markdown into HTML as you type, with a toggle between the generated code and a rendered preview. It handles headings from level one to six, bold, italic, strikethrough, inline code, fenced code blocks, links, images, blockquotes, horizontal rules and bulleted or numbered lists.\n\nThe converter is deliberately lightweight. It covers the syntax used in everyday notes and READMEs but not tables, footnotes, task lists or nested lists. Link and image addresses are checked so that only ordinary web, mail and relative URLs are kept.",
    steps: [
      ["Write or paste Markdown", "Replace the sample text with your own."],
      ["Switch views", "Check the rendered preview or view the HTML code."],
      ["Copy the HTML", "Use Copy HTML and paste it into your page or CMS."],
    ],
    faqs: [
      ["Does it support tables?", "No. Table syntax is left as plain text."],
      ["Are numbered lists output as ordered lists?", "List items are grouped into a single unordered list element, so change the wrapper to an ordered list by hand if numbering matters."],
      ["Is the preview safe with pasted content?", "Angle brackets are escaped and script-style URLs are blocked, so pasted Markdown cannot run code in the preview."],
    ],
    uses: [
      "Turning notes into HTML for a blog platform",
      "Checking how a README will render",
      "Producing clean markup for an email template",
    ],
  },
  "text-to-ascii": {
    intro:
      "Text to ASCII converts each character of your text into its numeric character code. Three output modes are available: decimal (72 101 108), hexadecimal (48 65 6C) and binary (01001000 01100101). Codes are separated by spaces and update live as you type.\n\nSeeing the numbers behind text is the quickest way to find invisible problems, such as a non-breaking space that looks like a normal space, or to prepare character data for a protocol, microcontroller or programming exercise.",
    steps: [
      ["Type your text", "Enter the characters to convert."],
      ["Pick a number base", "Decimal, hex or binary."],
      ["Copy the codes", "Use the copy button on the output."],
    ],
    faqs: [
      ["What happens with characters outside ASCII?", "Their Unicode code value is shown, which is above 127 for accented letters and symbols."],
      ["What is the code for a space?", "32 in decimal, 20 in hex."],
      ["Why are uppercase and lowercase codes different?", "They are separate characters. 'A' is 65 and 'a' is 97, exactly 32 apart."],
    ],
    uses: [
      "Spotting hidden or look-alike characters in a string",
      "Preparing byte values for embedded code",
      "Teaching how computers store text",
    ],
  },
  "ascii-to-text": {
    intro:
      "ASCII to Text turns a list of character codes back into readable text. Enter the codes separated by spaces and choose whether they are decimal, hexadecimal or binary; the decoded characters appear immediately.\n\nIt is the reverse of the Text to ASCII tool and is handy for reading values that show up in logs, network captures, puzzle challenges and old data files, where text is often displayed as numbers.",
    steps: [
      ["Paste the codes", "Separate each value with a space."],
      ["Select the base", "Match it to your input: decimal, hex or binary."],
      ["Read the text", "Copy the decoded result."],
    ],
    faqs: [
      ["My output is garbled. Why?", "The selected base probably does not match the input. '65' is A in decimal but e in hex."],
      ["Do values need leading zeros?", "No, but binary is easier to check when each value is written as eight digits."],
      ["Can it decode values without spaces?", "No. Codes must be separated so the tool knows where each one ends."],
    ],
    uses: [
      "Decoding a hex dump fragment",
      "Solving a binary-message puzzle",
      "Checking output from a serial device",
    ],
  },
  "remove-line-breaks": {
    intro:
      "Remove Line Breaks joins multi-line text into a single line. By default each line break is replaced with a space, but you can type any replacement instead: a comma to build a list, a semicolon, or nothing at all to close the lines up completely.\n\nThe usual reason to need it is text copied from a PDF or an email, where every line ends with a hard break and pasting it elsewhere produces ragged paragraphs. The result updates live as you change the replacement.",
    steps: [
      ["Paste the text", "Include all the lines you want joined."],
      ["Set the replacement", "Keep the space, or enter a comma or other separator."],
      ["Copy the result", "Use the copy button."],
    ],
    faqs: [
      ["Can I keep paragraph breaks and only remove single line breaks?", "This tool replaces every break. To preserve paragraphs, process one paragraph at a time."],
      ["How do I turn a column of values into a comma-separated list?", "Paste the column and set the replacement to a comma followed by a space."],
      ["Does it handle Windows and Mac line endings?", "Yes. Both kinds of line break are replaced."],
    ],
    uses: [
      "Repairing paragraphs copied from a PDF",
      "Converting a spreadsheet column into a single-line list",
      "Flattening an address into one line",
    ],
  },
  "add-line-numbers": {
    intro:
      "Add Line Numbers puts a number at the start of every line of text. You choose the number the first line starts from and the separator placed between the number and the text, which defaults to a full stop and a space.\n\nNumbered lines make it possible to refer to an exact place in a script, a log extract or a piece of code during a review. Blank lines are numbered too, so the numbering matches what an editor would show.",
    steps: [
      ["Paste your text", "Each line will receive a number."],
      ["Set start and separator", "For example start at 1 with a colon and space."],
      ["Copy the numbered text", "Use the copy button."],
    ],
    faqs: [
      ["Can numbering start from a value other than 1?", "Yes. Enter any starting number, which is useful when the text is an excerpt from a longer file."],
      ["What separators can I use?", "Anything you type: a full stop, a colon, a tab, a bracket and so on."],
      ["Are numbers padded to line up?", "No. They are written as plain numbers, so longer lists are not right-aligned."],
    ],
    uses: [
      "Preparing a code snippet for discussion",
      "Numbering clauses in a draft agreement",
      "Referencing lines in a log file when reporting a bug",
    ],
  },
  "duplicate-word-finder": {
    intro:
      "Duplicate Word Finder counts how often each word appears in a piece of text and lists every word used more than once, most frequent first. Words of three letters or more are counted, and upper and lower case are treated as the same word.\n\nIt is a blunt but useful proofreading aid: a word that shows up fifteen times in a short article usually stands out once you see the number. The tool reports frequency across the whole text, not only words repeated side by side.",
    steps: [
      ["Paste your text", "Add the passage to analyse."],
      ["Read the list", "Each repeated word is shown with its count."],
      ["Revise", "Replace overused words in your original draft."],
    ],
    faqs: [
      ["Does it catch accidental doubles like 'the the'?", "It will show 'the' with a high count, but it does not point to where the doubling occurs."],
      ["Why are short words missing?", "Words under three letters are ignored to cut down noise from 'a', 'of', 'to' and similar."],
      ["Is 'Run' counted separately from 'run'?", "No. Counting is case-insensitive."],
    ],
    uses: [
      "Finding words you lean on too heavily in an essay",
      "Checking keyword repetition in web copy",
      "Reviewing a speech for verbal habits",
    ],
  },
  "reading-time-calculator": {
    intro:
      "Reading Time Calculator counts the words in your text and estimates how long it takes to read at three speeds: 150 words per minute for a slow or careful reader, 200 for an average reader, and 250 for a fast one.\n\nPublishing a reading time at the top of an article helps visitors decide whether to start now or save it. Showing the range instead of a single figure is more honest, since reading speed varies with the audience and the difficulty of the material.",
    steps: [
      ["Paste the article", "Include everything a reader will read."],
      ["See the estimates", "Word count and minutes at three speeds are shown."],
      ["Use the figure", "Quote the average value as your 'X min read'."],
    ],
    faqs: [
      ["Which speed should I publish?", "The 200 words per minute figure is a sensible default for general audiences."],
      ["Do images and code add reading time?", "They do in practice, but the calculator counts words only. Add a little time for image-heavy or technical posts."],
      ["Why round up?", "A partly read minute still takes time, so estimates are rounded up to whole minutes."],
    ],
    uses: [
      "Adding a reading-time label to blog posts",
      "Planning how long a newsletter takes to get through",
      "Estimating study time for assigned reading",
    ],
  },
  "rot13-encoder": {
    intro:
      "ROT13 shifts every letter thirteen places along the alphabet, so A becomes N and N becomes A. Because the alphabet has twenty-six letters, applying it a second time restores the original, which means one operation both encodes and decodes.\n\nROT13 is not security. It is a light disguise used to hide spoilers, puzzle answers and punchlines from a casual glance. Numbers, spaces and punctuation pass through unchanged, and the output updates as you type.",
    steps: [
      ["Enter text", "Type or paste the message."],
      ["Read the output", "The ROT13 version appears instantly."],
      ["Decode the same way", "Paste encoded text into the same box to get the original back."],
    ],
    faqs: [
      ["Is ROT13 encryption?", "No. Anyone can reverse it instantly. Use the Text Encryption tool for real protection."],
      ["Why thirteen?", "Thirteen is half of twenty-six, which makes the cipher its own inverse."],
      ["Are numbers changed?", "No. Only the letters A to Z are rotated."],
    ],
    uses: [
      "Hiding a spoiler or quiz answer in a forum post",
      "Solving geocaching and puzzle hints",
      "Demonstrating a substitution cipher in a lesson",
    ],
  },
  "passphrase-generator": {
    intro:
      "Passphrase Generator creates five passphrases at a time by picking random words from a built-in list. You set how many words each contains, from three to eight, the separator between them, and whether to capitalise words or append a four-digit number.\n\nWords are chosen with the browser's cryptographic random generator. The word list holds 97 words, so each word adds about 6.6 bits of strength: a four-word phrase is fine for low-risk logins, but use at least six words plus the number, or a password manager's generator, for anything important.",
    steps: [
      ["Set the options", "Choose word count, separator, capitalisation and the number suffix."],
      ["Generate", "Five passphrases are produced."],
      ["Copy one", "Store it in a password manager."],
    ],
    faqs: [
      ["How strong is a passphrase from this tool?", "Strength grows with word count. Because the list is small, favour six to eight words and add the number for accounts that matter."],
      ["Why use words instead of random characters?", "Words are far easier to type and remember, which matters for the few passwords you have to enter by hand."],
      ["Are the passphrases stored anywhere?", "No. They are generated in your browser and disappear when you leave the page."],
    ],
    uses: [
      "Creating a memorable Wi-Fi password to share with guests",
      "Making a device login you can type without a manager",
      "Generating a starting point for a master password",
    ],
  },
  "text-encryption": {
    intro:
      "Text Encryption protects a message with a password using AES-256 in GCM mode, through the Web Crypto API built into your browser. The key is derived from your password with PBKDF2 using 100,000 rounds of SHA-256 and a fresh random salt, and each message gets its own random nonce.\n\nThe output is a block of Base64 text containing the salt, nonce and ciphertext. Anyone with that text and the password can decrypt it by pasting it back into this tool. GCM also detects tampering, so a wrong password or altered text produces an error instead of garbage.",
    steps: [
      ["Enter a password", "Use a long, unique one. It cannot be recovered."],
      ["Paste text and encrypt", "Copy the Base64 output and send or store it."],
      ["Decrypt later", "Paste the encrypted block, enter the same password and press Decrypt."],
    ],
    faqs: [
      ["What if I forget the password?", "The text cannot be recovered. There is no reset and no copy of the key."],
      ["How should I share the password?", "Through a different channel from the encrypted text, for example by phone if the message goes by email."],
      ["Why does the same text encrypt differently each time?", "A new random salt and nonce are used for every encryption, which is what makes the scheme secure."],
    ],
    uses: [
      "Sending a note containing account details over email",
      "Keeping private text in a shared document",
      "Storing recovery codes in a notes app",
    ],
  },
  "character-counter": {
    intro:
      "Character Counter shows the length of your text in characters, with and without spaces, alongside word, sentence and paragraph counts and estimated reading and speaking times. Figures refresh on every keystroke, and Copy Stats puts the whole summary on your clipboard.\n\nCharacter limits are everywhere: about 60 for a page title, 155 for a meta description, 160 for a single SMS, 280 for a post on X. Checking the count before publishing avoids text being cut off mid-sentence.",
    steps: [
      ["Type or paste text", "Use the large input box."],
      ["Watch the counts", "All figures update live."],
      ["Copy the stats", "Use Copy Stats if you need to record them."],
    ],
    faqs: [
      ["Do line breaks count as characters?", "Yes. Each line break counts as one character in the total."],
      ["How are emoji counted?", "Many emoji are stored as two or more code units, so one emoji can add more than one to the count, as it does on most platforms."],
      ["What is the difference from the Word Counter?", "This tool focuses on character limits; the Word Counter adds keyword frequency."],
    ],
    uses: [
      "Fitting a meta description under 155 characters",
      "Keeping an SMS within one message",
      "Checking a bio against a platform limit",
    ],
  },
  "remove-duplicate-lines": {
    intro:
      "Remove Duplicate Lines deletes repeated lines from a list and keeps the first occurrence of each, preserving the original order. After it runs, it tells you how many duplicates were removed.\n\nA case-sensitive switch decides whether 'Apple' and 'apple' count as the same line. Matching is exact, so lines that differ by a trailing space are treated as different; run the list through the Text Cleaner first if spacing is inconsistent.",
    steps: [
      ["Paste your list", "One item per line."],
      ["Choose case sensitivity", "Turn it off to treat upper and lower case as equal."],
      ["Remove and copy", "Copy the de-duplicated list."],
    ],
    faqs: [
      ["Is the order of lines changed?", "No. Unique lines stay in the order they first appeared."],
      ["Why were two identical-looking lines both kept?", "One probably has extra spaces or an invisible character. Trim the text first."],
      ["Can it remove blank lines too?", "Repeated blank lines collapse to one. Use the Text Cleaner to remove them all."],
    ],
    uses: [
      "Cleaning an email list before an import",
      "De-duplicating keywords gathered from several sources",
      "Tidying a list of URLs or product codes",
    ],
  },
  "sort-lines": {
    intro:
      "Sort Lines reorders a list in five ways: alphabetically A to Z, Z to A, shortest line first, longest line first, or numerically. Pick a mode and the sorted list appears ready to copy.\n\nNumeric mode exists because alphabetical sorting puts 10 before 2. If your lines are numbers or begin with numbers, numeric sorting orders them by value instead of by their first character.",
    steps: [
      ["Paste your lines", "One item per line."],
      ["Choose a sort mode", "A to Z, Z to A, by length or numeric."],
      ["Copy the result", "Use the copy button."],
    ],
    faqs: [
      ["Why does 10 come before 2?", "Alphabetical sorting compares characters left to right. Switch to Numeric to sort by value."],
      ["Is sorting case-sensitive?", "Alphabetical modes compare text using normal language rules, so upper and lower case versions of a word sort together."],
      ["What is sorting by length for?", "It quickly surfaces unusually short or long entries, such as incomplete rows in data."],
    ],
    uses: [
      "Alphabetising a list of names or references",
      "Ordering a set of measurements",
      "Finding the longest entries in a column of text",
    ],
  },
  "reverse-text": {
    intro:
      "Reverse Text flips text in one of three ways. Reverse characters mirrors the whole string, so 'hello' becomes 'olleh'. Reverse words keeps each word intact but puts them in the opposite order. Reverse lines turns a list upside down so the last line comes first.\n\nThe modes solve different problems: character reversal is for puzzles and testing, word reversal for rearranging phrases, and line reversal for flipping chronological lists such as logs that are newest-first when you want oldest-first.",
    steps: [
      ["Enter text", "Type or paste it in."],
      ["Choose a mode", "Characters, words or lines."],
      ["Copy the result", "Use Copy Result."],
    ],
    faqs: [
      ["How do I check for a palindrome?", "Reverse the characters and compare with the original, ignoring spaces and punctuation."],
      ["Does reversing characters work with emoji?", "Simple emoji survive, but combined emoji made of several parts can break apart."],
      ["Can I reverse the order of a list?", "Yes. Use Reverse lines."],
    ],
    uses: [
      "Flipping a log so the oldest entry is first",
      "Creating mirrored text for a puzzle",
      "Testing how a layout handles unusual strings",
    ],
  },
  "slug-generator": {
    intro:
      "Slug Generator turns a title into the short, lowercase, hyphenated form used at the end of a URL. 'What Is a PDF? A Complete Guide' becomes what-is-a-pdf-a-complete-guide. Accented letters are converted to plain equivalents, punctuation is removed, and spaces become the separator.\n\nYou can switch the separator between a hyphen and an underscore, and a Try an example button shows the behaviour on sample text. Search engines treat hyphens as word separators, which is why hyphenated slugs are the convention.",
    steps: [
      ["Enter a title", "Type or paste the page or post title."],
      ["Check the slug", "It is generated as you type."],
      ["Copy", "Paste it into your CMS's URL field."],
    ],
    faqs: [
      ["Hyphens or underscores?", "Hyphens. Google reads them as spaces between words; underscores join words together."],
      ["Should I remove words like 'a' and 'the'?", "Shorter slugs are easier to read and share, so trimming filler words is common, but the tool leaves that choice to you."],
      ["Can I change a slug after publishing?", "Only with a redirect from the old URL, otherwise existing links break."],
    ],
    uses: [
      "Creating clean URLs for blog posts",
      "Naming files and folders consistently",
      "Generating identifiers for headings and anchors",
    ],
  },
};
