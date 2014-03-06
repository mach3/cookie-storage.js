/*!
 * CookieStorage
 * -------------
 * Use cookie as object storage
 *
 * @version 0.1.0
 * @author mach3 <http://github.com/mach3>
 * @license MIT License
 * @url http://github.com/mach3/cookie-storage.js
 */
 (function(global, doc){

	var u, CookieStorage;

	/**
	 * Utilities
	 * ---------
	 */

	u = {

		/**
		 * Get type of an object as string
		 * @param {*} obj
		 * @returns {String}
		 */
		type: function(obj){
			var m = Object.prototype.toString.call(obj).match(/\[object\s(\w+?)\]/);
			return !! m ? m[1].toLowerCase() : null;
		},

		/**
		 * Extend properties of source object
		 * @param {Object} dest
		 * @param {Object} src
		 * @preturn {Object}
		 */
		extend: function(dest, src){
			u.each(src, function(value, key){
				dest[key] = value;
			});
			return dest;
		},

		/**
		 * Process callback on each properties
		 * @param {Object|Array} obj
		 * @param {Function} callback
		 * @returns {Object|Array}
		 */
		each: function(obj, callback){
			var i;
			if(this.type(obj) === "array"){
				for(i=0; i<obj.length; i++){
					if(false === callback(obj[i], i, obj)){ break; }
				}
			} else {
				for(i in obj){
					if(! obj.hasOwnProperty(i)){ continue; }
					if(false === callback(obj[i], i, obj)){ break; }
				}
			}
			return obj;
		},

		/**
		 * Parse cookie strings
		 * @param {String} str
		 * @returns {Object}
		 */
		parseCookie: function(str){
			var vars = {};
			this.each(str.split(";"), function(item){
				var m = item.match(/^(.+?)=(.+)$/);
				if(!! m){ vars[m[1]] = m[2]; }
			});
			return vars;
		},

		/**
		 * Get delayed date by seconds
		 * @param {Date} date
		 * @param {Integer} sec
		 * @returns {Date}
		 */
		delayDate: function(date, sec){
			date.setTime(date.getTime() + sec * 1000);
			return date;
		},

		/**
		 * Get defference of the dates as seconds
		 * @param {Date} end
		 * @param {Date} now
		 * @return {Integer}
		 */
		diffTime: function(end, now){
			return parseInt((end.getTime() - now.getTime()) / 1000, 10);
		}
	};

	/**
	 * CookieStorage
	 * -------------
	 * @class Use cookie as object storage
	 */
	CookieStorage = function(/* name, options */){
		this.init.apply(this, arguments);
	};

	(function(){

		/**
		 * Defaults for options:
		 * - {String} path - Path string for cookie
		 * - {String} domain - Domain string for cookie
		 * - {Integer} lifetime - Lifetime of cookie as seconds by now
		 * - {Boolean} secure - Restrict for the secure connection or not
		 */
		this.defaults = {
			path: null,
			domain: null,
			lifetime: null,
			secure: false
		};

		this.name = null;
		this.options = null;
		this.data = null;

		/**
		 * Initialize
		 * @constructor
		 * @param {String} name
		 * @param {Object} options (optional)
		 */
		this.init = function(name, options){
			// has name ?
			if(u.type(name) !== "string"){
				throw new Error("Invalid storage name.");
			}
			this.name = name;

			// configure
			this.options = {};
			this.config({}).config(this.defaults);
			if(u.type(options) === "object"){
				this.config(options);
			}

			// initialize data
			this.fetch();
		};

		/**
		 * Configure options
		 * - o.config(key, value); // set value
		 * - o.config(key); // return value
		 * - o.config(options); // set value with object
		 * - o.config(); // get all
		 * @param {Object|String} - Options as object or key as string
		 * @param {*} - Value as any
		 * @returns {*|CookieStorage}
		 */
		this.config = function(/* [options|key [, value]] */){
			var args = Array.prototype.slice.call(arguments);
			switch(true){
				case u.type(args[0]) === "undefined":
					return this.options;
				case u.type(args[0]) === "string" && args.length > 1:
					this.options[args[0]] = args[1];
					return this;
				case u.type(args[0]) === "string" && args.length === 1:
					return this.options[args[0]];
				case u.type(args[0]) === "object":
					u.extend(this.options, args[0]);
					return this;
				default:
					return this;
			}
		};

		/**
		 * Fetch stored data from cookie
		 * @returns {CookieStorage}
		 */
		this.fetch = function(){
			var vars, name;
			vars = u.parseCookie(document.cookie);
			name = encodeURIComponent(this.name);
			this.data = (name in vars) ? JSON.parse(decodeURIComponent(vars[name])) : {};
			return this;
		};

		/**
		 * Set data
		 * - o.set(key, value); // set value with key-value pair
		 * - o.set(data); // set value with object
		 * @param {String|Object} key
		 * @param {*} value
		 * @returns {*|CookieStorage}
		 */
		this.set = function(key, value){
			var my = this;
			if(u.type(key) === "object"){
				u.each(key, function(_value, _key){
					my.set(_key, _value);
				});
				return this;
			}
			this.data[key] = value;
			return this;
		};

		/**
		 * Get data value
		 * - o.get(key); // get value by key
		 * - o.get(); // get all
		 * @param {String} key
		 * @returns {*}
		 */
		this.get = function(key){
			if(key === undefined){
				return this.data;
			}
			return this.data[key];
		};

		/**
		 * Remove value from data by key
		 * @param {String} key
		 */
		this.remove = function(key){
			var data = {};
			if(!! key){
				u.each(this.data, function(_value, _key){
					if(_key !== key){
						data[_key] = _value;
					}
				});
				this.data = data;
			}
			return this;
		};

		/**
		 * Save data to cookie
		 * @returns {*}
		 */
		this.save = function(){
			var cookie = encodeURIComponent(this.name)
			+ "=" + encodeURIComponent(JSON.stringify(this.data))
			+ ";" + this.getSuffix();
			doc.cookie = cookie;
			return this;
		};

		/**
		 * Generate suffix for cookie string
		 * @returns {String}
		 */
		this.getSuffix = function(){
			var suffixes, my = this;

			suffixes = [];

			// as is if not null
			u.each(["path", "domain"], function(key){
				var value = my.config(key);
				if(my.config(key)){
					suffixes.push(key + "=" + my.config(key));
				}
			});

			// lifetime
			(function(lifetime){
				var end, now = new Date();
				if(lifetime === null){
					return;
				}
				if(lifetime === Infinity){
					end = new Date("2038/1/8 00:00:00");
					suffixes.push("max-age=" + u.diffTime(end, now));
					suffixes.push("expires=" + end.toUTCString());
					return;
				}
				suffixes.push("max-age=" + lifetime);
				suffixes.push("expires=" + u.delayDate(now, lifetime).toUTCString());
			}(this.config("lifetime")));

			// secure
			if(this.config("secure")){
				suffixes.push("secure");
			}

			return suffixes.join(";");
		};

		/**
		 * Clear all data
		 * - If save == true, save data to cookie after clear it
		 * @param {Boolean} save
		 */
		this.clear = function(save){
			this.data = {};
			return save ? this.save() : this;
		};

	}).call(CookieStorage.prototype);


	/**
	 * Interface
	 * ---------
	 * Use noConflict() not to conflict with the same named
	 */
	(function(){
		var _originalCookieStorage = global.CookieStorage;
		global.CookieStorage = CookieStorage;
		global.CookieStorage.noConflict = function(){
			global.CookieStorage = _originalCookieStorage;
			return CookieStorage;
		};
	}());

}(window, document));