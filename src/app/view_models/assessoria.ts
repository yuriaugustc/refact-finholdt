import { TipoAssessoria, TipoVisto, Pais, TipoPagamento, StatusPagamento, StatusAssessoria } from "../models/assessoria";
import { Historico } from "../models/historico";
import { Usuario } from "../models/usuario";
import { FormularioVM } from "./formulario";

export interface AssessoriaVM {
    id?: number;
    tipo_assessoria?: TipoAssessoria;
    tipo_visto?: TipoVisto;
    pais?: Pais;
    funcionario?: Usuario;
    cliente?: Usuario;
    valor_assessoria?: number;
    tipo_pagamento?: TipoPagamento;
    status_pagamento?: StatusPagamento;
    status_assessoria?: StatusAssessoria;
    data_contratacao?: Date;
    formulario?: FormularioVM;
    comprovante?: string;
    historico?: Historico[];
    pendencia_status?: boolean;
    pendencia_pagamento?: boolean;
}