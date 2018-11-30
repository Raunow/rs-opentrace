import { config } from './config';
import { tags } from './tags';
export interface TraceConfig {
    config: config;
    options: {
        tags: tags;
    };
}
