import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  
  private defaultLimit:number;

  constructor(
    @InjectModel( Pokemon.name ) //inplementacion propia de mongoose
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ){

    console.log(process.env.DEFAULT_LIMIT);
    this.defaultLimit = configService.get<number>('DEFAULT_LIMIT');
    console.log(this.defaultLimit);

  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name =createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll( paginationDto: PaginationDto ) {

    const { limit=this.defaultLimit, offset=0 } = paginationDto;

    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
      no: 1 //columna de forma ascendente
    });
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

  async update(param: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne( param );
    try {
      if(updatePokemonDto.name) updatePokemonDto.name.toLowerCase();
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    // return { id }
    // const result = await this.pokemonModel.findByIdAndDelete( id );
    // En un solo paso
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${ id } not found`);
    }
    return;
  }

  private handleExceptions( error: any )
  {
    if (error.code === 11000) {
      // console.log(error);
      const duplicateKey = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[duplicateKey];
      throw new BadRequestException(`Pokemon ${duplicateKey}: ${duplicateValue} already exists in the database`);
    }
    // console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon`);
  }

}
