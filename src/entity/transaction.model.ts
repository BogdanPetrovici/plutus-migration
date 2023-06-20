import {
    Model, InferAttributes, InferCreationAttributes, CreationOptional
  } from 'sequelize';

export class Transaction extends Model<InferAttributes<Transaction>, InferCreationAttributes<Transaction>> {
    declare id: CreationOptional<number>;
    declare amount: number;
    declare date: Date;
    declare payee: string;
    declare note: string | null;
    declare userId: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}