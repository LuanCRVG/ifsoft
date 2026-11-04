import {money} from './cnab-parser.js';
export function serializableReport(result) {
  const {records,...report}=result;
  return {...report,note:'Exportação solicitada pelo usuário. Registros brutos não incluídos. Ocorrências podem conter dados bancários. Conferência parcial; não certifica titularidade nem aceite bancário.'};
}
export function reportJSON(result) {return JSON.stringify(serializableReport(result),null,2);}
const labels={error:'ERRO',warning:'AVISO',info:'INFORMAÇÃO'};
function wrap(text,width=90) {
  const out=[];
  for(const paragraph of String(text).replace(/[\r\n\t]/g,' ').split('\n')) {
    let rest=paragraph;
    while(rest.length>width) {let cut=rest.lastIndexOf(' ',width);if(cut<width/2)cut=width;out.push(rest.slice(0,cut));rest=rest.slice(cut).replace(/^ /,'');}
    out.push(rest);
  }
  return out;
}
const extra={'€':128,'‚':130,'ƒ':131,'„':132,'…':133,'†':134,'‡':135,'ˆ':136,'‰':137,'Š':138,'‹':139,'Œ':140,'Ž':142,'‘':145,'’':146,'“':147,'”':148,'•':149,'–':150,'—':151,'˜':152,'™':153,'š':154,'›':155,'œ':156,'ž':158,'Ÿ':159};
function hex(text) {return [...String(text)].map(c=>(c.charCodeAt(0)<256?c.charCodeAt(0):(extra[c]??63)).toString(16).padStart(2,'0')).join('');}
/** Self-contained PDF 1.4 writer: standard embedded-name fonts, WinAnsi text, paginated. */
export function reportPDF(result) {
  const r=result, lines=[];
  const line=t=>lines.push(...wrap(t));
  line('RELATÓRIO DE CONFERÊNCIA | '+r.bank.name+' ('+r.bank.code+') | CNAB '+r.layout);
  line('Arquivo: '+r.fileName);line('Análise: '+new Date(r.analyzedAt).toLocaleString('pt-BR'));
  line('Regras: '+r.ruleset);
  line('Geração: '+(r.generationDate||'Não identificada')+' | Hoje: '+r.today);
  line('Conferência: '+r.referenceDate+' | Envio pretendido: '+(r.sendDate||'Não informado'));
  line('Registros: '+r.recordCount+' | Tipos: '+Object.entries(r.recordTypes).map(([k,v])=>k+': '+v).join(', '));
  line(r.supported?'Títulos tipo 1: '+r.titleCount+' | Total '+(r.totalComplete?'':'parcial ')+money(r.totalCents):'Títulos e total financeiro não apurados: arquivo fora do escopo.');
  line('Conferências: '+r.summary.checks+' | Erros: '+r.summary.errors+' | Avisos: '+r.summary.warnings+' | Atendidas: '+r.summary.passed);
  line('Escopo: '+(r.supported?'Remessa Safra 400 reconhecida; conferência parcial.':'Arquivo fora do escopo. Validação de remessa não concluída.'));
  line('Identificação esperada: '+(r.expectedIdentification||'Configuração não informada'));
  line('Juros, multa e baixa: aplicação condicional aos campos de cada título.');
  line('');line('OCORRÊNCIAS E PENDÊNCIAS');line('');
  for(const c of r.checks.filter(c=>c.level!=='info')) {
    line(labels[c.level]+' | '+c.field+' | Linha '+(c.line??'-')+' | Tipo '+c.recordType);
    if(c.start)line('Posições: '+c.start+' a '+c.end);
    if(c.found!=='')line('Encontrado: ['+c.found+']');
    if(c.expected!=='')line('Esperado: '+c.expected);
    line(c.description);line('Referência: '+c.reference);line('');
  }
  line('REFERÊNCIAS');line('Safra: Manual de Transferência de Arquivos, Cobrança Produto 001, maio/2026.');
  for(const source of r.references||[]) {line(source.title);if(source.url)line(source.url);}
  line('Mapa detalhado: docs/regras-safra.md no projeto.');
  line('Homologação específica: informações fornecidas pelo solicitante, não uma regra universal.');
  line('Não confirma titularidade, autenticidade ou aceite. Nenhum arquivo CNAB foi alterado.');
  const pages=[];let cursor=0;while(cursor<lines.length){let end=Math.min(cursor+49,lines.length);for(let n=Math.max(cursor,end-2);n<end;n++){if(['REFERÊNCIAS','OCORRÊNCIAS E PENDÊNCIAS'].includes(lines[n])&&end<lines.length){end=n;break;}}if(end===cursor)end=Math.min(cursor+49,lines.length);pages.push(lines.slice(cursor,end));cursor=end;while(lines[cursor]==='')cursor++;}
  const objects=['','<< /Type /Catalog /Pages 2 0 R >>','', '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
  const pageIds=[];
  for(let i=0;i<pages.length;i++) {
    const pageId=objects.length, streamId=pageId+1;pageIds.push(pageId);
    objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+streamId+' 0 R >>');
    let stream='0.96 0.95 1 rg 0 762 596 80 re f\n0.16 0.13 0.3 rg BT /F2 22 Tf 44 793 Td <'+hex('CNAB Validator')+'> Tj ET\n';
    stream+='0.28 0.3 0.36 rg BT /F1 9 Tf 44 735 Td 13.5 TL\n';
    for(const text of pages[i])stream+='<'+hex(text)+'> Tj T*\n';
    stream+='ET\n0.5 0.5 0.55 rg BT /F1 8 Tf 44 30 Td <'+hex('Processamento local | Relatório técnico | Página '+(i+1)+' de '+pages.length)+'> Tj ET\n';
    objects.push('<< /Length '+stream.length+' >>\nstream\n'+stream+'endstream');
  }
  objects[2]='<< /Type /Pages /Count '+pages.length+' /Kids ['+pageIds.map(id=>id+' 0 R').join(' ')+'] >>';
  let pdf='%PDF-1.4\n',offsets=[0];
  for(let i=1;i<objects.length;i++){offsets.push(pdf.length);pdf+=i+' 0 obj\n'+objects[i]+'\nendobj\n';}
  const xref=pdf.length;pdf+='xref\n0 '+objects.length+'\n0000000000 65535 f \n';
  for(const offset of offsets.slice(1))pdf+=String(offset).padStart(10,'0')+' 00000 n \n';
  pdf+='trailer\n<< /Size '+objects.length+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF';
  return new TextEncoder().encode(pdf);
}
export function download(data,name,type) {
  const url=URL.createObjectURL(new Blob([data],{type}));
  const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
