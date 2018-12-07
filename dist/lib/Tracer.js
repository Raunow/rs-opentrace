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
            let config = this.GetConfig(configuration);
            let options = this.GetOptions(configuration);
            return jaeger_client_1.initTracer(config, options);
        };
        this._tracer = this.InitialiseTracer();
    }
    StartSpan(name, rootSpan) {
        return new index_1.Span(name, rootSpan);
    }
    InjectIntoHeaders(span, headers) {
        this._tracer.inject(span._span, jaeger_client_1.opentracing.FORMAT_HTTP_HEADERS, headers);
    }
    ExtractFromRequest(request) {
        let spanContext = this._tracer.extract(jaeger_client_1.opentracing.FORMAT_HTTP_HEADERS, request.headers);
        if (spanContext === undefined)
            return null;
        let span = new index_1.Span(spanContext._operationName);
        span._span = spanContext;
        return span;
    }
    Close() {
        this._tracer.close();
    }
    ReadTraceConfig() {
        let PATH = path_1.resolve(__dirname, '../../../../..', 'traceconfig.json');
        if (fs_1.existsSync(PATH))
            return JSON.parse(fs_1.readFileSync(PATH).toString());
        return null;
    }
    GetOptions(cfg) {
        try {
            if (!cfg.options)
                return this.SetOptions();
            if (cfg.options.logToConsole)
                cfg.options = this.SetOptions();
            let tags = cfg.options.tags;
            if (!tags) {
                cfg.options.tags = this.GetTags(tags);
            }
        }
        catch (_a) { }
        return cfg.options;
    }
    GetConfig(cfg) {
        try {
            if (!cfg.config) {
                return this.SetConfig();
            }
        }
        catch (_a) { }
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
            serviceName: 'rs-opentracing',
            sampler: {
                type: "const",
                param: 1
            },
            reporter: {
                logSpans: true
            },
        };
    }
    GetTags(inputTags) {
        let tags = {};
        Object.keys(inputTags).forEach((key) => {
            switch (key) {
                case 'pid':
                    tags.pid = process.pid;
                    break;
                case 'startTime':
                    tags.startTime = new Date().valueOf();
                    break;
                case 'arch':
                    tags.arch = process.arch;
                    break;
                case 'platform':
                    tags.platform = process.platform;
                    break;
                case 'clientType':
                    tags.clientType = inputTags[key];
                    break;
                default:
                    tags[key] = inputTags[key];
                    break;
            }
        });
        return tags;
    }
}
exports.tracer = new Tracer();
