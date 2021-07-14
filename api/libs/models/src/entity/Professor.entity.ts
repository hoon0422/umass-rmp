import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Professor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { unique: true })
  email: string;

  @Column('varchar', { length: 50 })
  name: string;
}
