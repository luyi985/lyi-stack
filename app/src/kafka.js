const { Kafka } = require("kafkajs");
const { faker } = require("@faker-js/faker");

const args = process.argv;

const isProducer = args.includes("producer");
const isConsumer = args.includes("consumer");
const topic = "user-topic";
const groupId = "USER";

const kafkaInstance = () =>
  new Kafka({
    clientId: "my-app",
    brokers: ["kafka:9092"],
    username: process.env.KAFKA_INTER_BROKER_USER,
    password: process.env.KAFKA_INTER_BROKER_PASSWORD,
  });

const runConsumer = async () => {
  const kafka = kafkaInstance();
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      console.log({
        partition,
        topic,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
  process.on("SIGINT", (signal) => {
    console.log("Received SIGINT. Press Control-D to exit.");
    consumer.disconnect();
  });
};

const runProducer = async () => {
  const kafka = kafkaInstance();
  const producer = kafka.producer();
  await producer.connect();

  setInterval(async () => {
    // ----------------
    const _id = faker.string.uuid();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const jobTitle = faker.person.jobTitle();
    const jobType = faker.person.jobType();
    const gender = faker.person.gender();
    const email = faker.internet.email({ firstName, lastName });
    const birthday = faker.date.birthdate();
    // ----------------
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify({
            _id,
            firstName,
            lastName,
            jobTitle,
            jobType,
            gender,
            email,
            birthday,
          }),
        },
      ],
    });
  }, 5000);

  process.on("SIGINT", (signal) => {
    console.log("Received SIGINT. Press Control-D to exit.");
    producer.disconnect();
  });
};

const run = () => {
  if (isProducer) {
    return runProducer();
  }
  if (isConsumer) {
    return runConsumer();
  }
};

run();
