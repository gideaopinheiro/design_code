import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PagamentoStatus } from '../entities/pagamento';
import { FaturaModel } from './fatura.model';
import { UsuarioModel } from './usuario.model';

@Entity('pagamentos')
export class PagamentoModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PagamentoStatus, nullable: false })
  status: PagamentoStatus;

  @OneToOne((type) => FaturaModel, (fatura) => fatura.pagamento, {
    cascade: ['insert'],
    eager: true,
  })
  @JoinColumn({ name: 'fatura_id' })
  fatura: FaturaModel;

  @ManyToOne((type) => UsuarioModel, (usaurio) => usaurio.pagamentos, {
    eager: true,
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioModel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
