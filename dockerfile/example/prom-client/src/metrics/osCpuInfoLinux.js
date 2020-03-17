'use strict';

const client = require('prom-client');
const Gauge = client.Gauge;
const fs = require('fs');

const values = ['user', 'nice', 'system', 'idle', 'iowait', 'irq', 'softirq', 'steal', 'guest', 'guest_nice'];
const useValues = ['system_rate', 'user_rate'];
const KERNEL_TYPE = 'linux';

const CPU_USER_SUM = KERNEL_TYPE + '_cpu_user_sum';
const CPU_NICE_SUM = KERNEL_TYPE + '_cpu_nice_sum';
const CPU_SYSTEM_SUM = KERNEL_TYPE + '_cpu_system_sum';
const CPU_IDLE_SUM = KERNEL_TYPE + '_cpu_idle_sum';
const CPU_IOWAIT_SUM = KERNEL_TYPE + '_cpu_iowait_sum';
const CPU_IRQ_SUM = KERNEL_TYPE + '_cpu_irq_sum';
const CPU_SOFTIRQ_SUM = KERNEL_TYPE + '_cpu_softirq_sum';
const CPU_STEAL_SUM = KERNEL_TYPE + '_cpu_steal_sum';
const CPU_GUEST_SUM = KERNEL_TYPE + '_cpu_guest_sum';
const CPU_GUEST_NICE_SUM = KERNEL_TYPE + '_cpu_guest_nice_sum';

const CPU_SYSTEM_RATE = KERNEL_TYPE + '_cpu_system_rate';
const CPU_USER_RATE = KERNEL_TYPE + '_cpu_user_rate';

let pre_data = {
    user: 0,
    nice: 0,
    system: 0,
    idle: 0,
    iowait: 0,
    irq: 0,
    softirq: 0,
    steal: 0,
    guest: 0,
    guest_nice: 0,
    all: 0,
    system_rate: 0,
    user_rate: 0
};


function structureOutput(input) {
    const returnValue = {};

    const split = input.split('\n');
    // Get the value
    let value = split[0].split(/\s+/);

    for(let i in values) {
        returnValue[values[i]] = Number(value[Number(i)+1])
    };
    
    value = calculateCpu(returnValue);
    for(let i in useValues) {
        returnValue[useValues[i]] = value[i]
    };

    return returnValue;
}

function calculateCpu(data) {
    const returnValue = [];
     
    let all =  data.user + data.nice + data.system + data.idle + 
        data.iowait + data.irq + data.softirq;

    returnValue[0] = calculateSystem(all, data);    
    returnValue[1] = calculateUser(all, data);

    data['all'] = all;
    pre_data = data;
    return returnValue;
}

function calculateSystem(all, data) {
    return (data['system'] - pre_data['system'])/(all - pre_data['all']) * 100;
}

function calculateUser(all, data) {
    return (data['user'] - pre_data['user']) / (all - pre_data['all']) * 100;
}

module.exports = (registry, config = {}) => {

	const registers = registry ? [registry] : undefined;
	const namePrefix = config.prefix ? config.prefix : '';

    const osCpuUserSumGauge = new Gauge({
        name: namePrefix + CPU_USER_SUM,
    	help: 'Time running un-niced user processes total since the system first booted.',
    	registers
    });
    const osCpuNiceSumGauge = new Gauge({
        name: namePrefix + CPU_NICE_SUM,
    	help: 'Time running niced user processes total since the system first booted.',
    	registers
    });
    const osCpuSystemSumGauge = new Gauge({
        name: namePrefix + CPU_SYSTEM_SUM,
    	help: 'Time running kernel processes total since the system first booted.',
    	registers
    });
    const osCpuIdleSumGauge = new Gauge({
        name: namePrefix + CPU_IDLE_SUM,
    	help: 'Time idle total since the system first booted.',
    	registers
    });
    const osCpuIOWaitSumGauge = new Gauge({
    	name: namePrefix + CPU_IOWAIT_SUM,
    	help: 'Time waiting for I/O completion total since the system first booted.',
    	registers
    });
    const osCpuIrqSumGauge = new Gauge({
    	name: namePrefix + CPU_IRQ_SUM,
    	help: 'Time spent servicing hardware interrupts total since the system first booted.',
    	registers
    });
    const osCpuSoftIrqSumGauge = new Gauge({
    	name: namePrefix + CPU_SOFTIRQ_SUM,
    	help: 'Time spent servicing software interrupts total since the system first booted.',
    	registers
    });
    const osCpuStealSumGauge = new Gauge({
    	name: namePrefix + CPU_STEAL_SUM,
    	help: 'Time stolen from this vm by the hypervisor total since the system first booted.',
    	registers
    });
    const osCpuGuestSumGauge = new Gauge({
    	name: namePrefix + CPU_GUEST_SUM,
    	help: 'Running a normal guest total since the system first booted.',
    	registers
    });
    const osCpuGuestNiceSumGauge = new Gauge({
    	name: namePrefix + CPU_GUEST_NICE_SUM,
    	help: 'Running a niced guest total since the system first booted.',
    	registers
    });

    const osCpuSystemRateGauge = new Gauge({
        name: namePrefix + CPU_SYSTEM_RATE,
        help: 'Time running system processes as a percentage of total CPU time..',
        registers
    });
    const osCpuUserRateGauge = new Gauge({
        name: namePrefix + CPU_USER_RATE,
	    help: 'Time running user processes as a percentage of total CPU time.',
	    registers
    });

  return () => {
	  fs.readFile('/proc/stat', 'utf8', (err, status) => {
		if (err) {
				return;
			}
			const now = Date.now();
			const structuredOutput = structureOutput(status);
            
            osCpuUserSumGauge.set(structuredOutput.user, now);
            osCpuNiceSumGauge.set(structuredOutput.nice, now);
            osCpuSystemSumGauge.set(structuredOutput.system, now);
            osCpuIdleSumGauge.set(structuredOutput.idle, now);
            osCpuIOWaitSumGauge.set(structuredOutput.iowait, now);
            osCpuIrqSumGauge.set(structuredOutput.irq, now);
            osCpuSoftIrqSumGauge.set(structuredOutput.softirq, now);
            osCpuStealSumGauge.set(structuredOutput.steal, now);
            osCpuGuestSumGauge.set(structuredOutput.guest, now);
            osCpuGuestNiceSumGauge.set(structuredOutput.guest_nice, now);
            
            osCpuSystemRateGauge.set(structuredOutput.system_rate, now);
            osCpuUserRateGauge.set(structuredOutput.user_rate, now);
		});
	};
};

module.exports.metricNames = [
    CPU_USER_SUM,
    CPU_NICE_SUM,
    CPU_SYSTEM_SUM,
    CPU_IDLE_SUM,
    CPU_IOWAIT_SUM,
    CPU_IRQ_SUM,
    CPU_SOFTIRQ_SUM,
    CPU_STEAL_SUM,
    CPU_GUEST_SUM,
    CPU_GUEST_NICE_SUM,
    CPU_SYSTEM_RATE,
    CPU_USER_RATE
];