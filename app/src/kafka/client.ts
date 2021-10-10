import { configs } from '../configs';
import { Consumer, Kafka, Producer } from 'kafkajs';

type KafkaClientConstructor = {
    brokers: string[];
    clientId: string;
    groupId: string;
};

class Client<T extends object> extends Kafka {
    private groupId: string;
    public producerClient: Producer | undefined;
    public consumerClient: Consumer | undefined;
    constructor(args: KafkaClientConstructor) {
        const { groupId, ...rest } = args;
        super({
            ...rest,
            requestTimeout: 25000,
            retry: { maxRetryTime: 30000, retries: 10 },
        });
        this.groupId = groupId;
    }

    async int() {
        try {
            this.producerClient = this.producer();
            this.consumerClient = this.consumer({ groupId: this.groupId });
            await this.producerClient.connect();
            await this.consumerClient.connect();
        } catch (e) {
            console.error(e);
        }
    }
}

export const client = new Client({ clientId: 'KafkaTest', brokers: configs.kafkaBrokers, groupId: 'test-group' });
