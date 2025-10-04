export interface Formulario {
    id: number;
    nome?: string;
    id_tipo_assessoria?: number;
    perguntas?: Pergunta[];
    ativo?: boolean;
}

export interface PerguntaFormulario {
    id: number;
    id_formulario?: number;
    id_pergunta?: number;
    ordenacao?: number;
}

export interface RespostaFormulario {
    id: number;
    id_pergunta_formulario?: number;
    descricao?: string;
    id_resposta_dropdown?: number;
}

export interface Pergunta {
    id: number;
    descricao?: string;
    id_tipo?: number;
    obrigatoria?: boolean;
    respostas?: RespostaDropdown[];
    ordenacao?: number;
    ativo?: boolean;
}

export interface TipoPergunta {
    id: number;
    descricao: string;
}

export interface RespostaDropdown {
    id: number;
    id_pergunta?: number;
    descricao?: string;
    ativo?: boolean;
}