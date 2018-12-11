import { Span as OGSpan } from 'jaeger-client';
export declare class Span {
    _span: OGSpan;
    _parentSpan: Span;
    constructor(name: string, root?: Span);
    ChildSpan(name: string): Span;
    AddLogs(Log: {}): void;
    Log(logTitle: string, message: string): void;
    LogError(reason: string, error: Error): void;
    Tag(tag: string, value: any): void;
    AddTags(tags: {}): void;
    readonly Tracer: any;
    Finish(): void;
    private _TrimStackTrace;
}
