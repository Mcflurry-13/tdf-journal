/** Globally balanced, order-preserving partition (O(n * maxPerRow)).
 * Extreme aspect ratios can make the preferred height band impossible.
 * Geometry, order and no-crop always win; singleton rows cap at 480px.
 */
export function justifiedRows(items, width, mobile = false, pair = false) {
  if (!items.length || width <= 0) return [];
  const gap = mobile ? 8 : 12, max = pair ? 2 : mobile ? 2 : 3;
  const target = mobile ? 210 : 260, min = mobile ? 140 : 200, high = 340;
  const dp = Array(items.length + 1).fill(Infinity), choices = [];
  dp[items.length] = 0;
  for (let i = items.length - 1; i >= 0; i--) {
    let ratios = 0;
    for (let n = 1; n <= max && i + n <= items.length; n++) {
      if (n > 1 && (items[i].wide || items[i + n - 1].wide)) break;
      ratios += items[i + n - 1].ratio;
      const raw = (width - gap * (n - 1)) / ratios;
      const height = n === 1 ? Math.min(raw, 480) : raw;
      const outside = Math.max(0, min-height, height-high);
      const singleton = n === 1 && items.length > 1 && !items[i].wide ? 1.5 : 0;
      const cost = ((height-target)/target)**2 + 8*(outside/target)**2 + singleton;
      if (cost + dp[i+n] < dp[i] || (pair && i === 0 && n === 2)) {
        dp[i] = cost + dp[i+n]; choices[i] = { start:i, count:n, height, ratios };
      }
      if (items[i].wide) break;
    }
  }
  const rows = [];
  for (let i = 0; i < items.length;) { rows.push(choices[i]); i += choices[i].count; }
  return rows;
}
