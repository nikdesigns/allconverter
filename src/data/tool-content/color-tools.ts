import type { ToolCopyMap } from "./types";

export const colorToolsCopy: ToolCopyMap = {
  "css-grid-generator": {
    intro:
      "CSS Grid Generator builds a grid layout from a few inputs and writes the CSS. Set the number of columns and rows and the gaps between them in pixels, and a live preview shows the resulting cells.\n\nThe column and row templates can be edited directly, so you are not limited to equal tracks: change repeat(3, 1fr) to something like 200px 1fr 2fr or repeat(auto-fit, minmax(200px, 1fr)) and the preview follows. Copy the generated rules into your stylesheet.",
    steps: [
      ["Set columns, rows and gaps", "Use the number inputs."],
      ["Edit the templates", "Type any valid track list for custom sizing."],
      ["Copy the CSS", "Paste it onto your container element."],
    ],
    faqs: [
      ["What does 1fr mean?", "One fraction of the free space. Three 1fr columns share the width equally."],
      ["When should I use Grid over Flexbox?", "Grid for two-dimensional layouts with rows and columns; Flexbox for arranging items along one line."],
      ["How do I make a responsive grid without media queries?", "Use repeat(auto-fit, minmax(200px, 1fr)) as the column template."],
    ],
    uses: [
      "Laying out a card or product gallery",
      "Sketching a dashboard structure",
      "Learning how grid templates behave",
    ],
  },
  "flexbox-generator": {
    intro:
      "Flexbox Generator lets you set the main flex container properties and watch a row of sample items rearrange. Choose the flex-direction, flex-wrap, justify-content and align-items values, set the gap and the number of items, and the matching CSS is written out.\n\nIt is as much a learning tool as a generator: the difference between space-between, space-around and space-evenly, or between stretch and baseline, is far easier to see than to read about.",
    steps: [
      ["Choose direction and wrap", "Row or column, wrapping or not."],
      ["Set alignment", "justify-content for the main axis, align-items for the cross axis."],
      ["Copy the CSS", "Apply it to the parent element."],
    ],
    faqs: [
      ["What is the difference between justify-content and align-items?", "justify-content positions items along the main axis; align-items positions them across it."],
      ["How do I centre something with Flexbox?", "Set display flex, justify-content center and align-items center on the parent."],
      ["Does gap work in Flexbox?", "Yes, in all current browsers."],
    ],
    uses: [
      "Building a navigation bar",
      "Centring content in a hero section",
      "Understanding alignment options visually",
    ],
  },
  "css-animation-generator": {
    intro:
      "CSS Animation Generator produces keyframe animations from presets. Choose from fade in, slide in from the left, slide in from the top, bounce, spin and pulse, then set the duration, delay, timing function, iteration count and fill mode.\n\nA preview box plays the animation and can be replayed after each change. The output includes both the @keyframes block and the animation property that applies it, ready to copy.",
    steps: [
      ["Pick a preset", "Fade, slide, bounce, spin or pulse."],
      ["Adjust timing", "Duration, delay, easing, repeats and fill mode."],
      ["Preview and copy", "Replay until it feels right."],
    ],
    faqs: [
      ["What does fill mode do?", "It decides the element's style before and after the animation. Forwards keeps the final frame."],
      ["How do I loop an animation forever?", "Set the iteration count to infinite."],
      ["Should I respect reduced-motion settings?", "Yes. Wrap animations in a prefers-reduced-motion media query so users who ask for less motion get it."],
    ],
    uses: [
      "Adding an entrance effect to a modal",
      "Creating a loading spinner",
      "Drawing attention to a notification badge",
    ],
  },
  "tailwind-color-generator": {
    intro:
      "Tailwind Color Generator is a clickable reference for Tailwind CSS's default colour palette. Each colour family is displayed with its shades from 50 to 900; select a swatch to see its utility class, such as bg-blue-500, and its hex value.\n\nBoth the class name and the hex code can be copied. It is a reference for the built-in palette and does not create a new scale from a custom colour.",
    steps: [
      ["Browse the palette", "Colours are grouped by family."],
      ["Click a shade", "Its class and hex code are displayed."],
      ["Copy", "Take the class name or the hex value."],
    ],
    faqs: [
      ["Can it generate shades from my brand colour?", "No. It shows Tailwind's default palette only."],
      ["How do I use the colour for text or borders?", "Swap the prefix: text-blue-500 or border-blue-500 instead of bg-blue-500."],
      ["Are these the current Tailwind values?", "They are the classic hex values of the default palette. Tailwind v4 defines its colours in OKLCH, so values differ slightly."],
    ],
    uses: [
      "Looking up the hex code behind a Tailwind class",
      "Choosing shades for a UI state",
      "Matching a design mock-up to utility classes",
    ],
  },
  "tailwind-shadow-generator": {
    intro:
      "Tailwind Shadow Generator previews Tailwind CSS's built-in box-shadow utilities, from shadow-sm through shadow-2xl, plus inner and none. Select one to see it applied to a sample card, with the class name and the underlying CSS declaration.\n\nUse it to choose an elevation level by eye, or to copy the raw box-shadow value when you need the same shadow in a project that does not use Tailwind.",
    steps: [
      ["Select a shadow size", "sm, md, lg, xl, 2xl, inner or none."],
      ["Check the preview", "See it on a sample card."],
      ["Copy the class or CSS", "Use whichever your project needs."],
    ],
    faqs: [
      ["Can I design a custom shadow here?", "No. This previews Tailwind's presets."],
      ["How do I colour a Tailwind shadow?", "Add a shadow colour utility such as shadow-blue-500/50."],
      ["Which shadow suits cards?", "shadow-sm or shadow for resting cards, shadow-lg for hovered or floating elements."],
    ],
    uses: [
      "Picking consistent elevation levels",
      "Getting the plain CSS for a Tailwind shadow",
      "Comparing shadow sizes side by side",
    ],
  },
  "tailwind-gradient-generator": {
    intro:
      "Tailwind Gradient Generator builds a linear gradient and gives you both the Tailwind classes and the plain CSS. Choose one of eight directions, a start colour, an end colour and an optional middle colour, and the preview updates.\n\nThe classes use Tailwind's arbitrary-value syntax, for example from-[#3b82f6] to-[#a855f7], so any hex colour works without editing your config. Only linear gradients are produced.",
    steps: [
      ["Choose a direction", "For example to right or to bottom right."],
      ["Pick the colours", "From, optional via, and to."],
      ["Copy the classes or CSS", "Both are provided."],
    ],
    faqs: [
      ["Does it support radial or conic gradients?", "No. Linear gradients only."],
      ["What is the via colour?", "A middle stop that the gradient passes through."],
      ["Do the classes work in Tailwind v4?", "v4 renamed bg-gradient-to-r to bg-linear-to-r. The older name still works in v3."],
    ],
    uses: [
      "Styling a hero background",
      "Creating a gradient button",
      "Converting a gradient idea into utility classes",
    ],
  },
  "css-clamp-calculator": {
    intro:
      "CSS Clamp Calculator generates a clamp() expression for fluid sizing. Enter the minimum and maximum size in pixels and the viewport widths at which each should apply; the tool calculates the slope and intercept and writes a value such as clamp(1rem, 1.6667vw + 0.6667rem, 2rem).\n\nThe result scales smoothly between the two viewport widths and stops at the limits outside them. Sizes are output in rem, assuming a 16 pixel root, so text still responds to the user's browser font setting.",
    steps: [
      ["Enter min and max size", "In pixels, for example 16 and 32."],
      ["Enter the viewport range", "For example 320 to 1280 pixels."],
      ["Copy the clamp()", "Use it for font-size, padding or gap."],
    ],
    faqs: [
      ["What do the three values in clamp() mean?", "Minimum, preferred and maximum. The preferred value is used unless it falls outside the limits."],
      ["Why mix vw with rem?", "A value in vw alone ignores the user's font-size preference and breaks zoom. Adding rem keeps it accessible."],
      ["Can I use it for spacing?", "Yes. It works for any length property."],
    ],
    uses: [
      "Fluid headings that need no media queries",
      "Section padding that grows with the screen",
      "Building a responsive type scale",
    ],
  },
  "rem-to-px": {
    intro:
      "REM to PX Converter turns a rem value into pixels by multiplying it by the root font size. With the browser default of 16 pixels, 1rem is 16px, 1.5rem is 24px and 0.875rem is 14px.\n\nIf your project sets a different root size, change the base font size field and the result follows. The answer can be copied with its unit attached.",
    steps: [
      ["Enter the rem value", "For example 1.25."],
      ["Check the base size", "16 unless your CSS changes it."],
      ["Copy the pixel value", "Use the copy button."],
    ],
    faqs: [
      ["What is a rem?", "A unit relative to the font size of the root html element."],
      ["Is 1rem always 16px?", "Only by default. Users can change their browser font size, and a site can set its own root size."],
      ["How is rem different from em?", "em is relative to the current element's font size and compounds when nested; rem always refers to the root."],
    ],
    uses: [
      "Checking a design handoff specified in pixels",
      "Reading spacing values in a framework",
      "Debugging computed sizes",
    ],
  },
  "px-to-rem": {
    intro:
      "PX to REM Converter turns a pixel value into rem by dividing it by the root font size. At the default 16 pixels, 24px is 1.5rem, 14px is 0.875rem and 10px is 0.625rem.\n\nSizing in rem means text and spacing scale when a user increases their browser's default font size, which fixed pixels do not. Change the base field if your project uses a different root size.",
    steps: [
      ["Enter the pixel value", "For example 18."],
      ["Confirm the base size", "Default is 16."],
      ["Copy the rem value", "Paste it into your CSS."],
    ],
    faqs: [
      ["Why use rem instead of px?", "rem respects the user's font-size setting, which matters for accessibility."],
      ["Should borders be in rem?", "Hairline borders are usually kept in px so they stay crisp."],
      ["What is the 62.5 percent trick?", "Setting the root font size to 62.5 percent makes 1rem equal 10px for easy arithmetic. It is common but needs care with third-party components."],
    ],
    uses: [
      "Converting a pixel-based design to scalable CSS",
      "Building a spacing scale",
      "Refactoring legacy stylesheets",
    ],
  },
  "css-unit-converter": {
    intro:
      "CSS Unit Converter converts a length between CSS units: px, rem, em, pt, pc, cm, mm and in. It uses the fixed relationships CSS defines, 96 pixels to the inch, 72 points to the inch and 12 points to the pica, together with a 16 pixel font size for rem and em.\n\nvw, vh and percent also appear in the list, but they depend on the viewport or the parent element and have no fixed equivalent, so the tool cannot give a meaningful answer for them.",
    steps: [
      ["Enter a value", "The number to convert."],
      ["Choose from and to units", "For example pt to px."],
      ["Copy the result", "The unit is included."],
    ],
    faqs: [
      ["How many pixels is one point?", "About 1.333px, since 72 points and 96 pixels both equal one inch."],
      ["Is a CSS inch a real inch?", "On screens, no. It is fixed at 96 CSS pixels. In print it is a true inch."],
      ["Which units are best for print stylesheets?", "pt, cm, mm and in."],
    ],
    uses: [
      "Translating print sizes in points to screen pixels",
      "Converting a designer's values between units",
      "Writing a print stylesheet",
    ],
  },
  "color-palette-extractor": {
    intro:
      "Color Palette Extractor finds the dominant colours in an image. Upload a photo or graphic, choose how many colours you want, and the tool samples the pixels and groups similar ones into clusters to produce a palette of swatches with hex and RGB values.\n\nYou can copy all the hex codes, copy the palette as CSS custom properties, or download it as a PNG strip. The image is read on a canvas in your browser and is not uploaded.",
    steps: [
      ["Upload an image", "PNG, JPG, WebP or SVG."],
      ["Choose the number of colours", "Then re-extract if you change it."],
      ["Copy or download", "Hex codes, CSS variables or a PNG."],
    ],
    faqs: [
      ["Why are the colours a little different each time?", "Clustering can settle on slightly different groupings, especially in images with many similar tones."],
      ["Why is a small accent colour missing?", "The palette reflects area. A colour covering few pixels may be absorbed into a larger cluster; try more colours."],
      ["Is my image uploaded?", "No. It is processed locally."],
    ],
    uses: [
      "Building a colour scheme from a photograph",
      "Pulling brand colours from a logo",
      "Matching a slide deck to a hero image",
    ],
  },
  "contrast-checker": {
    intro:
      "Contrast Checker calculates the contrast ratio between a text colour and a background colour and tests it against WCAG 2.1. Results are shown for four thresholds: AA normal text at 4.5:1, AA large text at 3:1, AAA normal text at 7:1 and AAA large text at 4.5:1.\n\nA live preview shows heading, body and small text in your colours, and presets load common pairings. Copy Report gives a text summary for a design review or ticket.",
    steps: [
      ["Set text and background colours", "By picker or hex code."],
      ["Read the ratio", "See which levels pass."],
      ["Adjust and copy the report", "Darken or lighten until it passes."],
    ],
    faqs: [
      ["What counts as large text?", "18pt (24px) regular, or 14pt (about 18.67px) bold, and larger."],
      ["Is AA or AAA required?", "AA is the level most laws and policies reference. AAA is an enhanced target."],
      ["Does contrast apply to icons and input borders?", "Yes. Meaningful graphics and interface components need at least 3:1."],
    ],
    uses: [
      "Checking a brand colour for readable text",
      "Fixing failures from an accessibility audit",
      "Documenting compliant colour pairs in a design system",
    ],
  },
};
