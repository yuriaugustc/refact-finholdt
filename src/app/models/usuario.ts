export interface Usuario {
    id: number;
    nome_completo?: string;
    apelido?: string;
    cpf?: string;
    email?: string;
    celular?: string;
    id_nivel_acesso?: number;
    foto?: string;
    nome_foto?: string;
    login?: string;
    senha_padrao?: boolean;
    ativo?: boolean;
}

export interface Login {
    id: number;
    login?: string;
    senha?: string;
    senha_padrao?: boolean;
    id_usuario?: number;
}