'use strict';

const client = require('prom-client');
const Gauge = client.Gauge;
const fs = require('fs');

const values = ['MemTotal', 'MemFree', 'MemAvailable', 'Buffers', 'Cached'];

const KERNEL_TYPE = 'linux';
const MEMORY_TOTAL = KERNEL_TYPE + '_memory_total';
const MEMORY_AVAILABLE = KERNEL_TYPE + '_memory_available';
const MEMORY_FREE = KERNEL_TYPE + '_memory_free';
const MEMORY_USED = KERNEL_TYPE + '_memory_used';
const BUFFERS = KERNEL_TYPE + '_buffers';
const CACHED = KERNEL_TYPE + '_cached';

function structureOutput(input) {
        const returnValue = {};

        input
                .split('\n')
                .filter(s => values.some(value => s.indexOf(value) === 0))
                .forEach(string => {
                                const split = string.split(':');

                                // Get the value
                                let value = split[1].trim();
                                // Remove trailing ` kb`
								value = value.substr(0, value.length - 3);
								// Make it into a number in bytes bytes
                                value = Number(value) * 1024;

                                returnValue[split[0]] = value;
                });

        return returnValue;
}

module.exports = (registry, config = {}) => {

	const registers = registry ? [registry] : undefined;
	const namePrefix = config.prefix ? config.prefix : '';

	const osMemTotalGauge = new Gauge({
		name: namePrefix + MEMORY_TOTAL,
		help: 'Total installed memory (MemTotal and SwapTotal in /proc/meminfo)',
		registers
	});
	const osMemAvailableGauge = new Gauge({
		name: namePrefix + MEMORY_AVAILABLE,
		help: 'Estimation of how much memory  is  available  for  starting  new applications,  without swapping',
		registers
	});
	const osMemFreeGauge = new Gauge({
		name: namePrefix + MEMORY_FREE,
		help: 'Unused memory (MemFree and SwapFree in /proc/meminfo)',
		registers
	});
	const osMemUsedGauge = new Gauge({
		name: namePrefix + MEMORY_USED,
		help: 'Used memory (calculated as total - free - buffers - cache)',
		registers
	});
	const osBuffersGauge = new Gauge({
		name: namePrefix + BUFFERS,
		help: 'Memory used by kernel buffers (Buffers in /proc/meminfo)',
		registers
	});
	const osCachedGauge = new Gauge({
		name: namePrefix + CACHED,
		help: 'Memory  used  by  the  page  cache and slabs (Cached and Slab in /proc/meminfo)',
		registers
    });	

	return () => {
		fs.readFile('/proc/meminfo', 'utf8', (err, status) => {
			if (err) {
				return;
			}
			const now = Date.now();
			const structuredOutput = structureOutput(status);
			
			osMemTotalGauge.set(structuredOutput.MemTotal, now);
			osMemAvailableGauge.set(structuredOutput.MemAvailable, now);
			osMemFreeGauge.set(structuredOutput.MemFree, now);
			osMemUsedGauge.set(structuredOutput.MemTotal - 
				structuredOutput.MemFree - structuredOutput.Buffers - structuredOutput.Cached, now);
			osBuffersGauge.set(structuredOutput.Buffers, now);
			osCachedGauge.set(structuredOutput.Cached, now);
		});
	};
};

module.exports.metricNames = [
	MEMORY_TOTAL,
	MEMORY_AVAILABLE,
	MEMORY_FREE,
	MEMORY_USED,
	BUFFERS,
	CACHED,
];