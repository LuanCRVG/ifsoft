import {field,digits,date6,nextDay,isoTo6,money} from '../cnab-parser.js';
export const MANUAL_URL='https://www.safra.com.br/data/files/7A/96/C0/51/EE79E910E792D4E901B9F9C2/CNAB%20400_05.26.pdf';
export const ruleset='Safra CNAB 400 / integração homologada';
const MANUAL='Safra CNAB 400, maio/2026';
const HOMOLOG='Equipe de homologação Safra, confirmação direta relatada pelo solicitante: cenário de juros diários, multa e baixa';
const TYPES={'0':'Header','1':'Título','2':'Distribuição / beneficiário final','4':'Nota fiscal','6':'Descontos / recebimento','7':'Mensagem','8':'Transferência de carteira','9':'Trailer'};
export function validate(ctx) {
  const {parsed,add}=ctx, {records}=parsed;
  let total=0n,invalidAmounts=0;
  const details=records.filter(r=>r.text[0]==='1'), transfers=records.some(r=>r.text[0]==='8');
  const analysis={supported:false,titleCount:details.length,totalCents:'0',totalComplete:false,generationDate:null,recordCount:records.length,recordTypes:{},references:[{title:MANUAL,url:MANUAL_URL},{title:'Guia de implantação fornecido: 001281%29.pdf, sem revisão explícita'},{title:HOMOLOG}]};
  for(const r of records) {const t=r.text[0]||'Vazio';analysis.recordTypes[t]=(analysis.recordTypes[t]||0)+1;}
  const issue=(level,code,name,description,extra={})=>add({level,code,field:name,description,...extra});
  const test=(ok,code,name,description,extra={},failure='error')=>issue(ok?'info':failure,code,name,ok?'Conferência atendida. '+description:description,extra);
  const at=(r,start,end,expected='',reference=MANUAL)=>({line:r.line,recordType:r.text[0]||'Vazio',start,end,found:field(r,start,end),expected,reference});
  if(!records.length) {issue('error','empty','Arquivo vazio','Não há registros para analisar.');return analysis;}
  if(parsed.bom || parsed.utf8Multibyte) {
    issue('error','encoding','Codificação','Detectado BOM ou conteúdo UTF-8 multibyte. A análise posicional foi interrompida: o manual exige ANSI. Exporte novamente no Sistema; o aplicativo não converte o arquivo.',{reference:MANUAL+' §4.2'});return analysis;
  }
  test(!parsed.endings.includes('CR'),'line-endings','Delimitadores','CRLF e LF são aceitos; CR isolado exige conferência.',{found:parsed.endings.join(', ')||'Sem delimitador final',expected:'CRLF ou LF'},'warning');
  if(records[0].length===240) {issue('warning','unsupported-layout','Layout','Registro de 240 posições identificado. CNAB 240 ainda não é suportado. Nenhuma regra posicional 400 foi aplicada.');return analysis;}
  for(const r of records) {
    test(r.length===400,'record-length','Tamanho do registro','O registro deve conter 400 bytes de dados, sem delimitador de linha.',{...at(r,1,Math.max(1,r.length),'400 posições'),found:String(r.length),reference:MANUAL+' §6.1'});
    test(!/[\x00-\x1f\x7f]/.test(r.text),'control','Caracteres de controle','O registro não deve conter caracteres de controle.',{...at(r,1,Math.max(1,r.length),'Texto ANSI'),found:/[\x00-\x1f\x7f]/.test(r.text)?'Controle encontrado':'Ausentes'});
  }
  const header=records[0];
  if(header.text[0]==='0' && (header.text[1]==='2' || field(header,3,9)==='RETORNO')) {
    issue('warning','return','Tipo de arquivo','Arquivo de retorno identificado pelo Header. As regras de remessa não foram executadas.',at(header,2,9,'Remessa'));return analysis;
  }
  test(header.text[0]==='0','header-first','Header','O primeiro registro deve ser o Header tipo 0.',at(header,1,1,'0'));
  if(header.text[0]!=='0'||header.length!==400) {issue('warning','dispatch','Identificação do arquivo','Sem Header íntegro, não é seguro aplicar regras específicas de remessa.');return analysis;}
  const bank=field(header,77,79);
  test(bank==='422','bank','Banco','O banco do arquivo deve corresponder ao Safra (422).',at(header,77,79,'422',MANUAL+' §6.1.1'));
  if(bank!=='422') {issue('warning','bank-unsupported','Módulo bancário','Nenhuma regra específica do Safra foi aplicada a este banco.');return analysis;}
  test(header.text[1]==='1' && field(header,3,9)==='REMESSA','direction','Tipo de arquivo','O Header deve identificar uma REMESSA.',at(header,2,9,'1REMESSA'));
  if(header.text[1]!=='1'||field(header,3,9)!=='REMESSA') return analysis;
  analysis.supported=true;
  test(field(header,10,11)==='01','service','Serviço','O serviço de cobrança deve ser 01.',at(header,10,11,'01',MANUAL+' §6.1.1'));
  test(records.filter(r=>r.text[0]==='0').length===1,'header-count','Quantidade de Headers','Deve existir um único Header.',{found:String(records.filter(r=>r.text[0]==='0').length),expected:'1'});
  const trailers=records.filter(r=>r.text[0]==='9');
  test(trailers.length===1,'trailer-count','Quantidade de Trailers','Deve existir um único Trailer.',{found:String(trailers.length),expected:'1'});
  test(records.at(-1).text[0]==='9','trailer-last','Trailer final','O último registro deve ser tipo 9.',at(records.at(-1),1,1,'9'));
  test(details.length>0,'details','Registros de título','É necessário ao menos um registro de título tipo 1.',{found:String(details.length),expected:'Ao menos 1'},transfers?'warning':'error');
  for(const r of records) {
    test(Boolean(TYPES[r.text[0]]),'record-type','Tipo do registro','Tipos reconhecidos: 0, 1, 2, 4, 6, 7, 8 e 9.',at(r,1,1,Object.keys(TYPES).join(', '),MANUAL+' §5'));
    if(r.length!==400) continue;
    test(field(r,395,400)===String(r.line).padStart(6,'0'),'sequence','Sequência de registros','A sequência deve iniciar em 000001 e avançar uma unidade por registro.',at(r,395,400,String(r.line).padStart(6,'0'),MANUAL+' §6.1'));
  }
  const extras=records.filter(r=>'24678'.includes(r.text[0]||'?'));
  if(extras.length) issue('warning','complementary-scope','Registros adicionais','Tipos '+[...new Set(extras.map(r=>r.text[0]))].join(', ')+' reconhecidos. Tamanho e sequência conferidos; os campos específicos desses registros ainda não são validados.',{reference:MANUAL+' §5 e §6.1.3–6.1.7'});
  const generation=date6(field(header,95,100));analysis.generationDate=generation;
  test(Boolean(generation),'generation-date','Data de geração','A data de geração deve ser uma data real no formato DDMMAA.',at(header,95,100,'DDMMAA',MANUAL+' §6.1.1'));
  if(generation && ctx.sendDate) test(generation<=ctx.sendDate,'generation-send','Geração e envio','A geração está posterior à data de envio selecionada. Confirme as datas.',at(header,95,100,'Geração até '+ctx.sendDate),'warning');
  const company=field(header,27,40);
  test(digits(company)&&company.length===14,'header-company','Identificação da empresa','A identificação deve ter 14 posições numéricas, agência (5) + conta com DV (9).',at(header,27,40,'14 dígitos',MANUAL+' §6.1.1'));
  if(ctx.expectedIdentification) test(company===ctx.expectedIdentification,'header-config','Empresa × configuração','A identificação do Header deve corresponder à composição informada na configuração.',at(header,27,40,ctx.expectedIdentification));
  else issue('warning','config-pending','Configuração não informada','A comparação Header × detalhe será executada. Informe e confira a conta para comparar com o cadastro do Sistema.');
  issue('info','safra-rules','Regras Safra CNAB 400','Conjunto único ativo. Juros diários são monetários; multa e baixa são conferidas conforme os campos de cada título. A combinação de baixa e multa usa 05/16, sem exigir 01 para juros.',{reference:HOMOLOG});
  for(const r of details) {
    if(r.length!==400) {invalidAmounts++;continue;}
    const id=field(r,18,31), due=date6(field(r,121,126));
    test(digits(id)&&id.length===14,'detail-company-format','Identificação da empresa','São esperadas 14 posições numéricas.',at(r,18,31,'14 dígitos',MANUAL+' §6.1.2'));
    test(id===company,'company-match','Empresa × Header','A identificação do detalhe deve coincidir com a do Header.',at(r,18,31,company));
    if(ctx.expectedIdentification) test(id===ctx.expectedIdentification,'detail-config','Empresa × configuração','A identificação do detalhe deve corresponder à configuração.',at(r,18,31,ctx.expectedIdentification));
    test(Boolean(due),'due-date','Vencimento','O vencimento deve ser uma data real DDMMAA. A versão atual interpreta AA como 2000–2099.',at(r,121,126,'DDMMAA',MANUAL+' §6.1.2'));
    if(due) {
      test(due>=ctx.referenceDate,'overdue','Vencimento × conferência','Vencimento '+due+'; data de conferência '+ctx.referenceDate+'. Título vencido requer avaliação.',at(r,121,126,'Data a partir de '+ctx.referenceDate),'warning');
      if(ctx.sendDate && ctx.sendDate!==ctx.referenceDate) test(due>=ctx.sendDate,'due-send','Vencimento × envio','Vencimento '+due+'; envio pretendido '+ctx.sendDate+'. Confirme as condições de envio.',at(r,121,126,'Data a partir de '+ctx.sendDate),'warning');
    }
    const value=field(r,127,139);
    test(digits(value),'amount','Valor nominal','O valor deve ter 13 posições numéricas, com duas casas decimais implícitas.',at(r,127,139,'13 dígitos',MANUAL+' §6.1.2'));
    if(digits(value)) total+=BigInt(value);else invalidAmounts++;
    const interest=field(r,161,173), interestDate=field(r,86,91);
    test(digits(interest),'interest','Juros por dia','Informe valor monetário diário em centavos implícitos; 0000000000033 representa R$ 0,33. Zero é permitido quando não há juros.',at(r,161,173,'13 dígitos',MANUAL+' §6.1.2'));
    if(!/^(0{6}| {6})$/.test(interestDate)) {
      test(Boolean(date6(interestDate)),'interest-date','Início dos juros','Data de juros a conferir. A tabela reserva 6 posições; a nota do manual menciona 8, por isso este resultado é uma pendência.',at(r,86,91,'DDMMAA; confirmar com o banco',MANUAL+' §6.1.2 e §6.2.9'),'warning');
      if(digits(interest)) test(BigInt(interest)>0n,'interest-zero','Data de juros × valor diário','Foi informada data de início de juros com valor diário zerado. Confirme se a cobrança é aplicável.',at(r,161,173,'Valor diário quando aplicável'),'warning');
    }
    const instr1=field(r,157,158),instr2=field(r,159,160),days=field(r,382,384);
    test(digits(instr1)&&digits(instr2),'instruction-format','Instruções','As duas instruções devem ser numéricas.',at(r,157,160,'4 dígitos',MANUAL+' §6.1.2'));
    const hasDays=/^\d{3}$/.test(days)&&Number(days)>0;
    if(!/^(0{3}| {3})$/.test(days)) test(/^\d{3}$/.test(days),'days-format','Dias para baixa','O prazo informado deve usar três posições numéricas.',at(r,382,384,'DDD',HOMOLOG));
    if(hasDays) test(instr1==='05','write-off-instruction','Instrução 1','Foi informado prazo de '+Number(days)+' dias para baixa, mas não foi encontrada a instrução 05 exigida pelo Safra para esse cenário. Baixa do título não significa pagamento da dívida.',at(r,157,158,'05',HOMOLOG));
    else if(instr1==='05') issue('warning','write-off-days-pending','Instrução de baixa sem prazo','Há instrução 05 sem prazo numérico positivo em 382–384. Confirme a configuração de baixa desse título.',at(r,382,384,'Prazo quando aplicável',HOMOLOG));
    const fine=instr1==='16'||instr2==='16';
    if(fine) {
      if(hasDays || instr1==='05') test(instr2==='16','fine-instruction','Instrução 2','Na combinação de baixa e multa, use 05 na Instrução 1 e 16 na Instrução 2. Juros monetários diários não exigem a instrução 01.',at(r,159,160,'16',HOMOLOG));
      else test(true,'fine-instruction','Instrução de multa','A instrução 16 indica multa neste título. Não há prazo de baixa a exigir.',at(r,157,160,'16 em uma das instruções',MANUAL+' §6.2.5; '+HOMOLOG));
      const fineDate=field(r,206,211),percent=field(r,212,215),suffix=field(r,216,218);
      test(Boolean(date6(fineDate)),'fine-date','Início da multa','A multa indicada pela instrução 16 deve conter data de início válida.',at(r,206,211,'DDMMAA',HOMOLOG));
      if(due) test(fineDate===isoTo6(nextDay(due)),'fine-next-day','Multa × vencimento','A orientação recebida define início da multa no dia seguinte ao vencimento.',at(r,206,211,isoTo6(nextDay(due)),HOMOLOG));
      test(/^\d{4}$/.test(percent)&&Number(percent)>0,'fine-percent','Percentual da multa','O percentual configurado deve usar 99v99 e ser positivo. Exemplo: 0200 = 2,00%. Não se exige 2% de todos os títulos.',at(r,212,215,'Percentual numérico não zerado',HOMOLOG));
      test(suffix==='000','fine-suffix','Complemento da multa','O complemento da multa deve ser 000.',at(r,216,218,'000',HOMOLOG));
    } else if(date6(field(r,206,211)) && /^\d{4}$/.test(field(r,212,215)) && Number(field(r,212,215))>0) {
      issue('warning','fine-suspected','Multa sem instrução 16?','O campo compartilhado 206–218 aparenta conter data e percentual de multa, mas não há instrução 16. Se a intenção era cobrar multa, falta essa instrução. Como o campo também admite abatimento, confirme a finalidade antes de classificar como erro.',at(r,206,218,'16 quando for multa',HOMOLOG));
    }

  }
  analysis.totalCents=total.toString();analysis.totalComplete=invalidAmounts===0;
  if(invalidAmounts) issue('warning','partial-total','Total parcial','Há '+invalidAmounts+' título(s) com valor ou tamanho inválido. A soma não representa o total integral.');
  const trailer=trailers.length===1?trailers[0]:null;
  if(trailer?.length===400) {
    const count=field(trailer,369,376),sum=field(trailer,377,391);
    test(digits(count),'trailer-count-format','Quantidade no Trailer','A quantidade deve ter oito posições numéricas.',at(trailer,369,376,'8 dígitos',MANUAL+' §6.1.8'));
    test(digits(sum),'trailer-total-format','Total no Trailer','O total deve ter quinze posições numéricas, com duas casas decimais implícitas.',at(trailer,377,391,'15 dígitos',MANUAL+' §6.1.8'));
    if(transfers) issue('warning','transfer-totals','Totais com transferências','Há tipo 8. Contagem e soma dos tipos 1 são apenas informativas; a reconciliação integral do Trailer fica pendente para esse cenário.',at(trailer,369,391,'Conferência especializada',MANUAL+' §6.1.7–6.1.8'));
    else {
      if(digits(count)) test(BigInt(count)===BigInt(details.length),'trailer-count-match','Quantidade de títulos','O Trailer deve coincidir com os registros tipo 1 da remessa convencional.',at(trailer,369,376,String(details.length).padStart(8,'0'),MANUAL+' §6.1.8; contagem de tipos 1'));
      if(digits(sum)&&!invalidAmounts) test(BigInt(sum)===total,'trailer-sum-match','Soma dos títulos','O Trailer deve coincidir com a soma nominal dos títulos: '+money(total)+'.',at(trailer,377,391,total.toString().padStart(15,'0'),MANUAL+' §6.1.8'));
    }
  }
  issue('warning','scope','Limites da conferência','Análise parcial do layout: campos não listados, regras contratuais, titularidade, autenticidade e aceite bancário não são verificados. Vencimento futuro não garante aceite.');
  return analysis;
}
