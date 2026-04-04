import axios from "axios";

export function getErrorMessage(error: unknown) : string {
    if (axios.isAxiosError(error)) {
        const msg = (error.response?.data as any).message
        return msg ?? 'Erro na requisição. Tente novamente mais tarde.'
    }
    return error instanceof Error ? error.message : 'Ocorreu um erro desconhecido. Tente novamente mais tarde.'
}