import { Injectable } from '@nestjs/common';

import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel( Pokemon.name ) //inplementacion propia de mongoose
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}

  
  // Forma 1: insertar por lote
  // async executedSeed() {
  //   const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=5');
  //   data.results.forEach( async({name,url})=>{
  //     const segments = url.split('/');
  //     const no = +segments[ segments.length - 2];
  //     const pokemon = await this.pokemonModel.create( {name, no} );
  //     // console.log({name, no});
  //   })
  //   return data.results;
  // }

  // Forma 2 - Insercion Iterativa
  // async executedSeed() {

  //   await this.pokemonModel.deleteMany({}); // delete * from Pokemons;

  //   const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=5');
  //   const insertPromiseArray = [];
  //   data.results.forEach( ({name,url})=>{
  //     const segments = url.split('/');
  //     const no = +segments[ segments.length - 2];

  //     insertPromiseArray.push(
  //       this.pokemonModel.create({name, no})
  //     );
  //   });

  //   await Promise.all( insertPromiseArray );
    
  //   return `Seed Executed`;
  // }

  // Forma 3 - Insersion Masiva
  async executedSeed() {

    await this.pokemonModel.deleteMany({}); // delete * from Pokemons;

    // const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach( ({name,url})=>{
      const segments = url.split('/');
      const no = +segments[ segments.length - 2];
      pokemonToInsert.push({name, no}); //[{ name: bulbasaur, no: 1 }]
    });

    await this.pokemonModel.insertMany(pokemonToInsert);
    
    return `Seed Executed`;
  }

}
