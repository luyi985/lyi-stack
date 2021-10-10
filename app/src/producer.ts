import { client } from './kafka/client';
import readline from 'readline';
import { Producer } from 'kafkajs';

const consoleReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (producerClient: Producer) =>
    consoleReader.question('Input kafka message to publish: ', async (content: string) => {
        try {
            const toPublish = JSON.parse(content?.trim());
            if (!toPublish.topic) throw 'Missing topic';
            if (
                !Array.isArray(toPublish.messages) ||
                !toPublish.messages.every((m: { value: any }) => Boolean(m?.value))
            )
                throw 'Missing messages';
            await producerClient.send(toPublish);
            question(producerClient);
        } catch (e) {
            console.error(e);
            question(producerClient);
        }
    });

const kafkatProducer = async (): Promise<void> => {
    await client.int();
    if (!client.consumerClient || !client.producerClient) return;
    console.log('Kafka producer conected ...');
    question(client.producerClient);
};
kafkatProducer();
