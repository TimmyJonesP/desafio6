const fs = require('fs');
const path =  require('path');

class ContenedorChat {

    constructor(filename){
        this.filename = path.join(__dirname,"..", `files/${filename}`);
    }

    async save(message){
        
        try{
            const chat = await this.getAll();
            if(chat.length>0){
                const lastId = chat[chat.length-1].id + 1;
                message.id = lastId;
                chat.push(message);
                await fs.promises.writeFile(this.filename, JSON.stringify(chat, null, 2));
            }else{
                message.id =  1;
                await fs.promises.writeFile(this.filename, JSON.stringify([message], null, 2));
            }
            

        } catch(err){
            console.log(err);
        }
    }

    async getAll(){

        try{
            const content = await fs.promises.readFile(this.filename, 'utf-8');
            if(content.length > 0){
                let array = JSON.parse(content);
                return array;
            }else{
                return [];
            }
            
        }
        catch(err){
            return "Cannot read file";
        }


    }
}

module.exports = ContenedorChat;