import {makeItauDemo} from './banks/itau-demo.js';
import {setupItauConfiguration} from './ui/itau-config-ui.js';
import {banks,getBank} from './bank-registry.js';
import {localToday,money,MAX_BYTES} from './cnab-parser.js';
import {reportJSON,reportPDF,download} from './report-generator.js';
import {makeDemo} from './demo.js';
const $=id=>document.getElementById(id);
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=name=>'<svg aria-hidden="true"><use href="#'+name+'"/></svg>';
const labels={dashboard:'Dashboard',config:'Configuração Bancária',validator:'Validador de Remessa',reports:'Relatórios',banks:'Bancos Disponíveis'};
const levels={error:'Erro',warning:'Aviso',info:'Informação'};
let activeWorker=null;
let result=null,bytes=null,fileName='',configuration=null,filter='issues',pageIndex=0,runId=0,toastTimer=null,busy=false;
const mobileQuery=window.matchMedia('(max-width:650px)');
function setMenu(open){$('sidebar').classList.toggle('open',open);$('sidebar').inert=mobileQuery.matches&&!open;$('menuToggle').setAttribute('aria-expanded',String(open));}
mobileQuery.addEventListener('change',()=>setMenu(false));
const safraConfiguration=await getBank('422').loadConfiguration();
const composeIdentification=safraConfiguration.composeIdentification;
const itauView=setupItauConfiguration(toast,()=>{updateConfigLabel();if(result&&$('bankSelect').value==='341')status('Dados bancários alterados. Use Conferir novamente para atualizar a comparação.','warning');});
function applyConfigurationDefaults(bankCode){
  const defaults=bankCode==='422'?safraConfiguration.defaults:{};
  for(const name of ['agencyDv','wallet']){$(name).defaultValue=defaults[name]??'';$(name).value=defaults[name]??'';}
}
try {document.documentElement.dataset.theme=localStorage.getItem('cnab-theme')||'light';}catch{}
const portalUrl=document.body.dataset.portalUrl;
if(portalUrl){$('portalReturn').href=portalUrl;$('portalReturn').hidden=false;$('workspaceLabel').hidden=true;}
$('referenceDate').value=localToday();$('todayLabel').textContent=localToday();
$('bankSelect').innerHTML=banks.map(b=>'<option value="'+b.code+'">'+b.code+' · '+b.name+(b.implemented?'':' · Em breve')+'</option>').join('');
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4500);}
function navigate(page){if(!labels[page])page='dashboard';for(const key of Object.keys(labels))$('page-'+key).hidden=key!==page;document.querySelectorAll('.nav-item').forEach(b=>{b.classList.toggle('active',b.dataset.page===page);if(b.dataset.page===page)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});$('breadcrumb').textContent=labels[page];setMenu(false);if(location.hash!=='#'+page)history.replaceState(null,'','#'+page);window.scrollTo({top:0});}
function status(text,kind='info'){const el=$('fileStatus');el.textContent=text;el.className='notice '+kind;el.hidden=!text;}
function setBusy(value){busy=value;$('dropzone').classList.toggle('busy',value);$('chooseFile').disabled=value||!getBank($('bankSelect').value).implemented;$('rerun').disabled=value;}
function options(){const itau=$('bankSelect').value==='341'?itauView.getConfiguration():null;return {bank:$('bankSelect').value,layout:$('layoutSelect').value,referenceDate:$('referenceDate').value,sendDate:$('sendDate').value,expectedIdentification:itau?(itau.valid?itau.remittanceSegment:''):(configuration?.identification||''),expectedWallet:itau?.valid?itau.wallet:'',fileName};}
function runInWorker(data,opts){
  if(activeWorker)activeWorker.terminate();
  return new Promise((resolve,reject)=>{const worker=typeof window.CNABWorkerFactory==='function'?window.CNABWorkerFactory():new Worker(new URL('./validation-worker.js',import.meta.url),{type:'module'});activeWorker=worker;worker.onmessage=event=>{worker.terminate();if(activeWorker===worker)activeWorker=null;event.data.error?reject(new Error(event.data.error)):resolve(event.data.result);};worker.onerror=()=>{worker.terminate();if(activeWorker===worker)activeWorker=null;reject(new Error('O processo de análise não pôde iniciar. Execute por HTTP local ou GitHub Pages e verifique os arquivos do projeto.'));};worker.postMessage({bytes:data,options:opts});});
}
async function analyze(){
  if(!bytes)return;const token=++runId;setBusy(true);status('Analisando localmente…');
  await new Promise(resolve=>setTimeout(resolve,30));
  try {const next=await runInWorker(bytes,options());if(token!==runId)return;result=next;filter='issues';pageIndex=0;$('searchOccurrences').value='';renderResult();renderDashboard();renderReports();status('Leitura concluída. O arquivo original foi preservado.', 'info');}
  catch(error){if(token===runId)status(error.message,'error');}
  finally {if(token===runId)setBusy(false);}
}
async function readFile(file){
  if(busy)return;
  if(!getBank($('bankSelect').value).implemented){status('Este banco ainda não possui módulo de validação.','warning');return;}
  if(!/\.(rem|txt|ret)$/i.test(file.name)){status('Selecione um arquivo .rem, .txt ou .ret. O conteúdo determina se é remessa ou retorno.','error');return;}
  if(file.size>MAX_BYTES){status('O limite é 5 MiB. Nenhum conteúdo foi lido.','error');return;}
  const token=++runId;setBusy(true);navigate('validator');status('Lendo arquivo no navegador…');
  try {const data=new Uint8Array(await file.arrayBuffer());if(token!==runId)return;bytes=data;fileName=file.name;setBusy(false);await analyze();}
  catch(error){if(token===runId){setBusy(false);status('Não foi possível ler o arquivo: '+error.message,'error');}}
}
function metric(label,value,hint,ico){return '<div class="metric card"><span>'+icon(ico)+escape(label)+'</span><strong>'+escape(value)+'</strong><small>'+escape(hint)+'</small></div>';}
function renderDashboard(){
  $('dashTitles').textContent=result?.supported?String(result.titleCount):'—';$('dashTotal').textContent=result?.supported?money(result.totalCents):'—';$('dashErrors').textContent=result?String(result.summary.errors):'—';$('dashPassed').textContent=result?String(result.summary.passed):'—';
  $('dashTotalHint').textContent=result&&!result.totalComplete?'Soma parcial: há valores não legíveis':'Soma nominal da remessa';
  $('sessionCaption').textContent=result?'Resultados do arquivo atual':'Aguardando a primeira análise';
  $('lastAnalysis').innerHTML=result?'<span class="empty-icon">'+icon('file')+'</span><div><strong>'+escape(result.fileName)+'</strong><p>'+escape(result.bank.name)+' · '+result.recordCount+' registros · '+result.summary.errors+' erros · '+result.summary.warnings+' avisos'+(result.supported?'':' · Fora do escopo')+'</p><button class="text-link" data-page="validator">Ver diagnóstico '+icon('arrow')+'</button></div>':'<span class="empty-icon">'+icon('file')+'</span><div><strong>Seu próximo diagnóstico começa aqui</strong><p>Nenhuma remessa foi carregada. Selecione um arquivo ou explore o exemplo sintético.</p><button class="text-link" data-action="demo">Explorar exemplo sintético '+icon('arrow')+'</button></div>';
}
function renderResult(){
  $('results').hidden=!result;if(!result)return;
  $('resultFileName').textContent=result.fileName;
  $('resultMeta').textContent=result.bank.name+' ('+result.bank.code+') · CNAB '+result.layout+' · '+result.recordCount+' registros · '+result.encoding+' · Geração: '+(result.generationDate||'Não identificada')+' · Conferência: '+result.referenceDate+' · Envio: '+(result.sendDate||'Não informado');
  const conclusion=$('analysisConclusion');
  conclusion.className='notice '+(!result.supported?'warning':result.summary.errors?'error':result.summary.warnings?'warning':'success');
  conclusion.textContent=!result.supported?'Análise de remessa não concluída: arquivo fora do escopo ou Header não reconhecido. Veja as ocorrências.':result.summary.errors?result.summary.errors+' divergência(s) encontrada(s) nas regras conferidas. Revise as posições indicadas antes do envio.':'Nenhuma divergência nas regras conferidas. Há '+result.summary.warnings+' pendência(s) ou aviso(s); a conferência é parcial e não garante aceite bancário.';
  $('resultMetrics').innerHTML=metric('Títulos tipo 1',result.supported?result.titleCount:'—',result.supported?'Total '+(result.totalComplete?'':'parcial ')+money(result.totalCents):'Total não apurado','file')+metric('Conferências',result.summary.checks,'Verificações executadas','code')+metric('Erros',result.summary.errors,'Divergências confirmadas','alert')+metric('Avisos',result.summary.warnings,'Pendências para conferir','info')+metric('Atendidas',result.summary.passed,'Verificações sem divergência','check');
  renderOccurrences();
}
function renderOccurrences(){
  if(!result)return;
  const query=$('searchOccurrences').value.toLocaleLowerCase('pt-BR');
  const checks=result.checks.filter(c=>(filter==='all'||filter==='issues'&&c.level!=='info'||filter===c.level) && [c.field,c.description,c.line,c.code,c.reference,c.found,c.expected].join(' ').toLocaleLowerCase('pt-BR').includes(query));
  const pages=Math.max(1,Math.ceil(checks.length/30));pageIndex=Math.min(pageIndex,pages-1);
  document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
  $('occurrenceCount').textContent=checks.length+' ocorrência(s) neste filtro · '+result.summary.checks+' conferências no total';
  $('occurrencePage').textContent='Página '+(pageIndex+1)+' de '+pages;$('previousOccurrences').disabled=pageIndex===0;$('nextOccurrences').disabled=pageIndex===pages-1;
  $('occurrenceRows').innerHTML=checks.slice(pageIndex*30,(pageIndex+1)*30).map(c=>'<tr><td><span class="badge '+(c.level==='info'?'success':c.level)+'">'+levels[c.level]+'</span><strong>'+escape(c.field)+'</strong></td><td>'+escape(c.line??'—')+' · '+escape(c.recordType)+'</td><td>'+escape(c.start?c.start+'–'+c.end:'—')+'</td><td><p>'+escape(c.description)+'</p><details><summary>Valores e referência</summary><div>Encontrado: <code>'+escape(c.found||'(não informado)')+'</code><br>Esperado: <code>'+escape(c.expected||'(não aplicável)')+'</code><br>'+escape(c.reference)+'</div></details></td><td><button class="inspect-button" data-inspect="'+c.id+'" '+(!c.line?'disabled':'')+' aria-label="Inspecionar '+escape(c.field)+' na linha '+escape(c.line??'')+'">'+icon('code')+'</button></td></tr>').join('')||'<tr><td colspan="5"><p>Nenhuma ocorrência corresponde ao filtro selecionado.</p></td></tr>';
}
function renderReports(){
  $('reportsContent').innerHTML=!result?'<div class="card report-empty"><span class="upload-icon">'+icon('chart')+'</span><h2>Um relatório começa com uma análise.</h2><p>Carregue uma remessa para gerar um documento com posições, valores e referências.</p><button class="button primary" data-page="validator">Ir para o validador '+icon('arrow')+'</button></div>':'<div class="card report-hero"><span class="upload-icon">'+icon('file')+'</span><div><h2>'+escape(result.fileName)+'</h2><p>'+escape(result.bank.name)+' · CNAB '+result.layout+' · '+result.summary.errors+' erros e '+result.summary.warnings+' avisos<br>Análise: '+escape(new Date(result.analyzedAt).toLocaleString('pt-BR'))+'</p></div></div><div class="report-grid"><section class="card report-card">'+icon('chart')+'<h2>Relatório técnico em PDF</h2><p>Resumo da análise, erros, avisos, posições, valores e referências. Documento paginado, gerado inteiramente no navegador.</p><button class="button primary" data-action="pdf">Baixar PDF '+icon('arrow')+'</button></section><section class="card report-card">'+icon('code')+'<h2>Dados estruturados em JSON</h2><p>Resultados de todas as verificações para análise técnica. Inclui as ocorrências, sem copiar os registros brutos completos.</p><button class="button secondary" data-action="json">Exportar JSON '+icon('arrow')+'</button></section></div><div class="notice warning">A exportação é uma ação sua e pode conter identificadores bancários nos campos encontrados. Confira o conteúdo antes de compartilhar. O aplicativo não envia o relatório.</div>';
}
function renderBanks(){
  $('bankGrid').innerHTML=banks.map(b=>'<section class="card bank-card"><div class="bank-card-top"><span class="'+(b.configurable?'bank-logo small':'bank-monogram')+'">'+escape(b.short[0])+'</span><span class="badge '+(b.implemented?'success':'neutral')+'">'+(b.implemented?'Disponível':'Em breve')+'</span></div><h2>'+escape(b.name)+'</h2><p>Código '+b.code+' · '+(b.implemented?'Remessa CNAB 400':'Módulo ainda não implementado')+'</p><button class="text-link" data-bank="'+b.code+'" '+(!b.configurable?'disabled':'')+'>'+(b.configurable?'Configurar este banco '+icon('arrow'):'Validação indisponível')+'</button></section>').join('');
}
function updateConfigLabel(){
  const c=$('bankSelect').value==='341'?itauView.getConfiguration():null;
  $('expectedLabel').textContent=c?(c.valid?'Agência '+c.agency+' · Conta '+c.account+'-'+c.accountDv:'Conta ainda não configurada'):configuration?'Identificação: '+configuration.identification:'Conta ainda não configurada';
}
function updateBankContext(){
  const bank=getBank($('bankSelect').value);
  $('dashboardBankBadge').textContent=bank.short+' · CNAB 400';$('dashboardBankLogo').textContent=bank.short[0];$('dashboardBankName').textContent=bank.name;$('dashboardBankCode').textContent=bank.code;$('dashboardBankScope').textContent=bank.implemented?'Remessa CNAB 400 · Regras e referências documentadas.':'Módulo em desenvolvimento.';
}
function bankChanged(){
  applyConfigurationDefaults($('bankSelect').value);
  $('configurationResult').innerHTML='<div class="identification-value">————— ———————— —</div><p>Preencha os campos e confira a composição.</p>';
  activeWorker?.terminate();activeWorker=null;
  const bank=getBank($('bankSelect').value),enabled=bank.implemented,configured=Boolean(bank.configurable);
  runId++;bytes=null;result=null;fileName='';configuration=null;$('results').hidden=true;
  $('configContent').hidden=bank.code!=='422';$('itauConfigContent').hidden=bank.code!=='341';$('configUnavailable').hidden=configured;
  $('bankAvailability').textContent=enabled?'Disponível':'Em breve';$('bankAvailability').className='badge '+(enabled?'success':'neutral');
  $('layoutSelect').disabled=!configured;for(const id of ['referenceDate','sendDate'])$(id).disabled=!enabled;
  $('selectedLayoutLabel').textContent=configured?'CNAB 400':'Em breve';document.querySelector('.validator-context .bank-logo').textContent=bank.short[0];$('selectedBankLabel').textContent=bank.name+' · '+bank.code;
  $('chooseFile').disabled=!enabled;$('dropzone').hidden=!enabled;$('fileInput').value='';$('copyConfig').disabled=true;$('copyBeneficiary').disabled=true;
  setBusy(false);updateConfigLabel();if(enabled)updateBeneficiary(false);renderDashboard();renderReports();
  status(enabled?'':'Este banco ainda não possui regras de configuração ou validação.','warning');updateBankContext();
}
function updateBeneficiary(showIssues=false){
  if($('bankSelect').value!=='422')return;
  const composed=composeIdentification(Object.fromEntries(new FormData($('configForm'))));
  $('bankWallet').textContent=composed.walletERP||'Mapeamento pendente';$('copyBankConfig').disabled=!composed.walletERP;
  $('account').value=composed.account;$('accountDv').value=composed.accountDv;$('beneficiary').value=composed.identification;
  configuration=composed.identificationValid?composed:null;updateConfigLabel();$('copyConfig').disabled=!composed.valid;$('copyBeneficiary').disabled=!composed.identificationValid;
  const row=(name,value)=>'<dt>'+escape(name)+'</dt><dd>'+escape(value||'—')+'</dd>';
  const issues=showIssues?[...composed.issues,...composed.warnings]:[];
  const messages=issues.length?'<ul>'+issues.map(s=>'<li>'+escape(s)+'</li>').join('')+'</ul>':'';
  if(!composed.identificationValid){$('configurationResult').innerHTML='<p>Informe a agência com 5 dígitos e a conta completa com 9 dígitos. A identificação será calculada automaticamente.</p><p>Agência: '+$('agency').value.length+'/5 posições · Conta com DV: '+$('accountWithDv').value.length+'/9 posições.</p>'+messages;return;}
  $('configurationResult').innerHTML='<h3>CADASTRO DA CONTA CORRENTE</h3><dl class="erp-fields">'+row('Agência',composed.agency)+row('Dígito da agência',composed.agencyDv)+row('Conta corrente',composed.account)+row('Dígito da conta',composed.accountDv)+row('Código do cedente',composed.identification)+'</dl>'+messages+'<h3>Identificação na remessa CNAB 400</h3><div class="identification-value">'+escape(composed.identification)+'</div><div class="composition-parts"><div><code>'+escape(composed.agency)+'</code>Agência completa · 5</div><div><code>'+escape(composed.accountWithDv)+'</code>Conta com DV · 9</div></div><p class="composition-formula">'+escape(composed.agency)+' + '+escape(composed.accountWithDv)+' = '+escape(composed.identification)+'</p><p>Composição estrutural de 14 posições conferida. O dígito da agência ('+escape(composed.agencyDv||'não informado')+') fica somente no cadastro do Sistema.</p><p>Header: posições 027–040. Detalhe tipo 1: posições 018–031.</p>';
}
function checkConfiguration(event){event.preventDefault();updateBeneficiary(true);}
function useConfigurationExample(){
  const example=safraConfiguration.emailExample;$('agency').value=example.agency;$('accountWithDv').value=example.accountWithDv;applyConfigurationDefaults('422');$('wallet').value=example.wallet;updateBeneficiary(true);toast('Dados fictícios de demonstração preenchidos.');if(result)status('A configuração foi alterada. Use Conferir novamente para atualizar a comparação.','warning');
}
async function copyBankConfiguration(){const bank=safraConfiguration.bankRegistration;const c=composeIdentification(Object.fromEntries(new FormData($('configForm'))));if(!c.walletERP)return;const text='CADASTRO DO BANCO NO SISTEMA (INTEGRAÇÃO SAFRA)\nÚltima análise desta configuração: '+bank.reviewedOn+'\nCódigo do banco: '+bank.code+'\nBanco: '+bank.name+'\nLayout da Remessa: '+bank.remittanceLayout+'\nCarteira: '+c.walletERP+'\nAceite: '+bank.acceptance+'\nMensagem para local de pagamento: '+bank.paymentLocation;try{await navigator.clipboard.writeText(text);toast('Cadastro do banco copiado.');}catch{toast('Cópia indisponível. Selecione os valores na tela.');}}
async function copyConfiguration(){if(!configuration?.valid)return;const c=configuration;const text='CADASTRO DA CONTA CORRENTE NO SISTEMA (INTEGRAÇÃO SAFRA)\nÚltima análise desta configuração: '+safraConfiguration.bankRegistration.reviewedOn+'\nAgência: '+c.agency+'\nDígito da agência: '+c.agencyDv+'\nConta corrente: '+c.account+'\nDígito da conta: '+c.accountDv+'\nCódigo do cedente: '+c.identification+'\n\nIDENTIFICAÇÃO NA REMESSA CNAB 400\n'+c.agency+' + '+c.accountWithDv+' = '+c.identification+'\nO dígito da agência não integra as 14 posições.';try{await navigator.clipboard.writeText(text);toast('Cadastro da conta corrente copiado.');}catch{toast('Cópia indisponível. Selecione os valores na tela.');}}
async function copyBeneficiary(){if(!configuration?.identificationValid)return;try{await navigator.clipboard.writeText(configuration.identification);toast('Código do cedente copiado.');}catch{toast('Cópia indisponível. Selecione o código na tela.');}}
function drawRecord(record,start=1,end=1){
  if(!record)return;start=Math.min(Math.max(1,Math.trunc(Number(start))||1),Math.max(record.length,1));end=Math.min(Math.max(start,Math.trunc(Number(end))||start),Math.max(record.length,1));
  $('rangeStart').value=start;$('rangeEnd').value=end;$('rangeStart').max=Math.max(1,record.length);$('rangeEnd').max=Math.max(1,record.length);
  const positions=Array.from({length:record.length},(_,i)=>i+1);
  $('rulerHundreds').textContent=positions.map(n=>n>=100?Math.floor(n/100)%10:' ').join('');$('rulerTens').textContent=positions.map(n=>Math.floor(n/10)%10).join('');$('rulerOnes').textContent=positions.map(n=>n%10).join('');
  const mark=document.createElement('mark');mark.textContent=record.text.slice(start-1,end);$('recordText').replaceChildren(document.createTextNode(record.text.slice(0,start-1)),mark,document.createTextNode(record.text.slice(end)));
  $('selectedValues').textContent='Linha '+record.line+' · Tipo '+(record.text[0]||'vazio')+' · '+record.length+' posições | Seleção '+start+'–'+end+': ['+record.text.slice(start-1,end)+']';
  requestAnimationFrame(()=>{const sc=$('recordScroll');sc.scrollLeft=Math.max(0,(start-1)*7.8-sc.clientWidth/3);});
}
function openViewer(check){
  if(!result?.records.length)return;
  $('recordSelect').innerHTML=result.records.map(r=>'<option value="'+r.line+'">Linha '+r.line+' · Tipo '+escape(r.text[0]||'vazio')+' · '+r.length+' posições</option>').join('');
  const record=result.records.find(r=>r.line===check?.line)||result.records[0];$('recordSelect').value=record.line;
  $('viewerDetails').textContent=check?check.field+' · Linha '+check.line+' · Posições '+check.start+'–'+check.end+' · Encontrado: ['+check.found+'] · Esperado: '+(check.expected||'Não aplicável')+'. '+check.description+' Referência: '+check.reference:'Arquivo original: '+result.fileName+'. Selecione um registro e o intervalo de posições.';
  if(!$('viewer').open)$('viewer').showModal();drawRecord(record,check?.start??1,check?.end??Math.min(40,record.length));
}
async function demo(){
  if(busy)return;const bank=getBank($('bankSelect').value);if(!bank.implemented){toast('Selecione um banco disponível para explorar o exemplo.');return;}
  fileName='exemplo_'+bank.code+'_com_divergencias.rem';const generator=bank.code==='341'?makeItauDemo:makeDemo;
  bytes=new TextEncoder().encode(generator({broken:true,date:$('referenceDate').value||localToday()}));navigate('validator');await analyze();toast('Exemplo sintético: 3 títulos e divergências intencionais.');
}
function clearSession(){
  activeWorker?.terminate();activeWorker=null;
  if($('viewer').open)$('viewer').close();
  itauView.reset();$('configForm').reset();$('layoutSelect').value='400';filter='issues';pageIndex=0;
  $('referenceDate').value=localToday();$('sendDate').value='';$('searchOccurrences').value='';
  for(const id of ['resultFileName','resultMeta','resultMetrics','occurrenceRows','recordSelect','recordText','viewerDetails','selectedValues','rulerHundreds','rulerTens','rulerOnes'])$(id).replaceChildren();
  bankChanged();toast('Dados e arquivos da sessão limpos.');
}
document.addEventListener('click',async event=>{
  const page=event.target.closest('[data-page]');if(page){navigate(page.dataset.page);return;}
  const bank=event.target.closest('[data-bank]');if(bank){$('bankSelect').value=bank.dataset.bank;bankChanged();navigate('config');return;}
  const filterButton=event.target.closest('[data-filter]');if(filterButton){filter=filterButton.dataset.filter;pageIndex=0;renderOccurrences();return;}
  const inspect=event.target.closest('[data-inspect]');if(inspect){openViewer(result?.checks.find(c=>c.id===Number(inspect.dataset.inspect)));return;}
  const action=event.target.closest('[data-action]');if(!action)return;
  if(action.dataset.action==='demo'){await demo();return;}
  if(action.dataset.action==='config-example'){useConfigurationExample();return;}
  if(!result)return;
  const base=result.fileName.replace(/\.[^.]+$/,'').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,80)||'remessa';
  if(action.dataset.action==='json')download(reportJSON(result),base+'_diagnostico.json','application/json');
  if(action.dataset.action==='pdf')download(reportPDF(result),base+'_diagnostico.pdf','application/pdf');
});
$('chooseFile').addEventListener('click',()=>$('fileInput').click());
$('fileInput').addEventListener('change',()=>{const file=$('fileInput').files[0];$('fileInput').value='';if(file)readFile(file);});
$('dropzone').addEventListener('dragover',e=>{e.preventDefault();$('dropzone').classList.add('drag-over');});
$('dropzone').addEventListener('dragleave',()=>$('dropzone').classList.remove('drag-over'));
$('dropzone').addEventListener('drop',e=>{e.preventDefault();$('dropzone').classList.remove('drag-over');if(e.dataTransfer.files.length!==1){status('Selecione um arquivo por análise.','warning');return;}readFile(e.dataTransfer.files[0]);});
$('rerun').addEventListener('click',analyze);$('bankSelect').addEventListener('change',bankChanged);$('configForm').addEventListener('submit',checkConfiguration);
$('configContent').addEventListener('input',()=>{updateBeneficiary(true);if(result)status('Dados bancários alterados. Use Conferir novamente para atualizar a comparação.','warning');});
$('copyBankConfig').addEventListener('click',copyBankConfiguration);$('copyConfig').addEventListener('click',copyConfiguration);$('copyBeneficiary').addEventListener('click',copyBeneficiary);
for(const id of ['referenceDate','sendDate'])$(id).addEventListener('change',()=>{if(result)status('Opções alteradas. Use Conferir novamente para atualizar o diagnóstico.','warning');});
$('clearSession').addEventListener('click',clearSession);$('searchOccurrences').addEventListener('input',()=>{pageIndex=0;renderOccurrences();});
$('previousOccurrences').addEventListener('click',()=>{pageIndex--;renderOccurrences();});$('nextOccurrences').addEventListener('click',()=>{pageIndex++;renderOccurrences();});
$('openViewer').addEventListener('click',()=>openViewer());$('closeViewer').addEventListener('click',()=>$('viewer').close());
$('recordSelect').addEventListener('change',()=>{const record=result?.records.find(r=>r.line===Number($('recordSelect').value));$('viewerDetails').textContent='Inspeção manual do registro original.';drawRecord(record,1,Math.min(40,record?.length||1));});
$('highlightRange').addEventListener('click',()=>drawRecord(result?.records.find(r=>r.line===Number($('recordSelect').value)),$('rangeStart').value,$('rangeEnd').value));
$('themeToggle').addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('cnab-theme',theme);}catch{}toast(theme==='dark'?'Tema escuro ativado.':'Tema claro ativado.');});
$('menuToggle').addEventListener('click',()=>setMenu(!$('sidebar').classList.contains('open')));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobileQuery.matches&&$('sidebar').classList.contains('open')){setMenu(false);$('menuToggle').focus();}});
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();$('main').focus();});
window.addEventListener('hashchange',()=>navigate(location.hash.slice(1)));
applyConfigurationDefaults($('bankSelect').value);updateBeneficiary(false);renderBanks();renderDashboard();renderReports();updateBankContext();navigate(location.hash.slice(1)||'dashboard');
