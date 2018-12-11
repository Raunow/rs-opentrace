import { Span as OGSpan } from 'jaeger-client';
import { Tracer, Tags } from '../index'

export class Span {
	_span: OGSpan;
	_parentSpan: Span;

	constructor(name: string, root?: Span) {
		if (root) {
			this._span = Tracer._tracer.startSpan(name, { childOf: root._span });
			this._parentSpan = root;
		} else {
			this._span = Tracer._tracer.startSpan(name);
		}

		if (Tracer._consoleLogMsg){
			console.log(`S> ${name}`);
		}
	}

	ChildSpan(name: string): Span {
		return new Span(name, this);
	}

	AddLogs(Log: {}) {
		this._span.log(Log)

		if (Tracer._consoleLogMsg){
			Object.keys(Log).forEach((key: string) => {
				console.info(`L> ${key}`, Log[key])
			});
		}
	}
	Log(logTitle: string, message: string): void {
		this.AddLogs({ [logTitle]: message });
	}
	LogError(reason: string, error: Error) {
		this.Tag(Tags.ERROR, true);
		this.AddLogs({
			[Tags.ERROR]: reason,
			'error.name': error.name,
			'error.stack': this._TrimStackTrace(error)
		});
	}

	Tag(tag: string, value: any): void {
		this._span.setTag(tag, value);

		if (Tracer._consoleLogMsg){
			console.info(`T> ${tag}`, value);
		}
	}
	AddTags(tags: {}) {
		this._span.addTags(tags);

		if (Tracer._consoleLogMsg){
			Object.keys(tags).forEach((key: string) => {
				console.info(`T> ${key}`, tags[key])
			});
		}
	}

	get Tracer(): any {
		return Tracer;
	}

	Finish(): void {
		this._span.finish();
	}

	private _TrimStackTrace(error: Error) {
		let trace: Array<string>;
		let done: Array<string> = new Array<string>();

			trace = error.stack.replace(/^Error\s+/, '').split("\n");

		trace.forEach(function (caller: string) {
			let src: string = caller.split("\\").pop().replace(/\s*?at .*? \(/, '');
			let match = caller.match(/at (.*?) /);

			if (match) {
				caller = match[1];
				done.push(caller + " (" + src);
			}
		})

		return done.join("\n");
	}
}