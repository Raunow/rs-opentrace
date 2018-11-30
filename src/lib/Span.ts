import { Span as OGSpan } from 'jaeger-client';
import { Tracer, Tags } from '../index'

export class Span {
	_span: OGSpan;
	_parentSpan: Span;

	constructor(name: string, root?: Span){
		if (root){
			this._span = Tracer._tracer.startSpan(name, {childOf: root._span});
			this._parentSpan = root;
		} else {
			this._span = Tracer._tracer.startSpan(name);
		}
	}

	ChildSpan(name: string): Span {
		return new Span(name, this);
	}

	Log(logTitle: string, message: string): void {
		this._span.log({[logTitle]: message});
	}
	AddLogs(Log: {}){
		this._span.log(Log)
	}
	LogError(reason: string, error: Error){
		this.Tag(Tags.ERROR, true);
		this.AddLogs({
			[Tags.ERROR]: `Invalid request body`,
			'error.name': error.name,
			'error.stack': this._TrimStackTrace(error)});
	}

	Tag(tag: any, value: any): void {
		this._span.setTag(tag, value)
	}
	AddTags(tags: {}){
		this._span.addTags(tags);
	}

	get Tracer(): any {
		return Tracer;
	}

	Finish(): void {
		this._span.finish();
	}

	private _TrimStackTrace(stack: string | Error){
		let trace: Array<string>;

		if (typeof stack === typeof Error)
			trace = (stack as Error).stack.replace(/^Error\s+/, '').split("\n");
		else
			trace = (stack as string).replace(/^Error\s+/, '').split("\n");
		
		for (let i = 0; i < 8; i++) 
			trace.pop();

		let done: Array<string> = new Array<string>();

		trace.forEach(function (caller: string) {
			let temp: string = caller.split("\\").pop();
			caller = caller.replace(/at /, '').replace(/\@.+/, '').replace(/ \(.+\)/, '');

			done.push((`${caller} (${temp}`).trim());
		});
		
		return done.join("\n");
	}
}