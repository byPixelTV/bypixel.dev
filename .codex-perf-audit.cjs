const path = require("path");
const { chromium } = require("C:/Users/Pixel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const executablePath = path.join(process.env.TEMP, "bypixel-browser-check/chromium-1234/chrome-win64/chrome.exe");
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  const routes = ["/", "/now", "/blog"];
  const results = {};
  for (const route of routes) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__perf = { long: [], shifts: [] };
      new PerformanceObserver((list) => window.__perf.long.push(...list.getEntries().map((e) => ({ start: e.startTime, duration: e.duration })))).observe({ type: "longtask", buffered: true });
      new PerformanceObserver((list) => window.__perf.shifts.push(...list.getEntries().filter((e) => !e.hadRecentInput).map((e) => e.value))).observe({ type: "layout-shift", buffered: true });
    });
    const started = Date.now();
    await page.goto("http://localhost:3002" + route, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1000);
    const data = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const resources = performance.getEntriesByType("resource");
      const paints = Object.fromEntries(performance.getEntriesByType("paint").map((e) => [e.name, e.startTime]));
      const lcp = performance.getEntriesByType("largest-contentful-paint").at(-1);
      const byType = {};
      for (const r of resources) {
        const type = r.initiatorType || "other";
        byType[type] ||= { count: 0, transfer: 0, decoded: 0 };
        byType[type].count++;
        byType[type].transfer += r.transferSize || 0;
        byType[type].decoded += r.decodedBodySize || 0;
      }
      return {
        dcl: nav.domContentLoadedEventEnd,
        load: nav.loadEventEnd,
        fcp: paints["first-contentful-paint"],
        lcp: lcp?.startTime,
        cls: window.__perf.shifts.reduce((a,b) => a+b, 0),
        longTaskCount: window.__perf.long.length,
        longTaskTotal: window.__perf.long.reduce((a,b) => a+b.duration, 0),
        maxLongTask: Math.max(0, ...window.__perf.long.map((x) => x.duration)),
        resources: resources.length,
        transfer: resources.reduce((a,r) => a+(r.transferSize||0), 0),
        decoded: resources.reduce((a,r) => a+(r.decodedBodySize||0), 0),
        byType,
        domNodes: document.querySelectorAll("*").length,
      };
    });
    if (route === "/") {
      data.scroll = await page.evaluate(() => new Promise((resolve) => {
        const frames = [];
        const begin = performance.now();
        let previous = begin;
        const duration = 6000;
        const max = document.documentElement.scrollHeight - innerHeight;
        const step = (now) => {
          frames.push(now - previous);
          previous = now;
          const progress = Math.min(1, (now - begin) / duration);
          scrollTo(0, max * progress);
          if (progress < 1) requestAnimationFrame(step);
          else {
            const dropped = frames.filter((delta) => delta > 25);
            resolve({ frames: frames.length, average: frames.reduce((a,b)=>a+b,0)/frames.length, p95: [...frames].sort((a,b)=>a-b)[Math.floor(frames.length*0.95)], max: Math.max(...frames), over25: dropped.length });
          }
        };
        requestAnimationFrame(step);
      }));
    }
    results[route] = data;
    await context.close();
  }
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
