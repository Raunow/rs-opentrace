"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
//Create new ones
class Span {
    constructor(name, root) {
        if (root) {
            this.span = index_1.Tracer.tracer.startSpan(name, { childOf: root.span });
        }
        else {
            this.span = index_1.Tracer.tracer.startSpan(name);
        }
    }
    Log(log) {
        this.span.log(log);
    }
    //tag: openTracing.Tags
    SetTag(tag, value) {
        this.span.setTag(tag, value);
    }
    Finish() {
        this.span.finish();
    }
    Tracer() {
        return index_1.Tracer;
    }
}
exports.Span = Span;
//# sourceMappingURL=Span.js.map