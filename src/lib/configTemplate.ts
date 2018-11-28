import { platform } from "os";

export interface wrapperconfig {
	config: {
		serviceName: string,
		disable: boolean,
		sampler: {
			type: string,
			param: number,
			host: string,
			port: number,
			refreshIntervalMs: number
		},
		reporter: {
			logSpans: boolean,
			agentHost: string,
			agentPort: number,
			collectorEndPoint: string,
			username: string,
			password: string,
			flushIntervalMs: number
		},
		throttler: {
			host: string,
			port: number,
			refreshintervalMs: number
		}
	},
	options: {
		tags: {
			uptime: boolean,
			pid: boolean,
			arch: boolean,
			platform: boolean
		}
	}
}