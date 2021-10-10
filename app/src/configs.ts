import { config } from 'dotenv';
import { resolve } from 'path';

type Configs = {
    kafkaBrokers: string[];
};

try {
    const c = config({ path: resolve(process.cwd(), '.env') });
    if (c.error) {
        throw c.error;
    }
} catch (e) {
    console.error(e);
}

const kafkaBrokers = (process.env.kafkaBrokers || '').split(',');

export const configs: Configs = {
    kafkaBrokers,
};
