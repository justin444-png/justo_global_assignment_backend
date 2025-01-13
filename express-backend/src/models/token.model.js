const db = require("../service/dataBase");
const bcrypt = require("bcryptjs");
const env = require("../config/environ");
const crypto = require("crypto");
const moment = require('moment');

class TokenModel {
    tableName = 'tb_tokens'

    createToken = async ({
        userId,
        createdAt = new Date(),
        updatedAt = new Date(),
        status = '1',
    }) => {
        const expiredAt = moment().add(6, "minutes").toDate();
        const token = crypto.randomBytes(64).toString("hex");

        const sqlDelete = `DELETE FROM ${this.tableName} WHERE userId=${userId}`;
        await db.query(sqlDelete,[])

        const sql = `INSERT INTO ${this.tableName}
        (userId,accessToken, expiredAt, createdAt, updatedAt, status) VALUES (?,?,?,?,?,?)`;

        const result = await db.query(sql, [
            userId,
            token,
            expiredAt,
            createdAt,
            updatedAt,
            status
        ]);
        if (result.insertId) {
            const sql1 = `SELECT * FROM ${this.tableName} WHERE userId =?`
            const user = await db.query(sql1, [userId
            ]);
            return user[0];
        }

    }

    findToken = async ({ userId }) => {
        let query = `SELECT * FROM ${this.tableName} WHERE userId = ?`;
        const result = await db.query(query, [userId]);
        return result.length > 0 ? result[0] : null
    };

    findTokenFromHeader = async ({ token }) => {
        let query = `SELECT * FROM ${this.tableName} WHERE token = ?`;
        const result = await db.query(query, [token]);
        return result.length > 0 ? result[0] : null
    };

    verifyToken = async (token ) => {
        let query = `SELECT * FROM ${this.tableName} WHERE accessToken = ? AND status='1'`;

        const result = await db.query(query, [token]);
        if (result.length === 0) {
            return null;
        }

        const tokenData = result[0];
        const currenttime = new Date();
        const expiryTime = new Date(tokenData.expiredAt);
        if (currenttime > expiryTime) {
            return null
        }
        return tokenData;
    };

    removeToken = async(userId) => {
            let sql = `UPDATE ${this.tableName} SET status = '0'
           WHERE  userId= ?`;
            return await db.query(sql, [userId]);
        }

}

module.exports = new TokenModel();
