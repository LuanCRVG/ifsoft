/** Byte-preserving reader. Only line delimiters are excluded from records. */
export const MAX_BYTES = 5 * 1024 * 1024;
export function parseCNAB(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (bytes.length > MAX_BYTES) throw new Error('O limite de leitura é 5 MiB. Divida o arquivo no sistema de origem.');
  const decoder = new TextDecoder('windows-1252');
  const records = [], endings = new Set();
  let start = 0;
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] !== 10 && bytes[i] !== 13) continue;
    records.push({line: records.length + 1, text: decoder.decode(bytes.subarray(start, i)), length: i - start});
    if (bytes[i] === 13 && bytes[i + 1] === 10) { endings.add('CRLF'); i++; }
    else endings.add(bytes[i] === 10 ? 'LF' : 'CR');
    start = i + 1;
  }
  if (start < bytes.length) records.push({line:records.length+1,text:decoder.decode(bytes.subarray(start)),length:bytes.length-start});
  const bom = bytes.length >= 3 && bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191;
  let utf8Multibyte = false;
  try { new TextDecoder('utf-8',{fatal:true}).decode(bytes); utf8Multibyte = bytes.some(b => b > 127); } catch { /* legitimate legacy encoding */ }
  return {records,byteLength:bytes.length,endings:[...endings],encoding:'Windows-1252 / ASCII',bom,utf8Multibyte};
}
export const field = (record, start, end) => record.text.slice(start - 1, end);
export const digits = value => /^\d+$/.test(value);
export function date6(value) {
  if (!/^\d{6}$/.test(value)) return null;
  const day=Number(value.slice(0,2)), month=Number(value.slice(2,4)), year=2000+Number(value.slice(4));
  const dt=new Date(Date.UTC(year,month-1,day));
  return dt.getUTCFullYear()===year && dt.getUTCMonth()===month-1 && dt.getUTCDate()===day ? dt.toISOString().slice(0,10) : null;
}
export function nextDay(iso) {const d=new Date(iso+'T00:00:00Z'); d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10);}
export function isoTo6(iso) {return iso.slice(8,10)+iso.slice(5,7)+iso.slice(2,4);}
export function validISO(value) {return /^\d{4}-\d{2}-\d{2}$/.test(value||'') && !Number.isNaN(Date.parse(value+'T00:00:00Z')) && new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;}
export function localToday() {const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
export function money(cents) {
  const n=BigInt(cents), abs=n<0n?-n:n;
  return (n<0n?'-':'')+'R$ '+(abs/100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+','+(abs%100n).toString().padStart(2,'0');
}
