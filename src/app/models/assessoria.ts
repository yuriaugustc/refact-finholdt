export interface Assessoria  {
    id: number;
    id_tipo_assessoria: number;
    id_tipo_visto?: number;
    id_pais?: number;
    id_funcionario: number;
    id_cliente: number;
    valor_assessoria: number;
    id_tipo_pagamento: number;
    id_status_pagamento: number;
    id_formulario?: number;
    id_status_assessoria: number;
    data_contratacao?: Date;
    viajantes?: Viajante[];
}

export interface Viajante {
    id: number;
    nome: string;
    id_assessoria: number;
}

export interface TipoAssessoria {
    id: number;
    nome?: string;
}

export interface TipoVisto {
    id: number;
    nome?: string;
}

export interface Pais {
    id: number;
    nome: string;
    codigo: string;
    ativo?: boolean;
}

export interface TipoPagamento {
    id: number;
    nome?: string;
}

export interface StatusAssessoria {
    id: number;
    nome?: string;
}

export interface StatusPagamento {
    id: number;
    nome?: string;
}

export interface Cartao {
    nome?: string;
    numero?: string;
    data?: Date;
    cvv?: number;
    parcelas?: number;
    juros?: number;
}