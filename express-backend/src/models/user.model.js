const db = require("../service/dataBase");
const bcrypt = require("bcryptjs");
const env = require("../config/environ");

class UserModel {
    tableName = 'tb_users'

    findEmail = async (email) => {
        const sql = `SELECT * FROM ${this.tableName} WHERE email = ?`;
        const result = await db.query(sql, [email]);
        return result.length > 0 ? result[0] : null
    };

    register = async ({
        email,
        password,
        createdAt = new Date(),
        updatedAt = new Date(),
        loginFailedCount = 0,
        status = '1',
    }) => {
        password = await bcrypt.hash(password, env.SALT);
        const sql = `INSERT INTO ${this.tableName}
        (email,password, createdAt, updatedAt,loginFailedCount, status) VALUES (?,?,?,?,?,?)`;

        const data = await db.query(sql, [
            email,
            password,
            createdAt,
            updatedAt,
            loginFailedCount,
            status
        ]);
        return data ? data.insertId : 0;
    }

    updateFailedCount = async (userId, count) => {
        let sql = `UPDATE ${this.tableName} SET loginFailedCount = ?
               WHERE  userId= ?`;
        return await db.query(sql, [count, userId]);
    }

    blockUser = async (userId) => {
        let sql = `UPDATE ${this.tableName} SET status = '2'
               WHERE  userId= ?`;
        return await db.query(sql, [userId]);
    }

    findUser = async ( userId ) => {
            let query = `SELECT * FROM ${this.tableName} WHERE userId = ?`;
            const result = await db.query(query, [userId]);
            return result.length > 0 ? result[0] : null
        };


}

module.exports = new UserModel();
