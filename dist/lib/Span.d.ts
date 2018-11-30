import { Span as OGSpan } from 'jaeger-client';
export declare class Span {
    _span: OGSpan;
    _parentSpan: Span;
    constructor(name: string, root?: Span);
    ChildSpan(name: string): Span;
    Log(logTitle: string, message: string): void;
    AddLogs(Log: {}): void;
    Tag(tag: any, value: any): void;
    AddTags(tags: {}): void;
    readonly Tracer: any;
    Finish(): void;
}
