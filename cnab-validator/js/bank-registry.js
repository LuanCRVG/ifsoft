const registry = new Map([
  ['422',{code:'422',name:'Banco Safra',short:'Safra',configurable:true,implemented:true,layouts:['400'],load:()=>import('./validators/safra400.js'),loadConfiguration:()=>import('./banks/safra-config.js')}],
  ['341',{code:'341',name:'Itaú',short:'Itaú',configurable:true,implemented:true,layouts:['400'],load:()=>import('./validators/itau400.js'),loadConfiguration:()=>import('./banks/itau-config.js')}],
  ...[['033','Santander'],['237','Bradesco'],['104','Caixa Econômica'],['756','Sicoob'],['748','Sicredi']].map(([code,name])=>[code,{code,name,short:name,implemented:false,layouts:[]}])
]);
export const banks = [...registry.values()];
export const getBank = code => registry.get(code);
/** Each bank owns its loader. Unsupported banks never fall through to Safra. */
export async function loadBank(code,layout) {
  const bank=getBank(code);
  if(!bank?.implemented || !bank.layouts.includes(layout)) throw new Error('Banco ou layout ainda não implementado. Nenhuma regra foi aplicada.');
  return {bank,module:await bank.load()};
}
