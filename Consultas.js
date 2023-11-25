import Conexion from "./Conexion.js"

class Consultas extends Conexion {
    constructor(host, user, pass, db) {
        super(host, user, pass, db)
    }

    async select(table) {
        const connection = await this.connect()
        const [rows, fields] = await connection.execute(`SELECT * FROM ${table}`)
        return rows
    }

    // async select(table) {
    //     let connection; // Definir la variable connection fuera del try
    //     try {
    //         connection = await this.connect();
    //         const [rows, fields] = await connection.execute(`SELECT * FROM ${table}`);

    //         // Verifica si hay filas y si es iterable
    //         if (rows && rows[Symbol.iterator]) {
    //             return rows;
    //         } else {
    //             console.warn('La consulta no devolvió un conjunto de resultados iterable.');
    //             return [];
    //         }
    //     } catch (error) {
    //         console.error('Error al ejecutar la consulta SELECT:', error.message);
    //         throw error; // Puedes manejar el error según tus necesidades
    //     } finally {
    //         // Asegúrate de cerrar la conexión después de usarla
    //         if (connection) {
    //             await connection.end();
    //         }
    //     }
    // }



    async delete(table, condition) {
        const connection = await this.connect()
        const [rows, fields] = await connection.execute(`DELETE FROM ${table} WHERE ${condition}`)
        return rows
    }

    async insert(table, values) {
        const connection = await this.connect()
        const [rows, fields] = await connection.execute(`INSERT INTO ${table} VALUES ${values}`);
        return rows
    }

    async update(table, values, condition) {
        const connection = await this.connect()
        const [rows, fields] = await connection.execute(`UPDATE ${table} SET ${values} WHERE ${condition}`);
        return rows
    }

    async closeConect() {
        try {
            const connection = await this.connect();
            await connection.end();
            console.log('Se cerró la conexión');
            return connection;
        } catch (error) {
            console.error('Error al cerrar la conexión:', error.message);
            throw error; // Puedes manejar el error según tus necesidades
        }
    }
}

export default Consultas
