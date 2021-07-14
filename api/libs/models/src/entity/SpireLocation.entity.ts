import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { SpireBuilding } from './SpireBuilding.entity';

@Entity()
@Unique(['location'])
export class SpireLocation {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Column({ length: 50, unique: true })
  location: string;

  @ManyToOne(() => SpireBuilding, { nullable: true })
  spireBuilding?: SpireBuilding;
}
