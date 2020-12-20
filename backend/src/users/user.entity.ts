import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: true })
    firstName!: string;

    @Column({ nullable: true })
    lastName!: string;

    @Column()
    @Index({ unique: true })
    sub!: string;
}
