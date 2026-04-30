export async function loadPartials(pairs) {
  await Promise.all(pairs.map(async ([selector, url]) => {
    const target = document.querySelector(selector);
    if (!target) return;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    const html = await res.text();
    target.outerHTML = html;
  }));
}
