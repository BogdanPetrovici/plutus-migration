import {
    Model, InferAttributes, InferCreationAttributes, CreationOptional
  } from 'sequelize';

export class TransactionTags extends Model<InferAttributes<TransactionTags>, InferCreationAttributes<TransactionTags>> {
    declare id: CreationOptional<number>;
    declare tagId: number;
    declare transactionId: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}