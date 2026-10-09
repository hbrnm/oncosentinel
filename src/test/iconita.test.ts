import { describe, it, expect } from 'vitest';

// Iconița aplicației instalate era un singur SVG „data:” cu inima pe toată suprafața: telefonul o mărea și o tăia.
describe('Iconița aplicației instalate', () => {
  const readFs = async () => {
    const nodeFs = 'node:fs';
    return import(/* @vite-ignore */ nodeFs);
  };

  it('are PNG 192 și 512, fișiere reale, și o variantă „maskable” separată', async () => {
    const { readFileSync, existsSync } = await readFs();
    const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8'));
    const icons: { src: string; sizes: string; type: string; purpose: string }[] = manifest.icons;
    expect(icons.every((icon) => !icon.src.startsWith('data:') && existsSync(`public${icon.src}`))).toBe(true);
    for (const size of ['192x192', '512x512']) {
      expect(icons.some((icon) => icon.sizes === size && icon.type === 'image/png' && icon.purpose === 'any')).toBe(true);
    }
    expect(icons.some((icon) => icon.purpose === 'maskable' && icon.type === 'image/png')).toBe(true);
    expect(icons.some((icon) => icon.purpose.includes('any') && icon.purpose.includes('maskable'))).toBe(false);
  });

  it('are iconiță pentru iPhone (apple-touch-icon)', async () => {
    const { readFileSync, existsSync } = await readFs();
    const html: string = readFileSync('index.html', 'utf8');
    const href = html.match(/<link rel="apple-touch-icon" href="([^"]+)"/)![1];
    expect(existsSync(`public${href}`)).toBe(true);
  });
});
