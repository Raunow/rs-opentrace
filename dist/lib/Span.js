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
            [index_1.Tags.ERROR]: reason,
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
        let done = new Array();
        if (typeof stack === typeof Error)
            trace = stack.stack.replace(/^Error\s+/, '').split("\n");
        else
            trace = stack.replace(/^Error\s+/, '').split("\n");
        trace.forEach(function (caller) {
            let src = caller.split("\\").pop().replace(/\s*?at .*? \(/, '');
            let match = caller.match(/at (.*?) /);
            if (match) {
                caller = match[1];
                done.push(caller + " (" + src);
            }
        });
        return done.join("\n");
    }
}
exports.Span = Span;
