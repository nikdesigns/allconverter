import type { ToolCopyMap } from "./types";

export const networkToolsCopy: ToolCopyMap = {
  "website-screenshot": {
    intro:
      "Website Screenshot captures an image of any public web page. Enter the URL and choose Desktop, Mobile or Full Page; the capture is made by an external rendering service and returned to you in about five to ten seconds.\n\nYou can download the image, copy its address or open it at full size. Because the page is loaded by a remote browser and not your own, the result shows what an anonymous visitor sees: pages behind a login, and sites that block automated visitors, cannot be captured.",
    steps: [
      ["Enter the URL", "A publicly reachable page."],
      ["Choose a mode", "Desktop, Mobile or Full Page."],
      ["Capture and download", "Save the image when it appears."],
    ],
    faqs: [
      ["Can it capture pages that need a login?", "No. The remote browser is not signed in."],
      ["Why did the capture fail?", "Some sites block screenshot services, and very slow pages can time out."],
      ["Is the URL sent to a third party?", "Yes. The address is sent to the screenshot service so it can load the page."],
    ],
    uses: [
      "Documenting how a page looked on a given day",
      "Checking a mobile layout without a phone",
      "Adding a site preview to a report or proposal",
    ],
  },
  "dns-lookup": {
    intro:
      "DNS Lookup queries the public DNS records of a domain. Choose a record type, A, AAAA, MX, TXT, NS, CNAME, SOA or CAA, and the tool asks Cloudflare's DNS-over-HTTPS resolver and lists each answer with its name, type, TTL and value.\n\nIt is the fastest way to confirm that a DNS change has been published, to see which mail servers a domain uses, or to read the SPF and verification entries stored in TXT records. A Copy All button copies the full result.",
    steps: [
      ["Enter a domain", "For example example.com."],
      ["Choose a record type", "A for addresses, MX for mail, TXT for verification."],
      ["Run the lookup", "Records are listed with their TTL."],
    ],
    faqs: [
      ["What does TTL mean?", "Time to live, in seconds: how long resolvers may cache the record before asking again."],
      ["Why do I still see the old value after a change?", "Resolvers keep the old record until its TTL expires. Wait, then query again."],
      ["Where are SPF and DKIM records?", "In TXT records. SPF is on the domain itself; DKIM is under a selector such as selector._domainkey."],
    ],
    uses: [
      "Verifying a DNS change after moving hosts",
      "Checking mail routing when email is not arriving",
      "Confirming a domain-verification TXT record is live",
    ],
  },
  "ip-lookup": {
    intro:
      "IP Lookup returns the public information associated with an IP address: approximate location, internet provider, autonomous system number, time zone and coordinates, with a link to view the location on a map. Leave the box empty to look up your own public address.\n\nThe data comes from a geolocation database queried through the ipapi.co service. It identifies the network an address belongs to, not a person or a street address, and for mobile and VPN connections the location is often that of the provider's gateway.",
    steps: [
      ["Enter an IP address", "Or leave it blank for your own."],
      ["Look up", "Results appear in a table."],
      ["Copy or map", "Copy all fields or open the location in maps."],
    ],
    faqs: [
      ["How accurate is IP geolocation?", "Reliable at country level, usually right at city level, never precise to an address."],
      ["Why does my location look wrong?", "You may be on a VPN, a mobile network or a corporate connection that exits elsewhere."],
      ["What is an ASN?", "The number identifying the network operator that announces the address range on the internet."],
    ],
    uses: [
      "Finding your public IP for a firewall allow list",
      "Checking which country a suspicious login came from",
      "Confirming that a VPN is working",
    ],
  },
  "ssl-checker": {
    intro:
      "SSL Certificate Checker looks up the certificates issued for a domain in public Certificate Transparency logs, using crt.sh. It shows the most recent certificate's validity dates, issuer and covered domain names, how many days remain, and a history of earlier certificates.\n\nThis is a record of what has been issued, not a live test of your server. It tells you a certificate exists and when it expires; it cannot confirm that the server is actually presenting that certificate or that the chain is installed correctly.",
    steps: [
      ["Enter a domain", "Without https://."],
      ["Check", "Certificate records are retrieved."],
      ["Review expiry and history", "Note the days remaining."],
    ],
    faqs: [
      ["Does this test my server's configuration?", "No. Use a live scanner such as SSL Labs to test the installed certificate, chain and protocols."],
      ["What is Certificate Transparency?", "A public, append-only record of every certificate that trusted authorities issue."],
      ["Why are there certificates I did not request?", "Hosting providers and CDNs often issue certificates on your behalf. Anything unrecognised is worth investigating."],
    ],
    uses: [
      "Checking when a certificate is due to expire",
      "Auditing which subdomains have certificates",
      "Spotting certificates issued without your knowledge",
    ],
  },
  "website-metadata-extractor": {
    intro:
      "Website Metadata Extractor fetches a public page and pulls out its key metadata: the title, meta description, Open Graph tags, Twitter Card tags, canonical URL and favicon. Click any value to copy it.\n\nIt is a quick way to see what a live page tells search engines and social networks without opening the source. The page is retrieved through an external service, so the result reflects what an anonymous visitor's request receives.",
    steps: [
      ["Enter a URL", "Any public page."],
      ["Extract", "Metadata is fetched and listed."],
      ["Copy values", "Click a field to copy it."],
    ],
    faqs: [
      ["Why are some fields empty?", "The page does not define those tags, or it adds them with JavaScript after loading."],
      ["Can it read pages behind a login?", "No. Only publicly accessible pages."],
      ["Why did the fetch fail?", "The site may block external requests."],
    ],
    uses: [
      "Checking share tags after publishing a page",
      "Collecting titles and descriptions from competitor pages",
      "Confirming the canonical URL on a live page",
    ],
  },
  "website-speed-checker": {
    intro:
      "Website Speed Checker runs Google PageSpeed Insights on a URL and shows the performance score with the lab metrics behind it: First Contentful Paint, Largest Contentful Paint, Total Blocking Time, Cumulative Layout Shift and Speed Index. Choose a desktop or mobile test.\n\nThe tool calls Google's public API. The shared free quota is limited and can run out, so there is an optional field for your own free API key, which is kept in your browser and sent only to Google. A test takes ten to twenty seconds.",
    steps: [
      ["Enter the URL", "A public page."],
      ["Choose mobile or desktop", "Mobile is the stricter test."],
      ["Run the test", "Add your own API key if the shared quota is exhausted."],
    ],
    faqs: [
      ["Why does the score change between runs?", "Lab tests vary with server load and network conditions. Run several and look at the typical value."],
      ["What are good values?", "LCP under 2.5 seconds, CLS under 0.1 and Total Blocking Time under 200 milliseconds."],
      ["Why is mobile lower than desktop?", "The mobile test simulates a mid-range phone on a slower connection."],
    ],
    uses: [
      "Benchmarking a page before and after optimisation",
      "Comparing your speed with a competitor's",
      "Finding which metric is holding a page back",
    ],
  },
};
