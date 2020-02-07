/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "35964b9096c08be6da41";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};

module.exports.formatError = function(err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?100":
/*!*********************************!*\
  !*** (webpack)/hot/poll.js?100 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?100"))

/***/ }),

/***/ "./src/LoadEnv.ts":
/*!************************!*\
  !*** ./src/LoadEnv.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const dotenv_1 = tslib_1.__importDefault(__webpack_require__(/*! dotenv */ "dotenv"));
const command_line_args_1 = tslib_1.__importDefault(__webpack_require__(/*! command-line-args */ "command-line-args"));
const options = command_line_args_1.default([
    {
        name: 'env',
        alias: 'e',
        defaultValue: 'production',
        type: String,
    },
]);
const result2 = dotenv_1.default.config({
    path: `./env/${options.env}.env`,
});
if (result2.error) {
    throw result2.error;
}


/***/ }),

/***/ "./src/api/ApiController.ts":
/*!**********************************!*\
  !*** ./src/api/ApiController.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = __webpack_require__(/*! express */ "express");
const { decorateApp } = __webpack_require__(/*! @awaitjs/express */ "@awaitjs/express");
const { COLLECTION } = __webpack_require__(/*! radiks-server/app/lib/constants */ "radiks-server/app/lib/constants");
const makeApiController = (db) => {
    const Router = decorateApp(express.Router());
    const radiksData = db.collection(COLLECTION);
    Router.getAsync('/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const match = {
            $match: {
                radiksType: 'Message',
            },
        };
        if (req.query.lt) {
            match.$match.createdAt = {
                $lt: parseInt(req.query.lt, 10),
            };
        }
        if (req.query.createdBy) {
            match.$match.createdBy = req.query.createdBy;
        }
        const sort = {
            $sort: { createdAt: -1 },
        };
        const limit = {
            $limit: 10,
        };
        const votesLookup = {
            $lookup: {
                from: COLLECTION,
                localField: '_id',
                foreignField: 'messageId',
                as: 'votes',
            },
        };
        const pipeline = [match, sort, limit, votesLookup];
        const messages = yield radiksData.aggregate(pipeline).toArray();
        let username = (req.query.fetcher || req.universalCookies.get('username'));
        if (username)
            username = username.replace(/"/g, '');
        messages.forEach((message) => {
            message.hasVoted = false;
            if (username) {
                message.votes.forEach((vote) => {
                    if (vote.username === username) {
                        message.hasVoted = true;
                    }
                });
            }
            message.votes = message.votes.length;
        });
        res.json({ messages });
    }));
    Router.getAsync('/avatar/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = req.params;
        const user = yield radiksData.findOne({ _id: username });
        let image;
        if (user.profile.image) {
            [image] = user.profile.image;
        }
        if (image) {
            return res.redirect(image.contentUrl);
        }
        return res.redirect('/static/banana.jpg');
    }));
    return Router;
};
module.exports = makeApiController;


/***/ }),

/***/ "./src/api/Keychain.ts":
/*!*****************************!*\
  !*** ./src/api/Keychain.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const profile_1 = __webpack_require__(/*! ./../utils/profile */ "./src/utils/profile.ts");
const radiks_1 = __webpack_require__(/*! radiks */ "radiks");
function createKeyChain() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let seed = process.env.SEED;
        console.log('seed', seed);
        let keychain = yield profile_1.initWalletFromSeed(seed);
        return keychain;
    });
}
exports.createKeyChain = createKeyChain;
function loadServerSession(keychain) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let id = yield profile_1.createBlockchainIdentity(keychain);
        let userSession = profile_1.makeUserSession(id.appPrivateKey, id.appPublicKey, id.username, id.profileJSON.decodedToken.payload.claim);
        yield profile_1.configureRadiks(userSession);
        let blockstackUser = yield radiks_1.User.createWithCurrentUser();
        const radiksBatchAccount = {
            backupPhrase: keychain.backupPhrase,
            publicKey: id.appPublicKey,
            privateKey: id.appPrivateKey,
            userSession: userSession,
            username: id.username,
            error: 'none',
            profileJSON: id.profileJSON
        };
        console.log('created radiksBatchAccount for the server! ', radiksBatchAccount);
        return radiksBatchAccount;
    });
}
exports.loadServerSession = loadServerSession;


/***/ }),

/***/ "./src/api/PlaceController.ts":
/*!************************************!*\
  !*** ./src/api/PlaceController.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
function PlaceController(io, socket, room, RadiksController) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log('new joiner ', room);
        socket.join(room, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`New client connected to ${room}`);
            yield createRoomSession();
            function createRoomSession() {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    let session = null;
                    let placeId = room;
                    return new Promise((resolve, reject) => {
                        let placeKey = `place_${placeId}`;
                        RadiksController.centralCollection.find({ "_id": { $regex: placeKey } }).toArray((error, item) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            if (item.length > 0) {
                                session = item;
                            }
                            else {
                            }
                            socket.emit('message', session);
                            resolve(session);
                        }));
                    });
                });
            }
            function inviteMemberIfNotExists(placeId, userToInvite) {
            }
        }));
    });
}
exports.PlaceController = PlaceController;
;


/***/ }),

/***/ "./src/api/PlaceInfoController.ts":
/*!****************************************!*\
  !*** ./src/api/PlaceInfoController.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const express = __webpack_require__(/*! express */ "express");
const express_1 = __webpack_require__(/*! @awaitjs/express */ "@awaitjs/express");
const minPeopleCount = 5;
exports.PlaceInfoController = (db) => {
    const Router = express_1.decorateApp(express.Router());
    Router.getAsync('/headcount/:geohash', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { geohash } = req.params;
        let query = { _id: { $regex: geohash } };
        let headcount = yield geohashQuery(query);
        res.json({
            geohash,
            count: headcount
        });
    }));
    Router.getAsync('/nearest/populated/:lat/:long', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { lat, long } = req.params;
        res.json({ error: 'e' });
    }));
    function geohashQuery(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let cursor = db.collection("radiks-central-data").find(query);
            let result = yield cursor.toArray();
            try {
                const headcount = result[0].group.attrs.members.length;
                return headcount;
            }
            catch (e) {
                return 0;
            }
        });
    }
    return Router;
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
__webpack_require__(/*! ./LoadEnv */ "./src/LoadEnv.ts");
__webpack_require__(/*! localstorage-polyfill */ "localstorage-polyfill");
const Window = __webpack_require__(/*! window */ "window");
const window = new Window();
__webpack_require__(/*! localstorage-polyfill */ "localstorage-polyfill");
const fetch = __webpack_require__(/*! node-fetch */ "node-fetch");
global.window = window;
global.document = window.document;
const cookie_parser_1 = tslib_1.__importDefault(__webpack_require__(/*! cookie-parser */ "cookie-parser"));
const express_1 = tslib_1.__importDefault(__webpack_require__(/*! express */ "express"));
const morgan_1 = tslib_1.__importDefault(__webpack_require__(/*! morgan */ "morgan"));
const path_1 = tslib_1.__importDefault(__webpack_require__(/*! path */ "path"));
const routes_1 = tslib_1.__importDefault(__webpack_require__(/*! ./routes */ "./src/routes/index.ts"));
const radiks_server_1 = __webpack_require__(/*! radiks-server */ "radiks-server");
const http_status_codes_1 = __webpack_require__(/*! http-status-codes */ "http-status-codes");
const PlaceInfoController_1 = __webpack_require__(/*! ./api/PlaceInfoController */ "./src/api/PlaceInfoController.ts");
const Keychain_1 = __webpack_require__(/*! ./api/Keychain */ "./src/api/Keychain.ts");
const EventEmitter = __webpack_require__(/*! wolfy87-eventemitter */ "wolfy87-eventemitter");
const PlaceController_1 = __webpack_require__(/*! ./api/PlaceController */ "./src/api/PlaceController.ts");
const makeApiController = __webpack_require__(/*! ./api/ApiController */ "./src/api/ApiController.ts");
const { STREAM_CRAWL_EVENT } = __webpack_require__(/*! radiks-server/app/lib/constants */ "radiks-server/app/lib/constants");
const app = express_1.default();
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
app.use('/api', routes_1.default);
const viewsDir = path_1.default.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(staticDir));
app.get('/', (req, res) => {
    return res.status(http_status_codes_1.OK).json({ 'hi': 'the-local-server' });
});
app.get('/manifest.json', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.sendFile(path_1.default.join(__dirname, '..', 'static', 'manifest.json'));
});
const port = Number(process.env.PORT || 5000);
const server = app.listen(port, () => {
    console.log('Express server started on port: ' + port);
});
radiks_server_1.setup().then((RadiksController) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const io = __webpack_require__(/*! socket.io */ "socket.io")(server);
    app.use('/radiks', RadiksController);
    app.use('/api', makeApiController(RadiksController.DB));
    app.use('/placeinfo', PlaceInfoController_1.PlaceInfoController(RadiksController.DB));
    let keychain = yield Keychain_1.createKeyChain();
    let session = yield Keychain_1.loadServerSession(keychain);
    console.log('keychain', keychain);
    console.log('session', session);
    RadiksController.emitter.on(STREAM_CRAWL_EVENT, ([attrs]) => {
        if (attrs.geohash) {
            let room = attrs.geohash;
            io.in(room).emit('message', attrs);
        }
    });
    io.on('connection', function (socket) {
        console.log('new connection');
        socket.on('join', (room) => {
            PlaceController_1.PlaceController(io, socket, room, RadiksController);
        });
    });
}));
exports.default = app;

/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./src/routes/index.ts":
/*!*****************************!*\
  !*** ./src/routes/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __webpack_require__(/*! express */ "express");
const router = express_1.Router();
exports.default = router;


/***/ }),

/***/ "./src/utils/account-utils.js":
/*!************************************!*\
  !*** ./src/utils/account-utils.js ***!
  \************************************/
/*! exports provided: MAX_TRUST_LEVEL, AppNode, AppsNode, isPasswordValid, isBackupPhraseValid, decryptMasterKeychain, getBitcoinPrivateKeychain, getBitcoinPublicKeychain, getBitcoinAddressNode, decryptBitcoinPrivateKey, getIdentityPrivateKeychain, getIdentityPublicKeychain, getIdentityOwnerAddressNode, deriveIdentityKeyPair, getWebAccountTypes, calculateTrustLevel, calculateProfileCompleteness, findAddressIndex, getBlockchainIdentities */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_TRUST_LEVEL", function() { return MAX_TRUST_LEVEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppNode", function() { return AppNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppsNode", function() { return AppsNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPasswordValid", function() { return isPasswordValid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBackupPhraseValid", function() { return isBackupPhraseValid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decryptMasterKeychain", function() { return decryptMasterKeychain; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBitcoinPrivateKeychain", function() { return getBitcoinPrivateKeychain; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBitcoinPublicKeychain", function() { return getBitcoinPublicKeychain; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBitcoinAddressNode", function() { return getBitcoinAddressNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decryptBitcoinPrivateKey", function() { return decryptBitcoinPrivateKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIdentityPrivateKeychain", function() { return getIdentityPrivateKeychain; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIdentityPublicKeychain", function() { return getIdentityPublicKeychain; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIdentityOwnerAddressNode", function() { return getIdentityOwnerAddressNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deriveIdentityKeyPair", function() { return deriveIdentityKeyPair; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWebAccountTypes", function() { return getWebAccountTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculateTrustLevel", function() { return calculateTrustLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculateProfileCompleteness", function() { return calculateProfileCompleteness; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findAddressIndex", function() { return findAddressIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBlockchainIdentities", function() { return getBlockchainIdentities; });
/* harmony import */ var _encryption_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./encryption-utils */ "./src/utils/encryption-utils.js");
/* harmony import */ var bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bitcoinjs-lib */ "bitcoinjs-lib");
/* harmony import */ var bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_2__);





function hashCode(string) {
  let hash = 0
  if (string.length === 0) return hash
  for (let i = 0; i < string.length; i++) {
    const character = string.charCodeAt(i)
    hash = (hash << 5) - hash + character
    hash = hash & hash
  }
  return hash & 0x7fffffff
}

const APPS_NODE_INDEX = 0
const SIGNING_NODE_INDEX = 1
const ENCRYPTION_NODE_INDEX = 2
const MAX_TRUST_LEVEL = 99

class AppNode {
  constructor(hdNode, appDomain) {
    this.hdNode = hdNode
    this.appDomain = appDomain
  }

  getAppPrivateKey() {
    return this.hdNode.keyPair.d.toBuffer(32).toString('hex')
  }

  getAddress() {
    return this.hdNode.getAddress()
  }
}

class AppsNode {
  constructor(appsHdNode, salt) {
    this.hdNode = appsHdNode
    this.salt = salt
  }

  getNode() {
    return this.hdNode
  }

  getAppNode(appDomain) {
    const hash = crypto__WEBPACK_IMPORTED_MODULE_2___default.a
      .createHash('sha256')
      .update(`${appDomain}${this.salt}`)
      .digest('hex')
    const appIndex = hashCode(hash)
    const appNode = this.hdNode.deriveHardened(appIndex)
    return new AppNode(appNode, appDomain)
  }

  toBase58() {
    return this.hdNode.toBase58()
  }

  getSalt() {
    return this.salt
  }
}

class IdentityAddressOwnerNode {
  constructor(ownerHdNode, salt) {
    this.hdNode = ownerHdNode
    this.salt = salt
  }

  getNode() {
    return this.hdNode
  }

  getSalt() {
    return this.salt
  }

  getIdentityKey() {
    return this.hdNode.keyPair.d.toBuffer(32).toString('hex')
  }

  getIdentityKeyID() {
    return this.hdNode.keyPair.getPublicKeyBuffer().toString('hex')
  }

  getAppsNode() {
    return new AppsNode(this.hdNode.deriveHardened(APPS_NODE_INDEX), this.salt)
  }

  getAddress() {
    return this.hdNode.getAddress()
  }

  getEncryptionNode() {
    return this.hdNode.deriveHardened(ENCRYPTION_NODE_INDEX)
  }

  getSigningNode() {
    return this.hdNode.deriveHardened(SIGNING_NODE_INDEX)
  }
}

function isPasswordValid(password) {
  let isValid = false
  let error = null

  if (password.length >= 8) {
    isValid = true
    error = 'Password must be at least 8 characters'
  }

  return { isValid, error }
}

function isBackupPhraseValid(backupPhrase) {
  let isValid = true
  let error = null
  return Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(null, /*! bip39 */ "bip39", 7)).then(bip39 => {
    if (!bip39.validateMnemonic(backupPhrase)) {
      isValid = false
      error = 'Backup phrase is not a valid set of words'
    }

    return { isValid, error }
  })
}

function decryptMasterKeychain(password, encryptedBackupPhrase) {
  return new Promise((resolve, reject) => {
    const dataBuffer = new Buffer(encryptedBackupPhrase, 'hex')
    Object(_encryption_utils__WEBPACK_IMPORTED_MODULE_0__["decrypt"])(dataBuffer, password).then(
      async plaintextBuffer => {
        const bip39 = await Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(null, /*! bip39 */ "bip39", 7))
        const backupPhrase = plaintextBuffer.toString()
        const seed = bip39.mnemonicToSeed(backupPhrase)
        const masterKeychain = bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_1__["HDNode"].fromSeedBuffer(seed)
        //logger.info('decryptMasterKeychain: decrypted!')
        resolve(masterKeychain)
      },
      error => {
        //logger.error('decryptMasterKeychain: error', error)
        reject(new Error('Incorrect password'))
      }
    )
  })
}

const EXTERNAL_ADDRESS = 'EXTERNAL_ADDRESS'
const CHANGE_ADDRESS = 'CHANGE_ADDRESS'

function getBitcoinPrivateKeychain(masterKeychain) {
  const BIP_44_PURPOSE = 44
  const BITCOIN_COIN_TYPE = 0
  const ACCOUNT_INDEX = 0

  return masterKeychain
    .deriveHardened(BIP_44_PURPOSE)
    .deriveHardened(BITCOIN_COIN_TYPE)
    .deriveHardened(ACCOUNT_INDEX)
}

function getBitcoinPublicKeychain(masterKeychain) {
  return getBitcoinPrivateKeychain(masterKeychain).neutered()
}

function getBitcoinAddressNode(
  bitcoinKeychain,
  addressIndex = 0,
  chainType = EXTERNAL_ADDRESS
) {
  let chain = null

  if (chainType === EXTERNAL_ADDRESS) {
    chain = 0
  } else if (chainType === CHANGE_ADDRESS) {
    chain = 1
  } else {
    throw new Error('Invalid chain type')
  }

  return bitcoinKeychain.derive(chain).derive(addressIndex)
}

function decryptBitcoinPrivateKey(password, encryptedBackupPhrase) {
  return new Promise((resolve, reject) =>
    decryptMasterKeychain(password, encryptedBackupPhrase)
      .then(masterKeychain => {
        const bitcoinPrivateKeychain = getBitcoinPrivateKeychain(masterKeychain)
        const bitcoinAddressHDNode = getBitcoinAddressNode(
          bitcoinPrivateKeychain,
          0
        )
        const privateKey = bitcoinAddressHDNode.keyPair.d
          .toBuffer(32)
          .toString('hex')
        resolve(privateKey)
      })
      .catch(error => {
        reject(error)
      })
  )
}

const IDENTITY_KEYCHAIN = 888
const BLOCKSTACK_ON_BITCOIN = 0
function getIdentityPrivateKeychain(masterKeychain) {
  return masterKeychain
    .deriveHardened(IDENTITY_KEYCHAIN)
    .deriveHardened(BLOCKSTACK_ON_BITCOIN)
}

function getIdentityPublicKeychain(masterKeychain) {
  return getIdentityPrivateKeychain(masterKeychain).neutered()
}

function getIdentityOwnerAddressNode(
  identityPrivateKeychain,
  identityIndex = 0
) {
  if (identityPrivateKeychain.isNeutered()) {
    throw new Error('You need the private key to generate identity addresses')
  }

  const publicKeyHex = identityPrivateKeychain.keyPair
    .getPublicKeyBuffer()
    .toString('hex')
  const salt = crypto__WEBPACK_IMPORTED_MODULE_2___default.a
    .createHash('sha256')
    .update(publicKeyHex)
    .digest('hex')

  return new IdentityAddressOwnerNode(
    identityPrivateKeychain.deriveHardened(identityIndex),
    salt
  )
}

function deriveIdentityKeyPair(identityOwnerAddressNode) {
  const address = identityOwnerAddressNode.getAddress()
  const identityKey = identityOwnerAddressNode.getIdentityKey()
  const identityKeyID = identityOwnerAddressNode.getIdentityKeyID()
  const appsNode = identityOwnerAddressNode.getAppsNode()
  const keyPair = {
    key: identityKey,
    keyID: identityKeyID,
    address,
    appsNodeKey: appsNode.toBase58(),
    salt: appsNode.getSalt()
  }
  return keyPair
}

function getWebAccountTypes(api) {
  const webAccountTypes = {
    twitter: {
      label: 'Twitter',
      iconClass: 'fa-twitter',
      social: true,
      urlTemplate: 'https://twitter.com/{identifier}'
    },
    facebook: {
      label: 'Facebook',
      iconClass: 'fa-facebook',
      social: true,
      urlTemplate: 'https://facebook.com/{identifier}'
    },
    github: {
      label: 'GitHub',
      iconClass: 'fa-github-alt',
      social: true,
      urlTemplate: 'https://github.com/{identifier}'
    },
    instagram: {
      label: 'Instagram',
      iconClass: 'fa-instagram',
      social: true,
      urlTemplate: 'https://instagram.com/{identifier}'
    },
    linkedIn: {
      label: 'LinkedIn',
      iconClass: 'fa-linkedin',
      social: true,
      urlTemplate: 'https://www.linkedin.com/in/{identifier}'
    },
    tumblr: {
      label: 'Tumblr',
      iconClass: 'fa-tumblr',
      social: true,
      urlTemplate: 'http://{identifier}.tumblr.com'
    },
    reddit: {
      label: 'Reddit',
      iconClass: 'fa-reddit-alien',
      social: true,
      urlTemplate: 'https://www.reddit.com/user/{identifier}'
    },
    pinterest: {
      label: 'Pinterest',
      iconClass: 'fa-pinterest',
      social: true,
      urlTemplate: 'https://pinterest.com/{identifier}'
    },
    youtube: {
      label: 'YouTube',
      iconClass: 'fa-youtube',
      social: true,
      urlTemplate: 'https://www.youtube.com/channel/{identifier}'
    },
    'google-plus': {
      label: 'Google+',
      iconClass: 'fa-google-plus',
      social: true,
      urlTemplate: 'https://plus.google.com/u/{identifier}'
    },
    angellist: {
      label: 'AngelList',
      iconClass: 'fa-angellist',
      social: true,
      urlTemplate: 'https://angel.co/{identifier}'
    },
    'stack-overflow': {
      label: 'StackOverflow',
      iconClass: 'fa-stack-overflow',
      social: true,
      urlTemplate: 'http://stackoverflow.com/users/{identifier}'
    },
    hackerNews: {
      label: 'Hacker News',
      iconClass: 'fa-hacker-news',
      social: true,
      urlTemplate: 'https://news.ycombinator.com/user?id={identifier}'
    },
    openbazaar: {
      label: 'OpenBazaar',
      iconClass: 'fa-shopping-cart',
      social: true,
      urlTemplate: 'ob://{identifier}'
    },
    snapchat: {
      label: 'Snapchat',
      iconClass: 'fa-snapchat-ghost',
      social: true,
      urlTemplate: 'https://snapchat.com/add/{identifier}'
    },
    website: {
      label: 'Website',
      iconClass: 'fa-link',
      social: false,
      urlTemplate: '{identifier}'
    },
    ssh: {
      label: 'SSH',
      iconClass: 'fa-key',
      social: false
    },
    pgp: {
      label: 'PGP',
      iconClass: 'fa-key',
      social: false
    },
    bitcoin: {
      label: 'Bitcoin',
      iconClass: 'fa-bitcoin',
      social: false,
      urlTemplate: api.bitcoinAddressUrl
    },
    ethereum: {
      label: 'Ethereum',
      iconClass: 'fa-key',
      social: false,
      urlTemplate: api.ethereumAddressUrl
    }
  }
  return webAccountTypes
}

function calculateTrustLevel(verifications) {
  if (!verifications || verifications.length < 1) {
    return 0
  }

  let trustLevel = 0
  verifications.forEach(verification => {
    if (verification.valid && trustLevel < MAX_TRUST_LEVEL) {
      trustLevel++
    }
  })

  return trustLevel
}

function calculateProfileCompleteness(profile, verifications) {
  let complete = 0
  const totalItems = 2
  const maxVerificationItems = 1

  if (profile.name && profile.name.length > 0) {
    complete++
  }

  // if (profile.description && profile.description.length > 0) {
  //   complete++
  // }

  // if (profile.image && profile.image.length > 0) {
  //   complete++
  // }

  complete += Math.min(calculateTrustLevel(verifications), maxVerificationItems)

  return complete / totalItems
}

function findAddressIndex(address, identityAddresses) {
  for (let i = 0; i < identityAddresses.length; i++) {
    if (identityAddresses[i] === address) {
      return i
    }
  }
  return null
}

function getBlockchainIdentities(masterKeychain, identitiesToGenerate) {
  const identityPrivateKeychainNode = getIdentityPrivateKeychain(masterKeychain)
  const bitcoinPrivateKeychainNode = getBitcoinPrivateKeychain(masterKeychain)

  const identityPublicKeychainNode = identityPrivateKeychainNode.neutered()
  const identityPublicKeychain = identityPublicKeychainNode.toBase58()

  const bitcoinPublicKeychainNode = bitcoinPrivateKeychainNode.neutered()
  const bitcoinPublicKeychain = bitcoinPublicKeychainNode.toBase58()

  const firstBitcoinAddress = getBitcoinAddressNode(
    bitcoinPublicKeychainNode
  ).getAddress()

  const identityAddresses = []
  const identityKeypairs = []

  // We pre-generate a number of identity addresses so that we
  // don't have to prompt the user for the password on each new profile
  for (
    let addressIndex = 0;
    addressIndex < identitiesToGenerate;
    addressIndex++
  ) {
    const identityOwnerAddressNode = getIdentityOwnerAddressNode(
      identityPrivateKeychainNode,
      addressIndex
    )
    const identityKeyPair = deriveIdentityKeyPair(identityOwnerAddressNode)
    identityKeypairs.push(identityKeyPair)
    identityAddresses.push(identityKeyPair.address)
    //logger.debug(`createAccount: identity index: ${addressIndex}`)
  }

  return {
    identityPublicKeychain,
    bitcoinPublicKeychain,
    firstBitcoinAddress,
    identityAddresses,
    identityKeypairs
  }
}

/***/ }),

/***/ "./src/utils/api-utils.js":
/*!********************************!*\
  !*** ./src/utils/api-utils.js ***!
  \********************************/
/*! exports provided: authorizationHeaderValue, getCoreAPIPasswordFromURL, getLogServerPortFromURL, getRegTestModeFromURL, setOrUnsetUrlsToRegTest, hasLegacyCoreStateVersion, migrateLegacyCoreEndpoints, isCoreApiRunning, isApiPasswordValid, setCoreStorageConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "authorizationHeaderValue", function() { return authorizationHeaderValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCoreAPIPasswordFromURL", function() { return getCoreAPIPasswordFromURL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLogServerPortFromURL", function() { return getLogServerPortFromURL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRegTestModeFromURL", function() { return getRegTestModeFromURL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setOrUnsetUrlsToRegTest", function() { return setOrUnsetUrlsToRegTest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasLegacyCoreStateVersion", function() { return hasLegacyCoreStateVersion; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "migrateLegacyCoreEndpoints", function() { return migrateLegacyCoreEndpoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isCoreApiRunning", function() { return isCoreApiRunning; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isApiPasswordValid", function() { return isApiPasswordValid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setCoreStorageConfig", function() { return setCoreStorageConfig; });
/* harmony import */ var hash_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hash-handler */ "hash-handler");
/* harmony import */ var hash_handler__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hash_handler__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./browser/store/settings/default */ "./src/utils/browser/store/settings/default.js");
/* harmony import */ var _window_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./window-utils */ "./src/utils/window-utils.js");



const logger = console;





var BLOCKSTACK_STATE_VERSION_KEY = 'BLOCKSTACK_STATE_VERSION';

function authorizationHeaderValue(coreAPIPassword) {
  return `bearer ${coreAPIPassword}`
}

function getCoreAPIPasswordFromURL() {
  const coreAPIPassword = hash_handler__WEBPACK_IMPORTED_MODULE_0___default.a.getInstance().get('coreAPIPassword')
  if (!coreAPIPassword || coreAPIPassword === 'off') {
    return null
  }
  hash_handler__WEBPACK_IMPORTED_MODULE_0___default.a.getInstance().set('coreAPIPassword', 'off')
  return coreAPIPassword
}

function getLogServerPortFromURL() {
  const logServerPort = hash_handler__WEBPACK_IMPORTED_MODULE_0___default.a.getInstance().get('logServerPort')
  if (!logServerPort || logServerPort === 'off') {
    return null
  }
  hash_handler__WEBPACK_IMPORTED_MODULE_0___default.a.getInstance().set('logServerPort', 'off')
  return logServerPort
}

function getRegTestModeFromURL() {
  const regTestMode = hash_handler__WEBPACK_IMPORTED_MODULE_0___default.a.getInstance().get('regtest')
  if (!regTestMode || regTestMode === 'off') {
    return null
  }
  hash_handler__WEBPACK_IMPORTED_MODULE_0___default.a.getInstance().set('regtest', 'off')
  return regTestMode === '1'
}

function findAndSetApiUrls(api, regTestMode, coreAPIPassword, toFindUrl, toSetUrl) {
  const apiOut = Object.assign({}, api, { regTestMode, coreAPIPassword })
  Object.keys(apiOut)
    .forEach(key => {
      const value = apiOut[key]
      if (typeof value === 'string' || value instanceof String) {
        if (value.startsWith(toFindUrl)) {
          const suffix = value.slice(toFindUrl.length)
          apiOut[key] = `${toSetUrl}${suffix}`
        }
      }
    })

  return apiOut
}

/**
 * Returns an API object with regTestMode set to the inputted value,
 *  and URLs all changed to either match DEFAULT_CORE_API_ENDPOINT
 *  or REGTEST_CORE_API_ENDPOINT respectively.
 *
 * This is intended _only_ as a stopgap implementation. Realistically,
 *  we need a more sophisticated regtest mode, which will restore
 *  to the correct URLs
 * @parameter {Object} the previous api object
 * @parameter {Object} the new value of the regTestMode
 * @returns {Object} a new api object
 * @private
 */
function setOrUnsetUrlsToRegTest(api, regTestMode) {
  let toFindUrl
  let toSetUrl
  let coreAPIPassword
  if (regTestMode) {
    toFindUrl = _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_CORE_API_ENDPOINT"]
    toSetUrl = _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__["REGTEST_CORE_API_ENDPOINT"]
    coreAPIPassword = _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__["REGTEST_CORE_API_PASSWORD"]
  } else {
    toFindUrl = _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__["REGTEST_CORE_API_ENDPOINT"]
    toSetUrl = _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_CORE_API_ENDPOINT"]
    coreAPIPassword = _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_CORE_PHONY_PASSWORD"]
  }
  return findAndSetApiUrls(api, regTestMode, coreAPIPassword, toFindUrl, toSetUrl)
}

/*
 * Returns true if the current state version is a legacy version
 *  which relies on localhost:6270 -- this is true if the
 *  existing state version is < 13 (when we migrated away from shipping a
 *  local api endpoint)
 * @returns {boolean}
 * @private
 */
function hasLegacyCoreStateVersion() {
  let existingVersion = localStorage.getItem(BLOCKSTACK_STATE_VERSION_KEY)
  if (!existingVersion) {
    existingVersion = 0
  }
  return existingVersion < 13
}

/**
 * Migrates an API object from old default URLs to the new
 *  default. Used in migrating from localhost:6270 default to
 *  core.blockstack.org (happened at v0.28.0)
 * @parameter {Object} the previous api object
 * @returns {Object} a new api object
 * @private
 */
function migrateLegacyCoreEndpoints(api) {
  // State version 13 is when we migrated away from default localhost:6270
  console.log('Migrating URLs from localhost:6270 to core.blockstack.org')
  const regTestMode = api.regTestMode
  const toFindUrl = 'http://localhost:6270'
  const toSetUrl = _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_CORE_API_ENDPOINT"]
  const coreAPIPassword = _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_CORE_PHONY_PASSWORD"]
  const outApi = findAndSetApiUrls(api, regTestMode, coreAPIPassword, toFindUrl, toSetUrl)
  console.log(JSON.stringify(outApi))
  return outApi
}

function isCoreApiRunning(corePingUrl) {
  if (Object(_window_utils__WEBPACK_IMPORTED_MODULE_2__["isCoreEndpointDisabled"])(corePingUrl)) {
    return new Promise(resolve => {
      resolve(true)
    })
  }

  logger.debug(`isCoreApiRunning: ${corePingUrl}`)

  return new Promise(resolve => {
    fetch(corePingUrl, { cache: 'no-store' })
      .then(response => response.text())
      .then(responseText => JSON.parse(responseText))
      .then(responseJson => {
        if (responseJson.status === 'alive') {
          logger.info('isCoreApiRunning? Yes!')
          resolve(true)
        } else {
          logger.error('isCoreApiRunning? No!')
          resolve(false)
        }
      })
      .catch(error => {
        logger.error(`isCoreApiRunning: problem checking ${corePingUrl}`, error)
        resolve(false)
      })
  })
}

function isApiPasswordValid(corePasswordProtectedReadUrl, coreApiPassword) {
  if (Object(_window_utils__WEBPACK_IMPORTED_MODULE_2__["isCoreEndpointDisabled"])(corePasswordProtectedReadUrl)) {
    return new Promise(resolve => {
      resolve(true)
    })
  }

  logger.debug(`isApiPasswordValid: ${corePasswordProtectedReadUrl}`)

  const requestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: authorizationHeaderValue(coreApiPassword)
  }

  return new Promise(resolve => {
    if (!coreApiPassword) {
      logger.error('isCoreApiPasswordValid? Password is missing!')
      resolve(false)
      return
    }
    fetch(corePasswordProtectedReadUrl, {
      cache: 'no-store',
      headers: requestHeaders
    })
      .then(response => {
        if (response.ok) {
          logger.info('isCoreApiPasswordValid? Yes!')
          resolve(true)
        } else {
          logger.error('isCoreApiPasswordValid? No!')
          resolve(false)
        }
      })
      .catch(error => {
        logger.error(`isApiPasswordValid: problem checking ${corePasswordProtectedReadUrl}`, error)
        resolve(false)
      })
  })
}

/* Expects a JavaScript object with a key containing the config for each storage
 * provider
 * Example:
 * const config = { dropbox: { token: '123abc'} }
 */
function setCoreStorageConfig() {
  logger.debug('setCoreStorageConfig called in a core-less build')
  return Promise.resolve('OK')
}


/***/ }),

/***/ "./src/utils/bitcoin-utils.js":
/*!************************************!*\
  !*** ./src/utils/bitcoin-utils.js ***!
  \************************************/
/*! exports provided: btcToSatoshis, satoshisToBtc, broadcastTransaction, getInsightUrls, getNetworkFee, summarizeTransactionFromHex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "btcToSatoshis", function() { return btcToSatoshis; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "satoshisToBtc", function() { return satoshisToBtc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "broadcastTransaction", function() { return broadcastTransaction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInsightUrls", function() { return getInsightUrls; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNetworkFee", function() { return getNetworkFee; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "summarizeTransactionFromHex", function() { return summarizeTransactionFromHex; });
/* harmony import */ var bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bitcoinjs-lib */ "bitcoinjs-lib");
/* harmony import */ var bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./browser/store/settings/default */ "./src/utils/browser/store/settings/default.js");




const logger = console;

const SATOSHIS_IN_BTC = 100000000

function btcToSatoshis(amountInBtc) {
  return amountInBtc * SATOSHIS_IN_BTC
}

function satoshisToBtc(amountInSatoshis) {
  return 1.0 * amountInSatoshis / SATOSHIS_IN_BTC
}

function broadcastTransaction(broadcastTransactionUrl, rawTransaction) {
  return new Promise((resolve, reject) => {
    const payload = { rawtx: rawTransaction }

    fetch(broadcastTransactionUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then(response => response.text())
      .then(responseText => JSON.parse(responseText))
      .then(responseJson => {
        resolve(responseJson)
      })
      .catch(error => {
        logger.error('broadcastTransaction: error broadcasting transaction', error)
        reject(error)
      })
  })
}

function getInsightUrls(insightUrl, address, coreAPIPassword) {
  console.log(`constant: ${_browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__["REGTEST_CORE_API_PASSWORD"]}, parameter: ${coreAPIPassword}`)
  if (coreAPIPassword === _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__["REGTEST_CORE_API_PASSWORD"]) {
    logger.debug('getInsightUrls: using regtest mock insight api ')
    insightUrl = _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_1__["REGTEST_CORE_INSIGHT_API_URL"]
  }
  const url = insightUrl.replace('{address}', address)
  return {
    base: url,
    confirmedBalanceUrl: `${url}/balance`,
    unconfirmedBalanceUrl: `${url}/unconfirmedBalance`
  }
}

function getNetworkFee(bytes) {
  return new Promise((resolve, reject) => {
    fetch('https://bitcoinfees.21.co/api/v1/fees/recommended')
      .then(response => response.text())
      .then(responseText => JSON.parse(responseText))
      .then(responseJson => {
        const satoshisPerByte = responseJson.fastestFee
        const fee = bytes * satoshisPerByte
        resolve(fee)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * Constructs a summary of what the user’s sending from a transaction hex
 * @param {string} txHex - Encoded transaction hex
 * @return {{ outs: { address: string, satoshis: number }[], total: number }}
 */
function summarizeTransactionFromHex(txHex) {
  const tx = bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_0__["Transaction"].fromHex(txHex)
  const outs = tx.outs.map(o => ({
    address: bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_0__["address"].fromOutputScript(o.script),
    satoshis: o.value
  }))
  return {
    outs,
    total: outs.reduce((prev, o) => prev + o.satoshis, 0)
  }
}


/***/ }),

/***/ "./src/utils/browser/store/settings/default.js":
/*!*****************************************************!*\
  !*** ./src/utils/browser/store/settings/default.js ***!
  \*****************************************************/
/*! exports provided: BLOCKSTACK_INC, REGTEST_CORE_API_PASSWORD, DEFAULT_CORE_PHONY_PASSWORD, REGTEST_CORE_INSIGHT_API_URL, DEFAULT_CORE_API_ENDPOINT, REGTEST_CORE_API_ENDPOINT, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLOCKSTACK_INC", function() { return BLOCKSTACK_INC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGTEST_CORE_API_PASSWORD", function() { return REGTEST_CORE_API_PASSWORD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_CORE_PHONY_PASSWORD", function() { return DEFAULT_CORE_PHONY_PASSWORD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGTEST_CORE_INSIGHT_API_URL", function() { return REGTEST_CORE_INSIGHT_API_URL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_CORE_API_ENDPOINT", function() { return DEFAULT_CORE_API_ENDPOINT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGTEST_CORE_API_ENDPOINT", function() { return REGTEST_CORE_API_ENDPOINT; });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);

const BLOCKSTACK_INC = 'gaia-hub'

const REGTEST_CORE_API_PASSWORD = 'blockstack_integration_test_api_password'
const DEFAULT_CORE_PHONY_PASSWORD = 'PretendPasswordAPI'
const REGTEST_CORE_INSIGHT_API_URL = 'http://localhost:6270/insight-api/addr/{address}'

// DEFAULT_API values are only used if
// the user's settings.api state doesn't
// already have an existing key.
// To change a value, use a new key.

const DEFAULT_CORE_API_ENDPOINT = 'https://core.blockstack.org'
const REGTEST_CORE_API_ENDPOINT = 'http://localhost:6270'

const DEFAULT_API = {
  apiCustomizationEnabled: true,
  nameLookupUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/names/{name}`,
  searchServiceUrl: 'https://core.blockstack.org/v1/search?query={query}',
  registerUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/names`,
  bitcoinAddressLookupUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/addresses/bitcoin/{address}`,
  zeroConfBalanceUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/wallet/balance/0`,
  insightUrl: 'https://utxo.blockstack.org/insight-api/addr/{address}',
  btcBalanceUrl: 'https://blockchain.info/q/addressbalance/',
  broadcastUrl: 'https://utxo.blockstack.org/insight-api/tx/send',
  priceUrl: `${DEFAULT_CORE_API_ENDPOINT}/v2/prices/names/{name}`,
  networkFeeUrl: 'https://bitcoinfees.21.co/api/v1/fees/recommended',
  walletPaymentAddressUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/wallet/payment_address`,
  pendingQueuesUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/blockchains/bitcoin/pending`,
  coreWalletWithdrawUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/wallet/balance`,
  bitcoinAddressUrl: 'https://explorer.blockstack.org/address/{identifier}',
  ethereumAddressUrl: 'https://tradeblock.com/ethereum/account/{identifier}',
  pgpKeyUrl: 'https://pgp.mit.edu/pks/lookup?search={identifier}&op=vindex&fingerprint=on',
  btcPriceUrl: 'https://www.bitstamp.net/api/v2/ticker/btcusd/?cors=1',
  corePingUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/node/ping`,
  zoneFileUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/names/{name}/zonefile`,
  nameTransferUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/names/{name}/owner`,
  subdomains: {
    'foo.id': {
      registerUrl: 'http://localhost:7103/register',
      apiUrl: 'http://localhost:7103/v1/names'
    },
    'test-personal.id': {
      registerUrl: 'https://test-registrar.blockstack.org/register',
      apiUrl: 'https://test-registrar.blockstack.org/v1/names'
    },
    'id.blockstack': {
      registerUrl: 'https://registrar.blockstack.org/register',
      apiUrl: 'https://registrar.blockstack.org/v1/names'
    }
  },
  browserServerUrl: 'https://blockstack-browser-server.appartisan.com',
  hostedDataLocation: BLOCKSTACK_INC,
  coreHost: 'localhost',
  corePort: 6270,
  coreAPIPassword: DEFAULT_CORE_PHONY_PASSWORD,
  logServerPort: '',
  regTestMode: false,
  storageConnected: false,
  gaiaHubConfig: null,
  gaiaHubUrl: 'https://hub.blockstack.org',
  btcPrice: '1000.00',
  distinctEventId: crypto__WEBPACK_IMPORTED_MODULE_0___default.a.randomBytes(16).toString('hex'),
  hasDisabledEventTracking: false
}

/* harmony default export */ __webpack_exports__["default"] = (DEFAULT_API);


/***/ }),

/***/ "./src/utils/encryption-utils.js":
/*!***************************************!*\
  !*** ./src/utils/encryption-utils.js ***!
  \***************************************/
/*! exports provided: encrypt, decrypt, RECOVERY_TYPE, validateAndCleanRecoveryInput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encrypt", function() { return encrypt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decrypt", function() { return decrypt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECOVERY_TYPE", function() { return RECOVERY_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateAndCleanRecoveryInput", function() { return validateAndCleanRecoveryInput; });
/* harmony import */ var bip39__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bip39 */ "bip39");
/* harmony import */ var bip39__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bip39__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _workers_crypto_check_worker_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./workers/crypto-check.worker.js */ "./src/utils/workers/crypto-check.worker.js");
/* harmony import */ var _workers_encrypt_worker_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./workers/encrypt.worker.js */ "./src/utils/workers/encrypt.worker.js");
/* harmony import */ var _workers_encrypt_main_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./workers/encrypt.main.js */ "./src/utils/workers/encrypt.main.js");
/* harmony import */ var _workers_decrypt_worker_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./workers/decrypt.worker.js */ "./src/utils/workers/decrypt.worker.js");
/* harmony import */ var _workers_decrypt_main_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./workers/decrypt.main.js */ "./src/utils/workers/decrypt.main.js");








const logger = console;

async function checkCryptoWorkerSupport() {
  const result = await Object(_workers_crypto_check_worker_js__WEBPACK_IMPORTED_MODULE_1__["default"])().isCryptoInWorkerSupported() 
  return result.toString() === 'true'
}

async function encrypt(plaintextBuffer, password) {
  const mnemonic = plaintextBuffer.toString()
  const useWorker = await checkCryptoWorkerSupport()
  let encryptLib
  if (useWorker) {
    encryptLib = Object(_workers_encrypt_worker_js__WEBPACK_IMPORTED_MODULE_2__["default"])()
  } else {
    encryptLib = _workers_encrypt_main_js__WEBPACK_IMPORTED_MODULE_3__
  }
  return encryptLib.encrypt(mnemonic, password)
}

async function decrypt(dataBuffer, password) {
  const encryptedMnemonic = dataBuffer.toString('hex')
  const useWorker = await checkCryptoWorkerSupport()
  let decryptLib
  if (useWorker) {
    decryptLib = Object(_workers_decrypt_worker_js__WEBPACK_IMPORTED_MODULE_4__["default"])()
  } else {
    decryptLib = _workers_decrypt_main_js__WEBPACK_IMPORTED_MODULE_5__
  }
  const mnemonic = await decryptLib.decrypt(encryptedMnemonic, password)
  return Buffer.from(mnemonic)
}

const RECOVERY_TYPE = {
  MNEMONIC: 'mnemonic',
  ENCRYPTED: 'encrypted'
}

/**
 * Checks if a recovery option is valid, and attempts to clean it up.
 * @param {string} input - User input of recovery method
 * @returns {{ isValid: boolean, cleaned: (string|undefined), type: (string|undefined) }}
 */
function validateAndCleanRecoveryInput(input) {
  logger.debug('Validate and clean recovery input')
  const cleaned = input.trim()
  logger.debug('cleaned: ', cleaned)

  // Raw mnemonic phrase
  const cleanedMnemonic = cleaned
    .toLowerCase()
    .split(/\s|-|_|\./)
    .join(' ')

  if (bip39__WEBPACK_IMPORTED_MODULE_0___default.a.validateMnemonic(cleanedMnemonic)) {
    logger.debug('This is a valid mnemonic.')
    return {
      isValid: true,
      type: RECOVERY_TYPE.MNEMONIC,
      cleaned: cleanedMnemonic
    }
  }
  logger.debug('Is not a valid mnemonic.')

  // Base64 encoded encrypted phrase
  let cleanedEncrypted = cleaned.replace(/\s/gm, '')

  if (
    /^[a-zA-Z0-9\+\/]+=?$/.test(cleanedEncrypted) &&
    cleanedEncrypted.slice(-1) !== '='
  ) {
    // Append possibly missing equals sign padding
    logger.debug('Encrypted Phrase needs an `=` at the end.')

    cleanedEncrypted = `${cleanedEncrypted}=`
  }

  if (
    cleanedEncrypted.length >= 108 &&
    /^[a-zA-Z0-9\+\/]+=$/.test(cleanedEncrypted)
  ) {
    logger.debug('Valid encrypted phrase!')
    return {
      isValid: true,
      type: RECOVERY_TYPE.ENCRYPTED,
      cleaned: cleanedEncrypted
    }
  }
  logger.debug('Is not a valid phrase!')

  return { isValid: false }
}


/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/*! exports provided: decryptMasterKeychain, deriveIdentityKeyPair, getBitcoinPrivateKeychain, getBitcoinPublicKeychain, getIdentityPrivateKeychain, getIdentityPublicKeychain, getWebAccountTypes, isPasswordValid, isBackupPhraseValid, getIdentityOwnerAddressNode, getBitcoinAddressNode, findAddressIndex, decryptBitcoinPrivateKey, calculateTrustLevel, calculateProfileCompleteness, getBlockchainIdentities, authorizationHeaderValue, broadcastTransaction, btcToSatoshis, getNetworkFee, getInsightUrls, satoshisToBtc, getNumberOfVerifications, compareProfilesByVerifications, encrypt, decrypt, isABlockstackName, hasNameBeenPreordered, isNameAvailable, isSubdomain, getNamePrices, getProfileFromTokens, signProfileForUpload, verifyToken, DEFAULT_PROFILE, openInNewTab, isMobile, getTokenFileUrlFromZoneFile, resolveZoneFileToProfile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _account_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./account-utils */ "./src/utils/account-utils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "decryptMasterKeychain", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["decryptMasterKeychain"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "deriveIdentityKeyPair", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["deriveIdentityKeyPair"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBitcoinPrivateKeychain", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["getBitcoinPrivateKeychain"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBitcoinPublicKeychain", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["getBitcoinPublicKeychain"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getIdentityPrivateKeychain", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["getIdentityPrivateKeychain"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getIdentityPublicKeychain", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["getIdentityPublicKeychain"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getWebAccountTypes", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["getWebAccountTypes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isPasswordValid", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["isPasswordValid"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isBackupPhraseValid", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["isBackupPhraseValid"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getIdentityOwnerAddressNode", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["getIdentityOwnerAddressNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBitcoinAddressNode", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["getBitcoinAddressNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "findAddressIndex", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["findAddressIndex"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "decryptBitcoinPrivateKey", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["decryptBitcoinPrivateKey"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "calculateTrustLevel", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["calculateTrustLevel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "calculateProfileCompleteness", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["calculateProfileCompleteness"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBlockchainIdentities", function() { return _account_utils__WEBPACK_IMPORTED_MODULE_0__["getBlockchainIdentities"]; });

/* harmony import */ var _api_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api-utils */ "./src/utils/api-utils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "authorizationHeaderValue", function() { return _api_utils__WEBPACK_IMPORTED_MODULE_1__["authorizationHeaderValue"]; });

/* harmony import */ var _bitcoin_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bitcoin-utils */ "./src/utils/bitcoin-utils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "broadcastTransaction", function() { return _bitcoin_utils__WEBPACK_IMPORTED_MODULE_2__["broadcastTransaction"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "btcToSatoshis", function() { return _bitcoin_utils__WEBPACK_IMPORTED_MODULE_2__["btcToSatoshis"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getNetworkFee", function() { return _bitcoin_utils__WEBPACK_IMPORTED_MODULE_2__["getNetworkFee"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getInsightUrls", function() { return _bitcoin_utils__WEBPACK_IMPORTED_MODULE_2__["getInsightUrls"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "satoshisToBtc", function() { return _bitcoin_utils__WEBPACK_IMPORTED_MODULE_2__["satoshisToBtc"]; });

/* harmony import */ var _search_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./search-utils */ "./src/utils/search-utils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getNumberOfVerifications", function() { return _search_utils__WEBPACK_IMPORTED_MODULE_3__["getNumberOfVerifications"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "compareProfilesByVerifications", function() { return _search_utils__WEBPACK_IMPORTED_MODULE_3__["compareProfilesByVerifications"]; });

/* harmony import */ var _encryption_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./encryption-utils */ "./src/utils/encryption-utils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "encrypt", function() { return _encryption_utils__WEBPACK_IMPORTED_MODULE_4__["encrypt"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "decrypt", function() { return _encryption_utils__WEBPACK_IMPORTED_MODULE_4__["decrypt"]; });

/* harmony import */ var _name_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./name-utils */ "./src/utils/name-utils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isABlockstackName", function() { return _name_utils__WEBPACK_IMPORTED_MODULE_5__["isABlockstackName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hasNameBeenPreordered", function() { return _name_utils__WEBPACK_IMPORTED_MODULE_5__["hasNameBeenPreordered"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isNameAvailable", function() { return _name_utils__WEBPACK_IMPORTED_MODULE_5__["isNameAvailable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isSubdomain", function() { return _name_utils__WEBPACK_IMPORTED_MODULE_5__["isSubdomain"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getNamePrices", function() { return _name_utils__WEBPACK_IMPORTED_MODULE_5__["getNamePrices"]; });

/* harmony import */ var _profile_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./profile-utils */ "./src/utils/profile-utils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getProfileFromTokens", function() { return _profile_utils__WEBPACK_IMPORTED_MODULE_6__["getProfileFromTokens"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "signProfileForUpload", function() { return _profile_utils__WEBPACK_IMPORTED_MODULE_6__["signProfileForUpload"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "verifyToken", function() { return _profile_utils__WEBPACK_IMPORTED_MODULE_6__["verifyToken"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_PROFILE", function() { return _profile_utils__WEBPACK_IMPORTED_MODULE_6__["DEFAULT_PROFILE"]; });

/* harmony import */ var _window_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./window-utils */ "./src/utils/window-utils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "openInNewTab", function() { return _window_utils__WEBPACK_IMPORTED_MODULE_7__["openInNewTab"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isMobile", function() { return _window_utils__WEBPACK_IMPORTED_MODULE_7__["isMobile"]; });

/* harmony import */ var _zone_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./zone-utils */ "./src/utils/zone-utils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getTokenFileUrlFromZoneFile", function() { return _zone_utils__WEBPACK_IMPORTED_MODULE_8__["getTokenFileUrlFromZoneFile"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveZoneFileToProfile", function() { return _zone_utils__WEBPACK_IMPORTED_MODULE_8__["resolveZoneFileToProfile"]; });




















/***/ }),

/***/ "./src/utils/name-utils.js":
/*!*********************************!*\
  !*** ./src/utils/name-utils.js ***!
  \*********************************/
/*! exports provided: isABlockstackName, isABlockstackIDName, isABlockstackAppName, hasNameBeenPreordered, isNameAvailable, isSubdomain, getNameSuffix, getNamePrices */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isABlockstackName", function() { return isABlockstackName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isABlockstackIDName", function() { return isABlockstackIDName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isABlockstackAppName", function() { return isABlockstackAppName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasNameBeenPreordered", function() { return hasNameBeenPreordered; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNameAvailable", function() { return isNameAvailable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSubdomain", function() { return isSubdomain; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNameSuffix", function() { return getNameSuffix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNamePrices", function() { return getNamePrices; });


const logger = console;

function isABlockstackName(s) {
  return /^[a-z0-9_-]+\.[a-z0-9_-]+$/.test(s)
}

function isABlockstackIDName(s) {
  return /^[a-z0-9_]+\.id$/.test(s)
}

function isABlockstackAppName(s) {
  return /^[a-z0-9-]+\.app$/.test(s)
}

function hasNameBeenPreordered(domainName, localIdentities) {
  let nameHasBeenPreordered = false
  localIdentities.map((identity) => {
    if (identity.username === domainName) {
      nameHasBeenPreordered = true
    }
    return null
  })
  return nameHasBeenPreordered
}

function isNameAvailable(lookupUrl, domainName) {
  console.log(domainName)
  return new Promise((resolve, reject) => {
    const url = lookupUrl.replace('{name}', domainName)
    fetch(url)
      .then(response => {
        if (response.ok) {
          resolve(false)
        } else {
          if (response.status === 404) {
            resolve(true)
          } else {
            logger.error('isNameAvailable', response)
            reject('Error')
          }
        }
      })
      .catch(error => {
        logger.error('isNameAvailable', error)
        reject(error)
      })
  })
}

/**
 * Performs a basic check to differentiate subdomains from other Blockstack
 * names
 * @param  {String}  name a Blockstack name
 * @return {Boolean} `true` if it is a subdomain, otherwise false
 */
function isSubdomain(name) {
  return name.split('.').length === 3
}

/**
 * Given a blockstack subdomain name, returns the
 * parent domain.
 * @param  {String} name a Blockstack subdomain name
 * @return {String}  the parent domain without leading period
 */
function getNameSuffix(name) {
  if (!isSubdomain(name)) {
    throw new Error('Only works with subdomains')
  }
  const nameTokens = name.split('.')
  const suffix = name.split(`${nameTokens[0]}.`)[1]
  return suffix
}

function getNamePrices(priceUrl, domainName) {
  return new Promise((resolve, reject) => {
    if (!isABlockstackName(domainName)) {
      reject('Not a Blockstack name')
      return
    }

    const url = `${priceUrl.replace('{name}', domainName)}?single_sig=1`

    fetch(url)
      .then()
      .then(response => {
        if (response.ok) {
          response
            .text()
            .then(responseText => JSON.parse(responseText))
            .then(responseJson => {
              resolve(responseJson)
            })
        } else {
          logger.error('getNamePrices: error parsing price result')
          reject('Error')
        }
      })
      .catch(error => {
        logger.error('getNamePrices: error retrieving price', error)
        reject(error)
      })
  })
}


/***/ }),

/***/ "./src/utils/profile-utils.js":
/*!************************************!*\
  !*** ./src/utils/profile-utils.js ***!
  \************************************/
/*! exports provided: verifyToken, verifyTokenRecord, getProfileFromTokens, getDefaultProfileUrl, fetchProfileLocations, signProfileForUpload, DEFAULT_PROFILE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "verifyToken", function() { return verifyToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "verifyTokenRecord", function() { return verifyTokenRecord; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getProfileFromTokens", function() { return getProfileFromTokens; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDefaultProfileUrl", function() { return getDefaultProfileUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchProfileLocations", function() { return fetchProfileLocations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "signProfileForUpload", function() { return signProfileForUpload; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_PROFILE", function() { return DEFAULT_PROFILE; });
/* harmony import */ var blockstack__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! blockstack */ "blockstack");
/* harmony import */ var blockstack__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(blockstack__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jsontokens__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsontokens */ "jsontokens");
/* harmony import */ var jsontokens__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsontokens__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ecurve__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ecurve */ "ecurve");
/* harmony import */ var ecurve__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ecurve__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bitcoinjs-lib */ "bitcoinjs-lib");
/* harmony import */ var bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_3__);







const logger = console;

const secp256k1 = ecurve__WEBPACK_IMPORTED_MODULE_2___default.a.getCurveByName('secp256k1')

function verifyToken(token, verifyingKeyOrAddress) {
  const decodedToken = Object(jsontokens__WEBPACK_IMPORTED_MODULE_1__["decodeToken"])(token)
  const payload = decodedToken.payload

  if (!payload.hasOwnProperty('subject')) {
    throw new Error('Token doesn\'t have a subject')
  }
  if (!payload.subject.hasOwnProperty('publicKey')) {
    throw new Error('Token doesn\'t have a subject public key')
  }
  if (!payload.hasOwnProperty('issuer')) {
    throw new Error('Token doesn\'t have an issuer')
  }
  if (!payload.issuer.hasOwnProperty('publicKey')) {
    throw new Error('Token doesn\'t have an issuer public key')
  }
  if (!payload.hasOwnProperty('claim')) {
    throw new Error('Token doesn\'t have a claim')
  }

  const issuerPublicKey = payload.issuer.publicKey
  const publicKeyBuffer = new Buffer(issuerPublicKey, 'hex')

  const Q = ecurve__WEBPACK_IMPORTED_MODULE_2___default.a.Point.decodeFrom(secp256k1, publicKeyBuffer)
  const compressedKeyPair = new bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_3__["ECPair"](null, Q, { compressed: true })
  const compressedAddress = compressedKeyPair.getAddress()
  const uncompressedKeyPair = new bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_3__["ECPair"](null, Q, { compressed: false })
  const uncompressedAddress = uncompressedKeyPair.getAddress()

  if (verifyingKeyOrAddress === issuerPublicKey) {
    // pass
  } else if (verifyingKeyOrAddress === compressedAddress) {
    // pass
  } else if (verifyingKeyOrAddress === uncompressedAddress) {
    // pass
  } else {
    throw new Error('Token issuer public key does not match the verifying value')
  }

  const tokenVerifier = new jsontokens__WEBPACK_IMPORTED_MODULE_1__["TokenVerifier"](decodedToken.header.alg, issuerPublicKey)
  if (!tokenVerifier) {
    throw new Error('Invalid token verifier')
  }

  const tokenVerified = tokenVerifier.verify(token)
  if (!tokenVerified) {
    throw new Error('Token verification failed')
  }

  return decodedToken
}

function verifyTokenRecord(tokenRecord, publicKeyOrAddress) {
  if (publicKeyOrAddress === null) {
    throw new Error('A public key or keychain is required')
  }

  if (typeof publicKeyOrAddress === 'string') {
    // do nothing
  } else {
    throw new Error('A valid address or public key is required')
  }

  const decodedToken = verifyToken(tokenRecord.token, publicKeyOrAddress)

  return decodedToken
}

function getProfileFromTokens(tokenRecords, publicKeychain, silentVerify = true) {
  let profile = {}

  tokenRecords.map(tokenRecord => {
    let decodedToken = null

    try {
      decodedToken = Object(jsontokens__WEBPACK_IMPORTED_MODULE_1__["decodeToken"])(tokenRecord.token)
      decodedToken = verifyTokenRecord(tokenRecord, publicKeychain)
    } catch (error) {
      if (!silentVerify) {
        throw error
      } else {
        console.warn(error)
      }
    }

    if (decodedToken !== null) {
      profile = Object.assign({}, profile, decodedToken.payload.claim)
    }

    return null
  })

  return profile
}

function getDefaultProfileUrl(gaiaUrlBase,
                                     ownerAddress) {
  return `${gaiaUrlBase}${ownerAddress}/profile.json`
}

/**
 * Try to fetch and verify a profile from the historic set of default locations,
 * in order of recency. If all of them return 404s, or fail to validate, return null
 */
function fetchProfileLocations(gaiaUrlBase,
                                      ownerAddress,
                                      firstAddress,
                                      ownerIndex) {
  function recursiveTryFetch(locations) {
    if (locations.length === 0) {
      return Promise.resolve(null)
    }
    const location = locations[0]
    return fetch(location)
      .then(response => {
        if (response.ok) {
          return response.json()
            .then(tokenRecords => getProfileFromTokens(tokenRecords, ownerAddress, false))
            .then(profile => {
              logger.debug(`Found valid profile at ${location}`)
              return { profile, profileUrl: location }
            })
            .catch(() => {
              logger.debug(`Failed to verify profile at ${location}... trying others`)
              return recursiveTryFetch(locations.slice(1))
            })
        } else {
          logger.debug(`Failed to find profile at ${location}... trying others`)
          return recursiveTryFetch(locations.slice(1))
        }
      })
      .catch(() => {
        logger.debug(`Error in fetching profile at ${location}... trying others`)
        return recursiveTryFetch(locations.slice(1))
      })
  }

  const urls = []
  // the new default
  urls.push(getDefaultProfileUrl(gaiaUrlBase, ownerAddress))

  // the 'indexed' URL --
  //  this is gaia/:firstAddress/:index/profile.json
  //  however, the index is _not_ equal to the current index.
  //  indexes were mapped from
  //    correct: [0, 1, 3, 5, 7, 9...]
  //  incorrect: [0, 1, 2, 3, 4, 5...]

  if (ownerIndex < 2) {
    urls.push(`${gaiaUrlBase}${firstAddress}/${ownerIndex}/profile.json`)
  } else if (ownerIndex % 2 === 1) {
    const buggedIndex = 1 + Math.floor(ownerIndex / 2)
    urls.push(`${gaiaUrlBase}${firstAddress}/${buggedIndex}/profile.json`)
  }

  return recursiveTryFetch(urls)
}

function signProfileForUpload(profile, keypair, api) {
  const privateKey = keypair.key
  const publicKey = keypair.keyID

  if (profile.api && profile.api.gaiaHubConfig) {
    profile.api.gaiaHubConfig = {
      url_prefix: profile.api.gaiaHubConfig.url_prefix
    }
  }

  if (api) {
    profile = {
      ...profile,
      api: {
        gaiaHubConfig: {
          url_prefix: api.gaiaHubConfig.url_prefix
        },
        gaiaHubUrl: api.gaiaHubUrl
      }
    }
  }

  const token = Object(blockstack__WEBPACK_IMPORTED_MODULE_0__["signProfileToken"])(profile, privateKey, { publicKey })
  const tokenRecord = Object(blockstack__WEBPACK_IMPORTED_MODULE_0__["wrapProfileToken"])(token)
  const tokenRecords = [tokenRecord]
  return JSON.stringify(tokenRecords, null, 2)
}

const DEFAULT_PROFILE = {
  '@type': 'Person',
  '@context': 'http://schema.org'
}


/***/ }),

/***/ "./src/utils/profile.ts":
/*!******************************!*\
  !*** ./src/utils/profile.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const sessionStore_1 = __webpack_require__(/*! blockstack/lib/auth/sessionStore */ "blockstack/lib/auth/sessionStore");
const bip39 = tslib_1.__importStar(__webpack_require__(/*! bip39 */ "bip39"));
const _utils_1 = __webpack_require__(/*! @utils */ "./src/utils/index.js");
const crypto = tslib_1.__importStar(__webpack_require__(/*! crypto */ "crypto"));
const blockstack = tslib_1.__importStar(__webpack_require__(/*! blockstack */ "blockstack"));
const radiks_1 = __webpack_require__(/*! radiks */ "radiks");
const bitcoinjs = __webpack_require__(/*! bitcoinjs-lib */ "bitcoinjs-lib");
__webpack_require__(/*! localstorage-polyfill */ "localstorage-polyfill");
exports.initWallet = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let action = 'none';
    const STRENGTH = 128;
    let backupPhraseCache = localStorage.getItem('backupPhrase');
    let backupPhrase;
    if (backupPhraseCache) {
        backupPhrase = backupPhraseCache;
    }
    else {
        action = 'create';
        backupPhrase = bip39.generateMnemonic(STRENGTH, crypto.randomBytes);
        yield localStorage.setItem('backupPhrase', backupPhrase);
    }
    let keychain = yield initWalletFromSeed(backupPhrase);
    return keychain;
});
function initWalletFromSeed(backupPhrase) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let masterKeychain = null;
        let action = 'none';
        const seedBuffer = yield bip39.mnemonicToSeed(backupPhrase);
        masterKeychain = yield bitcoinjs.HDNode.fromSeedBuffer(seedBuffer);
        let keychain = {
            backupPhrase: backupPhrase,
            masterKeychain: masterKeychain,
            action: action
        };
        return keychain;
    });
}
exports.initWalletFromSeed = initWalletFromSeed;
function makeUserSession(appPrivateKey, appPublicKey, username, profileJSON = null, scopes = ['store_write', 'publish_data'], appUrl = 'goodtimesx.com', hubUrl = 'https://hub.blockstack.org') {
    const appConfig = new blockstack.AppConfig(scopes, appUrl);
    const userData = {
        username: username,
        decentralizedID: 'did:btc-addr:' + appPublicKey,
        appPrivateKey: appPrivateKey,
        authResponseToken: '',
        hubUrl: hubUrl,
        identityAddress: appPublicKey,
        profile: profileJSON,
    };
    const dataStore = new sessionStore_1.InstanceDataStore({
        appPrivateKey: appPrivateKey,
        hubUrl: hubUrl,
        userData: userData
    });
    const userSession = new blockstack.UserSession({
        appConfig: appConfig,
        sessionStore: dataStore
    });
    return userSession;
}
exports.makeUserSession = makeUserSession;
function makeProfileJSON(profile, keypair, api) {
    let profileJSON = _utils_1.signProfileForUpload(profile, keypair, api);
    return profileJSON;
}
exports.makeProfileJSON = makeProfileJSON;
exports.saveProfileJSON = (userSession, profileJSON) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let resp = yield userSession.putFile('profile.json', JSON.stringify(profileJSON), { encrypt: false, contentType: 'application/json' });
    return resp;
});
function configureRadiks(userSession) {
    radiks_1.configure({
        apiServer: process.env.RADIKS_API_SERVER,
        userSession: userSession
    });
}
exports.configureRadiks = configureRadiks;
function rando() {
    return (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
}
exports.rando = rando;
exports.createBlockchainIdentity = (keychain, username = "good" + rando() + '.id.blockstack', avatarUrl = 'https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw/avatar-0', identitiesToGenerate = 2) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { identityKeypairs } = _utils_1.getBlockchainIdentities(keychain.masterKeychain, identitiesToGenerate);
    let browserPublicKey = identityKeypairs[0].address;
    let browserPrivateKey = identityKeypairs[0].key;
    let browserKeyID = identityKeypairs[0].keyID;
    let profile = makeNewProfile(browserPrivateKey, browserPublicKey, avatarUrl, username);
    let userSession = makeUserSession(browserPrivateKey, browserPublicKey, username, profile.decodedToken.payload.claim);
    let profileResp = exports.saveProfileJSON(userSession, [profile]);
    let appPublicKey = identityKeypairs[1].address;
    let appPrivateKey = identityKeypairs[1].key;
    return {
        appPublicKey: appPublicKey,
        appPrivateKey: appPrivateKey,
        identityKeypairs: identityKeypairs,
        profileJSON: profile,
        username: username,
        profileResp: profileResp
    };
});
function getPublicKeyFromPrivate(privateKey) {
    const keyPair = bitcoinjs.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
    return keyPair.publicKey.toString('hex');
}
exports.getPublicKeyFromPrivate = getPublicKeyFromPrivate;
function makeNewProfile(privateKey, publicKey, avatarUrl, username) {
    let api = {
        gaiaHubConfig: {
            url_prefix: 'https://gaia.blockstack.org/hub/'
        },
        gaiaHubUrl: 'https://hub.blockstack.org'
    };
    let profileJSON = makeProfileJSON(_utils_1.DEFAULT_PROFILE, { key: privateKey, keyID: publicKey }, api);
    let profile = (JSON.parse(profileJSON))[0];
    profile.decodedToken.payload.claim.image = [{
            '@type': 'ImageObject',
            'contentUrl': avatarUrl,
            'name': 'avatar'
        }];
    return profile;
}
exports.makeNewProfile = makeNewProfile;


/***/ }),

/***/ "./src/utils/search-utils.js":
/*!***********************************!*\
  !*** ./src/utils/search-utils.js ***!
  \***********************************/
/*! exports provided: getNumberOfVerifications, compareProfilesByVerifications */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNumberOfVerifications", function() { return getNumberOfVerifications; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compareProfilesByVerifications", function() { return compareProfilesByVerifications; });
function getNumberOfVerifications(profile) {
  let numberOfVerifications = 0
  if (profile && profile.twitter && profile.twitter.proof && profile.twitter.proof.url) {
    numberOfVerifications += 1
  }
  if (profile && profile.facebook && profile.facebook.proof && profile.facebook.proof.url) {
    numberOfVerifications += 1
  }
  if (profile && profile.github && profile.github.proof && profile.github.proof.url) {
    numberOfVerifications += 1
  }
  return numberOfVerifications
}


function compareProfilesByVerifications(resultA, resultB) {
  const numVerificationsA = getNumberOfVerifications(resultA.profile)
  const numVerificationsB = getNumberOfVerifications(resultB.profile)
  if (numVerificationsA < numVerificationsB) {
    return 1
  } else if (numVerificationsA > numVerificationsB) {
    return -1
  } else {
    return 0
  }
}


/***/ }),

/***/ "./src/utils/window-utils.js":
/*!***********************************!*\
  !*** ./src/utils/window-utils.js ***!
  \***********************************/
/*! exports provided: openInNewTab, isWindowsBuild, isWebAppBuild, isCoreEndpointDisabled, isMobile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openInNewTab", function() { return openInNewTab; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWindowsBuild", function() { return isWindowsBuild; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWebAppBuild", function() { return isWebAppBuild; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isCoreEndpointDisabled", function() { return isCoreEndpointDisabled; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMobile", function() { return isMobile; });
/* harmony import */ var _browser_store_settings_default__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./browser/store/settings/default */ "./src/utils/browser/store/settings/default.js");


function openInNewTab(url) {
  const win = window.open(url, '_blank')
  win.focus()
}

function isWindowsBuild() {
  const isWindowsBuildCompileFlag = false
  return isWindowsBuildCompileFlag === true
}

function isWebAppBuild() {
  const isWebAppCompileFlag = (  false && false )
  return isWebAppCompileFlag
}


/**
 * Will determine whether or not we should try to
 *  perform "private" core endpoint functions --
 *  basically, attempts to read/write the core wallet.
 * Tests using the compile flags determining if its
 *  a Windows / WebApp build and using the URL --
 * if it's the standard regtest URL, then, yes, try
 *  to do the private operations, otherwise, no.
 * @private
 */
function isCoreEndpointDisabled(testUrl) {
  return (isWindowsBuild() || isWebAppBuild() ||
    !testUrl.startsWith(_browser_store_settings_default__WEBPACK_IMPORTED_MODULE_0__["REGTEST_CORE_API_ENDPOINT"]))
}

const mobileWindowWidth = 768

function isMobile() {
  if (window.innerWidth <= mobileWindowWidth) {
    return true
  } else {
    return false
  }
}


/***/ }),

/***/ "./src/utils/workers/crypto-check.worker.js":
/*!**************************************************!*\
  !*** ./src/utils/workers/crypto-check.worker.js ***!
  \**************************************************/
/*! exports provided: isCryptoInWorkerSupported */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isCryptoInWorkerSupported", function() { return isCryptoInWorkerSupported; });

async function isCryptoInWorkerSupported() {
    const supported = global.crypto && global.crypto.getRandomValues
    return (!!supported).toString()
}

/***/ }),

/***/ "./src/utils/workers/decrypt.main.js":
/*!*******************************************!*\
  !*** ./src/utils/workers/decrypt.main.js ***!
  \*******************************************/
/*! exports provided: decrypt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decrypt", function() { return decrypt; });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var triplesec__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! triplesec */ "triplesec");
/* harmony import */ var triplesec__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(triplesec__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var bip39__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bip39 */ "bip39");
/* harmony import */ var bip39__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bip39__WEBPACK_IMPORTED_MODULE_2__);





const logger = console;
async function denormalizeMnemonic(normalizedMnemonic) {
  return bip39__WEBPACK_IMPORTED_MODULE_2___default.a.entropyToMnemonic(normalizedMnemonic)
}

async function decryptMnemonic(dataBuffer, password) {
  const salt = dataBuffer.slice(0, 16)
  const hmacSig = dataBuffer.slice(16, 48) // 32 bytes
  const cipherText = dataBuffer.slice(48)
  const hmacPayload = Buffer.concat([salt, cipherText])

  const keysAndIV = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.pbkdf2Sync(password, salt, 100000, 48, 'sha512')
  const encKey = keysAndIV.slice(0, 16)
  const macKey = keysAndIV.slice(16, 32)
  const iv = keysAndIV.slice(32, 48)

  const decipher = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.createDecipheriv('aes-128-cbc', encKey, iv)
  let plaintext = decipher.update(cipherText, '', 'hex')
  plaintext += decipher.final('hex')

  const hmac = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.createHmac('sha256', macKey)
  hmac.write(hmacPayload)
  const hmacDigest = hmac.digest()

  // hash both hmacSig and hmacDigest so string comparison time
  // is uncorrelated to the ciphertext
  const hmacSigHash = crypto__WEBPACK_IMPORTED_MODULE_0___default.a
    .createHash('sha256')
    .update(hmacSig)
    .digest()
    .toString('hex')

  const hmacDigestHash = crypto__WEBPACK_IMPORTED_MODULE_0___default.a
    .createHash('sha256')
    .update(hmacDigest)
    .digest()
    .toString('hex')

  if (hmacSigHash !== hmacDigestHash) {
    // not authentic
    throw new Error('Wrong password (HMAC mismatch)')
  }

  const mnemonic = await denormalizeMnemonic(plaintext)
  if (!bip39__WEBPACK_IMPORTED_MODULE_2___default.a.validateMnemonic(mnemonic)) {
    throw new Error('Wrong password (invalid plaintext)')
  }

  return mnemonic
}

function decryptLegacy(dataBuffer, password) {
  return new Promise((resolve, reject) => {
    triplesec__WEBPACK_IMPORTED_MODULE_1___default.a.decrypt(
      {
        key: new Buffer(password),
        data: dataBuffer
      },
      (err, plaintextBuffer) => {
        if (!err) {
          resolve(plaintextBuffer)
        } else {
          reject(err)
        }
      }
    )
  })
}

async function decrypt(hexEncryptedKey, password) {
  logger.debug('Decrypting from worker!')
  const dataBuffer = Buffer.from(hexEncryptedKey, 'hex')
  let mnemonic

  try {
    mnemonic = await decryptMnemonic(dataBuffer, password)
  } catch (err) {
    logger.error('Could not decrypt.', err)

    try {
      logger.debug('Trying to decrypt with legacy function.')
      mnemonic = await decryptLegacy(dataBuffer, password)
    } catch (e) {
      mnemonic = null
      logger.error('Could not decrypt again, most likely wrong password.')
      throw Error('Wrong Password.')
    }
  }
  return mnemonic.toString()
}


/***/ }),

/***/ "./src/utils/workers/decrypt.worker.js":
/*!*********************************************!*\
  !*** ./src/utils/workers/decrypt.worker.js ***!
  \*********************************************/
/*! exports provided: decrypt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decrypt", function() { return decrypt; });
/* harmony import */ var _decrypt_main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./decrypt.main */ "./src/utils/workers/decrypt.main.js");


async function decrypt(hexEncryptedKey, password) {
    return _decrypt_main__WEBPACK_IMPORTED_MODULE_0__["decrypt"](hexEncryptedKey, password)
}

/***/ }),

/***/ "./src/utils/workers/encrypt.main.js":
/*!*******************************************!*\
  !*** ./src/utils/workers/encrypt.main.js ***!
  \*******************************************/
/*! exports provided: encrypt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encrypt", function() { return encrypt; });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bip39__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bip39 */ "bip39");
/* harmony import */ var bip39__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bip39__WEBPACK_IMPORTED_MODULE_1__);



const logger = console;

async function normalizeMnemonic(mnemonic) {
  return bip39__WEBPACK_IMPORTED_MODULE_1___default.a.mnemonicToEntropy(mnemonic).toString('hex')
}

async function encryptMnemonic(mnemonic, password) {
  // must be bip39 mnemonic
  if (!bip39__WEBPACK_IMPORTED_MODULE_1___default.a.validateMnemonic(mnemonic)) {
    throw new Error('Not a valid bip39 nmemonic')
  }

  // normalize plaintext to fixed length byte string
  const plaintextNormalized = Buffer.from(
    await normalizeMnemonic(mnemonic),
    'hex'
  )

  // AES-128-CBC with SHA256 HMAC
  const salt = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.randomBytes(16)
  const keysAndIV = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.pbkdf2Sync(password, salt, 100000, 48, 'sha512')
  const encKey = keysAndIV.slice(0, 16)
  const macKey = keysAndIV.slice(16, 32)
  const iv = keysAndIV.slice(32, 48)

  const cipher = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.createCipheriv('aes-128-cbc', encKey, iv)
  let cipherText = cipher.update(plaintextNormalized, '', 'hex')
  cipherText += cipher.final('hex')

  const hmacPayload = Buffer.concat([salt, Buffer.from(cipherText, 'hex')])

  const hmac = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.createHmac('sha256', macKey)
  hmac.write(hmacPayload)
  const hmacDigest = hmac.digest()

  return Buffer.concat([salt, hmacDigest, Buffer.from(cipherText, 'hex')])
}

async function encrypt(mnemonic, password) {
  logger.debug('Encrypting from worker', mnemonic, password)
  const encryptedBuffer = await encryptMnemonic(mnemonic, password)
  return encryptedBuffer.toString('hex')
}


/***/ }),

/***/ "./src/utils/workers/encrypt.worker.js":
/*!*********************************************!*\
  !*** ./src/utils/workers/encrypt.worker.js ***!
  \*********************************************/
/*! exports provided: encrypt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encrypt", function() { return encrypt; });
/* harmony import */ var _encrypt_main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./encrypt.main */ "./src/utils/workers/encrypt.main.js");


async function encrypt(mnemonic, password) {
    return _encrypt_main__WEBPACK_IMPORTED_MODULE_0__["encrypt"](mnemonic, password)
}

/***/ }),

/***/ "./src/utils/zone-utils.js":
/*!*********************************!*\
  !*** ./src/utils/zone-utils.js ***!
  \*********************************/
/*! exports provided: getTokenFileUrlFromZoneFile, resolveZoneFileToProfile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTokenFileUrlFromZoneFile", function() { return getTokenFileUrlFromZoneFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolveZoneFileToProfile", function() { return resolveZoneFileToProfile; });
/* harmony import */ var blockstack__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! blockstack */ "blockstack");
/* harmony import */ var blockstack__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(blockstack__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _profile_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./profile-utils */ "./src/utils/profile-utils.js");
/* harmony import */ var zone_file__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! zone-file */ "zone-file");
/* harmony import */ var zone_file__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(zone_file__WEBPACK_IMPORTED_MODULE_2__);





const logger = console;

function getTokenFileUrlFromZoneFile(zoneFileJson) {
  if (!zoneFileJson.hasOwnProperty('uri')) {
    return null
  }
  if (!Array.isArray(zoneFileJson.uri)) {
    return null
  }
  if (zoneFileJson.uri.length < 1) {
    return null
  }
  const firstUriRecord = zoneFileJson.uri[0]

  if (!firstUriRecord.hasOwnProperty('target')) {
    return null
  }
  let tokenFileUrl = firstUriRecord.target

  if (tokenFileUrl.startsWith('https')) {
    // pass
  } else if (tokenFileUrl.startsWith('http')) {
    // pass
  } else {
    tokenFileUrl = `https://${tokenFileUrl}`
  }

  return tokenFileUrl
}

function resolveZoneFileToProfile(zoneFile, publicKeyOrAddress) {
  return new Promise((resolve, reject) => {
    let zoneFileJson = null
    try {
      zoneFileJson = Object(zone_file__WEBPACK_IMPORTED_MODULE_2__["parseZoneFile"])(zoneFile)
      if (!zoneFileJson.hasOwnProperty('$origin')) {
        zoneFileJson = null
      }
    } catch (e) {
      reject(e)
    }

    let tokenFileUrl = null
    if (zoneFileJson && Object.keys(zoneFileJson).length > 0) {
      tokenFileUrl = getTokenFileUrlFromZoneFile(zoneFileJson)
    } else {
      let profile = null
      try {
        profile = JSON.parse(zoneFile)
        profile = blockstack__WEBPACK_IMPORTED_MODULE_0__["Person"].fromLegacyFormat(profile).profile()
      } catch (error) {
        reject(error)
      }
      resolve(profile)
      return
    }

    if (tokenFileUrl) {
      fetch(tokenFileUrl)
        .catch(error => {
          logger.error(
            'resolveZoneFileToProfile: error fetching token file without CORS proxy',
            error
          )
          return proxyFetch(tokenFileUrl)
        })
        .then(response => response.text())
        .then(responseText => JSON.parse(responseText))
        .then(responseJson => {
          const tokenRecords = responseJson
          const profile = Object(_profile_utils__WEBPACK_IMPORTED_MODULE_1__["getProfileFromTokens"])(tokenRecords, publicKeyOrAddress)

          resolve(profile)
          return
        })
        .catch(error => {
          logger.error(`resolveZoneFileToProfile: error fetching token file ${tokenFileUrl}`, error)
          reject(error)
        })
    } else {
      logger.warn('Token file url not found. Resolving to blank profile.')
      resolve({})
      return
    }
  })
}


/***/ }),

/***/ 0:
/*!*************************************************!*\
  !*** multi webpack/hot/poll?100 ./src/index.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?100 */"./node_modules/webpack/hot/poll.js?100");
module.exports = __webpack_require__(/*! ./src/index.ts */"./src/index.ts");


/***/ }),

/***/ "@awaitjs/express":
/*!***********************************!*\
  !*** external "@awaitjs/express" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@awaitjs/express");

/***/ }),

/***/ "bip39":
/*!************************!*\
  !*** external "bip39" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bip39");

/***/ }),

/***/ "bitcoinjs-lib":
/*!********************************!*\
  !*** external "bitcoinjs-lib" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bitcoinjs-lib");

/***/ }),

/***/ "blockstack":
/*!*****************************!*\
  !*** external "blockstack" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("blockstack");

/***/ }),

/***/ "blockstack/lib/auth/sessionStore":
/*!***************************************************!*\
  !*** external "blockstack/lib/auth/sessionStore" ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("blockstack/lib/auth/sessionStore");

/***/ }),

/***/ "command-line-args":
/*!************************************!*\
  !*** external "command-line-args" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("command-line-args");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "ecurve":
/*!*************************!*\
  !*** external "ecurve" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("ecurve");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "hash-handler":
/*!*******************************!*\
  !*** external "hash-handler" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("hash-handler");

/***/ }),

/***/ "http-status-codes":
/*!************************************!*\
  !*** external "http-status-codes" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http-status-codes");

/***/ }),

/***/ "jsontokens":
/*!*****************************!*\
  !*** external "jsontokens" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsontokens");

/***/ }),

/***/ "localstorage-polyfill":
/*!****************************************!*\
  !*** external "localstorage-polyfill" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("localstorage-polyfill");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "node-fetch":
/*!*****************************!*\
  !*** external "node-fetch" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "radiks":
/*!*************************!*\
  !*** external "radiks" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("radiks");

/***/ }),

/***/ "radiks-server":
/*!********************************!*\
  !*** external "radiks-server" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("radiks-server");

/***/ }),

/***/ "radiks-server/app/lib/constants":
/*!**************************************************!*\
  !*** external "radiks-server/app/lib/constants" ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("radiks-server/app/lib/constants");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),

/***/ "triplesec":
/*!****************************!*\
  !*** external "triplesec" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("triplesec");

/***/ }),

/***/ "tslib":
/*!************************!*\
  !*** external "tslib" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tslib");

/***/ }),

/***/ "window":
/*!*************************!*\
  !*** external "window" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("window");

/***/ }),

/***/ "wolfy87-eventemitter":
/*!***************************************!*\
  !*** external "wolfy87-eventemitter" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("wolfy87-eventemitter");

/***/ }),

/***/ "zone-file":
/*!****************************!*\
  !*** external "zone-file" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("zone-file");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map