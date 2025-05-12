var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const app = "";
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = /** @type {string} */
  data;
}
function toggle_class(element2, name, toggle) {
  element2.classList.toggle(name, !!toggle);
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
const outroing = /* @__PURE__ */ new Set();
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
const PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
const App_svelte_svelte_type_style_lang = "";
function create_else_block(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.innerHTML = `<h2 class="svelte-plhjkr">Connection Error</h2> <p>Please make sure DaVinci Resolve is running and try again.</p>`;
      attr(div, "class", "error-card svelte-plhjkr");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.innerHTML = `<h2 class="svelte-plhjkr">Ready to Generate AI Graphicsssssssss</h2> <p>Use the tools below to create graphics for your DaVinci Resolve project.</p>`;
      attr(div, "class", "card svelte-plhjkr");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_fragment(ctx) {
  let main;
  let div2;
  let header;
  let h1;
  let t1;
  let div0;
  let t2;
  let t3;
  let div1;
  function select_block_type(ctx2, dirty) {
    if (
      /*connected*/
      ctx2[0]
    )
      return create_if_block;
    return create_else_block;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      main = element("main");
      div2 = element("div");
      header = element("header");
      h1 = element("h1");
      h1.textContent = "Valuva AI Graphics";
      t1 = space();
      div0 = element("div");
      t2 = text(
        /*statusMessage*/
        ctx[1]
      );
      t3 = space();
      div1 = element("div");
      if_block.c();
      attr(h1, "class", "svelte-plhjkr");
      attr(div0, "class", "status-badge svelte-plhjkr");
      toggle_class(
        div0,
        "connected",
        /*connected*/
        ctx[0]
      );
      toggle_class(div0, "disconnected", !/*connected*/
      ctx[0]);
      attr(header, "class", "svelte-plhjkr");
      attr(div1, "class", "content svelte-plhjkr");
      attr(div2, "class", "app-container svelte-plhjkr");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      append(main, div2);
      append(div2, header);
      append(header, h1);
      append(header, t1);
      append(header, div0);
      append(div0, t2);
      append(div2, t3);
      append(div2, div1);
      if_block.m(div1, null);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*statusMessage*/
      2)
        set_data(
          t2,
          /*statusMessage*/
          ctx2[1]
        );
      if (dirty & /*connected*/
      1) {
        toggle_class(
          div0,
          "connected",
          /*connected*/
          ctx2[0]
        );
      }
      if (dirty & /*connected*/
      1) {
        toggle_class(div0, "disconnected", !/*connected*/
        ctx2[0]);
      }
      if (current_block_type !== (current_block_type = select_block_type(ctx2))) {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(div1, null);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(main);
      }
      if_block.d();
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let statusMessage;
  let connected = false;
  let resolveInfo = null;
  onMount(() => {
    console.log("App mounted");
    if (window.valuvaAPI) {
      window.valuvaAPI.onResolveConnection((isConnected) => {
        $$invalidate(0, connected = isConnected);
      });
      window.valuvaAPI.getResolveInfo().then((info) => {
        if (!info.success) {
          console.error("Resolve info error:", info.error);
          $$invalidate(0, connected = false);
        } else {
          console.log("Resolve info:", info);
          $$invalidate(0, connected = true);
          $$invalidate(2, resolveInfo = info);
        }
      }).catch((error) => {
        console.error("Error getting Resolve info:", error);
        $$invalidate(0, connected = false);
      });
    } else {
      $$invalidate(0, connected = false);
      console.error("Valuva API not available");
    }
  });
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*connected, resolveInfo*/
    5) {
      $$invalidate(1, statusMessage = connected ? `Connected to ${(resolveInfo == null ? void 0 : resolveInfo.productName) || "DaVinci Resolve"} ${(resolveInfo == null ? void 0 : resolveInfo.versionString) || ""}` : "Not connected to DaVinci Resolve");
    }
  };
  return [connected, statusMessage, resolveInfo];
}
class App extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
function updateResolveInfo(info) {
  if (info && info.success)
    ;
}
function initResolveConnection() {
  if (!window.valuvaAPI) {
    console.error("Resolve API not available");
    return;
  }
  window.valuvaAPI.onResolveConnection((connected) => {
  });
  getResolveInfo();
  setInterval(() => {
    if (window.valuvaAPI)
      window.valuvaAPI.keepAlive();
  }, 1e3);
}
async function getResolveInfo() {
  if (!window.valuvaAPI) {
    console.error("Resolve API not available");
    return;
  }
  try {
    const info = await window.valuvaAPI.getResolveInfo();
    updateResolveInfo(info);
  } catch (error) {
    console.error("Error getting Resolve info:", error);
  }
}
initResolveConnection();
new App({
  target: document.getElementById("app")
});
setInterval(() => {
  if (window.valuvaAPI) {
    window.valuvaAPI.keepAlive();
  }
}, 1e3);
