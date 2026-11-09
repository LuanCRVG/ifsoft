import {field,digits,date6,money,validISO} from '../cnab-parser.js';
export const MANUAL_URL='https://download.itau.com.br/bankline/layout_cobranca_400bytes_cnab_itau.pdf';
export const reference='Itaú CNAB 400, referência pública Janeiro/2017';
export const ruleset='Itaú CNAB 400 / cobrança registrada';
export const identificationLength=12;
const TYPES={'0':'Header','1':'Título / movimento','2':'Multa','4':'Rateio','5':'E-mail / sacador avalista','9':'Trailer'};
const OCCURRENCES=new Set('01 02 04 05 06 07 08 09 10 11 18 30 31 34 35 37 38 47 49 66 67 68 69 93'.split(' '));
const AMOUNT_REQUIRED=new Set('01 02 04 05 06 07 08 09 10 11 18 34 37 47 93'.split(' '));
const INSTRUCTIONS=new Set('00 02 03 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 37 38 39 40 42 43 44 45 46 47 51 52 53 54 56 57 58 59 61 62 66 67 70 71 72 73 74 75 78 79 80 83 84 86 87 88 89 90 91 92 93 94 95 96 97 98'.split(' '));
const DAYS_INSTRUCTIONS=new Set('09 34 35 39 42 66 67 91 92'.split(' '));
const FIXED_RETURN_DAYS={'02':5,'03':30,'06':10,'07':15,'08':20,'11':25,'12':35,'13':40,'14':45,'15':50,'16':55,'17':60,'18':90,'58':365};
const WALLET_CODES={'104':'I','108':'I','109':'I','112':'I','115':'I','121':'I','147':'E','150':'U','180':'I','188':'I','191':'1'};
const STATES=new Set('AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' '));
const omitted=value=>/^0+$/.test(value)||/^ *$/.test(value);
const amount=value=>digits(value)?BigInt(value):null;
function date8(value){if(!/^\d{8}$/.test(value))return null;const iso=value.slice(4)+'-'+value.slice(2,4)+'-'+value.slice(0,2);return validISO(iso)?iso:null;}
export function validate(ctx){
  const {parsed,add}=ctx,records=parsed.records;
  const titles=records.filter(r=>r.text[0]==='1');
  const analysis={supported:false,scopeComplete:true,titleCount:titles.length,totalCents:'0',totalComplete:false,generationDate:null,recordCount:records.length,recordTypes:{},references:[{title:reference,url:MANUAL_URL}]};
  for(const r of records){const t=r.text[0]||'Vazio';analysis.recordTypes[t]=(analysis.recordTypes[t]||0)+1;}
  const issue=(level,code,name,description,extra={})=>add({level,code,field:name,description,reference,...extra});
  const at=(r,start,end,expected='',note='')=>({line:r.line,recordType:TYPES[r.text[0]]||r.text[0]||'Vazio',start,end,found:field(r,start,end),expected,reference:reference+(note?' · '+note:'')});
  const test=(ok,code,name,description,extra={},failure='error')=>issue(ok?'info':failure,code,name,ok?'Conferência atendida. '+description:description,extra);
  const blanks=(r,s,e)=>test(/^ *$/.test(field(r,s,e)),'reserved','Área reservada','A área reservada do registro deve permanecer em branco.',at(r,s,e,'Brancos','§3.1'));
  const numeric=(r,s,e,name,required=true)=>{const raw=field(r,s,e),ok=digits(raw)||(!required&&/^ *$/.test(raw));test(ok,'numeric',name,'O campo deve conter dígitos nas posições indicadas.',at(r,s,e,required?'Dígitos':'Dígitos ou campo sem alteração'));return digits(raw)?BigInt(raw):null;};
  const account=(r,s,headerId)=>{const id=field(r,s,s+11);test(/^\d{4}00\d{6}$/.test(id),'account-format','Agência / conta / DAC','Agência (4), complemento 00, conta (5) e DAC (1).',at(r,s,s+11,'AAAA00CCCCCD','§3.1'));if(headerId)test(id===headerId,'account-header','Conta × Header','A conta do movimento deve corresponder ao Header.',at(r,s,s+11,headerId));if(ctx.expectedIdentification)test(id===ctx.expectedIdentification,'account-config','Conta × configuração','Os campos bancários devem corresponder à conta informada no Sistema.',at(r,s,s+11,ctx.expectedIdentification));return id;};
  if(!records.length){issue('error','empty','Arquivo vazio','Nenhum registro encontrado.');return analysis;}
  if(parsed.bom||parsed.utf8Multibyte){issue('error','encoding','Codificação','BOM ou UTF-8 multibyte detectado. A leitura posicional foi interrompida; utilize a exportação de texto de um byte por posição do Sistema.');return analysis;}
  if(records[0].length===240){issue('warning','unsupported-layout','Layout','Registro de 240 posições identificado. Esta análise é de remessa Itaú CNAB 400.');return analysis;}
  test(!parsed.endings.includes('CR'),'line-endings','Delimitadores','CRLF e LF são aceitos; CR isolado requer conferência.',{found:parsed.endings.join(', ')},'warning');
  for(const r of records){test(r.length===400,'record-length','Tamanho do registro','São necessários 400 bytes de dados, sem o delimitador de linha.',{...at(r,1,Math.max(1,r.length),'400'),found:String(r.length)});test(!/[\x00-\x1f\x7f]/.test(r.text),'control','Caracteres de controle','Não deve haver caracteres de controle dentro do registro.',at(r,1,Math.max(1,r.length),'Texto de um byte por posição'));}
  const h=records[0];
  if(h.text[0]==='0'&&(h.text[1]==='2'||field(h,3,9)==='RETORNO')){issue('warning','return','Tipo de arquivo','Retorno identificado. As regras de remessa não foram executadas.',at(h,2,9,'1REMESSA'));return analysis;}
  test(h.text[0]==='0','header-first','Header inicial','O primeiro registro deve ser tipo 0.',at(h,1,1,'0'));
  if(h.length!==400||h.text[0]!=='0')return analysis;
  test(field(h,77,79)==='341','bank','Banco do arquivo','O código do banco deve ser 341.',at(h,77,79,'341'));
  if(field(h,77,79)!=='341'){issue('warning','bank-unsupported','Banco do arquivo','O conteúdo não corresponde ao banco selecionado. A análise específica foi interrompida.');return analysis;}
  test(field(h,2,9)==='1REMESSA','direction','Tipo de arquivo','O Header deve identificar uma remessa.',at(h,2,9,'1REMESSA'));if(field(h,2,9)!=='1REMESSA')return analysis;
  const headers=records.filter(r=>r.text[0]==='0'),trailers=records.filter(r=>r.text[0]==='9');
  if(headers.length>1||trailers.length>1){analysis.scopeComplete=false;issue('warning','grouped-accounts','Agrupamento de contas','Múltiplos Headers ou Trailers detectados. O indicador personalizado de agrupamento por conta exige análise específica; a conferência posicional dos títulos foi interrompida.',{reference:reference+' · indicador 04.2'});return analysis;}
  analysis.supported=true;
  test(trailers.length===1,'trailer-count','Trailer','É necessário um Trailer de encerramento.',{found:String(trailers.length),expected:'1'});
  test(records.at(-1).text[0]==='9','trailer-last','Trailer final','O último registro deve ser tipo 9.',at(records.at(-1),1,1,'9'));
  test(titles.length>0,'details','Movimentos','É necessário ao menos um registro tipo 1.',{found:String(titles.length),expected:'Ao menos 1'});
  for(const r of records){if(r.length!==400)continue;test(field(r,395,400)===String(r.line).padStart(6,'0'),'sequence','Sequência de registros','A sequência deve iniciar em 000001 e avançar uma unidade por registro, incluindo o Trailer.',at(r,395,400,String(r.line).padStart(6,'0')));if(!TYPES[r.text[0]]){analysis.scopeComplete=false;issue('warning','unsupported-record','Tipo de registro','Tipo não abrangido pela referência de remessa registrada consultada. Seus campos específicos não foram analisados.',at(r,1,1,'0, 1, 2, 4, 5 ou 9'));}}
  test(field(h,10,11)==='01','service','Código do serviço','O código do serviço de cobrança deve ser 01.',at(h,10,11,'01'));
  test(field(h,12,26)==='COBRANCA'.padEnd(15),'service-name','Nome do serviço','A identificação do serviço deve ser COBRANCA, completada com brancos.',at(h,12,26,'COBRANCA'.padEnd(15)));
  const headerId=account(h,27);blanks(h,39,46);blanks(h,101,394);
  test(Boolean(field(h,47,76).trim()),'company-name','Nome da empresa','Informe o nome da empresa no Header.',at(h,47,76,'Nome da empresa'));
  const generation=date6(field(h,95,100));analysis.generationDate=generation;
  test(Boolean(generation),'generation-date','Data de geração','Informe uma data real DDMMAA.',at(h,95,100,'DDMMAA'));
  if(generation&&ctx.sendDate)test(generation<=ctx.sendDate,'generation-send','Geração × envio','A geração deve ocorrer até a data de envio pretendido.',at(h,95,100,'Até '+ctx.sendDate),'warning');
  if(!ctx.expectedIdentification)issue('warning','config-pending','Conta não informada','A conta será comparada entre Header e movimentos. Preencha o cadastro para comparar também com o Sistema.');
  issue('info','document-reference','Referência documental','Conferência baseada na edição pública Janeiro/2017. A pesquisa não confirmou edição oficial pública mais recente.',{reference:MANUAL_URL});
  let sum=0n,invalidAmounts=0,current=null;const entries=new Set();
  const finishCurrent=()=>{if(current?.occ==='49'&&current.fines===0)issue('warning','fine-change-pending','Alteração da multa','Confira o movimento 49 sem registro de multa correspondente.',at(current.record,109,110,'Registro tipo 2','nota 6'));if(current?.rates&&current.rateCount===0)issue('warning','empty-rate','Rateio sem contas','Os registros de rateio não informam contas de crédito.',at(current.record,1,1,'Contas para rateio'));};
  for(const r of records.slice(1)){
    const type=r.text[0];if(type==='9'){finishCurrent();current=null;if(r.length===400)blanks(r,2,394);continue;}
    if(type==='1'){
      finishCurrent();current={record:r,fines:0,supplements:0,rates:0,rateCount:0,rateTotal:0n,rateMode:null,rateValid:true};
      if(r.length!==400){invalidAmounts++;continue;}
      const id=account(r,18,headerId),wallet=field(r,84,86),occ=field(r,109,110),entry=occ==='01',dueRaw=field(r,121,126),due=date6(dueRaw),nominal=numeric(r,127,139,'Valor nominal',AMOUNT_REQUIRED.has(occ));
      current.wallet=wallet;current.occ=occ;current.due=due;current.nominal=nominal;
      if(nominal===null){if(!/^ *$/.test(field(r,127,139))||AMOUNT_REQUIRED.has(occ))invalidAmounts++;}else sum+=nominal;
      test(OCCURRENCES.has(occ),'occurrence','Código de ocorrência','O movimento deve estar entre os códigos de remessa da referência consultada.',at(r,109,110,'Nota 6'),'warning');
      if(!OCCURRENCES.has(occ))analysis.scopeComplete=false;
      if(AMOUNT_REQUIRED.has(occ)&&nominal!==null)test(nominal>0n,'amount-positive','Valor nominal','O valor nominal deve ser maior que zero para este movimento.',at(r,127,139,'Valor positivo','notas 6 e 8'));
      test(/^\d{3}$/.test(wallet)&&wallet!=='000','wallet','Número da carteira','Informe os 3 dígitos da carteira.',at(r,84,86,'3 dígitos','nota 5'));
      if(WALLET_CODES[wallet])test(field(r,108,108)===WALLET_CODES[wallet],'wallet-code','Código da carteira','O código deve corresponder à carteira informada.',at(r,108,108,WALLET_CODES[wallet],'nota 5'));else issue('warning','wallet-reference','Carteira','Carteira não relacionada na edição consultada; confirmar a referência da contratação.',at(r,84,86,'Carteira contratada'));
      if(ctx.expectedWallet)test(wallet===ctx.expectedWallet,'wallet-config','Carteira × configuração','A carteira deve corresponder ao cadastro do Sistema.',at(r,84,86,ctx.expectedWallet));
      const nn=field(r,63,70);test(digits(nn),'our-number','Nosso número','O nosso número tem 8 posições numéricas, sem DAC neste campo.',at(r,63,70,'8 dígitos','nota 3'));
      if(entry&&wallet==='109')test(nn!=='00000000','our-number-required','Nosso número','Informe o nosso número na entrada da carteira 109.',at(r,63,70,'8 dígitos atribuídos ao título','nota 3'));
      if(entry&&digits(nn)&&nn!=='00000000'){const key=id+wallet+nn;test(!entries.has(key),'duplicate-title','Nosso número duplicado','Uma entrada da mesma conta, carteira e nosso número não deve se repetir no arquivo.',at(r,63,70,'Entrada única','nota 3'));entries.add(key);}
      if(entry||['06','37'].includes(occ)||!omitted(dueRaw))test(Boolean(due),'due-date','Vencimento','O vencimento informado deve ser uma data real DDMMAA.',at(r,121,126,'DDMMAA','nota 7'));
      if(due&&entry){test(due>=ctx.referenceDate,'overdue','Vencimento × conferência','Título vencido requer avaliação das condições de recebimento.',at(r,121,126,'A partir de '+ctx.referenceDate),'warning');if(ctx.sendDate)test(due>=ctx.sendDate,'due-send','Vencimento × envio','Confira títulos com vencimento anterior ao envio pretendido.',at(r,121,126,'A partir de '+ctx.sendDate),'warning');}
      const issuanceRaw=field(r,151,156),issuance=date6(issuanceRaw);
      if(entry||!omitted(issuanceRaw)){test(Boolean(issuance),'issue-date','Data de emissão','A emissão deve conter uma data real DDMMAA.',at(r,151,156,'DDMMAA','nota 31'));if(issuance&&due)test(issuance<=due,'issue-due','Emissão × vencimento','A data de emissão não deve ser posterior ao vencimento.',at(r,151,156,'Até '+due));}
      if(entry){test(field(r,140,142)==='341','detail-bank','Banco do título','O código do banco do título deve ser 341.',at(r,140,142,'341'));test(field(r,143,147)==='00000','collecting-agency','Agência cobradora','O campo deve ser zerado na remessa.',at(r,143,147,'00000','nota 9'));test(['A','N'].includes(field(r,150,150)),'acceptance','Aceite','Informe A ou N conforme as condições do título.',at(r,150,150,'A ou N'));test(Boolean(field(r,111,120).trim()),'document-number','Número do documento','Informe o número de controle do documento de cobrança.',at(r,111,120,'Número do documento'));
        test(['01','02','03','04'].includes(field(r,2,3)),'issuer-type','Inscrição do beneficiário','O tipo de inscrição deve seguir a nota 1.',at(r,2,3,'01, 02, 03 ou 04'));numeric(r,4,17,'Inscrição do beneficiário');
        test(['01','02'].includes(field(r,219,220)),'payer-type','Inscrição do pagador','Informe 01 para CPF ou 02 para CNPJ.',at(r,219,220,'01 ou 02'));numeric(r,221,234,'Inscrição do pagador');
        for(const [s,e,name] of [[235,274,'Nome do pagador'],[275,314,'Logradouro'],[315,326,'Bairro'],[335,349,'Cidade']])test(Boolean(field(r,s,e).trim()),'payer-address',name,'O dado do pagador deve ser informado na entrada.',at(r,s,e,name));
        numeric(r,327,334,'CEP do pagador');test(STATES.has(field(r,350,351)),'payer-state','UF do pagador','Informe uma UF válida.',at(r,350,351,'UF'));
        const species=field(r,148,149);test(/^[A-Z0-9]{2}$/.test(species),'species','Espécie do documento','Informe a espécie nas duas posições do campo.',at(r,148,149,'Espécie do título','nota 10'));if(species==='18'){analysis.scopeComplete=false;issue('warning','proposal-scope','Boleto de proposta','Esta espécie exige layout e condições específicos a confirmar com o banco.',at(r,148,149,'Layout de proposta','nota 10'));}
      }
      const ins=[field(r,157,158),field(r,159,160)].map(x=>x.trim()||'00'),daysRaw=field(r,392,393);
      ins.forEach((v,i)=>{test(/^\d{2}$/.test(v),'instruction-format','Instrução '+(i+1),'Use duas posições numéricas, com 00 quando não utilizada.',at(r,157+i*2,158+i*2,'Código de 2 dígitos'));if(/^\d{2}$/.test(v)&&!INSTRUCTIONS.has(v))issue('warning','instruction-reference','Instrução de cobrança','Código não localizado na nota 11 da edição consultada.',at(r,157+i*2,158+i*2,'Nota 11'));});
      const extraArea=field(r,352,394),extraDiscounts=!ins.includes('93')&&!ins.includes('94')&&/^ {2}\d{38} {3}$/.test(extraArea)&&(amount(field(r,360,372))>0n||amount(field(r,379,391))>0n);current.hasExtraDiscounts=extraDiscounts;
      if(extraDiscounts){issue('warning','extra-discount-contract','Descontos adicionais','Formato de descontos adicionais identificado. Confirme a habilitação do indicador contratual 19.0.',at(r,352,394,'Indicador 19.0 habilitado','nota 16'));for(const [ds,de,vs,ve] of [[354,359,360,372],[373,378,379,391]]){const v=amount(field(r,vs,ve)),rawDate=field(r,ds,de);if(v>0n||!omitted(rawDate)){test(Boolean(date6(rawDate)),'extra-discount-date','Data de desconto adicional','O desconto adicional preenchido requer data real.',at(r,ds,de,'DDMMAA','nota 16'));test(v!==null&&v>0n,'extra-discount-value','Valor de desconto adicional','Informe valor positivo para a data adicional.',at(r,vs,ve,'Valor positivo','nota 16'));if(v!==null&&nominal!==null&&nominal>0n)test(v*100n<=nominal*90n,'extra-discount-limit','Limite do desconto adicional','Cada desconto adicional deve respeitar o limite de 90% do valor nominal.',at(r,vs,ve,'Até 90%','notas 13 e 16'));}}}
      const daysUsed=ins.some(x=>DAYS_INSTRUCTIONS.has(x))||['09','11','66'].includes(occ);
      if(daysUsed&&!extraDiscounts){test(digits(daysRaw),'days','Prazo da instrução','O prazo usa as posições 392–393; 00 pode representar o padrão previsto para a instrução.',at(r,392,393,'2 dígitos','notas 6 e 11'));if((ins.includes('92')||ins.includes('91'))&&daysRaw==='00')issue('warning','return-days','Prazo para devolução / recebimento','Foi informado prazo 00 para instrução de prazo variável; confirme a intenção de recebimento ou devolução no vencimento.',at(r,392,393,'Prazo pretendido','nota 11'));}
      const fixed=ins.filter(x=>FIXED_RETURN_DAYS[x]);if(fixed.length)issue('info','fixed-return-days','Devolução programada','Prazo definido pela própria instrução: '+fixed.map(x=>x+' = '+FIXED_RETURN_DAYS[x]+' dias').join('; ')+'.',at(r,157,160,'Nota 11'));
      const protest=ins.some(x=>['09','34','35','42'].includes(x)),negative=ins.includes('66');test(!(protest&&negative),'instruction-conflict','Instruções de cobrança','Não combine protesto e negativação no mesmo registro de entrada.',at(r,157,160,'Uma modalidade','nota 11 (A)'));
      const interest=numeric(r,161,173,'Juros monetários diários',entry),interestDateRaw=field(r,386,391),message94=ins.includes('94');
      if(!message94&&!extraDiscounts&&!omitted(interestDateRaw))test(Boolean(date6(interestDateRaw)),'interest-date','Data de mora','A data de início da mora deve ser real DDMMAA.',at(r,386,391,'DDMMAA','nota 11 (F)'));
      if(ins.includes('44')&&extraDiscounts)issue('warning','interest-discount-overlap','Data de mora × descontos adicionais','As áreas se sobrepõem; confirme a forma contratada para transmitir essas condições.',at(r,352,394,'Condição contratual','nota 16'));
      if(ins.includes('44')&&!extraDiscounts){test(interest!==null&&interest>0n,'interest-required','Juros da instrução 44','A instrução 44 exige valor monetário diário positivo.',at(r,161,173,'Valor diário positivo','nota 11 (F)'));test(Boolean(date6(interestDateRaw)),'interest-start','Início da instrução 44','A instrução 44 exige data de início.',at(r,386,391,'DDMMAA','nota 11 (F)'));}
      if(ins.includes('47')&&interest!==null&&interest>0n)issue('warning','interest-conflict','Dispensa de juros','Há valor diário informado e instrução de dispensa de juros; conferir a intenção do título.',at(r,157,173,'Condições coerentes'));
      const discount=numeric(r,180,192,'Valor do desconto',entry),abatement=numeric(r,206,218,'Valor do abatimento',entry);numeric(r,193,205,'Valor do IOF',entry);
      const discountRaw=field(r,174,179),discountDate=date6(discountRaw);
      if(discount!==null&&discount>0n){if(!ins.includes('30'))test(Boolean(discountDate),'discount-date','Data do desconto','O desconto informado requer data limite real.',at(r,174,179,'DDMMAA','nota 13'));if(nominal!==null&&nominal>0n)test(discount*100n<=nominal*90n,'discount-limit','Limite do desconto','O desconto não deve ultrapassar 90% do valor de entrada.',at(r,180,192,'Até 90% do nominal','nota 13'));if(discountDate&&due&&discountDate>due&&!ins.includes('38'))issue('warning','discount-due','Desconto após vencimento','Confira a data limite do desconto em relação ao vencimento.',at(r,174,179,'Condição negociada'));}
      else if(!omitted(discountRaw))test(Boolean(discountDate),'discount-date','Data do desconto','A data de desconto preenchida deve ser real.',at(r,174,179,'DDMMAA'));
      if(abatement!==null&&nominal!==null&&nominal>0n)test(abatement<=nominal,'abatement-limit','Abatimento','O abatimento não deve superar o valor nominal.',at(r,206,218,'Até o nominal'));
      if(['04','05'].includes(occ))test(abatement!==null&&abatement>0n,'abatement-required','Abatimento do movimento','Este movimento requer o valor do abatimento.',at(r,206,218,'Valor positivo','nota 6'));
      const canceled=field(r,34,37);if(['35','38'].includes(occ))test(digits(canceled)&&canceled!=='0000','canceled-instruction','Instrução / alegação cancelada','Informe o código a cancelar ou a alegação contestada.',at(r,34,37,'Código de 4 dígitos','nota 27'));else if(!omitted(canceled))issue('warning','canceled-unused','Instrução / alegação cancelada','Esse campo deve ser zerado quando a ocorrência não é 35 ou 38.',at(r,34,37,'0000','nota 27'));
      blanks(r,30,33);if(!message94&&!extraDiscounts)blanks(r,382,385);blanks(r,394,394);
      continue;
    }
    if(!['2','4','5'].includes(type)){if(type!=='0')current=null;continue;}
    if(!current||current.record.length!==400){issue('error','orphan-complement','Registro complementar','O complemento deve pertencer a um registro tipo 1 anterior, sem Header ou Trailer intermediário.',at(r,1,1,'Título tipo 1 anterior'));continue;}
    if(r.length!==400)continue;
    const parent=current.record;
    if(type==='2'){
      current.fines++;test(current.fines===1,'duplicate-fine','Registro de multa','Só é permitido um registro tipo 2 por título.',at(r,1,1,'Um tipo 2','§3.1'));
      const code=field(r,2,2),raw=field(r,11,23),fine=amount(raw);test(['0','1','2'].includes(code),'fine-code','Código da multa','Use 0 para não registrar, 1 para valor fixo ou 2 para percentual.',at(r,2,2,'0, 1 ou 2','nota 35'));
      if(code==='1'||code==='2'){const starts=date8(field(r,3,10));test(Boolean(starts),'fine-date','Data da multa','A multa usa data DDMMAAAA.',at(r,3,10,'DDMMAAAA','nota 35'));if(starts&&current.due)test(starts>=current.due,'fine-start','Início da multa','A multa deve iniciar na data de vencimento ou depois.',at(r,3,10,'A partir de '+current.due,'nota 35'));if(!current.due)issue('warning','fine-due-pending','Multa × vencimento','Não foi possível comparar a data da multa sem vencimento legível no movimento.',at(parent,121,126,'Vencimento para comparação'));
        test(fine!==null&&fine>0n,'fine-value','Valor / percentual da multa','Informe 13 dígitos, com duas casas implícitas e valor positivo.',at(r,11,23,'Valor positivo','nota 35'));if(fine!==null){if(code==='2')test(fine<10000n,'fine-limit','Limite percentual da multa','O percentual deve ser menor que 100%.',at(r,11,23,'Menos de 100,00%','nota 35'));else if(current.nominal!==null&&current.nominal>0n)test(fine<current.nominal,'fine-limit','Limite da multa fixa','A multa fixa deve ser menor que o valor nominal.',at(r,11,23,'Menor que o nominal','nota 35'));else issue('warning','fine-nominal-pending','Limite da multa fixa','O limite da multa depende do valor nominal registrado; ele não foi informado neste movimento.',at(r,11,23,'Valor nominal para comparação'));}}
      else if(code==='0'&&(!omitted(field(r,3,10))||!omitted(raw)))issue('warning','fine-disabled','Multa desativada','O código 0 desativa a multa; confira os campos preenchidos nesse complemento.',at(r,2,23,'Sem multa','nota 35'));
      blanks(r,24,394);
    }
    if(type==='5'){
      current.supplements++;test(current.supplements===1,'duplicate-email','Complemento de dados','Confira duplicidade de complemento e-mail / sacador por título.',at(r,1,1,'Um complemento'),'warning');
      const email=field(r,2,121).trim();if(email)test(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),'email','E-mail do pagador','Confira o formato do endereço eletrônico.',at(r,2,121,'Endereço de e-mail','nota 29'),'warning');
      const kind=field(r,122,123);test(['00','01','02'].includes(kind),'guarantor-type','Inscrição do sacador','Informe 00, 01 ou 02 conforme a existência e tipo de inscrição.',at(r,122,123,'00, 01 ou 02','nota 30'));numeric(r,124,137,'Inscrição do sacador');
      if(kind==='00')test(/^0+$/.test(field(r,124,137)),'guarantor-absent','Sacador não informado','Sem sacador, a inscrição deve ser zerada.',at(r,124,137,'Zeros','nota 30'));
      else if(['01','02'].includes(kind)){for(const [s,e,name] of [[138,177,'Logradouro do sacador'],[178,189,'Bairro do sacador'],[198,212,'Cidade do sacador']])test(Boolean(field(r,s,e).trim()),'guarantor-address',name,'Informe os dados do sacador quando ele existir.',at(r,s,e,name,'nota 30'));numeric(r,190,197,'CEP do sacador');test(STATES.has(field(r,213,214)),'guarantor-state','UF do sacador','Informe uma UF válida.',at(r,213,214,'UF','nota 30'));}blanks(r,215,394);
    }
    if(type==='4'){
      numeric(r,41,41,'DAC do nosso número no rateio');
      current.rates++;test(current.rates<=3,'rate-count','Registros de rateio','São permitidos até 3 registros de rateio por título.',at(r,1,1,'Até 3','§3.1'));
      test(field(r,18,29)===field(parent,18,29)&&field(r,30,32)===current.wallet&&field(r,33,40)===field(parent,63,70),'rate-parent','Rateio × título','Agência, conta, carteira e nosso número devem corresponder ao título.',at(r,18,40,'Dados do título','§3.1'));
      test(field(r,42,43)===String(current.rates).padStart(2,'0'),'rate-sequence','Sequência do rateio','A sequência dos complementos de rateio do título deve ser contínua.',at(r,42,43,String(current.rates).padStart(2,'0')));
      const mode=field(r,394,394);test(['1','2','3','4'].includes(mode),'rate-mode','Tipo do rateio','Informe o tipo do rateio por percentual ou valor.',at(r,394,394,'1, 2, 3 ou 4','nota 32'));if(current.rateMode!==null&&mode!==current.rateMode){current.rateValid=false;issue('error','rate-mode-mismatch','Tipo do rateio','Os registros de um mesmo título devem usar o mesmo tipo de valor.',at(r,394,394,current.rateMode));}current.rateMode=mode;
      for(let i=0;i<14;i++){const s=44+i*25,chunk=field(r,s,s+24);if(omitted(chunk)||/^ *$/.test(chunk))continue;current.rateCount++;test(/^\d{25}$/.test(chunk),'rate-format','Conta de crédito do rateio','Agência, conta, DAC e valor do rateio devem ser numéricos.',at(r,s,s+24,'25 dígitos'));const v=amount(field(r,s+12,s+24));if(v===null)current.rateValid=false;else current.rateTotal+=v;test(field(r,s,s+11)!==field(parent,18,21)+'00'+field(parent,24,29),'rate-beneficiary','Conta de crédito do rateio','A própria conta do beneficiário não pode ser destinatária do rateio.',at(r,s,s+11,'Outra conta','§3.1'));}
      if(current.nominal!==null&&['1','2'].includes(mode)&&current.rateValid){const limit=mode==='1'?100000n:current.nominal;test(current.rateTotal<=limit,'rate-total','Total do rateio','O total do rateio não deve superar a base nominal ou 100% do título.',at(r,44,393,mode==='1'?'Até 100,000%':money(current.nominal),'nota 32'));}
      if(mode==='3'||mode==='4')issue('warning','rate-net-pending','Rateio sobre valor líquido','A base líquida final depende do recebimento. A conferência limita-se ao formato e à vinculação ao título.',at(r,394,394,'Conferência no retorno','nota 32'));
      test(current.rateCount<=30,'rate-accounts','Contas do rateio','São permitidas até 30 contas de crédito por título.',at(r,44,393,'Até 30','§3.1'));
      if(current.hasExtraDiscounts||amount(field(parent,180,192))>0n||amount(field(parent,206,218))>0n)issue('error','rate-discount','Rateio × desconto / abatimento','Títulos com rateio não devem conter desconto ou abatimento.',at(parent,180,218,'Sem desconto ou abatimento','§3.1'));
    }
  }
  finishCurrent();analysis.totalCents=sum.toString();analysis.totalComplete=invalidAmounts===0;
  issue(analysis.totalComplete?'info':'warning','nominal-total','Soma dos valores nominais','Soma '+(analysis.totalComplete?'':'parcial ')+money(sum)+' dos registros tipo 1. O Trailer de remessa Itaú não contém total financeiro para confronto.',{found:money(sum),expected:'Total calculado a partir dos movimentos',reference:reference+' · §3.1, Trailer'});
  return analysis;
}
