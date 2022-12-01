const { promises: fs } = require("fs");
const path =  require('path');

class Contenedor {

    constructor(fileName) {
        this.fileName = path.join(__dirname,"..",`files/${fileName}`);
    }

    async getAll() {
        try {
            ///lectura, y vista de todos los objetos dentro del file.
            const data = await fs.readFile(this.fileName, "utf-8");
            return JSON.parse(data)
        } catch (err) {
            return []
        }
    }

    async save(book) {
        const data = await this.getAll()

        let newId
        data.length == 0 ? newId = 1 : (newId = data[data.length - 1].id + 1)

        const newBook = { ...book, id: newId }
        data.push(newBook)

        try {
            await fs.writeFile(this.fileName, JSON.stringify(data, null))
            return newId
        } catch (err) {
            throw new Error(err)
        }
    }

    async getById(id) {
        const data = await this.getAll()
        const seeker = data.find(p => p.id == id) || null
        return seeker
    }

    async deleteById(id) {
        const data = await this.getAll()
        ///Limpia la coincidencia
        const i = data.filter(p => p.id !== id)

        try {
            ///la escribe en el archivo como es el nuevo array.-
            await fs.writeFile(this.fileName, JSON.stringify(i, null, 2));
            return { id }
        }
        catch (error) {
            throw new Error(`${error}`)
        }

    }

    async deleteAll() {
        await fs.writeFile(this.fileName, JSON.stringify([], null, 2))
    }
}
module.exports = Contenedor;