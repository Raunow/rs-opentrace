"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jaeger_client_1 = require("jaeger-client");
const index_1 = require("../index");
const fs_1 = require("fs");
const path_1 = require("path");
//Tracer: one to many Spans
class Tracer {
    constructor() {
        this.InitialiseTracer = () => {
            let configuration = this.ReadTraceConfig();
            let options = this.GetOptions(configuration);
            let config = this.GetConfig(configuration);
            return jaeger_client_1.initTracer(config, options);
        };
        this.tracer = this.InitialiseTracer();
    }
    StartSpan(name, rootSpan) {
        return new index_1.Span(name, rootSpan);
    }
    InjectIntoHeaders(span, headers) {
        this.tracer.inject(span._span, jaeger_client_1.opentracing.FORMAT_HTTP_HEADERS, headers);
    }
    ExtractFromRequest(request) {
        let spanContext = this.tracer.extract(jaeger_client_1.opentracing.FORMAT_HTTP_HEADERS, request.headers);
        if (spanContext === undefined)
            return null;
        let span = new index_1.Span(spanContext._operationName);
        span._span = spanContext;
        return span;
    }
    Close() {
        this.tracer.close();
    }
    ReadTraceConfig() {
        let PATH = path_1.resolve(__dirname, '../../../../..', 'traceconfig.json');
        if (fs_1.existsSync(PATH))
            return JSON.parse(fs_1.readFileSync(PATH).toString());
        return null;
    }
    GetOptions(cfg) {
        if (cfg.options === undefined)
            return this.SetOptions();
        let tags = cfg.options.tags;
        if (tags !== undefined)
            cfg.options.tags = this.SetTags(tags.pid, tags.arch, tags.platform);
        return cfg.options;
    }
    GetConfig(cfg) {
        if (cfg.config === undefined)
            return this.SetConfig();
        return cfg.config;
    }
    SetOptions() {
        return {
            logger: {
                info(msg) {
                    console.log("INFO ", msg);
                },
                error(msg) {
                    console.error("ERROR ", msg);
                }
            }
        };
    }
    SetConfig() {
        return {
            serviceName: process.env.npm_package_name,
            sampler: {
                type: "const",
                param: 1
            },
            reporter: {
                logSpans: true
            },
        };
    }
    SetTags(pid = false, arch = false, platform = false) {
        let tags = {};
        if (pid)
            tags.pid = process.pid;
        if (arch)
            tags.arch = process.arch;
        if (platform)
            tags.platform = process.platform;
        return tags;
    }
}
exports.tracer = new Tracer();
