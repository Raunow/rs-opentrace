import { initTracer as InitJaegerTracer, config, options, Tracer as OGTracer, opentracing, Span as OGSpan } from 'jaeger-client';
import { Span } from '../index';
import { existsSync, readFileSync } from 'fs';
import { TraceConfig } from '../config-template/traceconfig';
import { tags } from '../config-template/tags';
import { resolve } from 'path';

//Tracer: one to many Spans
class Tracer {
	_tracer: OGTracer;

	constructor() {
		this._tracer = this.InitialiseTracer()
	}

	StartSpan(name: string, rootSpan?: Span) {
		return new Span(name, rootSpan);
	}

	InjectIntoHeaders(span: Span, headers: {}) {
		this._tracer.inject(span._span, opentracing.FORMAT_HTTP_HEADERS, headers)
	}

	ExtractFromRequest(request: any): Span {
		let spanContext: OGSpan = this._tracer.extract(opentracing.FORMAT_HTTP_HEADERS, request.headers);

		if (spanContext === undefined)
			return null;

		let span: Span = new Span(spanContext._operationName);
		span._span = spanContext

		return span;
	}

	Close() {
		this._tracer.close()
	}

	private InitialiseTracer: any = (): OGTracer => {
		let configuration: TraceConfig = this.ReadTraceConfig();
		let config: config = this.GetConfig(configuration);
		let options: options = this.GetOptions(configuration);

		return InitJaegerTracer(config, options);
	}

	private ReadTraceConfig() {
		let PATH: string = resolve(__dirname, '../../../../..', 'traceconfig.json')

		if (existsSync(PATH))
			return JSON.parse(readFileSync(PATH).toString());

		return null;
	}

	private GetOptions(cfg: TraceConfig): config {
		try {
			if (!cfg.options)
				return this.SetOptions();

			if (cfg.options.logToConsole)
				cfg.options = this.SetOptions();

			let tags: any = cfg.options.tags;
			if (!tags){
				cfg.options.tags = this.GetTags(tags);
			}
		} catch { }

		return cfg.options;
	}

	private GetConfig(cfg: TraceConfig): config {
		try {
			if (!cfg.config) {
				return this.SetConfig()
			}
		} catch { }
	}

	private SetOptions(): options {
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

	private SetConfig(): config {
		return {
			serviceName: 'rs-opentracing',
			sampler: {
				type: "const",
				param: 1
			},
			reporter: {
				logSpans: true
			},
		}
	}

	private GetTags(inputTags: any): any {
		let tags: any = {};

		Object.keys(inputTags).forEach((key: string) => {
			switch (key){
				case 'pid':
					tags.pid = process.pid;
					break;
				case 'startTime':
					tags.startTime = new Date().valueOf();
					break;
				case 'arch':
					tags.arch = process.arch;
					break;
				case 'platform':
					tags.platform = process.platform;
					break;
				case 'clientType':
					tags.clientType = inputTags[key];
					break;
				default:
					tags[key] = inputTags[key];
					break;
			}
		});

		return tags;
	}
}

export const tracer: Tracer = new Tracer();