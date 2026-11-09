import {bankRegistration,source,composeAccount,accountExample,bankCopyText,accountCopyText} from '../banks/itau-config.js';
/** UI exclusiva do Itaú: não compartilha campos nem regras de composição do Safra. */
export function setupItauConfiguration(notify){
  const $=id=>document.getElementById(id);
  const form=$('itauConfigForm');
  const read=()=>Object.fromEntries(new FormData(form));
  for(const [id,key] of [['itauBankCode','code'],['itauBankName','name'],['itauWallet','wallet'],['itauLayout','remittanceLayout'],['itauPaymentLocation','paymentLocation']])$(id).textContent=bankRegistration[key];
  $('itauReviewedOn').textContent=source.reviewedOn;$('itauReviewedOn').dateTime=source.reviewedISO;
  $('itauSource').href=source.url;$('itauSourceEdition').textContent=source.edition;
  function update(showIssues=false){
    const c=composeAccount(read());$('itauCopyAccount').disabled=!c.valid;$('itauAccountResult').hidden=!c.valid;$('itauAccountEmpty').hidden=c.valid;
    for(const [id,key] of [['itauResultAgency','agency'],['itauResultAccount','account'],['itauResultAccountDv','accountDv'],['itauRemittanceSegment','remittanceSegment']])$(id).textContent=c.valid?c[key]:'';
    $('itauConfigIssues').replaceChildren();if(showIssues)for(const issue of c.issues){const li=document.createElement('li');li.textContent=issue;$('itauConfigIssues').append(li);}
    $('itauConfigIssues').hidden=!showIssues||c.valid;
  }
  async function copy(text,success){if(!text)return;try{await navigator.clipboard.writeText(text);notify(success);}catch{notify('Cópia indisponível. Selecione os valores na tela.');}}
  form.addEventListener('submit',event=>{event.preventDefault();update(true);});form.addEventListener('input',()=>update(true));
  $('itauCopyBank').addEventListener('click',()=>copy(bankCopyText(),'Cadastro do banco Itaú copiado.'));
  $('itauCopyAccount').addEventListener('click',()=>copy(accountCopyText(read()),'Cadastro da conta Itaú copiado.'));
  $('itauUseExample').addEventListener('click',()=>{for(const [name,value] of Object.entries(accountExample))form.elements.namedItem(name).value=value;update(true);notify('Exemplo Itaú exclusivamente fictício preenchido.');});
  function reset(){form.reset();update(false);}
  reset();return {reset};
}
