"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
//TODO(Steffen) add more info to parent Spans ie. pid, and previously discussed tags
class Span {
    constructor(name, root) {
        if (root) {
            this.span = index_1.Tracer.tracer.startSpan(name, { childOf: root.span });
            this.parentSpan = root;
        }
        else {
            this.span = index_1.Tracer.tracer.startSpan(name);
        }
    }
    /**
     * Longer "messages" to log.
     * @param logTitle - Title/index of the log.
     * @param message - Message to be stored with the title.
     * Simplified version of ".LogDetail()"
     */
    Log(logTitle, message) {
        this.span.log({ [logTitle]: message });
    }
    /**
     * Example:
     * {'event': 'Error Thrown',
     * 	'message': 'Divide by zero',
     *  'stack': 'A stack trace'}
     * @param Logs - An object containing all key/values.
     */
    LogDetail(Log) {
        this.span.log(Log);
    }
    /**
     *
     * @param tag - Name/index of the tag.
     * @param value - Value to be stored under the name.
     */
    SetTag(tag, value) {
        this.span.setTag(tag, value);
    }
    /**
     * @returns {Tracer} - The tracer object used to create the spans (internally).
     */
    Tracer() {
        return index_1.Tracer;
    }
    /**
     * A shorthand for creating a childspan.
     * @param name - Name of the childspan.
     * @returns {Span} - Returns a new instance of Span.
     */
    NewChildSpan(name) {
        return new Span(name, this);
    }
    /**
     * Timestamp the end of the span/operation
     */
    Finish() {
        this.span.finish();
    }
}
exports.Span = Span;
