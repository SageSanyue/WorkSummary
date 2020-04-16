var ENV = "prod"; // 控制开关,dev master环境时改为dev
var URLS = {
	dev: {
		apiDomain: 'http://store.dev.com/api/'
	},
	test: {
		apiDomain: 'http://store.staging2.com/api/'
	},
	pre: {
		apiDomain: 'http://store.pre.com/api/'
	},
	prod: {
		apiDomain: 'http://store.prod.com/api/'
	}
};
(function(win, $) {

	function hasOwnProperty(obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	function isFunction(it) {
		return Object.prototype.toString.call(it) === '[object Function]';
	}

	function isArray(it) {
		return Object.prototype.toString.call(it) === '[object Array]';
	}

	function inArray(it, arr) {
		var flag = -1;
		for (var i = 0, len = arr.length; i < len; i++) {
			if (it === arr[i]) flag = i;
		}
		return flag;
	}

	function eachProp(obj, func) {
		var prop;
		for (prop in obj) {
			if (hasOwnProperty(obj, prop)) {
				if (func(obj[prop], prop)) {
					break;
				}
			}
		}
	}
	function mixin(target, source, force, deepStringMixin) {
		if (source) {
			eachProp(source, function(value, prop) {
				if (force || !hasOwnProperty(target, prop)) {
					if (deepStringMixin && typeof value === 'object' && value &&
						!isArray(value) && !isFunction(value) &&
						!(value instanceof RegExp)) {
						if (!target[prop]) {
							target[prop] = {};
						}
						mixin(target[prop], value, force, deepStringMixin);
					} else {
						target[prop] = value;
					}
				}
			});
		}
		return target;
	}

	function Utils() {
		this.init();
	}

	Utils.prototype = {
		init: function() {
			this.toastTimer = null;
		},
		hasProp: hasOwnProperty,
		isFunction: isFunction,
		isArray: isArray,
		inArray: inArray,
		eachProp: eachProp,
		mixin: mixin,
		ajax: function(url, method, data, resolve, reject, timeout) {
			if (!$) return;
			$.ajax({
				type: method,
				url: url,
				data: data,
				dataType: "json",
				crossDomain: true,
				timeout: timeout || 20000,
				success: function(data) {
					typeof resolve === 'function' && resolve.call(win, data);
				},
				error: function(e) {
					typeof reject === 'function' && reject.call(win);
				}
			});
		}
	}
	win.Utils = new Utils;
})(window, window.jQuery);