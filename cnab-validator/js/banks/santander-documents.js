/** Nota 38 do H7800 e cálculo de DV publicado pela Receita Federal. */
export const cnpjReference='https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf';
export function validDocument(kind,raw){
  if(kind==='01'){
    if(!/^000\d{11}$/.test(raw))return false;const cpf=raw.slice(3);if(/^(\d)\1{10}$/.test(cpf))return false;
    for(let n=9;n<=10;n++){const sum=[...cpf.slice(0,n)].reduce((a,v,i)=>a+Number(v)*(n+1-i),0);const dv=(sum*10)%11%10;if(dv!==Number(cpf[n]))return false;}return true;
  }
  if(kind!=='02'||!/^[A-Z0-9]{12}\d{2}$/.test(raw)||/^(\d)\1{13}$/.test(raw))return false;
  for(let n=12;n<=13;n++){let sum=0,weight=2;for(let i=n-1;i>=0;i--){sum+=(raw.charCodeAt(i)-48)*weight;weight=weight===9?2:weight+1;}const rest=sum%11;if((rest<2?0:11-rest)!==Number(raw[n]))return false;}return true;
}
