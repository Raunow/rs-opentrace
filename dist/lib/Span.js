"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
class Span {
    constructor(name, root) {
        if (root) {
            this._span = index_1.Tracer._tracer.startSpan(name, { childOf: root._span });
            this._parentSpan = root;
        }
        else {
            this._span = index_1.Tracer._tracer.startSpan(name);
        }
    }
    ChildSpan(name) {
        return new Span(name, this);
    }
    Log(logTitle, message) {
        this._span.log({ [logTitle]: message });
    }
    AddLogs(Log) {
        this._span.log(Log);
    }
    LogError(reason, error) {
        this.Tag(index_1.Tags.ERROR, true);
        this.AddLogs({
            [index_1.Tags.ERROR]: `Invalid request body`,
            'error.name': error.name,
            'error.stack': this._TrimStackTrace(error)
        });
    }
    Tag(tag, value) {
        this._span.setTag(tag, value);
    }
    AddTags(tags) {
        this._span.addTags(tags);
    }
    get Tracer() {
        return index_1.Tracer;
    }
    Finish() {
        this._span.finish();
    }
    _TrimStackTrace(stack) {
        let trace;
        if (typeof stack === typeof Error)
            trace = stack.stack.replace(/^Error\s+/, '').split("\n");
        else
            trace = stack.replace(/^Error\s+/, '').split("\n");
        for (let i = 0; i < 8; i++)
            trace.pop();
        let done = new Array();
        trace.forEach(function (caller) {
            let temp = caller.split("\\").pop();
            caller = caller.replace(/at /, '').replace(/\@.+/, '').replace(/ \(.+\)/, '');
            done.push((`${caller} (${temp}`).trim());
        });
        return done.join("\n");
    }
}
exports.Span = Span;
