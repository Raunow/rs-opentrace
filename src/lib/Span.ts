import { Span as OGSpan } from 'jaeger-client';
import { Tracer } from '../index'

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
}