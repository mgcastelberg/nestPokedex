// Tipo <T> es generico - Patron Adaptador
export interface HttpAdapter {
    get<T>( url: string ): Promise<T>;
}