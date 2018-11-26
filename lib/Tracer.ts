import { initTracer as InitJaegerTracer, config, options, Tracer as OGTracer } from 'jaeger-client';
import { Span } from '../index';

//single instance
class Tracer {

	tracer: OGTracer;

	constructor(serviceName: string) {
		this.tracer = this.InitialiseTracer(serviceName)
	}

	StartSpan(name: string, rootSpan?: Span) {
		return new Span(name, rootSpan);
	}

	Close(){
		this.tracer.close()
	}

	private InitialiseTracer: any = (serviceName: string): OGTracer => {
		let config: config = this.GetConfig(serviceName);
		let options: options = this.GetOptions();

		return InitJaegerTracer(config, options)
	}


	private GetConfig(serviceName: string): config{
		return {
			serviceName: serviceName,
			sampler: {
				type: "const",
				param: 1
			},
			reporter: {
				logSpans: true
			},
		}
	}

	private GetOptions(): options {
		return {
			logger: {
				info(msg) {
					console.log("INFO ", msg);
				},
				error(msg) {
					console.error("ERROR ", msg);
				}
			}
		};
	}
}

export const tracer: Tracer = new Tracer('Cluster Log'); //Read a Tracing.json for name