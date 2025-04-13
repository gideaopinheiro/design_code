import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsuarioStatus } from '../entities/usuario';
import { FaturaModel } from './fatura.model';
import { PagamentoModel } from './pagamento.model';

@Entity('usuarios')
export class UsuarioModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 128, nullable: false })
  nome: string;

  @Column({ type: 'enum', enum: UsuarioStatus, nullable: false })
  status: UsuarioStatus;

  @OneToMany((type) => FaturaModel, (fatura) => fatura.usuario)
  faturas: FaturaModel[];

  @OneToMany((type) => PagamentoModel, (pagamento) => pagamento.usuario)
  pagamentos: PagamentoModel[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
