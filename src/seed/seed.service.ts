import { Injectable } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel( Pokemon.name ) //inplementacion propia de mongoose
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async executedSeed() {
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=5');
    data.results.forEach( async({name,url})=>{
      // console.log(name);
      const segments = url.split('/');
      const no = +segments[ segments.length - 2];

      const pokemon = await this.pokemonModel.create( {name, no} );

      console.log({name, no});
    })
    return data.results;
  }

}
