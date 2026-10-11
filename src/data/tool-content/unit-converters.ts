import type { ToolCopyMap } from "./types";

export const unitConvertersCopy: ToolCopyMap = {
  "length-converter": {
    intro:
      "Length Converter converts a measurement between nine units: millimetres, centimetres, metres, kilometres, inches, feet, yards, miles and nautical miles. Enter a value, choose the unit it is in and the unit you want, and the answer appears at once.\n\nBelow the main result, a grid shows the same length in every other unit at the same time, which saves repeating the conversion. The factors are the exact international definitions: one inch is 25.4 millimetres, one foot 0.3048 metres and one mile 1,609.344 metres.",
    steps: [
      ["Enter a value", "Type the number to convert."],
      ["Choose from and to units", "Use Swap to reverse them."],
      ["Read all conversions", "The grid lists every unit together."],
    ],
    faqs: [
      ["How many feet are in a mile?", "5,280 feet, which is 1,760 yards."],
      ["What is a nautical mile?", "Exactly 1,852 metres, about 1.151 statute miles. It is used at sea and in aviation."],
      ["Is a UK foot the same as a US foot?", "Yes. Both use the international foot of 0.3048 metres."],
    ],
    uses: [
      "Converting dimensions on a product listing",
      "Translating a running distance between miles and kilometres",
      "Checking measurements on a plan drawn in another system",
    ],
  },
  "weight-converter": {
    intro:
      "Weight Converter converts mass between milligrams, grams, kilograms, metric tons, pounds, ounces, stone and US tons. Type a value, pick the two units, and see the result along with the equivalent in all the other units.\n\nConversions rest on the exact definition of the pound as 0.45359237 kilograms. An ounce is one sixteenth of a pound, a stone is 14 pounds, a US (short) ton is 2,000 pounds and a metric ton is 1,000 kilograms.",
    steps: [
      ["Enter the weight", "Any positive number."],
      ["Select the units", "From and to."],
      ["Check the full list", "Every unit is shown below."],
    ],
    faqs: [
      ["How many pounds are in a kilogram?", "About 2.2046 pounds."],
      ["What is the difference between a ton and a tonne?", "A metric tonne is 1,000 kg. A US short ton is about 907 kg and a UK long ton about 1,016 kg."],
      ["Are these ounces the same as troy ounces?", "No. These are ordinary avoirdupois ounces of about 28.35 g. Precious metals use the troy ounce of about 31.1 g."],
    ],
    uses: [
      "Converting a recipe between grams and ounces",
      "Working out luggage weight in the airline's units",
      "Translating body weight between stone, pounds and kilograms",
    ],
  },
  "temperature-converter": {
    intro:
      "Temperature Converter converts between Celsius, Fahrenheit, Kelvin and Rankine. Unlike most unit conversions, temperature scales do not share a zero point, so the calculation involves an offset as well as a multiplier; the tool handles that for you and shows all four scales together.\n\nUseful anchors: water freezes at 0 °C, 32 °F and 273.15 K, and boils at 100 °C, 212 °F and 373.15 K. Kelvin and Rankine are absolute scales that start at absolute zero, the lowest temperature possible.",
    steps: [
      ["Enter a temperature", "Negative values are fine."],
      ["Choose the scales", "From and to."],
      ["Compare all four", "Shown in the grid."],
    ],
    faqs: [
      ["What is the formula from Celsius to Fahrenheit?", "Multiply by 9, divide by 5, then add 32."],
      ["At what temperature are Celsius and Fahrenheit equal?", "Minus 40 degrees."],
      ["What is absolute zero?", "0 K, which is minus 273.15 °C or minus 459.67 °F."],
    ],
    uses: [
      "Converting oven temperatures in a recipe",
      "Reading a weather forecast from another country",
      "Converting laboratory values to Kelvin",
    ],
  },
  "area-converter": {
    intro:
      "Area Converter converts between square millimetres, square centimetres, square metres, square kilometres, square inches, square feet, square yards, acres and hectares. Enter a figure, choose its unit and the target unit, and the result is displayed alongside every other unit.\n\nArea units scale with the square of length, which is why the numbers move so fast: one square metre is 10.764 square feet, not 3.28. A hectare is 10,000 square metres and an acre is about 4,047 square metres.",
    steps: [
      ["Enter the area", "Type the value."],
      ["Choose units", "From and to."],
      ["Read the conversions", "All units are listed."],
    ],
    faqs: [
      ["How many acres are in a hectare?", "About 2.471 acres."],
      ["How many square feet are in a square metre?", "About 10.764."],
      ["How big is an acre in practical terms?", "43,560 square feet, a little smaller than a football pitch."],
    ],
    uses: [
      "Comparing property sizes listed in different units",
      "Estimating flooring or paint for a room",
      "Converting farmland figures between acres and hectares",
    ],
  },
  "speed-converter": {
    intro:
      "Speed Converter converts between metres per second, kilometres per hour, miles per hour, knots, feet per second and Mach. Enter a speed, pick the units, and see it expressed in all six.\n\nA knot is one nautical mile per hour, used in shipping and aviation. The Mach figure here uses the speed of sound at sea level, about 340 metres per second; the true value falls with altitude as the air gets colder.",
    steps: [
      ["Enter a speed", "Type the number."],
      ["Select units", "From and to."],
      ["View every unit", "The grid shows all results."],
    ],
    faqs: [
      ["How do I convert km/h to mph in my head?", "Multiply by 0.6. 100 km/h is about 62 mph."],
      ["How fast is a knot?", "1.852 km/h, or about 1.151 mph."],
      ["How do I get m/s from km/h?", "Divide by 3.6."],
    ],
    uses: [
      "Understanding speed limits when driving abroad",
      "Converting wind speed in a marine forecast",
      "Translating running pace into speed",
    ],
  },
  "kb-to-mb": {
    intro:
      "KB to MB Converter turns kilobytes into megabytes: divide by 1,024. So 2,048 KB is 2 MB, and 500 KB is about 0.49 MB. Enter the size in kilobytes and the megabyte value appears, together with the same amount in bits, bytes, gigabytes, terabytes and petabytes.\n\nThe converter uses the binary convention, where each step is a factor of 1,024. That is how Windows and most software report file sizes. Storage manufacturers use 1,000 instead, which is why the figures on packaging look slightly larger.",
    steps: [
      ["Enter the size in KB", "Kilobyte to megabyte is preselected."],
      ["Read the MB value", "Shown instantly."],
      ["See other units", "Bytes, GB and more in the grid."],
    ],
    faqs: [
      ["How many KB are in 1 MB?", "1,024 KB in binary terms."],
      ["Is 1 MB ever 1,000 KB?", "Yes, in the decimal convention used by drive makers and network speeds."],
      ["What is a KiB?", "A kibibyte, the unambiguous name for 1,024 bytes."],
    ],
    uses: [
      "Checking a file against an upload limit given in MB",
      "Converting image sizes reported in KB",
      "Understanding email attachment limits",
    ],
  },
  "mb-to-gb": {
    intro:
      "MB to GB Converter turns megabytes into gigabytes by dividing by 1,024. For example 4,096 MB is 4 GB and 700 MB is about 0.68 GB. Type the megabyte figure to see gigabytes, with kilobytes, terabytes and the other storage units listed underneath.\n\nValues use the binary convention of 1,024 megabytes to the gigabyte, matching how operating systems report memory and file sizes. Mobile data plans and drive labels normally use 1,000, so an advertised gigabyte is about 7 percent smaller than a binary one.",
    steps: [
      ["Enter megabytes", "Megabyte to gigabyte is preselected."],
      ["Read gigabytes", "The result updates as you type."],
      ["Compare units", "All storage units are shown."],
    ],
    faqs: [
      ["How many MB are in a GB?", "1,024 MB in binary terms; 1,000 MB in decimal."],
      ["Why does my phone plan's GB seem to run out early?", "Carriers usually count 1 GB as 1,000 MB, and background data adds up."],
      ["How many MB of RAM is 8 GB?", "8,192 MB."],
    ],
    uses: [
      "Working out how many videos fit in a data allowance",
      "Converting RAM figures in system requirements",
      "Estimating download sizes",
    ],
  },
  "gb-to-tb": {
    intro:
      "GB to TB Converter turns gigabytes into terabytes by dividing by 1,024, so 2,048 GB is 2 TB and 500 GB is about 0.49 TB. Enter the number of gigabytes and read the terabyte value, with the equivalent in megabytes and petabytes shown below.\n\nThe binary convention is used. This explains a familiar puzzle: a drive sold as 1 TB holds 1,000,000,000,000 bytes, which an operating system counting in units of 1,024 displays as about 931 GB. No space is missing; the two are counting differently.",
    steps: [
      ["Enter gigabytes", "Gigabyte to terabyte is preselected."],
      ["Read terabytes", "Shown immediately."],
      ["Check other units", "MB and PB appear in the grid."],
    ],
    faqs: [
      ["How many GB are in 1 TB?", "1,024 GB in binary terms; 1,000 GB as labelled by manufacturers."],
      ["Why does my 1 TB drive show 931 GB?", "The maker counts in powers of 1,000 and your computer in powers of 1,024."],
      ["What comes after a terabyte?", "A petabyte, which is 1,024 terabytes."],
    ],
    uses: [
      "Planning backup storage for a photo library",
      "Comparing cloud storage plans",
      "Sizing a NAS or external drive",
    ],
  },
  "inches-to-cm": {
    intro:
      "Inches to CM converts inches into centimetres. The relationship is exact: one inch is 2.54 centimetres, so you multiply by 2.54. Twelve inches is 30.48 cm and 32 inches is 81.28 cm.\n\nEnter a value in inches to see centimetres straight away, with millimetres, metres, feet and the other length units listed underneath. Decimals are accepted, so 5.5 inches works; for a fraction such as 5 and 3/8, enter 5.375.",
    steps: [
      ["Enter inches", "Inch to centimetre is preselected."],
      ["Read centimetres", "The result appears as you type."],
      ["See other units", "Millimetres, feet and more are listed."],
    ],
    faqs: [
      ["How many cm is one inch?", "Exactly 2.54 cm."],
      ["How do I enter a fractional inch?", "Convert it to a decimal first: 1/4 is 0.25, 3/8 is 0.375, 1/2 is 0.5."],
      ["How big is a 55-inch TV in cm?", "139.7 cm measured diagonally."],
    ],
    uses: [
      "Converting screen sizes",
      "Translating clothing and waist measurements",
      "Reading dimensions on US product listings",
    ],
  },
  "cm-to-inches": {
    intro:
      "CM to Inches converts centimetres into inches by dividing by 2.54. So 10 cm is 3.94 inches, 30 cm is 11.81 inches and 100 cm is 39.37 inches.\n\nType a centimetre value and the inch equivalent is shown immediately, along with feet, yards, millimetres and metres. The result is a decimal number of inches; to express it in feet and inches, divide by 12 and keep the remainder.",
    steps: [
      ["Enter centimetres", "Centimetre to inch is preselected."],
      ["Read inches", "Displayed instantly."],
      ["Check feet and other units", "Shown in the grid."],
    ],
    faqs: [
      ["How many inches is 1 cm?", "About 0.3937 inches."],
      ["What is 170 cm in feet and inches?", "About 5 feet 7 inches."],
      ["Is the conversion exact?", "Yes. The inch is defined as exactly 2.54 cm."],
    ],
    uses: [
      "Converting your height for a form that asks for inches",
      "Checking furniture dimensions",
      "Sizing a picture frame or print",
    ],
  },
  "feet-to-meter": {
    intro:
      "Feet to Meter converts feet into metres. One foot is exactly 0.3048 metres, so 10 feet is 3.048 m and 100 feet is 30.48 m.\n\nEnter the number of feet to get metres at once, with centimetres, kilometres, yards and miles shown below. For a measurement in feet and inches, turn the inches into a decimal of a foot by dividing by 12: 5 feet 6 inches is 5.5 feet.",
    steps: [
      ["Enter feet", "Foot to metre is preselected."],
      ["Read metres", "The result updates live."],
      ["Use the grid", "Other length units are listed."],
    ],
    faqs: [
      ["How many metres is one foot?", "Exactly 0.3048 m."],
      ["How do I convert feet and inches?", "Divide the inches by 12 and add them to the feet, then convert."],
      ["How tall is 6 feet in metres?", "1.8288 m, usually rounded to 1.83 m."],
    ],
    uses: [
      "Converting room dimensions from a US floor plan",
      "Translating altitude or depth figures",
      "Converting a height for a metric form",
    ],
  },
  "meter-to-feet": {
    intro:
      "Meter to Feet converts metres into feet by multiplying by about 3.28084. One metre is 3.28 feet, 5 metres is 16.4 feet and 100 metres is 328.08 feet.\n\nEnter a value in metres and the result in feet appears immediately, with inches, yards and miles alongside. The answer is in decimal feet; multiply the decimal part by 12 to get the remaining inches.",
    steps: [
      ["Enter metres", "Metre to foot is preselected."],
      ["Read feet", "Shown as you type."],
      ["Check inches and yards", "Listed in the grid."],
    ],
    faqs: [
      ["How many feet are in a metre?", "About 3.28084 feet."],
      ["What is 1.75 m in feet and inches?", "About 5 feet 9 inches."],
      ["Is a metre longer than a yard?", "Yes, by about 9 centimetres."],
    ],
    uses: [
      "Expressing a height in feet",
      "Converting ceiling heights and room sizes",
      "Translating track and pool distances",
    ],
  },
  "kg-to-pounds": {
    intro:
      "KG to Pounds converts kilograms into pounds. One kilogram is about 2.20462 pounds, so 5 kg is 11.02 lb, 23 kg is 50.71 lb and 70 kg is 154.32 lb.\n\nType a weight in kilograms to see pounds straight away, with ounces, stone, grams and tons listed beneath. A quick mental check is to double the kilograms and add ten percent.",
    steps: [
      ["Enter kilograms", "Kilogram to pound is preselected."],
      ["Read pounds", "The value updates instantly."],
      ["See stone and ounces", "Shown in the grid."],
    ],
    faqs: [
      ["How many pounds is 1 kg?", "About 2.2046 lb."],
      ["What is the 23 kg baggage allowance in pounds?", "About 50.7 lb, which is why US airlines quote 50 lb."],
      ["Is the conversion exact?", "A pound is defined as exactly 0.45359237 kg, so the reverse factor is a rounded decimal."],
    ],
    uses: [
      "Checking luggage against an airline limit",
      "Converting gym weights",
      "Translating body weight for a US form",
    ],
  },
  "pounds-to-kg": {
    intro:
      "Pounds to KG converts pounds into kilograms by multiplying by 0.45359237, the exact legal definition of the pound. So 10 lb is 4.54 kg, 150 lb is 68.04 kg and 200 lb is 90.72 kg.\n\nEnter a figure in pounds for the result in kilograms, with grams, ounces and stone shown as well. If your weight is in pounds and ounces, divide the ounces by 16 and add them to the pounds first.",
    steps: [
      ["Enter pounds", "Pound to kilogram is preselected."],
      ["Read kilograms", "Displayed immediately."],
      ["Check grams and stone", "Listed below."],
    ],
    faqs: [
      ["How many kg is one pound?", "Exactly 0.45359237 kg."],
      ["How do I include ounces?", "There are 16 ounces in a pound: 8 lb 4 oz is 8.25 lb."],
      ["What is a quick estimate?", "Halve the pounds, then take off ten percent."],
    ],
    uses: [
      "Converting a baby's birth weight",
      "Working out medication or dosage weights in metric",
      "Translating a US recipe quantity",
    ],
  },
  "celsius-to-fahrenheit": {
    intro:
      "Celsius to Fahrenheit converts a temperature using the formula F = C × 9/5 + 32. That makes 0 °C equal to 32 °F, 20 °C equal to 68 °F, 37 °C equal to 98.6 °F and 100 °C equal to 212 °F.\n\nEnter the Celsius value and Fahrenheit appears immediately, with Kelvin and Rankine shown too. For a rough answer without a calculator, double the Celsius figure and add 30.",
    steps: [
      ["Enter degrees Celsius", "Celsius to Fahrenheit is preselected."],
      ["Read Fahrenheit", "Shown instantly."],
      ["See Kelvin", "Listed in the grid."],
    ],
    faqs: [
      ["What is 180 °C in Fahrenheit?", "356 °F, a common baking temperature usually rounded to 350 °F."],
      ["What is normal body temperature in Fahrenheit?", "About 98.6 °F, which is 37 °C."],
      ["Why add 32?", "The Fahrenheit scale places the freezing point of water at 32, not 0."],
    ],
    uses: [
      "Converting oven settings for a US recipe",
      "Explaining the weather to friends in the United States",
      "Reading a thermometer marked in the other scale",
    ],
  },
  "fahrenheit-to-celsius": {
    intro:
      "Fahrenheit to Celsius converts a temperature using the formula C = (F − 32) × 5/9. So 32 °F is 0 °C, 68 °F is 20 °C, 98.6 °F is 37 °C and 212 °F is 100 °C.\n\nType the Fahrenheit value to get Celsius at once, alongside Kelvin and Rankine. For a quick estimate, subtract 30 and halve the result.",
    steps: [
      ["Enter degrees Fahrenheit", "Fahrenheit to Celsius is preselected."],
      ["Read Celsius", "The result updates live."],
      ["Compare scales", "Kelvin and Rankine are shown too."],
    ],
    faqs: [
      ["What is 350 °F in Celsius?", "About 177 °C, usually set as 180 °C on a metric oven."],
      ["What is 100 °F in Celsius?", "About 37.8 °C."],
      ["Which countries use Fahrenheit?", "Mainly the United States, along with a few territories and Caribbean nations."],
    ],
    uses: [
      "Following an American recipe on a Celsius oven",
      "Understanding a US weather report",
      "Converting a fever reading",
    ],
  },
  "sqft-to-sqm": {
    intro:
      "Square Feet to Square Meter converts floor area from square feet into square metres by multiplying by 0.092903. A 1,000 sq ft flat is 92.9 square metres, and 2,500 sq ft is 232.26 square metres.\n\nEnter the area in square feet to see square metres immediately, with square yards, acres and hectares listed below. To go the other way quickly, a square metre is about 10.76 square feet.",
    steps: [
      ["Enter square feet", "Square foot to square metre is preselected."],
      ["Read square metres", "Shown instantly."],
      ["Check other area units", "Listed in the grid."],
    ],
    faqs: [
      ["How many square metres is 100 sq ft?", "About 9.29 square metres."],
      ["How do I work out the square footage of a room?", "Multiply its length in feet by its width in feet."],
      ["Why isn't the factor 0.3048?", "That converts length. Area uses the square of it: 0.3048 times 0.3048 is 0.0929."],
    ],
    uses: [
      "Comparing property listings from different countries",
      "Ordering flooring sold by the square metre",
      "Converting office space for a lease",
    ],
  },
  "acre-to-hectare": {
    intro:
      "Acre to Hectare converts land area from acres into hectares by multiplying by 0.404686. One acre is 0.4047 ha, 10 acres is 4.05 ha and 100 acres is 40.47 ha.\n\nEnter the number of acres for the result in hectares, with square metres, square feet and square kilometres also shown. A hectare is a square 100 metres on each side, 10,000 square metres, and is the standard unit for land in most countries.",
    steps: [
      ["Enter acres", "Acre to hectare is preselected."],
      ["Read hectares", "The result appears immediately."],
      ["See square metres", "Listed below."],
    ],
    faqs: [
      ["How many acres are in a hectare?", "About 2.471 acres."],
      ["How many square metres is an acre?", "About 4,046.86 square metres."],
      ["Where are acres still used?", "Chiefly the United States, the United Kingdom, India and several other Commonwealth countries."],
    ],
    uses: [
      "Converting farmland figures for an international report",
      "Comparing land prices quoted per acre and per hectare",
      "Understanding a plot size in a property deed",
    ],
  },
};
