import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PagamentosModule } from './pagamentos/pagamentos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaturaModel } from './pagamentos/models/fatura.model';
import { PagamentoModel } from './pagamentos/models/pagamento.model';
import { UsuarioModel } from './pagamentos/models/usuario.model';
import { ItemFaturaModel } from './pagamentos/models/item-fatura.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'demo_mysql-db_1',
      username: 'root',
      password: 'senha',
      database: 'design_code',
      synchronize: true,
      autoLoadEntities: true,
      entities: [FaturaModel, PagamentoModel, UsuarioModel, ItemFaturaModel],
    }),
    PagamentosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
