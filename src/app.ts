import * as csv from 'jquery-csv';
import * as fs from 'fs';

import { Sequelize, DataTypes, Model } from "sequelize";
import { Transaction } from "./entity/transaction.model";
import { Tag } from "./entity/tag.model";
import { TransactionTags } from "./entity/transaction_tags.model";

const sample = './data/history.csv';
fs.readFile(sample, 'utf8', async (err, fileContent) => {
    if (err) { console.log(err); }
    const transactionHistory = csv.toObjects(fileContent);
    const sequelize = new Sequelize('plutus', 'sa', 'M3d4rdus!', {
        dialect: 'mssql',
        host: 'ZENIT',
        dialectOptions: {
            options: {
                encrypt: false,
                instanceName: 'SQLEXPRESS2019'
            }
        }
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    };

    Transaction.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        payee: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'Transactions',
        sequelize
    });

    Tag.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'Tags',
        sequelize
    });

    TransactionTags.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transactionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'Transaction_Tags',
        sequelize
    });

    Transaction.belongsToMany(Tag, { through: 'Transaction_Tags' });
    Tag.belongsToMany(Transaction, { through: 'Transaction_Tags' });

    var tags: { [id: string]: Model<any, any> } = {};
    for (var transactionObjectRaw of transactionHistory) {
        if (!isNaN(transactionObjectRaw['Amount']) && transactionObjectRaw['Amount'] != 0) {
            const [day, month, year] = transactionObjectRaw['Date'].split('/');
            const date = new Date(+year, +month - 1, +day);
            const transaction = await Transaction.create({
                amount: transactionObjectRaw['Amount'],
                date: date,
                payee: transactionObjectRaw['Name'],
                note: transactionObjectRaw['Notes'],
                userId: 'e43f0893-0bb7-4bcf-827f-c77f2b5f723f'
            });

            if (!tags[transactionObjectRaw['Envelope']]) {
                const tag = await Tag.create({
                    name: transactionObjectRaw['Envelope'],
                    userId: 'e43f0893-0bb7-4bcf-827f-c77f2b5f723f',
                });

                tags[transactionObjectRaw['Envelope']] = tag;
            }

            await TransactionTags.create({
                tagId: tags[transactionObjectRaw['Envelope']]['id'],
                transactionId: transaction['id']
            });
        }
    }

    await sequelize.close();
});