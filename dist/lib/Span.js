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
    Log(logTitle, message) {
        this._span.log({ [logTitle]: message });
    }
    LogDetail(Log) {
        this._span.log(Log);
    }
    SetTag(tag, value) {
        this._span.setTag(tag, value);
    }
    Tracer() {
        return index_1.Tracer;
    }
    NewChildSpan(name) {
        return new Span(name, this);
    }
    Finish() {
        this._span.finish();
    }
}
exports.Span = Span;
