import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const ACCEPTED_LICENSE = /^(?:CC BY(?:-SA)? [1-4]\.0|CC0 1\.0|Public domain)$/;
const ACCEPTED_PROVIDER = new Set(['Wikimedia Commons', 'iNaturalist']);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

export function verifyImagePolicy({ baseDir, manifest, herbs = [] }) {
  const errors = [];
  const files = new Set();
  let totalBytes = 0;
  const images = manifest?.images && typeof manifest.images === 'object' ? manifest.images : {};
  const root = path.resolve(baseDir);

  for (const [name, image] of Object.entries(images)) {
    for (const field of ['file', 'alt', 'sourceUrl', 'author', 'license', 'licenseUrl', 'taxon', 'depicts', 'sha256', 'matchEvidence', 'provider']) {
      if (!String(image?.[field] || '').trim()) errors.push(`${name}: missing ${field}`);
    }
    if (!ACCEPTED_LICENSE.test(String(image?.license || ''))) errors.push(`${name}: disallowed license ${image?.license || '(empty)'}`);
    if (!ACCEPTED_PROVIDER.has(image?.provider)) errors.push(`${name}: disallowed provider ${image?.provider || '(empty)'}`);
    if (!/^https?:\/\//.test(String(image?.sourceUrl || ''))) errors.push(`${name}: invalid source URL`);
    if (!/^https?:\/\//.test(String(image?.licenseUrl || ''))) errors.push(`${name}: invalid license URL`);
    if (!/^images\/herbs\/open\/[^/]+\.(?:jpe?g|png|webp)$/i.test(String(image?.file || ''))) errors.push(`${name}: image is outside the searched-open image directory`);

    const target = path.resolve(root, image?.file || '');
    if (!target.startsWith(root + path.sep)) { errors.push(`${name}: image path escapes the project`); continue; }
    try {
      const bytes = fs.readFileSync(target);
      if (digest(bytes) !== image.sha256) errors.push(`${name}: image hash mismatch`);
      if (!files.has(image.file)) totalBytes += bytes.length;
      files.add(image.file);
    } catch {
      errors.push(`${name}: missing local image`);
    }
  }

  for (const herb of herbs) {
    if (!herb?.image) continue;
    const image = images[herb.name];
    if (!image) { errors.push(`${herb.name}: runtime image is absent from the open-image manifest`); continue; }
    const expected = {
      image: image.file,
      imageAlt: image.alt,
      author: image.author,
      license: image.license,
      sourceUrl: image.sourceUrl,
      licenseUrl: image.licenseUrl
    };
    const actual = {
      image: herb.image,
      imageAlt: herb.imageAlt,
      author: herb.imageCredit?.author,
      license: herb.imageCredit?.license,
      sourceUrl: herb.imageCredit?.url,
      licenseUrl: herb.imageLicenseUrl
    };
    for (const key of Object.keys(expected)) {
      if (actual[key] !== expected[key]) errors.push(`${herb.name}: runtime ${key} does not match the open-image manifest`);
    }
  }

  return { errors, records: Object.keys(images).length, uniqueFiles: files.size, totalBytes, runtimeImages: herbs.filter(herb => herb?.image).length };
}
