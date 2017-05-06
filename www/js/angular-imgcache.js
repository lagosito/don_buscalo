/*jslint indent: 4, maxlen: 100, vars: true */
/*globals angular, ImgCache, ionic */

(function (ng, ImgCache) {
    'use strict';

    var imgCacheModule = ng.module('angular-imgcache', []);

    imgCacheModule.factory('ImgCacheService', ['$q', '$log', function ($q, $log) {
        var deferredReady = $q.defer();

        var cacheImage,
            getImage,
            getCachedImageUrl,
            isCached,
            clearCache;

        cacheImage = function (fileUri) {
            var deferred = $q.defer();

            function onSuccess() {
                deferred.resolve();
            }

            function onFail(error) {
                /*
                 @name error
                 @property code {number}
                 @property source {string} (is an URI)
                 @property target {string} (is an URI)
                 */
                deferred.reject(error);
            }

            function onProgress(event) {
                /*
                 @name event
                 @property totalSize {number} (if lengthComputable === true, else 0)
                 @property position {number}
                 @property total {number} (if lengthComputable === true, else 0)
                 @property lengthComputable {boolean}
                 */
                deferred.notify(event);
            }

            ImgCache.cacheFile(fileUri, onSuccess, onFail, onProgress);

            return deferred.promise;
        };

        getImage = function (fileUri) {
            var deferred = $q.defer();

            function callback(onlineSrc, offlineFileEntry) {
                if (offlineFileEntry === null) {
                    deferred.reject();
                } else {
                    deferred.resolve({
                        onlineSrc: onlineSrc,
                        offlineFileEntry: offlineFileEntry
                    });
                }
            }

            ImgCache.getCachedFile(fileUri, callback);

            return deferred.promise;
        };

        getCachedImageUrl = function (entry) {
            return ImgCache.getCachedFileURL(entry.fullPath);
        };

        isCached = function (fileUri) {
            return ImgCache.isCached(fileUri);
        };

        clearCache = function () {
            ImgCache.clearCache();
        };

        (function initImgCacheService() {
            ionic.Platform.ready(function () {
                //ImgCache.options.debug = true;
                ImgCache.options.chromeQuota = 50 * 1024 * 1024;

                ImgCache.init(function () {
                    deferredReady.resolve();
                }, function () {
                    $log.warn('ImgCache init: error! Enable debug & check the logs for errors');
                    deferredReady.reject();
                });
            });
        }());

        return {
            ready: deferredReady.promise,
            cacheImage: cacheImage,
            getImage: getImage,
            getCachedImageUrl: getCachedImageUrl,
            isCached: isCached,
            clearCache: clearCache
        };
    }]);
}(angular, ImgCache));
