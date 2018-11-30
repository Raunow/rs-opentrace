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

	Log(logTitle: string, message: string): void {
		this._span.log({[logTitle]: message});
	}

	LogDetail(Log: {}){
		this._span.log(Log)
	}

	SetTag(tag: any, value: any): void {
		this._span.setTag(tag, value)
	}

	Tracer(): any {
		return Tracer;
	}

	NewChildSpan(name: string): Span {
		return new Span(name, this);
	}

	Finish(): void {
		this._span.finish();
	}
}