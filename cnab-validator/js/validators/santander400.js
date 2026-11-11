import {field,digits,date6,money} from '../cnab-parser.js';
import {validDocument,cnpjReference} from '../banks/santander-documents.js';
export const reference='Santander H7800 CNAB 400 · V2.38 · Out/2026';
export const ruleset='Santander CNAB 400 / H7800 V2.38';
export const identificationLength=20;
const TYPES={'0':'Header','1':'Título / movimento','2':'Mensagem no recibo','3':'Ativo financeiro','4':'Mensagem na ficha','5':'Mensagem na ficha','6':'Mensagem na ficha','7':'Mensagem na ficha','8':'Pagamento / PIX','9':'Trailer'};
const MOVEMENTS=new Set('01 02 04 05 06 07 08 09 15 16 17 18 47 48 49 65 66 67'.split(' '));
const INSTRUCTIONS=new Set('00 02 03 04 06 07 08'.split(' '));
const WALLETS=new Set(['1','3','5','6','7','8']);
const SPECIES=new Set('01 02 03 05 06 07 08 19 33'.split(' '));
const STATES=new Set('AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' '));
const zero=raw=>/^0+$/.test(raw),empty=raw=>/^ *$/.test(raw)||zero(raw);
export function validate(ctx){
  const {parsed,add}=ctx,records=parsed.records;
  const analysis={supported:false,scopeComplete:true,titleCount:records.filter(r=>r.text[0]==='1').length,totalCents:'0',totalComplete:false,generationDate:null,recordCount:records.length,recordTypes:{},references:[{title:reference+' · manual fornecido pelo banco (62 páginas)'},{title:'Receita Federal · cálculo do DV do CNPJ',url:cnpjReference}]};
  for(const r of records)analysis.recordTypes[r.text[0]||'Vazio']=(analysis.recordTypes[r.text[0]||'Vazio']||0)+1;
  const issue=(level,code,name,description,extra={})=>add({level,code,field:name,description,reference,...extra});
  const at=(r,s,e,expected='',note='')=>({line:r.line,recordType:TYPES[r.text[0]]||'Desconhecido',start:s,end:e,found:field(r,s,e),expected,reference:reference+(note?' · '+note:'')});
  const test=(ok,code,name,description,extra={},level='error')=>issue(ok?'info':level,code,name,ok?'Conferência atendida. '+description:description,extra);
  const numeric=(r,s,e,name)=>{const raw=field(r,s,e);test(digits(raw),'numeric',name,'Preencha o campo com dígitos, sem separadores.',at(r,s,e,'Dígitos'));return digits(raw)?BigInt(raw):null;};
  const blank=(r,s,e)=>test(/^ *$/.test(field(r,s,e)),'reserved','Área reservada','A área reservada deve conter brancos.',at(r,s,e,'Brancos'));
  const zeros=(r,s,e)=>test(zero(field(r,s,e)),'reserved-zero','Área reservada','A área reservada deve conter zeros.',at(r,s,e,'Zeros'));
  const doc=(r,s,type)=>test(validDocument(type,field(r,s,s+13)),'document','CPF / CNPJ','Confira o tipo, o alinhamento à direita com zeros e os dígitos verificadores. CNPJ alfanumérico é aceito.',at(r,s,s+13,'CPF/CNPJ válido','notas 26 e 38'));
  if(!records.length){issue('error','empty','Arquivo vazio','Nenhum registro encontrado.');return analysis;}
  if(parsed.bom||parsed.utf8Multibyte){issue('error','encoding','Codificação','BOM ou UTF-8 multibyte detectado. Exporte texto com um byte por posição; a análise posicional foi interrompida.');return analysis;}
  if(records[0].length===240){issue('warning','unsupported-layout','Layout','Arquivo de 240 posições identificado. Este módulo analisa remessa Santander CNAB 400.');return analysis;}
  test(!parsed.endings.includes('CR'),'line-endings','Delimitadores','CRLF e LF são aceitos; confira CR isolado.',{found:parsed.endings.join(', ')},'warning');
  for(const r of records){test(r.length===400,'record-length','Tamanho do registro','Cada registro deve conter 400 bytes, excluindo a quebra de linha.',{...at(r,1,Math.max(1,r.length),'400'),found:String(r.length)});test(!/[\x00-\x1f\x7f]/.test(r.text),'control','Caracteres de controle','Não são permitidos caracteres de controle dentro do registro.',at(r,1,r.length,'Texto posicional'));}
  const h=records[0];
  if(h.text[0]==='0'&&(h.text[1]==='2'||field(h,3,9)==='RETORNO')){issue('warning','return','Tipo de arquivo','Retorno identificado; as regras de remessa não foram executadas.',at(h,2,9,'1REMESSA'));return analysis;}
  test(h.text[0]==='0','header-first','Header inicial','O primeiro registro deve ser tipo 0.',at(h,1,1,'0'));
  if(h.length!==400||h.text[0]!=='0')return analysis;
  test(['033','353'].includes(field(h,77,79)),'bank','Banco do arquivo','O manual admite os códigos 033 e 353.',at(h,77,79,'033 ou 353','Header'));
  if(!['033','353'].includes(field(h,77,79)))return analysis;
  test(field(h,2,9)==='1REMESSA','direction','Tipo de arquivo','O Header deve identificar uma remessa.',at(h,2,9,'1REMESSA'));
  if(field(h,2,9)!=='1REMESSA')return analysis;
  analysis.supported=true;
  test((analysis.recordTypes['0']||0)===1,'header-count','Quantidade de Headers','É esperado um Header por arquivo.',{found:String(analysis.recordTypes['0']||0),expected:'1'});
  test((analysis.recordTypes['9']||0)===1,'trailer-count','Quantidade de Trailers','É esperado um Trailer por arquivo.',{found:String(analysis.recordTypes['9']||0),expected:'1'});
  test(records.at(-1).text[0]==='9','trailer-last','Trailer final','O último registro deve ser tipo 9.',at(records.at(-1),1,1,'9'));
  test(analysis.titleCount>0,'titles','Registros de movimento','O arquivo deve conter ao menos um registro tipo 1.');
  for(const r of records){if(r.length!==400)continue;test(field(r,395,400)===String(r.line).padStart(6,'0'),'sequence','Sequência dos registros','A sequência deve ser contínua, incluindo Header, complementos e Trailer.',at(r,395,400,String(r.line).padStart(6,'0')));if(!TYPES[r.text[0]]){analysis.scopeComplete=false;issue('error','record-type','Tipo de registro','Registro não previsto para a remessa H7800.',at(r,1,1,'0 a 9'));}}
  test(field(h,10,11)==='01'&&field(h,12,26).trim()==='COBRANCA','service','Serviço','O serviço deve ser 01 / COBRANCA.',at(h,10,26,'01COBRANCA'));
  const transmission=field(h,27,46);numeric(h,27,46,'Código de transmissão C400');
  if(ctx.expectedIdentification)test(transmission===ctx.expectedIdentification,'transmission-config','Transmissão × configuração','O código de 20 posições deve corresponder à parametrização fornecida pelo banco.',at(h,27,46,ctx.expectedIdentification,'nota 1'));
  test(Boolean(field(h,47,76).trim()),'beneficiary-name','Nome do beneficiário','Informe o beneficiário no Header.',at(h,47,76,'Nome do beneficiário'));
  zeros(h,101,116);blank(h,352,391);test(empty(field(h,392,394))||digits(field(h,392,394)),'file-sequence','Sequencial do arquivo','O sequencial opcional tem 3 posições numéricas.',at(h,392,394,'3 dígitos ou brancos','nota 32'));
  analysis.generationDate=date6(field(h,95,100));test(Boolean(analysis.generationDate),'generation-date','Data de geração','A geração deve conter uma data real DDMMAA.',at(h,95,100,'DDMMAA'));
  const effectiveDate=ctx.sendDate||analysis.generationDate||ctx.referenceDate;
  if(analysis.generationDate)test(analysis.generationDate<=ctx.referenceDate,'generation-future','Geração × conferência','Confira a geração posterior à data de conferência.',at(h,95,100,'Até '+ctx.referenceDate),'warning');
  let sum=0n,invalid=0,current=null;const seen=new Set(),txids=new Set();
  const accounts=(r,parent=null)=>{
    numeric(r,18,21,'Agência');numeric(r,22,29,'Conta movimento');numeric(r,30,37,'Conta cobrança');
    const indicator=field(r,383,383),complement=field(r,384,385);
    test(indicator===' '||indicator==='I','account-indicator','Identificador da conta','Use I para conta cobrança de 10 posições, ou branco para conta de 8 posições.',at(r,383,383,'I ou branco','nota 2'));
    test(indicator==='I'?/^\d{2}$/.test(complement):complement==='  ','account-complement','Complemento da conta','Conta de 10 posições: as duas últimas posições no complemento. Conta de 8 posições: brancos.',at(r,384,385,indicator==='I'?'2 dígitos':'Brancos','nota 2'));
    if(parent){for(const [s,e] of [[18,37],[383,385]])test(field(r,s,e)===field(parent,s,e),'message-account','Conta da mensagem × título','A mensagem deve manter os dados bancários do título associado.',at(r,s,e,field(parent,s,e)));}
    if(!parent)test(field(r,18,37)===transmission,'account-header','Identificação × Header','Confira a correspondência de agência e contas com o código de transmissão fornecido pelo banco; a composição depende da parametrização.',at(r,18,37,transmission,'notas 1 e 2'),'warning');
    const c=ctx.santanderAccount;
    if(c?.valid){test(field(r,18,21)===c.agency,'agency-config','Agência × configuração','Compare a agência com o cadastro do Sistema, sem concatenar o DV.',at(r,18,21,c.agency));test(field(r,30,37)===c.normalizedAccount.slice(0,8)&&indicator===c.identifier&&complement===c.complement,'account-config','Conta cobrança × configuração','Confira a conta normalizada, o identificador e o complemento.',at(r,30,37,c.normalizedAccount.slice(0,8)+' · I · '+c.complement,'nota 2'));}
  };
  const finish=()=>{if(!current)return;if(['65','66','67'].includes(current.occ)&&current.assets===0)issue('warning','asset-pending','Duplicata','O movimento de duplicata requer conferir o vínculo e a contratação com o banco.',at(current.record,109,110,'Conferir dados do ativo','nota 21'));};
  for(const r of records.slice(1)){
    const type=r.text[0];if(r.length!==400){if(type==='1'){finish();current=null;invalid++;}continue;}
    if(type==='0'){finish();current=null;continue;}
    if(type==='9'){finish();current=null;const qty=numeric(r,2,7,'Quantidade de registros'),total=numeric(r,8,20,'Total dos boletos');test(qty===BigInt(records.length),'trailer-quantity','Quantidade no Trailer','A quantidade deve incluir todos os registros do arquivo.',at(r,2,7,String(records.length),'Trailer'));if(invalid===0)test(total===sum,'trailer-total','Total no Trailer','O total deve corresponder à soma dos valores nominais dos registros tipo 1.',at(r,8,20,money(sum),'Trailer'));else issue('warning','trailer-total-partial','Total no Trailer','Há valores ilegíveis; o confronto financeiro não foi concluído.',at(r,8,20,'Corrigir valores dos movimentos'));zeros(r,21,394);continue;}
    if(type==='1'){
      finish();current={record:r,messages:{},payments:0,assets:0};accounts(r);
      const occ=field(r,109,110),entry=occ==='01',wallet=field(r,108,108),species=field(r,148,149),dueRaw=field(r,121,126),due=date6(dueRaw),emissionRaw=field(r,151,156),emission=date6(emissionRaw),nominal=numeric(r,127,139,'Valor nominal');
      Object.assign(current,{occ,entry,wallet,species,due,nominal});if(nominal===null)invalid++;else sum+=nominal;
      test(MOVEMENTS.has(occ),'movement','Movimento da remessa','Use um movimento previsto na nota 21.',at(r,109,110,[...MOVEMENTS].join(', '),'nota 21'));
      test(WALLETS.has(wallet),'wallet','Tipo de cobrança','A carteira na remessa tem 1 posição. O código da linha digitável não ocupa este campo.',at(r,108,108,[...WALLETS].join(', '),'nota 20'));
      if(ctx.expectedWallet)test(wallet===ctx.expectedWallet,'wallet-config','Carteira × configuração','Compare o tipo de cobrança com o cenário configurado.',at(r,108,108,ctx.expectedWallet));
      if(['15','16','17'].includes(occ)||wallet==='8')issue('warning','cession-contract','Cessão','O processamento depende da contratação SX Integra e da situação do boleto no banco.',at(r,108,110,'Conferir contratação','notas 20 e 21'));
      if(['65','66','67'].includes(occ))test(effectiveDate>='2027-02-06','asset-start','Vigência da duplicata','Não envie as novas operações de duplicata antes de 06/02/2027.',at(r,109,110,'A partir de 06/02/2027','registro tipo 3'));
      const nn=field(r,63,70);numeric(r,63,70,'Nosso número');
      if(entry&&['5','6'].includes(wallet))test(!zero(nn),'our-number-required','Nosso número','Na cobrança rápida com emissão pelo beneficiário, atribua o nosso número.',at(r,63,70,'Nosso número atribuído','nota 3'));
      if(entry&&digits(nn)&&!zero(nn)){const key=field(r,18,37)+field(r,383,385)+wallet+nn;test(!seen.has(key),'duplicate-title','Nosso número duplicado','Uma entrada da mesma conta, carteira e nosso número não deve se repetir no arquivo.',at(r,63,70,'Entrada única'));seen.add(key);}
      if(entry||occ==='06'||!empty(dueRaw))test(Boolean(due),'due-date','Vencimento','Use uma data real DDMMAA; 111111 e 999999 não são aceitos.',at(r,121,126,'DDMMAA','nota 7'));
      if(entry&&due){const max=new Date(effectiveDate+'T00:00:00Z');max.setUTCFullYear(max.getUTCFullYear()+10);test(due>effectiveDate&&due<=max.toISOString().slice(0,10),'due-window','Prazo do vencimento','O vencimento deve ser posterior à entrada e limitado a 10 anos. Usa-se o envio pretendido ou a geração como referência local.',at(r,121,126,'Após '+effectiveDate+' e até '+max.toISOString().slice(0,10),'nota 7'));}
      if(entry||!empty(emissionRaw)){test(Boolean(emission),'issue-date','Data de emissão','Use uma data real DDMMAA.',at(r,151,156,'DDMMAA','nota 9'));if(emission&&due)test(emission<due,'issue-due','Emissão × vencimento','A emissão deve ser anterior ao vencimento.',at(r,151,156,'Anterior a '+due,'nota 9'));}
      if(occ==='47')test(['08','19'].includes(species),'nominal-change-species','Alteração do nominal','A alteração do valor nominal é permitida somente para BDP e BCC.',at(r,148,149,'08 ou 19','nota 10'));
      if(entry){test(SPECIES.has(species),'species','Espécie do boleto','Use uma espécie prevista na nota 24.',at(r,148,149,[...SPECIES].join(', '),'nota 24'));if(nominal!==null)test(nominal>0n||['08','19'].includes(species),'amount-positive','Valor nominal','Somente BDP (08) e BCC (19) permitem registro com valor zerado.',at(r,127,139,'Positivo, exceto BDP/BCC','nota 10'));test(['033','353'].includes(field(r,140,142)),'detail-bank','Banco cobrador','O campo admite 033 ou 353.',at(r,140,142,'033 ou 353'));numeric(r,143,147,'Agência cobradora');if(wallet!=='5')test(field(r,143,147)==='00000','collecting-agency','Agência cobradora','Informe agência cobradora somente na carteira 5; nas demais, zeros.',at(r,143,147,'00000','nota 23'));test(field(r,150,150)==='N','acceptance','Aceite','O layout indica N para não aceite.',at(r,150,150,'N'));doc(r,4,field(r,2,3));doc(r,221,field(r,219,220));
        const issuer=field(r,4,17),payer=field(r,221,234);test(species==='33'||(issuer!==payer&&!(field(r,2,3)==='02'&&field(r,219,220)==='02'&&issuer.slice(0,8)===payer.slice(0,8))),'same-document','Beneficiário × pagador','O documento não deve coincidir, nem a raiz do CNPJ, exceto na espécie 33.',at(r,221,234,'Documento distinto, exceto BDA','nota 26'));
        for(const [s,e,name] of [[235,274,'Nome do pagador'],[275,314,'Endereço'],[315,326,'Bairro'],[335,349,'Cidade']])test(Boolean(field(r,s,e).trim()),'payer-address',name,'Informe o dado obrigatório do pagador.',at(r,s,e,name,'nota 27'));numeric(r,327,334,'CEP');test(STATES.has(field(r,350,351)),'payer-state','UF','Informe uma UF brasileira válida.',at(r,350,351,'UF válida','nota 27'));
      }
      const instructions=[field(r,157,158),field(r,159,160)];
      for(let i=0;i<2;i++)test(INSTRUCTIONS.has(instructions[i]),'instruction','Instrução de cobrança','Confira o código na tabela de instruções Santander.',at(r,157+i*2,158+i*2,[...INSTRUCTIONS].join(', '),'nota 25'));
      const has=n=>instructions.includes(n),baixas=instructions.filter(n=>['02','03','04'].includes(n));test(new Set(baixas).size<=1&&!(has('06')&&has('07')),'instruction-conflict','Instruções incompatíveis','Não combine prazos de baixa distintos, baixa e não baixar, ou protestar e não protestar.',at(r,157,160,'Instruções compatíveis'));
      for(const code of ['02','03'])if(has(code))issue('info','fixed-return-days','Prazo de baixa','Instrução '+code+': baixar após '+(code==='02'?'15':'30')+' dias do vencimento. O campo 392–393 é de protesto.',at(r,157,160,code==='02'?'15 dias':'30 dias','nota 25'));
      if(has('00'))issue('warning','beneficiary-profile','Instruções do convênio','00 pode herdar protesto ou baixa do perfil do beneficiário no banco. Confira o perfil contratado; use 07 para não protestar e 04 para não baixar quando aplicável.',at(r,157,160,'Conferir perfil do beneficiário','nota 13'));
      const days=numeric(r,392,393,'Dias de protesto');if(has('06'))test(days!==null&&days>0n,'protest-days','Prazo de protesto','Informe a quantidade de dias quando a instrução 06 estiver configurada.',at(r,392,393,'01 a 99','nota 28'));else if(days!==null&&days>0n)issue('warning','unused-protest-days','Dias sem protesto','O prazo de 392–393 só é utilizado com a instrução 06.',at(r,392,393,'00 sem instrução 06','nota 28'));
      if(has('06')||occ==='09')test(Boolean(field(r,111,120).trim()),'protest-document','Seu número','O número do documento é essencial para o protesto.',at(r,111,120,'Número do documento','nota 22'));
      const interest=numeric(r,161,173,'Mora diária');if(has('08'))test(interest===0n,'interest-conflict','Não cobrar mora','A instrução 08 deve ser coerente com mora diária zerada.',at(r,161,173,'Zeros','nota 25'));else if(interest!==null&&interest>0n)issue('info','daily-interest','Juros de mora','Valor monetário diário informado em centavos. Não é necessária uma instrução extra para habilitá-lo.',at(r,161,173,money(interest)+' por dia','Registro Movimento'));
      const fine=field(r,78,78),percent=numeric(r,79,82,'Percentual da multa'),fineDateRaw=field(r,102,107),fineDate=date6(fineDateRaw),fineActive=fine==='4';
      test(['0','4',' '].includes(fine),'fine-code','Código da multa','Quando houver multa, use código 4 e percentual. Sem multa, não é exigida sua inclusão.',at(r,78,78,'4 com multa; 0/branco sem multa','nota 4'));
      if(fineActive){test(percent!==null&&percent>0n,'fine-percent','Percentual da multa','O percentual é obrigatório quando o código é 4 (0200 = 2,00%).',at(r,79,82,'Percentual positivo','nota 4'));if(!zero(fineDateRaw)){test(Boolean(fineDate),'fine-date','Data da multa','Informe data real ou zeros para cobrar após o vencimento.',at(r,102,107,'DDMMAA ou 000000','nota 4'));if(fineDate&&due)test(fineDate>due,'fine-start','Início da multa','A data informada deve ser posterior ao vencimento.',at(r,102,107,'Após '+due,'nota 4'));}}
      else test(percent===0n&&empty(fineDateRaw),'fine-inactive','Multa não configurada','Sem código 4, não informe percentual nem data de multa.',at(r,78,107,'Sem percentual/data de multa'));
      if(['08','19'].includes(species))test(interest===0n&&!fineActive&&!has('06')&&occ!=='09','special-species-charges','BDP / BCC','Boleto de Proposta e Cartão de Crédito não admitem juros, multa ou protesto.',at(r,148,173,'Sem juros, multa e protesto','notas 6 e 8'));
      const discount=numeric(r,180,192,'Primeiro desconto'),second=numeric(r,206,218,'Abatimento / segundo desconto'),iof=numeric(r,193,205,'IOF');
      const discountDate=(s,e,value,valueStart=180)=>{const raw=field(r,s,e),date=date6(raw);if(value!==null&&value>0n){test(Boolean(date),'discount-date','Data do desconto','Informe uma data real para o desconto utilizado.',at(r,s,e,'DDMMAA','nota 11'));if(date&&emission&&due)test(date>emission&&date<=due,'discount-window','Prazo do desconto','O desconto deve ser posterior à emissão e até o vencimento.',at(r,s,e,'Após emissão e até vencimento','nota 11'));if(nominal!==null)test(value<nominal,'discount-limit','Valor do desconto','O desconto deve ser menor que o valor nominal.',at(r,valueStart,valueStart+12,'Menor que '+money(nominal),'nota 11'));}else test(empty(raw),'discount-without-value','Data sem desconto','Sem desconto, deixe a data zerada.',at(r,s,e,'Zeros'));return date;};
      const d1=discountDate(174,179,discount),hasSecond=!empty(field(r,71,76));if(hasSecond){const d2=discountDate(71,76,second,206);test(second!==null&&second>0n,'second-discount-value','Segundo desconto','Informe valor positivo para a segunda data de desconto.',at(r,206,218,'Valor positivo','nota 11'));if(d1&&d2)test(d1!==d2,'discount-same-date','Datas dos descontos','Os dois descontos não podem utilizar a mesma data.',at(r,71,76,'Data distinta de '+d1,'nota 11'));}else if(second!==null&&second>0n&&nominal!==null)test(second<nominal&&(discount===null||discount+second<nominal),'abatement-limit','Desconto + abatimento','O abatimento e sua soma com o desconto devem ser menores que o nominal.',at(r,180,218,'Menor que '+money(nominal),'nota 12'));
      if(iof!==null&&iof>0n){if(effectiveDate>='2027-04-01')issue('error','iof-rejected','IOF descontinuado','Após março/2027, o manual prevê rejeição de registros com indicação de IOF.',at(r,193,205,'Zeros','nota 5'));else issue('warning','iof-transition','IOF','A partir de 01/01/2027 o recolhimento será desconsiderado; até março/2027 os registros serão aceitos sem recolhimento.',at(r,193,205,'Conferir vigência','nota 5'));}
      blank(r,77,77);test(field(r,83,84)==='00','currency','Código da moeda','O código da moeda deve ser 00.',at(r,83,84,'00'));zeros(r,85,97);blank(r,98,101);blank(r,352,382);blank(r,386,391);blank(r,394,394);continue;
    }
    if(!TYPES[type]){current=null;continue;}
    if(!current){issue('error','orphan-complement','Complemento sem título','O complemento deve estar associado a um registro tipo 1 anterior.',at(r,1,1,'Após o título'));continue;}
    if(['2','4','5','6','7'].includes(type)){
      accounts(r,current.record);current.messages[type]=(current.messages[type]||0)+1;test(current.messages[type]<=(type==='2'?24:1),'message-count','Quantidade de mensagens','Tipo 2: até 24 registros. Tipos 4 a 7: um registro de cada por título.',at(r,1,1,type==='2'?'Até 24':'1','Especificações técnicas'));
      for(const [s,e] of [[2,17],[38,47],[204,382],[386,394]])blank(r,s,e);
      for(const [s,e] of [[48,49],[100,101],[152,153]])numeric(r,s,e,'Subsequência da mensagem');
      // The manual prints 02 for both the second and third subsequence. Do not invent 03 as a mandatory correction.
      if(field(r,48,49)!=='01'||field(r,100,101)!=='02'||!['02','03'].includes(field(r,152,153)))issue('warning','message-subsequence','Subsequência da mensagem','Confira as subsequências com o banco; a tabela da edição 2.38 repete 02 na terceira mensagem.',at(r,48,153,'01 / 02 / 02 (tabela publicada)'));
    }
    if(type==='8'){
      current.payments++;test(current.payments===1,'payment-count','Complemento de pagamento','Utilize um complemento de pagamento/PIX por título.',at(r,1,1,'1'));const mode=field(r,2,3),count=numeric(r,4,5,'Quantidade de pagamentos'),kind=field(r,6,6);test(['00','01','02','03'].includes(mode),'payment-mode','Tipo de pagamento','Use um domínio previsto na nota 16.',at(r,2,3,'00 a 03','nota 16'));test(count!==null&&count>=1n&&count<=99n,'payment-quantity','Pagamentos possíveis','Informe de 01 a 99 pagamentos.',at(r,4,5,'01 a 99','nota 17'));
      const max=numeric(r,7,19,'Valor máximo'),pmax=numeric(r,20,24,'Percentual máximo'),min=numeric(r,25,37,'Valor mínimo'),pmin=numeric(r,38,42,'Percentual mínimo');
      if(mode==='02'){test(['1','2'].includes(kind),'payment-value-type','Tipo de limite','Use 1 para percentual ou 2 para valor.',at(r,6,6,'1 ou 2','nota 18'));test(kind==='1'?pmin!==null&&pmax!==null&&pmin<=pmax:min!==null&&max!==null&&min<=max,'payment-range','Limites de pagamento','O mínimo não deve ser maior que o máximo.',at(r,7,42,'Mínimo ≤ máximo'));}
      const keyType=field(r,43,43),key=field(r,44,120).trim(),txid=field(r,121,155).trim();
      if(keyType.trim()||key||txid){test(['1','2','3','4','5'].includes(keyType),'pix-key-type','Tipo de chave PIX','Informe um tipo DICT válido.',at(r,43,43,'1 a 5','nota 34'));test(Boolean(key),'pix-key','Chave PIX','Informe a chave cadastrada para o beneficiário.',at(r,44,120,'Chave cadastrada','nota 35'));if(txid){test(/^[A-Za-z0-9]{26,35}$/.test(txid),'pix-txid','TXID','Use 26 a 35 caracteres alfanuméricos, sem espaços internos.',at(r,121,155,'26 a 35 caracteres','nota 37'));test(!txids.has(txid),'pix-txid-duplicate','TXID duplicado','O identificador deve ser único por boleto.',at(r,121,155,'TXID único','nota 37'));txids.add(txid);}issue('warning','pix-registration','Cadastro PIX','A existência e a titularidade da chave e as condições do convênio dependem de confirmação no banco.',at(r,43,155,'Conferir cadastro bancário','notas 34 a 37'));}blank(r,156,394);
    }
    if(type==='3'){
      current.assets++;test(effectiveDate>='2027-02-06','asset-start','Vigência do registro 3','Não envie este registro antes de 06/02/2027.',at(r,1,1,'A partir de 06/02/2027','Registro Ativo financeiro'));test(['01','02'].includes(field(r,2,3)),'asset-type','Tipo do ativo','Use 01 para duplicata ou 02 para recebíveis imobiliários.',at(r,2,3,'01 ou 02','nota 39'));test(['01','02'].includes(field(r,4,5)),'asset-link','Tipo de vinculação','Use 01 para vinculação ou 02 para vinculação com escrituração.',at(r,4,5,'01 ou 02','nota 40'));
      for(const [s,e,name] of [[46,48,'Parcela'],[49,51,'Total de parcelas'],[114,128,'Valor da fatura'],[129,136,'Praça de pagamento']])numeric(r,s,e,name);
      if(field(r,4,5)==='02'){test(Boolean(field(r,54,113).trim()),'asset-invoice','Número da fatura','A fatura é obrigatória para escrituração.',at(r,54,113,'Fatura','nota 43'));test(['01','02'].includes(field(r,52,53)),'asset-duplicate','Tipo de duplicata','Use DM (01) ou DS (02).',at(r,52,53,'01 ou 02','nota 42'));}
      const fiscal=field(r,137,138);if(!empty(fiscal))test(['01','02','03','04','05','06','07'].includes(fiscal),'asset-fiscal-type','Documento fiscal','Use um domínio da nota 47.',at(r,137,138,'01 a 07','nota 47'));
      analysis.scopeComplete=false;issue('warning','asset-contract','Ativo financeiro','Formato básico conferido. O vínculo na registradora, aceite, dados fiscais e a contratação não são verificados localmente.',at(r,2,365,'Confirmar no banco e na registradora','notas 39 a 57'));
    }
  }
  finish();analysis.totalCents=String(sum);analysis.totalComplete=invalid===0;
  issue('info','total','Total nominal',money(sum)+' calculado dos registros tipo 1.',{found:money(sum),expected:'Soma nominal dos movimentos'});
  issue('warning','bank-registration','Cadastro e homologação','A análise local não consulta o perfil do beneficiário nem confirma contratação, existência de conta, cálculo do DV bancário ou aceite da remessa.');return analysis;
}
