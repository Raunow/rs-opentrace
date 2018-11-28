import { initTracer as InitJaegerTracer, config, options, Tracer as OGTracer, opentracing, Span as OGSpan } from 'jaeger-client';
import { Span } from '../index';
import { existsSync, readFileSync } from 'fs';
import { wrapperconfig } from './configTemplate';

//Tracer: one to many Spans
class Tracer {
	tracer: OGTracer;

	constructor() {
		this.tracer = this.InitialiseTracer()
	}

	/**
	 * Create a new Span.
	 * @param name - Name of the span/Operation.
	 * @param rootSpan - Parent span if any.
	 * @returns {Span} - New instance of span with/without a parent.
	 */
	StartSpan(name: string, rootSpan?: Span) {
		return new Span(name, rootSpan);
	}

	/**
	 * @param span - The span to inject as baggage.
	 * @param headers - the headers to be injected with a span.
	 */
	InjectIntoHeaders(span: Span, headers: {}){
		this.tracer.inject(span.span, opentracing.FORMAT_HTTP_HEADERS, headers)
	}
	 
	/**
	 * @param request - The request to extract a span from.
	 * @returns {Span} - Extracted from the headers.
	 */
	ExtractFromRequest(request: any): Span {
		let spanContext: OGSpan;
		try {
			spanContext = this.tracer.extract(opentracing.FORMAT_HTTP_HEADERS, request.headers);
		} 
		catch {
			//if the headers didn't contain a span.
			return null;
		}
		let span: Span =  new Span(spanContext._operationName);
		span.span = spanContext;
		return span;
	}

	/**
	 * closing a tracer stops the sending of spans
	 */
	Close() {
		this.tracer.close()
	}

	private InitialiseTracer: any = (): OGTracer => {
		let PATH: string = '../../traceconfig.json';
		let config: config;
		let options: options;
		if (existsSync(PATH)) {
			let jsonConfigs: wrapperconfig;
			console.log(jsonConfigs = (readFileSync(PATH).toJSON().data)[0] as wrapperconfig);
			config = jsonConfigs.config;
			options = jsonConfigs.options
		} else {
			config = this.GetConfig();
			options = this.GetOptions();
		}
		options.tags = this.GetTags(options.tags);
		return InitJaegerTracer(config, options);
	}


	private GetConfig(): config {
		let cfg: config = {
			serviceName: process.env.npm_package_name,
			sampler: {
				type: "const",
				param: 1
			},
			reporter: {
				logSpans: true
			},
		}

		return cfg;
	}

	private GetOptions(): options {
		let opts: options = {
			logger: {
				info(msg) {
					console.log("INFO ", msg);
				},
				error(msg) {
					console.error("ERROR ", msg);
				}
			}
		};

		return opts
	}

	private GetTags(opts:{ uptime?: boolean, pid?: boolean, arch?: boolean, platform?:boolean } ) {
		let tags: any = {};
		if (opts.uptime){
			tags.uptime = process.uptime();
		}
		if (opts.pid){
			tags.pid = process.pid;
		}
		if (opts.arch){
			tags.arch = process.arch;
		}
		if (opts.platform){
			process.platform;
		}

		return tags;
	}
}

export const tracer: Tracer = new Tracer(); //Read a Tracing.json for name