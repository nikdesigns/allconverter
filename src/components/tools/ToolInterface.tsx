"use client";

import { Suspense, lazy } from "react";
import type { Tool } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

// ── Original tools ─────────────────────────────────────────────────────────────
const JsonFormatterTool = lazy(() => import("./implementations/JsonFormatterTool").then(m => ({ default: m.JsonFormatterTool })));
const WordCounterTool = lazy(() => import("./implementations/WordCounterTool").then(m => ({ default: m.WordCounterTool })));
const Base64Tool = lazy(() => import("./implementations/Base64Tool").then(m => ({ default: m.Base64Tool })));
const BmiCalculatorTool = lazy(() => import("./implementations/BmiCalculatorTool").then(m => ({ default: m.BmiCalculatorTool })));
const UnitConverterTool = lazy(() => import("./implementations/UnitConverterTool").then(m => ({ default: m.UnitConverterTool })));
const PasswordGeneratorTool = lazy(() => import("./implementations/PasswordGeneratorTool").then(m => ({ default: m.PasswordGeneratorTool })));
const CaseConverterTool = lazy(() => import("./implementations/CaseConverterTool").then(m => ({ default: m.CaseConverterTool })));
const UrlEncoderTool = lazy(() => import("./implementations/UrlEncoderTool").then(m => ({ default: m.UrlEncoderTool })));
const ColorConverterTool = lazy(() => import("./implementations/ColorConverterTool").then(m => ({ default: m.ColorConverterTool })));
const LoremIpsumTool = lazy(() => import("./implementations/LoremIpsumTool").then(m => ({ default: m.LoremIpsumTool })));
const PercentageCalculatorTool = lazy(() => import("./implementations/PercentageCalculatorTool").then(m => ({ default: m.PercentageCalculatorTool })));
const AgeCalculatorTool = lazy(() => import("./implementations/AgeCalculatorTool").then(m => ({ default: m.AgeCalculatorTool })));

// ── PDF tools ──────────────────────────────────────────────────────────────────
const PdfCompressorTool = lazy(() => import("./implementations/PdfCompressorTool").then(m => ({ default: m.PdfCompressorTool })));
const PdfMergerTool = lazy(() => import("./implementations/PdfMergerTool").then(m => ({ default: m.PdfMergerTool })));
const PdfSplitterTool = lazy(() => import("./implementations/PdfSplitterTool").then(m => ({ default: m.PdfSplitterTool })));
const JpgToPdfTool = lazy(() => import("./implementations/JpgToPdfTool").then(m => ({ default: m.JpgToPdfTool })));
const PdfToJpgTool = lazy(() => import("./implementations/PdfToJpgTool").then(m => ({ default: m.PdfToJpgTool })));
const PdfAdvancedTool = lazy(() => import("./implementations/PdfAdvancedTool").then(m => ({ default: m.PdfAdvancedTool })));
const PdfPasswordRemoverTool = lazy(() => import("./implementations/PdfPasswordRemoverTool").then(m => ({ default: m.PdfPasswordRemoverTool })));

// ── Image tools ────────────────────────────────────────────────────────────────
const ImageCompressorTool = lazy(() => import("./implementations/ImageCompressorTool").then(m => ({ default: m.ImageCompressorTool })));
const ImageResizerTool = lazy(() => import("./implementations/ImageResizerTool").then(m => ({ default: m.ImageResizerTool })));
const ImageFormatConverterTool = lazy(() => import("./implementations/ImageFormatConverterTool").then(m => ({ default: m.ImageFormatConverterTool })));
const ImageCropperTool = lazy(() => import("./implementations/ImageCropperTool").then(m => ({ default: m.ImageCropperTool })));
const BackgroundRemoverTool = lazy(() => import("./implementations/BackgroundRemoverTool").then(m => ({ default: m.BackgroundRemoverTool })));
const SvgToPngTool = lazy(() => import("./implementations/SvgToPngTool").then(m => ({ default: m.SvgToPngTool })));
const AvifImageTool = lazy(() => import("./implementations/AvifImageTool").then(m => ({ default: m.AvifImageTool })));
const ImageDpiConverterTool = lazy(() => import("./implementations/ImageDpiConverterTool").then(m => ({ default: m.ImageDpiConverterTool })));
const SvgOptimizerTool = lazy(() => import("./implementations/SvgOptimizerTool").then(m => ({ default: m.SvgOptimizerTool })));
const ExifTool = lazy(() => import("./implementations/ExifTool").then(m => ({ default: m.ExifTool })));
const FaviconGeneratorTool = lazy(() => import("./implementations/FaviconGeneratorTool").then(m => ({ default: m.FaviconGeneratorTool })));
const SocialImageResizerTool = lazy(() => import("./implementations/SocialImageResizerTool").then(m => ({ default: m.SocialImageResizerTool })));
const BulkImageConverterTool = lazy(() => import("./implementations/BulkImageConverterTool").then(m => ({ default: m.BulkImageConverterTool })));

// ── Text tools ─────────────────────────────────────────────────────────────────
const TextCleanerTool = lazy(() => import("./implementations/TextCleanerTool").then(m => ({ default: m.TextCleanerTool })));
const MarkdownToHtmlTool = lazy(() => import("./implementations/MarkdownToHtmlTool").then(m => ({ default: m.MarkdownToHtmlTool })));
const HtmlToMarkdownTool = lazy(() => import("./implementations/HtmlToMarkdownTool").then(m => ({ default: m.HtmlToMarkdownTool })));
const TextToolsTool = lazy(() => import("./implementations/TextToolsTool").then(m => ({ default: m.TextToolsTool })));
const PassphraseGeneratorTool = lazy(() => import("./implementations/PassphraseGeneratorTool").then(m => ({ default: m.PassphraseGeneratorTool })));
const TextEncryptionTool = lazy(() => import("./implementations/TextEncryptionTool").then(m => ({ default: m.TextEncryptionTool })));

// ── Developer tools ────────────────────────────────────────────────────────────
const RegexTesterTool = lazy(() => import("./implementations/RegexTesterTool").then(m => ({ default: m.RegexTesterTool })));
const HtmlEntityEncoderTool = lazy(() => import("./implementations/HtmlEntityEncoderTool").then(m => ({ default: m.HtmlEntityEncoderTool })));
const CssMinifierTool = lazy(() => import("./implementations/CssMinifierTool").then(m => ({ default: m.CssMinifierTool })));
const UuidGeneratorTool = lazy(() => import("./implementations/UuidGeneratorTool").then(m => ({ default: m.UuidGeneratorTool })));
const UuidValidatorTool = lazy(() => import("./implementations/UuidValidatorTool").then(m => ({ default: m.UuidValidatorTool })));
const HashGeneratorTool = lazy(() => import("./implementations/HashGeneratorTool").then(m => ({ default: m.HashGeneratorTool })));
const QrCodeGeneratorTool = lazy(() => import("./implementations/QrCodeGeneratorTool").then(m => ({ default: m.QrCodeGeneratorTool })));
const JwtInspectorTool = lazy(() => import("./implementations/JwtInspectorTool").then(m => ({ default: m.JwtInspectorTool })));
const UrlParserTool = lazy(() => import("./implementations/UrlParserTool").then(m => ({ default: m.UrlParserTool })));
const CronTool = lazy(() => import("./implementations/CronTool").then(m => ({ default: m.CronTool })));
const JsonDiffTool = lazy(() => import("./implementations/JsonDiffTool").then(m => ({ default: m.JsonDiffTool })));
const JsonEscapeTool = lazy(() => import("./implementations/JsonEscapeTool").then(m => ({ default: m.JsonEscapeTool })));
const XmlJsonConverterTool = lazy(() => import("./implementations/XmlJsonConverterTool").then(m => ({ default: m.XmlJsonConverterTool })));
const YamlJsonConverterTool = lazy(() => import("./implementations/YamlJsonConverterTool").then(m => ({ default: m.YamlJsonConverterTool })));
const CsvXmlConverterTool = lazy(() => import("./implementations/CsvXmlConverterTool").then(m => ({ default: m.CsvXmlConverterTool })));
const UserAgentParserTool = lazy(() => import("./implementations/UserAgentParserTool").then(m => ({ default: m.UserAgentParserTool })));
const CidrCalculatorTool = lazy(() => import("./implementations/CidrCalculatorTool").then(m => ({ default: m.CidrCalculatorTool })));

// ── SEO tools ──────────────────────────────────────────────────────────────────
const MetaTagGeneratorTool = lazy(() => import("./implementations/MetaTagGeneratorTool").then(m => ({ default: m.MetaTagGeneratorTool })));
const RobotsTxtGeneratorTool = lazy(() => import("./implementations/RobotsTxtGeneratorTool").then(m => ({ default: m.RobotsTxtGeneratorTool })));
const KeywordDensityCheckerTool = lazy(() => import("./implementations/KeywordDensityCheckerTool").then(m => ({ default: m.KeywordDensityCheckerTool })));
const SitemapGeneratorTool = lazy(() => import("./implementations/SitemapGeneratorTool").then(m => ({ default: m.SitemapGeneratorTool })));
const OpenGraphTesterTool = lazy(() => import("./implementations/OpenGraphTesterTool").then(m => ({ default: m.OpenGraphTesterTool })));
const SeoAnalyzerTool = lazy(() => import("./implementations/SeoAnalyzerTool").then(m => ({ default: m.SeoAnalyzerTool })));

// ── CSS & Color tools ──────────────────────────────────────────────────────────
const CssGeneratorTool = lazy(() => import("./implementations/CssGeneratorTool").then(m => ({ default: m.CssGeneratorTool })));

// ── Calculators ────────────────────────────────────────────────────────────────
const CompoundInterestCalculatorTool = lazy(() => import("./implementations/CompoundInterestCalculatorTool").then(m => ({ default: m.CompoundInterestCalculatorTool })));
const LoanCalculatorTool = lazy(() => import("./implementations/LoanCalculatorTool").then(m => ({ default: m.LoanCalculatorTool })));
const PasswordStrengthCheckerTool = lazy(() => import("./implementations/PasswordStrengthCheckerTool").then(m => ({ default: m.PasswordStrengthCheckerTool })));
const FinanceCalculatorTool = lazy(() => import("./implementations/FinanceCalculatorTool").then(m => ({ default: m.FinanceCalculatorTool })));

// ── Business tools ─────────────────────────────────────────────────────────────
const InvoiceGeneratorTool = lazy(() => import("./implementations/InvoiceGeneratorTool").then(m => ({ default: m.InvoiceGeneratorTool })));
const GstInvoiceGeneratorTool = lazy(() => import("./implementations/GstInvoiceGeneratorTool").then(m => ({ default: m.GstInvoiceGeneratorTool })));
const QuotationGeneratorTool = lazy(() => import("./implementations/QuotationGeneratorTool").then(m => ({ default: m.QuotationGeneratorTool })));
const ReceiptGeneratorTool = lazy(() => import("./implementations/ReceiptGeneratorTool").then(m => ({ default: m.ReceiptGeneratorTool })));
const SalaryCalculatorTool = lazy(() => import("./implementations/SalaryCalculatorTool").then(m => ({ default: m.SalaryCalculatorTool })));
const SalarySlipGeneratorTool = lazy(() => import("./implementations/SalarySlipGeneratorTool").then(m => ({ default: m.SalarySlipGeneratorTool })));
const BusinessMetricsTool = lazy(() => import("./implementations/BusinessMetricsTool").then(m => ({ default: m.BusinessMetricsTool })));
const BusinessNameGeneratorTool = lazy(() => import("./implementations/BusinessNameGeneratorTool").then(m => ({ default: m.BusinessNameGeneratorTool })));
const NdaGeneratorTool = lazy(() => import("./implementations/NdaGeneratorTool").then(m => ({ default: m.NdaGeneratorTool })));
const UtmBuilderTool = lazy(() => import("./implementations/UtmBuilderTool").then(m => ({ default: m.UtmBuilderTool })));

// ── Audio tools ────────────────────────────────────────────────────────────────
const Mp3CutterTool    = lazy(() => import("./implementations/Mp3CutterTool").then(m => ({ default: m.Mp3CutterTool })));
const AudioJoinerTool  = lazy(() => import("./implementations/AudioJoinerTool").then(m => ({ default: m.AudioJoinerTool })));
const TextToSpeechTool = lazy(() => import("./implementations/TextToSpeechTool").then(m => ({ default: m.TextToSpeechTool })));
const AudioToTextTool  = lazy(() => import("./implementations/AudioToTextTool").then(m => ({ default: m.AudioToTextTool })));
// slug-aware audio tools — each lazy wrapper captures the slug in a closure
const AudioVolumeBooster = lazy(() => import("./implementations/AudioEffectsTool").then(m => ({ default: () => <m.AudioEffectsTool slug="audio-volume-booster" /> })));
const AudioSpeedChanger  = lazy(() => import("./implementations/AudioEffectsTool").then(m => ({ default: () => <m.AudioEffectsTool slug="audio-speed-changer" /> })));
const AudioCompressor    = lazy(() => import("./implementations/AudioEffectsTool").then(m => ({ default: () => <m.AudioEffectsTool slug="audio-compressor" /> })));
const AudioMp3ToWav      = lazy(() => import("./implementations/AudioConverterTool").then(m => ({ default: () => <m.AudioConverterTool slug="mp3-to-wav" /> })));
const AudioWavToMp3      = lazy(() => import("./implementations/AudioConverterTool").then(m => ({ default: () => <m.AudioConverterTool slug="wav-to-mp3" /> })));
const AudioM4aToMp3      = lazy(() => import("./implementations/AudioConverterTool").then(m => ({ default: () => <m.AudioConverterTool slug="m4a-to-mp3" /> })));
const AudioMp4ToMp3      = lazy(() => import("./implementations/AudioConverterTool").then(m => ({ default: () => <m.AudioConverterTool slug="mp4-to-mp3" /> })));
const AudioVideoToAudio  = lazy(() => import("./implementations/AudioConverterTool").then(m => ({ default: () => <m.AudioConverterTool slug="video-to-audio" /> })));

// ── AI suite tools ─────────────────────────────────────────────────────────────
const AiToolsSuite  = lazy(() => import("./implementations/AiToolsSuite").then(m => ({ default: m.AiToolsSuite })));
const AiPdfChatTool = lazy(() => import("./implementations/AiPdfChatTool").then(m => ({ default: m.AiPdfChatTool })));

// ── AI tools ───────────────────────────────────────────────────────────────────
const TextSummarizerTool = lazy(() => import("./implementations/TextSummarizerTool").then(m => ({ default: m.TextSummarizerTool })));
const GrammarCheckerTool = lazy(() => import("./implementations/GrammarCheckerTool").then(m => ({ default: m.GrammarCheckerTool })));
const ContentGeneratorTool = lazy(() => import("./implementations/ContentGeneratorTool").then(m => ({ default: m.ContentGeneratorTool })));

// ── New AI tools ────────────────────────────────────────────────────────────────
const AiSpreadsheetFormulaTool = lazy(() => import("./implementations/AiSpreadsheetFormulaTool").then(m => ({ default: m.AiSpreadsheetFormulaTool })));
const AiRegexGeneratorTool     = lazy(() => import("./implementations/AiRegexGeneratorTool").then(m => ({ default: m.AiRegexGeneratorTool })));
const AiResumeBuilderTool      = lazy(() => import("./implementations/AiResumeBuilderTool").then(m => ({ default: m.AiResumeBuilderTool })));
const AiContractSummarizerTool = lazy(() => import("./implementations/AiContractSummarizerTool").then(m => ({ default: m.AiContractSummarizerTool })));
const AiPdfSummarizerTool      = lazy(() => import("./implementations/AiPdfSummarizerTool").then(m => ({ default: m.AiPdfSummarizerTool })));

// ── Design / Color tools ────────────────────────────────────────────────────────
const ColorPaletteExtractorTool = lazy(() => import("./implementations/ColorPaletteExtractorTool").then(m => ({ default: m.ColorPaletteExtractorTool })));
const ContrastCheckerTool       = lazy(() => import("./implementations/ContrastCheckerTool").then(m => ({ default: m.ContrastCheckerTool })));

// ── SEO additions ───────────────────────────────────────────────────────────────
const SchemaGeneratorTool = lazy(() => import("./implementations/SchemaGeneratorTool").then(m => ({ default: m.SchemaGeneratorTool })));

// ── Network tools ───────────────────────────────────────────────────────────────
const NetworkToolsSuite = lazy(() => import("./implementations/NetworkToolsSuite").then(m => ({ default: m.NetworkToolsSuite })));

// ── New suites ─────────────────────────────────────────────────────────────────
const TextUtilsSuite        = lazy(() => import("./implementations/TextUtilsSuite").then(m => ({ default: m.TextUtilsSuite })));
const CodeFormatterSuite    = lazy(() => import("./implementations/CodeFormatterSuite").then(m => ({ default: m.CodeFormatterSuite })));
const DateTimeSuite         = lazy(() => import("./implementations/DateTimeSuite").then(m => ({ default: m.DateTimeSuite })));
const ImageConversionSuite  = lazy(() => import("./implementations/ImageConversionSuite").then(m => ({ default: m.ImageConversionSuite })));
const PdfConversionSuite    = lazy(() => import("./implementations/PdfConversionSuite").then(m => ({ default: m.PdfConversionSuite })));
const BusinessDocSuite      = lazy(() => import("./implementations/BusinessDocSuite").then(m => ({ default: m.BusinessDocSuite })));
const SeoSchemaSuite        = lazy(() => import("./implementations/SeoSchemaSuite").then(m => ({ default: m.SeoSchemaSuite })));
const AudioConversionSuite  = lazy(() => import("./implementations/AudioConversionSuite").then(m => ({ default: m.AudioConversionSuite })));
const UpiQrGeneratorTool    = lazy(() => import("./implementations/UpiQrGeneratorTool").then(m => ({ default: m.UpiQrGeneratorTool })));
const VideoToolsSuite       = lazy(() => import("./implementations/VideoToolsSuite").then(m => ({ default: m.VideoToolsSuite })));
// ── Slug → Component map ───────────────────────────────────────────────────────
const toolComponentMap: Record<string, React.ComponentType> = {
  // ── PDF ──────────────────────────────────────────────────────────────────────
  "pdf-compressor": PdfCompressorTool,
  "pdf-merger": PdfMergerTool,
  "pdf-splitter": PdfSplitterTool,
  "jpg-to-pdf": JpgToPdfTool,
  "pdf-to-jpg": PdfToJpgTool,
  "pdf-page-number-adder": PdfAdvancedTool,
  "pdf-metadata-editor": PdfAdvancedTool,
  "pdf-page-reorder": PdfAdvancedTool,
  "pdf-size-analyzer": PdfAdvancedTool,
  "pdf-to-text": PdfAdvancedTool,
  "pdf-password-remover": PdfPasswordRemoverTool,

  // ── Image ────────────────────────────────────────────────────────────────────
  "image-compressor": ImageCompressorTool,
  "image-resizer": ImageResizerTool,
  "jpg-to-png": ImageFormatConverterTool,
  "png-to-jpg": ImageFormatConverterTool,
  "png-to-webp": ImageFormatConverterTool,
  "jpg-to-webp": ImageFormatConverterTool,
  "webp-to-png": ImageFormatConverterTool,
  "webp-to-jpg": ImageFormatConverterTool,
  "image-cropper": ImageCropperTool,
  "background-remover": BackgroundRemoverTool,
  "svg-to-png": SvgToPngTool,
  "avif-to-jpg": AvifImageTool,
  "avif-to-png": AvifImageTool,
  "jpg-to-avif": AvifImageTool,
  "png-to-avif": AvifImageTool,
  "image-dpi-converter": ImageDpiConverterTool,
  "svg-optimizer": SvgOptimizerTool,
  "exif-viewer": ExifTool,
  "exif-remover": ExifTool,
  "favicon-generator": FaviconGeneratorTool,
  "social-image-resizer": SocialImageResizerTool,
  "instagram-image-resizer": SocialImageResizerTool,
  "youtube-thumbnail-resizer": SocialImageResizerTool,
  "facebook-cover-resizer": SocialImageResizerTool,
  "twitter-image-resizer": SocialImageResizerTool,
  "bulk-image-converter": BulkImageConverterTool,

  // ── Text ─────────────────────────────────────────────────────────────────────
  "word-counter": WordCounterTool,
  "case-converter": CaseConverterTool,
  "text-cleaner": TextCleanerTool,
  "lorem-ipsum-generator": LoremIpsumTool,
  "markdown-to-html": MarkdownToHtmlTool,
  "html-to-markdown": HtmlToMarkdownTool,
  "rot13-encoder": TextToolsTool,
  "text-to-ascii": TextToolsTool,
  "ascii-to-text": TextToolsTool,
  "remove-line-breaks": TextToolsTool,
  "add-line-numbers": TextToolsTool,
  "duplicate-word-finder": TextToolsTool,
  "reading-time-calculator": TextToolsTool,
  "passphrase-generator": PassphraseGeneratorTool,
  "text-encryption": TextEncryptionTool,
  "strong-password-generator": PasswordGeneratorTool,

  // ── Developer ─────────────────────────────────────────────────────────────────
  "json-formatter": JsonFormatterTool,
  "base64-encoder": Base64Tool,
  "url-encoder": UrlEncoderTool,
  "uuid-generator": UuidGeneratorTool,
  "uuid-validator": UuidValidatorTool,
  "regex-tester": RegexTesterTool,
  "color-converter": ColorConverterTool,
  "html-entity-encoder": HtmlEntityEncoderTool,
  "css-minifier": CssMinifierTool,
  "password-generator": PasswordGeneratorTool,
  "md5-generator": HashGeneratorTool,
  "sha1-generator": HashGeneratorTool,
  "sha256-generator": HashGeneratorTool,
  "sha512-generator": HashGeneratorTool,
  "bcrypt-generator": HashGeneratorTool,
  "qr-code-generator": QrCodeGeneratorTool,
  "jwt-inspector": JwtInspectorTool,
  "url-parser": UrlParserTool,
  "cron-generator": CronTool,
  "cron-parser": CronTool,
  "json-diff": JsonDiffTool,
  "json-escape": JsonEscapeTool,
  "xml-to-json": XmlJsonConverterTool,
  "json-to-xml": XmlJsonConverterTool,
  "yaml-to-json": YamlJsonConverterTool,
  "csv-to-xml": CsvXmlConverterTool,
  "user-agent-parser": UserAgentParserTool,
  "cidr-calculator": CidrCalculatorTool,

  // ── SEO ───────────────────────────────────────────────────────────────────────
  "meta-tag-generator": MetaTagGeneratorTool,
  "robots-txt-generator": RobotsTxtGeneratorTool,
  "keyword-density-checker": KeywordDensityCheckerTool,
  "sitemap-generator": SitemapGeneratorTool,
  "open-graph-tester": OpenGraphTesterTool,
  "meta-tag-analyzer": SeoAnalyzerTool,
  "title-tag-checker": SeoAnalyzerTool,
  "meta-description-checker": SeoAnalyzerTool,
  "utm-builder": UtmBuilderTool,
  "serp-snippet-preview": SeoAnalyzerTool,
  "schema-validator": SeoAnalyzerTool,
  "robots-txt-tester": SeoAnalyzerTool,
  "sitemap-validator": SeoAnalyzerTool,
  "hreflang-generator": SeoAnalyzerTool,

  // ── CSS & Color tools ─────────────────────────────────────────────────────────
  "css-grid-generator": CssGeneratorTool,
  "flexbox-generator": CssGeneratorTool,
  "css-animation-generator": CssGeneratorTool,
  "css-clamp-calculator": CssGeneratorTool,
  "rem-to-px": CssGeneratorTool,
  "px-to-rem": CssGeneratorTool,
  "css-unit-converter": CssGeneratorTool,
  "tailwind-color-generator": CssGeneratorTool,
  "tailwind-shadow-generator": CssGeneratorTool,
  "tailwind-gradient-generator": CssGeneratorTool,

  // ── Unit Converters ───────────────────────────────────────────────────────────
  "length-converter": UnitConverterTool,
  "weight-converter": UnitConverterTool,
  "temperature-converter": UnitConverterTool,
  "speed-converter": UnitConverterTool,
  "area-converter": UnitConverterTool,
  "kb-to-mb": UnitConverterTool,
  "mb-to-gb": UnitConverterTool,
  "gb-to-tb": UnitConverterTool,
  "inches-to-cm": UnitConverterTool,
  "cm-to-inches": UnitConverterTool,
  "feet-to-meter": UnitConverterTool,
  "meter-to-feet": UnitConverterTool,
  "kg-to-pounds": UnitConverterTool,
  "pounds-to-kg": UnitConverterTool,
  "celsius-to-fahrenheit": UnitConverterTool,
  "fahrenheit-to-celsius": UnitConverterTool,
  "sqft-to-sqm": UnitConverterTool,
  "acre-to-hectare": UnitConverterTool,

  // ── Calculators ───────────────────────────────────────────────────────────────
  "bmi-calculator": BmiCalculatorTool,
  "age-calculator": AgeCalculatorTool,
  "percentage-calculator": PercentageCalculatorTool,
  "compound-interest-calculator": CompoundInterestCalculatorTool,
  "loan-calculator": LoanCalculatorTool,
  "password-strength-checker": PasswordStrengthCheckerTool,
  "gst-calculator": FinanceCalculatorTool,
  "cagr-calculator": FinanceCalculatorTool,
  "sip-calculator": FinanceCalculatorTool,

  // ── Business ──────────────────────────────────────────────────────────────────
  "invoice-generator":            InvoiceGeneratorTool,
  "gst-invoice-generator":        GstInvoiceGeneratorTool,
  "quotation-generator":          QuotationGeneratorTool,
  "proposal-generator":           QuotationGeneratorTool,
  "receipt-generator":            ReceiptGeneratorTool,
  "upi-qr-generator":             UpiQrGeneratorTool,

  // ── Video ─────────────────────────────────────────────────────────────────────
  "video-audio-extractor":        VideoToolsSuite,
  "video-trimmer":                VideoToolsSuite,
  "video-compressor":             VideoToolsSuite,
  "mp4-to-gif":                   VideoToolsSuite,
  "video-thumbnail":              VideoToolsSuite,
  "screen-recorder":              VideoToolsSuite,

  "salary-calculator":            SalaryCalculatorTool,
  "ctc-to-inhand-calculator":     SalaryCalculatorTool,
  "salary-slip-generator":        SalarySlipGeneratorTool,
  "profit-margin-calculator":     BusinessMetricsTool,
  "discount-calculator":          BusinessMetricsTool,
  "roi-calculator":               BusinessMetricsTool,
  "freelance-rate-calculator":    BusinessMetricsTool,
  "burn-rate-calculator":         BusinessMetricsTool,
  "saas-mrr-calculator":          BusinessMetricsTool,
  "cac-calculator":               BusinessMetricsTool,
  "ltv-calculator":               BusinessMetricsTool,
  "conversion-rate-calculator":   BusinessMetricsTool,
  "business-name-generator":      BusinessNameGeneratorTool,
  "nda-generator":                NdaGeneratorTool,

  // ── Audio ─────────────────────────────────────────────────────────────────────
  "mp3-cutter":           Mp3CutterTool,
  "audio-joiner":         AudioJoinerTool,
  "audio-compressor":     AudioCompressor,
  "audio-volume-booster": AudioVolumeBooster,
  "audio-speed-changer":  AudioSpeedChanger,
  "mp3-to-wav":           AudioMp3ToWav,
  "wav-to-mp3":           AudioWavToMp3,
  "m4a-to-mp3":           AudioM4aToMp3,
  "mp4-to-mp3":           AudioMp4ToMp3,
  "video-to-audio":       AudioVideoToAudio,
  "text-to-speech":       TextToSpeechTool,
  "audio-to-text":        AudioToTextTool,

  // ── AI suite ──────────────────────────────────────────────────────────────────
  "ai-pdf-chat":              AiPdfChatTool,
  "ai-resume-analyzer":       AiToolsSuite,
  "ai-seo-audit":             AiToolsSuite,
  "ai-keyword-cluster":       AiToolsSuite,
  "ai-proposal-generator":    AiToolsSuite,
  "ai-sql-generator":         AiToolsSuite,
  "ai-code-explainer":        AiToolsSuite,
  "ai-business-plan":         AiToolsSuite,
  "ai-product-description":   AiToolsSuite,
  "ai-meeting-notes":         AiToolsSuite,

  // ── AI / Content ──────────────────────────────────────────────────────────────
  "text-summarizer": TextSummarizerTool,
  "grammar-checker": GrammarCheckerTool,
  "blog-outline-generator":        ContentGeneratorTool,
  "faq-generator":                 ContentGeneratorTool,
  "product-description-generator": ContentGeneratorTool,
  "social-post-generator":         ContentGeneratorTool,
  "email-generator":               ContentGeneratorTool,
  "subject-line-generator":        ContentGeneratorTool,
  "headline-generator":            ContentGeneratorTool,
  "rewrite-tool":                  ContentGeneratorTool,
  "youtube-title-generator":       ContentGeneratorTool,
  "youtube-description-generator": ContentGeneratorTool,
  "linkedin-post-generator":       ContentGeneratorTool,
  "hook-generator":                ContentGeneratorTool,
  "cold-email-generator":          ContentGeneratorTool,

  // ── New AI tools ──────────────────────────────────────────────────────────
  "ai-spreadsheet-formula": AiSpreadsheetFormulaTool,
  "ai-regex-generator":     AiRegexGeneratorTool,
  "ai-resume-builder":      AiResumeBuilderTool,
  "ai-contract-summarizer": AiContractSummarizerTool,
  "ai-pdf-summarizer":      AiPdfSummarizerTool,

  // ── SQL sub-tools (extended AiToolsSuite) ─────────────────────────────────
  "sql-formatter":  AiToolsSuite,
  "sql-explainer":  AiToolsSuite,
  "sql-optimizer":  AiToolsSuite,

  // ── Design / Color ────────────────────────────────────────────────────────
  "color-palette-extractor": ColorPaletteExtractorTool,
  "contrast-checker":        ContrastCheckerTool,

  // ── SEO ───────────────────────────────────────────────────────────────────
  "schema-generator": SchemaGeneratorTool,

  // ── Network tools ─────────────────────────────────────────────────────────
  "website-screenshot":         NetworkToolsSuite,
  "dns-lookup":                 NetworkToolsSuite,
  "ip-lookup":                  NetworkToolsSuite,
  "ssl-checker":                NetworkToolsSuite,
  "website-metadata-extractor": NetworkToolsSuite,
  "website-speed-checker":      NetworkToolsSuite,

  // ── New PDF conversion tools ──────────────────────────────────────────────
  "pdf-to-word":        PdfConversionSuite,
  "word-to-pdf":        PdfConversionSuite,
  "pdf-to-excel":       PdfConversionSuite,
  "excel-to-pdf":       PdfConversionSuite,
  "pdf-to-powerpoint":  PdfConversionSuite,
  "powerpoint-to-pdf":  PdfConversionSuite,
  "pdf-protector":      PdfConversionSuite,
  "ocr-pdf":            PdfConversionSuite,
  "pdf-watermark":      PdfConversionSuite,

  // ── New image conversion tools ────────────────────────────────────────────
  "heic-to-jpg":     ImageConversionSuite,
  "heic-to-png":     ImageConversionSuite,
  "image-to-base64": ImageConversionSuite,
  "base64-to-image": ImageConversionSuite,

  // ── New text utilities ────────────────────────────────────────────────────
  "character-counter":      TextUtilsSuite,
  "remove-duplicate-lines": TextUtilsSuite,
  "sort-lines":             TextUtilsSuite,
  "reverse-text":           TextUtilsSuite,
  "slug-generator":         TextUtilsSuite,

  // ── New code formatters ───────────────────────────────────────────────────
  "json-validator":  CodeFormatterSuite,
  "html-formatter":  CodeFormatterSuite,
  "css-formatter":   CodeFormatterSuite,
  "js-formatter":    CodeFormatterSuite,

  // ── New business documents ────────────────────────────────────────────────
  "proforma-invoice":       BusinessDocSuite,
  "purchase-order":         BusinessDocSuite,
  "delivery-challan":       BusinessDocSuite,
  "expense-tracker":        BusinessDocSuite,
  "profit-loss-calculator": BusinessDocSuite,

  // ── New SEO schema tools ──────────────────────────────────────────────────
  "faq-schema-generator":          SeoSchemaSuite,
  "article-schema-generator":      SeoSchemaSuite,
  "organization-schema-generator": SeoSchemaSuite,
  "redirect-checker":              SeoSchemaSuite,
  "canonical-tag-checker":         SeoSchemaSuite,

  // ── New AI content tools ──────────────────────────────────────────────────
  "ai-cover-letter":       ContentGeneratorTool,
  "ai-linkedin-optimizer": ContentGeneratorTool,

  // ── New audio conversion tools ────────────────────────────────────────────
  "mp3-to-aac":          AudioConversionSuite,
  "aac-to-mp3":          AudioConversionSuite,
  "flac-to-mp3":         AudioConversionSuite,
  "mp3-to-flac":         AudioConversionSuite,
  "audio-noise-reducer": AudioConversionSuite,
  "audio-normalizer":    AudioConversionSuite,

  // ── New date/time tools ───────────────────────────────────────────────────
  "date-calculator":            DateTimeSuite,
  "date-difference-calculator": DateTimeSuite,
  "timezone-converter":         DateTimeSuite,
  "world-clock":                DateTimeSuite,
  "countdown-timer":            DateTimeSuite,
};

function LoadingSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

interface ToolInterfaceProps {
  tool: Tool;
}

export function ToolInterface({ tool }: ToolInterfaceProps) {
  const Component = toolComponentMap[tool.slug];

  if (!Component) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="text-center py-10">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔧</span>
          </div>
          <h3 className="font-semibold mb-2">Tool Coming Soon</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            This tool is currently being built. Check back soon or explore our other available tools below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Component />
    </Suspense>
  );
}
