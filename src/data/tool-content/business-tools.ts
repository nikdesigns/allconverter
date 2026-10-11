import type { ToolCopyMap } from "./types";

export const businessToolsCopy: ToolCopyMap = {
  "invoice-generator": {
    intro:
      "Invoice Generator builds a professional invoice in your browser. Enter your business details and your client's, set the invoice number, issue date and due date, and add line items with a description, quantity and unit rate. Subtotal, tax, discount and the total due are calculated for you.\n\nYou can upload a logo, choose an accent colour and select the currency, with a live preview beside the form. When it looks right, Print / Save PDF opens your browser's print dialog, where choosing Save as PDF produces the file. Nothing you type is sent to a server.",
    steps: [
      ["Enter sender and client details", "Add a logo and pick a colour if you like."],
      ["Add line items, tax and discount", "Totals update automatically."],
      ["Print or save as PDF", "Choose Save as PDF in the print dialog."],
    ],
    faqs: [
      ["What must an invoice include?", "Seller and buyer names and addresses, a unique invoice number, the date, a description of goods or services, amounts, tax and payment terms."],
      ["Are my invoices saved?", "No. Nothing is stored, so keep the PDF. Refreshing the page clears the form."],
      ["How should I number invoices?", "Sequentially, without gaps or repeats, for example INV-001, INV-002."],
    ],
    uses: [
      "Billing a client as a freelancer",
      "Issuing a one-off invoice without accounting software",
      "Creating a branded invoice quickly",
    ],
  },
  "gst-invoice-generator": {
    intro:
      "GST Invoice Generator creates an Indian tax invoice with the fields GST rules require. Enter supplier and recipient details with their GSTINs, add line items with HSN or SAC codes, quantity, rate and a GST rate of 0, 5, 12, 18 or 28 percent, and the tax is computed per line.\n\nSelect the supply type and the tax is split correctly: CGST plus SGST for a sale within one state, or IGST for a sale between states. The invoice shows taxable value, each tax and the grand total, and can be printed or saved as PDF.",
    steps: [
      ["Enter supplier and recipient", "Include both GSTINs."],
      ["Add items with HSN/SAC and GST rate", "Choose intra-state or inter-state supply."],
      ["Print or save as PDF", "From the browser's print dialog."],
    ],
    faqs: [
      ["When do I charge IGST instead of CGST and SGST?", "When the place of supply is in a different state from the supplier."],
      ["What is an HSN or SAC code?", "HSN classifies goods and SAC classifies services, determining the applicable GST rate."],
      ["Does this create an e-invoice with an IRN?", "No. Businesses above the e-invoicing turnover threshold must still register invoices on the government portal."],
    ],
    uses: [
      "Raising a tax invoice as a small business or consultant",
      "Billing a client in another state with IGST",
      "Producing a GST invoice without billing software",
    ],
  },
  "quotation-generator": {
    intro:
      "Quotation Generator produces a formal price quote for a client. Fill in your details and theirs, list the items or services with quantities and unit prices, apply tax if relevant, and set a Valid Until date so the offer has a clear expiry.\n\nA terms and conditions box and a notes field let you state payment terms, delivery times and exclusions. Choose a currency and accent colour, check the live preview, and print or save the quote as a PDF.",
    steps: [
      ["Enter your details and the client's", "Quote number and dates are set at the top."],
      ["List items and set validity", "Add tax, terms and notes."],
      ["Print or save as PDF", "Send the PDF to the client."],
    ],
    faqs: [
      ["How is a quotation different from an invoice?", "A quotation is an offer made before work is agreed. An invoice requests payment afterwards."],
      ["Is a quotation legally binding?", "Once accepted it can form a contract, so state the scope, validity and terms clearly."],
      ["How long should a quote stay valid?", "Commonly 15 to 30 days, shorter where costs change quickly."],
    ],
    uses: [
      "Quoting for a freelance or agency project",
      "Giving a customer a written price for goods",
      "Responding to a request for quotation",
    ],
  },
  "proposal-generator": {
    intro:
      "Proposal Generator creates a priced business proposal document. Enter who it is from and who it is for, itemise the deliverables with prices, and set a validity date. Default terms state that the proposal is valid for 30 days, and signature lines are included for acceptance.\n\nIt shares its layout engine with the quotation tool but is worded and numbered as a proposal. Preview it live, then print or save as PDF. For a longer narrative proposal, write the scope in the notes or attach a separate document.",
    steps: [
      ["Enter both parties' details", "Proposal number and date are editable."],
      ["Itemise pricing and terms", "Set the validity date."],
      ["Print or save as PDF", "Signature lines are included."],
    ],
    faqs: [
      ["What should a proposal contain?", "The client's problem, your solution and scope, timeline, price, terms and a clear way to accept."],
      ["Proposal or quotation: which do I need?", "A quotation for a defined product or service at a price. A proposal when you are also making the case for your approach."],
      ["Can the client sign it?", "Yes. Print it, or add a signature to the PDF with a signing tool."],
    ],
    uses: [
      "Pitching a project to a new client",
      "Formalising a verbal agreement in writing",
      "Sending pricing with acceptance lines",
    ],
  },
  "receipt-generator": {
    intro:
      "Receipt Generator creates a payment receipt to acknowledge money received. Enter who issued it, who paid, the amount, what the payment was for, the date and the payment method: cash, bank transfer, credit or debit card, cheque, UPI or online.\n\nThe amount is written out in words automatically, a convention that makes receipts harder to alter, and the layout includes signature lines for the receiver and an authorised signatory. Print it or save it as a PDF.",
    steps: [
      ["Enter issuer and payer", "Receipt number and date."],
      ["Add amount, purpose and method", "The amount in words is generated."],
      ["Print or save as PDF", "Give a copy to the payer."],
    ],
    faqs: [
      ["How is a receipt different from an invoice?", "An invoice asks for payment. A receipt confirms payment has been made."],
      ["Why write the amount in words?", "It guards against altered or misread figures."],
      ["Is a receipt valid without a signature?", "Requirements vary. A signature or stamp adds evidential weight, particularly for cash."],
    ],
    uses: [
      "Acknowledging a cash payment",
      "Issuing a rent or deposit receipt",
      "Confirming a donation or fee",
    ],
  },
  "upi-qr-generator": {
    intro:
      "UPI QR Code Generator creates a payment QR code for any UPI ID. Enter the ID and recipient name, and optionally a fixed amount and a transaction note. Customers can scan it with Google Pay, PhonePe, Paytm, BHIM, Amazon Pay or any other UPI app.\n\nLeave the amount empty to let the payer type it in. You can change the colours, size and margin, and place a logo in the centre, in which case error correction is raised to High so the code still scans. Download as PNG or SVG, or copy the payment link. The code is generated in your browser.",
    steps: [
      ["Enter UPI ID and name", "Add an amount and note if needed."],
      ["Customise the look", "Colours, size and an optional logo."],
      ["Download PNG or SVG", "Test with a UPI app before printing."],
    ],
    faqs: [
      ["Does the QR code expire?", "No. It encodes your UPI ID directly and works as long as the ID is active."],
      ["Is it safe to share?", "Yes. A UPI QR can only receive money. You never need to enter your PIN to receive a payment."],
      ["Should I fix the amount?", "For a specific bill, yes. For a shop counter, leave it blank."],
    ],
    uses: [
      "Displaying a payment code at a shop counter",
      "Adding a pay-by-UPI code to an invoice",
      "Collecting a fixed fee or donation",
    ],
  },
  "salary-calculator": {
    intro:
      "Salary Calculator works out monthly take-home pay from the components you enter. Earnings are basic salary, HRA, DA and other allowances; deductions are provident fund, professional tax, ESIC, TDS and any other deduction.\n\nIt totals gross salary and deductions, shows net monthly pay and the annual equivalents, and gives each component as a percentage of gross. You supply every figure yourself, so it is best used with a payslip or offer letter in hand, to check the arithmetic or to see the effect of a change.",
    steps: [
      ["Enter monthly earnings", "Basic, HRA, DA and other allowances."],
      ["Enter deductions", "PF, professional tax, ESIC and TDS."],
      ["Read the take-home", "Monthly and annual figures are shown."],
    ],
    faqs: [
      ["What is the difference between gross and net salary?", "Gross is total earnings before deductions. Net is what reaches your bank account."],
      ["How much is employee PF?", "Normally 12 percent of basic salary plus DA."],
      ["Does it calculate my income tax?", "No. Enter the monthly TDS from your payslip, or use the CTC to In-Hand calculator for an estimate."],
    ],
    uses: [
      "Verifying a payslip",
      "Seeing how a raise in basic pay changes take-home",
      "Comparing two salary structures",
    ],
  },
  "ctc-to-inhand-calculator": {
    intro:
      "CTC to In-Hand Salary Calculator estimates monthly take-home pay from an annual cost-to-company figure under Indian salary rules. Enter the CTC, set basic pay as a percentage of it, choose whether employee and employer provident fund apply, add professional tax, and select the new or old income tax regime.\n\nThe result breaks down gross salary, PF, professional tax and income tax, and shows annual and monthly in-hand pay with the effective tax rate. It assumes a standard salary structure and is an estimate; actual pay depends on your employer's components and your declared investments.",
    steps: [
      ["Enter annual CTC", "And basic pay as a percentage."],
      ["Set PF, professional tax and tax regime", "New or old."],
      ["Read monthly in-hand", "With a full breakdown."],
    ],
    faqs: [
      ["Why is in-hand pay so much lower than CTC?", "CTC includes employer PF and often gratuity and insurance, which you never receive as cash, and tax and employee PF are then deducted."],
      ["New or old tax regime?", "The new regime has lower rates and few deductions. The old one can win if you claim substantial HRA, 80C and home-loan deductions."],
      ["How accurate is the estimate?", "It is indicative. Variable pay, perks and exemptions differ by employer; confirm with HR or a chartered accountant."],
    ],
    uses: [
      "Evaluating a job offer",
      "Comparing two offers with different structures",
      "Planning a budget before joining",
    ],
  },
  "profit-margin-calculator": {
    intro:
      "Profit Margin Calculator computes gross and net margins from three numbers: revenue, cost of goods sold and operating expenses. Gross profit is revenue minus COGS; net profit also subtracts operating expenses. Each is shown as an amount and as a percentage of revenue.\n\nMargin is always measured against the selling price, which is why it differs from markup. A product bought for 60 and sold for 100 has a 40 percent margin but a 66.7 percent markup.",
    steps: [
      ["Enter revenue", "Total sales for the period."],
      ["Enter COGS and operating expenses", "Direct and overhead costs."],
      ["Read the margins", "Gross and net."],
    ],
    faqs: [
      ["What is the difference between margin and markup?", "Margin is profit divided by price. Markup is profit divided by cost."],
      ["What is a good profit margin?", "It varies widely by industry. Grocery retail runs on a few percent net; software can exceed 20 percent."],
      ["What counts as COGS?", "Costs tied directly to producing what you sell: materials, direct labour, shipping in."],
    ],
    uses: [
      "Checking whether a price covers costs",
      "Comparing profitability across products",
      "Preparing figures for a lender or investor",
    ],
  },
  "discount-calculator": {
    intro:
      "Discount Calculator shows what you pay after a discount. Enter the original price and either a percentage off or a fixed amount off, and it returns the amount saved, the final price and the percentage saved.\n\nThe percentage-saved figure is handy for fixed-amount offers: 15 off a 60 item is a 25 percent saving, which makes it comparable with a percentage deal elsewhere.",
    steps: [
      ["Enter the original price", "The price before the discount."],
      ["Choose percent or fixed", "And enter the discount."],
      ["Read the final price", "And how much you save."],
    ],
    faqs: [
      ["How do I apply two discounts in a row?", "Apply the second to the already reduced price. 20 percent then 10 percent is 28 percent off in total, not 30."],
      ["Is tax added before or after the discount?", "Usually after, on the discounted price, though rules vary by country."],
      ["How do I find the original price from a sale price?", "Divide the sale price by 1 minus the discount rate. 80 after 20 percent off was 100."],
    ],
    uses: [
      "Checking a sale price while shopping",
      "Pricing a promotion for your own shop",
      "Comparing a percentage offer with a fixed-amount coupon",
    ],
  },
  "roi-calculator": {
    intro:
      "ROI Calculator measures the return on an investment. Enter what you put in, the total you got back and the period in months, and it calculates net gain, ROI as a percentage, annualised ROI and the payback period.\n\nPlain ROI ignores time: 30 percent over one year is far better than 30 percent over five. The annualised figure corrects for that by converting the result to an equivalent yearly rate, so investments of different lengths can be compared fairly.",
    steps: [
      ["Enter the initial investment", "Total cost."],
      ["Enter total returns and period", "Period in months."],
      ["Compare ROI and annualised ROI", "Use the annualised figure across projects."],
    ],
    faqs: [
      ["What is the ROI formula?", "Net gain divided by cost, times 100."],
      ["Why annualise?", "To compare investments held for different lengths of time on the same basis."],
      ["What does ROI leave out?", "Risk, the timing of cash flows and inflation."],
    ],
    uses: [
      "Judging a marketing campaign's return",
      "Comparing equipment purchases",
      "Summarising an investment for stakeholders",
    ],
  },
  "freelance-rate-calculator": {
    intro:
      "Freelance Rate Calculator works backwards from the income you want to the rate you need to charge. Enter your target annual income, hours per week, weeks off, annual business expenses, tax rate and a buffer for non-billable time such as admin and finding clients.\n\nIt returns your billable hours per year, the minimum hourly rate, a day rate based on eight hours, and a monthly revenue target. The non-billable buffer is the input people most often forget: few freelancers bill more than 60 to 70 percent of the hours they work.",
    steps: [
      ["Enter target income and working pattern", "Hours per week and weeks off."],
      ["Add expenses, tax and buffer", "Be realistic about non-billable time."],
      ["Read hourly and day rates", "Treat them as a floor."],
    ],
    faqs: [
      ["Why is the rate much higher than an employee's hourly pay?", "You cover your own tax, holidays, sick days, equipment, insurance and unpaid time."],
      ["What buffer is realistic?", "20 to 40 percent, depending on how much selling and admin you do."],
      ["Should I charge hourly or per project?", "Use the hourly figure to price projects; fixed project prices reward efficiency."],
    ],
    uses: [
      "Setting a rate when starting to freelance",
      "Checking whether current rates meet your income goal",
      "Preparing a day rate for a contract negotiation",
    ],
  },
  "burn-rate-calculator": {
    intro:
      "Burn Rate Calculator tells a startup how long its money will last. Enter the current cash balance, monthly expenses and monthly revenue. Gross burn is total monthly spending, net burn is spending minus revenue, and runway is the cash balance divided by net burn, shown in months with the estimated date the cash runs out.\n\nRunway is the number to watch. Fundraising commonly takes several months, so founders usually aim to start the process with well over six months of runway remaining.",
    steps: [
      ["Enter cash in the bank", "Current balance."],
      ["Enter monthly expenses and revenue", "Use recent averages."],
      ["Read burn and runway", "Note the projected zero-cash date."],
    ],
    faqs: [
      ["What is the difference between gross and net burn?", "Gross burn is all monthly spending. Net burn subtracts revenue."],
      ["How much runway should a startup keep?", "A common target is 12 to 18 months after a funding round."],
      ["What if revenue exceeds expenses?", "Net burn is zero or negative: the company is at or beyond break-even and runway is not limited by cash."],
    ],
    uses: [
      "Planning when to start fundraising",
      "Testing the effect of a hire on runway",
      "Reporting to investors or a board",
    ],
  },
  "saas-mrr-calculator": {
    intro:
      "SaaS MRR Calculator computes the core recurring-revenue metrics of a subscription business. Enter active customers, average monthly revenue per user, monthly churn rate and new customers per month.\n\nIt returns MRR, ARR, the MRR gained from new customers, the MRR lost to churn, net new MRR and an estimated lifetime value calculated as ARPU divided by churn. Net new MRR is the growth signal: if churned revenue matches new revenue, the business is running to stand still.",
    steps: [
      ["Enter customers and ARPU", "Monthly figures."],
      ["Enter churn and new customers", "Per month."],
      ["Read MRR, ARR and net new MRR", "With estimated LTV."],
    ],
    faqs: [
      ["How is MRR calculated?", "Active paying customers multiplied by average monthly revenue per customer."],
      ["Should annual plans count toward MRR?", "Yes, divided by 12. One-off fees are excluded."],
      ["What is a healthy churn rate?", "Roughly under 1 percent a month for enterprise products and 3 to 5 percent for small-business ones."],
    ],
    uses: [
      "Tracking monthly growth",
      "Modelling the effect of reducing churn",
      "Preparing metrics for an investor update",
    ],
  },
  "cac-calculator": {
    intro:
      "CAC Calculator works out Customer Acquisition Cost: marketing spend plus sales spend, divided by the number of new customers won in the same period. Add an average lifetime value and it also gives the LTV to CAC ratio and the payback period.\n\nCAC means little by itself. A cost of 900 per customer is excellent if each is worth 5,000 and ruinous if each is worth 600, which is why the ratio is reported alongside it.",
    steps: [
      ["Enter marketing and sales spend", "For one period."],
      ["Enter new customers", "Acquired in that period."],
      ["Add LTV", "To see the ratio and payback."],
    ],
    faqs: [
      ["What should be included in CAC?", "Ad spend, sales and marketing salaries, tools, agencies and commissions."],
      ["What is a good LTV to CAC ratio?", "Around 3 to 1 is the usual benchmark. Much higher can mean you are under-investing in growth."],
      ["What is a good payback period?", "Under 12 months for most SaaS businesses."],
    ],
    uses: [
      "Evaluating a marketing channel",
      "Setting a budget for a growth target",
      "Checking unit economics before scaling spend",
    ],
  },
  "ltv-calculator": {
    intro:
      "LTV Calculator estimates Customer Lifetime Value for a subscription business. Enter average monthly revenue per user, monthly churn rate and gross margin. Average customer lifetime is one divided by churn, and LTV is ARPU times gross margin times that lifetime.\n\nAdd your acquisition cost to see the LTV to CAC ratio and the payback period. Including gross margin matters: an LTV based on revenue alone overstates what a customer is really worth.",
    steps: [
      ["Enter ARPU and churn", "Monthly figures."],
      ["Enter gross margin", "As a percentage."],
      ["Add CAC", "For the ratio and payback."],
    ],
    faqs: [
      ["How is average customer lifetime calculated?", "One divided by the monthly churn rate. At 3 percent churn it is about 33 months."],
      ["Why include gross margin?", "LTV should reflect profit contributed, not revenue."],
      ["How reliable is LTV for a young company?", "Not very. Early churn data is noisy, so treat the result as a range."],
    ],
    uses: [
      "Deciding how much to spend to win a customer",
      "Comparing customer segments or plans",
      "Showing the value of improving retention",
    ],
  },
  "conversion-rate-calculator": {
    intro:
      "Conversion Rate Calculator divides conversions by visitors to give a conversion rate. Add revenue and it also shows revenue per conversion and revenue per visitor, along with how many conversions a 1 percent rate would produce at your traffic level.\n\nRevenue per visitor is the more complete measure when comparing page variants or channels, because a version that converts fewer people at a higher order value can still earn more.",
    steps: [
      ["Enter visitors and conversions", "For the same period."],
      ["Add revenue", "Optional."],
      ["Read the rate and revenue metrics", "Compare against your benchmark."],
    ],
    faqs: [
      ["What is a good conversion rate?", "It depends on the industry and the action. E-commerce purchase rates of 2 to 3 percent are typical; email sign-ups run much higher."],
      ["Should I count visitors or sessions?", "Either, as long as you are consistent. Unique visitors gives a higher rate."],
      ["Is a small difference between variants meaningful?", "Only with enough data. Check statistical significance before acting on an A/B test."],
    ],
    uses: [
      "Reporting landing page performance",
      "Comparing traffic sources",
      "Estimating the revenue effect of a conversion lift",
    ],
  },
  "business-name-generator": {
    intro:
      "Business Name Generator produces name ideas by combining word parts suited to your industry and style. Choose from tech, health, finance, food, fashion, education or general, and pick a style: modern, classic, playful or professional. An optional keyword is worked into the names.\n\nEach style uses different building blocks. Modern names take endings such as -ly, -io and -hub; professional ones add words like Consulting or Ventures. The tool generates combinations only. It does not check whether a name, domain or trademark is available.",
    steps: [
      ["Choose industry and style", "Add a keyword if you have one."],
      ["Generate", "A batch of names appears; generate again for more."],
      ["Shortlist and check availability", "Search domains, company registers and trademarks."],
    ],
    faqs: [
      ["Does it check domain availability?", "No. Check with a domain registrar."],
      ["How do I know a name is legally safe?", "Search your country's trademark and company registries, and take advice for anything important."],
      ["What makes a good business name?", "Easy to say and spell, distinctive in your market, and available as a domain."],
    ],
    uses: [
      "Brainstorming names for a startup",
      "Naming a product or side project",
      "Generating options to test with customers",
    ],
  },
  "nda-generator": {
    intro:
      "NDA Generator drafts a non-disclosure agreement from a form. Choose a one-way agreement, where one party discloses, a mutual agreement, where both do, or an employee NDA. Enter the parties' names and addresses, the effective date, the duration in years, the governing jurisdiction and the purpose of the disclosure.\n\nThe document is assembled from a standard template with a live preview, and can be copied or printed to PDF. It is a general template for information only; have a lawyer review any NDA that protects something valuable.",
    steps: [
      ["Choose the agreement type", "One-way, mutual or employee."],
      ["Enter parties, term and jurisdiction", "State the purpose precisely."],
      ["Copy or print to PDF", "Have it reviewed before signing."],
    ],
    faqs: [
      ["One-way or mutual: which do I need?", "One-way when only one side shares confidential information. Mutual when both will."],
      ["How long should an NDA last?", "Two to five years is common. Trade secrets may warrant indefinite protection."],
      ["Is a template NDA enforceable?", "It can be, but enforceability depends on jurisdiction and wording. Get legal advice for important matters."],
    ],
    uses: [
      "Protecting an idea before a pitch or partnership talk",
      "Onboarding a contractor or employee",
      "Sharing information during due diligence",
    ],
  },
  "salary-slip-generator": {
    intro:
      "Salary Slip Generator creates a monthly payslip. Enter company details, the employee's name, ID, designation, department, bank account, PAN and PF number, the pay period, and working and present days.\n\nEarnings and deductions are editable tables that start with basic salary, HRA, conveyance and other allowances on one side, and provident fund, professional tax and TDS on the other; add or remove rows as needed. Totals and net pay are calculated, signature lines are included, and the slip prints or saves as PDF.",
    steps: [
      ["Enter company and employee details", "And the pay period."],
      ["Fill in earnings and deductions", "Add or remove components."],
      ["Print or save as PDF", "Net pay is computed automatically."],
    ],
    faqs: [
      ["What must a salary slip show?", "Employer and employee details, pay period, itemised earnings and deductions, and net pay."],
      ["Is a computer-generated slip valid?", "Yes, when the figures are accurate and it is issued by the employer."],
      ["Can I make a slip for myself as proof of income?", "A payslip must reflect salary actually paid by an employer. Creating one that does not is fraud."],
    ],
    uses: [
      "Issuing payslips in a small business without payroll software",
      "Providing staff with monthly pay records",
      "Recreating a lost slip from payroll data",
    ],
  },
  "utm-builder": {
    intro:
      "UTM Builder adds campaign tracking parameters to a URL so analytics tools can tell where visitors came from. Enter the base URL and fill in utm_source, utm_medium and utm_campaign, plus the optional utm_term and utm_content. The tagged link is assembled live and correctly encoded.\n\nPresets for Google Ads, Facebook Ads, email, Twitter, LinkedIn, YouTube, organic and referral fill in conventional values. Links you copy are kept in a history list stored in your own browser, so recent ones are easy to reuse.",
    steps: [
      ["Enter the destination URL", "The page you are sending people to."],
      ["Fill in the parameters or pick a preset", "Source, medium and campaign are the essentials."],
      ["Copy the link", "Use it in your ad, email or post."],
    ],
    faqs: [
      ["Which parameters are required?", "utm_source, utm_medium and utm_campaign. Term and content are optional."],
      ["Are UTM values case-sensitive?", "Yes. Email and email are reported separately, so use lowercase consistently."],
      ["Should I use UTMs on internal links?", "No. They overwrite the visitor's original source and corrupt your reports."],
    ],
    uses: [
      "Tagging links in a newsletter",
      "Separating paid from organic social traffic",
      "Comparing two versions of an ad",
    ],
  },
  "proforma-invoice": {
    intro:
      "Proforma Invoice Generator creates a preliminary invoice, sent before goods are delivered or work begins, to show the buyer exactly what will be charged. Enter seller and buyer details with optional GSTINs, a proforma number and date, line items, a GST percentage and notes.\n\nThe document is clearly labelled as a proforma invoice and not a tax invoice. Buyers use it to approve an order, arrange an advance payment, open a letter of credit or support a customs declaration. Print it or save it as PDF.",
    steps: [
      ["Enter seller and buyer", "GSTIN is optional."],
      ["Add items and GST rate", "Totals are calculated."],
      ["Print or save as PDF", "Send it for approval or advance payment."],
    ],
    faqs: [
      ["Is a proforma invoice a demand for payment?", "No. It is a good-faith estimate and is not recorded as a sale in the accounts."],
      ["Can input tax credit be claimed on it?", "No. Only a proper tax invoice supports a tax credit claim."],
      ["When is the real invoice issued?", "When the goods are supplied or the service is delivered."],
    ],
    uses: [
      "Requesting an advance from a customer",
      "Supporting an export order or letter of credit",
      "Confirming prices before starting work",
    ],
  },
  "purchase-order": {
    intro:
      "Purchase Order Generator creates a PO to send to a vendor. Enter buyer and supplier details, a PO number, the order date and the required delivery date, then list each item with its quantity and unit price. The order total is calculated, and a notes field holds terms and conditions.\n\nA purchase order records precisely what was ordered and at what price before anything is delivered. When the supplier's invoice arrives, it can be checked against the PO. Print it or save it as PDF.",
    steps: [
      ["Enter buyer and vendor", "PO number and dates."],
      ["List items with quantity and price", "Add terms or notes."],
      ["Print or save as PDF", "Send it to the supplier."],
    ],
    faqs: [
      ["Is a purchase order legally binding?", "Once the supplier accepts it, it forms a contract on the stated terms."],
      ["How does a PO differ from an invoice?", "The buyer issues a PO to place an order. The seller issues an invoice to request payment."],
      ["Why use purchase orders in a small business?", "They prevent disputes over what was ordered and give you a record to match invoices against."],
    ],
    uses: [
      "Ordering stock from a supplier",
      "Authorising a purchase within a company",
      "Keeping an audit trail of orders",
    ],
  },
  "delivery-challan": {
    intro:
      "Delivery Challan Generator creates the document that accompanies goods being moved when no sale is taking place. Enter consigner and consignee details, a challan number and date, an optional vehicle number, and the reason for movement: job work, branch transfer, goods on approval, sales return or exhibition.\n\nList the goods with quantity and value; the total value is shown and there is a space for the recipient to acknowledge receipt in good condition. Under Indian GST a delivery challan is used in place of a tax invoice for these movements. Print it or save it as PDF.",
    steps: [
      ["Enter consigner and consignee", "Challan number, date and vehicle."],
      ["Select the reason and list goods", "With quantity and value."],
      ["Print or save as PDF", "Send copies with the goods."],
    ],
    faqs: [
      ["When is a delivery challan used instead of an invoice?", "When goods move without a sale, such as for job work, transfer between branches, or on approval."],
      ["Is an e-way bill also needed?", "In India, generally yes when the consignment value exceeds the threshold, even with a challan."],
      ["How many copies are prepared?", "Usually three: for the consignee, the transporter and the consigner."],
    ],
    uses: [
      "Sending materials to a job worker",
      "Moving stock between branches",
      "Taking goods to an exhibition or on approval",
    ],
  },
  "expense-tracker": {
    intro:
      "Expense Tracker is a simple log for business spending. Add each expense with a description, date, amount and one of nine categories: travel, food, utilities, office supplies, software, marketing, salaries, rent or miscellaneous. The tool keeps a running total and shows what each category contributes as an amount and a percentage.\n\nExport the list as a CSV file to open in Excel or Google Sheets. Entries are held in the page only and are cleared when you refresh or close the tab, so export before you leave.",
    steps: [
      ["Add expenses", "Description, category, date and amount."],
      ["Review totals by category", "See where the money goes."],
      ["Export CSV", "Do this before closing the page."],
    ],
    faqs: [
      ["Is my data saved between visits?", "No. It exists only while the page is open. Export a CSV to keep it."],
      ["Can I import a previous CSV?", "No. Continue the record in your spreadsheet."],
      ["Which currency does it use?", "Amounts are labelled in rupees, but the totals work for any currency."],
    ],
    uses: [
      "Logging costs from a business trip",
      "Totalling a month's receipts by category",
      "Preparing an expense claim",
    ],
  },
  "profit-loss-calculator": {
    intro:
      "Profit & Loss Calculator builds a basic income statement. Add revenue lines, cost of goods sold lines and operating expense lines, such as salaries, rent and marketing, and set a tax rate.\n\nIt calculates total revenue, gross profit with its margin, operating profit (EBIT), tax, and net profit with its margin, and lays them out as a P&L statement. You can add, rename and remove line items in each section to mirror your own accounts.",
    steps: [
      ["Enter revenue items", "Add a row for each income source."],
      ["Enter COGS and operating expenses", "Rename or add rows as needed."],
      ["Set the tax rate and read the statement", "Gross, operating and net profit."],
    ],
    faqs: [
      ["What is EBIT?", "Earnings before interest and tax: gross profit minus operating expenses."],
      ["Is profit the same as cash flow?", "No. A profitable business can still run short of cash if customers pay late or stock ties up money."],
      ["What is the difference between gross and net profit?", "Gross profit deducts only direct costs. Net profit deducts all expenses and tax."],
    ],
    uses: [
      "Summarising a month or quarter for a small business",
      "Testing how a cost change affects net profit",
      "Preparing figures for a loan application",
    ],
  },
};
