import { RespostaDropdown } from "../models/formulario";

export interface FormularioVM {
    id: number;
    nome?: string;
    id_tipo_assessoria?: number;
    perguntas?: PerguntaVM[];
    ativo?: boolean;
    editado?: boolean;
}

export interface PerguntaVM {
    id: number;
    descricao?: string;
    id_tipo?: number;
    obrigatoria: boolean;
    respostasDropDown?: RespostaDropdown[];
    resposta: RespostaVM;
    ordenacao?: number;
    ativo?: boolean;
    editado?: boolean;
}

export interface RespostaVM {
    id: number;
    descricao: string;
    id_resposta_dropdown: number;
    id_resposta_multi: number[];
    resposta_date?: Date;
    resposta_file?: File;
    caminho_anexo?: string;
}