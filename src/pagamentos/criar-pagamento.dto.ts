import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class ItemFaturaDto {
  @IsNotEmpty()
  @IsInt()
  valor: number;

  @IsNotEmpty()
  @IsString()
  descricao: string;
}

class UsuarioDto {
  @IsNotEmpty()
  @IsString()
  nome: string;
}

class FaturaDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  valor: number;

  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => new Date(value))
  dataPagamento: Date;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  itensFatura: ItemFaturaDto[];
}

export class CriarPagamentoDto {
  @IsNotEmpty()
  @ValidateNested()
  fatura: FaturaDto;

  @IsNotEmpty()
  @ValidateNested()
  usuario: UsuarioDto;
}
