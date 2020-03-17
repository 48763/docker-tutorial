'use strict';

const client = require('prom-client');
const Histogram = client.Histogram;

const HEADER = 'http_request';
const DURATION_MS = HEADER + '_duration_ms';
const SIZE_BYTES = HEADER + '_size_bytes';

module.exports = (registry, config = {}) => {

    const registers = registry ? [registry] : undefined;
    const namePrefix = config.prefix ? config.prefix : '';

    const httpRequestDurationMs = new Histogram({
        name: namePrefix + DURATION_MS,
        help: 'Duration of HTTP requests in ms.',
        labelNames: ['route', 'method', 'code'],
        buckets: [0.1, 1, 4, 16, 64, 128, 256],
        registers
    })

    function statRecord(config = {}) {
        const packet = config.packet;
        const responseTime = Date.now() - packet.localsStartEpoch;
        httpRequestDurationMs
            .labels(packet.path, packet.method, packet.statusCode)
            .observe(responseTime);
    }

    return (req, res, next) => {
        statRecord({
            'packet' : {
                path : req.route.path, 
                method : req.method, 
                statusCode : res.statusCode,
                localsStartEpoch : res.locals.startEpoch
              }
          });
        next();
    };
};

module.exports.metricNames = [
	DURATION_MS
];
