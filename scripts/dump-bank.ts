import { bank } from '../src/data/bank';
import { OUTLINE } from '../src/data/outline';
import { NOTES } from '../src/data/notes';
console.log(JSON.stringify({ items: bank(), outline: OUTLINE, notes: NOTES }));
