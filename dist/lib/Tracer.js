"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jaeger_client_1 = require("jaeger-client");
const index_1 = require("../index");
//single instance
class Tracer {
    constructor(serviceName) {
        this.InitialiseTracer = (serviceName) => {
            let config = this.GetConfig(serviceName);
            let options = this.GetOptions();
            return jaeger_client_1.initTracer(config, options);
        };
        this.tracer = this.InitialiseTracer(serviceName);
    }
    StartSpan(name, rootSpan) {
        return new index_1.Span(name, rootSpan);
    }
    Close() {
        this.tracer.close();
    }
    GetConfig(serviceName) {
        let cfg = {
            serviceName: serviceName,
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
}
exports.tracer = new Tracer('Cluster Log'); //Read a Tracing.json for name
