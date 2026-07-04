export async function solveChallenge(seed: string, difficulty: number): Promise<{ nonce: string; solveTimeMs: number }> {
  const start = performance.now();
  const prefix = '0'.repeat(difficulty);
  const encoder = new TextEncoder();
  let nonce = 0;
  while (true) {
    for (let i = 0; i < 500; i++) {
      const data = encoder.encode(seed + nonce);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      if (hashHex.startsWith(prefix)) {
        return { nonce: String(nonce), solveTimeMs: performance.now() - start };
      }
      nonce++;
    }
    await new Promise((r) => setTimeout(r, 0));
  }
}

export function collectAutomationFlags(): string[] {
  const flags: string[] = [];
  const nav = navigator as Navigator & { webdriver?: boolean };

  if (nav.webdriver) flags.push('webdriver');
  if (navigator.languages && navigator.languages.length === 0) flags.push('no-languages');
  if (!('plugins' in navigator) || navigator.plugins.length === 0) flags.push('no-plugins');
  if (typeof (window as any).chrome === 'undefined' && /Chrome/.test(navigator.userAgent)) {
    flags.push('fake-chrome-ua');
  }

  return flags;
}