const db = require("../service/dataBase");
const bcrypt = require("bcryptjs");
const env = require("../config/environ");
const crypto = require("crypto");
const moment = require('moment');

class TokenModel {
    tableName = 'tb_user_links'

    createOneTimeLink = async ({
        userId,
        createdAt = new Date(),
        updatedAt = new Date(),
        status = '1',
    }) => {
        const expiredAt = moment().add(2, "minutes").toDate();

        const link = crypto.randomBytes(16).toString("hex");;
        const isUsedLink = '0'
        const sqlDelete = `DELETE FROM ${this.tableName} WHERE userId = ${userId}`;
        await db.query(sqlDelete, [])

        const sql = `INSERT INTO ${this.tableName}
        (userId, link, isUsedLink, expiredAt, createdAt, updatedAt, status) VALUES (?,?,?,?,?,?,?)`;


        const result = await db.query(sql, [
            userId,
            link,
            isUsedLink,
            expiredAt,
            createdAt,
            updatedAt,
            status
        ]);
        if (result.insertId) {
            const sql1 = `SELECT * FROM ${this.tableName} WHERE linkId =?`
            const links = await db.query(sql1, [result.insertId
            ]);
            return links[0];
        }
    }

    findLink = async ({ link }) => {

        const sql1 = `SELECT * FROM ${this.tableName} WHERE link =? `
        const links = await db.query(sql1, [link
        ]);
        return links[0];
    }

    updateLinkStatus = async (link) => {
            let sql = `UPDATE ${this.tableName} SET isUsedLink = '1' WHERE link = ?`;
            await db.query(sql, [link]);
    
            const sql1 = `SELECT * FROM ${this.tableName} WHERE link = ?`;
            const links = await db.query(sql1, [link]);
            return links.length > 0 ? links[0] : null;
        
    };
    


}

module.exports = new TokenModel();
