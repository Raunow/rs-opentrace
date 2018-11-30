import { sampler } from './sampler';
import { reporter } from './reporter';
import { throttler } from './throttler';
export interface config {
    serviceName: string;
    disable: boolean;
    sampler: sampler;
    reporter: reporter;
    throttler: throttler;
}
