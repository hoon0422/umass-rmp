import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ orderBy: { id: 'ASC' } })
export class ClassCategory {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Column({ length: 50, unique: true })
  name: string;
}
