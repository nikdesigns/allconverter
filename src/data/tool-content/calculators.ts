import type { ToolCopyMap } from "./types";

export const calculatorsCopy: ToolCopyMap = {
  "bmi-calculator": {
    intro:
      "BMI Calculator works out your Body Mass Index from your weight and height and places it on the standard scale: underweight below 18.5, normal from 18.5 to 24.9, overweight from 25 to 29.9, and obese at 30 or above. Enter metric values in kilograms and centimetres, or switch to imperial for pounds, feet and inches.\n\nThe formula is weight in kilograms divided by height in metres squared. BMI is a screening measure for populations; it does not separate muscle from fat or account for age, sex or build, so treat the number as a starting point, not a diagnosis.",
    steps: [
      ["Choose units", "Metric or imperial."],
      ["Enter weight and height", "The result appears immediately."],
      ["Read the category", "See where you fall on the scale."],
    ],
    faqs: [
      ["Is BMI accurate for athletes?", "Often not. Muscle is dense, so muscular people can be classed as overweight with low body fat."],
      ["Does BMI apply to children?", "Not with these categories. Children's BMI is assessed with age- and sex-specific percentile charts."],
      ["Are the cut-offs the same for everyone?", "Some health bodies use lower thresholds for people of Asian descent, with overweight starting at 23."],
    ],
    uses: [
      "Getting a quick reference before a health check",
      "Tracking change over time alongside waist measurement",
      "Checking the healthy weight range for your height",
    ],
  },
  "age-calculator": {
    intro:
      "Age Calculator gives an exact age from a date of birth: completed years, months and days, plus the same span expressed as total months, weeks, days, hours and minutes. It also counts down to the next birthday.\n\nBy default the age is measured to today, but you can set any other date in the Age on date field, in the past or the future. That is useful for questions such as how old someone will be on a deadline, or how old they were on the day of an event.",
    steps: [
      ["Enter the date of birth", "Use the date picker."],
      ["Optionally change the target date", "Defaults to today."],
      ["Read the breakdown", "Years, months, days and totals."],
    ],
    faqs: [
      ["How are leap years handled?", "Calculations use real calendar dates, so 29 February and different month lengths are counted correctly."],
      ["When does someone born on 29 February have a birthday?", "Legally it depends on the country: some use 28 February in non-leap years, others 1 March."],
      ["Can I work out age on a future date?", "Yes. Set the target date to any day you like."],
    ],
    uses: [
      "Checking eligibility for an age-restricted application",
      "Working out exact age for a form or visa",
      "Finding how many days until a birthday",
    ],
  },
  "percentage-calculator": {
    intro:
      "Percentage Calculator answers the three percentage questions that come up most. What is X percent of Y gives a share of an amount, such as 20 percent of 150. X is what percent of Y expresses one number as a proportion of another. Percentage change measures the rise or fall from an old value to a new one.\n\nEach calculator updates as you type and its result can be copied. Results are rounded to at most six decimal places.",
    steps: [
      ["Pick the question", "Percent of, what percent, or percentage change."],
      ["Enter the two numbers", "The answer appears instantly."],
      ["Copy the result", "Use the copy button."],
    ],
    faqs: [
      ["How is percentage change calculated?", "New minus old, divided by old, times 100. Going from 80 to 100 is a 25 percent increase."],
      ["Why isn't a 50 percent rise cancelled by a 50 percent fall?", "The fall is taken from the larger number. 100 up 50 percent is 150; 150 down 50 percent is 75."],
      ["What is a percentage point?", "The plain difference between two percentages. Moving from 10 percent to 12 percent is 2 points but a 20 percent increase."],
    ],
    uses: [
      "Working out a discount or tip",
      "Calculating a test score as a percentage",
      "Measuring month-on-month growth",
    ],
  },
  "compound-interest-calculator": {
    intro:
      "Compound Interest Calculator projects how a sum grows when interest is earned on interest. Enter the starting principal, annual rate, number of years and an optional monthly contribution, then choose how often interest compounds: daily, weekly, monthly, quarterly, semi-annually or annually.\n\nIt returns the final balance, total amount invested and total interest earned, with a year-by-year table. The projection assumes a constant rate and takes no account of tax, fees or inflation, so read it as an illustration of the mathematics, not a forecast.",
    steps: [
      ["Enter principal, rate and years", "Add a monthly contribution if you make one."],
      ["Choose compounding frequency", "Monthly is typical for savings."],
      ["Review the table", "See the balance at the end of each year."],
    ],
    faqs: [
      ["How much difference does compounding frequency make?", "Less than people expect. At 8 percent, monthly instead of annual compounding adds about 0.3 percentage points a year."],
      ["What is the rule of 72?", "Divide 72 by the annual rate to estimate the years needed to double: about 9 years at 8 percent."],
      ["Does it allow for inflation?", "No. Subtract expected inflation from the rate to estimate growth in real terms."],
    ],
    uses: [
      "Comparing the effect of starting to save earlier",
      "Seeing what a regular contribution adds over time",
      "Illustrating compounding for teaching",
    ],
  },
  "loan-calculator": {
    intro:
      "Loan EMI Calculator works out the fixed monthly payment on a loan from the amount borrowed, the annual interest rate and the term in years. It also shows the total interest over the life of the loan, the total repaid, the split between principal and interest, and a yearly amortisation table.\n\nThe calculation uses the standard reducing-balance formula used for home, car and personal loans. Amounts are displayed in dollars, but the arithmetic is the same in any currency. Lender fees, insurance and taxes are not included.",
    steps: [
      ["Enter the loan amount", "The principal you borrow."],
      ["Enter rate and term", "Annual rate in percent, term in years."],
      ["Review payment and schedule", "See how the balance falls year by year."],
    ],
    faqs: [
      ["What is the EMI formula?", "P times r times (1+r)^n, divided by (1+r)^n minus 1, where r is the monthly rate and n the number of payments."],
      ["Why is so much of the early payment interest?", "Interest is charged on the outstanding balance, which is largest at the start."],
      ["How much does a shorter term save?", "A great deal. Halving the term raises the monthly payment but can cut total interest by more than half."],
    ],
    uses: [
      "Checking whether a mortgage payment is affordable",
      "Comparing a 15-year and a 30-year term",
      "Estimating the true cost of a car loan",
    ],
  },
  "password-strength-checker": {
    intro:
      "Password Strength Checker analyses a password as you type and reports its length, its entropy in bits and an estimated time to crack by brute force. A checklist shows which criteria are met: 8, 12 and 16 or more characters, lowercase, uppercase, numbers, symbols, not a common password, and no repeated characters.\n\nThe analysis runs in your browser and the password is not sent anywhere. Estimates assume an attacker guessing at random; a password built from dictionary words or a known pattern is far weaker than its entropy figure suggests.",
    steps: [
      ["Type a password", "Use the eye icon to show it."],
      ["Read the rating", "Length, entropy and crack time."],
      ["Work through the checklist", "Each unmet item is a way to improve."],
    ],
    faqs: [
      ["Is it safe to type a real password here?", "It is analysed locally and not transmitted. As a general habit, test a similar password, not the real one, on any website."],
      ["What is entropy?", "A measure of unpredictability in bits. Each extra bit doubles the number of guesses needed."],
      ["Why is a long simple password rated above a short complex one?", "Length increases the search space faster than adding character types does."],
    ],
    uses: [
      "Comparing candidate passwords before choosing one",
      "Demonstrating why length matters in security training",
      "Checking a password policy against real examples",
    ],
  },
  "gst-calculator": {
    intro:
      "GST Calculator adds or removes Goods and Services Tax from an amount. In exclusive mode you enter a pre-tax price and it adds GST; in inclusive mode you enter the final price and it works backwards to the taxable value. Choose a standard rate or type a custom percentage.\n\nThe result lists the pre-GST amount, the tax split equally into CGST and SGST, the total GST and the final amount. It is set up for Indian GST, with amounts in rupees and the common 5, 12, 18 and 28 percent slabs.",
    steps: [
      ["Enter the amount", "In rupees."],
      ["Choose the rate and mode", "Exclusive adds tax; inclusive extracts it."],
      ["Read the breakdown", "CGST, SGST and total."],
    ],
    faqs: [
      ["How do I remove GST from an inclusive price?", "Divide by 1 plus the rate. At 18 percent, 1180 divided by 1.18 is 1000."],
      ["When does IGST apply instead of CGST and SGST?", "On sales between states. The total rate is the same but is charged as a single IGST."],
      ["Can I use it for other countries' VAT?", "The arithmetic is the same with a custom rate, though the CGST and SGST split is specific to India."],
    ],
    uses: [
      "Preparing an invoice with the tax split shown",
      "Finding the taxable value of an MRP",
      "Checking the GST charged on a bill",
    ],
  },
  "cagr-calculator": {
    intro:
      "CAGR Calculator finds the Compound Annual Growth Rate between a starting value and an ending value over a number of years. It answers the question: what steady yearly rate would have produced this growth? The total return over the whole period is shown alongside.\n\nThe formula is the ending value divided by the starting value, raised to the power of one over the number of years, minus one. CAGR smooths out the ups and downs along the way, which makes it the fair way to compare investments held for different lengths of time.",
    steps: [
      ["Enter the initial value", "What you started with."],
      ["Enter the final value and years", "The value now and the time elapsed."],
      ["Read CAGR and total return", "Both are shown as percentages."],
    ],
    faqs: [
      ["How is CAGR different from average return?", "A simple average ignores compounding and overstates growth when returns vary. CAGR gives the true annualised rate."],
      ["Does CAGR show risk?", "No. Two investments with the same CAGR can have had very different swings."],
      ["Can I use it with regular contributions?", "No. For money added over time, such as an SIP, XIRR is the correct measure."],
    ],
    uses: [
      "Comparing a fund's return with a benchmark",
      "Measuring revenue growth over several years",
      "Checking the growth rate behind a property price",
    ],
  },
  "sip-calculator": {
    intro:
      "SIP Calculator estimates the maturity value of a Systematic Investment Plan: a fixed amount invested every month. Enter the monthly instalment, the expected annual return and the number of years, and it shows the total invested, the estimated returns and the final value, with a bar comparing the two.\n\nThe calculation assumes each instalment is invested at the start of the month and grows at a constant monthly rate. Real mutual fund returns vary from year to year, so the figure is an illustration based on your assumed rate.",
    steps: [
      ["Enter the monthly amount", "Your regular instalment."],
      ["Enter expected return and duration", "For example 12 percent for 10 years."],
      ["Review invested versus returns", "See how much of the total is growth."],
    ],
    faqs: [
      ["What return should I assume?", "Be conservative. Long-run equity returns have varied widely; try several rates to see a range."],
      ["Does it account for a yearly step-up?", "No. It assumes the same instalment throughout."],
      ["Are tax and expense ratio included?", "No. Both reduce the amount you actually receive."],
    ],
    uses: [
      "Estimating the monthly saving needed for a goal",
      "Comparing a 10-year and a 20-year horizon",
      "Showing how much of long-term wealth comes from compounding",
    ],
  },
  "date-calculator": {
    intro:
      "Date Calculator finds the date that falls a given time before or after a starting date. Pick the start, choose add or subtract, and enter any mix of days, weeks, months and years. The result is shown in full with its day of the week and can be copied.\n\nMonths and years are counted on the calendar, not as a fixed number of days, so adding one month to 15 March gives 15 April. That matches how contracts, notice periods and subscriptions are normally reckoned.",
    steps: [
      ["Choose a start date", "Defaults to today."],
      ["Add or subtract", "Enter days, weeks, months and years."],
      ["Copy the result", "The weekday is shown too."],
    ],
    faqs: [
      ["What happens when I add a month to the 31st?", "If the target month is shorter, the date rolls into the following month, as JavaScript dates do. Check month-end results by hand."],
      ["Does it skip weekends?", "No. It counts calendar days."],
      ["What is 90 days from today?", "Enter 90 in the days field with today's date to see the exact answer."],
    ],
    uses: [
      "Finding a due date 30 or 90 days after an invoice",
      "Working out when a notice period ends",
      "Counting back from a deadline to a start date",
    ],
  },
  "date-difference-calculator": {
    intro:
      "Date Difference Calculator measures the time between two dates. It reports the total days, the same span in weeks and days, total months, approximate years, and separate counts of business days and weekend days.\n\nBusiness days are Mondays to Fridays; public holidays are not removed because they differ by country. The order of the two dates does not matter, since the tool always measures from the earlier to the later.",
    steps: [
      ["Pick the start date", "Use the date picker."],
      ["Pick the end date", "Defaults to today."],
      ["Read the breakdown", "Days, weeks, months and business days."],
    ],
    faqs: [
      ["Is the end date included?", "The count is the number of days from the start date to the end date. Add one if you want to include both."],
      ["Are public holidays excluded from business days?", "No. Subtract them yourself for your country."],
      ["Why are years approximate?", "Years differ in length, so the tool divides days by the average year."],
    ],
    uses: [
      "Counting working days in a project window",
      "Calculating length of service",
      "Finding the number of nights between two travel dates",
    ],
  },
  "timezone-converter": {
    intro:
      "Time Zone Converter translates a date and time from one time zone into another. Choose the moment, the zone it is expressed in and the zone you want, and the equivalent local time is shown with the date and the UTC offset.\n\nConversion uses your browser's built-in time zone database, so daylight saving time is applied automatically for the date you enter. That matters, because the gap between two cities changes during the weeks when one has moved its clocks and the other has not.",
    steps: [
      ["Set the date and time", "The moment you want to convert."],
      ["Choose from and to zones", "For example UTC to Asia/Kolkata."],
      ["Copy the result", "Paste it into an invite or message."],
    ],
    faqs: [
      ["Is daylight saving time handled?", "Yes, for the specific date entered."],
      ["What is the difference between UTC and GMT?", "For everyday scheduling they are the same. UTC is the modern standard; GMT is a time zone that matches it."],
      ["Why do some zones have half-hour offsets?", "Countries choose their own offsets. India is UTC+5:30 and Nepal is UTC+5:45."],
    ],
    uses: [
      "Scheduling a call across continents",
      "Converting a webinar time to your local time",
      "Reading server log times recorded in UTC",
    ],
  },
  "world-clock": {
    intro:
      "World Clock shows the current time in several cities at once, ticking every second. Each card displays the local time, the date and the offset from UTC. Type a city name to add it from a list of more than 120 cities; the correct time zone is found for you.\n\nRemove any city you do not need. Times come from your device's clock combined with the browser's time zone data, so daylight saving changes are reflected automatically.",
    steps: [
      ["Check the default cities", "Times update live."],
      ["Add a city", "Type a name and pick it from the suggestions."],
      ["Remove what you don't need", "Keep the list to the places you work with."],
    ],
    faqs: [
      ["How accurate is the time?", "As accurate as your device's clock, which is normally synchronised automatically."],
      ["Why isn't my city listed?", "Add the nearest major city in the same time zone."],
      ["Does it adjust for daylight saving?", "Yes. Offsets change automatically on the correct dates."],
    ],
    uses: [
      "Checking whether a colleague abroad is in working hours",
      "Keeping an eye on market opening times",
      "Planning the best moment to call family overseas",
    ],
  },
  "countdown-timer": {
    intro:
      "Countdown Timer counts down to a date and time you choose, showing the days, hours, minutes and seconds remaining and updating every second. Give the event a name if you like, set the date and time, and press Start.\n\nThe target is interpreted in your device's local time zone. The countdown runs while the page is open; it is a live display, not an alarm, and it does not send a notification when it reaches zero.",
    steps: [
      ["Set the event date and time", "In your local time."],
      ["Name the event", "Optional."],
      ["Start the countdown", "Reset to choose another date."],
    ],
    faqs: [
      ["Does it keep running if I close the tab?", "No. Reopen the page and start it again with the same date."],
      ["Which time zone does it use?", "The time zone of the device you are using."],
      ["Will it sound an alarm?", "No. It displays the remaining time only."],
    ],
    uses: [
      "Counting down to a launch or deadline",
      "Showing time remaining on a shared screen",
      "Tracking the days until a holiday or exam",
    ],
  },
};
