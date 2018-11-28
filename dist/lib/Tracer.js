"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jaeger_client_1 = require("jaeger-client");
const index_1 = require("../index");
const fs_1 = require("fs");
const path = require("path");
//Tracer: one to many Spans
class Tracer {
    constructor() {
        this.InitialiseTracer = () => {
            let PATH = path.resolve(__dirname, '../../../../..', 'traceconfig.json');
            let config;
            let options;
            if (fs_1.existsSync(PATH)) {
                let jsonConfigs = JSON.parse(fs_1.readFileSync(PATH).toString());
                config = jsonConfigs.config;
                options = jsonConfigs.options;
            }
            if (options === undefined) {
                options = this.GetOptions();
            }
            else {
                let tags = options.tags;
                if (tags !== undefined) {
                    options.tags = this.GetTags(tags.uptime, tags.pid, tags.arch, tags.platform);
                }
            }
            if (config === undefined) {
                config = this.GetConfig();
            }
            return jaeger_client_1.initTracer(config, options);
        };
        this.tracer = this.InitialiseTracer();
    }
    /**
     * Create a new Span.
     * @param name - Name of the span/Operation.
     * @param rootSpan - Parent span if any.
     * @returns {Span} - New instance of span with/without a parent.
     */
    StartSpan(name, rootSpan) {
        return new index_1.Span(name, rootSpan);
    }
    /**
     * @param span - The span to inject as baggage.
     * @param headers - the headers to be injected with a span.
     */
    InjectIntoHeaders(span, headers) {
        this.tracer.inject(span.span, jaeger_client_1.opentracing.FORMAT_HTTP_HEADERS, headers);
    }
    /**
     * @param request - The request to extract a span from.
     * @returns {Span} - Extracted from the headers.
     */
    ExtractFromRequest(request) {
        let spanContext;
        try {
            spanContext = this.tracer.extract(jaeger_client_1.opentracing.FORMAT_HTTP_HEADERS, request.headers);
        }
        catch (_a) {
            //if the headers didn't contain a span.
            return null;
        }
        let span = new index_1.Span(spanContext._operationName);
        span.span = spanContext;
        return span;
    }
    /**
     * closing a tracer stops the sending of spans
     */
    Close() {
        this.tracer.close();
    }
    GetConfig() {
        let cfg = {
            serviceName: process.env.npm_package_name,
            sampler: {
                type: "const",
                param: 1
            },
            reporter: {
                logSpans: true
            },
        };
        return cfg;
    }
    GetOptions() {
        let opts = {
            logger: {
                info(msg) {
                    console.log("INFO ", msg);
                },
                error(msg) {
                    console.error("ERROR ", msg);
                }
            }
        };
        return opts;
    }
    GetTags(uptime = false, pid = false, arch = false, platform = false) {
        let tags = {};
        if (uptime) {
            tags.uptime = process.uptime();
        }
        if (pid) {
            tags.pid = process.pid;
        }
        if (arch) {
            tags.arch = process.arch;
        }
        if (platform) {
            tags.platform = process.platform;
        }
        return tags;
    }
}
exports.tracer = new Tracer(); //Read a Tracing.json for name
