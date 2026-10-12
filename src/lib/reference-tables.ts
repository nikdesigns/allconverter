/**
 * Ready-made conversion tables shown under converter tools. They answer the
 * exact look-ups people search for ("500 KB to MB", "170 cm in feet") without
 * using the tool, and give each converter page content of its own.
 */

export interface ReferenceTable {
  title: string;
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
}

const fmt = (n: number, max = 4) => {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1e6) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return Number(n.toFixed(max)).toLocaleString("en-US", { maximumFractionDigits: max });
};

const table = (title: string, from: string, to: string, values: number[], convert: (v: number) => number, digits = 4, caption?: string): ReferenceTable => ({
  title,
  caption,
  headers: [from, to],
  rows: values.map((v) => [fmt(v, 6), fmt(convert(v), digits)]),
});

function storage(from: string, to: string, values: number[]): ReferenceTable[] {
  return [{
    title: `${from} to ${to} conversion table`,
    caption: `Binary values divide by 1,024 (how Windows and most apps count). Decimal values divide by 1,000 (how drive makers and mobile data plans count).`,
    headers: [from, `${to} (binary, ÷1024)`, `${to} (decimal, ÷1000)`],
    rows: values.map((v) => [fmt(v), fmt(v / 1024, 6), fmt(v / 1000, 6)]),
  }];
}

function feetInches(cm: number) {
  const totalIn = cm / 2.54;
  let ft = Math.floor(totalIn / 12);
  let inch = Math.round(totalIn - ft * 12);
  if (inch === 12) { ft += 1; inch = 0; }
  return `${ft} ft ${inch} in`;
}

const range = (a: number, b: number, step = 1) => Array.from({ length: Math.floor((b - a) / step) + 1 }, (_, i) => +(a + i * step).toFixed(6));

const TABLES: Record<string, () => ReferenceTable[]> = {
  "kb-to-mb": () => storage("KB", "MB", [1, 10, 50, 100, 200, 256, 300, 500, 512, 750, 1000, 1024, 1500, 2048, 5000, 5120, 10240, 20480, 51200, 102400]),
  "mb-to-gb": () => storage("MB", "GB", [1, 10, 100, 256, 500, 512, 700, 1000, 1024, 1500, 2048, 3072, 4096, 5000, 8192, 10240, 16384, 20480, 51200, 102400]),
  "gb-to-tb": () => storage("GB", "TB", [1, 16, 32, 64, 100, 128, 250, 256, 500, 512, 750, 1000, 1024, 2000, 2048, 4000, 4096, 8192, 10240, 16384]),
  "inches-to-cm": () => [
    table("Inches to centimetres table", "Inches", "Centimetres", [...range(1, 12), 14, 15, 16, 18, 20, 24, 27, 30, 32, 36, 40, 43, 48, 50, 55, 60, 65, 75], (v) => v * 2.54, 2, "1 inch = 2.54 cm exactly."),
  ],
  "cm-to-inches": () => [
    table("Centimetres to inches table", "Centimetres", "Inches", [...range(1, 10), 12, 15, 20, 25, 30, 40, 45, 50, 60, 75, 90, 100, 120, 150], (v) => v / 2.54, 2, "Divide centimetres by 2.54."),
    { title: "Height in centimetres to feet and inches", headers: ["Centimetres", "Feet and inches", "Inches"], rows: range(150, 200, 5).map((cm) => [cm, feetInches(cm), fmt(cm / 2.54, 1)]) },
  ],
  "feet-to-meter": () => [
    table("Feet to metres table", "Feet", "Metres", [...range(1, 12), 15, 20, 25, 30, 40, 50, 75, 100, 200, 500, 1000, 5280], (v) => v * 0.3048, 3, "1 foot = 0.3048 m exactly; 5,280 ft is one mile."),
    { title: "Height in feet and inches to metres", headers: ["Height", "Metres", "Centimetres"], rows: range(58, 78, 2).map((inches) => [`${Math.floor(inches / 12)} ft ${inches % 12} in`, fmt(inches * 0.0254, 2), fmt(inches * 2.54, 1)]) },
  ],
  "meter-to-feet": () => [
    table("Metres to feet table", "Metres", "Feet", [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 50, 100, 200, 500, 1000], (v) => v / 0.3048, 2),
    { title: "Height in metres to feet and inches", headers: ["Metres", "Feet and inches", "Feet (decimal)"], rows: range(1.5, 2.0, 0.05).map((m) => [fmt(m, 2), feetInches(m * 100), fmt(m / 0.3048, 2)]) },
  ],
  "kg-to-pounds": () => [
    table("Kilograms to pounds table", "Kilograms", "Pounds", [...range(1, 10), 15, 20, 23, 25, 30, 32, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100, 120, 150], (v) => v / 0.45359237, 2, "1 kg ≈ 2.20462 lb. 23 kg is the usual checked-bag allowance."),
  ],
  "pounds-to-kg": () => [
    table("Pounds to kilograms table", "Pounds", "Kilograms", [1, 2, 5, 8, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 100, 110, 120, 130, 140, 150, 160, 180, 200, 220, 250], (v) => v * 0.45359237, 2, "1 lb = 0.45359237 kg exactly."),
  ],
  "celsius-to-fahrenheit": () => [
    table("Celsius to Fahrenheit table", "°C", "°F", [-40, -30, -20, -18, -10, -5, 0, 5, 10, 15, 20, 22, 25, 30, 35, 36.5, 37, 37.5, 38, 39, 40, 45, 50, 60, 70, 80, 100, 120, 150, 160, 180, 200, 220, 230, 250], (c) => (c * 9) / 5 + 32, 1, "°F = °C × 9/5 + 32. Body temperature is 37 °C (98.6 °F); 180 °C is a typical oven setting."),
  ],
  "fahrenheit-to-celsius": () => [
    table("Fahrenheit to Celsius table", "°F", "°C", [-40, -4, 0, 10, 20, 32, 40, 50, 60, 65, 68, 70, 72, 75, 80, 85, 90, 95, 98.6, 99, 100, 101, 102, 104, 110, 212, 300, 325, 350, 375, 400, 425, 450], (f) => ((f - 32) * 5) / 9, 1, "°C = (°F − 32) × 5/9."),
  ],
  "sqft-to-sqm": () => [
    table("Square feet to square metres table", "Square feet", "Square metres", [1, 10, 50, 100, 150, 200, 250, 300, 400, 500, 600, 750, 800, 900, 1000, 1200, 1500, 1800, 2000, 2500, 3000, 4000, 5000, 10000], (v) => v * 0.09290304, 2, "1 sq ft = 0.09290304 m²."),
  ],
  "acre-to-hectare": () => [
    table("Acres to hectares table", "Acres", "Hectares", [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 10, 15, 20, 25, 40, 50, 100, 160, 500, 640, 1000], (v) => v * 0.40468564224, 3, "1 acre = 0.4047 ha; 640 acres make a square mile."),
  ],
  "length-converter": () => [{
    title: "Common length equivalents",
    headers: ["Unit", "Millimetres", "Metres", "Feet"],
    rows: [["1 inch", 25.4, 0.0254, fmt(1 / 12, 4)], ["1 foot", 304.8, 0.3048, 1], ["1 yard", 914.4, 0.9144, 3], ["1 metre", 1000, 1, fmt(1 / 0.3048, 4)], ["1 kilometre", "1,000,000", "1,000", fmt(1000 / 0.3048, 1)], ["1 mile", "1,609,344", fmt(1609.344, 3), "5,280"], ["1 nautical mile", "1,852,000", "1,852", fmt(1852 / 0.3048, 1)]],
  }],
  "weight-converter": () => [{
    title: "Common weight equivalents",
    headers: ["Unit", "Grams", "Kilograms", "Pounds"],
    rows: [["1 ounce", fmt(28.349523125, 3), fmt(0.028349523125, 5), fmt(1 / 16, 4)], ["1 pound", fmt(453.59237, 3), fmt(0.45359237, 5), 1], ["1 stone", fmt(6350.29318, 1), fmt(6.35029318, 3), 14], ["1 kilogram", "1,000", 1, fmt(1 / 0.45359237, 4)], ["1 US ton", "907,184.74", fmt(907.18474, 2), "2,000"], ["1 metric tonne", "1,000,000", "1,000", fmt(1000 / 0.45359237, 1)]],
  }],
  "temperature-converter": () => [{
    title: "Reference temperatures",
    headers: ["Point", "Celsius", "Fahrenheit", "Kelvin"],
    rows: [["Absolute zero", -273.15, -459.67, 0], ["Celsius and Fahrenheit equal", -40, -40, 233.15], ["Water freezes", 0, 32, 273.15], ["Room temperature", 20, 68, 293.15], ["Body temperature", 37, 98.6, 310.15], ["Water boils (sea level)", 100, 212, 373.15], ["Moderate oven", 180, 356, 453.15]],
  }],
  "area-converter": () => [{
    title: "Common area equivalents",
    headers: ["Unit", "Square metres", "Square feet"],
    rows: [["1 square foot", fmt(0.09290304, 5), 1], ["1 square yard", fmt(0.83612736, 4), 9], ["1 square metre", 1, fmt(1 / 0.09290304, 3)], ["1 acre", fmt(4046.8564224, 2), "43,560"], ["1 hectare", "10,000", fmt(10000 / 0.09290304, 0)], ["1 square kilometre", "1,000,000", fmt(1e6 / 0.09290304, 0)], ["1 square mile", fmt(2589988.110336, 0), "27,878,400"]],
  }],
  "speed-converter": () => [
    table("km/h to mph table", "km/h", "mph", range(10, 140, 10).concat([200, 300]), (v) => v / 1.609344, 1, "Divide km/h by 1.609344. 100 km/h is about 62 mph."),
  ],
  "px-to-rem": () => [
    table("Pixels to rem (16px root)", "Pixels", "rem", [1, 2, 4, 6, 8, 10, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96], (v) => v / 16, 4, "Based on the browser default root font size of 16px."),
  ],
  "rem-to-px": () => [
    table("rem to pixels (16px root)", "rem", "Pixels", [0.125, 0.25, 0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 3, 3.5, 4, 5, 6], (v) => v * 16, 2, "Based on the browser default root font size of 16px."),
  ],
};

export function getReferenceTables(slug: string): ReferenceTable[] {
  return TABLES[slug]?.() ?? [];
}
