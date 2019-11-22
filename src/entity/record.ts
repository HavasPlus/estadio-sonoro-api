import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {user} from "./user";


@Entity("record" ,{schema:"estadio-sonoro" } )
@Index("recordUser_idx",["idUser",])
export class record {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"idRecord"
        })
    idRecord:number;
        

   
    @ManyToOne(()=>user, (user: user)=>user.records,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'idUser'})
    idUser:user | null;


    @Column("varchar",{ 
        nullable:false,
        length:45,
        name:"fileName"
        })
    fileName:string;
        
}
