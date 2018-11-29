import { initTracer as InitJaegerTracer, config, options, Tracer as OGTracer, opentracing, Span as OGSpan } from 'jaeger-client';
import { Span } from '../index';
import { existsSync, readFileSync } from 'fs';
import { TraceConfig } from '../config-template/traceconfig';
import { tags } from '../config-template/tags';
import { resolve } from 'path';

//Tracer: one to many Spans
class Tracer {
	tracer: OGTracer;

	constructor() {
		this.tracer = this.InitialiseTracer()
	}

	StartSpan(name: string, rootSpan?: Span) {
		return new Span(name, rootSpan);
	}

	InjectIntoHeaders(span: Span, headers: {}){
		this.tracer.inject(span._span, opentracing.FORMAT_HTTP_HEADERS, headers)
	}

	ExtractFromRequest(request: any): Span {
		let spanContext: OGSpan = this.tracer.extract(opentracing.FORMAT_HTTP_HEADERS, request.headers);
		
		if (spanContext === undefined) 
			return null;

		let span: Span =  new Span(spanContext._operationName);
		span._span = spanContext
		
		return span;
	}

	Close() {
		this.tracer.close()
	}

	private InitialiseTracer: any = (): OGTracer => {
		let configuration: TraceConfig = this.ReadTraceConfig();
		let options: options = this.GetOptions(configuration);
		let config: config = this.GetConfig(configuration);

		return InitJaegerTracer(config, options);
	}

	private ReadTraceConfig(){
		let PATH: string = resolve(__dirname, '../../../../..', 'traceconfig.json')

		if (existsSync(PATH)) 
			return JSON.parse(readFileSync(PATH).toString());
		
		return null;
	}
	private GetOptions(cfg: TraceConfig): config{
		if (cfg.options === undefined)
			return this.SetOptions();
		
		let tags: tags = cfg.options.tags;
		if (tags !== undefined)
			cfg.options.tags = this.SetTags(tags.pid, tags.arch, tags.platform);
		
		return cfg.options;
	}
	private GetConfig(cfg: TraceConfig): config {
		if (cfg.config === undefined)
			return this.SetConfig()
		
		return cfg.config;
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
			serviceName: process.env.npm_package_name,
			sampler: {
				type: "const",
				param: 1
			},
			reporter: {
				logSpans: true
			},
		}
	}
	private SetTags(pid: boolean = false, arch: boolean = false, platform:boolean = false) {
		let tags: any = {};

		if (pid)
			tags.pid = process.pid;
		
		if (arch)
			tags.arch = process.arch;
		
		if (platform)
			tags.platform = process.platform;
		
		return tags;
	}
}

export const tracer: Tracer = new Tracer();