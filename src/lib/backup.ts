// Export / import a backup of everything stored on this device.
import { load, save } from './storage';

const KEYS = ['answers', 'story', 'settings'];

export async function exportBackup() {
  const data: Record<string, unknown> = {};
  for (const k of KEYS) data[k] = await load(k, null);
  const json = JSON.stringify({ app: 'checkride-trainer', version: 1, exportedAt: new Date().toISOString(), data });
  const name = `checkride-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File([json], name, { type: 'application/json' });
  // On iPhone, the share sheet lets you save to Files or send it to yourself.
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'Checkride Trainer backup' }); return 'shared'; } catch { /* cancelled */ return 'cancelled'; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  return 'downloaded';
}

export async function importBackup(file: File): Promise<string> {
  const parsed = JSON.parse(await file.text());
  if (parsed?.app !== 'checkride-trainer' || !parsed.data) throw new Error('That file isn’t a Checkride Trainer backup.');
  for (const k of KEYS) if (parsed.data[k] != null) await save(k, parsed.data[k]);
  const n = Array.isArray(parsed.data.answers) ? parsed.data.answers.length : 0;
  return `Restored ${n} answers from ${String(parsed.exportedAt).slice(0, 10)}.`;
}
