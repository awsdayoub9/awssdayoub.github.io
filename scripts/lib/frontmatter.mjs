/**
 * Minimal YAML-subset frontmatter parser shared by the build scripts (check.mjs, check-seo.mjs)
 * and astro.config.mjs (sitemap lastmod). It covers exactly what the content files use:
 * scalar values (quoted or bare), nested maps, block lists of scalars and block lists of maps
 * (`- q: "…"` followed by indented keys). Anything else throws so a malformed file is noticed.
 * No YAML dependency, so Node can run the scripts before Astro is loaded.
 */

export function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!m) return { data: {}, body: text };
  return { data: parseYaml(m[1]), body: text.slice(m[0].length) };
}

export function parseYaml(src) {
  const lines = src
    .split(/\r?\n/)
    .map((raw, n) => ({ raw, n }))
    .filter((l) => l.raw.trim() && !/^\s*#/.test(l.raw))
    .map((l) => ({ indent: l.raw.match(/^ */)[0].length, text: l.raw.trim(), n: l.n + 1 }));
  let i = 0;

  const scalar = (s) => {
    s = s.trim();
    if (s === '') return '';
    if (s === '[]') return [];
    if (s === '{}') return {};
    if (s.startsWith('"')) return JSON.parse(s);
    if (s.startsWith("'")) return s.slice(1, -1).replace(/''/g, "'");
    if (s.startsWith('[') && s.endsWith(']')) return s.slice(1, -1).split(',').map((x) => scalar(x));
    if (s === 'true') return true;
    if (s === 'false') return false;
    if (s === 'null' || s === '~') return null;
    if (/^-?\d+$/.test(s)) return Number(s);
    return s;
  };
  const isItem = (l) => l && (l.text === '-' || l.text.startsWith('- '));
  const KEY = /^([^:\s"'\[][^:]*?):(?:\s+(.*)|\s*)$/;

  function block(indent) {
    if (i >= lines.length) return null;
    return isItem(lines[i]) ? list(indent) : map(indent);
  }
  function map(indent) {
    const obj = {};
    while (i < lines.length && lines[i].indent === indent && !isItem(lines[i])) {
      const l = lines[i];
      const kv = l.text.match(KEY);
      if (!kv) throw new Error(`frontmatter line ${l.n}: cannot parse "${l.text}"`);
      const [, key, rest] = kv;
      i++;
      if (rest === undefined || rest === '') {
        const next = lines[i];
        if (next && (next.indent > indent || (next.indent === indent && isItem(next)))) obj[key] = block(next.indent);
        else obj[key] = '';
      } else obj[key] = scalar(rest);
    }
    return obj;
  }
  function list(indent) {
    const arr = [];
    while (i < lines.length && lines[i].indent === indent && isItem(lines[i])) {
      const l = lines[i];
      const rest = l.text.slice(1).trim();
      if (rest === '') { i++; arr.push(block(lines[i]?.indent ?? indent + 2)); continue; }
      if (KEY.test(rest)) {
        // map item: the first key sits on the dash line; the rest are indented to the same column
        const childIndent = indent + (l.text.length - rest.length);
        lines[i] = { indent: childIndent, text: rest, n: l.n };
        arr.push(map(childIndent));
      } else { arr.push(scalar(rest)); i++; }
    }
    return arr;
  }
  return lines.length ? map(lines[0].indent) : {};
}
