export interface reporter {
	logSpans: boolean,
	agentHost: string,
	agentPort: number,
	collectorEndPoint: string,
	username: string,
	password: string,
	flushIntervalMs: number
}