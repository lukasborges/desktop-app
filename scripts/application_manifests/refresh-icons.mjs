#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '../..');
const definitionsDirectory = path.join(repositoryRoot, 'packages/app/manifests/definitions');
const iconsDirectory = path.join(repositoryRoot, 'packages/app/manifests/icons');
const overridesPath = path.join(scriptDirectory, 'icon-sources.json');

const DEFAULT_PROVIDER = 'https://icon.horse/icon';
const MAX_ICON_BYTES = 5 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 15_000;
const CONCURRENCY = 2;
const ICON_HORSE_INTERVAL_MS = 700;
const MAX_REQUEST_ATTEMPTS = 3;
const iconHorseFallbacks = new Map();

const usage = `Usage:
  yarn catalog:refresh-icons [--dry-run] [--id <manifest-id>]...

Options:
  --all              Refresh every listed catalog application (default).
  --dry-run          Resolve candidates without writing icon files.
  --id <id>          Refresh only the selected manifest. May be repeated.
  --provider <url>   Override Icon Horse, or use a Besticon /allicons.json URL.
  --help             Show this help.
`;

function parseArguments(argv) {
  const options = {
    all: false,
    dryRun: false,
    ids: [],
    provider: process.env.BESTICON_URL || process.env.ICON_HORSE_URL || DEFAULT_PROVIDER,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--all') {
      options.all = true;
    } else if (argument === '--dry-run') {
      options.dryRun = true;
    } else if (argument === '--id') {
      const id = argv[index + 1];
      if (!id) throw new Error('--id requires a manifest id');
      options.ids.push(id);
      index += 1;
    } else if (argument === '--provider') {
      const provider = argv[index + 1];
      if (!provider) throw new Error('--provider requires a URL');
      options.provider = provider;
      index += 1;
    } else if (argument === '--help' || argument === '-h') {
      console.log(usage);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (!options.ids.length) options.all = true;
  return options;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

function canonicalHostname(manifest, override) {
  if (override === false) return null;
  const source = (typeof override === 'object' ? override.page : override)
    || manifest.icon_source_url
    || manifest.scope
    || manifest.start_url;
  if (!source || source.startsWith('platform:')) return null;

  const withoutTemplates = source
    .replace(/\{\{[^}]+\}\}/g, '')
    .replace('://*.', '://');

  try {
    return new URL(withoutTemplates).hostname.replace(/^\*\./, '') || null;
  } catch {
    return null;
  }
}

function candidateScore(candidate) {
  if (candidate.error || !['ico', 'png', 'svg', 'webp'].includes(candidate.format)) return -1;
  if (!candidate.url || !candidate.url.startsWith('https://')) return -1;

  const width = Number(candidate.width) || 0;
  const height = Number(candidate.height) || 0;
  if (width && height && Math.min(width, height) < 16) return -1;

  const squareRatio = width && height ? Math.min(width, height) / Math.max(width, height) : 1;
  if (squareRatio < 0.75) return -1;

  const area = width && height ? Math.min(width * height, 512 * 512) : 0;
  const vectorBonus = candidate.format === 'svg' ? 512 * 512 : 0;
  return vectorBonus + area;
}

function selectCandidate(candidates) {
  return [...candidates]
    .map(candidate => ({ candidate, score: candidateScore(candidate) }))
    .filter(({ score }) => score >= 0)
    .sort((left, right) => right.score - left.score)[0]?.candidate;
}

async function fetchWithTimeout(url, responseType) {
  for (let attempt = 1; attempt <= MAX_REQUEST_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: responseType === 'json' ? 'application/json' : 'image/*',
          'User-Agent': 'Platform catalog icon updater/1.0',
        },
        redirect: 'follow',
        signal: controller.signal,
      });

      if (response.status === 429 && attempt < MAX_REQUEST_ATTEMPTS) {
        const retryAfter = Number.parseInt(response.headers.get('retry-after') || '', 10);
        const retryDelay = Number.isFinite(retryAfter) ? retryAfter * 1000 : attempt * 5000;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);

      if (responseType === 'json') return response.json();
      return {
        buffer: Buffer.from(await response.arrayBuffer()),
        contentType: response.headers.get('content-type') || '',
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(`request attempts exhausted for ${url}`);
}

function validateIcon(buffer, format) {
  if (!buffer.length) throw new Error('downloaded icon is empty');
  if (buffer.length > MAX_ICON_BYTES) throw new Error('downloaded icon exceeds 5 MiB');

  if (format === 'png') {
    if (!isPng(buffer)) {
      throw new Error('candidate declared as PNG has an invalid signature');
    }
    return;
  }

  if (format === 'ico') {
    if (buffer.length < 6 || buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1) {
      throw new Error('candidate declared as ICO has an invalid signature');
    }
    return;
  }

  if (format === 'webp') {
    if (buffer.length < 12 || buffer.toString('ascii', 0, 4) !== 'RIFF'
      || buffer.toString('ascii', 8, 12) !== 'WEBP') {
      throw new Error('candidate declared as WebP has an invalid signature');
    }
    return;
  }

  if (format === 'svg') {
    const source = buffer.toString('utf8', 0, Math.min(buffer.length, 4096));
    if (!/<svg[\s>]/i.test(source) || /<html[\s>]/i.test(source)) {
      throw new Error('candidate declared as SVG is not a valid standalone SVG');
    }
    return;
  }

  throw new Error(`unsupported icon format: ${format}`);
}

function isPng(buffer) {
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return buffer.length >= pngSignature.length
    && buffer.subarray(0, pngSignature.length).equals(pngSignature);
}

function pngDimensions(buffer) {
  if (!isPng(buffer) || buffer.length < 24) return {};
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function extractPngFromIco(buffer) {
  if (buffer.length < 6 || buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1) return null;
  const count = buffer.readUInt16LE(4);
  const images = [];

  for (let index = 0; index < count; index += 1) {
    const entryOffset = 6 + (index * 16);
    if (entryOffset + 16 > buffer.length) break;
    const width = buffer[entryOffset] || 256;
    const height = buffer[entryOffset + 1] || 256;
    const size = buffer.readUInt32LE(entryOffset + 8);
    const offset = buffer.readUInt32LE(entryOffset + 12);
    const image = buffer.subarray(offset, offset + size);
    if (offset + size <= buffer.length && isPng(image)) {
      images.push({ buffer: image, width, height });
    }
  }

  return images.sort((left, right) => (right.width * right.height) - (left.width * left.height))[0] || null;
}

function normalizeDirectIcon(response) {
  const { buffer, contentType } = response;
  if (isPng(buffer)) {
    return { buffer, format: 'png', ...pngDimensions(buffer) };
  }

  const source = buffer.toString('utf8', 0, Math.min(buffer.length, 4096));
  if (contentType.includes('svg') || /<svg[\s>]/i.test(source)) {
    return { buffer, format: 'svg' };
  }

  if (contentType.includes('icon') || contentType.includes('ico')) {
    const extracted = extractPngFromIco(buffer);
    if (extracted) return { ...extracted, format: 'png' };
    return { buffer, format: 'ico' };
  }

  if (contentType.includes('webp')) return { buffer, format: 'webp' };

  throw new Error(`unsupported response type: ${contentType || 'unknown'}`);
}

async function isIconHorseFallback(provider, hostname, response) {
  const initial = hostname[0]?.toLowerCase();
  if (!initial || !/[a-z0-9]/.test(initial)) return false;

  if (!iconHorseFallbacks.has(initial)) {
    const fallbackURL = `${provider.replace(/\/$/, '')}/${initial}.invalid`;
    iconHorseFallbacks.set(initial, fetchWithTimeout(fallbackURL, 'image'));
  }

  const fallback = await iconHorseFallbacks.get(initial);
  return digest(response.buffer) === digest(fallback.buffer);
}

function digest(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function currentIcon(id) {
  for (const extension of ['svg', 'png', 'webp', 'ico']) {
    const filePath = path.join(iconsDirectory, `${id}.${extension}`);
    try {
      return { buffer: await fs.readFile(filePath), extension, filePath };
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return null;
}

async function writeIcon(id, format, buffer) {
  const destination = path.join(iconsDirectory, `${id}.${format}`);
  const temporary = `${destination}.tmp`;
  await fs.writeFile(temporary, buffer);
  await fs.rename(temporary, destination);

  const obsoleteExtensions = ['svg', 'png', 'webp', 'ico'].filter(extension => extension !== format);
  await Promise.all(obsoleteExtensions.map(extension =>
    fs.rm(path.join(iconsDirectory, `${id}.${extension}`), { force: true })
  ));
  return destination;
}

async function refreshIcon(entry, options) {
  const { id, manifest, source } = entry;
  const hostname = canonicalHostname(manifest, source);
  if (!hostname) return { id, name: manifest.name, status: 'skipped', detail: 'no public source URL' };

  try {
    let resolved;
    if (typeof source === 'object' && source.icon) {
      const response = await fetchWithTimeout(source.icon, 'image');
      resolved = normalizeDirectIcon(response);
    } else if (options.provider.includes('allicons.json')) {
      const providerURL = new URL(options.provider);
      providerURL.searchParams.set('url', hostname);
      const result = await fetchWithTimeout(providerURL, 'json');
      const candidate = selectCandidate(result.icons || []);
      if (!candidate) throw new Error('provider returned no suitable catalog icon');
      const response = await fetchWithTimeout(candidate.url, 'image');
      resolved = {
        buffer: response.buffer,
        format: candidate.format,
        width: candidate.width,
        height: candidate.height,
      };
    } else {
      const providerURL = `${options.provider.replace(/\/$/, '')}/${encodeURIComponent(hostname)}`;
      const response = await fetchWithTimeout(providerURL, 'image');
      if (await isIconHorseFallback(options.provider, hostname, response)) {
        throw new Error('provider returned a generated fallback icon');
      }
      resolved = normalizeDirectIcon(response);
    }

    validateIcon(resolved.buffer, resolved.format);

    const existing = await currentIcon(id);
    if (existing && digest(existing.buffer) === digest(resolved.buffer) && existing.extension === resolved.format) {
      return { id, name: manifest.name, status: 'unchanged', detail: hostname };
    }

    if (!options.dryRun) await writeIcon(id, resolved.format, resolved.buffer);
    const dimensions = resolved.width && resolved.height
      ? `${resolved.width}x${resolved.height}`
      : 'vector';
    return {
      id,
      name: manifest.name,
      status: options.dryRun ? 'would-update' : 'updated',
      detail: `${hostname} → ${resolved.format.toUpperCase()} ${dimensions}${typeof source === 'object' ? ' (curated)' : ''}`,
    };
  } catch (error) {
    if (error.message === 'provider returned a generated fallback icon') {
      return { id, name: manifest.name, status: 'preserved', detail: error.message };
    }
    return { id, name: manifest.name, status: 'failed', detail: error.message };
  }
}

async function parallelMap(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const overrides = await readJson(overridesPath);
  const files = (await fs.readdir(definitionsDirectory))
    .filter(file => file.endsWith('.json'))
    .sort((left, right) => Number.parseInt(left, 10) - Number.parseInt(right, 10));

  const entries = [];
  for (const file of files) {
    const id = path.basename(file, '.json');
    if (!options.all && !options.ids.includes(id)) continue;
    if (options.ids.length && !options.ids.includes(id)) continue;

    const manifest = await readJson(path.join(definitionsDirectory, file));
    if (manifest.doNotList) continue;
    entries.push({ id, manifest, source: overrides[id] });
  }

  const unknownIds = options.ids.filter(id => !entries.some(entry => entry.id === id));
  if (unknownIds.length) throw new Error(`Unknown or unlisted manifest ids: ${unknownIds.join(', ')}`);

  console.log(`${options.dryRun ? 'Checking' : 'Refreshing'} ${entries.length} catalog icons via ${options.provider}`);
  const besticonProvider = options.provider.includes('allicons.json');
  const concurrency = besticonProvider ? CONCURRENCY : 1;
  const results = await parallelMap(entries, concurrency, async entry => {
    const result = await refreshIcon(entry, options);
    if (!besticonProvider) {
      await new Promise(resolve => setTimeout(resolve, ICON_HORSE_INTERVAL_MS));
    }
    return result;
  });

  for (const result of results) {
    console.log(`${result.status.padEnd(12)} ${result.id.padStart(5)}  ${result.name}: ${result.detail}`);
  }

  const counts = results.reduce((summary, result) => {
    summary[result.status] = (summary[result.status] || 0) + 1;
    return summary;
  }, {});
  console.log(`Summary: ${Object.entries(counts).map(([status, count]) => `${status}=${count}`).join(', ')}`);

  if (counts.failed) process.exitCode = 1;
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
