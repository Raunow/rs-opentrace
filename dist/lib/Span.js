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
    LogDetail(Log) {
        this._span.log(Log);
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
}
exports.Span = Span;
