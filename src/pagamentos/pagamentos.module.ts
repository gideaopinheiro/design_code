import { Module } from '@nestjs/common';
import { PagamentosController } from './pagamentos.controller';
import { RealizarPagamentoUseCase } from './usecases/realizar-pagamento.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagamentoModel } from './models/pagamento.model';
import { UsuarioModel } from './models/usuario.model';
import { PagamentosRepository } from './repositories/pagamentos.repository';
import { BuscarPagamentoUseCase } from './usecases/buscar-pagamento.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([PagamentoModel, UsuarioModel])],
  controllers: [PagamentosController],
  providers: [
    RealizarPagamentoUseCase,
    BuscarPagamentoUseCase,
    PagamentosRepository,
  ],
})
export class PagamentosModule {}
