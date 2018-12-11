import { Tracer as OGTracer } from 'jaeger-client';
import { Span } from '../index';
declare class Tracer {
    _tracer: OGTracer;
    _consoleLogMsg: Boolean;
    constructor();
    StartSpan(name: string, rootSpan?: Span): Span;
    InjectIntoHeaders(span: Span, headers: {}): void;
    ExtractFromRequest(request: any): Span;
    Close(): void;
    private InitialiseTracer;
    private ReadTraceConfig;
    private GetOptions;
    private GetConfig;
    private SetConfig;
    private SetOptions;
    private GetTags;
}
export declare const tracer: Tracer;
export {};
