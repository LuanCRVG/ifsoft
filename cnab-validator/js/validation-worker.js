import {validateFile} from './validation-engine.js';
self.onmessage=async event=>{try{self.postMessage({result:await validateFile(event.data.bytes,event.data.options)});}catch(error){self.postMessage({error:error.message});}};
