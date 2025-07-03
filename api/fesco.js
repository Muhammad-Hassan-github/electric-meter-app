export default async function handler(req, res) {
  const refno = "11132281778951"; // hardcoded

  const response = await fetch("https://bill.pitc.com.pk/fescobill", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://fesco-bill.pk",
      "Referer": "https://fesco-bill.pk/",
      "User-Agent": "Mozilla/5.0"
    },
    body: new URLSearchParams({ searchTextBox: refno }).toString()
  });

  const html = await response.text();
  res.status(200).send(html);
}
