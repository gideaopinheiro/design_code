import { Module } from '@nestjs/common';
import { PagamentosController } from './pagamentos.controller';
import { RealizarPagamentoUseCase } from './usecases/realizar-pagamento.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagamentoModel } from './models/pagamento.model';
import { UsuarioModel } from './models/usuario.model';
import { PagamentosRepository } from './repositories/pagamentos.repository';
import { BuscarPagamentoUseCase } from './usecases/buscar-pagamento.usecase';
import { CacheModule } from '@nestjs/cache-manager';

const TTL_ONE_MINUTE_MILISECONDS: number = 60 * 1000;

@Module({
  imports: [
    CacheModule.register({ ttl: TTL_ONE_MINUTE_MILISECONDS }),
    TypeOrmModule.forFeature([PagamentoModel, UsuarioModel]),
  ],
  controllers: [PagamentosController],
  providers: [
    RealizarPagamentoUseCase,
    BuscarPagamentoUseCase,
    PagamentosRepository,
  ],
})
export class PagamentosModule {}
