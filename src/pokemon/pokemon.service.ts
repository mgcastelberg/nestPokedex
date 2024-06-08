import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name ) //inplementacion propia de mongoose
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name =createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        console.log(error);
        const duplicateKey = Object.keys(error.keyValue)[0];
        const duplicateValue = error.keyValue[duplicateKey];
        throw new BadRequestException(`Pokemon ${duplicateKey}: ${duplicateValue} already exists in the database`);
      }
      console.log(error);
      throw new InternalServerErrorException(`Can't create Pokemon`);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(param: string) {

    let pokemon: Pokemon;

    if( !isNaN(+param) ){
      pokemon = await this.pokemonModel.findOne({ no: param });
    }

    // MongoId
    if (!pokemon && isValidObjectId( param )) {
      pokemon = await this.pokemonModel.findOne({ _id: param });
    }

    // Name
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({ name: param.toLowerCase().trim() });
    }

    if(!pokemon) throw new NotFoundException(`Pokemon ${param} not found`)

    return pokemon;

  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
