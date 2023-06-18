
import { Redis } from '@upstash/redis'

const db_url = 'https://massive-ostrich-38534.upstash.io';
const redis = new Redis({
    url: db_url,
    token: 'AZaGACQgNWFhNTk4YWUtZGI1NC00ZTRmLTg4NjktMDg1MDhhZGM4OGQyYzRiNWI1ZDhhNWY1NGViYTk0NDVkYTJhODJlNWJkOTY=',
})

class AccessRedis {
    number: any
    constructor(number: number) {
        this.number = number;
    }
    async get(number: any) {
        console.log('Retrieve' + number);
        return await redis.get(number);
    };
    async delete(number: any) {
        console.log("Deleting" + number);
        return await redis.del(number);
    };
    async update(number: any, messages: any) {
        console.log('Saving' + number)
        let next_history: string[] = [];
        let past_history: any = await redis.get(number);

        var messages = JSON.parse(messages);

        if (past_history !== null) {
            next_history = past_history.concat(messages);
        }
        else {
            next_history = messages;
        }

        return await redis.set(number, next_history);
    }
}
export { AccessRedis }