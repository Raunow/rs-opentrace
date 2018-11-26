import { Span as OGSpan } from 'jaeger-client';
import { Tracer } from '../index'


//Create new ones
export class Span {
	span: OGSpan;

	constructor(name: string, root?: Span){
		if (root){
			this.span = Tracer.tracer.startSpan(name, {childOf: root.span});
		} else {
			this.span = Tracer.tracer.startSpan(name);
		}
	}

	Log(log: {}){
		this.span.log(log);
	}

	//tag: openTracing.Tags
	SetTag(tag: any, value: any){
		this.span.setTag(tag, value)
	}


	Finish(){
		this.span.finish();
	}

	Tracer(){
		return Tracer;
	}
}