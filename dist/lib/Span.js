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
        if (index_1.Tracer._consoleLogMsg) {
            console.log(`S> ${name}`);
        }
    }
    ChildSpan(name) {
        return new Span(name, this);
    }
    AddLogs(Log) {
        this._span.log(Log);
        if (index_1.Tracer._consoleLogMsg) {
            Object.keys(Log).forEach((key) => {
                console.info(`L> ${key}`, Log[key]);
            });
        }
    }
    Log(logTitle, message) {
        this.AddLogs({ [logTitle]: message });
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
        if (index_1.Tracer._consoleLogMsg) {
            console.info(`T> ${tag}`, value);
        }
    }
    AddTags(tags) {
        this._span.addTags(tags);
        if (index_1.Tracer._consoleLogMsg) {
            Object.keys(tags).forEach((key) => {
                console.info(`T> ${key}`, tags[key]);
            });
        }
    }
    get Tracer() {
        return index_1.Tracer;
    }
    Finish() {
        this._span.finish();
    }
    _TrimStackTrace(error) {
        let trace;
        let done = new Array();
        trace = error.stack.replace(/^Error\s+/, '').split("\n");
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
