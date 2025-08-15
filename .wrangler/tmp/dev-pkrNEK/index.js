(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // .wrangler/tmp/bundle-njUoEZ/strip-cf-connecting-ip-header.js
  function stripCfConnectingIPHeader(input, init) {
    const request = new Request(input, init);
    request.headers.delete("CF-Connecting-IP");
    return request;
  }
  __name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
  globalThis.fetch = new Proxy(globalThis.fetch, {
    apply(target, thisArg, argArray) {
      return Reflect.apply(target, thisArg, [
        stripCfConnectingIPHeader.apply(null, argArray)
      ]);
    }
  });

  // node_modules/wrangler/templates/middleware/common.ts
  var __facade_middleware__ = [];
  function __facade_register__(...args) {
    __facade_middleware__.push(...args.flat());
  }
  __name(__facade_register__, "__facade_register__");
  function __facade_registerInternal__(...args) {
    __facade_middleware__.unshift(...args.flat());
  }
  __name(__facade_registerInternal__, "__facade_registerInternal__");
  function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
    const [head, ...tail] = middlewareChain;
    const middlewareCtx = {
      dispatch,
      next(newRequest, newEnv) {
        return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
      }
    };
    return head(request, env, ctx, middlewareCtx);
  }
  __name(__facade_invokeChain__, "__facade_invokeChain__");
  function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
    return __facade_invokeChain__(request, env, ctx, dispatch, [
      ...__facade_middleware__,
      finalMiddleware
    ]);
  }
  __name(__facade_invoke__, "__facade_invoke__");

  // node_modules/wrangler/templates/middleware/loader-sw.ts
  var __FACADE_EVENT_TARGET__;
  if (globalThis.MINIFLARE) {
    __FACADE_EVENT_TARGET__ = new (Object.getPrototypeOf(WorkerGlobalScope))();
  } else {
    __FACADE_EVENT_TARGET__ = new EventTarget();
  }
  function __facade_isSpecialEvent__(type) {
    return type === "fetch" || type === "scheduled";
  }
  __name(__facade_isSpecialEvent__, "__facade_isSpecialEvent__");
  var __facade__originalAddEventListener__ = globalThis.addEventListener;
  var __facade__originalRemoveEventListener__ = globalThis.removeEventListener;
  var __facade__originalDispatchEvent__ = globalThis.dispatchEvent;
  globalThis.addEventListener = function(type, listener, options) {
    if (__facade_isSpecialEvent__(type)) {
      __FACADE_EVENT_TARGET__.addEventListener(
        type,
        listener,
        options
      );
    } else {
      __facade__originalAddEventListener__(type, listener, options);
    }
  };
  globalThis.removeEventListener = function(type, listener, options) {
    if (__facade_isSpecialEvent__(type)) {
      __FACADE_EVENT_TARGET__.removeEventListener(
        type,
        listener,
        options
      );
    } else {
      __facade__originalRemoveEventListener__(type, listener, options);
    }
  };
  globalThis.dispatchEvent = function(event) {
    if (__facade_isSpecialEvent__(event.type)) {
      return __FACADE_EVENT_TARGET__.dispatchEvent(event);
    } else {
      return __facade__originalDispatchEvent__(event);
    }
  };
  globalThis.addMiddleware = __facade_register__;
  globalThis.addMiddlewareInternal = __facade_registerInternal__;
  var __facade_waitUntil__ = Symbol("__facade_waitUntil__");
  var __facade_response__ = Symbol("__facade_response__");
  var __facade_dispatched__ = Symbol("__facade_dispatched__");
  var __Facade_ExtendableEvent__ = class extends Event {
    [__facade_waitUntil__] = [];
    waitUntil(promise) {
      if (!(this instanceof __Facade_ExtendableEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this[__facade_waitUntil__].push(promise);
    }
  };
  __name(__Facade_ExtendableEvent__, "__Facade_ExtendableEvent__");
  var __Facade_FetchEvent__ = class extends __Facade_ExtendableEvent__ {
    #request;
    #passThroughOnException;
    [__facade_response__];
    [__facade_dispatched__] = false;
    constructor(type, init) {
      super(type);
      this.#request = init.request;
      this.#passThroughOnException = init.passThroughOnException;
    }
    get request() {
      return this.#request;
    }
    respondWith(response) {
      if (!(this instanceof __Facade_FetchEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      if (this[__facade_response__] !== void 0) {
        throw new DOMException(
          "FetchEvent.respondWith() has already been called; it can only be called once.",
          "InvalidStateError"
        );
      }
      if (this[__facade_dispatched__]) {
        throw new DOMException(
          "Too late to call FetchEvent.respondWith(). It must be called synchronously in the event handler.",
          "InvalidStateError"
        );
      }
      this.stopImmediatePropagation();
      this[__facade_response__] = response;
    }
    passThroughOnException() {
      if (!(this instanceof __Facade_FetchEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this.#passThroughOnException();
    }
  };
  __name(__Facade_FetchEvent__, "__Facade_FetchEvent__");
  var __Facade_ScheduledEvent__ = class extends __Facade_ExtendableEvent__ {
    #scheduledTime;
    #cron;
    #noRetry;
    constructor(type, init) {
      super(type);
      this.#scheduledTime = init.scheduledTime;
      this.#cron = init.cron;
      this.#noRetry = init.noRetry;
    }
    get scheduledTime() {
      return this.#scheduledTime;
    }
    get cron() {
      return this.#cron;
    }
    noRetry() {
      if (!(this instanceof __Facade_ScheduledEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this.#noRetry();
    }
  };
  __name(__Facade_ScheduledEvent__, "__Facade_ScheduledEvent__");
  __facade__originalAddEventListener__("fetch", (event) => {
    const ctx = {
      waitUntil: event.waitUntil.bind(event),
      passThroughOnException: event.passThroughOnException.bind(event)
    };
    const __facade_sw_dispatch__ = /* @__PURE__ */ __name(function(type, init) {
      if (type === "scheduled") {
        const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
          scheduledTime: Date.now(),
          cron: init.cron ?? "",
          noRetry() {
          }
        });
        __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
        event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      }
    }, "__facade_sw_dispatch__");
    const __facade_sw_fetch__ = /* @__PURE__ */ __name(function(request, _env, ctx2) {
      const facadeEvent = new __Facade_FetchEvent__("fetch", {
        request,
        passThroughOnException: ctx2.passThroughOnException
      });
      __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
      facadeEvent[__facade_dispatched__] = true;
      event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      const response = facadeEvent[__facade_response__];
      if (response === void 0) {
        throw new Error("No response!");
      }
      return response;
    }, "__facade_sw_fetch__");
    event.respondWith(
      __facade_invoke__(
        event.request,
        globalThis,
        ctx,
        __facade_sw_dispatch__,
        __facade_sw_fetch__
      )
    );
  });
  __facade__originalAddEventListener__("scheduled", (event) => {
    const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
      scheduledTime: event.scheduledTime,
      cron: event.cron,
      noRetry: event.noRetry.bind(event)
    });
    __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
    event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
  });

  // node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
  var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
    try {
      return await middlewareCtx.next(request, env);
    } finally {
      try {
        if (request.body !== null && !request.bodyUsed) {
          const reader = request.body.getReader();
          while (!(await reader.read()).done) {
          }
        }
      } catch (e) {
        console.error("Failed to drain the unused request body.", e);
      }
    }
  }, "drainBody");
  var middleware_ensure_req_body_drained_default = drainBody;

  // node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
  function reduceError(e) {
    return {
      name: e?.name,
      message: e?.message ?? String(e),
      stack: e?.stack,
      cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
    };
  }
  __name(reduceError, "reduceError");
  var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
    try {
      return await middlewareCtx.next(request, env);
    } catch (e) {
      const error = reduceError(e);
      return Response.json(error, {
        status: 500,
        headers: { "MF-Experimental-Error-Stack": "true" }
      });
    }
  }, "jsonError");
  var middleware_miniflare3_json_error_default = jsonError;

  // .wrangler/tmp/bundle-njUoEZ/middleware-insertion-facade.js
  __facade_registerInternal__([middleware_ensure_req_body_drained_default, middleware_miniflare3_json_error_default]);

  // .output/server/index.mjs
  globalThis._importMeta_ = { url: "file:///_entry.js", env: {} }, function() {
    "use strict";
    function createNotImplementedError(e2) {
      return new Error(`[unenv] ${e2} is not implemented yet!`);
    }
    __name(createNotImplementedError, "createNotImplementedError");
    function notImplemented(e2) {
      return Object.assign(() => {
        throw createNotImplementedError(e2);
      }, { __unenv__: true });
    }
    __name(notImplemented, "notImplemented");
    const e = [], t = [], r = "undefined" == typeof Uint8Array ? Array : Uint8Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (let r2 = 0, a2 = 64; r2 < a2; ++r2)
      e[r2] = s[r2], t[s.charCodeAt(r2)] = r2;
    function toByteArray(e2) {
      let s2;
      const a2 = function(e3) {
        const t2 = e3.length;
        if (t2 % 4 > 0)
          throw new Error("Invalid string. Length must be a multiple of 4");
        let r2 = e3.indexOf("=");
        return -1 === r2 && (r2 = t2), [r2, r2 === t2 ? 0 : 4 - r2 % 4];
      }(e2), c2 = a2[0], p2 = a2[1], u2 = new r(function(e3, t2, r2) {
        return 3 * (t2 + r2) / 4 - r2;
      }(0, c2, p2));
      let d2 = 0;
      const f2 = p2 > 0 ? c2 - 4 : c2;
      let m2;
      for (m2 = 0; m2 < f2; m2 += 4)
        s2 = t[e2.charCodeAt(m2)] << 18 | t[e2.charCodeAt(m2 + 1)] << 12 | t[e2.charCodeAt(m2 + 2)] << 6 | t[e2.charCodeAt(m2 + 3)], u2[d2++] = s2 >> 16 & 255, u2[d2++] = s2 >> 8 & 255, u2[d2++] = 255 & s2;
      return 2 === p2 && (s2 = t[e2.charCodeAt(m2)] << 2 | t[e2.charCodeAt(m2 + 1)] >> 4, u2[d2++] = 255 & s2), 1 === p2 && (s2 = t[e2.charCodeAt(m2)] << 10 | t[e2.charCodeAt(m2 + 1)] << 4 | t[e2.charCodeAt(m2 + 2)] >> 2, u2[d2++] = s2 >> 8 & 255, u2[d2++] = 255 & s2), u2;
    }
    __name(toByteArray, "toByteArray");
    function tripletToBase64(t2) {
      return e[t2 >> 18 & 63] + e[t2 >> 12 & 63] + e[t2 >> 6 & 63] + e[63 & t2];
    }
    __name(tripletToBase64, "tripletToBase64");
    function encodeChunk(e2, t2, r2) {
      let s2;
      const a2 = [];
      for (let c2 = t2; c2 < r2; c2 += 3)
        s2 = (e2[c2] << 16 & 16711680) + (e2[c2 + 1] << 8 & 65280) + (255 & e2[c2 + 2]), a2.push(tripletToBase64(s2));
      return a2.join("");
    }
    __name(encodeChunk, "encodeChunk");
    function fromByteArray(t2) {
      let r2;
      const s2 = t2.length, a2 = s2 % 3, c2 = [], p2 = 16383;
      for (let e2 = 0, r3 = s2 - a2; e2 < r3; e2 += p2)
        c2.push(encodeChunk(t2, e2, e2 + p2 > r3 ? r3 : e2 + p2));
      return 1 === a2 ? (r2 = t2[s2 - 1], c2.push(e[r2 >> 2] + e[r2 << 4 & 63] + "==")) : 2 === a2 && (r2 = (t2[s2 - 2] << 8) + t2[s2 - 1], c2.push(e[r2 >> 10] + e[r2 >> 4 & 63] + e[r2 << 2 & 63] + "=")), c2.join("");
    }
    __name(fromByteArray, "fromByteArray");
    function read(e2, t2, r2, s2, a2) {
      let c2, p2;
      const u2 = 8 * a2 - s2 - 1, d2 = (1 << u2) - 1, f2 = d2 >> 1;
      let m2 = -7, g2 = r2 ? a2 - 1 : 0;
      const x2 = r2 ? -1 : 1;
      let _2 = e2[t2 + g2];
      for (g2 += x2, c2 = _2 & (1 << -m2) - 1, _2 >>= -m2, m2 += u2; m2 > 0; )
        c2 = 256 * c2 + e2[t2 + g2], g2 += x2, m2 -= 8;
      for (p2 = c2 & (1 << -m2) - 1, c2 >>= -m2, m2 += s2; m2 > 0; )
        p2 = 256 * p2 + e2[t2 + g2], g2 += x2, m2 -= 8;
      if (0 === c2)
        c2 = 1 - f2;
      else {
        if (c2 === d2)
          return p2 ? Number.NaN : (_2 ? -1 : 1) * Number.POSITIVE_INFINITY;
        p2 += Math.pow(2, s2), c2 -= f2;
      }
      return (_2 ? -1 : 1) * p2 * Math.pow(2, c2 - s2);
    }
    __name(read, "read");
    function write(e2, t2, r2, s2, a2, c2) {
      let p2, u2, d2, f2 = 8 * c2 - a2 - 1;
      const m2 = (1 << f2) - 1, g2 = m2 >> 1, x2 = 23 === a2 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      let _2 = s2 ? 0 : c2 - 1;
      const E2 = s2 ? 1 : -1, S2 = t2 < 0 || 0 === t2 && 1 / t2 < 0 ? 1 : 0;
      for (t2 = Math.abs(t2), Number.isNaN(t2) || t2 === Number.POSITIVE_INFINITY ? (u2 = Number.isNaN(t2) ? 1 : 0, p2 = m2) : (p2 = Math.floor(Math.log2(t2)), t2 * (d2 = Math.pow(2, -p2)) < 1 && (p2--, d2 *= 2), (t2 += p2 + g2 >= 1 ? x2 / d2 : x2 * Math.pow(2, 1 - g2)) * d2 >= 2 && (p2++, d2 /= 2), p2 + g2 >= m2 ? (u2 = 0, p2 = m2) : p2 + g2 >= 1 ? (u2 = (t2 * d2 - 1) * Math.pow(2, a2), p2 += g2) : (u2 = t2 * Math.pow(2, g2 - 1) * Math.pow(2, a2), p2 = 0)); a2 >= 8; )
        e2[r2 + _2] = 255 & u2, _2 += E2, u2 /= 256, a2 -= 8;
      for (p2 = p2 << a2 | u2, f2 += a2; f2 > 0; )
        e2[r2 + _2] = 255 & p2, _2 += E2, p2 /= 256, f2 -= 8;
      e2[r2 + _2 - E2] |= 128 * S2;
    }
    __name(write, "write");
    t["-".charCodeAt(0)] = 62, t["_".charCodeAt(0)] = 63;
    const a = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null, c = 2147483647;
    function createBuffer$1(e2) {
      if (e2 > c)
        throw new RangeError('The value "' + e2 + '" is invalid for option "size"');
      const t2 = new Uint8Array(e2);
      return Object.setPrototypeOf(t2, Buffer$1.prototype), t2;
    }
    __name(createBuffer$1, "createBuffer$1");
    function Buffer$1(e2, t2, r2) {
      if ("number" == typeof e2) {
        if ("string" == typeof t2)
          throw new TypeError('The "string" argument must be of type string. Received type number');
        return allocUnsafe(e2);
      }
      return from(e2, t2, r2);
    }
    __name(Buffer$1, "Buffer$1");
    function from(e2, t2, r2) {
      if ("string" == typeof e2)
        return function(e3, t3) {
          "string" == typeof t3 && "" !== t3 || (t3 = "utf8");
          if (!Buffer$1.isEncoding(t3))
            throw new TypeError("Unknown encoding: " + t3);
          const r3 = 0 | byteLength(e3, t3);
          let s3 = createBuffer$1(r3);
          const a3 = s3.write(e3, t3);
          a3 !== r3 && (s3 = s3.slice(0, a3));
          return s3;
        }(e2, t2);
      if (ArrayBuffer.isView(e2))
        return function(e3) {
          if (isInstance(e3, Uint8Array)) {
            const t3 = new Uint8Array(e3);
            return fromArrayBuffer(t3.buffer, t3.byteOffset, t3.byteLength);
          }
          return fromArrayLike(e3);
        }(e2);
      if (null == e2)
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e2);
      if (isInstance(e2, ArrayBuffer) || e2 && isInstance(e2.buffer, ArrayBuffer))
        return fromArrayBuffer(e2, t2, r2);
      if ("undefined" != typeof SharedArrayBuffer && (isInstance(e2, SharedArrayBuffer) || e2 && isInstance(e2.buffer, SharedArrayBuffer)))
        return fromArrayBuffer(e2, t2, r2);
      if ("number" == typeof e2)
        throw new TypeError('The "value" argument must not be of type number. Received type number');
      const s2 = e2.valueOf && e2.valueOf();
      if (null != s2 && s2 !== e2)
        return Buffer$1.from(s2, t2, r2);
      const a2 = function(e3) {
        if (Buffer$1.isBuffer(e3)) {
          const t3 = 0 | checked(e3.length), r3 = createBuffer$1(t3);
          return 0 === r3.length || e3.copy(r3, 0, 0, t3), r3;
        }
        if (void 0 !== e3.length)
          return "number" != typeof e3.length || numberIsNaN(e3.length) ? createBuffer$1(0) : fromArrayLike(e3);
        if ("Buffer" === e3.type && Array.isArray(e3.data))
          return fromArrayLike(e3.data);
      }(e2);
      if (a2)
        return a2;
      if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e2[Symbol.toPrimitive])
        return Buffer$1.from(e2[Symbol.toPrimitive]("string"), t2, r2);
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e2);
    }
    __name(from, "from");
    function assertSize(e2) {
      if ("number" != typeof e2)
        throw new TypeError('"size" argument must be of type number');
      if (e2 < 0)
        throw new RangeError('The value "' + e2 + '" is invalid for option "size"');
    }
    __name(assertSize, "assertSize");
    function allocUnsafe(e2) {
      return assertSize(e2), createBuffer$1(e2 < 0 ? 0 : 0 | checked(e2));
    }
    __name(allocUnsafe, "allocUnsafe");
    function fromArrayLike(e2) {
      const t2 = e2.length < 0 ? 0 : 0 | checked(e2.length), r2 = createBuffer$1(t2);
      for (let s2 = 0; s2 < t2; s2 += 1)
        r2[s2] = 255 & e2[s2];
      return r2;
    }
    __name(fromArrayLike, "fromArrayLike");
    function fromArrayBuffer(e2, t2, r2) {
      if (t2 < 0 || e2.byteLength < t2)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (e2.byteLength < t2 + (r2 || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      let s2;
      return s2 = void 0 === t2 && void 0 === r2 ? new Uint8Array(e2) : void 0 === r2 ? new Uint8Array(e2, t2) : new Uint8Array(e2, t2, r2), Object.setPrototypeOf(s2, Buffer$1.prototype), s2;
    }
    __name(fromArrayBuffer, "fromArrayBuffer");
    function checked(e2) {
      if (e2 >= c)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + c.toString(16) + " bytes");
      return 0 | e2;
    }
    __name(checked, "checked");
    function byteLength(e2, t2) {
      if (Buffer$1.isBuffer(e2))
        return e2.length;
      if (ArrayBuffer.isView(e2) || isInstance(e2, ArrayBuffer))
        return e2.byteLength;
      if ("string" != typeof e2)
        throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e2);
      const r2 = e2.length, s2 = arguments.length > 2 && true === arguments[2];
      if (!s2 && 0 === r2)
        return 0;
      let a2 = false;
      for (; ; )
        switch (t2) {
          case "ascii":
          case "latin1":
          case "binary":
            return r2;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(e2).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return 2 * r2;
          case "hex":
            return r2 >>> 1;
          case "base64":
            return base64ToBytes(e2).length;
          default:
            if (a2)
              return s2 ? -1 : utf8ToBytes(e2).length;
            t2 = ("" + t2).toLowerCase(), a2 = true;
        }
    }
    __name(byteLength, "byteLength");
    function slowToString(e2, t2, r2) {
      let s2 = false;
      if ((void 0 === t2 || t2 < 0) && (t2 = 0), t2 > this.length)
        return "";
      if ((void 0 === r2 || r2 > this.length) && (r2 = this.length), r2 <= 0)
        return "";
      if ((r2 >>>= 0) <= (t2 >>>= 0))
        return "";
      for (e2 || (e2 = "utf8"); ; )
        switch (e2) {
          case "hex":
            return hexSlice(this, t2, r2);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, t2, r2);
          case "ascii":
            return asciiSlice(this, t2, r2);
          case "latin1":
          case "binary":
            return latin1Slice(this, t2, r2);
          case "base64":
            return base64Slice(this, t2, r2);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, t2, r2);
          default:
            if (s2)
              throw new TypeError("Unknown encoding: " + e2);
            e2 = (e2 + "").toLowerCase(), s2 = true;
        }
    }
    __name(slowToString, "slowToString");
    function swap(e2, t2, r2) {
      const s2 = e2[t2];
      e2[t2] = e2[r2], e2[r2] = s2;
    }
    __name(swap, "swap");
    function bidirectionalIndexOf(e2, t2, r2, s2, a2) {
      if (0 === e2.length)
        return -1;
      if ("string" == typeof r2 ? (s2 = r2, r2 = 0) : r2 > 2147483647 ? r2 = 2147483647 : r2 < -2147483648 && (r2 = -2147483648), numberIsNaN(r2 = +r2) && (r2 = a2 ? 0 : e2.length - 1), r2 < 0 && (r2 = e2.length + r2), r2 >= e2.length) {
        if (a2)
          return -1;
        r2 = e2.length - 1;
      } else if (r2 < 0) {
        if (!a2)
          return -1;
        r2 = 0;
      }
      if ("string" == typeof t2 && (t2 = Buffer$1.from(t2, s2)), Buffer$1.isBuffer(t2))
        return 0 === t2.length ? -1 : arrayIndexOf(e2, t2, r2, s2, a2);
      if ("number" == typeof t2)
        return t2 &= 255, "function" == typeof Uint8Array.prototype.indexOf ? a2 ? Uint8Array.prototype.indexOf.call(e2, t2, r2) : Uint8Array.prototype.lastIndexOf.call(e2, t2, r2) : arrayIndexOf(e2, [t2], r2, s2, a2);
      throw new TypeError("val must be string, number or Buffer");
    }
    __name(bidirectionalIndexOf, "bidirectionalIndexOf");
    function arrayIndexOf(e2, t2, r2, s2, a2) {
      let c2, p2 = 1, u2 = e2.length, d2 = t2.length;
      if (void 0 !== s2 && ("ucs2" === (s2 = String(s2).toLowerCase()) || "ucs-2" === s2 || "utf16le" === s2 || "utf-16le" === s2)) {
        if (e2.length < 2 || t2.length < 2)
          return -1;
        p2 = 2, u2 /= 2, d2 /= 2, r2 /= 2;
      }
      function read2(e3, t3) {
        return 1 === p2 ? e3[t3] : e3.readUInt16BE(t3 * p2);
      }
      __name(read2, "read");
      if (a2) {
        let s3 = -1;
        for (c2 = r2; c2 < u2; c2++)
          if (read2(e2, c2) === read2(t2, -1 === s3 ? 0 : c2 - s3)) {
            if (-1 === s3 && (s3 = c2), c2 - s3 + 1 === d2)
              return s3 * p2;
          } else
            -1 !== s3 && (c2 -= c2 - s3), s3 = -1;
      } else
        for (r2 + d2 > u2 && (r2 = u2 - d2), c2 = r2; c2 >= 0; c2--) {
          let r3 = true;
          for (let s3 = 0; s3 < d2; s3++)
            if (read2(e2, c2 + s3) !== read2(t2, s3)) {
              r3 = false;
              break;
            }
          if (r3)
            return c2;
        }
      return -1;
    }
    __name(arrayIndexOf, "arrayIndexOf");
    function hexWrite(e2, t2, r2, s2) {
      r2 = Number(r2) || 0;
      const a2 = e2.length - r2;
      s2 ? (s2 = Number(s2)) > a2 && (s2 = a2) : s2 = a2;
      const c2 = t2.length;
      let p2;
      for (s2 > c2 / 2 && (s2 = c2 / 2), p2 = 0; p2 < s2; ++p2) {
        const s3 = Number.parseInt(t2.slice(2 * p2, 2 * p2 + 2), 16);
        if (numberIsNaN(s3))
          return p2;
        e2[r2 + p2] = s3;
      }
      return p2;
    }
    __name(hexWrite, "hexWrite");
    function utf8Write(e2, t2, r2, s2) {
      return blitBuffer(utf8ToBytes(t2, e2.length - r2), e2, r2, s2);
    }
    __name(utf8Write, "utf8Write");
    function asciiWrite(e2, t2, r2, s2) {
      return blitBuffer(function(e3) {
        const t3 = [];
        for (let r3 = 0; r3 < e3.length; ++r3)
          t3.push(255 & e3.charCodeAt(r3));
        return t3;
      }(t2), e2, r2, s2);
    }
    __name(asciiWrite, "asciiWrite");
    function base64Write(e2, t2, r2, s2) {
      return blitBuffer(base64ToBytes(t2), e2, r2, s2);
    }
    __name(base64Write, "base64Write");
    function ucs2Write(e2, t2, r2, s2) {
      return blitBuffer(function(e3, t3) {
        let r3, s3, a2;
        const c2 = [];
        for (let p2 = 0; p2 < e3.length && !((t3 -= 2) < 0); ++p2)
          r3 = e3.charCodeAt(p2), s3 = r3 >> 8, a2 = r3 % 256, c2.push(a2, s3);
        return c2;
      }(t2, e2.length - r2), e2, r2, s2);
    }
    __name(ucs2Write, "ucs2Write");
    function base64Slice(e2, t2, r2) {
      return 0 === t2 && r2 === e2.length ? fromByteArray(e2) : fromByteArray(e2.slice(t2, r2));
    }
    __name(base64Slice, "base64Slice");
    function utf8Slice(e2, t2, r2) {
      r2 = Math.min(e2.length, r2);
      const s2 = [];
      let a2 = t2;
      for (; a2 < r2; ) {
        const t3 = e2[a2];
        let c2 = null, p2 = t3 > 239 ? 4 : t3 > 223 ? 3 : t3 > 191 ? 2 : 1;
        if (a2 + p2 <= r2) {
          let r3, s3, u2, d2;
          switch (p2) {
            case 1:
              t3 < 128 && (c2 = t3);
              break;
            case 2:
              r3 = e2[a2 + 1], 128 == (192 & r3) && (d2 = (31 & t3) << 6 | 63 & r3, d2 > 127 && (c2 = d2));
              break;
            case 3:
              r3 = e2[a2 + 1], s3 = e2[a2 + 2], 128 == (192 & r3) && 128 == (192 & s3) && (d2 = (15 & t3) << 12 | (63 & r3) << 6 | 63 & s3, d2 > 2047 && (d2 < 55296 || d2 > 57343) && (c2 = d2));
              break;
            case 4:
              r3 = e2[a2 + 1], s3 = e2[a2 + 2], u2 = e2[a2 + 3], 128 == (192 & r3) && 128 == (192 & s3) && 128 == (192 & u2) && (d2 = (15 & t3) << 18 | (63 & r3) << 12 | (63 & s3) << 6 | 63 & u2, d2 > 65535 && d2 < 1114112 && (c2 = d2));
          }
        }
        null === c2 ? (c2 = 65533, p2 = 1) : c2 > 65535 && (c2 -= 65536, s2.push(c2 >>> 10 & 1023 | 55296), c2 = 56320 | 1023 & c2), s2.push(c2), a2 += p2;
      }
      return function(e3) {
        const t3 = e3.length;
        if (t3 <= p)
          return String.fromCharCode.apply(String, e3);
        let r3 = "", s3 = 0;
        for (; s3 < t3; )
          r3 += String.fromCharCode.apply(String, e3.slice(s3, s3 += p));
        return r3;
      }(s2);
    }
    __name(utf8Slice, "utf8Slice");
    Buffer$1.TYPED_ARRAY_SUPPORT = function() {
      try {
        const e2 = new Uint8Array(1), t2 = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(t2, Uint8Array.prototype), Object.setPrototypeOf(e2, t2), 42 === e2.foo();
      } catch {
        return false;
      }
    }(), Buffer$1.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This environment lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(Buffer$1.prototype, "parent", { enumerable: true, get: function() {
      if (Buffer$1.isBuffer(this))
        return this.buffer;
    } }), Object.defineProperty(Buffer$1.prototype, "offset", { enumerable: true, get: function() {
      if (Buffer$1.isBuffer(this))
        return this.byteOffset;
    } }), Buffer$1.poolSize = 8192, Buffer$1.from = function(e2, t2, r2) {
      return from(e2, t2, r2);
    }, Object.setPrototypeOf(Buffer$1.prototype, Uint8Array.prototype), Object.setPrototypeOf(Buffer$1, Uint8Array), Buffer$1.alloc = function(e2, t2, r2) {
      return function(e3, t3, r3) {
        return assertSize(e3), e3 <= 0 ? createBuffer$1(e3) : void 0 !== t3 ? "string" == typeof r3 ? createBuffer$1(e3).fill(t3, r3) : createBuffer$1(e3).fill(t3) : createBuffer$1(e3);
      }(e2, t2, r2);
    }, Buffer$1.allocUnsafe = function(e2) {
      return allocUnsafe(e2);
    }, Buffer$1.allocUnsafeSlow = function(e2) {
      return allocUnsafe(e2);
    }, Buffer$1.isBuffer = function(e2) {
      return null != e2 && true === e2._isBuffer && e2 !== Buffer$1.prototype;
    }, Buffer$1.compare = function(e2, t2) {
      if (isInstance(e2, Uint8Array) && (e2 = Buffer$1.from(e2, e2.offset, e2.byteLength)), isInstance(t2, Uint8Array) && (t2 = Buffer$1.from(t2, t2.offset, t2.byteLength)), !Buffer$1.isBuffer(e2) || !Buffer$1.isBuffer(t2))
        throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
      if (e2 === t2)
        return 0;
      let r2 = e2.length, s2 = t2.length;
      for (let a2 = 0, c2 = Math.min(r2, s2); a2 < c2; ++a2)
        if (e2[a2] !== t2[a2]) {
          r2 = e2[a2], s2 = t2[a2];
          break;
        }
      return r2 < s2 ? -1 : s2 < r2 ? 1 : 0;
    }, Buffer$1.isEncoding = function(e2) {
      switch (String(e2).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    }, Buffer$1.concat = function(e2, t2) {
      if (!Array.isArray(e2))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (0 === e2.length)
        return Buffer$1.alloc(0);
      let r2;
      if (void 0 === t2)
        for (t2 = 0, r2 = 0; r2 < e2.length; ++r2)
          t2 += e2[r2].length;
      const s2 = Buffer$1.allocUnsafe(t2);
      let a2 = 0;
      for (r2 = 0; r2 < e2.length; ++r2) {
        let t3 = e2[r2];
        if (isInstance(t3, Uint8Array))
          a2 + t3.length > s2.length ? (Buffer$1.isBuffer(t3) || (t3 = Buffer$1.from(t3.buffer, t3.byteOffset, t3.byteLength)), t3.copy(s2, a2)) : Uint8Array.prototype.set.call(s2, t3, a2);
        else {
          if (!Buffer$1.isBuffer(t3))
            throw new TypeError('"list" argument must be an Array of Buffers');
          t3.copy(s2, a2);
        }
        a2 += t3.length;
      }
      return s2;
    }, Buffer$1.byteLength = byteLength, Buffer$1.prototype._isBuffer = true, Buffer$1.prototype.swap16 = function() {
      const e2 = this.length;
      if (e2 % 2 != 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let t2 = 0; t2 < e2; t2 += 2)
        swap(this, t2, t2 + 1);
      return this;
    }, Buffer$1.prototype.swap32 = function() {
      const e2 = this.length;
      if (e2 % 4 != 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let t2 = 0; t2 < e2; t2 += 4)
        swap(this, t2, t2 + 3), swap(this, t2 + 1, t2 + 2);
      return this;
    }, Buffer$1.prototype.swap64 = function() {
      const e2 = this.length;
      if (e2 % 8 != 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let t2 = 0; t2 < e2; t2 += 8)
        swap(this, t2, t2 + 7), swap(this, t2 + 1, t2 + 6), swap(this, t2 + 2, t2 + 5), swap(this, t2 + 3, t2 + 4);
      return this;
    }, Buffer$1.prototype.toString = function() {
      const e2 = this.length;
      return 0 === e2 ? "" : 0 === arguments.length ? utf8Slice(this, 0, e2) : Reflect.apply(slowToString, this, arguments);
    }, Buffer$1.prototype.toLocaleString = Buffer$1.prototype.toString, Buffer$1.prototype.equals = function(e2) {
      if (!Buffer$1.isBuffer(e2))
        throw new TypeError("Argument must be a Buffer");
      return this === e2 || 0 === Buffer$1.compare(this, e2);
    }, Buffer$1.prototype.inspect = function() {
      let e2 = "";
      return e2 = this.toString("hex", 0, 50).replace(/(.{2})/g, "$1 ").trim(), this.length > 50 && (e2 += " ... "), "<Buffer " + e2 + ">";
    }, a && (Buffer$1.prototype[a] = Buffer$1.prototype.inspect), Buffer$1.prototype.compare = function(e2, t2, r2, s2, a2) {
      if (isInstance(e2, Uint8Array) && (e2 = Buffer$1.from(e2, e2.offset, e2.byteLength)), !Buffer$1.isBuffer(e2))
        throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e2);
      if (void 0 === t2 && (t2 = 0), void 0 === r2 && (r2 = e2 ? e2.length : 0), void 0 === s2 && (s2 = 0), void 0 === a2 && (a2 = this.length), t2 < 0 || r2 > e2.length || s2 < 0 || a2 > this.length)
        throw new RangeError("out of range index");
      if (s2 >= a2 && t2 >= r2)
        return 0;
      if (s2 >= a2)
        return -1;
      if (t2 >= r2)
        return 1;
      if (this === e2)
        return 0;
      let c2 = (a2 >>>= 0) - (s2 >>>= 0), p2 = (r2 >>>= 0) - (t2 >>>= 0);
      const u2 = Math.min(c2, p2), d2 = this.slice(s2, a2), f2 = e2.slice(t2, r2);
      for (let e3 = 0; e3 < u2; ++e3)
        if (d2[e3] !== f2[e3]) {
          c2 = d2[e3], p2 = f2[e3];
          break;
        }
      return c2 < p2 ? -1 : p2 < c2 ? 1 : 0;
    }, Buffer$1.prototype.includes = function(e2, t2, r2) {
      return -1 !== this.indexOf(e2, t2, r2);
    }, Buffer$1.prototype.indexOf = function(e2, t2, r2) {
      return bidirectionalIndexOf(this, e2, t2, r2, true);
    }, Buffer$1.prototype.lastIndexOf = function(e2, t2, r2) {
      return bidirectionalIndexOf(this, e2, t2, r2, false);
    }, Buffer$1.prototype.write = function(e2, t2, r2, s2) {
      if (void 0 === t2)
        s2 = "utf8", r2 = this.length, t2 = 0;
      else if (void 0 === r2 && "string" == typeof t2)
        s2 = t2, r2 = this.length, t2 = 0;
      else {
        if (!Number.isFinite(t2))
          throw new TypeError("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        t2 >>>= 0, Number.isFinite(r2) ? (r2 >>>= 0, void 0 === s2 && (s2 = "utf8")) : (s2 = r2, r2 = void 0);
      }
      const a2 = this.length - t2;
      if ((void 0 === r2 || r2 > a2) && (r2 = a2), e2.length > 0 && (r2 < 0 || t2 < 0) || t2 > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      s2 || (s2 = "utf8");
      let c2 = false;
      for (; ; )
        switch (s2) {
          case "hex":
            return hexWrite(this, e2, t2, r2);
          case "utf8":
          case "utf-8":
            return utf8Write(this, e2, t2, r2);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, e2, t2, r2);
          case "base64":
            return base64Write(this, e2, t2, r2);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, e2, t2, r2);
          default:
            if (c2)
              throw new TypeError("Unknown encoding: " + s2);
            s2 = ("" + s2).toLowerCase(), c2 = true;
        }
    }, Buffer$1.prototype.toJSON = function() {
      return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
    };
    const p = 4096;
    function asciiSlice(e2, t2, r2) {
      let s2 = "";
      r2 = Math.min(e2.length, r2);
      for (let a2 = t2; a2 < r2; ++a2)
        s2 += String.fromCharCode(127 & e2[a2]);
      return s2;
    }
    __name(asciiSlice, "asciiSlice");
    function latin1Slice(e2, t2, r2) {
      let s2 = "";
      r2 = Math.min(e2.length, r2);
      for (let a2 = t2; a2 < r2; ++a2)
        s2 += String.fromCharCode(e2[a2]);
      return s2;
    }
    __name(latin1Slice, "latin1Slice");
    function hexSlice(e2, t2, r2) {
      const s2 = e2.length;
      (!t2 || t2 < 0) && (t2 = 0), (!r2 || r2 < 0 || r2 > s2) && (r2 = s2);
      let a2 = "";
      for (let s3 = t2; s3 < r2; ++s3)
        a2 += f[e2[s3]];
      return a2;
    }
    __name(hexSlice, "hexSlice");
    function utf16leSlice(e2, t2, r2) {
      const s2 = e2.slice(t2, r2);
      let a2 = "";
      for (let e3 = 0; e3 < s2.length - 1; e3 += 2)
        a2 += String.fromCharCode(s2[e3] + 256 * s2[e3 + 1]);
      return a2;
    }
    __name(utf16leSlice, "utf16leSlice");
    function checkOffset(e2, t2, r2) {
      if (e2 % 1 != 0 || e2 < 0)
        throw new RangeError("offset is not uint");
      if (e2 + t2 > r2)
        throw new RangeError("Trying to access beyond buffer length");
    }
    __name(checkOffset, "checkOffset");
    function checkInt(e2, t2, r2, s2, a2, c2) {
      if (!Buffer$1.isBuffer(e2))
        throw new TypeError('"buffer" argument must be a Buffer instance');
      if (t2 > a2 || t2 < c2)
        throw new RangeError('"value" argument is out of bounds');
      if (r2 + s2 > e2.length)
        throw new RangeError("Index out of range");
    }
    __name(checkInt, "checkInt");
    function wrtBigUInt64LE(e2, t2, r2, s2, a2) {
      checkIntBI(t2, s2, a2, e2, r2, 7);
      let c2 = Number(t2 & BigInt(4294967295));
      e2[r2++] = c2, c2 >>= 8, e2[r2++] = c2, c2 >>= 8, e2[r2++] = c2, c2 >>= 8, e2[r2++] = c2;
      let p2 = Number(t2 >> BigInt(32) & BigInt(4294967295));
      return e2[r2++] = p2, p2 >>= 8, e2[r2++] = p2, p2 >>= 8, e2[r2++] = p2, p2 >>= 8, e2[r2++] = p2, r2;
    }
    __name(wrtBigUInt64LE, "wrtBigUInt64LE");
    function wrtBigUInt64BE(e2, t2, r2, s2, a2) {
      checkIntBI(t2, s2, a2, e2, r2, 7);
      let c2 = Number(t2 & BigInt(4294967295));
      e2[r2 + 7] = c2, c2 >>= 8, e2[r2 + 6] = c2, c2 >>= 8, e2[r2 + 5] = c2, c2 >>= 8, e2[r2 + 4] = c2;
      let p2 = Number(t2 >> BigInt(32) & BigInt(4294967295));
      return e2[r2 + 3] = p2, p2 >>= 8, e2[r2 + 2] = p2, p2 >>= 8, e2[r2 + 1] = p2, p2 >>= 8, e2[r2] = p2, r2 + 8;
    }
    __name(wrtBigUInt64BE, "wrtBigUInt64BE");
    function checkIEEE754(e2, t2, r2, s2, a2, c2) {
      if (r2 + s2 > e2.length)
        throw new RangeError("Index out of range");
      if (r2 < 0)
        throw new RangeError("Index out of range");
    }
    __name(checkIEEE754, "checkIEEE754");
    function writeFloat(e2, t2, r2, s2, a2) {
      return t2 = +t2, r2 >>>= 0, a2 || checkIEEE754(e2, 0, r2, 4), write(e2, t2, r2, s2, 23, 4), r2 + 4;
    }
    __name(writeFloat, "writeFloat");
    function writeDouble(e2, t2, r2, s2, a2) {
      return t2 = +t2, r2 >>>= 0, a2 || checkIEEE754(e2, 0, r2, 8), write(e2, t2, r2, s2, 52, 8), r2 + 8;
    }
    __name(writeDouble, "writeDouble");
    Buffer$1.prototype.slice = function(e2, t2) {
      const r2 = this.length;
      (e2 = Math.trunc(e2)) < 0 ? (e2 += r2) < 0 && (e2 = 0) : e2 > r2 && (e2 = r2), (t2 = void 0 === t2 ? r2 : Math.trunc(t2)) < 0 ? (t2 += r2) < 0 && (t2 = 0) : t2 > r2 && (t2 = r2), t2 < e2 && (t2 = e2);
      const s2 = this.subarray(e2, t2);
      return Object.setPrototypeOf(s2, Buffer$1.prototype), s2;
    }, Buffer$1.prototype.readUintLE = Buffer$1.prototype.readUIntLE = function(e2, t2, r2) {
      e2 >>>= 0, t2 >>>= 0, r2 || checkOffset(e2, t2, this.length);
      let s2 = this[e2], a2 = 1, c2 = 0;
      for (; ++c2 < t2 && (a2 *= 256); )
        s2 += this[e2 + c2] * a2;
      return s2;
    }, Buffer$1.prototype.readUintBE = Buffer$1.prototype.readUIntBE = function(e2, t2, r2) {
      e2 >>>= 0, t2 >>>= 0, r2 || checkOffset(e2, t2, this.length);
      let s2 = this[e2 + --t2], a2 = 1;
      for (; t2 > 0 && (a2 *= 256); )
        s2 += this[e2 + --t2] * a2;
      return s2;
    }, Buffer$1.prototype.readUint8 = Buffer$1.prototype.readUInt8 = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 1, this.length), this[e2];
    }, Buffer$1.prototype.readUint16LE = Buffer$1.prototype.readUInt16LE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 2, this.length), this[e2] | this[e2 + 1] << 8;
    }, Buffer$1.prototype.readUint16BE = Buffer$1.prototype.readUInt16BE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 2, this.length), this[e2] << 8 | this[e2 + 1];
    }, Buffer$1.prototype.readUint32LE = Buffer$1.prototype.readUInt32LE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 4, this.length), (this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16) + 16777216 * this[e2 + 3];
    }, Buffer$1.prototype.readUint32BE = Buffer$1.prototype.readUInt32BE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 4, this.length), 16777216 * this[e2] + (this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3]);
    }, Buffer$1.prototype.readBigUInt64LE = defineBigIntMethod(function(e2) {
      validateNumber(e2 >>>= 0, "offset");
      const t2 = this[e2], r2 = this[e2 + 7];
      void 0 !== t2 && void 0 !== r2 || boundsError(e2, this.length - 8);
      const s2 = t2 + 256 * this[++e2] + 65536 * this[++e2] + this[++e2] * 2 ** 24, a2 = this[++e2] + 256 * this[++e2] + 65536 * this[++e2] + r2 * 2 ** 24;
      return BigInt(s2) + (BigInt(a2) << BigInt(32));
    }), Buffer$1.prototype.readBigUInt64BE = defineBigIntMethod(function(e2) {
      validateNumber(e2 >>>= 0, "offset");
      const t2 = this[e2], r2 = this[e2 + 7];
      void 0 !== t2 && void 0 !== r2 || boundsError(e2, this.length - 8);
      const s2 = t2 * 2 ** 24 + 65536 * this[++e2] + 256 * this[++e2] + this[++e2], a2 = this[++e2] * 2 ** 24 + 65536 * this[++e2] + 256 * this[++e2] + r2;
      return (BigInt(s2) << BigInt(32)) + BigInt(a2);
    }), Buffer$1.prototype.readIntLE = function(e2, t2, r2) {
      e2 >>>= 0, t2 >>>= 0, r2 || checkOffset(e2, t2, this.length);
      let s2 = this[e2], a2 = 1, c2 = 0;
      for (; ++c2 < t2 && (a2 *= 256); )
        s2 += this[e2 + c2] * a2;
      return a2 *= 128, s2 >= a2 && (s2 -= Math.pow(2, 8 * t2)), s2;
    }, Buffer$1.prototype.readIntBE = function(e2, t2, r2) {
      e2 >>>= 0, t2 >>>= 0, r2 || checkOffset(e2, t2, this.length);
      let s2 = t2, a2 = 1, c2 = this[e2 + --s2];
      for (; s2 > 0 && (a2 *= 256); )
        c2 += this[e2 + --s2] * a2;
      return a2 *= 128, c2 >= a2 && (c2 -= Math.pow(2, 8 * t2)), c2;
    }, Buffer$1.prototype.readInt8 = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 1, this.length), 128 & this[e2] ? -1 * (255 - this[e2] + 1) : this[e2];
    }, Buffer$1.prototype.readInt16LE = function(e2, t2) {
      e2 >>>= 0, t2 || checkOffset(e2, 2, this.length);
      const r2 = this[e2] | this[e2 + 1] << 8;
      return 32768 & r2 ? 4294901760 | r2 : r2;
    }, Buffer$1.prototype.readInt16BE = function(e2, t2) {
      e2 >>>= 0, t2 || checkOffset(e2, 2, this.length);
      const r2 = this[e2 + 1] | this[e2] << 8;
      return 32768 & r2 ? 4294901760 | r2 : r2;
    }, Buffer$1.prototype.readInt32LE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 4, this.length), this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16 | this[e2 + 3] << 24;
    }, Buffer$1.prototype.readInt32BE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 4, this.length), this[e2] << 24 | this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3];
    }, Buffer$1.prototype.readBigInt64LE = defineBigIntMethod(function(e2) {
      validateNumber(e2 >>>= 0, "offset");
      const t2 = this[e2], r2 = this[e2 + 7];
      void 0 !== t2 && void 0 !== r2 || boundsError(e2, this.length - 8);
      const s2 = this[e2 + 4] + 256 * this[e2 + 5] + 65536 * this[e2 + 6] + (r2 << 24);
      return (BigInt(s2) << BigInt(32)) + BigInt(t2 + 256 * this[++e2] + 65536 * this[++e2] + this[++e2] * 2 ** 24);
    }), Buffer$1.prototype.readBigInt64BE = defineBigIntMethod(function(e2) {
      validateNumber(e2 >>>= 0, "offset");
      const t2 = this[e2], r2 = this[e2 + 7];
      void 0 !== t2 && void 0 !== r2 || boundsError(e2, this.length - 8);
      const s2 = (t2 << 24) + 65536 * this[++e2] + 256 * this[++e2] + this[++e2];
      return (BigInt(s2) << BigInt(32)) + BigInt(this[++e2] * 2 ** 24 + 65536 * this[++e2] + 256 * this[++e2] + r2);
    }), Buffer$1.prototype.readFloatLE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 4, this.length), read(this, e2, true, 23, 4);
    }, Buffer$1.prototype.readFloatBE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 4, this.length), read(this, e2, false, 23, 4);
    }, Buffer$1.prototype.readDoubleLE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 8, this.length), read(this, e2, true, 52, 8);
    }, Buffer$1.prototype.readDoubleBE = function(e2, t2) {
      return e2 >>>= 0, t2 || checkOffset(e2, 8, this.length), read(this, e2, false, 52, 8);
    }, Buffer$1.prototype.writeUintLE = Buffer$1.prototype.writeUIntLE = function(e2, t2, r2, s2) {
      if (e2 = +e2, t2 >>>= 0, r2 >>>= 0, !s2) {
        checkInt(this, e2, t2, r2, Math.pow(2, 8 * r2) - 1, 0);
      }
      let a2 = 1, c2 = 0;
      for (this[t2] = 255 & e2; ++c2 < r2 && (a2 *= 256); )
        this[t2 + c2] = e2 / a2 & 255;
      return t2 + r2;
    }, Buffer$1.prototype.writeUintBE = Buffer$1.prototype.writeUIntBE = function(e2, t2, r2, s2) {
      if (e2 = +e2, t2 >>>= 0, r2 >>>= 0, !s2) {
        checkInt(this, e2, t2, r2, Math.pow(2, 8 * r2) - 1, 0);
      }
      let a2 = r2 - 1, c2 = 1;
      for (this[t2 + a2] = 255 & e2; --a2 >= 0 && (c2 *= 256); )
        this[t2 + a2] = e2 / c2 & 255;
      return t2 + r2;
    }, Buffer$1.prototype.writeUint8 = Buffer$1.prototype.writeUInt8 = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 1, 255, 0), this[t2] = 255 & e2, t2 + 1;
    }, Buffer$1.prototype.writeUint16LE = Buffer$1.prototype.writeUInt16LE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 2, 65535, 0), this[t2] = 255 & e2, this[t2 + 1] = e2 >>> 8, t2 + 2;
    }, Buffer$1.prototype.writeUint16BE = Buffer$1.prototype.writeUInt16BE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 2, 65535, 0), this[t2] = e2 >>> 8, this[t2 + 1] = 255 & e2, t2 + 2;
    }, Buffer$1.prototype.writeUint32LE = Buffer$1.prototype.writeUInt32LE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 4, 4294967295, 0), this[t2 + 3] = e2 >>> 24, this[t2 + 2] = e2 >>> 16, this[t2 + 1] = e2 >>> 8, this[t2] = 255 & e2, t2 + 4;
    }, Buffer$1.prototype.writeUint32BE = Buffer$1.prototype.writeUInt32BE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 4, 4294967295, 0), this[t2] = e2 >>> 24, this[t2 + 1] = e2 >>> 16, this[t2 + 2] = e2 >>> 8, this[t2 + 3] = 255 & e2, t2 + 4;
    }, Buffer$1.prototype.writeBigUInt64LE = defineBigIntMethod(function(e2, t2 = 0) {
      return wrtBigUInt64LE(this, e2, t2, BigInt(0), BigInt("0xffffffffffffffff"));
    }), Buffer$1.prototype.writeBigUInt64BE = defineBigIntMethod(function(e2, t2 = 0) {
      return wrtBigUInt64BE(this, e2, t2, BigInt(0), BigInt("0xffffffffffffffff"));
    }), Buffer$1.prototype.writeIntLE = function(e2, t2, r2, s2) {
      if (e2 = +e2, t2 >>>= 0, !s2) {
        const s3 = Math.pow(2, 8 * r2 - 1);
        checkInt(this, e2, t2, r2, s3 - 1, -s3);
      }
      let a2 = 0, c2 = 1, p2 = 0;
      for (this[t2] = 255 & e2; ++a2 < r2 && (c2 *= 256); )
        e2 < 0 && 0 === p2 && 0 !== this[t2 + a2 - 1] && (p2 = 1), this[t2 + a2] = Math.trunc(e2 / c2) - p2 & 255;
      return t2 + r2;
    }, Buffer$1.prototype.writeIntBE = function(e2, t2, r2, s2) {
      if (e2 = +e2, t2 >>>= 0, !s2) {
        const s3 = Math.pow(2, 8 * r2 - 1);
        checkInt(this, e2, t2, r2, s3 - 1, -s3);
      }
      let a2 = r2 - 1, c2 = 1, p2 = 0;
      for (this[t2 + a2] = 255 & e2; --a2 >= 0 && (c2 *= 256); )
        e2 < 0 && 0 === p2 && 0 !== this[t2 + a2 + 1] && (p2 = 1), this[t2 + a2] = Math.trunc(e2 / c2) - p2 & 255;
      return t2 + r2;
    }, Buffer$1.prototype.writeInt8 = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 1, 127, -128), e2 < 0 && (e2 = 255 + e2 + 1), this[t2] = 255 & e2, t2 + 1;
    }, Buffer$1.prototype.writeInt16LE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 2, 32767, -32768), this[t2] = 255 & e2, this[t2 + 1] = e2 >>> 8, t2 + 2;
    }, Buffer$1.prototype.writeInt16BE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 2, 32767, -32768), this[t2] = e2 >>> 8, this[t2 + 1] = 255 & e2, t2 + 2;
    }, Buffer$1.prototype.writeInt32LE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 4, 2147483647, -2147483648), this[t2] = 255 & e2, this[t2 + 1] = e2 >>> 8, this[t2 + 2] = e2 >>> 16, this[t2 + 3] = e2 >>> 24, t2 + 4;
    }, Buffer$1.prototype.writeInt32BE = function(e2, t2, r2) {
      return e2 = +e2, t2 >>>= 0, r2 || checkInt(this, e2, t2, 4, 2147483647, -2147483648), e2 < 0 && (e2 = 4294967295 + e2 + 1), this[t2] = e2 >>> 24, this[t2 + 1] = e2 >>> 16, this[t2 + 2] = e2 >>> 8, this[t2 + 3] = 255 & e2, t2 + 4;
    }, Buffer$1.prototype.writeBigInt64LE = defineBigIntMethod(function(e2, t2 = 0) {
      return wrtBigUInt64LE(this, e2, t2, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), Buffer$1.prototype.writeBigInt64BE = defineBigIntMethod(function(e2, t2 = 0) {
      return wrtBigUInt64BE(this, e2, t2, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), Buffer$1.prototype.writeFloatLE = function(e2, t2, r2) {
      return writeFloat(this, e2, t2, true, r2);
    }, Buffer$1.prototype.writeFloatBE = function(e2, t2, r2) {
      return writeFloat(this, e2, t2, false, r2);
    }, Buffer$1.prototype.writeDoubleLE = function(e2, t2, r2) {
      return writeDouble(this, e2, t2, true, r2);
    }, Buffer$1.prototype.writeDoubleBE = function(e2, t2, r2) {
      return writeDouble(this, e2, t2, false, r2);
    }, Buffer$1.prototype.copy = function(e2, t2, r2, s2) {
      if (!Buffer$1.isBuffer(e2))
        throw new TypeError("argument should be a Buffer");
      if (r2 || (r2 = 0), s2 || 0 === s2 || (s2 = this.length), t2 >= e2.length && (t2 = e2.length), t2 || (t2 = 0), s2 > 0 && s2 < r2 && (s2 = r2), s2 === r2)
        return 0;
      if (0 === e2.length || 0 === this.length)
        return 0;
      if (t2 < 0)
        throw new RangeError("targetStart out of bounds");
      if (r2 < 0 || r2 >= this.length)
        throw new RangeError("Index out of range");
      if (s2 < 0)
        throw new RangeError("sourceEnd out of bounds");
      s2 > this.length && (s2 = this.length), e2.length - t2 < s2 - r2 && (s2 = e2.length - t2 + r2);
      const a2 = s2 - r2;
      return this === e2 && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(t2, r2, s2) : Uint8Array.prototype.set.call(e2, this.subarray(r2, s2), t2), a2;
    }, Buffer$1.prototype.fill = function(e2, t2, r2, s2) {
      if ("string" == typeof e2) {
        if ("string" == typeof t2 ? (s2 = t2, t2 = 0, r2 = this.length) : "string" == typeof r2 && (s2 = r2, r2 = this.length), void 0 !== s2 && "string" != typeof s2)
          throw new TypeError("encoding must be a string");
        if ("string" == typeof s2 && !Buffer$1.isEncoding(s2))
          throw new TypeError("Unknown encoding: " + s2);
        if (1 === e2.length) {
          const t3 = e2.charCodeAt(0);
          ("utf8" === s2 && t3 < 128 || "latin1" === s2) && (e2 = t3);
        }
      } else
        "number" == typeof e2 ? e2 &= 255 : "boolean" == typeof e2 && (e2 = Number(e2));
      if (t2 < 0 || this.length < t2 || this.length < r2)
        throw new RangeError("Out of range index");
      if (r2 <= t2)
        return this;
      let a2;
      if (t2 >>>= 0, r2 = void 0 === r2 ? this.length : r2 >>> 0, e2 || (e2 = 0), "number" == typeof e2)
        for (a2 = t2; a2 < r2; ++a2)
          this[a2] = e2;
      else {
        const c2 = Buffer$1.isBuffer(e2) ? e2 : Buffer$1.from(e2, s2), p2 = c2.length;
        if (0 === p2)
          throw new TypeError('The value "' + e2 + '" is invalid for argument "value"');
        for (a2 = 0; a2 < r2 - t2; ++a2)
          this[a2 + t2] = c2[a2 % p2];
      }
      return this;
    };
    const u = {};
    function E$1(e2, t2, r2) {
      u[e2] = class extends r2 {
        constructor() {
          super(), Object.defineProperty(this, "message", { value: Reflect.apply(t2, this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${e2}]`, this.stack, delete this.name;
        }
        get code() {
          return e2;
        }
        set code(e3) {
          Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: e3, writable: true });
        }
        toString() {
          return `${this.name} [${e2}]: ${this.message}`;
        }
      };
    }
    __name(E$1, "E$1");
    function addNumericalSeparator(e2) {
      let t2 = "", r2 = e2.length;
      const s2 = "-" === e2[0] ? 1 : 0;
      for (; r2 >= s2 + 4; r2 -= 3)
        t2 = `_${e2.slice(r2 - 3, r2)}${t2}`;
      return `${e2.slice(0, r2)}${t2}`;
    }
    __name(addNumericalSeparator, "addNumericalSeparator");
    function checkIntBI(e2, t2, r2, s2, a2, c2) {
      if (e2 > r2 || e2 < t2) {
        const r3 = "bigint" == typeof t2 ? "n" : "";
        let s3;
        throw s3 = 0 === t2 || t2 === BigInt(0) ? `>= 0${r3} and < 2${r3} ** ${8 * (c2 + 1)}${r3}` : `>= -(2${r3} ** ${8 * (c2 + 1) - 1}${r3}) and < 2 ** ${8 * (c2 + 1) - 1}${r3}`, new u.ERR_OUT_OF_RANGE("value", s3, e2);
      }
      !function(e3, t3, r3) {
        validateNumber(t3, "offset"), void 0 !== e3[t3] && void 0 !== e3[t3 + r3] || boundsError(t3, e3.length - (r3 + 1));
      }(s2, a2, c2);
    }
    __name(checkIntBI, "checkIntBI");
    function validateNumber(e2, t2) {
      if ("number" != typeof e2)
        throw new u.ERR_INVALID_ARG_TYPE(t2, "number", e2);
    }
    __name(validateNumber, "validateNumber");
    function boundsError(e2, t2, r2) {
      if (Math.floor(e2) !== e2)
        throw validateNumber(e2, r2), new u.ERR_OUT_OF_RANGE("offset", "an integer", e2);
      if (t2 < 0)
        throw new u.ERR_BUFFER_OUT_OF_BOUNDS();
      throw new u.ERR_OUT_OF_RANGE("offset", `>= 0 and <= ${t2}`, e2);
    }
    __name(boundsError, "boundsError");
    E$1("ERR_BUFFER_OUT_OF_BOUNDS", function(e2) {
      return e2 ? `${e2} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    }, RangeError), E$1("ERR_INVALID_ARG_TYPE", function(e2, t2) {
      return `The "${e2}" argument must be of type number. Received type ${typeof t2}`;
    }, TypeError), E$1("ERR_OUT_OF_RANGE", function(e2, t2, r2) {
      let s2 = `The value of "${e2}" is out of range.`, a2 = r2;
      return Number.isInteger(r2) && Math.abs(r2) > 2 ** 32 ? a2 = addNumericalSeparator(String(r2)) : "bigint" == typeof r2 && (a2 = String(r2), (r2 > BigInt(2) ** BigInt(32) || r2 < -(BigInt(2) ** BigInt(32))) && (a2 = addNumericalSeparator(a2)), a2 += "n"), s2 += ` It must be ${t2}. Received ${a2}`, s2;
    }, RangeError);
    const d = /[^\w+/-]/g;
    function utf8ToBytes(e2, t2) {
      let r2;
      t2 = t2 || Number.POSITIVE_INFINITY;
      const s2 = e2.length;
      let a2 = null;
      const c2 = [];
      for (let p2 = 0; p2 < s2; ++p2) {
        if (r2 = e2.charCodeAt(p2), r2 > 55295 && r2 < 57344) {
          if (!a2) {
            if (r2 > 56319) {
              (t2 -= 3) > -1 && c2.push(239, 191, 189);
              continue;
            }
            if (p2 + 1 === s2) {
              (t2 -= 3) > -1 && c2.push(239, 191, 189);
              continue;
            }
            a2 = r2;
            continue;
          }
          if (r2 < 56320) {
            (t2 -= 3) > -1 && c2.push(239, 191, 189), a2 = r2;
            continue;
          }
          r2 = 65536 + (a2 - 55296 << 10 | r2 - 56320);
        } else
          a2 && (t2 -= 3) > -1 && c2.push(239, 191, 189);
        if (a2 = null, r2 < 128) {
          if ((t2 -= 1) < 0)
            break;
          c2.push(r2);
        } else if (r2 < 2048) {
          if ((t2 -= 2) < 0)
            break;
          c2.push(r2 >> 6 | 192, 63 & r2 | 128);
        } else if (r2 < 65536) {
          if ((t2 -= 3) < 0)
            break;
          c2.push(r2 >> 12 | 224, r2 >> 6 & 63 | 128, 63 & r2 | 128);
        } else {
          if (!(r2 < 1114112))
            throw new Error("Invalid code point");
          if ((t2 -= 4) < 0)
            break;
          c2.push(r2 >> 18 | 240, r2 >> 12 & 63 | 128, r2 >> 6 & 63 | 128, 63 & r2 | 128);
        }
      }
      return c2;
    }
    __name(utf8ToBytes, "utf8ToBytes");
    function base64ToBytes(e2) {
      return toByteArray(function(e3) {
        if ((e3 = (e3 = e3.split("=")[0]).trim().replace(d, "")).length < 2)
          return "";
        for (; e3.length % 4 != 0; )
          e3 += "=";
        return e3;
      }(e2));
    }
    __name(base64ToBytes, "base64ToBytes");
    function blitBuffer(e2, t2, r2, s2) {
      let a2;
      for (a2 = 0; a2 < s2 && !(a2 + r2 >= t2.length || a2 >= e2.length); ++a2)
        t2[a2 + r2] = e2[a2];
      return a2;
    }
    __name(blitBuffer, "blitBuffer");
    function isInstance(e2, t2) {
      return e2 instanceof t2 || null != e2 && null != e2.constructor && null != e2.constructor.name && e2.constructor.name === t2.name;
    }
    __name(isInstance, "isInstance");
    function numberIsNaN(e2) {
      return e2 != e2;
    }
    __name(numberIsNaN, "numberIsNaN");
    const f = function() {
      const e2 = "0123456789abcdef", t2 = Array.from({ length: 256 });
      for (let r2 = 0; r2 < 16; ++r2) {
        const s2 = 16 * r2;
        for (let a2 = 0; a2 < 16; ++a2)
          t2[s2 + a2] = e2[r2] + e2[a2];
      }
      return t2;
    }();
    function defineBigIntMethod(e2) {
      return "undefined" == typeof BigInt ? BufferBigIntNotDefined : e2;
    }
    __name(defineBigIntMethod, "defineBigIntMethod");
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
    __name(BufferBigIntNotDefined, "BufferBigIntNotDefined");
    const m = globalThis.Buffer || Buffer$1;
    globalThis.btoa.bind(globalThis), globalThis.atob.bind(globalThis), "global" in globalThis || (globalThis.global = globalThis);
    Object.assign(/* @__PURE__ */ Object.create(null), { NONE: 0, DIRHANDLE: 1, DNSCHANNEL: 2, ELDHISTOGRAM: 3, FILEHANDLE: 4, FILEHANDLECLOSEREQ: 5, BLOBREADER: 6, FSEVENTWRAP: 7, FSREQCALLBACK: 8, FSREQPROMISE: 9, GETADDRINFOREQWRAP: 10, GETNAMEINFOREQWRAP: 11, HEAPSNAPSHOT: 12, HTTP2SESSION: 13, HTTP2STREAM: 14, HTTP2PING: 15, HTTP2SETTINGS: 16, HTTPINCOMINGMESSAGE: 17, HTTPCLIENTREQUEST: 18, JSSTREAM: 19, JSUDPWRAP: 20, MESSAGEPORT: 21, PIPECONNECTWRAP: 22, PIPESERVERWRAP: 23, PIPEWRAP: 24, PROCESSWRAP: 25, PROMISE: 26, QUERYWRAP: 27, QUIC_ENDPOINT: 28, QUIC_LOGSTREAM: 29, QUIC_PACKET: 30, QUIC_SESSION: 31, QUIC_STREAM: 32, QUIC_UDP: 33, SHUTDOWNWRAP: 34, SIGNALWRAP: 35, STATWATCHER: 36, STREAMPIPE: 37, TCPCONNECTWRAP: 38, TCPSERVERWRAP: 39, TCPWRAP: 40, TTYWRAP: 41, UDPSENDWRAP: 42, UDPWRAP: 43, SIGINTWATCHDOG: 44, WORKER: 45, WORKERHEAPSNAPSHOT: 46, WRITEWRAP: 47, ZLIB: 48, CHECKPRIMEREQUEST: 49, PBKDF2REQUEST: 50, KEYPAIRGENREQUEST: 51, KEYGENREQUEST: 52, KEYEXPORTREQUEST: 53, CIPHERREQUEST: 54, DERIVEBITSREQUEST: 55, HASHREQUEST: 56, RANDOMBYTESREQUEST: 57, RANDOMPRIMEREQUEST: 58, SCRYPTREQUEST: 59, SIGNREQUEST: 60, TLSWRAP: 61, VERIFYREQUEST: 62 });
    let g = 100;
    const x = globalThis.AsyncResource || class {
      __unenv__ = true;
      type;
      _asyncId;
      _triggerAsyncId;
      constructor(e2, t2 = 0) {
        this.type = e2, this._asyncId = -1 * g++, this._triggerAsyncId = "number" == typeof t2 ? t2 : t2?.triggerAsyncId;
      }
      static bind(e2, t2, r2) {
        return new x(t2 ?? "anonymous").bind(e2);
      }
      bind(e2, t2) {
        const binded = /* @__PURE__ */ __name((...r2) => this.runInAsyncScope(e2, t2, ...r2), "binded");
        return binded.asyncResource = this, binded;
      }
      runInAsyncScope(e2, t2, ...r2) {
        return e2.apply(t2, r2);
      }
      emitDestroy() {
        return this;
      }
      asyncId() {
        return this._asyncId;
      }
      triggerAsyncId() {
        return this._triggerAsyncId;
      }
    };
    let _ = 10;
    const E = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
    }).prototype), inspect = /* @__PURE__ */ __name((e2, t2) => e2, "inspect"), S = Error, T = Error, C = Error, R = Error, N = Error, O = Symbol.for("nodejs.rejection"), I = Symbol.for("kCapture"), P = Symbol.for("events.errorMonitor"), L = Symbol.for("shapeMode"), M = Symbol.for("events.maxEventTargetListeners"), $ = Symbol.for("kEnhanceStackBeforeInspector"), B = Symbol.for("nodejs.watermarkData"), j = Symbol.for("kEventEmitter"), D = Symbol.for("kAsyncResource"), H = Symbol.for("kFirstEventParam"), U = Symbol.for("kResistStopPropagation"), V = Symbol.for("events.maxEventTargetListenersWarned");
    class _EventEmitter {
      _events = void 0;
      _eventsCount = 0;
      _maxListeners = _;
      [I] = false;
      [L] = false;
      static captureRejectionSymbol = O;
      static errorMonitor = P;
      static kMaxEventTargetListeners = M;
      static kMaxEventTargetListenersWarned = V;
      static usingDomains = false;
      static get on() {
        return on$1;
      }
      static get once() {
        return once$1;
      }
      static get getEventListeners() {
        return getEventListeners;
      }
      static get getMaxListeners() {
        return getMaxListeners$1;
      }
      static get addAbortListener() {
        return addAbortListener;
      }
      static get EventEmitterAsyncResource() {
        return EventEmitterAsyncResource;
      }
      static get EventEmitter() {
        return _EventEmitter;
      }
      static setMaxListeners(e2 = _, ...t2) {
        if (0 === t2.length)
          _ = e2;
        else
          for (const r2 of t2)
            if (isEventTarget(r2))
              r2[M] = e2, r2[V] = false;
            else {
              if ("function" != typeof r2.setMaxListeners)
                throw new C("eventTargets", ["EventEmitter", "EventTarget"], r2);
              r2.setMaxListeners(e2);
            }
      }
      static listenerCount(e2, t2) {
        if ("function" == typeof e2.listenerCount)
          return e2.listenerCount(t2);
        _EventEmitter.prototype.listenerCount.call(e2, t2);
      }
      static init() {
        throw new Error("EventEmitter.init() is not implemented.");
      }
      static get captureRejections() {
        return this[I];
      }
      static set captureRejections(e2) {
        this[I] = e2;
      }
      static get defaultMaxListeners() {
        return _;
      }
      static set defaultMaxListeners(e2) {
        _ = e2;
      }
      constructor(e2) {
        void 0 === this._events || this._events === Object.getPrototypeOf(this)._events ? (this._events = { __proto__: null }, this._eventsCount = 0, this[L] = false) : this[L] = true, this._maxListeners = this._maxListeners || void 0, this[I] = e2?.captureRejections ? Boolean(e2.captureRejections) : _EventEmitter.prototype[I];
      }
      setMaxListeners(e2) {
        return this._maxListeners = e2, this;
      }
      getMaxListeners() {
        return _getMaxListeners(this);
      }
      emit(e2, ...t2) {
        let r2 = "error" === e2;
        const s2 = this._events;
        if (void 0 !== s2)
          r2 && void 0 !== s2[P] && this.emit(P, ...t2), r2 = r2 && void 0 === s2.error;
        else if (!r2)
          return false;
        if (r2) {
          let e3, r3;
          if (t2.length > 0 && (e3 = t2[0]), e3 instanceof Error) {
            try {
              const t3 = {};
              Error.captureStackTrace?.(t3, _EventEmitter.prototype.emit), Object.defineProperty(e3, $, { __proto__: null, value: Function.prototype.bind(enhanceStackTrace, this, e3, t3), configurable: true });
            } catch {
            }
            throw e3;
          }
          try {
            r3 = inspect(e3);
          } catch {
            r3 = e3;
          }
          const s3 = new T(r3);
          throw s3.context = e3, s3;
        }
        const a2 = s2[e2];
        if (void 0 === a2)
          return false;
        if ("function" == typeof a2) {
          const r3 = a2.apply(this, t2);
          null != r3 && addCatch(this, r3, e2, t2);
        } else {
          const r3 = a2.length, s3 = arrayClone(a2);
          for (let a3 = 0; a3 < r3; ++a3) {
            const r4 = s3[a3].apply(this, t2);
            null != r4 && addCatch(this, r4, e2, t2);
          }
        }
        return true;
      }
      addListener(e2, t2) {
        return _addListener(this, e2, t2, false), this;
      }
      on(e2, t2) {
        return this.addListener(e2, t2);
      }
      prependListener(e2, t2) {
        return _addListener(this, e2, t2, true), this;
      }
      once(e2, t2) {
        return this.on(e2, _onceWrap(this, e2, t2)), this;
      }
      prependOnceListener(e2, t2) {
        return this.prependListener(e2, _onceWrap(this, e2, t2)), this;
      }
      removeListener(e2, t2) {
        const r2 = this._events;
        if (void 0 === r2)
          return this;
        const s2 = r2[e2];
        if (void 0 === s2)
          return this;
        if (s2 === t2 || s2.listener === t2)
          this._eventsCount -= 1, this[L] ? r2[e2] = void 0 : 0 === this._eventsCount ? this._events = { __proto__: null } : (delete r2[e2], r2.removeListener && this.emit("removeListener", e2, s2.listener || t2));
        else if ("function" != typeof s2) {
          let a2 = -1;
          for (let e3 = s2.length - 1; e3 >= 0; e3--)
            if (s2[e3] === t2 || s2[e3].listener === t2) {
              a2 = e3;
              break;
            }
          if (a2 < 0)
            return this;
          0 === a2 ? s2.shift() : function(e3, t3) {
            for (; t3 + 1 < e3.length; t3++)
              e3[t3] = e3[t3 + 1];
            e3.pop();
          }(s2, a2), 1 === s2.length && (r2[e2] = s2[0]), void 0 !== r2.removeListener && this.emit("removeListener", e2, t2);
        }
        return this;
      }
      off(e2, t2) {
        return this.removeListener(e2, t2);
      }
      removeAllListeners(e2) {
        const t2 = this._events;
        if (void 0 === t2)
          return this;
        if (void 0 === t2.removeListener)
          return 0 === arguments.length ? (this._events = { __proto__: null }, this._eventsCount = 0) : void 0 !== t2[e2] && (0 === --this._eventsCount ? this._events = { __proto__: null } : delete t2[e2]), this[L] = false, this;
        if (0 === arguments.length) {
          for (const e3 of Reflect.ownKeys(t2))
            "removeListener" !== e3 && this.removeAllListeners(e3);
          return this.removeAllListeners("removeListener"), this._events = { __proto__: null }, this._eventsCount = 0, this[L] = false, this;
        }
        const r2 = t2[e2];
        if ("function" == typeof r2)
          this.removeListener(e2, r2);
        else if (void 0 !== r2)
          for (let t3 = r2.length - 1; t3 >= 0; t3--)
            this.removeListener(e2, r2[t3]);
        return this;
      }
      listeners(e2) {
        return _listeners(this, e2, true);
      }
      rawListeners(e2) {
        return _listeners(this, e2, false);
      }
      eventNames() {
        return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
      }
      listenerCount(e2, t2) {
        const r2 = this._events;
        if (void 0 !== r2) {
          const s2 = r2[e2];
          if ("function" == typeof s2)
            return null != t2 ? t2 === s2 || t2 === s2.listener ? 1 : 0 : 1;
          if (void 0 !== s2) {
            if (null != t2) {
              let e3 = 0;
              for (let r3 = 0, a2 = s2.length; r3 < a2; r3++)
                s2[r3] !== t2 && s2[r3].listener !== t2 || e3++;
              return e3;
            }
            return s2.length;
          }
        }
        return 0;
      }
    }
    __name(_EventEmitter, "_EventEmitter");
    class EventEmitterAsyncResource extends _EventEmitter {
      constructor(e2) {
        let t2;
        "string" == typeof e2 ? (t2 = e2, e2 = void 0) : t2 = e2?.name || new.target.name, super(e2), this[D] = new EventEmitterReferencingAsyncResource(this, t2, e2);
      }
      emit(e2, ...t2) {
        if (void 0 === this[D])
          throw new S("EventEmitterAsyncResource");
        const { asyncResource: r2 } = this;
        return Array.prototype.unshift(t2, super.emit, this, e2), Reflect.apply(r2.runInAsyncScope, r2, t2);
      }
      emitDestroy() {
        if (void 0 === this[D])
          throw new S("EventEmitterAsyncResource");
        this.asyncResource.emitDestroy();
      }
      get asyncId() {
        if (void 0 === this[D])
          throw new S("EventEmitterAsyncResource");
        return this.asyncResource.asyncId();
      }
      get triggerAsyncId() {
        if (void 0 === this[D])
          throw new S("EventEmitterAsyncResource");
        return this.asyncResource.triggerAsyncId();
      }
      get asyncResource() {
        if (void 0 === this[D])
          throw new S("EventEmitterAsyncResource");
        return this[D];
      }
    }
    __name(EventEmitterAsyncResource, "EventEmitterAsyncResource");
    class EventEmitterReferencingAsyncResource extends x {
      constructor(e2, t2, r2) {
        super(t2, r2), this[j] = e2;
      }
      get eventEmitter() {
        if (void 0 === this[j])
          throw new S("EventEmitterReferencingAsyncResource");
        return this[j];
      }
    }
    __name(EventEmitterReferencingAsyncResource, "EventEmitterReferencingAsyncResource");
    const on$1 = /* @__PURE__ */ __name(function(e2, t2, r2 = {}) {
      const s2 = r2.signal;
      if (s2?.aborted)
        throw new R(void 0, { cause: s2?.reason });
      const a2 = r2.highWaterMark ?? r2.highWatermark ?? Number.MAX_SAFE_INTEGER, c2 = r2.lowWaterMark ?? r2.lowWatermark ?? 1, p2 = new FixedQueue(), u2 = new FixedQueue();
      let d2 = false, f2 = null, m2 = false, g2 = 0;
      const x2 = Object.setPrototypeOf({ next() {
        if (g2) {
          const t3 = p2.shift();
          return g2--, d2 && g2 < c2 && (e2.resume?.(), d2 = false), Promise.resolve(createIterResult(t3, false));
        }
        if (f2) {
          const e3 = Promise.reject(f2);
          return f2 = null, e3;
        }
        return m2 ? closeHandler() : new Promise(function(e3, t3) {
          u2.push({ resolve: e3, reject: t3 });
        });
      }, return: () => closeHandler(), throw(e3) {
        if (!(e3 && e3 instanceof Error))
          throw new C("EventEmitter.AsyncIterator", "Error", e3);
        errorHandler(e3);
      }, [Symbol.asyncIterator]() {
        return this;
      }, [B]: { get size() {
        return g2;
      }, get low() {
        return c2;
      }, get high() {
        return a2;
      }, get isPaused() {
        return d2;
      } } }, E), { addEventListener: _2, removeAll: S2 } = function() {
        const e3 = [];
        return { addEventListener(t3, r3, s3, a3) {
          eventTargetAgnosticAddListener(t3, r3, s3, a3), Array.prototype.push(e3, [t3, r3, s3, a3]);
        }, removeAll() {
          for (; e3.length > 0; )
            Reflect.apply(eventTargetAgnosticRemoveListener, void 0, e3.pop());
        } };
      }();
      _2(e2, t2, r2[H] ? eventHandler : function(...e3) {
        return eventHandler(e3);
      }), "error" !== t2 && "function" == typeof e2.on && _2(e2, "error", errorHandler);
      const T2 = r2?.close;
      if (T2?.length)
        for (const t3 of T2)
          _2(e2, t3, closeHandler);
      const N2 = s2 ? addAbortListener(s2, function() {
        errorHandler(new R(void 0, { cause: s2?.reason }));
      }) : null;
      return x2;
      function eventHandler(t3) {
        u2.isEmpty() ? (g2++, !d2 && g2 > a2 && (d2 = true, e2.pause?.()), p2.push(t3)) : u2.shift().resolve(createIterResult(t3, false));
      }
      __name(eventHandler, "eventHandler");
      function errorHandler(e3) {
        u2.isEmpty() ? f2 = e3 : u2.shift().reject(e3), closeHandler();
      }
      __name(errorHandler, "errorHandler");
      function closeHandler() {
        N2?.[Symbol.dispose](), S2(), m2 = true;
        const e3 = createIterResult(void 0, true);
        for (; !u2.isEmpty(); )
          u2.shift().resolve(e3);
        return Promise.resolve(e3);
      }
      __name(closeHandler, "closeHandler");
    }, "on$1"), once$1 = /* @__PURE__ */ __name(async function(e2, t2, r2 = {}) {
      const s2 = r2?.signal;
      if (s2?.aborted)
        throw new R(void 0, { cause: s2?.reason });
      return new Promise((r3, a2) => {
        const errorListener = /* @__PURE__ */ __name((r4) => {
          "function" == typeof e2.removeListener && e2.removeListener(t2, resolver), null != s2 && eventTargetAgnosticRemoveListener(s2, "abort", abortListener), a2(r4);
        }, "errorListener"), resolver = /* @__PURE__ */ __name((...t3) => {
          "function" == typeof e2.removeListener && e2.removeListener("error", errorListener), null != s2 && eventTargetAgnosticRemoveListener(s2, "abort", abortListener), r3(t3);
        }, "resolver");
        function abortListener() {
          eventTargetAgnosticRemoveListener(e2, t2, resolver), eventTargetAgnosticRemoveListener(e2, "error", errorListener), a2(new R(void 0, { cause: s2?.reason }));
        }
        __name(abortListener, "abortListener");
        eventTargetAgnosticAddListener(e2, t2, resolver, { __proto__: null, once: true, [U]: true }), "error" !== t2 && "function" == typeof e2.once && e2.once("error", errorListener), null != s2 && eventTargetAgnosticAddListener(s2, "abort", abortListener, { __proto__: null, once: true, [U]: true });
      });
    }, "once$1"), addAbortListener = /* @__PURE__ */ __name(function(e2, t2) {
      if (void 0 === e2)
        throw new C("signal", "AbortSignal", e2);
      let r2;
      return e2.aborted ? queueMicrotask(() => t2()) : (e2.addEventListener("abort", t2, { __proto__: null, once: true, [U]: true }), r2 = /* @__PURE__ */ __name(() => {
        e2.removeEventListener("abort", t2);
      }, "r")), { __proto__: null, [Symbol.dispose]() {
        r2?.();
      } };
    }, "addAbortListener"), getEventListeners = /* @__PURE__ */ __name(function(e2, t2) {
      if ("function" == typeof e2.listeners)
        return e2.listeners(t2);
      if (isEventTarget(e2)) {
        const r2 = e2[kEvents].get(t2), s2 = [];
        let a2 = r2?.next;
        for (; void 0 !== a2?.listener; ) {
          const e3 = a2.listener?.deref ? a2.listener.deref() : a2.listener;
          s2.push(e3), a2 = a2.next;
        }
        return s2;
      }
      throw new C("emitter", ["EventEmitter", "EventTarget"], e2);
    }, "getEventListeners"), getMaxListeners$1 = /* @__PURE__ */ __name(function(e2) {
      if ("function" == typeof e2?.getMaxListeners)
        return _getMaxListeners(e2);
      if (e2?.[M])
        return e2[M];
      throw new C("emitter", ["EventEmitter", "EventTarget"], e2);
    }, "getMaxListeners$1"), F = 2047;
    class FixedCircularBuffer {
      bottom;
      top;
      list;
      next;
      constructor() {
        this.bottom = 0, this.top = 0, this.list = new Array(2048), this.next = null;
      }
      isEmpty() {
        return this.top === this.bottom;
      }
      isFull() {
        return (this.top + 1 & F) === this.bottom;
      }
      push(e2) {
        this.list[this.top] = e2, this.top = this.top + 1 & F;
      }
      shift() {
        const e2 = this.list[this.bottom];
        return void 0 === e2 ? null : (this.list[this.bottom] = void 0, this.bottom = this.bottom + 1 & F, e2);
      }
    }
    __name(FixedCircularBuffer, "FixedCircularBuffer");
    class FixedQueue {
      head;
      tail;
      constructor() {
        this.head = this.tail = new FixedCircularBuffer();
      }
      isEmpty() {
        return this.head.isEmpty();
      }
      push(e2) {
        this.head.isFull() && (this.head = this.head.next = new FixedCircularBuffer()), this.head.push(e2);
      }
      shift() {
        const e2 = this.tail, t2 = e2.shift();
        return e2.isEmpty() && null !== e2.next && (this.tail = e2.next, e2.next = null), t2;
      }
    }
    __name(FixedQueue, "FixedQueue");
    function isEventTarget(e2) {
      return "function" == typeof e2?.addEventListener;
    }
    __name(isEventTarget, "isEventTarget");
    function addCatch(e2, t2, r2, s2) {
      if (e2[I])
        try {
          const a2 = t2.then;
          "function" == typeof a2 && a2.call(t2, void 0, function(t3) {
            setTimeout(emitUnhandledRejectionOrErr, 0, e2, t3, r2, s2);
          });
        } catch (t3) {
          e2.emit("error", t3);
        }
    }
    __name(addCatch, "addCatch");
    function emitUnhandledRejectionOrErr(e2, t2, r2, s2) {
      if ("function" == typeof e2[O])
        e2[O](t2, r2, ...s2);
      else {
        const r3 = e2[I];
        try {
          e2[I] = false, e2.emit("error", t2);
        } finally {
          e2[I] = r3;
        }
      }
    }
    __name(emitUnhandledRejectionOrErr, "emitUnhandledRejectionOrErr");
    function _getMaxListeners(e2) {
      return void 0 === e2._maxListeners ? _ : e2._maxListeners;
    }
    __name(_getMaxListeners, "_getMaxListeners");
    function enhanceStackTrace(e2, t2) {
      let r2 = "";
      try {
        const { name: e3 } = this.constructor;
        "EventEmitter" !== e3 && (r2 = ` on ${e3} instance`);
      } catch {
      }
      const s2 = `
Emitted 'error' event${r2} at:
`, a2 = (t2.stack || "").split("\n").slice(1);
      return e2.stack + s2 + a2.join("\n");
    }
    __name(enhanceStackTrace, "enhanceStackTrace");
    function _addListener(e2, t2, r2, s2) {
      let a2, c2, p2;
      if (c2 = e2._events, void 0 === c2 ? (c2 = e2._events = { __proto__: null }, e2._eventsCount = 0) : (void 0 !== c2.newListener && (e2.emit("newListener", t2, r2.listener ?? r2), c2 = e2._events), p2 = c2[t2]), void 0 === p2)
        c2[t2] = r2, ++e2._eventsCount;
      else if ("function" == typeof p2 ? p2 = c2[t2] = s2 ? [r2, p2] : [p2, r2] : s2 ? p2.unshift(r2) : p2.push(r2), a2 = _getMaxListeners(e2), a2 > 0 && p2.length > a2 && !p2.warned) {
        p2.warned = true;
        const r3 = new N(`Possible EventEmitter memory leak detected. ${p2.length} ${String(t2)} listeners added to ${inspect(e2)}. MaxListeners is ${a2}. Use emitter.setMaxListeners() to increase limit`, { name: "MaxListenersExceededWarning", emitter: e2, type: t2, count: p2.length });
        console.warn(r3);
      }
      return e2;
    }
    __name(_addListener, "_addListener");
    function onceWrapper() {
      if (!this.fired)
        return this.target.removeListener(this.type, this.wrapFn), this.fired = true, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
    }
    __name(onceWrapper, "onceWrapper");
    function _onceWrap(e2, t2, r2) {
      const s2 = { fired: false, wrapFn: void 0, target: e2, type: t2, listener: r2 }, a2 = onceWrapper.bind(s2);
      return a2.listener = r2, s2.wrapFn = a2, a2;
    }
    __name(_onceWrap, "_onceWrap");
    function _listeners(e2, t2, r2) {
      const s2 = e2._events;
      if (void 0 === s2)
        return [];
      const a2 = s2[t2];
      return void 0 === a2 ? [] : "function" == typeof a2 ? r2 ? [a2.listener || a2] : [a2] : r2 ? function(e3) {
        const t3 = arrayClone(e3);
        for (let e4 = 0; e4 < t3.length; ++e4) {
          const r3 = t3[e4].listener;
          "function" == typeof r3 && (t3[e4] = r3);
        }
        return t3;
      }(a2) : arrayClone(a2);
    }
    __name(_listeners, "_listeners");
    function arrayClone(e2) {
      switch (e2.length) {
        case 2:
          return [e2[0], e2[1]];
        case 3:
          return [e2[0], e2[1], e2[2]];
        case 4:
          return [e2[0], e2[1], e2[2], e2[3]];
        case 5:
          return [e2[0], e2[1], e2[2], e2[3], e2[4]];
        case 6:
          return [e2[0], e2[1], e2[2], e2[3], e2[4], e2[5]];
      }
      return Array.prototype.slice(e2);
    }
    __name(arrayClone, "arrayClone");
    function createIterResult(e2, t2) {
      return { value: e2, done: t2 };
    }
    __name(createIterResult, "createIterResult");
    function eventTargetAgnosticRemoveListener(e2, t2, r2, s2) {
      if ("function" == typeof e2.removeListener)
        e2.removeListener(t2, r2);
      else {
        if ("function" != typeof e2.removeEventListener)
          throw new C("emitter", "EventEmitter", e2);
        e2.removeEventListener(t2, r2, s2);
      }
    }
    __name(eventTargetAgnosticRemoveListener, "eventTargetAgnosticRemoveListener");
    function eventTargetAgnosticAddListener(e2, t2, r2, s2) {
      if ("function" == typeof e2.on)
        s2?.once ? e2.once(t2, r2) : e2.on(t2, r2);
      else {
        if ("function" != typeof e2.addEventListener)
          throw new C("emitter", "EventEmitter", e2);
        e2.addEventListener(t2, r2, s2);
      }
    }
    __name(eventTargetAgnosticAddListener, "eventTargetAgnosticAddListener");
    class WriteStream {
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(e2) {
        this.fd = e2;
      }
      clearLine(e2, t2) {
        return t2 && t2(), false;
      }
      clearScreenDown(e2) {
        return e2 && e2(), false;
      }
      cursorTo(e2, t2, r2) {
        return r2 && "function" == typeof r2 && r2(), false;
      }
      moveCursor(e2, t2, r2) {
        return r2 && r2(), false;
      }
      getColorDepth(e2) {
        return 1;
      }
      hasColors(e2, t2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(e2, t2, r2) {
        e2 instanceof Uint8Array && (e2 = new TextDecoder().decode(e2));
        try {
          console.log(e2);
        } catch {
        }
        return r2 && "function" == typeof r2 && r2(), false;
      }
    }
    __name(WriteStream, "WriteStream");
    class ReadStream {
      fd;
      isRaw = false;
      isTTY = false;
      constructor(e2) {
        this.fd = e2;
      }
      setRawMode(e2) {
        return this.isRaw = e2, this;
      }
    }
    __name(ReadStream, "ReadStream");
    const z = "22.14.0";
    class Process extends _EventEmitter {
      env;
      hrtime;
      nextTick;
      constructor(e2) {
        super(), this.env = e2.env, this.hrtime = e2.hrtime, this.nextTick = e2.nextTick;
        for (const e3 of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(_EventEmitter.prototype)]) {
          const t2 = this[e3];
          "function" == typeof t2 && (this[e3] = t2.bind(this));
        }
      }
      emitWarning(e2, t2, r2) {
        console.warn(`${r2 ? `[${r2}] ` : ""}${t2 ? `${t2}: ` : ""}${e2}`);
      }
      emit(...e2) {
        return super.emit(...e2);
      }
      listeners(e2) {
        return super.listeners(e2);
      }
      #e;
      #t;
      #n;
      get stdin() {
        return this.#e ??= new ReadStream(0);
      }
      get stdout() {
        return this.#t ??= new WriteStream(1);
      }
      get stderr() {
        return this.#n ??= new WriteStream(2);
      }
      #r = "/";
      chdir(e2) {
        this.#r = e2;
      }
      cwd() {
        return this.#r;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${z}`;
      }
      get versions() {
        return { node: z };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      permission = { has: notImplemented("process.permission.has") };
      report = { directory: "", filename: "", signal: "SIGUSR2", compact: false, reportOnFatalError: false, reportOnSignal: false, reportOnUncaughtException: false, getReport: notImplemented("process.report.getReport"), writeReport: notImplemented("process.report.writeReport") };
      finalization = { register: notImplemented("process.finalization.register"), unregister: notImplemented("process.finalization.unregister"), registerBeforeExit: notImplemented("process.finalization.registerBeforeExit") };
      memoryUsage = Object.assign(() => ({ arrayBuffers: 0, rss: 0, external: 0, heapTotal: 0, heapUsed: 0 }), { rss: () => 0 });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    }
    __name(Process, "Process");
    const q = /* @__PURE__ */ Object.create(null), W = globalThis.process, _getEnv = /* @__PURE__ */ __name((e2) => globalThis.__env__ || W?.env || (e2 ? q : globalThis), "_getEnv"), K = new Proxy(q, { get: (e2, t2) => _getEnv()[t2] ?? q[t2], has: (e2, t2) => t2 in _getEnv() || t2 in q, set: (e2, t2, r2) => (_getEnv(true)[t2] = r2, true), deleteProperty: (e2, t2) => (delete _getEnv(true)[t2], true), ownKeys() {
      const e2 = _getEnv();
      return Object.keys(e2);
    }, getOwnPropertyDescriptor(e2, t2) {
      const r2 = _getEnv();
      if (t2 in r2)
        return { value: r2[t2], writable: true, enumerable: true, configurable: true };
    } }), X = Object.assign(function(e2) {
      const t2 = Date.now(), r2 = Math.trunc(t2 / 1e3), s2 = t2 % 1e3 * 1e6;
      if (e2) {
        let t3 = r2 - e2[0], a2 = s2 - e2[0];
        return a2 < 0 && (t3 -= 1, a2 = 1e9 + a2), [t3, a2];
      }
      return [r2, s2];
    }, { bigint: function() {
      return BigInt(1e6 * Date.now());
    } }), G = globalThis.queueMicrotask ? (e2, ...t2) => {
      globalThis.queueMicrotask(e2.bind(void 0, ...t2));
    } : createNextTickWithTimeout();
    function createNextTickWithTimeout() {
      let e2, t2 = [], r2 = false, s2 = -1;
      function cleanUpNextTick() {
        r2 && e2 && (r2 = false, e2.length > 0 ? t2 = [...e2, ...t2] : s2 = -1, t2.length > 0 && drainQueue());
      }
      __name(cleanUpNextTick, "cleanUpNextTick");
      function drainQueue() {
        if (r2)
          return;
        const a2 = setTimeout(cleanUpNextTick);
        r2 = true;
        let c2 = t2.length;
        for (; c2; ) {
          for (e2 = t2, t2 = []; ++s2 < c2; )
            e2 && e2[s2]();
          s2 = -1, c2 = t2.length;
        }
        e2 = void 0, r2 = false, clearTimeout(a2);
      }
      __name(drainQueue, "drainQueue");
      return (e3, ...s3) => {
        t2.push(e3.bind(void 0, ...s3)), 1 !== t2.length || r2 || setTimeout(drainQueue);
      };
    }
    __name(createNextTickWithTimeout, "createNextTickWithTimeout");
    const J = new Process({ env: K, hrtime: X, nextTick: G }), { abort: Y, addListener: Q, allowedNodeEnvironmentFlags: Z, hasUncaughtExceptionCaptureCallback: ee, setUncaughtExceptionCaptureCallback: te, loadEnvFile: ne, sourceMapsEnabled: re, arch: oe, argv: se, argv0: ie, chdir: ae, config: ce, connected: le, constrainedMemory: pe, availableMemory: ue, cpuUsage: de, cwd: fe, debugPort: he, dlopen: me, disconnect: ge, emit: ve, emitWarning: ye, env: be, eventNames: xe, execArgv: _e, execPath: Ee, exit: we, finalization: Se, features: Te, getBuiltinModule: Ce, getActiveResourcesInfo: ke, getMaxListeners: Re, hrtime: Ae, kill: Ne, listeners: Oe, listenerCount: Ie, memoryUsage: Pe, nextTick: Le, on: Me, off: $e, once: Be, pid: je, platform: De, ppid: He, prependListener: Ue, prependOnceListener: Ve, rawListeners: Fe, release: ze, removeAllListeners: qe, removeListener: We, report: Ke, resourceUsage: Xe, setMaxListeners: Ge, setSourceMapsEnabled: Je, stderr: Ye, stdin: Qe, stdout: Ze, title: et, umask: tt, uptime: nt, version: rt, versions: ot, domain: st, initgroups: it, moduleLoadList: at, reallyExit: ct, openStdin: lt, assert: pt, binding: ut, send: dt, exitCode: ft, channel: ht, getegid: mt, geteuid: gt, getgid: vt, getgroups: yt, getuid: bt, setegid: xt, seteuid: _t, setgid: Et, setgroups: wt, setuid: St, permission: Tt, mainModule: Ct, ref: kt, unref: Rt, _events: At, _eventsCount: Nt, _exiting: Ot, _maxListeners: It, _debugEnd: Pt, _debugProcess: Lt, _fatalException: Mt, _getActiveHandles: $t, _getActiveRequests: Bt, _kill: jt, _preload_modules: Dt, _rawDebug: Ht, _startProfilerIdleNotifier: Ut, _stopProfilerIdleNotifier: Vt, _tickCallback: Ft, _disconnect: zt, _handleQueue: qt, _pendingMessage: Wt, _channel: Kt, _send: Xt, _linkedBinding: Gt } = J, Jt = globalThis.process;
    globalThis.process = Jt ? new Proxy(Jt, { get: (e2, t2, r2) => Reflect.has(e2, t2) ? Reflect.get(e2, t2, r2) : Reflect.get(J, t2, r2) }) : J, globalThis.Buffer || (globalThis.Buffer = m);
    Object.assign(() => {
    }, { __unenv__: true });
    class Timeout {
      constructor(e2, t2) {
        "function" == typeof e2 && e2(...t2);
      }
      close() {
        throw createNotImplementedError("node.timers.timeout.close");
      }
      _onTimeout(...e2) {
        throw createNotImplementedError("node.timers.timeout._onTimeout");
      }
      ref() {
        return this;
      }
      unref() {
        return this;
      }
      hasRef() {
        return false;
      }
      refresh() {
        return this;
      }
      [Symbol.dispose]() {
      }
      [Symbol.toPrimitive]() {
        return 0;
      }
    }
    __name(Timeout, "Timeout");
    function setTimeoutFallback(e2, t2, ...r2) {
      return new Timeout(e2, r2);
    }
    __name(setTimeoutFallback, "setTimeoutFallback");
    setTimeoutFallback.__promisify__ = function(e2, t2, r2) {
      return new Promise((e3) => {
        e3(t2);
      });
    };
    class Immediate {
      _onImmediate;
      _timeout;
      constructor(e2, t2) {
        this._onImmediate = e2, "setTimeout" in globalThis ? this._timeout = setTimeout(e2, 0, ...t2) : e2(...t2);
      }
      ref() {
        return this._timeout?.ref(), this;
      }
      unref() {
        return this._timeout?.unref(), this;
      }
      hasRef() {
        return this._timeout?.hasRef() ?? false;
      }
      [Symbol.dispose]() {
        "clearTimeout" in globalThis && clearTimeout(this._timeout);
      }
    }
    __name(Immediate, "Immediate");
    function setImmediateFallback(e2, ...t2) {
      return new Immediate(e2, t2);
    }
    __name(setImmediateFallback, "setImmediateFallback");
    function setIntervalFallback(e2, t2, ...r2) {
      return new Timeout(e2, r2);
    }
    __name(setIntervalFallback, "setIntervalFallback");
    setImmediateFallback.__promisify__ = function(e2) {
      return new Promise((t2) => {
        t2(e2);
      });
    }, setIntervalFallback.__promisify__ = async function* (e2, t2) {
      yield t2;
    };
    const Yt = globalThis.clearImmediate?.bind(globalThis) || function(e2) {
      e2?.[Symbol.dispose]();
    };
    globalThis.clearInterval?.bind(globalThis), globalThis.clearTimeout?.bind(globalThis);
    const Qt = globalThis.setImmediate?.bind(globalThis) || setImmediateFallback;
    globalThis.setTimeout?.bind(globalThis), globalThis.setInterval?.bind(globalThis), globalThis.setImmediate || (globalThis.setImmediate = Qt), globalThis.clearImmediate || (globalThis.clearImmediate = Yt);
    const Zt = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/, en = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/, tn = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
    function jsonParseTransform(e2, t2) {
      if (!("__proto__" === e2 || "constructor" === e2 && t2 && "object" == typeof t2 && "prototype" in t2))
        return t2;
      !function(e3) {
        console.warn(`[destr] Dropping "${e3}" key to prevent prototype pollution.`);
      }(e2);
    }
    __name(jsonParseTransform, "jsonParseTransform");
    function destr(e2, t2 = {}) {
      if ("string" != typeof e2)
        return e2;
      if ('"' === e2[0] && '"' === e2[e2.length - 1] && -1 === e2.indexOf("\\"))
        return e2.slice(1, -1);
      const r2 = e2.trim();
      if (r2.length <= 9)
        switch (r2.toLowerCase()) {
          case "true":
            return true;
          case "false":
            return false;
          case "undefined":
            return;
          case "null":
            return null;
          case "nan":
            return Number.NaN;
          case "infinity":
            return Number.POSITIVE_INFINITY;
          case "-infinity":
            return Number.NEGATIVE_INFINITY;
        }
      if (!tn.test(e2)) {
        if (t2.strict)
          throw new SyntaxError("[destr] Invalid JSON");
        return e2;
      }
      try {
        if (Zt.test(e2) || en.test(e2)) {
          if (t2.strict)
            throw new Error("[destr] Possible prototype pollution");
          return JSON.parse(e2, jsonParseTransform);
        }
        return JSON.parse(e2);
      } catch (r3) {
        if (t2.strict)
          throw r3;
        return e2;
      }
    }
    __name(destr, "destr");
    const nn = /#/g, rn = /&/g, on = /\//g, sn = /=/g, an = /\+/g, cn = /%5e/gi, ln = /%60/gi, pn = /%7c/gi, un = /%20/gi;
    function encodeQueryValue(e2) {
      return (t2 = "string" == typeof e2 ? e2 : JSON.stringify(e2), encodeURI("" + t2).replace(pn, "|")).replace(an, "%2B").replace(un, "+").replace(nn, "%23").replace(rn, "%26").replace(ln, "`").replace(cn, "^").replace(on, "%2F");
      var t2;
    }
    __name(encodeQueryValue, "encodeQueryValue");
    function encodeQueryKey(e2) {
      return encodeQueryValue(e2).replace(sn, "%3D");
    }
    __name(encodeQueryKey, "encodeQueryKey");
    function decode(e2 = "") {
      try {
        return decodeURIComponent("" + e2);
      } catch {
        return "" + e2;
      }
    }
    __name(decode, "decode");
    function decodeQueryKey(e2) {
      return decode(e2.replace(an, " "));
    }
    __name(decodeQueryKey, "decodeQueryKey");
    function decodeQueryValue(e2) {
      return decode(e2.replace(an, " "));
    }
    __name(decodeQueryValue, "decodeQueryValue");
    function parseQuery(e2 = "") {
      const t2 = /* @__PURE__ */ Object.create(null);
      "?" === e2[0] && (e2 = e2.slice(1));
      for (const r2 of e2.split("&")) {
        const e3 = r2.match(/([^=]+)=?(.*)/) || [];
        if (e3.length < 2)
          continue;
        const s2 = decodeQueryKey(e3[1]);
        if ("__proto__" === s2 || "constructor" === s2)
          continue;
        const a2 = decodeQueryValue(e3[2] || "");
        void 0 === t2[s2] ? t2[s2] = a2 : Array.isArray(t2[s2]) ? t2[s2].push(a2) : t2[s2] = [t2[s2], a2];
      }
      return t2;
    }
    __name(parseQuery, "parseQuery");
    function stringifyQuery(e2) {
      return Object.keys(e2).filter((t2) => void 0 !== e2[t2]).map((t2) => {
        return r2 = t2, "number" != typeof (s2 = e2[t2]) && "boolean" != typeof s2 || (s2 = String(s2)), s2 ? Array.isArray(s2) ? s2.map((e3) => `${encodeQueryKey(r2)}=${encodeQueryValue(e3)}`).join("&") : `${encodeQueryKey(r2)}=${encodeQueryValue(s2)}` : encodeQueryKey(r2);
        var r2, s2;
      }).filter(Boolean).join("&");
    }
    __name(stringifyQuery, "stringifyQuery");
    const dn = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/, hn = /^[\s\w\0+.-]{2,}:([/\\]{2})?/, mn = /^([/\\]\s*){2,}[^/\\]/, gn = /^[\s\0]*(blob|data|javascript|vbscript):$/i, vn = /\/$|\/\?|\/#/, yn = /^\.?\//;
    function hasProtocol(e2, t2 = {}) {
      return "boolean" == typeof t2 && (t2 = { acceptRelative: t2 }), t2.strict ? dn.test(e2) : hn.test(e2) || !!t2.acceptRelative && mn.test(e2);
    }
    __name(hasProtocol, "hasProtocol");
    function hasTrailingSlash(e2 = "", t2) {
      return t2 ? vn.test(e2) : e2.endsWith("/");
    }
    __name(hasTrailingSlash, "hasTrailingSlash");
    function withoutTrailingSlash(e2 = "", t2) {
      if (!t2)
        return (hasTrailingSlash(e2) ? e2.slice(0, -1) : e2) || "/";
      if (!hasTrailingSlash(e2, true))
        return e2 || "/";
      let r2 = e2, s2 = "";
      const a2 = e2.indexOf("#");
      -1 !== a2 && (r2 = e2.slice(0, a2), s2 = e2.slice(a2));
      const [c2, ...p2] = r2.split("?");
      return ((c2.endsWith("/") ? c2.slice(0, -1) : c2) || "/") + (p2.length > 0 ? `?${p2.join("?")}` : "") + s2;
    }
    __name(withoutTrailingSlash, "withoutTrailingSlash");
    function withTrailingSlash(e2 = "", t2) {
      if (!t2)
        return e2.endsWith("/") ? e2 : e2 + "/";
      if (hasTrailingSlash(e2, true))
        return e2 || "/";
      let r2 = e2, s2 = "";
      const a2 = e2.indexOf("#");
      if (-1 !== a2 && (r2 = e2.slice(0, a2), s2 = e2.slice(a2), !r2))
        return s2;
      const [c2, ...p2] = r2.split("?");
      return c2 + "/" + (p2.length > 0 ? `?${p2.join("?")}` : "") + s2;
    }
    __name(withTrailingSlash, "withTrailingSlash");
    function withLeadingSlash(e2 = "") {
      return function(e3 = "") {
        return e3.startsWith("/");
      }(e2) ? e2 : "/" + e2;
    }
    __name(withLeadingSlash, "withLeadingSlash");
    function withoutBase(e2, t2) {
      if (isEmptyURL(t2))
        return e2;
      const r2 = withoutTrailingSlash(t2);
      if (!e2.startsWith(r2))
        return e2;
      const s2 = e2.slice(r2.length);
      return "/" === s2[0] ? s2 : "/" + s2;
    }
    __name(withoutBase, "withoutBase");
    function withQuery(e2, t2) {
      const r2 = parseURL(e2), s2 = { ...parseQuery(r2.search), ...t2 };
      return r2.search = stringifyQuery(s2), stringifyParsedURL(r2);
    }
    __name(withQuery, "withQuery");
    function getQuery$1(e2) {
      return parseQuery(parseURL(e2).search);
    }
    __name(getQuery$1, "getQuery$1");
    function isEmptyURL(e2) {
      return !e2 || "/" === e2;
    }
    __name(isEmptyURL, "isEmptyURL");
    function joinURL(e2, ...t2) {
      let r2 = e2 || "";
      for (const e3 of t2.filter((e4) => function(e5) {
        return e5 && "/" !== e5;
      }(e4)))
        if (r2) {
          const t3 = e3.replace(yn, "");
          r2 = withTrailingSlash(r2) + t3;
        } else
          r2 = e3;
      return r2;
    }
    __name(joinURL, "joinURL");
    function joinRelativeURL(...e2) {
      const t2 = /\/(?!\/)/, r2 = e2.filter(Boolean), s2 = [];
      let a2 = 0;
      for (const e3 of r2)
        if (e3 && "/" !== e3) {
          for (const [r3, c3] of e3.split(t2).entries())
            if (c3 && "." !== c3)
              if (".." !== c3)
                1 === r3 && s2[s2.length - 1]?.endsWith(":/") ? s2[s2.length - 1] += "/" + c3 : (s2.push(c3), a2++);
              else {
                if (1 === s2.length && hasProtocol(s2[0]))
                  continue;
                s2.pop(), a2--;
              }
        }
      let c2 = s2.join("/");
      return a2 >= 0 ? r2[0]?.startsWith("/") && !c2.startsWith("/") ? c2 = "/" + c2 : r2[0]?.startsWith("./") && !c2.startsWith("./") && (c2 = "./" + c2) : c2 = "../".repeat(-1 * a2) + c2, r2[r2.length - 1]?.endsWith("/") && !c2.endsWith("/") && (c2 += "/"), c2;
    }
    __name(joinRelativeURL, "joinRelativeURL");
    const bn = Symbol.for("ufo:protocolRelative");
    function parseURL(e2 = "", t2) {
      const r2 = e2.match(/^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i);
      if (r2) {
        const [, e3, t3 = ""] = r2;
        return { protocol: e3.toLowerCase(), pathname: t3, href: e3 + t3, auth: "", host: "", search: "", hash: "" };
      }
      if (!hasProtocol(e2, { acceptRelative: true }))
        return parsePath(e2);
      const [, s2 = "", a2, c2 = ""] = e2.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
      let [, p2 = "", u2 = ""] = c2.match(/([^#/?]*)(.*)?/) || [];
      "file:" === s2 && (u2 = u2.replace(/\/(?=[A-Za-z]:)/, ""));
      const { pathname: d2, search: f2, hash: m2 } = parsePath(u2);
      return { protocol: s2.toLowerCase(), auth: a2 ? a2.slice(0, Math.max(0, a2.length - 1)) : "", host: p2, pathname: d2, search: f2, hash: m2, [bn]: !s2 };
    }
    __name(parseURL, "parseURL");
    function parsePath(e2 = "") {
      const [t2 = "", r2 = "", s2 = ""] = (e2.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
      return { pathname: t2, search: r2, hash: s2 };
    }
    __name(parsePath, "parsePath");
    function stringifyParsedURL(e2) {
      const t2 = e2.pathname || "", r2 = e2.search ? (e2.search.startsWith("?") ? "" : "?") + e2.search : "", s2 = e2.hash || "", a2 = e2.auth ? e2.auth + "@" : "", c2 = e2.host || "";
      return (e2.protocol || e2[bn] ? (e2.protocol || "") + "//" : "") + a2 + c2 + t2 + r2 + s2;
    }
    __name(stringifyParsedURL, "stringifyParsedURL");
    const xn = 0, _n = 1, En = 2;
    function createRouter$1(e2 = {}) {
      const t2 = { options: e2, rootNode: createRadixNode(), staticRoutesMap: {} }, normalizeTrailingSlash = /* @__PURE__ */ __name((t3) => e2.strictTrailingSlash ? t3 : t3.replace(/\/$/, "") || "/", "normalizeTrailingSlash");
      if (e2.routes)
        for (const r2 in e2.routes)
          insert(t2, normalizeTrailingSlash(r2), e2.routes[r2]);
      return { ctx: t2, lookup: (e3) => function(e4, t3) {
        const r2 = e4.staticRoutesMap[t3];
        if (r2)
          return r2.data;
        const s2 = t3.split("/"), a2 = {};
        let c2 = false, p2 = null, u2 = e4.rootNode, d2 = null;
        for (let e5 = 0; e5 < s2.length; e5++) {
          const t4 = s2[e5];
          null !== u2.wildcardChildNode && (p2 = u2.wildcardChildNode, d2 = s2.slice(e5).join("/"));
          const r3 = u2.children.get(t4);
          if (void 0 === r3) {
            if (u2 && u2.placeholderChildren.length > 1) {
              const t5 = s2.length - e5;
              u2 = u2.placeholderChildren.find((e6) => e6.maxDepth === t5) || null;
            } else
              u2 = u2.placeholderChildren[0] || null;
            if (!u2)
              break;
            u2.paramName && (a2[u2.paramName] = t4), c2 = true;
          } else
            u2 = r3;
        }
        null !== u2 && null !== u2.data || null === p2 || (u2 = p2, a2[u2.paramName || "_"] = d2, c2 = true);
        if (!u2)
          return null;
        if (c2)
          return { ...u2.data, params: c2 ? a2 : void 0 };
        return u2.data;
      }(t2, normalizeTrailingSlash(e3)), insert: (e3, r2) => insert(t2, normalizeTrailingSlash(e3), r2), remove: (e3) => function(e4, t3) {
        let r2 = false;
        const s2 = t3.split("/");
        let a2 = e4.rootNode;
        for (const e5 of s2)
          if (a2 = a2.children.get(e5), !a2)
            return r2;
        if (a2.data) {
          const e5 = s2.at(-1) || "";
          a2.data = null, 0 === Object.keys(a2.children).length && a2.parent && (a2.parent.children.delete(e5), a2.parent.wildcardChildNode = null, a2.parent.placeholderChildren = []), r2 = true;
        }
        return r2;
      }(t2, normalizeTrailingSlash(e3)) };
    }
    __name(createRouter$1, "createRouter$1");
    function insert(e2, t2, r2) {
      let s2 = true;
      const a2 = t2.split("/");
      let c2 = e2.rootNode, p2 = 0;
      const u2 = [c2];
      for (const e3 of a2) {
        let t3;
        if (t3 = c2.children.get(e3))
          c2 = t3;
        else {
          const r3 = getNodeType(e3);
          t3 = createRadixNode({ type: r3, parent: c2 }), c2.children.set(e3, t3), r3 === En ? (t3.paramName = "*" === e3 ? "_" + p2++ : e3.slice(1), c2.placeholderChildren.push(t3), s2 = false) : r3 === _n && (c2.wildcardChildNode = t3, t3.paramName = e3.slice(3) || "_", s2 = false), u2.push(t3), c2 = t3;
        }
      }
      for (const [e3, t3] of u2.entries())
        t3.maxDepth = Math.max(u2.length - e3, t3.maxDepth || 0);
      return c2.data = r2, true === s2 && (e2.staticRoutesMap[t2] = c2), c2;
    }
    __name(insert, "insert");
    function createRadixNode(e2 = {}) {
      return { type: e2.type || xn, maxDepth: 0, parent: e2.parent || null, children: /* @__PURE__ */ new Map(), data: e2.data || null, paramName: e2.paramName || null, wildcardChildNode: null, placeholderChildren: [] };
    }
    __name(createRadixNode, "createRadixNode");
    function getNodeType(e2) {
      return e2.startsWith("**") ? _n : ":" === e2[0] || "*" === e2 ? En : xn;
    }
    __name(getNodeType, "getNodeType");
    function toRouteMatcher(e2) {
      return function(e3, t2) {
        return { ctx: { table: e3 }, matchAll: (r2) => _matchRoutes(r2, e3, t2) };
      }(_routerNodeToTable("", e2.ctx.rootNode), e2.ctx.options.strictTrailingSlash);
    }
    __name(toRouteMatcher, "toRouteMatcher");
    function _matchRoutes(e2, t2, r2) {
      true !== r2 && e2.endsWith("/") && (e2 = e2.slice(0, -1) || "/");
      const s2 = [];
      for (const [r3, a3] of _sortRoutesMap(t2.wildcard))
        (e2 === r3 || e2.startsWith(r3 + "/")) && s2.push(a3);
      for (const [r3, a3] of _sortRoutesMap(t2.dynamic))
        if (e2.startsWith(r3 + "/")) {
          const t3 = "/" + e2.slice(r3.length).split("/").splice(2).join("/");
          s2.push(..._matchRoutes(t3, a3));
        }
      const a2 = t2.static.get(e2);
      return a2 && s2.push(a2), s2.filter(Boolean);
    }
    __name(_matchRoutes, "_matchRoutes");
    function _sortRoutesMap(e2) {
      return [...e2.entries()].sort((e3, t2) => e3[0].length - t2[0].length);
    }
    __name(_sortRoutesMap, "_sortRoutesMap");
    function _routerNodeToTable(e2, t2) {
      const r2 = { static: /* @__PURE__ */ new Map(), wildcard: /* @__PURE__ */ new Map(), dynamic: /* @__PURE__ */ new Map() };
      return (/* @__PURE__ */ __name(function _addNode(e3, t3) {
        if (e3)
          if (t3.type !== xn || e3.includes("*") || e3.includes(":")) {
            if (t3.type === _n)
              r2.wildcard.set(e3.replace("/**", ""), t3.data);
            else if (t3.type === En) {
              const s2 = _routerNodeToTable("", t3);
              return t3.data && s2.static.set("/", t3.data), void r2.dynamic.set(e3.replace(/\/\*|\/:\w+/, ""), s2);
            }
          } else
            t3.data && r2.static.set(e3, t3.data);
        for (const [r3, s2] of t3.children.entries())
          _addNode(`${e3}/${r3}`.replace("//", "/"), s2);
      }, "_addNode"))(e2, t2), r2;
    }
    __name(_routerNodeToTable, "_routerNodeToTable");
    function isPlainObject$1(e2) {
      if (null === e2 || "object" != typeof e2)
        return false;
      const t2 = Object.getPrototypeOf(e2);
      return (null === t2 || t2 === Object.prototype || null === Object.getPrototypeOf(t2)) && (!(Symbol.iterator in e2) && (!(Symbol.toStringTag in e2) || "[object Module]" === Object.prototype.toString.call(e2)));
    }
    __name(isPlainObject$1, "isPlainObject$1");
    function _defu(e2, t2, r2 = ".", s2) {
      if (!isPlainObject$1(t2))
        return _defu(e2, {}, r2, s2);
      const a2 = Object.assign({}, t2);
      for (const t3 in e2) {
        if ("__proto__" === t3 || "constructor" === t3)
          continue;
        const c2 = e2[t3];
        null != c2 && (s2 && s2(a2, t3, c2, r2) || (Array.isArray(c2) && Array.isArray(a2[t3]) ? a2[t3] = [...c2, ...a2[t3]] : isPlainObject$1(c2) && isPlainObject$1(a2[t3]) ? a2[t3] = _defu(c2, a2[t3], (r2 ? `${r2}.` : "") + t3.toString(), s2) : a2[t3] = c2));
      }
      return a2;
    }
    __name(_defu, "_defu");
    function createDefu(e2) {
      return (...t2) => t2.reduce((t3, r2) => _defu(t3, r2, "", e2), {});
    }
    __name(createDefu, "createDefu");
    const wn = createDefu(), Sn = createDefu((e2, t2, r2) => {
      if (void 0 !== e2[t2] && "function" == typeof r2)
        return e2[t2] = r2(e2[t2]), true;
    });
    function o(e2) {
      throw new Error(`${e2} is not implemented yet!`);
    }
    __name(o, "o");
    let Tn = /* @__PURE__ */ __name(class i extends _EventEmitter {
      __unenv__ = {};
      readableEncoding = null;
      readableEnded = true;
      readableFlowing = false;
      readableHighWaterMark = 0;
      readableLength = 0;
      readableObjectMode = false;
      readableAborted = false;
      readableDidRead = false;
      closed = false;
      errored = null;
      readable = false;
      destroyed = false;
      static from(e2, t2) {
        return new i(t2);
      }
      constructor(e2) {
        super();
      }
      _read(e2) {
      }
      read(e2) {
      }
      setEncoding(e2) {
        return this;
      }
      pause() {
        return this;
      }
      resume() {
        return this;
      }
      isPaused() {
        return true;
      }
      unpipe(e2) {
        return this;
      }
      unshift(e2, t2) {
      }
      wrap(e2) {
        return this;
      }
      push(e2, t2) {
        return false;
      }
      _destroy(e2, t2) {
        this.removeAllListeners();
      }
      destroy(e2) {
        return this.destroyed = true, this._destroy(e2), this;
      }
      pipe(e2, t2) {
        return {};
      }
      compose(e2, t2) {
        throw new Error("Method not implemented.");
      }
      [Symbol.asyncDispose]() {
        return this.destroy(), Promise.resolve();
      }
      async *[Symbol.asyncIterator]() {
        throw o("Readable.asyncIterator");
      }
      iterator(e2) {
        throw o("Readable.iterator");
      }
      map(e2, t2) {
        throw o("Readable.map");
      }
      filter(e2, t2) {
        throw o("Readable.filter");
      }
      forEach(e2, t2) {
        throw o("Readable.forEach");
      }
      reduce(e2, t2, r2) {
        throw o("Readable.reduce");
      }
      find(e2, t2) {
        throw o("Readable.find");
      }
      findIndex(e2, t2) {
        throw o("Readable.findIndex");
      }
      some(e2, t2) {
        throw o("Readable.some");
      }
      toArray(e2) {
        throw o("Readable.toArray");
      }
      every(e2, t2) {
        throw o("Readable.every");
      }
      flatMap(e2, t2) {
        throw o("Readable.flatMap");
      }
      drop(e2, t2) {
        throw o("Readable.drop");
      }
      take(e2, t2) {
        throw o("Readable.take");
      }
      asIndexedPairs(e2) {
        throw o("Readable.asIndexedPairs");
      }
    }, "i"), Cn = /* @__PURE__ */ __name(class extends _EventEmitter {
      __unenv__ = {};
      writable = true;
      writableEnded = false;
      writableFinished = false;
      writableHighWaterMark = 0;
      writableLength = 0;
      writableObjectMode = false;
      writableCorked = 0;
      closed = false;
      errored = null;
      writableNeedDrain = false;
      writableAborted = false;
      destroyed = false;
      _data;
      _encoding = "utf8";
      constructor(e2) {
        super();
      }
      pipe(e2, t2) {
        return {};
      }
      _write(e2, t2, r2) {
        if (this.writableEnded)
          r2 && r2();
        else {
          if (void 0 === this._data)
            this._data = e2;
          else {
            const r3 = "string" == typeof this._data ? m.from(this._data, this._encoding || t2 || "utf8") : this._data, s2 = "string" == typeof e2 ? m.from(e2, t2 || this._encoding || "utf8") : e2;
            this._data = m.concat([r3, s2]);
          }
          this._encoding = t2, r2 && r2();
        }
      }
      _writev(e2, t2) {
      }
      _destroy(e2, t2) {
      }
      _final(e2) {
      }
      write(e2, t2, r2) {
        const s2 = "string" == typeof t2 ? this._encoding : "utf8", a2 = "function" == typeof t2 ? t2 : "function" == typeof r2 ? r2 : void 0;
        return this._write(e2, s2, a2), true;
      }
      setDefaultEncoding(e2) {
        return this;
      }
      end(e2, t2, r2) {
        const s2 = "function" == typeof e2 ? e2 : "function" == typeof t2 ? t2 : "function" == typeof r2 ? r2 : void 0;
        if (this.writableEnded)
          return s2 && s2(), this;
        const a2 = e2 === s2 ? void 0 : e2;
        if (a2) {
          const e3 = t2 === s2 ? void 0 : t2;
          this.write(a2, e3, s2);
        }
        return this.writableEnded = true, this.writableFinished = true, this.emit("close"), this.emit("finish"), this;
      }
      cork() {
      }
      uncork() {
      }
      destroy(e2) {
        return this.destroyed = true, delete this._data, this.removeAllListeners(), this;
      }
      compose(e2, t2) {
        throw new Error("Method not implemented.");
      }
    }, "Cn");
    const kn = /* @__PURE__ */ __name(class {
      allowHalfOpen = true;
      _destroy;
      constructor(e2 = new Tn(), t2 = new Cn()) {
        Object.assign(this, e2), Object.assign(this, t2), this._destroy = function(...e3) {
          return function(...t3) {
            for (const r2 of e3)
              r2(...t3);
          };
        }(e2._destroy, t2._destroy);
      }
    }, "kn");
    const Rn = (Object.assign(kn.prototype, Tn.prototype), Object.assign(kn.prototype, Cn.prototype), kn);
    class A extends Rn {
      __unenv__ = {};
      bufferSize = 0;
      bytesRead = 0;
      bytesWritten = 0;
      connecting = false;
      destroyed = false;
      pending = false;
      localAddress = "";
      localPort = 0;
      remoteAddress = "";
      remoteFamily = "";
      remotePort = 0;
      autoSelectFamilyAttemptedAddresses = [];
      readyState = "readOnly";
      constructor(e2) {
        super();
      }
      write(e2, t2, r2) {
        return false;
      }
      connect(e2, t2, r2) {
        return this;
      }
      end(e2, t2, r2) {
        return this;
      }
      setEncoding(e2) {
        return this;
      }
      pause() {
        return this;
      }
      resume() {
        return this;
      }
      setTimeout(e2, t2) {
        return this;
      }
      setNoDelay(e2) {
        return this;
      }
      setKeepAlive(e2, t2) {
        return this;
      }
      address() {
        return {};
      }
      unref() {
        return this;
      }
      ref() {
        return this;
      }
      destroySoon() {
        this.destroy();
      }
      resetAndDestroy() {
        const e2 = new Error("ERR_SOCKET_CLOSED");
        return e2.code = "ERR_SOCKET_CLOSED", this.destroy(e2), this;
      }
    }
    __name(A, "A");
    class y extends Tn {
      aborted = false;
      httpVersion = "1.1";
      httpVersionMajor = 1;
      httpVersionMinor = 1;
      complete = true;
      connection;
      socket;
      headers = {};
      trailers = {};
      method = "GET";
      url = "/";
      statusCode = 200;
      statusMessage = "";
      closed = false;
      errored = null;
      readable = false;
      constructor(e2) {
        super(), this.socket = this.connection = e2 || new A();
      }
      get rawHeaders() {
        const e2 = this.headers, t2 = [];
        for (const r2 in e2)
          if (Array.isArray(e2[r2]))
            for (const s2 of e2[r2])
              t2.push(r2, s2);
          else
            t2.push(r2, e2[r2]);
        return t2;
      }
      get rawTrailers() {
        return [];
      }
      setTimeout(e2, t2) {
        return this;
      }
      get headersDistinct() {
        return p$1(this.headers);
      }
      get trailersDistinct() {
        return p$1(this.trailers);
      }
    }
    __name(y, "y");
    function p$1(e2) {
      const t2 = {};
      for (const [r2, s2] of Object.entries(e2))
        r2 && (t2[r2] = (Array.isArray(s2) ? s2 : [s2]).filter(Boolean));
      return t2;
    }
    __name(p$1, "p$1");
    class w extends Cn {
      statusCode = 200;
      statusMessage = "";
      upgrading = false;
      chunkedEncoding = false;
      shouldKeepAlive = false;
      useChunkedEncodingByDefault = false;
      sendDate = false;
      finished = false;
      headersSent = false;
      strictContentLength = false;
      connection = null;
      socket = null;
      req;
      _headers = {};
      constructor(e2) {
        super(), this.req = e2;
      }
      assignSocket(e2) {
        e2._httpMessage = this, this.socket = e2, this.connection = e2, this.emit("socket", e2), this._flush();
      }
      _flush() {
        this.flushHeaders();
      }
      detachSocket(e2) {
      }
      writeContinue(e2) {
      }
      writeHead(e2, t2, r2) {
        e2 && (this.statusCode = e2), "string" == typeof t2 && (this.statusMessage = t2, t2 = void 0);
        const s2 = r2 || t2;
        if (s2 && !Array.isArray(s2))
          for (const e3 in s2)
            this.setHeader(e3, s2[e3]);
        return this.headersSent = true, this;
      }
      writeProcessing() {
      }
      setTimeout(e2, t2) {
        return this;
      }
      appendHeader(e2, t2) {
        e2 = e2.toLowerCase();
        const r2 = this._headers[e2], s2 = [...Array.isArray(r2) ? r2 : [r2], ...Array.isArray(t2) ? t2 : [t2]].filter(Boolean);
        return this._headers[e2] = s2.length > 1 ? s2 : s2[0], this;
      }
      setHeader(e2, t2) {
        return this._headers[e2.toLowerCase()] = t2, this;
      }
      setHeaders(e2) {
        for (const [t2, r2] of Object.entries(e2))
          this.setHeader(t2, r2);
        return this;
      }
      getHeader(e2) {
        return this._headers[e2.toLowerCase()];
      }
      getHeaders() {
        return this._headers;
      }
      getHeaderNames() {
        return Object.keys(this._headers);
      }
      hasHeader(e2) {
        return e2.toLowerCase() in this._headers;
      }
      removeHeader(e2) {
        delete this._headers[e2.toLowerCase()];
      }
      addTrailers(e2) {
      }
      flushHeaders() {
      }
      writeEarlyHints(e2, t2) {
        "function" == typeof t2 && t2();
      }
    }
    __name(w, "w");
    const An = (() => {
      const n = /* @__PURE__ */ __name(function() {
      }, "n");
      return n.prototype = /* @__PURE__ */ Object.create(null), n;
    })();
    function v(e2 = {}) {
      if (e2 instanceof Headers)
        return e2;
      const t2 = new Headers();
      for (const [r2, s2] of Object.entries(e2))
        if (void 0 !== s2) {
          if (Array.isArray(s2)) {
            for (const e3 of s2)
              t2.append(r2, String(e3));
            continue;
          }
          t2.set(r2, String(s2));
        }
      return t2;
    }
    __name(v, "v");
    const Nn = /* @__PURE__ */ new Set([101, 204, 205, 304]);
    async function b(e2, t2) {
      const r2 = new y(), s2 = new w(r2);
      let a2;
      if (r2.url = t2.url?.toString() || "/", !r2.url.startsWith("/")) {
        const e3 = new URL(r2.url);
        a2 = e3.host, r2.url = e3.pathname + e3.search + e3.hash;
      }
      r2.method = t2.method || "GET", r2.headers = function(e3 = {}) {
        const t3 = new An(), r3 = Array.isArray(e3) || function(e4) {
          return "function" == typeof e4?.entries;
        }(e3) ? e3 : Object.entries(e3);
        for (const [e4, s3] of r3)
          if (s3) {
            if (void 0 === t3[e4]) {
              t3[e4] = s3;
              continue;
            }
            t3[e4] = [...Array.isArray(t3[e4]) ? t3[e4] : [t3[e4]], ...Array.isArray(s3) ? s3 : [s3]];
          }
        return t3;
      }(t2.headers || {}), r2.headers.host || (r2.headers.host = t2.host || a2 || "localhost"), r2.connection.encrypted = r2.connection.encrypted || "https" === t2.protocol, r2.body = t2.body || null, r2.__unenv__ = t2.context, await e2(r2, s2);
      let c2 = s2._data;
      (Nn.has(s2.statusCode) || "HEAD" === r2.method.toUpperCase()) && (c2 = null, delete s2._headers["content-length"]);
      const p2 = { status: s2.statusCode, statusText: s2.statusMessage, headers: s2._headers, body: c2 };
      return r2.destroy(), s2.destroy(), p2;
    }
    __name(b, "b");
    function hasProp$1(e2, t2) {
      try {
        return t2 in e2;
      } catch {
        return false;
      }
    }
    __name(hasProp$1, "hasProp$1");
    class H3Error extends Error {
      static __h3_error__ = true;
      statusCode = 500;
      fatal = false;
      unhandled = false;
      statusMessage;
      data;
      cause;
      constructor(e2, t2 = {}) {
        super(e2, t2), t2.cause && !this.cause && (this.cause = t2.cause);
      }
      toJSON() {
        const e2 = { message: this.message, statusCode: sanitizeStatusCode(this.statusCode, 500) };
        return this.statusMessage && (e2.statusMessage = sanitizeStatusMessage(this.statusMessage)), void 0 !== this.data && (e2.data = this.data), e2;
      }
    }
    __name(H3Error, "H3Error");
    function createError$1(e2) {
      if ("string" == typeof e2)
        return new H3Error(e2);
      if (isError(e2))
        return e2;
      const t2 = new H3Error(e2.message ?? e2.statusMessage ?? "", { cause: e2.cause || e2 });
      if (hasProp$1(e2, "stack"))
        try {
          Object.defineProperty(t2, "stack", { get: () => e2.stack });
        } catch {
          try {
            t2.stack = e2.stack;
          } catch {
          }
        }
      if (e2.data && (t2.data = e2.data), e2.statusCode ? t2.statusCode = sanitizeStatusCode(e2.statusCode, t2.statusCode) : e2.status && (t2.statusCode = sanitizeStatusCode(e2.status, t2.statusCode)), e2.statusMessage ? t2.statusMessage = e2.statusMessage : e2.statusText && (t2.statusMessage = e2.statusText), t2.statusMessage) {
        const e3 = t2.statusMessage;
        sanitizeStatusMessage(t2.statusMessage) !== e3 && console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.");
      }
      return void 0 !== e2.fatal && (t2.fatal = e2.fatal), void 0 !== e2.unhandled && (t2.unhandled = e2.unhandled), t2;
    }
    __name(createError$1, "createError$1");
    function isError(e2) {
      return true === e2?.constructor?.__h3_error__;
    }
    __name(isError, "isError");
    function getRequestHeaders(e2) {
      const t2 = {};
      for (const r2 in e2.node.req.headers) {
        const s2 = e2.node.req.headers[r2];
        t2[r2] = Array.isArray(s2) ? s2.filter(Boolean).join(", ") : s2;
      }
      return t2;
    }
    __name(getRequestHeaders, "getRequestHeaders");
    const On = Symbol.for("h3RawBody"), In = ["PATCH", "POST", "PUT", "DELETE"];
    function readRawBody(e2, t2 = "utf8") {
      !function(e3, t3) {
        if (!function(e4, t4) {
          if ("string" == typeof t4) {
            if (e4.method === t4)
              return true;
          } else if (t4.includes(e4.method))
            return true;
          return false;
        }(e3, t3))
          throw createError$1({ statusCode: 405, statusMessage: "HTTP method is not allowed." });
      }(e2, In);
      const r2 = e2._requestBody || e2.web?.request?.body || e2.node.req[On] || e2.node.req.rawBody || e2.node.req.body;
      if (r2) {
        const e3 = Promise.resolve(r2).then((e4) => m.isBuffer(e4) ? e4 : "function" == typeof e4.pipeTo ? new Promise((t3, r3) => {
          const s3 = [];
          e4.pipeTo(new WritableStream({ write(e5) {
            s3.push(e5);
          }, close() {
            t3(m.concat(s3));
          }, abort(e5) {
            r3(e5);
          } })).catch(r3);
        }) : "function" == typeof e4.pipe ? new Promise((t3, r3) => {
          const s3 = [];
          e4.on("data", (e5) => {
            s3.push(e5);
          }).on("end", () => {
            t3(m.concat(s3));
          }).on("error", r3);
        }) : e4.constructor === Object ? m.from(JSON.stringify(e4)) : e4 instanceof URLSearchParams ? m.from(e4.toString()) : e4 instanceof FormData ? new Response(e4).bytes().then((e5) => m.from(e5)) : m.from(e4));
        return t2 ? e3.then((e4) => e4.toString(t2)) : e3;
      }
      if (!Number.parseInt(e2.node.req.headers["content-length"] || "") && !String(e2.node.req.headers["transfer-encoding"] ?? "").split(",").map((e3) => e3.trim()).filter(Boolean).includes("chunked"))
        return Promise.resolve(void 0);
      const s2 = e2.node.req[On] = new Promise((t3, r3) => {
        const s3 = [];
        e2.node.req.on("error", (e3) => {
          r3(e3);
        }).on("data", (e3) => {
          s3.push(e3);
        }).on("end", () => {
          t3(m.concat(s3));
        });
      });
      return t2 ? s2.then((e3) => e3.toString(t2)) : s2;
    }
    __name(readRawBody, "readRawBody");
    function handleCacheHeaders(e2, t2) {
      const r2 = ["public", ...t2.cacheControls || []];
      let s2 = false;
      if (void 0 !== t2.maxAge && r2.push("max-age=" + +t2.maxAge, "s-maxage=" + +t2.maxAge), t2.modifiedTime) {
        const r3 = new Date(t2.modifiedTime), a2 = e2.node.req.headers["if-modified-since"];
        e2.node.res.setHeader("last-modified", r3.toUTCString()), a2 && new Date(a2) >= r3 && (s2 = true);
      }
      if (t2.etag) {
        e2.node.res.setHeader("etag", t2.etag);
        e2.node.req.headers["if-none-match"] === t2.etag && (s2 = true);
      }
      return e2.node.res.setHeader("cache-control", r2.join(", ")), !!s2 && (e2.node.res.statusCode = 304, e2.handled || e2.node.res.end(), true);
    }
    __name(handleCacheHeaders, "handleCacheHeaders");
    const Pn = { html: "text/html", json: "application/json" }, Ln = /[^\u0009\u0020-\u007E]/g;
    function sanitizeStatusMessage(e2 = "") {
      return e2.replace(Ln, "");
    }
    __name(sanitizeStatusMessage, "sanitizeStatusMessage");
    function sanitizeStatusCode(e2, t2 = 200) {
      return e2 ? ("string" == typeof e2 && (e2 = Number.parseInt(e2, 10)), e2 < 100 || e2 > 999 ? t2 : e2) : t2;
    }
    __name(sanitizeStatusCode, "sanitizeStatusCode");
    function splitCookiesString(e2) {
      if (Array.isArray(e2))
        return e2.flatMap((e3) => splitCookiesString(e3));
      if ("string" != typeof e2)
        return [];
      const t2 = [];
      let r2, s2, a2, c2, p2, u2 = 0;
      const skipWhitespace = /* @__PURE__ */ __name(() => {
        for (; u2 < e2.length && /\s/.test(e2.charAt(u2)); )
          u2 += 1;
        return u2 < e2.length;
      }, "skipWhitespace"), notSpecialChar = /* @__PURE__ */ __name(() => (s2 = e2.charAt(u2), "=" !== s2 && ";" !== s2 && "," !== s2), "notSpecialChar");
      for (; u2 < e2.length; ) {
        for (r2 = u2, p2 = false; skipWhitespace(); )
          if (s2 = e2.charAt(u2), "," === s2) {
            for (a2 = u2, u2 += 1, skipWhitespace(), c2 = u2; u2 < e2.length && notSpecialChar(); )
              u2 += 1;
            u2 < e2.length && "=" === e2.charAt(u2) ? (p2 = true, u2 = c2, t2.push(e2.slice(r2, a2)), r2 = u2) : u2 = a2 + 1;
          } else
            u2 += 1;
        (!p2 || u2 >= e2.length) && t2.push(e2.slice(r2));
      }
      return t2;
    }
    __name(splitCookiesString, "splitCookiesString");
    const Mn = void 0 === Qt ? (e2) => e2() : Qt;
    function send(e2, t2, r2) {
      return r2 && function(e3, t3) {
        t3 && 304 !== e3.node.res.statusCode && !e3.node.res.getHeader("content-type") && e3.node.res.setHeader("content-type", t3);
      }(e2, r2), new Promise((r3) => {
        Mn(() => {
          e2.handled || e2.node.res.end(t2), r3();
        });
      });
    }
    __name(send, "send");
    function setResponseStatus(e2, t2, r2) {
      t2 && (e2.node.res.statusCode = sanitizeStatusCode(t2, e2.node.res.statusCode)), r2 && (e2.node.res.statusMessage = sanitizeStatusMessage(r2));
    }
    __name(setResponseStatus, "setResponseStatus");
    function getResponseStatus(e2) {
      return e2.node.res.statusCode;
    }
    __name(getResponseStatus, "getResponseStatus");
    function getResponseStatusText(e2) {
      return e2.node.res.statusMessage;
    }
    __name(getResponseStatusText, "getResponseStatusText");
    function setResponseHeaders(e2, t2) {
      for (const [r2, s2] of Object.entries(t2))
        e2.node.res.setHeader(r2, s2);
    }
    __name(setResponseHeaders, "setResponseHeaders");
    const $n = setResponseHeaders;
    function setResponseHeader(e2, t2, r2) {
      e2.node.res.setHeader(t2, r2);
    }
    __name(setResponseHeader, "setResponseHeader");
    function appendResponseHeader(e2, t2, r2) {
      let s2 = e2.node.res.getHeader(t2);
      s2 ? (Array.isArray(s2) || (s2 = [s2.toString()]), e2.node.res.setHeader(t2, [...s2, r2])) : e2.node.res.setHeader(t2, r2);
    }
    __name(appendResponseHeader, "appendResponseHeader");
    function sendStream(e2, t2) {
      if (!t2 || "object" != typeof t2)
        throw new Error("[h3] Invalid stream provided.");
      if (e2.node.res._data = t2, !e2.node.res.socket)
        return e2._handled = true, Promise.resolve();
      if (hasProp$1(t2, "pipeTo") && "function" == typeof t2.pipeTo)
        return t2.pipeTo(new WritableStream({ write(t3) {
          e2.node.res.write(t3);
        } })).then(() => {
          e2.node.res.end();
        });
      if (hasProp$1(t2, "pipe") && "function" == typeof t2.pipe)
        return new Promise((r2, s2) => {
          t2.pipe(e2.node.res), t2.on && (t2.on("end", () => {
            e2.node.res.end(), r2();
          }), t2.on("error", (e3) => {
            s2(e3);
          })), e2.node.res.on("close", () => {
            t2.abort && t2.abort();
          });
        });
      throw new Error("[h3] Invalid or incompatible stream provided.");
    }
    __name(sendStream, "sendStream");
    function sendWebResponse(e2, t2) {
      for (const [r2, s2] of t2.headers)
        "set-cookie" === r2 ? e2.node.res.appendHeader(r2, splitCookiesString(s2)) : e2.node.res.setHeader(r2, s2);
      if (t2.status && (e2.node.res.statusCode = sanitizeStatusCode(t2.status, e2.node.res.statusCode)), t2.statusText && (e2.node.res.statusMessage = sanitizeStatusMessage(t2.statusText)), t2.redirected && e2.node.res.setHeader("location", t2.url), t2.body)
        return sendStream(e2, t2.body);
      e2.node.res.end();
    }
    __name(sendWebResponse, "sendWebResponse");
    const Bn = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]), jn = /* @__PURE__ */ new Set(["transfer-encoding", "accept-encoding", "connection", "keep-alive", "upgrade", "expect", "host", "accept"]);
    async function proxyRequest(e2, t2, r2 = {}) {
      let s2, a2;
      Bn.has(e2.method) && (r2.streamRequest ? (s2 = function(e3) {
        if (!In.includes(e3.method))
          return;
        const t3 = e3.web?.request?.body || e3._requestBody;
        return t3 || (On in e3.node.req || "rawBody" in e3.node.req || "body" in e3.node.req || "__unenv__" in e3.node.req ? new ReadableStream({ async start(t4) {
          const r3 = await readRawBody(e3, false);
          r3 && t4.enqueue(r3), t4.close();
        } }) : new ReadableStream({ start: (t4) => {
          e3.node.req.on("data", (e4) => {
            t4.enqueue(e4);
          }), e3.node.req.on("end", () => {
            t4.close();
          }), e3.node.req.on("error", (e4) => {
            t4.error(e4);
          });
        } }));
      }(e2), a2 = "half") : s2 = await readRawBody(e2, false).catch(() => {
      }));
      const c2 = r2.fetchOptions?.method || e2.method, p2 = function(e3, ...t3) {
        const r3 = t3.filter(Boolean);
        if (0 === r3.length)
          return e3;
        const s3 = new Headers(e3);
        for (const e4 of r3) {
          const t4 = Array.isArray(e4) ? e4 : "function" == typeof e4.entries ? e4.entries() : Object.entries(e4);
          for (const [e5, r4] of t4)
            void 0 !== r4 && s3.set(e5, r4);
        }
        return s3;
      }(getProxyRequestHeaders(e2, { host: t2.startsWith("/") }), r2.fetchOptions?.headers, r2.headers);
      return async function(e3, t3, r3 = {}) {
        let s3;
        try {
          s3 = await _getFetch(r3.fetch)(t3, { headers: r3.headers, ignoreResponseError: true, ...r3.fetchOptions });
        } catch (e4) {
          throw createError$1({ status: 502, statusMessage: "Bad Gateway", cause: e4 });
        }
        e3.node.res.statusCode = sanitizeStatusCode(s3.status, e3.node.res.statusCode), e3.node.res.statusMessage = sanitizeStatusMessage(s3.statusText);
        const a3 = [];
        for (const [t4, r4] of s3.headers.entries())
          "content-encoding" !== t4 && "content-length" !== t4 && ("set-cookie" !== t4 ? e3.node.res.setHeader(t4, r4) : a3.push(...splitCookiesString(r4)));
        a3.length > 0 && e3.node.res.setHeader("set-cookie", a3.map((e4) => (r3.cookieDomainRewrite && (e4 = rewriteCookieProperty(e4, r3.cookieDomainRewrite, "domain")), r3.cookiePathRewrite && (e4 = rewriteCookieProperty(e4, r3.cookiePathRewrite, "path")), e4)));
        r3.onResponse && await r3.onResponse(e3, s3);
        if (void 0 !== s3._data)
          return s3._data;
        if (e3.handled)
          return;
        if (false === r3.sendStream) {
          const t4 = new Uint8Array(await s3.arrayBuffer());
          return e3.node.res.end(t4);
        }
        if (s3.body)
          for await (const t4 of s3.body)
            e3.node.res.write(t4);
        return e3.node.res.end();
      }(e2, t2, { ...r2, fetchOptions: { method: c2, body: s2, duplex: a2, ...r2.fetchOptions, headers: p2 } });
    }
    __name(proxyRequest, "proxyRequest");
    function getProxyRequestHeaders(e2, t2) {
      const r2 = /* @__PURE__ */ Object.create(null), s2 = getRequestHeaders(e2);
      for (const e3 in s2)
        (!jn.has(e3) || "host" === e3 && t2?.host) && (r2[e3] = s2[e3]);
      return r2;
    }
    __name(getProxyRequestHeaders, "getProxyRequestHeaders");
    function fetchWithEvent(e2, t2, r2, s2) {
      return _getFetch(s2?.fetch)(t2, { ...r2, context: r2?.context || e2.context, headers: { ...getProxyRequestHeaders(e2, { host: "string" == typeof t2 && t2.startsWith("/") }), ...r2?.headers } });
    }
    __name(fetchWithEvent, "fetchWithEvent");
    function _getFetch(e2) {
      if (e2)
        return e2;
      if (globalThis.fetch)
        return globalThis.fetch;
      throw new Error("fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js.");
    }
    __name(_getFetch, "_getFetch");
    function rewriteCookieProperty(e2, t2, r2) {
      const s2 = "string" == typeof t2 ? { "*": t2 } : t2;
      return e2.replace(new RegExp(`(;\\s*${r2}=)([^;]+)`, "gi"), (e3, t3, r3) => {
        let a2;
        if (r3 in s2)
          a2 = s2[r3];
        else {
          if (!("*" in s2))
            return e3;
          a2 = s2["*"];
        }
        return a2 ? t3 + a2 : "";
      });
    }
    __name(rewriteCookieProperty, "rewriteCookieProperty");
    class H3Event {
      __is_event__ = true;
      node;
      web;
      context = {};
      _method;
      _path;
      _headers;
      _requestBody;
      _handled = false;
      _onBeforeResponseCalled;
      _onAfterResponseCalled;
      constructor(e2, t2) {
        this.node = { req: e2, res: t2 };
      }
      get method() {
        return this._method || (this._method = (this.node.req.method || "GET").toUpperCase()), this._method;
      }
      get path() {
        return this._path || this.node.req.url || "/";
      }
      get headers() {
        return this._headers || (this._headers = function(e2) {
          const t2 = new Headers();
          for (const [r2, s2] of Object.entries(e2))
            if (Array.isArray(s2))
              for (const e3 of s2)
                t2.append(r2, e3);
            else
              s2 && t2.set(r2, s2);
          return t2;
        }(this.node.req.headers)), this._headers;
      }
      get handled() {
        return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
      }
      respondWith(e2) {
        return Promise.resolve(e2).then((e3) => sendWebResponse(this, e3));
      }
      toString() {
        return `[${this.method}] ${this.path}`;
      }
      toJSON() {
        return this.toString();
      }
      get req() {
        return this.node.req;
      }
      get res() {
        return this.node.res;
      }
    }
    __name(H3Event, "H3Event");
    function isEvent(e2) {
      return hasProp$1(e2, "__is_event__");
    }
    __name(isEvent, "isEvent");
    function createEvent(e2, t2) {
      return new H3Event(e2, t2);
    }
    __name(createEvent, "createEvent");
    function defineEventHandler(e2) {
      if ("function" == typeof e2)
        return e2.__is_handler__ = true, e2;
      const t2 = { onRequest: _normalizeArray(e2.onRequest), onBeforeResponse: _normalizeArray(e2.onBeforeResponse) }, _handler = /* @__PURE__ */ __name((r2) => async function(e3, t3, r3) {
        if (r3.onRequest) {
          for (const t4 of r3.onRequest)
            if (await t4(e3), e3.handled)
              return;
        }
        const s2 = await t3(e3), a2 = { body: s2 };
        if (r3.onBeforeResponse)
          for (const t4 of r3.onBeforeResponse)
            await t4(e3, a2);
        return a2.body;
      }(r2, e2.handler, t2), "_handler");
      return _handler.__is_handler__ = true, _handler.__resolve__ = e2.handler.__resolve__, _handler.__websocket__ = e2.websocket, _handler;
    }
    __name(defineEventHandler, "defineEventHandler");
    function _normalizeArray(e2) {
      return e2 ? Array.isArray(e2) ? e2 : [e2] : void 0;
    }
    __name(_normalizeArray, "_normalizeArray");
    const Dn = defineEventHandler;
    function isEventHandler(e2) {
      return hasProp$1(e2, "__is_handler__");
    }
    __name(isEventHandler, "isEventHandler");
    function toEventHandler(e2, t2, r2) {
      return isEventHandler(e2) || console.warn("[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.", r2 && "/" !== r2 ? `
     Route: ${r2}` : "", `
     Handler: ${e2}`), e2;
    }
    __name(toEventHandler, "toEventHandler");
    const lazyEventHandler = /* @__PURE__ */ __name(function(e2) {
      let t2, r2;
      const resolveHandler = /* @__PURE__ */ __name(() => r2 ? Promise.resolve(r2) : (t2 || (t2 = Promise.resolve(e2()).then((e3) => {
        const t3 = e3.default || e3;
        if ("function" != typeof t3)
          throw new TypeError("Invalid lazy handler result. It should be a function:", t3);
        return r2 = { handler: toEventHandler(e3.default || e3) }, r2;
      })), t2), "resolveHandler"), s2 = Dn((e3) => r2 ? r2.handler(e3) : resolveHandler().then((t3) => t3.handler(e3)));
      return s2.__resolve__ = resolveHandler, s2;
    }, "lazyEventHandler");
    function createApp$1(e2 = {}) {
      const t2 = [], r2 = function(e3, t3) {
        const r3 = t3.debug ? 2 : void 0;
        return Dn(async (s3) => {
          s3.node.req.originalUrl = s3.node.req.originalUrl || s3.node.req.url || "/";
          const a3 = s3._path || s3.node.req.url || "/";
          let c3;
          t3.onRequest && await t3.onRequest(s3);
          for (const p2 of e3) {
            if (p2.route.length > 1) {
              if (!a3.startsWith(p2.route))
                continue;
              c3 = a3.slice(p2.route.length) || "/";
            } else
              c3 = a3;
            if (p2.match && !p2.match(c3, s3))
              continue;
            s3._path = c3, s3.node.req.url = c3;
            const e4 = await p2.handler(s3), u2 = void 0 === e4 ? void 0 : await e4;
            if (void 0 !== u2) {
              const e5 = { body: u2 };
              return t3.onBeforeResponse && (s3._onBeforeResponseCalled = true, await t3.onBeforeResponse(s3, e5)), await handleHandlerResponse(s3, e5.body, r3), void (t3.onAfterResponse && (s3._onAfterResponseCalled = true, await t3.onAfterResponse(s3, e5)));
            }
            if (s3.handled)
              return void (t3.onAfterResponse && (s3._onAfterResponseCalled = true, await t3.onAfterResponse(s3, void 0)));
          }
          if (!s3.handled)
            throw createError$1({ statusCode: 404, statusMessage: `Cannot find any path matching ${s3.path || "/"}.` });
          t3.onAfterResponse && (s3._onAfterResponseCalled = true, await t3.onAfterResponse(s3, void 0));
        });
      }(t2, e2), s2 = function(e3) {
        return async (t3) => {
          let r3;
          for (const s3 of e3) {
            if ("/" === s3.route && !s3.handler.__resolve__)
              continue;
            if (!t3.startsWith(s3.route))
              continue;
            if (r3 = t3.slice(s3.route.length) || "/", s3.match && !s3.match(r3, void 0))
              continue;
            let e4 = { route: s3.route, handler: s3.handler };
            if (e4.handler.__resolve__) {
              const t4 = await e4.handler.__resolve__(r3);
              if (!t4)
                continue;
              e4 = { ...e4, ...t4, route: joinURL(e4.route || "/", t4.route || "/") };
            }
            return e4;
          }
        };
      }(t2);
      r2.__resolve__ = s2;
      const a2 = function(e3) {
        let t3;
        return () => (t3 || (t3 = e3()), t3);
      }(() => {
        return t3 = s2, { ...e2.websocket, async resolve(e3) {
          const r3 = e3.request?.url || e3.url || "/", { pathname: s3 } = "string" == typeof r3 ? parseURL(r3) : r3, a3 = await t3(s3);
          return a3?.handler?.__websocket__ || {};
        } };
        var t3;
      }), c2 = { use: (e3, t3, r3) => use(c2, e3, t3, r3), resolve: s2, handler: r2, stack: t2, options: e2, get websocket() {
        return a2();
      } };
      return c2;
    }
    __name(createApp$1, "createApp$1");
    function use(e2, t2, r2, s2) {
      if (Array.isArray(t2))
        for (const a2 of t2)
          use(e2, a2, r2, s2);
      else if (Array.isArray(r2))
        for (const a2 of r2)
          use(e2, t2, a2, s2);
      else
        "string" == typeof t2 ? e2.stack.push(normalizeLayer({ ...s2, route: t2, handler: r2 })) : "function" == typeof t2 ? e2.stack.push(normalizeLayer({ ...r2, handler: t2 })) : e2.stack.push(normalizeLayer({ ...t2 }));
      return e2;
    }
    __name(use, "use");
    function normalizeLayer(e2) {
      let t2 = e2.handler;
      return t2.handler && (t2 = t2.handler), e2.lazy ? t2 = lazyEventHandler(t2) : isEventHandler(t2) || (t2 = toEventHandler(t2, 0, e2.route)), { route: withoutTrailingSlash(e2.route), match: e2.match, handler: t2 };
    }
    __name(normalizeLayer, "normalizeLayer");
    function handleHandlerResponse(e2, t2, r2) {
      if (null === t2)
        return function(e3, t3) {
          if (e3.handled)
            return;
          t3 || 200 === e3.node.res.statusCode || (t3 = e3.node.res.statusCode);
          const r3 = sanitizeStatusCode(t3, 204);
          204 === r3 && e3.node.res.removeHeader("content-length"), e3.node.res.writeHead(r3), e3.node.res.end();
        }(e2);
      if (t2) {
        if (s2 = t2, "undefined" != typeof Response && s2 instanceof Response)
          return sendWebResponse(e2, t2);
        if (function(e3) {
          if (!e3 || "object" != typeof e3)
            return false;
          if ("function" == typeof e3.pipe) {
            if ("function" == typeof e3._read)
              return true;
            if ("function" == typeof e3.abort)
              return true;
          }
          return "function" == typeof e3.pipeTo;
        }(t2))
          return sendStream(e2, t2);
        if (t2.buffer)
          return send(e2, t2);
        if (t2.arrayBuffer && "function" == typeof t2.arrayBuffer)
          return t2.arrayBuffer().then((r3) => send(e2, m.from(r3), t2.type));
        if (t2 instanceof Error)
          throw createError$1(t2);
        if ("function" == typeof t2.end)
          return true;
      }
      var s2;
      const a2 = typeof t2;
      if ("string" === a2)
        return send(e2, t2, Pn.html);
      if ("object" === a2 || "boolean" === a2 || "number" === a2)
        return send(e2, JSON.stringify(t2, void 0, r2), Pn.json);
      if ("bigint" === a2)
        return send(e2, t2.toString(), Pn.json);
      throw createError$1({ statusCode: 500, statusMessage: `[h3] Cannot send ${a2} as response.` });
    }
    __name(handleHandlerResponse, "handleHandlerResponse");
    const Hn = ["connect", "delete", "get", "head", "options", "post", "put", "trace", "patch"];
    function toNodeListener(e2) {
      return async function(t2, r2) {
        const s2 = createEvent(t2, r2);
        try {
          await e2.handler(s2);
        } catch (t3) {
          const r3 = createError$1(t3);
          if (isError(t3) || (r3.unhandled = true), setResponseStatus(s2, r3.statusCode, r3.statusMessage), e2.options.onError && await e2.options.onError(r3, s2), s2.handled)
            return;
          (r3.unhandled || r3.fatal) && console.error("[h3]", r3.fatal ? "[fatal]" : "[unhandled]", r3), e2.options.onBeforeResponse && !s2._onBeforeResponseCalled && await e2.options.onBeforeResponse(s2, { body: r3 }), await function(e3, t4, r4) {
            if (e3.handled)
              return;
            const s3 = isError(t4) ? t4 : createError$1(t4), a2 = { statusCode: s3.statusCode, statusMessage: s3.statusMessage, stack: [], data: s3.data };
            if (r4 && (a2.stack = (s3.stack || "").split("\n").map((e4) => e4.trim())), e3.handled)
              return;
            setResponseStatus(e3, Number.parseInt(s3.statusCode), s3.statusMessage), e3.node.res.setHeader("content-type", Pn.json), e3.node.res.end(JSON.stringify(a2, void 0, 2));
          }(s2, r3, !!e2.options.debug), e2.options.onAfterResponse && !s2._onAfterResponseCalled && await e2.options.onAfterResponse(s2, { body: r3 });
        }
      };
    }
    __name(toNodeListener, "toNodeListener");
    function flatHooks(e2, t2 = {}, r2) {
      for (const s2 in e2) {
        const a2 = e2[s2], c2 = r2 ? `${r2}:${s2}` : s2;
        "object" == typeof a2 && null !== a2 ? flatHooks(a2, t2, c2) : "function" == typeof a2 && (t2[c2] = a2);
      }
      return t2;
    }
    __name(flatHooks, "flatHooks");
    const Un = { run: (e2) => e2() }, Vn = void 0 !== console.createTask ? console.createTask : () => Un;
    function serialTaskCaller(e2, t2) {
      const r2 = t2.shift(), s2 = Vn(r2);
      return e2.reduce((e3, r3) => e3.then(() => s2.run(() => r3(...t2))), Promise.resolve());
    }
    __name(serialTaskCaller, "serialTaskCaller");
    function parallelTaskCaller(e2, t2) {
      const r2 = t2.shift(), s2 = Vn(r2);
      return Promise.all(e2.map((e3) => s2.run(() => e3(...t2))));
    }
    __name(parallelTaskCaller, "parallelTaskCaller");
    function callEachWith(e2, t2) {
      for (const r2 of [...e2])
        r2(t2);
    }
    __name(callEachWith, "callEachWith");
    class Hookable {
      constructor() {
        this._hooks = {}, this._before = void 0, this._after = void 0, this._deprecatedMessages = void 0, this._deprecatedHooks = {}, this.hook = this.hook.bind(this), this.callHook = this.callHook.bind(this), this.callHookWith = this.callHookWith.bind(this);
      }
      hook(e2, t2, r2 = {}) {
        if (!e2 || "function" != typeof t2)
          return () => {
          };
        const s2 = e2;
        let a2;
        for (; this._deprecatedHooks[e2]; )
          a2 = this._deprecatedHooks[e2], e2 = a2.to;
        if (a2 && !r2.allowDeprecated) {
          let e3 = a2.message;
          e3 || (e3 = `${s2} hook has been deprecated` + (a2.to ? `, please use ${a2.to}` : "")), this._deprecatedMessages || (this._deprecatedMessages = /* @__PURE__ */ new Set()), this._deprecatedMessages.has(e3) || (console.warn(e3), this._deprecatedMessages.add(e3));
        }
        if (!t2.name)
          try {
            Object.defineProperty(t2, "name", { get: () => "_" + e2.replace(/\W+/g, "_") + "_hook_cb", configurable: true });
          } catch {
          }
        return this._hooks[e2] = this._hooks[e2] || [], this._hooks[e2].push(t2), () => {
          t2 && (this.removeHook(e2, t2), t2 = void 0);
        };
      }
      hookOnce(e2, t2) {
        let r2, _function = /* @__PURE__ */ __name((...e3) => ("function" == typeof r2 && r2(), r2 = void 0, _function = void 0, t2(...e3)), "_function");
        return r2 = this.hook(e2, _function), r2;
      }
      removeHook(e2, t2) {
        if (this._hooks[e2]) {
          const r2 = this._hooks[e2].indexOf(t2);
          -1 !== r2 && this._hooks[e2].splice(r2, 1), 0 === this._hooks[e2].length && delete this._hooks[e2];
        }
      }
      deprecateHook(e2, t2) {
        this._deprecatedHooks[e2] = "string" == typeof t2 ? { to: t2 } : t2;
        const r2 = this._hooks[e2] || [];
        delete this._hooks[e2];
        for (const t3 of r2)
          this.hook(e2, t3);
      }
      deprecateHooks(e2) {
        Object.assign(this._deprecatedHooks, e2);
        for (const t2 in e2)
          this.deprecateHook(t2, e2[t2]);
      }
      addHooks(e2) {
        const t2 = flatHooks(e2), r2 = Object.keys(t2).map((e3) => this.hook(e3, t2[e3]));
        return () => {
          for (const e3 of r2.splice(0, r2.length))
            e3();
        };
      }
      removeHooks(e2) {
        const t2 = flatHooks(e2);
        for (const e3 in t2)
          this.removeHook(e3, t2[e3]);
      }
      removeAllHooks() {
        for (const e2 in this._hooks)
          delete this._hooks[e2];
      }
      callHook(e2, ...t2) {
        return t2.unshift(e2), this.callHookWith(serialTaskCaller, e2, ...t2);
      }
      callHookParallel(e2, ...t2) {
        return t2.unshift(e2), this.callHookWith(parallelTaskCaller, e2, ...t2);
      }
      callHookWith(e2, t2, ...r2) {
        const s2 = this._before || this._after ? { name: t2, args: r2, context: {} } : void 0;
        this._before && callEachWith(this._before, s2);
        const a2 = e2(t2 in this._hooks ? [...this._hooks[t2]] : [], r2);
        return a2 instanceof Promise ? a2.finally(() => {
          this._after && s2 && callEachWith(this._after, s2);
        }) : (this._after && s2 && callEachWith(this._after, s2), a2);
      }
      beforeEach(e2) {
        return this._before = this._before || [], this._before.push(e2), () => {
          if (void 0 !== this._before) {
            const t2 = this._before.indexOf(e2);
            -1 !== t2 && this._before.splice(t2, 1);
          }
        };
      }
      afterEach(e2) {
        return this._after = this._after || [], this._after.push(e2), () => {
          if (void 0 !== this._after) {
            const t2 = this._after.indexOf(e2);
            -1 !== t2 && this._after.splice(t2, 1);
          }
        };
      }
    }
    __name(Hookable, "Hookable");
    function createHooks() {
      return new Hookable();
    }
    __name(createHooks, "createHooks");
    const Fn = globalThis;
    class FetchError extends Error {
      constructor(e2, t2) {
        super(e2, t2), this.name = "FetchError", t2?.cause && !this.cause && (this.cause = t2.cause);
      }
    }
    __name(FetchError, "FetchError");
    const zn = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));
    function isPayloadMethod(e2 = "GET") {
      return zn.has(e2.toUpperCase());
    }
    __name(isPayloadMethod, "isPayloadMethod");
    const qn = /* @__PURE__ */ new Set(["image/svg", "application/xml", "application/xhtml", "application/html"]), Wn = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
    function resolveFetchOptions(e2, t2, r2, s2) {
      const a2 = function(e3, t3, r3) {
        if (!t3)
          return new r3(e3);
        const s3 = new r3(t3);
        if (e3)
          for (const [t4, a3] of Symbol.iterator in e3 || Array.isArray(e3) ? e3 : new r3(e3))
            s3.set(t4, a3);
        return s3;
      }(t2?.headers ?? e2?.headers, r2?.headers, s2);
      let c2;
      return (r2?.query || r2?.params || t2?.params || t2?.query) && (c2 = { ...r2?.params, ...r2?.query, ...t2?.params, ...t2?.query }), { ...r2, ...t2, query: c2, params: c2, headers: a2 };
    }
    __name(resolveFetchOptions, "resolveFetchOptions");
    async function callHooks(e2, t2) {
      if (t2)
        if (Array.isArray(t2))
          for (const r2 of t2)
            await r2(e2);
        else
          await t2(e2);
    }
    __name(callHooks, "callHooks");
    const Kn = /* @__PURE__ */ new Set([408, 409, 425, 429, 500, 502, 503, 504]), Xn = /* @__PURE__ */ new Set([101, 204, 205, 304]);
    function createFetch(e2 = {}) {
      const { fetch: t2 = globalThis.fetch, Headers: r2 = globalThis.Headers, AbortController: s2 = globalThis.AbortController } = e2;
      async function onError(e3) {
        const t3 = e3.error && "AbortError" === e3.error.name && !e3.options.timeout || false;
        if (false !== e3.options.retry && !t3) {
          let t4;
          t4 = "number" == typeof e3.options.retry ? e3.options.retry : isPayloadMethod(e3.options.method) ? 0 : 1;
          const r4 = e3.response && e3.response.status || 500;
          if (t4 > 0 && (Array.isArray(e3.options.retryStatusCodes) ? e3.options.retryStatusCodes.includes(r4) : Kn.has(r4))) {
            const r5 = "function" == typeof e3.options.retryDelay ? e3.options.retryDelay(e3) : e3.options.retryDelay || 0;
            return r5 > 0 && await new Promise((e4) => setTimeout(e4, r5)), $fetchRaw(e3.request, { ...e3.options, retry: t4 - 1 });
          }
        }
        const r3 = function(e4) {
          const t4 = e4.error?.message || e4.error?.toString() || "", r4 = e4.request?.method || e4.options?.method || "GET", s3 = e4.request?.url || String(e4.request) || "/", a2 = `[${r4}] ${JSON.stringify(s3)}`, c2 = e4.response ? `${e4.response.status} ${e4.response.statusText}` : "<no response>", p2 = new FetchError(`${a2}: ${c2}${t4 ? ` ${t4}` : ""}`, e4.error ? { cause: e4.error } : void 0);
          for (const t5 of ["request", "options", "response"])
            Object.defineProperty(p2, t5, { get: () => e4[t5] });
          for (const [t5, r5] of [["data", "_data"], ["status", "status"], ["statusCode", "status"], ["statusText", "statusText"], ["statusMessage", "statusText"]])
            Object.defineProperty(p2, t5, { get: () => e4.response && e4.response[r5] });
          return p2;
        }(e3);
        throw Error.captureStackTrace && Error.captureStackTrace(r3, $fetchRaw), r3;
      }
      __name(onError, "onError");
      const $fetchRaw = /* @__PURE__ */ __name(async function(a2, c2 = {}) {
        const p2 = { request: a2, options: resolveFetchOptions(a2, c2, e2.defaults, r2), response: void 0, error: void 0 };
        let u2;
        if (p2.options.method && (p2.options.method = p2.options.method.toUpperCase()), p2.options.onRequest && await callHooks(p2, p2.options.onRequest), "string" == typeof p2.request && (p2.options.baseURL && (p2.request = function(e3, t3) {
          if (isEmptyURL(t3) || hasProtocol(e3))
            return e3;
          const r3 = withoutTrailingSlash(t3);
          return e3.startsWith(r3) ? e3 : joinURL(r3, e3);
        }(p2.request, p2.options.baseURL)), p2.options.query && (p2.request = withQuery(p2.request, p2.options.query), delete p2.options.query), "query" in p2.options && delete p2.options.query, "params" in p2.options && delete p2.options.params), p2.options.body && isPayloadMethod(p2.options.method) && (!function(e3) {
          if (void 0 === e3)
            return false;
          const t3 = typeof e3;
          return "string" === t3 || "number" === t3 || "boolean" === t3 || null === t3 || "object" === t3 && (!!Array.isArray(e3) || !e3.buffer && (e3.constructor && "Object" === e3.constructor.name || "function" == typeof e3.toJSON));
        }(p2.options.body) ? ("pipeTo" in p2.options.body && "function" == typeof p2.options.body.pipeTo || "function" == typeof p2.options.body.pipe) && ("duplex" in p2.options || (p2.options.duplex = "half")) : (p2.options.body = "string" == typeof p2.options.body ? p2.options.body : JSON.stringify(p2.options.body), p2.options.headers = new r2(p2.options.headers || {}), p2.options.headers.has("content-type") || p2.options.headers.set("content-type", "application/json"), p2.options.headers.has("accept") || p2.options.headers.set("accept", "application/json"))), !p2.options.signal && p2.options.timeout) {
          const e3 = new s2();
          u2 = setTimeout(() => {
            const t3 = new Error("[TimeoutError]: The operation was aborted due to timeout");
            t3.name = "TimeoutError", t3.code = 23, e3.abort(t3);
          }, p2.options.timeout), p2.options.signal = e3.signal;
        }
        try {
          p2.response = await t2(p2.request, p2.options);
        } catch (e3) {
          return p2.error = e3, p2.options.onRequestError && await callHooks(p2, p2.options.onRequestError), await onError(p2);
        } finally {
          u2 && clearTimeout(u2);
        }
        if ((p2.response.body || p2.response._bodyInit) && !Xn.has(p2.response.status) && "HEAD" !== p2.options.method) {
          const e3 = (p2.options.parseResponse ? "json" : p2.options.responseType) || function(e4 = "") {
            if (!e4)
              return "json";
            const t3 = e4.split(";").shift() || "";
            return Wn.test(t3) ? "json" : qn.has(t3) || t3.startsWith("text/") ? "text" : "blob";
          }(p2.response.headers.get("content-type") || "");
          switch (e3) {
            case "json": {
              const e4 = await p2.response.text(), t3 = p2.options.parseResponse || destr;
              p2.response._data = t3(e4);
              break;
            }
            case "stream":
              p2.response._data = p2.response.body || p2.response._bodyInit;
              break;
            default:
              p2.response._data = await p2.response[e3]();
          }
        }
        return p2.options.onResponse && await callHooks(p2, p2.options.onResponse), !p2.options.ignoreResponseError && p2.response.status >= 400 && p2.response.status < 600 ? (p2.options.onResponseError && await callHooks(p2, p2.options.onResponseError), await onError(p2)) : p2.response;
      }, "$fetchRaw"), $fetch = /* @__PURE__ */ __name(async function(e3, t3) {
        return (await $fetchRaw(e3, t3))._data;
      }, "$fetch");
      return $fetch.raw = $fetchRaw, $fetch.native = (...e3) => t2(...e3), $fetch.create = (t3 = {}, r3 = {}) => createFetch({ ...e2, ...r3, defaults: { ...e2.defaults, ...r3.defaults, ...t3 } }), $fetch;
    }
    __name(createFetch, "createFetch");
    const Gn = function() {
      if ("undefined" != typeof globalThis)
        return globalThis;
      if ("undefined" != typeof self)
        return self;
      if (void 0 !== Fn)
        return Fn;
      throw new Error("unable to locate global object");
    }(), Jn = Gn.fetch ? (...e2) => Gn.fetch(...e2) : () => Promise.reject(new Error("[ofetch] global.fetch is not supported!")), Yn = Gn.Headers, Qn = Gn.AbortController;
    function asyncCall(e2, ...t2) {
      try {
        return (r2 = e2(...t2)) && "function" == typeof r2.then ? r2 : Promise.resolve(r2);
      } catch (e3) {
        return Promise.reject(e3);
      }
      var r2;
    }
    __name(asyncCall, "asyncCall");
    function stringify$1(e2) {
      if (function(e3) {
        const t2 = typeof e3;
        return null === e3 || "object" !== t2 && "function" !== t2;
      }(e2))
        return String(e2);
      if (function(e3) {
        const t2 = Object.getPrototypeOf(e3);
        return !t2 || t2.isPrototypeOf(Object);
      }(e2) || Array.isArray(e2))
        return JSON.stringify(e2);
      if ("function" == typeof e2.toJSON)
        return stringify$1(e2.toJSON());
      throw new Error("[unstorage] Cannot stringify value!");
    }
    __name(stringify$1, "stringify$1");
    createFetch({ fetch: Jn, Headers: Yn, AbortController: Qn });
    const Zn = "base64:";
    function serializeRaw(e2) {
      return "string" == typeof e2 ? e2 : Zn + function(e3) {
        if (globalThis.Buffer)
          return m.from(e3).toString("base64");
        return globalThis.btoa(String.fromCodePoint(...e3));
      }(e2);
    }
    __name(serializeRaw, "serializeRaw");
    function deserializeRaw(e2) {
      return "string" != typeof e2 ? e2 : e2.startsWith(Zn) ? function(e3) {
        if (globalThis.Buffer)
          return m.from(e3, "base64");
        return Uint8Array.from(globalThis.atob(e3), (e4) => e4.codePointAt(0));
      }(e2.slice(7)) : e2;
    }
    __name(deserializeRaw, "deserializeRaw");
    const er = ["has", "hasItem", "get", "getItem", "getItemRaw", "set", "setItem", "setItemRaw", "del", "remove", "removeItem", "getMeta", "setMeta", "removeMeta", "getKeys", "clear", "mount", "unmount"];
    function normalizeKey$2(e2) {
      return e2 && e2.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
    }
    __name(normalizeKey$2, "normalizeKey$2");
    function joinKeys(...e2) {
      return normalizeKey$2(e2.join(":"));
    }
    __name(joinKeys, "joinKeys");
    function normalizeBaseKey(e2) {
      return (e2 = normalizeKey$2(e2)) ? e2 + ":" : "";
    }
    __name(normalizeBaseKey, "normalizeBaseKey");
    const memory = /* @__PURE__ */ __name(() => {
      const e2 = /* @__PURE__ */ new Map();
      return { name: "memory", getInstance: () => e2, hasItem: (t2) => e2.has(t2), getItem: (t2) => e2.get(t2) ?? null, getItemRaw: (t2) => e2.get(t2) ?? null, setItem(t2, r2) {
        e2.set(t2, r2);
      }, setItemRaw(t2, r2) {
        e2.set(t2, r2);
      }, removeItem(t2) {
        e2.delete(t2);
      }, getKeys: () => [...e2.keys()], clear() {
        e2.clear();
      }, dispose() {
        e2.clear();
      } };
    }, "memory");
    function watch$2(e2, t2, r2) {
      return e2.watch ? e2.watch((e3, s2) => t2(e3, r2 + s2)) : () => {
      };
    }
    __name(watch$2, "watch$2");
    async function dispose(e2) {
      "function" == typeof e2.dispose && await asyncCall(e2.dispose);
    }
    __name(dispose, "dispose");
    const tr = {}, normalizeKey$1 = /* @__PURE__ */ __name(function(e2) {
      return e2 && e2.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
    }, "normalizeKey$1"), nr = { getKeys: () => Promise.resolve(Object.keys(tr)), hasItem: (e2) => (e2 = normalizeKey$1(e2), Promise.resolve(e2 in tr)), getItem: (e2) => (e2 = normalizeKey$1(e2), Promise.resolve(tr[e2] ? tr[e2].import() : null)), getMeta: (e2) => (e2 = normalizeKey$1(e2), Promise.resolve(tr[e2] ? tr[e2].meta : {})) }, rr = function(e2 = {}) {
      const t2 = { mounts: { "": e2.driver || memory() }, mountpoints: [""], watching: false, watchListeners: [], unwatch: {} }, getMount = /* @__PURE__ */ __name((e3) => {
        for (const r3 of t2.mountpoints)
          if (e3.startsWith(r3))
            return { base: r3, relativeKey: e3.slice(r3.length), driver: t2.mounts[r3] };
        return { base: "", relativeKey: e3, driver: t2.mounts[""] };
      }, "getMount"), getMounts = /* @__PURE__ */ __name((e3, r3) => t2.mountpoints.filter((t3) => t3.startsWith(e3) || r3 && e3.startsWith(t3)).map((r4) => ({ relativeBase: e3.length > r4.length ? e3.slice(r4.length) : void 0, mountpoint: r4, driver: t2.mounts[r4] })), "getMounts"), onChange = /* @__PURE__ */ __name((e3, r3) => {
        if (t2.watching) {
          r3 = normalizeKey$2(r3);
          for (const s2 of t2.watchListeners)
            s2(e3, r3);
        }
      }, "onChange"), stopWatch = /* @__PURE__ */ __name(async () => {
        if (t2.watching) {
          for (const e3 in t2.unwatch)
            await t2.unwatch[e3]();
          t2.unwatch = {}, t2.watching = false;
        }
      }, "stopWatch"), runBatch = /* @__PURE__ */ __name((e3, t3, r3) => {
        const s2 = /* @__PURE__ */ new Map(), getBatch = /* @__PURE__ */ __name((e4) => {
          let t4 = s2.get(e4.base);
          return t4 || (t4 = { driver: e4.driver, base: e4.base, items: [] }, s2.set(e4.base, t4)), t4;
        }, "getBatch");
        for (const r4 of e3) {
          const e4 = "string" == typeof r4, s3 = normalizeKey$2(e4 ? r4 : r4.key), a2 = e4 ? void 0 : r4.value, c2 = e4 || !r4.options ? t3 : { ...t3, ...r4.options }, p2 = getMount(s3);
          getBatch(p2).items.push({ key: s3, value: a2, relativeKey: p2.relativeKey, options: c2 });
        }
        return Promise.all([...s2.values()].map((e4) => r3(e4))).then((e4) => e4.flat());
      }, "runBatch"), r2 = { hasItem(e3, t3 = {}) {
        e3 = normalizeKey$2(e3);
        const { relativeKey: r3, driver: s2 } = getMount(e3);
        return asyncCall(s2.hasItem, r3, t3);
      }, getItem(e3, t3 = {}) {
        e3 = normalizeKey$2(e3);
        const { relativeKey: r3, driver: s2 } = getMount(e3);
        return asyncCall(s2.getItem, r3, t3).then((e4) => destr(e4));
      }, getItems: (e3, t3 = {}) => runBatch(e3, t3, (e4) => e4.driver.getItems ? asyncCall(e4.driver.getItems, e4.items.map((e5) => ({ key: e5.relativeKey, options: e5.options })), t3).then((t4) => t4.map((t5) => ({ key: joinKeys(e4.base, t5.key), value: destr(t5.value) }))) : Promise.all(e4.items.map((t4) => asyncCall(e4.driver.getItem, t4.relativeKey, t4.options).then((e5) => ({ key: t4.key, value: destr(e5) }))))), getItemRaw(e3, t3 = {}) {
        e3 = normalizeKey$2(e3);
        const { relativeKey: r3, driver: s2 } = getMount(e3);
        return s2.getItemRaw ? asyncCall(s2.getItemRaw, r3, t3) : asyncCall(s2.getItem, r3, t3).then((e4) => deserializeRaw(e4));
      }, async setItem(e3, t3, s2 = {}) {
        if (void 0 === t3)
          return r2.removeItem(e3);
        e3 = normalizeKey$2(e3);
        const { relativeKey: a2, driver: c2 } = getMount(e3);
        c2.setItem && (await asyncCall(c2.setItem, a2, stringify$1(t3), s2), c2.watch || onChange("update", e3));
      }, async setItems(e3, t3) {
        await runBatch(e3, t3, async (e4) => {
          if (e4.driver.setItems)
            return asyncCall(e4.driver.setItems, e4.items.map((e5) => ({ key: e5.relativeKey, value: stringify$1(e5.value), options: e5.options })), t3);
          e4.driver.setItem && await Promise.all(e4.items.map((t4) => asyncCall(e4.driver.setItem, t4.relativeKey, stringify$1(t4.value), t4.options)));
        });
      }, async setItemRaw(e3, t3, s2 = {}) {
        if (void 0 === t3)
          return r2.removeItem(e3, s2);
        e3 = normalizeKey$2(e3);
        const { relativeKey: a2, driver: c2 } = getMount(e3);
        if (c2.setItemRaw)
          await asyncCall(c2.setItemRaw, a2, t3, s2);
        else {
          if (!c2.setItem)
            return;
          await asyncCall(c2.setItem, a2, serializeRaw(t3), s2);
        }
        c2.watch || onChange("update", e3);
      }, async removeItem(e3, t3 = {}) {
        "boolean" == typeof t3 && (t3 = { removeMeta: t3 }), e3 = normalizeKey$2(e3);
        const { relativeKey: r3, driver: s2 } = getMount(e3);
        s2.removeItem && (await asyncCall(s2.removeItem, r3, t3), (t3.removeMeta || t3.removeMata) && await asyncCall(s2.removeItem, r3 + "$", t3), s2.watch || onChange("remove", e3));
      }, async getMeta(e3, t3 = {}) {
        "boolean" == typeof t3 && (t3 = { nativeOnly: t3 }), e3 = normalizeKey$2(e3);
        const { relativeKey: r3, driver: s2 } = getMount(e3), a2 = /* @__PURE__ */ Object.create(null);
        if (s2.getMeta && Object.assign(a2, await asyncCall(s2.getMeta, r3, t3)), !t3.nativeOnly) {
          const e4 = await asyncCall(s2.getItem, r3 + "$", t3).then((e5) => destr(e5));
          e4 && "object" == typeof e4 && ("string" == typeof e4.atime && (e4.atime = new Date(e4.atime)), "string" == typeof e4.mtime && (e4.mtime = new Date(e4.mtime)), Object.assign(a2, e4));
        }
        return a2;
      }, setMeta(e3, t3, r3 = {}) {
        return this.setItem(e3 + "$", t3, r3);
      }, removeMeta(e3, t3 = {}) {
        return this.removeItem(e3 + "$", t3);
      }, async getKeys(e3, t3 = {}) {
        e3 = normalizeBaseKey(e3);
        const r3 = getMounts(e3, true);
        let s2 = [];
        const a2 = [];
        let c2 = true;
        for (const e4 of r3) {
          e4.driver.flags?.maxDepth || (c2 = false);
          const r4 = await asyncCall(e4.driver.getKeys, e4.relativeBase, t3);
          for (const t4 of r4) {
            const r5 = e4.mountpoint + normalizeKey$2(t4);
            s2.some((e5) => r5.startsWith(e5)) || a2.push(r5);
          }
          s2 = [e4.mountpoint, ...s2.filter((t4) => !t4.startsWith(e4.mountpoint))];
        }
        const p2 = void 0 !== t3.maxDepth && !c2;
        return a2.filter((r4) => (!p2 || function(e4, t4) {
          if (void 0 === t4)
            return true;
          let r5 = 0, s3 = e4.indexOf(":");
          for (; s3 > -1; )
            r5++, s3 = e4.indexOf(":", s3 + 1);
          return r5 <= t4;
        }(r4, t3.maxDepth)) && function(e4, t4) {
          return t4 ? e4.startsWith(t4) && "$" !== e4[e4.length - 1] : "$" !== e4[e4.length - 1];
        }(r4, e3));
      }, async clear(e3, t3 = {}) {
        e3 = normalizeBaseKey(e3), await Promise.all(getMounts(e3, false).map(async (e4) => {
          if (e4.driver.clear)
            return asyncCall(e4.driver.clear, e4.relativeBase, t3);
          if (e4.driver.removeItem) {
            const r3 = await e4.driver.getKeys(e4.relativeBase || "", t3);
            return Promise.all(r3.map((r4) => e4.driver.removeItem(r4, t3)));
          }
        }));
      }, async dispose() {
        await Promise.all(Object.values(t2.mounts).map((e3) => dispose(e3)));
      }, watch: async (e3) => (await (async () => {
        if (!t2.watching) {
          t2.watching = true;
          for (const e4 in t2.mounts)
            t2.unwatch[e4] = await watch$2(t2.mounts[e4], onChange, e4);
        }
      })(), t2.watchListeners.push(e3), async () => {
        t2.watchListeners = t2.watchListeners.filter((t3) => t3 !== e3), 0 === t2.watchListeners.length && await stopWatch();
      }), async unwatch() {
        t2.watchListeners = [], await stopWatch();
      }, mount(e3, s2) {
        if ((e3 = normalizeBaseKey(e3)) && t2.mounts[e3])
          throw new Error(`already mounted at ${e3}`);
        return e3 && (t2.mountpoints.push(e3), t2.mountpoints.sort((e4, t3) => t3.length - e4.length)), t2.mounts[e3] = s2, t2.watching && Promise.resolve(watch$2(s2, onChange, e3)).then((r3) => {
          t2.unwatch[e3] = r3;
        }).catch(console.error), r2;
      }, async unmount(e3, r3 = true) {
        (e3 = normalizeBaseKey(e3)) && t2.mounts[e3] && (t2.watching && e3 in t2.unwatch && (t2.unwatch[e3]?.(), delete t2.unwatch[e3]), r3 && await dispose(t2.mounts[e3]), t2.mountpoints = t2.mountpoints.filter((t3) => t3 !== e3), delete t2.mounts[e3]);
      }, getMount(e3 = "") {
        e3 = normalizeKey$2(e3) + ":";
        const t3 = getMount(e3);
        return { driver: t3.driver, base: t3.base };
      }, getMounts(e3 = "", t3 = {}) {
        e3 = normalizeKey$2(e3);
        return getMounts(e3, t3.parents).map((e4) => ({ driver: e4.driver, base: e4.mountpoint }));
      }, keys: (e3, t3 = {}) => r2.getKeys(e3, t3), get: (e3, t3 = {}) => r2.getItem(e3, t3), set: (e3, t3, s2 = {}) => r2.setItem(e3, t3, s2), has: (e3, t3 = {}) => r2.hasItem(e3, t3), del: (e3, t3 = {}) => r2.removeItem(e3, t3), remove: (e3, t3 = {}) => r2.removeItem(e3, t3) };
      return r2;
    }({});
    function useStorage(e2 = "") {
      return e2 ? function(e3, t2) {
        if (!(t2 = normalizeBaseKey(t2)))
          return e3;
        const r2 = { ...e3 };
        for (const s2 of er)
          r2[s2] = (r3 = "", ...a2) => e3[s2](t2 + r3, ...a2);
        return r2.getKeys = (r3 = "", ...s2) => e3.getKeys(t2 + r3, ...s2).then((e4) => e4.map((e5) => e5.slice(t2.length))), r2.getItems = async (r3, s2) => {
          const a2 = r3.map((e4) => "string" == typeof e4 ? t2 + e4 : { ...e4, key: t2 + e4.key });
          return (await e3.getItems(a2, s2)).map((e4) => ({ key: e4.key.slice(t2.length), value: e4.value }));
        }, r2.setItems = async (r3, s2) => {
          const a2 = r3.map((e4) => ({ key: t2 + e4.key, value: e4.value, options: e4.options }));
          return e3.setItems(a2, s2);
        }, r2;
      }(rr, e2) : rr;
    }
    __name(useStorage, "useStorage");
    rr.mount("/assets", nr);
    const or = [1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225], sr = [1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998], ir = [];
    class k {
      _data = new ar();
      _hash = new ar([...or]);
      _nDataBytes = 0;
      _minBufferSize = 0;
      finalize(e2) {
        e2 && this._append(e2);
        const t2 = 8 * this._nDataBytes, r2 = 8 * this._data.sigBytes;
        return this._data.words[r2 >>> 5] |= 128 << 24 - r2 % 32, this._data.words[14 + (r2 + 64 >>> 9 << 4)] = Math.floor(t2 / 4294967296), this._data.words[15 + (r2 + 64 >>> 9 << 4)] = t2, this._data.sigBytes = 4 * this._data.words.length, this._process(), this._hash;
      }
      _doProcessBlock(e2, t2) {
        const r2 = this._hash.words;
        let s2 = r2[0], a2 = r2[1], c2 = r2[2], p2 = r2[3], u2 = r2[4], d2 = r2[5], f2 = r2[6], m2 = r2[7];
        for (let r3 = 0; r3 < 64; r3++) {
          if (r3 < 16)
            ir[r3] = 0 | e2[t2 + r3];
          else {
            const e3 = ir[r3 - 15], t3 = (e3 << 25 | e3 >>> 7) ^ (e3 << 14 | e3 >>> 18) ^ e3 >>> 3, s3 = ir[r3 - 2], a3 = (s3 << 15 | s3 >>> 17) ^ (s3 << 13 | s3 >>> 19) ^ s3 >>> 10;
            ir[r3] = t3 + ir[r3 - 7] + a3 + ir[r3 - 16];
          }
          const g2 = s2 & a2 ^ s2 & c2 ^ a2 & c2, x2 = (s2 << 30 | s2 >>> 2) ^ (s2 << 19 | s2 >>> 13) ^ (s2 << 10 | s2 >>> 22), _2 = m2 + ((u2 << 26 | u2 >>> 6) ^ (u2 << 21 | u2 >>> 11) ^ (u2 << 7 | u2 >>> 25)) + (u2 & d2 ^ ~u2 & f2) + sr[r3] + ir[r3];
          m2 = f2, f2 = d2, d2 = u2, u2 = p2 + _2 | 0, p2 = c2, c2 = a2, a2 = s2, s2 = _2 + (x2 + g2) | 0;
        }
        r2[0] = r2[0] + s2 | 0, r2[1] = r2[1] + a2 | 0, r2[2] = r2[2] + c2 | 0, r2[3] = r2[3] + p2 | 0, r2[4] = r2[4] + u2 | 0, r2[5] = r2[5] + d2 | 0, r2[6] = r2[6] + f2 | 0, r2[7] = r2[7] + m2 | 0;
      }
      _append(e2) {
        "string" == typeof e2 && (e2 = ar.fromUtf8(e2)), this._data.concat(e2), this._nDataBytes += e2.sigBytes;
      }
      _process(e2) {
        let t2, r2 = this._data.sigBytes / 64;
        r2 = e2 ? Math.ceil(r2) : Math.max((0 | r2) - this._minBufferSize, 0);
        const s2 = 16 * r2, a2 = Math.min(4 * s2, this._data.sigBytes);
        if (s2) {
          for (let e3 = 0; e3 < s2; e3 += 16)
            this._doProcessBlock(this._data.words, e3);
          t2 = this._data.words.splice(0, s2), this._data.sigBytes -= a2;
        }
        return new ar(t2, a2);
      }
    }
    __name(k, "k");
    let ar = /* @__PURE__ */ __name(class l {
      words;
      sigBytes;
      constructor(e2, t2) {
        e2 = this.words = e2 || [], this.sigBytes = void 0 === t2 ? 4 * e2.length : t2;
      }
      static fromUtf8(e2) {
        const t2 = unescape(encodeURIComponent(e2)), r2 = t2.length, s2 = [];
        for (let e3 = 0; e3 < r2; e3++)
          s2[e3 >>> 2] |= (255 & t2.charCodeAt(e3)) << 24 - e3 % 4 * 8;
        return new l(s2, r2);
      }
      toBase64() {
        const e2 = [];
        for (let t2 = 0; t2 < this.sigBytes; t2 += 3) {
          const r2 = (this.words[t2 >>> 2] >>> 24 - t2 % 4 * 8 & 255) << 16 | (this.words[t2 + 1 >>> 2] >>> 24 - (t2 + 1) % 4 * 8 & 255) << 8 | this.words[t2 + 2 >>> 2] >>> 24 - (t2 + 2) % 4 * 8 & 255;
          for (let s2 = 0; s2 < 4 && 8 * t2 + 6 * s2 < 8 * this.sigBytes; s2++)
            e2.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(r2 >>> 6 * (3 - s2) & 63));
        }
        return e2.join("");
      }
      concat(e2) {
        if (this.words[this.sigBytes >>> 2] &= 4294967295 << 32 - this.sigBytes % 4 * 8, this.words.length = Math.ceil(this.sigBytes / 4), this.sigBytes % 4)
          for (let t2 = 0; t2 < e2.sigBytes; t2++) {
            const r2 = e2.words[t2 >>> 2] >>> 24 - t2 % 4 * 8 & 255;
            this.words[this.sigBytes + t2 >>> 2] |= r2 << 24 - (this.sigBytes + t2) % 4 * 8;
          }
        else
          for (let t2 = 0; t2 < e2.sigBytes; t2 += 4)
            this.words[this.sigBytes + t2 >>> 2] = e2.words[t2 >>> 2];
        this.sigBytes += e2.sigBytes;
      }
    }, "l");
    const cr = (() => {
      class Hasher2 {
        buff = "";
        #o = /* @__PURE__ */ new Map();
        write(e2) {
          this.buff += e2;
        }
        dispatch(e2) {
          return this[null === e2 ? "null" : typeof e2](e2);
        }
        object(e2) {
          if (e2 && "function" == typeof e2.toJSON)
            return this.object(e2.toJSON());
          const t2 = Object.prototype.toString.call(e2);
          let r2 = "";
          const s2 = t2.length;
          r2 = s2 < 10 ? "unknown:[" + t2 + "]" : t2.slice(8, s2 - 1), r2 = r2.toLowerCase();
          let a2 = null;
          if (void 0 !== (a2 = this.#o.get(e2)))
            return this.dispatch("[CIRCULAR:" + a2 + "]");
          if (this.#o.set(e2, this.#o.size), void 0 !== m && m.isBuffer && m.isBuffer(e2))
            return this.write("buffer:"), this.write(e2.toString("utf8"));
          if ("object" !== r2 && "function" !== r2 && "asyncfunction" !== r2)
            this[r2] ? this[r2](e2) : this.unknown(e2, r2);
          else {
            const t3 = Object.keys(e2).sort(), r3 = [];
            this.write("object:" + (t3.length + r3.length) + ":");
            const dispatchForKey = /* @__PURE__ */ __name((t4) => {
              this.dispatch(t4), this.write(":"), this.dispatch(e2[t4]), this.write(",");
            }, "dispatchForKey");
            for (const e3 of t3)
              dispatchForKey(e3);
            for (const e3 of r3)
              dispatchForKey(e3);
          }
        }
        array(e2, t2) {
          if (t2 = void 0 !== t2 && t2, this.write("array:" + e2.length + ":"), !t2 || e2.length <= 1) {
            for (const t3 of e2)
              this.dispatch(t3);
            return;
          }
          const r2 = /* @__PURE__ */ new Map(), s2 = e2.map((e3) => {
            const t3 = new Hasher2();
            t3.dispatch(e3);
            for (const [e4, s3] of t3.#o)
              r2.set(e4, s3);
            return t3.toString();
          });
          return this.#o = r2, s2.sort(), this.array(s2, false);
        }
        date(e2) {
          return this.write("date:" + e2.toJSON());
        }
        symbol(e2) {
          return this.write("symbol:" + e2.toString());
        }
        unknown(e2, t2) {
          if (this.write(t2), e2)
            return this.write(":"), e2 && "function" == typeof e2.entries ? this.array([...e2.entries()], true) : void 0;
        }
        error(e2) {
          return this.write("error:" + e2.toString());
        }
        boolean(e2) {
          return this.write("bool:" + e2);
        }
        string(e2) {
          this.write("string:" + e2.length + ":"), this.write(e2);
        }
        function(e2) {
          this.write("fn:"), !function(e3) {
            if ("function" != typeof e3)
              return false;
            return "[native code] }" === Function.prototype.toString.call(e3).slice(-15);
          }(e2) ? this.dispatch(e2.toString()) : this.dispatch("[native]");
        }
        number(e2) {
          return this.write("number:" + e2);
        }
        null() {
          return this.write("Null");
        }
        undefined() {
          return this.write("Undefined");
        }
        regexp(e2) {
          return this.write("regex:" + e2.toString());
        }
        arraybuffer(e2) {
          return this.write("arraybuffer:"), this.dispatch(new Uint8Array(e2));
        }
        url(e2) {
          return this.write("url:" + e2.toString());
        }
        map(e2) {
          this.write("map:");
          const t2 = [...e2];
          return this.array(t2, false);
        }
        set(e2) {
          this.write("set:");
          const t2 = [...e2];
          return this.array(t2, false);
        }
        bigint(e2) {
          return this.write("bigint:" + e2.toString());
        }
      }
      __name(Hasher2, "Hasher2");
      for (const e2 of ["uint8array", "uint8clampedarray", "unt8array", "uint16array", "unt16array", "uint32array", "unt32array", "float32array", "float64array"])
        Hasher2.prototype[e2] = function(t2) {
          return this.write(e2 + ":"), this.array([...t2], false);
        };
      return Hasher2;
    })();
    function hash(e2) {
      return function(e3) {
        return new k().finalize(e3).toBase64();
      }("string" == typeof e2 ? e2 : function(e3) {
        const t2 = new cr();
        return t2.dispatch(e3), t2.buff;
      }(e2)).replace(/[-_]/g, "").slice(0, 10);
    }
    __name(hash, "hash");
    function defineCachedFunction(e2, t2 = {}) {
      t2 = { name: "_", base: "/cache", swr: true, maxAge: 1, ...t2 };
      const r2 = {}, s2 = t2.group || "nitro/functions", a2 = t2.name || e2.name || "_", c2 = t2.integrity || hash([e2, t2]), p2 = t2.validate || ((e3) => void 0 !== e3.value);
      return async (...u2) => {
        if (await t2.shouldBypassCache?.(...u2))
          return e2(...u2);
        const d2 = await (t2.getKey || getKey)(...u2), f2 = await t2.shouldInvalidateCache?.(...u2), m2 = await async function(e3, u3, d3, f3) {
          const m3 = [t2.base, s2, a2, e3 + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
          let g3 = await useStorage().getItem(m3).catch((e4) => {
            console.error("[cache] Cache read error.", e4), useNitroApp().captureError(e4, { event: f3, tags: ["cache"] });
          }) || {};
          if ("object" != typeof g3) {
            g3 = {};
            const e4 = new Error("Malformed data read from cache.");
            console.error("[cache]", e4), useNitroApp().captureError(e4, { event: f3, tags: ["cache"] });
          }
          const x2 = 1e3 * (t2.maxAge ?? 0);
          x2 && (g3.expires = Date.now() + x2);
          const _2 = d3 || g3.integrity !== c2 || x2 && Date.now() - (g3.mtime || 0) > x2 || false === p2(g3), E2 = _2 ? (async () => {
            const s3 = r2[e3];
            s3 || (void 0 !== g3.value && (t2.staleMaxAge || 0) >= 0 && false === t2.swr && (g3.value = void 0, g3.integrity = void 0, g3.mtime = void 0, g3.expires = void 0), r2[e3] = Promise.resolve(u3()));
            try {
              g3.value = await r2[e3];
            } catch (t3) {
              throw s3 || delete r2[e3], t3;
            }
            if (!s3 && (g3.mtime = Date.now(), g3.integrity = c2, delete r2[e3], false !== p2(g3))) {
              let e4;
              t2.maxAge && !t2.swr && (e4 = { ttl: t2.maxAge });
              const r3 = useStorage().setItem(m3, g3, e4).catch((e5) => {
                console.error("[cache] Cache write error.", e5), useNitroApp().captureError(e5, { event: f3, tags: ["cache"] });
              });
              f3?.waitUntil && f3.waitUntil(r3);
            }
          })() : Promise.resolve();
          return void 0 === g3.value ? await E2 : _2 && f3 && f3.waitUntil && f3.waitUntil(E2), t2.swr && false !== p2(g3) ? (E2.catch((e4) => {
            console.error("[cache] SWR handler error.", e4), useNitroApp().captureError(e4, { event: f3, tags: ["cache"] });
          }), g3) : E2.then(() => g3);
        }(d2, () => e2(...u2), f2, u2[0] && isEvent(u2[0]) ? u2[0] : void 0);
        let g2 = m2.value;
        return t2.transform && (g2 = await t2.transform(m2, ...u2) || g2), g2;
      };
    }
    __name(defineCachedFunction, "defineCachedFunction");
    function getKey(...e2) {
      return e2.length > 0 ? hash(e2) : "";
    }
    __name(getKey, "getKey");
    function escapeKey(e2) {
      return String(e2).replace(/\W/g, "");
    }
    __name(escapeKey, "escapeKey");
    function cloneWithProxy(e2, t2) {
      return new Proxy(e2, { get: (e3, r2, s2) => r2 in t2 ? t2[r2] : Reflect.get(e3, r2, s2), set: (e3, r2, s2, a2) => r2 in t2 ? (t2[r2] = s2, true) : Reflect.set(e3, r2, s2, a2) });
    }
    __name(cloneWithProxy, "cloneWithProxy");
    const cachedEventHandler = /* @__PURE__ */ __name(function(e2, t2 = { name: "_", base: "/cache", swr: true, maxAge: 1 }) {
      const r2 = (t2.varies || []).filter(Boolean).map((e3) => e3.toLowerCase()).sort(), s2 = { ...t2, getKey: async (e3) => {
        const s3 = await t2.getKey?.(e3);
        if (s3)
          return escapeKey(s3);
        const a3 = e3.node.req.originalUrl || e3.node.req.url || e3.path;
        let c2;
        try {
          c2 = escapeKey(decodeURI(parseURL(a3).pathname)).slice(0, 16) || "index";
        } catch {
          c2 = "-";
        }
        return [`${c2}.${hash(a3)}`, ...r2.map((t3) => [t3, e3.node.req.headers[t3]]).map(([e4, t3]) => `${escapeKey(e4)}.${hash(t3)}`)].join(":");
      }, validate: (e3) => !!e3.value && (!(e3.value.code >= 400) && (void 0 !== e3.value.body && ("undefined" !== e3.value.headers.etag && "undefined" !== e3.value.headers["last-modified"]))), group: t2.group || "nitro/handlers", integrity: t2.integrity || hash([e2, t2]) }, a2 = function(e3, t3 = {}) {
        return defineCachedFunction(e3, t3);
      }(async (a3) => {
        const c2 = {};
        for (const e3 of r2) {
          const t3 = a3.node.req.headers[e3];
          void 0 !== t3 && (c2[e3] = t3);
        }
        const p2 = cloneWithProxy(a3.node.req, { headers: c2 }), u2 = {};
        let d2;
        const f2 = createEvent(p2, cloneWithProxy(a3.node.res, { statusCode: 200, writableEnded: false, writableFinished: false, headersSent: false, closed: false, getHeader: (e3) => u2[e3], setHeader(e3, t3) {
          return u2[e3] = t3, this;
        }, getHeaderNames: () => Object.keys(u2), hasHeader: (e3) => e3 in u2, removeHeader(e3) {
          delete u2[e3];
        }, getHeaders: () => u2, end(e3, t3, r3) {
          return "string" == typeof e3 && (d2 = e3), "function" == typeof t3 && t3(), "function" == typeof r3 && r3(), this;
        }, write: (e3, t3, r3) => ("string" == typeof e3 && (d2 = e3), "function" == typeof t3 && t3(void 0), "function" == typeof r3 && r3(), true), writeHead(e3, t3) {
          if (this.statusCode = e3, t3) {
            if (Array.isArray(t3) || "string" == typeof t3)
              throw new TypeError("Raw headers  is not supported.");
            for (const e4 in t3) {
              const r3 = t3[e4];
              void 0 !== r3 && this.setHeader(e4, r3);
            }
          }
          return this;
        } }));
        f2.fetch = (e3, t3) => fetchWithEvent(f2, e3, t3, { fetch: useNitroApp().localFetch }), f2.$fetch = (e3, t3) => fetchWithEvent(f2, e3, t3, { fetch: globalThis.$fetch }), f2.waitUntil = a3.waitUntil, f2.context = a3.context, f2.context.cache = { options: s2 };
        const m2 = await e2(f2) || d2, g2 = f2.node.res.getHeaders();
        g2.etag = String(g2.Etag || g2.etag || `W/"${hash(m2)}"`), g2["last-modified"] = String(g2["Last-Modified"] || g2["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString());
        const x2 = [];
        t2.swr ? (t2.maxAge && x2.push(`s-maxage=${t2.maxAge}`), t2.staleMaxAge ? x2.push(`stale-while-revalidate=${t2.staleMaxAge}`) : x2.push("stale-while-revalidate")) : t2.maxAge && x2.push(`max-age=${t2.maxAge}`), x2.length > 0 && (g2["cache-control"] = x2.join(", "));
        return { code: f2.node.res.statusCode, headers: g2, body: m2 };
      }, s2);
      return defineEventHandler(async (r3) => {
        if (t2.headersOnly) {
          if (handleCacheHeaders(r3, { maxAge: t2.maxAge }))
            return;
          return e2(r3);
        }
        const s3 = await a2(r3);
        if (r3.node.res.headersSent || r3.node.res.writableEnded)
          return s3.body;
        if (!handleCacheHeaders(r3, { modifiedTime: new Date(s3.headers["last-modified"]), etag: s3.headers.etag, maxAge: t2.maxAge })) {
          r3.node.res.statusCode = s3.code;
          for (const e3 in s3.headers) {
            const t3 = s3.headers[e3];
            "set-cookie" === e3 ? r3.node.res.appendHeader(e3, splitCookiesString(t3)) : void 0 !== t3 && r3.node.res.setHeader(e3, t3);
          }
          return s3.body;
        }
      });
    }, "cachedEventHandler");
    function klona(e2) {
      if ("object" != typeof e2)
        return e2;
      var t2, r2, s2 = Object.prototype.toString.call(e2);
      if ("[object Object]" === s2) {
        if (e2.constructor !== Object && "function" == typeof e2.constructor)
          for (t2 in r2 = new e2.constructor(), e2)
            e2.hasOwnProperty(t2) && r2[t2] !== e2[t2] && (r2[t2] = klona(e2[t2]));
        else
          for (t2 in r2 = {}, e2)
            "__proto__" === t2 ? Object.defineProperty(r2, t2, { value: klona(e2[t2]), configurable: true, enumerable: true, writable: true }) : r2[t2] = klona(e2[t2]);
        return r2;
      }
      if ("[object Array]" === s2) {
        for (t2 = e2.length, r2 = Array(t2); t2--; )
          r2[t2] = klona(e2[t2]);
        return r2;
      }
      return "[object Set]" === s2 ? (r2 = /* @__PURE__ */ new Set(), e2.forEach(function(e3) {
        r2.add(klona(e3));
      }), r2) : "[object Map]" === s2 ? (r2 = /* @__PURE__ */ new Map(), e2.forEach(function(e3, t3) {
        r2.set(klona(t3), klona(e3));
      }), r2) : "[object Date]" === s2 ? /* @__PURE__ */ new Date(+e2) : "[object RegExp]" === s2 ? ((r2 = new RegExp(e2.source, e2.flags)).lastIndex = e2.lastIndex, r2) : "[object DataView]" === s2 ? new e2.constructor(klona(e2.buffer)) : "[object ArrayBuffer]" === s2 ? e2.slice(0) : "Array]" === s2.slice(-6) ? new e2.constructor(e2) : e2;
    }
    __name(klona, "klona");
    const lr = Sn({ nuxt: {} }), pr = /\d/, ur = ["-", "_", "/", "."];
    function isUppercase(e2 = "") {
      if (!pr.test(e2))
        return e2 !== e2.toLowerCase();
    }
    __name(isUppercase, "isUppercase");
    function kebabCase(e2, t2) {
      return e2 ? (Array.isArray(e2) ? e2 : function(e3) {
        const t3 = ur, r2 = [];
        if (!e3 || "string" != typeof e3)
          return r2;
        let s2, a2, c2 = "";
        for (const p2 of e3) {
          const e4 = t3.includes(p2);
          if (true === e4) {
            r2.push(c2), c2 = "", s2 = void 0;
            continue;
          }
          const u2 = isUppercase(p2);
          if (false === a2) {
            if (false === s2 && true === u2) {
              r2.push(c2), c2 = p2, s2 = u2;
              continue;
            }
            if (true === s2 && false === u2 && c2.length > 1) {
              const e5 = c2.at(-1);
              r2.push(c2.slice(0, Math.max(0, c2.length - 1))), c2 = e5 + p2, s2 = u2;
              continue;
            }
          }
          c2 += p2, s2 = u2, a2 = e4;
        }
        return r2.push(c2), r2;
      }(e2)).map((e3) => e3.toLowerCase()).join(t2) : "";
    }
    __name(kebabCase, "kebabCase");
    function getEnv(e2, t2) {
      const r2 = (s2 = e2, kebabCase(s2 || "", "_")).toUpperCase();
      var s2;
      return destr(J.env[t2.prefix + r2] ?? J.env[t2.altPrefix + r2]);
    }
    __name(getEnv, "getEnv");
    function _isObject(e2) {
      return "object" == typeof e2 && !Array.isArray(e2);
    }
    __name(_isObject, "_isObject");
    function applyEnv(e2, t2, r2 = "") {
      for (const s2 in e2) {
        const a2 = r2 ? `${r2}_${s2}` : s2, c2 = getEnv(a2, t2);
        _isObject(e2[s2]) ? _isObject(c2) ? (e2[s2] = { ...e2[s2], ...c2 }, applyEnv(e2[s2], t2, a2)) : void 0 === c2 ? applyEnv(e2[s2], t2, a2) : e2[s2] = c2 ?? e2[s2] : e2[s2] = c2 ?? e2[s2], t2.envExpansion && "string" == typeof e2[s2] && (e2[s2] = _expandFromEnv(e2[s2]));
      }
      return e2;
    }
    __name(applyEnv, "applyEnv");
    const dr = /\{\{([^{}]*)\}\}/g;
    function _expandFromEnv(e2) {
      return e2.replace(dr, (e3, t2) => J.env[t2] || e3);
    }
    __name(_expandFromEnv, "_expandFromEnv");
    const fr = { app: { baseURL: "/", buildId: "5fecc557-0e75-444a-a389-6180e781cdcf", buildAssetsDir: "/_nuxt/", cdnURL: "" }, nitro: { envPrefix: "NUXT_", routeRules: { "/__nuxt_error": { cache: false }, "/_nuxt/builds/meta/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } }, "/_nuxt/builds/**": { headers: { "cache-control": "public, max-age=1, immutable" } }, "/_nuxt/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } } } }, public: {} }, hr = { prefix: "NITRO_", altPrefix: fr.nitro.envPrefix ?? J.env.NITRO_ENV_PREFIX ?? "_", envExpansion: fr.nitro.envExpansion ?? J.env.NITRO_ENV_EXPANSION ?? false }, mr = _deepFreeze(applyEnv(klona(fr), hr));
    function useRuntimeConfig$1(e2) {
      if (!e2)
        return mr;
      if (e2.context.nitro.runtimeConfig)
        return e2.context.nitro.runtimeConfig;
      const t2 = klona(fr);
      return applyEnv(t2, hr), e2.context.nitro.runtimeConfig = t2, t2;
    }
    __name(useRuntimeConfig$1, "useRuntimeConfig$1");
    function _deepFreeze(e2) {
      const t2 = Object.getOwnPropertyNames(e2);
      for (const r2 of t2) {
        const t3 = e2[r2];
        t3 && "object" == typeof t3 && _deepFreeze(t3);
      }
      return Object.freeze(e2);
    }
    __name(_deepFreeze, "_deepFreeze");
    _deepFreeze(klona(lr)), new Proxy(/* @__PURE__ */ Object.create(null), { get: (e2, t2) => {
      console.warn("Please use `useRuntimeConfig()` instead of accessing config directly.");
      const r2 = useRuntimeConfig$1();
      if (t2 in r2)
        return r2[t2];
    } });
    const gr = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : void 0 !== Fn ? Fn : {}, vr = "__unctx__", yr = gr[vr] || (gr[vr] = function(e2 = {}) {
      const t2 = {};
      return { get: (r2, s2 = {}) => (t2[r2] || (t2[r2] = function(e3 = {}) {
        let t3, r3 = false;
        const checkConflict = /* @__PURE__ */ __name((e4) => {
          if (t3 && t3 !== e4)
            throw new Error("Context conflict");
        }, "checkConflict");
        let s3;
        if (e3.asyncContext) {
          const t4 = e3.AsyncLocalStorage || globalThis.AsyncLocalStorage;
          t4 ? s3 = new t4() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
        }
        const _getCurrentInstance = /* @__PURE__ */ __name(() => {
          if (s3) {
            const e4 = s3.getStore();
            if (void 0 !== e4)
              return e4;
          }
          return t3;
        }, "_getCurrentInstance");
        return { use: () => {
          const e4 = _getCurrentInstance();
          if (void 0 === e4)
            throw new Error("Context is not available");
          return e4;
        }, tryUse: () => _getCurrentInstance(), set: (e4, s4) => {
          s4 || checkConflict(e4), t3 = e4, r3 = true;
        }, unset: () => {
          t3 = void 0, r3 = false;
        }, call: (e4, a2) => {
          checkConflict(e4), t3 = e4;
          try {
            return s3 ? s3.run(e4, a2) : a2();
          } finally {
            r3 || (t3 = void 0);
          }
        }, async callAsync(e4, a2) {
          t3 = e4;
          const onRestore = /* @__PURE__ */ __name(() => {
            t3 = e4;
          }, "onRestore"), onLeave = /* @__PURE__ */ __name(() => t3 === e4 ? onRestore : void 0, "onLeave");
          xr.add(onLeave);
          try {
            const c2 = s3 ? s3.run(e4, a2) : a2();
            return r3 || (t3 = void 0), await c2;
          } finally {
            xr.delete(onLeave);
          }
        } };
      }({ ...e2, ...s2 })), t2[r2]) };
    }()), getContext$1 = /* @__PURE__ */ __name((e2, t2 = {}) => yr.get(e2, t2), "getContext$1"), br = "__unctx_async_handlers__", xr = gr[br] || (gr[br] = /* @__PURE__ */ new Set());
    getContext$1("nitro-app", { asyncContext: false, AsyncLocalStorage: void 0 });
    const _r = toRouteMatcher(createRouter$1({ routes: useRuntimeConfig$1().nitro.routeRules }));
    function createRouteRulesHandler(e2) {
      return Dn((t2) => {
        const r2 = getRouteRules$1(t2);
        if (r2.headers && $n(t2, r2.headers), r2.redirect) {
          let e3 = r2.redirect.to;
          if (e3.endsWith("/**")) {
            let s2 = t2.path;
            const a2 = r2.redirect._redirectStripBase;
            a2 && (s2 = withoutBase(s2, a2)), e3 = joinURL(e3.slice(0, -3), s2);
          } else if (t2.path.includes("?")) {
            e3 = withQuery(e3, getQuery$1(t2.path));
          }
          return function(e4, t3, r3 = 302) {
            return e4.node.res.statusCode = sanitizeStatusCode(r3, e4.node.res.statusCode), e4.node.res.setHeader("location", t3), send(e4, `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${t3.replace(/"/g, "%22")}"></head></html>`, Pn.html);
          }(t2, e3, r2.redirect.statusCode);
        }
        if (r2.proxy) {
          let s2 = r2.proxy.to;
          if (s2.endsWith("/**")) {
            let e3 = t2.path;
            const a2 = r2.proxy._proxyStripBase;
            a2 && (e3 = withoutBase(e3, a2)), s2 = joinURL(s2.slice(0, -3), e3);
          } else if (t2.path.includes("?")) {
            s2 = withQuery(s2, getQuery$1(t2.path));
          }
          return proxyRequest(t2, s2, { fetch: e2.localFetch, ...r2.proxy });
        }
      });
    }
    __name(createRouteRulesHandler, "createRouteRulesHandler");
    function getRouteRules$1(e2) {
      return e2.context._nitro = e2.context._nitro || {}, e2.context._nitro.routeRules || (e2.context._nitro.routeRules = getRouteRulesForPath(withoutBase(e2.path.split("?")[0], useRuntimeConfig$1().app.baseURL))), e2.context._nitro.routeRules;
    }
    __name(getRouteRules$1, "getRouteRules$1");
    function getRouteRulesForPath(e2) {
      return wn({}, ..._r.matchAll(e2).reverse());
    }
    __name(getRouteRulesForPath, "getRouteRulesForPath");
    const Er = /post|put|patch/i;
    function joinHeaders(e2) {
      return Array.isArray(e2) ? e2.join(", ") : String(e2);
    }
    __name(joinHeaders, "joinHeaders");
    function normalizeCookieHeader(e2 = "") {
      return splitCookiesString(joinHeaders(e2));
    }
    __name(normalizeCookieHeader, "normalizeCookieHeader");
    function normalizeCookieHeaders(e2) {
      const t2 = new Headers();
      for (const [r2, s2] of e2)
        if ("set-cookie" === r2)
          for (const e3 of normalizeCookieHeader(s2))
            t2.append("set-cookie", e3);
        else
          t2.set(r2, joinHeaders(s2));
      return t2;
    }
    __name(normalizeCookieHeaders, "normalizeCookieHeaders");
    function hasReqHeader(e2, t2, r2) {
      const s2 = function(e3, t3) {
        return getRequestHeaders(e3)[t3.toLowerCase()];
      }(e2, t2);
      return s2 && "string" == typeof s2 && s2.toLowerCase().includes(r2);
    }
    __name(hasReqHeader, "hasReqHeader");
    function defaultHandler(e2, t2, r2) {
      const s2 = e2.unhandled || e2.fatal, a2 = e2.statusCode || 500, c2 = e2.statusMessage || "Server Error", p2 = function(e3, t3 = {}) {
        const r3 = function(e4, t4 = {}) {
          if (t4.xForwardedHost) {
            const t5 = e4.node.req.headers["x-forwarded-host"], r4 = (t5 || "").split(",").shift()?.trim();
            if (r4)
              return r4;
          }
          return e4.node.req.headers.host || "localhost";
        }(e3, t3), s3 = function(e4, t4 = {}) {
          return false !== t4.xForwardedProto && "https" === e4.node.req.headers["x-forwarded-proto"] || e4.node.req.connection?.encrypted ? "https" : "http";
        }(e3, t3), a3 = (e3.node.req.originalUrl || e3.path).replace(/^[/\\]+/g, "/");
        return new URL(a3, `${s3}://${r3}`);
      }(t2, { xForwardedHost: true, xForwardedProto: true });
      if (404 === a2) {
        const e3 = "/";
        if (/^\/[^/]/.test(e3) && !p2.pathname.startsWith(e3)) {
          return { status: 302, statusText: "Found", headers: { location: `${e3}${p2.pathname.slice(1)}${p2.search}` }, body: "Redirecting..." };
        }
      }
      if (s2 && !r2?.silent) {
        const r3 = [e2.unhandled && "[unhandled]", e2.fatal && "[fatal]"].filter(Boolean).join(" ");
        console.error(`[request error] ${r3} [${t2.method}] ${p2}
`, e2);
      }
      const u2 = { "content-type": "application/json", "x-content-type-options": "nosniff", "x-frame-options": "DENY", "referrer-policy": "no-referrer", "content-security-policy": "script-src 'none'; frame-ancestors 'none';" };
      setResponseStatus(t2, a2, c2), 404 !== a2 && function(e3, t3) {
        return e3.node.res.getHeader(t3);
      }(t2, "cache-control") || (u2["cache-control"] = "no-cache");
      return { status: a2, statusText: c2, headers: u2, body: { error: true, url: p2.href, statusCode: a2, statusMessage: c2, message: s2 ? "Server Error" : e2.message, data: s2 ? void 0 : e2.data } };
    }
    __name(defaultHandler, "defaultHandler");
    const wr = [async function(e2, t2, { defaultHandler: r2 }) {
      if (t2.handled || function(e3) {
        return !hasReqHeader(e3, "accept", "text/html") && (hasReqHeader(e3, "accept", "application/json") || hasReqHeader(e3, "user-agent", "curl/") || hasReqHeader(e3, "user-agent", "httpie/") || hasReqHeader(e3, "sec-fetch-mode", "cors") || e3.path.startsWith("/api/") || e3.path.endsWith(".json"));
      }(t2))
        return;
      const s2 = await r2(e2, t2, { json: true });
      if (404 === (e2.statusCode || 500) && 302 === s2.status)
        return setResponseHeaders(t2, s2.headers), setResponseStatus(t2, s2.status, s2.statusText), send(t2, JSON.stringify(s2.body, null, 2));
      const a2 = s2.body, c2 = new URL(a2.url);
      a2.url = withoutBase(c2.pathname, useRuntimeConfig$1(t2).app.baseURL) + c2.search + c2.hash, a2.message ||= "Server Error", a2.data ||= e2.data, a2.statusMessage ||= e2.statusMessage, delete s2.headers["content-type"], delete s2.headers["content-security-policy"], setResponseHeaders(t2, s2.headers);
      const p2 = getRequestHeaders(t2), u2 = t2.path.startsWith("/__nuxt_error") || !!p2["x-nuxt-error"] ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig$1(t2).app.baseURL, "/__nuxt_error"), a2), { headers: { ...p2, "x-nuxt-error": "true" }, redirect: "manual" }).catch(() => null);
      if (t2.handled)
        return;
      if (!u2) {
        const { template: e3 } = await Promise.resolve().then(function() {
          return Eo;
        });
        return setResponseHeader(t2, "Content-Type", "text/html;charset=UTF-8"), send(t2, e3(a2));
      }
      const d2 = await u2.text();
      for (const [e3, r3] of u2.headers.entries())
        "set-cookie" !== e3 ? setResponseHeader(t2, e3, r3) : appendResponseHeader(t2, e3, r3);
      return setResponseStatus(t2, u2.status && 200 !== u2.status ? u2.status : s2.status, u2.statusText || s2.statusText), send(t2, d2);
    }, function(e2, t2) {
      const r2 = defaultHandler(e2, t2);
      return setResponseHeaders(t2, r2.headers), setResponseStatus(t2, r2.status, r2.statusText), send(t2, JSON.stringify(r2.body, null, 2));
    }];
    const Sr = [], _lazy_ZxWZCL = /* @__PURE__ */ __name(() => Promise.resolve().then(function() {
      return sc;
    }), "_lazy_ZxWZCL"), Tr = [{ route: "/__nuxt_error", handler: _lazy_ZxWZCL, lazy: true, middleware: false, method: void 0 }, { route: "/__nuxt_island/**", handler: defineEventHandler(() => {
    }), lazy: false, middleware: false, method: void 0 }, { route: "/**", handler: _lazy_ZxWZCL, lazy: true, middleware: false, method: void 0 }];
    const Cr = function() {
      const e2 = useRuntimeConfig$1(), t2 = createHooks(), captureError = /* @__PURE__ */ __name((e3, r3 = {}) => {
        const s3 = t2.callHookParallel("error", e3, r3).catch((e4) => {
          console.error("Error while capturing another error", e4);
        });
        if (r3.event && isEvent(r3.event)) {
          const t3 = r3.event.context.nitro?.errors;
          t3 && t3.push({ error: e3, context: r3 }), r3.event.waitUntil && r3.event.waitUntil(s3);
        }
      }, "captureError"), r2 = createApp$1({ debug: destr(false), onError: (e3, t3) => (captureError(e3, { event: t3, tags: ["request"] }), async function(e4, t4) {
        for (const r3 of wr)
          try {
            if (await r3(e4, t4, { defaultHandler }), t4.handled)
              return;
          } catch (e5) {
            console.error(e5);
          }
      }(e3, t3)), onRequest: async (e3) => {
        e3.context.nitro = e3.context.nitro || { errors: [] };
        const t3 = e3.node.req?.__unenv__;
        t3?._platform && (e3.context = { _platform: t3?._platform, ...t3._platform, ...e3.context }), !e3.context.waitUntil && t3?.waitUntil && (e3.context.waitUntil = t3.waitUntil), e3.fetch = (t4, r3) => fetchWithEvent(e3, t4, r3, { fetch: localFetch }), e3.$fetch = (t4, r3) => fetchWithEvent(e3, t4, r3, { fetch: c2 }), e3.waitUntil = (t4) => {
          e3.context.nitro._waitUntilPromises || (e3.context.nitro._waitUntilPromises = []), e3.context.nitro._waitUntilPromises.push(t4), e3.context.waitUntil && e3.context.waitUntil(t4);
        }, e3.captureError = (t4, r3) => {
          captureError(t4, { event: e3, ...r3 });
        }, await Cr.hooks.callHook("request", e3).catch((t4) => {
          captureError(t4, { event: e3, tags: ["request"] });
        });
      }, onBeforeResponse: async (e3, t3) => {
        await Cr.hooks.callHook("beforeResponse", e3, t3).catch((t4) => {
          captureError(t4, { event: e3, tags: ["request", "response"] });
        });
      }, onAfterResponse: async (e3, t3) => {
        await Cr.hooks.callHook("afterResponse", e3, t3).catch((t4) => {
          captureError(t4, { event: e3, tags: ["request", "response"] });
        });
      } }), s2 = function(e3 = {}) {
        const t3 = createRouter$1({}), r3 = {};
        let s3;
        const a3 = {}, addRoute = /* @__PURE__ */ __name((e4, s4, c4) => {
          let p2 = r3[e4];
          if (p2 || (r3[e4] = p2 = { path: e4, handlers: {} }, t3.insert(e4, p2)), Array.isArray(c4))
            for (const t4 of c4)
              addRoute(e4, s4, t4);
          else
            p2.handlers[c4] = toEventHandler(s4, 0, e4);
          return a3;
        }, "addRoute");
        a3.use = a3.add = (e4, t4, r4) => addRoute(e4, t4, r4 || "all");
        for (const e4 of Hn)
          a3[e4] = (t4, r4) => a3.add(t4, r4, e4);
        const matchHandler = /* @__PURE__ */ __name((e4 = "/", r4 = "get") => {
          const a4 = e4.indexOf("?");
          -1 !== a4 && (e4 = e4.slice(0, Math.max(0, a4)));
          const c4 = t3.lookup(e4);
          if (!c4 || !c4.handlers)
            return { error: createError$1({ statusCode: 404, name: "Not Found", statusMessage: `Cannot find any route matching ${e4 || "/"}.` }) };
          let p2 = c4.handlers[r4] || c4.handlers.all;
          if (!p2) {
            s3 || (s3 = toRouteMatcher(t3));
            const a5 = s3.matchAll(e4).reverse();
            for (const e5 of a5) {
              if (e5.handlers[r4]) {
                p2 = e5.handlers[r4], c4.handlers[r4] = c4.handlers[r4] || p2;
                break;
              }
              if (e5.handlers.all) {
                p2 = e5.handlers.all, c4.handlers.all = c4.handlers.all || p2;
                break;
              }
            }
          }
          return p2 ? { matched: c4, handler: p2 } : { error: createError$1({ statusCode: 405, name: "Method Not Allowed", statusMessage: `Method ${r4} is not allowed on this route.` }) };
        }, "matchHandler"), c3 = e3.preemptive || e3.preemtive;
        return a3.handler = Dn((e4) => {
          const t4 = matchHandler(e4.path, e4.method.toLowerCase());
          if ("error" in t4) {
            if (c3)
              throw t4.error;
            return;
          }
          e4.context.matchedRoute = t4.matched;
          const r4 = t4.matched.params || {};
          return e4.context.params = r4, Promise.resolve(t4.handler(e4)).then((e5) => void 0 === e5 && c3 ? null : e5);
        }), a3.handler.__resolve__ = async (e4) => {
          e4 = withLeadingSlash(e4);
          const t4 = matchHandler(e4);
          if ("error" in t4)
            return;
          let r4 = { route: t4.matched.path, handler: t4.handler };
          if (t4.handler.__resolve__) {
            const s4 = await t4.handler.__resolve__(e4);
            if (!s4)
              return;
            r4 = { ...r4, ...s4 };
          }
          return r4;
        }, a3;
      }({ preemptive: true }), a2 = toNodeListener(r2), localFetch = /* @__PURE__ */ __name((e3, t3) => e3.toString().startsWith("/") ? async function(e4, t4, r3 = {}) {
        try {
          const s3 = await b(e4, { url: t4, ...r3 });
          return new Response(s3.body, { status: s3.status, statusText: s3.statusText, headers: v(s3.headers) });
        } catch (e5) {
          return new Response(e5.toString(), { status: Number.parseInt(e5.statusCode || e5.code) || 500, statusText: e5.statusText });
        }
      }(a2, e3, t3).then((e4) => function(e5) {
        return e5.headers.has("set-cookie") ? new Response(e5.body, { status: e5.status, statusText: e5.statusText, headers: normalizeCookieHeaders(e5.headers) }) : e5;
      }(e4)) : globalThis.fetch(e3, t3), "localFetch"), c2 = createFetch({ fetch: localFetch, Headers: Yn, defaults: { baseURL: e2.app.baseURL } });
      globalThis.$fetch = c2, r2.use(createRouteRulesHandler({ localFetch }));
      for (const t3 of Tr) {
        let a3 = t3.lazy ? lazyEventHandler(t3.handler) : t3.handler;
        if (t3.middleware || !t3.route) {
          const s3 = (e2.app.baseURL + (t3.route || "/")).replace(/\/+/g, "/");
          r2.use(s3, a3);
        } else {
          const e3 = getRouteRulesForPath(t3.route.replace(/:\w+|\*\*/g, "_"));
          e3.cache && (a3 = cachedEventHandler(a3, { group: "nitro/routes", ...e3.cache })), s2.use(t3.route, a3, t3.method);
        }
      }
      return r2.use(e2.app.baseURL, s2.handler), { hooks: t2, h3App: r2, router: s2, localCall: (e3) => b(a2, e3), localFetch, captureError };
    }();
    function useNitroApp() {
      return Cr;
    }
    __name(useNitroApp, "useNitroApp");
    !function(e2) {
      for (const t2 of Sr)
        try {
          t2(e2);
        } catch (t3) {
          throw e2.captureError(t3, { tags: ["plugin"] }), t3;
        }
    }(Cr);
    let kr = /* @__PURE__ */ __name(class extends _EventEmitter {
      __unenv__ = {};
      maxFreeSockets = 256;
      maxSockets = 1 / 0;
      maxTotalSockets = 1 / 0;
      freeSockets = {};
      sockets = {};
      requests = {};
      options;
      constructor(e2 = {}) {
        super(), this.options = e2;
      }
      destroy() {
      }
    }, "kr");
    new kr();
    const Rr = kr, Ar = { "/_nuxt/builds/meta/": { maxAge: 31536e3 }, "/_nuxt/builds/": { maxAge: 1 }, "/_nuxt/": { maxAge: 31536e3 } };
    var Nr = {};
    function Mime$1() {
      this._types = /* @__PURE__ */ Object.create(null), this._extensions = /* @__PURE__ */ Object.create(null);
      for (let e2 = 0; e2 < arguments.length; e2++)
        this.define(arguments[e2]);
      this.define = this.define.bind(this), this.getType = this.getType.bind(this), this.getExtension = this.getExtension.bind(this);
    }
    __name(Mime$1, "Mime$1");
    Mime$1.prototype.define = function(e2, t2) {
      for (let r2 in e2) {
        let s2 = e2[r2].map(function(e3) {
          return e3.toLowerCase();
        });
        r2 = r2.toLowerCase();
        for (let e3 = 0; e3 < s2.length; e3++) {
          const a2 = s2[e3];
          if ("*" !== a2[0]) {
            if (!t2 && a2 in this._types)
              throw new Error('Attempt to change mapping for "' + a2 + '" extension from "' + this._types[a2] + '" to "' + r2 + '". Pass `force=true` to allow this, otherwise remove "' + a2 + '" from the list of extensions for "' + r2 + '".');
            this._types[a2] = r2;
          }
        }
        if (t2 || !this._extensions[r2]) {
          const e3 = s2[0];
          this._extensions[r2] = "*" !== e3[0] ? e3 : e3.substr(1);
        }
      }
    }, Mime$1.prototype.getType = function(e2) {
      let t2 = (e2 = String(e2)).replace(/^.*[/\\]/, "").toLowerCase(), r2 = t2.replace(/^.*\./, "").toLowerCase(), s2 = t2.length < e2.length;
      return (r2.length < t2.length - 1 || !s2) && this._types[r2] || null;
    }, Mime$1.prototype.getExtension = function(e2) {
      return (e2 = /^\s*([^;\s]*)/.test(e2) && RegExp.$1) && this._extensions[e2.toLowerCase()] || null;
    };
    var Or = new Mime$1({ "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomdeleted+xml": ["atomdeleted"], "application/atomsvc+xml": ["atomsvc"], "application/atsc-dwd+xml": ["dwd"], "application/atsc-held+xml": ["held"], "application/atsc-rsat+xml": ["rsat"], "application/bdoc": ["bdoc"], "application/calendar+xml": ["xcs"], "application/ccxml+xml": ["ccxml"], "application/cdfx+xml": ["cdfx"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["es", "ecma"], "application/emma+xml": ["emma"], "application/emotionml+xml": ["emotionml"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/express": ["exp"], "application/fdt+xml": ["fdt"], "application/font-tdpfr": ["pfr"], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hjson": ["hjson"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/its+xml": ["its"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lgr+xml": ["lgr"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mmt-aei+xml": ["maei"], "application/mmt-usd+xml": ["musd"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/n-quads": ["nq"], "application/n-triples": ["nt"], "application/node": ["cjs"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/p2p-overlay+xml": ["relo"], "application/patch-ops-error+xml": ["xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/provenance+xml": ["provx"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf", "owl"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/route-apd+xml": ["rapd"], "application/route-s-tsid+xml": ["sls"], "application/route-usd+xml": ["rusd"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/senml+xml": ["senmlx"], "application/sensml+xml": ["sensmlx"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/sieve": ["siv", "sieve"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/swid+xml": ["swidtag"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/toml": ["toml"], "application/trig": ["trig"], "application/ttml+xml": ["ttml"], "application/ubjson": ["ubj"], "application/urc-ressheet+xml": ["rsheet"], "application/urc-targetdesc+xml": ["td"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/xaml+xml": ["xaml"], "application/xcap-att+xml": ["xav"], "application/xcap-caps+xml": ["xca"], "application/xcap-diff+xml": ["xdf"], "application/xcap-el+xml": ["xel"], "application/xcap-ns+xml": ["xns"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xliff+xml": ["xlf"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["*xsl", "xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": ["*3gpp"], "audio/adpcm": ["adp"], "audio/amr": ["amr"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mobile-xmf": ["mxmf"], "audio/mp3": ["*mp3"], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx", "opus"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/wav": ["wav"], "audio/wave": ["*wav"], "audio/webm": ["weba"], "audio/xm": ["xm"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/aces": ["exr"], "image/apng": ["apng"], "image/avif": ["avif"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/dicom-rle": ["drle"], "image/emf": ["emf"], "image/fits": ["fits"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/heic": ["heic"], "image/heic-sequence": ["heics"], "image/heif": ["heif"], "image/heif-sequence": ["heifs"], "image/hej2k": ["hej2"], "image/hsj2": ["hsj2"], "image/ief": ["ief"], "image/jls": ["jls"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jph": ["jph"], "image/jphc": ["jhc"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/jxr": ["jxr"], "image/jxra": ["jxra"], "image/jxrs": ["jxrs"], "image/jxs": ["jxs"], "image/jxsc": ["jxsc"], "image/jxsi": ["jxsi"], "image/jxss": ["jxss"], "image/ktx": ["ktx"], "image/ktx2": ["ktx2"], "image/png": ["png"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/t38": ["t38"], "image/tiff": ["tif", "tiff"], "image/tiff-fx": ["tfx"], "image/webp": ["webp"], "image/wmf": ["wmf"], "message/disposition-notification": ["disposition-notification"], "message/global": ["u8msg"], "message/global-delivery-status": ["u8dsn"], "message/global-disposition-notification": ["u8mdn"], "message/global-headers": ["u8hdr"], "message/rfc822": ["eml", "mime"], "model/3mf": ["3mf"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/mtl": ["mtl"], "model/obj": ["obj"], "model/step+xml": ["stpx"], "model/step+zip": ["stpz"], "model/step-xml+zip": ["stpxz"], "model/stl": ["stl"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["*x3db", "x3dbz"], "model/x3d+fastinfoset": ["x3db"], "model/x3d+vrml": ["*x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "model/x3d-vrml": ["x3dv"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/mdx": ["mdx"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/richtext": ["rtx"], "text/rtf": ["*rtf"], "text/sgml": ["sgml", "sgm"], "text/shex": ["shex"], "text/slim": ["slim", "slm"], "text/spdx": ["spdx"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vtt": ["vtt"], "text/xml": ["*xml"], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/iso.segment": ["m4s"], "video/jpeg": ["jpgv"], "video/jpm": ["*jpm", "jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/webm": ["webm"] }, { "application/prs.cww": ["cww"], "application/vnd.1000minds.decision-model+xml": ["1km"], "application/vnd.3gpp.pic-bw-large": ["plb"], "application/vnd.3gpp.pic-bw-small": ["psb"], "application/vnd.3gpp.pic-bw-var": ["pvb"], "application/vnd.3gpp2.tcap": ["tcap"], "application/vnd.3m.post-it-notes": ["pwn"], "application/vnd.accpac.simply.aso": ["aso"], "application/vnd.accpac.simply.imp": ["imp"], "application/vnd.acucobol": ["acu"], "application/vnd.acucorp": ["atc", "acutc"], "application/vnd.adobe.air-application-installer-package+zip": ["air"], "application/vnd.adobe.formscentral.fcdt": ["fcdt"], "application/vnd.adobe.fxp": ["fxp", "fxpl"], "application/vnd.adobe.xdp+xml": ["xdp"], "application/vnd.adobe.xfdf": ["xfdf"], "application/vnd.ahead.space": ["ahead"], "application/vnd.airzip.filesecure.azf": ["azf"], "application/vnd.airzip.filesecure.azs": ["azs"], "application/vnd.amazon.ebook": ["azw"], "application/vnd.americandynamics.acc": ["acc"], "application/vnd.amiga.ami": ["ami"], "application/vnd.android.package-archive": ["apk"], "application/vnd.anser-web-certificate-issue-initiation": ["cii"], "application/vnd.anser-web-funds-transfer-initiation": ["fti"], "application/vnd.antix.game-component": ["atx"], "application/vnd.apple.installer+xml": ["mpkg"], "application/vnd.apple.keynote": ["key"], "application/vnd.apple.mpegurl": ["m3u8"], "application/vnd.apple.numbers": ["numbers"], "application/vnd.apple.pages": ["pages"], "application/vnd.apple.pkpass": ["pkpass"], "application/vnd.aristanetworks.swi": ["swi"], "application/vnd.astraea-software.iota": ["iota"], "application/vnd.audiograph": ["aep"], "application/vnd.balsamiq.bmml+xml": ["bmml"], "application/vnd.blueice.multipass": ["mpm"], "application/vnd.bmi": ["bmi"], "application/vnd.businessobjects": ["rep"], "application/vnd.chemdraw+xml": ["cdxml"], "application/vnd.chipnuts.karaoke-mmd": ["mmd"], "application/vnd.cinderella": ["cdy"], "application/vnd.citationstyles.style+xml": ["csl"], "application/vnd.claymore": ["cla"], "application/vnd.cloanto.rp9": ["rp9"], "application/vnd.clonk.c4group": ["c4g", "c4d", "c4f", "c4p", "c4u"], "application/vnd.cluetrust.cartomobile-config": ["c11amc"], "application/vnd.cluetrust.cartomobile-config-pkg": ["c11amz"], "application/vnd.commonspace": ["csp"], "application/vnd.contact.cmsg": ["cdbcmsg"], "application/vnd.cosmocaller": ["cmc"], "application/vnd.crick.clicker": ["clkx"], "application/vnd.crick.clicker.keyboard": ["clkk"], "application/vnd.crick.clicker.palette": ["clkp"], "application/vnd.crick.clicker.template": ["clkt"], "application/vnd.crick.clicker.wordbank": ["clkw"], "application/vnd.criticaltools.wbs+xml": ["wbs"], "application/vnd.ctc-posml": ["pml"], "application/vnd.cups-ppd": ["ppd"], "application/vnd.curl.car": ["car"], "application/vnd.curl.pcurl": ["pcurl"], "application/vnd.dart": ["dart"], "application/vnd.data-vision.rdz": ["rdz"], "application/vnd.dbf": ["dbf"], "application/vnd.dece.data": ["uvf", "uvvf", "uvd", "uvvd"], "application/vnd.dece.ttml+xml": ["uvt", "uvvt"], "application/vnd.dece.unspecified": ["uvx", "uvvx"], "application/vnd.dece.zip": ["uvz", "uvvz"], "application/vnd.denovo.fcselayout-link": ["fe_launch"], "application/vnd.dna": ["dna"], "application/vnd.dolby.mlp": ["mlp"], "application/vnd.dpgraph": ["dpg"], "application/vnd.dreamfactory": ["dfac"], "application/vnd.ds-keypoint": ["kpxx"], "application/vnd.dvb.ait": ["ait"], "application/vnd.dvb.service": ["svc"], "application/vnd.dynageo": ["geo"], "application/vnd.ecowin.chart": ["mag"], "application/vnd.enliven": ["nml"], "application/vnd.epson.esf": ["esf"], "application/vnd.epson.msf": ["msf"], "application/vnd.epson.quickanime": ["qam"], "application/vnd.epson.salt": ["slt"], "application/vnd.epson.ssf": ["ssf"], "application/vnd.eszigno3+xml": ["es3", "et3"], "application/vnd.ezpix-album": ["ez2"], "application/vnd.ezpix-package": ["ez3"], "application/vnd.fdf": ["fdf"], "application/vnd.fdsn.mseed": ["mseed"], "application/vnd.fdsn.seed": ["seed", "dataless"], "application/vnd.flographit": ["gph"], "application/vnd.fluxtime.clip": ["ftc"], "application/vnd.framemaker": ["fm", "frame", "maker", "book"], "application/vnd.frogans.fnc": ["fnc"], "application/vnd.frogans.ltf": ["ltf"], "application/vnd.fsc.weblaunch": ["fsc"], "application/vnd.fujitsu.oasys": ["oas"], "application/vnd.fujitsu.oasys2": ["oa2"], "application/vnd.fujitsu.oasys3": ["oa3"], "application/vnd.fujitsu.oasysgp": ["fg5"], "application/vnd.fujitsu.oasysprs": ["bh2"], "application/vnd.fujixerox.ddd": ["ddd"], "application/vnd.fujixerox.docuworks": ["xdw"], "application/vnd.fujixerox.docuworks.binder": ["xbd"], "application/vnd.fuzzysheet": ["fzs"], "application/vnd.genomatix.tuxedo": ["txd"], "application/vnd.geogebra.file": ["ggb"], "application/vnd.geogebra.tool": ["ggt"], "application/vnd.geometry-explorer": ["gex", "gre"], "application/vnd.geonext": ["gxt"], "application/vnd.geoplan": ["g2w"], "application/vnd.geospace": ["g3w"], "application/vnd.gmx": ["gmx"], "application/vnd.google-apps.document": ["gdoc"], "application/vnd.google-apps.presentation": ["gslides"], "application/vnd.google-apps.spreadsheet": ["gsheet"], "application/vnd.google-earth.kml+xml": ["kml"], "application/vnd.google-earth.kmz": ["kmz"], "application/vnd.grafeq": ["gqf", "gqs"], "application/vnd.groove-account": ["gac"], "application/vnd.groove-help": ["ghf"], "application/vnd.groove-identity-message": ["gim"], "application/vnd.groove-injector": ["grv"], "application/vnd.groove-tool-message": ["gtm"], "application/vnd.groove-tool-template": ["tpl"], "application/vnd.groove-vcard": ["vcg"], "application/vnd.hal+xml": ["hal"], "application/vnd.handheld-entertainment+xml": ["zmm"], "application/vnd.hbci": ["hbci"], "application/vnd.hhe.lesson-player": ["les"], "application/vnd.hp-hpgl": ["hpgl"], "application/vnd.hp-hpid": ["hpid"], "application/vnd.hp-hps": ["hps"], "application/vnd.hp-jlyt": ["jlt"], "application/vnd.hp-pcl": ["pcl"], "application/vnd.hp-pclxl": ["pclxl"], "application/vnd.hydrostatix.sof-data": ["sfd-hdstx"], "application/vnd.ibm.minipay": ["mpy"], "application/vnd.ibm.modcap": ["afp", "listafp", "list3820"], "application/vnd.ibm.rights-management": ["irm"], "application/vnd.ibm.secure-container": ["sc"], "application/vnd.iccprofile": ["icc", "icm"], "application/vnd.igloader": ["igl"], "application/vnd.immervision-ivp": ["ivp"], "application/vnd.immervision-ivu": ["ivu"], "application/vnd.insors.igm": ["igm"], "application/vnd.intercon.formnet": ["xpw", "xpx"], "application/vnd.intergeo": ["i2g"], "application/vnd.intu.qbo": ["qbo"], "application/vnd.intu.qfx": ["qfx"], "application/vnd.ipunplugged.rcprofile": ["rcprofile"], "application/vnd.irepository.package+xml": ["irp"], "application/vnd.is-xpr": ["xpr"], "application/vnd.isac.fcs": ["fcs"], "application/vnd.jam": ["jam"], "application/vnd.jcp.javame.midlet-rms": ["rms"], "application/vnd.jisp": ["jisp"], "application/vnd.joost.joda-archive": ["joda"], "application/vnd.kahootz": ["ktz", "ktr"], "application/vnd.kde.karbon": ["karbon"], "application/vnd.kde.kchart": ["chrt"], "application/vnd.kde.kformula": ["kfo"], "application/vnd.kde.kivio": ["flw"], "application/vnd.kde.kontour": ["kon"], "application/vnd.kde.kpresenter": ["kpr", "kpt"], "application/vnd.kde.kspread": ["ksp"], "application/vnd.kde.kword": ["kwd", "kwt"], "application/vnd.kenameaapp": ["htke"], "application/vnd.kidspiration": ["kia"], "application/vnd.kinar": ["kne", "knp"], "application/vnd.koan": ["skp", "skd", "skt", "skm"], "application/vnd.kodak-descriptor": ["sse"], "application/vnd.las.las+xml": ["lasxml"], "application/vnd.llamagraphics.life-balance.desktop": ["lbd"], "application/vnd.llamagraphics.life-balance.exchange+xml": ["lbe"], "application/vnd.lotus-1-2-3": ["123"], "application/vnd.lotus-approach": ["apr"], "application/vnd.lotus-freelance": ["pre"], "application/vnd.lotus-notes": ["nsf"], "application/vnd.lotus-organizer": ["org"], "application/vnd.lotus-screencam": ["scm"], "application/vnd.lotus-wordpro": ["lwp"], "application/vnd.macports.portpkg": ["portpkg"], "application/vnd.mapbox-vector-tile": ["mvt"], "application/vnd.mcd": ["mcd"], "application/vnd.medcalcdata": ["mc1"], "application/vnd.mediastation.cdkey": ["cdkey"], "application/vnd.mfer": ["mwf"], "application/vnd.mfmp": ["mfm"], "application/vnd.micrografx.flo": ["flo"], "application/vnd.micrografx.igx": ["igx"], "application/vnd.mif": ["mif"], "application/vnd.mobius.daf": ["daf"], "application/vnd.mobius.dis": ["dis"], "application/vnd.mobius.mbk": ["mbk"], "application/vnd.mobius.mqy": ["mqy"], "application/vnd.mobius.msl": ["msl"], "application/vnd.mobius.plc": ["plc"], "application/vnd.mobius.txf": ["txf"], "application/vnd.mophun.application": ["mpn"], "application/vnd.mophun.certificate": ["mpc"], "application/vnd.mozilla.xul+xml": ["xul"], "application/vnd.ms-artgalry": ["cil"], "application/vnd.ms-cab-compressed": ["cab"], "application/vnd.ms-excel": ["xls", "xlm", "xla", "xlc", "xlt", "xlw"], "application/vnd.ms-excel.addin.macroenabled.12": ["xlam"], "application/vnd.ms-excel.sheet.binary.macroenabled.12": ["xlsb"], "application/vnd.ms-excel.sheet.macroenabled.12": ["xlsm"], "application/vnd.ms-excel.template.macroenabled.12": ["xltm"], "application/vnd.ms-fontobject": ["eot"], "application/vnd.ms-htmlhelp": ["chm"], "application/vnd.ms-ims": ["ims"], "application/vnd.ms-lrm": ["lrm"], "application/vnd.ms-officetheme": ["thmx"], "application/vnd.ms-outlook": ["msg"], "application/vnd.ms-pki.seccat": ["cat"], "application/vnd.ms-pki.stl": ["*stl"], "application/vnd.ms-powerpoint": ["ppt", "pps", "pot"], "application/vnd.ms-powerpoint.addin.macroenabled.12": ["ppam"], "application/vnd.ms-powerpoint.presentation.macroenabled.12": ["pptm"], "application/vnd.ms-powerpoint.slide.macroenabled.12": ["sldm"], "application/vnd.ms-powerpoint.slideshow.macroenabled.12": ["ppsm"], "application/vnd.ms-powerpoint.template.macroenabled.12": ["potm"], "application/vnd.ms-project": ["mpp", "mpt"], "application/vnd.ms-word.document.macroenabled.12": ["docm"], "application/vnd.ms-word.template.macroenabled.12": ["dotm"], "application/vnd.ms-works": ["wps", "wks", "wcm", "wdb"], "application/vnd.ms-wpl": ["wpl"], "application/vnd.ms-xpsdocument": ["xps"], "application/vnd.mseq": ["mseq"], "application/vnd.musician": ["mus"], "application/vnd.muvee.style": ["msty"], "application/vnd.mynfc": ["taglet"], "application/vnd.neurolanguage.nlu": ["nlu"], "application/vnd.nitf": ["ntf", "nitf"], "application/vnd.noblenet-directory": ["nnd"], "application/vnd.noblenet-sealer": ["nns"], "application/vnd.noblenet-web": ["nnw"], "application/vnd.nokia.n-gage.ac+xml": ["*ac"], "application/vnd.nokia.n-gage.data": ["ngdat"], "application/vnd.nokia.n-gage.symbian.install": ["n-gage"], "application/vnd.nokia.radio-preset": ["rpst"], "application/vnd.nokia.radio-presets": ["rpss"], "application/vnd.novadigm.edm": ["edm"], "application/vnd.novadigm.edx": ["edx"], "application/vnd.novadigm.ext": ["ext"], "application/vnd.oasis.opendocument.chart": ["odc"], "application/vnd.oasis.opendocument.chart-template": ["otc"], "application/vnd.oasis.opendocument.database": ["odb"], "application/vnd.oasis.opendocument.formula": ["odf"], "application/vnd.oasis.opendocument.formula-template": ["odft"], "application/vnd.oasis.opendocument.graphics": ["odg"], "application/vnd.oasis.opendocument.graphics-template": ["otg"], "application/vnd.oasis.opendocument.image": ["odi"], "application/vnd.oasis.opendocument.image-template": ["oti"], "application/vnd.oasis.opendocument.presentation": ["odp"], "application/vnd.oasis.opendocument.presentation-template": ["otp"], "application/vnd.oasis.opendocument.spreadsheet": ["ods"], "application/vnd.oasis.opendocument.spreadsheet-template": ["ots"], "application/vnd.oasis.opendocument.text": ["odt"], "application/vnd.oasis.opendocument.text-master": ["odm"], "application/vnd.oasis.opendocument.text-template": ["ott"], "application/vnd.oasis.opendocument.text-web": ["oth"], "application/vnd.olpc-sugar": ["xo"], "application/vnd.oma.dd2+xml": ["dd2"], "application/vnd.openblox.game+xml": ["obgx"], "application/vnd.openofficeorg.extension": ["oxt"], "application/vnd.openstreetmap.data+xml": ["osm"], "application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"], "application/vnd.openxmlformats-officedocument.presentationml.slide": ["sldx"], "application/vnd.openxmlformats-officedocument.presentationml.slideshow": ["ppsx"], "application/vnd.openxmlformats-officedocument.presentationml.template": ["potx"], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"], "application/vnd.openxmlformats-officedocument.spreadsheetml.template": ["xltx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.template": ["dotx"], "application/vnd.osgeo.mapguide.package": ["mgp"], "application/vnd.osgi.dp": ["dp"], "application/vnd.osgi.subsystem": ["esa"], "application/vnd.palm": ["pdb", "pqa", "oprc"], "application/vnd.pawaafile": ["paw"], "application/vnd.pg.format": ["str"], "application/vnd.pg.osasli": ["ei6"], "application/vnd.picsel": ["efif"], "application/vnd.pmi.widget": ["wg"], "application/vnd.pocketlearn": ["plf"], "application/vnd.powerbuilder6": ["pbd"], "application/vnd.previewsystems.box": ["box"], "application/vnd.proteus.magazine": ["mgz"], "application/vnd.publishare-delta-tree": ["qps"], "application/vnd.pvi.ptid1": ["ptid"], "application/vnd.quark.quarkxpress": ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"], "application/vnd.rar": ["rar"], "application/vnd.realvnc.bed": ["bed"], "application/vnd.recordare.musicxml": ["mxl"], "application/vnd.recordare.musicxml+xml": ["musicxml"], "application/vnd.rig.cryptonote": ["cryptonote"], "application/vnd.rim.cod": ["cod"], "application/vnd.rn-realmedia": ["rm"], "application/vnd.rn-realmedia-vbr": ["rmvb"], "application/vnd.route66.link66+xml": ["link66"], "application/vnd.sailingtracker.track": ["st"], "application/vnd.seemail": ["see"], "application/vnd.sema": ["sema"], "application/vnd.semd": ["semd"], "application/vnd.semf": ["semf"], "application/vnd.shana.informed.formdata": ["ifm"], "application/vnd.shana.informed.formtemplate": ["itp"], "application/vnd.shana.informed.interchange": ["iif"], "application/vnd.shana.informed.package": ["ipk"], "application/vnd.simtech-mindmapper": ["twd", "twds"], "application/vnd.smaf": ["mmf"], "application/vnd.smart.teacher": ["teacher"], "application/vnd.software602.filler.form+xml": ["fo"], "application/vnd.solent.sdkm+xml": ["sdkm", "sdkd"], "application/vnd.spotfire.dxp": ["dxp"], "application/vnd.spotfire.sfs": ["sfs"], "application/vnd.stardivision.calc": ["sdc"], "application/vnd.stardivision.draw": ["sda"], "application/vnd.stardivision.impress": ["sdd"], "application/vnd.stardivision.math": ["smf"], "application/vnd.stardivision.writer": ["sdw", "vor"], "application/vnd.stardivision.writer-global": ["sgl"], "application/vnd.stepmania.package": ["smzip"], "application/vnd.stepmania.stepchart": ["sm"], "application/vnd.sun.wadl+xml": ["wadl"], "application/vnd.sun.xml.calc": ["sxc"], "application/vnd.sun.xml.calc.template": ["stc"], "application/vnd.sun.xml.draw": ["sxd"], "application/vnd.sun.xml.draw.template": ["std"], "application/vnd.sun.xml.impress": ["sxi"], "application/vnd.sun.xml.impress.template": ["sti"], "application/vnd.sun.xml.math": ["sxm"], "application/vnd.sun.xml.writer": ["sxw"], "application/vnd.sun.xml.writer.global": ["sxg"], "application/vnd.sun.xml.writer.template": ["stw"], "application/vnd.sus-calendar": ["sus", "susp"], "application/vnd.svd": ["svd"], "application/vnd.symbian.install": ["sis", "sisx"], "application/vnd.syncml+xml": ["xsm"], "application/vnd.syncml.dm+wbxml": ["bdm"], "application/vnd.syncml.dm+xml": ["xdm"], "application/vnd.syncml.dmddf+xml": ["ddf"], "application/vnd.tao.intent-module-archive": ["tao"], "application/vnd.tcpdump.pcap": ["pcap", "cap", "dmp"], "application/vnd.tmobile-livetv": ["tmo"], "application/vnd.trid.tpt": ["tpt"], "application/vnd.triscape.mxs": ["mxs"], "application/vnd.trueapp": ["tra"], "application/vnd.ufdl": ["ufd", "ufdl"], "application/vnd.uiq.theme": ["utz"], "application/vnd.umajin": ["umj"], "application/vnd.unity": ["unityweb"], "application/vnd.uoml+xml": ["uoml"], "application/vnd.vcx": ["vcx"], "application/vnd.visio": ["vsd", "vst", "vss", "vsw"], "application/vnd.visionary": ["vis"], "application/vnd.vsf": ["vsf"], "application/vnd.wap.wbxml": ["wbxml"], "application/vnd.wap.wmlc": ["wmlc"], "application/vnd.wap.wmlscriptc": ["wmlsc"], "application/vnd.webturbo": ["wtb"], "application/vnd.wolfram.player": ["nbp"], "application/vnd.wordperfect": ["wpd"], "application/vnd.wqd": ["wqd"], "application/vnd.wt.stf": ["stf"], "application/vnd.xara": ["xar"], "application/vnd.xfdl": ["xfdl"], "application/vnd.yamaha.hv-dic": ["hvd"], "application/vnd.yamaha.hv-script": ["hvs"], "application/vnd.yamaha.hv-voice": ["hvp"], "application/vnd.yamaha.openscoreformat": ["osf"], "application/vnd.yamaha.openscoreformat.osfpvg+xml": ["osfpvg"], "application/vnd.yamaha.smaf-audio": ["saf"], "application/vnd.yamaha.smaf-phrase": ["spf"], "application/vnd.yellowriver-custom-menu": ["cmp"], "application/vnd.zul": ["zir", "zirz"], "application/vnd.zzazz.deck+xml": ["zaz"], "application/x-7z-compressed": ["7z"], "application/x-abiword": ["abw"], "application/x-ace-compressed": ["ace"], "application/x-apple-diskimage": ["*dmg"], "application/x-arj": ["arj"], "application/x-authorware-bin": ["aab", "x32", "u32", "vox"], "application/x-authorware-map": ["aam"], "application/x-authorware-seg": ["aas"], "application/x-bcpio": ["bcpio"], "application/x-bdoc": ["*bdoc"], "application/x-bittorrent": ["torrent"], "application/x-blorb": ["blb", "blorb"], "application/x-bzip": ["bz"], "application/x-bzip2": ["bz2", "boz"], "application/x-cbr": ["cbr", "cba", "cbt", "cbz", "cb7"], "application/x-cdlink": ["vcd"], "application/x-cfs-compressed": ["cfs"], "application/x-chat": ["chat"], "application/x-chess-pgn": ["pgn"], "application/x-chrome-extension": ["crx"], "application/x-cocoa": ["cco"], "application/x-conference": ["nsc"], "application/x-cpio": ["cpio"], "application/x-csh": ["csh"], "application/x-debian-package": ["*deb", "udeb"], "application/x-dgc-compressed": ["dgc"], "application/x-director": ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"], "application/x-doom": ["wad"], "application/x-dtbncx+xml": ["ncx"], "application/x-dtbook+xml": ["dtb"], "application/x-dtbresource+xml": ["res"], "application/x-dvi": ["dvi"], "application/x-envoy": ["evy"], "application/x-eva": ["eva"], "application/x-font-bdf": ["bdf"], "application/x-font-ghostscript": ["gsf"], "application/x-font-linux-psf": ["psf"], "application/x-font-pcf": ["pcf"], "application/x-font-snf": ["snf"], "application/x-font-type1": ["pfa", "pfb", "pfm", "afm"], "application/x-freearc": ["arc"], "application/x-futuresplash": ["spl"], "application/x-gca-compressed": ["gca"], "application/x-glulx": ["ulx"], "application/x-gnumeric": ["gnumeric"], "application/x-gramps-xml": ["gramps"], "application/x-gtar": ["gtar"], "application/x-hdf": ["hdf"], "application/x-httpd-php": ["php"], "application/x-install-instructions": ["install"], "application/x-iso9660-image": ["*iso"], "application/x-iwork-keynote-sffkey": ["*key"], "application/x-iwork-numbers-sffnumbers": ["*numbers"], "application/x-iwork-pages-sffpages": ["*pages"], "application/x-java-archive-diff": ["jardiff"], "application/x-java-jnlp-file": ["jnlp"], "application/x-keepass2": ["kdbx"], "application/x-latex": ["latex"], "application/x-lua-bytecode": ["luac"], "application/x-lzh-compressed": ["lzh", "lha"], "application/x-makeself": ["run"], "application/x-mie": ["mie"], "application/x-mobipocket-ebook": ["prc", "mobi"], "application/x-ms-application": ["application"], "application/x-ms-shortcut": ["lnk"], "application/x-ms-wmd": ["wmd"], "application/x-ms-wmz": ["wmz"], "application/x-ms-xbap": ["xbap"], "application/x-msaccess": ["mdb"], "application/x-msbinder": ["obd"], "application/x-mscardfile": ["crd"], "application/x-msclip": ["clp"], "application/x-msdos-program": ["*exe"], "application/x-msdownload": ["*exe", "*dll", "com", "bat", "*msi"], "application/x-msmediaview": ["mvb", "m13", "m14"], "application/x-msmetafile": ["*wmf", "*wmz", "*emf", "emz"], "application/x-msmoney": ["mny"], "application/x-mspublisher": ["pub"], "application/x-msschedule": ["scd"], "application/x-msterminal": ["trm"], "application/x-mswrite": ["wri"], "application/x-netcdf": ["nc", "cdf"], "application/x-ns-proxy-autoconfig": ["pac"], "application/x-nzb": ["nzb"], "application/x-perl": ["pl", "pm"], "application/x-pilot": ["*prc", "*pdb"], "application/x-pkcs12": ["p12", "pfx"], "application/x-pkcs7-certificates": ["p7b", "spc"], "application/x-pkcs7-certreqresp": ["p7r"], "application/x-rar-compressed": ["*rar"], "application/x-redhat-package-manager": ["rpm"], "application/x-research-info-systems": ["ris"], "application/x-sea": ["sea"], "application/x-sh": ["sh"], "application/x-shar": ["shar"], "application/x-shockwave-flash": ["swf"], "application/x-silverlight-app": ["xap"], "application/x-sql": ["sql"], "application/x-stuffit": ["sit"], "application/x-stuffitx": ["sitx"], "application/x-subrip": ["srt"], "application/x-sv4cpio": ["sv4cpio"], "application/x-sv4crc": ["sv4crc"], "application/x-t3vm-image": ["t3"], "application/x-tads": ["gam"], "application/x-tar": ["tar"], "application/x-tcl": ["tcl", "tk"], "application/x-tex": ["tex"], "application/x-tex-tfm": ["tfm"], "application/x-texinfo": ["texinfo", "texi"], "application/x-tgif": ["*obj"], "application/x-ustar": ["ustar"], "application/x-virtualbox-hdd": ["hdd"], "application/x-virtualbox-ova": ["ova"], "application/x-virtualbox-ovf": ["ovf"], "application/x-virtualbox-vbox": ["vbox"], "application/x-virtualbox-vbox-extpack": ["vbox-extpack"], "application/x-virtualbox-vdi": ["vdi"], "application/x-virtualbox-vhd": ["vhd"], "application/x-virtualbox-vmdk": ["vmdk"], "application/x-wais-source": ["src"], "application/x-web-app-manifest+json": ["webapp"], "application/x-x509-ca-cert": ["der", "crt", "pem"], "application/x-xfig": ["fig"], "application/x-xliff+xml": ["*xlf"], "application/x-xpinstall": ["xpi"], "application/x-xz": ["xz"], "application/x-zmachine": ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"], "audio/vnd.dece.audio": ["uva", "uvva"], "audio/vnd.digital-winds": ["eol"], "audio/vnd.dra": ["dra"], "audio/vnd.dts": ["dts"], "audio/vnd.dts.hd": ["dtshd"], "audio/vnd.lucent.voice": ["lvp"], "audio/vnd.ms-playready.media.pya": ["pya"], "audio/vnd.nuera.ecelp4800": ["ecelp4800"], "audio/vnd.nuera.ecelp7470": ["ecelp7470"], "audio/vnd.nuera.ecelp9600": ["ecelp9600"], "audio/vnd.rip": ["rip"], "audio/x-aac": ["aac"], "audio/x-aiff": ["aif", "aiff", "aifc"], "audio/x-caf": ["caf"], "audio/x-flac": ["flac"], "audio/x-m4a": ["*m4a"], "audio/x-matroska": ["mka"], "audio/x-mpegurl": ["m3u"], "audio/x-ms-wax": ["wax"], "audio/x-ms-wma": ["wma"], "audio/x-pn-realaudio": ["ram", "ra"], "audio/x-pn-realaudio-plugin": ["rmp"], "audio/x-realaudio": ["*ra"], "audio/x-wav": ["*wav"], "chemical/x-cdx": ["cdx"], "chemical/x-cif": ["cif"], "chemical/x-cmdf": ["cmdf"], "chemical/x-cml": ["cml"], "chemical/x-csml": ["csml"], "chemical/x-xyz": ["xyz"], "image/prs.btif": ["btif"], "image/prs.pti": ["pti"], "image/vnd.adobe.photoshop": ["psd"], "image/vnd.airzip.accelerator.azv": ["azv"], "image/vnd.dece.graphic": ["uvi", "uvvi", "uvg", "uvvg"], "image/vnd.djvu": ["djvu", "djv"], "image/vnd.dvb.subtitle": ["*sub"], "image/vnd.dwg": ["dwg"], "image/vnd.dxf": ["dxf"], "image/vnd.fastbidsheet": ["fbs"], "image/vnd.fpx": ["fpx"], "image/vnd.fst": ["fst"], "image/vnd.fujixerox.edmics-mmr": ["mmr"], "image/vnd.fujixerox.edmics-rlc": ["rlc"], "image/vnd.microsoft.icon": ["ico"], "image/vnd.ms-dds": ["dds"], "image/vnd.ms-modi": ["mdi"], "image/vnd.ms-photo": ["wdp"], "image/vnd.net-fpx": ["npx"], "image/vnd.pco.b16": ["b16"], "image/vnd.tencent.tap": ["tap"], "image/vnd.valve.source.texture": ["vtf"], "image/vnd.wap.wbmp": ["wbmp"], "image/vnd.xiff": ["xif"], "image/vnd.zbrush.pcx": ["pcx"], "image/x-3ds": ["3ds"], "image/x-cmu-raster": ["ras"], "image/x-cmx": ["cmx"], "image/x-freehand": ["fh", "fhc", "fh4", "fh5", "fh7"], "image/x-icon": ["*ico"], "image/x-jng": ["jng"], "image/x-mrsid-image": ["sid"], "image/x-ms-bmp": ["*bmp"], "image/x-pcx": ["*pcx"], "image/x-pict": ["pic", "pct"], "image/x-portable-anymap": ["pnm"], "image/x-portable-bitmap": ["pbm"], "image/x-portable-graymap": ["pgm"], "image/x-portable-pixmap": ["ppm"], "image/x-rgb": ["rgb"], "image/x-tga": ["tga"], "image/x-xbitmap": ["xbm"], "image/x-xpixmap": ["xpm"], "image/x-xwindowdump": ["xwd"], "message/vnd.wfa.wsc": ["wsc"], "model/vnd.collada+xml": ["dae"], "model/vnd.dwf": ["dwf"], "model/vnd.gdl": ["gdl"], "model/vnd.gtw": ["gtw"], "model/vnd.mts": ["mts"], "model/vnd.opengex": ["ogex"], "model/vnd.parasolid.transmit.binary": ["x_b"], "model/vnd.parasolid.transmit.text": ["x_t"], "model/vnd.sap.vds": ["vds"], "model/vnd.usdz+zip": ["usdz"], "model/vnd.valve.source.compiled-map": ["bsp"], "model/vnd.vtu": ["vtu"], "text/prs.lines.tag": ["dsc"], "text/vnd.curl": ["curl"], "text/vnd.curl.dcurl": ["dcurl"], "text/vnd.curl.mcurl": ["mcurl"], "text/vnd.curl.scurl": ["scurl"], "text/vnd.dvb.subtitle": ["sub"], "text/vnd.fly": ["fly"], "text/vnd.fmi.flexstor": ["flx"], "text/vnd.graphviz": ["gv"], "text/vnd.in3d.3dml": ["3dml"], "text/vnd.in3d.spot": ["spot"], "text/vnd.sun.j2me.app-descriptor": ["jad"], "text/vnd.wap.wml": ["wml"], "text/vnd.wap.wmlscript": ["wmls"], "text/x-asm": ["s", "asm"], "text/x-c": ["c", "cc", "cxx", "cpp", "h", "hh", "dic"], "text/x-component": ["htc"], "text/x-fortran": ["f", "for", "f77", "f90"], "text/x-handlebars-template": ["hbs"], "text/x-java-source": ["java"], "text/x-lua": ["lua"], "text/x-markdown": ["mkd"], "text/x-nfo": ["nfo"], "text/x-opml": ["opml"], "text/x-org": ["*org"], "text/x-pascal": ["p", "pas"], "text/x-processing": ["pde"], "text/x-sass": ["sass"], "text/x-scss": ["scss"], "text/x-setext": ["etx"], "text/x-sfv": ["sfv"], "text/x-suse-ymp": ["ymp"], "text/x-uuencode": ["uu"], "text/x-vcalendar": ["vcs"], "text/x-vcard": ["vcf"], "video/vnd.dece.hd": ["uvh", "uvvh"], "video/vnd.dece.mobile": ["uvm", "uvvm"], "video/vnd.dece.pd": ["uvp", "uvvp"], "video/vnd.dece.sd": ["uvs", "uvvs"], "video/vnd.dece.video": ["uvv", "uvvv"], "video/vnd.dvb.file": ["dvb"], "video/vnd.fvt": ["fvt"], "video/vnd.mpegurl": ["mxu", "m4u"], "video/vnd.ms-playready.media.pyv": ["pyv"], "video/vnd.uvvu.mp4": ["uvu", "uvvu"], "video/vnd.vivo": ["viv"], "video/x-f4v": ["f4v"], "video/x-fli": ["fli"], "video/x-flv": ["flv"], "video/x-m4v": ["m4v"], "video/x-matroska": ["mkv", "mk3d", "mks"], "video/x-mng": ["mng"], "video/x-ms-asf": ["asf", "asx"], "video/x-ms-vob": ["vob"], "video/x-ms-wm": ["wm"], "video/x-ms-wmv": ["wmv"], "video/x-ms-wmx": ["wmx"], "video/x-ms-wvx": ["wvx"], "video/x-msvideo": ["avi"], "video/x-sgi-movie": ["movie"], "video/x-smv": ["smv"], "x-conference/x-cooltalk": ["ice"] }), Ir = {};
    Object.defineProperty(Ir, "__esModule", { value: true }), Ir.InternalError = Ir.NotFoundError = Ir.MethodNotAllowedError = Ir.KVError = void 0;
    class KVError extends Error {
      constructor(e2, t2 = 500) {
        super(e2), Object.setPrototypeOf(this, new.target.prototype), this.name = KVError.name, this.status = t2;
      }
      status;
    }
    __name(KVError, "KVError");
    Ir.KVError = KVError;
    Ir.MethodNotAllowedError = class extends KVError {
      constructor(e2 = "Not a valid request method", t2 = 405) {
        super(e2, t2);
      }
    };
    Ir.NotFoundError = class extends KVError {
      constructor(e2 = "Not Found", t2 = 404) {
        super(e2, t2);
      }
    };
    Ir.InternalError = class extends KVError {
      constructor(e2 = "Internal Error in KV Asset Handler", t2 = 500) {
        super(e2, t2);
      }
    }, function(e2) {
      var t2, r2 = Nr && Nr.__createBinding || (Object.create ? function(e3, t3, r3, s3) {
        void 0 === s3 && (s3 = r3);
        var a3 = Object.getOwnPropertyDescriptor(t3, r3);
        a3 && !("get" in a3 ? !t3.__esModule : a3.writable || a3.configurable) || (a3 = { enumerable: true, get: function() {
          return t3[r3];
        } }), Object.defineProperty(e3, s3, a3);
      } : function(e3, t3, r3, s3) {
        void 0 === s3 && (s3 = r3), e3[s3] = t3[r3];
      }), s2 = Nr && Nr.__setModuleDefault || (Object.create ? function(e3, t3) {
        Object.defineProperty(e3, "default", { enumerable: true, value: t3 });
      } : function(e3, t3) {
        e3.default = t3;
      }), a2 = Nr && Nr.__importStar || (t2 = /* @__PURE__ */ __name(function(e3) {
        return t2 = Object.getOwnPropertyNames || function(e4) {
          var t3 = [];
          for (var r3 in e4)
            Object.prototype.hasOwnProperty.call(e4, r3) && (t3[t3.length] = r3);
          return t3;
        }, t2(e3);
      }, "t"), function(e3) {
        if (e3 && e3.__esModule)
          return e3;
        var a3 = {};
        if (null != e3)
          for (var c3 = t2(e3), p3 = 0; p3 < c3.length; p3++)
            "default" !== c3[p3] && r2(a3, e3, c3[p3]);
        return s2(a3, e3), a3;
      });
      Object.defineProperty(e2, "__esModule", { value: true }), e2.InternalError = e2.NotFoundError = e2.MethodNotAllowedError = e2.mapRequestToAsset = e2.getAssetFromKV = void 0, e2.serveSinglePageApp = function(e3, t3) {
        t3 = assignOptions(t3), e3 = mapRequestToAsset(e3, t3);
        const r3 = new URL(e3.url);
        return r3.pathname.endsWith(".html") ? new Request(`${r3.origin}/${t3.defaultDocument}`, e3) : e3;
      };
      const c2 = a2(Or), p2 = Ir;
      Object.defineProperty(e2, "InternalError", { enumerable: true, get: function() {
        return p2.InternalError;
      } }), Object.defineProperty(e2, "MethodNotAllowedError", { enumerable: true, get: function() {
        return p2.MethodNotAllowedError;
      } }), Object.defineProperty(e2, "NotFoundError", { enumerable: true, get: function() {
        return p2.NotFoundError;
      } });
      const u2 = { browserTTL: null, edgeTTL: 172800, bypassCache: false }, parseStringAsObject = /* @__PURE__ */ __name((e3) => "string" == typeof e3 ? JSON.parse(e3) : e3, "parseStringAsObject"), d2 = { ASSET_NAMESPACE: "undefined" != typeof __STATIC_CONTENT ? __STATIC_CONTENT : void 0, ASSET_MANIFEST: "undefined" != typeof __STATIC_CONTENT_MANIFEST ? parseStringAsObject(__STATIC_CONTENT_MANIFEST) : {}, cacheControl: u2, defaultMimeType: "text/plain", defaultDocument: "index.html", pathIsEncoded: false, defaultETag: "strong" };
      function assignOptions(e3) {
        return Object.assign({}, d2, e3);
      }
      __name(assignOptions, "assignOptions");
      const mapRequestToAsset = /* @__PURE__ */ __name((e3, t3) => {
        t3 = assignOptions(t3);
        const r3 = new URL(e3.url);
        let s3 = r3.pathname;
        return s3.endsWith("/") ? s3 = s3.concat(t3.defaultDocument) : c2.getType(s3) || (s3 = s3.concat("/" + t3.defaultDocument)), r3.pathname = s3, new Request(r3.toString(), e3);
      }, "mapRequestToAsset");
      e2.mapRequestToAsset = mapRequestToAsset;
      e2.getAssetFromKV = async (e3, t3) => {
        t3 = assignOptions(t3);
        const r3 = e3.request, s3 = t3.ASSET_NAMESPACE, a3 = parseStringAsObject(t3.ASSET_MANIFEST);
        if (void 0 === s3)
          throw new p2.InternalError("there is no KV namespace bound to the script");
        const d3 = new URL(r3.url).pathname.replace(/^\/+/, "");
        let f2, m2 = t3.pathIsEncoded;
        if (t3.mapRequestToAsset)
          f2 = t3.mapRequestToAsset(r3);
        else if (a3[d3])
          f2 = r3;
        else if (a3[decodeURIComponent(d3)])
          m2 = true, f2 = r3;
        else {
          const e4 = mapRequestToAsset(r3), s4 = new URL(e4.url).pathname.replace(/^\/+/, "");
          a3[decodeURIComponent(s4)] ? (m2 = true, f2 = e4) : f2 = mapRequestToAsset(r3, t3);
        }
        if (!["GET", "HEAD"].includes(f2.method))
          throw new p2.MethodNotAllowedError(`${f2.method} is not a valid request method`);
        const g2 = new URL(f2.url);
        let x2 = (m2 ? decodeURIComponent(g2.pathname) : g2.pathname).replace(/^\/+/, "");
        const _2 = caches.default;
        let E2 = c2.getType(x2) || t3.defaultMimeType;
        (E2.startsWith("text") || "application/javascript" === E2) && (E2 += "; charset=utf-8");
        let S2 = false;
        void 0 !== a3 && a3[x2] && (x2 = a3[x2], S2 = true);
        const T2 = new Request(`${g2.origin}/${x2}`, r3), C2 = (() => {
          switch (typeof t3.cacheControl) {
            case "function":
              return t3.cacheControl(r3);
            case "object":
              return t3.cacheControl;
            default:
              return u2;
          }
        })(), formatETag = /* @__PURE__ */ __name((e4 = x2, r4 = t3.defaultETag) => {
          if (!e4)
            return "";
          switch (r4) {
            case "weak":
              return e4.startsWith("W/") ? e4 : e4.startsWith('"') && e4.endsWith('"') ? `W/${e4}` : `W/"${e4}"`;
            case "strong":
              return e4.startsWith('W/"') && (e4 = e4.replace("W/", "")), e4.endsWith('"') || (e4 = `"${e4}"`), e4;
            default:
              return "";
          }
        }, "formatETag");
        t3.cacheControl = Object.assign({}, u2, C2), (t3.cacheControl.bypassCache || null === t3.cacheControl.edgeTTL || "HEAD" == r3.method) && (S2 = false);
        const R2 = "number" == typeof t3.cacheControl.browserTTL;
        let N2 = null;
        if (S2 && (N2 = await _2.match(T2)), N2)
          if (N2.status > 300 && N2.status < 400)
            N2.body && "cancel" in Object.getPrototypeOf(N2.body) && N2.body.cancel(), N2 = new Response(null, N2);
          else {
            const e4 = { headers: new Headers(N2.headers), status: 0, statusText: "" };
            e4.headers.set("cf-cache-status", "HIT"), N2.status ? (e4.status = N2.status, e4.statusText = N2.statusText) : e4.headers.has("Content-Range") ? (e4.status = 206, e4.statusText = "Partial Content") : (e4.status = 200, e4.statusText = "OK"), N2 = new Response(N2.body, e4);
          }
        else {
          const r4 = await s3.get(x2, "arrayBuffer");
          if (null === r4)
            throw new p2.NotFoundError(`could not find ${x2} in your content namespace`);
          N2 = new Response(r4), S2 && (N2.headers.set("Accept-Ranges", "bytes"), N2.headers.set("Content-Length", String(r4.byteLength)), N2.headers.has("etag") || N2.headers.set("etag", formatETag(x2)), N2.headers.set("Cache-Control", `max-age=${t3.cacheControl.edgeTTL}`), e3.waitUntil(_2.put(T2, N2.clone())), N2.headers.set("CF-Cache-Status", "MISS"));
        }
        if (N2.headers.set("Content-Type", E2), 304 === N2.status) {
          const e4 = formatETag(N2.headers.get("etag")), t4 = T2.headers.get("if-none-match"), r4 = N2.headers.get("CF-Cache-Status");
          e4 && (t4 && t4 === e4 && "MISS" === r4 ? N2.headers.set("CF-Cache-Status", "EXPIRED") : N2.headers.set("CF-Cache-Status", "REVALIDATED"), N2.headers.set("etag", formatETag(e4, "weak")));
        }
        return R2 ? N2.headers.set("Cache-Control", `max-age=${t3.cacheControl.browserTTL}`) : N2.headers.delete("Cache-Control"), N2;
      };
    }(Nr), addEventListener("fetch", (e2) => {
      e2.respondWith(async function(e3) {
        try {
          return await Nr.getAssetFromKV(e3, { cacheControl: assetsCacheControl, mapRequestToAsset: baseURLModifier });
        } catch {
        }
        const t2 = new URL(e3.request.url);
        let r2;
        s2 = e3.request, Er.test(s2.method) && (r2 = m.from(await e3.request.arrayBuffer()));
        var s2;
        return Pr.localFetch(t2.pathname + t2.search, { context: { waitUntil: (t3) => e3.waitUntil(t3), _platform: { cf: e3.request.cf, cloudflare: { event: e3 } } }, host: t2.hostname, protocol: t2.protocol, headers: e3.request.headers, method: e3.request.method, redirect: e3.request.redirect, body: r2 });
      }(e2));
    });
    const Pr = useNitroApp();
    function assetsCacheControl(e2) {
      const t2 = function(e3 = "") {
        for (const t3 in Ar)
          if (e3.startsWith(t3))
            return Ar[t3];
        return {};
      }(new URL(e2.url).pathname);
      return t2.maxAge ? { browserTTL: t2.maxAge, edgeTTL: t2.maxAge } : {};
    }
    __name(assetsCacheControl, "assetsCacheControl");
    const baseURLModifier = /* @__PURE__ */ __name((e2) => {
      const t2 = withoutBase(e2.url, useRuntimeConfig$1().app.baseURL);
      return Nr.mapRequestToAsset(new Request(t2, e2));
    }, "baseURLModifier");
    function makeMap(e2) {
      const t2 = /* @__PURE__ */ Object.create(null);
      for (const r2 of e2.split(","))
        t2[r2] = 1;
      return (e3) => e3 in t2;
    }
    __name(makeMap, "makeMap");
    const Lr = {}, Mr = [], NOOP = /* @__PURE__ */ __name(() => {
    }, "NOOP"), NO = /* @__PURE__ */ __name(() => false, "NO"), isOn = /* @__PURE__ */ __name((e2) => 111 === e2.charCodeAt(0) && 110 === e2.charCodeAt(1) && (e2.charCodeAt(2) > 122 || e2.charCodeAt(2) < 97), "isOn"), isModelListener = /* @__PURE__ */ __name((e2) => e2.startsWith("onUpdate:"), "isModelListener"), $r = Object.assign, remove = /* @__PURE__ */ __name((e2, t2) => {
      const r2 = e2.indexOf(t2);
      r2 > -1 && e2.splice(r2, 1);
    }, "remove"), Br = Object.prototype.hasOwnProperty, hasOwn = /* @__PURE__ */ __name((e2, t2) => Br.call(e2, t2), "hasOwn"), jr = Array.isArray, isMap = /* @__PURE__ */ __name((e2) => "[object Map]" === toTypeString(e2), "isMap"), isSet = /* @__PURE__ */ __name((e2) => "[object Set]" === toTypeString(e2), "isSet"), isDate = /* @__PURE__ */ __name((e2) => "[object Date]" === toTypeString(e2), "isDate"), isRegExp = /* @__PURE__ */ __name((e2) => "[object RegExp]" === toTypeString(e2), "isRegExp"), isFunction = /* @__PURE__ */ __name((e2) => "function" == typeof e2, "isFunction"), isString = /* @__PURE__ */ __name((e2) => "string" == typeof e2, "isString"), isSymbol = /* @__PURE__ */ __name((e2) => "symbol" == typeof e2, "isSymbol"), isObject = /* @__PURE__ */ __name((e2) => null !== e2 && "object" == typeof e2, "isObject"), isPromise = /* @__PURE__ */ __name((e2) => (isObject(e2) || isFunction(e2)) && isFunction(e2.then) && isFunction(e2.catch), "isPromise"), Dr = Object.prototype.toString, toTypeString = /* @__PURE__ */ __name((e2) => Dr.call(e2), "toTypeString"), toRawType = /* @__PURE__ */ __name((e2) => toTypeString(e2).slice(8, -1), "toRawType"), isPlainObject = /* @__PURE__ */ __name((e2) => "[object Object]" === toTypeString(e2), "isPlainObject"), isIntegerKey = /* @__PURE__ */ __name((e2) => isString(e2) && "NaN" !== e2 && "-" !== e2[0] && "" + parseInt(e2, 10) === e2, "isIntegerKey"), Hr = makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), Ur = makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"), cacheStringFunction = /* @__PURE__ */ __name((e2) => {
      const t2 = /* @__PURE__ */ Object.create(null);
      return (r2) => t2[r2] || (t2[r2] = e2(r2));
    }, "cacheStringFunction"), Vr = /-(\w)/g, Fr = cacheStringFunction((e2) => e2.replace(Vr, (e3, t2) => t2 ? t2.toUpperCase() : "")), zr = /\B([A-Z])/g, qr = cacheStringFunction((e2) => e2.replace(zr, "-$1").toLowerCase()), Wr = cacheStringFunction((e2) => e2.charAt(0).toUpperCase() + e2.slice(1)), Kr = cacheStringFunction((e2) => e2 ? `on${Wr(e2)}` : ""), hasChanged = /* @__PURE__ */ __name((e2, t2) => !Object.is(e2, t2), "hasChanged"), invokeArrayFns = /* @__PURE__ */ __name((e2, ...t2) => {
      for (let r2 = 0; r2 < e2.length; r2++)
        e2[r2](...t2);
    }, "invokeArrayFns"), def = /* @__PURE__ */ __name((e2, t2, r2, s2 = false) => {
      Object.defineProperty(e2, t2, { configurable: true, enumerable: false, writable: s2, value: r2 });
    }, "def"), looseToNumber = /* @__PURE__ */ __name((e2) => {
      const t2 = parseFloat(e2);
      return isNaN(t2) ? e2 : t2;
    }, "looseToNumber"), toNumber = /* @__PURE__ */ __name((e2) => {
      const t2 = isString(e2) ? Number(e2) : NaN;
      return isNaN(t2) ? e2 : t2;
    }, "toNumber");
    let Xr;
    const getGlobalThis = /* @__PURE__ */ __name(() => Xr || (Xr = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : void 0 !== Fn ? Fn : {}), "getGlobalThis"), Gr = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
    const Jr = { 1: "TEXT", 2: "CLASS", 4: "STYLE", 8: "PROPS", 16: "FULL_PROPS", 32: "NEED_HYDRATION", 64: "STABLE_FRAGMENT", 128: "KEYED_FRAGMENT", 256: "UNKEYED_FRAGMENT", 512: "NEED_PATCH", 1024: "DYNAMIC_SLOTS", 2048: "DEV_ROOT_FRAGMENT", [-1]: "CACHED", [-2]: "BAIL" }, Yr = { 1: "STABLE", 2: "DYNAMIC", 3: "FORWARDED" }, Qr = makeMap("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol"), Zr = Qr;
    function generateCodeFrame(e2, t2 = 0, r2 = e2.length) {
      if ((t2 = Math.max(0, Math.min(t2, e2.length))) > (r2 = Math.max(0, Math.min(r2, e2.length))))
        return "";
      let s2 = e2.split(/(\r?\n)/);
      const a2 = s2.filter((e3, t3) => t3 % 2 == 1);
      s2 = s2.filter((e3, t3) => t3 % 2 == 0);
      let c2 = 0;
      const p2 = [];
      for (let e3 = 0; e3 < s2.length; e3++)
        if (c2 += s2[e3].length + (a2[e3] && a2[e3].length || 0), c2 >= t2) {
          for (let u2 = e3 - 2; u2 <= e3 + 2 || r2 > c2; u2++) {
            if (u2 < 0 || u2 >= s2.length)
              continue;
            const d2 = u2 + 1;
            p2.push(`${d2}${" ".repeat(Math.max(3 - String(d2).length, 0))}|  ${s2[u2]}`);
            const f2 = s2[u2].length, m2 = a2[u2] && a2[u2].length || 0;
            if (u2 === e3) {
              const e4 = t2 - (c2 - (f2 + m2)), s3 = Math.max(1, r2 > c2 ? f2 - e4 : r2 - t2);
              p2.push("   |  " + " ".repeat(e4) + "^".repeat(s3));
            } else if (u2 > e3) {
              if (r2 > c2) {
                const e4 = Math.max(Math.min(r2 - c2, f2), 1);
                p2.push("   |  " + "^".repeat(e4));
              }
              c2 += f2 + m2;
            }
          }
          break;
        }
      return p2.join("\n");
    }
    __name(generateCodeFrame, "generateCodeFrame");
    function normalizeStyle(e2) {
      if (jr(e2)) {
        const t2 = {};
        for (let r2 = 0; r2 < e2.length; r2++) {
          const s2 = e2[r2], a2 = isString(s2) ? parseStringStyle(s2) : normalizeStyle(s2);
          if (a2)
            for (const e3 in a2)
              t2[e3] = a2[e3];
        }
        return t2;
      }
      if (isString(e2) || isObject(e2))
        return e2;
    }
    __name(normalizeStyle, "normalizeStyle");
    const eo = /;(?![^(]*\))/g, to = /:([^]+)/, no = /\/\*[^]*?\*\//g;
    function parseStringStyle(e2) {
      const t2 = {};
      return e2.replace(no, "").split(eo).forEach((e3) => {
        if (e3) {
          const r2 = e3.split(to);
          r2.length > 1 && (t2[r2[0].trim()] = r2[1].trim());
        }
      }), t2;
    }
    __name(parseStringStyle, "parseStringStyle");
    function stringifyStyle(e2) {
      if (!e2)
        return "";
      if (isString(e2))
        return e2;
      let t2 = "";
      for (const r2 in e2) {
        const s2 = e2[r2];
        if (isString(s2) || "number" == typeof s2) {
          t2 += `${r2.startsWith("--") ? r2 : qr(r2)}:${s2};`;
        }
      }
      return t2;
    }
    __name(stringifyStyle, "stringifyStyle");
    function normalizeClass(e2) {
      let t2 = "";
      if (isString(e2))
        t2 = e2;
      else if (jr(e2))
        for (let r2 = 0; r2 < e2.length; r2++) {
          const s2 = normalizeClass(e2[r2]);
          s2 && (t2 += s2 + " ");
        }
      else if (isObject(e2))
        for (const r2 in e2)
          e2[r2] && (t2 += r2 + " ");
      return t2.trim();
    }
    __name(normalizeClass, "normalizeClass");
    function normalizeProps$1(e2) {
      if (!e2)
        return null;
      let { class: t2, style: r2 } = e2;
      return t2 && !isString(t2) && (e2.class = normalizeClass(t2)), r2 && (e2.style = normalizeStyle(r2)), e2;
    }
    __name(normalizeProps$1, "normalizeProps$1");
    const ro = makeMap("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot"), oo = makeMap("svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view"), so = makeMap("annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics"), io = makeMap("area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr"), ao = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", co = makeMap(ao), lo = makeMap(ao + ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected");
    function includeBooleanAttr(e2) {
      return !!e2 || "" === e2;
    }
    __name(includeBooleanAttr, "includeBooleanAttr");
    const po = /[>/="'\u0009\u000a\u000c\u0020]/, uo = {};
    function isSSRSafeAttrName(e2) {
      if (uo.hasOwnProperty(e2))
        return uo[e2];
      const t2 = po.test(e2);
      return t2 && console.error(`unsafe attribute name: ${e2}`), uo[e2] = !t2;
    }
    __name(isSSRSafeAttrName, "isSSRSafeAttrName");
    const fo = { acceptCharset: "accept-charset", className: "class", htmlFor: "for", httpEquiv: "http-equiv" }, ho = makeMap("accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,inert,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap"), mo = makeMap("xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xmlns:xlink,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan"), go = makeMap("accent,accentunder,actiontype,align,alignmentscope,altimg,altimg-height,altimg-valign,altimg-width,alttext,bevelled,close,columnsalign,columnlines,columnspan,denomalign,depth,dir,display,displaystyle,encoding,equalcolumns,equalrows,fence,fontstyle,fontweight,form,frame,framespacing,groupalign,height,href,id,indentalign,indentalignfirst,indentalignlast,indentshift,indentshiftfirst,indentshiftlast,indextype,justify,largetop,largeop,lquote,lspace,mathbackground,mathcolor,mathsize,mathvariant,maxsize,minlabelspacing,mode,other,overflow,position,rowalign,rowlines,rowspan,rquote,rspace,scriptlevel,scriptminsize,scriptsizemultiplier,selection,separator,separators,shift,side,src,stackalign,stretchy,subscriptshift,superscriptshift,symmetric,voffset,width,widths,xlink:href,xlink:show,xlink:type,xmlns");
    function isRenderableAttrValue(e2) {
      if (null == e2)
        return false;
      const t2 = typeof e2;
      return "string" === t2 || "number" === t2 || "boolean" === t2;
    }
    __name(isRenderableAttrValue, "isRenderableAttrValue");
    const vo = /["'&<>]/;
    function escapeHtml$1(e2) {
      const t2 = "" + e2, r2 = vo.exec(t2);
      if (!r2)
        return t2;
      let s2, a2, c2 = "", p2 = 0;
      for (a2 = r2.index; a2 < t2.length; a2++) {
        switch (t2.charCodeAt(a2)) {
          case 34:
            s2 = "&quot;";
            break;
          case 38:
            s2 = "&amp;";
            break;
          case 39:
            s2 = "&#39;";
            break;
          case 60:
            s2 = "&lt;";
            break;
          case 62:
            s2 = "&gt;";
            break;
          default:
            continue;
        }
        p2 !== a2 && (c2 += t2.slice(p2, a2)), p2 = a2 + 1, c2 += s2;
      }
      return p2 !== a2 ? c2 + t2.slice(p2, a2) : c2;
    }
    __name(escapeHtml$1, "escapeHtml$1");
    const yo = /^-?>|<!--|-->|--!>|<!-$/g;
    function escapeHtmlComment(e2) {
      return e2.replace(yo, "");
    }
    __name(escapeHtmlComment, "escapeHtmlComment");
    const bo = /[ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g;
    function looseEqual(e2, t2) {
      if (e2 === t2)
        return true;
      let r2 = isDate(e2), s2 = isDate(t2);
      if (r2 || s2)
        return !(!r2 || !s2) && e2.getTime() === t2.getTime();
      if (r2 = isSymbol(e2), s2 = isSymbol(t2), r2 || s2)
        return e2 === t2;
      if (r2 = jr(e2), s2 = jr(t2), r2 || s2)
        return !(!r2 || !s2) && function(e3, t3) {
          if (e3.length !== t3.length)
            return false;
          let r3 = true;
          for (let s3 = 0; r3 && s3 < e3.length; s3++)
            r3 = looseEqual(e3[s3], t3[s3]);
          return r3;
        }(e2, t2);
      if (r2 = isObject(e2), s2 = isObject(t2), r2 || s2) {
        if (!r2 || !s2)
          return false;
        if (Object.keys(e2).length !== Object.keys(t2).length)
          return false;
        for (const r3 in e2) {
          const s3 = e2.hasOwnProperty(r3), a2 = t2.hasOwnProperty(r3);
          if (s3 && !a2 || !s3 && a2 || !looseEqual(e2[r3], t2[r3]))
            return false;
        }
      }
      return String(e2) === String(t2);
    }
    __name(looseEqual, "looseEqual");
    function looseIndexOf(e2, t2) {
      return e2.findIndex((e3) => looseEqual(e3, t2));
    }
    __name(looseIndexOf, "looseIndexOf");
    const isRef$1 = /* @__PURE__ */ __name((e2) => !(!e2 || true !== e2.__v_isRef), "isRef$1"), toDisplayString = /* @__PURE__ */ __name((e2) => isString(e2) ? e2 : null == e2 ? "" : jr(e2) || isObject(e2) && (e2.toString === Dr || !isFunction(e2.toString)) ? isRef$1(e2) ? toDisplayString(e2.value) : JSON.stringify(e2, replacer, 2) : String(e2), "toDisplayString"), replacer = /* @__PURE__ */ __name((e2, t2) => isRef$1(t2) ? replacer(e2, t2.value) : isMap(t2) ? { [`Map(${t2.size})`]: [...t2.entries()].reduce((e3, [t3, r2], s2) => (e3[stringifySymbol(t3, s2) + " =>"] = r2, e3), {}) } : isSet(t2) ? { [`Set(${t2.size})`]: [...t2.values()].map((e3) => stringifySymbol(e3)) } : isSymbol(t2) ? stringifySymbol(t2) : !isObject(t2) || jr(t2) || isPlainObject(t2) ? t2 : String(t2), "replacer"), stringifySymbol = /* @__PURE__ */ __name((e2, t2 = "") => {
      var r2;
      return isSymbol(e2) ? `Symbol(${null != (r2 = e2.description) ? r2 : t2})` : e2;
    }, "stringifySymbol");
    function normalizeCssVarValue(e2) {
      return null == e2 ? "initial" : "string" == typeof e2 ? "" === e2 ? " " : e2 : String(e2);
    }
    __name(normalizeCssVarValue, "normalizeCssVarValue");
    const xo = Object.freeze(Object.defineProperty({ __proto__: null, EMPTY_ARR: Mr, EMPTY_OBJ: Lr, NO, NOOP, PatchFlagNames: Jr, PatchFlags: { TEXT: 1, 1: "TEXT", CLASS: 2, 2: "CLASS", STYLE: 4, 4: "STYLE", PROPS: 8, 8: "PROPS", FULL_PROPS: 16, 16: "FULL_PROPS", NEED_HYDRATION: 32, 32: "NEED_HYDRATION", STABLE_FRAGMENT: 64, 64: "STABLE_FRAGMENT", KEYED_FRAGMENT: 128, 128: "KEYED_FRAGMENT", UNKEYED_FRAGMENT: 256, 256: "UNKEYED_FRAGMENT", NEED_PATCH: 512, 512: "NEED_PATCH", DYNAMIC_SLOTS: 1024, 1024: "DYNAMIC_SLOTS", DEV_ROOT_FRAGMENT: 2048, 2048: "DEV_ROOT_FRAGMENT", CACHED: -1, "-1": "CACHED", BAIL: -2, "-2": "BAIL" }, ShapeFlags: { ELEMENT: 1, 1: "ELEMENT", FUNCTIONAL_COMPONENT: 2, 2: "FUNCTIONAL_COMPONENT", STATEFUL_COMPONENT: 4, 4: "STATEFUL_COMPONENT", TEXT_CHILDREN: 8, 8: "TEXT_CHILDREN", ARRAY_CHILDREN: 16, 16: "ARRAY_CHILDREN", SLOTS_CHILDREN: 32, 32: "SLOTS_CHILDREN", TELEPORT: 64, 64: "TELEPORT", SUSPENSE: 128, 128: "SUSPENSE", COMPONENT_SHOULD_KEEP_ALIVE: 256, 256: "COMPONENT_SHOULD_KEEP_ALIVE", COMPONENT_KEPT_ALIVE: 512, 512: "COMPONENT_KEPT_ALIVE", COMPONENT: 6, 6: "COMPONENT" }, SlotFlags: { STABLE: 1, 1: "STABLE", DYNAMIC: 2, 2: "DYNAMIC", FORWARDED: 3, 3: "FORWARDED" }, camelize: Fr, capitalize: Wr, cssVarNameEscapeSymbolsRE: bo, def, escapeHtml: escapeHtml$1, escapeHtmlComment, extend: $r, genCacheKey: function(e2, t2) {
      return e2 + JSON.stringify(t2, (e3, t3) => "function" == typeof t3 ? t3.toString() : t3);
    }, genPropsAccessExp: function(e2) {
      return Gr.test(e2) ? `__props.${e2}` : `__props[${JSON.stringify(e2)}]`;
    }, generateCodeFrame, getEscapedCssVarName: function(e2, t2) {
      return e2.replace(bo, (e3) => t2 ? '"' === e3 ? '\\\\\\"' : `\\\\${e3}` : `\\${e3}`);
    }, getGlobalThis, hasChanged, hasOwn, hyphenate: qr, includeBooleanAttr, invokeArrayFns, isArray: jr, isBooleanAttr: lo, isBuiltInDirective: Ur, isDate, isFunction, isGloballyAllowed: Qr, isGloballyWhitelisted: Zr, isHTMLTag: ro, isIntegerKey, isKnownHtmlAttr: ho, isKnownMathMLAttr: go, isKnownSvgAttr: mo, isMap, isMathMLTag: so, isModelListener, isObject, isOn, isPlainObject, isPromise, isRegExp, isRenderableAttrValue, isReservedProp: Hr, isSSRSafeAttrName, isSVGTag: oo, isSet, isSpecialBooleanAttr: co, isString, isSymbol, isVoidTag: io, looseEqual, looseIndexOf, looseToNumber, makeMap, normalizeClass, normalizeCssVarValue, normalizeProps: normalizeProps$1, normalizeStyle, objectToString: Dr, parseStringStyle, propsToAttrMap: fo, remove, slotFlagsText: Yr, stringifyStyle, toDisplayString, toHandlerKey: Kr, toNumber, toRawType, toTypeString }, Symbol.toStringTag, { value: "Module" })), _o = { appName: "Nuxt", statusCode: 500, statusMessage: "Internal server error", description: "This page is temporarily unavailable.", refresh: "Refresh this page" }, Eo = Object.freeze(Object.defineProperty({ __proto__: null, template: (e2) => '<!DOCTYPE html><html lang="en"><head><title>' + escapeHtml$1((e2 = { ..._o, ...e2 }).statusCode) + " - " + escapeHtml$1(e2.statusMessage) + " | " + escapeHtml$1(e2.appName) + `</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0" name="viewport"><script>!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();<\/script><style>*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1,h2{font-size:inherit;font-weight:inherit}h1,h2,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.grid{display:grid}.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.max-w-520px{max-width:520px}.min-h-screen{min-height:100vh}.place-content-center{place-content:center}.overflow-hidden{overflow:hidden}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-2{padding-left:.5rem;padding-right:.5rem}.text-center{text-align:center}.text-\\[80px\\]{font-size:80px}.text-2xl{font-size:1.5rem;line-height:2rem}.text-\\[\\#020420\\]{--un-text-opacity:1;color:rgb(2 4 32/var(--un-text-opacity))}.text-\\[\\#64748B\\]{--un-text-opacity:1;color:rgb(100 116 139/var(--un-text-opacity))}.font-semibold{font-weight:600}.leading-none{line-height:1}.tracking-wide{letter-spacing:.025em}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.tabular-nums{--un-numeric-spacing:tabular-nums;font-variant-numeric:var(--un-ordinal) var(--un-slashed-zero) var(--un-numeric-figure) var(--un-numeric-spacing) var(--un-numeric-fraction)}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-\\[\\#020420\\]{--un-bg-opacity:1;background-color:rgb(2 4 32/var(--un-bg-opacity))}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (min-width:640px){.sm\\:text-\\[110px\\]{font-size:110px}.sm\\:text-3xl{font-size:1.875rem;line-height:2.25rem}}</style></head><body class="antialiased bg-white dark:bg-[#020420] dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-[#020420] tracking-wide"><div class="max-w-520px text-center"><h1 class="font-semibold leading-none mb-4 sm:text-[110px] tabular-nums text-[80px]">` + escapeHtml$1(e2.statusCode) + '</h1><h2 class="font-semibold mb-2 sm:text-3xl text-2xl">' + escapeHtml$1(e2.statusMessage) + '</h2><p class="mb-4 px-2 text-[#64748B] text-md">' + escapeHtml$1(e2.description) + "</p></div></body></html>" }, Symbol.toStringTag, { value: "Module" }));
    function getModuleDependencies(e2, t2) {
      if (t2._dependencies[e2])
        return t2._dependencies[e2];
      const r2 = t2._dependencies[e2] = { scripts: {}, styles: {}, preload: {}, prefetch: {} }, s2 = t2.manifest[e2];
      if (!s2)
        return r2;
      s2.file && (r2.preload[e2] = s2, (s2.isEntry || s2.sideEffects) && (r2.scripts[e2] = s2));
      for (const e3 of s2.css || [])
        r2.styles[e3] = r2.preload[e3] = r2.prefetch[e3] = t2.manifest[e3];
      for (const e3 of s2.assets || [])
        r2.preload[e3] = r2.prefetch[e3] = t2.manifest[e3];
      for (const e3 of s2.imports || []) {
        const s3 = getModuleDependencies(e3, t2);
        Object.assign(r2.styles, s3.styles), Object.assign(r2.preload, s3.preload), Object.assign(r2.prefetch, s3.prefetch);
      }
      const a2 = {};
      for (const e3 in r2.preload) {
        const t3 = r2.preload[e3];
        t3.preload && (a2[e3] = t3);
      }
      return r2.preload = a2, r2;
    }
    __name(getModuleDependencies, "getModuleDependencies");
    function getRequestDependencies(e2, t2) {
      if (e2._requestDependencies)
        return e2._requestDependencies;
      const r2 = function(e3, t3) {
        const r3 = Array.from(e3).sort().join(",");
        if (t3._dependencySets[r3])
          return t3._dependencySets[r3];
        const s2 = { scripts: {}, styles: {}, preload: {}, prefetch: {} };
        for (const r4 of e3) {
          const e4 = getModuleDependencies(r4, t3);
          Object.assign(s2.scripts, e4.scripts), Object.assign(s2.styles, e4.styles), Object.assign(s2.preload, e4.preload), Object.assign(s2.prefetch, e4.prefetch);
          for (const e5 of t3.manifest[r4]?.dynamicImports || []) {
            const r5 = getModuleDependencies(e5, t3);
            Object.assign(s2.prefetch, r5.scripts), Object.assign(s2.prefetch, r5.styles), Object.assign(s2.prefetch, r5.preload);
          }
        }
        const a2 = {};
        for (const e4 in s2.prefetch) {
          const t4 = s2.prefetch[e4];
          t4.prefetch && (a2[e4] = t4);
        }
        s2.prefetch = a2;
        for (const e4 in s2.preload)
          delete s2.prefetch[e4];
        for (const e4 in s2.styles)
          delete s2.preload[e4], delete s2.prefetch[e4];
        return t3._dependencySets[r3] = s2, s2;
      }(new Set(Array.from([...t2._entrypoints, ...e2.modules || e2._registeredComponents || []])), t2);
      return e2._requestDependencies = r2, r2;
    }
    __name(getRequestDependencies, "getRequestDependencies");
    function renderStyles(e2, t2) {
      const { styles: r2 } = getRequestDependencies(e2, t2);
      return Object.values(r2).map((e3) => renderLinkToString({ rel: "stylesheet", href: t2.buildAssetsURL(e3.file), crossorigin: "" })).join("");
    }
    __name(renderStyles, "renderStyles");
    function getResources(e2, t2) {
      return [...getPreloadLinks(e2, t2), ...getPrefetchLinks(e2, t2)];
    }
    __name(getResources, "getResources");
    function renderResourceHints(e2, t2) {
      return getResources(e2, t2).map(renderLinkToString).join("");
    }
    __name(renderResourceHints, "renderResourceHints");
    function renderResourceHeaders(e2, t2) {
      return { link: getResources(e2, t2).map(renderLinkToHeader).join(", ") };
    }
    __name(renderResourceHeaders, "renderResourceHeaders");
    function getPreloadLinks(e2, t2) {
      const { preload: r2 } = getRequestDependencies(e2, t2);
      return Object.values(r2).map((e3) => ({ rel: e3.module ? "modulepreload" : "preload", as: e3.resourceType, type: e3.mimeType ?? null, crossorigin: "style" === e3.resourceType || "font" === e3.resourceType || "script" === e3.resourceType || e3.module ? "" : null, href: t2.buildAssetsURL(e3.file) }));
    }
    __name(getPreloadLinks, "getPreloadLinks");
    function getPrefetchLinks(e2, t2) {
      const { prefetch: r2 } = getRequestDependencies(e2, t2);
      return Object.values(r2).map((e3) => ({ rel: "prefetch", as: e3.resourceType, type: e3.mimeType ?? null, crossorigin: "style" === e3.resourceType || "font" === e3.resourceType || "script" === e3.resourceType || e3.module ? "" : null, href: t2.buildAssetsURL(e3.file) }));
    }
    __name(getPrefetchLinks, "getPrefetchLinks");
    function renderScripts(e2, t2) {
      const { scripts: r2 } = getRequestDependencies(e2, t2);
      return Object.values(r2).map((e3) => {
        return r3 = { type: e3.module ? "module" : null, src: t2.buildAssetsURL(e3.file), defer: e3.module ? null : "", crossorigin: "" }, `<script${Object.entries(r3).map(([e4, t3]) => null === t3 ? "" : t3 ? ` ${e4}="${t3}"` : " " + e4).join("")}><\/script>`;
        var r3;
      }).join("");
    }
    __name(renderScripts, "renderScripts");
    function createRenderer$1(e2, t2) {
      const r2 = function({ manifest: e3, buildAssetsURL: t3 }) {
        const r3 = { buildAssetsURL: t3 || withLeadingSlash, manifest: void 0, updateManifest, _dependencies: void 0, _dependencySets: void 0, _entrypoints: void 0 };
        function updateManifest(e4) {
          const t4 = Object.entries(e4);
          r3.manifest = e4, r3._dependencies = {}, r3._dependencySets = {}, r3._entrypoints = t4.filter((e5) => e5[1].isEntry).map(([e5]) => e5);
        }
        __name(updateManifest, "updateManifest");
        return updateManifest(e3), r3;
      }(t2);
      return { rendererContext: r2, async renderToString(s2) {
        s2._registeredComponents = s2._registeredComponents || /* @__PURE__ */ new Set();
        const a2 = await Promise.resolve(e2).then((e3) => "default" in e3 ? e3.default : e3), c2 = await a2(s2), wrap = /* @__PURE__ */ __name((e3) => () => e3(s2, r2), "wrap");
        return { html: await t2.renderToString(c2, s2), renderResourceHeaders: wrap(renderResourceHeaders), renderResourceHints: wrap(renderResourceHints), renderStyles: wrap(renderStyles), renderScripts: wrap(renderScripts) };
      } };
    }
    __name(createRenderer$1, "createRenderer$1");
    function renderLinkToString(e2) {
      return `<link${Object.entries(e2).map(([e3, t2]) => null === t2 ? "" : t2 ? ` ${e3}="${t2}"` : " " + e3).join("")}>`;
    }
    __name(renderLinkToString, "renderLinkToString");
    function renderLinkToHeader(e2) {
      return `<${e2.href}>${Object.entries(e2).map(([e3, t2]) => "href" === e3 || null === t2 ? "" : t2 ? `; ${e3}="${t2}"` : `; ${e3}`).join("")}`;
    }
    __name(renderLinkToHeader, "renderLinkToHeader");
    const wo = /* @__PURE__ */ new Set(["meta", "link", "base"]), So = /* @__PURE__ */ new Set(["link", "style", "script", "noscript"]), To = /* @__PURE__ */ new Set(["title", "titleTemplate", "script", "style", "noscript"]), Co = /* @__PURE__ */ new Set(["title", "base", "htmlAttrs", "bodyAttrs", "meta", "link", "style", "script", "noscript"]), ko = /* @__PURE__ */ new Set(["base", "title", "titleTemplate", "bodyAttrs", "htmlAttrs", "templateParams"]), Ro = /* @__PURE__ */ new Set(["key", "tagPosition", "tagPriority", "tagDuplicateStrategy", "innerHTML", "textContent", "processTemplateParams"]), Ao = /* @__PURE__ */ new Set(["templateParams", "htmlAttrs", "bodyAttrs"]), No = /* @__PURE__ */ new Set(["theme-color", "google-site-verification", "og", "article", "book", "profile", "twitter", "author"]), Oo = ["name", "property", "http-equiv"], Io = /* @__PURE__ */ new Set(["viewport", "description", "keywords", "robots"]);
    function dedupeKey(e2) {
      const { props: t2, tag: r2 } = e2;
      if (ko.has(r2))
        return r2;
      if ("link" === r2 && "canonical" === t2.rel)
        return "canonical";
      if (t2.charset)
        return "charset";
      if ("meta" === e2.tag) {
        for (const s2 of Oo)
          if (void 0 !== t2[s2]) {
            const a2 = t2[s2], c2 = a2.includes(":"), p2 = Io.has(a2);
            return `${r2}:${a2}${!(c2 || p2) && e2.key ? `:key:${e2.key}` : ""}`;
          }
      }
      if (e2.key)
        return `${r2}:key:${e2.key}`;
      if (t2.id)
        return `${r2}:id:${t2.id}`;
      if (To.has(r2)) {
        const t3 = e2.textContent || e2.innerHTML;
        if (t3)
          return `${r2}:content:${t3}`;
      }
    }
    __name(dedupeKey, "dedupeKey");
    function walkResolver(e2, t2, r2) {
      let s2;
      if ("function" === typeof e2 && (r2 && ("titleTemplate" === r2 || "o" === r2[0] && "n" === r2[1]) || (e2 = e2())), t2 && (s2 = t2(r2, e2)), Array.isArray(s2))
        return s2.map((e3) => walkResolver(e3, t2));
      if (s2?.constructor === Object) {
        const e3 = {};
        for (const r3 of Object.keys(s2))
          e3[r3] = walkResolver(s2[r3], t2, r3);
        return e3;
      }
      return s2;
    }
    __name(walkResolver, "walkResolver");
    function normalizeProps(e2, t2) {
      return e2.props = e2.props || {}, t2 ? "templateParams" === e2.tag ? (e2.props = t2, e2) : (Object.entries(t2).forEach(([r2, s2]) => {
        if (null === s2)
          return void (e2.props[r2] = null);
        if ("class" === r2 || "style" === r2)
          return void (e2.props[r2] = function(e3, t3) {
            const r3 = "style" === e3 ? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Set();
            function processValue(t4) {
              const s3 = t4.trim();
              if (s3)
                if ("style" === e3) {
                  const [e4, ...t5] = s3.split(":").map((e5) => e5.trim());
                  e4 && t5.length && r3.set(e4, t5.join(":"));
                } else
                  s3.split(" ").filter(Boolean).forEach((e4) => r3.add(e4));
            }
            __name(processValue, "processValue");
            return "string" == typeof t3 ? "style" === e3 ? t3.split(";").forEach(processValue) : processValue(t3) : Array.isArray(t3) ? t3.forEach((e4) => processValue(e4)) : t3 && "object" == typeof t3 && Object.entries(t3).forEach(([t4, s3]) => {
              s3 && "false" !== s3 && ("style" === e3 ? r3.set(t4.trim(), s3) : processValue(t4));
            }), r3;
          }(r2, s2));
        if (Ro.has(r2)) {
          if (["textContent", "innerHTML"].includes(r2) && "object" == typeof s2) {
            let a3 = t2.type;
            if (t2.type || (a3 = "application/json"), !a3?.endsWith("json") && "speculationrules" !== a3)
              return;
            t2.type = a3, e2.props.type = a3, e2[r2] = JSON.stringify(s2);
          } else
            e2[r2] = s2;
          return;
        }
        const a2 = String(s2), c2 = r2.startsWith("data-");
        "true" === a2 || "" === a2 ? e2.props[r2] = !c2 || a2 : !s2 && c2 && "false" === a2 ? e2.props[r2] = "false" : void 0 !== s2 && (e2.props[r2] = s2);
      }), e2) : e2;
    }
    __name(normalizeProps, "normalizeProps");
    function normalizeTag(e2, t2) {
      const r2 = normalizeProps({ tag: e2, props: {} }, "object" == typeof t2 && "function" != typeof t2 ? t2 : { ["script" === e2 || "noscript" === e2 || "style" === e2 ? "innerHTML" : "textContent"]: t2 });
      return r2.key && So.has(r2.tag) && (r2.props["data-hid"] = r2._h = r2.key), "script" === r2.tag && "object" == typeof r2.innerHTML && (r2.innerHTML = JSON.stringify(r2.innerHTML), r2.props.type = r2.props.type || "application/json"), Array.isArray(r2.props.content) ? r2.props.content.map((e3) => ({ ...r2, props: { ...r2.props, content: e3 } })) : r2;
    }
    __name(normalizeTag, "normalizeTag");
    function normalizeEntryToTags(e2, t2) {
      if (!e2)
        return [];
      "function" == typeof e2 && (e2 = e2());
      const resolvers = /* @__PURE__ */ __name((e3, r3) => {
        for (let s2 = 0; s2 < t2.length; s2++)
          r3 = t2[s2](e3, r3);
        return r3;
      }, "resolvers");
      e2 = resolvers(void 0, e2);
      const r2 = [];
      return e2 = walkResolver(e2, resolvers), Object.entries(e2 || {}).forEach(([e3, t3]) => {
        if (void 0 !== t3)
          for (const s2 of Array.isArray(t3) ? t3 : [t3])
            r2.push(normalizeTag(e3, s2));
      }), r2.flat();
    }
    __name(normalizeEntryToTags, "normalizeEntryToTags");
    const sortTags = /* @__PURE__ */ __name((e2, t2) => e2._w === t2._w ? e2._p - t2._p : e2._w - t2._w, "sortTags"), Po = { base: -10, title: 10 }, Lo = { critical: -8, high: -1, low: 2 }, Mo = { meta: { "content-security-policy": -30, charset: -20, viewport: -15 }, link: { preconnect: 20, stylesheet: 60, preload: 70, modulepreload: 70, prefetch: 90, "dns-prefetch": 90, prerender: 90 }, script: { async: 30, defer: 80, sync: 50 }, style: { imported: 40, sync: 60 } }, $o = /@import/, isTruthy = /* @__PURE__ */ __name((e2) => "" === e2 || true === e2, "isTruthy");
    function tagWeight(e2, t2) {
      if ("number" == typeof t2.tagPriority)
        return t2.tagPriority;
      let r2 = 100;
      const s2 = Lo[t2.tagPriority] || 0, a2 = e2.resolvedOptions.disableCapoSorting ? { link: {}, script: {}, style: {} } : Mo;
      if (t2.tag in Po)
        r2 = Po[t2.tag];
      else if ("meta" === t2.tag) {
        const e3 = "content-security-policy" === t2.props["http-equiv"] ? "content-security-policy" : t2.props.charset ? "charset" : "viewport" === t2.props.name ? "viewport" : null;
        e3 && (r2 = Mo.meta[e3]);
      } else
        "link" === t2.tag && t2.props.rel ? r2 = a2.link[t2.props.rel] : "script" === t2.tag ? isTruthy(t2.props.async) ? r2 = a2.script.async : !t2.props.src || isTruthy(t2.props.defer) || isTruthy(t2.props.async) || "module" === t2.props.type || t2.props.type?.endsWith("json") ? isTruthy(t2.props.defer) && t2.props.src && !isTruthy(t2.props.async) && (r2 = a2.script.defer) : r2 = a2.script.sync : "style" === t2.tag && (r2 = t2.innerHTML && $o.test(t2.innerHTML) ? a2.style.imported : a2.style.sync);
      return (r2 || 100) + s2;
    }
    __name(tagWeight, "tagWeight");
    function registerPlugin(e2, t2) {
      const r2 = "function" == typeof t2 ? t2(e2) : t2, s2 = r2.key || String(e2.plugins.size + 1);
      e2.plugins.get(s2) || (e2.plugins.set(s2, r2), e2.hooks.addHooks(r2.hooks || {}));
    }
    __name(registerPlugin, "registerPlugin");
    function createUnhead(e2 = {}) {
      const t2 = createHooks();
      t2.addHooks(e2.hooks || {});
      const r2 = !e2.document, s2 = /* @__PURE__ */ new Map(), a2 = /* @__PURE__ */ new Map(), c2 = /* @__PURE__ */ new Set(), p2 = { _entryCount: 1, plugins: a2, dirty: false, resolvedOptions: e2, hooks: t2, ssr: r2, entries: s2, headEntries: () => [...s2.values()], use: (e3) => registerPlugin(p2, e3), push(e3, a3) {
        const u2 = { ...a3 || {} };
        delete u2.head;
        const d2 = u2._index ?? p2._entryCount++, f2 = { _i: d2, input: e3, options: u2 }, m2 = { _poll(e4 = false) {
          p2.dirty = true, !e4 && c2.add(d2), t2.callHook("entries:updated", p2);
        }, dispose() {
          s2.delete(d2) && p2.invalidate();
        }, patch(e4) {
          (!u2.mode || "server" === u2.mode && r2 || "client" === u2.mode && !r2) && (f2.input = e4, s2.set(d2, f2), m2._poll());
        } };
        return m2.patch(e3), m2;
      }, async resolveTags() {
        const r3 = { tagMap: /* @__PURE__ */ new Map(), tags: [], entries: [...p2.entries.values()] };
        for (await t2.callHook("entries:resolve", r3); c2.size; ) {
          const r4 = c2.values().next().value;
          c2.delete(r4);
          const a4 = s2.get(r4);
          if (a4) {
            const r5 = { tags: normalizeEntryToTags(a4.input, e2.propResolvers || []).map((e3) => Object.assign(e3, a4.options)), entry: a4 };
            await t2.callHook("entries:normalize", r5), a4._tags = r5.tags.map((e3, t3) => (e3._w = tagWeight(p2, e3), e3._p = (a4._i << 10) + t3, e3._d = dedupeKey(e3), e3));
          }
        }
        let a3 = false;
        r3.entries.flatMap((e3) => (e3._tags || []).map((e4) => ({ ...e4, props: { ...e4.props } }))).sort(sortTags).reduce((e3, t3) => {
          const r4 = String(t3._d || t3._p);
          if (!e3.has(r4))
            return e3.set(r4, t3);
          const s3 = e3.get(r4);
          if ("merge" === (t3?.tagDuplicateStrategy || (Ao.has(t3.tag) ? "merge" : null) || (t3.key && t3.key === s3.key ? "merge" : null))) {
            const a4 = { ...s3.props };
            Object.entries(t3.props).forEach(([e4, t4]) => a4[e4] = "style" === e4 ? new Map([...s3.props.style || /* @__PURE__ */ new Map(), ...t4]) : "class" === e4 ? /* @__PURE__ */ new Set([...s3.props.class || /* @__PURE__ */ new Set(), ...t4]) : t4), e3.set(r4, { ...t3, props: a4 });
          } else
            t3._p >> 10 == s3._p >> 10 && "meta" === t3.tag && function(e4) {
              const t4 = e4.split(":");
              return !!t4.length && No.has(t4[1]);
            }(r4) ? (e3.set(r4, Object.assign([...Array.isArray(s3) ? s3 : [s3], t3], t3)), a3 = true) : (t3._w === s3._w ? t3._p > s3._p : t3?._w < s3?._w) && e3.set(r4, t3);
          return e3;
        }, r3.tagMap);
        const u2 = r3.tagMap.get("title"), d2 = r3.tagMap.get("titleTemplate");
        if (p2._title = u2?.textContent, d2) {
          const e3 = d2?.textContent;
          if (p2._titleTemplate = e3, e3) {
            let t3 = "function" == typeof e3 ? e3(u2?.textContent) : e3;
            "string" != typeof t3 || p2.plugins.has("template-params") || (t3 = t3.replace("%s", u2?.textContent || "")), u2 ? null === t3 ? r3.tagMap.delete("title") : r3.tagMap.set("title", { ...u2, textContent: t3 }) : (d2.tag = "title", d2.textContent = t3);
          }
        }
        r3.tags = Array.from(r3.tagMap.values()), a3 && (r3.tags = r3.tags.flat().sort(sortTags)), await t2.callHook("tags:beforeResolve", r3), await t2.callHook("tags:resolve", r3), await t2.callHook("tags:afterResolve", r3);
        const f2 = [];
        for (const e3 of r3.tags) {
          const { innerHTML: t3, tag: r4, props: s3 } = e3;
          if (Co.has(r4) && ((0 !== Object.keys(s3).length || e3.innerHTML || e3.textContent) && ("meta" !== r4 || s3.content || s3["http-equiv"] || s3.charset))) {
            if ("script" === r4 && t3) {
              if (s3.type?.endsWith("json")) {
                const r5 = "string" == typeof t3 ? t3 : JSON.stringify(t3);
                e3.innerHTML = r5.replace(/</g, "\\u003C");
              } else
                "string" == typeof t3 && (e3.innerHTML = t3.replace(new RegExp(`</${r4}`, "g"), `<\\/${r4}`));
              e3._d = dedupeKey(e3);
            }
            f2.push(e3);
          }
        }
        return f2;
      }, invalidate() {
        for (const e3 of s2.values())
          c2.add(e3._i);
        p2.dirty = true, t2.callHook("entries:updated", p2);
      } };
      return (e2?.plugins || []).forEach((e3) => registerPlugin(p2, e3)), p2.hooks.callHook("init", p2), e2.init?.forEach((e3) => e3 && p2.push(e3)), p2;
    }
    __name(createUnhead, "createUnhead");
    function encodeAttribute(e2) {
      return String(e2).replace(/"/g, "&quot;");
    }
    __name(encodeAttribute, "encodeAttribute");
    function propsToString(e2) {
      let t2 = "";
      for (const r2 in e2) {
        if (!Object.hasOwn(e2, r2))
          continue;
        let s2 = e2[r2];
        "class" !== r2 && "style" !== r2 || "string" == typeof s2 || (s2 = "class" === r2 ? Array.from(s2).join(" ") : Array.from(s2).map(([e3, t3]) => `${e3}:${t3}`).join(";")), false !== s2 && null !== s2 && (t2 += true === s2 ? ` ${r2}` : ` ${r2}="${encodeAttribute(s2)}"`);
      }
      return t2;
    }
    __name(propsToString, "propsToString");
    function tagToString(e2) {
      const t2 = propsToString(e2.props), r2 = `<${e2.tag}${t2}>`;
      if (!To.has(e2.tag))
        return wo.has(e2.tag) ? r2 : `${r2}</${e2.tag}>`;
      let s2 = String(e2.textContent || e2.innerHTML || "");
      return s2 = "title" === e2.tag ? s2.replace(/[&<>"'/]/g, (e3) => {
        switch (e3) {
          case "&":
            return "&amp;";
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case '"':
            return "&quot;";
          case "'":
            return "&#x27;";
          case "/":
            return "&#x2F;";
          default:
            return e3;
        }
      }) : s2.replace(new RegExp(`</${e2.tag}`, "gi"), `<\\/${e2.tag}`), wo.has(e2.tag) ? r2 : `${r2}${s2}</${e2.tag}>`;
    }
    __name(tagToString, "tagToString");
    async function renderSSRHead(e2, t2) {
      const r2 = { shouldRender: true };
      if (await e2.hooks.callHook("ssr:beforeRender", r2), !r2.shouldRender)
        return { headTags: "", bodyTags: "", bodyTagsOpen: "", htmlAttrs: "", bodyAttrs: "" };
      const s2 = { tags: t2?.resolvedTags || await e2.resolveTags() };
      await e2.hooks.callHook("ssr:render", s2);
      const a2 = function(e3) {
        const t3 = { htmlAttrs: {}, bodyAttrs: {}, tags: { head: "", bodyClose: "", bodyOpen: "" } };
        for (const r3 of e3) {
          if ("htmlAttrs" === r3.tag || "bodyAttrs" === r3.tag) {
            Object.assign(t3[r3.tag], r3.props);
            continue;
          }
          const e4 = tagToString(r3), s3 = r3.tagPosition || "head";
          t3.tags[s3] += t3.tags[s3] ? `${e4}` : e4;
        }
        return { headTags: t3.tags.head, bodyTags: t3.tags.bodyClose, bodyTagsOpen: t3.tags.bodyOpen, htmlAttrs: propsToString(t3.htmlAttrs), bodyAttrs: propsToString(t3.bodyAttrs) };
      }(s2.tags), c2 = { tags: s2.tags, html: a2 };
      return await e2.hooks.callHook("ssr:rendered", c2), c2.html;
    }
    __name(renderSSRHead, "renderSSRHead");
    let Bo, jo;
    class EffectScope {
      constructor(e2 = false) {
        this.detached = e2, this._active = true, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = false, this.parent = Bo, !e2 && Bo && (this.index = (Bo.scopes || (Bo.scopes = [])).push(this) - 1);
      }
      get active() {
        return this._active;
      }
      pause() {
        if (this._active) {
          let e2, t2;
          if (this._isPaused = true, this.scopes)
            for (e2 = 0, t2 = this.scopes.length; e2 < t2; e2++)
              this.scopes[e2].pause();
          for (e2 = 0, t2 = this.effects.length; e2 < t2; e2++)
            this.effects[e2].pause();
        }
      }
      resume() {
        if (this._active && this._isPaused) {
          let e2, t2;
          if (this._isPaused = false, this.scopes)
            for (e2 = 0, t2 = this.scopes.length; e2 < t2; e2++)
              this.scopes[e2].resume();
          for (e2 = 0, t2 = this.effects.length; e2 < t2; e2++)
            this.effects[e2].resume();
        }
      }
      run(e2) {
        if (this._active) {
          const t2 = Bo;
          try {
            return Bo = this, e2();
          } finally {
            Bo = t2;
          }
        }
      }
      on() {
        1 === ++this._on && (this.prevScope = Bo, Bo = this);
      }
      off() {
        this._on > 0 && 0 === --this._on && (Bo = this.prevScope, this.prevScope = void 0);
      }
      stop(e2) {
        if (this._active) {
          let t2, r2;
          for (this._active = false, t2 = 0, r2 = this.effects.length; t2 < r2; t2++)
            this.effects[t2].stop();
          for (this.effects.length = 0, t2 = 0, r2 = this.cleanups.length; t2 < r2; t2++)
            this.cleanups[t2]();
          if (this.cleanups.length = 0, this.scopes) {
            for (t2 = 0, r2 = this.scopes.length; t2 < r2; t2++)
              this.scopes[t2].stop(true);
            this.scopes.length = 0;
          }
          if (!this.detached && this.parent && !e2) {
            const e3 = this.parent.scopes.pop();
            e3 && e3 !== this && (this.parent.scopes[this.index] = e3, e3.index = this.index);
          }
          this.parent = void 0;
        }
      }
    }
    __name(EffectScope, "EffectScope");
    function getCurrentScope() {
      return Bo;
    }
    __name(getCurrentScope, "getCurrentScope");
    const Do = /* @__PURE__ */ new WeakSet();
    class ReactiveEffect {
      constructor(e2) {
        this.fn = e2, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Bo && Bo.active && Bo.effects.push(this);
      }
      pause() {
        this.flags |= 64;
      }
      resume() {
        64 & this.flags && (this.flags &= -65, Do.has(this) && (Do.delete(this), this.trigger()));
      }
      notify() {
        2 & this.flags && !(32 & this.flags) || 8 & this.flags || batch(this);
      }
      run() {
        if (!(1 & this.flags))
          return this.fn();
        this.flags |= 2, cleanupEffect(this), prepareDeps(this);
        const e2 = jo, t2 = Fo;
        jo = this, Fo = true;
        try {
          return this.fn();
        } finally {
          cleanupDeps(this), jo = e2, Fo = t2, this.flags &= -3;
        }
      }
      stop() {
        if (1 & this.flags) {
          for (let e2 = this.deps; e2; e2 = e2.nextDep)
            removeSub(e2);
          this.deps = this.depsTail = void 0, cleanupEffect(this), this.onStop && this.onStop(), this.flags &= -2;
        }
      }
      trigger() {
        64 & this.flags ? Do.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
      }
      runIfDirty() {
        isDirty(this) && this.run();
      }
      get dirty() {
        return isDirty(this);
      }
    }
    __name(ReactiveEffect, "ReactiveEffect");
    let Ho, Uo, Vo = 0;
    function batch(e2, t2 = false) {
      if (e2.flags |= 8, t2)
        return e2.next = Uo, void (Uo = e2);
      e2.next = Ho, Ho = e2;
    }
    __name(batch, "batch");
    function startBatch() {
      Vo++;
    }
    __name(startBatch, "startBatch");
    function endBatch() {
      if (--Vo > 0)
        return;
      if (Uo) {
        let e3 = Uo;
        for (Uo = void 0; e3; ) {
          const t2 = e3.next;
          e3.next = void 0, e3.flags &= -9, e3 = t2;
        }
      }
      let e2;
      for (; Ho; ) {
        let t2 = Ho;
        for (Ho = void 0; t2; ) {
          const r2 = t2.next;
          if (t2.next = void 0, t2.flags &= -9, 1 & t2.flags)
            try {
              t2.trigger();
            } catch (t3) {
              e2 || (e2 = t3);
            }
          t2 = r2;
        }
      }
      if (e2)
        throw e2;
    }
    __name(endBatch, "endBatch");
    function prepareDeps(e2) {
      for (let t2 = e2.deps; t2; t2 = t2.nextDep)
        t2.version = -1, t2.prevActiveLink = t2.dep.activeLink, t2.dep.activeLink = t2;
    }
    __name(prepareDeps, "prepareDeps");
    function cleanupDeps(e2) {
      let t2, r2 = e2.depsTail, s2 = r2;
      for (; s2; ) {
        const e3 = s2.prevDep;
        -1 === s2.version ? (s2 === r2 && (r2 = e3), removeSub(s2), removeDep(s2)) : t2 = s2, s2.dep.activeLink = s2.prevActiveLink, s2.prevActiveLink = void 0, s2 = e3;
      }
      e2.deps = t2, e2.depsTail = r2;
    }
    __name(cleanupDeps, "cleanupDeps");
    function isDirty(e2) {
      for (let t2 = e2.deps; t2; t2 = t2.nextDep)
        if (t2.dep.version !== t2.version || t2.dep.computed && (refreshComputed(t2.dep.computed) || t2.dep.version !== t2.version))
          return true;
      return !!e2._dirty;
    }
    __name(isDirty, "isDirty");
    function refreshComputed(e2) {
      if (4 & e2.flags && !(16 & e2.flags))
        return;
      if (e2.flags &= -17, e2.globalVersion === qo)
        return;
      if (e2.globalVersion = qo, !e2.isSSR && 128 & e2.flags && (!e2.deps && !e2._dirty || !isDirty(e2)))
        return;
      e2.flags |= 2;
      const t2 = e2.dep, r2 = jo, s2 = Fo;
      jo = e2, Fo = true;
      try {
        prepareDeps(e2);
        const r3 = e2.fn(e2._value);
        (0 === t2.version || hasChanged(r3, e2._value)) && (e2.flags |= 128, e2._value = r3, t2.version++);
      } catch (e3) {
        throw t2.version++, e3;
      } finally {
        jo = r2, Fo = s2, cleanupDeps(e2), e2.flags &= -3;
      }
    }
    __name(refreshComputed, "refreshComputed");
    function removeSub(e2, t2 = false) {
      const { dep: r2, prevSub: s2, nextSub: a2 } = e2;
      if (s2 && (s2.nextSub = a2, e2.prevSub = void 0), a2 && (a2.prevSub = s2, e2.nextSub = void 0), r2.subs === e2 && (r2.subs = s2, !s2 && r2.computed)) {
        r2.computed.flags &= -5;
        for (let e3 = r2.computed.deps; e3; e3 = e3.nextDep)
          removeSub(e3, true);
      }
      t2 || --r2.sc || !r2.map || r2.map.delete(r2.key);
    }
    __name(removeSub, "removeSub");
    function removeDep(e2) {
      const { prevDep: t2, nextDep: r2 } = e2;
      t2 && (t2.nextDep = r2, e2.prevDep = void 0), r2 && (r2.prevDep = t2, e2.nextDep = void 0);
    }
    __name(removeDep, "removeDep");
    let Fo = true;
    const zo = [];
    function pauseTracking() {
      zo.push(Fo), Fo = false;
    }
    __name(pauseTracking, "pauseTracking");
    function resetTracking() {
      const e2 = zo.pop();
      Fo = void 0 === e2 || e2;
    }
    __name(resetTracking, "resetTracking");
    function cleanupEffect(e2) {
      const { cleanup: t2 } = e2;
      if (e2.cleanup = void 0, t2) {
        const e3 = jo;
        jo = void 0;
        try {
          t2();
        } finally {
          jo = e3;
        }
      }
    }
    __name(cleanupEffect, "cleanupEffect");
    let qo = 0;
    class Link {
      constructor(e2, t2) {
        this.sub = e2, this.dep = t2, this.version = t2.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
      }
    }
    __name(Link, "Link");
    class Dep {
      constructor(e2) {
        this.computed = e2, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = true;
      }
      track(e2) {
        if (!jo || !Fo || jo === this.computed)
          return;
        let t2 = this.activeLink;
        if (void 0 === t2 || t2.sub !== jo)
          t2 = this.activeLink = new Link(jo, this), jo.deps ? (t2.prevDep = jo.depsTail, jo.depsTail.nextDep = t2, jo.depsTail = t2) : jo.deps = jo.depsTail = t2, addSub(t2);
        else if (-1 === t2.version && (t2.version = this.version, t2.nextDep)) {
          const e3 = t2.nextDep;
          e3.prevDep = t2.prevDep, t2.prevDep && (t2.prevDep.nextDep = e3), t2.prevDep = jo.depsTail, t2.nextDep = void 0, jo.depsTail.nextDep = t2, jo.depsTail = t2, jo.deps === t2 && (jo.deps = e3);
        }
        return t2;
      }
      trigger(e2) {
        this.version++, qo++, this.notify(e2);
      }
      notify(e2) {
        startBatch();
        try {
          0;
          for (let e3 = this.subs; e3; e3 = e3.prevSub)
            e3.sub.notify() && e3.sub.dep.notify();
        } finally {
          endBatch();
        }
      }
    }
    __name(Dep, "Dep");
    function addSub(e2) {
      if (e2.dep.sc++, 4 & e2.sub.flags) {
        const t2 = e2.dep.computed;
        if (t2 && !e2.dep.subs) {
          t2.flags |= 20;
          for (let e3 = t2.deps; e3; e3 = e3.nextDep)
            addSub(e3);
        }
        const r2 = e2.dep.subs;
        r2 !== e2 && (e2.prevSub = r2, r2 && (r2.nextSub = e2)), e2.dep.subs = e2;
      }
    }
    __name(addSub, "addSub");
    const Wo = /* @__PURE__ */ new WeakMap(), Ko = Symbol(""), Xo = Symbol(""), Go = Symbol("");
    function track(e2, t2, r2) {
      if (Fo && jo) {
        let t3 = Wo.get(e2);
        t3 || Wo.set(e2, t3 = /* @__PURE__ */ new Map());
        let s2 = t3.get(r2);
        s2 || (t3.set(r2, s2 = new Dep()), s2.map = t3, s2.key = r2), s2.track();
      }
    }
    __name(track, "track");
    function trigger(e2, t2, r2, s2, a2, c2) {
      const p2 = Wo.get(e2);
      if (!p2)
        return void qo++;
      const run = /* @__PURE__ */ __name((e3) => {
        e3 && e3.trigger();
      }, "run");
      if (startBatch(), "clear" === t2)
        p2.forEach(run);
      else {
        const a3 = jr(e2), c3 = a3 && isIntegerKey(r2);
        if (a3 && "length" === r2) {
          const e3 = Number(s2);
          p2.forEach((t3, r3) => {
            ("length" === r3 || r3 === Go || !isSymbol(r3) && r3 >= e3) && run(t3);
          });
        } else
          switch ((void 0 !== r2 || p2.has(void 0)) && run(p2.get(r2)), c3 && run(p2.get(Go)), t2) {
            case "add":
              a3 ? c3 && run(p2.get("length")) : (run(p2.get(Ko)), isMap(e2) && run(p2.get(Xo)));
              break;
            case "delete":
              a3 || (run(p2.get(Ko)), isMap(e2) && run(p2.get(Xo)));
              break;
            case "set":
              isMap(e2) && run(p2.get(Ko));
          }
      }
      endBatch();
    }
    __name(trigger, "trigger");
    function reactiveReadArray(e2) {
      const t2 = toRaw(e2);
      return t2 === e2 ? t2 : (track(t2, 0, Go), isShallow(e2) ? t2 : t2.map(toReactive));
    }
    __name(reactiveReadArray, "reactiveReadArray");
    function shallowReadArray(e2) {
      return track(e2 = toRaw(e2), 0, Go), e2;
    }
    __name(shallowReadArray, "shallowReadArray");
    const Jo = { __proto__: null, [Symbol.iterator]() {
      return iterator(this, Symbol.iterator, toReactive);
    }, concat(...e2) {
      return reactiveReadArray(this).concat(...e2.map((e3) => jr(e3) ? reactiveReadArray(e3) : e3));
    }, entries() {
      return iterator(this, "entries", (e2) => (e2[1] = toReactive(e2[1]), e2));
    }, every(e2, t2) {
      return apply(this, "every", e2, t2, void 0, arguments);
    }, filter(e2, t2) {
      return apply(this, "filter", e2, t2, (e3) => e3.map(toReactive), arguments);
    }, find(e2, t2) {
      return apply(this, "find", e2, t2, toReactive, arguments);
    }, findIndex(e2, t2) {
      return apply(this, "findIndex", e2, t2, void 0, arguments);
    }, findLast(e2, t2) {
      return apply(this, "findLast", e2, t2, toReactive, arguments);
    }, findLastIndex(e2, t2) {
      return apply(this, "findLastIndex", e2, t2, void 0, arguments);
    }, forEach(e2, t2) {
      return apply(this, "forEach", e2, t2, void 0, arguments);
    }, includes(...e2) {
      return searchProxy(this, "includes", e2);
    }, indexOf(...e2) {
      return searchProxy(this, "indexOf", e2);
    }, join(e2) {
      return reactiveReadArray(this).join(e2);
    }, lastIndexOf(...e2) {
      return searchProxy(this, "lastIndexOf", e2);
    }, map(e2, t2) {
      return apply(this, "map", e2, t2, void 0, arguments);
    }, pop() {
      return noTracking(this, "pop");
    }, push(...e2) {
      return noTracking(this, "push", e2);
    }, reduce(e2, ...t2) {
      return reduce(this, "reduce", e2, t2);
    }, reduceRight(e2, ...t2) {
      return reduce(this, "reduceRight", e2, t2);
    }, shift() {
      return noTracking(this, "shift");
    }, some(e2, t2) {
      return apply(this, "some", e2, t2, void 0, arguments);
    }, splice(...e2) {
      return noTracking(this, "splice", e2);
    }, toReversed() {
      return reactiveReadArray(this).toReversed();
    }, toSorted(e2) {
      return reactiveReadArray(this).toSorted(e2);
    }, toSpliced(...e2) {
      return reactiveReadArray(this).toSpliced(...e2);
    }, unshift(...e2) {
      return noTracking(this, "unshift", e2);
    }, values() {
      return iterator(this, "values", toReactive);
    } };
    function iterator(e2, t2, r2) {
      const s2 = shallowReadArray(e2), a2 = s2[t2]();
      return s2 === e2 || isShallow(e2) || (a2._next = a2.next, a2.next = () => {
        const e3 = a2._next();
        return e3.value && (e3.value = r2(e3.value)), e3;
      }), a2;
    }
    __name(iterator, "iterator");
    const Yo = Array.prototype;
    function apply(e2, t2, r2, s2, a2, c2) {
      const p2 = shallowReadArray(e2), u2 = p2 !== e2 && !isShallow(e2), d2 = p2[t2];
      if (d2 !== Yo[t2]) {
        const t3 = d2.apply(e2, c2);
        return u2 ? toReactive(t3) : t3;
      }
      let f2 = r2;
      p2 !== e2 && (u2 ? f2 = /* @__PURE__ */ __name(function(t3, s3) {
        return r2.call(this, toReactive(t3), s3, e2);
      }, "f") : r2.length > 2 && (f2 = /* @__PURE__ */ __name(function(t3, s3) {
        return r2.call(this, t3, s3, e2);
      }, "f")));
      const m2 = d2.call(p2, f2, s2);
      return u2 && a2 ? a2(m2) : m2;
    }
    __name(apply, "apply");
    function reduce(e2, t2, r2, s2) {
      const a2 = shallowReadArray(e2);
      let c2 = r2;
      return a2 !== e2 && (isShallow(e2) ? r2.length > 3 && (c2 = /* @__PURE__ */ __name(function(t3, s3, a3) {
        return r2.call(this, t3, s3, a3, e2);
      }, "c")) : c2 = /* @__PURE__ */ __name(function(t3, s3, a3) {
        return r2.call(this, t3, toReactive(s3), a3, e2);
      }, "c")), a2[t2](c2, ...s2);
    }
    __name(reduce, "reduce");
    function searchProxy(e2, t2, r2) {
      const s2 = toRaw(e2);
      track(s2, 0, Go);
      const a2 = s2[t2](...r2);
      return -1 !== a2 && false !== a2 || !isProxy(r2[0]) ? a2 : (r2[0] = toRaw(r2[0]), s2[t2](...r2));
    }
    __name(searchProxy, "searchProxy");
    function noTracking(e2, t2, r2 = []) {
      pauseTracking(), startBatch();
      const s2 = toRaw(e2)[t2].apply(e2, r2);
      return endBatch(), resetTracking(), s2;
    }
    __name(noTracking, "noTracking");
    const Qo = makeMap("__proto__,__v_isRef,__isVue"), Zo = new Set(Object.getOwnPropertyNames(Symbol).filter((e2) => "arguments" !== e2 && "caller" !== e2).map((e2) => Symbol[e2]).filter(isSymbol));
    function hasOwnProperty(e2) {
      isSymbol(e2) || (e2 = String(e2));
      const t2 = toRaw(this);
      return track(t2, 0, e2), t2.hasOwnProperty(e2);
    }
    __name(hasOwnProperty, "hasOwnProperty");
    class BaseReactiveHandler {
      constructor(e2 = false, t2 = false) {
        this._isReadonly = e2, this._isShallow = t2;
      }
      get(e2, t2, r2) {
        if ("__v_skip" === t2)
          return e2.__v_skip;
        const s2 = this._isReadonly, a2 = this._isShallow;
        if ("__v_isReactive" === t2)
          return !s2;
        if ("__v_isReadonly" === t2)
          return s2;
        if ("__v_isShallow" === t2)
          return a2;
        if ("__v_raw" === t2)
          return r2 === (s2 ? a2 ? us : ps : a2 ? ls : cs).get(e2) || Object.getPrototypeOf(e2) === Object.getPrototypeOf(r2) ? e2 : void 0;
        const c2 = jr(e2);
        if (!s2) {
          let e3;
          if (c2 && (e3 = Jo[t2]))
            return e3;
          if ("hasOwnProperty" === t2)
            return hasOwnProperty;
        }
        const p2 = Reflect.get(e2, t2, isRef(e2) ? e2 : r2);
        return (isSymbol(t2) ? Zo.has(t2) : Qo(t2)) ? p2 : (s2 || track(e2, 0, t2), a2 ? p2 : isRef(p2) ? c2 && isIntegerKey(t2) ? p2 : p2.value : isObject(p2) ? s2 ? readonly(p2) : reactive(p2) : p2);
      }
    }
    __name(BaseReactiveHandler, "BaseReactiveHandler");
    class MutableReactiveHandler extends BaseReactiveHandler {
      constructor(e2 = false) {
        super(false, e2);
      }
      set(e2, t2, r2, s2) {
        let a2 = e2[t2];
        if (!this._isShallow) {
          const t3 = isReadonly(a2);
          if (isShallow(r2) || isReadonly(r2) || (a2 = toRaw(a2), r2 = toRaw(r2)), !jr(e2) && isRef(a2) && !isRef(r2))
            return !t3 && (a2.value = r2, true);
        }
        const c2 = jr(e2) && isIntegerKey(t2) ? Number(t2) < e2.length : hasOwn(e2, t2), p2 = Reflect.set(e2, t2, r2, isRef(e2) ? e2 : s2);
        return e2 === toRaw(s2) && (c2 ? hasChanged(r2, a2) && trigger(e2, "set", t2, r2) : trigger(e2, "add", t2, r2)), p2;
      }
      deleteProperty(e2, t2) {
        const r2 = hasOwn(e2, t2);
        e2[t2];
        const s2 = Reflect.deleteProperty(e2, t2);
        return s2 && r2 && trigger(e2, "delete", t2, void 0), s2;
      }
      has(e2, t2) {
        const r2 = Reflect.has(e2, t2);
        return isSymbol(t2) && Zo.has(t2) || track(e2, 0, t2), r2;
      }
      ownKeys(e2) {
        return track(e2, 0, jr(e2) ? "length" : Ko), Reflect.ownKeys(e2);
      }
    }
    __name(MutableReactiveHandler, "MutableReactiveHandler");
    class ReadonlyReactiveHandler extends BaseReactiveHandler {
      constructor(e2 = false) {
        super(true, e2);
      }
      set(e2, t2) {
        return true;
      }
      deleteProperty(e2, t2) {
        return true;
      }
    }
    __name(ReadonlyReactiveHandler, "ReadonlyReactiveHandler");
    const es = new MutableReactiveHandler(), ts = new ReadonlyReactiveHandler(), ns = new MutableReactiveHandler(true), rs = new ReadonlyReactiveHandler(true), toShallow = /* @__PURE__ */ __name((e2) => e2, "toShallow"), getProto = /* @__PURE__ */ __name((e2) => Reflect.getPrototypeOf(e2), "getProto");
    function createReadonlyMethod(e2) {
      return function(...t2) {
        return "delete" !== e2 && ("clear" === e2 ? void 0 : this);
      };
    }
    __name(createReadonlyMethod, "createReadonlyMethod");
    function createInstrumentations(e2, t2) {
      const r2 = { get(r3) {
        const s2 = this.__v_raw, a2 = toRaw(s2), c2 = toRaw(r3);
        e2 || (hasChanged(r3, c2) && track(a2, 0, r3), track(a2, 0, c2));
        const { has: p2 } = getProto(a2), u2 = t2 ? toShallow : e2 ? toReadonly : toReactive;
        return p2.call(a2, r3) ? u2(s2.get(r3)) : p2.call(a2, c2) ? u2(s2.get(c2)) : void (s2 !== a2 && s2.get(r3));
      }, get size() {
        const t3 = this.__v_raw;
        return !e2 && track(toRaw(t3), 0, Ko), Reflect.get(t3, "size", t3);
      }, has(t3) {
        const r3 = this.__v_raw, s2 = toRaw(r3), a2 = toRaw(t3);
        return e2 || (hasChanged(t3, a2) && track(s2, 0, t3), track(s2, 0, a2)), t3 === a2 ? r3.has(t3) : r3.has(t3) || r3.has(a2);
      }, forEach(r3, s2) {
        const a2 = this, c2 = a2.__v_raw, p2 = toRaw(c2), u2 = t2 ? toShallow : e2 ? toReadonly : toReactive;
        return !e2 && track(p2, 0, Ko), c2.forEach((e3, t3) => r3.call(s2, u2(e3), u2(t3), a2));
      } };
      $r(r2, e2 ? { add: createReadonlyMethod("add"), set: createReadonlyMethod("set"), delete: createReadonlyMethod("delete"), clear: createReadonlyMethod("clear") } : { add(e3) {
        t2 || isShallow(e3) || isReadonly(e3) || (e3 = toRaw(e3));
        const r3 = toRaw(this);
        return getProto(r3).has.call(r3, e3) || (r3.add(e3), trigger(r3, "add", e3, e3)), this;
      }, set(e3, r3) {
        t2 || isShallow(r3) || isReadonly(r3) || (r3 = toRaw(r3));
        const s2 = toRaw(this), { has: a2, get: c2 } = getProto(s2);
        let p2 = a2.call(s2, e3);
        p2 || (e3 = toRaw(e3), p2 = a2.call(s2, e3));
        const u2 = c2.call(s2, e3);
        return s2.set(e3, r3), p2 ? hasChanged(r3, u2) && trigger(s2, "set", e3, r3) : trigger(s2, "add", e3, r3), this;
      }, delete(e3) {
        const t3 = toRaw(this), { has: r3, get: s2 } = getProto(t3);
        let a2 = r3.call(t3, e3);
        a2 || (e3 = toRaw(e3), a2 = r3.call(t3, e3)), s2 && s2.call(t3, e3);
        const c2 = t3.delete(e3);
        return a2 && trigger(t3, "delete", e3, void 0), c2;
      }, clear() {
        const e3 = toRaw(this), t3 = 0 !== e3.size, r3 = e3.clear();
        return t3 && trigger(e3, "clear", void 0, void 0), r3;
      } });
      return ["keys", "values", "entries", Symbol.iterator].forEach((s2) => {
        r2[s2] = function(e3, t3, r3) {
          return function(...s3) {
            const a2 = this.__v_raw, c2 = toRaw(a2), p2 = isMap(c2), u2 = "entries" === e3 || e3 === Symbol.iterator && p2, d2 = "keys" === e3 && p2, f2 = a2[e3](...s3), m2 = r3 ? toShallow : t3 ? toReadonly : toReactive;
            return !t3 && track(c2, 0, d2 ? Xo : Ko), { next() {
              const { value: e4, done: t4 } = f2.next();
              return t4 ? { value: e4, done: t4 } : { value: u2 ? [m2(e4[0]), m2(e4[1])] : m2(e4), done: t4 };
            }, [Symbol.iterator]() {
              return this;
            } };
          };
        }(s2, e2, t2);
      }), r2;
    }
    __name(createInstrumentations, "createInstrumentations");
    function createInstrumentationGetter(e2, t2) {
      const r2 = createInstrumentations(e2, t2);
      return (t3, s2, a2) => "__v_isReactive" === s2 ? !e2 : "__v_isReadonly" === s2 ? e2 : "__v_raw" === s2 ? t3 : Reflect.get(hasOwn(r2, s2) && s2 in t3 ? r2 : t3, s2, a2);
    }
    __name(createInstrumentationGetter, "createInstrumentationGetter");
    const os = { get: createInstrumentationGetter(false, false) }, ss = { get: createInstrumentationGetter(false, true) }, is = { get: createInstrumentationGetter(true, false) }, as = { get: createInstrumentationGetter(true, true) }, cs = /* @__PURE__ */ new WeakMap(), ls = /* @__PURE__ */ new WeakMap(), ps = /* @__PURE__ */ new WeakMap(), us = /* @__PURE__ */ new WeakMap();
    function reactive(e2) {
      return isReadonly(e2) ? e2 : createReactiveObject(e2, false, es, os, cs);
    }
    __name(reactive, "reactive");
    function shallowReactive(e2) {
      return createReactiveObject(e2, false, ns, ss, ls);
    }
    __name(shallowReactive, "shallowReactive");
    function readonly(e2) {
      return createReactiveObject(e2, true, ts, is, ps);
    }
    __name(readonly, "readonly");
    function shallowReadonly(e2) {
      return createReactiveObject(e2, true, rs, as, us);
    }
    __name(shallowReadonly, "shallowReadonly");
    function createReactiveObject(e2, t2, r2, s2, a2) {
      if (!isObject(e2))
        return e2;
      if (e2.__v_raw && (!t2 || !e2.__v_isReactive))
        return e2;
      const c2 = (p2 = e2).__v_skip || !Object.isExtensible(p2) ? 0 : function(e3) {
        switch (e3) {
          case "Object":
          case "Array":
            return 1;
          case "Map":
          case "Set":
          case "WeakMap":
          case "WeakSet":
            return 2;
          default:
            return 0;
        }
      }(toRawType(p2));
      var p2;
      if (0 === c2)
        return e2;
      const u2 = a2.get(e2);
      if (u2)
        return u2;
      const d2 = new Proxy(e2, 2 === c2 ? s2 : r2);
      return a2.set(e2, d2), d2;
    }
    __name(createReactiveObject, "createReactiveObject");
    function isReactive(e2) {
      return isReadonly(e2) ? isReactive(e2.__v_raw) : !(!e2 || !e2.__v_isReactive);
    }
    __name(isReactive, "isReactive");
    function isReadonly(e2) {
      return !(!e2 || !e2.__v_isReadonly);
    }
    __name(isReadonly, "isReadonly");
    function isShallow(e2) {
      return !(!e2 || !e2.__v_isShallow);
    }
    __name(isShallow, "isShallow");
    function isProxy(e2) {
      return !!e2 && !!e2.__v_raw;
    }
    __name(isProxy, "isProxy");
    function toRaw(e2) {
      const t2 = e2 && e2.__v_raw;
      return t2 ? toRaw(t2) : e2;
    }
    __name(toRaw, "toRaw");
    function markRaw(e2) {
      return !hasOwn(e2, "__v_skip") && Object.isExtensible(e2) && def(e2, "__v_skip", true), e2;
    }
    __name(markRaw, "markRaw");
    const toReactive = /* @__PURE__ */ __name((e2) => isObject(e2) ? reactive(e2) : e2, "toReactive"), toReadonly = /* @__PURE__ */ __name((e2) => isObject(e2) ? readonly(e2) : e2, "toReadonly");
    function isRef(e2) {
      return !!e2 && true === e2.__v_isRef;
    }
    __name(isRef, "isRef");
    function ref(e2) {
      return createRef(e2, false);
    }
    __name(ref, "ref");
    function shallowRef(e2) {
      return createRef(e2, true);
    }
    __name(shallowRef, "shallowRef");
    function createRef(e2, t2) {
      return isRef(e2) ? e2 : new RefImpl(e2, t2);
    }
    __name(createRef, "createRef");
    class RefImpl {
      constructor(e2, t2) {
        this.dep = new Dep(), this.__v_isRef = true, this.__v_isShallow = false, this._rawValue = t2 ? e2 : toRaw(e2), this._value = t2 ? e2 : toReactive(e2), this.__v_isShallow = t2;
      }
      get value() {
        return this.dep.track(), this._value;
      }
      set value(e2) {
        const t2 = this._rawValue, r2 = this.__v_isShallow || isShallow(e2) || isReadonly(e2);
        e2 = r2 ? e2 : toRaw(e2), hasChanged(e2, t2) && (this._rawValue = e2, this._value = r2 ? e2 : toReactive(e2), this.dep.trigger());
      }
    }
    __name(RefImpl, "RefImpl");
    function unref(e2) {
      return isRef(e2) ? e2.value : e2;
    }
    __name(unref, "unref");
    function toValue(e2) {
      return isFunction(e2) ? e2() : unref(e2);
    }
    __name(toValue, "toValue");
    const ds = { get: (e2, t2, r2) => "__v_raw" === t2 ? e2 : unref(Reflect.get(e2, t2, r2)), set: (e2, t2, r2, s2) => {
      const a2 = e2[t2];
      return isRef(a2) && !isRef(r2) ? (a2.value = r2, true) : Reflect.set(e2, t2, r2, s2);
    } };
    function proxyRefs(e2) {
      return isReactive(e2) ? e2 : new Proxy(e2, ds);
    }
    __name(proxyRefs, "proxyRefs");
    class CustomRefImpl {
      constructor(e2) {
        this.__v_isRef = true, this._value = void 0;
        const t2 = this.dep = new Dep(), { get: r2, set: s2 } = e2(t2.track.bind(t2), t2.trigger.bind(t2));
        this._get = r2, this._set = s2;
      }
      get value() {
        return this._value = this._get();
      }
      set value(e2) {
        this._set(e2);
      }
    }
    __name(CustomRefImpl, "CustomRefImpl");
    function customRef(e2) {
      return new CustomRefImpl(e2);
    }
    __name(customRef, "customRef");
    class ObjectRefImpl {
      constructor(e2, t2, r2) {
        this._object = e2, this._key = t2, this._defaultValue = r2, this.__v_isRef = true, this._value = void 0;
      }
      get value() {
        const e2 = this._object[this._key];
        return this._value = void 0 === e2 ? this._defaultValue : e2;
      }
      set value(e2) {
        this._object[this._key] = e2;
      }
      get dep() {
        return function(e2, t2) {
          const r2 = Wo.get(e2);
          return r2 && r2.get(t2);
        }(toRaw(this._object), this._key);
      }
    }
    __name(ObjectRefImpl, "ObjectRefImpl");
    class GetterRefImpl {
      constructor(e2) {
        this._getter = e2, this.__v_isRef = true, this.__v_isReadonly = true, this._value = void 0;
      }
      get value() {
        return this._value = this._getter();
      }
    }
    __name(GetterRefImpl, "GetterRefImpl");
    function propertyToRef(e2, t2, r2) {
      const s2 = e2[t2];
      return isRef(s2) ? s2 : new ObjectRefImpl(e2, t2, r2);
    }
    __name(propertyToRef, "propertyToRef");
    class ComputedRefImpl {
      constructor(e2, t2, r2) {
        this.fn = e2, this.setter = t2, this._value = void 0, this.dep = new Dep(this), this.__v_isRef = true, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = qo - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t2, this.isSSR = r2;
      }
      notify() {
        if (this.flags |= 16, !(8 & this.flags) && jo !== this)
          return batch(this, true), true;
      }
      get value() {
        const e2 = this.dep.track();
        return refreshComputed(this), e2 && (e2.version = this.dep.version), this._value;
      }
      set value(e2) {
        this.setter && this.setter(e2);
      }
    }
    __name(ComputedRefImpl, "ComputedRefImpl");
    const fs = {}, hs = /* @__PURE__ */ new WeakMap();
    let ms;
    function onWatcherCleanup(e2, t2 = false, r2 = ms) {
      if (r2) {
        let t3 = hs.get(r2);
        t3 || hs.set(r2, t3 = []), t3.push(e2);
      }
    }
    __name(onWatcherCleanup, "onWatcherCleanup");
    function traverse(e2, t2 = 1 / 0, r2) {
      if (t2 <= 0 || !isObject(e2) || e2.__v_skip)
        return e2;
      if ((r2 = r2 || /* @__PURE__ */ new Set()).has(e2))
        return e2;
      if (r2.add(e2), t2--, isRef(e2))
        traverse(e2.value, t2, r2);
      else if (jr(e2))
        for (let s2 = 0; s2 < e2.length; s2++)
          traverse(e2[s2], t2, r2);
      else if (isSet(e2) || isMap(e2))
        e2.forEach((e3) => {
          traverse(e3, t2, r2);
        });
      else if (isPlainObject(e2)) {
        for (const s2 in e2)
          traverse(e2[s2], t2, r2);
        for (const s2 of Object.getOwnPropertySymbols(e2))
          Object.prototype.propertyIsEnumerable.call(e2, s2) && traverse(e2[s2], t2, r2);
      }
      return e2;
    }
    __name(traverse, "traverse");
    const gs = [];
    const vs = { sp: "serverPrefetch hook", bc: "beforeCreate hook", c: "created hook", bm: "beforeMount hook", m: "mounted hook", bu: "beforeUpdate hook", u: "updated", bum: "beforeUnmount hook", um: "unmounted hook", a: "activated hook", da: "deactivated hook", ec: "errorCaptured hook", rtc: "renderTracked hook", rtg: "renderTriggered hook", 0: "setup function", 1: "render function", 2: "watcher getter", 3: "watcher callback", 4: "watcher cleanup function", 5: "native event handler", 6: "component event handler", 7: "vnode hook", 8: "directive hook", 9: "transition hook", 10: "app errorHandler", 11: "app warnHandler", 12: "ref function", 13: "async component loader", 14: "scheduler flush", 15: "component update", 16: "app unmount cleanup function" };
    function callWithErrorHandling(e2, t2, r2, s2) {
      try {
        return s2 ? e2(...s2) : e2();
      } catch (e3) {
        handleError(e3, t2, r2);
      }
    }
    __name(callWithErrorHandling, "callWithErrorHandling");
    function callWithAsyncErrorHandling(e2, t2, r2, s2) {
      if (isFunction(e2)) {
        const a2 = callWithErrorHandling(e2, t2, r2, s2);
        return a2 && isPromise(a2) && a2.catch((e3) => {
          handleError(e3, t2, r2);
        }), a2;
      }
      if (jr(e2)) {
        const a2 = [];
        for (let c2 = 0; c2 < e2.length; c2++)
          a2.push(callWithAsyncErrorHandling(e2[c2], t2, r2, s2));
        return a2;
      }
    }
    __name(callWithAsyncErrorHandling, "callWithAsyncErrorHandling");
    function handleError(e2, t2, r2, s2 = true) {
      t2 && t2.vnode;
      const { errorHandler: a2, throwUnhandledErrorInProduction: c2 } = t2 && t2.appContext.config || Lr;
      if (t2) {
        let s3 = t2.parent;
        const c3 = t2.proxy, p2 = `https://vuejs.org/error-reference/#runtime-${r2}`;
        for (; s3; ) {
          const t3 = s3.ec;
          if (t3) {
            for (let r3 = 0; r3 < t3.length; r3++)
              if (false === t3[r3](e2, c3, p2))
                return;
          }
          s3 = s3.parent;
        }
        if (a2)
          return pauseTracking(), callWithErrorHandling(a2, null, 10, [e2, c3, p2]), void resetTracking();
      }
      !function(e3, t3, r3, s3 = true, a3 = false) {
        if (a3)
          throw e3;
        console.error(e3);
      }(e2, 0, 0, s2, c2);
    }
    __name(handleError, "handleError");
    const ys = [];
    let bs = -1;
    const xs = [];
    let _s = null, Es = 0;
    const ws = Promise.resolve();
    let Ss = null;
    function nextTick(e2) {
      const t2 = Ss || ws;
      return e2 ? t2.then(this ? e2.bind(this) : e2) : t2;
    }
    __name(nextTick, "nextTick");
    function queueJob(e2) {
      if (!(1 & e2.flags)) {
        const t2 = getId(e2), r2 = ys[ys.length - 1];
        !r2 || !(2 & e2.flags) && t2 >= getId(r2) ? ys.push(e2) : ys.splice(function(e3) {
          let t3 = bs + 1, r3 = ys.length;
          for (; t3 < r3; ) {
            const s2 = t3 + r3 >>> 1, a2 = ys[s2], c2 = getId(a2);
            c2 < e3 || c2 === e3 && 2 & a2.flags ? t3 = s2 + 1 : r3 = s2;
          }
          return t3;
        }(t2), 0, e2), e2.flags |= 1, queueFlush();
      }
    }
    __name(queueJob, "queueJob");
    function queueFlush() {
      Ss || (Ss = ws.then(flushJobs));
    }
    __name(queueFlush, "queueFlush");
    function queuePostFlushCb(e2) {
      jr(e2) ? xs.push(...e2) : _s && -1 === e2.id ? _s.splice(Es + 1, 0, e2) : 1 & e2.flags || (xs.push(e2), e2.flags |= 1), queueFlush();
    }
    __name(queuePostFlushCb, "queuePostFlushCb");
    function flushPreFlushCbs(e2, t2, r2 = bs + 1) {
      for (; r2 < ys.length; r2++) {
        const t3 = ys[r2];
        if (t3 && 2 & t3.flags) {
          if (e2 && t3.id !== e2.uid)
            continue;
          ys.splice(r2, 1), r2--, 4 & t3.flags && (t3.flags &= -2), t3(), 4 & t3.flags || (t3.flags &= -2);
        }
      }
    }
    __name(flushPreFlushCbs, "flushPreFlushCbs");
    function flushPostFlushCbs(e2) {
      if (xs.length) {
        const e3 = [...new Set(xs)].sort((e4, t2) => getId(e4) - getId(t2));
        if (xs.length = 0, _s)
          return void _s.push(...e3);
        for (_s = e3, Es = 0; Es < _s.length; Es++) {
          const e4 = _s[Es];
          4 & e4.flags && (e4.flags &= -2), 8 & e4.flags || e4(), e4.flags &= -2;
        }
        _s = null, Es = 0;
      }
    }
    __name(flushPostFlushCbs, "flushPostFlushCbs");
    const getId = /* @__PURE__ */ __name((e2) => null == e2.id ? 2 & e2.flags ? -1 : 1 / 0 : e2.id, "getId");
    function flushJobs(e2) {
      try {
        for (bs = 0; bs < ys.length; bs++) {
          const e3 = ys[bs];
          !e3 || 8 & e3.flags || (4 & e3.flags && (e3.flags &= -2), callWithErrorHandling(e3, e3.i, e3.i ? 15 : 14), 4 & e3.flags || (e3.flags &= -2));
        }
      } finally {
        for (; bs < ys.length; bs++) {
          const e3 = ys[bs];
          e3 && (e3.flags &= -2);
        }
        bs = -1, ys.length = 0, flushPostFlushCbs(), Ss = null, (ys.length || xs.length) && flushJobs();
      }
    }
    __name(flushJobs, "flushJobs");
    let Ts, Cs = [];
    let ks = null, Rs = null;
    function setCurrentRenderingInstance$1(e2) {
      const t2 = ks;
      return ks = e2, Rs = e2 && e2.type.__scopeId || null, t2;
    }
    __name(setCurrentRenderingInstance$1, "setCurrentRenderingInstance$1");
    function withCtx(e2, t2 = ks, r2) {
      if (!t2)
        return e2;
      if (e2._n)
        return e2;
      const renderFnWithContext = /* @__PURE__ */ __name((...r3) => {
        renderFnWithContext._d && setBlockTracking(-1);
        const s2 = setCurrentRenderingInstance$1(t2);
        let a2;
        try {
          a2 = e2(...r3);
        } finally {
          setCurrentRenderingInstance$1(s2), renderFnWithContext._d && setBlockTracking(1);
        }
        return a2;
      }, "renderFnWithContext");
      return renderFnWithContext._n = true, renderFnWithContext._c = true, renderFnWithContext._d = true, renderFnWithContext;
    }
    __name(withCtx, "withCtx");
    function invokeDirectiveHook(e2, t2, r2, s2) {
      const a2 = e2.dirs, c2 = t2 && t2.dirs;
      for (let p2 = 0; p2 < a2.length; p2++) {
        const u2 = a2[p2];
        c2 && (u2.oldValue = c2[p2].value);
        let d2 = u2.dir[s2];
        d2 && (pauseTracking(), callWithAsyncErrorHandling(d2, r2, 8, [e2.el, u2, e2, t2]), resetTracking());
      }
    }
    __name(invokeDirectiveHook, "invokeDirectiveHook");
    const As = Symbol("_vte"), isTeleport = /* @__PURE__ */ __name((e2) => e2.__isTeleport, "isTeleport"), isTeleportDisabled = /* @__PURE__ */ __name((e2) => e2 && (e2.disabled || "" === e2.disabled), "isTeleportDisabled"), isTeleportDeferred = /* @__PURE__ */ __name((e2) => e2 && (e2.defer || "" === e2.defer), "isTeleportDeferred"), isTargetSVG = /* @__PURE__ */ __name((e2) => "undefined" != typeof SVGElement && e2 instanceof SVGElement, "isTargetSVG"), isTargetMathML = /* @__PURE__ */ __name((e2) => "function" == typeof MathMLElement && e2 instanceof MathMLElement, "isTargetMathML"), resolveTarget = /* @__PURE__ */ __name((e2, t2) => {
      const r2 = e2 && e2.to;
      if (isString(r2)) {
        if (t2) {
          return t2(r2);
        }
        return null;
      }
      return r2;
    }, "resolveTarget"), Ns = { name: "Teleport", __isTeleport: true, process(e2, t2, r2, s2, a2, c2, p2, u2, d2, f2) {
      const { mc: m2, pc: g2, pbc: x2, o: { insert: _2, querySelector: E2, createText: S2, createComment: T2 } } = f2, C2 = isTeleportDisabled(t2.props);
      let { shapeFlag: R2, children: N2, dynamicChildren: O2 } = t2;
      if (null == e2) {
        const e3 = t2.el = S2(""), f3 = t2.anchor = S2("");
        _2(e3, r2, s2), _2(f3, r2, s2);
        const mount = /* @__PURE__ */ __name((e4, t3) => {
          16 & R2 && (a2 && a2.isCE && (a2.ce._teleportTarget = e4), m2(N2, e4, t3, a2, c2, p2, u2, d2));
        }, "mount"), mountToTarget = /* @__PURE__ */ __name(() => {
          const e4 = t2.target = resolveTarget(t2.props, E2), r3 = prepareAnchor(e4, t2, S2, _2);
          e4 && ("svg" !== p2 && isTargetSVG(e4) ? p2 = "svg" : "mathml" !== p2 && isTargetMathML(e4) && (p2 = "mathml"), C2 || (mount(e4, r3), updateCssVars(t2, false)));
        }, "mountToTarget");
        C2 && (mount(r2, f3), updateCssVars(t2, true)), isTeleportDeferred(t2.props) ? (t2.el.__isMounted = false, li(() => {
          mountToTarget(), delete t2.el.__isMounted;
        }, c2)) : mountToTarget();
      } else {
        if (isTeleportDeferred(t2.props) && false === e2.el.__isMounted)
          return void li(() => {
            Ns.process(e2, t2, r2, s2, a2, c2, p2, u2, d2, f2);
          }, c2);
        t2.el = e2.el, t2.targetStart = e2.targetStart;
        const m3 = t2.anchor = e2.anchor, _3 = t2.target = e2.target, S3 = t2.targetAnchor = e2.targetAnchor, T3 = isTeleportDisabled(e2.props), R3 = T3 ? r2 : _3, N3 = T3 ? m3 : S3;
        if ("svg" === p2 || isTargetSVG(_3) ? p2 = "svg" : ("mathml" === p2 || isTargetMathML(_3)) && (p2 = "mathml"), O2 ? (x2(e2.dynamicChildren, O2, R3, a2, c2, p2, u2), traverseStaticChildren(e2, t2, true)) : d2 || g2(e2, t2, R3, N3, a2, c2, p2, u2, false), C2)
          T3 ? t2.props && e2.props && t2.props.to !== e2.props.to && (t2.props.to = e2.props.to) : moveTeleport(t2, r2, m3, f2, 1);
        else if ((t2.props && t2.props.to) !== (e2.props && e2.props.to)) {
          const e3 = t2.target = resolveTarget(t2.props, E2);
          e3 && moveTeleport(t2, e3, null, f2, 0);
        } else
          T3 && moveTeleport(t2, _3, S3, f2, 1);
        updateCssVars(t2, C2);
      }
    }, remove(e2, t2, r2, { um: s2, o: { remove: a2 } }, c2) {
      const { shapeFlag: p2, children: u2, anchor: d2, targetStart: f2, targetAnchor: m2, target: g2, props: x2 } = e2;
      if (g2 && (a2(f2), a2(m2)), c2 && a2(d2), 16 & p2) {
        const e3 = c2 || !isTeleportDisabled(x2);
        for (let a3 = 0; a3 < u2.length; a3++) {
          const c3 = u2[a3];
          s2(c3, t2, r2, e3, !!c3.dynamicChildren);
        }
      }
    }, move: moveTeleport, hydrate: function(e2, t2, r2, s2, a2, c2, { o: { nextSibling: p2, parentNode: u2, querySelector: d2, insert: f2, createText: m2 } }, g2) {
      const x2 = t2.target = resolveTarget(t2.props, d2);
      if (x2) {
        const d3 = isTeleportDisabled(t2.props), _2 = x2._lpa || x2.firstChild;
        if (16 & t2.shapeFlag)
          if (d3)
            t2.anchor = g2(p2(e2), t2, u2(e2), r2, s2, a2, c2), t2.targetStart = _2, t2.targetAnchor = _2 && p2(_2);
          else {
            t2.anchor = p2(e2);
            let u3 = _2;
            for (; u3; ) {
              if (u3 && 8 === u3.nodeType) {
                if ("teleport start anchor" === u3.data)
                  t2.targetStart = u3;
                else if ("teleport anchor" === u3.data) {
                  t2.targetAnchor = u3, x2._lpa = t2.targetAnchor && p2(t2.targetAnchor);
                  break;
                }
              }
              u3 = p2(u3);
            }
            t2.targetAnchor || prepareAnchor(x2, t2, m2, f2), g2(_2 && p2(_2), t2, x2, r2, s2, a2, c2);
          }
        updateCssVars(t2, d3);
      }
      return t2.anchor && p2(t2.anchor);
    } };
    function moveTeleport(e2, t2, r2, { o: { insert: s2 }, m: a2 }, c2 = 2) {
      0 === c2 && s2(e2.targetAnchor, t2, r2);
      const { el: p2, anchor: u2, shapeFlag: d2, children: f2, props: m2 } = e2, g2 = 2 === c2;
      if (g2 && s2(p2, t2, r2), (!g2 || isTeleportDisabled(m2)) && 16 & d2)
        for (let e3 = 0; e3 < f2.length; e3++)
          a2(f2[e3], t2, r2, 2);
      g2 && s2(u2, t2, r2);
    }
    __name(moveTeleport, "moveTeleport");
    const Os = Ns;
    function updateCssVars(e2, t2) {
      const r2 = e2.ctx;
      if (r2 && r2.ut) {
        let s2, a2;
        for (t2 ? (s2 = e2.el, a2 = e2.anchor) : (s2 = e2.targetStart, a2 = e2.targetAnchor); s2 && s2 !== a2; )
          1 === s2.nodeType && s2.setAttribute("data-v-owner", r2.uid), s2 = s2.nextSibling;
        r2.ut();
      }
    }
    __name(updateCssVars, "updateCssVars");
    function prepareAnchor(e2, t2, r2, s2) {
      const a2 = t2.targetStart = r2(""), c2 = t2.targetAnchor = r2("");
      return a2[As] = c2, e2 && (s2(a2, e2), s2(c2, e2)), c2;
    }
    __name(prepareAnchor, "prepareAnchor");
    const Is = Symbol("_leaveCb"), Ps = Symbol("_enterCb");
    function useTransitionState() {
      const e2 = { isMounted: false, isLeaving: false, isUnmounting: false, leavingVNodes: /* @__PURE__ */ new Map() };
      return zs(() => {
        e2.isMounted = true;
      }), Ks(() => {
        e2.isUnmounting = true;
      }), e2;
    }
    __name(useTransitionState, "useTransitionState");
    const Ls = [Function, Array], Ms = { mode: String, appear: Boolean, persisted: Boolean, onBeforeEnter: Ls, onEnter: Ls, onAfterEnter: Ls, onEnterCancelled: Ls, onBeforeLeave: Ls, onLeave: Ls, onAfterLeave: Ls, onLeaveCancelled: Ls, onBeforeAppear: Ls, onAppear: Ls, onAfterAppear: Ls, onAppearCancelled: Ls }, recursiveGetSubtree = /* @__PURE__ */ __name((e2) => {
      const t2 = e2.subTree;
      return t2.component ? recursiveGetSubtree(t2.component) : t2;
    }, "recursiveGetSubtree");
    function findNonCommentChild(e2) {
      let t2 = e2[0];
      if (e2.length > 1) {
        for (const r2 of e2)
          if (r2.type !== mi) {
            t2 = r2;
            break;
          }
      }
      return t2;
    }
    __name(findNonCommentChild, "findNonCommentChild");
    const $s = { name: "BaseTransition", props: Ms, setup(e2, { slots: t2 }) {
      const r2 = getCurrentInstance(), s2 = useTransitionState();
      return () => {
        const a2 = t2.default && getTransitionRawChildren(t2.default(), true);
        if (!a2 || !a2.length)
          return;
        const c2 = findNonCommentChild(a2), p2 = toRaw(e2), { mode: u2 } = p2;
        if (s2.isLeaving)
          return emptyPlaceholder(c2);
        const d2 = getInnerChild$1(c2);
        if (!d2)
          return emptyPlaceholder(c2);
        let f2 = resolveTransitionHooks(d2, p2, s2, r2, (e3) => f2 = e3);
        d2.type !== mi && setTransitionHooks(d2, f2);
        let m2 = r2.subTree && getInnerChild$1(r2.subTree);
        if (m2 && m2.type !== mi && !isSameVNodeType(d2, m2) && recursiveGetSubtree(r2).type !== mi) {
          let e3 = resolveTransitionHooks(m2, p2, s2, r2);
          if (setTransitionHooks(m2, e3), "out-in" === u2 && d2.type !== mi)
            return s2.isLeaving = true, e3.afterLeave = () => {
              s2.isLeaving = false, 8 & r2.job.flags || r2.update(), delete e3.afterLeave, m2 = void 0;
            }, emptyPlaceholder(c2);
          "in-out" === u2 && d2.type !== mi ? e3.delayLeave = (e4, t3, r3) => {
            getLeavingNodesForType(s2, m2)[String(m2.key)] = m2, e4[Is] = () => {
              t3(), e4[Is] = void 0, delete f2.delayedLeave, m2 = void 0;
            }, f2.delayedLeave = () => {
              r3(), delete f2.delayedLeave, m2 = void 0;
            };
          } : m2 = void 0;
        } else
          m2 && (m2 = void 0);
        return c2;
      };
    } };
    function getLeavingNodesForType(e2, t2) {
      const { leavingVNodes: r2 } = e2;
      let s2 = r2.get(t2.type);
      return s2 || (s2 = /* @__PURE__ */ Object.create(null), r2.set(t2.type, s2)), s2;
    }
    __name(getLeavingNodesForType, "getLeavingNodesForType");
    function resolveTransitionHooks(e2, t2, r2, s2, a2) {
      const { appear: c2, mode: p2, persisted: u2 = false, onBeforeEnter: d2, onEnter: f2, onAfterEnter: m2, onEnterCancelled: g2, onBeforeLeave: x2, onLeave: _2, onAfterLeave: E2, onLeaveCancelled: S2, onBeforeAppear: T2, onAppear: C2, onAfterAppear: R2, onAppearCancelled: N2 } = t2, O2 = String(e2.key), I2 = getLeavingNodesForType(r2, e2), callHook2 = /* @__PURE__ */ __name((e3, t3) => {
        e3 && callWithAsyncErrorHandling(e3, s2, 9, t3);
      }, "callHook"), callAsyncHook = /* @__PURE__ */ __name((e3, t3) => {
        const r3 = t3[1];
        callHook2(e3, t3), jr(e3) ? e3.every((e4) => e4.length <= 1) && r3() : e3.length <= 1 && r3();
      }, "callAsyncHook"), P2 = { mode: p2, persisted: u2, beforeEnter(t3) {
        let s3 = d2;
        if (!r2.isMounted) {
          if (!c2)
            return;
          s3 = T2 || d2;
        }
        t3[Is] && t3[Is](true);
        const a3 = I2[O2];
        a3 && isSameVNodeType(e2, a3) && a3.el[Is] && a3.el[Is](), callHook2(s3, [t3]);
      }, enter(e3) {
        let t3 = f2, s3 = m2, a3 = g2;
        if (!r2.isMounted) {
          if (!c2)
            return;
          t3 = C2 || f2, s3 = R2 || m2, a3 = N2 || g2;
        }
        let p3 = false;
        const u3 = e3[Ps] = (t4) => {
          p3 || (p3 = true, callHook2(t4 ? a3 : s3, [e3]), P2.delayedLeave && P2.delayedLeave(), e3[Ps] = void 0);
        };
        t3 ? callAsyncHook(t3, [e3, u3]) : u3();
      }, leave(t3, s3) {
        const a3 = String(e2.key);
        if (t3[Ps] && t3[Ps](true), r2.isUnmounting)
          return s3();
        callHook2(x2, [t3]);
        let c3 = false;
        const p3 = t3[Is] = (r3) => {
          c3 || (c3 = true, s3(), callHook2(r3 ? S2 : E2, [t3]), t3[Is] = void 0, I2[a3] === e2 && delete I2[a3]);
        };
        I2[a3] = e2, _2 ? callAsyncHook(_2, [t3, p3]) : p3();
      }, clone(e3) {
        const c3 = resolveTransitionHooks(e3, t2, r2, s2, a2);
        return a2 && a2(c3), c3;
      } };
      return P2;
    }
    __name(resolveTransitionHooks, "resolveTransitionHooks");
    function emptyPlaceholder(e2) {
      if (isKeepAlive(e2))
        return (e2 = cloneVNode(e2)).children = null, e2;
    }
    __name(emptyPlaceholder, "emptyPlaceholder");
    function getInnerChild$1(e2) {
      if (!isKeepAlive(e2))
        return isTeleport(e2.type) && e2.children ? findNonCommentChild(e2.children) : e2;
      if (e2.component)
        return e2.component.subTree;
      const { shapeFlag: t2, children: r2 } = e2;
      if (r2) {
        if (16 & t2)
          return r2[0];
        if (32 & t2 && isFunction(r2.default))
          return r2.default();
      }
    }
    __name(getInnerChild$1, "getInnerChild$1");
    function setTransitionHooks(e2, t2) {
      6 & e2.shapeFlag && e2.component ? (e2.transition = t2, setTransitionHooks(e2.component.subTree, t2)) : 128 & e2.shapeFlag ? (e2.ssContent.transition = t2.clone(e2.ssContent), e2.ssFallback.transition = t2.clone(e2.ssFallback)) : e2.transition = t2;
    }
    __name(setTransitionHooks, "setTransitionHooks");
    function getTransitionRawChildren(e2, t2 = false, r2) {
      let s2 = [], a2 = 0;
      for (let c2 = 0; c2 < e2.length; c2++) {
        let p2 = e2[c2];
        const u2 = null == r2 ? p2.key : String(r2) + String(null != p2.key ? p2.key : c2);
        p2.type === fi ? (128 & p2.patchFlag && a2++, s2 = s2.concat(getTransitionRawChildren(p2.children, t2, u2))) : (t2 || p2.type !== mi) && s2.push(null != u2 ? cloneVNode(p2, { key: u2 }) : p2);
      }
      if (a2 > 1)
        for (let e3 = 0; e3 < s2.length; e3++)
          s2[e3].patchFlag = -2;
      return s2;
    }
    __name(getTransitionRawChildren, "getTransitionRawChildren");
    function defineComponent(e2, t2) {
      return isFunction(e2) ? (() => $r({ name: e2.name }, t2, { setup: e2 }))() : e2;
    }
    __name(defineComponent, "defineComponent");
    function markAsyncBoundary(e2) {
      e2.ids = [e2.ids[0] + e2.ids[2]++ + "-", 0, 0];
    }
    __name(markAsyncBoundary, "markAsyncBoundary");
    function setRef(e2, t2, r2, s2, a2 = false) {
      if (jr(e2))
        return void e2.forEach((e3, c3) => setRef(e3, t2 && (jr(t2) ? t2[c3] : t2), r2, s2, a2));
      if (isAsyncWrapper(s2) && !a2)
        return void (512 & s2.shapeFlag && s2.type.__asyncResolved && s2.component.subTree.component && setRef(e2, t2, r2, s2.component.subTree));
      const c2 = 4 & s2.shapeFlag ? getComponentPublicInstance(s2.component) : s2.el, p2 = a2 ? null : c2, { i: u2, r: d2 } = e2, f2 = t2 && t2.r, m2 = u2.refs === Lr ? u2.refs = {} : u2.refs, g2 = u2.setupState, x2 = toRaw(g2), _2 = g2 === Lr ? () => false : (e3) => hasOwn(x2, e3);
      if (null != f2 && f2 !== d2 && (isString(f2) ? (m2[f2] = null, _2(f2) && (g2[f2] = null)) : isRef(f2) && (f2.value = null)), isFunction(d2))
        callWithErrorHandling(d2, u2, 12, [p2, m2]);
      else {
        const t3 = isString(d2), s3 = isRef(d2);
        if (t3 || s3) {
          const doSet = /* @__PURE__ */ __name(() => {
            if (e2.f) {
              const r3 = t3 ? _2(d2) ? g2[d2] : m2[d2] : d2.value;
              a2 ? jr(r3) && remove(r3, c2) : jr(r3) ? r3.includes(c2) || r3.push(c2) : t3 ? (m2[d2] = [c2], _2(d2) && (g2[d2] = m2[d2])) : (d2.value = [c2], e2.k && (m2[e2.k] = d2.value));
            } else
              t3 ? (m2[d2] = p2, _2(d2) && (g2[d2] = p2)) : s3 && (d2.value = p2, e2.k && (m2[e2.k] = p2));
          }, "doSet");
          p2 ? (doSet.id = -1, li(doSet, r2)) : doSet();
        }
      }
    }
    __name(setRef, "setRef");
    let Bs = false;
    const logMismatchError = /* @__PURE__ */ __name(() => {
      Bs || (console.error("Hydration completed but contains mismatches."), Bs = true);
    }, "logMismatchError"), getContainerType = /* @__PURE__ */ __name((e2) => {
      if (1 === e2.nodeType)
        return ((e3) => e3.namespaceURI.includes("svg") && "foreignObject" !== e3.tagName)(e2) ? "svg" : ((e3) => e3.namespaceURI.includes("MathML"))(e2) ? "mathml" : void 0;
    }, "getContainerType"), isComment = /* @__PURE__ */ __name((e2) => 8 === e2.nodeType, "isComment");
    function createHydrationFunctions(e2) {
      const { mt: t2, p: r2, o: { patchProp: s2, createText: a2, nextSibling: c2, parentNode: p2, remove: u2, insert: d2, createComment: f2 } } = e2, hydrateNode = /* @__PURE__ */ __name((r3, s3, u3, f3, m2, g2 = false) => {
        g2 = g2 || !!s3.dynamicChildren;
        const x2 = isComment(r3) && "[" === r3.data, onMismatch = /* @__PURE__ */ __name(() => handleMismatch(r3, s3, u3, f3, m2, x2), "onMismatch"), { type: _2, ref: E2, shapeFlag: S2, patchFlag: T2 } = s3;
        let C2 = r3.nodeType;
        s3.el = r3, -2 === T2 && (g2 = false, s3.dynamicChildren = null);
        let R2 = null;
        switch (_2) {
          case hi:
            3 !== C2 ? "" === s3.children ? (d2(s3.el = a2(""), p2(r3), r3), R2 = r3) : R2 = onMismatch() : (r3.data !== s3.children && (logMismatchError(), r3.data = s3.children), R2 = c2(r3));
            break;
          case mi:
            isTemplateNode2(r3) ? (R2 = c2(r3), replaceNode(s3.el = r3.content.firstChild, r3, u3)) : R2 = 8 !== C2 || x2 ? onMismatch() : c2(r3);
            break;
          case gi:
            if (x2 && (C2 = (r3 = c2(r3)).nodeType), 1 === C2 || 3 === C2) {
              R2 = r3;
              const e3 = !s3.children.length;
              for (let t3 = 0; t3 < s3.staticCount; t3++)
                e3 && (s3.children += 1 === R2.nodeType ? R2.outerHTML : R2.data), t3 === s3.staticCount - 1 && (s3.anchor = R2), R2 = c2(R2);
              return x2 ? c2(R2) : R2;
            }
            onMismatch();
            break;
          case fi:
            R2 = x2 ? hydrateFragment(r3, s3, u3, f3, m2, g2) : onMismatch();
            break;
          default:
            if (1 & S2)
              R2 = 1 === C2 && s3.type.toLowerCase() === r3.tagName.toLowerCase() || isTemplateNode2(r3) ? hydrateElement(r3, s3, u3, f3, m2, g2) : onMismatch();
            else if (6 & S2) {
              s3.slotScopeIds = m2;
              const e3 = p2(r3);
              if (R2 = x2 ? locateClosingAnchor(r3) : isComment(r3) && "teleport start" === r3.data ? locateClosingAnchor(r3, r3.data, "teleport end") : c2(r3), t2(s3, e3, null, u3, f3, getContainerType(e3), g2), isAsyncWrapper(s3) && !s3.type.__asyncResolved) {
                let t3;
                x2 ? (t3 = createVNode(fi), t3.anchor = R2 ? R2.previousSibling : e3.lastChild) : t3 = 3 === r3.nodeType ? createTextVNode("") : createVNode("div"), t3.el = r3, s3.component.subTree = t3;
              }
            } else
              64 & S2 ? R2 = 8 !== C2 ? onMismatch() : s3.type.hydrate(r3, s3, u3, f3, m2, g2, e2, hydrateChildren) : 128 & S2 && (R2 = s3.type.hydrate(r3, s3, u3, f3, getContainerType(p2(r3)), m2, g2, e2, hydrateNode));
        }
        return null != E2 && setRef(E2, null, f3, s3), R2;
      }, "hydrateNode"), hydrateElement = /* @__PURE__ */ __name((e3, t3, r3, a3, c3, p3) => {
        p3 = p3 || !!t3.dynamicChildren;
        const { type: d3, props: f3, patchFlag: m2, shapeFlag: g2, dirs: x2, transition: _2 } = t3, E2 = "input" === d3 || "option" === d3;
        if (E2 || -1 !== m2) {
          x2 && invokeDirectiveHook(t3, null, r3, "created");
          let d4, S2 = false;
          if (isTemplateNode2(e3)) {
            S2 = needTransition(null, _2) && r3 && r3.vnode.props && r3.vnode.props.appear;
            const s3 = e3.content.firstChild;
            if (S2) {
              const e4 = s3.getAttribute("class");
              e4 && (s3.$cls = e4), _2.beforeEnter(s3);
            }
            replaceNode(s3, e3, r3), t3.el = e3 = s3;
          }
          if (16 & g2 && (!f3 || !f3.innerHTML && !f3.textContent)) {
            let s3 = hydrateChildren(e3.firstChild, t3, e3, r3, a3, c3, p3);
            for (; s3; ) {
              isMismatchAllowed(e3, 1) || logMismatchError();
              const t4 = s3;
              s3 = s3.nextSibling, u2(t4);
            }
          } else if (8 & g2) {
            let r4 = t3.children;
            "\n" !== r4[0] || "PRE" !== e3.tagName && "TEXTAREA" !== e3.tagName || (r4 = r4.slice(1)), e3.textContent !== r4 && (isMismatchAllowed(e3, 0) || logMismatchError(), e3.textContent = t3.children);
          }
          if (f3) {
            if (E2 || !p3 || 48 & m2) {
              const t4 = e3.tagName.includes("-");
              for (const a4 in f3)
                (E2 && (a4.endsWith("value") || "indeterminate" === a4) || isOn(a4) && !Hr(a4) || "." === a4[0] || t4) && s2(e3, a4, null, f3[a4], void 0, r3);
            } else if (f3.onClick)
              s2(e3, "onClick", null, f3.onClick, void 0, r3);
            else if (4 & m2 && isReactive(f3.style))
              for (const e4 in f3.style)
                f3.style[e4];
          }
          (d4 = f3 && f3.onVnodeBeforeMount) && invokeVNodeHook(d4, r3, t3), x2 && invokeDirectiveHook(t3, null, r3, "beforeMount"), ((d4 = f3 && f3.onVnodeMounted) || x2 || S2) && queueEffectWithSuspense(() => {
            d4 && invokeVNodeHook(d4, r3, t3), S2 && _2.enter(e3), x2 && invokeDirectiveHook(t3, null, r3, "mounted");
          }, a3);
        }
        return e3.nextSibling;
      }, "hydrateElement"), hydrateChildren = /* @__PURE__ */ __name((e3, t3, s3, p3, u3, f3, m2) => {
        m2 = m2 || !!t3.dynamicChildren;
        const g2 = t3.children, x2 = g2.length;
        for (let t4 = 0; t4 < x2; t4++) {
          const _2 = m2 ? g2[t4] : g2[t4] = normalizeVNode$1(g2[t4]), E2 = _2.type === hi;
          e3 ? (E2 && !m2 && t4 + 1 < x2 && normalizeVNode$1(g2[t4 + 1]).type === hi && (d2(a2(e3.data.slice(_2.children.length)), s3, c2(e3)), e3.data = _2.children), e3 = hydrateNode(e3, _2, p3, u3, f3, m2)) : E2 && !_2.children ? d2(_2.el = a2(""), s3) : (isMismatchAllowed(s3, 1) || logMismatchError(), r2(null, _2, s3, null, p3, u3, getContainerType(s3), f3));
        }
        return e3;
      }, "hydrateChildren"), hydrateFragment = /* @__PURE__ */ __name((e3, t3, r3, s3, a3, u3) => {
        const { slotScopeIds: m2 } = t3;
        m2 && (a3 = a3 ? a3.concat(m2) : m2);
        const g2 = p2(e3), x2 = hydrateChildren(c2(e3), t3, g2, r3, s3, a3, u3);
        return x2 && isComment(x2) && "]" === x2.data ? c2(t3.anchor = x2) : (logMismatchError(), d2(t3.anchor = f2("]"), g2, x2), x2);
      }, "hydrateFragment"), handleMismatch = /* @__PURE__ */ __name((e3, t3, s3, a3, d3, f3) => {
        if (isMismatchAllowed(e3.parentElement, 1) || logMismatchError(), t3.el = null, f3) {
          const t4 = locateClosingAnchor(e3);
          for (; ; ) {
            const r3 = c2(e3);
            if (!r3 || r3 === t4)
              break;
            u2(r3);
          }
        }
        const m2 = c2(e3), g2 = p2(e3);
        return u2(e3), r2(null, t3, g2, m2, s3, a3, getContainerType(g2), d3), s3 && (s3.vnode.el = t3.el, updateHOCHostEl(s3, t3.el)), m2;
      }, "handleMismatch"), locateClosingAnchor = /* @__PURE__ */ __name((e3, t3 = "[", r3 = "]") => {
        let s3 = 0;
        for (; e3; )
          if ((e3 = c2(e3)) && isComment(e3) && (e3.data === t3 && s3++, e3.data === r3)) {
            if (0 === s3)
              return c2(e3);
            s3--;
          }
        return e3;
      }, "locateClosingAnchor"), replaceNode = /* @__PURE__ */ __name((e3, t3, r3) => {
        const s3 = t3.parentNode;
        s3 && s3.replaceChild(e3, t3);
        let a3 = r3;
        for (; a3; )
          a3.vnode.el === t3 && (a3.vnode.el = a3.subTree.el = e3), a3 = a3.parent;
      }, "replaceNode"), isTemplateNode2 = /* @__PURE__ */ __name((e3) => 1 === e3.nodeType && "TEMPLATE" === e3.tagName, "isTemplateNode");
      return [(e3, t3) => {
        if (!t3.hasChildNodes())
          return r2(null, e3, t3), flushPostFlushCbs(), void (t3._vnode = e3);
        hydrateNode(t3.firstChild, e3, null, null, null), flushPostFlushCbs(), t3._vnode = e3;
      }, hydrateNode];
    }
    __name(createHydrationFunctions, "createHydrationFunctions");
    const js = "data-allow-mismatch", Ds = { 0: "text", 1: "children", 2: "class", 3: "style", 4: "attribute" };
    function isMismatchAllowed(e2, t2) {
      if (0 === t2 || 1 === t2)
        for (; e2 && !e2.hasAttribute(js); )
          e2 = e2.parentElement;
      const r2 = e2 && e2.getAttribute(js);
      if (null == r2)
        return false;
      if ("" === r2)
        return true;
      {
        const e3 = r2.split(",");
        return !(0 !== t2 || !e3.includes("children")) || e3.includes(Ds[t2]);
      }
    }
    __name(isMismatchAllowed, "isMismatchAllowed");
    const Hs = getGlobalThis().requestIdleCallback || ((e2) => setTimeout(e2, 1)), Us = getGlobalThis().cancelIdleCallback || ((e2) => clearTimeout(e2));
    const isAsyncWrapper = /* @__PURE__ */ __name((e2) => !!e2.type.__asyncLoader, "isAsyncWrapper");
    function createInnerComp(e2, t2) {
      const { ref: r2, props: s2, children: a2, ce: c2 } = t2.vnode, p2 = createVNode(e2, s2, a2);
      return p2.ref = r2, p2.ce = c2, delete t2.vnode.ce, p2;
    }
    __name(createInnerComp, "createInnerComp");
    const isKeepAlive = /* @__PURE__ */ __name((e2) => e2.type.__isKeepAlive, "isKeepAlive"), Vs = { name: "KeepAlive", __isKeepAlive: true, props: { include: [String, RegExp, Array], exclude: [String, RegExp, Array], max: [String, Number] }, setup(e2, { slots: t2 }) {
      const r2 = getCurrentInstance(), s2 = r2.ctx;
      if (!s2.renderer)
        return () => {
          const e3 = t2.default && t2.default();
          return e3 && 1 === e3.length ? e3[0] : e3;
        };
      const a2 = /* @__PURE__ */ new Map(), c2 = /* @__PURE__ */ new Set();
      let p2 = null;
      const u2 = r2.suspense, { renderer: { p: d2, m: f2, um: m2, o: { createElement: g2 } } } = s2, x2 = g2("div");
      function unmount(e3) {
        resetShapeFlag(e3), m2(e3, r2, u2, true);
      }
      __name(unmount, "unmount");
      function pruneCache(e3) {
        a2.forEach((t3, r3) => {
          const s3 = getComponentName(t3.type);
          s3 && !e3(s3) && pruneCacheEntry(r3);
        });
      }
      __name(pruneCache, "pruneCache");
      function pruneCacheEntry(e3) {
        const t3 = a2.get(e3);
        !t3 || p2 && isSameVNodeType(t3, p2) ? p2 && resetShapeFlag(p2) : unmount(t3), a2.delete(e3), c2.delete(e3);
      }
      __name(pruneCacheEntry, "pruneCacheEntry");
      s2.activate = (e3, t3, r3, s3, a3) => {
        const c3 = e3.component;
        f2(e3, t3, r3, 0, u2), d2(c3.vnode, e3, t3, r3, c3, u2, s3, e3.slotScopeIds, a3), li(() => {
          c3.isDeactivated = false, c3.a && invokeArrayFns(c3.a);
          const t4 = e3.props && e3.props.onVnodeMounted;
          t4 && invokeVNodeHook(t4, c3.parent, e3);
        }, u2);
      }, s2.deactivate = (e3) => {
        const t3 = e3.component;
        invalidateMount(t3.m), invalidateMount(t3.a), f2(e3, x2, null, 1, u2), li(() => {
          t3.da && invokeArrayFns(t3.da);
          const r3 = e3.props && e3.props.onVnodeUnmounted;
          r3 && invokeVNodeHook(r3, t3.parent, e3), t3.isDeactivated = true;
        }, u2);
      }, watch(() => [e2.include, e2.exclude], ([e3, t3]) => {
        e3 && pruneCache((t4) => matches(e3, t4)), t3 && pruneCache((e4) => !matches(t3, e4));
      }, { flush: "post", deep: true });
      let _2 = null;
      const cacheSubtree = /* @__PURE__ */ __name(() => {
        null != _2 && (isSuspense(r2.subTree.type) ? li(() => {
          a2.set(_2, getInnerChild(r2.subTree));
        }, r2.subTree.suspense) : a2.set(_2, getInnerChild(r2.subTree)));
      }, "cacheSubtree");
      return zs(cacheSubtree), Ws(cacheSubtree), Ks(() => {
        a2.forEach((e3) => {
          const { subTree: t3, suspense: s3 } = r2, a3 = getInnerChild(t3);
          if (e3.type === a3.type && e3.key === a3.key) {
            resetShapeFlag(a3);
            const e4 = a3.component.da;
            return void (e4 && li(e4, s3));
          }
          unmount(e3);
        });
      }), () => {
        if (_2 = null, !t2.default)
          return p2 = null;
        const r3 = t2.default(), s3 = r3[0];
        if (r3.length > 1)
          return p2 = null, r3;
        if (!(isVNode$2(s3) && (4 & s3.shapeFlag || 128 & s3.shapeFlag)))
          return p2 = null, s3;
        let u3 = getInnerChild(s3);
        if (u3.type === mi)
          return p2 = null, u3;
        const d3 = u3.type, f3 = getComponentName(isAsyncWrapper(u3) ? u3.type.__asyncResolved || {} : d3), { include: m3, exclude: g3, max: x3 } = e2;
        if (m3 && (!f3 || !matches(m3, f3)) || g3 && f3 && matches(g3, f3))
          return u3.shapeFlag &= -257, p2 = u3, s3;
        const E2 = null == u3.key ? d3 : u3.key, S2 = a2.get(E2);
        return u3.el && (u3 = cloneVNode(u3), 128 & s3.shapeFlag && (s3.ssContent = u3)), _2 = E2, S2 ? (u3.el = S2.el, u3.component = S2.component, u3.transition && setTransitionHooks(u3, u3.transition), u3.shapeFlag |= 512, c2.delete(E2), c2.add(E2)) : (c2.add(E2), x3 && c2.size > parseInt(x3, 10) && pruneCacheEntry(c2.values().next().value)), u3.shapeFlag |= 256, p2 = u3, isSuspense(s3.type) ? s3 : u3;
      };
    } };
    function matches(e2, t2) {
      return jr(e2) ? e2.some((e3) => matches(e3, t2)) : isString(e2) ? e2.split(",").includes(t2) : !!isRegExp(e2) && (e2.lastIndex = 0, e2.test(t2));
    }
    __name(matches, "matches");
    function onActivated(e2, t2) {
      registerKeepAliveHook(e2, "a", t2);
    }
    __name(onActivated, "onActivated");
    function onDeactivated(e2, t2) {
      registerKeepAliveHook(e2, "da", t2);
    }
    __name(onDeactivated, "onDeactivated");
    function registerKeepAliveHook(e2, t2, r2 = Ei) {
      const s2 = e2.__wdc || (e2.__wdc = () => {
        let t3 = r2;
        for (; t3; ) {
          if (t3.isDeactivated)
            return;
          t3 = t3.parent;
        }
        return e2();
      });
      if (injectHook(t2, s2, r2), r2) {
        let e3 = r2.parent;
        for (; e3 && e3.parent; )
          isKeepAlive(e3.parent.vnode) && injectToKeepAliveRoot(s2, t2, r2, e3), e3 = e3.parent;
      }
    }
    __name(registerKeepAliveHook, "registerKeepAliveHook");
    function injectToKeepAliveRoot(e2, t2, r2, s2) {
      const a2 = injectHook(t2, e2, s2, true);
      Xs(() => {
        remove(s2[t2], a2);
      }, r2);
    }
    __name(injectToKeepAliveRoot, "injectToKeepAliveRoot");
    function resetShapeFlag(e2) {
      e2.shapeFlag &= -257, e2.shapeFlag &= -513;
    }
    __name(resetShapeFlag, "resetShapeFlag");
    function getInnerChild(e2) {
      return 128 & e2.shapeFlag ? e2.ssContent : e2;
    }
    __name(getInnerChild, "getInnerChild");
    function injectHook(e2, t2, r2 = Ei, s2 = false) {
      if (r2) {
        const a2 = r2[e2] || (r2[e2] = []), c2 = t2.__weh || (t2.__weh = (...s3) => {
          pauseTracking();
          const a3 = setCurrentInstance(r2), c3 = callWithAsyncErrorHandling(t2, r2, e2, s3);
          return a3(), resetTracking(), c3;
        });
        return s2 ? a2.unshift(c2) : a2.push(c2), c2;
      }
    }
    __name(injectHook, "injectHook");
    const createHook = /* @__PURE__ */ __name((e2) => (t2, r2 = Ei) => {
      ki && "sp" !== e2 || injectHook(e2, (...e3) => t2(...e3), r2);
    }, "createHook"), Fs = createHook("bm"), zs = createHook("m"), qs = createHook("bu"), Ws = createHook("u"), Ks = createHook("bum"), Xs = createHook("um"), Gs = createHook("sp"), Js = createHook("rtg"), Ys = createHook("rtc");
    function onErrorCaptured(e2, t2 = Ei) {
      injectHook("ec", e2, t2);
    }
    __name(onErrorCaptured, "onErrorCaptured");
    const Qs = "components";
    const Zs = Symbol.for("v-ndc");
    function resolveAsset(e2, t2, r2 = true, s2 = false) {
      const a2 = ks || Ei;
      if (a2) {
        const r3 = a2.type;
        if (e2 === Qs) {
          const e3 = getComponentName(r3, false);
          if (e3 && (e3 === t2 || e3 === Fr(t2) || e3 === Wr(Fr(t2))))
            return r3;
        }
        const c2 = resolve(a2[e2] || r3[e2], t2) || resolve(a2.appContext[e2], t2);
        return !c2 && s2 ? r3 : c2;
      }
    }
    __name(resolveAsset, "resolveAsset");
    function resolve(e2, t2) {
      return e2 && (e2[t2] || e2[Fr(t2)] || e2[Wr(Fr(t2))]);
    }
    __name(resolve, "resolve");
    function ensureValidVNode$1(e2) {
      return e2.some((e3) => !isVNode$2(e3) || e3.type !== mi && !(e3.type === fi && !ensureValidVNode$1(e3.children))) ? e2 : null;
    }
    __name(ensureValidVNode$1, "ensureValidVNode$1");
    const getPublicInstance = /* @__PURE__ */ __name((e2) => e2 ? isStatefulComponent(e2) ? getComponentPublicInstance(e2) : getPublicInstance(e2.parent) : null, "getPublicInstance"), ei = $r(/* @__PURE__ */ Object.create(null), { $: (e2) => e2, $el: (e2) => e2.vnode.el, $data: (e2) => e2.data, $props: (e2) => e2.props, $attrs: (e2) => e2.attrs, $slots: (e2) => e2.slots, $refs: (e2) => e2.refs, $parent: (e2) => getPublicInstance(e2.parent), $root: (e2) => getPublicInstance(e2.root), $host: (e2) => e2.ce, $emit: (e2) => e2.emit, $options: (e2) => resolveMergedOptions(e2), $forceUpdate: (e2) => e2.f || (e2.f = () => {
      queueJob(e2.update);
    }), $nextTick: (e2) => e2.n || (e2.n = nextTick.bind(e2.proxy)), $watch: (e2) => instanceWatch.bind(e2) }), hasSetupBinding = /* @__PURE__ */ __name((e2, t2) => e2 !== Lr && !e2.__isScriptSetup && hasOwn(e2, t2), "hasSetupBinding"), ti = { get({ _: e2 }, t2) {
      if ("__v_skip" === t2)
        return true;
      const { ctx: r2, setupState: s2, data: a2, props: c2, accessCache: p2, type: u2, appContext: d2 } = e2;
      let f2;
      if ("$" !== t2[0]) {
        const u3 = p2[t2];
        if (void 0 !== u3)
          switch (u3) {
            case 1:
              return s2[t2];
            case 2:
              return a2[t2];
            case 4:
              return r2[t2];
            case 3:
              return c2[t2];
          }
        else {
          if (hasSetupBinding(s2, t2))
            return p2[t2] = 1, s2[t2];
          if (a2 !== Lr && hasOwn(a2, t2))
            return p2[t2] = 2, a2[t2];
          if ((f2 = e2.propsOptions[0]) && hasOwn(f2, t2))
            return p2[t2] = 3, c2[t2];
          if (r2 !== Lr && hasOwn(r2, t2))
            return p2[t2] = 4, r2[t2];
          ri && (p2[t2] = 0);
        }
      }
      const m2 = ei[t2];
      let g2, x2;
      return m2 ? ("$attrs" === t2 && track(e2.attrs, 0, ""), m2(e2)) : (g2 = u2.__cssModules) && (g2 = g2[t2]) ? g2 : r2 !== Lr && hasOwn(r2, t2) ? (p2[t2] = 4, r2[t2]) : (x2 = d2.config.globalProperties, hasOwn(x2, t2) ? x2[t2] : void 0);
    }, set({ _: e2 }, t2, r2) {
      const { data: s2, setupState: a2, ctx: c2 } = e2;
      return hasSetupBinding(a2, t2) ? (a2[t2] = r2, true) : s2 !== Lr && hasOwn(s2, t2) ? (s2[t2] = r2, true) : !hasOwn(e2.props, t2) && (("$" !== t2[0] || !(t2.slice(1) in e2)) && (c2[t2] = r2, true));
    }, has({ _: { data: e2, setupState: t2, accessCache: r2, ctx: s2, appContext: a2, propsOptions: c2 } }, p2) {
      let u2;
      return !!r2[p2] || e2 !== Lr && hasOwn(e2, p2) || hasSetupBinding(t2, p2) || (u2 = c2[0]) && hasOwn(u2, p2) || hasOwn(s2, p2) || hasOwn(ei, p2) || hasOwn(a2.config.globalProperties, p2);
    }, defineProperty(e2, t2, r2) {
      return null != r2.get ? e2._.accessCache[t2] = 0 : hasOwn(r2, "value") && this.set(e2, t2, r2.value, null), Reflect.defineProperty(e2, t2, r2);
    } }, ni = $r({}, ti, { get(e2, t2) {
      if (t2 !== Symbol.unscopables)
        return ti.get(e2, t2, e2);
    }, has: (e2, t2) => "_" !== t2[0] && !Qr(t2) });
    function getContext(e2) {
      const t2 = getCurrentInstance();
      return t2.setupContext || (t2.setupContext = createSetupContext(t2));
    }
    __name(getContext, "getContext");
    function normalizePropsOrEmits(e2) {
      return jr(e2) ? e2.reduce((e3, t2) => (e3[t2] = null, e3), {}) : e2;
    }
    __name(normalizePropsOrEmits, "normalizePropsOrEmits");
    let ri = true;
    function applyOptions(e2) {
      const t2 = resolveMergedOptions(e2), r2 = e2.proxy, s2 = e2.ctx;
      ri = false, t2.beforeCreate && callHook$1(t2.beforeCreate, e2, "bc");
      const { data: a2, computed: c2, methods: p2, watch: u2, provide: d2, inject: f2, created: m2, beforeMount: g2, mounted: x2, beforeUpdate: _2, updated: E2, activated: S2, deactivated: T2, beforeDestroy: C2, beforeUnmount: R2, destroyed: N2, unmounted: O2, render: I2, renderTracked: P2, renderTriggered: L2, errorCaptured: M2, serverPrefetch: $2, expose: B2, inheritAttrs: j2, components: D2, directives: H2, filters: U2 } = t2;
      if (f2 && function(e3, t3) {
        jr(e3) && (e3 = normalizeInject(e3));
        for (const r3 in e3) {
          const s3 = e3[r3];
          let a3;
          a3 = isObject(s3) ? "default" in s3 ? inject(s3.from || r3, s3.default, true) : inject(s3.from || r3) : inject(s3), isRef(a3) ? Object.defineProperty(t3, r3, { enumerable: true, configurable: true, get: () => a3.value, set: (e4) => a3.value = e4 }) : t3[r3] = a3;
        }
      }(f2, s2, null), p2)
        for (const e3 in p2) {
          const t3 = p2[e3];
          isFunction(t3) && (s2[e3] = t3.bind(r2));
        }
      if (a2) {
        const t3 = a2.call(r2, r2);
        isObject(t3) && (e2.data = reactive(t3));
      }
      if (ri = true, c2)
        for (const e3 in c2) {
          const t3 = c2[e3], a3 = isFunction(t3) ? t3.bind(r2, r2) : isFunction(t3.get) ? t3.get.bind(r2, r2) : NOOP, p3 = !isFunction(t3) && isFunction(t3.set) ? t3.set.bind(r2) : NOOP, u3 = computed({ get: a3, set: p3 });
          Object.defineProperty(s2, e3, { enumerable: true, configurable: true, get: () => u3.value, set: (e4) => u3.value = e4 });
        }
      if (u2)
        for (const e3 in u2)
          createWatcher(u2[e3], s2, r2, e3);
      if (d2) {
        const e3 = isFunction(d2) ? d2.call(r2) : d2;
        Reflect.ownKeys(e3).forEach((t3) => {
          provide(t3, e3[t3]);
        });
      }
      function registerLifecycleHook(e3, t3) {
        jr(t3) ? t3.forEach((t4) => e3(t4.bind(r2))) : t3 && e3(t3.bind(r2));
      }
      __name(registerLifecycleHook, "registerLifecycleHook");
      if (m2 && callHook$1(m2, e2, "c"), registerLifecycleHook(Fs, g2), registerLifecycleHook(zs, x2), registerLifecycleHook(qs, _2), registerLifecycleHook(Ws, E2), registerLifecycleHook(onActivated, S2), registerLifecycleHook(onDeactivated, T2), registerLifecycleHook(onErrorCaptured, M2), registerLifecycleHook(Ys, P2), registerLifecycleHook(Js, L2), registerLifecycleHook(Ks, R2), registerLifecycleHook(Xs, O2), registerLifecycleHook(Gs, $2), jr(B2))
        if (B2.length) {
          const t3 = e2.exposed || (e2.exposed = {});
          B2.forEach((e3) => {
            Object.defineProperty(t3, e3, { get: () => r2[e3], set: (t4) => r2[e3] = t4, enumerable: true });
          });
        } else
          e2.exposed || (e2.exposed = {});
      I2 && e2.render === NOOP && (e2.render = I2), null != j2 && (e2.inheritAttrs = j2), D2 && (e2.components = D2), H2 && (e2.directives = H2), $2 && markAsyncBoundary(e2);
    }
    __name(applyOptions, "applyOptions");
    function callHook$1(e2, t2, r2) {
      callWithAsyncErrorHandling(jr(e2) ? e2.map((e3) => e3.bind(t2.proxy)) : e2.bind(t2.proxy), t2, r2);
    }
    __name(callHook$1, "callHook$1");
    function createWatcher(e2, t2, r2, s2) {
      let a2 = s2.includes(".") ? createPathGetter(r2, s2) : () => r2[s2];
      if (isString(e2)) {
        const r3 = t2[e2];
        isFunction(r3) && watch(a2, r3);
      } else if (isFunction(e2))
        watch(a2, e2.bind(r2));
      else if (isObject(e2))
        if (jr(e2))
          e2.forEach((e3) => createWatcher(e3, t2, r2, s2));
        else {
          const s3 = isFunction(e2.handler) ? e2.handler.bind(r2) : t2[e2.handler];
          isFunction(s3) && watch(a2, s3, e2);
        }
    }
    __name(createWatcher, "createWatcher");
    function resolveMergedOptions(e2) {
      const t2 = e2.type, { mixins: r2, extends: s2 } = t2, { mixins: a2, optionsCache: c2, config: { optionMergeStrategies: p2 } } = e2.appContext, u2 = c2.get(t2);
      let d2;
      return u2 ? d2 = u2 : a2.length || r2 || s2 ? (d2 = {}, a2.length && a2.forEach((e3) => mergeOptions(d2, e3, p2, true)), mergeOptions(d2, t2, p2)) : d2 = t2, isObject(t2) && c2.set(t2, d2), d2;
    }
    __name(resolveMergedOptions, "resolveMergedOptions");
    function mergeOptions(e2, t2, r2, s2 = false) {
      const { mixins: a2, extends: c2 } = t2;
      c2 && mergeOptions(e2, c2, r2, true), a2 && a2.forEach((t3) => mergeOptions(e2, t3, r2, true));
      for (const a3 in t2)
        if (s2 && "expose" === a3)
          ;
        else {
          const s3 = oi[a3] || r2 && r2[a3];
          e2[a3] = s3 ? s3(e2[a3], t2[a3]) : t2[a3];
        }
      return e2;
    }
    __name(mergeOptions, "mergeOptions");
    const oi = { data: mergeDataFn, props: mergeEmitsOrPropsOptions, emits: mergeEmitsOrPropsOptions, methods: mergeObjectOptions, computed: mergeObjectOptions, beforeCreate: mergeAsArray$1, created: mergeAsArray$1, beforeMount: mergeAsArray$1, mounted: mergeAsArray$1, beforeUpdate: mergeAsArray$1, updated: mergeAsArray$1, beforeDestroy: mergeAsArray$1, beforeUnmount: mergeAsArray$1, destroyed: mergeAsArray$1, unmounted: mergeAsArray$1, activated: mergeAsArray$1, deactivated: mergeAsArray$1, errorCaptured: mergeAsArray$1, serverPrefetch: mergeAsArray$1, components: mergeObjectOptions, directives: mergeObjectOptions, watch: function(e2, t2) {
      if (!e2)
        return t2;
      if (!t2)
        return e2;
      const r2 = $r(/* @__PURE__ */ Object.create(null), e2);
      for (const s2 in t2)
        r2[s2] = mergeAsArray$1(e2[s2], t2[s2]);
      return r2;
    }, provide: mergeDataFn, inject: function(e2, t2) {
      return mergeObjectOptions(normalizeInject(e2), normalizeInject(t2));
    } };
    function mergeDataFn(e2, t2) {
      return t2 ? e2 ? function() {
        return $r(isFunction(e2) ? e2.call(this, this) : e2, isFunction(t2) ? t2.call(this, this) : t2);
      } : t2 : e2;
    }
    __name(mergeDataFn, "mergeDataFn");
    function normalizeInject(e2) {
      if (jr(e2)) {
        const t2 = {};
        for (let r2 = 0; r2 < e2.length; r2++)
          t2[e2[r2]] = e2[r2];
        return t2;
      }
      return e2;
    }
    __name(normalizeInject, "normalizeInject");
    function mergeAsArray$1(e2, t2) {
      return e2 ? [...new Set([].concat(e2, t2))] : t2;
    }
    __name(mergeAsArray$1, "mergeAsArray$1");
    function mergeObjectOptions(e2, t2) {
      return e2 ? $r(/* @__PURE__ */ Object.create(null), e2, t2) : t2;
    }
    __name(mergeObjectOptions, "mergeObjectOptions");
    function mergeEmitsOrPropsOptions(e2, t2) {
      return e2 ? jr(e2) && jr(t2) ? [.../* @__PURE__ */ new Set([...e2, ...t2])] : $r(/* @__PURE__ */ Object.create(null), normalizePropsOrEmits(e2), normalizePropsOrEmits(null != t2 ? t2 : {})) : t2;
    }
    __name(mergeEmitsOrPropsOptions, "mergeEmitsOrPropsOptions");
    function createAppContext() {
      return { app: null, config: { isNativeTag: NO, performance: false, globalProperties: {}, optionMergeStrategies: {}, errorHandler: void 0, warnHandler: void 0, compilerOptions: {} }, mixins: [], components: {}, directives: {}, provides: /* @__PURE__ */ Object.create(null), optionsCache: /* @__PURE__ */ new WeakMap(), propsCache: /* @__PURE__ */ new WeakMap(), emitsCache: /* @__PURE__ */ new WeakMap() };
    }
    __name(createAppContext, "createAppContext");
    let si = 0;
    function createAppAPI(e2, t2) {
      return function(r2, s2 = null) {
        isFunction(r2) || (r2 = $r({}, r2)), null == s2 || isObject(s2) || (s2 = null);
        const a2 = createAppContext(), c2 = /* @__PURE__ */ new WeakSet(), p2 = [];
        let u2 = false;
        const d2 = a2.app = { _uid: si++, _component: r2, _props: s2, _container: null, _context: a2, _instance: null, version: Ai, get config() {
          return a2.config;
        }, set config(e3) {
        }, use: (e3, ...t3) => (c2.has(e3) || (e3 && isFunction(e3.install) ? (c2.add(e3), e3.install(d2, ...t3)) : isFunction(e3) && (c2.add(e3), e3(d2, ...t3))), d2), mixin: (e3) => (a2.mixins.includes(e3) || a2.mixins.push(e3), d2), component: (e3, t3) => t3 ? (a2.components[e3] = t3, d2) : a2.components[e3], directive: (e3, t3) => t3 ? (a2.directives[e3] = t3, d2) : a2.directives[e3], mount(c3, p3, f2) {
          if (!u2) {
            const m2 = d2._ceVNode || createVNode(r2, s2);
            return m2.appContext = a2, true === f2 ? f2 = "svg" : false === f2 && (f2 = void 0), p3 && t2 ? t2(m2, c3) : e2(m2, c3, f2), u2 = true, d2._container = c3, c3.__vue_app__ = d2, getComponentPublicInstance(m2.component);
          }
        }, onUnmount(e3) {
          p2.push(e3);
        }, unmount() {
          u2 && (callWithAsyncErrorHandling(p2, d2._instance, 16), e2(null, d2._container), delete d2._container.__vue_app__);
        }, provide: (e3, t3) => (a2.provides[e3] = t3, d2), runWithContext(e3) {
          const t3 = ii;
          ii = d2;
          try {
            return e3();
          } finally {
            ii = t3;
          }
        } };
        return d2;
      };
    }
    __name(createAppAPI, "createAppAPI");
    let ii = null;
    function provide(e2, t2) {
      if (Ei) {
        let r2 = Ei.provides;
        const s2 = Ei.parent && Ei.parent.provides;
        s2 === r2 && (r2 = Ei.provides = Object.create(s2)), r2[e2] = t2;
      } else
        ;
    }
    __name(provide, "provide");
    function inject(e2, t2, r2 = false) {
      const s2 = getCurrentInstance();
      if (s2 || ii) {
        let a2 = ii ? ii._context.provides : s2 ? null == s2.parent || s2.ce ? s2.vnode.appContext && s2.vnode.appContext.provides : s2.parent.provides : void 0;
        if (a2 && e2 in a2)
          return a2[e2];
        if (arguments.length > 1)
          return r2 && isFunction(t2) ? t2.call(s2 && s2.proxy) : t2;
      }
    }
    __name(inject, "inject");
    function hasInjectionContext() {
      return !(!getCurrentInstance() && !ii);
    }
    __name(hasInjectionContext, "hasInjectionContext");
    const ai = {}, createInternalObject = /* @__PURE__ */ __name(() => Object.create(ai), "createInternalObject"), isInternalObject = /* @__PURE__ */ __name((e2) => Object.getPrototypeOf(e2) === ai, "isInternalObject");
    function setFullProps(e2, t2, r2, s2) {
      const [a2, c2] = e2.propsOptions;
      let p2, u2 = false;
      if (t2)
        for (let d2 in t2) {
          if (Hr(d2))
            continue;
          const f2 = t2[d2];
          let m2;
          a2 && hasOwn(a2, m2 = Fr(d2)) ? c2 && c2.includes(m2) ? (p2 || (p2 = {}))[m2] = f2 : r2[m2] = f2 : isEmitListener(e2.emitsOptions, d2) || d2 in s2 && f2 === s2[d2] || (s2[d2] = f2, u2 = true);
        }
      if (c2) {
        const t3 = toRaw(r2), s3 = p2 || Lr;
        for (let p3 = 0; p3 < c2.length; p3++) {
          const u3 = c2[p3];
          r2[u3] = resolvePropValue(a2, t3, u3, s3[u3], e2, !hasOwn(s3, u3));
        }
      }
      return u2;
    }
    __name(setFullProps, "setFullProps");
    function resolvePropValue(e2, t2, r2, s2, a2, c2) {
      const p2 = e2[r2];
      if (null != p2) {
        const e3 = hasOwn(p2, "default");
        if (e3 && void 0 === s2) {
          const e4 = p2.default;
          if (p2.type !== Function && !p2.skipFactory && isFunction(e4)) {
            const { propsDefaults: c3 } = a2;
            if (r2 in c3)
              s2 = c3[r2];
            else {
              const p3 = setCurrentInstance(a2);
              s2 = c3[r2] = e4.call(null, t2), p3();
            }
          } else
            s2 = e4;
          a2.ce && a2.ce._setProp(r2, s2);
        }
        p2[0] && (c2 && !e3 ? s2 = false : !p2[1] || "" !== s2 && s2 !== qr(r2) || (s2 = true));
      }
      return s2;
    }
    __name(resolvePropValue, "resolvePropValue");
    const ci = /* @__PURE__ */ new WeakMap();
    function normalizePropsOptions(e2, t2, r2 = false) {
      const s2 = r2 ? ci : t2.propsCache, a2 = s2.get(e2);
      if (a2)
        return a2;
      const c2 = e2.props, p2 = {}, u2 = [];
      let d2 = false;
      if (!isFunction(e2)) {
        const extendProps = /* @__PURE__ */ __name((e3) => {
          d2 = true;
          const [r3, s3] = normalizePropsOptions(e3, t2, true);
          $r(p2, r3), s3 && u2.push(...s3);
        }, "extendProps");
        !r2 && t2.mixins.length && t2.mixins.forEach(extendProps), e2.extends && extendProps(e2.extends), e2.mixins && e2.mixins.forEach(extendProps);
      }
      if (!c2 && !d2)
        return isObject(e2) && s2.set(e2, Mr), Mr;
      if (jr(c2))
        for (let e3 = 0; e3 < c2.length; e3++) {
          const t3 = Fr(c2[e3]);
          validatePropName(t3) && (p2[t3] = Lr);
        }
      else if (c2)
        for (const e3 in c2) {
          const t3 = Fr(e3);
          if (validatePropName(t3)) {
            const r3 = c2[e3], s3 = p2[t3] = jr(r3) || isFunction(r3) ? { type: r3 } : $r({}, r3), a3 = s3.type;
            let d3 = false, f3 = true;
            if (jr(a3))
              for (let e4 = 0; e4 < a3.length; ++e4) {
                const t4 = a3[e4], r4 = isFunction(t4) && t4.name;
                if ("Boolean" === r4) {
                  d3 = true;
                  break;
                }
                "String" === r4 && (f3 = false);
              }
            else
              d3 = isFunction(a3) && "Boolean" === a3.name;
            s3[0] = d3, s3[1] = f3, (d3 || hasOwn(s3, "default")) && u2.push(t3);
          }
        }
      const f2 = [p2, u2];
      return isObject(e2) && s2.set(e2, f2), f2;
    }
    __name(normalizePropsOptions, "normalizePropsOptions");
    function validatePropName(e2) {
      return "$" !== e2[0] && !Hr(e2);
    }
    __name(validatePropName, "validatePropName");
    const isInternalKey = /* @__PURE__ */ __name((e2) => "_" === e2 || "__" === e2 || "_ctx" === e2 || "$stable" === e2, "isInternalKey"), normalizeSlotValue = /* @__PURE__ */ __name((e2) => jr(e2) ? e2.map(normalizeVNode$1) : [normalizeVNode$1(e2)], "normalizeSlotValue"), normalizeSlot = /* @__PURE__ */ __name((e2, t2, r2) => {
      if (t2._n)
        return t2;
      const s2 = withCtx((...e3) => normalizeSlotValue(t2(...e3)), r2);
      return s2._c = false, s2;
    }, "normalizeSlot"), normalizeObjectSlots = /* @__PURE__ */ __name((e2, t2, r2) => {
      const s2 = e2._ctx;
      for (const r3 in e2) {
        if (isInternalKey(r3))
          continue;
        const a2 = e2[r3];
        if (isFunction(a2))
          t2[r3] = normalizeSlot(0, a2, s2);
        else if (null != a2) {
          const e3 = normalizeSlotValue(a2);
          t2[r3] = () => e3;
        }
      }
    }, "normalizeObjectSlots"), normalizeVNodeSlots = /* @__PURE__ */ __name((e2, t2) => {
      const r2 = normalizeSlotValue(t2);
      e2.slots.default = () => r2;
    }, "normalizeVNodeSlots"), assignSlots = /* @__PURE__ */ __name((e2, t2, r2) => {
      for (const s2 in t2)
        !r2 && isInternalKey(s2) || (e2[s2] = t2[s2]);
    }, "assignSlots"), li = queueEffectWithSuspense;
    function createRenderer(e2) {
      return baseCreateRenderer(e2);
    }
    __name(createRenderer, "createRenderer");
    function createHydrationRenderer(e2) {
      return baseCreateRenderer(e2, createHydrationFunctions);
    }
    __name(createHydrationRenderer, "createHydrationRenderer");
    function baseCreateRenderer(e2, t2) {
      getGlobalThis().__VUE__ = true;
      const { insert: r2, remove: s2, patchProp: a2, createElement: c2, createText: p2, createComment: u2, setText: d2, setElementText: f2, parentNode: m2, nextSibling: g2, setScopeId: x2 = NOOP, insertStaticContent: _2 } = e2, patch = /* @__PURE__ */ __name((e3, t3, r3, s3 = null, a3 = null, c3 = null, p3 = void 0, u3 = null, d3 = !!t3.dynamicChildren) => {
        if (e3 === t3)
          return;
        e3 && !isSameVNodeType(e3, t3) && (s3 = getNextHostNode(e3), unmount(e3, a3, c3, true), e3 = null), -2 === t3.patchFlag && (d3 = false, t3.dynamicChildren = null);
        const { type: f3, ref: m3, shapeFlag: g3 } = t3;
        switch (f3) {
          case hi:
            processText(e3, t3, r3, s3);
            break;
          case mi:
            processCommentNode(e3, t3, r3, s3);
            break;
          case gi:
            null == e3 && mountStaticNode(t3, r3, s3, p3);
            break;
          case fi:
            processFragment(e3, t3, r3, s3, a3, c3, p3, u3, d3);
            break;
          default:
            1 & g3 ? processElement(e3, t3, r3, s3, a3, c3, p3, u3, d3) : 6 & g3 ? processComponent(e3, t3, r3, s3, a3, c3, p3, u3, d3) : (64 & g3 || 128 & g3) && f3.process(e3, t3, r3, s3, a3, c3, p3, u3, d3, S2);
        }
        null != m3 && a3 ? setRef(m3, e3 && e3.ref, c3, t3 || e3, !t3) : null == m3 && e3 && null != e3.ref && setRef(e3.ref, null, c3, e3, true);
      }, "patch"), processText = /* @__PURE__ */ __name((e3, t3, s3, a3) => {
        if (null == e3)
          r2(t3.el = p2(t3.children), s3, a3);
        else {
          const r3 = t3.el = e3.el;
          t3.children !== e3.children && d2(r3, t3.children);
        }
      }, "processText"), processCommentNode = /* @__PURE__ */ __name((e3, t3, s3, a3) => {
        null == e3 ? r2(t3.el = u2(t3.children || ""), s3, a3) : t3.el = e3.el;
      }, "processCommentNode"), mountStaticNode = /* @__PURE__ */ __name((e3, t3, r3, s3) => {
        [e3.el, e3.anchor] = _2(e3.children, t3, r3, s3, e3.el, e3.anchor);
      }, "mountStaticNode"), processElement = /* @__PURE__ */ __name((e3, t3, r3, s3, a3, c3, p3, u3, d3) => {
        "svg" === t3.type ? p3 = "svg" : "math" === t3.type && (p3 = "mathml"), null == e3 ? mountElement(t3, r3, s3, a3, c3, p3, u3, d3) : patchElement(e3, t3, a3, c3, p3, u3, d3);
      }, "processElement"), mountElement = /* @__PURE__ */ __name((e3, t3, s3, p3, u3, d3, m3, g3) => {
        let x3, _3;
        const { props: E3, shapeFlag: S3, transition: T3, dirs: C3 } = e3;
        if (x3 = e3.el = c2(e3.type, d3, E3 && E3.is, E3), 8 & S3 ? f2(x3, e3.children) : 16 & S3 && mountChildren(e3.children, x3, null, p3, u3, resolveChildrenNamespace(e3, d3), m3, g3), C3 && invokeDirectiveHook(e3, null, p3, "created"), setScopeId(x3, e3, e3.scopeId, m3, p3), E3) {
          for (const e4 in E3)
            "value" === e4 || Hr(e4) || a2(x3, e4, null, E3[e4], d3, p3);
          "value" in E3 && a2(x3, "value", null, E3.value, d3), (_3 = E3.onVnodeBeforeMount) && invokeVNodeHook(_3, p3, e3);
        }
        C3 && invokeDirectiveHook(e3, null, p3, "beforeMount");
        const R2 = needTransition(u3, T3);
        R2 && T3.beforeEnter(x3), r2(x3, t3, s3), ((_3 = E3 && E3.onVnodeMounted) || R2 || C3) && li(() => {
          _3 && invokeVNodeHook(_3, p3, e3), R2 && T3.enter(x3), C3 && invokeDirectiveHook(e3, null, p3, "mounted");
        }, u3);
      }, "mountElement"), setScopeId = /* @__PURE__ */ __name((e3, t3, r3, s3, a3) => {
        if (r3 && x2(e3, r3), s3)
          for (let t4 = 0; t4 < s3.length; t4++)
            x2(e3, s3[t4]);
        if (a3) {
          let r4 = a3.subTree;
          if (t3 === r4 || isSuspense(r4.type) && (r4.ssContent === t3 || r4.ssFallback === t3)) {
            const t4 = a3.vnode;
            setScopeId(e3, t4, t4.scopeId, t4.slotScopeIds, a3.parent);
          }
        }
      }, "setScopeId"), mountChildren = /* @__PURE__ */ __name((e3, t3, r3, s3, a3, c3, p3, u3, d3 = 0) => {
        for (let f3 = d3; f3 < e3.length; f3++) {
          const d4 = e3[f3] = u3 ? cloneIfMounted(e3[f3]) : normalizeVNode$1(e3[f3]);
          patch(null, d4, t3, r3, s3, a3, c3, p3, u3);
        }
      }, "mountChildren"), patchElement = /* @__PURE__ */ __name((e3, t3, r3, s3, c3, p3, u3) => {
        const d3 = t3.el = e3.el;
        let { patchFlag: m3, dynamicChildren: g3, dirs: x3 } = t3;
        m3 |= 16 & e3.patchFlag;
        const _3 = e3.props || Lr, E3 = t3.props || Lr;
        let S3;
        if (r3 && toggleRecurse(r3, false), (S3 = E3.onVnodeBeforeUpdate) && invokeVNodeHook(S3, r3, t3, e3), x3 && invokeDirectiveHook(t3, e3, r3, "beforeUpdate"), r3 && toggleRecurse(r3, true), (_3.innerHTML && null == E3.innerHTML || _3.textContent && null == E3.textContent) && f2(d3, ""), g3 ? patchBlockChildren(e3.dynamicChildren, g3, d3, r3, s3, resolveChildrenNamespace(t3, c3), p3) : u3 || patchChildren(e3, t3, d3, null, r3, s3, resolveChildrenNamespace(t3, c3), p3, false), m3 > 0) {
          if (16 & m3)
            patchProps(d3, _3, E3, r3, c3);
          else if (2 & m3 && _3.class !== E3.class && a2(d3, "class", null, E3.class, c3), 4 & m3 && a2(d3, "style", _3.style, E3.style, c3), 8 & m3) {
            const e4 = t3.dynamicProps;
            for (let t4 = 0; t4 < e4.length; t4++) {
              const s4 = e4[t4], p4 = _3[s4], u4 = E3[s4];
              u4 === p4 && "value" !== s4 || a2(d3, s4, p4, u4, c3, r3);
            }
          }
          1 & m3 && e3.children !== t3.children && f2(d3, t3.children);
        } else
          u3 || null != g3 || patchProps(d3, _3, E3, r3, c3);
        ((S3 = E3.onVnodeUpdated) || x3) && li(() => {
          S3 && invokeVNodeHook(S3, r3, t3, e3), x3 && invokeDirectiveHook(t3, e3, r3, "updated");
        }, s3);
      }, "patchElement"), patchBlockChildren = /* @__PURE__ */ __name((e3, t3, r3, s3, a3, c3, p3) => {
        for (let u3 = 0; u3 < t3.length; u3++) {
          const d3 = e3[u3], f3 = t3[u3], g3 = d3.el && (d3.type === fi || !isSameVNodeType(d3, f3) || 198 & d3.shapeFlag) ? m2(d3.el) : r3;
          patch(d3, f3, g3, null, s3, a3, c3, p3, true);
        }
      }, "patchBlockChildren"), patchProps = /* @__PURE__ */ __name((e3, t3, r3, s3, c3) => {
        if (t3 !== r3) {
          if (t3 !== Lr)
            for (const p3 in t3)
              Hr(p3) || p3 in r3 || a2(e3, p3, t3[p3], null, c3, s3);
          for (const p3 in r3) {
            if (Hr(p3))
              continue;
            const u3 = r3[p3], d3 = t3[p3];
            u3 !== d3 && "value" !== p3 && a2(e3, p3, d3, u3, c3, s3);
          }
          "value" in r3 && a2(e3, "value", t3.value, r3.value, c3);
        }
      }, "patchProps"), processFragment = /* @__PURE__ */ __name((e3, t3, s3, a3, c3, u3, d3, f3, m3) => {
        const g3 = t3.el = e3 ? e3.el : p2(""), x3 = t3.anchor = e3 ? e3.anchor : p2("");
        let { patchFlag: _3, dynamicChildren: E3, slotScopeIds: S3 } = t3;
        S3 && (f3 = f3 ? f3.concat(S3) : S3), null == e3 ? (r2(g3, s3, a3), r2(x3, s3, a3), mountChildren(t3.children || [], s3, x3, c3, u3, d3, f3, m3)) : _3 > 0 && 64 & _3 && E3 && e3.dynamicChildren ? (patchBlockChildren(e3.dynamicChildren, E3, s3, c3, u3, d3, f3), (null != t3.key || c3 && t3 === c3.subTree) && traverseStaticChildren(e3, t3, true)) : patchChildren(e3, t3, s3, x3, c3, u3, d3, f3, m3);
      }, "processFragment"), processComponent = /* @__PURE__ */ __name((e3, t3, r3, s3, a3, c3, p3, u3, d3) => {
        t3.slotScopeIds = u3, null == e3 ? 512 & t3.shapeFlag ? a3.ctx.activate(t3, r3, s3, p3, d3) : mountComponent(t3, r3, s3, a3, c3, p3, d3) : updateComponent(e3, t3, d3);
      }, "processComponent"), mountComponent = /* @__PURE__ */ __name((e3, t3, r3, s3, a3, c3, p3) => {
        const u3 = e3.component = createComponentInstance$1(e3, s3, a3);
        if (isKeepAlive(e3) && (u3.ctx.renderer = S2), setupComponent$1(u3, false, p3), u3.asyncDep) {
          if (a3 && a3.registerDep(u3, setupRenderEffect, p3), !e3.el) {
            const s4 = u3.subTree = createVNode(mi);
            processCommentNode(null, s4, t3, r3), e3.placeholder = s4.el;
          }
        } else
          setupRenderEffect(u3, e3, t3, r3, a3, c3, p3);
      }, "mountComponent"), updateComponent = /* @__PURE__ */ __name((e3, t3, r3) => {
        const s3 = t3.component = e3.component;
        if (function(e4, t4, r4) {
          const { props: s4, children: a3, component: c3 } = e4, { props: p3, children: u3, patchFlag: d3 } = t4, f3 = c3.emitsOptions;
          if (t4.dirs || t4.transition)
            return true;
          if (!(r4 && d3 >= 0))
            return !(!a3 && !u3 || u3 && u3.$stable) || s4 !== p3 && (s4 ? !p3 || hasPropsChanged(s4, p3, f3) : !!p3);
          if (1024 & d3)
            return true;
          if (16 & d3)
            return s4 ? hasPropsChanged(s4, p3, f3) : !!p3;
          if (8 & d3) {
            const e5 = t4.dynamicProps;
            for (let t5 = 0; t5 < e5.length; t5++) {
              const r5 = e5[t5];
              if (p3[r5] !== s4[r5] && !isEmitListener(f3, r5))
                return true;
            }
          }
          return false;
        }(e3, t3, r3)) {
          if (s3.asyncDep && !s3.asyncResolved)
            return void updateComponentPreRender(s3, t3, r3);
          s3.next = t3, s3.update();
        } else
          t3.el = e3.el, s3.vnode = t3;
      }, "updateComponent"), setupRenderEffect = /* @__PURE__ */ __name((e3, t3, r3, s3, a3, c3, p3) => {
        const componentUpdateFn = /* @__PURE__ */ __name(() => {
          if (e3.isMounted) {
            let { next: t4, bu: r4, u: s4, parent: u4, vnode: d4 } = e3;
            {
              const r5 = locateNonHydratedAsyncRoot(e3);
              if (r5)
                return t4 && (t4.el = d4.el, updateComponentPreRender(e3, t4, p3)), void r5.asyncDep.then(() => {
                  e3.isUnmounted || componentUpdateFn();
                });
            }
            let f4, g3 = t4;
            toggleRecurse(e3, false), t4 ? (t4.el = d4.el, updateComponentPreRender(e3, t4, p3)) : t4 = d4, r4 && invokeArrayFns(r4), (f4 = t4.props && t4.props.onVnodeBeforeUpdate) && invokeVNodeHook(f4, u4, t4, d4), toggleRecurse(e3, true);
            const x3 = renderComponentRoot$1(e3), _3 = e3.subTree;
            e3.subTree = x3, patch(_3, x3, m2(_3.el), getNextHostNode(_3), e3, a3, c3), t4.el = x3.el, null === g3 && updateHOCHostEl(e3, x3.el), s4 && li(s4, a3), (f4 = t4.props && t4.props.onVnodeUpdated) && li(() => invokeVNodeHook(f4, u4, t4, d4), a3);
          } else {
            let p4;
            const { el: u4, props: d4 } = t3, { bm: f4, m: m3, parent: g3, root: x3, type: _3 } = e3, E3 = isAsyncWrapper(t3);
            if (toggleRecurse(e3, false), f4 && invokeArrayFns(f4), !E3 && (p4 = d4 && d4.onVnodeBeforeMount) && invokeVNodeHook(p4, g3, t3), toggleRecurse(e3, true), u4 && C2) {
              const hydrateSubTree = /* @__PURE__ */ __name(() => {
                e3.subTree = renderComponentRoot$1(e3), C2(u4, e3.subTree, e3, a3, null);
              }, "hydrateSubTree");
              E3 && _3.__asyncHydrate ? _3.__asyncHydrate(u4, e3, hydrateSubTree) : hydrateSubTree();
            } else {
              x3.ce && false !== x3.ce._def.shadowRoot && x3.ce._injectChildStyle(_3);
              const p5 = e3.subTree = renderComponentRoot$1(e3);
              patch(null, p5, r3, s3, e3, a3, c3), t3.el = p5.el;
            }
            if (m3 && li(m3, a3), !E3 && (p4 = d4 && d4.onVnodeMounted)) {
              const e4 = t3;
              li(() => invokeVNodeHook(p4, g3, e4), a3);
            }
            (256 & t3.shapeFlag || g3 && isAsyncWrapper(g3.vnode) && 256 & g3.vnode.shapeFlag) && e3.a && li(e3.a, a3), e3.isMounted = true, t3 = r3 = s3 = null;
          }
        }, "componentUpdateFn");
        e3.scope.on();
        const u3 = e3.effect = new ReactiveEffect(componentUpdateFn);
        e3.scope.off();
        const d3 = e3.update = u3.run.bind(u3), f3 = e3.job = u3.runIfDirty.bind(u3);
        f3.i = e3, f3.id = e3.uid, u3.scheduler = () => queueJob(f3), toggleRecurse(e3, true), d3();
      }, "setupRenderEffect"), updateComponentPreRender = /* @__PURE__ */ __name((e3, t3, r3) => {
        t3.component = e3;
        const s3 = e3.vnode.props;
        e3.vnode = t3, e3.next = null, function(e4, t4, r4, s4) {
          const { props: a3, attrs: c3, vnode: { patchFlag: p3 } } = e4, u3 = toRaw(a3), [d3] = e4.propsOptions;
          let f3 = false;
          if (!(s4 || p3 > 0) || 16 & p3) {
            let s5;
            setFullProps(e4, t4, a3, c3) && (f3 = true);
            for (const c4 in u3)
              t4 && (hasOwn(t4, c4) || (s5 = qr(c4)) !== c4 && hasOwn(t4, s5)) || (d3 ? !r4 || void 0 === r4[c4] && void 0 === r4[s5] || (a3[c4] = resolvePropValue(d3, u3, c4, void 0, e4, true)) : delete a3[c4]);
            if (c3 !== u3)
              for (const e5 in c3)
                t4 && hasOwn(t4, e5) || (delete c3[e5], f3 = true);
          } else if (8 & p3) {
            const r5 = e4.vnode.dynamicProps;
            for (let s5 = 0; s5 < r5.length; s5++) {
              let p4 = r5[s5];
              if (isEmitListener(e4.emitsOptions, p4))
                continue;
              const m3 = t4[p4];
              if (d3)
                if (hasOwn(c3, p4))
                  m3 !== c3[p4] && (c3[p4] = m3, f3 = true);
                else {
                  const t5 = Fr(p4);
                  a3[t5] = resolvePropValue(d3, u3, t5, m3, e4, false);
                }
              else
                m3 !== c3[p4] && (c3[p4] = m3, f3 = true);
            }
          }
          f3 && trigger(e4.attrs, "set", "");
        }(e3, t3.props, s3, r3), ((e4, t4, r4) => {
          const { vnode: s4, slots: a3 } = e4;
          let c3 = true, p3 = Lr;
          if (32 & s4.shapeFlag) {
            const e5 = t4._;
            e5 ? r4 && 1 === e5 ? c3 = false : assignSlots(a3, t4, r4) : (c3 = !t4.$stable, normalizeObjectSlots(t4, a3)), p3 = t4;
          } else
            t4 && (normalizeVNodeSlots(e4, t4), p3 = { default: 1 });
          if (c3)
            for (const e5 in a3)
              isInternalKey(e5) || null != p3[e5] || delete a3[e5];
        })(e3, t3.children, r3), pauseTracking(), flushPreFlushCbs(e3), resetTracking();
      }, "updateComponentPreRender"), patchChildren = /* @__PURE__ */ __name((e3, t3, r3, s3, a3, c3, p3, u3, d3 = false) => {
        const m3 = e3 && e3.children, g3 = e3 ? e3.shapeFlag : 0, x3 = t3.children, { patchFlag: _3, shapeFlag: E3 } = t3;
        if (_3 > 0) {
          if (128 & _3)
            return void patchKeyedChildren(m3, x3, r3, s3, a3, c3, p3, u3, d3);
          if (256 & _3)
            return void patchUnkeyedChildren(m3, x3, r3, s3, a3, c3, p3, u3, d3);
        }
        8 & E3 ? (16 & g3 && unmountChildren(m3, a3, c3), x3 !== m3 && f2(r3, x3)) : 16 & g3 ? 16 & E3 ? patchKeyedChildren(m3, x3, r3, s3, a3, c3, p3, u3, d3) : unmountChildren(m3, a3, c3, true) : (8 & g3 && f2(r3, ""), 16 & E3 && mountChildren(x3, r3, s3, a3, c3, p3, u3, d3));
      }, "patchChildren"), patchUnkeyedChildren = /* @__PURE__ */ __name((e3, t3, r3, s3, a3, c3, p3, u3, d3) => {
        t3 = t3 || Mr;
        const f3 = (e3 = e3 || Mr).length, m3 = t3.length, g3 = Math.min(f3, m3);
        let x3;
        for (x3 = 0; x3 < g3; x3++) {
          const s4 = t3[x3] = d3 ? cloneIfMounted(t3[x3]) : normalizeVNode$1(t3[x3]);
          patch(e3[x3], s4, r3, null, a3, c3, p3, u3, d3);
        }
        f3 > m3 ? unmountChildren(e3, a3, c3, true, false, g3) : mountChildren(t3, r3, s3, a3, c3, p3, u3, d3, g3);
      }, "patchUnkeyedChildren"), patchKeyedChildren = /* @__PURE__ */ __name((e3, t3, r3, s3, a3, c3, p3, u3, d3) => {
        let f3 = 0;
        const m3 = t3.length;
        let g3 = e3.length - 1, x3 = m3 - 1;
        for (; f3 <= g3 && f3 <= x3; ) {
          const s4 = e3[f3], m4 = t3[f3] = d3 ? cloneIfMounted(t3[f3]) : normalizeVNode$1(t3[f3]);
          if (!isSameVNodeType(s4, m4))
            break;
          patch(s4, m4, r3, null, a3, c3, p3, u3, d3), f3++;
        }
        for (; f3 <= g3 && f3 <= x3; ) {
          const s4 = e3[g3], f4 = t3[x3] = d3 ? cloneIfMounted(t3[x3]) : normalizeVNode$1(t3[x3]);
          if (!isSameVNodeType(s4, f4))
            break;
          patch(s4, f4, r3, null, a3, c3, p3, u3, d3), g3--, x3--;
        }
        if (f3 > g3) {
          if (f3 <= x3) {
            const e4 = x3 + 1, g4 = e4 < m3 ? t3[e4].el : s3;
            for (; f3 <= x3; )
              patch(null, t3[f3] = d3 ? cloneIfMounted(t3[f3]) : normalizeVNode$1(t3[f3]), r3, g4, a3, c3, p3, u3, d3), f3++;
          }
        } else if (f3 > x3)
          for (; f3 <= g3; )
            unmount(e3[f3], a3, c3, true), f3++;
        else {
          const _3 = f3, E3 = f3, S3 = /* @__PURE__ */ new Map();
          for (f3 = E3; f3 <= x3; f3++) {
            const e4 = t3[f3] = d3 ? cloneIfMounted(t3[f3]) : normalizeVNode$1(t3[f3]);
            null != e4.key && S3.set(e4.key, f3);
          }
          let T3, C3 = 0;
          const R2 = x3 - E3 + 1;
          let N2 = false, O2 = 0;
          const I2 = new Array(R2);
          for (f3 = 0; f3 < R2; f3++)
            I2[f3] = 0;
          for (f3 = _3; f3 <= g3; f3++) {
            const s4 = e3[f3];
            if (C3 >= R2) {
              unmount(s4, a3, c3, true);
              continue;
            }
            let m4;
            if (null != s4.key)
              m4 = S3.get(s4.key);
            else
              for (T3 = E3; T3 <= x3; T3++)
                if (0 === I2[T3 - E3] && isSameVNodeType(s4, t3[T3])) {
                  m4 = T3;
                  break;
                }
            void 0 === m4 ? unmount(s4, a3, c3, true) : (I2[m4 - E3] = f3 + 1, m4 >= O2 ? O2 = m4 : N2 = true, patch(s4, t3[m4], r3, null, a3, c3, p3, u3, d3), C3++);
          }
          const P2 = N2 ? function(e4) {
            const t4 = e4.slice(), r4 = [0];
            let s4, a4, c4, p4, u4;
            const d4 = e4.length;
            for (s4 = 0; s4 < d4; s4++) {
              const d5 = e4[s4];
              if (0 !== d5) {
                if (a4 = r4[r4.length - 1], e4[a4] < d5) {
                  t4[s4] = a4, r4.push(s4);
                  continue;
                }
                for (c4 = 0, p4 = r4.length - 1; c4 < p4; )
                  u4 = c4 + p4 >> 1, e4[r4[u4]] < d5 ? c4 = u4 + 1 : p4 = u4;
                d5 < e4[r4[c4]] && (c4 > 0 && (t4[s4] = r4[c4 - 1]), r4[c4] = s4);
              }
            }
            c4 = r4.length, p4 = r4[c4 - 1];
            for (; c4-- > 0; )
              r4[c4] = p4, p4 = t4[p4];
            return r4;
          }(I2) : Mr;
          for (T3 = P2.length - 1, f3 = R2 - 1; f3 >= 0; f3--) {
            const e4 = E3 + f3, g4 = t3[e4], x4 = t3[e4 + 1], _4 = e4 + 1 < m3 ? x4.el || x4.placeholder : s3;
            0 === I2[f3] ? patch(null, g4, r3, _4, a3, c3, p3, u3, d3) : N2 && (T3 < 0 || f3 !== P2[T3] ? move(g4, r3, _4, 2) : T3--);
          }
        }
      }, "patchKeyedChildren"), move = /* @__PURE__ */ __name((e3, t3, a3, c3, p3 = null) => {
        const { el: u3, type: d3, transition: f3, children: m3, shapeFlag: x3 } = e3;
        if (6 & x3)
          return void move(e3.component.subTree, t3, a3, c3);
        if (128 & x3)
          return void e3.suspense.move(t3, a3, c3);
        if (64 & x3)
          return void d3.move(e3, t3, a3, S2);
        if (d3 === fi) {
          r2(u3, t3, a3);
          for (let e4 = 0; e4 < m3.length; e4++)
            move(m3[e4], t3, a3, c3);
          return void r2(e3.anchor, t3, a3);
        }
        if (d3 === gi)
          return void (({ el: e4, anchor: t4 }, s3, a4) => {
            let c4;
            for (; e4 && e4 !== t4; )
              c4 = g2(e4), r2(e4, s3, a4), e4 = c4;
            r2(t4, s3, a4);
          })(e3, t3, a3);
        if (2 !== c3 && 1 & x3 && f3)
          if (0 === c3)
            f3.beforeEnter(u3), r2(u3, t3, a3), li(() => f3.enter(u3), p3);
          else {
            const { leave: c4, delayLeave: p4, afterLeave: d4 } = f3, remove22 = /* @__PURE__ */ __name(() => {
              e3.ctx.isUnmounted ? s2(u3) : r2(u3, t3, a3);
            }, "remove2"), performLeave = /* @__PURE__ */ __name(() => {
              c4(u3, () => {
                remove22(), d4 && d4();
              });
            }, "performLeave");
            p4 ? p4(u3, remove22, performLeave) : performLeave();
          }
        else
          r2(u3, t3, a3);
      }, "move"), unmount = /* @__PURE__ */ __name((e3, t3, r3, s3 = false, a3 = false) => {
        const { type: c3, props: p3, ref: u3, children: d3, dynamicChildren: f3, shapeFlag: m3, patchFlag: g3, dirs: x3, cacheIndex: _3 } = e3;
        if (-2 === g3 && (a3 = false), null != u3 && (pauseTracking(), setRef(u3, null, r3, e3, true), resetTracking()), null != _3 && (t3.renderCache[_3] = void 0), 256 & m3)
          return void t3.ctx.deactivate(e3);
        const E3 = 1 & m3 && x3, T3 = !isAsyncWrapper(e3);
        let C3;
        if (T3 && (C3 = p3 && p3.onVnodeBeforeUnmount) && invokeVNodeHook(C3, t3, e3), 6 & m3)
          unmountComponent(e3.component, r3, s3);
        else {
          if (128 & m3)
            return void e3.suspense.unmount(r3, s3);
          E3 && invokeDirectiveHook(e3, null, t3, "beforeUnmount"), 64 & m3 ? e3.type.remove(e3, t3, r3, S2, s3) : f3 && !f3.hasOnce && (c3 !== fi || g3 > 0 && 64 & g3) ? unmountChildren(f3, t3, r3, false, true) : (c3 === fi && 384 & g3 || !a3 && 16 & m3) && unmountChildren(d3, t3, r3), s3 && remove2(e3);
        }
        (T3 && (C3 = p3 && p3.onVnodeUnmounted) || E3) && li(() => {
          C3 && invokeVNodeHook(C3, t3, e3), E3 && invokeDirectiveHook(e3, null, t3, "unmounted");
        }, r3);
      }, "unmount"), remove2 = /* @__PURE__ */ __name((e3) => {
        const { type: t3, el: r3, anchor: a3, transition: c3 } = e3;
        if (t3 === fi)
          return void removeFragment(r3, a3);
        if (t3 === gi)
          return void (({ el: e4, anchor: t4 }) => {
            let r4;
            for (; e4 && e4 !== t4; )
              r4 = g2(e4), s2(e4), e4 = r4;
            s2(t4);
          })(e3);
        const performRemove = /* @__PURE__ */ __name(() => {
          s2(r3), c3 && !c3.persisted && c3.afterLeave && c3.afterLeave();
        }, "performRemove");
        if (1 & e3.shapeFlag && c3 && !c3.persisted) {
          const { leave: t4, delayLeave: s3 } = c3, performLeave = /* @__PURE__ */ __name(() => t4(r3, performRemove), "performLeave");
          s3 ? s3(e3.el, performRemove, performLeave) : performLeave();
        } else
          performRemove();
      }, "remove"), removeFragment = /* @__PURE__ */ __name((e3, t3) => {
        let r3;
        for (; e3 !== t3; )
          r3 = g2(e3), s2(e3), e3 = r3;
        s2(t3);
      }, "removeFragment"), unmountComponent = /* @__PURE__ */ __name((e3, t3, r3) => {
        const { bum: s3, scope: a3, job: c3, subTree: p3, um: u3, m: d3, a: f3, parent: m3, slots: { __: g3 } } = e3;
        invalidateMount(d3), invalidateMount(f3), s3 && invokeArrayFns(s3), m3 && jr(g3) && g3.forEach((e4) => {
          m3.renderCache[e4] = void 0;
        }), a3.stop(), c3 && (c3.flags |= 8, unmount(p3, e3, t3, r3)), u3 && li(u3, t3), li(() => {
          e3.isUnmounted = true;
        }, t3), t3 && t3.pendingBranch && !t3.isUnmounted && e3.asyncDep && !e3.asyncResolved && e3.suspenseId === t3.pendingId && (t3.deps--, 0 === t3.deps && t3.resolve());
      }, "unmountComponent"), unmountChildren = /* @__PURE__ */ __name((e3, t3, r3, s3 = false, a3 = false, c3 = 0) => {
        for (let p3 = c3; p3 < e3.length; p3++)
          unmount(e3[p3], t3, r3, s3, a3);
      }, "unmountChildren"), getNextHostNode = /* @__PURE__ */ __name((e3) => {
        if (6 & e3.shapeFlag)
          return getNextHostNode(e3.component.subTree);
        if (128 & e3.shapeFlag)
          return e3.suspense.next();
        const t3 = g2(e3.anchor || e3.el), r3 = t3 && t3[As];
        return r3 ? g2(r3) : t3;
      }, "getNextHostNode");
      let E2 = false;
      const render2 = /* @__PURE__ */ __name((e3, t3, r3) => {
        null == e3 ? t3._vnode && unmount(t3._vnode, null, null, true) : patch(t3._vnode || null, e3, t3, null, null, null, r3), t3._vnode = e3, E2 || (E2 = true, flushPreFlushCbs(), flushPostFlushCbs(), E2 = false);
      }, "render"), S2 = { p: patch, um: unmount, m: move, r: remove2, mt: mountComponent, mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, n: getNextHostNode, o: e2 };
      let T2, C2;
      return t2 && ([T2, C2] = t2(S2)), { render: render2, hydrate: T2, createApp: createAppAPI(render2, T2) };
    }
    __name(baseCreateRenderer, "baseCreateRenderer");
    function resolveChildrenNamespace({ type: e2, props: t2 }, r2) {
      return "svg" === r2 && "foreignObject" === e2 || "mathml" === r2 && "annotation-xml" === e2 && t2 && t2.encoding && t2.encoding.includes("html") ? void 0 : r2;
    }
    __name(resolveChildrenNamespace, "resolveChildrenNamespace");
    function toggleRecurse({ effect: e2, job: t2 }, r2) {
      r2 ? (e2.flags |= 32, t2.flags |= 4) : (e2.flags &= -33, t2.flags &= -5);
    }
    __name(toggleRecurse, "toggleRecurse");
    function needTransition(e2, t2) {
      return (!e2 || e2 && !e2.pendingBranch) && t2 && !t2.persisted;
    }
    __name(needTransition, "needTransition");
    function traverseStaticChildren(e2, t2, r2 = false) {
      const s2 = e2.children, a2 = t2.children;
      if (jr(s2) && jr(a2))
        for (let e3 = 0; e3 < s2.length; e3++) {
          const t3 = s2[e3];
          let c2 = a2[e3];
          1 & c2.shapeFlag && !c2.dynamicChildren && ((c2.patchFlag <= 0 || 32 === c2.patchFlag) && (c2 = a2[e3] = cloneIfMounted(a2[e3]), c2.el = t3.el), r2 || -2 === c2.patchFlag || traverseStaticChildren(t3, c2)), c2.type === hi && (c2.el = t3.el), c2.type !== mi || c2.el || (c2.el = t3.el);
        }
    }
    __name(traverseStaticChildren, "traverseStaticChildren");
    function locateNonHydratedAsyncRoot(e2) {
      const t2 = e2.subTree.component;
      if (t2)
        return t2.asyncDep && !t2.asyncResolved ? t2 : locateNonHydratedAsyncRoot(t2);
    }
    __name(locateNonHydratedAsyncRoot, "locateNonHydratedAsyncRoot");
    function invalidateMount(e2) {
      if (e2)
        for (let t2 = 0; t2 < e2.length; t2++)
          e2[t2].flags |= 8;
    }
    __name(invalidateMount, "invalidateMount");
    const pi = Symbol.for("v-scx"), useSSRContext = /* @__PURE__ */ __name(() => inject(pi), "useSSRContext");
    function watchEffect(e2, t2) {
      return doWatch(e2, null, t2);
    }
    __name(watchEffect, "watchEffect");
    function watchSyncEffect(e2, t2) {
      return doWatch(e2, null, { flush: "sync" });
    }
    __name(watchSyncEffect, "watchSyncEffect");
    function watch(e2, t2, r2) {
      return doWatch(e2, t2, r2);
    }
    __name(watch, "watch");
    function doWatch(e2, t2, r2 = Lr) {
      const { immediate: s2, deep: a2, flush: c2, once: p2 } = r2, u2 = $r({}, r2), d2 = t2 && s2 || !t2 && "post" !== c2;
      let f2;
      if (ki) {
        if ("sync" === c2) {
          const e3 = useSSRContext();
          f2 = e3.__watcherHandles || (e3.__watcherHandles = []);
        } else if (!d2) {
          const watchStopHandle = /* @__PURE__ */ __name(() => {
          }, "watchStopHandle");
          return watchStopHandle.stop = NOOP, watchStopHandle.resume = NOOP, watchStopHandle.pause = NOOP, watchStopHandle;
        }
      }
      const m2 = Ei;
      u2.call = (e3, t3, r3) => callWithAsyncErrorHandling(e3, m2, t3, r3);
      let g2 = false;
      "post" === c2 ? u2.scheduler = (e3) => {
        li(e3, m2 && m2.suspense);
      } : "sync" !== c2 && (g2 = true, u2.scheduler = (e3, t3) => {
        t3 ? e3() : queueJob(e3);
      }), u2.augmentJob = (e3) => {
        t2 && (e3.flags |= 4), g2 && (e3.flags |= 2, m2 && (e3.id = m2.uid, e3.i = m2));
      };
      const x2 = function(e3, t3, r3 = Lr) {
        const { immediate: s3, deep: a3, once: c3, scheduler: p3, augmentJob: u3, call: d3 } = r3, reactiveGetter = /* @__PURE__ */ __name((e4) => a3 ? e4 : isShallow(e4) || false === a3 || 0 === a3 ? traverse(e4, 1) : traverse(e4), "reactiveGetter");
        let f3, m3, g3, x3, _2 = false, E2 = false;
        if (isRef(e3) ? (m3 = /* @__PURE__ */ __name(() => e3.value, "m"), _2 = isShallow(e3)) : isReactive(e3) ? (m3 = /* @__PURE__ */ __name(() => reactiveGetter(e3), "m"), _2 = true) : jr(e3) ? (E2 = true, _2 = e3.some((e4) => isReactive(e4) || isShallow(e4)), m3 = /* @__PURE__ */ __name(() => e3.map((e4) => isRef(e4) ? e4.value : isReactive(e4) ? reactiveGetter(e4) : isFunction(e4) ? d3 ? d3(e4, 2) : e4() : void 0), "m")) : m3 = isFunction(e3) ? t3 ? d3 ? () => d3(e3, 2) : e3 : () => {
          if (g3) {
            pauseTracking();
            try {
              g3();
            } finally {
              resetTracking();
            }
          }
          const t4 = ms;
          ms = f3;
          try {
            return d3 ? d3(e3, 3, [x3]) : e3(x3);
          } finally {
            ms = t4;
          }
        } : NOOP, t3 && a3) {
          const e4 = m3, t4 = true === a3 ? 1 / 0 : a3;
          m3 = /* @__PURE__ */ __name(() => traverse(e4(), t4), "m");
        }
        const S2 = getCurrentScope(), watchHandle = /* @__PURE__ */ __name(() => {
          f3.stop(), S2 && S2.active && remove(S2.effects, f3);
        }, "watchHandle");
        if (c3 && t3) {
          const e4 = t3;
          t3 = /* @__PURE__ */ __name((...t4) => {
            e4(...t4), watchHandle();
          }, "t");
        }
        let T2 = E2 ? new Array(e3.length).fill(fs) : fs;
        const job = /* @__PURE__ */ __name((e4) => {
          if (1 & f3.flags && (f3.dirty || e4))
            if (t3) {
              const e5 = f3.run();
              if (a3 || _2 || (E2 ? e5.some((e6, t4) => hasChanged(e6, T2[t4])) : hasChanged(e5, T2))) {
                g3 && g3();
                const r4 = ms;
                ms = f3;
                try {
                  const r5 = [e5, T2 === fs ? void 0 : E2 && T2[0] === fs ? [] : T2, x3];
                  T2 = e5, d3 ? d3(t3, 3, r5) : t3(...r5);
                } finally {
                  ms = r4;
                }
              }
            } else
              f3.run();
        }, "job");
        return u3 && u3(job), f3 = new ReactiveEffect(m3), f3.scheduler = p3 ? () => p3(job, false) : job, x3 = /* @__PURE__ */ __name((e4) => onWatcherCleanup(e4, false, f3), "x"), g3 = f3.onStop = () => {
          const e4 = hs.get(f3);
          if (e4) {
            if (d3)
              d3(e4, 4);
            else
              for (const t4 of e4)
                t4();
            hs.delete(f3);
          }
        }, t3 ? s3 ? job(true) : T2 = f3.run() : p3 ? p3(job.bind(null, true), true) : f3.run(), watchHandle.pause = f3.pause.bind(f3), watchHandle.resume = f3.resume.bind(f3), watchHandle.stop = watchHandle, watchHandle;
      }(e2, t2, u2);
      return ki && (f2 ? f2.push(x2) : d2 && x2()), x2;
    }
    __name(doWatch, "doWatch");
    function instanceWatch(e2, t2, r2) {
      const s2 = this.proxy, a2 = isString(e2) ? e2.includes(".") ? createPathGetter(s2, e2) : () => s2[e2] : e2.bind(s2, s2);
      let c2;
      isFunction(t2) ? c2 = t2 : (c2 = t2.handler, r2 = t2);
      const p2 = setCurrentInstance(this), u2 = doWatch(a2, c2.bind(s2), r2);
      return p2(), u2;
    }
    __name(instanceWatch, "instanceWatch");
    function createPathGetter(e2, t2) {
      const r2 = t2.split(".");
      return () => {
        let t3 = e2;
        for (let e3 = 0; e3 < r2.length && t3; e3++)
          t3 = t3[r2[e3]];
        return t3;
      };
    }
    __name(createPathGetter, "createPathGetter");
    const getModelModifiers = /* @__PURE__ */ __name((e2, t2) => "modelValue" === t2 || "model-value" === t2 ? e2.modelModifiers : e2[`${t2}Modifiers`] || e2[`${Fr(t2)}Modifiers`] || e2[`${qr(t2)}Modifiers`], "getModelModifiers");
    function emit(e2, t2, ...r2) {
      if (e2.isUnmounted)
        return;
      const s2 = e2.vnode.props || Lr;
      let a2 = r2;
      const c2 = t2.startsWith("update:"), p2 = c2 && getModelModifiers(s2, t2.slice(7));
      let u2;
      p2 && (p2.trim && (a2 = r2.map((e3) => isString(e3) ? e3.trim() : e3)), p2.number && (a2 = r2.map(looseToNumber)));
      let d2 = s2[u2 = Kr(t2)] || s2[u2 = Kr(Fr(t2))];
      !d2 && c2 && (d2 = s2[u2 = Kr(qr(t2))]), d2 && callWithAsyncErrorHandling(d2, e2, 6, a2);
      const f2 = s2[u2 + "Once"];
      if (f2) {
        if (e2.emitted) {
          if (e2.emitted[u2])
            return;
        } else
          e2.emitted = {};
        e2.emitted[u2] = true, callWithAsyncErrorHandling(f2, e2, 6, a2);
      }
    }
    __name(emit, "emit");
    function normalizeEmitsOptions(e2, t2, r2 = false) {
      const s2 = t2.emitsCache, a2 = s2.get(e2);
      if (void 0 !== a2)
        return a2;
      const c2 = e2.emits;
      let p2 = {}, u2 = false;
      if (!isFunction(e2)) {
        const extendEmits = /* @__PURE__ */ __name((e3) => {
          const r3 = normalizeEmitsOptions(e3, t2, true);
          r3 && (u2 = true, $r(p2, r3));
        }, "extendEmits");
        !r2 && t2.mixins.length && t2.mixins.forEach(extendEmits), e2.extends && extendEmits(e2.extends), e2.mixins && e2.mixins.forEach(extendEmits);
      }
      return c2 || u2 ? (jr(c2) ? c2.forEach((e3) => p2[e3] = null) : $r(p2, c2), isObject(e2) && s2.set(e2, p2), p2) : (isObject(e2) && s2.set(e2, null), null);
    }
    __name(normalizeEmitsOptions, "normalizeEmitsOptions");
    function isEmitListener(e2, t2) {
      return !(!e2 || !isOn(t2)) && (t2 = t2.slice(2).replace(/Once$/, ""), hasOwn(e2, t2[0].toLowerCase() + t2.slice(1)) || hasOwn(e2, qr(t2)) || hasOwn(e2, t2));
    }
    __name(isEmitListener, "isEmitListener");
    function renderComponentRoot$1(e2) {
      const { type: t2, vnode: r2, proxy: s2, withProxy: a2, propsOptions: [c2], slots: p2, attrs: u2, emit: d2, render: f2, renderCache: m2, props: g2, data: x2, setupState: _2, ctx: E2, inheritAttrs: S2 } = e2, T2 = setCurrentRenderingInstance$1(e2);
      let C2, R2;
      try {
        if (4 & r2.shapeFlag) {
          const e3 = a2 || s2, t3 = e3;
          C2 = normalizeVNode$1(f2.call(t3, e3, m2, g2, _2, x2, E2)), R2 = u2;
        } else {
          const e3 = t2;
          0, C2 = normalizeVNode$1(e3.length > 1 ? e3(g2, { attrs: u2, slots: p2, emit: d2 }) : e3(g2, null)), R2 = t2.props ? u2 : getFunctionalFallthrough(u2);
        }
      } catch (t3) {
        vi.length = 0, handleError(t3, e2, 1), C2 = createVNode(mi);
      }
      let N2 = C2;
      if (R2 && false !== S2) {
        const e3 = Object.keys(R2), { shapeFlag: t3 } = N2;
        e3.length && 7 & t3 && (c2 && e3.some(isModelListener) && (R2 = filterModelListeners(R2, c2)), N2 = cloneVNode(N2, R2, false, true));
      }
      return r2.dirs && (N2 = cloneVNode(N2, null, false, true), N2.dirs = N2.dirs ? N2.dirs.concat(r2.dirs) : r2.dirs), r2.transition && setTransitionHooks(N2, r2.transition), C2 = N2, setCurrentRenderingInstance$1(T2), C2;
    }
    __name(renderComponentRoot$1, "renderComponentRoot$1");
    const getFunctionalFallthrough = /* @__PURE__ */ __name((e2) => {
      let t2;
      for (const r2 in e2)
        ("class" === r2 || "style" === r2 || isOn(r2)) && ((t2 || (t2 = {}))[r2] = e2[r2]);
      return t2;
    }, "getFunctionalFallthrough"), filterModelListeners = /* @__PURE__ */ __name((e2, t2) => {
      const r2 = {};
      for (const s2 in e2)
        isModelListener(s2) && s2.slice(9) in t2 || (r2[s2] = e2[s2]);
      return r2;
    }, "filterModelListeners");
    function hasPropsChanged(e2, t2, r2) {
      const s2 = Object.keys(t2);
      if (s2.length !== Object.keys(e2).length)
        return true;
      for (let a2 = 0; a2 < s2.length; a2++) {
        const c2 = s2[a2];
        if (t2[c2] !== e2[c2] && !isEmitListener(r2, c2))
          return true;
      }
      return false;
    }
    __name(hasPropsChanged, "hasPropsChanged");
    function updateHOCHostEl({ vnode: e2, parent: t2 }, r2) {
      for (; t2; ) {
        const s2 = t2.subTree;
        if (s2.suspense && s2.suspense.activeBranch === e2 && (s2.el = e2.el), s2 !== e2)
          break;
        (e2 = t2.vnode).el = r2, t2 = t2.parent;
      }
    }
    __name(updateHOCHostEl, "updateHOCHostEl");
    const isSuspense = /* @__PURE__ */ __name((e2) => e2.__isSuspense, "isSuspense");
    let ui = 0;
    const di = { name: "Suspense", __isSuspense: true, process(e2, t2, r2, s2, a2, c2, p2, u2, d2, f2) {
      if (null == e2)
        !function(e3, t3, r3, s3, a3, c3, p3, u3, d3) {
          const { p: f3, o: { createElement: m2 } } = d3, g2 = m2("div"), x2 = e3.suspense = createSuspenseBoundary(e3, a3, s3, t3, g2, r3, c3, p3, u3, d3);
          f3(null, x2.pendingBranch = e3.ssContent, g2, null, s3, x2, c3, p3), x2.deps > 0 ? (triggerEvent(e3, "onPending"), triggerEvent(e3, "onFallback"), f3(null, e3.ssFallback, t3, r3, s3, null, c3, p3), setActiveBranch(x2, e3.ssFallback)) : x2.resolve(false, true);
        }(t2, r2, s2, a2, c2, p2, u2, d2, f2);
      else {
        if (c2 && c2.deps > 0 && !e2.suspense.isInFallback)
          return t2.suspense = e2.suspense, t2.suspense.vnode = t2, void (t2.el = e2.el);
        !function(e3, t3, r3, s3, a3, c3, p3, u3, { p: d3, um: f3, o: { createElement: m2 } }) {
          const g2 = t3.suspense = e3.suspense;
          g2.vnode = t3, t3.el = e3.el;
          const x2 = t3.ssContent, _2 = t3.ssFallback, { activeBranch: E2, pendingBranch: S2, isInFallback: T2, isHydrating: C2 } = g2;
          if (S2)
            g2.pendingBranch = x2, isSameVNodeType(x2, S2) ? (d3(S2, x2, g2.hiddenContainer, null, a3, g2, c3, p3, u3), g2.deps <= 0 ? g2.resolve() : T2 && (C2 || (d3(E2, _2, r3, s3, a3, null, c3, p3, u3), setActiveBranch(g2, _2)))) : (g2.pendingId = ui++, C2 ? (g2.isHydrating = false, g2.activeBranch = S2) : f3(S2, a3, g2), g2.deps = 0, g2.effects.length = 0, g2.hiddenContainer = m2("div"), T2 ? (d3(null, x2, g2.hiddenContainer, null, a3, g2, c3, p3, u3), g2.deps <= 0 ? g2.resolve() : (d3(E2, _2, r3, s3, a3, null, c3, p3, u3), setActiveBranch(g2, _2))) : E2 && isSameVNodeType(x2, E2) ? (d3(E2, x2, r3, s3, a3, g2, c3, p3, u3), g2.resolve(true)) : (d3(null, x2, g2.hiddenContainer, null, a3, g2, c3, p3, u3), g2.deps <= 0 && g2.resolve()));
          else if (E2 && isSameVNodeType(x2, E2))
            d3(E2, x2, r3, s3, a3, g2, c3, p3, u3), setActiveBranch(g2, x2);
          else if (triggerEvent(t3, "onPending"), g2.pendingBranch = x2, 512 & x2.shapeFlag ? g2.pendingId = x2.component.suspenseId : g2.pendingId = ui++, d3(null, x2, g2.hiddenContainer, null, a3, g2, c3, p3, u3), g2.deps <= 0)
            g2.resolve();
          else {
            const { timeout: e4, pendingId: t4 } = g2;
            e4 > 0 ? setTimeout(() => {
              g2.pendingId === t4 && g2.fallback(_2);
            }, e4) : 0 === e4 && g2.fallback(_2);
          }
        }(e2, t2, r2, s2, a2, p2, u2, d2, f2);
      }
    }, hydrate: function(e2, t2, r2, s2, a2, c2, p2, u2, d2) {
      const f2 = t2.suspense = createSuspenseBoundary(t2, s2, r2, e2.parentNode, document.createElement("div"), null, a2, c2, p2, u2, true), m2 = d2(e2, f2.pendingBranch = t2.ssContent, r2, f2, c2, p2);
      0 === f2.deps && f2.resolve(false, true);
      return m2;
    }, normalize: function(e2) {
      const { shapeFlag: t2, children: r2 } = e2, s2 = 32 & t2;
      e2.ssContent = normalizeSuspenseSlot(s2 ? r2.default : r2), e2.ssFallback = s2 ? normalizeSuspenseSlot(r2.fallback) : createVNode(mi);
    } };
    function triggerEvent(e2, t2) {
      const r2 = e2.props && e2.props[t2];
      isFunction(r2) && r2();
    }
    __name(triggerEvent, "triggerEvent");
    function createSuspenseBoundary(e2, t2, r2, s2, a2, c2, p2, u2, d2, f2, m2 = false) {
      const { p: g2, m: x2, um: _2, n: E2, o: { parentNode: S2, remove: T2 } } = f2;
      let C2;
      const R2 = function(e3) {
        const t3 = e3.props && e3.props.suspensible;
        return null != t3 && false !== t3;
      }(e2);
      R2 && t2 && t2.pendingBranch && (C2 = t2.pendingId, t2.deps++);
      const N2 = e2.props ? toNumber(e2.props.timeout) : void 0, O2 = c2, I2 = { vnode: e2, parent: t2, parentComponent: r2, namespace: p2, container: s2, hiddenContainer: a2, deps: 0, pendingId: ui++, timeout: "number" == typeof N2 ? N2 : -1, activeBranch: null, pendingBranch: null, isInFallback: !m2, isHydrating: m2, isUnmounted: false, effects: [], resolve(e3 = false, r3 = false) {
        const { vnode: s3, activeBranch: a3, pendingBranch: p3, pendingId: u3, effects: d3, parentComponent: f3, container: m3 } = I2;
        let g3 = false;
        I2.isHydrating ? I2.isHydrating = false : e3 || (g3 = a3 && p3.transition && "out-in" === p3.transition.mode, g3 && (a3.transition.afterLeave = () => {
          u3 === I2.pendingId && (x2(p3, m3, c2 === O2 ? E2(a3) : c2, 0), queuePostFlushCb(d3));
        }), a3 && (S2(a3.el) === m3 && (c2 = E2(a3)), _2(a3, f3, I2, true)), g3 || x2(p3, m3, c2, 0)), setActiveBranch(I2, p3), I2.pendingBranch = null, I2.isInFallback = false;
        let T3 = I2.parent, N3 = false;
        for (; T3; ) {
          if (T3.pendingBranch) {
            T3.effects.push(...d3), N3 = true;
            break;
          }
          T3 = T3.parent;
        }
        N3 || g3 || queuePostFlushCb(d3), I2.effects = [], R2 && t2 && t2.pendingBranch && C2 === t2.pendingId && (t2.deps--, 0 !== t2.deps || r3 || t2.resolve()), triggerEvent(s3, "onResolve");
      }, fallback(e3) {
        if (!I2.pendingBranch)
          return;
        const { vnode: t3, activeBranch: r3, parentComponent: s3, container: a3, namespace: c3 } = I2;
        triggerEvent(t3, "onFallback");
        const p3 = E2(r3), mountFallback = /* @__PURE__ */ __name(() => {
          I2.isInFallback && (g2(null, e3, a3, p3, s3, null, c3, u2, d2), setActiveBranch(I2, e3));
        }, "mountFallback"), f3 = e3.transition && "out-in" === e3.transition.mode;
        f3 && (r3.transition.afterLeave = mountFallback), I2.isInFallback = true, _2(r3, s3, null, true), f3 || mountFallback();
      }, move(e3, t3, r3) {
        I2.activeBranch && x2(I2.activeBranch, e3, t3, r3), I2.container = e3;
      }, next: () => I2.activeBranch && E2(I2.activeBranch), registerDep(e3, t3, r3) {
        const s3 = !!I2.pendingBranch;
        s3 && I2.deps++;
        const a3 = e3.vnode.el;
        e3.asyncDep.catch((t4) => {
          handleError(t4, e3, 0);
        }).then((c3) => {
          if (e3.isUnmounted || I2.isUnmounted || I2.pendingId !== e3.suspenseId)
            return;
          e3.asyncResolved = true;
          const { vnode: u3 } = e3;
          handleSetupResult(e3, c3, false), a3 && (u3.el = a3);
          const d3 = !a3 && e3.subTree.el;
          t3(e3, u3, S2(a3 || e3.subTree.el), a3 ? null : E2(e3.subTree), I2, p2, r3), d3 && T2(d3), updateHOCHostEl(e3, u3.el), s3 && 0 === --I2.deps && I2.resolve();
        });
      }, unmount(e3, t3) {
        I2.isUnmounted = true, I2.activeBranch && _2(I2.activeBranch, r2, e3, t3), I2.pendingBranch && _2(I2.pendingBranch, r2, e3, t3);
      } };
      return I2;
    }
    __name(createSuspenseBoundary, "createSuspenseBoundary");
    function normalizeSuspenseSlot(e2) {
      let t2;
      if (isFunction(e2)) {
        const r2 = bi && e2._c;
        r2 && (e2._d = false, openBlock()), e2 = e2(), r2 && (e2._d = true, t2 = yi, closeBlock());
      }
      if (jr(e2)) {
        const t3 = function(e3) {
          let t4;
          for (let r2 = 0; r2 < e3.length; r2++) {
            const s2 = e3[r2];
            if (!isVNode$2(s2))
              return;
            if (s2.type !== mi || "v-if" === s2.children) {
              if (t4)
                return;
              t4 = s2;
            }
          }
          return t4;
        }(e2);
        e2 = t3;
      }
      return e2 = normalizeVNode$1(e2), t2 && !e2.dynamicChildren && (e2.dynamicChildren = t2.filter((t3) => t3 !== e2)), e2;
    }
    __name(normalizeSuspenseSlot, "normalizeSuspenseSlot");
    function queueEffectWithSuspense(e2, t2) {
      t2 && t2.pendingBranch ? jr(e2) ? t2.effects.push(...e2) : t2.effects.push(e2) : queuePostFlushCb(e2);
    }
    __name(queueEffectWithSuspense, "queueEffectWithSuspense");
    function setActiveBranch(e2, t2) {
      e2.activeBranch = t2;
      const { vnode: r2, parentComponent: s2 } = e2;
      let a2 = t2.el;
      for (; !a2 && t2.component; )
        a2 = (t2 = t2.component.subTree).el;
      r2.el = a2, s2 && s2.subTree === r2 && (s2.vnode.el = a2, updateHOCHostEl(s2, a2));
    }
    __name(setActiveBranch, "setActiveBranch");
    const fi = Symbol.for("v-fgt"), hi = Symbol.for("v-txt"), mi = Symbol.for("v-cmt"), gi = Symbol.for("v-stc"), vi = [];
    let yi = null;
    function openBlock(e2 = false) {
      vi.push(yi = e2 ? null : []);
    }
    __name(openBlock, "openBlock");
    function closeBlock() {
      vi.pop(), yi = vi[vi.length - 1] || null;
    }
    __name(closeBlock, "closeBlock");
    let bi = 1;
    function setBlockTracking(e2, t2 = false) {
      bi += e2, e2 < 0 && yi && t2 && (yi.hasOnce = true);
    }
    __name(setBlockTracking, "setBlockTracking");
    function setupBlock(e2) {
      return e2.dynamicChildren = bi > 0 ? yi || Mr : null, closeBlock(), bi > 0 && yi && yi.push(e2), e2;
    }
    __name(setupBlock, "setupBlock");
    function createBlock(e2, t2, r2, s2, a2) {
      return setupBlock(createVNode(e2, t2, r2, s2, a2, true));
    }
    __name(createBlock, "createBlock");
    function isVNode$2(e2) {
      return !!e2 && true === e2.__v_isVNode;
    }
    __name(isVNode$2, "isVNode$2");
    function isSameVNodeType(e2, t2) {
      return e2.type === t2.type && e2.key === t2.key;
    }
    __name(isSameVNodeType, "isSameVNodeType");
    const normalizeKey = /* @__PURE__ */ __name(({ key: e2 }) => null != e2 ? e2 : null, "normalizeKey"), normalizeRef = /* @__PURE__ */ __name(({ ref: e2, ref_key: t2, ref_for: r2 }) => ("number" == typeof e2 && (e2 = "" + e2), null != e2 ? isString(e2) || isRef(e2) || isFunction(e2) ? { i: ks, r: e2, k: t2, f: !!r2 } : e2 : null), "normalizeRef");
    function createBaseVNode(e2, t2 = null, r2 = null, s2 = 0, a2 = null, c2 = e2 === fi ? 0 : 1, p2 = false, u2 = false) {
      const d2 = { __v_isVNode: true, __v_skip: true, type: e2, props: t2, key: t2 && normalizeKey(t2), ref: t2 && normalizeRef(t2), scopeId: Rs, slotScopeIds: null, children: r2, component: null, suspense: null, ssContent: null, ssFallback: null, dirs: null, transition: null, el: null, anchor: null, target: null, targetStart: null, targetAnchor: null, staticCount: 0, shapeFlag: c2, patchFlag: s2, dynamicProps: a2, dynamicChildren: null, appContext: null, ctx: ks };
      return u2 ? (normalizeChildren(d2, r2), 128 & c2 && e2.normalize(d2)) : r2 && (d2.shapeFlag |= isString(r2) ? 8 : 16), bi > 0 && !p2 && yi && (d2.patchFlag > 0 || 6 & c2) && 32 !== d2.patchFlag && yi.push(d2), d2;
    }
    __name(createBaseVNode, "createBaseVNode");
    const createVNode = /* @__PURE__ */ __name(function(e2, t2 = null, r2 = null, s2 = 0, a2 = null, c2 = false) {
      e2 && e2 !== Zs || (e2 = mi);
      if (isVNode$2(e2)) {
        const s3 = cloneVNode(e2, t2, true);
        return r2 && normalizeChildren(s3, r2), bi > 0 && !c2 && yi && (6 & s3.shapeFlag ? yi[yi.indexOf(e2)] = s3 : yi.push(s3)), s3.patchFlag = -2, s3;
      }
      p2 = e2, isFunction(p2) && "__vccOpts" in p2 && (e2 = e2.__vccOpts);
      var p2;
      if (t2) {
        t2 = guardReactiveProps(t2);
        let { class: e3, style: r3 } = t2;
        e3 && !isString(e3) && (t2.class = normalizeClass(e3)), isObject(r3) && (isProxy(r3) && !jr(r3) && (r3 = $r({}, r3)), t2.style = normalizeStyle(r3));
      }
      const u2 = isString(e2) ? 1 : isSuspense(e2) ? 128 : isTeleport(e2) ? 64 : isObject(e2) ? 4 : isFunction(e2) ? 2 : 0;
      return createBaseVNode(e2, t2, r2, s2, a2, u2, c2, true);
    }, "createVNode");
    function guardReactiveProps(e2) {
      return e2 ? isProxy(e2) || isInternalObject(e2) ? $r({}, e2) : e2 : null;
    }
    __name(guardReactiveProps, "guardReactiveProps");
    function cloneVNode(e2, t2, r2 = false, s2 = false) {
      const { props: a2, ref: c2, patchFlag: p2, children: u2, transition: d2 } = e2, f2 = t2 ? mergeProps(a2 || {}, t2) : a2, m2 = { __v_isVNode: true, __v_skip: true, type: e2.type, props: f2, key: f2 && normalizeKey(f2), ref: t2 && t2.ref ? r2 && c2 ? jr(c2) ? c2.concat(normalizeRef(t2)) : [c2, normalizeRef(t2)] : normalizeRef(t2) : c2, scopeId: e2.scopeId, slotScopeIds: e2.slotScopeIds, children: u2, target: e2.target, targetStart: e2.targetStart, targetAnchor: e2.targetAnchor, staticCount: e2.staticCount, shapeFlag: e2.shapeFlag, patchFlag: t2 && e2.type !== fi ? -1 === p2 ? 16 : 16 | p2 : p2, dynamicProps: e2.dynamicProps, dynamicChildren: e2.dynamicChildren, appContext: e2.appContext, dirs: e2.dirs, transition: d2, component: e2.component, suspense: e2.suspense, ssContent: e2.ssContent && cloneVNode(e2.ssContent), ssFallback: e2.ssFallback && cloneVNode(e2.ssFallback), placeholder: e2.placeholder, el: e2.el, anchor: e2.anchor, ctx: e2.ctx, ce: e2.ce };
      return d2 && s2 && setTransitionHooks(m2, d2.clone(m2)), m2;
    }
    __name(cloneVNode, "cloneVNode");
    function createTextVNode(e2 = " ", t2 = 0) {
      return createVNode(hi, null, e2, t2);
    }
    __name(createTextVNode, "createTextVNode");
    function normalizeVNode$1(e2) {
      return null == e2 || "boolean" == typeof e2 ? createVNode(mi) : jr(e2) ? createVNode(fi, null, e2.slice()) : isVNode$2(e2) ? cloneIfMounted(e2) : createVNode(hi, null, String(e2));
    }
    __name(normalizeVNode$1, "normalizeVNode$1");
    function cloneIfMounted(e2) {
      return null === e2.el && -1 !== e2.patchFlag || e2.memo ? e2 : cloneVNode(e2);
    }
    __name(cloneIfMounted, "cloneIfMounted");
    function normalizeChildren(e2, t2) {
      let r2 = 0;
      const { shapeFlag: s2 } = e2;
      if (null == t2)
        t2 = null;
      else if (jr(t2))
        r2 = 16;
      else if ("object" == typeof t2) {
        if (65 & s2) {
          const r3 = t2.default;
          return void (r3 && (r3._c && (r3._d = false), normalizeChildren(e2, r3()), r3._c && (r3._d = true)));
        }
        {
          r2 = 32;
          const s3 = t2._;
          s3 || isInternalObject(t2) ? 3 === s3 && ks && (1 === ks.slots._ ? t2._ = 1 : (t2._ = 2, e2.patchFlag |= 1024)) : t2._ctx = ks;
        }
      } else
        isFunction(t2) ? (t2 = { default: t2, _ctx: ks }, r2 = 32) : (t2 = String(t2), 64 & s2 ? (r2 = 16, t2 = [createTextVNode(t2)]) : r2 = 8);
      e2.children = t2, e2.shapeFlag |= r2;
    }
    __name(normalizeChildren, "normalizeChildren");
    function mergeProps(...e2) {
      const t2 = {};
      for (let r2 = 0; r2 < e2.length; r2++) {
        const s2 = e2[r2];
        for (const e3 in s2)
          if ("class" === e3)
            t2.class !== s2.class && (t2.class = normalizeClass([t2.class, s2.class]));
          else if ("style" === e3)
            t2.style = normalizeStyle([t2.style, s2.style]);
          else if (isOn(e3)) {
            const r3 = t2[e3], a2 = s2[e3];
            !a2 || r3 === a2 || jr(r3) && r3.includes(a2) || (t2[e3] = r3 ? [].concat(r3, a2) : a2);
          } else
            "" !== e3 && (t2[e3] = s2[e3]);
      }
      return t2;
    }
    __name(mergeProps, "mergeProps");
    function invokeVNodeHook(e2, t2, r2, s2 = null) {
      callWithAsyncErrorHandling(e2, t2, 7, [r2, s2]);
    }
    __name(invokeVNodeHook, "invokeVNodeHook");
    const xi = createAppContext();
    let _i = 0;
    function createComponentInstance$1(e2, t2, r2) {
      const s2 = e2.type, a2 = (t2 ? t2.appContext : e2.appContext) || xi, c2 = { uid: _i++, vnode: e2, type: s2, parent: t2, appContext: a2, root: null, next: null, subTree: null, effect: null, update: null, job: null, scope: new EffectScope(true), render: null, proxy: null, exposed: null, exposeProxy: null, withProxy: null, provides: t2 ? t2.provides : Object.create(a2.provides), ids: t2 ? t2.ids : ["", 0, 0], accessCache: null, renderCache: [], components: null, directives: null, propsOptions: normalizePropsOptions(s2, a2), emitsOptions: normalizeEmitsOptions(s2, a2), emit: null, emitted: null, propsDefaults: Lr, inheritAttrs: s2.inheritAttrs, ctx: Lr, data: Lr, props: Lr, attrs: Lr, slots: Lr, refs: Lr, setupState: Lr, setupContext: null, suspense: r2, suspenseId: r2 ? r2.pendingId : 0, asyncDep: null, asyncResolved: false, isMounted: false, isUnmounted: false, isDeactivated: false, bc: null, c: null, bm: null, m: null, bu: null, u: null, um: null, bum: null, da: null, a: null, rtg: null, rtc: null, ec: null, sp: null };
      return c2.ctx = { _: c2 }, c2.root = t2 ? t2.root : c2, c2.emit = emit.bind(null, c2), e2.ce && e2.ce(c2), c2;
    }
    __name(createComponentInstance$1, "createComponentInstance$1");
    let Ei = null;
    const getCurrentInstance = /* @__PURE__ */ __name(() => Ei || ks, "getCurrentInstance");
    let wi, Si;
    {
      const e2 = getGlobalThis(), registerGlobalSetter = /* @__PURE__ */ __name((t2, r2) => {
        let s2;
        return (s2 = e2[t2]) || (s2 = e2[t2] = []), s2.push(r2), (e3) => {
          s2.length > 1 ? s2.forEach((t3) => t3(e3)) : s2[0](e3);
        };
      }, "registerGlobalSetter");
      wi = registerGlobalSetter("__VUE_INSTANCE_SETTERS__", (e3) => Ei = e3), Si = registerGlobalSetter("__VUE_SSR_SETTERS__", (e3) => ki = e3);
    }
    const setCurrentInstance = /* @__PURE__ */ __name((e2) => {
      const t2 = Ei;
      return wi(e2), e2.scope.on(), () => {
        e2.scope.off(), wi(t2);
      };
    }, "setCurrentInstance"), unsetCurrentInstance = /* @__PURE__ */ __name(() => {
      Ei && Ei.scope.off(), wi(null);
    }, "unsetCurrentInstance");
    function isStatefulComponent(e2) {
      return 4 & e2.vnode.shapeFlag;
    }
    __name(isStatefulComponent, "isStatefulComponent");
    let Ti, Ci, ki = false;
    function setupComponent$1(e2, t2 = false, r2 = false) {
      t2 && Si(t2);
      const { props: s2, children: a2 } = e2.vnode, c2 = isStatefulComponent(e2);
      !function(e3, t3, r3, s3 = false) {
        const a3 = {}, c3 = createInternalObject();
        e3.propsDefaults = /* @__PURE__ */ Object.create(null), setFullProps(e3, t3, a3, c3);
        for (const t4 in e3.propsOptions[0])
          t4 in a3 || (a3[t4] = void 0);
        r3 ? e3.props = s3 ? a3 : shallowReactive(a3) : e3.type.props ? e3.props = a3 : e3.props = c3, e3.attrs = c3;
      }(e2, s2, c2, t2), ((e3, t3, r3) => {
        const s3 = e3.slots = createInternalObject();
        if (32 & e3.vnode.shapeFlag) {
          const e4 = t3.__;
          e4 && def(s3, "__", e4, true);
          const a3 = t3._;
          a3 ? (assignSlots(s3, t3, r3), r3 && def(s3, "_", a3, true)) : normalizeObjectSlots(t3, s3);
        } else
          t3 && normalizeVNodeSlots(e3, t3);
      })(e2, a2, r2 || t2);
      const p2 = c2 ? function(e3, t3) {
        const r3 = e3.type;
        e3.accessCache = /* @__PURE__ */ Object.create(null), e3.proxy = new Proxy(e3.ctx, ti);
        const { setup: s3 } = r3;
        if (s3) {
          pauseTracking();
          const r4 = e3.setupContext = s3.length > 1 ? createSetupContext(e3) : null, a3 = setCurrentInstance(e3), c3 = callWithErrorHandling(s3, e3, 0, [e3.props, r4]), p3 = isPromise(c3);
          if (resetTracking(), a3(), !p3 && !e3.sp || isAsyncWrapper(e3) || markAsyncBoundary(e3), p3) {
            if (c3.then(unsetCurrentInstance, unsetCurrentInstance), t3)
              return c3.then((r5) => {
                handleSetupResult(e3, r5, t3);
              }).catch((t4) => {
                handleError(t4, e3, 0);
              });
            e3.asyncDep = c3;
          } else
            handleSetupResult(e3, c3, t3);
        } else
          finishComponentSetup(e3, t3);
      }(e2, t2) : void 0;
      return t2 && Si(false), p2;
    }
    __name(setupComponent$1, "setupComponent$1");
    function handleSetupResult(e2, t2, r2) {
      isFunction(t2) ? e2.type.__ssrInlineRender ? e2.ssrRender = t2 : e2.render = t2 : isObject(t2) && (e2.setupState = proxyRefs(t2)), finishComponentSetup(e2, r2);
    }
    __name(handleSetupResult, "handleSetupResult");
    function finishComponentSetup(e2, t2, r2) {
      const s2 = e2.type;
      if (!e2.render) {
        if (!t2 && Ti && !s2.render) {
          const t3 = s2.template || resolveMergedOptions(e2).template;
          if (t3) {
            const { isCustomElement: r3, compilerOptions: a2 } = e2.appContext.config, { delimiters: c2, compilerOptions: p2 } = s2, u2 = $r($r({ isCustomElement: r3, delimiters: c2 }, a2), p2);
            s2.render = Ti(t3, u2);
          }
        }
        e2.render = s2.render || NOOP, Ci && Ci(e2);
      }
      {
        const t3 = setCurrentInstance(e2);
        pauseTracking();
        try {
          applyOptions(e2);
        } finally {
          resetTracking(), t3();
        }
      }
    }
    __name(finishComponentSetup, "finishComponentSetup");
    const Ri = { get: (e2, t2) => (track(e2, 0, ""), e2[t2]) };
    function createSetupContext(e2) {
      const expose = /* @__PURE__ */ __name((t2) => {
        e2.exposed = t2 || {};
      }, "expose");
      return { attrs: new Proxy(e2.attrs, Ri), slots: e2.slots, emit: e2.emit, expose };
    }
    __name(createSetupContext, "createSetupContext");
    function getComponentPublicInstance(e2) {
      return e2.exposed ? e2.exposeProxy || (e2.exposeProxy = new Proxy(proxyRefs(markRaw(e2.exposed)), { get: (t2, r2) => r2 in t2 ? t2[r2] : r2 in ei ? ei[r2](e2) : void 0, has: (e3, t2) => t2 in e3 || t2 in ei })) : e2.proxy;
    }
    __name(getComponentPublicInstance, "getComponentPublicInstance");
    function getComponentName(e2, t2 = true) {
      return isFunction(e2) ? e2.displayName || e2.name : e2.name || t2 && e2.__name;
    }
    __name(getComponentName, "getComponentName");
    const computed = /* @__PURE__ */ __name((e2, t2) => {
      const r2 = function(e3, t3, r3 = false) {
        let s2, a2;
        return isFunction(e3) ? s2 = e3 : (s2 = e3.get, a2 = e3.set), new ComputedRefImpl(s2, a2, r3);
      }(e2, 0, ki);
      return r2;
    }, "computed");
    function h(e2, t2, r2) {
      const s2 = arguments.length;
      return 2 === s2 ? isObject(t2) && !jr(t2) ? isVNode$2(t2) ? createVNode(e2, null, [t2]) : createVNode(e2, t2) : createVNode(e2, null, t2) : (s2 > 3 ? r2 = Array.prototype.slice.call(arguments, 2) : 3 === s2 && isVNode$2(r2) && (r2 = [r2]), createVNode(e2, t2, r2));
    }
    __name(h, "h");
    function isMemoSame(e2, t2) {
      const r2 = e2.memo;
      if (r2.length != t2.length)
        return false;
      for (let e3 = 0; e3 < r2.length; e3++)
        if (hasChanged(r2[e3], t2[e3]))
          return false;
      return bi > 0 && yi && yi.push(e2), true;
    }
    __name(isMemoSame, "isMemoSame");
    const Ai = "3.5.18", Ni = NOOP, Oi = vs, Ii = Ts, setDevtoolsHook = /* @__PURE__ */ __name(function(e2, t2) {
      Ts = e2, Ts ? (Ts.enabled = true, Cs.forEach(({ event: e3, args: t3 }) => Ts.emit(e3, ...t3)), Cs = []) : Cs = [];
    }, "setDevtoolsHook"), Pi = { createComponentInstance: createComponentInstance$1, setupComponent: setupComponent$1, renderComponentRoot: renderComponentRoot$1, setCurrentRenderingInstance: setCurrentRenderingInstance$1, isVNode: isVNode$2, normalizeVNode: normalizeVNode$1, getComponentPublicInstance, ensureValidVNode: ensureValidVNode$1, pushWarningContext: function(e2) {
      gs.push(e2);
    }, popWarningContext: function() {
      gs.pop();
    } }, Li = "undefined" != typeof document ? document : null, Mi = Li && Li.createElement("template"), $i = { insert: (e2, t2, r2) => {
      t2.insertBefore(e2, r2 || null);
    }, remove: (e2) => {
      const t2 = e2.parentNode;
      t2 && t2.removeChild(e2);
    }, createElement: (e2, t2, r2, s2) => {
      const a2 = "svg" === t2 ? Li.createElementNS("http://www.w3.org/2000/svg", e2) : "mathml" === t2 ? Li.createElementNS("http://www.w3.org/1998/Math/MathML", e2) : r2 ? Li.createElement(e2, { is: r2 }) : Li.createElement(e2);
      return "select" === e2 && s2 && null != s2.multiple && a2.setAttribute("multiple", s2.multiple), a2;
    }, createText: (e2) => Li.createTextNode(e2), createComment: (e2) => Li.createComment(e2), setText: (e2, t2) => {
      e2.nodeValue = t2;
    }, setElementText: (e2, t2) => {
      e2.textContent = t2;
    }, parentNode: (e2) => e2.parentNode, nextSibling: (e2) => e2.nextSibling, querySelector: (e2) => Li.querySelector(e2), setScopeId(e2, t2) {
      e2.setAttribute(t2, "");
    }, insertStaticContent(e2, t2, r2, s2, a2, c2) {
      const p2 = r2 ? r2.previousSibling : t2.lastChild;
      if (a2 && (a2 === c2 || a2.nextSibling))
        for (; t2.insertBefore(a2.cloneNode(true), r2), a2 !== c2 && (a2 = a2.nextSibling); )
          ;
      else {
        Mi.innerHTML = "svg" === s2 ? `<svg>${e2}</svg>` : "mathml" === s2 ? `<math>${e2}</math>` : e2;
        const a3 = Mi.content;
        if ("svg" === s2 || "mathml" === s2) {
          const e3 = a3.firstChild;
          for (; e3.firstChild; )
            a3.appendChild(e3.firstChild);
          a3.removeChild(e3);
        }
        t2.insertBefore(a3, r2);
      }
      return [p2 ? p2.nextSibling : t2.firstChild, r2 ? r2.previousSibling : t2.lastChild];
    } }, Bi = "transition", ji = "animation", Di = Symbol("_vtc"), Hi = { name: String, type: String, css: { type: Boolean, default: true }, duration: [String, Number, Object], enterFromClass: String, enterActiveClass: String, enterToClass: String, appearFromClass: String, appearActiveClass: String, appearToClass: String, leaveFromClass: String, leaveActiveClass: String, leaveToClass: String }, Ui = $r({}, Ms, Hi), Vi = ((e2) => (e2.displayName = "Transition", e2.props = Ui, e2))((e2, { slots: t2 }) => h($s, resolveTransitionProps(e2), t2)), callHook = /* @__PURE__ */ __name((e2, t2 = []) => {
      jr(e2) ? e2.forEach((e3) => e3(...t2)) : e2 && e2(...t2);
    }, "callHook"), hasExplicitCallback = /* @__PURE__ */ __name((e2) => !!e2 && (jr(e2) ? e2.some((e3) => e3.length > 1) : e2.length > 1), "hasExplicitCallback");
    function resolveTransitionProps(e2) {
      const t2 = {};
      for (const r3 in e2)
        r3 in Hi || (t2[r3] = e2[r3]);
      if (false === e2.css)
        return t2;
      const { name: r2 = "v", type: s2, duration: a2, enterFromClass: c2 = `${r2}-enter-from`, enterActiveClass: p2 = `${r2}-enter-active`, enterToClass: u2 = `${r2}-enter-to`, appearFromClass: d2 = c2, appearActiveClass: f2 = p2, appearToClass: m2 = u2, leaveFromClass: g2 = `${r2}-leave-from`, leaveActiveClass: x2 = `${r2}-leave-active`, leaveToClass: _2 = `${r2}-leave-to` } = e2, E2 = function(e3) {
        if (null == e3)
          return null;
        if (isObject(e3))
          return [NumberOf(e3.enter), NumberOf(e3.leave)];
        {
          const t3 = NumberOf(e3);
          return [t3, t3];
        }
      }(a2), S2 = E2 && E2[0], T2 = E2 && E2[1], { onBeforeEnter: C2, onEnter: R2, onEnterCancelled: N2, onLeave: O2, onLeaveCancelled: I2, onBeforeAppear: P2 = C2, onAppear: L2 = R2, onAppearCancelled: M2 = N2 } = t2, finishEnter = /* @__PURE__ */ __name((e3, t3, r3, s3) => {
        e3._enterCancelled = s3, removeTransitionClass(e3, t3 ? m2 : u2), removeTransitionClass(e3, t3 ? f2 : p2), r3 && r3();
      }, "finishEnter"), finishLeave = /* @__PURE__ */ __name((e3, t3) => {
        e3._isLeaving = false, removeTransitionClass(e3, g2), removeTransitionClass(e3, _2), removeTransitionClass(e3, x2), t3 && t3();
      }, "finishLeave"), makeEnterHook = /* @__PURE__ */ __name((e3) => (t3, r3) => {
        const a3 = e3 ? L2 : R2, resolve2 = /* @__PURE__ */ __name(() => finishEnter(t3, e3, r3), "resolve");
        callHook(a3, [t3, resolve2]), nextFrame(() => {
          removeTransitionClass(t3, e3 ? d2 : c2), addTransitionClass(t3, e3 ? m2 : u2), hasExplicitCallback(a3) || whenTransitionEnds(t3, s2, S2, resolve2);
        });
      }, "makeEnterHook");
      return $r(t2, { onBeforeEnter(e3) {
        callHook(C2, [e3]), addTransitionClass(e3, c2), addTransitionClass(e3, p2);
      }, onBeforeAppear(e3) {
        callHook(P2, [e3]), addTransitionClass(e3, d2), addTransitionClass(e3, f2);
      }, onEnter: makeEnterHook(false), onAppear: makeEnterHook(true), onLeave(e3, t3) {
        e3._isLeaving = true;
        const resolve2 = /* @__PURE__ */ __name(() => finishLeave(e3, t3), "resolve");
        addTransitionClass(e3, g2), e3._enterCancelled ? (addTransitionClass(e3, x2), forceReflow()) : (forceReflow(), addTransitionClass(e3, x2)), nextFrame(() => {
          e3._isLeaving && (removeTransitionClass(e3, g2), addTransitionClass(e3, _2), hasExplicitCallback(O2) || whenTransitionEnds(e3, s2, T2, resolve2));
        }), callHook(O2, [e3, resolve2]);
      }, onEnterCancelled(e3) {
        finishEnter(e3, false, void 0, true), callHook(N2, [e3]);
      }, onAppearCancelled(e3) {
        finishEnter(e3, true, void 0, true), callHook(M2, [e3]);
      }, onLeaveCancelled(e3) {
        finishLeave(e3), callHook(I2, [e3]);
      } });
    }
    __name(resolveTransitionProps, "resolveTransitionProps");
    function NumberOf(e2) {
      return toNumber(e2);
    }
    __name(NumberOf, "NumberOf");
    function addTransitionClass(e2, t2) {
      t2.split(/\s+/).forEach((t3) => t3 && e2.classList.add(t3)), (e2[Di] || (e2[Di] = /* @__PURE__ */ new Set())).add(t2);
    }
    __name(addTransitionClass, "addTransitionClass");
    function removeTransitionClass(e2, t2) {
      t2.split(/\s+/).forEach((t3) => t3 && e2.classList.remove(t3));
      const r2 = e2[Di];
      r2 && (r2.delete(t2), r2.size || (e2[Di] = void 0));
    }
    __name(removeTransitionClass, "removeTransitionClass");
    function nextFrame(e2) {
      requestAnimationFrame(() => {
        requestAnimationFrame(e2);
      });
    }
    __name(nextFrame, "nextFrame");
    let Fi = 0;
    function whenTransitionEnds(e2, t2, r2, s2) {
      const a2 = e2._endId = ++Fi, resolveIfNotStale = /* @__PURE__ */ __name(() => {
        a2 === e2._endId && s2();
      }, "resolveIfNotStale");
      if (null != r2)
        return setTimeout(resolveIfNotStale, r2);
      const { type: c2, timeout: p2, propCount: u2 } = getTransitionInfo(e2, t2);
      if (!c2)
        return s2();
      const d2 = c2 + "end";
      let f2 = 0;
      const end = /* @__PURE__ */ __name(() => {
        e2.removeEventListener(d2, onEnd), resolveIfNotStale();
      }, "end"), onEnd = /* @__PURE__ */ __name((t3) => {
        t3.target === e2 && ++f2 >= u2 && end();
      }, "onEnd");
      setTimeout(() => {
        f2 < u2 && end();
      }, p2 + 1), e2.addEventListener(d2, onEnd);
    }
    __name(whenTransitionEnds, "whenTransitionEnds");
    function getTransitionInfo(e2, t2) {
      const r2 = window.getComputedStyle(e2), getStyleProperties = /* @__PURE__ */ __name((e3) => (r2[e3] || "").split(", "), "getStyleProperties"), s2 = getStyleProperties(`${Bi}Delay`), a2 = getStyleProperties(`${Bi}Duration`), c2 = getTimeout(s2, a2), p2 = getStyleProperties(`${ji}Delay`), u2 = getStyleProperties(`${ji}Duration`), d2 = getTimeout(p2, u2);
      let f2 = null, m2 = 0, g2 = 0;
      t2 === Bi ? c2 > 0 && (f2 = Bi, m2 = c2, g2 = a2.length) : t2 === ji ? d2 > 0 && (f2 = ji, m2 = d2, g2 = u2.length) : (m2 = Math.max(c2, d2), f2 = m2 > 0 ? c2 > d2 ? Bi : ji : null, g2 = f2 ? f2 === Bi ? a2.length : u2.length : 0);
      return { type: f2, timeout: m2, propCount: g2, hasTransform: f2 === Bi && /\b(transform|all)(,|$)/.test(getStyleProperties(`${Bi}Property`).toString()) };
    }
    __name(getTransitionInfo, "getTransitionInfo");
    function getTimeout(e2, t2) {
      for (; e2.length < t2.length; )
        e2 = e2.concat(e2);
      return Math.max(...t2.map((t3, r2) => toMs(t3) + toMs(e2[r2])));
    }
    __name(getTimeout, "getTimeout");
    function toMs(e2) {
      return "auto" === e2 ? 0 : 1e3 * Number(e2.slice(0, -1).replace(",", "."));
    }
    __name(toMs, "toMs");
    function forceReflow() {
      return document.body.offsetHeight;
    }
    __name(forceReflow, "forceReflow");
    const zi = Symbol("_vod"), qi = Symbol("_vsh"), Wi = { beforeMount(e2, { value: t2 }, { transition: r2 }) {
      e2[zi] = "none" === e2.style.display ? "" : e2.style.display, r2 && t2 ? r2.beforeEnter(e2) : setDisplay(e2, t2);
    }, mounted(e2, { value: t2 }, { transition: r2 }) {
      r2 && t2 && r2.enter(e2);
    }, updated(e2, { value: t2, oldValue: r2 }, { transition: s2 }) {
      !t2 != !r2 && (s2 ? t2 ? (s2.beforeEnter(e2), setDisplay(e2, true), s2.enter(e2)) : s2.leave(e2, () => {
        setDisplay(e2, false);
      }) : setDisplay(e2, t2));
    }, beforeUnmount(e2, { value: t2 }) {
      setDisplay(e2, t2);
    } };
    function setDisplay(e2, t2) {
      e2.style.display = t2 ? e2[zi] : "none", e2[qi] = !t2;
    }
    __name(setDisplay, "setDisplay");
    const Ki = Symbol("");
    function setVarsOnVNode(e2, t2) {
      if (128 & e2.shapeFlag) {
        const r2 = e2.suspense;
        e2 = r2.activeBranch, r2.pendingBranch && !r2.isHydrating && r2.effects.push(() => {
          setVarsOnVNode(r2.activeBranch, t2);
        });
      }
      for (; e2.component; )
        e2 = e2.component.subTree;
      if (1 & e2.shapeFlag && e2.el)
        setVarsOnNode(e2.el, t2);
      else if (e2.type === fi)
        e2.children.forEach((e3) => setVarsOnVNode(e3, t2));
      else if (e2.type === gi) {
        let { el: r2, anchor: s2 } = e2;
        for (; r2 && (setVarsOnNode(r2, t2), r2 !== s2); )
          r2 = r2.nextSibling;
      }
    }
    __name(setVarsOnVNode, "setVarsOnVNode");
    function setVarsOnNode(e2, t2) {
      if (1 === e2.nodeType) {
        const r2 = e2.style;
        let s2 = "";
        for (const e3 in t2) {
          const a2 = normalizeCssVarValue(t2[e3]);
          r2.setProperty(`--${e3}`, a2), s2 += `--${e3}: ${a2};`;
        }
        r2[Ki] = s2;
      }
    }
    __name(setVarsOnNode, "setVarsOnNode");
    const Xi = /(^|;)\s*display\s*:/;
    const Gi = /\s*!important$/;
    function setStyle(e2, t2, r2) {
      if (jr(r2))
        r2.forEach((r3) => setStyle(e2, t2, r3));
      else if (null == r2 && (r2 = ""), t2.startsWith("--"))
        e2.setProperty(t2, r2);
      else {
        const s2 = function(e3, t3) {
          const r3 = Yi[t3];
          if (r3)
            return r3;
          let s3 = Fr(t3);
          if ("filter" !== s3 && s3 in e3)
            return Yi[t3] = s3;
          s3 = Wr(s3);
          for (let r4 = 0; r4 < Ji.length; r4++) {
            const a2 = Ji[r4] + s3;
            if (a2 in e3)
              return Yi[t3] = a2;
          }
          return t3;
        }(e2, t2);
        Gi.test(r2) ? e2.setProperty(qr(s2), r2.replace(Gi, ""), "important") : e2[s2] = r2;
      }
    }
    __name(setStyle, "setStyle");
    const Ji = ["Webkit", "Moz", "ms"], Yi = {};
    const Qi = "http://www.w3.org/1999/xlink";
    function patchAttr(e2, t2, r2, s2, a2, c2 = co(t2)) {
      s2 && t2.startsWith("xlink:") ? null == r2 ? e2.removeAttributeNS(Qi, t2.slice(6, t2.length)) : e2.setAttributeNS(Qi, t2, r2) : null == r2 || c2 && !includeBooleanAttr(r2) ? e2.removeAttribute(t2) : e2.setAttribute(t2, c2 ? "" : isSymbol(r2) ? String(r2) : r2);
    }
    __name(patchAttr, "patchAttr");
    function patchDOMProp(e2, t2, r2, s2, a2) {
      if ("innerHTML" === t2 || "textContent" === t2)
        return void (null != r2 && (e2[t2] = r2));
      const c2 = e2.tagName;
      if ("value" === t2 && "PROGRESS" !== c2 && !c2.includes("-")) {
        const s3 = "OPTION" === c2 ? e2.getAttribute("value") || "" : e2.value, a3 = null == r2 ? "checkbox" === e2.type ? "on" : "" : String(r2);
        return s3 === a3 && "_value" in e2 || (e2.value = a3), null == r2 && e2.removeAttribute(t2), void (e2._value = r2);
      }
      let p2 = false;
      if ("" === r2 || null == r2) {
        const s3 = typeof e2[t2];
        "boolean" === s3 ? r2 = includeBooleanAttr(r2) : null == r2 && "string" === s3 ? (r2 = "", p2 = true) : "number" === s3 && (r2 = 0, p2 = true);
      }
      try {
        e2[t2] = r2;
      } catch (e3) {
      }
      p2 && e2.removeAttribute(a2 || t2);
    }
    __name(patchDOMProp, "patchDOMProp");
    function addEventListener$1(e2, t2, r2, s2) {
      e2.addEventListener(t2, r2, s2);
    }
    __name(addEventListener$1, "addEventListener$1");
    const Zi = Symbol("_vei");
    function patchEvent(e2, t2, r2, s2, a2 = null) {
      const c2 = e2[Zi] || (e2[Zi] = {}), p2 = c2[t2];
      if (s2 && p2)
        p2.value = s2;
      else {
        const [r3, u2] = function(e3) {
          let t3;
          if (ea.test(e3)) {
            let r5;
            for (t3 = {}; r5 = e3.match(ea); )
              e3 = e3.slice(0, e3.length - r5[0].length), t3[r5[0].toLowerCase()] = true;
          }
          const r4 = ":" === e3[2] ? e3.slice(3) : qr(e3.slice(2));
          return [r4, t3];
        }(t2);
        if (s2) {
          const p3 = c2[t2] = function(e3, t3) {
            const invoker = /* @__PURE__ */ __name((e4) => {
              if (e4._vts) {
                if (e4._vts <= invoker.attached)
                  return;
              } else
                e4._vts = Date.now();
              callWithAsyncErrorHandling(function(e5, t4) {
                if (jr(t4)) {
                  const r4 = e5.stopImmediatePropagation;
                  return e5.stopImmediatePropagation = () => {
                    r4.call(e5), e5._stopped = true;
                  }, t4.map((e6) => (t5) => !t5._stopped && e6 && e6(t5));
                }
                return t4;
              }(e4, invoker.value), t3, 5, [e4]);
            }, "invoker");
            return invoker.value = e3, invoker.attached = getNow(), invoker;
          }(s2, a2);
          addEventListener$1(e2, r3, p3, u2);
        } else
          p2 && (!function(e3, t3, r4, s3) {
            e3.removeEventListener(t3, r4, s3);
          }(e2, r3, p2, u2), c2[t2] = void 0);
      }
    }
    __name(patchEvent, "patchEvent");
    const ea = /(?:Once|Passive|Capture)$/;
    let ta = 0;
    const na = Promise.resolve(), getNow = /* @__PURE__ */ __name(() => ta || (na.then(() => ta = 0), ta = Date.now()), "getNow");
    const isNativeOn = /* @__PURE__ */ __name((e2) => 111 === e2.charCodeAt(0) && 110 === e2.charCodeAt(1) && e2.charCodeAt(2) > 96 && e2.charCodeAt(2) < 123, "isNativeOn");
    const ra = {};
    function defineCustomElement(e2, t2, r2) {
      const s2 = defineComponent(e2, t2);
      isPlainObject(s2) && $r(s2, t2);
      class VueCustomElement extends VueElement {
        constructor(e3) {
          super(s2, e3, r2);
        }
      }
      __name(VueCustomElement, "VueCustomElement");
      return VueCustomElement.def = s2, VueCustomElement;
    }
    __name(defineCustomElement, "defineCustomElement");
    const oa = "undefined" != typeof HTMLElement ? HTMLElement : class {
    };
    class VueElement extends oa {
      constructor(e2, t2 = {}, r2 = createApp) {
        super(), this._def = e2, this._props = t2, this._createApp = r2, this._isVueCE = true, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = false, this._resolved = false, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && r2 !== createApp ? this._root = this.shadowRoot : false !== e2.shadowRoot ? (this.attachShadow({ mode: "open" }), this._root = this.shadowRoot) : this._root = this;
      }
      connectedCallback() {
        if (!this.isConnected)
          return;
        this.shadowRoot || this._resolved || this._parseSlots(), this._connected = true;
        let e2 = this;
        for (; e2 = e2 && (e2.parentNode || e2.host); )
          if (e2 instanceof VueElement) {
            this._parent = e2;
            break;
          }
        this._instance || (this._resolved ? this._mount(this._def) : e2 && e2._pendingResolve ? this._pendingResolve = e2._pendingResolve.then(() => {
          this._pendingResolve = void 0, this._resolveDef();
        }) : this._resolveDef());
      }
      _setParent(e2 = this._parent) {
        e2 && (this._instance.parent = e2._instance, this._inheritParentContext(e2));
      }
      _inheritParentContext(e2 = this._parent) {
        e2 && this._app && Object.setPrototypeOf(this._app._context.provides, e2._instance.provides);
      }
      disconnectedCallback() {
        this._connected = false, nextTick(() => {
          this._connected || (this._ob && (this._ob.disconnect(), this._ob = null), this._app && this._app.unmount(), this._instance && (this._instance.ce = void 0), this._app = this._instance = null);
        });
      }
      _resolveDef() {
        if (this._pendingResolve)
          return;
        for (let e3 = 0; e3 < this.attributes.length; e3++)
          this._setAttr(this.attributes[e3].name);
        this._ob = new MutationObserver((e3) => {
          for (const t2 of e3)
            this._setAttr(t2.attributeName);
        }), this._ob.observe(this, { attributes: true });
        const resolve2 = /* @__PURE__ */ __name((e3, t2 = false) => {
          this._resolved = true, this._pendingResolve = void 0;
          const { props: r2, styles: s2 } = e3;
          let a2;
          if (r2 && !jr(r2))
            for (const e4 in r2) {
              const t3 = r2[e4];
              (t3 === Number || t3 && t3.type === Number) && (e4 in this._props && (this._props[e4] = toNumber(this._props[e4])), (a2 || (a2 = /* @__PURE__ */ Object.create(null)))[Fr(e4)] = true);
            }
          this._numberProps = a2, this._resolveProps(e3), this.shadowRoot && this._applyStyles(s2), this._mount(e3);
        }, "resolve"), e2 = this._def.__asyncLoader;
        e2 ? this._pendingResolve = e2().then((e3) => {
          e3.configureApp = this._def.configureApp, resolve2(this._def = e3, true);
        }) : resolve2(this._def);
      }
      _mount(e2) {
        this._app = this._createApp(e2), this._inheritParentContext(), e2.configureApp && e2.configureApp(this._app), this._app._ceVNode = this._createVNode(), this._app.mount(this._root);
        const t2 = this._instance && this._instance.exposed;
        if (t2)
          for (const e3 in t2)
            hasOwn(this, e3) || Object.defineProperty(this, e3, { get: () => unref(t2[e3]) });
      }
      _resolveProps(e2) {
        const { props: t2 } = e2, r2 = jr(t2) ? t2 : Object.keys(t2 || {});
        for (const e3 of Object.keys(this))
          "_" !== e3[0] && r2.includes(e3) && this._setProp(e3, this[e3]);
        for (const e3 of r2.map(Fr))
          Object.defineProperty(this, e3, { get() {
            return this._getProp(e3);
          }, set(t3) {
            this._setProp(e3, t3, true, true);
          } });
      }
      _setAttr(e2) {
        if (e2.startsWith("data-v-"))
          return;
        const t2 = this.hasAttribute(e2);
        let r2 = t2 ? this.getAttribute(e2) : ra;
        const s2 = Fr(e2);
        t2 && this._numberProps && this._numberProps[s2] && (r2 = toNumber(r2)), this._setProp(s2, r2, false, true);
      }
      _getProp(e2) {
        return this._props[e2];
      }
      _setProp(e2, t2, r2 = true, s2 = false) {
        if (t2 !== this._props[e2] && (t2 === ra ? delete this._props[e2] : (this._props[e2] = t2, "key" === e2 && this._app && (this._app._ceVNode.key = t2)), s2 && this._instance && this._update(), r2)) {
          const r3 = this._ob;
          r3 && r3.disconnect(), true === t2 ? this.setAttribute(qr(e2), "") : "string" == typeof t2 || "number" == typeof t2 ? this.setAttribute(qr(e2), t2 + "") : t2 || this.removeAttribute(qr(e2)), r3 && r3.observe(this, { attributes: true });
        }
      }
      _update() {
        const e2 = this._createVNode();
        this._app && (e2.appContext = this._app._context), render(e2, this._root);
      }
      _createVNode() {
        const e2 = {};
        this.shadowRoot || (e2.onVnodeMounted = e2.onVnodeUpdated = this._renderSlots.bind(this));
        const t2 = createVNode(this._def, $r(e2, this._props));
        return this._instance || (t2.ce = (e3) => {
          this._instance = e3, e3.ce = this, e3.isCE = true;
          const dispatch = /* @__PURE__ */ __name((e4, t3) => {
            this.dispatchEvent(new CustomEvent(e4, isPlainObject(t3[0]) ? $r({ detail: t3 }, t3[0]) : { detail: t3 }));
          }, "dispatch");
          e3.emit = (e4, ...t3) => {
            dispatch(e4, t3), qr(e4) !== e4 && dispatch(qr(e4), t3);
          }, this._setParent();
        }), t2;
      }
      _applyStyles(e2, t2) {
        if (!e2)
          return;
        if (t2) {
          if (t2 === this._def || this._styleChildren.has(t2))
            return;
          this._styleChildren.add(t2);
        }
        const r2 = this._nonce;
        for (let t3 = e2.length - 1; t3 >= 0; t3--) {
          const s2 = document.createElement("style");
          r2 && s2.setAttribute("nonce", r2), s2.textContent = e2[t3], this.shadowRoot.prepend(s2);
        }
      }
      _parseSlots() {
        const e2 = this._slots = {};
        let t2;
        for (; t2 = this.firstChild; ) {
          const r2 = 1 === t2.nodeType && t2.getAttribute("slot") || "default";
          (e2[r2] || (e2[r2] = [])).push(t2), this.removeChild(t2);
        }
      }
      _renderSlots() {
        const e2 = (this._teleportTarget || this).querySelectorAll("slot"), t2 = this._instance.type.__scopeId;
        for (let r2 = 0; r2 < e2.length; r2++) {
          const s2 = e2[r2], a2 = s2.getAttribute("name") || "default", c2 = this._slots[a2], p2 = s2.parentNode;
          if (c2)
            for (const e3 of c2) {
              if (t2 && 1 === e3.nodeType) {
                const r3 = t2 + "-s", s3 = document.createTreeWalker(e3, 1);
                let a3;
                for (e3.setAttribute(r3, ""); a3 = s3.nextNode(); )
                  a3.setAttribute(r3, "");
              }
              p2.insertBefore(e3, s2);
            }
          else
            for (; s2.firstChild; )
              p2.insertBefore(s2.firstChild, s2);
          p2.removeChild(s2);
        }
      }
      _injectChildStyle(e2) {
        this._applyStyles(e2.styles, e2);
      }
      _removeChildStyle(e2) {
      }
    }
    __name(VueElement, "VueElement");
    function useHost(e2) {
      const t2 = getCurrentInstance(), r2 = t2 && t2.ce;
      return r2 || null;
    }
    __name(useHost, "useHost");
    const sa = /* @__PURE__ */ new WeakMap(), ia = /* @__PURE__ */ new WeakMap(), aa = Symbol("_moveCb"), ca = Symbol("_enterCb"), la = ((e2) => (delete e2.props.mode, e2))({ name: "TransitionGroup", props: $r({}, Ui, { tag: String, moveClass: String }), setup(e2, { slots: t2 }) {
      const r2 = getCurrentInstance(), s2 = useTransitionState();
      let a2, c2;
      return Ws(() => {
        if (!a2.length)
          return;
        const t3 = e2.moveClass || `${e2.name || "v"}-move`;
        if (!function(e3, t4, r3) {
          const s4 = e3.cloneNode(), a3 = e3[Di];
          a3 && a3.forEach((e4) => {
            e4.split(/\s+/).forEach((e5) => e5 && s4.classList.remove(e5));
          });
          r3.split(/\s+/).forEach((e4) => e4 && s4.classList.add(e4)), s4.style.display = "none";
          const c3 = 1 === t4.nodeType ? t4 : t4.parentNode;
          c3.appendChild(s4);
          const { hasTransform: p2 } = getTransitionInfo(s4);
          return c3.removeChild(s4), p2;
        }(a2[0].el, r2.vnode.el, t3))
          return void (a2 = []);
        a2.forEach(callPendingCbs), a2.forEach(recordPosition);
        const s3 = a2.filter(applyTranslation);
        forceReflow(), s3.forEach((e3) => {
          const r3 = e3.el, s4 = r3.style;
          addTransitionClass(r3, t3), s4.transform = s4.webkitTransform = s4.transitionDuration = "";
          const a3 = r3[aa] = (e4) => {
            e4 && e4.target !== r3 || e4 && !/transform$/.test(e4.propertyName) || (r3.removeEventListener("transitionend", a3), r3[aa] = null, removeTransitionClass(r3, t3));
          };
          r3.addEventListener("transitionend", a3);
        }), a2 = [];
      }), () => {
        const p2 = toRaw(e2), u2 = resolveTransitionProps(p2);
        let d2 = p2.tag || fi;
        if (a2 = [], c2)
          for (let e3 = 0; e3 < c2.length; e3++) {
            const t3 = c2[e3];
            t3.el && t3.el instanceof Element && (a2.push(t3), setTransitionHooks(t3, resolveTransitionHooks(t3, u2, s2, r2)), sa.set(t3, t3.el.getBoundingClientRect()));
          }
        c2 = t2.default ? getTransitionRawChildren(t2.default()) : [];
        for (let e3 = 0; e3 < c2.length; e3++) {
          const t3 = c2[e3];
          null != t3.key && setTransitionHooks(t3, resolveTransitionHooks(t3, u2, s2, r2));
        }
        return createVNode(d2, null, c2);
      };
    } }), pa = la;
    function callPendingCbs(e2) {
      const t2 = e2.el;
      t2[aa] && t2[aa](), t2[ca] && t2[ca]();
    }
    __name(callPendingCbs, "callPendingCbs");
    function recordPosition(e2) {
      ia.set(e2, e2.el.getBoundingClientRect());
    }
    __name(recordPosition, "recordPosition");
    function applyTranslation(e2) {
      const t2 = sa.get(e2), r2 = ia.get(e2), s2 = t2.left - r2.left, a2 = t2.top - r2.top;
      if (s2 || a2) {
        const t3 = e2.el.style;
        return t3.transform = t3.webkitTransform = `translate(${s2}px,${a2}px)`, t3.transitionDuration = "0s", e2;
      }
    }
    __name(applyTranslation, "applyTranslation");
    const getModelAssigner = /* @__PURE__ */ __name((e2) => {
      const t2 = e2.props["onUpdate:modelValue"] || false;
      return jr(t2) ? (e3) => invokeArrayFns(t2, e3) : t2;
    }, "getModelAssigner");
    function onCompositionStart(e2) {
      e2.target.composing = true;
    }
    __name(onCompositionStart, "onCompositionStart");
    function onCompositionEnd(e2) {
      const t2 = e2.target;
      t2.composing && (t2.composing = false, t2.dispatchEvent(new Event("input")));
    }
    __name(onCompositionEnd, "onCompositionEnd");
    const ua = Symbol("_assign"), da = { created(e2, { modifiers: { lazy: t2, trim: r2, number: s2 } }, a2) {
      e2[ua] = getModelAssigner(a2);
      const c2 = s2 || a2.props && "number" === a2.props.type;
      addEventListener$1(e2, t2 ? "change" : "input", (t3) => {
        if (t3.target.composing)
          return;
        let s3 = e2.value;
        r2 && (s3 = s3.trim()), c2 && (s3 = looseToNumber(s3)), e2[ua](s3);
      }), r2 && addEventListener$1(e2, "change", () => {
        e2.value = e2.value.trim();
      }), t2 || (addEventListener$1(e2, "compositionstart", onCompositionStart), addEventListener$1(e2, "compositionend", onCompositionEnd), addEventListener$1(e2, "change", onCompositionEnd));
    }, mounted(e2, { value: t2 }) {
      e2.value = null == t2 ? "" : t2;
    }, beforeUpdate(e2, { value: t2, oldValue: r2, modifiers: { lazy: s2, trim: a2, number: c2 } }, p2) {
      if (e2[ua] = getModelAssigner(p2), e2.composing)
        return;
      const u2 = null == t2 ? "" : t2;
      if ((!c2 && "number" !== e2.type || /^0\d/.test(e2.value) ? e2.value : looseToNumber(e2.value)) !== u2) {
        if (document.activeElement === e2 && "range" !== e2.type) {
          if (s2 && t2 === r2)
            return;
          if (a2 && e2.value.trim() === u2)
            return;
        }
        e2.value = u2;
      }
    } }, fa = { deep: true, created(e2, t2, r2) {
      e2[ua] = getModelAssigner(r2), addEventListener$1(e2, "change", () => {
        const t3 = e2._modelValue, r3 = getValue(e2), s2 = e2.checked, a2 = e2[ua];
        if (jr(t3)) {
          const e3 = looseIndexOf(t3, r3), c2 = -1 !== e3;
          if (s2 && !c2)
            a2(t3.concat(r3));
          else if (!s2 && c2) {
            const r4 = [...t3];
            r4.splice(e3, 1), a2(r4);
          }
        } else if (isSet(t3)) {
          const e3 = new Set(t3);
          s2 ? e3.add(r3) : e3.delete(r3), a2(e3);
        } else
          a2(getCheckboxValue(e2, s2));
      });
    }, mounted: setChecked, beforeUpdate(e2, t2, r2) {
      e2[ua] = getModelAssigner(r2), setChecked(e2, t2, r2);
    } };
    function setChecked(e2, { value: t2, oldValue: r2 }, s2) {
      let a2;
      if (e2._modelValue = t2, jr(t2))
        a2 = looseIndexOf(t2, s2.props.value) > -1;
      else if (isSet(t2))
        a2 = t2.has(s2.props.value);
      else {
        if (t2 === r2)
          return;
        a2 = looseEqual(t2, getCheckboxValue(e2, true));
      }
      e2.checked !== a2 && (e2.checked = a2);
    }
    __name(setChecked, "setChecked");
    const ha = { created(e2, { value: t2 }, r2) {
      e2.checked = looseEqual(t2, r2.props.value), e2[ua] = getModelAssigner(r2), addEventListener$1(e2, "change", () => {
        e2[ua](getValue(e2));
      });
    }, beforeUpdate(e2, { value: t2, oldValue: r2 }, s2) {
      e2[ua] = getModelAssigner(s2), t2 !== r2 && (e2.checked = looseEqual(t2, s2.props.value));
    } }, ma = { deep: true, created(e2, { value: t2, modifiers: { number: r2 } }, s2) {
      const a2 = isSet(t2);
      addEventListener$1(e2, "change", () => {
        const t3 = Array.prototype.filter.call(e2.options, (e3) => e3.selected).map((e3) => r2 ? looseToNumber(getValue(e3)) : getValue(e3));
        e2[ua](e2.multiple ? a2 ? new Set(t3) : t3 : t3[0]), e2._assigning = true, nextTick(() => {
          e2._assigning = false;
        });
      }), e2[ua] = getModelAssigner(s2);
    }, mounted(e2, { value: t2 }) {
      setSelected(e2, t2);
    }, beforeUpdate(e2, t2, r2) {
      e2[ua] = getModelAssigner(r2);
    }, updated(e2, { value: t2 }) {
      e2._assigning || setSelected(e2, t2);
    } };
    function setSelected(e2, t2) {
      const r2 = e2.multiple, s2 = jr(t2);
      if (!r2 || s2 || isSet(t2)) {
        for (let a2 = 0, c2 = e2.options.length; a2 < c2; a2++) {
          const c3 = e2.options[a2], p2 = getValue(c3);
          if (r2)
            if (s2) {
              const e3 = typeof p2;
              c3.selected = "string" === e3 || "number" === e3 ? t2.some((e4) => String(e4) === String(p2)) : looseIndexOf(t2, p2) > -1;
            } else
              c3.selected = t2.has(p2);
          else if (looseEqual(getValue(c3), t2))
            return void (e2.selectedIndex !== a2 && (e2.selectedIndex = a2));
        }
        r2 || -1 === e2.selectedIndex || (e2.selectedIndex = -1);
      }
    }
    __name(setSelected, "setSelected");
    function getValue(e2) {
      return "_value" in e2 ? e2._value : e2.value;
    }
    __name(getValue, "getValue");
    function getCheckboxValue(e2, t2) {
      const r2 = t2 ? "_trueValue" : "_falseValue";
      return r2 in e2 ? e2[r2] : t2;
    }
    __name(getCheckboxValue, "getCheckboxValue");
    const ga = { created(e2, t2, r2) {
      callModelHook(e2, t2, r2, null, "created");
    }, mounted(e2, t2, r2) {
      callModelHook(e2, t2, r2, null, "mounted");
    }, beforeUpdate(e2, t2, r2, s2) {
      callModelHook(e2, t2, r2, s2, "beforeUpdate");
    }, updated(e2, t2, r2, s2) {
      callModelHook(e2, t2, r2, s2, "updated");
    } };
    function resolveDynamicModel(e2, t2) {
      switch (e2) {
        case "SELECT":
          return ma;
        case "TEXTAREA":
          return da;
        default:
          switch (t2) {
            case "checkbox":
              return fa;
            case "radio":
              return ha;
            default:
              return da;
          }
      }
    }
    __name(resolveDynamicModel, "resolveDynamicModel");
    function callModelHook(e2, t2, r2, s2, a2) {
      const c2 = resolveDynamicModel(e2.tagName, r2.props && r2.props.type)[a2];
      c2 && c2(e2, t2, r2, s2);
    }
    __name(callModelHook, "callModelHook");
    const va = ["ctrl", "shift", "alt", "meta"], ya = { stop: (e2) => e2.stopPropagation(), prevent: (e2) => e2.preventDefault(), self: (e2) => e2.target !== e2.currentTarget, ctrl: (e2) => !e2.ctrlKey, shift: (e2) => !e2.shiftKey, alt: (e2) => !e2.altKey, meta: (e2) => !e2.metaKey, left: (e2) => "button" in e2 && 0 !== e2.button, middle: (e2) => "button" in e2 && 1 !== e2.button, right: (e2) => "button" in e2 && 2 !== e2.button, exact: (e2, t2) => va.some((r2) => e2[`${r2}Key`] && !t2.includes(r2)) }, ba = { esc: "escape", space: " ", up: "arrow-up", left: "arrow-left", right: "arrow-right", down: "arrow-down", delete: "backspace" }, xa = $r({ patchProp: (e2, t2, r2, s2, a2, c2) => {
      const p2 = "svg" === a2;
      "class" === t2 ? function(e3, t3, r3) {
        const s3 = e3[Di];
        s3 && (t3 = (t3 ? [t3, ...s3] : [...s3]).join(" ")), null == t3 ? e3.removeAttribute("class") : r3 ? e3.setAttribute("class", t3) : e3.className = t3;
      }(e2, s2, p2) : "style" === t2 ? function(e3, t3, r3) {
        const s3 = e3.style, a3 = isString(r3);
        let c3 = false;
        if (r3 && !a3) {
          if (t3)
            if (isString(t3))
              for (const e4 of t3.split(";")) {
                const t4 = e4.slice(0, e4.indexOf(":")).trim();
                null == r3[t4] && setStyle(s3, t4, "");
              }
            else
              for (const e4 in t3)
                null == r3[e4] && setStyle(s3, e4, "");
          for (const e4 in r3)
            "display" === e4 && (c3 = true), setStyle(s3, e4, r3[e4]);
        } else if (a3) {
          if (t3 !== r3) {
            const e4 = s3[Ki];
            e4 && (r3 += ";" + e4), s3.cssText = r3, c3 = Xi.test(r3);
          }
        } else
          t3 && e3.removeAttribute("style");
        zi in e3 && (e3[zi] = c3 ? s3.display : "", e3[qi] && (s3.display = "none"));
      }(e2, r2, s2) : isOn(t2) ? isModelListener(t2) || patchEvent(e2, t2, 0, s2, c2) : ("." === t2[0] ? (t2 = t2.slice(1), 1) : "^" === t2[0] ? (t2 = t2.slice(1), 0) : function(e3, t3, r3, s3) {
        if (s3)
          return "innerHTML" === t3 || "textContent" === t3 || !!(t3 in e3 && isNativeOn(t3) && isFunction(r3));
        if ("spellcheck" === t3 || "draggable" === t3 || "translate" === t3 || "autocorrect" === t3)
          return false;
        if ("form" === t3)
          return false;
        if ("list" === t3 && "INPUT" === e3.tagName)
          return false;
        if ("type" === t3 && "TEXTAREA" === e3.tagName)
          return false;
        if ("width" === t3 || "height" === t3) {
          const t4 = e3.tagName;
          if ("IMG" === t4 || "VIDEO" === t4 || "CANVAS" === t4 || "SOURCE" === t4)
            return false;
        }
        if (isNativeOn(t3) && isString(r3))
          return false;
        return t3 in e3;
      }(e2, t2, s2, p2)) ? (patchDOMProp(e2, t2, s2), e2.tagName.includes("-") || "value" !== t2 && "checked" !== t2 && "selected" !== t2 || patchAttr(e2, t2, s2, p2, 0, "value" !== t2)) : !e2._isVueCE || !/[A-Z]/.test(t2) && isString(s2) ? ("true-value" === t2 ? e2._trueValue = s2 : "false-value" === t2 && (e2._falseValue = s2), patchAttr(e2, t2, s2, p2)) : patchDOMProp(e2, Fr(t2), s2, 0, t2);
    } }, $i);
    let _a, Ea = false;
    function ensureRenderer() {
      return _a || (_a = createRenderer(xa));
    }
    __name(ensureRenderer, "ensureRenderer");
    function ensureHydrationRenderer() {
      return _a = Ea ? _a : createHydrationRenderer(xa), Ea = true, _a;
    }
    __name(ensureHydrationRenderer, "ensureHydrationRenderer");
    const render = /* @__PURE__ */ __name((...e2) => {
      ensureRenderer().render(...e2);
    }, "render"), createApp = /* @__PURE__ */ __name((...e2) => {
      const t2 = ensureRenderer().createApp(...e2), { mount: r2 } = t2;
      return t2.mount = (e3) => {
        const s2 = normalizeContainer(e3);
        if (!s2)
          return;
        const a2 = t2._component;
        isFunction(a2) || a2.render || a2.template || (a2.template = s2.innerHTML), 1 === s2.nodeType && (s2.textContent = "");
        const c2 = r2(s2, false, resolveRootNamespace(s2));
        return s2 instanceof Element && (s2.removeAttribute("v-cloak"), s2.setAttribute("data-v-app", "")), c2;
      }, t2;
    }, "createApp"), createSSRApp = /* @__PURE__ */ __name((...e2) => {
      const t2 = ensureHydrationRenderer().createApp(...e2), { mount: r2 } = t2;
      return t2.mount = (e3) => {
        const t3 = normalizeContainer(e3);
        if (t3)
          return r2(t3, true, resolveRootNamespace(t3));
      }, t2;
    }, "createSSRApp");
    function resolveRootNamespace(e2) {
      return e2 instanceof SVGElement ? "svg" : "function" == typeof MathMLElement && e2 instanceof MathMLElement ? "mathml" : void 0;
    }
    __name(resolveRootNamespace, "resolveRootNamespace");
    function normalizeContainer(e2) {
      if (isString(e2)) {
        return document.querySelector(e2);
      }
      return e2;
    }
    __name(normalizeContainer, "normalizeContainer");
    let wa = false;
    const initDirectivesForSSR = /* @__PURE__ */ __name(() => {
      wa || (wa = true, da.getSSRProps = ({ value: e2 }) => ({ value: e2 }), ha.getSSRProps = ({ value: e2 }, t2) => {
        if (t2.props && looseEqual(t2.props.value, e2))
          return { checked: true };
      }, fa.getSSRProps = ({ value: e2 }, t2) => {
        if (jr(e2)) {
          if (t2.props && looseIndexOf(e2, t2.props.value) > -1)
            return { checked: true };
        } else if (isSet(e2)) {
          if (t2.props && e2.has(t2.props.value))
            return { checked: true };
        } else if (e2)
          return { checked: true };
      }, ga.getSSRProps = (e2, t2) => {
        if ("string" != typeof t2.type)
          return;
        const r2 = resolveDynamicModel(t2.type.toUpperCase(), t2.props && t2.props.type);
        return r2.getSSRProps ? r2.getSSRProps(e2, t2) : void 0;
      }, Wi.getSSRProps = ({ value: e2 }) => {
        if (!e2)
          return { style: { display: "none" } };
      });
    }, "initDirectivesForSSR"), Sa = Object.freeze(Object.defineProperty({ __proto__: null, BaseTransition: $s, BaseTransitionPropsValidators: Ms, Comment: mi, DeprecationTypes: null, EffectScope, ErrorCodes: { SETUP_FUNCTION: 0, 0: "SETUP_FUNCTION", RENDER_FUNCTION: 1, 1: "RENDER_FUNCTION", NATIVE_EVENT_HANDLER: 5, 5: "NATIVE_EVENT_HANDLER", COMPONENT_EVENT_HANDLER: 6, 6: "COMPONENT_EVENT_HANDLER", VNODE_HOOK: 7, 7: "VNODE_HOOK", DIRECTIVE_HOOK: 8, 8: "DIRECTIVE_HOOK", TRANSITION_HOOK: 9, 9: "TRANSITION_HOOK", APP_ERROR_HANDLER: 10, 10: "APP_ERROR_HANDLER", APP_WARN_HANDLER: 11, 11: "APP_WARN_HANDLER", FUNCTION_REF: 12, 12: "FUNCTION_REF", ASYNC_COMPONENT_LOADER: 13, 13: "ASYNC_COMPONENT_LOADER", SCHEDULER: 14, 14: "SCHEDULER", COMPONENT_UPDATE: 15, 15: "COMPONENT_UPDATE", APP_UNMOUNT_CLEANUP: 16, 16: "APP_UNMOUNT_CLEANUP" }, ErrorTypeStrings: Oi, Fragment: fi, KeepAlive: Vs, ReactiveEffect, Static: gi, Suspense: di, Teleport: Os, Text: hi, TrackOpTypes: { GET: "get", HAS: "has", ITERATE: "iterate" }, Transition: Vi, TransitionGroup: pa, TriggerOpTypes: { SET: "set", ADD: "add", DELETE: "delete", CLEAR: "clear" }, VueElement, assertNumber: function(e2, t2) {
    }, callWithAsyncErrorHandling, callWithErrorHandling, camelize: Fr, capitalize: Wr, cloneVNode, compatUtils: null, computed, createApp, createBlock, createCommentVNode: function(e2 = "", t2 = false) {
      return t2 ? (openBlock(), createBlock(mi, null, e2)) : createVNode(mi, null, e2);
    }, createElementBlock: function(e2, t2, r2, s2, a2, c2) {
      return setupBlock(createBaseVNode(e2, t2, r2, s2, a2, c2, true));
    }, createElementVNode: createBaseVNode, createHydrationRenderer, createPropsRestProxy: function(e2, t2) {
      const r2 = {};
      for (const s2 in e2)
        t2.includes(s2) || Object.defineProperty(r2, s2, { enumerable: true, get: () => e2[s2] });
      return r2;
    }, createRenderer, createSSRApp, createSlots: function(e2, t2) {
      for (let r2 = 0; r2 < t2.length; r2++) {
        const s2 = t2[r2];
        if (jr(s2))
          for (let t3 = 0; t3 < s2.length; t3++)
            e2[s2[t3].name] = s2[t3].fn;
        else
          s2 && (e2[s2.name] = s2.key ? (...e3) => {
            const t3 = s2.fn(...e3);
            return t3 && (t3.key = s2.key), t3;
          } : s2.fn);
      }
      return e2;
    }, createStaticVNode: function(e2, t2) {
      const r2 = createVNode(gi, null, e2);
      return r2.staticCount = t2, r2;
    }, createTextVNode, createVNode, customRef, defineAsyncComponent: function(e2) {
      isFunction(e2) && (e2 = { loader: e2 });
      const { loader: t2, loadingComponent: r2, errorComponent: s2, delay: a2 = 200, hydrate: c2, timeout: p2, suspensible: u2 = true, onError: d2 } = e2;
      let f2, m2 = null, g2 = 0;
      const load = /* @__PURE__ */ __name(() => {
        let e3;
        return m2 || (e3 = m2 = t2().catch((e4) => {
          if (e4 = e4 instanceof Error ? e4 : new Error(String(e4)), d2)
            return new Promise((t3, r3) => {
              d2(e4, () => t3((g2++, m2 = null, load())), () => r3(e4), g2 + 1);
            });
          throw e4;
        }).then((t3) => e3 !== m2 && m2 ? m2 : (t3 && (t3.__esModule || "Module" === t3[Symbol.toStringTag]) && (t3 = t3.default), f2 = t3, t3)));
      }, "load");
      return defineComponent({ name: "AsyncComponentWrapper", __asyncLoader: load, __asyncHydrate(e3, t3, r3) {
        let s3 = false;
        (t3.bu || (t3.bu = [])).push(() => s3 = true);
        const performHydrate = /* @__PURE__ */ __name(() => {
          s3 || r3();
        }, "performHydrate"), a3 = c2 ? () => {
          const r4 = c2(performHydrate, (t4) => function(e4, t5) {
            if (isComment(e4) && "[" === e4.data) {
              let r5 = 1, s4 = e4.nextSibling;
              for (; s4; ) {
                if (1 === s4.nodeType) {
                  if (false === t5(s4))
                    break;
                } else if (isComment(s4))
                  if ("]" === s4.data) {
                    if (0 === --r5)
                      break;
                  } else
                    "[" === s4.data && r5++;
                s4 = s4.nextSibling;
              }
            } else
              t5(e4);
          }(e3, t4));
          r4 && (t3.bum || (t3.bum = [])).push(r4);
        } : performHydrate;
        f2 ? a3() : load().then(() => !t3.isUnmounted && a3());
      }, get __asyncResolved() {
        return f2;
      }, setup() {
        const e3 = Ei;
        if (markAsyncBoundary(e3), f2)
          return () => createInnerComp(f2, e3);
        const onError = /* @__PURE__ */ __name((t4) => {
          m2 = null, handleError(t4, e3, 13, !s2);
        }, "onError");
        if (u2 && e3.suspense || ki)
          return load().then((t4) => () => createInnerComp(t4, e3)).catch((e4) => (onError(e4), () => s2 ? createVNode(s2, { error: e4 }) : null));
        const t3 = ref(false), c3 = ref(), d3 = ref(!!a2);
        return a2 && setTimeout(() => {
          d3.value = false;
        }, a2), null != p2 && setTimeout(() => {
          if (!t3.value && !c3.value) {
            const e4 = new Error(`Async component timed out after ${p2}ms.`);
            onError(e4), c3.value = e4;
          }
        }, p2), load().then(() => {
          t3.value = true, e3.parent && isKeepAlive(e3.parent.vnode) && e3.parent.update();
        }).catch((e4) => {
          onError(e4), c3.value = e4;
        }), () => t3.value && f2 ? createInnerComp(f2, e3) : c3.value && s2 ? createVNode(s2, { error: c3.value }) : r2 && !d3.value ? createVNode(r2) : void 0;
      } });
    }, defineComponent, defineCustomElement, defineEmits: function() {
      return null;
    }, defineExpose: function(e2) {
    }, defineModel: function() {
    }, defineOptions: function(e2) {
    }, defineProps: function() {
      return null;
    }, defineSSRCustomElement: (e2, t2) => defineCustomElement(e2, t2, createSSRApp), defineSlots: function() {
      return null;
    }, devtools: Ii, effect: function(e2, t2) {
      e2.effect instanceof ReactiveEffect && (e2 = e2.effect.fn);
      const r2 = new ReactiveEffect(e2);
      t2 && $r(r2, t2);
      try {
        r2.run();
      } catch (e3) {
        throw r2.stop(), e3;
      }
      const s2 = r2.run.bind(r2);
      return s2.effect = r2, s2;
    }, effectScope: function(e2) {
      return new EffectScope(e2);
    }, getCurrentInstance, getCurrentScope, getCurrentWatcher: function() {
      return ms;
    }, getTransitionRawChildren, guardReactiveProps, h, handleError, hasInjectionContext, hydrate: (...e2) => {
      ensureHydrationRenderer().hydrate(...e2);
    }, hydrateOnIdle: (e2 = 1e4) => (t2) => {
      const r2 = Hs(t2, { timeout: e2 });
      return () => Us(r2);
    }, hydrateOnInteraction: (e2 = []) => (t2, r2) => {
      isString(e2) && (e2 = [e2]);
      let s2 = false;
      const doHydrate = /* @__PURE__ */ __name((e3) => {
        s2 || (s2 = true, teardown(), t2(), e3.target.dispatchEvent(new e3.constructor(e3.type, e3)));
      }, "doHydrate"), teardown = /* @__PURE__ */ __name(() => {
        r2((t3) => {
          for (const r3 of e2)
            t3.removeEventListener(r3, doHydrate);
        });
      }, "teardown");
      return r2((t3) => {
        for (const r3 of e2)
          t3.addEventListener(r3, doHydrate, { once: true });
      }), teardown;
    }, hydrateOnMediaQuery: (e2) => (t2) => {
      if (e2) {
        const r2 = matchMedia(e2);
        if (!r2.matches)
          return r2.addEventListener("change", t2, { once: true }), () => r2.removeEventListener("change", t2);
        t2();
      }
    }, hydrateOnVisible: (e2) => (t2, r2) => {
      const s2 = new IntersectionObserver((e3) => {
        for (const r3 of e3)
          if (r3.isIntersecting) {
            s2.disconnect(), t2();
            break;
          }
      }, e2);
      return r2((e3) => {
        if (e3 instanceof Element)
          return function(e4) {
            const { top: t3, left: r3, bottom: s3, right: a2 } = e4.getBoundingClientRect(), { innerHeight: c2, innerWidth: p2 } = window;
            return (t3 > 0 && t3 < c2 || s3 > 0 && s3 < c2) && (r3 > 0 && r3 < p2 || a2 > 0 && a2 < p2);
          }(e3) ? (t2(), s2.disconnect(), false) : void s2.observe(e3);
      }), () => s2.disconnect();
    }, initCustomFormatter: function() {
    }, initDirectivesForSSR, inject, isMemoSame, isProxy, isReactive, isReadonly, isRef, isRuntimeOnly: () => !Ti, isShallow, isVNode: isVNode$2, markRaw, mergeDefaults: function(e2, t2) {
      const r2 = normalizePropsOrEmits(e2);
      for (const e3 in t2) {
        if (e3.startsWith("__skip"))
          continue;
        let s2 = r2[e3];
        s2 ? jr(s2) || isFunction(s2) ? s2 = r2[e3] = { type: s2, default: t2[e3] } : s2.default = t2[e3] : null === s2 && (s2 = r2[e3] = { default: t2[e3] }), s2 && t2[`__skip_${e3}`] && (s2.skipFactory = true);
      }
      return r2;
    }, mergeModels: function(e2, t2) {
      return e2 && t2 ? jr(e2) && jr(t2) ? e2.concat(t2) : $r({}, normalizePropsOrEmits(e2), normalizePropsOrEmits(t2)) : e2 || t2;
    }, mergeProps, nextTick, normalizeClass, normalizeProps: normalizeProps$1, normalizeStyle, onActivated, onBeforeMount: Fs, onBeforeUnmount: Ks, onBeforeUpdate: qs, onDeactivated, onErrorCaptured, onMounted: zs, onRenderTracked: Ys, onRenderTriggered: Js, onScopeDispose: function(e2, t2 = false) {
      Bo && Bo.cleanups.push(e2);
    }, onServerPrefetch: Gs, onUnmounted: Xs, onUpdated: Ws, onWatcherCleanup, openBlock, popScopeId: function() {
      Rs = null;
    }, provide, proxyRefs, pushScopeId: function(e2) {
      Rs = e2;
    }, queuePostFlushCb, reactive, readonly, ref, registerRuntimeCompiler: function(e2) {
      Ti = e2, Ci = /* @__PURE__ */ __name((e3) => {
        e3.render._rc && (e3.withProxy = new Proxy(e3.ctx, ni));
      }, "Ci");
    }, render, renderList: function(e2, t2, r2, s2) {
      let a2;
      const c2 = r2 && r2[s2], p2 = jr(e2);
      if (p2 || isString(e2)) {
        let r3 = false, s3 = false;
        p2 && isReactive(e2) && (r3 = !isShallow(e2), s3 = isReadonly(e2), e2 = shallowReadArray(e2)), a2 = new Array(e2.length);
        for (let p3 = 0, u2 = e2.length; p3 < u2; p3++)
          a2[p3] = t2(r3 ? s3 ? toReadonly(toReactive(e2[p3])) : toReactive(e2[p3]) : e2[p3], p3, void 0, c2 && c2[p3]);
      } else if ("number" == typeof e2) {
        a2 = new Array(e2);
        for (let r3 = 0; r3 < e2; r3++)
          a2[r3] = t2(r3 + 1, r3, void 0, c2 && c2[r3]);
      } else if (isObject(e2))
        if (e2[Symbol.iterator])
          a2 = Array.from(e2, (e3, r3) => t2(e3, r3, void 0, c2 && c2[r3]));
        else {
          const r3 = Object.keys(e2);
          a2 = new Array(r3.length);
          for (let s3 = 0, p3 = r3.length; s3 < p3; s3++) {
            const p4 = r3[s3];
            a2[s3] = t2(e2[p4], p4, s3, c2 && c2[s3]);
          }
        }
      else
        a2 = [];
      return r2 && (r2[s2] = a2), a2;
    }, renderSlot: function(e2, t2, r2 = {}, s2, a2) {
      if (ks.ce || ks.parent && isAsyncWrapper(ks.parent) && ks.parent.ce)
        return "default" !== t2 && (r2.name = t2), openBlock(), createBlock(fi, null, [createVNode("slot", r2, s2 && s2())], 64);
      let c2 = e2[t2];
      c2 && c2._c && (c2._d = false), openBlock();
      const p2 = c2 && ensureValidVNode$1(c2(r2)), u2 = r2.key || p2 && p2.key, d2 = createBlock(fi, { key: (u2 && !isSymbol(u2) ? u2 : `_${t2}`) + (!p2 && s2 ? "_fb" : "") }, p2 || (s2 ? s2() : []), p2 && 1 === e2._ ? 64 : -2);
      return !a2 && d2.scopeId && (d2.slotScopeIds = [d2.scopeId + "-s"]), c2 && c2._c && (c2._d = true), d2;
    }, resolveComponent: function(e2, t2) {
      return resolveAsset(Qs, e2, true, t2) || e2;
    }, resolveDirective: function(e2) {
      return resolveAsset("directives", e2);
    }, resolveDynamicComponent: function(e2) {
      return isString(e2) ? resolveAsset(Qs, e2, false) || e2 : e2 || Zs;
    }, resolveFilter: null, resolveTransitionHooks, setBlockTracking, setDevtoolsHook, setTransitionHooks, shallowReactive, shallowReadonly, shallowRef, ssrContextKey: pi, ssrUtils: Pi, stop: function(e2) {
      e2.effect.stop();
    }, toDisplayString, toHandlerKey: Kr, toHandlers: function(e2, t2) {
      const r2 = {};
      for (const s2 in e2)
        r2[t2 && /[A-Z]/.test(s2) ? `on:${s2}` : Kr(s2)] = e2[s2];
      return r2;
    }, toRaw, toRef: function(e2, t2, r2) {
      return isRef(e2) ? e2 : isFunction(e2) ? new GetterRefImpl(e2) : isObject(e2) && arguments.length > 1 ? propertyToRef(e2, t2, r2) : ref(e2);
    }, toRefs: function(e2) {
      const t2 = jr(e2) ? new Array(e2.length) : {};
      for (const r2 in e2)
        t2[r2] = propertyToRef(e2, r2);
      return t2;
    }, toValue, transformVNodeArgs: function(e2) {
    }, triggerRef: function(e2) {
      e2.dep && e2.dep.trigger();
    }, unref, useAttrs: function() {
      return getContext().attrs;
    }, useCssModule: function(e2 = "$style") {
      {
        const t2 = getCurrentInstance();
        if (!t2)
          return Lr;
        const r2 = t2.type.__cssModules;
        if (!r2)
          return Lr;
        const s2 = r2[e2];
        return s2 || Lr;
      }
    }, useCssVars: function(e2) {
      const t2 = getCurrentInstance();
      if (!t2)
        return;
      const r2 = t2.ut = (r3 = e2(t2.proxy)) => {
        Array.from(document.querySelectorAll(`[data-v-owner="${t2.uid}"]`)).forEach((e3) => setVarsOnNode(e3, r3));
      }, setVars = /* @__PURE__ */ __name(() => {
        const s2 = e2(t2.proxy);
        t2.ce ? setVarsOnNode(t2.ce, s2) : setVarsOnVNode(t2.subTree, s2), r2(s2);
      }, "setVars");
      qs(() => {
        queuePostFlushCb(setVars);
      }), zs(() => {
        watch(setVars, NOOP, { flush: "post" });
        const e3 = new MutationObserver(setVars);
        e3.observe(t2.subTree.el.parentNode, { childList: true }), Xs(() => e3.disconnect());
      });
    }, useHost, useId: function() {
      const e2 = getCurrentInstance();
      return e2 ? (e2.appContext.config.idPrefix || "v") + "-" + e2.ids[0] + e2.ids[1]++ : "";
    }, useModel: function(e2, t2, r2 = Lr) {
      const s2 = getCurrentInstance(), a2 = Fr(t2), c2 = qr(t2), p2 = getModelModifiers(e2, a2), u2 = customRef((p3, u3) => {
        let d2, f2, m2 = Lr;
        return watchSyncEffect(() => {
          const t3 = e2[a2];
          hasChanged(d2, t3) && (d2 = t3, u3());
        }), { get: () => (p3(), r2.get ? r2.get(d2) : d2), set(e3) {
          const p4 = r2.set ? r2.set(e3) : e3;
          if (!(hasChanged(p4, d2) || m2 !== Lr && hasChanged(e3, m2)))
            return;
          const g2 = s2.vnode.props;
          g2 && (t2 in g2 || a2 in g2 || c2 in g2) && (`onUpdate:${t2}` in g2 || `onUpdate:${a2}` in g2 || `onUpdate:${c2}` in g2) || (d2 = e3, u3()), s2.emit(`update:${t2}`, p4), hasChanged(e3, p4) && hasChanged(e3, m2) && !hasChanged(p4, f2) && u3(), m2 = e3, f2 = p4;
        } };
      });
      return u2[Symbol.iterator] = () => {
        let e3 = 0;
        return { next: () => e3 < 2 ? { value: e3++ ? p2 || Lr : u2, done: false } : { done: true } };
      }, u2;
    }, useSSRContext, useShadowRoot: function() {
      const e2 = useHost();
      return e2 && e2.shadowRoot;
    }, useSlots: function() {
      return getContext().slots;
    }, useTemplateRef: function(e2) {
      const t2 = getCurrentInstance(), r2 = shallowRef(null);
      if (t2) {
        const s2 = t2.refs === Lr ? t2.refs = {} : t2.refs;
        Object.defineProperty(s2, e2, { enumerable: true, get: () => r2.value, set: (e3) => r2.value = e3 });
      }
      return r2;
    }, useTransitionState, vModelCheckbox: fa, vModelDynamic: ga, vModelRadio: ha, vModelSelect: ma, vModelText: da, vShow: Wi, version: Ai, warn: Ni, watch, watchEffect, watchPostEffect: function(e2, t2) {
      return doWatch(e2, null, { flush: "post" });
    }, watchSyncEffect, withAsyncContext: function(e2) {
      const t2 = getCurrentInstance();
      let r2 = e2();
      return unsetCurrentInstance(), isPromise(r2) && (r2 = r2.catch((e3) => {
        throw setCurrentInstance(t2), e3;
      })), [r2, () => setCurrentInstance(t2)];
    }, withCtx, withDefaults: function(e2, t2) {
      return null;
    }, withDirectives: function(e2, t2) {
      if (null === ks)
        return e2;
      const r2 = getComponentPublicInstance(ks), s2 = e2.dirs || (e2.dirs = []);
      for (let e3 = 0; e3 < t2.length; e3++) {
        let [a2, c2, p2, u2 = Lr] = t2[e3];
        a2 && (isFunction(a2) && (a2 = { mounted: a2, updated: a2 }), a2.deep && traverse(c2), s2.push({ dir: a2, instance: r2, value: c2, oldValue: void 0, arg: p2, modifiers: u2 }));
      }
      return e2;
    }, withKeys: (e2, t2) => {
      const r2 = e2._withKeys || (e2._withKeys = {}), s2 = t2.join(".");
      return r2[s2] || (r2[s2] = (r3) => {
        if (!("key" in r3))
          return;
        const s3 = qr(r3.key);
        return t2.some((e3) => e3 === s3 || ba[e3] === s3) ? e2(r3) : void 0;
      });
    }, withMemo: function(e2, t2, r2, s2) {
      const a2 = r2[s2];
      if (a2 && isMemoSame(a2, e2))
        return a2;
      const c2 = t2();
      return c2.memo = e2.slice(), c2.cacheIndex = s2, r2[s2] = c2;
    }, withModifiers: (e2, t2) => {
      const r2 = e2._withMods || (e2._withMods = {}), s2 = t2.join(".");
      return r2[s2] || (r2[s2] = (r3, ...s3) => {
        for (let e3 = 0; e3 < t2.length; e3++) {
          const s4 = ya[t2[e3]];
          if (s4 && s4(r3, t2))
            return;
        }
        return e2(r3, ...s3);
      });
    }, withScopeId: (e2) => withCtx }, Symbol.toStringTag, { value: "Module" })), VueResolver = /* @__PURE__ */ __name((e2, t2) => isRef(t2) ? toValue(t2) : t2, "VueResolver"), Ta = "usehead";
    function useHead$1(e2, t2 = {}) {
      const r2 = t2.head || function() {
        if (hasInjectionContext()) {
          const e3 = inject(Ta);
          if (!e3)
            throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
          return e3;
        }
        throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
      }();
      return r2.ssr ? r2.push(e2 || {}, t2) : function(e3, t3, r3 = {}) {
        const s2 = ref(false);
        let a2;
        watchEffect(() => {
          const c2 = s2.value ? {} : walkResolver(t3, VueResolver);
          a2 ? a2.patch(c2) : a2 = e3.push(c2, r3);
        });
        getCurrentInstance() && (Ks(() => {
          a2.dispose();
        }), onDeactivated(() => {
          s2.value = true;
        }), onActivated(() => {
          s2.value = false;
        }));
        return a2;
      }(r2, e2, t2);
    }
    __name(useHead$1, "useHead$1");
    function createHead(e2 = {}) {
      const t2 = function(e3 = {}) {
        const t3 = createUnhead({ ...e3, document: false, propResolvers: [...e3.propResolvers || [], (e4, t4) => e4 && e4.startsWith("on") && "function" == typeof t4 ? `this.dataset.${e4}fired = true` : t4], init: [e3.disableDefaults ? void 0 : { htmlAttrs: { lang: "en" }, meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }] }, ...e3.init || []] });
        return t3._ssrPayload = {}, t3.use({ key: "server", hooks: { "tags:resolve": function(e4) {
          const r2 = e4.tagMap.get("title"), s2 = e4.tagMap.get("titleTemplate");
          let a2 = { title: "server" === r2?.mode ? t3._title : void 0, titleTemplate: "server" === s2?.mode ? t3._titleTemplate : void 0 };
          Object.keys(t3._ssrPayload || {}).length > 0 && (a2 = { ...t3._ssrPayload, ...a2 }), Object.values(a2).some(Boolean) && e4.tags.push({ tag: "script", innerHTML: JSON.stringify(a2), props: { id: "unhead:payload", type: "application/json" } });
        } } }), t3;
      }({ ...e2, propResolvers: [VueResolver] });
      return t2.install = function(e3) {
        return { install(t3) {
          t3.config.globalProperties.$unhead = e3, t3.config.globalProperties.$head = e3, t3.provide(Ta, e3);
        } }.install;
      }(t2), t2;
    }
    __name(createHead, "createHead");
    const Ca = makeMap(",key,ref,innerHTML,textContent,ref_key,ref_for");
    function ssrRenderAttrs(e2, t2) {
      let r2 = "";
      for (const s2 in e2) {
        if (Ca(s2) || isOn(s2) || "textarea" === t2 && "value" === s2)
          continue;
        const a2 = e2[s2];
        r2 += "class" === s2 ? ` class="${ssrRenderClass(a2)}"` : "style" === s2 ? ` style="${ssrRenderStyle(a2)}"` : "className" === s2 ? ` class="${String(a2)}"` : ssrRenderDynamicAttr(s2, a2, t2);
      }
      return r2;
    }
    __name(ssrRenderAttrs, "ssrRenderAttrs");
    function ssrRenderDynamicAttr(e2, t2, r2) {
      if (!isRenderableAttrValue(t2))
        return "";
      const s2 = r2 && (r2.indexOf("-") > 0 || oo(r2)) ? e2 : fo[e2] || e2.toLowerCase();
      return lo(s2) ? includeBooleanAttr(t2) ? ` ${s2}` : "" : isSSRSafeAttrName(s2) ? "" === t2 ? ` ${s2}` : ` ${s2}="${escapeHtml$1(t2)}"` : (console.warn(`[@vue/server-renderer] Skipped rendering unsafe attribute name: ${s2}`), "");
    }
    __name(ssrRenderDynamicAttr, "ssrRenderDynamicAttr");
    function ssrRenderClass(e2) {
      return escapeHtml$1(normalizeClass(e2));
    }
    __name(ssrRenderClass, "ssrRenderClass");
    function ssrRenderStyle(e2) {
      if (!e2)
        return "";
      if (isString(e2))
        return escapeHtml$1(e2);
      const t2 = normalizeStyle(function(e3) {
        if (!jr(e3) && isObject(e3)) {
          const t3 = {};
          for (const r2 in e3)
            r2.startsWith(":--") ? t3[r2.slice(1)] = normalizeCssVarValue(e3[r2]) : t3[r2] = e3[r2];
          return t3;
        }
        return e3;
      }(e2));
      return escapeHtml$1(stringifyStyle(t2));
    }
    __name(ssrRenderStyle, "ssrRenderStyle");
    function ssrRenderComponent(e2, t2 = null, r2 = null, s2 = null, a2) {
      return renderComponentVNode(createVNode(e2, t2, r2), s2, a2);
    }
    __name(ssrRenderComponent, "ssrRenderComponent");
    const { ensureValidVNode: ka } = Pi;
    function ssrInterpolate(e2) {
      return escapeHtml$1(toDisplayString(e2));
    }
    __name(ssrInterpolate, "ssrInterpolate");
    {
      const e2 = getGlobalThis(), registerGlobalSetter = /* @__PURE__ */ __name((t2, r2) => {
        let s2;
        return (s2 = e2[t2]) || (s2 = e2[t2] = []), s2.push(r2), (e3) => {
          s2.length > 1 ? s2.forEach((t3) => t3(e3)) : s2[0](e3);
        };
      }, "registerGlobalSetter");
      registerGlobalSetter("__VUE_INSTANCE_SETTERS__", (e3) => e3), registerGlobalSetter("__VUE_SSR_SETTERS__", (e3) => e3);
    }
    const { createComponentInstance: Ra, setCurrentRenderingInstance: Aa, setupComponent: Na, renderComponentRoot: Oa, normalizeVNode: Ia, pushWarningContext: Pa, popWarningContext: La } = Pi;
    function createBuffer() {
      let e2 = false;
      const t2 = [];
      return { getBuffer: () => t2, push(r2) {
        const s2 = isString(r2);
        e2 && s2 ? t2[t2.length - 1] += r2 : (t2.push(r2), e2 = s2, (isPromise(r2) || jr(r2) && r2.hasAsync) && (t2.hasAsync = true));
      } };
    }
    __name(createBuffer, "createBuffer");
    function renderComponentVNode(e2, t2 = null, r2) {
      const s2 = e2.component = Ra(e2, t2, null), a2 = Na(s2, true), c2 = isPromise(a2);
      let p2 = s2.sp;
      if (c2 || p2) {
        return Promise.resolve(a2).then(() => {
          if (c2 && (p2 = s2.sp), p2)
            return Promise.all(p2.map((e3) => e3.call(s2.proxy)));
        }).catch(NOOP).then(() => renderComponentSubTree(s2, r2));
      }
      return renderComponentSubTree(s2, r2);
    }
    __name(renderComponentVNode, "renderComponentVNode");
    function renderComponentSubTree(e2, t2) {
      const r2 = e2.type, { getBuffer: s2, push: a2 } = createBuffer();
      if (isFunction(r2)) {
        let s3 = Oa(e2);
        if (!r2.props)
          for (const t3 in e2.attrs)
            t3.startsWith("data-v-") && ((s3.props || (s3.props = {}))[t3] = "");
        renderVNode(a2, e2.subTree = s3, e2, t2);
      } else {
        e2.render && e2.render !== NOOP || e2.ssrRender || r2.ssrRender || !isString(r2.template) || (r2.ssrRender = function() {
          throw new Error("On-the-fly template compilation is not supported in the ESM build of @vue/server-renderer. All templates must be pre-compiled into render functions.");
        }(r2.template));
        const s3 = e2.ssrRender || r2.ssrRender;
        if (s3) {
          let r3 = false !== e2.inheritAttrs ? e2.attrs : void 0, c2 = false, p2 = e2;
          for (; ; ) {
            const e3 = p2.vnode.scopeId;
            e3 && (c2 || (r3 = { ...r3 }, c2 = true), r3[e3] = "");
            const t3 = p2.parent;
            if (!t3 || !t3.subTree || t3.subTree !== p2.vnode)
              break;
            p2 = t3;
          }
          if (t2) {
            c2 || (r3 = { ...r3 });
            const e3 = t2.trim().split(" ");
            for (let t3 = 0; t3 < e3.length; t3++)
              r3[e3[t3]] = "";
          }
          const u2 = Aa(e2);
          try {
            s3(e2.proxy, a2, e2, r3, e2.props, e2.setupState, e2.data, e2.ctx);
          } finally {
            Aa(u2);
          }
        } else
          e2.render && e2.render !== NOOP ? renderVNode(a2, e2.subTree = Oa(e2), e2, t2) : (r2.name || r2.__file, a2("<!---->"));
      }
      return s2();
    }
    __name(renderComponentSubTree, "renderComponentSubTree");
    function renderVNode(e2, t2, r2, s2) {
      const { type: a2, shapeFlag: c2, children: p2, dirs: u2, props: d2 } = t2;
      switch (u2 && (t2.props = function(e3, t3, r3) {
        const s3 = [];
        for (let t4 = 0; t4 < r3.length; t4++) {
          const a3 = r3[t4], { dir: { getSSRProps: c3 } } = a3;
          if (c3) {
            const t5 = c3(a3, e3);
            t5 && s3.push(t5);
          }
        }
        return mergeProps(t3 || {}, ...s3);
      }(t2, d2, u2)), a2) {
        case hi:
          e2(escapeHtml$1(p2));
          break;
        case mi:
          e2(p2 ? `<!--${escapeHtmlComment(p2)}-->` : "<!---->");
          break;
        case gi:
          e2(p2);
          break;
        case fi:
          t2.slotScopeIds && (s2 = (s2 ? s2 + " " : "") + t2.slotScopeIds.join(" ")), e2("<!--[-->"), renderVNodeChildren(e2, p2, r2, s2), e2("<!--]-->");
          break;
        default:
          1 & c2 ? function(e3, t3, r3, s3) {
            const a3 = t3.type;
            let { props: c3, children: p3, shapeFlag: u3, scopeId: d3 } = t3, f2 = `<${a3}`;
            c3 && (f2 += ssrRenderAttrs(c3, a3));
            d3 && (f2 += ` ${d3}`);
            let m2 = r3, g2 = t3;
            for (; m2 && g2 === m2.subTree; )
              g2 = m2.vnode, g2.scopeId && (f2 += ` ${g2.scopeId}`), m2 = m2.parent;
            s3 && (f2 += ` ${s3}`);
            if (e3(f2 + ">"), !io(a3)) {
              let t4 = false;
              c3 && (c3.innerHTML ? (t4 = true, e3(c3.innerHTML)) : c3.textContent ? (t4 = true, e3(escapeHtml$1(c3.textContent))) : "textarea" === a3 && c3.value && (t4 = true, e3(escapeHtml$1(c3.value)))), t4 || (8 & u3 ? e3(escapeHtml$1(p3)) : 16 & u3 && renderVNodeChildren(e3, p3, r3, s3)), e3(`</${a3}>`);
            }
          }(e2, t2, r2, s2) : 6 & c2 ? e2(renderComponentVNode(t2, r2, s2)) : 64 & c2 ? function(e3, t3, r3, s3) {
            const a3 = t3.props && t3.props.to, c3 = t3.props && t3.props.disabled;
            if (!a3)
              return [];
            if (!isString(a3))
              return [];
            !function(e4, t4, r4, s4, a4) {
              e4("<!--teleport start-->");
              const c4 = a4.appContext.provides[pi], p3 = c4.__teleportBuffers || (c4.__teleportBuffers = {}), u3 = p3[r4] || (p3[r4] = []), d3 = u3.length;
              let f2;
              if (s4)
                t4(e4), f2 = "<!--teleport start anchor--><!--teleport anchor-->";
              else {
                const { getBuffer: e5, push: r5 } = createBuffer();
                r5("<!--teleport start anchor-->"), t4(r5), r5("<!--teleport anchor-->"), f2 = e5();
              }
              u3.splice(d3, 0, f2), e4("<!--teleport end-->");
            }(e3, (e4) => {
              renderVNodeChildren(e4, t3.children, r3, s3);
            }, a3, c3 || "" === c3, r3);
          }(e2, t2, r2, s2) : 128 & c2 && renderVNode(e2, t2.ssContent, r2, s2);
      }
    }
    __name(renderVNode, "renderVNode");
    function renderVNodeChildren(e2, t2, r2, s2) {
      for (let a2 = 0; a2 < t2.length; a2++)
        renderVNode(e2, Ia(t2[a2]), r2, s2);
    }
    __name(renderVNodeChildren, "renderVNodeChildren");
    const { isVNode: Ma } = Pi;
    function nestedUnrollBuffer(e2, t2, r2) {
      if (!e2.hasAsync)
        return t2 + unrollBufferSync$1(e2);
      let s2 = t2;
      for (let t3 = r2; t3 < e2.length; t3 += 1) {
        const r3 = e2[t3];
        if (isString(r3)) {
          s2 += r3;
          continue;
        }
        if (isPromise(r3))
          return r3.then((r4) => (e2[t3] = r4, nestedUnrollBuffer(e2, s2, t3)));
        const a2 = nestedUnrollBuffer(r3, s2, 0);
        if (isPromise(a2))
          return a2.then((r4) => (e2[t3] = r4, nestedUnrollBuffer(e2, "", t3)));
        s2 = a2;
      }
      return s2;
    }
    __name(nestedUnrollBuffer, "nestedUnrollBuffer");
    function unrollBuffer$1(e2) {
      return nestedUnrollBuffer(e2, "", 0);
    }
    __name(unrollBuffer$1, "unrollBuffer$1");
    function unrollBufferSync$1(e2) {
      let t2 = "";
      for (let r2 = 0; r2 < e2.length; r2++) {
        let s2 = e2[r2];
        isString(s2) ? t2 += s2 : t2 += unrollBufferSync$1(s2);
      }
      return t2;
    }
    __name(unrollBufferSync$1, "unrollBufferSync$1");
    async function renderToString(e2, t2 = {}) {
      if (Ma(e2))
        return renderToString(createApp({ render: () => e2 }), t2);
      const r2 = createVNode(e2._component, e2._props);
      r2.appContext = e2._context, e2.provide(pi, t2);
      const s2 = await renderComponentVNode(r2), a2 = await unrollBuffer$1(s2);
      if (await async function(e3) {
        if (e3.__teleportBuffers) {
          e3.teleports = e3.teleports || {};
          for (const t3 in e3.__teleportBuffers)
            e3.teleports[t3] = await unrollBuffer$1(await Promise.all([e3.__teleportBuffers[t3]]));
        }
      }(t2), t2.__watcherHandles)
        for (const e3 of t2.__watcherHandles)
          e3();
      return a2;
    }
    __name(renderToString, "renderToString");
    const { isVNode: $a } = Pi;
    initDirectivesForSSR();
    const Ba = { meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }, { charset: "utf-8" }], link: [], style: [], script: [], noscript: [] }, ja = { id: "teleports" }, Da = { id: "__nuxt-loader" };
    function buildAssetsURL(...e2) {
      return joinRelativeURL(publicAssetsURL(), useRuntimeConfig$1().app.buildAssetsDir, ...e2);
    }
    __name(buildAssetsURL, "buildAssetsURL");
    function publicAssetsURL(...e2) {
      const t2 = useRuntimeConfig$1().app, r2 = t2.cdnURL || t2.baseURL;
      return e2.length ? joinRelativeURL(r2, ...e2) : r2;
    }
    __name(publicAssetsURL, "publicAssetsURL");
    const Ha = `<div${propsToString({ id: "__nuxt" })}>`, Ua = "</div>", getClientManifest = /* @__PURE__ */ __name(() => Promise.resolve().then(function() {
      return Op;
    }).then((e2) => e2.default || e2).then((e2) => "function" == typeof e2 ? e2() : e2), "getClientManifest"), Va = lazyCachedFunction(async () => {
      const e2 = await getClientManifest();
      if (!e2)
        throw new Error("client.manifest is not available");
      const t2 = await Promise.resolve().then(function() {
        return Np;
      }).then((e3) => e3.default || e3);
      if (!t2)
        throw new Error("Server bundle is not available");
      return createRenderer$1(t2, { manifest: e2, renderToString: async function(e3, t3) {
        const r2 = await renderToString(e3, t3);
        return Ha + r2 + Ua;
      }, buildAssetsURL });
    }), Fa = lazyCachedFunction(async () => {
      const e2 = await getClientManifest(), t2 = await Promise.resolve().then(function() {
        return Ip;
      }).then((e3) => e3.template).catch(() => "").then((e3) => {
        {
          const t3 = `<div${propsToString(Da)}>`;
          return Ha + Ua + (e3 ? t3 + e3 + "</div>" : "");
        }
      }), r2 = createRenderer$1(() => () => {
      }, { manifest: e2, renderToString: () => t2, buildAssetsURL }), s2 = await r2.renderToString({});
      return { rendererContext: r2.rendererContext, renderToString: (e3) => {
        const t3 = useRuntimeConfig$1(e3.event);
        return e3.modules ||= /* @__PURE__ */ new Set(), e3.payload.serverRendered = false, e3.config = { public: t3.public, app: t3.app }, Promise.resolve(s2);
      } };
    });
    function lazyCachedFunction(e2) {
      let t2 = null;
      return () => (null === t2 && (t2 = e2().catch((e3) => {
        throw t2 = null, e3;
      })), t2);
    }
    __name(lazyCachedFunction, "lazyCachedFunction");
    const za = lazyCachedFunction(() => Promise.resolve().then(function() {
      return Lp;
    }).then((e2) => e2.default || e2)), qa = { "<": "\\u003C", "\\": "\\\\", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "	": "\\t", "\u2028": "\\u2028", "\u2029": "\\u2029" };
    class DevalueError extends Error {
      constructor(e2, t2) {
        super(e2), this.name = "DevalueError", this.path = t2.join("");
      }
    }
    __name(DevalueError, "DevalueError");
    function is_primitive(e2) {
      return Object(e2) !== e2;
    }
    __name(is_primitive, "is_primitive");
    const Wa = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
    function is_plain_object(e2) {
      const t2 = Object.getPrototypeOf(e2);
      return t2 === Object.prototype || null === t2 || Object.getOwnPropertyNames(t2).sort().join("\0") === Wa;
    }
    __name(is_plain_object, "is_plain_object");
    function get_type(e2) {
      return Object.prototype.toString.call(e2).slice(8, -1);
    }
    __name(get_type, "get_type");
    function get_escaped_char(e2) {
      switch (e2) {
        case '"':
          return '\\"';
        case "<":
          return "\\u003C";
        case "\\":
          return "\\\\";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case "	":
          return "\\t";
        case "\b":
          return "\\b";
        case "\f":
          return "\\f";
        case "\u2028":
          return "\\u2028";
        case "\u2029":
          return "\\u2029";
        default:
          return e2 < " " ? `\\u${e2.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
      }
    }
    __name(get_escaped_char, "get_escaped_char");
    function stringify_string(e2) {
      let t2 = "", r2 = 0;
      const s2 = e2.length;
      for (let a2 = 0; a2 < s2; a2 += 1) {
        const s3 = get_escaped_char(e2[a2]);
        s3 && (t2 += e2.slice(r2, a2) + s3, r2 = a2 + 1);
      }
      return `"${0 === r2 ? e2 : t2 + e2.slice(r2)}"`;
    }
    __name(stringify_string, "stringify_string");
    function enumerable_symbols(e2) {
      return Object.getOwnPropertySymbols(e2).filter((t2) => Object.getOwnPropertyDescriptor(e2, t2).enumerable);
    }
    __name(enumerable_symbols, "enumerable_symbols");
    const Ka = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
    function stringify_key(e2) {
      return Ka.test(e2) ? "." + e2 : "[" + JSON.stringify(e2) + "]";
    }
    __name(stringify_key, "stringify_key");
    const Xa = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$", Ga = /[<\b\f\n\r\t\0\u2028\u2029]/g, Ja = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
    function uneval(e2, t2) {
      const r2 = /* @__PURE__ */ new Map(), s2 = [], a2 = /* @__PURE__ */ new Map();
      !(/* @__PURE__ */ __name(function walk2(e3) {
        if ("function" == typeof e3)
          throw new DevalueError("Cannot stringify a function", s2);
        if (!is_primitive(e3)) {
          if (r2.has(e3))
            return void r2.set(e3, r2.get(e3) + 1);
          r2.set(e3, 1);
          switch (get_type(e3)) {
            case "Number":
            case "BigInt":
            case "String":
            case "Boolean":
            case "Date":
            case "RegExp":
            case "Int8Array":
            case "Uint8Array":
            case "Uint8ClampedArray":
            case "Int16Array":
            case "Uint16Array":
            case "Int32Array":
            case "Uint32Array":
            case "Float32Array":
            case "Float64Array":
            case "BigInt64Array":
            case "BigUint64Array":
            case "ArrayBuffer":
              return;
            case "Array":
              e3.forEach((e4, t3) => {
                s2.push(`[${t3}]`), walk2(e4), s2.pop();
              });
              break;
            case "Set":
              Array.from(e3).forEach(walk2);
              break;
            case "Map":
              for (const [t3, r3] of e3)
                s2.push(`.get(${is_primitive(t3) ? stringify_primitive$1(t3) : "..."})`), walk2(r3), s2.pop();
              break;
            default:
              if (!is_plain_object(e3))
                throw new DevalueError("Cannot stringify arbitrary non-POJOs", s2);
              if (enumerable_symbols(e3).length > 0)
                throw new DevalueError("Cannot stringify POJOs with symbolic keys", s2);
              for (const t3 in e3)
                s2.push(stringify_key(t3)), walk2(e3[t3]), s2.pop();
          }
        }
      }, "walk"))(e2);
      const c2 = /* @__PURE__ */ new Map();
      function stringify2(e3) {
        if (c2.has(e3))
          return c2.get(e3);
        if (is_primitive(e3))
          return stringify_primitive$1(e3);
        if (a2.has(e3))
          return a2.get(e3);
        const t3 = get_type(e3);
        switch (t3) {
          case "Number":
          case "String":
          case "Boolean":
            return `Object(${stringify2(e3.valueOf())})`;
          case "RegExp":
            return `new RegExp(${stringify_string(e3.source)}, "${e3.flags}")`;
          case "Date":
            return `new Date(${e3.getTime()})`;
          case "Array":
            const r3 = e3.map((t4, r4) => r4 in e3 ? stringify2(t4) : ""), s3 = 0 === e3.length || e3.length - 1 in e3 ? "" : ",";
            return `[${r3.join(",")}${s3}]`;
          case "Set":
          case "Map":
            return `new ${t3}([${Array.from(e3).map(stringify2).join(",")}])`;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array":
            return `new ${t3}([${e3.toString()}])`;
          case "ArrayBuffer":
            return `new Uint8Array([${new Uint8Array(e3).toString()}]).buffer`;
          default:
            const a3 = `{${Object.keys(e3).map((t4) => `${function(e4) {
              return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(e4) ? e4 : escape_unsafe_chars(JSON.stringify(e4));
            }(t4)}:${stringify2(e3[t4])}`).join(",")}}`;
            return null === Object.getPrototypeOf(e3) ? Object.keys(e3).length > 0 ? `Object.assign(Object.create(null),${a3})` : "Object.create(null)" : a3;
        }
      }
      __name(stringify2, "stringify");
      Array.from(r2).filter((e3) => e3[1] > 1).sort((e3, t3) => t3[1] - e3[1]).forEach((e3, t3) => {
        c2.set(e3[0], function(e4) {
          let t4 = "";
          do {
            t4 = Xa[e4 % 54] + t4, e4 = ~~(e4 / 54) - 1;
          } while (e4 >= 0);
          return Ja.test(t4) ? `${t4}0` : t4;
        }(t3));
      });
      const p2 = stringify2(e2);
      if (c2.size) {
        const e3 = [], t3 = [], r3 = [];
        return c2.forEach((s3, c3) => {
          if (e3.push(s3), a2.has(c3))
            return void r3.push(a2.get(c3));
          if (is_primitive(c3))
            return void r3.push(stringify_primitive$1(c3));
          switch (get_type(c3)) {
            case "Number":
            case "String":
            case "Boolean":
              r3.push(`Object(${stringify2(c3.valueOf())})`);
              break;
            case "RegExp":
              r3.push(c3.toString());
              break;
            case "Date":
              r3.push(`new Date(${c3.getTime()})`);
              break;
            case "Array":
              r3.push(`Array(${c3.length})`), c3.forEach((e4, r4) => {
                t3.push(`${s3}[${r4}]=${stringify2(e4)}`);
              });
              break;
            case "Set":
              r3.push("new Set"), t3.push(`${s3}.${Array.from(c3).map((e4) => `add(${stringify2(e4)})`).join(".")}`);
              break;
            case "Map":
              r3.push("new Map"), t3.push(`${s3}.${Array.from(c3).map(([e4, t4]) => `set(${stringify2(e4)}, ${stringify2(t4)})`).join(".")}`);
              break;
            default:
              r3.push(null === Object.getPrototypeOf(c3) ? "Object.create(null)" : "{}"), Object.keys(c3).forEach((e4) => {
                t3.push(`${s3}${function(e5) {
                  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(e5) ? `.${e5}` : `[${escape_unsafe_chars(JSON.stringify(e5))}]`;
                }(e4)}=${stringify2(c3[e4])}`);
              });
          }
        }), t3.push(`return ${p2}`), `(function(${e3.join(",")}){${t3.join(";")}}(${r3.join(",")}))`;
      }
      return p2;
    }
    __name(uneval, "uneval");
    function escape_unsafe_char(e2) {
      return qa[e2] || e2;
    }
    __name(escape_unsafe_char, "escape_unsafe_char");
    function escape_unsafe_chars(e2) {
      return e2.replace(Ga, escape_unsafe_char);
    }
    __name(escape_unsafe_chars, "escape_unsafe_chars");
    function stringify_primitive$1(e2) {
      if ("string" == typeof e2)
        return stringify_string(e2);
      if (void 0 === e2)
        return "void 0";
      if (0 === e2 && 1 / e2 < 0)
        return "-0";
      const t2 = String(e2);
      return "number" == typeof e2 ? t2.replace(/^(-)?0\./, "$1.") : "bigint" == typeof e2 ? e2 + "n" : t2;
    }
    __name(stringify_primitive$1, "stringify_primitive$1");
    function encode64(e2) {
      const t2 = new DataView(e2);
      let r2 = "";
      for (let s2 = 0; s2 < e2.byteLength; s2++)
        r2 += String.fromCharCode(t2.getUint8(s2));
      return function(e3) {
        let t3 = "";
        for (let r3 = 0; r3 < e3.length; r3 += 3) {
          const s2 = [void 0, void 0, void 0, void 0];
          s2[0] = e3.charCodeAt(r3) >> 2, s2[1] = (3 & e3.charCodeAt(r3)) << 4, e3.length > r3 + 1 && (s2[1] |= e3.charCodeAt(r3 + 1) >> 4, s2[2] = (15 & e3.charCodeAt(r3 + 1)) << 2), e3.length > r3 + 2 && (s2[2] |= e3.charCodeAt(r3 + 2) >> 6, s2[3] = 63 & e3.charCodeAt(r3 + 2));
          for (let e4 = 0; e4 < s2.length; e4++)
            void 0 === s2[e4] ? t3 += "=" : t3 += Ya[s2[e4]];
        }
        return t3;
      }(r2);
    }
    __name(encode64, "encode64");
    const Ya = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function stringify(e2, t2) {
      const r2 = [], s2 = /* @__PURE__ */ new Map(), a2 = [];
      if (t2)
        for (const e3 of Object.getOwnPropertyNames(t2))
          a2.push({ key: e3, fn: t2[e3] });
      const c2 = [];
      let p2 = 0;
      const u2 = (/* @__PURE__ */ __name(function flatten(e3) {
        if ("function" == typeof e3)
          throw new DevalueError("Cannot stringify a function", c2);
        if (s2.has(e3))
          return s2.get(e3);
        if (void 0 === e3)
          return -1;
        if (Number.isNaN(e3))
          return -3;
        if (e3 === 1 / 0)
          return -4;
        if (e3 === -1 / 0)
          return -5;
        if (0 === e3 && 1 / e3 < 0)
          return -6;
        const t3 = p2++;
        s2.set(e3, t3);
        for (const { key: s3, fn: c3 } of a2) {
          const a3 = c3(e3);
          if (a3)
            return r2[t3] = `["${s3}",${flatten(a3)}]`, t3;
        }
        let u3 = "";
        if (is_primitive(e3))
          u3 = stringify_primitive(e3);
        else {
          const t4 = get_type(e3);
          switch (t4) {
            case "Number":
            case "String":
            case "Boolean":
              u3 = `["Object",${stringify_primitive(e3)}]`;
              break;
            case "BigInt":
              u3 = `["BigInt",${e3}]`;
              break;
            case "Date":
              u3 = `["Date","${!isNaN(e3.getDate()) ? e3.toISOString() : ""}"]`;
              break;
            case "RegExp":
              const { source: r3, flags: s3 } = e3;
              u3 = s3 ? `["RegExp",${stringify_string(r3)},"${s3}"]` : `["RegExp",${stringify_string(r3)}]`;
              break;
            case "Array":
              u3 = "[";
              for (let t5 = 0; t5 < e3.length; t5 += 1)
                t5 > 0 && (u3 += ","), t5 in e3 ? (c2.push(`[${t5}]`), u3 += flatten(e3[t5]), c2.pop()) : u3 += -2;
              u3 += "]";
              break;
            case "Set":
              u3 = '["Set"';
              for (const t5 of e3)
                u3 += `,${flatten(t5)}`;
              u3 += "]";
              break;
            case "Map":
              u3 = '["Map"';
              for (const [t5, r4] of e3)
                c2.push(`.get(${is_primitive(t5) ? stringify_primitive(t5) : "..."})`), u3 += `,${flatten(t5)},${flatten(r4)}`, c2.pop();
              u3 += "]";
              break;
            case "Int8Array":
            case "Uint8Array":
            case "Uint8ClampedArray":
            case "Int16Array":
            case "Uint16Array":
            case "Int32Array":
            case "Uint32Array":
            case "Float32Array":
            case "Float64Array":
            case "BigInt64Array":
            case "BigUint64Array":
              u3 = '["' + t4 + '","' + encode64(e3.buffer) + '"]';
              break;
            case "ArrayBuffer":
              u3 = `["ArrayBuffer","${encode64(e3)}"]`;
              break;
            default:
              if (!is_plain_object(e3))
                throw new DevalueError("Cannot stringify arbitrary non-POJOs", c2);
              if (enumerable_symbols(e3).length > 0)
                throw new DevalueError("Cannot stringify POJOs with symbolic keys", c2);
              if (null === Object.getPrototypeOf(e3)) {
                u3 = '["null"';
                for (const t5 in e3)
                  c2.push(stringify_key(t5)), u3 += `,${stringify_string(t5)},${flatten(e3[t5])}`, c2.pop();
                u3 += "]";
              } else {
                u3 = "{";
                let t5 = false;
                for (const r4 in e3)
                  t5 && (u3 += ","), t5 = true, c2.push(stringify_key(r4)), u3 += `${stringify_string(r4)}:${flatten(e3[r4])}`, c2.pop();
                u3 += "}";
              }
          }
        }
        return r2[t3] = u3, t3;
      }, "flatten"))(e2);
      return u2 < 0 ? `${u2}` : `[${r2.join(",")}]`;
    }
    __name(stringify, "stringify");
    function stringify_primitive(e2) {
      const t2 = typeof e2;
      return "string" === t2 ? stringify_string(e2) : e2 instanceof String ? stringify_string(e2.toString()) : void 0 === e2 ? (-1).toString() : 0 === e2 && 1 / e2 < 0 ? (-6).toString() : "bigint" === t2 ? `["BigInt","${e2}"]` : String(e2);
    }
    __name(stringify_primitive, "stringify_primitive");
    function renderPayloadJsonScript(e2) {
      const t2 = { type: "application/json", innerHTML: e2.data ? stringify(e2.data, e2.ssrContext._payloadReducers) : "", "data-nuxt-data": "nuxt-app", "data-ssr": !e2.ssrContext.noSSR, id: "__NUXT_DATA__" };
      e2.src && (t2["data-src"] = e2.src);
      return [t2, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${uneval(e2.ssrContext.config)}` }];
    }
    __name(renderPayloadJsonScript, "renderPayloadJsonScript");
    function splitPayload(e2) {
      const { data: t2, prerenderedAt: r2, ...s2 } = e2.payload;
      return { initial: { ...s2, prerenderedAt: r2 }, payload: { data: t2, prerenderedAt: r2 } };
    }
    __name(splitPayload, "splitPayload");
    const Qa = { disableDefaults: true };
    const Za = {};
    globalThis.__buildAssetsURL = buildAssetsURL, globalThis.__publicAssetsURL = publicAssetsURL;
    const ec = !!ja.id, tc = ec ? `<div${propsToString(ja)}>` : "", nc = ec ? "</div>" : "", rc = /^[^?]*\/_payload.json(?:\?.*)?$/, oc = function(e2) {
      const t2 = useRuntimeConfig$1();
      return Dn(async (r2) => {
        const s2 = useNitroApp(), a2 = { event: r2, render: e2, response: void 0 };
        if (await s2.hooks.callHook("render:before", a2), !a2.response) {
          if (r2.path === `${t2.app.baseURL}favicon.ico`)
            return setResponseHeader(r2, "Content-Type", "image/x-icon"), send(r2, "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
          if (a2.response = await a2.render(r2), !a2.response) {
            const e3 = getResponseStatus(r2);
            return setResponseStatus(r2, 200 === e3 ? 500 : e3), send(r2, "No response returned from render handler: " + r2.path);
          }
        }
        return await s2.hooks.callHook("render:response", a2.response, a2), a2.response.headers && setResponseHeaders(r2, a2.response.headers), (a2.response.statusCode || a2.response.statusMessage) && setResponseStatus(r2, a2.response.statusCode, a2.response.statusMessage), a2.response.body;
      });
    }(async (e2) => {
      const t2 = useNitroApp(), r2 = e2.path.startsWith("/__nuxt_error") ? function(e3) {
        return getQuery$1(e3.path || "");
      }(e2) : null;
      if (r2 && !("__unenv__" in e2.node.req))
        throw createError$1({ statusCode: 404, statusMessage: "Page Not Found: /__nuxt_error" });
      const s2 = function(e3) {
        return { url: e3.path, event: e3, runtimeConfig: useRuntimeConfig$1(e3), noSSR: e3.context.nuxt?.noSSR || false, head: createHead(Qa), error: false, nuxt: void 0, payload: {}, _payloadReducers: /* @__PURE__ */ Object.create(null), modules: /* @__PURE__ */ new Set() };
      }(e2), a2 = { mode: "server" };
      if (s2.head.push(Ba, a2), r2) {
        if (r2.statusCode &&= Number.parseInt(r2.statusCode), "string" == typeof r2.data)
          try {
            r2.data = destr(r2.data);
          } catch {
          }
        !function(e3, t3) {
          e3.error = true, e3.payload = { error: t3 }, e3.url = t3.url;
        }(s2, r2);
      }
      const c2 = rc.test(s2.url);
      if (c2) {
        const t3 = s2.url.substring(0, s2.url.lastIndexOf("/")) || "/";
        s2.url = t3, e2._path = e2.node.req.url = t3;
      }
      const p2 = getRouteRules$1(e2);
      false === p2.ssr && (s2.noSSR = true);
      const u2 = await function(e3) {
        return e3.noSSR ? Fa() : Va();
      }(s2);
      for (const e3 of await getClientManifest().then((e4) => Object.values(e4).filter((e5) => e5._globalCSS).map((e5) => e5.src)))
        s2.modules.add(e3);
      const d2 = await u2.renderToString(s2).catch(async (e3) => {
        if (s2._renderResponse && "skipping render" === e3.message)
          return {};
        const t3 = !r2 && s2.payload?.error || e3;
        throw await s2.nuxt?.hooks.callHook("app:error", t3), t3;
      }), f2 = s2._renderResponse || c2 ? [] : await async function(e3) {
        const t3 = await za(), r3 = /* @__PURE__ */ new Set();
        for (const s3 of e3)
          if (s3 in t3 && t3[s3])
            for (const e4 of await t3[s3]())
              r3.add(e4);
        return Array.from(r3).map((e4) => ({ innerHTML: e4 }));
      }(s2.modules ?? []);
      if (await s2.nuxt?.hooks.callHook("app:rendered", { ssrContext: s2, renderResult: d2 }), s2._renderResponse)
        return s2._renderResponse;
      if (s2.payload?.error && !r2)
        throw s2.payload.error;
      if (c2) {
        const e3 = function(e4) {
          return { body: stringify(splitPayload(e4).payload, e4._payloadReducers), statusCode: getResponseStatus(e4.event), statusMessage: getResponseStatusText(e4.event), headers: { "content-type": "application/json;charset=utf-8", "x-powered-by": "Nuxt" } };
        }(s2);
        return e3;
      }
      const m2 = p2.noScripts, { styles: g2, scripts: x2 } = getRequestDependencies(s2, u2.rendererContext);
      s2._preloadManifest && !m2 && s2.head.push({ link: [{ rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${s2.runtimeConfig.app.buildId}.json`) }] }, { ...a2, tagPriority: "low" }), f2.length && s2.head.push({ style: f2 });
      const _2 = [];
      for (const e3 of Object.values(g2))
        _2.push({ rel: "stylesheet", href: u2.rendererContext.buildAssetsURL(e3.file), crossorigin: "" });
      if (_2.length && s2.head.push({ link: _2 }, a2), m2 || (s2.head.push({ link: getPreloadLinks(s2, u2.rendererContext) }, a2), s2.head.push({ link: getPrefetchLinks(s2, u2.rendererContext) }, a2), s2.head.push({ script: renderPayloadJsonScript({ ssrContext: s2, data: s2.payload }) }, { ...a2, tagPosition: "bodyClose", tagPriority: "high" })), !p2.noScripts) {
        const e3 = "head";
        s2.head.push({ script: Object.values(x2).map((t3) => ({ type: t3.module ? "module" : null, src: u2.rendererContext.buildAssetsURL(t3.file), defer: !t3.module || null, tagPosition: e3, crossorigin: "" })) }, a2);
      }
      const { headTags: E2, bodyTags: S2, bodyTagsOpen: T2, htmlAttrs: C2, bodyAttrs: R2 } = await renderSSRHead(s2.head, Za), N2 = { htmlAttrs: C2 ? [C2] : [], head: normalizeChunks([E2]), bodyAttrs: R2 ? [R2] : [], bodyPrepend: normalizeChunks([T2, s2.teleports?.body]), body: [d2.html, tc + (ec ? joinTags([s2.teleports?.[`#${ja.id}`]]) : "") + nc], bodyAppend: [S2] };
      return await t2.hooks.callHook("render:html", N2, { event: e2 }), { body: (O2 = N2, `<!DOCTYPE html><html${joinAttrs(O2.htmlAttrs)}><head>${joinTags(O2.head)}</head><body${joinAttrs(O2.bodyAttrs)}>${joinTags(O2.bodyPrepend)}${joinTags(O2.body)}${joinTags(O2.bodyAppend)}</body></html>`), statusCode: getResponseStatus(e2), statusMessage: getResponseStatusText(e2), headers: { "content-type": "text/html;charset=utf-8", "x-powered-by": "Nuxt" } };
      var O2;
    });
    function normalizeChunks(e2) {
      return e2.filter(Boolean).map((e3) => e3.trim());
    }
    __name(normalizeChunks, "normalizeChunks");
    function joinTags(e2) {
      return e2.join("");
    }
    __name(joinTags, "joinTags");
    function joinAttrs(e2) {
      return 0 === e2.length ? "" : " " + e2.join(" ");
    }
    __name(joinAttrs, "joinAttrs");
    const sc = Object.freeze(Object.defineProperty({ __proto__: null, default: oc }, Symbol.toStringTag, { value: "Module" }));
    var ic = { exports: {} }, ac = {};
    const cc = Symbol(""), lc = Symbol(""), pc = Symbol(""), uc = Symbol(""), dc = Symbol(""), fc = Symbol(""), hc = Symbol(""), mc = Symbol(""), gc = Symbol(""), vc = Symbol(""), yc = Symbol(""), bc = Symbol(""), xc = Symbol(""), _c = Symbol(""), Ec = Symbol(""), wc = Symbol(""), Sc = Symbol(""), Tc = Symbol(""), Cc = Symbol(""), kc = Symbol(""), Rc = Symbol(""), Ac = Symbol(""), Nc = Symbol(""), Oc = Symbol(""), Ic = Symbol(""), Pc = Symbol(""), Lc = Symbol(""), Mc = Symbol(""), $c = Symbol(""), Bc = Symbol(""), jc = Symbol(""), Dc = Symbol(""), Hc = Symbol(""), Uc = Symbol(""), Vc = Symbol(""), Fc = Symbol(""), zc = Symbol(""), qc = Symbol(""), Wc = Symbol(""), Kc = { [cc]: "Fragment", [lc]: "Teleport", [pc]: "Suspense", [uc]: "KeepAlive", [dc]: "BaseTransition", [fc]: "openBlock", [hc]: "createBlock", [mc]: "createElementBlock", [gc]: "createVNode", [vc]: "createElementVNode", [yc]: "createCommentVNode", [bc]: "createTextVNode", [xc]: "createStaticVNode", [_c]: "resolveComponent", [Ec]: "resolveDynamicComponent", [wc]: "resolveDirective", [Sc]: "resolveFilter", [Tc]: "withDirectives", [Cc]: "renderList", [kc]: "renderSlot", [Rc]: "createSlots", [Ac]: "toDisplayString", [Nc]: "mergeProps", [Oc]: "normalizeClass", [Ic]: "normalizeStyle", [Pc]: "normalizeProps", [Lc]: "guardReactiveProps", [Mc]: "toHandlers", [$c]: "camelize", [Bc]: "capitalize", [jc]: "toHandlerKey", [Dc]: "setBlockTracking", [Hc]: "pushScopeId", [Uc]: "popScopeId", [Vc]: "withCtx", [Fc]: "unref", [zc]: "isRef", [qc]: "withMemo", [Wc]: "isMemoSame" };
    function registerRuntimeHelpers(e2) {
      Object.getOwnPropertySymbols(e2).forEach((t2) => {
        Kc[t2] = e2[t2];
      });
    }
    __name(registerRuntimeHelpers, "registerRuntimeHelpers");
    const Xc = { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 1, offset: 0 }, source: "" };
    function createRoot(e2, t2 = "") {
      return { type: 0, source: t2, children: e2, helpers: /* @__PURE__ */ new Set(), components: [], directives: [], hoists: [], imports: [], cached: [], temps: 0, codegenNode: void 0, loc: Xc };
    }
    __name(createRoot, "createRoot");
    function createVNodeCall(e2, t2, r2, s2, a2, c2, p2, u2 = false, d2 = false, f2 = false, m2 = Xc) {
      return e2 && (u2 ? (e2.helper(fc), e2.helper(getVNodeBlockHelper(e2.inSSR, f2))) : e2.helper(getVNodeHelper(e2.inSSR, f2)), p2 && e2.helper(Tc)), { type: 13, tag: t2, props: r2, children: s2, patchFlag: a2, dynamicProps: c2, directives: p2, isBlock: u2, disableTracking: d2, isComponent: f2, loc: m2 };
    }
    __name(createVNodeCall, "createVNodeCall");
    function createArrayExpression(e2, t2 = Xc) {
      return { type: 17, loc: t2, elements: e2 };
    }
    __name(createArrayExpression, "createArrayExpression");
    function createObjectExpression(e2, t2 = Xc) {
      return { type: 15, loc: t2, properties: e2 };
    }
    __name(createObjectExpression, "createObjectExpression");
    function createObjectProperty(e2, t2) {
      return { type: 16, loc: Xc, key: isString(e2) ? createSimpleExpression(e2, true) : e2, value: t2 };
    }
    __name(createObjectProperty, "createObjectProperty");
    function createSimpleExpression(e2, t2 = false, r2 = Xc, s2 = 0) {
      return { type: 4, loc: r2, content: e2, isStatic: t2, constType: t2 ? 3 : s2 };
    }
    __name(createSimpleExpression, "createSimpleExpression");
    function createCompoundExpression(e2, t2 = Xc) {
      return { type: 8, loc: t2, children: e2 };
    }
    __name(createCompoundExpression, "createCompoundExpression");
    function createCallExpression(e2, t2 = [], r2 = Xc) {
      return { type: 14, loc: r2, callee: e2, arguments: t2 };
    }
    __name(createCallExpression, "createCallExpression");
    function createFunctionExpression(e2, t2 = void 0, r2 = false, s2 = false, a2 = Xc) {
      return { type: 18, params: e2, returns: t2, newline: r2, isSlot: s2, loc: a2 };
    }
    __name(createFunctionExpression, "createFunctionExpression");
    function createConditionalExpression(e2, t2, r2, s2 = true) {
      return { type: 19, test: e2, consequent: t2, alternate: r2, newline: s2, loc: Xc };
    }
    __name(createConditionalExpression, "createConditionalExpression");
    function createCacheExpression(e2, t2, r2 = false, s2 = false) {
      return { type: 20, index: e2, value: t2, needPauseTracking: r2, inVOnce: s2, needArraySpread: false, loc: Xc };
    }
    __name(createCacheExpression, "createCacheExpression");
    function createBlockStatement(e2) {
      return { type: 21, body: e2, loc: Xc };
    }
    __name(createBlockStatement, "createBlockStatement");
    function getVNodeHelper(e2, t2) {
      return e2 || t2 ? gc : vc;
    }
    __name(getVNodeHelper, "getVNodeHelper");
    function getVNodeBlockHelper(e2, t2) {
      return e2 || t2 ? hc : mc;
    }
    __name(getVNodeBlockHelper, "getVNodeBlockHelper");
    function convertToBlock(e2, { helper: t2, removeHelper: r2, inSSR: s2 }) {
      e2.isBlock || (e2.isBlock = true, r2(getVNodeHelper(s2, e2.isComponent)), t2(fc), t2(getVNodeBlockHelper(s2, e2.isComponent)));
    }
    __name(convertToBlock, "convertToBlock");
    const Gc = new Uint8Array([123, 123]), Jc = new Uint8Array([125, 125]);
    function isTagStartChar(e2) {
      return e2 >= 97 && e2 <= 122 || e2 >= 65 && e2 <= 90;
    }
    __name(isTagStartChar, "isTagStartChar");
    function isWhitespace(e2) {
      return 32 === e2 || 10 === e2 || 9 === e2 || 12 === e2 || 13 === e2;
    }
    __name(isWhitespace, "isWhitespace");
    function isEndOfTagSection(e2) {
      return 47 === e2 || 62 === e2 || isWhitespace(e2);
    }
    __name(isEndOfTagSection, "isEndOfTagSection");
    function toCharCodes(e2) {
      const t2 = new Uint8Array(e2.length);
      for (let r2 = 0; r2 < e2.length; r2++)
        t2[r2] = e2.charCodeAt(r2);
      return t2;
    }
    __name(toCharCodes, "toCharCodes");
    const Yc = { Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]), CdataEnd: new Uint8Array([93, 93, 62]), CommentEnd: new Uint8Array([45, 45, 62]), ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]), StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]), TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]), TextareaEnd: new Uint8Array([60, 47, 116, 101, 120, 116, 97, 114, 101, 97]) };
    const Qc = { COMPILER_IS_ON_ELEMENT: { message: 'Platform-native elements with "is" prop will no longer be treated as components in Vue 3 unless the "is" value is explicitly prefixed with "vue:".', link: "https://v3-migration.vuejs.org/breaking-changes/custom-elements-interop.html" }, COMPILER_V_BIND_SYNC: { message: (e2) => `.sync modifier for v-bind has been removed. Use v-model with argument instead. \`v-bind:${e2}.sync\` should be changed to \`v-model:${e2}\`.`, link: "https://v3-migration.vuejs.org/breaking-changes/v-model.html" }, COMPILER_V_BIND_OBJECT_ORDER: { message: 'v-bind="obj" usage is now order sensitive and behaves like JavaScript object spread: it will now overwrite an existing non-mergeable attribute that appears before v-bind in the case of conflict. To retain 2.x behavior, move v-bind to make it the first attribute. You can also suppress this warning if the usage is intended.', link: "https://v3-migration.vuejs.org/breaking-changes/v-bind.html" }, COMPILER_V_ON_NATIVE: { message: ".native modifier for v-on has been removed as is no longer necessary.", link: "https://v3-migration.vuejs.org/breaking-changes/v-on-native-modifier-removed.html" }, COMPILER_V_IF_V_FOR_PRECEDENCE: { message: "v-if / v-for precedence when used on the same element has changed in Vue 3: v-if now takes higher precedence and will no longer have access to v-for scope variables. It is best to avoid the ambiguity with <template> tags or use a computed property that filters v-for data source.", link: "https://v3-migration.vuejs.org/breaking-changes/v-if-v-for.html" }, COMPILER_NATIVE_TEMPLATE: { message: "<template> with no special directives will render as a native template element instead of its inner content in Vue 3." }, COMPILER_INLINE_TEMPLATE: { message: '"inline-template" has been removed in Vue 3.', link: "https://v3-migration.vuejs.org/breaking-changes/inline-template-attribute.html" }, COMPILER_FILTERS: { message: 'filters have been removed in Vue 3. The "|" symbol will be treated as native JavaScript bitwise OR operator. Use method calls or computed properties instead.', link: "https://v3-migration.vuejs.org/breaking-changes/filters.html" } };
    function getCompatValue(e2, { compatConfig: t2 }) {
      const r2 = t2 && t2[e2];
      return "MODE" === e2 ? r2 || 3 : r2;
    }
    __name(getCompatValue, "getCompatValue");
    function isCompatEnabled(e2, t2) {
      const r2 = getCompatValue("MODE", t2), s2 = getCompatValue(e2, t2);
      return 3 === r2 ? true === s2 : false !== s2;
    }
    __name(isCompatEnabled, "isCompatEnabled");
    function checkCompatEnabled(e2, t2, r2, ...s2) {
      return isCompatEnabled(e2, t2);
    }
    __name(checkCompatEnabled, "checkCompatEnabled");
    function defaultOnError(e2) {
      throw e2;
    }
    __name(defaultOnError, "defaultOnError");
    function defaultOnWarn(e2) {
    }
    __name(defaultOnWarn, "defaultOnWarn");
    function createCompilerError(e2, t2, r2, s2) {
      const a2 = new SyntaxError(String(`https://vuejs.org/error-reference/#compiler-${e2}`));
      return a2.code = e2, a2.loc = t2, a2;
    }
    __name(createCompilerError, "createCompilerError");
    const Zc = { 0: "Illegal comment.", 1: "CDATA section is allowed only in XML context.", 2: "Duplicate attribute.", 3: "End tag cannot have attributes.", 4: "Illegal '/' in tags.", 5: "Unexpected EOF in tag.", 6: "Unexpected EOF in CDATA section.", 7: "Unexpected EOF in comment.", 8: "Unexpected EOF in script.", 9: "Unexpected EOF in tag.", 10: "Incorrectly closed comment.", 11: "Incorrectly opened comment.", 12: "Illegal tag name. Use '&lt;' to print '<'.", 13: "Attribute value was expected.", 14: "End tag name was expected.", 15: "Whitespace was expected.", 16: "Unexpected '<!--' in comment.", 17: `Attribute name cannot contain U+0022 ("), U+0027 ('), and U+003C (<).`, 18: "Unquoted attribute value cannot contain U+0022 (\"), U+0027 ('), U+003C (<), U+003D (=), and U+0060 (`).", 19: "Attribute name cannot start with '='.", 21: "'<?' is allowed only in XML context.", 20: "Unexpected null character.", 22: "Illegal '/' in tags.", 23: "Invalid end tag.", 24: "Element is missing end tag.", 25: "Interpolation end sign was not found.", 27: "End bracket for dynamic directive argument was not found. Note that dynamic directive argument cannot contain spaces.", 26: "Legal directive name was expected.", 28: "v-if/v-else-if is missing expression.", 29: "v-if/else branches must use unique keys.", 30: "v-else/v-else-if has no adjacent v-if or v-else-if.", 31: "v-for is missing expression.", 32: "v-for has invalid expression.", 33: "<template v-for> key should be placed on the <template> tag.", 34: "v-bind is missing expression.", 52: "v-bind with same-name shorthand only allows static argument.", 35: "v-on is missing expression.", 36: "Unexpected custom directive on <slot> outlet.", 37: "Mixed v-slot usage on both the component and nested <template>. When there are multiple named slots, all slots should use <template> syntax to avoid scope ambiguity.", 38: "Duplicate slot names found. ", 39: "Extraneous children found when component already has explicitly named default slot. These children will be ignored.", 40: "v-slot can only be used on components or <template> tags.", 41: "v-model is missing expression.", 42: "v-model value must be a valid JavaScript member expression.", 43: "v-model cannot be used on v-for or v-slot scope variables because they are not writable.", 44: "v-model cannot be used on a prop, because local prop bindings are not writable.\nUse a v-bind binding combined with a v-on listener that emits update:x event instead.", 45: "Error parsing JavaScript expression: ", 46: "<KeepAlive> expects exactly one child component.", 51: "@vnode-* hooks in templates are no longer supported. Use the vue: prefix instead. For example, @vnode-mounted should be changed to @vue:mounted. @vnode-* hooks support has been removed in 3.4.", 47: '"prefixIdentifiers" option is not supported in this build of compiler.', 48: "ES module mode is not supported in this build of compiler.", 49: '"cacheHandlers" option is only supported when the "prefixIdentifiers" option is enabled.', 50: '"scopeId" option is only supported in module mode.', 53: "" };
    function isForStatement(e2) {
      return "ForOfStatement" === e2.type || "ForInStatement" === e2.type || "ForStatement" === e2.type;
    }
    __name(isForStatement, "isForStatement");
    function walkForStatement(e2, t2, r2) {
      const s2 = "ForStatement" === e2.type ? e2.init : e2.left;
      if (s2 && "VariableDeclaration" === s2.type && ("var" === s2.kind ? t2 : !t2))
        for (const e3 of s2.declarations)
          for (const t3 of extractIdentifiers(e3.id))
            r2(t3);
    }
    __name(walkForStatement, "walkForStatement");
    function extractIdentifiers(e2, t2 = []) {
      switch (e2.type) {
        case "Identifier":
          t2.push(e2);
          break;
        case "MemberExpression":
          let r2 = e2;
          for (; "MemberExpression" === r2.type; )
            r2 = r2.object;
          t2.push(r2);
          break;
        case "ObjectPattern":
          for (const r3 of e2.properties)
            "RestElement" === r3.type ? extractIdentifiers(r3.argument, t2) : extractIdentifiers(r3.value, t2);
          break;
        case "ArrayPattern":
          e2.elements.forEach((e3) => {
            e3 && extractIdentifiers(e3, t2);
          });
          break;
        case "RestElement":
          extractIdentifiers(e2.argument, t2);
          break;
        case "AssignmentPattern":
          extractIdentifiers(e2.left, t2);
      }
      return t2;
    }
    __name(extractIdentifiers, "extractIdentifiers");
    const isStaticProperty = /* @__PURE__ */ __name((e2) => e2 && ("ObjectProperty" === e2.type || "ObjectMethod" === e2.type) && !e2.computed, "isStaticProperty"), el = ["TSAsExpression", "TSTypeAssertion", "TSNonNullExpression", "TSInstantiationExpression", "TSSatisfiesExpression"];
    const isStaticExp = /* @__PURE__ */ __name((e2) => 4 === e2.type && e2.isStatic, "isStaticExp");
    function isCoreComponent(e2) {
      switch (e2) {
        case "Teleport":
        case "teleport":
          return lc;
        case "Suspense":
        case "suspense":
          return pc;
        case "KeepAlive":
        case "keep-alive":
          return uc;
        case "BaseTransition":
        case "base-transition":
          return dc;
      }
    }
    __name(isCoreComponent, "isCoreComponent");
    const tl = /^$|^\d|[^\$\w\xA0-\uFFFF]/, isSimpleIdentifier = /* @__PURE__ */ __name((e2) => !tl.test(e2), "isSimpleIdentifier"), nl = /[A-Za-z_$\xA0-\uFFFF]/, rl = /[\.\?\w$\xA0-\uFFFF]/, ol = /\s+[.[]\s*|\s*[.[]\s+/g, getExpSource = /* @__PURE__ */ __name((e2) => 4 === e2.type ? e2.content : e2.loc.source, "getExpSource"), isMemberExpressionBrowser = /* @__PURE__ */ __name((e2) => {
      const t2 = getExpSource(e2).trim().replace(ol, (e3) => e3.trim());
      let r2 = 0, s2 = [], a2 = 0, c2 = 0, p2 = null;
      for (let e3 = 0; e3 < t2.length; e3++) {
        const u2 = t2.charAt(e3);
        switch (r2) {
          case 0:
            if ("[" === u2)
              s2.push(r2), r2 = 1, a2++;
            else if ("(" === u2)
              s2.push(r2), r2 = 2, c2++;
            else if (!(0 === e3 ? nl : rl).test(u2))
              return false;
            break;
          case 1:
            "'" === u2 || '"' === u2 || "`" === u2 ? (s2.push(r2), r2 = 3, p2 = u2) : "[" === u2 ? a2++ : "]" === u2 && (--a2 || (r2 = s2.pop()));
            break;
          case 2:
            if ("'" === u2 || '"' === u2 || "`" === u2)
              s2.push(r2), r2 = 3, p2 = u2;
            else if ("(" === u2)
              c2++;
            else if (")" === u2) {
              if (e3 === t2.length - 1)
                return false;
              --c2 || (r2 = s2.pop());
            }
            break;
          case 3:
            u2 === p2 && (r2 = s2.pop(), p2 = null);
        }
      }
      return !a2 && !c2;
    }, "isMemberExpressionBrowser"), sl = NOOP, il = isMemberExpressionBrowser, al = /^\s*(async\s*)?(\([^)]*?\)|[\w$_]+)\s*(:[^=]+)?=>|^\s*(async\s+)?function(?:\s+[\w$]+)?\s*\(/, isFnExpressionBrowser = /* @__PURE__ */ __name((e2) => al.test(getExpSource(e2)), "isFnExpressionBrowser"), cl = NOOP, ll = isFnExpressionBrowser;
    function advancePositionWithMutation(e2, t2, r2 = t2.length) {
      let s2 = 0, a2 = -1;
      for (let e3 = 0; e3 < r2; e3++)
        10 === t2.charCodeAt(e3) && (s2++, a2 = e3);
      return e2.offset += r2, e2.line += s2, e2.column = -1 === a2 ? e2.column + r2 : r2 - a2, e2;
    }
    __name(advancePositionWithMutation, "advancePositionWithMutation");
    function findDir(e2, t2, r2 = false) {
      for (let s2 = 0; s2 < e2.props.length; s2++) {
        const a2 = e2.props[s2];
        if (7 === a2.type && (r2 || a2.exp) && (isString(t2) ? a2.name === t2 : t2.test(a2.name)))
          return a2;
      }
    }
    __name(findDir, "findDir");
    function findProp(e2, t2, r2 = false, s2 = false) {
      for (let a2 = 0; a2 < e2.props.length; a2++) {
        const c2 = e2.props[a2];
        if (6 === c2.type) {
          if (r2)
            continue;
          if (c2.name === t2 && (c2.value || s2))
            return c2;
        } else if ("bind" === c2.name && (c2.exp || s2) && isStaticArgOf(c2.arg, t2))
          return c2;
      }
    }
    __name(findProp, "findProp");
    function isStaticArgOf(e2, t2) {
      return !(!e2 || !isStaticExp(e2) || e2.content !== t2);
    }
    __name(isStaticArgOf, "isStaticArgOf");
    function hasDynamicKeyVBind(e2) {
      return e2.props.some((e3) => !(7 !== e3.type || "bind" !== e3.name || e3.arg && 4 === e3.arg.type && e3.arg.isStatic));
    }
    __name(hasDynamicKeyVBind, "hasDynamicKeyVBind");
    function isText$1(e2) {
      return 5 === e2.type || 2 === e2.type;
    }
    __name(isText$1, "isText$1");
    function isVPre(e2) {
      return 7 === e2.type && "pre" === e2.name;
    }
    __name(isVPre, "isVPre");
    function isVSlot(e2) {
      return 7 === e2.type && "slot" === e2.name;
    }
    __name(isVSlot, "isVSlot");
    function isTemplateNode(e2) {
      return 1 === e2.type && 3 === e2.tagType;
    }
    __name(isTemplateNode, "isTemplateNode");
    function isSlotOutlet(e2) {
      return 1 === e2.type && 2 === e2.tagType;
    }
    __name(isSlotOutlet, "isSlotOutlet");
    const pl = /* @__PURE__ */ new Set([Pc, Lc]);
    function getUnnormalizedProps(e2, t2 = []) {
      if (e2 && !isString(e2) && 14 === e2.type) {
        const r2 = e2.callee;
        if (!isString(r2) && pl.has(r2))
          return getUnnormalizedProps(e2.arguments[0], t2.concat(e2));
      }
      return [e2, t2];
    }
    __name(getUnnormalizedProps, "getUnnormalizedProps");
    function injectProp(e2, t2, r2) {
      let s2, a2, c2 = 13 === e2.type ? e2.props : e2.arguments[2], p2 = [];
      if (c2 && !isString(c2) && 14 === c2.type) {
        const e3 = getUnnormalizedProps(c2);
        c2 = e3[0], p2 = e3[1], a2 = p2[p2.length - 1];
      }
      if (null == c2 || isString(c2))
        s2 = createObjectExpression([t2]);
      else if (14 === c2.type) {
        const e3 = c2.arguments[0];
        isString(e3) || 15 !== e3.type ? c2.callee === Mc ? s2 = createCallExpression(r2.helper(Nc), [createObjectExpression([t2]), c2]) : c2.arguments.unshift(createObjectExpression([t2])) : hasProp(t2, e3) || e3.properties.unshift(t2), !s2 && (s2 = c2);
      } else
        15 === c2.type ? (hasProp(t2, c2) || c2.properties.unshift(t2), s2 = c2) : (s2 = createCallExpression(r2.helper(Nc), [createObjectExpression([t2]), c2]), a2 && a2.callee === Lc && (a2 = p2[p2.length - 2]));
      13 === e2.type ? a2 ? a2.arguments[0] = s2 : e2.props = s2 : a2 ? a2.arguments[0] = s2 : e2.arguments[2] = s2;
    }
    __name(injectProp, "injectProp");
    function hasProp(e2, t2) {
      let r2 = false;
      if (4 === e2.key.type) {
        const s2 = e2.key.content;
        r2 = t2.properties.some((e3) => 4 === e3.key.type && e3.key.content === s2);
      }
      return r2;
    }
    __name(hasProp, "hasProp");
    function toValidAssetId(e2, t2) {
      return `_${t2}_${e2.replace(/[^\w]/g, (t3, r2) => "-" === t3 ? "_" : e2.charCodeAt(r2).toString())}`;
    }
    __name(toValidAssetId, "toValidAssetId");
    function getMemoedVNodeCall(e2) {
      return 14 === e2.type && e2.callee === qc ? e2.arguments[1].returns : e2;
    }
    __name(getMemoedVNodeCall, "getMemoedVNodeCall");
    const ul = /([\s\S]*?)\s+(?:in|of)\s+(\S[\s\S]*)/, dl = { parseMode: "base", ns: 0, delimiters: ["{{", "}}"], getNamespace: () => 0, isVoidTag: NO, isPreTag: NO, isIgnoreNewlineTag: NO, isCustomElement: NO, onError: defaultOnError, onWarn: defaultOnWarn, comments: false, prefixIdentifiers: false };
    let fl = dl, hl = null, ml = "", gl = null, vl = null, yl = "", bl = -1, xl = -1, _l = 0, El = false, wl = null;
    const Sl = [], Tl = new class {
      constructor(e2, t2) {
        this.stack = e2, this.cbs = t2, this.state = 1, this.buffer = "", this.sectionStart = 0, this.index = 0, this.entityStart = 0, this.baseState = 1, this.inRCDATA = false, this.inXML = false, this.inVPre = false, this.newlines = [], this.mode = 0, this.delimiterOpen = Gc, this.delimiterClose = Jc, this.delimiterIndex = -1, this.currentSequence = void 0, this.sequenceIndex = 0;
      }
      get inSFCRoot() {
        return 2 === this.mode && 0 === this.stack.length;
      }
      reset() {
        this.state = 1, this.mode = 0, this.buffer = "", this.sectionStart = 0, this.index = 0, this.baseState = 1, this.inRCDATA = false, this.currentSequence = void 0, this.newlines.length = 0, this.delimiterOpen = Gc, this.delimiterClose = Jc;
      }
      getPos(e2) {
        let t2 = 1, r2 = e2 + 1;
        for (let s2 = this.newlines.length - 1; s2 >= 0; s2--) {
          const a2 = this.newlines[s2];
          if (e2 > a2) {
            t2 = s2 + 2, r2 = e2 - a2;
            break;
          }
        }
        return { column: r2, line: t2, offset: e2 };
      }
      peek() {
        return this.buffer.charCodeAt(this.index + 1);
      }
      stateText(e2) {
        60 === e2 ? (this.index > this.sectionStart && this.cbs.ontext(this.sectionStart, this.index), this.state = 5, this.sectionStart = this.index) : this.inVPre || e2 !== this.delimiterOpen[0] || (this.state = 2, this.delimiterIndex = 0, this.stateInterpolationOpen(e2));
      }
      stateInterpolationOpen(e2) {
        if (e2 === this.delimiterOpen[this.delimiterIndex])
          if (this.delimiterIndex === this.delimiterOpen.length - 1) {
            const e3 = this.index + 1 - this.delimiterOpen.length;
            e3 > this.sectionStart && this.cbs.ontext(this.sectionStart, e3), this.state = 3, this.sectionStart = e3;
          } else
            this.delimiterIndex++;
        else
          this.inRCDATA ? (this.state = 32, this.stateInRCDATA(e2)) : (this.state = 1, this.stateText(e2));
      }
      stateInterpolation(e2) {
        e2 === this.delimiterClose[0] && (this.state = 4, this.delimiterIndex = 0, this.stateInterpolationClose(e2));
      }
      stateInterpolationClose(e2) {
        e2 === this.delimiterClose[this.delimiterIndex] ? this.delimiterIndex === this.delimiterClose.length - 1 ? (this.cbs.oninterpolation(this.sectionStart, this.index + 1), this.inRCDATA ? this.state = 32 : this.state = 1, this.sectionStart = this.index + 1) : this.delimiterIndex++ : (this.state = 3, this.stateInterpolation(e2));
      }
      stateSpecialStartSequence(e2) {
        const t2 = this.sequenceIndex === this.currentSequence.length;
        if (t2 ? isEndOfTagSection(e2) : (32 | e2) === this.currentSequence[this.sequenceIndex]) {
          if (!t2)
            return void this.sequenceIndex++;
        } else
          this.inRCDATA = false;
        this.sequenceIndex = 0, this.state = 6, this.stateInTagName(e2);
      }
      stateInRCDATA(e2) {
        if (this.sequenceIndex === this.currentSequence.length) {
          if (62 === e2 || isWhitespace(e2)) {
            const t2 = this.index - this.currentSequence.length;
            if (this.sectionStart < t2) {
              const e3 = this.index;
              this.index = t2, this.cbs.ontext(this.sectionStart, t2), this.index = e3;
            }
            return this.sectionStart = t2 + 2, this.stateInClosingTagName(e2), void (this.inRCDATA = false);
          }
          this.sequenceIndex = 0;
        }
        (32 | e2) === this.currentSequence[this.sequenceIndex] ? this.sequenceIndex += 1 : 0 === this.sequenceIndex ? this.currentSequence === Yc.TitleEnd || this.currentSequence === Yc.TextareaEnd && !this.inSFCRoot ? this.inVPre || e2 !== this.delimiterOpen[0] || (this.state = 2, this.delimiterIndex = 0, this.stateInterpolationOpen(e2)) : this.fastForwardTo(60) && (this.sequenceIndex = 1) : this.sequenceIndex = Number(60 === e2);
      }
      stateCDATASequence(e2) {
        e2 === Yc.Cdata[this.sequenceIndex] ? ++this.sequenceIndex === Yc.Cdata.length && (this.state = 28, this.currentSequence = Yc.CdataEnd, this.sequenceIndex = 0, this.sectionStart = this.index + 1) : (this.sequenceIndex = 0, this.state = 23, this.stateInDeclaration(e2));
      }
      fastForwardTo(e2) {
        for (; ++this.index < this.buffer.length; ) {
          const t2 = this.buffer.charCodeAt(this.index);
          if (10 === t2 && this.newlines.push(this.index), t2 === e2)
            return true;
        }
        return this.index = this.buffer.length - 1, false;
      }
      stateInCommentLike(e2) {
        e2 === this.currentSequence[this.sequenceIndex] ? ++this.sequenceIndex === this.currentSequence.length && (this.currentSequence === Yc.CdataEnd ? this.cbs.oncdata(this.sectionStart, this.index - 2) : this.cbs.oncomment(this.sectionStart, this.index - 2), this.sequenceIndex = 0, this.sectionStart = this.index + 1, this.state = 1) : 0 === this.sequenceIndex ? this.fastForwardTo(this.currentSequence[0]) && (this.sequenceIndex = 1) : e2 !== this.currentSequence[this.sequenceIndex - 1] && (this.sequenceIndex = 0);
      }
      startSpecial(e2, t2) {
        this.enterRCDATA(e2, t2), this.state = 31;
      }
      enterRCDATA(e2, t2) {
        this.inRCDATA = true, this.currentSequence = e2, this.sequenceIndex = t2;
      }
      stateBeforeTagName(e2) {
        33 === e2 ? (this.state = 22, this.sectionStart = this.index + 1) : 63 === e2 ? (this.state = 24, this.sectionStart = this.index + 1) : isTagStartChar(e2) ? (this.sectionStart = this.index, 0 === this.mode ? this.state = 6 : this.inSFCRoot ? this.state = 34 : this.inXML ? this.state = 6 : this.state = 116 === e2 ? 30 : 115 === e2 ? 29 : 6) : 47 === e2 ? this.state = 8 : (this.state = 1, this.stateText(e2));
      }
      stateInTagName(e2) {
        isEndOfTagSection(e2) && this.handleTagName(e2);
      }
      stateInSFCRootTagName(e2) {
        if (isEndOfTagSection(e2)) {
          const t2 = this.buffer.slice(this.sectionStart, this.index);
          "template" !== t2 && this.enterRCDATA(toCharCodes("</" + t2), 0), this.handleTagName(e2);
        }
      }
      handleTagName(e2) {
        this.cbs.onopentagname(this.sectionStart, this.index), this.sectionStart = -1, this.state = 11, this.stateBeforeAttrName(e2);
      }
      stateBeforeClosingTagName(e2) {
        isWhitespace(e2) || (62 === e2 ? (this.state = 1, this.sectionStart = this.index + 1) : (this.state = isTagStartChar(e2) ? 9 : 27, this.sectionStart = this.index));
      }
      stateInClosingTagName(e2) {
        (62 === e2 || isWhitespace(e2)) && (this.cbs.onclosetag(this.sectionStart, this.index), this.sectionStart = -1, this.state = 10, this.stateAfterClosingTagName(e2));
      }
      stateAfterClosingTagName(e2) {
        62 === e2 && (this.state = 1, this.sectionStart = this.index + 1);
      }
      stateBeforeAttrName(e2) {
        62 === e2 ? (this.cbs.onopentagend(this.index), this.inRCDATA ? this.state = 32 : this.state = 1, this.sectionStart = this.index + 1) : 47 === e2 ? this.state = 7 : 60 === e2 && 47 === this.peek() ? (this.cbs.onopentagend(this.index), this.state = 5, this.sectionStart = this.index) : isWhitespace(e2) || this.handleAttrStart(e2);
      }
      handleAttrStart(e2) {
        118 === e2 && 45 === this.peek() ? (this.state = 13, this.sectionStart = this.index) : 46 === e2 || 58 === e2 || 64 === e2 || 35 === e2 ? (this.cbs.ondirname(this.index, this.index + 1), this.state = 14, this.sectionStart = this.index + 1) : (this.state = 12, this.sectionStart = this.index);
      }
      stateInSelfClosingTag(e2) {
        62 === e2 ? (this.cbs.onselfclosingtag(this.index), this.state = 1, this.sectionStart = this.index + 1, this.inRCDATA = false) : isWhitespace(e2) || (this.state = 11, this.stateBeforeAttrName(e2));
      }
      stateInAttrName(e2) {
        (61 === e2 || isEndOfTagSection(e2)) && (this.cbs.onattribname(this.sectionStart, this.index), this.handleAttrNameEnd(e2));
      }
      stateInDirName(e2) {
        61 === e2 || isEndOfTagSection(e2) ? (this.cbs.ondirname(this.sectionStart, this.index), this.handleAttrNameEnd(e2)) : 58 === e2 ? (this.cbs.ondirname(this.sectionStart, this.index), this.state = 14, this.sectionStart = this.index + 1) : 46 === e2 && (this.cbs.ondirname(this.sectionStart, this.index), this.state = 16, this.sectionStart = this.index + 1);
      }
      stateInDirArg(e2) {
        61 === e2 || isEndOfTagSection(e2) ? (this.cbs.ondirarg(this.sectionStart, this.index), this.handleAttrNameEnd(e2)) : 91 === e2 ? this.state = 15 : 46 === e2 && (this.cbs.ondirarg(this.sectionStart, this.index), this.state = 16, this.sectionStart = this.index + 1);
      }
      stateInDynamicDirArg(e2) {
        93 === e2 ? this.state = 14 : (61 === e2 || isEndOfTagSection(e2)) && (this.cbs.ondirarg(this.sectionStart, this.index + 1), this.handleAttrNameEnd(e2));
      }
      stateInDirModifier(e2) {
        61 === e2 || isEndOfTagSection(e2) ? (this.cbs.ondirmodifier(this.sectionStart, this.index), this.handleAttrNameEnd(e2)) : 46 === e2 && (this.cbs.ondirmodifier(this.sectionStart, this.index), this.sectionStart = this.index + 1);
      }
      handleAttrNameEnd(e2) {
        this.sectionStart = this.index, this.state = 17, this.cbs.onattribnameend(this.index), this.stateAfterAttrName(e2);
      }
      stateAfterAttrName(e2) {
        61 === e2 ? this.state = 18 : 47 === e2 || 62 === e2 ? (this.cbs.onattribend(0, this.sectionStart), this.sectionStart = -1, this.state = 11, this.stateBeforeAttrName(e2)) : isWhitespace(e2) || (this.cbs.onattribend(0, this.sectionStart), this.handleAttrStart(e2));
      }
      stateBeforeAttrValue(e2) {
        34 === e2 ? (this.state = 19, this.sectionStart = this.index + 1) : 39 === e2 ? (this.state = 20, this.sectionStart = this.index + 1) : isWhitespace(e2) || (this.sectionStart = this.index, this.state = 21, this.stateInAttrValueNoQuotes(e2));
      }
      handleInAttrValue(e2, t2) {
        (e2 === t2 || this.fastForwardTo(t2)) && (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = -1, this.cbs.onattribend(34 === t2 ? 3 : 2, this.index + 1), this.state = 11);
      }
      stateInAttrValueDoubleQuotes(e2) {
        this.handleInAttrValue(e2, 34);
      }
      stateInAttrValueSingleQuotes(e2) {
        this.handleInAttrValue(e2, 39);
      }
      stateInAttrValueNoQuotes(e2) {
        isWhitespace(e2) || 62 === e2 ? (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = -1, this.cbs.onattribend(1, this.index), this.state = 11, this.stateBeforeAttrName(e2)) : 39 !== e2 && 60 !== e2 && 61 !== e2 && 96 !== e2 || this.cbs.onerr(18, this.index);
      }
      stateBeforeDeclaration(e2) {
        91 === e2 ? (this.state = 26, this.sequenceIndex = 0) : this.state = 45 === e2 ? 25 : 23;
      }
      stateInDeclaration(e2) {
        (62 === e2 || this.fastForwardTo(62)) && (this.state = 1, this.sectionStart = this.index + 1);
      }
      stateInProcessingInstruction(e2) {
        (62 === e2 || this.fastForwardTo(62)) && (this.cbs.onprocessinginstruction(this.sectionStart, this.index), this.state = 1, this.sectionStart = this.index + 1);
      }
      stateBeforeComment(e2) {
        45 === e2 ? (this.state = 28, this.currentSequence = Yc.CommentEnd, this.sequenceIndex = 2, this.sectionStart = this.index + 1) : this.state = 23;
      }
      stateInSpecialComment(e2) {
        (62 === e2 || this.fastForwardTo(62)) && (this.cbs.oncomment(this.sectionStart, this.index), this.state = 1, this.sectionStart = this.index + 1);
      }
      stateBeforeSpecialS(e2) {
        e2 === Yc.ScriptEnd[3] ? this.startSpecial(Yc.ScriptEnd, 4) : e2 === Yc.StyleEnd[3] ? this.startSpecial(Yc.StyleEnd, 4) : (this.state = 6, this.stateInTagName(e2));
      }
      stateBeforeSpecialT(e2) {
        e2 === Yc.TitleEnd[3] ? this.startSpecial(Yc.TitleEnd, 4) : e2 === Yc.TextareaEnd[3] ? this.startSpecial(Yc.TextareaEnd, 4) : (this.state = 6, this.stateInTagName(e2));
      }
      startEntity() {
      }
      stateInEntity() {
      }
      parse(e2) {
        for (this.buffer = e2; this.index < this.buffer.length; ) {
          const e3 = this.buffer.charCodeAt(this.index);
          switch (10 === e3 && 33 !== this.state && this.newlines.push(this.index), this.state) {
            case 1:
              this.stateText(e3);
              break;
            case 2:
              this.stateInterpolationOpen(e3);
              break;
            case 3:
              this.stateInterpolation(e3);
              break;
            case 4:
              this.stateInterpolationClose(e3);
              break;
            case 31:
              this.stateSpecialStartSequence(e3);
              break;
            case 32:
              this.stateInRCDATA(e3);
              break;
            case 26:
              this.stateCDATASequence(e3);
              break;
            case 19:
              this.stateInAttrValueDoubleQuotes(e3);
              break;
            case 12:
              this.stateInAttrName(e3);
              break;
            case 13:
              this.stateInDirName(e3);
              break;
            case 14:
              this.stateInDirArg(e3);
              break;
            case 15:
              this.stateInDynamicDirArg(e3);
              break;
            case 16:
              this.stateInDirModifier(e3);
              break;
            case 28:
              this.stateInCommentLike(e3);
              break;
            case 27:
              this.stateInSpecialComment(e3);
              break;
            case 11:
              this.stateBeforeAttrName(e3);
              break;
            case 6:
              this.stateInTagName(e3);
              break;
            case 34:
              this.stateInSFCRootTagName(e3);
              break;
            case 9:
              this.stateInClosingTagName(e3);
              break;
            case 5:
              this.stateBeforeTagName(e3);
              break;
            case 17:
              this.stateAfterAttrName(e3);
              break;
            case 20:
              this.stateInAttrValueSingleQuotes(e3);
              break;
            case 18:
              this.stateBeforeAttrValue(e3);
              break;
            case 8:
              this.stateBeforeClosingTagName(e3);
              break;
            case 10:
              this.stateAfterClosingTagName(e3);
              break;
            case 29:
              this.stateBeforeSpecialS(e3);
              break;
            case 30:
              this.stateBeforeSpecialT(e3);
              break;
            case 21:
              this.stateInAttrValueNoQuotes(e3);
              break;
            case 7:
              this.stateInSelfClosingTag(e3);
              break;
            case 23:
              this.stateInDeclaration(e3);
              break;
            case 22:
              this.stateBeforeDeclaration(e3);
              break;
            case 25:
              this.stateBeforeComment(e3);
              break;
            case 24:
              this.stateInProcessingInstruction(e3);
              break;
            case 33:
              this.stateInEntity();
          }
          this.index++;
        }
        this.cleanup(), this.finish();
      }
      cleanup() {
        this.sectionStart !== this.index && (1 === this.state || 32 === this.state && 0 === this.sequenceIndex ? (this.cbs.ontext(this.sectionStart, this.index), this.sectionStart = this.index) : 19 !== this.state && 20 !== this.state && 21 !== this.state || (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = this.index));
      }
      finish() {
        this.handleTrailingData(), this.cbs.onend();
      }
      handleTrailingData() {
        const e2 = this.buffer.length;
        this.sectionStart >= e2 || (28 === this.state ? this.currentSequence === Yc.CdataEnd ? this.cbs.oncdata(this.sectionStart, e2) : this.cbs.oncomment(this.sectionStart, e2) : 6 === this.state || 11 === this.state || 18 === this.state || 17 === this.state || 12 === this.state || 13 === this.state || 14 === this.state || 15 === this.state || 16 === this.state || 20 === this.state || 19 === this.state || 21 === this.state || 9 === this.state || this.cbs.ontext(this.sectionStart, e2));
      }
      emitCodePoint(e2, t2) {
      }
    }(Sl, { onerr: emitError, ontext(e2, t2) {
      onText(getSlice(e2, t2), e2, t2);
    }, ontextentity(e2, t2, r2) {
      onText(e2, t2, r2);
    }, oninterpolation(e2, t2) {
      if (El)
        return onText(getSlice(e2, t2), e2, t2);
      let r2 = e2 + Tl.delimiterOpen.length, s2 = t2 - Tl.delimiterClose.length;
      for (; isWhitespace(ml.charCodeAt(r2)); )
        r2++;
      for (; isWhitespace(ml.charCodeAt(s2 - 1)); )
        s2--;
      let a2 = getSlice(r2, s2);
      a2.includes("&") && (a2 = fl.decodeEntities(a2, false)), addNode({ type: 5, content: createExp(a2, false, getLoc(r2, s2)), loc: getLoc(e2, t2) });
    }, onopentagname(e2, t2) {
      const r2 = getSlice(e2, t2);
      gl = { type: 1, tag: r2, ns: fl.getNamespace(r2, Sl[0], fl.ns), tagType: 0, props: [], children: [], loc: getLoc(e2 - 1, t2), codegenNode: void 0 };
    }, onopentagend(e2) {
      endOpenTag(e2);
    }, onclosetag(e2, t2) {
      const r2 = getSlice(e2, t2);
      if (!fl.isVoidTag(r2)) {
        let s2 = false;
        for (let e3 = 0; e3 < Sl.length; e3++) {
          if (Sl[e3].tag.toLowerCase() === r2.toLowerCase()) {
            s2 = true, e3 > 0 && emitError(24, Sl[0].loc.start.offset);
            for (let r3 = 0; r3 <= e3; r3++) {
              onCloseTag(Sl.shift(), t2, r3 < e3);
            }
            break;
          }
        }
        s2 || emitError(23, backTrack(e2, 60));
      }
    }, onselfclosingtag(e2) {
      const t2 = gl.tag;
      gl.isSelfClosing = true, endOpenTag(e2), Sl[0] && Sl[0].tag === t2 && onCloseTag(Sl.shift(), e2);
    }, onattribname(e2, t2) {
      vl = { type: 6, name: getSlice(e2, t2), nameLoc: getLoc(e2, t2), value: void 0, loc: getLoc(e2) };
    }, ondirname(e2, t2) {
      const r2 = getSlice(e2, t2), s2 = "." === r2 || ":" === r2 ? "bind" : "@" === r2 ? "on" : "#" === r2 ? "slot" : r2.slice(2);
      if (El || "" !== s2 || emitError(26, e2), El || "" === s2)
        vl = { type: 6, name: r2, nameLoc: getLoc(e2, t2), value: void 0, loc: getLoc(e2) };
      else if (vl = { type: 7, name: s2, rawName: r2, exp: void 0, arg: void 0, modifiers: "." === r2 ? [createSimpleExpression("prop")] : [], loc: getLoc(e2) }, "pre" === s2) {
        El = Tl.inVPre = true, wl = gl;
        const e3 = gl.props;
        for (let t3 = 0; t3 < e3.length; t3++)
          7 === e3[t3].type && (e3[t3] = dirToAttr(e3[t3]));
      }
    }, ondirarg(e2, t2) {
      if (e2 === t2)
        return;
      const r2 = getSlice(e2, t2);
      if (El && !isVPre(vl))
        vl.name += r2, setLocEnd(vl.nameLoc, t2);
      else {
        const s2 = "[" !== r2[0];
        vl.arg = createExp(s2 ? r2 : r2.slice(1, -1), s2, getLoc(e2, t2), s2 ? 3 : 0);
      }
    }, ondirmodifier(e2, t2) {
      const r2 = getSlice(e2, t2);
      if (El && !isVPre(vl))
        vl.name += "." + r2, setLocEnd(vl.nameLoc, t2);
      else if ("slot" === vl.name) {
        const e3 = vl.arg;
        e3 && (e3.content += "." + r2, setLocEnd(e3.loc, t2));
      } else {
        const s2 = createSimpleExpression(r2, true, getLoc(e2, t2));
        vl.modifiers.push(s2);
      }
    }, onattribdata(e2, t2) {
      yl += getSlice(e2, t2), bl < 0 && (bl = e2), xl = t2;
    }, onattribentity(e2, t2, r2) {
      yl += e2, bl < 0 && (bl = t2), xl = r2;
    }, onattribnameend(e2) {
      const t2 = vl.loc.start.offset, r2 = getSlice(t2, e2);
      7 === vl.type && (vl.rawName = r2), gl.props.some((e3) => (7 === e3.type ? e3.rawName : e3.name) === r2) && emitError(2, t2);
    }, onattribend(e2, t2) {
      if (gl && vl) {
        if (setLocEnd(vl.loc, t2), 0 !== e2)
          if (yl.includes("&") && (yl = fl.decodeEntities(yl, true)), 6 === vl.type)
            "class" === vl.name && (yl = condense(yl).trim()), 1 !== e2 || yl || emitError(13, t2), vl.value = { type: 2, content: yl, loc: 1 === e2 ? getLoc(bl, xl) : getLoc(bl - 1, xl + 1) }, Tl.inSFCRoot && "template" === gl.tag && "lang" === vl.name && yl && "html" !== yl && Tl.enterRCDATA(toCharCodes("</template"), 0);
          else {
            let e3 = 0;
            vl.exp = createExp(yl, false, getLoc(bl, xl), 0, e3), "for" === vl.name && (vl.forParseResult = function(e4) {
              const t4 = e4.loc, r2 = e4.content, s2 = r2.match(ul);
              if (!s2)
                return;
              const [, a2, c2] = s2, createAliasExpression = /* @__PURE__ */ __name((e5, r3, s3 = false) => {
                const a3 = t4.start.offset + r3;
                return createExp(e5, false, getLoc(a3, a3 + e5.length), 0, s3 ? 1 : 0);
              }, "createAliasExpression"), p2 = { source: createAliasExpression(c2.trim(), r2.indexOf(c2, a2.length)), value: void 0, key: void 0, index: void 0, finalized: false };
              let u2 = a2.trim().replace(kl, "").trim();
              const d2 = a2.indexOf(u2), f2 = u2.match(Cl);
              if (f2) {
                u2 = u2.replace(Cl, "").trim();
                const e5 = f2[1].trim();
                let t5;
                if (e5 && (t5 = r2.indexOf(e5, d2 + u2.length), p2.key = createAliasExpression(e5, t5, true)), f2[2]) {
                  const s3 = f2[2].trim();
                  s3 && (p2.index = createAliasExpression(s3, r2.indexOf(s3, p2.key ? t5 + e5.length : d2 + u2.length), true));
                }
              }
              u2 && (p2.value = createAliasExpression(u2, d2, true));
              return p2;
            }(vl.exp));
            let t3 = -1;
            "bind" === vl.name && (t3 = vl.modifiers.findIndex((e4) => "sync" === e4.content)) > -1 && checkCompatEnabled("COMPILER_V_BIND_SYNC", fl, vl.loc, vl.arg.loc.source) && (vl.name = "model", vl.modifiers.splice(t3, 1));
          }
        7 === vl.type && "pre" === vl.name || gl.props.push(vl);
      }
      yl = "", bl = xl = -1;
    }, oncomment(e2, t2) {
      fl.comments && addNode({ type: 3, content: getSlice(e2, t2), loc: getLoc(e2 - 4, t2 + 3) });
    }, onend() {
      const e2 = ml.length;
      for (let t2 = 0; t2 < Sl.length; t2++)
        onCloseTag(Sl[t2], e2 - 1), emitError(24, Sl[t2].loc.start.offset);
    }, oncdata(e2, t2) {
      0 !== Sl[0].ns ? onText(getSlice(e2, t2), e2, t2) : emitError(1, e2 - 9);
    }, onprocessinginstruction(e2) {
      0 === (Sl[0] ? Sl[0].ns : fl.ns) && emitError(21, e2 - 1);
    } }), Cl = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, kl = /^\(|\)$/g;
    function getSlice(e2, t2) {
      return ml.slice(e2, t2);
    }
    __name(getSlice, "getSlice");
    function endOpenTag(e2) {
      Tl.inSFCRoot && (gl.innerLoc = getLoc(e2 + 1, e2 + 1)), addNode(gl);
      const { tag: t2, ns: r2 } = gl;
      0 === r2 && fl.isPreTag(t2) && _l++, fl.isVoidTag(t2) ? onCloseTag(gl, e2) : (Sl.unshift(gl), 1 !== r2 && 2 !== r2 || (Tl.inXML = true)), gl = null;
    }
    __name(endOpenTag, "endOpenTag");
    function onText(e2, t2, r2) {
      {
        const t3 = Sl[0] && Sl[0].tag;
        "script" !== t3 && "style" !== t3 && e2.includes("&") && (e2 = fl.decodeEntities(e2, false));
      }
      const s2 = Sl[0] || hl, a2 = s2.children[s2.children.length - 1];
      a2 && 2 === a2.type ? (a2.content += e2, setLocEnd(a2.loc, r2)) : s2.children.push({ type: 2, content: e2, loc: getLoc(t2, r2) });
    }
    __name(onText, "onText");
    function onCloseTag(e2, t2, r2 = false) {
      setLocEnd(e2.loc, r2 ? backTrack(t2, 60) : function(e3, t3) {
        let r3 = e3;
        for (; ml.charCodeAt(r3) !== t3 && r3 < ml.length - 1; )
          r3++;
        return r3;
      }(t2, 62) + 1), Tl.inSFCRoot && (e2.children.length ? e2.innerLoc.end = $r({}, e2.children[e2.children.length - 1].loc.end) : e2.innerLoc.end = $r({}, e2.innerLoc.start), e2.innerLoc.source = getSlice(e2.innerLoc.start.offset, e2.innerLoc.end.offset));
      const { tag: s2, ns: a2, children: c2 } = e2;
      if (El || ("slot" === s2 ? e2.tagType = 2 : isFragmentTemplate(e2) ? e2.tagType = 3 : function({ tag: e3, props: t3 }) {
        if (fl.isCustomElement(e3))
          return false;
        if ("component" === e3 || function(e4) {
          return e4 > 64 && e4 < 91;
        }(e3.charCodeAt(0)) || isCoreComponent(e3) || fl.isBuiltInComponent && fl.isBuiltInComponent(e3) || fl.isNativeTag && !fl.isNativeTag(e3))
          return true;
        for (let e4 = 0; e4 < t3.length; e4++) {
          const r3 = t3[e4];
          if (6 === r3.type) {
            if ("is" === r3.name && r3.value) {
              if (r3.value.content.startsWith("vue:"))
                return true;
              if (checkCompatEnabled("COMPILER_IS_ON_ELEMENT", fl, r3.loc))
                return true;
            }
          } else if ("bind" === r3.name && isStaticArgOf(r3.arg, "is") && checkCompatEnabled("COMPILER_IS_ON_ELEMENT", fl, r3.loc))
            return true;
        }
        return false;
      }(e2) && (e2.tagType = 1)), Tl.inRCDATA || (e2.children = condenseWhitespace(c2)), 0 === a2 && fl.isIgnoreNewlineTag(s2)) {
        const e3 = c2[0];
        e3 && 2 === e3.type && (e3.content = e3.content.replace(/^\r?\n/, ""));
      }
      0 === a2 && fl.isPreTag(s2) && _l--, wl === e2 && (El = Tl.inVPre = false, wl = null), Tl.inXML && 0 === (Sl[0] ? Sl[0].ns : fl.ns) && (Tl.inXML = false);
      {
        const t3 = e2.props;
        if (!Tl.inSFCRoot && isCompatEnabled("COMPILER_NATIVE_TEMPLATE", fl) && "template" === e2.tag && !isFragmentTemplate(e2)) {
          const t4 = Sl[0] || hl, r4 = t4.children.indexOf(e2);
          t4.children.splice(r4, 1, ...e2.children);
        }
        const r3 = t3.find((e3) => 6 === e3.type && "inline-template" === e3.name);
        r3 && checkCompatEnabled("COMPILER_INLINE_TEMPLATE", fl, r3.loc) && e2.children.length && (r3.value = { type: 2, content: getSlice(e2.children[0].loc.start.offset, e2.children[e2.children.length - 1].loc.end.offset), loc: r3.loc });
      }
    }
    __name(onCloseTag, "onCloseTag");
    function backTrack(e2, t2) {
      let r2 = e2;
      for (; ml.charCodeAt(r2) !== t2 && r2 >= 0; )
        r2--;
      return r2;
    }
    __name(backTrack, "backTrack");
    const Rl = /* @__PURE__ */ new Set(["if", "else", "else-if", "for", "slot"]);
    function isFragmentTemplate({ tag: e2, props: t2 }) {
      if ("template" === e2) {
        for (let e3 = 0; e3 < t2.length; e3++)
          if (7 === t2[e3].type && Rl.has(t2[e3].name))
            return true;
      }
      return false;
    }
    __name(isFragmentTemplate, "isFragmentTemplate");
    const Al = /\r\n/g;
    function condenseWhitespace(e2) {
      const t2 = "preserve" !== fl.whitespace;
      let r2 = false;
      for (let s2 = 0; s2 < e2.length; s2++) {
        const a2 = e2[s2];
        if (2 === a2.type)
          if (_l)
            a2.content = a2.content.replace(Al, "\n");
          else if (isAllWhitespace(a2.content)) {
            const c2 = e2[s2 - 1] && e2[s2 - 1].type, p2 = e2[s2 + 1] && e2[s2 + 1].type;
            !c2 || !p2 || t2 && (3 === c2 && (3 === p2 || 1 === p2) || 1 === c2 && (3 === p2 || 1 === p2 && hasNewlineChar(a2.content))) ? (r2 = true, e2[s2] = null) : a2.content = " ";
          } else
            t2 && (a2.content = condense(a2.content));
      }
      return r2 ? e2.filter(Boolean) : e2;
    }
    __name(condenseWhitespace, "condenseWhitespace");
    function isAllWhitespace(e2) {
      for (let t2 = 0; t2 < e2.length; t2++)
        if (!isWhitespace(e2.charCodeAt(t2)))
          return false;
      return true;
    }
    __name(isAllWhitespace, "isAllWhitespace");
    function hasNewlineChar(e2) {
      for (let t2 = 0; t2 < e2.length; t2++) {
        const r2 = e2.charCodeAt(t2);
        if (10 === r2 || 13 === r2)
          return true;
      }
      return false;
    }
    __name(hasNewlineChar, "hasNewlineChar");
    function condense(e2) {
      let t2 = "", r2 = false;
      for (let s2 = 0; s2 < e2.length; s2++)
        isWhitespace(e2.charCodeAt(s2)) ? r2 || (t2 += " ", r2 = true) : (t2 += e2[s2], r2 = false);
      return t2;
    }
    __name(condense, "condense");
    function addNode(e2) {
      (Sl[0] || hl).children.push(e2);
    }
    __name(addNode, "addNode");
    function getLoc(e2, t2) {
      return { start: Tl.getPos(e2), end: null == t2 ? t2 : Tl.getPos(t2), source: null == t2 ? t2 : getSlice(e2, t2) };
    }
    __name(getLoc, "getLoc");
    function setLocEnd(e2, t2) {
      e2.end = Tl.getPos(t2), e2.source = getSlice(e2.start.offset, t2);
    }
    __name(setLocEnd, "setLocEnd");
    function dirToAttr(e2) {
      const t2 = { type: 6, name: e2.rawName, nameLoc: getLoc(e2.loc.start.offset, e2.loc.start.offset + e2.rawName.length), value: void 0, loc: e2.loc };
      if (e2.exp) {
        const r2 = e2.exp.loc;
        r2.end.offset < e2.loc.end.offset && (r2.start.offset--, r2.start.column--, r2.end.offset++, r2.end.column++), t2.value = { type: 2, content: e2.exp.content, loc: r2 };
      }
      return t2;
    }
    __name(dirToAttr, "dirToAttr");
    function createExp(e2, t2 = false, r2, s2 = 0, a2 = 0) {
      return createSimpleExpression(e2, t2, r2, s2);
    }
    __name(createExp, "createExp");
    function emitError(e2, t2, r2) {
      fl.onError(createCompilerError(e2, getLoc(t2, t2)));
    }
    __name(emitError, "emitError");
    function baseParse(e2, t2) {
      if (Tl.reset(), gl = null, vl = null, yl = "", bl = -1, xl = -1, Sl.length = 0, ml = e2, fl = $r({}, dl), t2) {
        let e3;
        for (e3 in t2)
          null != t2[e3] && (fl[e3] = t2[e3]);
      }
      Tl.mode = "html" === fl.parseMode ? 1 : "sfc" === fl.parseMode ? 2 : 0, Tl.inXML = 1 === fl.ns || 2 === fl.ns;
      const r2 = t2 && t2.delimiters;
      r2 && (Tl.delimiterOpen = toCharCodes(r2[0]), Tl.delimiterClose = toCharCodes(r2[1]));
      const s2 = hl = createRoot([], e2);
      return Tl.parse(ml), s2.loc = getLoc(0, e2.length), s2.children = condenseWhitespace(s2.children), hl = null, s2;
    }
    __name(baseParse, "baseParse");
    function cacheStatic(e2, t2) {
      walk(e2, void 0, t2, !!getSingleElementRoot(e2));
    }
    __name(cacheStatic, "cacheStatic");
    function getSingleElementRoot(e2) {
      const t2 = e2.children.filter((e3) => 3 !== e3.type);
      return 1 !== t2.length || 1 !== t2[0].type || isSlotOutlet(t2[0]) ? null : t2[0];
    }
    __name(getSingleElementRoot, "getSingleElementRoot");
    function walk(e2, t2, r2, s2 = false, a2 = false) {
      const { children: c2 } = e2, p2 = [];
      for (let t3 = 0; t3 < c2.length; t3++) {
        const u3 = c2[t3];
        if (1 === u3.type && 0 === u3.tagType) {
          const e3 = s2 ? 0 : getConstantType(u3, r2);
          if (e3 > 0) {
            if (e3 >= 2) {
              u3.codegenNode.patchFlag = -1, p2.push(u3);
              continue;
            }
          } else {
            const e4 = u3.codegenNode;
            if (13 === e4.type) {
              const t4 = e4.patchFlag;
              if ((void 0 === t4 || 512 === t4 || 1 === t4) && getGeneratedPropsConstantType(u3, r2) >= 2) {
                const t5 = getNodeProps(u3);
                t5 && (e4.props = r2.hoist(t5));
              }
              e4.dynamicProps && (e4.dynamicProps = r2.hoist(e4.dynamicProps));
            }
          }
        } else if (12 === u3.type) {
          if ((s2 ? 0 : getConstantType(u3, r2)) >= 2) {
            14 === u3.codegenNode.type && u3.codegenNode.arguments.length > 0 && u3.codegenNode.arguments.push("-1"), p2.push(u3);
            continue;
          }
        }
        if (1 === u3.type) {
          const t4 = 1 === u3.tagType;
          t4 && r2.scopes.vSlot++, walk(u3, e2, r2, false, a2), t4 && r2.scopes.vSlot--;
        } else if (11 === u3.type)
          walk(u3, e2, r2, 1 === u3.children.length, true);
        else if (9 === u3.type)
          for (let t4 = 0; t4 < u3.branches.length; t4++)
            walk(u3.branches[t4], e2, r2, 1 === u3.branches[t4].children.length, a2);
      }
      let u2 = false;
      const d2 = [];
      if (p2.length === c2.length && 1 === e2.type) {
        if (0 === e2.tagType && e2.codegenNode && 13 === e2.codegenNode.type && jr(e2.codegenNode.children))
          e2.codegenNode.children = getCacheExpression(createArrayExpression(e2.codegenNode.children)), u2 = true;
        else if (1 === e2.tagType && e2.codegenNode && 13 === e2.codegenNode.type && e2.codegenNode.children && !jr(e2.codegenNode.children) && 15 === e2.codegenNode.children.type) {
          const t3 = getSlotNode(e2.codegenNode, "default");
          t3 && (d2.push(r2.cached.length), t3.returns = getCacheExpression(createArrayExpression(t3.returns)), u2 = true);
        } else if (3 === e2.tagType && t2 && 1 === t2.type && 1 === t2.tagType && t2.codegenNode && 13 === t2.codegenNode.type && t2.codegenNode.children && !jr(t2.codegenNode.children) && 15 === t2.codegenNode.children.type) {
          const s3 = findDir(e2, "slot", true), a3 = s3 && s3.arg && getSlotNode(t2.codegenNode, s3.arg);
          a3 && (d2.push(r2.cached.length), a3.returns = getCacheExpression(createArrayExpression(a3.returns)), u2 = true);
        }
      }
      if (!u2)
        for (const e3 of p2)
          d2.push(r2.cached.length), e3.codegenNode = r2.cache(e3.codegenNode);
      function getCacheExpression(e3) {
        const t3 = r2.cache(e3);
        return a2 && r2.hmr && (t3.needArraySpread = true), t3;
      }
      __name(getCacheExpression, "getCacheExpression");
      function getSlotNode(e3, t3) {
        if (e3.children && !jr(e3.children) && 15 === e3.children.type) {
          const r3 = e3.children.properties.find((e4) => e4.key === t3 || e4.key.content === t3);
          return r3 && r3.value;
        }
      }
      __name(getSlotNode, "getSlotNode");
      d2.length && 1 === e2.type && 1 === e2.tagType && e2.codegenNode && 13 === e2.codegenNode.type && e2.codegenNode.children && !jr(e2.codegenNode.children) && 15 === e2.codegenNode.children.type && e2.codegenNode.children.properties.push(createObjectProperty("__", createSimpleExpression(JSON.stringify(d2), false))), p2.length && r2.transformHoist && r2.transformHoist(c2, r2, e2);
    }
    __name(walk, "walk");
    function getConstantType(e2, t2) {
      const { constantCache: r2 } = t2;
      switch (e2.type) {
        case 1:
          if (0 !== e2.tagType)
            return 0;
          const s2 = r2.get(e2);
          if (void 0 !== s2)
            return s2;
          const a2 = e2.codegenNode;
          if (13 !== a2.type)
            return 0;
          if (a2.isBlock && "svg" !== e2.tag && "foreignObject" !== e2.tag && "math" !== e2.tag)
            return 0;
          if (void 0 === a2.patchFlag) {
            let s3 = 3;
            const c3 = getGeneratedPropsConstantType(e2, t2);
            if (0 === c3)
              return r2.set(e2, 0), 0;
            c3 < s3 && (s3 = c3);
            for (let a3 = 0; a3 < e2.children.length; a3++) {
              const c4 = getConstantType(e2.children[a3], t2);
              if (0 === c4)
                return r2.set(e2, 0), 0;
              c4 < s3 && (s3 = c4);
            }
            if (s3 > 1)
              for (let a3 = 0; a3 < e2.props.length; a3++) {
                const c4 = e2.props[a3];
                if (7 === c4.type && "bind" === c4.name && c4.exp) {
                  const a4 = getConstantType(c4.exp, t2);
                  if (0 === a4)
                    return r2.set(e2, 0), 0;
                  a4 < s3 && (s3 = a4);
                }
              }
            if (a2.isBlock) {
              for (let t3 = 0; t3 < e2.props.length; t3++) {
                if (7 === e2.props[t3].type)
                  return r2.set(e2, 0), 0;
              }
              t2.removeHelper(fc), t2.removeHelper(getVNodeBlockHelper(t2.inSSR, a2.isComponent)), a2.isBlock = false, t2.helper(getVNodeHelper(t2.inSSR, a2.isComponent));
            }
            return r2.set(e2, s3), s3;
          }
          return r2.set(e2, 0), 0;
        case 2:
        case 3:
          return 3;
        case 9:
        case 11:
        case 10:
        default:
          return 0;
        case 5:
        case 12:
          return getConstantType(e2.content, t2);
        case 4:
          return e2.constType;
        case 8:
          let c2 = 3;
          for (let r3 = 0; r3 < e2.children.length; r3++) {
            const s3 = e2.children[r3];
            if (isString(s3) || isSymbol(s3))
              continue;
            const a3 = getConstantType(s3, t2);
            if (0 === a3)
              return 0;
            a3 < c2 && (c2 = a3);
          }
          return c2;
        case 20:
          return 2;
      }
    }
    __name(getConstantType, "getConstantType");
    const Nl = /* @__PURE__ */ new Set([Oc, Ic, Pc, Lc]);
    function getConstantTypeOfHelperCall(e2, t2) {
      if (14 === e2.type && !isString(e2.callee) && Nl.has(e2.callee)) {
        const r2 = e2.arguments[0];
        if (4 === r2.type)
          return getConstantType(r2, t2);
        if (14 === r2.type)
          return getConstantTypeOfHelperCall(r2, t2);
      }
      return 0;
    }
    __name(getConstantTypeOfHelperCall, "getConstantTypeOfHelperCall");
    function getGeneratedPropsConstantType(e2, t2) {
      let r2 = 3;
      const s2 = getNodeProps(e2);
      if (s2 && 15 === s2.type) {
        const { properties: e3 } = s2;
        for (let s3 = 0; s3 < e3.length; s3++) {
          const { key: a2, value: c2 } = e3[s3], p2 = getConstantType(a2, t2);
          if (0 === p2)
            return p2;
          let u2;
          if (p2 < r2 && (r2 = p2), u2 = 4 === c2.type ? getConstantType(c2, t2) : 14 === c2.type ? getConstantTypeOfHelperCall(c2, t2) : 0, 0 === u2)
            return u2;
          u2 < r2 && (r2 = u2);
        }
      }
      return r2;
    }
    __name(getGeneratedPropsConstantType, "getGeneratedPropsConstantType");
    function getNodeProps(e2) {
      const t2 = e2.codegenNode;
      if (13 === t2.type)
        return t2.props;
    }
    __name(getNodeProps, "getNodeProps");
    function createTransformContext(e2, { filename: t2 = "", prefixIdentifiers: r2 = false, hoistStatic: s2 = false, hmr: a2 = false, cacheHandlers: c2 = false, nodeTransforms: p2 = [], directiveTransforms: u2 = {}, transformHoist: d2 = null, isBuiltInComponent: f2 = NOOP, isCustomElement: m2 = NOOP, expressionPlugins: g2 = [], scopeId: x2 = null, slotted: _2 = true, ssr: E2 = false, inSSR: S2 = false, ssrCssVars: T2 = "", bindingMetadata: C2 = Lr, inline: R2 = false, isTS: N2 = false, onError: O2 = defaultOnError, onWarn: I2 = defaultOnWarn, compatConfig: P2 }) {
      const L2 = t2.replace(/\?.*$/, "").match(/([^/\\]+)\.\w+$/), M2 = { filename: t2, selfName: L2 && Wr(Fr(L2[1])), prefixIdentifiers: r2, hoistStatic: s2, hmr: a2, cacheHandlers: c2, nodeTransforms: p2, directiveTransforms: u2, transformHoist: d2, isBuiltInComponent: f2, isCustomElement: m2, expressionPlugins: g2, scopeId: x2, slotted: _2, ssr: E2, inSSR: S2, ssrCssVars: T2, bindingMetadata: C2, inline: R2, isTS: N2, onError: O2, onWarn: I2, compatConfig: P2, root: e2, helpers: /* @__PURE__ */ new Map(), components: /* @__PURE__ */ new Set(), directives: /* @__PURE__ */ new Set(), hoists: [], imports: [], cached: [], constantCache: /* @__PURE__ */ new WeakMap(), temps: 0, identifiers: /* @__PURE__ */ Object.create(null), scopes: { vFor: 0, vSlot: 0, vPre: 0, vOnce: 0 }, parent: null, grandParent: null, currentNode: e2, childIndex: 0, inVOnce: false, helper(e3) {
        const t3 = M2.helpers.get(e3) || 0;
        return M2.helpers.set(e3, t3 + 1), e3;
      }, removeHelper(e3) {
        const t3 = M2.helpers.get(e3);
        if (t3) {
          const r3 = t3 - 1;
          r3 ? M2.helpers.set(e3, r3) : M2.helpers.delete(e3);
        }
      }, helperString: (e3) => `_${Kc[M2.helper(e3)]}`, replaceNode(e3) {
        M2.parent.children[M2.childIndex] = M2.currentNode = e3;
      }, removeNode(e3) {
        const t3 = M2.parent.children, r3 = e3 ? t3.indexOf(e3) : M2.currentNode ? M2.childIndex : -1;
        e3 && e3 !== M2.currentNode ? M2.childIndex > r3 && (M2.childIndex--, M2.onNodeRemoved()) : (M2.currentNode = null, M2.onNodeRemoved()), M2.parent.children.splice(r3, 1);
      }, onNodeRemoved: NOOP, addIdentifiers(e3) {
      }, removeIdentifiers(e3) {
      }, hoist(e3) {
        isString(e3) && (e3 = createSimpleExpression(e3)), M2.hoists.push(e3);
        const t3 = createSimpleExpression(`_hoisted_${M2.hoists.length}`, false, e3.loc, 2);
        return t3.hoisted = e3, t3;
      }, cache(e3, t3 = false, r3 = false) {
        const s3 = createCacheExpression(M2.cached.length, e3, t3, r3);
        return M2.cached.push(s3), s3;
      } };
      return M2.filters = /* @__PURE__ */ new Set(), M2;
    }
    __name(createTransformContext, "createTransformContext");
    function transform(e2, t2) {
      const r2 = createTransformContext(e2, t2);
      traverseNode(e2, r2), t2.hoistStatic && cacheStatic(e2, r2), t2.ssr || function(e3, t3) {
        const { helper: r3 } = t3, { children: s2 } = e3;
        if (1 === s2.length) {
          const r4 = getSingleElementRoot(e3);
          if (r4 && r4.codegenNode) {
            const s3 = r4.codegenNode;
            13 === s3.type && convertToBlock(s3, t3), e3.codegenNode = s3;
          } else
            e3.codegenNode = s2[0];
        } else if (s2.length > 1) {
          let s3 = 64;
          e3.codegenNode = createVNodeCall(t3, r3(cc), void 0, e3.children, s3, void 0, void 0, true, void 0, false);
        }
      }(e2, r2), e2.helpers = /* @__PURE__ */ new Set([...r2.helpers.keys()]), e2.components = [...r2.components], e2.directives = [...r2.directives], e2.imports = r2.imports, e2.hoists = r2.hoists, e2.temps = r2.temps, e2.cached = r2.cached, e2.transformed = true, e2.filters = [...r2.filters];
    }
    __name(transform, "transform");
    function traverseNode(e2, t2) {
      t2.currentNode = e2;
      const { nodeTransforms: r2 } = t2, s2 = [];
      for (let a3 = 0; a3 < r2.length; a3++) {
        const c2 = r2[a3](e2, t2);
        if (c2 && (jr(c2) ? s2.push(...c2) : s2.push(c2)), !t2.currentNode)
          return;
        e2 = t2.currentNode;
      }
      switch (e2.type) {
        case 3:
          t2.ssr || t2.helper(yc);
          break;
        case 5:
          t2.ssr || t2.helper(Ac);
          break;
        case 9:
          for (let r3 = 0; r3 < e2.branches.length; r3++)
            traverseNode(e2.branches[r3], t2);
          break;
        case 10:
        case 11:
        case 1:
        case 0:
          !function(e3, t3) {
            let r3 = 0;
            const nodeRemoved = /* @__PURE__ */ __name(() => {
              r3--;
            }, "nodeRemoved");
            for (; r3 < e3.children.length; r3++) {
              const s3 = e3.children[r3];
              isString(s3) || (t3.grandParent = t3.parent, t3.parent = e3, t3.childIndex = r3, t3.onNodeRemoved = nodeRemoved, traverseNode(s3, t3));
            }
          }(e2, t2);
      }
      t2.currentNode = e2;
      let a2 = s2.length;
      for (; a2--; )
        s2[a2]();
    }
    __name(traverseNode, "traverseNode");
    function createStructuralDirectiveTransform(e2, t2) {
      const r2 = isString(e2) ? (t3) => t3 === e2 : (t3) => e2.test(t3);
      return (e3, s2) => {
        if (1 === e3.type) {
          const { props: a2 } = e3;
          if (3 === e3.tagType && a2.some(isVSlot))
            return;
          const c2 = [];
          for (let p2 = 0; p2 < a2.length; p2++) {
            const u2 = a2[p2];
            if (7 === u2.type && r2(u2.name)) {
              a2.splice(p2, 1), p2--;
              const r3 = t2(e3, u2, s2);
              r3 && c2.push(r3);
            }
          }
          return c2;
        }
      };
    }
    __name(createStructuralDirectiveTransform, "createStructuralDirectiveTransform");
    const Ol = "/*@__PURE__*/", aliasHelper = /* @__PURE__ */ __name((e2) => `${Kc[e2]}: _${Kc[e2]}`, "aliasHelper");
    function generate(e2, t2 = {}) {
      const r2 = function(e3, { mode: t3 = "function", prefixIdentifiers: r3 = "module" === t3, sourceMap: s3 = false, filename: a3 = "template.vue.html", scopeId: c3 = null, optimizeImports: p3 = false, runtimeGlobalName: u3 = "Vue", runtimeModuleName: d3 = "vue", ssrRuntimeModuleName: f3 = "vue/server-renderer", ssr: m3 = false, isTS: g3 = false, inSSR: x3 = false }) {
        const _3 = { mode: t3, prefixIdentifiers: r3, sourceMap: s3, filename: a3, scopeId: c3, optimizeImports: p3, runtimeGlobalName: u3, runtimeModuleName: d3, ssrRuntimeModuleName: f3, ssr: m3, isTS: g3, inSSR: x3, source: e3.source, code: "", column: 1, line: 1, offset: 0, indentLevel: 0, pure: false, map: void 0, helper: (e4) => `_${Kc[e4]}`, push(e4, t4 = -2, r4) {
          _3.code += e4;
        }, indent() {
          newline(++_3.indentLevel);
        }, deindent(e4 = false) {
          e4 ? --_3.indentLevel : newline(--_3.indentLevel);
        }, newline() {
          newline(_3.indentLevel);
        } };
        function newline(e4) {
          _3.push("\n" + "  ".repeat(e4), 0);
        }
        __name(newline, "newline");
        return _3;
      }(e2, t2);
      t2.onContextCreated && t2.onContextCreated(r2);
      const { mode: s2, push: a2, prefixIdentifiers: c2, indent: p2, deindent: u2, newline: d2, scopeId: f2, ssr: m2 } = r2, g2 = Array.from(e2.helpers), x2 = g2.length > 0, _2 = !c2 && "module" !== s2;
      !function(e3, t3) {
        const { ssr: r3, prefixIdentifiers: s3, push: a3, newline: c3, runtimeModuleName: p3, runtimeGlobalName: u3, ssrRuntimeModuleName: d3 } = t3, f3 = u3, m3 = Array.from(e3.helpers);
        if (m3.length > 0 && (a3(`const _Vue = ${f3}
`, -1), e3.hoists.length)) {
          a3(`const { ${[gc, vc, yc, bc, xc].filter((e4) => m3.includes(e4)).map(aliasHelper).join(", ")} } = _Vue
`, -1);
        }
        (function(e4, t4) {
          if (!e4.length)
            return;
          t4.pure = true;
          const { push: r4, newline: s4 } = t4;
          s4();
          for (let a4 = 0; a4 < e4.length; a4++) {
            const c4 = e4[a4];
            c4 && (r4(`const _hoisted_${a4 + 1} = `), genNode(c4, t4), s4());
          }
          t4.pure = false;
        })(e3.hoists, t3), c3(), a3("return ");
      }(e2, r2);
      if (a2(`function ${m2 ? "ssrRender" : "render"}(${(m2 ? ["_ctx", "_push", "_parent", "_attrs"] : ["_ctx", "_cache"]).join(", ")}) {`), p2(), _2 && (a2("with (_ctx) {"), p2(), x2 && (a2(`const { ${g2.map(aliasHelper).join(", ")} } = _Vue
`, -1), d2())), e2.components.length && (genAssets(e2.components, "component", r2), (e2.directives.length || e2.temps > 0) && d2()), e2.directives.length && (genAssets(e2.directives, "directive", r2), e2.temps > 0 && d2()), e2.filters && e2.filters.length && (d2(), genAssets(e2.filters, "filter", r2), d2()), e2.temps > 0) {
        a2("let ");
        for (let t3 = 0; t3 < e2.temps; t3++)
          a2(`${t3 > 0 ? ", " : ""}_temp${t3}`);
      }
      return (e2.components.length || e2.directives.length || e2.temps) && (a2("\n", 0), d2()), m2 || a2("return "), e2.codegenNode ? genNode(e2.codegenNode, r2) : a2("null"), _2 && (u2(), a2("}")), u2(), a2("}"), { ast: e2, code: r2.code, preamble: "", map: r2.map ? r2.map.toJSON() : void 0 };
    }
    __name(generate, "generate");
    function genAssets(e2, t2, { helper: r2, push: s2, newline: a2, isTS: c2 }) {
      const p2 = r2("filter" === t2 ? Sc : "component" === t2 ? _c : wc);
      for (let r3 = 0; r3 < e2.length; r3++) {
        let u2 = e2[r3];
        const d2 = u2.endsWith("__self");
        d2 && (u2 = u2.slice(0, -6)), s2(`const ${toValidAssetId(u2, t2)} = ${p2}(${JSON.stringify(u2)}${d2 ? ", true" : ""})${c2 ? "!" : ""}`), r3 < e2.length - 1 && a2();
      }
    }
    __name(genAssets, "genAssets");
    function genNodeListAsArray(e2, t2) {
      const r2 = e2.length > 3 || false;
      t2.push("["), r2 && t2.indent(), genNodeList(e2, t2, r2), r2 && t2.deindent(), t2.push("]");
    }
    __name(genNodeListAsArray, "genNodeListAsArray");
    function genNodeList(e2, t2, r2 = false, s2 = true) {
      const { push: a2, newline: c2 } = t2;
      for (let p2 = 0; p2 < e2.length; p2++) {
        const u2 = e2[p2];
        isString(u2) ? a2(u2, -3) : jr(u2) ? genNodeListAsArray(u2, t2) : genNode(u2, t2), p2 < e2.length - 1 && (r2 ? (s2 && a2(","), c2()) : s2 && a2(", "));
      }
    }
    __name(genNodeList, "genNodeList");
    function genNode(e2, t2) {
      if (isString(e2))
        t2.push(e2, -3);
      else if (isSymbol(e2))
        t2.push(t2.helper(e2));
      else
        switch (e2.type) {
          case 1:
          case 9:
          case 11:
          case 12:
            genNode(e2.codegenNode, t2);
            break;
          case 2:
            !function(e3, t3) {
              t3.push(JSON.stringify(e3.content), -3, e3);
            }(e2, t2);
            break;
          case 4:
            genExpression(e2, t2);
            break;
          case 5:
            !function(e3, t3) {
              const { push: r2, helper: s2, pure: a2 } = t3;
              a2 && r2(Ol);
              r2(`${s2(Ac)}(`), genNode(e3.content, t3), r2(")");
            }(e2, t2);
            break;
          case 8:
            genCompoundExpression(e2, t2);
            break;
          case 3:
            !function(e3, t3) {
              const { push: r2, helper: s2, pure: a2 } = t3;
              a2 && r2(Ol);
              r2(`${s2(yc)}(${JSON.stringify(e3.content)})`, -3, e3);
            }(e2, t2);
            break;
          case 13:
            !function(e3, t3) {
              const { push: r2, helper: s2, pure: a2 } = t3, { tag: c2, props: p2, children: u2, patchFlag: d2, dynamicProps: f2, directives: m2, isBlock: g2, disableTracking: x2, isComponent: _2 } = e3;
              let E2;
              d2 && (E2 = String(d2));
              m2 && r2(s2(Tc) + "(");
              g2 && r2(`(${s2(fc)}(${x2 ? "true" : ""}), `);
              a2 && r2(Ol);
              const S2 = g2 ? getVNodeBlockHelper(t3.inSSR, _2) : getVNodeHelper(t3.inSSR, _2);
              r2(s2(S2) + "(", -2, e3), genNodeList(function(e4) {
                let t4 = e4.length;
                for (; t4-- && null == e4[t4]; )
                  ;
                return e4.slice(0, t4 + 1).map((e5) => e5 || "null");
              }([c2, p2, u2, E2, f2]), t3), r2(")"), g2 && r2(")");
              m2 && (r2(", "), genNode(m2, t3), r2(")"));
            }(e2, t2);
            break;
          case 14:
            !function(e3, t3) {
              const { push: r2, helper: s2, pure: a2 } = t3, c2 = isString(e3.callee) ? e3.callee : s2(e3.callee);
              a2 && r2(Ol);
              r2(c2 + "(", -2, e3), genNodeList(e3.arguments, t3), r2(")");
            }(e2, t2);
            break;
          case 15:
            !function(e3, t3) {
              const { push: r2, indent: s2, deindent: a2, newline: c2 } = t3, { properties: p2 } = e3;
              if (!p2.length)
                return void r2("{}", -2, e3);
              const u2 = p2.length > 1 || false;
              r2(u2 ? "{" : "{ "), u2 && s2();
              for (let e4 = 0; e4 < p2.length; e4++) {
                const { key: s3, value: a3 } = p2[e4];
                genExpressionAsPropertyKey(s3, t3), r2(": "), genNode(a3, t3), e4 < p2.length - 1 && (r2(","), c2());
              }
              u2 && a2(), r2(u2 ? "}" : " }");
            }(e2, t2);
            break;
          case 17:
            !function(e3, t3) {
              genNodeListAsArray(e3.elements, t3);
            }(e2, t2);
            break;
          case 18:
            !function(e3, t3) {
              const { push: r2, indent: s2, deindent: a2 } = t3, { params: c2, returns: p2, body: u2, newline: d2, isSlot: f2 } = e3;
              f2 && r2(`_${Kc[Vc]}(`);
              r2("(", -2, e3), jr(c2) ? genNodeList(c2, t3) : c2 && genNode(c2, t3);
              r2(") => "), (d2 || u2) && (r2("{"), s2());
              p2 ? (d2 && r2("return "), jr(p2) ? genNodeListAsArray(p2, t3) : genNode(p2, t3)) : u2 && genNode(u2, t3);
              (d2 || u2) && (a2(), r2("}"));
              f2 && (e3.isNonScopedSlot && r2(", undefined, true"), r2(")"));
            }(e2, t2);
            break;
          case 19:
            !function(e3, t3) {
              const { test: r2, consequent: s2, alternate: a2, newline: c2 } = e3, { push: p2, indent: u2, deindent: d2, newline: f2 } = t3;
              if (4 === r2.type) {
                const e4 = !isSimpleIdentifier(r2.content);
                e4 && p2("("), genExpression(r2, t3), e4 && p2(")");
              } else
                p2("("), genNode(r2, t3), p2(")");
              c2 && u2(), t3.indentLevel++, c2 || p2(" "), p2("? "), genNode(s2, t3), t3.indentLevel--, c2 && f2(), c2 || p2(" "), p2(": ");
              const m2 = 19 === a2.type;
              m2 || t3.indentLevel++;
              genNode(a2, t3), m2 || t3.indentLevel--;
              c2 && d2(true);
            }(e2, t2);
            break;
          case 20:
            !function(e3, t3) {
              const { push: r2, helper: s2, indent: a2, deindent: c2, newline: p2 } = t3, { needPauseTracking: u2, needArraySpread: d2 } = e3;
              d2 && r2("[...(");
              r2(`_cache[${e3.index}] || (`), u2 && (a2(), r2(`${s2(Dc)}(-1`), e3.inVOnce && r2(", true"), r2("),"), p2(), r2("("));
              r2(`_cache[${e3.index}] = `), genNode(e3.value, t3), u2 && (r2(`).cacheIndex = ${e3.index},`), p2(), r2(`${s2(Dc)}(1),`), p2(), r2(`_cache[${e3.index}]`), c2());
              r2(")"), d2 && r2(")]");
            }(e2, t2);
            break;
          case 21:
            genNodeList(e2.body, t2, true, false);
        }
    }
    __name(genNode, "genNode");
    function genExpression(e2, t2) {
      const { content: r2, isStatic: s2 } = e2;
      t2.push(s2 ? JSON.stringify(r2) : r2, -3, e2);
    }
    __name(genExpression, "genExpression");
    function genCompoundExpression(e2, t2) {
      for (let r2 = 0; r2 < e2.children.length; r2++) {
        const s2 = e2.children[r2];
        isString(s2) ? t2.push(s2, -3) : genNode(s2, t2);
      }
    }
    __name(genCompoundExpression, "genCompoundExpression");
    function genExpressionAsPropertyKey(e2, t2) {
      const { push: r2 } = t2;
      if (8 === e2.type)
        r2("["), genCompoundExpression(e2, t2), r2("]");
      else if (e2.isStatic) {
        r2(isSimpleIdentifier(e2.content) ? e2.content : JSON.stringify(e2.content), -2, e2);
      } else
        r2(`[${e2.content}]`, -3, e2);
    }
    __name(genExpressionAsPropertyKey, "genExpressionAsPropertyKey");
    new RegExp("\\b" + "arguments,await,break,case,catch,class,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,let,new,return,super,switch,throw,try,var,void,while,with,yield".split(",").join("\\b|\\b") + "\\b");
    function processExpression(e2, t2, r2 = false, s2 = false, a2 = Object.create(t2.identifiers)) {
      return e2;
    }
    __name(processExpression, "processExpression");
    const Il = createStructuralDirectiveTransform(/^(if|else|else-if)$/, (e2, t2, r2) => processIf(e2, t2, r2, (e3, t3, s2) => {
      const a2 = r2.parent.children;
      let c2 = a2.indexOf(e3), p2 = 0;
      for (; c2-- >= 0; ) {
        const e4 = a2[c2];
        e4 && 9 === e4.type && (p2 += e4.branches.length);
      }
      return () => {
        if (s2)
          e3.codegenNode = createCodegenNodeForBranch(t3, p2, r2);
        else {
          const s3 = function(e4) {
            for (; ; )
              if (19 === e4.type) {
                if (19 !== e4.alternate.type)
                  return e4;
                e4 = e4.alternate;
              } else
                20 === e4.type && (e4 = e4.value);
          }(e3.codegenNode);
          s3.alternate = createCodegenNodeForBranch(t3, p2 + e3.branches.length - 1, r2);
        }
      };
    }));
    function processIf(e2, t2, r2, s2) {
      if (!("else" === t2.name || t2.exp && t2.exp.content.trim())) {
        const s3 = t2.exp ? t2.exp.loc : e2.loc;
        r2.onError(createCompilerError(28, t2.loc)), t2.exp = createSimpleExpression("true", false, s3);
      }
      if ("if" === t2.name) {
        const c2 = createIfBranch(e2, t2), p2 = { type: 9, loc: (a2 = e2.loc, getLoc(a2.start.offset, a2.end.offset)), branches: [c2] };
        if (r2.replaceNode(p2), s2)
          return s2(p2, c2, true);
      } else {
        const a3 = r2.parent.children;
        let c2 = a3.indexOf(e2);
        for (; c2-- >= -1; ) {
          const p2 = a3[c2];
          if (p2 && 3 === p2.type)
            r2.removeNode(p2);
          else {
            if (!p2 || 2 !== p2.type || p2.content.trim().length) {
              if (p2 && 9 === p2.type) {
                "else-if" === t2.name && void 0 === p2.branches[p2.branches.length - 1].condition && r2.onError(createCompilerError(30, e2.loc)), r2.removeNode();
                const a4 = createIfBranch(e2, t2);
                p2.branches.push(a4);
                const c3 = s2 && s2(p2, a4, false);
                traverseNode(a4, r2), c3 && c3(), r2.currentNode = null;
              } else
                r2.onError(createCompilerError(30, e2.loc));
              break;
            }
            r2.removeNode(p2);
          }
        }
      }
      var a2;
    }
    __name(processIf, "processIf");
    function createIfBranch(e2, t2) {
      const r2 = 3 === e2.tagType;
      return { type: 10, loc: e2.loc, condition: "else" === t2.name ? void 0 : t2.exp, children: r2 && !findDir(e2, "for") ? e2.children : [e2], userKey: findProp(e2, "key"), isTemplateIf: r2 };
    }
    __name(createIfBranch, "createIfBranch");
    function createCodegenNodeForBranch(e2, t2, r2) {
      return e2.condition ? createConditionalExpression(e2.condition, createChildrenCodegenNode(e2, t2, r2), createCallExpression(r2.helper(yc), ['""', "true"])) : createChildrenCodegenNode(e2, t2, r2);
    }
    __name(createCodegenNodeForBranch, "createCodegenNodeForBranch");
    function createChildrenCodegenNode(e2, t2, r2) {
      const { helper: s2 } = r2, a2 = createObjectProperty("key", createSimpleExpression(`${t2}`, false, Xc, 2)), { children: c2 } = e2, p2 = c2[0];
      if (1 !== c2.length || 1 !== p2.type) {
        if (1 === c2.length && 11 === p2.type) {
          const e3 = p2.codegenNode;
          return injectProp(e3, a2, r2), e3;
        }
        {
          let t3 = 64;
          return createVNodeCall(r2, s2(cc), createObjectExpression([a2]), c2, t3, void 0, void 0, true, false, false, e2.loc);
        }
      }
      {
        const e3 = p2.codegenNode, t3 = getMemoedVNodeCall(e3);
        return 13 === t3.type && convertToBlock(t3, r2), injectProp(t3, a2, r2), e3;
      }
    }
    __name(createChildrenCodegenNode, "createChildrenCodegenNode");
    const transformBind = /* @__PURE__ */ __name((e2, t2, r2) => {
      const { modifiers: s2, loc: a2 } = e2, c2 = e2.arg;
      let { exp: p2 } = e2;
      if (p2 && 4 === p2.type && !p2.content.trim() && (p2 = void 0), !p2) {
        if (4 !== c2.type || !c2.isStatic)
          return r2.onError(createCompilerError(52, c2.loc)), { props: [createObjectProperty(c2, createSimpleExpression("", true, a2))] };
        transformBindShorthand(e2), p2 = e2.exp;
      }
      return 4 !== c2.type ? (c2.children.unshift("("), c2.children.push(') || ""')) : c2.isStatic || (c2.content = c2.content ? `${c2.content} || ""` : '""'), s2.some((e3) => "camel" === e3.content) && (4 === c2.type ? c2.isStatic ? c2.content = Fr(c2.content) : c2.content = `${r2.helperString($c)}(${c2.content})` : (c2.children.unshift(`${r2.helperString($c)}(`), c2.children.push(")"))), r2.inSSR || (s2.some((e3) => "prop" === e3.content) && injectPrefix(c2, "."), s2.some((e3) => "attr" === e3.content) && injectPrefix(c2, "^")), { props: [createObjectProperty(c2, p2)] };
    }, "transformBind"), transformBindShorthand = /* @__PURE__ */ __name((e2, t2) => {
      const r2 = e2.arg, s2 = Fr(r2.content);
      e2.exp = createSimpleExpression(s2, false, r2.loc);
    }, "transformBindShorthand"), injectPrefix = /* @__PURE__ */ __name((e2, t2) => {
      4 === e2.type ? e2.isStatic ? e2.content = t2 + e2.content : e2.content = `\`${t2}\${${e2.content}}\`` : (e2.children.unshift(`'${t2}' + (`), e2.children.push(")"));
    }, "injectPrefix"), Pl = createStructuralDirectiveTransform("for", (e2, t2, r2) => {
      const { helper: s2, removeHelper: a2 } = r2;
      return processFor(e2, t2, r2, (t3) => {
        const c2 = createCallExpression(s2(Cc), [t3.source]), p2 = isTemplateNode(e2), u2 = findDir(e2, "memo"), d2 = findProp(e2, "key", false, true);
        d2 && 7 === d2.type && !d2.exp && transformBindShorthand(d2);
        let f2 = d2 && (6 === d2.type ? d2.value ? createSimpleExpression(d2.value.content, true) : void 0 : d2.exp);
        const m2 = d2 && f2 ? createObjectProperty("key", f2) : null, g2 = 4 === t3.source.type && t3.source.constType > 0, x2 = g2 ? 64 : d2 ? 128 : 256;
        return t3.codegenNode = createVNodeCall(r2, s2(cc), void 0, c2, x2, void 0, void 0, true, !g2, false, e2.loc), () => {
          let d3;
          const { children: x3 } = t3, _2 = 1 !== x3.length || 1 !== x3[0].type, E2 = isSlotOutlet(e2) ? e2 : p2 && 1 === e2.children.length && isSlotOutlet(e2.children[0]) ? e2.children[0] : null;
          if (E2 ? (d3 = E2.codegenNode, p2 && m2 && injectProp(d3, m2, r2)) : _2 ? d3 = createVNodeCall(r2, s2(cc), m2 ? createObjectExpression([m2]) : void 0, e2.children, 64, void 0, void 0, true, void 0, false) : (d3 = x3[0].codegenNode, p2 && m2 && injectProp(d3, m2, r2), d3.isBlock !== !g2 && (d3.isBlock ? (a2(fc), a2(getVNodeBlockHelper(r2.inSSR, d3.isComponent))) : a2(getVNodeHelper(r2.inSSR, d3.isComponent))), d3.isBlock = !g2, d3.isBlock ? (s2(fc), s2(getVNodeBlockHelper(r2.inSSR, d3.isComponent))) : s2(getVNodeHelper(r2.inSSR, d3.isComponent))), u2) {
            const e3 = createFunctionExpression(createForLoopParams(t3.parseResult, [createSimpleExpression("_cached")]));
            e3.body = createBlockStatement([createCompoundExpression(["const _memo = (", u2.exp, ")"]), createCompoundExpression(["if (_cached", ...f2 ? [" && _cached.key === ", f2] : [], ` && ${r2.helperString(Wc)}(_cached, _memo)) return _cached`]), createCompoundExpression(["const _item = ", d3]), createSimpleExpression("_item.memo = _memo"), createSimpleExpression("return _item")]), c2.arguments.push(e3, createSimpleExpression("_cache"), createSimpleExpression(String(r2.cached.length))), r2.cached.push(null);
          } else
            c2.arguments.push(createFunctionExpression(createForLoopParams(t3.parseResult), d3, true));
        };
      });
    });
    function processFor(e2, t2, r2, s2) {
      if (!t2.exp)
        return void r2.onError(createCompilerError(31, t2.loc));
      const a2 = t2.forParseResult;
      if (!a2)
        return void r2.onError(createCompilerError(32, t2.loc));
      finalizeForParseResult(a2);
      const { addIdentifiers: c2, removeIdentifiers: p2, scopes: u2 } = r2, { source: d2, value: f2, key: m2, index: g2 } = a2, x2 = { type: 11, loc: t2.loc, source: d2, valueAlias: f2, keyAlias: m2, objectIndexAlias: g2, parseResult: a2, children: isTemplateNode(e2) ? e2.children : [e2] };
      r2.replaceNode(x2), u2.vFor++;
      const _2 = s2 && s2(x2);
      return () => {
        u2.vFor--, _2 && _2();
      };
    }
    __name(processFor, "processFor");
    function finalizeForParseResult(e2, t2) {
      e2.finalized || (e2.finalized = true);
    }
    __name(finalizeForParseResult, "finalizeForParseResult");
    function createForLoopParams({ value: e2, key: t2, index: r2 }, s2 = []) {
      return function(e3) {
        let t3 = e3.length;
        for (; t3-- && !e3[t3]; )
          ;
        return e3.slice(0, t3 + 1).map((e4, t4) => e4 || createSimpleExpression("_".repeat(t4 + 1), false));
      }([e2, t2, r2, ...s2]);
    }
    __name(createForLoopParams, "createForLoopParams");
    const Ll = createSimpleExpression("undefined", false), trackSlotScopes = /* @__PURE__ */ __name((e2, t2) => {
      if (1 === e2.type && (1 === e2.tagType || 3 === e2.tagType)) {
        const r2 = findDir(e2, "slot");
        if (r2)
          return r2.exp, t2.scopes.vSlot++, () => {
            t2.scopes.vSlot--;
          };
      }
    }, "trackSlotScopes"), buildClientSlotFn = /* @__PURE__ */ __name((e2, t2, r2, s2) => createFunctionExpression(e2, r2, false, true, r2.length ? r2[0].loc : s2), "buildClientSlotFn");
    function buildSlots(e2, t2, r2 = buildClientSlotFn) {
      t2.helper(Vc);
      const { children: s2, loc: a2 } = e2, c2 = [], p2 = [];
      let u2 = t2.scopes.vSlot > 0 || t2.scopes.vFor > 0;
      const d2 = findDir(e2, "slot", true);
      if (d2) {
        const { arg: e3, exp: t3 } = d2;
        e3 && !isStaticExp(e3) && (u2 = true), c2.push(createObjectProperty(e3 || createSimpleExpression("default", true), r2(t3, void 0, s2, a2)));
      }
      let f2 = false, m2 = false;
      const g2 = [], x2 = /* @__PURE__ */ new Set();
      let _2 = 0;
      for (let e3 = 0; e3 < s2.length; e3++) {
        const a3 = s2[e3];
        let E3;
        if (!isTemplateNode(a3) || !(E3 = findDir(a3, "slot", true))) {
          3 !== a3.type && g2.push(a3);
          continue;
        }
        if (d2) {
          t2.onError(createCompilerError(37, E3.loc));
          break;
        }
        f2 = true;
        const { children: S3, loc: T2 } = a3, { arg: C2 = createSimpleExpression("default", true), exp: R2, loc: N2 } = E3;
        let O2;
        isStaticExp(C2) ? O2 = C2 ? C2.content : "default" : u2 = true;
        const I2 = findDir(a3, "for"), P2 = r2(R2, I2, S3, T2);
        let L2, M2;
        if (L2 = findDir(a3, "if"))
          u2 = true, p2.push(createConditionalExpression(L2.exp, buildDynamicSlot(C2, P2, _2++), Ll));
        else if (M2 = findDir(a3, /^else(-if)?$/, true)) {
          let r3, a4 = e3;
          for (; a4-- && (r3 = s2[a4], 3 === r3.type || !isNonWhitespaceContent(r3)); )
            ;
          if (r3 && isTemplateNode(r3) && findDir(r3, /^(else-)?if$/)) {
            let e4 = p2[p2.length - 1];
            for (; 19 === e4.alternate.type; )
              e4 = e4.alternate;
            e4.alternate = M2.exp ? createConditionalExpression(M2.exp, buildDynamicSlot(C2, P2, _2++), Ll) : buildDynamicSlot(C2, P2, _2++);
          } else
            t2.onError(createCompilerError(30, M2.loc));
        } else if (I2) {
          u2 = true;
          const e4 = I2.forParseResult;
          e4 ? (finalizeForParseResult(e4), p2.push(createCallExpression(t2.helper(Cc), [e4.source, createFunctionExpression(createForLoopParams(e4), buildDynamicSlot(C2, P2), true)]))) : t2.onError(createCompilerError(32, I2.loc));
        } else {
          if (O2) {
            if (x2.has(O2)) {
              t2.onError(createCompilerError(38, N2));
              continue;
            }
            x2.add(O2), "default" === O2 && (m2 = true);
          }
          c2.push(createObjectProperty(C2, P2));
        }
      }
      if (!d2) {
        const buildDefaultSlotProperty = /* @__PURE__ */ __name((e3, s3) => {
          const c3 = r2(e3, void 0, s3, a2);
          return t2.compatConfig && (c3.isNonScopedSlot = true), createObjectProperty("default", c3);
        }, "buildDefaultSlotProperty");
        f2 ? g2.length && g2.some((e3) => isNonWhitespaceContent(e3)) && (m2 ? t2.onError(createCompilerError(39, g2[0].loc)) : c2.push(buildDefaultSlotProperty(void 0, g2))) : c2.push(buildDefaultSlotProperty(void 0, s2));
      }
      const E2 = u2 ? 2 : hasForwardedSlots(e2.children) ? 3 : 1;
      let S2 = createObjectExpression(c2.concat(createObjectProperty("_", createSimpleExpression(E2 + "", false))), a2);
      return p2.length && (S2 = createCallExpression(t2.helper(Rc), [S2, createArrayExpression(p2)])), { slots: S2, hasDynamicSlots: u2 };
    }
    __name(buildSlots, "buildSlots");
    function buildDynamicSlot(e2, t2, r2) {
      const s2 = [createObjectProperty("name", e2), createObjectProperty("fn", t2)];
      return null != r2 && s2.push(createObjectProperty("key", createSimpleExpression(String(r2), true))), createObjectExpression(s2);
    }
    __name(buildDynamicSlot, "buildDynamicSlot");
    function hasForwardedSlots(e2) {
      for (let t2 = 0; t2 < e2.length; t2++) {
        const r2 = e2[t2];
        switch (r2.type) {
          case 1:
            if (2 === r2.tagType || hasForwardedSlots(r2.children))
              return true;
            break;
          case 9:
            if (hasForwardedSlots(r2.branches))
              return true;
            break;
          case 10:
          case 11:
            if (hasForwardedSlots(r2.children))
              return true;
        }
      }
      return false;
    }
    __name(hasForwardedSlots, "hasForwardedSlots");
    function isNonWhitespaceContent(e2) {
      return 2 !== e2.type && 12 !== e2.type || (2 === e2.type ? !!e2.content.trim() : isNonWhitespaceContent(e2.content));
    }
    __name(isNonWhitespaceContent, "isNonWhitespaceContent");
    const Ml = /* @__PURE__ */ new WeakMap(), transformElement = /* @__PURE__ */ __name((e2, t2) => function() {
      if (1 !== (e2 = t2.currentNode).type || 0 !== e2.tagType && 1 !== e2.tagType)
        return;
      const { tag: r2, props: s2 } = e2, a2 = 1 === e2.tagType;
      let c2 = a2 ? resolveComponentType(e2, t2) : `"${r2}"`;
      const p2 = isObject(c2) && c2.callee === Ec;
      let u2, d2, f2, m2, g2, x2 = 0, _2 = p2 || c2 === lc || c2 === pc || !a2 && ("svg" === r2 || "foreignObject" === r2 || "math" === r2);
      if (s2.length > 0) {
        const r3 = buildProps(e2, t2, void 0, a2, p2);
        u2 = r3.props, x2 = r3.patchFlag, m2 = r3.dynamicPropNames;
        const s3 = r3.directives;
        g2 = s3 && s3.length ? createArrayExpression(s3.map((e3) => buildDirectiveArgs(e3, t2))) : void 0, r3.shouldUseBlock && (_2 = true);
      }
      if (e2.children.length > 0) {
        c2 === uc && (_2 = true, x2 |= 1024);
        if (a2 && c2 !== lc && c2 !== uc) {
          const { slots: r3, hasDynamicSlots: s3 } = buildSlots(e2, t2);
          d2 = r3, s3 && (x2 |= 1024);
        } else if (1 === e2.children.length && c2 !== lc) {
          const r3 = e2.children[0], s3 = r3.type, a3 = 5 === s3 || 8 === s3;
          a3 && 0 === getConstantType(r3, t2) && (x2 |= 1), d2 = a3 || 2 === s3 ? r3 : e2.children;
        } else
          d2 = e2.children;
      }
      m2 && m2.length && (f2 = function(e3) {
        let t3 = "[";
        for (let r3 = 0, s3 = e3.length; r3 < s3; r3++)
          t3 += JSON.stringify(e3[r3]), r3 < s3 - 1 && (t3 += ", ");
        return t3 + "]";
      }(m2)), e2.codegenNode = createVNodeCall(t2, c2, u2, d2, 0 === x2 ? void 0 : x2, f2, g2, !!_2, false, a2, e2.loc);
    }, "transformElement");
    function resolveComponentType(e2, t2, r2 = false) {
      let { tag: s2 } = e2;
      const a2 = isComponentTag(s2), c2 = findProp(e2, "is", false, true);
      if (c2)
        if (a2 || isCompatEnabled("COMPILER_IS_ON_ELEMENT", t2)) {
          let e3;
          if (6 === c2.type ? e3 = c2.value && createSimpleExpression(c2.value.content, true) : (e3 = c2.exp, e3 || (e3 = createSimpleExpression("is", false, c2.arg.loc))), e3)
            return createCallExpression(t2.helper(Ec), [e3]);
        } else
          6 === c2.type && c2.value.content.startsWith("vue:") && (s2 = c2.value.content.slice(4));
      const p2 = isCoreComponent(s2) || t2.isBuiltInComponent(s2);
      return p2 ? (r2 || t2.helper(p2), p2) : (t2.helper(_c), t2.components.add(s2), toValidAssetId(s2, "component"));
    }
    __name(resolveComponentType, "resolveComponentType");
    function buildProps(e2, t2, r2 = e2.props, s2, a2, c2 = false) {
      const { tag: p2, loc: u2, children: d2 } = e2;
      let f2 = [];
      const m2 = [], g2 = [], x2 = d2.length > 0;
      let _2 = false, E2 = 0, S2 = false, T2 = false, C2 = false, R2 = false, N2 = false, O2 = false;
      const I2 = [], pushMergeArg = /* @__PURE__ */ __name((e3) => {
        f2.length && (m2.push(createObjectExpression(dedupeProperties(f2), u2)), f2 = []), e3 && m2.push(e3);
      }, "pushMergeArg"), pushRefVForMarker = /* @__PURE__ */ __name(() => {
        t2.scopes.vFor > 0 && f2.push(createObjectProperty(createSimpleExpression("ref_for", true), createSimpleExpression("true")));
      }, "pushRefVForMarker"), analyzePatchFlag = /* @__PURE__ */ __name(({ key: e3, value: r3 }) => {
        if (isStaticExp(e3)) {
          const c3 = e3.content, p3 = isOn(c3);
          if (!p3 || s2 && !a2 || "onclick" === c3.toLowerCase() || "onUpdate:modelValue" === c3 || Hr(c3) || (R2 = true), p3 && Hr(c3) && (O2 = true), p3 && 14 === r3.type && (r3 = r3.arguments[0]), 20 === r3.type || (4 === r3.type || 8 === r3.type) && getConstantType(r3, t2) > 0)
            return;
          "ref" === c3 ? S2 = true : "class" === c3 ? T2 = true : "style" === c3 ? C2 = true : "key" === c3 || I2.includes(c3) || I2.push(c3), !s2 || "class" !== c3 && "style" !== c3 || I2.includes(c3) || I2.push(c3);
        } else
          N2 = true;
      }, "analyzePatchFlag");
      for (let a3 = 0; a3 < r2.length; a3++) {
        const d3 = r2[a3];
        if (6 === d3.type) {
          const { loc: e3, name: r3, nameLoc: s3, value: a4 } = d3;
          let c3 = true;
          if ("ref" === r3 && (S2 = true, pushRefVForMarker()), "is" === r3 && (isComponentTag(p2) || a4 && a4.content.startsWith("vue:") || isCompatEnabled("COMPILER_IS_ON_ELEMENT", t2)))
            continue;
          f2.push(createObjectProperty(createSimpleExpression(r3, true, s3), createSimpleExpression(a4 ? a4.content : "", c3, a4 ? a4.loc : e3)));
        } else {
          const { name: r3, arg: a4, exp: S3, loc: T3, modifiers: C3 } = d3, R3 = "bind" === r3, O3 = "on" === r3;
          if ("slot" === r3) {
            s2 || t2.onError(createCompilerError(40, T3));
            continue;
          }
          if ("once" === r3 || "memo" === r3)
            continue;
          if ("is" === r3 || R3 && isStaticArgOf(a4, "is") && (isComponentTag(p2) || isCompatEnabled("COMPILER_IS_ON_ELEMENT", t2)))
            continue;
          if (O3 && c2)
            continue;
          if ((R3 && isStaticArgOf(a4, "key") || O3 && x2 && isStaticArgOf(a4, "vue:before-update")) && (_2 = true), R3 && isStaticArgOf(a4, "ref") && pushRefVForMarker(), !a4 && (R3 || O3)) {
            if (N2 = true, S3)
              if (R3) {
                if (pushMergeArg(), isCompatEnabled("COMPILER_V_BIND_OBJECT_ORDER", t2)) {
                  m2.unshift(S3);
                  continue;
                }
                pushRefVForMarker(), pushMergeArg(), m2.push(S3);
              } else
                pushMergeArg({ type: 14, loc: T3, callee: t2.helper(Mc), arguments: s2 ? [S3] : [S3, "true"] });
            else
              t2.onError(createCompilerError(R3 ? 34 : 35, T3));
            continue;
          }
          R3 && C3.some((e3) => "prop" === e3.content) && (E2 |= 32);
          const I3 = t2.directiveTransforms[r3];
          if (I3) {
            const { props: r4, needRuntime: s3 } = I3(d3, e2, t2);
            !c2 && r4.forEach(analyzePatchFlag), O3 && a4 && !isStaticExp(a4) ? pushMergeArg(createObjectExpression(r4, u2)) : f2.push(...r4), s3 && (g2.push(d3), isSymbol(s3) && Ml.set(d3, s3));
          } else
            Ur(r3) || (g2.push(d3), x2 && (_2 = true));
        }
      }
      let P2;
      if (m2.length ? (pushMergeArg(), P2 = m2.length > 1 ? createCallExpression(t2.helper(Nc), m2, u2) : m2[0]) : f2.length && (P2 = createObjectExpression(dedupeProperties(f2), u2)), N2 ? E2 |= 16 : (T2 && !s2 && (E2 |= 2), C2 && !s2 && (E2 |= 4), I2.length && (E2 |= 8), R2 && (E2 |= 32)), _2 || 0 !== E2 && 32 !== E2 || !(S2 || O2 || g2.length > 0) || (E2 |= 512), !t2.inSSR && P2)
        switch (P2.type) {
          case 15:
            let e3 = -1, r3 = -1, s3 = false;
            for (let t3 = 0; t3 < P2.properties.length; t3++) {
              const a4 = P2.properties[t3].key;
              isStaticExp(a4) ? "class" === a4.content ? e3 = t3 : "style" === a4.content && (r3 = t3) : a4.isHandlerKey || (s3 = true);
            }
            const a3 = P2.properties[e3], c3 = P2.properties[r3];
            s3 ? P2 = createCallExpression(t2.helper(Pc), [P2]) : (a3 && !isStaticExp(a3.value) && (a3.value = createCallExpression(t2.helper(Oc), [a3.value])), c3 && (C2 || 4 === c3.value.type && "[" === c3.value.content.trim()[0] || 17 === c3.value.type) && (c3.value = createCallExpression(t2.helper(Ic), [c3.value])));
            break;
          case 14:
            break;
          default:
            P2 = createCallExpression(t2.helper(Pc), [createCallExpression(t2.helper(Lc), [P2])]);
        }
      return { props: P2, directives: g2, patchFlag: E2, dynamicPropNames: I2, shouldUseBlock: _2 };
    }
    __name(buildProps, "buildProps");
    function dedupeProperties(e2) {
      const t2 = /* @__PURE__ */ new Map(), r2 = [];
      for (let s2 = 0; s2 < e2.length; s2++) {
        const a2 = e2[s2];
        if (8 === a2.key.type || !a2.key.isStatic) {
          r2.push(a2);
          continue;
        }
        const c2 = a2.key.content, p2 = t2.get(c2);
        p2 ? ("style" === c2 || "class" === c2 || isOn(c2)) && mergeAsArray(p2, a2) : (t2.set(c2, a2), r2.push(a2));
      }
      return r2;
    }
    __name(dedupeProperties, "dedupeProperties");
    function mergeAsArray(e2, t2) {
      17 === e2.value.type ? e2.value.elements.push(t2.value) : e2.value = createArrayExpression([e2.value, t2.value], e2.loc);
    }
    __name(mergeAsArray, "mergeAsArray");
    function buildDirectiveArgs(e2, t2) {
      const r2 = [], s2 = Ml.get(e2);
      s2 ? r2.push(t2.helperString(s2)) : (t2.helper(wc), t2.directives.add(e2.name), r2.push(toValidAssetId(e2.name, "directive")));
      const { loc: a2 } = e2;
      if (e2.exp && r2.push(e2.exp), e2.arg && (e2.exp || r2.push("void 0"), r2.push(e2.arg)), Object.keys(e2.modifiers).length) {
        e2.arg || (e2.exp || r2.push("void 0"), r2.push("void 0"));
        const t3 = createSimpleExpression("true", false, a2);
        r2.push(createObjectExpression(e2.modifiers.map((e3) => createObjectProperty(e3, t3)), a2));
      }
      return createArrayExpression(r2, e2.loc);
    }
    __name(buildDirectiveArgs, "buildDirectiveArgs");
    function isComponentTag(e2) {
      return "component" === e2 || "Component" === e2;
    }
    __name(isComponentTag, "isComponentTag");
    const transformSlotOutlet = /* @__PURE__ */ __name((e2, t2) => {
      if (isSlotOutlet(e2)) {
        const { children: r2, loc: s2 } = e2, { slotName: a2, slotProps: c2 } = processSlotOutlet(e2, t2), p2 = [t2.prefixIdentifiers ? "_ctx.$slots" : "$slots", a2, "{}", "undefined", "true"];
        let u2 = 2;
        c2 && (p2[2] = c2, u2 = 3), r2.length && (p2[3] = createFunctionExpression([], r2, false, false, s2), u2 = 4), t2.scopeId && !t2.slotted && (u2 = 5), p2.splice(u2), e2.codegenNode = createCallExpression(t2.helper(kc), p2, s2);
      }
    }, "transformSlotOutlet");
    function processSlotOutlet(e2, t2) {
      let r2, s2 = '"default"';
      const a2 = [];
      for (let t3 = 0; t3 < e2.props.length; t3++) {
        const r3 = e2.props[t3];
        if (6 === r3.type)
          r3.value && ("name" === r3.name ? s2 = JSON.stringify(r3.value.content) : (r3.name = Fr(r3.name), a2.push(r3)));
        else if ("bind" === r3.name && isStaticArgOf(r3.arg, "name")) {
          if (r3.exp)
            s2 = r3.exp;
          else if (r3.arg && 4 === r3.arg.type) {
            const e3 = Fr(r3.arg.content);
            s2 = r3.exp = createSimpleExpression(e3, false, r3.arg.loc);
          }
        } else
          "bind" === r3.name && r3.arg && isStaticExp(r3.arg) && (r3.arg.content = Fr(r3.arg.content)), a2.push(r3);
      }
      if (a2.length > 0) {
        const { props: s3, directives: c2 } = buildProps(e2, t2, a2, false, false);
        r2 = s3, c2.length && t2.onError(createCompilerError(36, c2[0].loc));
      }
      return { slotName: s2, slotProps: r2 };
    }
    __name(processSlotOutlet, "processSlotOutlet");
    const transformOn$1 = /* @__PURE__ */ __name((e2, t2, r2, s2) => {
      const { loc: a2, modifiers: c2, arg: p2 } = e2;
      let u2;
      if (e2.exp || c2.length || r2.onError(createCompilerError(35, a2)), 4 === p2.type)
        if (p2.isStatic) {
          let e3 = p2.content;
          e3.startsWith("vue:") && (e3 = `vnode-${e3.slice(4)}`);
          u2 = createSimpleExpression(0 !== t2.tagType || e3.startsWith("vnode") || !/[A-Z]/.test(e3) ? Kr(Fr(e3)) : `on:${e3}`, true, p2.loc);
        } else
          u2 = createCompoundExpression([`${r2.helperString(jc)}(`, p2, ")"]);
      else
        u2 = p2, u2.children.unshift(`${r2.helperString(jc)}(`), u2.children.push(")");
      let d2 = e2.exp;
      d2 && !d2.content.trim() && (d2 = void 0);
      let f2 = r2.cacheHandlers && !d2 && !r2.inVOnce;
      if (d2) {
        const e3 = il(d2), t3 = !(e3 || ll(d2)), r3 = d2.content.includes(";");
        (t3 || f2 && e3) && (d2 = createCompoundExpression([`${t3 ? "$event" : "(...args)"} => ${r3 ? "{" : "("}`, d2, r3 ? "}" : ")"]));
      }
      let m2 = { props: [createObjectProperty(u2, d2 || createSimpleExpression("() => {}", false, a2))] };
      return s2 && (m2 = s2(m2)), f2 && (m2.props[0].value = r2.cache(m2.props[0].value)), m2.props.forEach((e3) => e3.key.isHandlerKey = true), m2;
    }, "transformOn$1"), transformText = /* @__PURE__ */ __name((e2, t2) => {
      if (0 === e2.type || 1 === e2.type || 11 === e2.type || 10 === e2.type)
        return () => {
          const r2 = e2.children;
          let s2, a2 = false;
          for (let e3 = 0; e3 < r2.length; e3++) {
            const t3 = r2[e3];
            if (isText$1(t3)) {
              a2 = true;
              for (let a3 = e3 + 1; a3 < r2.length; a3++) {
                const c2 = r2[a3];
                if (!isText$1(c2)) {
                  s2 = void 0;
                  break;
                }
                s2 || (s2 = r2[e3] = createCompoundExpression([t3], t3.loc)), s2.children.push(" + ", c2), r2.splice(a3, 1), a3--;
              }
            }
          }
          if (a2 && (1 !== r2.length || 0 !== e2.type && (1 !== e2.type || 0 !== e2.tagType || e2.props.find((e3) => 7 === e3.type && !t2.directiveTransforms[e3.name]) || "template" === e2.tag)))
            for (let e3 = 0; e3 < r2.length; e3++) {
              const s3 = r2[e3];
              if (isText$1(s3) || 8 === s3.type) {
                const a3 = [];
                2 === s3.type && " " === s3.content || a3.push(s3), t2.ssr || 0 !== getConstantType(s3, t2) || a3.push("1"), r2[e3] = { type: 12, content: s3, loc: s3.loc, codegenNode: createCallExpression(t2.helper(bc), a3) };
              }
            }
        };
    }, "transformText"), $l = /* @__PURE__ */ new WeakSet(), transformOnce = /* @__PURE__ */ __name((e2, t2) => {
      if (1 === e2.type && findDir(e2, "once", true)) {
        if ($l.has(e2) || t2.inVOnce || t2.inSSR)
          return;
        return $l.add(e2), t2.inVOnce = true, t2.helper(Dc), () => {
          t2.inVOnce = false;
          const e3 = t2.currentNode;
          e3.codegenNode && (e3.codegenNode = t2.cache(e3.codegenNode, true, true));
        };
      }
    }, "transformOnce"), transformModel$1 = /* @__PURE__ */ __name((e2, t2, r2) => {
      const { exp: s2, arg: a2 } = e2;
      if (!s2)
        return r2.onError(createCompilerError(41, e2.loc)), createTransformProps();
      const c2 = s2.loc.source.trim(), p2 = 4 === s2.type ? s2.content : c2, u2 = r2.bindingMetadata[c2];
      if ("props" === u2 || "props-aliased" === u2)
        return r2.onError(createCompilerError(44, s2.loc)), createTransformProps();
      if (!p2.trim() || !il(s2))
        return r2.onError(createCompilerError(42, s2.loc)), createTransformProps();
      const d2 = a2 || createSimpleExpression("modelValue", true), f2 = a2 ? isStaticExp(a2) ? `onUpdate:${Fr(a2.content)}` : createCompoundExpression(['"onUpdate:" + ', a2]) : "onUpdate:modelValue";
      let m2;
      m2 = createCompoundExpression([`${r2.isTS ? "($event: any)" : "$event"} => ((`, s2, ") = $event)"]);
      const g2 = [createObjectProperty(d2, e2.exp), createObjectProperty(f2, m2)];
      if (e2.modifiers.length && 1 === t2.tagType) {
        const t3 = e2.modifiers.map((e3) => e3.content).map((e3) => (isSimpleIdentifier(e3) ? e3 : JSON.stringify(e3)) + ": true").join(", "), r3 = a2 ? isStaticExp(a2) ? `${a2.content}Modifiers` : createCompoundExpression([a2, ' + "Modifiers"']) : "modelModifiers";
        g2.push(createObjectProperty(r3, createSimpleExpression(`{ ${t3} }`, false, e2.loc, 2)));
      }
      return createTransformProps(g2);
    }, "transformModel$1");
    function createTransformProps(e2 = []) {
      return { props: e2 };
    }
    __name(createTransformProps, "createTransformProps");
    const Bl = /[\w).+\-_$\]]/, transformFilter = /* @__PURE__ */ __name((e2, t2) => {
      isCompatEnabled("COMPILER_FILTERS", t2) && (5 === e2.type ? rewriteFilter(e2.content, t2) : 1 === e2.type && e2.props.forEach((e3) => {
        7 === e3.type && "for" !== e3.name && e3.exp && rewriteFilter(e3.exp, t2);
      }));
    }, "transformFilter");
    function rewriteFilter(e2, t2) {
      if (4 === e2.type)
        parseFilter(e2, t2);
      else
        for (let r2 = 0; r2 < e2.children.length; r2++) {
          const s2 = e2.children[r2];
          "object" == typeof s2 && (4 === s2.type ? parseFilter(s2, t2) : 8 === s2.type ? rewriteFilter(e2, t2) : 5 === s2.type && rewriteFilter(s2.content, t2));
        }
    }
    __name(rewriteFilter, "rewriteFilter");
    function parseFilter(e2, t2) {
      const r2 = e2.content;
      let s2, a2, c2, p2, u2 = false, d2 = false, f2 = false, m2 = false, g2 = 0, x2 = 0, _2 = 0, E2 = 0, S2 = [];
      for (c2 = 0; c2 < r2.length; c2++)
        if (a2 = s2, s2 = r2.charCodeAt(c2), u2)
          39 === s2 && 92 !== a2 && (u2 = false);
        else if (d2)
          34 === s2 && 92 !== a2 && (d2 = false);
        else if (f2)
          96 === s2 && 92 !== a2 && (f2 = false);
        else if (m2)
          47 === s2 && 92 !== a2 && (m2 = false);
        else if (124 !== s2 || 124 === r2.charCodeAt(c2 + 1) || 124 === r2.charCodeAt(c2 - 1) || g2 || x2 || _2) {
          switch (s2) {
            case 34:
              d2 = true;
              break;
            case 39:
              u2 = true;
              break;
            case 96:
              f2 = true;
              break;
            case 40:
              _2++;
              break;
            case 41:
              _2--;
              break;
            case 91:
              x2++;
              break;
            case 93:
              x2--;
              break;
            case 123:
              g2++;
              break;
            case 125:
              g2--;
          }
          if (47 === s2) {
            let e3, t3 = c2 - 1;
            for (; t3 >= 0 && (e3 = r2.charAt(t3), " " === e3); t3--)
              ;
            e3 && Bl.test(e3) || (m2 = true);
          }
        } else
          void 0 === p2 ? (E2 = c2 + 1, p2 = r2.slice(0, c2).trim()) : pushFilter();
      function pushFilter() {
        S2.push(r2.slice(E2, c2).trim()), E2 = c2 + 1;
      }
      __name(pushFilter, "pushFilter");
      if (void 0 === p2 ? p2 = r2.slice(0, c2).trim() : 0 !== E2 && pushFilter(), S2.length) {
        for (c2 = 0; c2 < S2.length; c2++)
          p2 = wrapFilter(p2, S2[c2], t2);
        e2.content = p2, e2.ast = void 0;
      }
    }
    __name(parseFilter, "parseFilter");
    function wrapFilter(e2, t2, r2) {
      r2.helper(Sc);
      const s2 = t2.indexOf("(");
      if (s2 < 0)
        return r2.filters.add(t2), `${toValidAssetId(t2, "filter")}(${e2})`;
      {
        const a2 = t2.slice(0, s2), c2 = t2.slice(s2 + 1);
        return r2.filters.add(a2), `${toValidAssetId(a2, "filter")}(${e2}${")" !== c2 ? "," + c2 : c2}`;
      }
    }
    __name(wrapFilter, "wrapFilter");
    const jl = /* @__PURE__ */ new WeakSet(), transformMemo = /* @__PURE__ */ __name((e2, t2) => {
      if (1 === e2.type) {
        const r2 = findDir(e2, "memo");
        if (!r2 || jl.has(e2))
          return;
        return jl.add(e2), () => {
          const s2 = e2.codegenNode || t2.currentNode.codegenNode;
          s2 && 13 === s2.type && (1 !== e2.tagType && convertToBlock(s2, t2), e2.codegenNode = createCallExpression(t2.helper(qc), [r2.exp, createFunctionExpression(void 0, s2), "_cache", String(t2.cached.length)]), t2.cached.push(null));
        };
      }
    }, "transformMemo");
    function getBaseTransformPreset(e2) {
      return [[transformOnce, Il, transformMemo, Pl, transformFilter, transformSlotOutlet, transformElement, trackSlotScopes, transformText], { on: transformOn$1, bind: transformBind, model: transformModel$1 }];
    }
    __name(getBaseTransformPreset, "getBaseTransformPreset");
    function baseCompile(e2, t2 = {}) {
      const r2 = t2.onError || defaultOnError, s2 = "module" === t2.mode;
      true === t2.prefixIdentifiers ? r2(createCompilerError(47)) : s2 && r2(createCompilerError(48));
      t2.cacheHandlers && r2(createCompilerError(49)), t2.scopeId && !s2 && r2(createCompilerError(50));
      const a2 = $r({}, t2, { prefixIdentifiers: false }), c2 = isString(e2) ? baseParse(e2, a2) : e2, [p2, u2] = getBaseTransformPreset();
      return transform(c2, $r({}, a2, { nodeTransforms: [...p2, ...t2.nodeTransforms || []], directiveTransforms: $r({}, u2, t2.directiveTransforms || {}) })), generate(c2, a2);
    }
    __name(baseCompile, "baseCompile");
    const noopDirectiveTransform = /* @__PURE__ */ __name(() => ({ props: [] }), "noopDirectiveTransform"), Dl = Symbol(""), Hl = Symbol(""), Ul = Symbol(""), Vl = Symbol(""), Fl = Symbol(""), zl = Symbol(""), ql = Symbol(""), Wl = Symbol(""), Kl = Symbol(""), Xl = Symbol("");
    let Gl;
    registerRuntimeHelpers({ [Dl]: "vModelRadio", [Hl]: "vModelCheckbox", [Ul]: "vModelText", [Vl]: "vModelSelect", [Fl]: "vModelDynamic", [zl]: "withModifiers", [ql]: "withKeys", [Wl]: "vShow", [Kl]: "Transition", [Xl]: "TransitionGroup" });
    const Jl = { parseMode: "html", isVoidTag: io, isNativeTag: (e2) => ro(e2) || oo(e2) || so(e2), isPreTag: (e2) => "pre" === e2, isIgnoreNewlineTag: (e2) => "pre" === e2 || "textarea" === e2, decodeEntities: function(e2, t2 = false) {
      return Gl || (Gl = document.createElement("div")), t2 ? (Gl.innerHTML = `<div foo="${e2.replace(/"/g, "&quot;")}">`, Gl.children[0].getAttribute("foo")) : (Gl.innerHTML = e2, Gl.textContent);
    }, isBuiltInComponent: (e2) => "Transition" === e2 || "transition" === e2 ? Kl : "TransitionGroup" === e2 || "transition-group" === e2 ? Xl : void 0, getNamespace(e2, t2, r2) {
      let s2 = t2 ? t2.ns : r2;
      if (t2 && 2 === s2)
        if ("annotation-xml" === t2.tag) {
          if ("svg" === e2)
            return 1;
          t2.props.some((e3) => 6 === e3.type && "encoding" === e3.name && null != e3.value && ("text/html" === e3.value.content || "application/xhtml+xml" === e3.value.content)) && (s2 = 0);
        } else
          /^m(?:[ions]|text)$/.test(t2.tag) && "mglyph" !== e2 && "malignmark" !== e2 && (s2 = 0);
      else
        t2 && 1 === s2 && ("foreignObject" !== t2.tag && "desc" !== t2.tag && "title" !== t2.tag || (s2 = 0));
      if (0 === s2) {
        if ("svg" === e2)
          return 1;
        if ("math" === e2)
          return 2;
      }
      return s2;
    } }, transformStyle = /* @__PURE__ */ __name((e2) => {
      1 === e2.type && e2.props.forEach((t2, r2) => {
        6 === t2.type && "style" === t2.name && t2.value && (e2.props[r2] = { type: 7, name: "bind", arg: createSimpleExpression("style", true, t2.loc), exp: parseInlineCSS(t2.value.content, t2.loc), modifiers: [], loc: t2.loc });
      });
    }, "transformStyle"), parseInlineCSS = /* @__PURE__ */ __name((e2, t2) => {
      const r2 = parseStringStyle(e2);
      return createSimpleExpression(JSON.stringify(r2), false, t2, 3);
    }, "parseInlineCSS");
    function createDOMCompilerError(e2, t2) {
      return createCompilerError(e2, t2);
    }
    __name(createDOMCompilerError, "createDOMCompilerError");
    const Yl = { 53: "v-html is missing expression.", 54: "v-html will override element children.", 55: "v-text is missing expression.", 56: "v-text will override element children.", 57: "v-model can only be used on <input>, <textarea> and <select> elements.", 58: "v-model argument is not supported on plain elements.", 59: "v-model cannot be used on file inputs since they are read-only. Use a v-on:change listener instead.", 60: "Unnecessary value binding used alongside v-model. It will interfere with v-model's behavior.", 61: "v-show is missing expression.", 62: "<Transition> expects exactly one child element or component.", 63: "Tags with side effect (<script> and <style>) are ignored in client component templates." }, Ql = makeMap("passive,once,capture"), Zl = makeMap("stop,prevent,self,ctrl,shift,alt,meta,exact,middle"), ep = makeMap("left,right"), tp = makeMap("onkeyup,onkeydown,onkeypress"), transformClick = /* @__PURE__ */ __name((e2, t2) => isStaticExp(e2) && "onclick" === e2.content.toLowerCase() ? createSimpleExpression(t2, true) : 4 !== e2.type ? createCompoundExpression(["(", e2, `) === "onClick" ? "${t2}" : (`, e2, ")"]) : e2, "transformClick"), ignoreSideEffectTags = /* @__PURE__ */ __name((e2, t2) => {
      1 !== e2.type || 0 !== e2.tagType || "script" !== e2.tag && "style" !== e2.tag || t2.removeNode();
    }, "ignoreSideEffectTags"), np = [transformStyle], rp = { cloak: noopDirectiveTransform, html: (e2, t2, r2) => {
      const { exp: s2, loc: a2 } = e2;
      return s2 || r2.onError(createDOMCompilerError(53, a2)), t2.children.length && (r2.onError(createDOMCompilerError(54, a2)), t2.children.length = 0), { props: [createObjectProperty(createSimpleExpression("innerHTML", true, a2), s2 || createSimpleExpression("", true))] };
    }, text: (e2, t2, r2) => {
      const { exp: s2, loc: a2 } = e2;
      return s2 || r2.onError(createDOMCompilerError(55, a2)), t2.children.length && (r2.onError(createDOMCompilerError(56, a2)), t2.children.length = 0), { props: [createObjectProperty(createSimpleExpression("textContent", true), s2 ? getConstantType(s2, r2) > 0 ? s2 : createCallExpression(r2.helperString(Ac), [s2], a2) : createSimpleExpression("", true))] };
    }, model: (e2, t2, r2) => {
      const s2 = transformModel$1(e2, t2, r2);
      if (!s2.props.length || 1 === t2.tagType)
        return s2;
      e2.arg && r2.onError(createDOMCompilerError(58, e2.arg.loc));
      const { tag: a2 } = t2, c2 = r2.isCustomElement(a2);
      if ("input" === a2 || "textarea" === a2 || "select" === a2 || c2) {
        let p2 = Ul, u2 = false;
        if ("input" === a2 || c2) {
          const s3 = findProp(t2, "type");
          if (s3) {
            if (7 === s3.type)
              p2 = Fl;
            else if (s3.value)
              switch (s3.value.content) {
                case "radio":
                  p2 = Dl;
                  break;
                case "checkbox":
                  p2 = Hl;
                  break;
                case "file":
                  u2 = true, r2.onError(createDOMCompilerError(59, e2.loc));
              }
          } else
            hasDynamicKeyVBind(t2) && (p2 = Fl);
        } else
          "select" === a2 && (p2 = Vl);
        u2 || (s2.needRuntime = r2.helper(p2));
      } else
        r2.onError(createDOMCompilerError(57, e2.loc));
      return s2.props = s2.props.filter((e3) => !(4 === e3.key.type && "modelValue" === e3.key.content)), s2;
    }, on: (e2, t2, r2) => transformOn$1(e2, t2, r2, (t3) => {
      const { modifiers: s2 } = e2;
      if (!s2.length)
        return t3;
      let { key: a2, value: c2 } = t3.props[0];
      const { keyModifiers: p2, nonKeyModifiers: u2, eventOptionModifiers: d2 } = ((e3, t4, r3) => {
        const s3 = [], a3 = [], c3 = [];
        for (let p3 = 0; p3 < t4.length; p3++) {
          const u3 = t4[p3].content;
          "native" === u3 && checkCompatEnabled("COMPILER_V_ON_NATIVE", r3) || Ql(u3) ? c3.push(u3) : ep(u3) ? isStaticExp(e3) ? tp(e3.content.toLowerCase()) ? s3.push(u3) : a3.push(u3) : (s3.push(u3), a3.push(u3)) : Zl(u3) ? a3.push(u3) : s3.push(u3);
        }
        return { keyModifiers: s3, nonKeyModifiers: a3, eventOptionModifiers: c3 };
      })(a2, s2, r2, e2.loc);
      if (u2.includes("right") && (a2 = transformClick(a2, "onContextmenu")), u2.includes("middle") && (a2 = transformClick(a2, "onMouseup")), u2.length && (c2 = createCallExpression(r2.helper(zl), [c2, JSON.stringify(u2)])), !p2.length || isStaticExp(a2) && !tp(a2.content.toLowerCase()) || (c2 = createCallExpression(r2.helper(ql), [c2, JSON.stringify(p2)])), d2.length) {
        const e3 = d2.map(Wr).join("");
        a2 = isStaticExp(a2) ? createSimpleExpression(`${a2.content}${e3}`, true) : createCompoundExpression(["(", a2, `) + "${e3}"`]);
      }
      return { props: [createObjectProperty(a2, c2)] };
    }), show: (e2, t2, r2) => {
      const { exp: s2, loc: a2 } = e2;
      return s2 || r2.onError(createDOMCompilerError(61, a2)), { props: [], needRuntime: r2.helper(Wl) };
    } };
    const op = Object.freeze(Object.defineProperty({ __proto__: null, BASE_TRANSITION: dc, BindingTypes: { DATA: "data", PROPS: "props", PROPS_ALIASED: "props-aliased", SETUP_LET: "setup-let", SETUP_CONST: "setup-const", SETUP_REACTIVE_CONST: "setup-reactive-const", SETUP_MAYBE_REF: "setup-maybe-ref", SETUP_REF: "setup-ref", OPTIONS: "options", LITERAL_CONST: "literal-const" }, CAMELIZE: $c, CAPITALIZE: Bc, CREATE_BLOCK: hc, CREATE_COMMENT: yc, CREATE_ELEMENT_BLOCK: mc, CREATE_ELEMENT_VNODE: vc, CREATE_SLOTS: Rc, CREATE_STATIC: xc, CREATE_TEXT: bc, CREATE_VNODE: gc, CompilerDeprecationTypes: { COMPILER_IS_ON_ELEMENT: "COMPILER_IS_ON_ELEMENT", COMPILER_V_BIND_SYNC: "COMPILER_V_BIND_SYNC", COMPILER_V_BIND_OBJECT_ORDER: "COMPILER_V_BIND_OBJECT_ORDER", COMPILER_V_ON_NATIVE: "COMPILER_V_ON_NATIVE", COMPILER_V_IF_V_FOR_PRECEDENCE: "COMPILER_V_IF_V_FOR_PRECEDENCE", COMPILER_NATIVE_TEMPLATE: "COMPILER_NATIVE_TEMPLATE", COMPILER_INLINE_TEMPLATE: "COMPILER_INLINE_TEMPLATE", COMPILER_FILTERS: "COMPILER_FILTERS" }, ConstantTypes: { NOT_CONSTANT: 0, 0: "NOT_CONSTANT", CAN_SKIP_PATCH: 1, 1: "CAN_SKIP_PATCH", CAN_CACHE: 2, 2: "CAN_CACHE", CAN_STRINGIFY: 3, 3: "CAN_STRINGIFY" }, DOMDirectiveTransforms: rp, DOMErrorCodes: { X_V_HTML_NO_EXPRESSION: 53, 53: "X_V_HTML_NO_EXPRESSION", X_V_HTML_WITH_CHILDREN: 54, 54: "X_V_HTML_WITH_CHILDREN", X_V_TEXT_NO_EXPRESSION: 55, 55: "X_V_TEXT_NO_EXPRESSION", X_V_TEXT_WITH_CHILDREN: 56, 56: "X_V_TEXT_WITH_CHILDREN", X_V_MODEL_ON_INVALID_ELEMENT: 57, 57: "X_V_MODEL_ON_INVALID_ELEMENT", X_V_MODEL_ARG_ON_ELEMENT: 58, 58: "X_V_MODEL_ARG_ON_ELEMENT", X_V_MODEL_ON_FILE_INPUT_ELEMENT: 59, 59: "X_V_MODEL_ON_FILE_INPUT_ELEMENT", X_V_MODEL_UNNECESSARY_VALUE: 60, 60: "X_V_MODEL_UNNECESSARY_VALUE", X_V_SHOW_NO_EXPRESSION: 61, 61: "X_V_SHOW_NO_EXPRESSION", X_TRANSITION_INVALID_CHILDREN: 62, 62: "X_TRANSITION_INVALID_CHILDREN", X_IGNORED_SIDE_EFFECT_TAG: 63, 63: "X_IGNORED_SIDE_EFFECT_TAG", __EXTEND_POINT__: 64, 64: "__EXTEND_POINT__" }, DOMErrorMessages: Yl, DOMNodeTransforms: np, ElementTypes: { ELEMENT: 0, 0: "ELEMENT", COMPONENT: 1, 1: "COMPONENT", SLOT: 2, 2: "SLOT", TEMPLATE: 3, 3: "TEMPLATE" }, ErrorCodes: { ABRUPT_CLOSING_OF_EMPTY_COMMENT: 0, 0: "ABRUPT_CLOSING_OF_EMPTY_COMMENT", CDATA_IN_HTML_CONTENT: 1, 1: "CDATA_IN_HTML_CONTENT", DUPLICATE_ATTRIBUTE: 2, 2: "DUPLICATE_ATTRIBUTE", END_TAG_WITH_ATTRIBUTES: 3, 3: "END_TAG_WITH_ATTRIBUTES", END_TAG_WITH_TRAILING_SOLIDUS: 4, 4: "END_TAG_WITH_TRAILING_SOLIDUS", EOF_BEFORE_TAG_NAME: 5, 5: "EOF_BEFORE_TAG_NAME", EOF_IN_CDATA: 6, 6: "EOF_IN_CDATA", EOF_IN_COMMENT: 7, 7: "EOF_IN_COMMENT", EOF_IN_SCRIPT_HTML_COMMENT_LIKE_TEXT: 8, 8: "EOF_IN_SCRIPT_HTML_COMMENT_LIKE_TEXT", EOF_IN_TAG: 9, 9: "EOF_IN_TAG", INCORRECTLY_CLOSED_COMMENT: 10, 10: "INCORRECTLY_CLOSED_COMMENT", INCORRECTLY_OPENED_COMMENT: 11, 11: "INCORRECTLY_OPENED_COMMENT", INVALID_FIRST_CHARACTER_OF_TAG_NAME: 12, 12: "INVALID_FIRST_CHARACTER_OF_TAG_NAME", MISSING_ATTRIBUTE_VALUE: 13, 13: "MISSING_ATTRIBUTE_VALUE", MISSING_END_TAG_NAME: 14, 14: "MISSING_END_TAG_NAME", MISSING_WHITESPACE_BETWEEN_ATTRIBUTES: 15, 15: "MISSING_WHITESPACE_BETWEEN_ATTRIBUTES", NESTED_COMMENT: 16, 16: "NESTED_COMMENT", UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME: 17, 17: "UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME", UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE: 18, 18: "UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE", UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME: 19, 19: "UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME", UNEXPECTED_NULL_CHARACTER: 20, 20: "UNEXPECTED_NULL_CHARACTER", UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME: 21, 21: "UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME", UNEXPECTED_SOLIDUS_IN_TAG: 22, 22: "UNEXPECTED_SOLIDUS_IN_TAG", X_INVALID_END_TAG: 23, 23: "X_INVALID_END_TAG", X_MISSING_END_TAG: 24, 24: "X_MISSING_END_TAG", X_MISSING_INTERPOLATION_END: 25, 25: "X_MISSING_INTERPOLATION_END", X_MISSING_DIRECTIVE_NAME: 26, 26: "X_MISSING_DIRECTIVE_NAME", X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END: 27, 27: "X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END", X_V_IF_NO_EXPRESSION: 28, 28: "X_V_IF_NO_EXPRESSION", X_V_IF_SAME_KEY: 29, 29: "X_V_IF_SAME_KEY", X_V_ELSE_NO_ADJACENT_IF: 30, 30: "X_V_ELSE_NO_ADJACENT_IF", X_V_FOR_NO_EXPRESSION: 31, 31: "X_V_FOR_NO_EXPRESSION", X_V_FOR_MALFORMED_EXPRESSION: 32, 32: "X_V_FOR_MALFORMED_EXPRESSION", X_V_FOR_TEMPLATE_KEY_PLACEMENT: 33, 33: "X_V_FOR_TEMPLATE_KEY_PLACEMENT", X_V_BIND_NO_EXPRESSION: 34, 34: "X_V_BIND_NO_EXPRESSION", X_V_ON_NO_EXPRESSION: 35, 35: "X_V_ON_NO_EXPRESSION", X_V_SLOT_UNEXPECTED_DIRECTIVE_ON_SLOT_OUTLET: 36, 36: "X_V_SLOT_UNEXPECTED_DIRECTIVE_ON_SLOT_OUTLET", X_V_SLOT_MIXED_SLOT_USAGE: 37, 37: "X_V_SLOT_MIXED_SLOT_USAGE", X_V_SLOT_DUPLICATE_SLOT_NAMES: 38, 38: "X_V_SLOT_DUPLICATE_SLOT_NAMES", X_V_SLOT_EXTRANEOUS_DEFAULT_SLOT_CHILDREN: 39, 39: "X_V_SLOT_EXTRANEOUS_DEFAULT_SLOT_CHILDREN", X_V_SLOT_MISPLACED: 40, 40: "X_V_SLOT_MISPLACED", X_V_MODEL_NO_EXPRESSION: 41, 41: "X_V_MODEL_NO_EXPRESSION", X_V_MODEL_MALFORMED_EXPRESSION: 42, 42: "X_V_MODEL_MALFORMED_EXPRESSION", X_V_MODEL_ON_SCOPE_VARIABLE: 43, 43: "X_V_MODEL_ON_SCOPE_VARIABLE", X_V_MODEL_ON_PROPS: 44, 44: "X_V_MODEL_ON_PROPS", X_INVALID_EXPRESSION: 45, 45: "X_INVALID_EXPRESSION", X_KEEP_ALIVE_INVALID_CHILDREN: 46, 46: "X_KEEP_ALIVE_INVALID_CHILDREN", X_PREFIX_ID_NOT_SUPPORTED: 47, 47: "X_PREFIX_ID_NOT_SUPPORTED", X_MODULE_MODE_NOT_SUPPORTED: 48, 48: "X_MODULE_MODE_NOT_SUPPORTED", X_CACHE_HANDLER_NOT_SUPPORTED: 49, 49: "X_CACHE_HANDLER_NOT_SUPPORTED", X_SCOPE_ID_NOT_SUPPORTED: 50, 50: "X_SCOPE_ID_NOT_SUPPORTED", X_VNODE_HOOKS: 51, 51: "X_VNODE_HOOKS", X_V_BIND_INVALID_SAME_NAME_ARGUMENT: 52, 52: "X_V_BIND_INVALID_SAME_NAME_ARGUMENT", __EXTEND_POINT__: 53, 53: "__EXTEND_POINT__" }, FRAGMENT: cc, GUARD_REACTIVE_PROPS: Lc, IS_MEMO_SAME: Wc, IS_REF: zc, KEEP_ALIVE: uc, MERGE_PROPS: Nc, NORMALIZE_CLASS: Oc, NORMALIZE_PROPS: Pc, NORMALIZE_STYLE: Ic, Namespaces: { HTML: 0, 0: "HTML", SVG: 1, 1: "SVG", MATH_ML: 2, 2: "MATH_ML" }, NodeTypes: { ROOT: 0, 0: "ROOT", ELEMENT: 1, 1: "ELEMENT", TEXT: 2, 2: "TEXT", COMMENT: 3, 3: "COMMENT", SIMPLE_EXPRESSION: 4, 4: "SIMPLE_EXPRESSION", INTERPOLATION: 5, 5: "INTERPOLATION", ATTRIBUTE: 6, 6: "ATTRIBUTE", DIRECTIVE: 7, 7: "DIRECTIVE", COMPOUND_EXPRESSION: 8, 8: "COMPOUND_EXPRESSION", IF: 9, 9: "IF", IF_BRANCH: 10, 10: "IF_BRANCH", FOR: 11, 11: "FOR", TEXT_CALL: 12, 12: "TEXT_CALL", VNODE_CALL: 13, 13: "VNODE_CALL", JS_CALL_EXPRESSION: 14, 14: "JS_CALL_EXPRESSION", JS_OBJECT_EXPRESSION: 15, 15: "JS_OBJECT_EXPRESSION", JS_PROPERTY: 16, 16: "JS_PROPERTY", JS_ARRAY_EXPRESSION: 17, 17: "JS_ARRAY_EXPRESSION", JS_FUNCTION_EXPRESSION: 18, 18: "JS_FUNCTION_EXPRESSION", JS_CONDITIONAL_EXPRESSION: 19, 19: "JS_CONDITIONAL_EXPRESSION", JS_CACHE_EXPRESSION: 20, 20: "JS_CACHE_EXPRESSION", JS_BLOCK_STATEMENT: 21, 21: "JS_BLOCK_STATEMENT", JS_TEMPLATE_LITERAL: 22, 22: "JS_TEMPLATE_LITERAL", JS_IF_STATEMENT: 23, 23: "JS_IF_STATEMENT", JS_ASSIGNMENT_EXPRESSION: 24, 24: "JS_ASSIGNMENT_EXPRESSION", JS_SEQUENCE_EXPRESSION: 25, 25: "JS_SEQUENCE_EXPRESSION", JS_RETURN_STATEMENT: 26, 26: "JS_RETURN_STATEMENT" }, OPEN_BLOCK: fc, POP_SCOPE_ID: Uc, PUSH_SCOPE_ID: Hc, RENDER_LIST: Cc, RENDER_SLOT: kc, RESOLVE_COMPONENT: _c, RESOLVE_DIRECTIVE: wc, RESOLVE_DYNAMIC_COMPONENT: Ec, RESOLVE_FILTER: Sc, SET_BLOCK_TRACKING: Dc, SUSPENSE: pc, TELEPORT: lc, TO_DISPLAY_STRING: Ac, TO_HANDLERS: Mc, TO_HANDLER_KEY: jc, TRANSITION: Kl, TRANSITION_GROUP: Xl, TS_NODE_TYPES: el, UNREF: Fc, V_MODEL_CHECKBOX: Hl, V_MODEL_DYNAMIC: Fl, V_MODEL_RADIO: Dl, V_MODEL_SELECT: Vl, V_MODEL_TEXT: Ul, V_ON_WITH_KEYS: ql, V_ON_WITH_MODIFIERS: zl, V_SHOW: Wl, WITH_CTX: Vc, WITH_DIRECTIVES: Tc, WITH_MEMO: qc, advancePositionWithClone: function(e2, t2, r2 = t2.length) {
      return advancePositionWithMutation({ offset: e2.offset, line: e2.line, column: e2.column }, t2, r2);
    }, advancePositionWithMutation, assert: function(e2, t2) {
      if (!e2)
        throw new Error(t2 || "unexpected compiler condition");
    }, baseCompile, baseParse, buildDirectiveArgs, buildProps, buildSlots, checkCompatEnabled, compile: function(e2, t2 = {}) {
      return baseCompile(e2, $r({}, Jl, t2, { nodeTransforms: [ignoreSideEffectTags, ...np, ...t2.nodeTransforms || []], directiveTransforms: $r({}, rp, t2.directiveTransforms || {}), transformHoist: null }));
    }, convertToBlock, createArrayExpression, createAssignmentExpression: function(e2, t2) {
      return { type: 24, left: e2, right: t2, loc: Xc };
    }, createBlockStatement, createCacheExpression, createCallExpression, createCompilerError, createCompoundExpression, createConditionalExpression, createDOMCompilerError, createForLoopParams, createFunctionExpression, createIfStatement: function(e2, t2, r2) {
      return { type: 23, test: e2, consequent: t2, alternate: r2, loc: Xc };
    }, createInterpolation: function(e2, t2) {
      return { type: 5, loc: t2, content: isString(e2) ? createSimpleExpression(e2, false, t2) : e2 };
    }, createObjectExpression, createObjectProperty, createReturnStatement: function(e2) {
      return { type: 26, returns: e2, loc: Xc };
    }, createRoot, createSequenceExpression: function(e2) {
      return { type: 25, expressions: e2, loc: Xc };
    }, createSimpleExpression, createStructuralDirectiveTransform, createTemplateLiteral: function(e2) {
      return { type: 22, elements: e2, loc: Xc };
    }, createTransformContext, createVNodeCall, errorMessages: Zc, extractIdentifiers, findDir, findProp, forAliasRE: ul, generate, generateCodeFrame, getBaseTransformPreset, getConstantType, getMemoedVNodeCall, getVNodeBlockHelper, getVNodeHelper, hasDynamicKeyVBind, hasScopeRef: /* @__PURE__ */ __name(function hasScopeRef(e2, t2) {
      if (!e2 || 0 === Object.keys(t2).length)
        return false;
      switch (e2.type) {
        case 1:
          for (let r2 = 0; r2 < e2.props.length; r2++) {
            const s2 = e2.props[r2];
            if (7 === s2.type && (hasScopeRef(s2.arg, t2) || hasScopeRef(s2.exp, t2)))
              return true;
          }
          return e2.children.some((e3) => hasScopeRef(e3, t2));
        case 11:
          return !!hasScopeRef(e2.source, t2) || e2.children.some((e3) => hasScopeRef(e3, t2));
        case 9:
          return e2.branches.some((e3) => hasScopeRef(e3, t2));
        case 10:
          return !!hasScopeRef(e2.condition, t2) || e2.children.some((e3) => hasScopeRef(e3, t2));
        case 4:
          return !e2.isStatic && isSimpleIdentifier(e2.content) && !!t2[e2.content];
        case 8:
          return e2.children.some((e3) => isObject(e3) && hasScopeRef(e3, t2));
        case 5:
        case 12:
          return hasScopeRef(e2.content, t2);
        default:
          return false;
      }
    }, "hasScopeRef"), helperNameMap: Kc, injectProp, isCoreComponent, isFnExpression: ll, isFnExpressionBrowser, isFnExpressionNode: cl, isFunctionType: (e2) => /Function(?:Expression|Declaration)$|Method$/.test(e2.type), isInDestructureAssignment: function(e2, t2) {
      if (e2 && ("ObjectProperty" === e2.type || "ArrayPattern" === e2.type)) {
        let e3 = t2.length;
        for (; e3--; ) {
          const r2 = t2[e3];
          if ("AssignmentExpression" === r2.type)
            return true;
          if ("ObjectProperty" !== r2.type && !r2.type.endsWith("Pattern"))
            break;
        }
      }
      return false;
    }, isInNewExpression: function(e2) {
      let t2 = e2.length;
      for (; t2--; ) {
        const r2 = e2[t2];
        if ("NewExpression" === r2.type)
          return true;
        if ("MemberExpression" !== r2.type)
          break;
      }
      return false;
    }, isMemberExpression: il, isMemberExpressionBrowser, isMemberExpressionNode: sl, isReferencedIdentifier: function(e2, t2, r2) {
      return false;
    }, isSimpleIdentifier, isSlotOutlet, isStaticArgOf, isStaticExp, isStaticProperty, isStaticPropertyKey: (e2, t2) => isStaticProperty(t2) && t2.key === e2, isTemplateNode, isText: isText$1, isVPre, isVSlot, locStub: Xc, noopDirectiveTransform, parse: function(e2, t2 = {}) {
      return baseParse(e2, $r({}, Jl, t2));
    }, parserOptions: Jl, processExpression, processFor, processIf, processSlotOutlet, registerRuntimeHelpers, resolveComponentType, stringifyExpression: /* @__PURE__ */ __name(function stringifyExpression(e2) {
      return isString(e2) ? e2 : 4 === e2.type ? e2.content : e2.children.map(stringifyExpression).join("");
    }, "stringifyExpression"), toValidAssetId, trackSlotScopes, trackVForSlotScopes: (e2, t2) => {
      let r2;
      if (isTemplateNode(e2) && e2.props.some(isVSlot) && (r2 = findDir(e2, "for"))) {
        const e3 = r2.forParseResult;
        if (e3) {
          finalizeForParseResult(e3);
          const { value: r3, key: s2, index: a2 } = e3, { addIdentifiers: c2, removeIdentifiers: p2 } = t2;
          return r3 && c2(r3), s2 && c2(s2), a2 && c2(a2), () => {
            r3 && p2(r3), s2 && p2(s2), a2 && p2(a2);
          };
        }
      }
    }, transform, transformBind, transformElement, transformExpression: (e2, t2) => {
      if (5 === e2.type)
        e2.content = processExpression(e2.content, t2);
      else if (1 === e2.type) {
        const r2 = findDir(e2, "memo");
        for (let s2 = 0; s2 < e2.props.length; s2++) {
          const a2 = e2.props[s2];
          if (7 === a2.type && "for" !== a2.name) {
            const e3 = a2.exp, s3 = a2.arg;
            !e3 || 4 !== e3.type || "on" === a2.name && s3 || r2 && s3 && 4 === s3.type && "key" === s3.content || (a2.exp = processExpression(e3, t2, "slot" === a2.name)), s3 && 4 === s3.type && !s3.isStatic && (a2.arg = processExpression(s3, t2));
          }
        }
      }
    }, transformModel: transformModel$1, transformOn: transformOn$1, transformStyle, traverseNode, unwrapTSNode: /* @__PURE__ */ __name(function unwrapTSNode(e2) {
      return el.includes(e2.type) ? unwrapTSNode(e2.expression) : e2;
    }, "unwrapTSNode"), walkBlockDeclarations: function(e2, t2) {
      for (const r2 of e2.body)
        if ("VariableDeclaration" === r2.type) {
          if (r2.declare)
            continue;
          for (const e3 of r2.declarations)
            for (const r3 of extractIdentifiers(e3.id))
              t2(r3);
        } else if ("FunctionDeclaration" === r2.type || "ClassDeclaration" === r2.type) {
          if (r2.declare || !r2.id)
            continue;
          t2(r2.id);
        } else
          isForStatement(r2) && walkForStatement(r2, true, t2);
    }, walkFunctionParams: function(e2, t2) {
      for (const r2 of e2.params)
        for (const e3 of extractIdentifiers(r2))
          t2(e3);
    }, walkIdentifiers: function(e2, t2, r2 = false, s2 = [], a2 = /* @__PURE__ */ Object.create(null)) {
    }, warnDeprecation: function(e2, t2, r2, ...s2) {
      if ("suppress-warning" === getCompatValue(e2, t2))
        return;
      const { message: a2, link: c2 } = Qc[e2], p2 = `(deprecation ${e2}) ${"function" == typeof a2 ? a2(...s2) : a2}${c2 ? `
  Details: ${c2}` : ""}`, u2 = new SyntaxError(p2);
      u2.code = e2, r2 && (u2.loc = r2), t2.onWarn(u2);
    } }, Symbol.toStringTag, { value: "Module" }));
    !function(e2) {
      Object.defineProperty(e2, "__esModule", { value: true });
      var t2 = op, r2 = Sa, s2 = xo;
      function _interopNamespaceDefault(e3) {
        var t3 = /* @__PURE__ */ Object.create(null);
        if (e3)
          for (var r3 in e3)
            t3[r3] = e3[r3];
        return t3.default = e3, Object.freeze(t3);
      }
      __name(_interopNamespaceDefault, "_interopNamespaceDefault");
      var a2 = _interopNamespaceDefault(r2);
      const c2 = /* @__PURE__ */ Object.create(null);
      function compileToFunction(e3, r3) {
        if (!s2.isString(e3)) {
          if (!e3.nodeType)
            return s2.NOOP;
          e3 = e3.innerHTML;
        }
        const p2 = s2.genCacheKey(e3, r3), u2 = c2[p2];
        if (u2)
          return u2;
        if ("#" === e3[0]) {
          const t3 = document.querySelector(e3);
          e3 = t3 ? t3.innerHTML : "";
        }
        const d2 = s2.extend({ hoistStatic: true, onError: void 0, onWarn: s2.NOOP }, r3);
        d2.isCustomElement || "undefined" == typeof customElements || (d2.isCustomElement = (e4) => !!customElements.get(e4));
        const { code: f2 } = t2.compile(e3, d2), m2 = new Function("Vue", f2)(a2);
        return m2._rc = true, c2[p2] = m2;
      }
      __name(compileToFunction, "compileToFunction");
      r2.registerRuntimeCompiler(compileToFunction), e2.compile = compileToFunction, Object.keys(r2).forEach(function(t3) {
        "default" === t3 || Object.prototype.hasOwnProperty.call(e2, t3) || (e2[t3] = r2[t3]);
      });
    }(ac), ic.exports = ac;
    var sp = ic.exports;
    const ip = { Agent: kr }, ap = globalThis.Headers, cp = globalThis.AbortController, lp = globalThis.fetch || (() => {
      throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!");
    });
    const pp = createFetch({ fetch: globalThis.fetch ? (...e2) => globalThis.fetch(...e2) : function() {
      if (!JSON.parse(J.env.FETCH_KEEP_ALIVE || "false"))
        return lp;
      const e2 = { keepAlive: true }, t2 = new Rr(e2), r2 = new ip.Agent(e2), s2 = { agent: (e3) => "http:" === e3.protocol ? t2 : r2 };
      return function(e3, t3) {
        return lp(e3, { ...s2, ...t3 });
      };
    }(), Headers: globalThis.Headers || ap, AbortController: globalThis.AbortController || cp });
    globalThis.$fetch || (globalThis.$fetch = pp.create({ baseURL: useRuntimeConfig$1().app.baseURL })), "global" in globalThis || (globalThis.global = globalThis);
    const up = { componentName: "NuxtLink" }, dp = "nuxt-app";
    function getNuxtAppCtx(e2 = dp) {
      return getContext$1(e2, { asyncContext: false });
    }
    __name(getNuxtAppCtx, "getNuxtAppCtx");
    const fp = "__nuxt_plugin";
    function registerPluginHooks(e2, t2) {
      t2.hooks && e2.hooks.addHooks(t2.hooks);
    }
    __name(registerPluginHooks, "registerPluginHooks");
    function defineNuxtPlugin(e2) {
      if ("function" == typeof e2)
        return e2;
      const t2 = e2._name || e2.name;
      return delete e2.name, Object.assign(e2.setup || (() => {
      }), e2, { [fp]: true, _name: t2 });
    }
    __name(defineNuxtPlugin, "defineNuxtPlugin");
    function callWithNuxt(e2, t2, r2) {
      const fn = /* @__PURE__ */ __name(() => t2(), "fn"), s2 = getNuxtAppCtx(e2._id);
      return e2.vueApp.runWithContext(() => s2.callAsync(e2, fn));
    }
    __name(callWithNuxt, "callWithNuxt");
    function useNuxtApp(e2) {
      const t2 = function(e3) {
        let t3;
        return sp.hasInjectionContext() && (t3 = sp.getCurrentInstance()?.appContext.app.$nuxt), t3 ||= getNuxtAppCtx(e3).tryUse(), t3 || null;
      }(e2);
      if (!t2)
        throw new Error("[nuxt] instance unavailable");
      return t2;
    }
    __name(useNuxtApp, "useNuxtApp");
    function useRuntimeConfig(e2) {
      return useNuxtApp().$config;
    }
    __name(useRuntimeConfig, "useRuntimeConfig");
    function defineGetter(e2, t2, r2) {
      Object.defineProperty(e2, t2, { get: () => r2 });
    }
    __name(defineGetter, "defineGetter");
    const hp = Symbol("route"), useRouter = /* @__PURE__ */ __name(() => useNuxtApp()?.$router, "useRouter");
    function defineNuxtRouteMiddleware(e2) {
      return e2;
    }
    __name(defineNuxtRouteMiddleware, "defineNuxtRouteMiddleware");
    const mp = /"/g, navigateTo = /* @__PURE__ */ __name((e2, t2) => {
      e2 ||= "/";
      const r2 = "string" == typeof e2 ? e2 : "path" in e2 ? resolveRouteObject(e2) : useRouter().resolve(e2).href, s2 = hasProtocol(r2, { acceptRelative: true }), a2 = t2?.external || s2;
      if (a2) {
        if (!t2?.external)
          throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
        const { protocol: e3 } = new URL(r2, "http://localhost");
        if (e3 && function(e4) {
          return !!e4 && gn.test(e4);
        }(e3))
          throw new Error(`Cannot navigate to a URL with '${e3}' protocol.`);
      }
      const c2 = (() => {
        try {
          if (useNuxtApp()._processingMiddleware)
            return true;
        } catch {
          return false;
        }
        return false;
      })(), p2 = useRouter(), u2 = useNuxtApp();
      if (u2.ssrContext) {
        const d2 = "string" == typeof e2 || a2 ? r2 : p2.resolve(e2).fullPath || "/", f2 = a2 ? r2 : joinURL(useRuntimeConfig().app.baseURL, d2), redirect = /* @__PURE__ */ __name(async function(e3) {
          await u2.callHook("app:redirected");
          const r3 = f2.replace(mp, "%22"), a3 = function(e4, t3 = false) {
            const r4 = new URL(e4, "http://localhost");
            if (!t3)
              return r4.pathname + r4.search + r4.hash;
            if (e4.startsWith("//"))
              return r4.toString().replace(r4.protocol, "");
            return r4.toString();
          }(f2, s2);
          return u2.ssrContext._renderResponse = { statusCode: sanitizeStatusCode(t2?.redirectCode || 302, 302), body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${r3}"></head></html>`, headers: { location: a3 } }, e3;
        }, "redirect");
        return !a2 && c2 ? (p2.afterEach((e3) => e3.fullPath === d2 ? redirect(false) : void 0), e2) : redirect(!c2 && void 0);
      }
      return a2 ? (u2._scope.stop(), t2?.replace ? (void 0).replace(r2) : (void 0).href = r2, c2 ? !!u2.isHydrating && new Promise(() => {
      }) : Promise.resolve()) : t2?.replace ? p2.replace(e2) : p2.push(e2);
    }, "navigateTo");
    function resolveRouteObject(e2) {
      return withQuery(e2.path || "", e2.query || {}) + (e2.hash || "");
    }
    __name(resolveRouteObject, "resolveRouteObject");
    const gp = "__nuxt_error", useError = /* @__PURE__ */ __name(() => sp.toRef(useNuxtApp().payload, "error"), "useError"), showError = /* @__PURE__ */ __name((e2) => {
      const t2 = createError(e2);
      try {
        useNuxtApp();
        const e3 = useError();
        0, e3.value ||= t2;
      } catch {
        throw t2;
      }
      return t2;
    }, "showError"), createError = /* @__PURE__ */ __name((e2) => {
      const t2 = createError$1(e2);
      return Object.defineProperty(t2, gp, { value: true, configurable: false, writable: false }), t2;
    }, "createError"), vp = defineNuxtPlugin({ name: "nuxt:head", enforce: "pre", setup(e2) {
      const t2 = e2.ssrContext.head;
      e2.vueApp.use(t2);
    } });
    const yp = [defineNuxtRouteMiddleware(async (e2) => {
    })];
    function getRouteFromPath(e2) {
      const t2 = e2 && "object" == typeof e2 ? e2 : {};
      "object" == typeof e2 && (e2 = stringifyParsedURL({ pathname: e2.path || "", search: stringifyQuery(e2.query || {}), hash: e2.hash || "" }));
      const r2 = new URL(e2.toString(), "http://localhost");
      return { path: r2.pathname, fullPath: e2, query: parseQuery(r2.search), hash: r2.hash, params: t2.params || {}, name: void 0, matched: t2.matched || [], redirectedFrom: void 0, meta: t2.meta || {}, href: e2 };
    }
    __name(getRouteFromPath, "getRouteFromPath");
    const bp = defineNuxtPlugin({ name: "nuxt:router", enforce: "pre", setup(e2) {
      const t2 = e2.ssrContext.url, r2 = [], s2 = { "navigate:before": [], "resolve:before": [], "navigate:after": [], error: [] }, registerHook = /* @__PURE__ */ __name((e3, t3) => (s2[e3].push(t3), () => s2[e3].splice(s2[e3].indexOf(t3), 1)), "registerHook");
      useRuntimeConfig().app.baseURL;
      const a2 = sp.reactive(getRouteFromPath(t2));
      async function handleNavigation(e3, t3) {
        try {
          const t4 = getRouteFromPath(e3);
          for (const e4 of s2["navigate:before"]) {
            const r3 = await e4(t4, a2);
            if (false === r3 || r3 instanceof Error)
              return;
            if ("string" == typeof r3 && r3.length)
              return handleNavigation(r3, true);
          }
          for (const e4 of s2["resolve:before"])
            await e4(t4, a2);
          Object.assign(a2, t4);
          for (const e4 of s2["navigate:after"])
            await e4(t4, a2);
        } catch (e4) {
          for (const t4 of s2.error)
            await t4(e4);
        }
      }
      __name(handleNavigation, "handleNavigation");
      const c2 = { currentRoute: sp.computed(() => a2), isReady: () => Promise.resolve(), options: {}, install: () => Promise.resolve(), push: (e3) => handleNavigation(e3), replace: (e3) => handleNavigation(e3), back: () => (void 0).history.go(-1), go: (e3) => (void 0).history.go(e3), forward: () => (void 0).history.go(1), beforeResolve: (e3) => registerHook("resolve:before", e3), beforeEach: (e3) => registerHook("navigate:before", e3), afterEach: (e3) => registerHook("navigate:after", e3), onError: (e3) => registerHook("error", e3), resolve: getRouteFromPath, addRoute: (e3, t3) => {
        r2.push(t3);
      }, getRoutes: () => r2, hasRoute: (e3) => r2.some((t3) => t3.name === e3), removeRoute: (e3) => {
        const t3 = r2.findIndex((t4) => t4.name === e3);
        -1 !== t3 && r2.splice(t3, 1);
      } };
      e2.vueApp.component("RouterLink", sp.defineComponent({ functional: true, props: { to: { type: String, required: true }, custom: Boolean, replace: Boolean, activeClass: String, exactActiveClass: String, ariaCurrentValue: String }, setup: (e3, { slots: t3 }) => {
        const navigate = /* @__PURE__ */ __name(() => handleNavigation(e3.to, e3.replace), "navigate");
        return () => {
          const r3 = c2.resolve(e3.to);
          return e3.custom ? t3.default?.({ href: e3.to, navigate, route: r3 }) : sp.h("a", { href: e3.to, onClick: (e4) => (e4.preventDefault(), navigate()) }, t3);
        };
      } })), e2._route = a2, e2._middleware ||= { global: [], named: {} };
      const p2 = e2.payload.state._layout;
      return e2.hooks.hookOnce("app:created", async () => {
        c2.beforeEach(async (r3, s3) => {
          if (r3.meta = sp.reactive(r3.meta || {}), e2.isHydrating && p2 && !sp.isReadonly(r3.meta.layout) && (r3.meta.layout = p2), e2._processingMiddleware = true, !e2.ssrContext?.islandContext) {
            const a3 = /* @__PURE__ */ new Set([...yp, ...e2._middleware.global]);
            {
              const t3 = await e2.runWithContext(() => async function(e3) {
                const t4 = "string" == typeof e3 ? e3 : e3.path;
                {
                  useNuxtApp().ssrContext._preloadManifest = true;
                  const e4 = toRouteMatcher(createRouter$1({ routes: useRuntimeConfig().nitro.routeRules }));
                  return wn({}, ...e4.matchAll(t4).reverse());
                }
              }({ path: r3.path }));
              if (t3.appMiddleware)
                for (const r4 in t3.appMiddleware) {
                  const s4 = e2._middleware.named[r4];
                  if (!s4)
                    return;
                  t3.appMiddleware[r4] ? a3.add(s4) : a3.delete(s4);
                }
            }
            for (const c3 of a3) {
              const a4 = await e2.runWithContext(() => c3(r3, s3));
              if (false === a4 || a4 instanceof Error) {
                const r4 = a4 || createError$1({ statusCode: 404, statusMessage: `Page Not Found: ${t2}`, data: { path: t2 } });
                return delete e2._processingMiddleware, e2.runWithContext(() => showError(r4));
              }
              if (true !== a4 && (a4 || false === a4))
                return a4;
            }
          }
        }), c2.afterEach(() => {
          delete e2._processingMiddleware;
        }), await c2.replace(t2), function(e3, t3, r3 = {}) {
          return r3.trailingSlash || (e3 = withTrailingSlash(e3), t3 = withTrailingSlash(t3)), r3.leadingSlash || (e3 = withLeadingSlash(e3), t3 = withLeadingSlash(t3)), r3.encoding || (e3 = decode(e3), t3 = decode(t3)), e3 === t3;
        }(a2.fullPath, t2) || await e2.runWithContext(() => navigateTo(a2.fullPath));
      }), { provide: { route: a2, router: c2 } };
    } });
    function definePayloadReducer(e2, t2) {
      useNuxtApp().ssrContext._payloadReducers[e2] = t2;
    }
    __name(definePayloadReducer, "definePayloadReducer");
    const xp = [["NuxtError", (e2) => {
      return !!(t2 = e2) && "object" == typeof t2 && gp in t2 && e2.toJSON();
      var t2;
    }], ["EmptyShallowRef", (e2) => sp.isRef(e2) && sp.isShallow(e2) && !e2.value && ("bigint" == typeof e2.value ? "0n" : JSON.stringify(e2.value) || "_")], ["EmptyRef", (e2) => sp.isRef(e2) && !e2.value && ("bigint" == typeof e2.value ? "0n" : JSON.stringify(e2.value) || "_")], ["ShallowRef", (e2) => sp.isRef(e2) && sp.isShallow(e2) && e2.value], ["ShallowReactive", (e2) => sp.isReactive(e2) && sp.isShallow(e2) && sp.toRaw(e2)], ["Ref", (e2) => sp.isRef(e2) && e2.value], ["Reactive", (e2) => sp.isReactive(e2) && sp.toRaw(e2)]], _p = [vp, bp, defineNuxtPlugin({ name: "nuxt:revive-payload:server", setup() {
      for (const [e2, t2] of xp)
        definePayloadReducer(e2, t2);
    } }), defineNuxtPlugin({ name: "nuxt:global-components" })], _export_sfc = /* @__PURE__ */ __name((e2, t2) => {
      const r2 = e2.__vccOpts || e2;
      for (const [e3, s2] of t2)
        r2[e3] = s2;
      return r2;
    }, "_export_sfc"), Ep = { __name: "app", __ssrInlineRender: true, setup(e2) {
      const t2 = sp.ref(0);
      return (e3, r2, s2, a2) => {
        r2(`<div${ssrRenderAttrs(sp.mergeProps({ class: "container" }, a2))} data-v-5088a2e2><h1 data-v-5088a2e2>\uC548\uB155\uD558\uC138\uC694! \u{1F44B}</h1><p data-v-5088a2e2>\uC774\uAC83\uC740 Nuxt + Cloudflare Workers\uB85C \uB9CC\uB4E0 \uD5EC\uB85C\uC6D4\uB4DC \uC571\uC785\uB2C8\uB2E4!</p><div class="features" data-v-5088a2e2><div class="feature" data-v-5088a2e2><h3 data-v-5088a2e2>\u{1F680} Nuxt 4</h3><p data-v-5088a2e2>\uCD5C\uC2E0 Nuxt \uD504\uB808\uC784\uC6CC\uD06C\uB85C \uAD6C\uCD95</p></div><div class="feature" data-v-5088a2e2><h3 data-v-5088a2e2>\u2601\uFE0F Cloudflare Workers</h3><p data-v-5088a2e2>\uC804 \uC138\uACC4 \uC5E3\uC9C0\uC5D0\uC11C \uC2E4\uD589</p></div><div class="feature" data-v-5088a2e2><h3 data-v-5088a2e2>\u26A1 \uBE60\uB978 \uC131\uB2A5</h3><p data-v-5088a2e2>\uC989\uC2DC \uB85C\uB529\uACFC \uBE60\uB978 \uC751\uB2F5</p></div></div><button class="counter-btn" data-v-5088a2e2> \uD074\uB9AD \uD69F\uC218: ${ssrInterpolate(sp.unref(t2))}</button></div>`);
      };
    } }, wp = Ep.setup;
    Ep.setup = (e2, t2) => {
      const r2 = sp.useSSRContext();
      return (r2.modules || (r2.modules = /* @__PURE__ */ new Set())).add("app.vue"), wp ? wp(e2, t2) : void 0;
    };
    const Sp = _export_sfc(Ep, [["__scopeId", "data-v-5088a2e2"]]), Tp = { __name: "nuxt-error-page", __ssrInlineRender: true, props: { error: Object }, setup(e2) {
      const t2 = e2.error;
      t2.stack && t2.stack.split("\n").splice(1).map((e3) => ({ text: e3.replace("webpack:/", "").replace(".vue", ".js").trim(), internal: e3.includes("node_modules") && !e3.includes(".cache") || e3.includes("internal") || e3.includes("new Promise") })).map((e3) => `<span class="stack${e3.internal ? " internal" : ""}">${e3.text}</span>`).join("\n");
      const r2 = Number(t2.statusCode || 500), s2 = 404 === r2, a2 = t2.statusMessage ?? (s2 ? "Page Not Found" : "Internal Server Error"), c2 = t2.message || t2.toString(), p2 = sp.defineAsyncComponent(() => Promise.resolve().then(function() {
        return Dp;
      })), u2 = sp.defineAsyncComponent(() => Promise.resolve().then(function() {
        return Fp;
      })), d2 = s2 ? p2 : u2;
      return (e3, t3, s3, p3) => {
        t3(ssrRenderComponent(sp.unref(d2), sp.mergeProps({ statusCode: sp.unref(r2), statusMessage: sp.unref(a2), description: sp.unref(c2), stack: sp.unref(void 0) }, p3), null, s3));
      };
    } }, Cp = Tp.setup;
    Tp.setup = (e2, t2) => {
      const r2 = sp.useSSRContext();
      return (r2.modules || (r2.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-page.vue"), Cp ? Cp(e2, t2) : void 0;
    };
    const kp = { __name: "nuxt-root", __ssrInlineRender: true, setup(e2) {
      const IslandRenderer = /* @__PURE__ */ __name(() => null, "IslandRenderer"), t2 = useNuxtApp();
      t2.deferHydration(), t2.ssrContext.url;
      const r2 = false;
      sp.provide(hp, sp.hasInjectionContext() ? sp.inject(hp, useNuxtApp()._route) : useNuxtApp()._route), t2.hooks.callHookWith((e3) => e3.map((e4) => e4()), "vue:setup");
      const s2 = useError(), a2 = s2.value && !t2.ssrContext.error;
      sp.onErrorCaptured((e3, r3, s3) => {
        t2.hooks.callHook("vue:error", e3, r3, s3).catch((e4) => console.error("[nuxt] Error in `vue:error` hook", e4));
        {
          const r4 = t2.runWithContext(() => showError(e3));
          return sp.onServerPrefetch(() => r4), false;
        }
      });
      const c2 = t2.ssrContext.islandContext;
      return (e3, t3, p2, u2) => {
        !async function(e4, { default: t4 }) {
          t4 ? t4() : e4("<!---->");
        }(t3, { default: () => {
          sp.unref(a2) ? t3("<div></div>") : sp.unref(s2) ? t3(ssrRenderComponent(sp.unref(Tp), { error: sp.unref(s2) }, null, p2)) : sp.unref(c2) ? t3(ssrRenderComponent(sp.unref(IslandRenderer), { context: sp.unref(c2) }, null, p2)) : sp.unref(r2) ? renderVNode(t3, sp.createVNode(sp.resolveDynamicComponent(sp.unref(r2)), null, null), p2) : t3(ssrRenderComponent(sp.unref(Sp), null, null, p2));
        } });
      };
    } }, Rp = kp.setup;
    let Ap;
    kp.setup = (e2, t2) => {
      const r2 = sp.useSSRContext();
      return (r2.modules || (r2.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue"), Rp ? Rp(e2, t2) : void 0;
    }, Ap = /* @__PURE__ */ __name(async function(e2) {
      const t2 = sp.createApp(kp), r2 = function(e3) {
        let t3 = 0;
        const r3 = { _id: e3.id || dp || "nuxt-app", _scope: sp.effectScope(), provide: void 0, versions: { get nuxt() {
          return "4.0.3";
        }, get vue() {
          return r3.vueApp.version;
        } }, payload: sp.shallowReactive({ ...e3.ssrContext?.payload || {}, data: sp.shallowReactive({}), state: sp.reactive({}), once: /* @__PURE__ */ new Set(), _errors: sp.shallowReactive({}) }), static: { data: {} }, runWithContext: (e4) => r3._scope.active && !sp.getCurrentScope() ? r3._scope.run(() => callWithNuxt(r3, e4)) : callWithNuxt(r3, e4), isHydrating: false, deferHydration() {
          if (!r3.isHydrating)
            return () => {
            };
          t3++;
          let e4 = false;
          return () => {
            if (!e4)
              return e4 = true, t3--, 0 === t3 ? (r3.isHydrating = false, r3.callHook("app:suspense:resolve")) : void 0;
          };
        }, _asyncDataPromises: {}, _asyncData: sp.shallowReactive({}), _payloadRevivers: {}, ...e3 };
        r3.payload.serverRendered = true, r3.ssrContext && (r3.payload.path = r3.ssrContext.url, r3.ssrContext.nuxt = r3, r3.ssrContext.payload = r3.payload, r3.ssrContext.config = { public: r3.ssrContext.runtimeConfig.public, app: r3.ssrContext.runtimeConfig.app }), r3.hooks = createHooks(), r3.hook = r3.hooks.hook;
        {
          const contextCaller = /* @__PURE__ */ __name(async function(e4, t4) {
            for (const s3 of e4)
              await r3.runWithContext(() => s3(...t4));
          }, "contextCaller");
          r3.hooks.callHook = (e4, ...t4) => r3.hooks.callHookWith(contextCaller, e4, ...t4);
        }
        r3.callHook = r3.hooks.callHook, r3.provide = (e4, t4) => {
          const s3 = "$" + e4;
          defineGetter(r3, s3, t4), defineGetter(r3.vueApp.config.globalProperties, s3, t4);
        }, defineGetter(r3.vueApp, "$nuxt", r3), defineGetter(r3.vueApp.config.globalProperties, "$nuxt", r3);
        const s2 = e3.ssrContext.runtimeConfig;
        return r3.provide("config", s2), r3;
      }({ vueApp: t2, ssrContext: e2 });
      try {
        await async function(e3, t3) {
          const r3 = /* @__PURE__ */ new Set(), s2 = [], a2 = [];
          let c2, p2 = 0;
          async function executePlugin(u2) {
            const d2 = u2.dependsOn?.filter((e4) => t3.some((t4) => t4._name === e4) && !r3.has(e4)) ?? [];
            if (d2.length > 0)
              s2.push([new Set(d2), u2]);
            else {
              const t4 = async function(e4, t5) {
                if ("function" == typeof t5) {
                  const { provide: r4 } = await e4.runWithContext(() => t5(e4)) || {};
                  if (r4 && "object" == typeof r4)
                    for (const t6 in r4)
                      e4.provide(t6, r4[t6]);
                }
              }(e3, u2).then(async () => {
                u2._name && (r3.add(u2._name), await Promise.all(s2.map(async ([e4, t5]) => {
                  e4.has(u2._name) && (e4.delete(u2._name), 0 === e4.size && (p2++, await executePlugin(t5)));
                })));
              }).catch((t5) => {
                if (!u2.parallel && !e3.payload.error)
                  throw t5;
                c2 ||= t5;
              });
              u2.parallel ? a2.push(t4) : await t4;
            }
          }
          __name(executePlugin, "executePlugin");
          for (const r4 of t3)
            e3.ssrContext?.islandContext && false === r4.env?.islands || registerPluginHooks(e3, r4);
          for (const r4 of t3)
            e3.ssrContext?.islandContext && false === r4.env?.islands || await executePlugin(r4);
          if (await Promise.all(a2), p2)
            for (let e4 = 0; e4 < p2; e4++)
              await Promise.all(a2);
          if (c2)
            throw e3.payload.error || c2;
        }(r2, _p), await r2.hooks.callHook("app:created", t2);
      } catch (e3) {
        await r2.hooks.callHook("app:error", e3), r2.payload.error ||= createError(e3);
      }
      if (e2?._renderResponse)
        throw new Error("skipping render");
      return t2;
    }, "Ap");
    const Np = Object.freeze(Object.defineProperty({ __proto__: null, _: _export_sfc, a: useNuxtApp, b: useRuntimeConfig, c: up, default: (e2) => Ap(e2), n: navigateTo, r: resolveRouteObject, u: useRouter }, Symbol.toStringTag, { value: "Module" })), Op = Object.freeze(Object.defineProperty({ __proto__: null, default: { "../node_modules/nuxt/dist/app/components/error-404.vue": { resourceType: "script", module: true, prefetch: true, preload: true, file: "DS7GNepM.js", name: "error-404", src: "../node_modules/nuxt/dist/app/components/error-404.vue", isDynamicEntry: true, imports: ["../node_modules/nuxt/dist/app/entry.js", "_Y-KKPGTz.js"], css: [] }, "error-404.DlVPZ4GE.css": { file: "error-404.DlVPZ4GE.css", resourceType: "style", prefetch: true, preload: true }, "../node_modules/nuxt/dist/app/components/error-500.vue": { resourceType: "script", module: true, prefetch: true, preload: true, file: "DMpQYeGR.js", name: "error-500", src: "../node_modules/nuxt/dist/app/components/error-500.vue", isDynamicEntry: true, imports: ["../node_modules/nuxt/dist/app/entry.js", "_Y-KKPGTz.js"], css: [] }, "error-500.DjyirMQI.css": { file: "error-500.DjyirMQI.css", resourceType: "style", prefetch: true, preload: true }, "../node_modules/nuxt/dist/app/entry.js": { resourceType: "script", module: true, prefetch: true, preload: true, file: "BgyIPFId.js", name: "entry", src: "../node_modules/nuxt/dist/app/entry.js", isEntry: true, dynamicImports: ["../node_modules/nuxt/dist/app/components/error-404.vue", "../node_modules/nuxt/dist/app/components/error-500.vue"], css: ["entry.C1pbtXKx.css"] }, "entry.C1pbtXKx.css": { file: "entry.C1pbtXKx.css", resourceType: "style", prefetch: true, preload: true }, "_Y-KKPGTz.js": { resourceType: "script", module: true, prefetch: true, preload: true, file: "Y-KKPGTz.js", name: "composables", imports: ["../node_modules/nuxt/dist/app/entry.js"] } } }, Symbol.toStringTag, { value: "Module" })), Ip = Object.freeze(Object.defineProperty({ __proto__: null, template: "" }, Symbol.toStringTag, { value: "Module" })), interopDefault = /* @__PURE__ */ __name((e2) => e2.default || e2 || [], "interopDefault"), Pp = { "app.vue": () => Promise.resolve().then(function() {
      return Wp;
    }).then(interopDefault), "app.vue?vue&type=style&index=0&scoped=5088a2e2&lang.css": () => Promise.resolve().then(function() {
      return Xp;
    }).then(interopDefault), "../node_modules/nuxt/dist/app/components/error-404.vue": () => Promise.resolve().then(function() {
      return Yp;
    }).then(interopDefault), "../node_modules/nuxt/dist/app/components/error-500.vue": () => Promise.resolve().then(function() {
      return eu;
    }).then(interopDefault), "../node_modules/nuxt/dist/app/components/error-404.vue?vue&type=style&index=0&scoped=dec70bd4&lang.css": () => Promise.resolve().then(function() {
      return nu;
    }).then(interopDefault), "../node_modules/nuxt/dist/app/components/error-500.vue?vue&type=style&index=0&scoped=d08fec65&lang.css": () => Promise.resolve().then(function() {
      return ou;
    }).then(interopDefault) }, Lp = Object.freeze(Object.defineProperty({ __proto__: null, default: Pp }, Symbol.toStringTag, { value: "Module" }));
    function useHead(e2, t2 = {}) {
      return useHead$1(e2, { head: function(e3) {
        const t3 = e3 || useNuxtApp();
        return t3.ssrContext?.head || t3.runWithContext(() => {
          if (sp.hasInjectionContext()) {
            const e4 = sp.inject(Ta);
            if (!e4)
              throw new Error("[nuxt] [unhead] Missing Unhead instance.");
            return e4;
          }
        });
      }(t2.nuxt), ...t2 });
    }
    __name(useHead, "useHead");
    function defineNuxtLink(e2) {
      const t2 = e2.componentName || "NuxtLink";
      function isHashLinkWithoutHashMode(e3) {
        return "string" == typeof e3 && e3.startsWith("#");
      }
      __name(isHashLinkWithoutHashMode, "isHashLinkWithoutHashMode");
      function useNuxtLink(t3) {
        const r2 = useRouter(), s2 = useRuntimeConfig(), a2 = sp.computed(() => !!t3.target && "_self" !== t3.target), c2 = sp.computed(() => {
          const e3 = t3.to || t3.href || "";
          return "string" == typeof e3 && hasProtocol(e3, { acceptRelative: true });
        }), p2 = sp.resolveComponent("RouterLink"), u2 = p2 && "string" != typeof p2 ? p2.useLink : void 0, d2 = sp.computed(() => {
          if (t3.external)
            return true;
          const e3 = t3.to || t3.href || "";
          return "object" != typeof e3 && ("" === e3 || c2.value);
        }), f2 = sp.computed(() => {
          const s3 = t3.to || t3.href || "";
          return d2.value ? s3 : function(t4, r3, s4) {
            const a3 = s4 ?? e2.trailingSlash;
            if (!t4 || "append" !== a3 && "remove" !== a3)
              return t4;
            if ("string" == typeof t4)
              return applyTrailingSlashBehavior(t4, a3);
            const c3 = "path" in t4 && void 0 !== t4.path ? t4.path : r3(t4).path;
            return { ...t4, name: void 0, path: applyTrailingSlashBehavior(c3, a3) };
          }(s3, r2.resolve, t3.trailingSlash);
        }), m2 = d2.value ? void 0 : u2?.({ ...t3, to: f2 }), g2 = sp.computed(() => {
          const a3 = t3.trailingSlash ?? e2.trailingSlash;
          if (!f2.value || c2.value || isHashLinkWithoutHashMode(f2.value))
            return f2.value;
          if (d2.value) {
            const e3 = "object" == typeof f2.value && "path" in f2.value ? resolveRouteObject(f2.value) : f2.value;
            return applyTrailingSlashBehavior("object" == typeof e3 ? r2.resolve(e3).href : e3, a3);
          }
          return "object" == typeof f2.value ? r2.resolve(f2.value)?.href ?? null : applyTrailingSlashBehavior(joinURL(s2.app.baseURL, f2.value), a3);
        });
        return { to: f2, hasTarget: a2, isAbsoluteUrl: c2, isExternal: d2, href: g2, isActive: m2?.isActive ?? sp.computed(() => f2.value === r2.currentRoute.value.path), isExactActive: m2?.isExactActive ?? sp.computed(() => f2.value === r2.currentRoute.value.path), route: m2?.route ?? sp.computed(() => r2.resolve(f2.value)), async navigate(e3) {
          await navigateTo(g2.value, { replace: t3.replace, external: d2.value || a2.value });
        } };
      }
      __name(useNuxtLink, "useNuxtLink");
      return sp.defineComponent({ name: t2, props: { to: { type: [String, Object], default: void 0, required: false }, href: { type: [String, Object], default: void 0, required: false }, target: { type: String, default: void 0, required: false }, rel: { type: String, default: void 0, required: false }, noRel: { type: Boolean, default: void 0, required: false }, prefetch: { type: Boolean, default: void 0, required: false }, prefetchOn: { type: [String, Object], default: void 0, required: false }, noPrefetch: { type: Boolean, default: void 0, required: false }, activeClass: { type: String, default: void 0, required: false }, exactActiveClass: { type: String, default: void 0, required: false }, prefetchedClass: { type: String, default: void 0, required: false }, replace: { type: Boolean, default: void 0, required: false }, ariaCurrentValue: { type: String, default: void 0, required: false }, external: { type: Boolean, default: void 0, required: false }, custom: { type: Boolean, default: void 0, required: false }, trailingSlash: { type: String, default: void 0, required: false } }, useLink: useNuxtLink, setup(t3, { slots: r2 }) {
        const s2 = useRouter(), { to: a2, href: c2, navigate: p2, isExternal: u2, hasTarget: d2, isAbsoluteUrl: f2 } = useNuxtLink(t3);
        sp.shallowRef(false);
        async function prefetch(e3 = useNuxtApp()) {
        }
        __name(prefetch, "prefetch");
        return () => {
          if (!u2.value && !d2.value && !isHashLinkWithoutHashMode(a2.value)) {
            const s3 = { ref: void 0, to: a2.value, activeClass: t3.activeClass || e2.activeClass, exactActiveClass: t3.exactActiveClass || e2.exactActiveClass, replace: t3.replace, ariaCurrentValue: t3.ariaCurrentValue, custom: t3.custom };
            return t3.custom || (s3.rel = t3.rel || void 0), sp.h(sp.resolveComponent("RouterLink"), s3, r2.default);
          }
          const m2 = t3.target || null, g2 = ((...e3) => e3.find((e4) => void 0 !== e4))(t3.noRel ? "" : t3.rel, e2.externalRelAttribute, f2.value || d2.value ? "noopener noreferrer" : "") || null;
          return t3.custom ? r2.default ? r2.default({ href: c2.value, navigate: p2, prefetch, get route() {
            if (!c2.value)
              return;
            const e3 = new URL(c2.value, "http://localhost");
            return { path: e3.pathname, fullPath: e3.pathname, get query() {
              return parseQuery(e3.search);
            }, hash: e3.hash, params: {}, name: void 0, matched: [], redirectedFrom: void 0, meta: {}, href: c2.value };
          }, rel: g2, target: m2, isExternal: u2.value || d2.value, isActive: false, isExactActive: false }) : null : sp.h("a", { ref: void 0, href: c2.value || null, rel: g2, target: m2, onClick: (e3) => {
            if (!u2.value && !d2.value)
              return e3.preventDefault(), t3.replace ? s2.replace(c2.value) : s2.push(c2.value);
          } }, r2.default?.());
        };
      } });
    }
    __name(defineNuxtLink, "defineNuxtLink");
    const Mp = defineNuxtLink(up);
    function applyTrailingSlashBehavior(e2, t2) {
      const r2 = "append" === t2 ? withTrailingSlash : withoutTrailingSlash;
      return hasProtocol(e2) && !e2.startsWith("http") ? e2 : r2(e2, true);
    }
    __name(applyTrailingSlashBehavior, "applyTrailingSlashBehavior");
    const $p = { __name: "error-404", __ssrInlineRender: true, props: { appName: { type: String, default: "Nuxt" }, statusCode: { type: Number, default: 404 }, statusMessage: { type: String, default: "Page not found" }, description: { type: String, default: "Sorry, the page you are looking for could not be found." }, backHome: { type: String, default: "Go back home" } }, setup(e2) {
      const t2 = e2;
      return useHead({ title: `${t2.statusCode} - ${t2.statusMessage} | ${t2.appName}`, script: [{ innerHTML: `!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();` }], style: [{ innerHTML: '*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1,h2{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}h1,h2,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }' }] }), (t3, r2, s2, a2) => {
        const c2 = Mp;
        r2(`<div${ssrRenderAttrs(sp.mergeProps({ class: "antialiased bg-white dark:bg-[#020420] dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-[#020420] tracking-wide" }, a2))} data-v-dec70bd4><div class="max-w-520px text-center" data-v-dec70bd4><h1 class="font-semibold leading-none mb-4 sm:text-[110px] tabular-nums text-[80px]" data-v-dec70bd4>${ssrInterpolate(e2.statusCode)}</h1><h2 class="font-semibold mb-2 sm:text-3xl text-2xl" data-v-dec70bd4>${ssrInterpolate(e2.statusMessage)}</h2><p class="mb-4 px-2 text-[#64748B] text-md" data-v-dec70bd4>${ssrInterpolate(e2.description)}</p><div class="flex items-center justify-center w-full" data-v-dec70bd4>`), r2(ssrRenderComponent(c2, { to: "/", class: "font-medium hover:text-[#00DC82] text-sm underline underline-offset-3" }, { default: sp.withCtx((t4, r3, s3, a3) => {
          if (!r3)
            return [sp.createTextVNode(sp.toDisplayString(e2.backHome), 1)];
          r3(`${ssrInterpolate(e2.backHome)}`);
        }), _: 1 }, s2)), r2("</div></div></div>");
      };
    } }, Bp = $p.setup;
    $p.setup = (e2, t2) => {
      const r2 = sp.useSSRContext();
      return (r2.modules || (r2.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/error-404.vue"), Bp ? Bp(e2, t2) : void 0;
    };
    const jp = _export_sfc($p, [["__scopeId", "data-v-dec70bd4"]]), Dp = Object.freeze(Object.defineProperty({ __proto__: null, default: jp }, Symbol.toStringTag, { value: "Module" })), Hp = { __name: "error-500", __ssrInlineRender: true, props: { appName: { type: String, default: "Nuxt" }, statusCode: { type: Number, default: 500 }, statusMessage: { type: String, default: "Internal server error" }, description: { type: String, default: "This page is temporarily unavailable." }, refresh: { type: String, default: "Refresh this page" } }, setup(e2) {
      const t2 = e2;
      return useHead({ title: `${t2.statusCode} - ${t2.statusMessage} | ${t2.appName}`, script: [{ innerHTML: `!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();` }], style: [{ innerHTML: '*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1,h2{font-size:inherit;font-weight:inherit}h1,h2,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }' }] }), (t3, r2, s2, a2) => {
        r2(`<div${ssrRenderAttrs(sp.mergeProps({ class: "antialiased bg-white dark:bg-[#020420] dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-[#020420] tracking-wide" }, a2))} data-v-d08fec65><div class="max-w-520px text-center" data-v-d08fec65><h1 class="font-semibold leading-none mb-4 sm:text-[110px] tabular-nums text-[80px]" data-v-d08fec65>${ssrInterpolate(e2.statusCode)}</h1><h2 class="font-semibold mb-2 sm:text-3xl text-2xl" data-v-d08fec65>${ssrInterpolate(e2.statusMessage)}</h2><p class="mb-4 px-2 text-[#64748B] text-md" data-v-d08fec65>${ssrInterpolate(e2.description)}</p></div></div>`);
      };
    } }, Up = Hp.setup;
    Hp.setup = (e2, t2) => {
      const r2 = sp.useSSRContext();
      return (r2.modules || (r2.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/error-500.vue"), Up ? Up(e2, t2) : void 0;
    };
    const Vp = _export_sfc(Hp, [["__scopeId", "data-v-d08fec65"]]), Fp = Object.freeze(Object.defineProperty({ __proto__: null, default: Vp }, Symbol.toStringTag, { value: "Module" })), zp = ".container[data-v-5088a2e2]{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;margin:0 auto;max-width:800px;padding:2rem;text-align:center}h1[data-v-5088a2e2]{color:#2563eb;font-size:3rem;margin-bottom:1rem}p[data-v-5088a2e2]{color:#6b7280;font-size:1.2rem;margin-bottom:2rem}.features[data-v-5088a2e2]{display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin:3rem 0}.feature[data-v-5088a2e2]{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem}.feature h3[data-v-5088a2e2]{color:#1e40af;margin-bottom:.5rem}.feature p[data-v-5088a2e2]{color:#64748b;font-size:1rem;margin:0}.counter-btn[data-v-5088a2e2]{background:#2563eb;border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:1.1rem;padding:1rem 2rem;transition:background-color .2s}.counter-btn[data-v-5088a2e2]:hover{background:#1d4ed8}.counter-btn[data-v-5088a2e2]:active{transform:scale(.98)}", qp = [zp, zp], Wp = Object.freeze(Object.defineProperty({ __proto__: null, default: qp }, Symbol.toStringTag, { value: "Module" })), Kp = [zp], Xp = Object.freeze(Object.defineProperty({ __proto__: null, default: Kp }, Symbol.toStringTag, { value: "Module" })), Gp = ".grid[data-v-dec70bd4]{display:grid}.mb-2[data-v-dec70bd4]{margin-bottom:.5rem}.mb-4[data-v-dec70bd4]{margin-bottom:1rem}.max-w-520px[data-v-dec70bd4]{max-width:520px}.min-h-screen[data-v-dec70bd4]{min-height:100vh}.w-full[data-v-dec70bd4]{width:100%}.flex[data-v-dec70bd4]{display:flex}.place-content-center[data-v-dec70bd4]{place-content:center}.items-center[data-v-dec70bd4]{align-items:center}.justify-center[data-v-dec70bd4]{justify-content:center}.overflow-hidden[data-v-dec70bd4]{overflow:hidden}.bg-white[data-v-dec70bd4]{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-2[data-v-dec70bd4]{padding-left:.5rem;padding-right:.5rem}.text-center[data-v-dec70bd4]{text-align:center}.text-\\[80px\\][data-v-dec70bd4]{font-size:80px}.text-2xl[data-v-dec70bd4]{font-size:1.5rem;line-height:2rem}.text-sm[data-v-dec70bd4]{font-size:.875rem;line-height:1.25rem}.text-\\[\\#020420\\][data-v-dec70bd4]{--un-text-opacity:1;color:rgb(2 4 32/var(--un-text-opacity))}.text-\\[\\#64748B\\][data-v-dec70bd4]{--un-text-opacity:1;color:rgb(100 116 139/var(--un-text-opacity))}.hover\\:text-\\[\\#00DC82\\][data-v-dec70bd4]:hover{--un-text-opacity:1;color:rgb(0 220 130/var(--un-text-opacity))}.font-medium[data-v-dec70bd4]{font-weight:500}.font-semibold[data-v-dec70bd4]{font-weight:600}.leading-none[data-v-dec70bd4]{line-height:1}.tracking-wide[data-v-dec70bd4]{letter-spacing:.025em}.font-sans[data-v-dec70bd4]{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.tabular-nums[data-v-dec70bd4]{--un-numeric-spacing:tabular-nums;font-variant-numeric:var(--un-ordinal) var(--un-slashed-zero) var(--un-numeric-figure) var(--un-numeric-spacing) var(--un-numeric-fraction)}.underline[data-v-dec70bd4]{text-decoration-line:underline}.underline-offset-3[data-v-dec70bd4]{text-underline-offset:3px}.antialiased[data-v-dec70bd4]{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-\\[\\#020420\\][data-v-dec70bd4]{--un-bg-opacity:1;background-color:rgb(2 4 32/var(--un-bg-opacity))}.dark\\:text-white[data-v-dec70bd4]{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (min-width:640px){.sm\\:text-\\[110px\\][data-v-dec70bd4]{font-size:110px}.sm\\:text-3xl[data-v-dec70bd4]{font-size:1.875rem;line-height:2.25rem}}", Jp = [Gp, Gp], Yp = Object.freeze(Object.defineProperty({ __proto__: null, default: Jp }, Symbol.toStringTag, { value: "Module" })), Qp = ".grid[data-v-d08fec65]{display:grid}.mb-2[data-v-d08fec65]{margin-bottom:.5rem}.mb-4[data-v-d08fec65]{margin-bottom:1rem}.max-w-520px[data-v-d08fec65]{max-width:520px}.min-h-screen[data-v-d08fec65]{min-height:100vh}.place-content-center[data-v-d08fec65]{place-content:center}.overflow-hidden[data-v-d08fec65]{overflow:hidden}.bg-white[data-v-d08fec65]{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-2[data-v-d08fec65]{padding-left:.5rem;padding-right:.5rem}.text-center[data-v-d08fec65]{text-align:center}.text-\\[80px\\][data-v-d08fec65]{font-size:80px}.text-2xl[data-v-d08fec65]{font-size:1.5rem;line-height:2rem}.text-\\[\\#020420\\][data-v-d08fec65]{--un-text-opacity:1;color:rgb(2 4 32/var(--un-text-opacity))}.text-\\[\\#64748B\\][data-v-d08fec65]{--un-text-opacity:1;color:rgb(100 116 139/var(--un-text-opacity))}.font-semibold[data-v-d08fec65]{font-weight:600}.leading-none[data-v-d08fec65]{line-height:1}.tracking-wide[data-v-d08fec65]{letter-spacing:.025em}.font-sans[data-v-d08fec65]{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.tabular-nums[data-v-d08fec65]{--un-numeric-spacing:tabular-nums;font-variant-numeric:var(--un-ordinal) var(--un-slashed-zero) var(--un-numeric-figure) var(--un-numeric-spacing) var(--un-numeric-fraction)}.antialiased[data-v-d08fec65]{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-\\[\\#020420\\][data-v-d08fec65]{--un-bg-opacity:1;background-color:rgb(2 4 32/var(--un-bg-opacity))}.dark\\:text-white[data-v-d08fec65]{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (min-width:640px){.sm\\:text-\\[110px\\][data-v-d08fec65]{font-size:110px}.sm\\:text-3xl[data-v-d08fec65]{font-size:1.875rem;line-height:2.25rem}}", Zp = [Qp, Qp], eu = Object.freeze(Object.defineProperty({ __proto__: null, default: Zp }, Symbol.toStringTag, { value: "Module" })), tu = [Gp], nu = Object.freeze(Object.defineProperty({ __proto__: null, default: tu }, Symbol.toStringTag, { value: "Module" })), ru = [Qp], ou = Object.freeze(Object.defineProperty({ __proto__: null, default: ru }, Symbol.toStringTag, { value: "Module" }));
  }();
})();
//# sourceMappingURL=index.js.map
