import { Span as OGSpan } from 'jaeger-client';
import { Tracer } from '../index'


//TODO(Steffen) add more info to parent Spans ie. pid, and previously discussed tags
export class Span {
	span: OGSpan;
	parentSpan: Span;

	constructor(name: string, root?: Span){
		if (root){
			this.span = Tracer.tracer.startSpan(name, {childOf: root.span});
			this.parentSpan = root;
		} else {
			this.span = Tracer.tracer.startSpan(name);
		}
	}

	/**
	 * Longer "messages" to log.
	 * @param logTitle - Title/index of the log.
	 * @param message - Message to be stored with the title.
	 * Simplified version of ".LogDetail()"
	 */
	Log(logTitle: string, message: string): void {
		this.span.log({[logTitle]: message});
	}

	/**
	 * Example:
	 * {'event': 'Error Thrown',
	 * 	'message': 'Divide by zero', 
	 *  'stack': 'A stack trace'}
	 * @param Logs - An object containing all key/values.
	 */
	LogDetail(Log: {}){
		this.span.log(Log)
	}

	/**
	 * 
	 * @param tag - Name/index of the tag.
	 * @param value - Value to be stored under the name.
	 */
	SetTag(tag: any, value: any): void {
		this.span.setTag(tag, value)
	}

	/**
	 * @returns {Tracer} - The tracer object used to create the spans (internally).
	 */
	Tracer(): any {
		return Tracer;
	}

	/**
	 * A shorthand for creating a childspan.
	 * @param name - Name of the childspan.
	 * @returns {Span} - Returns a new instance of Span.
	 */
	NewChildSpan(name: string): Span {
		return new Span(name, this);
	}

	/**
	 * Timestamp the end of the span/operation
	 */
	Finish(): void {
		this.span.finish();
	}
}