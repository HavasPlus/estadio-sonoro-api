import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId
} from "typeorm";
import { record } from "./record";

import * as bcrypt from "bcryptjs";

@Entity("user", { schema: "estadio-sonoro" })
export class user {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "idUser"
  })
  idUser: number;

  @Column("varchar", {
    nullable: false,
    length: 45,
    name: "firstName"
  })
  firstName: string;

  @Column("varchar", {
    nullable: true,
    length: 96,
    name: "lastName"
  })
  lastName: string | null;

  @Column("varchar", {
    nullable: true,
    length: 96,
    name: "email"
  })
  email: string | null;

  @Column("varchar", {
    nullable: true,
    length: 196,
    name: "password"
  })
  password: string | null;
  @Column("varchar", {
    nullable: true,
    length: 64,
    name: "googleId"
  })
  googleId: string | null;

  @Column("bigint", {
    nullable: true,
    name: "facebookId"
  })
  facebookId: string | null;

  @OneToMany(
    () => record,
    (record: record) => record.idUser,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  records: record[];
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
