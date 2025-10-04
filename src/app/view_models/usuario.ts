import { NivelAcesso } from "../models/nivelacesso";
import { Login } from "../models/usuario";

export interface UsuarioVM {
    id: number;
    nome_completo?: string;
    apelido?: string;
    cpf?: string;
    email?: string;
    celular?: string;
    nivel_acesso?: NivelAcesso;
    foto?: string;
    nome_foto?: string;
    login?: Login;
}