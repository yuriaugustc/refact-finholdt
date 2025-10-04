export interface Item {
    id: number;
    nome?: string;
    rota?: string;
    icone?: string;
    ordenacao?: number;
    collapsed?: boolean;
    acoes?: Acao[];
    separator?: boolean; // propriedade para front
    ativo?: boolean;
}

export interface Acao {
    id: number;
    nome?: string;
    rota?: string;
    icone?: string;
    ordenacao?: number;
    idItem?: number;
    nomeItem?: string;
    ativo?: boolean;
}