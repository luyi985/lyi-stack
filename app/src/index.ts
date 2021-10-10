import { client } from './kafka/client';

const kafkaConsumer = async (args: { topic: string; partition: number; offset: string }) => {
    await client.int();
    if (!client.consumerClient || !client.producerClient) return;
    await client.consumerClient.subscribe({ topic: args.topic });
    client.consumerClient.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(
                JSON.stringify(
                    {
                        topic,
                        partition,
                        message,
                    },
                    null,
                    4,
                ),
            );
        },
    });
    client.consumerClient.seek(args);
};
kafkaConsumer({ topic: 'lyi-test1', partition: 0, offset: '0' });
