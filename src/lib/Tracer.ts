import { initTracer as InitJaegerTracer, config, options, Tracer as OGTracer, opentracing, Span as OGSpan } from 'jaeger-client';
import { Span } from '../index';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

//Tracer: one to many Spans
class Tracer {
	_tracer: OGTracer;
	_consoleLogMsg: Boolean = false;

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
		let configuration: {} = this.ReadTraceConfig();
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

	private GetOptions(cfg: any): options {
		let options: options;
		try {
			if (!cfg.options)
				return this.SetOptions();

			if (cfg.options.consoleLogSpans === true)
				options = this.SetOptions();

			if (cfg.options.consoleLogMsg === true)
				this._consoleLogMsg = true;

			if (cfg.options.tags)
				options.tags = this.GetTags(cfg.options.tags);
		} catch { }

		return options;
	}

	private GetConfig(cfg: any): config {
		try {
			if (!cfg.config) {
				cfg.config = this.SetConfig()
			}

			if (cfg.config.disable === undefined) {
				cfg.config.disable = false;
			}

		} catch { }

		return cfg.config;
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

	private GetTags(inputTags: any): any {
		let tags: any = {};

		Object.keys(inputTags).forEach((key: string) => {
			switch (key) {
				case 'pid':
					tags.pid = process.pid;
					break;
				case 'arch':
					tags.arch = process.arch;
					break;
				case 'platform':
					tags.platform = process.platform;
					break;
				case 'startTime':
					tags.startTime = new Date().valueOf();
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