
/*********************************************/
/**        Arquivo de Configuração          **/
/*********************************************/

const production = false, homolog = false;
const defaultMsgError = 'Houve um erro ao tentar acessar os dados do servidor. Tente novamente em breve!';

let apiUrl = '';
if(production){
  apiUrl = 'https://sis.arcavistos.com/api';
}else if(homolog){
  apiUrl = 'https://finholdt.rf.gd/api';
}else{
  apiUrl = 'http://localhost:8080/finholdt/api';
}

function inArray(needle:any, haystack:Array<any>) {
  for(var i = 0; i < haystack.length; i++) {
    if(haystack[i] == needle) return true;
  }
  return false;
}

export const environment = {
  apiUrl,
  inArray,
  defaultMsgError
};
