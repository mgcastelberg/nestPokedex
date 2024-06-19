import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { Injectable } from "@nestjs/common";


// envoltorio para poder usarlo desde otro modulo o servicio
@Injectable() // Necesitamos decorarlo para poder usarlo
export class AxiosAdapter implements HttpAdapter{

    private readonly axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try {
            const { data } = await this.axios.get<T>(url);
            return data;
        } catch (error) {
            throw new Error("This is an  error - Check logs");
        }
    }
}