import type { ToolCopyMap } from "./types";

export const pdfToolsCopy: ToolCopyMap = {
  "pdf-compressor": {
    intro:
      "PDF Compressor makes a PDF smaller by re-encoding the photos and scans inside it, which is where almost all of a large PDF's size comes from. Text, fonts and vector drawings are never touched, so the document stays sharp, searchable and selectable.\n\nThree levels are offered. Lossless only repacks the file's internal structure and changes nothing visible. Balanced re-encodes JPEG images at good quality and limits them to 2,000 pixels on the longest side. Smallest uses stronger compression and a 1,400 pixel limit. A fourth option, Target size, takes a limit such as 200 KB or 1 MB and compresses the images only as far as needed to get under it. Everything runs in your browser, and if the result would not be smaller you get the original back.",
    steps: [
      ["Add your PDF", "Drop one PDF onto the upload area or click it to choose a file."],
      ["Pick a level", "Lossless for contracts and archives, Balanced for everyday sharing, Smallest for email limits and web uploads."],
      ["Compare and download", "Check the before and after sizes and how many images were re-encoded, then download the copy named with _compressed."],
    ],
    faqs: [
      ["How do I compress a PDF to 200 KB or 1 MB?", "Choose Target size, enter the limit and compress. The tool steps through stronger image settings and stops at the first one that fits. If the limit cannot be reached, it gives you the smallest version and says so."],
      ["How much smaller will my PDF get?", "It depends on what is inside. Scans and photo-heavy PDFs often shrink by half or more on Balanced. A text-only PDF has no images to compress, so it changes by a few percent at most."],
      ["Will text become blurry?", "No. Only embedded photos are re-encoded. Text and vector graphics are stored separately and are copied unchanged."],
      ["Why were some images not re-encoded?", "Only standard RGB and greyscale JPEG images are processed. CMYK print images, PNG-style images and any image that would not end up at least 10 percent smaller are left exactly as they were."],
      ["Can it compress a password-protected PDF?", "No. Remove the password in your PDF reader first, then compress the unlocked copy."],
    ],
    uses: [
      "Getting a scanned document under an email attachment limit",
      "Shrinking a photo-heavy brochure or portfolio before uploading",
      "Reducing a phone-scanned form to fit a government or job portal's size cap",
    ],
  },
  "pdf-merger": {
    intro:
      "PDF Merger joins two or more PDF files into one document. Pages are copied whole from each source file, in the order the files appear in your list, so nothing is re-rendered and text stays selectable.\n\nYou can add files in any order and then use the up and down arrows to arrange them, or remove one you added by mistake. When the merge finishes, the tool reports how many files were combined, the total page count and the size of the result, which downloads as merged.pdf.",
    steps: [
      ["Add at least two PDFs", "Drop the files onto the upload area. You can add more afterwards."],
      ["Set the order", "Use the arrows beside each file to move it up or down. The top file becomes the first pages of the result."],
      ["Merge and download", "Start the merge, check the page count, and download merged.pdf."],
    ],
    faqs: [
      ["Can I reorder individual pages rather than whole files?", "This tool orders whole files. To rearrange single pages, merge first and then use the PDF Page Reorder tool on the result."],
      ["Will bookmarks and form fields survive the merge?", "Page content is copied exactly, but document-level features such as the bookmark outline and interactive form data may not carry over into the combined file."],
      ["Is there a limit on how many files I can merge?", "There is no fixed count. The practical limit is your device's memory, since every file is held in the browser while merging."],
      ["Can it merge password-protected PDFs?", "Files with an open password cannot be read. Remove the password in your PDF reader first, then merge."],
    ],
    uses: [
      "Combining a cover letter, CV and certificates into one application file",
      "Joining monthly statements into a single document for an accountant",
      "Putting separately scanned chapters back into one PDF",
    ],
  },
  "pdf-splitter": {
    intro:
      "PDF Splitter cuts one PDF into several smaller PDFs. It has two modes. By Page Range lets you type the groups you want, such as 1-3, 4-6, and produces one file per group. Every Page Separately turns each page into its own single-page PDF.\n\nPages are copied, not re-rendered, so text, links and image quality are the same as in the original. After splitting you get a list of the new files with their sizes, and you can save them one by one or trigger all the downloads together.",
    steps: [
      ["Add the PDF", "Drop the file in. The tool reads it and shows how many pages it has."],
      ["Choose how to split", "Enter page ranges separated by commas, or switch to splitting every page separately."],
      ["Save the parts", "Download individual parts, or use Download All to save each file in turn."],
    ],
    faqs: [
      ["How do I write the page ranges?", "Use a dash for a span and a comma between groups: 1-3, 4-6 gives two files. A single number such as 5 gives a one-page file."],
      ["Are the parts downloaded as a ZIP?", "No. Each part is a separate PDF download. Your browser may ask for permission to save multiple files."],
      ["Does splitting reduce quality?", "No. Pages are copied directly from the source document without re-rendering."],
      ["Can ranges overlap?", "Yes. Each range becomes its own file, so the same page can appear in more than one output."],
    ],
    uses: [
      "Pulling one chapter or one invoice out of a long PDF",
      "Sending a client only the pages that concern them",
      "Breaking a scanned batch into one file per document",
    ],
  },
  "pdf-to-jpg": {
    intro:
      "PDF to JPG renders every page of a PDF as a JPG image using PDF.js, the same rendering engine Firefox uses to display PDFs. You choose the output resolution: 72 dpi for small previews, 144 dpi for screen use, or 216 dpi when you need more detail.\n\nEach page becomes one image, saved at 92 percent JPG quality. The results list shows every page with its file size, and you can download pages individually or all in sequence. Because pages are drawn to a canvas in your browser, long documents at the highest resolution take noticeably longer and use more memory.",
    steps: [
      ["Add a PDF", "Drop the file onto the upload area."],
      ["Choose the resolution", "Pick 72, 144 or 216 dpi depending on how sharp the images need to be."],
      ["Download the images", "Save single pages or use Download All to save every page."],
    ],
    faqs: [
      ["Which resolution should I pick?", "144 dpi suits most on-screen uses. Choose 216 dpi if the image will be zoomed or printed small, and 72 dpi for thumbnails."],
      ["Can I get PNG instead of JPG?", "This tool outputs JPG only. JPG has no transparency, so pages are rendered on a white background."],
      ["Why are some pages slow to convert?", "Pages with many vector objects or large embedded images take longer to draw, especially at 216 dpi."],
      ["Does it extract the images embedded in the PDF?", "No. It takes a picture of each whole page, including text and graphics, rather than pulling out individual embedded images."],
    ],
    uses: [
      "Turning slides into images for a social media post",
      "Creating a preview image of a document's first page",
      "Inserting a PDF page into a tool that only accepts images",
    ],
  },
  "jpg-to-pdf": {
    intro:
      "JPG to PDF builds a PDF from JPG and PNG images, one image per page. Add several images, arrange them with the up and down arrows, and the PDF follows that order.\n\nTwo page-size options control the layout. Fit makes each page exactly the size of its image, which is ideal for photos and screenshots. A4 places each image centred on an A4 page, scaled to fit, which is better when the PDF will be printed. Images are embedded as they are, without recompression, so a PDF made from large photos will be large too.",
    steps: [
      ["Add images", "Drop JPG or PNG files onto the upload area. Each becomes one page."],
      ["Order them and pick a page size", "Move images up or down, then choose Fit or A4."],
      ["Create and download", "Generate the PDF and download it as images.pdf."],
    ],
    faqs: [
      ["Which image formats are accepted?", "JPG and PNG. Convert WebP, HEIC or other formats to one of those first."],
      ["What is the difference between Fit and A4?", "Fit sizes every page to its image with no margins. A4 uses a standard A4 page and centres the image on it."],
      ["Will my images lose quality?", "No. The original image data is embedded directly rather than being re-encoded."],
      ["Can I change the order after adding files?", "Yes. Use the arrows next to each image, or remove one and add it again."],
    ],
    uses: [
      "Combining phone photos of receipts into one expense file",
      "Turning scanned pages saved as images into a single document",
      "Packaging design screenshots into a PDF for review",
    ],
  },
  "pdf-page-number-adder": {
    intro:
      "PDF Page Number Adder stamps a number on every page of a PDF. Numbers are drawn in 10 pt Helvetica in dark grey, near the bottom edge of each page.\n\nYou control two things: where the number sits (bottom centre, bottom right or bottom left) and which number the first page starts from. Starting from a value other than 1 is useful when the file is one part of a larger document. The numbered copy downloads with numbered_ in front of the original file name.",
    steps: [
      ["Choose a PDF", "Drop the file in or click to browse."],
      ["Set position and start number", "Pick one of the three bottom positions and enter the first page's number."],
      ["Download the numbered PDF", "The tool adds a number to every page and saves a new copy."],
    ],
    faqs: [
      ["Can I skip the cover page?", "Not in this version. Every page gets a number. A workaround is to split off the cover, number the rest, and merge them again."],
      ["Can I change the font or size?", "No. Numbers use a fixed 10 pt Helvetica so they stay unobtrusive."],
      ["Can I add 'Page 1 of 10' style text?", "The tool writes the number only, without a total or prefix."],
      ["Will the numbers cover existing content?", "They are placed about a quarter inch above the bottom edge. If your pages already have a footer there, the two may overlap."],
    ],
    uses: [
      "Numbering a contract or report before sending it for signature",
      "Continuing numbering across a document that is split into several files",
      "Adding page references to scanned handouts",
    ],
  },
  "pdf-metadata-editor": {
    intro:
      "PDF Metadata Editor reads the properties stored inside a PDF and lets you change them. When you load a file it fills in the current title, author, subject, keywords and creator so you can see exactly what the document says about itself.\n\nEdit any field and save, and the tool writes a new copy of the PDF with the updated properties, named with meta_ in front. The page content is not touched. This is the information PDF readers show under Document Properties and that search engines often use as the title of a PDF in results.",
    steps: [
      ["Load a PDF", "Choose the file. The existing metadata appears in the form."],
      ["Edit the fields", "Change the title, author, subject, keywords or creator."],
      ["Save a new copy", "Download the PDF with the updated properties."],
    ],
    faqs: [
      ["Which fields can I edit?", "Title, author, subject, keywords and creator."],
      ["Does a blank field delete the existing value?", "No. Only fields that contain text are written, so leaving a field empty keeps whatever the file already had. To strip properties, use PDF Compressor on Medium or High."],
      ["Why does the title matter?", "Browsers show it in the tab, PDF readers show it in the window title, and search engines commonly use it as the headline for the PDF."],
      ["Does it change creation or modification dates?", "It does not offer date fields. Saving the file may update the modification date automatically."],
    ],
    uses: [
      "Giving a PDF a proper title before publishing it on a website",
      "Correcting the author name left behind by a template",
      "Adding keywords so a document is easier to find in a document library",
    ],
  },
  "pdf-page-reorder": {
    intro:
      "PDF Page Reorder builds a new PDF from the pages of an existing one, in whatever order you type. After loading a file the tool shows its page count, and you enter the new sequence as comma-separated page numbers, for example 1, 3, 2, 4.\n\nThe list is also how you delete or duplicate pages: any page number you leave out is dropped from the result, and a number entered twice appears twice. The output is saved with reordered_ in front of the file name. Note that ordering is done by typing numbers, not by dragging thumbnails.",
    steps: [
      ["Load the PDF", "Choose the file and note the page count shown."],
      ["Type the new order", "Enter page numbers separated by commas, leaving out any pages you want removed."],
      ["Save", "Download the rebuilt PDF."],
    ],
    faqs: [
      ["How do I delete a page?", "Leave its number out of the list. Only pages you list are included."],
      ["Can I repeat a page?", "Yes. Enter its number more than once."],
      ["Is there a visual drag-and-drop view?", "No. This version works from a typed list, which is quick for small changes but less convenient for very long documents."],
      ["What happens if I type a page number that does not exist?", "Numbers outside the document's range are ignored."],
    ],
    uses: [
      "Moving an appendix or signature page to the right place",
      "Removing blank pages from a scan",
      "Extracting a custom selection of pages in a new order",
    ],
  },
  "pdf-size-analyzer": {
    intro:
      "PDF Size Analyzer gives a quick factual summary of a PDF: the total file size, the number of pages, and the dimensions of every page. Each page is listed in points, inches and centimetres, so you can see at a glance whether a document is A4, US Letter or a mix of sizes.\n\nIt is an inspection tool and does not change the file. It also does not break the size down by images and fonts; what it tells you is how big the file is and how large each page is, which is usually enough to spot an oversized scan or a page with the wrong orientation.",
    steps: [
      ["Choose a PDF", "Drop the file in or click to browse."],
      ["Read the summary", "See the file size and page count at the top."],
      ["Check page dimensions", "Scan the per-page list for unexpected sizes or orientations."],
    ],
    faqs: [
      ["What are points?", "A point is 1/72 of an inch, the native unit of PDF. An A4 page is 595 by 842 points and US Letter is 612 by 792."],
      ["Does it show what is taking up space inside the file?", "No. It reports the overall size and page dimensions, not a per-image or per-font breakdown."],
      ["Why would pages in one PDF have different sizes?", "Merged documents and scans often mix sizes. Printers may scale or crop such pages differently, so it is worth checking before printing."],
      ["Is the file modified?", "No. The tool only reads it."],
    ],
    uses: [
      "Confirming page size before sending a file to a print shop",
      "Checking whether a scan came out as A4 or Letter",
      "Finding the odd landscape page in a long portrait document",
    ],
  },
  "pdf-to-text": {
    intro:
      "PDF to Text pulls the text layer out of a PDF and shows it in a box you can copy from or download as a .txt file. It reads every page in order using PDF.js and joins the results.\n\nIt works on PDFs that contain real text, such as documents exported from Word or a web page. A scanned PDF is a set of pictures and has no text layer, so this tool will return little or nothing for it; use the OCR PDF tool for those. Layout is not preserved: columns and tables come out as plain running text.",
    steps: [
      ["Choose a PDF", "Add the file. Extraction starts straight away."],
      ["Review the text", "The extracted text appears in a read-only box."],
      ["Copy or download", "Copy it to the clipboard or save it as a .txt file."],
    ],
    faqs: [
      ["Why is the output empty?", "The PDF is probably scanned images with no text layer. Run it through OCR PDF instead."],
      ["Does it keep tables and columns?", "No. Text is extracted in reading order as plain text, so table structure is lost."],
      ["Can it read password-protected PDFs?", "Not if the file needs a password to open."],
      ["Which languages are supported?", "Any language whose text is stored in the PDF as text. No recognition is involved, so there is no language setting."],
    ],
    uses: [
      "Getting the wording of a contract into an editor for comparison",
      "Feeding a report's text into a summariser or translator",
      "Quoting from a PDF that blocks easy selection",
    ],
  },
  "pdf-password-remover": {
    intro:
      "PDF Password Remover is not working reliably in this version and has been switched off. Decrypting a protected PDF needs a decryption engine that this browser-based build does not yet include, so the tool cannot guarantee a usable, unlocked file.\n\nIf you know the password, the dependable route today is your PDF reader: open the file, enter the password, and use Print to PDF or Save As to create an unprotected copy. Only remove protection from documents you own or are authorised to change.",
    steps: [
      ["Open the PDF in a reader", "Use Adobe Acrobat Reader, Preview on macOS, or your browser, and enter the password."],
      ["Print to PDF", "Choose Print and select Save as PDF as the destination."],
      ["Save the new copy", "The saved file opens without a password."],
    ],
    faqs: [
      ["Why is this tool unavailable?", "Removing PDF encryption correctly requires decrypting every object in the file. The current build cannot do that, and we would rather switch the tool off than hand back a broken document."],
      ["Can a forgotten password be recovered?", "No. Neither this site nor the print method can open a PDF without its password."],
      ["Is it legal to remove a PDF password?", "It is fine for your own documents. Removing protection from files you have no right to modify may breach copyright or contract terms."],
    ],
    uses: [
      "Making an unprotected archive copy of your own statement",
      "Preparing a protected file for a tool that cannot open encrypted PDFs",
    ],
  },
  "pdf-to-word": {
    intro:
      "PDF to Word extracts the text of a PDF and saves it as an RTF document, a format that Microsoft Word, Google Docs and LibreOffice all open and edit. Each page's text is placed under a 'Page N' heading, in order.\n\nThis is a text conversion, not a layout conversion. Fonts, images, columns and tables from the PDF are not reproduced; you get clean, editable wording to work with. It needs a PDF with a real text layer. If the file is a scan the tool tells you no text was found and points you to OCR PDF.",
    steps: [
      ["Add a text-based PDF", "Drop the file onto the upload area."],
      ["Convert", "The tool reads each page's text and builds an RTF file."],
      ["Open in your editor", "Open the downloaded .rtf in Word, Google Docs or LibreOffice and save as DOCX if you need to."],
    ],
    faqs: [
      ["Why RTF and not DOCX?", "RTF can be generated entirely in the browser and opens in every major word processor. Use Save As in Word to turn it into DOCX."],
      ["Will the layout match the PDF?", "No. Only the text is carried across. Images, tables and exact positioning are not."],
      ["It says no text was found. Why?", "The PDF is likely scanned. Extract its text with OCR PDF first."],
      ["Are page breaks kept?", "Yes. Each PDF page starts on a new page in the document, labelled with its page number."],
    ],
    uses: [
      "Editing the wording of a document when the original file is lost",
      "Reusing paragraphs from a PDF report in a new document",
      "Getting text into Word for tracked-changes review",
    ],
  },
  "word-to-pdf": {
    intro:
      "Word to PDF turns a .docx file into a PDF using your browser's print function. The document is converted to HTML with the Mammoth library, shown as a preview, and then opened in a print window where you choose Save as PDF.\n\nBecause the page is laid out by the browser rather than by Word, the result keeps headings, paragraphs, lists, tables and embedded images but not Word-specific layout such as exact fonts, headers and footers, columns or text boxes. For simple documents it is a fast way to get a PDF without Word installed.",
    steps: [
      ["Add a .docx file", "Drop the Word document in. A preview appears below."],
      ["Open the print view", "Click Print to PDF."],
      ["Save as PDF", "In the print dialog, set the destination to Save as PDF and save."],
    ],
    faqs: [
      ["Does it support the older .doc format?", "No. Only .docx is accepted. Open a .doc in Word or Google Docs and save it as .docx first."],
      ["Why does my PDF look different from Word?", "The browser lays the content out with its own fonts and page rules. Complex formatting, headers, footers and columns are not reproduced."],
      ["Can I set margins and paper size?", "Yes, in the browser's print dialog, which also lets you turn off the default header and footer lines."],
      ["Is the document content safe to preview?", "The converted content is cleaned of scripts and active links before it is displayed."],
    ],
    uses: [
      "Making a PDF of a letter on a machine without Word",
      "Sharing meeting notes in a format nobody can accidentally edit",
      "Quickly checking what a .docx contains",
    ],
  },
  "pdf-to-excel": {
    intro:
      "PDF to Excel reads the text of a PDF and writes it out as a CSV file that opens in Excel, Google Sheets or Numbers. Every line of text becomes a row, and wherever a line has a tab or a gap of two or more spaces, the tool starts a new column.\n\nThat rule works well for simple tables with clear spacing, such as price lists and statements. Tables with merged cells, wrapped text or tight spacing will need tidying in the spreadsheet afterwards. A blank row separates each page. Scanned PDFs have no text to read, so run those through OCR first.",
    steps: [
      ["Add a text-based PDF", "Drop the file onto the upload area."],
      ["Export", "The tool extracts the text and splits it into rows and columns."],
      ["Open the CSV", "Open the downloaded file in your spreadsheet app and adjust any columns that did not line up."],
    ],
    faqs: [
      ["Why CSV and not XLSX?", "CSV opens in every spreadsheet program and holds the same cell values. Save it as XLSX from Excel if you need formatting."],
      ["Why are some columns misaligned?", "Column detection relies on wide gaps between values. Cells containing long text or narrow gaps can end up merged or split."],
      ["Does it find only the tables?", "No. All text on each page is exported, including headings and paragraphs, which you can delete in the spreadsheet."],
      ["Can it read scanned bank statements?", "Not directly, because they contain images rather than text."],
    ],
    uses: [
      "Getting a price list out of a supplier's PDF catalogue",
      "Moving figures from a PDF statement into a spreadsheet",
      "Collecting tabular data from reports for analysis",
    ],
  },
  "excel-to-pdf": {
    intro:
      "Excel to PDF takes a CSV file, shows it as a bordered table, and lets you save that table as a PDF through your browser's print dialog. The first row is treated as the header and shown in bold.\n\nIt accepts CSV only, not .xlsx workbooks, so export the sheet you need as CSV from Excel or Google Sheets first. Formulas, colours, charts and multiple sheets are not part of a CSV and therefore do not appear. What you get is a clean, readable printout of the values.",
    steps: [
      ["Export your sheet as CSV", "In your spreadsheet app, save or download the sheet as .csv."],
      ["Add the CSV", "Drop it onto the upload area and check the table preview."],
      ["Print to PDF", "Click Print to PDF and choose Save as PDF in the dialog."],
    ],
    faqs: [
      ["Can I upload an .xlsx file?", "No. Only CSV is supported."],
      ["How are wide tables handled?", "The table is fitted to the page width. For many columns, choose landscape orientation in the print dialog."],
      ["Are values containing commas handled?", "Values are split on every comma, so text fields that contain commas will spill into extra columns."],
      ["Is cell content displayed safely?", "Yes. Cell text is shown as plain text, so any HTML inside a CSV is displayed rather than run."],
    ],
    uses: [
      "Printing an exported data table for a meeting",
      "Attaching a read-only copy of figures to an email",
      "Archiving a snapshot of a CSV report",
    ],
  },
  "pdf-to-powerpoint": {
    intro:
      "PDF to PowerPoint creates a .pptx presentation with one slide per PDF page. Each slide carries a small 'Page N' label and the text of that page in an editable text box, built with the PptxGenJS library.\n\nIt carries across text only. Images, charts and the original page design are not placed on the slides, and very long pages are cut at about 1,200 characters so the text fits. Think of it as a starting outline you can restyle in PowerPoint or Google Slides, not a visual copy of the PDF.",
    steps: [
      ["Add a text-based PDF", "Drop the file onto the upload area."],
      ["Convert", "The tool reads each page and builds one slide for it."],
      ["Open and style", "Open the .pptx in PowerPoint or Google Slides and apply your own layout."],
    ],
    faqs: [
      ["Will my slides look like the PDF pages?", "No. Only the text is transferred, in a plain layout."],
      ["Why is some text missing from a slide?", "Each slide holds roughly the first 1,200 characters of its page to keep the text readable."],
      ["Does it work with scanned PDFs?", "No. Scans contain no extractable text."],
      ["Can I open the result in Google Slides or Keynote?", "Yes. Both import .pptx files."],
    ],
    uses: [
      "Turning a written report into a first-draft slide outline",
      "Recovering the text of a deck that only survives as a PDF",
      "Preparing speaker notes from a document",
    ],
  },
  "powerpoint-to-pdf": {
    intro:
      "PowerPoint to PDF converts a .pptx presentation into a PDF with one page per slide, at the slide's own size. The file is opened in your browser, each slide is drawn using the positions stored in the presentation, and the pages are assembled into a PDF; nothing is uploaded.\n\nIt is a basic converter. Slide backgrounds, text boxes, pictures, simple shapes and tables are reproduced, and text in any language your device has fonts for is supported. Charts, SmartArt, gradients, shadows, theme fonts and animations are not, and slides are stored as images, so text in the PDF cannot be selected. For a pixel-perfect result, export from PowerPoint or Google Slides.",
    steps: [
      ["Drop a .pptx file", "Older .ppt files must be saved as .pptx first."],
      ["Wait for the slides to render", "Progress is shown slide by slide, with a preview of the first one."],
      ["Download the PDF", "Check it before sharing, especially slides with charts."],
    ],
    faqs: [
      ["Why does my slide look different from PowerPoint?", "The converter draws text, pictures, shapes and tables but does not implement PowerPoint's full layout engine. Theme fonts are replaced with a standard sans-serif, and charts and SmartArt are left out."],
      ["Can I select or search the text in the PDF?", "No. Each slide is placed in the PDF as an image."],
      ["Does it support .ppt, Keynote or Google Slides files?", "Only .pptx. Export other formats to .pptx first, or export a PDF directly from that application."],
      ["Are speaker notes included?", "No. Only the slides themselves are converted."],
    ],
    uses: [
      "Sending a simple deck to someone who does not have PowerPoint",
      "Making a quick handout from text-and-picture slides",
      "Uploading slides to a portal that accepts only PDF",
    ],
  },
  "pdf-protector": {
    intro:
      "PDF Password Protector is switched off in this version. Proper PDF protection means encrypting the file's contents with AES, and the browser build of this site does not yet include an encryption engine that can do that. A tool that only relabels a file would give a false sense of security, so it is disabled until real encryption is in place.\n\nTo protect a PDF today, use software that encrypts it: Adobe Acrobat, Preview on macOS (Export, then Permissions or Encrypt), LibreOffice's PDF export options, or Microsoft Word's Save as PDF options.",
    steps: [
      ["Open the PDF in a desktop app", "Preview on macOS and LibreOffice are free options."],
      ["Choose the encrypt option on export", "Set an open password of at least twelve characters."],
      ["Test the result", "Close and reopen the file to confirm it asks for the password."],
    ],
    faqs: [
      ["Why is this tool unavailable?", "It could not genuinely encrypt files, and a PDF that looks protected but is not is worse than no tool at all."],
      ["What makes PDF protection strong?", "AES-256 encryption with a long, unique open password. Permission-only restrictions without an open password are easily bypassed."],
      ["Can a protected PDF still be compressed or merged?", "Usually not until the password is removed, because other tools cannot read encrypted content."],
    ],
    uses: [
      "Sending payslips or contracts by email",
      "Storing identity documents in shared cloud folders",
    ],
  },
  "ocr-pdf": {
    intro:
      "OCR PDF gets text out of scanned PDFs. It first checks whether the file already has a text layer; if it does, that text is returned immediately with no recognition needed. If the pages are images, each one is rendered and read with Tesseract.js, an open-source OCR engine that runs inside your browser.\n\nRecognition uses the English language model, so English and other Latin-alphabet text without special characters is read best. A progress line shows which page is being processed. The recognised text appears in a box and can be downloaded as a .txt file. The engine and language data are downloaded the first time you run it.",
    steps: [
      ["Add a scanned PDF", "Drop the file onto the upload area."],
      ["Run Extract Text", "Watch the progress as each page is recognised."],
      ["Use the text", "Read it on screen or download it as a text file."],
    ],
    faqs: [
      ["How accurate is the recognition?", "Clean, straight scans at 300 dpi of printed text come out well. Handwriting, skewed pages, low resolution and coloured backgrounds reduce accuracy."],
      ["Which languages does it read?", "The English model is loaded. Other languages using accented or non-Latin characters will have errors."],
      ["Does it produce a searchable PDF?", "No. The output is plain text, not a PDF with a hidden text layer."],
      ["Why is the first run slow?", "The OCR engine and its language file have to be downloaded once, and recognition itself is processor-intensive."],
    ],
    uses: [
      "Pulling text from a scanned letter or contract",
      "Making the content of old paper records searchable",
      "Copying figures from a photographed document",
    ],
  },
  "pdf-watermark": {
    intro:
      "PDF Watermark writes a line of text diagonally across the centre of every page of a PDF. The default is CONFIDENTIAL in grey at 15 percent opacity, rotated 45 degrees, but the text, colour, font size and opacity are all adjustable.\n\nThe watermark is drawn into each page in Helvetica Bold and becomes part of the page content, so it shows on screen and in print. The result is saved as a new file ending in -watermarked. Because the mark is real page content, it cannot be switched off like a layer, though anyone with PDF editing software could still remove it.",
    steps: [
      ["Add a PDF", "Drop the file onto the upload area."],
      ["Set the watermark", "Type the text and adjust colour, size and opacity."],
      ["Apply and download", "The tool stamps every page and downloads the new PDF."],
    ],
    faqs: [
      ["Can I use an image or logo as the watermark?", "No. This tool adds text only."],
      ["Can I watermark only some pages?", "No. The text is applied to every page. Split the document first if you need to mark only part of it."],
      ["What opacity works best?", "Between 10 and 20 percent keeps the page readable. Higher values make the mark more prominent but can obscure text."],
      ["Does it work with non-English text?", "The built-in Helvetica font covers Latin characters. Text in other scripts may not render."],
    ],
    uses: [
      "Marking a draft so it is not mistaken for the final version",
      "Labelling confidential documents before circulation",
      "Adding a company or recipient name to shared proposals",
    ],
  },
};
