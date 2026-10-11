import type { ToolCopyMap } from "./types";

export const imageToolsCopy: ToolCopyMap = {
  "image-enhancer": {
    intro:
      "Image Enhancer adjusts a photo with six controls: brightness, contrast, saturation, colour temperature, sharpness and vignette. A split view shows the original on one side and the adjusted version on the other, and you drag the divider to compare.\n\nAuto Enhance reads the image's histogram and sets the sliders for you; it is a rule-based correction, not a generative AI model, so it never invents detail. Six presets (Portrait, Vivid, Landscape, Soft, B & W and Night) give a starting point. The result is exported as a JPG at the quality you choose, with _enhanced added to the name.",
    steps: [
      ["Add a photo", "Drop a JPG, PNG, WebP or AVIF image onto the upload area."],
      ["Adjust", "Click Auto Enhance or a preset, then fine-tune the sliders while watching the split preview."],
      ["Export", "Set the output quality and download the JPG."],
    ],
    faqs: [
      ["What does Auto Enhance actually do?", "It measures how light, dark and colourful the image is and moves the brightness, contrast and colour sliders towards a balanced result. You can change any slider afterwards."],
      ["Can I export as PNG?", "No. The enhanced image is saved as JPG, so transparency is not kept."],
      ["Does it increase resolution?", "No. The output has the same pixel dimensions as the input. Sharpening improves edge definition but does not add detail."],
    ],
    uses: [
      "Brightening an underexposed phone photo",
      "Giving product pictures a consistent look with one preset",
      "Converting a colour photo to black and white",
    ],
  },
  "image-compressor": {
    intro:
      "Image Compressor reduces image file sizes by re-encoding them at a quality level you set with a slider from 5 to 100. Results update live as you move it, with the original and new size shown for each file, so you can stop at the point where the saving is good and the image still looks right.\n\nYou can add several images, optionally cap the width in pixels, and choose the output format. On the Auto setting, JPG and WebP inputs become JPG and PNG inputs become WebP, because PNG itself has no quality setting to trade against size. Animated GIFs are flattened to a single frame.",
    steps: [
      ["Add images", "Drop JPG, PNG, WebP or GIF files. You can add more than one."],
      ["Tune quality and size", "Move the quality slider, and set a maximum width if the image is larger than it needs to be."],
      ["Download", "Save files one at a time or use Download All."],
    ],
    faqs: [
      ["Why did my PNG turn into a WebP?", "On Auto, PNGs are saved as WebP because that is where the size reduction comes from. Choose PNG as the output format to keep the type, though the file may not get smaller."],
      ["What quality should I use?", "Between 70 and 85 is usually indistinguishable from the original for photos. Go lower for thumbnails."],
      ["Does it keep animation in GIFs?", "No. Only the first frame is processed."],
      ["Is metadata kept?", "No. Re-encoding through the browser drops EXIF data such as location and camera details."],
    ],
    uses: [
      "Shrinking photos before uploading them to a website",
      "Getting an image under a form's upload size limit",
      "Reducing page weight by converting PNG graphics to WebP",
    ],
  },
  "image-resizer": {
    intro:
      "Image Resizer changes the pixel dimensions of an image in one of three ways: exact width and height, a percentage of the original, or a preset such as HD 1280x720, Full HD, 4K, a 1080 square social post, or a 1200x630 Open Graph image.\n\nWith Maintain aspect ratio switched on, typing one dimension fills in the other so the picture is not stretched. The resize runs automatically shortly after you stop typing, and the panel shows the original dimensions, the new dimensions and the output file size before you download.",
    steps: [
      ["Add an image", "Drop a JPG, PNG, WebP or GIF."],
      ["Choose a mode", "Enter pixels, a percentage, or pick a preset size."],
      ["Download", "Check the new dimensions and size, then save the image."],
    ],
    faqs: [
      ["Will enlarging an image make it sharper?", "No. Upscaling spreads the existing pixels over a larger area, so the image gets softer. Resizing down keeps quality."],
      ["What happens if I turn off aspect ratio?", "The image is stretched or squashed to exactly the width and height you enter."],
      ["Does a preset crop my image?", "Presets set the target dimensions. If the shape differs from your image, crop it first with the Image Cropper to avoid distortion."],
    ],
    uses: [
      "Making an image fit a required upload size",
      "Producing a 1200x630 sharing image for a web page",
      "Halving the dimensions of screenshots for documentation",
    ],
  },
  "jpg-to-png": {
    intro:
      "JPG to PNG re-saves JPG images in PNG format. PNG is lossless, so once converted the image will not lose any more quality however many times it is opened and saved, which is why designers convert a JPG before editing it repeatedly.\n\nThe conversion cannot undo compression that already happened: blockiness present in the JPG is carried into the PNG, and the file will usually be larger. It also does not create transparency, since a JPG has none. You can convert several files in one go and save them individually or all together.",
    steps: [
      ["Add JPG files", "Drop one or more images onto the upload area."],
      ["Convert", "Each file is redrawn and saved as PNG."],
      ["Download", "Save single files or use the All button."],
    ],
    faqs: [
      ["Why is the PNG bigger than the JPG?", "PNG stores every pixel exactly, while JPG discards detail to save space. Photos are almost always larger as PNG."],
      ["Will the background become transparent?", "No. Use the Background Remover for that; this tool only changes the file format."],
      ["Does the image get sharper?", "No. Quality stays exactly as it was in the JPG."],
    ],
    uses: [
      "Preparing a logo or screenshot for repeated editing",
      "Meeting an upload requirement that only accepts PNG",
      "Stopping further quality loss on an image you will re-save often",
    ],
  },
  "png-to-jpg": {
    intro:
      "PNG to JPG converts PNG images to JPG at 92 percent quality, which keeps photos looking the same while cutting the file size substantially. It is the usual fix for a PNG photo or screenshot that is too heavy to email or upload.\n\nJPG has no transparency, so any see-through areas in the PNG are filled with white. Sharp-edged graphics such as text and logos can pick up slight fuzziness around edges in JPG; for those, WebP is often a better target. Multiple files can be converted together.",
    steps: [
      ["Add PNG files", "Drop one or more PNGs onto the upload area."],
      ["Convert", "Files are saved as JPG at 92 percent quality."],
      ["Download", "Save each file or all of them."],
    ],
    faqs: [
      ["What happens to transparent areas?", "They become white, because JPG cannot store transparency."],
      ["Can I change the quality?", "This converter uses a fixed 92 percent. For a quality slider, use the Image Compressor and choose JPEG output."],
      ["How much smaller will the file be?", "For photographic PNGs, commonly 70 to 90 percent smaller. Flat graphics save less."],
    ],
    uses: [
      "Making a large PNG photo small enough to attach to an email",
      "Converting screenshots for a site that only accepts JPG",
      "Reducing storage used by exported images",
    ],
  },
  "png-to-webp": {
    intro:
      "PNG to WebP converts PNG images to WebP at 90 percent quality. WebP keeps transparency, which JPG cannot, and typically produces a much smaller file than PNG, making it the standard choice for graphics on websites.\n\nAll current versions of Chrome, Firefox, Safari and Edge display WebP. Some older desktop software and a few upload forms still do not accept it, so keep the PNG if the image is going somewhere other than a web page. Several files can be converted in one batch.",
    steps: [
      ["Add PNG files", "Drop them onto the upload area."],
      ["Convert", "Each PNG is saved as WebP at 90 percent quality."],
      ["Download", "Save the WebP files individually or together."],
    ],
    faqs: [
      ["Is transparency preserved?", "Yes. WebP supports an alpha channel, so transparent backgrounds stay transparent."],
      ["Is the conversion lossless?", "No. It uses high-quality lossy WebP, which is visually very close to the original at a fraction of the size."],
      ["Do all browsers support WebP?", "All modern ones do. Internet Explorer and very old Safari versions do not."],
    ],
    uses: [
      "Speeding up a web page by replacing heavy PNG graphics",
      "Shrinking transparent product cut-outs for an online shop",
      "Improving Largest Contentful Paint scores",
    ],
  },
  "webp-to-jpg": {
    intro:
      "WebP to JPG converts WebP images, the format many websites now serve, into JPG files that every photo viewer, editor and upload form accepts. A quality slider lets you choose between a smaller file and a closer match to the original.\n\nTransparent areas in a WebP are filled with white, as JPG has no transparency. You can add several WebP files at once; each converted file is listed with its size and can be downloaded on its own, or you can save them all in sequence.",
    steps: [
      ["Add WebP files", "Drop one or more .webp images onto the upload area."],
      ["Set quality", "Adjust the slider if you want a smaller or higher-quality JPG."],
      ["Download", "Save individual files or use Download all."],
    ],
    faqs: [
      ["Why can't I open WebP files in my software?", "Older image viewers and editors were released before WebP became common. Converting to JPG makes the image usable anywhere."],
      ["Are files downloaded as a ZIP?", "No. Each JPG downloads as its own file."],
      ["Does converting lose quality?", "Slightly, because both formats are lossy. At the default quality the difference is not visible in normal use."],
    ],
    uses: [
      "Opening an image saved from a website in older software",
      "Uploading to a platform that rejects WebP",
      "Inserting a web image into a document or slide",
    ],
  },
  "webp-to-png": {
    intro:
      "WebP to PNG converts WebP images to PNG, keeping transparency intact. PNG is lossless and universally supported, so it is the safe choice when a WebP graphic, icon or cut-out needs to go into design software or a document.\n\nThe PNG will be larger than the WebP, sometimes several times larger for photos, because PNG does not discard any detail. Multiple files can be converted together and saved individually or all at once.",
    steps: [
      ["Add WebP files", "Drop them onto the upload area."],
      ["Convert", "Each image is saved as a PNG."],
      ["Download", "Save one file or all of them."],
    ],
    faqs: [
      ["Is the transparent background kept?", "Yes. PNG supports transparency and it is carried across."],
      ["Why is the PNG so much larger?", "WebP compresses far more efficiently. PNG stores each pixel exactly."],
      ["Should I pick JPG or PNG?", "PNG for graphics, logos and anything with transparency; JPG for photos where file size matters."],
    ],
    uses: [
      "Editing a downloaded icon in design software",
      "Keeping a transparent cut-out usable in presentations",
      "Archiving web graphics in a lossless format",
    ],
  },
  "image-cropper": {
    intro:
      "Image Cropper lets you drag a selection box over an image and keep only what is inside it. The crop can be free-form or locked to a fixed aspect ratio, and the current selection size in pixels is shown as you adjust it.\n\nThe crop is taken from the original pixels, so the kept area is not resampled or scaled. The result is saved in the same format as the image you loaded. You can load a different image at any time without leaving the tool.",
    steps: [
      ["Add an image", "Drop it onto the upload area."],
      ["Position the selection", "Pick free or a fixed ratio, then drag the box and its handles."],
      ["Apply and download", "Click Apply Crop, check the result and save it."],
    ],
    faqs: [
      ["Does cropping reduce quality?", "No. The kept pixels are copied unchanged; only the surrounding area is removed."],
      ["Can I crop to an exact pixel size?", "The selection size is displayed while you drag. For an exact output size, crop to the right shape here and then use the Image Resizer."],
      ["What format is the result?", "The same as the source image, falling back to JPG if the type is unknown."],
    ],
    uses: [
      "Trimming a screenshot to the relevant part",
      "Cutting a photo to a square for a profile picture",
      "Removing distracting edges before publishing",
    ],
  },
  "background-remover": {
    intro:
      "Background Remover makes a single-colour background transparent. It works by colour matching: pixels close to the chosen background colour are erased, and a tolerance slider controls how close a colour must be to count.\n\nThree modes set the colour to remove. Auto-detect samples the image's corners, White BG targets white, and Green Screen targets chroma green. This is a colour-key method, not AI subject detection, so it suits product shots on plain backdrops, logos and green-screen frames. Busy or gradient backgrounds will not separate cleanly. The result is a PNG with transparency.",
    steps: [
      ["Add an image", "Use one with a plain, even background."],
      ["Choose mode and tolerance", "Pick the background type, then raise tolerance until the background disappears without eating into the subject."],
      ["Download the PNG", "The transparent result is shown on a checkerboard and saved as PNG."],
    ],
    faqs: [
      ["Why is part of my subject disappearing?", "Its colour is too close to the background. Lower the tolerance, or use a backdrop that contrasts more with the subject."],
      ["Does it work on photos with complex backgrounds?", "Not well. It removes one colour range, so scenery or patterned backgrounds remain."],
      ["Why are there fringes around the edges?", "Edge pixels blend subject and background colours. A slightly higher tolerance usually removes the halo."],
    ],
    uses: [
      "Cutting out products photographed on a white sweep",
      "Making a logo with a white box transparent",
      "Keying out a green screen from a still frame",
    ],
  },
  "svg-to-png": {
    intro:
      "SVG to PNG turns vector graphics into PNG images at the size you need. Upload an .svg file or paste SVG code, pick a scale multiplier, and the vector is drawn at that size, so a small icon can be exported large and stay perfectly sharp.\n\nThe background can be transparent or filled with a colour of your choice. The output dimensions are displayed before you download. Fonts referenced by the SVG but not installed on your device may render with a fallback typeface, so convert text to outlines in your design tool if exact lettering matters.",
    steps: [
      ["Provide the SVG", "Drop a file or paste the code."],
      ["Set scale and background", "Choose the multiplier and either a colour or transparent."],
      ["Convert and download", "Check the pixel dimensions and save the PNG."],
    ],
    faqs: [
      ["What scale should I use?", "2x is a good default for high-density screens. Use a higher value when the PNG will be printed or shown large."],
      ["Why does my text look different?", "The SVG uses a font that is not available in your browser. Outline the text before exporting the SVG."],
      ["Are external images inside the SVG included?", "Linked external files generally are not loaded. Embed them in the SVG first."],
    ],
    uses: [
      "Exporting a logo for platforms that do not accept SVG",
      "Creating app icons at several sizes from one vector",
      "Producing a preview image of an illustration",
    ],
  },
  "avif-to-jpg": {
    intro:
      "AVIF to JPG converts AVIF images into JPG so they open in software that has not caught up with the newer format. AVIF is efficient, but plenty of editors, email clients and upload forms still reject it.\n\nYour browser decodes the AVIF and re-saves it as JPG at the quality you set, from 10 to 100 percent. The tool handles one image at a time and names the output after the original file. It relies on your browser being able to display AVIF, which current Chrome, Firefox, Edge and Safari can.",
    steps: [
      ["Choose an AVIF file", "Select the image you want to convert."],
      ["Set quality", "Higher values keep more detail at the cost of size."],
      ["Convert", "The JPG downloads with the same file name."],
    ],
    faqs: [
      ["Why won't my AVIF load?", "Your browser may be too old to decode AVIF. Update it or try a current version of Chrome or Firefox."],
      ["Is transparency kept?", "No. JPG has no transparency. Use AVIF to PNG if the image has a transparent background."],
      ["Can I convert many files at once?", "This tool takes one file at a time. The Bulk Image Converter handles batches."],
    ],
    uses: [
      "Opening an image downloaded from a site that serves AVIF",
      "Attaching a picture to a system that only accepts JPG",
      "Sending photos to someone using older software",
    ],
  },
  "jpg-to-avif": {
    intro:
      "JPG to AVIF re-encodes a JPG as AVIF, a modern format that usually reaches the same visual quality in a noticeably smaller file. A quality slider from 10 to 100 percent lets you balance size against fidelity.\n\nEncoding is done by your browser, and not every browser can write AVIF. Chrome and Edge support it; where encoding is unavailable the tool warns you and falls back to PNG. For that reason it is worth checking the downloaded file's extension the first time you use it.",
    steps: [
      ["Choose a JPG", "Select the image to convert."],
      ["Set quality", "Around 60 to 80 percent gives strong savings with little visible change."],
      ["Convert", "Download the AVIF and confirm the file type."],
    ],
    faqs: [
      ["Why did I get a PNG instead of AVIF?", "Your browser cannot encode AVIF, so the tool fell back to PNG. Try Chrome or Edge."],
      ["Can every browser display AVIF?", "All current major browsers can. Keep a JPG fallback if you must support very old ones."],
      ["Does converting improve quality?", "No. It can only match the JPG's quality at a smaller size, never exceed it."],
    ],
    uses: [
      "Cutting image weight on a performance-sensitive website",
      "Preparing hero images for faster loading",
      "Testing how much smaller your photos are in AVIF",
    ],
  },
  "avif-to-png": {
    intro:
      "AVIF to PNG converts AVIF images to PNG, keeping any transparency. PNG is lossless and accepted practically everywhere, which makes it the right target when an AVIF graphic needs to go into a design tool, a document or an older content system.\n\nThe browser decodes the AVIF and writes every pixel into a PNG without further loss. Expect a much larger file, since AVIF's compression is far more aggressive. One image is converted at a time.",
    steps: [
      ["Choose an AVIF file", "Select the image."],
      ["Convert", "The image is decoded and saved as PNG."],
      ["Download", "The PNG keeps the original file name."],
    ],
    faqs: [
      ["Is the transparent background preserved?", "Yes. PNG supports transparency."],
      ["Why is there no quality setting?", "PNG is lossless, so there is nothing to trade off."],
      ["Why is the PNG so large?", "PNG stores exact pixel data, while AVIF discards detail the eye is unlikely to notice."],
    ],
    uses: [
      "Editing an AVIF graphic in software that cannot open it",
      "Converting transparent AVIF assets for slides",
      "Keeping a lossless master copy",
    ],
  },
  "svg-optimizer": {
    intro:
      "SVG Optimizer shrinks SVG code by removing what a browser does not need to draw the image: the XML declaration, comments, metadata, title and description elements, empty groups and surplus whitespace. Long decimal coordinates are rounded to two places, and a few redundant default attributes are dropped.\n\nPaste your SVG on the left and the optimised version appears on the right, with the original size, new size and percentage saved. A live preview lets you confirm the image still looks right before you copy the code or save it as optimized.svg.",
    steps: [
      ["Paste your SVG", "Replace the sample code with your own."],
      ["Check the preview", "Make sure the drawing is unchanged and note the saving."],
      ["Copy or save", "Copy the optimised code or download the file."],
    ],
    faqs: [
      ["Will removing the title affect accessibility?", "It can. The title element provides an accessible name for the graphic. Add it back, or set aria-label where you use the SVG, if the image conveys meaning."],
      ["Could rounding change how my SVG looks?", "Two decimal places is precise enough for almost all artwork. Very small or highly detailed drawings should be checked in the preview."],
      ["Is it safe to paste any SVG?", "Yes. The preview is rendered as an image, so scripts inside an SVG do not run."],
    ],
    uses: [
      "Cleaning up SVGs exported from Illustrator or Figma",
      "Reducing icon sizes before inlining them in HTML",
      "Trimming bytes from a sprite sheet",
    ],
  },
  "image-dpi-converter": {
    intro:
      "Image DPI Converter resizes an image so it has the right number of pixels for a target print resolution. You enter the DPI the image was made at and the DPI you need, and the tool scales the pixel dimensions by that ratio: going from 72 to 300 DPI makes the image a little over four times wider and taller.\n\nThis is a resampling tool. It changes how many pixels the image has, so that it prints at the same physical size with the higher density. It does not simply rewrite a DPI tag in the file. Output can be JPG or PNG.",
    steps: [
      ["Upload an image", "Its current pixel dimensions are shown."],
      ["Enter source and target DPI", "For example 72 as the source and 300 as the target."],
      ["Convert and download", "The new dimensions are displayed and the file is saved with the DPI in its name."],
    ],
    faqs: [
      ["Does raising the DPI improve print quality?", "It gives the printer more pixels, but they are interpolated from the original. A genuinely higher-resolution source will always print better."],
      ["What DPI do printers need?", "300 DPI is standard for photos and brochures. Large posters viewed from a distance can use 150."],
      ["Why did my image get so much bigger?", "Pixel count scales with the DPI ratio in both directions, so 72 to 300 multiplies the pixel area by about seventeen."],
    ],
    uses: [
      "Preparing a web image for a print layout",
      "Meeting a journal's or printer's 300 DPI requirement",
      "Downscaling a print file to screen resolution",
    ],
  },
  "exif-remover": {
    intro:
      "EXIF Data Remover strips the hidden metadata block from JPEG photos. That block can hold the GPS coordinates where the picture was taken, the date and time, and the make and model of the camera or phone, all of which travel with the file when you share it.\n\nThe tool removes the metadata segment from the file without re-encoding the picture, so image quality is exactly the same. It reports how many tags were stripped and saves a copy with noexif_ in front of the name. It works on JPEG files only, which is where cameras and phones store EXIF.",
    steps: [
      ["Add a JPEG", "Drop the photo or click to browse."],
      ["Review what was found", "The tool lists the metadata it detected."],
      ["Download the clean copy", "Save the EXIF-free image."],
    ],
    faqs: [
      ["Does removing EXIF reduce image quality?", "No. The picture data is untouched; only the metadata segment is removed."],
      ["Does it work on PNG or HEIC?", "No. This tool handles JPEG only."],
      ["Do social networks remove EXIF for me?", "Most large platforms strip it on upload, but email, messaging apps that send original files, and cloud links do not."],
    ],
    uses: [
      "Removing your home location from photos before selling items online",
      "Sharing pictures without revealing which device took them",
      "Cleaning images before publishing them on a blog",
    ],
  },
  "exif-viewer": {
    intro:
      "EXIF Viewer shows the metadata embedded in a JPEG photo. Depending on the camera, that can include the make and model, the date and time of capture, exposure time, aperture, ISO, focal length and, if location services were on, GPS coordinates.\n\nNothing about the photo is changed; the tool only reads and lists the tags it finds. If a photo has no EXIF, which is common for images that have passed through social networks or screenshots, it tells you so.",
    steps: [
      ["Add a JPEG", "Drop the photo onto the upload area."],
      ["Read the tags", "Browse the list of metadata fields and values."],
      ["Act on what you see", "If the photo contains location data you do not want to share, run it through the EXIF Data Remover."],
    ],
    faqs: [
      ["Why does my photo show no EXIF data?", "It may have been stripped by a messaging app or social network, or the image may be a screenshot or an export that never had any."],
      ["Can I see where a photo was taken?", "If GPS tags are present, the latitude and longitude are listed."],
      ["Which files are supported?", "JPEG only."],
    ],
    uses: [
      "Checking what a photo reveals before posting it",
      "Finding the camera settings used for a shot you like",
      "Verifying when a picture was taken",
    ],
  },
  "favicon-generator": {
    intro:
      "Favicon Generator makes a set of square PNG icons from one image, in ten sizes from 16 to 512 pixels. That covers browser tabs (16, 32, 48), the Apple touch icon (180) and the Android and PWA icons (192 and 512).\n\nYou can set a background colour, add padding around the artwork, and round the corners. Previews of every size update when you regenerate, and each PNG can be downloaded on its own or all together. A ready-to-paste HTML snippet with the link tags is included. The tool outputs PNG files; it does not build a multi-size .ico file.",
    steps: [
      ["Upload your logo", "A square image with a transparent background works best."],
      ["Adjust the look", "Choose a background colour, padding and rounded corners, then regenerate."],
      ["Download and install", "Save the icons, upload them to your site and paste the HTML snippet into the head."],
    ],
    faqs: [
      ["Do I still need a favicon.ico?", "Modern browsers use the PNG link tags. A favicon.ico at the site root is only needed for very old browsers and some crawlers."],
      ["Which sizes matter most?", "32 for browser tabs, 180 for Apple devices, and 192 plus 512 for Android and installable web apps."],
      ["Why does my small icon look blurry?", "Detailed logos do not survive at 16 pixels. Use a simplified mark for the smallest sizes."],
    ],
    uses: [
      "Setting up icons for a new website",
      "Creating PWA icons for a web app manifest",
      "Refreshing favicons after a rebrand",
    ],
  },
  "social-image-resizer": {
    intro:
      "Social Media Image Resizer fits one image to the dimensions each platform expects. Presets cover Instagram square, portrait and story, Facebook post and cover, Twitter/X post and header, LinkedIn post and cover, YouTube thumbnail and channel art, and Pinterest pins.\n\nThree fit modes decide what happens when your image is a different shape. Cover fills the frame and crops the overflow, Contain shows the whole image and pads the gaps with a background colour you pick, and Stretch forces it to fit. The result downloads as a JPG named with its dimensions.",
    steps: [
      ["Upload an image", "Choose the picture to adapt."],
      ["Pick a preset and fit mode", "Select the platform size, then Cover, Contain or Stretch."],
      ["Download", "Save the resized JPG and repeat for other platforms."],
    ],
    faqs: [
      ["Which fit mode should I use?", "Cover for photos where edges can be lost, Contain for logos and graphics that must be fully visible."],
      ["Can I choose which part gets cropped?", "Cover crops evenly around the centre. Crop the image first if the subject is off-centre."],
      ["Do the sizes stay up to date?", "They follow the dimensions platforms recommend, but platforms change them occasionally, so check the upload preview."],
    ],
    uses: [
      "Preparing one campaign image for several networks",
      "Fitting a logo into a cover photo without cropping",
      "Making a consistent set of post images",
    ],
  },
  "instagram-image-resizer": {
    intro:
      "Instagram Image Resizer outputs images in the shapes Instagram uses: square posts, portrait posts, landscape posts, stories and Reels covers, and profile pictures. Choosing the right shape before uploading stops Instagram from cropping your picture for you.\n\nCover mode fills the frame and trims the excess, while Contain keeps the entire image and fills the remaining space with a background colour, which is how the popular white-border look is made. The finished image downloads as a JPG.",
    steps: [
      ["Upload a photo", "Select the image to prepare."],
      ["Choose the Instagram format", "Pick post, story or profile size and a fit mode."],
      ["Download and post", "Save the JPG and upload it to Instagram."],
    ],
    faqs: [
      ["Which post shape gets the most screen space?", "Portrait posts take up the most room in the feed."],
      ["How do I post a full photo without cropping?", "Use Contain with a white or black background so the whole image sits inside the frame."],
      ["What size are stories?", "1080 by 1920 pixels, a 9:16 ratio."],
    ],
    uses: [
      "Fitting a landscape photo into a portrait post",
      "Creating story-sized versions of feed posts",
      "Keeping a grid consistent with one shape",
    ],
  },
  "youtube-thumbnail-resizer": {
    intro:
      "YouTube Thumbnail Resizer sizes images for YouTube: the standard 1280x720 video thumbnail, channel art banners, the channel icon and end-screen images. A thumbnail in the correct 16:9 shape displays without black bars on every device.\n\nPick Cover to fill the frame, or Contain to keep the full image with a background colour behind it. The output is a JPG, which helps stay under YouTube's 2 MB thumbnail limit.",
    steps: [
      ["Upload your image", "Use a frame from the video or a designed graphic."],
      ["Select the YouTube size", "Choose thumbnail, banner, icon or end screen, and a fit mode."],
      ["Download and upload", "Save the JPG and set it as the thumbnail in YouTube Studio."],
    ],
    faqs: [
      ["What is the ideal thumbnail size?", "1280 by 720 pixels, with a minimum width of 640."],
      ["Why is YouTube rejecting my thumbnail?", "Custom thumbnails must be under 2 MB and in JPG, PNG or GIF format, and the account must be verified."],
      ["How much of the banner is visible on phones?", "Only the central strip. Keep text and logos in the middle of channel art."],
    ],
    uses: [
      "Turning a screenshot into a correctly sized thumbnail",
      "Resizing channel art after a redesign",
      "Batch-preparing thumbnails for a series",
    ],
  },
  "facebook-cover-resizer": {
    intro:
      "Facebook Cover Resizer prepares images for Facebook's cover slots: page covers, profile covers, event covers and group covers, plus regular post images. Each slot has its own wide shape, and an image that does not match gets cropped unpredictably.\n\nUse Cover to fill the banner and trim the overflow, or Contain to show the whole image against a background colour. The result is saved as a JPG named with its pixel dimensions.",
    steps: [
      ["Upload an image", "Wide, landscape images work best for covers."],
      ["Choose the cover type", "Select page, profile, event or group, and the fit mode."],
      ["Download and set", "Save the JPG and upload it as your cover."],
    ],
    faqs: [
      ["Why does my cover look different on mobile?", "Facebook shows a taller crop on phones than on desktop. Keep important content near the centre."],
      ["Where does the profile picture overlap the cover?", "On the lower left for pages and profiles. Avoid placing text there."],
      ["Should I use JPG or PNG for covers?", "JPG is fine for photos. For covers with text or logos, a PNG can look crisper after Facebook's compression."],
    ],
    uses: [
      "Updating a page banner for a campaign",
      "Creating an event cover from a poster",
      "Fitting a team photo into a group cover",
    ],
  },
  "twitter-image-resizer": {
    intro:
      "Twitter/X Image Resizer sizes images for X: in-feed post images, the 1500x500 header photo, profile pictures and large summary cards for link previews. Matching these shapes prevents the automatic crop from cutting off faces or text.\n\nCover fills the frame and trims the rest; Contain keeps everything visible on a background colour of your choice. Output is a JPG named with its dimensions.",
    steps: [
      ["Upload an image", "Choose the picture to adapt."],
      ["Pick the X format", "Select post, header, profile or card size and a fit mode."],
      ["Download", "Save the JPG and upload it to X."],
    ],
    faqs: [
      ["What size is the header photo?", "1500 by 500 pixels. Part of it is hidden behind the profile picture on the lower left."],
      ["What size should link preview images be?", "1200 by 628 pixels works for the large summary card."],
      ["Why is my profile picture cropped to a circle?", "X masks profile images to a circle, so keep the subject centred with space around it."],
    ],
    uses: [
      "Making a header that is not cut off",
      "Preparing a preview image for shared links",
      "Resizing a logo for a profile picture",
    ],
  },
  "bulk-image-converter": {
    intro:
      "Bulk Image Converter changes the format of many images in one pass. Add as many files as you like, choose JPG, PNG or WebP as the output, set a quality level for the lossy formats, and every file is converted in turn.\n\nEach image shows its status and original size, and can be downloaded on its own once finished, or you can save the whole set with Download All. It accepts any image type your browser can display, including AVIF as an input.",
    steps: [
      ["Add images", "Drop a batch of files or click to browse."],
      ["Choose format and quality", "Select JPG, PNG or WebP and adjust quality for JPG and WebP."],
      ["Convert and download", "Save files individually or all at once."],
    ],
    faqs: [
      ["Which output formats are available?", "JPG, PNG and WebP."],
      ["Do files download as a ZIP?", "No. Download All saves each file separately, so your browser may ask to allow multiple downloads."],
      ["Is there a limit on the number of files?", "No fixed limit, but very large batches of high-resolution photos can slow the browser down."],
    ],
    uses: [
      "Converting a folder of PNG screenshots to WebP",
      "Standardising mixed image formats before an upload",
      "Preparing product photos for an online shop",
    ],
  },
  "heic-to-jpg": {
    intro:
      "HEIC to JPG converts the HEIC and HEIF photos that iPhones and iPads save by default into JPG. HEIC is efficient, but Windows without the right extension, many web forms and plenty of older apps cannot open it.\n\nThe conversion uses the heic2any library in your browser, at 92 percent JPG quality. Several photos can be added together, and each converted file is listed with its size for download. The converter library is loaded the first time you use the tool.",
    steps: [
      ["Add HEIC files", "Drop .heic or .heif photos onto the upload area."],
      ["Convert", "Each photo is decoded and saved as JPG."],
      ["Download", "Save the JPGs individually or together."],
    ],
    faqs: [
      ["Why does my iPhone save HEIC?", "It halves storage use compared with JPG. You can switch to JPG in Settings, Camera, Formats by choosing Most Compatible."],
      ["Are Live Photos supported?", "The still image is converted. The motion part of a Live Photo is a separate video and is not included."],
      ["Is location data kept?", "No. The converted JPG does not carry the original metadata."],
    ],
    uses: [
      "Opening iPhone photos on a Windows PC",
      "Uploading pictures to a form that rejects HEIC",
      "Sharing photos with Android users",
    ],
  },
  "heic-to-png": {
    intro:
      "HEIC to PNG converts iPhone and iPad HEIC photos into PNG. Choose it over JPG when the image will be edited further or contains flat graphics such as screenshots, because PNG is lossless and will not degrade on re-saving.\n\nDecoding happens in your browser with the heic2any library. PNG files of photos are large, often five to ten times the size of the HEIC, so for everyday sharing JPG is the more practical target. Multiple files can be converted in one go.",
    steps: [
      ["Add HEIC files", "Drop .heic or .heif images."],
      ["Convert", "Each is decoded and written as PNG."],
      ["Download", "Save the PNG files."],
    ],
    faqs: [
      ["When should I choose PNG over JPG?", "When you plan to edit the image repeatedly or it contains text and sharp edges."],
      ["Why are the files so big?", "PNG stores every pixel without lossy compression."],
      ["Does it work on Windows and Android?", "Yes. Conversion runs in the browser on any device."],
    ],
    uses: [
      "Bringing iPhone screenshots into design software",
      "Creating lossless working copies for retouching",
      "Converting scanned documents captured on an iPad",
    ],
  },
  "image-to-base64": {
    intro:
      "Image to Base64 encodes an image file as a Base64 text string, the form needed to embed an image directly inside HTML, CSS or JSON without a separate file request. Upload an image and switch between four ready-made outputs: the raw string, an HTML img tag, a CSS background-image rule, and a JSON value.\n\nThe tool shows the original size next to the encoded size, which is about a third larger. That overhead is why inlining suits small icons and placeholders better than large photos.",
    steps: [
      ["Upload an image", "Any image type works."],
      ["Choose a snippet type", "Raw, img tag, CSS or JSON."],
      ["Copy", "Paste the snippet into your code."],
    ],
    faqs: [
      ["Why is the Base64 version larger?", "Base64 represents three bytes with four characters, adding roughly 33 percent."],
      ["When should I inline an image?", "For small assets such as icons under a few kilobytes, where saving a network request outweighs the size increase."],
      ["Does Base64 hide or protect the image?", "No. It is an encoding, not encryption, and anyone can decode it."],
    ],
    uses: [
      "Embedding a small logo in an HTML email",
      "Inlining an icon in a stylesheet",
      "Sending an image through a JSON API",
    ],
  },
  "base64-to-image": {
    intro:
      "Base64 to Image decodes a Base64 string back into a viewable picture. Paste the string, with or without the data:image prefix, and the tool renders a preview you can download as a file.\n\nIt is a quick way to see what an encoded image in an API response, a database field or a stylesheet actually contains. If the text is not valid image data, the tool says so instead of showing a broken picture. Strings without a prefix are treated as PNG.",
    steps: [
      ["Paste the string", "Include the data: prefix if you have it."],
      ["Decode", "A preview of the image appears."],
      ["Download", "Save the decoded image."],
    ],
    faqs: [
      ["Do I need the data:image/png;base64, part?", "No. If it is missing the tool assumes PNG."],
      ["Why do I get an invalid Base64 error?", "The string may be truncated, contain line breaks or spaces from copying, or not be an image at all."],
      ["Which image types can be decoded?", "Any type your browser can display, such as PNG, JPG, GIF, WebP and SVG."],
    ],
    uses: [
      "Inspecting an image returned by an API",
      "Recovering a picture stored as text in a database",
      "Checking an inline image from a CSS file",
    ],
  },
};
