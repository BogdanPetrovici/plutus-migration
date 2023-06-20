import {
    Model, InferAttributes, InferCreationAttributes, CreationOptional
  } from 'sequelize';

export class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare userId: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}