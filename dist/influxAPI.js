'use strict';

System.register(['./utils'], function (_export, _context) {
	"use strict";

	var utils, insert, split, writeLine, writeSplitLine;


	function isOK(val) {
		return val !== null && val !== undefined && val !== '' && val !== 'No Category' && val !== 'No Reasons';
	}
	return {
		setters: [function (_utils) {
			utils = _utils;
		}],
		execute: function () {
			_export('insert', insert = async function insert(measurement, current, data) {
				var line = writeLine(measurement, current, data);
				var url = utils.influxHost + 'write?db=smart_factory';
				var result = await utils.sure(utils.post(url, line));
				return result;
			});

			_export('insert', insert);

			_export('split', split = async function split(newTimeStamp, currentEvent, form, measurement) {
				var oldTimeStamp = form.min * 1000000;
				var maxTimeStamp = form.max * 1000000;

				var lineForLeft = writeSplitLine(oldTimeStamp, newTimeStamp, maxTimeStamp, currentEvent.record, form, measurement, true);
				var lineForRight = writeSplitLine(oldTimeStamp, newTimeStamp, maxTimeStamp, currentEvent.record, form, measurement, false);

				var url = utils.influxHost + 'write?db=' + utils.influxDBName;

				var leftResult = await utils.sure(utils.post(url, lineForLeft));
				if (!leftResult.ok) {
					return leftResult;
				}
				var rightResult = await utils.sure(utils.post(url, lineForRight));
				if (!rightResult.ok) {
					return rightResult;
				}

				return rightResult;
			});

			_export('split', split);

			writeLine = function writeLine(measurement, current, data) {
				var cur = current.record;
				var timestamp = current.timestamp;

				var line = measurement + ',Site=' + utils.addSlash(cur.site) + ',Area=' + utils.addSlash(cur.area) + ',Line=' + utils.addSlash(cur.line) + ' ';

				if (isOK(cur.stopped)) {
					line += 'stopped=' + cur.stopped + ',';
				}
				if (isOK(cur.idle)) {
					line += 'idle=' + cur.idle + ',';
				}
				if (isOK(cur.execute)) {
					line += 'execute=' + cur.execute + ',';
				}
				if (isOK(cur.held)) {
					line += 'held=' + cur.held + ',';
				}
				if (isOK(cur.complete)) {
					line += 'complete=' + cur.complete + ',';
				}

				if (isOK(cur.status)) {
					line += 'status="' + cur.status + '",';
				}
				if (isOK(cur.machinestate)) {
					line += 'MachineState="' + cur.machinestate + '",';
				}

				if (isOK(cur.actual_rate)) {
					line += 'actual_rate=' + cur.actual_rate + ',';
				}

				if (isOK(cur.rid_1)) {
					line += 'rid_1="' + cur.rid_1 + '",';
				}

				line += isOK(data.comment) ? 'comment="' + data.comment + '",' : 'comment="",';
				line += isOK(data.equipment) ? 'equipment="' + data.equipment + '",' : 'equipment="",';

				if (data.reasons.length !== 0) {
					line += 'parentReason="' + data.reasons[0] + '",';
					line += 'reason="' + data.reasons.join(' | ') + '",';
				}
				line += 'category="' + data.category + '" ';
				line += timestamp;

				return line;
			};

			writeSplitLine = function writeSplitLine(oldTimeStamp, newTimeStamp, maxTimeStamp, cur, form, measurement, isLeftLine) {
				var line = measurement + ',Site=' + utils.addSlash(cur.site) + ',Area=' + utils.addSlash(cur.area) + ',Line=' + utils.addSlash(cur.line) + ' ';

				if (isOK(cur.stopped)) {
					line += 'stopped=' + cur.stopped + ',';
				}
				if (isOK(cur.idle)) {
					line += 'idle=' + cur.idle + ',';
				}
				if (isOK(cur.execute)) {
					line += 'execute=' + cur.execute + ',';
				}
				if (isOK(cur.held)) {
					line += 'held=' + cur.held + ',';
				}
				if (isOK(cur.complete)) {
					line += 'complete=' + cur.complete + ',';
				}
				if (isOK(cur.status)) {
					line += 'status="' + cur.status + '",';
				}
				if (isOK(cur.machinestate)) {
					line += 'MachineState="' + cur.machinestate + '",';
				}
				if (isOK(cur.actual_rate)) {
					line += 'actual_rate=' + cur.actual_rate + ',';
				}

				if (isLeftLine) {
					// writing left line
					if (form.meta.isSplittingLeft) {
						// is splitting left
						line += isOK(form.comment) ? 'comment="' + form.comment + '",' : 'comment="",';
						line += isOK(form.equipment) ? 'equipment="' + form.equipment + '",' : 'equipment="",';
						if (isOK(form.category)) {
							line += 'category="' + form.category + '",';
						}
						if (isOK(form.reasons)) {
							line += 'parentReason="' + form.reasons.split(' | ')[0] + '",';
							line += 'reason="' + form.reasons + '",';
						}
						if (isOK(form.machinestate)) {
							line += 'MachineState="' + form.machinestate + '",';
						}
					} else {
						// is splitting right
						if (isOK(cur.comment)) {
							line += 'comment="' + cur.comment + '",';
						}
						if (isOK(cur.equipment)) {
							line += 'equipment="' + cur.equipment + '",';
						}
						if (isOK(cur.category)) {
							line += 'category="' + cur.category + '",';
						}
						if (isOK(cur.parentreason)) {
							line += 'parentReason="' + cur.parentreason + '",';
						}
						if (isOK(cur.reason)) {
							line += 'reason="' + cur.reason + '",';
						}
					}

					if (line[line.length - 1] === ',') {
						line = line.substring(0, line.length - 1);
					}
					line += ' ' + oldTimeStamp;
				} else {
					// write right line
					if (!form.meta.isSplittingLeft) {
						// is splitting right
						line += isOK(form.comment) ? 'comment="' + form.comment + '",' : 'comment="",';
						line += isOK(form.equipment) ? 'equipment="' + form.equipment + '",' : 'equipment="",';
						if (isOK(form.category)) {
							line += 'category="' + form.category + '",';
						}
						if (isOK(form.reasons)) {
							line += 'parentReason="' + form.reasons.split(' | ')[0] + '",';
							line += 'reason="' + form.reasons + '",';
						}
					}

					if (line[line.length - 1] === ',') {
						line = line.substring(0, line.length - 1);
					}
					line += ' ' + newTimeStamp;
				}

				return line;
			};
		}
	};
});
//# sourceMappingURL=influxAPI.js.map
