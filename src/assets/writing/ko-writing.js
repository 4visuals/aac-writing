var Tr = Object.defineProperty;
var cn = (r) => {
  throw TypeError(r);
};
var Yr = (r, e, t) => e in r ? Tr(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var Z = (r, e, t) => Yr(r, typeof e != "symbol" ? e + "" : e, t), ln = (r, e, t) => e.has(r) || cn("Cannot " + t);
var H = (r, e, t) => (ln(r, e, "read from private field"), t ? t.call(r) : e.get(r)), Ee = (r, e, t) => e.has(r) ? cn("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t), Te = (r, e, t, n) => (ln(r, e, "write to private field"), n ? n.call(r, t) : e.set(r, t), t);
const Or = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BasePattern() {
    return _;
  },
  get Pattern0() {
    return mr;
  },
  get Pattern20() {
    return ro;
  },
  get Pattern21() {
    return so;
  },
  get Pattern22() {
    return oo;
  },
  get Pattern221() {
    return ao;
  },
  get Pattern222() {
    return io;
  },
  get Pattern223() {
    return co;
  },
  get Pattern23() {
    return lo;
  },
  get Pattern24() {
    return uo;
  },
  get Pattern241() {
    return fo;
  },
  get Pattern242() {
    return ho;
  },
  get Pattern243() {
    return vo;
  },
  get Pattern25() {
    return po;
  },
  get Pattern26() {
    return yo;
  },
  get Pattern271() {
    return mo;
  },
  get Pattern272() {
    return xo;
  },
  get Pattern273() {
    return go;
  },
  get Pattern274() {
    return _o;
  },
  get Pattern28() {
    return ko;
  },
  get Pattern281() {
    return bo;
  },
  get Pattern29() {
    return wo;
  },
  get Pattern291() {
    return Po;
  },
  get Pattern30() {
    return So;
  },
  get Pattern31() {
    return Co;
  },
  get Pattern32() {
    return $o;
  },
  get Pattern321() {
    return jo;
  },
  get Pattern322() {
    return Mo;
  },
  get Pattern323() {
    return Eo;
  },
  get Pattern33() {
    return To;
  },
  get Pattern331() {
    return Yo;
  },
  get Pattern34() {
    return Oo;
  },
  get Pattern341() {
    return No;
  },
  get Pattern342() {
    return Io;
  },
  get Pattern343() {
    return Lo;
  },
  get Pattern35() {
    return Ao;
  },
  get Pattern36() {
    return zo;
  },
  get Pattern371() {
    return qo;
  },
  get Pattern372() {
    return Ro;
  },
  get Pattern373() {
    return Do;
  },
  get Pattern374() {
    return Xo;
  },
  get Pattern38() {
    return Fo;
  },
  get Pattern381() {
    return Wo;
  },
  get Pattern39() {
    return Ho;
  },
  get Pattern391() {
    return Uo;
  },
  get Patterns() {
    return re;
  },
  get WordPattern() {
    return xr;
  }
}, Symbol.toStringTag, { value: "Module" })), Nr = "5";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Nr);
let Xt = !1, Ir = !1;
function Lr() {
  Xt = !0;
}
Lr();
const Ar = 1, zr = 2, qr = 4, Rr = 8, Dr = 16, Xr = 4, Fr = 1, Wr = 2, Sn = "[", Cn = "[!", $n = "]", Gt = {}, U = Symbol(), Hr = ["touchstart", "touchmove"];
function Ur(r) {
  return Hr.includes(r);
}
const Le = !1;
var _e = Array.isArray, Qr = Array.prototype.indexOf, Jr = Array.from, ve = Object.keys, Kt = Object.defineProperty, bt = Object.getOwnPropertyDescriptor, jn = Object.getOwnPropertyDescriptors, Vr = Object.prototype, Gr = Array.prototype, Ve = Object.getPrototypeOf;
function Br(r) {
  return typeof r == "function";
}
const et = () => {
};
function Kr(r) {
  return r();
}
function Ae(r) {
  for (var e = 0; e < r.length; e++)
    r[e]();
}
const V = 2, Mn = 4, se = 8, ke = 16, ot = 32, St = 64, pe = 128, Ct = 256, ye = 512, F = 1024, ht = 2048, $t = 4096, Rt = 8192, Ft = 16384, En = 32768, be = 65536, Zr = 1 << 17, ts = 1 << 19, Tn = 1 << 20, wt = Symbol("$state"), Yn = Symbol("legacy props");
function On(r) {
  return r === this.v;
}
function Nn(r, e) {
  return r != r ? e == e : r !== e || r !== null && typeof r == "object" || typeof r == "function";
}
function Ge(r) {
  return !Nn(r, this.v);
}
function es(r) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function ns() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function rs(r) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function ss() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function os() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function as(r) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function is() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function cs() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function ls() {
  throw new Error("https://svelte.dev/e/state_unsafe_local_read");
}
function us() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function tt(r, e) {
  var t = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: r,
    reactions: null,
    equals: On,
    rv: 0,
    wv: 0
  };
  return t;
}
function Ye(r) {
  return /* @__PURE__ */ In(tt(r));
}
// @__NO_SIDE_EFFECTS__
function we(r, e = !1) {
  var n;
  const t = tt(r);
  return e || (t.equals = Ge), Xt && T !== null && T.l !== null && ((n = T.l).s ?? (n.s = [])).push(t), t;
}
function ze(r, e = !1) {
  return /* @__PURE__ */ In(/* @__PURE__ */ we(r, e));
}
// @__NO_SIDE_EFFECTS__
function In(r) {
  return E !== null && E.f & V && (rt === null ? ws([r]) : rt.push(r)), r;
}
function N(r, e) {
  return E !== null && Ce() && E.f & (V | ke) && // If the source was created locally within the current derived, then
  // we allow the mutation.
  (rt === null || !rt.includes(r)) && us(), ds(r, e);
}
function ds(r, e) {
  return r.equals(e) || (r.v, r.v = e, r.wv = rr(), Ln(r, ht), Ce() && C !== null && C.f & F && !(C.f & (ot | St)) && (it === null ? Ps([r]) : it.push(r))), e;
}
function Ln(r, e) {
  var t = r.reactions;
  if (t !== null)
    for (var n = Ce(), s = t.length, o = 0; o < s; o++) {
      var a = t[o], i = a.f;
      i & ht || !n && a === C || (K(a, e), i & (F | Ct) && (i & V ? Ln(
        /** @type {Derived} */
        a,
        $t
      ) : Me(
        /** @type {Effect} */
        a
      )));
    }
}
function Be(r) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
let R = !1;
function Lt(r) {
  R = r;
}
let I;
function ft(r) {
  if (r === null)
    throw Be(), Gt;
  return I = r;
}
function Ke() {
  return ft(
    /** @type {TemplateNode} */
    /* @__PURE__ */ jt(I)
  );
}
function z(r) {
  if (R) {
    if (/* @__PURE__ */ jt(I) !== null)
      throw Be(), Gt;
    I = r;
  }
}
function fs() {
  for (var r = 0, e = I; ; ) {
    if (e.nodeType === 8) {
      var t = (
        /** @type {Comment} */
        e.data
      );
      if (t === $n) {
        if (r === 0) return e;
        r -= 1;
      } else (t === Sn || t === Cn) && (r += 1);
    }
    var n = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ jt(e)
    );
    e.remove(), e = n;
  }
}
function nt(r, e = null, t) {
  if (typeof r != "object" || r === null || wt in r)
    return r;
  const n = Ve(r);
  if (n !== Vr && n !== Gr)
    return r;
  var s = /* @__PURE__ */ new Map(), o = _e(r), a = tt(0);
  o && s.set("length", tt(
    /** @type {any[]} */
    r.length
  ));
  var i;
  return new Proxy(
    /** @type {any} */
    r,
    {
      defineProperty(c, l, u) {
        (!("value" in u) || u.configurable === !1 || u.enumerable === !1 || u.writable === !1) && is();
        var d = s.get(l);
        return d === void 0 ? (d = tt(u.value), s.set(l, d)) : N(d, nt(u.value, i)), !0;
      },
      deleteProperty(c, l) {
        var u = s.get(l);
        if (u === void 0)
          l in c && s.set(l, tt(U));
        else {
          if (o && typeof l == "string") {
            var d = (
              /** @type {Source<number>} */
              s.get("length")
            ), f = Number(l);
            Number.isInteger(f) && f < d.v && N(d, f);
          }
          N(u, U), un(a);
        }
        return !0;
      },
      get(c, l, u) {
        var p;
        if (l === wt)
          return r;
        var d = s.get(l), f = l in c;
        if (d === void 0 && (!f || (p = bt(c, l)) != null && p.writable) && (d = tt(nt(f ? c[l] : U, i)), s.set(l, d)), d !== void 0) {
          var h = P(d);
          return h === U ? void 0 : h;
        }
        return Reflect.get(c, l, u);
      },
      getOwnPropertyDescriptor(c, l) {
        var u = Reflect.getOwnPropertyDescriptor(c, l);
        if (u && "value" in u) {
          var d = s.get(l);
          d && (u.value = P(d));
        } else if (u === void 0) {
          var f = s.get(l), h = f == null ? void 0 : f.v;
          if (f !== void 0 && h !== U)
            return {
              enumerable: !0,
              configurable: !0,
              value: h,
              writable: !0
            };
        }
        return u;
      },
      has(c, l) {
        var h;
        if (l === wt)
          return !0;
        var u = s.get(l), d = u !== void 0 && u.v !== U || Reflect.has(c, l);
        if (u !== void 0 || C !== null && (!d || (h = bt(c, l)) != null && h.writable)) {
          u === void 0 && (u = tt(d ? nt(c[l], i) : U), s.set(l, u));
          var f = P(u);
          if (f === U)
            return !1;
        }
        return d;
      },
      set(c, l, u, d) {
        var w;
        var f = s.get(l), h = l in c;
        if (o && l === "length")
          for (var p = u; p < /** @type {Source<number>} */
          f.v; p += 1) {
            var m = s.get(p + "");
            m !== void 0 ? N(m, U) : p in c && (m = tt(U), s.set(p + "", m));
          }
        f === void 0 ? (!h || (w = bt(c, l)) != null && w.writable) && (f = tt(void 0), N(f, nt(u, i)), s.set(l, f)) : (h = f.v !== U, N(f, nt(u, i)));
        var g = Reflect.getOwnPropertyDescriptor(c, l);
        if (g != null && g.set && g.set.call(d, u), !h) {
          if (o && typeof l == "string") {
            var k = (
              /** @type {Source<number>} */
              s.get("length")
            ), x = Number(l);
            Number.isInteger(x) && x >= k.v && N(k, x + 1);
          }
          un(a);
        }
        return !0;
      },
      ownKeys(c) {
        P(a);
        var l = Reflect.ownKeys(c).filter((f) => {
          var h = s.get(f);
          return h === void 0 || h.v !== U;
        });
        for (var [u, d] of s)
          d.v !== U && !(u in c) && l.push(u);
        return l;
      },
      setPrototypeOf() {
        cs();
      }
    }
  );
}
function un(r, e = 1) {
  N(r, r.v + e);
}
var dn, An, zn;
function qe() {
  if (dn === void 0) {
    dn = window;
    var r = Element.prototype, e = Node.prototype;
    An = bt(e, "firstChild").get, zn = bt(e, "nextSibling").get, r.__click = void 0, r.__className = "", r.__attributes = null, r.__styles = null, r.__e = void 0, Text.prototype.__t = void 0;
  }
}
function Pt(r = "") {
  return document.createTextNode(r);
}
// @__NO_SIDE_EFFECTS__
function Dt(r) {
  return An.call(r);
}
// @__NO_SIDE_EFFECTS__
function jt(r) {
  return zn.call(r);
}
function q(r, e) {
  if (!R)
    return /* @__PURE__ */ Dt(r);
  var t = (
    /** @type {TemplateNode} */
    /* @__PURE__ */ Dt(I)
  );
  if (t === null)
    t = I.appendChild(Pt());
  else if (e && t.nodeType !== 3) {
    var n = Pt();
    return t == null || t.before(n), ft(n), n;
  }
  return ft(t), t;
}
function le(r, e) {
  if (!R) {
    var t = (
      /** @type {DocumentFragment} */
      /* @__PURE__ */ Dt(
        /** @type {Node} */
        r
      )
    );
    return t instanceof Comment && t.data === "" ? /* @__PURE__ */ jt(t) : t;
  }
  return I;
}
function X(r, e = 1, t = !1) {
  let n = R ? I : r;
  for (var s; e--; )
    s = n, n = /** @type {TemplateNode} */
    /* @__PURE__ */ jt(n);
  if (!R)
    return n;
  var o = n == null ? void 0 : n.nodeType;
  if (t && o !== 3) {
    var a = Pt();
    return n === null ? s == null || s.after(a) : n.before(a), ft(a), a;
  }
  return ft(n), /** @type {TemplateNode} */
  n;
}
function hs(r) {
  r.textContent = "";
}
// @__NO_SIDE_EFFECTS__
function me(r) {
  var e = V | ht;
  C === null ? e |= Ct : C.f |= Tn;
  var t = E !== null && E.f & V ? (
    /** @type {Derived} */
    E
  ) : null;
  const n = {
    children: null,
    ctx: T,
    deps: null,
    equals: On,
    f: e,
    fn: r,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      null
    ),
    wv: 0,
    parent: t ?? C
  };
  return t !== null && (t.children ?? (t.children = [])).push(n), n;
}
// @__NO_SIDE_EFFECTS__
function qn(r) {
  const e = /* @__PURE__ */ me(r);
  return e.equals = Ge, e;
}
function Rn(r) {
  var e = r.children;
  if (e !== null) {
    r.children = null;
    for (var t = 0; t < e.length; t += 1) {
      var n = e[t];
      n.f & V ? Ze(
        /** @type {Derived} */
        n
      ) : yt(
        /** @type {Effect} */
        n
      );
    }
  }
}
function vs(r) {
  for (var e = r.parent; e !== null; ) {
    if (!(e.f & V))
      return (
        /** @type {Effect} */
        e
      );
    e = e.parent;
  }
  return null;
}
function Dn(r) {
  var e, t = C;
  B(vs(r));
  try {
    Rn(r), e = or(r);
  } finally {
    B(t);
  }
  return e;
}
function Xn(r) {
  var e = Dn(r), t = (_t || r.f & Ct) && r.deps !== null ? $t : F;
  K(r, t), r.equals(e) || (r.v = e, r.wv = rr());
}
function Ze(r) {
  Rn(r), ee(r, 0), K(r, Ft), r.v = r.children = r.deps = r.ctx = r.reactions = null;
}
function Fn(r) {
  C === null && E === null && rs(), E !== null && E.f & Ct && ns(), tn && es();
}
function ps(r, e) {
  var t = e.last;
  t === null ? e.last = e.first = r : (t.next = r, r.prev = t, e.last = r);
}
function Mt(r, e, t, n = !0) {
  var s = (r & St) !== 0, o = C, a = {
    ctx: T,
    deps: null,
    deriveds: null,
    nodes_start: null,
    nodes_end: null,
    f: r | ht,
    first: null,
    fn: e,
    last: null,
    next: null,
    parent: s ? null : o,
    prev: null,
    teardown: null,
    transitions: null,
    wv: 0
  };
  if (t) {
    var i = zt;
    try {
      hn(!0), je(a), a.f |= En;
    } catch (u) {
      throw yt(a), u;
    } finally {
      hn(i);
    }
  } else e !== null && Me(a);
  var c = t && a.deps === null && a.first === null && a.nodes_start === null && a.teardown === null && (a.f & (Tn | pe)) === 0;
  if (!c && !s && n && (o !== null && ps(a, o), E !== null && E.f & V)) {
    var l = (
      /** @type {Derived} */
      E
    );
    (l.children ?? (l.children = [])).push(a);
  }
  return a;
}
function Wn(r) {
  const e = Mt(se, null, !1);
  return K(e, F), e.teardown = r, e;
}
function Re(r) {
  Fn();
  var e = C !== null && (C.f & ot) !== 0 && T !== null && !T.m;
  if (e) {
    var t = (
      /** @type {ComponentContext} */
      T
    );
    (t.e ?? (t.e = [])).push({
      fn: r,
      effect: C,
      reaction: E
    });
  } else {
    var n = Pe(r);
    return n;
  }
}
function ys(r) {
  return Fn(), oe(r);
}
function ms(r) {
  const e = Mt(St, r, !0);
  return () => {
    yt(e);
  };
}
function xs(r) {
  const e = Mt(St, r, !0);
  return (t = {}) => new Promise((n) => {
    t.outro ? Xe(e, () => {
      yt(e), n(void 0);
    }) : (yt(e), n(void 0));
  });
}
function Pe(r) {
  return Mt(Mn, r, !1);
}
function ue(r, e) {
  var t = (
    /** @type {ComponentContextLegacy} */
    T
  ), n = { effect: null, ran: !1 };
  t.l.r1.push(n), n.effect = oe(() => {
    r(), !n.ran && (n.ran = !0, N(t.l.r2, !0), mt(e));
  });
}
function Hn() {
  var r = (
    /** @type {ComponentContextLegacy} */
    T
  );
  oe(() => {
    if (P(r.l.r2)) {
      for (var e of r.l.r1) {
        var t = e.effect;
        t.f & F && K(t, $t), Wt(t) && je(t), e.ran = !1;
      }
      r.l.r2.v = !1;
    }
  });
}
function oe(r) {
  return Mt(se, r, !0);
}
function At(r) {
  return Un(r);
}
function Un(r, e = 0) {
  return Mt(se | ke | e, r, !0);
}
function De(r, e = !0) {
  return Mt(se | ot, r, !0, e);
}
function Qn(r) {
  var e = r.teardown;
  if (e !== null) {
    const t = tn, n = E;
    vn(!0), st(null);
    try {
      e.call(null);
    } finally {
      vn(t), st(n);
    }
  }
}
function Jn(r) {
  var e = r.deriveds;
  if (e !== null) {
    r.deriveds = null;
    for (var t = 0; t < e.length; t += 1)
      Ze(e[t]);
  }
}
function Vn(r, e = !1) {
  var t = r.first;
  for (r.first = r.last = null; t !== null; ) {
    var n = t.next;
    yt(t, e), t = n;
  }
}
function gs(r) {
  for (var e = r.first; e !== null; ) {
    var t = e.next;
    e.f & ot || yt(e), e = t;
  }
}
function yt(r, e = !0) {
  var t = !1;
  if ((e || r.f & ts) && r.nodes_start !== null) {
    for (var n = r.nodes_start, s = r.nodes_end; n !== null; ) {
      var o = n === s ? null : (
        /** @type {TemplateNode} */
        /* @__PURE__ */ jt(n)
      );
      n.remove(), n = o;
    }
    t = !0;
  }
  Vn(r, e && !t), Jn(r), ee(r, 0), K(r, Ft);
  var a = r.transitions;
  if (a !== null)
    for (const c of a)
      c.stop();
  Qn(r);
  var i = r.parent;
  i !== null && i.first !== null && Gn(r), r.next = r.prev = r.teardown = r.ctx = r.deps = r.fn = r.nodes_start = r.nodes_end = null;
}
function Gn(r) {
  var e = r.parent, t = r.prev, n = r.next;
  t !== null && (t.next = n), n !== null && (n.prev = t), e !== null && (e.first === r && (e.first = n), e.last === r && (e.last = t));
}
function Xe(r, e) {
  var t = [];
  Bn(r, t, !0), _s(t, () => {
    yt(r), e && e();
  });
}
function _s(r, e) {
  var t = r.length;
  if (t > 0) {
    var n = () => --t || e();
    for (var s of r)
      s.out(n);
  } else
    e();
}
function Bn(r, e, t) {
  if (!(r.f & Rt)) {
    if (r.f ^= Rt, r.transitions !== null)
      for (const a of r.transitions)
        (a.is_global || t) && e.push(a);
    for (var n = r.first; n !== null; ) {
      var s = n.next, o = (n.f & be) !== 0 || (n.f & ot) !== 0;
      Bn(n, e, o ? t : !1), n = s;
    }
  }
}
function fn(r) {
  Kn(r, !0);
}
function Kn(r, e) {
  if (r.f & Rt) {
    r.f ^= Rt, r.f & F || (r.f ^= F), Wt(r) && (K(r, ht), Me(r));
    for (var t = r.first; t !== null; ) {
      var n = t.next, s = (t.f & be) !== 0 || (t.f & ot) !== 0;
      Kn(t, s ? e : !1), t = n;
    }
    if (r.transitions !== null)
      for (const o of r.transitions)
        (o.is_global || e) && o.in();
  }
}
let xe = !1, Fe = [];
function Zn() {
  xe = !1;
  const r = Fe.slice();
  Fe = [], Ae(r);
}
function Se(r) {
  xe || (xe = !0, queueMicrotask(Zn)), Fe.push(r);
}
function ks() {
  xe && Zn();
}
function tr(r) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
const er = 0, bs = 1;
let de = !1, fe = er, Zt = !1, te = null, zt = !1, tn = !1;
function hn(r) {
  zt = r;
}
function vn(r) {
  tn = r;
}
let gt = [], qt = 0;
let E = null;
function st(r) {
  E = r;
}
let C = null;
function B(r) {
  C = r;
}
let rt = null;
function ws(r) {
  rt = r;
}
let Q = null, J = 0, it = null;
function Ps(r) {
  it = r;
}
let nr = 1, ge = 0, _t = !1, T = null;
function rr() {
  return ++nr;
}
function Ce() {
  return !Xt || T !== null && T.l === null;
}
function Wt(r) {
  var l;
  var e = r.f;
  if (e & ht)
    return !0;
  if (e & $t) {
    var t = r.deps, n = (e & Ct) !== 0;
    if (t !== null) {
      var s, o, a = (e & ye) !== 0, i = n && C !== null && !_t, c = t.length;
      if (a || i) {
        for (s = 0; s < c; s++)
          o = t[s], (a || !((l = o == null ? void 0 : o.reactions) != null && l.includes(r))) && (o.reactions ?? (o.reactions = [])).push(r);
        a && (r.f ^= ye);
      }
      for (s = 0; s < c; s++)
        if (o = t[s], Wt(
          /** @type {Derived} */
          o
        ) && Xn(
          /** @type {Derived} */
          o
        ), o.wv > r.wv)
          return !0;
    }
    (!n || C !== null && !_t) && K(r, F);
  }
  return !1;
}
function Ss(r, e) {
  for (var t = e; t !== null; ) {
    if (t.f & pe)
      try {
        t.fn(r);
        return;
      } catch {
        t.f ^= pe;
      }
    t = t.parent;
  }
  throw de = !1, r;
}
function Cs(r) {
  return (r.f & Ft) === 0 && (r.parent === null || (r.parent.f & pe) === 0);
}
function $e(r, e, t, n) {
  if (de) {
    if (t === null && (de = !1), Cs(e))
      throw r;
    return;
  }
  t !== null && (de = !0);
  {
    Ss(r, e);
    return;
  }
}
function sr(r, e, t = 0) {
  var n = r.reactions;
  if (n !== null)
    for (var s = 0; s < n.length; s++) {
      var o = n[s];
      o.f & V ? sr(
        /** @type {Derived} */
        o,
        e,
        t + 1
      ) : e === o && (t === 0 ? K(o, ht) : o.f & F && K(o, $t), Me(
        /** @type {Effect} */
        o
      ));
    }
}
function or(r) {
  var f;
  var e = Q, t = J, n = it, s = E, o = _t, a = rt, i = T, c = r.f;
  Q = /** @type {null | Value[]} */
  null, J = 0, it = null, E = c & (ot | St) ? null : r, _t = !zt && (c & Ct) !== 0, rt = null, T = r.ctx, ge++;
  try {
    var l = (
      /** @type {Function} */
      (0, r.fn)()
    ), u = r.deps;
    if (Q !== null) {
      var d;
      if (ee(r, J), u !== null && J > 0)
        for (u.length = J + Q.length, d = 0; d < Q.length; d++)
          u[J + d] = Q[d];
      else
        r.deps = u = Q;
      if (!_t)
        for (d = J; d < u.length; d++)
          ((f = u[d]).reactions ?? (f.reactions = [])).push(r);
    } else u !== null && J < u.length && (ee(r, J), u.length = J);
    if (Ce() && it !== null && !(r.f & (V | $t | ht)))
      for (d = 0; d < /** @type {Source[]} */
      it.length; d++)
        sr(
          it[d],
          /** @type {Effect} */
          r
        );
    return s !== null && ge++, l;
  } finally {
    Q = e, J = t, it = n, E = s, _t = o, rt = a, T = i;
  }
}
function $s(r, e) {
  let t = e.reactions;
  if (t !== null) {
    var n = Qr.call(t, r);
    if (n !== -1) {
      var s = t.length - 1;
      s === 0 ? t = e.reactions = null : (t[n] = t[s], t.pop());
    }
  }
  t === null && e.f & V && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (Q === null || !Q.includes(e)) && (K(e, $t), e.f & (Ct | ye) || (e.f ^= ye), ee(
    /** @type {Derived} **/
    e,
    0
  ));
}
function ee(r, e) {
  var t = r.deps;
  if (t !== null)
    for (var n = e; n < t.length; n++)
      $s(r, t[n]);
}
function je(r) {
  var e = r.f;
  if (!(e & Ft)) {
    K(r, F);
    var t = C, n = T;
    C = r;
    try {
      e & ke ? gs(r) : Vn(r), Jn(r), Qn(r);
      var s = or(r);
      r.teardown = typeof s == "function" ? s : null, r.wv = nr;
      var o = r.deps, a;
      Le && Ir && r.f & ht;
    } catch (i) {
      $e(i, r, t, n || r.ctx);
    } finally {
      C = t;
    }
  }
}
function ar() {
  if (qt > 1e3) {
    qt = 0;
    try {
      ss();
    } catch (r) {
      if (te !== null)
        $e(r, te, null);
      else
        throw r;
    }
  }
  qt++;
}
function ir(r) {
  var e = r.length;
  if (e !== 0) {
    ar();
    var t = zt;
    zt = !0;
    try {
      for (var n = 0; n < e; n++) {
        var s = r[n];
        s.f & F || (s.f ^= F);
        var o = [];
        cr(s, o), js(o);
      }
    } finally {
      zt = t;
    }
  }
}
function js(r) {
  var e = r.length;
  if (e !== 0)
    for (var t = 0; t < e; t++) {
      var n = r[t];
      if (!(n.f & (Ft | Rt)))
        try {
          Wt(n) && (je(n), n.deps === null && n.first === null && n.nodes_start === null && (n.teardown === null ? Gn(n) : n.fn = null));
        } catch (s) {
          $e(s, n, null, n.ctx);
        }
    }
}
function Ms() {
  if (Zt = !1, qt > 1001)
    return;
  const r = gt;
  gt = [], ir(r), Zt || (qt = 0, te = null);
}
function Me(r) {
  fe === er && (Zt || (Zt = !0, queueMicrotask(Ms))), te = r;
  for (var e = r; e.parent !== null; ) {
    e = e.parent;
    var t = e.f;
    if (t & (St | ot)) {
      if (!(t & F)) return;
      e.f ^= F;
    }
  }
  gt.push(e);
}
function cr(r, e) {
  var t = r.first, n = [];
  t: for (; t !== null; ) {
    var s = t.f, o = (s & ot) !== 0, a = o && (s & F) !== 0, i = t.next;
    if (!a && !(s & Rt))
      if (s & se) {
        if (o)
          t.f ^= F;
        else
          try {
            Wt(t) && je(t);
          } catch (d) {
            $e(d, t, null, t.ctx);
          }
        var c = t.first;
        if (c !== null) {
          t = c;
          continue;
        }
      } else s & Mn && n.push(t);
    if (i === null) {
      let d = t.parent;
      for (; d !== null; ) {
        if (r === d)
          break t;
        var l = d.next;
        if (l !== null) {
          t = l;
          continue t;
        }
        d = d.parent;
      }
    }
    t = i;
  }
  for (var u = 0; u < n.length; u++)
    c = n[u], e.push(c), cr(c, e);
}
function O(r) {
  var e = fe, t = gt;
  try {
    ar();
    const s = [];
    fe = bs, gt = s, Zt = !1, ir(t);
    var n = r == null ? void 0 : r();
    return ks(), (gt.length > 0 || s.length > 0) && O(), qt = 0, te = null, n;
  } finally {
    fe = e, gt = t;
  }
}
function P(r) {
  var u;
  var e = r.f, t = (e & V) !== 0;
  if (t && e & Ft) {
    var n = Dn(
      /** @type {Derived} */
      r
    );
    return Ze(
      /** @type {Derived} */
      r
    ), n;
  }
  if (E !== null) {
    rt !== null && rt.includes(r) && ls();
    var s = E.deps;
    r.rv < ge && (r.rv = ge, Q === null && s !== null && s[J] === r ? J++ : Q === null ? Q = [r] : Q.push(r));
  } else if (t && /** @type {Derived} */
  r.deps === null)
    for (var o = (
      /** @type {Derived} */
      r
    ), a = o.parent, i = o; a !== null; )
      if (a.f & V) {
        var c = (
          /** @type {Derived} */
          a
        );
        i = c, a = c.parent;
      } else {
        var l = (
          /** @type {Effect} */
          a
        );
        (u = l.deriveds) != null && u.includes(i) || (l.deriveds ?? (l.deriveds = [])).push(i);
        break;
      }
  return t && (o = /** @type {Derived} */
  r, Wt(o) && Xn(o)), r.v;
}
function mt(r) {
  const e = E;
  try {
    return E = null, r();
  } finally {
    E = e;
  }
}
const Es = -7169;
function K(r, e) {
  r.f = r.f & Es | e;
}
function Et(r, e = !1, t) {
  T = {
    p: T,
    c: null,
    e: null,
    m: !1,
    s: r,
    x: null,
    l: null
  }, Xt && !e && (T.l = {
    s: null,
    u: null,
    r1: [],
    r2: tt(!1)
  });
}
function Tt(r) {
  const e = T;
  if (e !== null) {
    r !== void 0 && (e.x = r);
    const a = e.e;
    if (a !== null) {
      var t = C, n = E;
      e.e = null;
      try {
        for (var s = 0; s < a.length; s++) {
          var o = a[s];
          B(o.effect), st(o.reaction), Pe(o.fn);
        }
      } finally {
        B(t), st(n);
      }
    }
    T = e.p, e.m = !0;
  }
  return r || /** @type {T} */
  {};
}
function kt(r) {
  if (!(typeof r != "object" || !r || r instanceof EventTarget)) {
    if (wt in r)
      We(r);
    else if (!Array.isArray(r))
      for (let e in r) {
        const t = r[e];
        typeof t == "object" && t && wt in t && We(t);
      }
  }
}
function We(r, e = /* @__PURE__ */ new Set()) {
  if (typeof r == "object" && r !== null && // We don't want to traverse DOM elements
  !(r instanceof EventTarget) && !e.has(r)) {
    e.add(r), r instanceof Date && r.getTime();
    for (let n in r)
      try {
        We(r[n], e);
      } catch {
      }
    const t = Ve(r);
    if (t !== Object.prototype && t !== Array.prototype && t !== Map.prototype && t !== Set.prototype && t !== Date.prototype) {
      const n = jn(t);
      for (let s in n) {
        const o = n[s].get;
        if (o)
          try {
            o.call(r);
          } catch {
          }
      }
    }
  }
}
function Ts(r) {
  var e = E, t = C;
  st(null), B(null);
  try {
    return r();
  } finally {
    st(e), B(t);
  }
}
const Ys = /* @__PURE__ */ new Set(), pn = /* @__PURE__ */ new Set();
function Os(r, e, t, n) {
  function s(o) {
    if (n.capture || Vt.call(e, o), !o.cancelBubble)
      return Ts(() => t.call(this, o));
  }
  return r.startsWith("pointer") || r.startsWith("touch") || r === "wheel" ? Se(() => {
    e.addEventListener(r, s, n);
  }) : e.addEventListener(r, s, n), s;
}
function ut(r, e, t, n, s) {
  var o = { capture: n, passive: s }, a = Os(r, e, t, o);
  (e === document.body || e === window || e === document) && Wn(() => {
    e.removeEventListener(r, a, o);
  });
}
function Vt(r) {
  var x;
  var e = this, t = (
    /** @type {Node} */
    e.ownerDocument
  ), n = r.type, s = ((x = r.composedPath) == null ? void 0 : x.call(r)) || [], o = (
    /** @type {null | Element} */
    s[0] || r.target
  ), a = 0, i = r.__root;
  if (i) {
    var c = s.indexOf(i);
    if (c !== -1 && (e === document || e === /** @type {any} */
    window)) {
      r.__root = e;
      return;
    }
    var l = s.indexOf(e);
    if (l === -1)
      return;
    c <= l && (a = c);
  }
  if (o = /** @type {Element} */
  s[a] || r.target, o !== e) {
    Kt(r, "currentTarget", {
      configurable: !0,
      get() {
        return o || t;
      }
    });
    var u = E, d = C;
    st(null), B(null);
    try {
      for (var f, h = []; o !== null; ) {
        var p = o.assignedSlot || o.parentNode || /** @type {any} */
        o.host || null;
        try {
          var m = o["__" + n];
          if (m !== void 0 && !/** @type {any} */
          o.disabled)
            if (_e(m)) {
              var [g, ...k] = m;
              g.apply(o, [r, ...k]);
            } else
              m.call(o, r);
        } catch (w) {
          f ? h.push(w) : f = w;
        }
        if (r.cancelBubble || p === e || p === null)
          break;
        o = p;
      }
      if (f) {
        for (let w of h)
          queueMicrotask(() => {
            throw w;
          });
        throw f;
      }
    } finally {
      r.__root = e, delete r.currentTarget, st(u), B(d);
    }
  }
}
function Ns(r) {
  var e = document.createElement("template");
  return e.innerHTML = r, e.content;
}
function pt(r, e) {
  var t = (
    /** @type {Effect} */
    C
  );
  t.nodes_start === null && (t.nodes_start = r, t.nodes_end = e);
}
// @__NO_SIDE_EFFECTS__
function at(r, e) {
  var t = (e & Fr) !== 0, n = (e & Wr) !== 0, s, o = !r.startsWith("<!>");
  return () => {
    if (R)
      return pt(I, null), I;
    s === void 0 && (s = Ns(o ? r : "<!>" + r), t || (s = /** @type {Node} */
    /* @__PURE__ */ Dt(s)));
    var a = (
      /** @type {TemplateNode} */
      n ? document.importNode(s, !0) : s.cloneNode(!0)
    );
    if (t) {
      var i = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Dt(a)
      ), c = (
        /** @type {TemplateNode} */
        a.lastChild
      );
      pt(i, c);
    } else
      pt(a, a);
    return a;
  };
}
function yn(r = "") {
  if (!R) {
    var e = Pt(r + "");
    return pt(e, e), e;
  }
  var t = I;
  return t.nodeType !== 3 && (t.before(t = Pt()), ft(t)), pt(t, t), t;
}
function Oe() {
  if (R)
    return pt(I, null), I;
  var r = document.createDocumentFragment(), e = document.createComment(""), t = Pt();
  return r.append(e, t), pt(e, t), r;
}
function D(r, e) {
  if (R) {
    C.nodes_end = I, Ke();
    return;
  }
  r !== null && r.before(
    /** @type {Node} */
    e
  );
}
let He = !0;
function Bt(r, e) {
  var t = e == null ? "" : typeof e == "object" ? e + "" : e;
  t !== (r.__t ?? (r.__t = r.nodeValue)) && (r.__t = t, r.nodeValue = t == null ? "" : t + "");
}
function lr(r, e) {
  return ur(r, e);
}
function Is(r, e) {
  qe(), e.intro = e.intro ?? !1;
  const t = e.target, n = R, s = I;
  try {
    for (var o = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ Dt(t)
    ); o && (o.nodeType !== 8 || /** @type {Comment} */
    o.data !== Sn); )
      o = /** @type {TemplateNode} */
      /* @__PURE__ */ jt(o);
    if (!o)
      throw Gt;
    Lt(!0), ft(
      /** @type {Comment} */
      o
    ), Ke();
    const a = ur(r, { ...e, anchor: o });
    if (I === null || I.nodeType !== 8 || /** @type {Comment} */
    I.data !== $n)
      throw Be(), Gt;
    return Lt(!1), /**  @type {Exports} */
    a;
  } catch (a) {
    if (a === Gt)
      return e.recover === !1 && os(), qe(), hs(t), Lt(!1), lr(r, e);
    throw a;
  } finally {
    Lt(n), ft(s);
  }
}
const Ot = /* @__PURE__ */ new Map();
function ur(r, { target: e, anchor: t, props: n = {}, events: s, context: o, intro: a = !0 }) {
  qe();
  var i = /* @__PURE__ */ new Set(), c = (d) => {
    for (var f = 0; f < d.length; f++) {
      var h = d[f];
      if (!i.has(h)) {
        i.add(h);
        var p = Ur(h);
        e.addEventListener(h, Vt, { passive: p });
        var m = Ot.get(h);
        m === void 0 ? (document.addEventListener(h, Vt, { passive: p }), Ot.set(h, 1)) : Ot.set(h, m + 1);
      }
    }
  };
  c(Jr(Ys)), pn.add(c);
  var l = void 0, u = xs(() => {
    var d = t ?? e.appendChild(Pt());
    return De(() => {
      if (o) {
        Et({});
        var f = (
          /** @type {ComponentContext} */
          T
        );
        f.c = o;
      }
      s && (n.$$events = s), R && pt(
        /** @type {TemplateNode} */
        d,
        null
      ), He = a, l = r(d, n) || {}, He = !0, R && (C.nodes_end = I), o && Tt();
    }), () => {
      var p;
      for (var f of i) {
        e.removeEventListener(f, Vt);
        var h = (
          /** @type {number} */
          Ot.get(f)
        );
        --h === 0 ? (document.removeEventListener(f, Vt), Ot.delete(f)) : Ot.set(f, h);
      }
      pn.delete(c), d !== t && ((p = d.parentNode) == null || p.removeChild(d));
    };
  });
  return Ue.set(l, u), l;
}
let Ue = /* @__PURE__ */ new WeakMap();
function Ls(r, e) {
  const t = Ue.get(r);
  return t ? (Ue.delete(r), t(e)) : Promise.resolve();
}
function xt(r, e, t = !1) {
  R && Ke();
  var n = r, s = null, o = null, a = U, i = t ? be : 0, c = !1;
  const l = (d, f = !0) => {
    c = !0, u(f, d);
  }, u = (d, f) => {
    if (a === (a = d)) return;
    let h = !1;
    if (R) {
      const p = (
        /** @type {Comment} */
        n.data === Cn
      );
      !!a === p && (n = fs(), ft(n), Lt(!1), h = !0);
    }
    a ? (s ? fn(s) : f && (s = De(() => f(n))), o && Xe(o, () => {
      o = null;
    })) : (o ? fn(o) : f && (o = De(() => f(n))), s && Xe(s, () => {
      s = null;
    })), h && Lt(!0);
  };
  Un(() => {
    c = !1, e(l), c || u(null, null);
  }, i), R && (n = I);
}
function Ht(r, e) {
  Se(() => {
    var t = r.getRootNode(), n = (
      /** @type {ShadowRoot} */
      t.host ? (
        /** @type {ShadowRoot} */
        t
      ) : (
        /** @type {Document} */
        t.head ?? /** @type {Document} */
        t.ownerDocument.head
      )
    );
    if (!n.querySelector("#" + e.hash)) {
      const s = document.createElement("style");
      s.id = e.hash, s.textContent = e.code, n.appendChild(s);
    }
  });
}
function mn(r, e, t, n) {
  var s = r.__attributes ?? (r.__attributes = {});
  R && (s[e] = r.getAttribute(e)), s[e] !== (s[e] = t) && ("__styles" in r && (r.__styles = {}), t == null ? r.removeAttribute(e) : typeof t != "string" && As(r).includes(e) ? r[e] = t : r.setAttribute(e, t));
}
var xn = /* @__PURE__ */ new Map();
function As(r) {
  var e = xn.get(r.nodeName);
  if (e) return e;
  xn.set(r.nodeName, e = []);
  for (var t, n = r, s = Element.prototype; s !== n; ) {
    t = jn(n);
    for (var o in t)
      t[o].set && e.push(o);
    n = Ve(n);
  }
  return e;
}
const zs = () => performance.now(), lt = {
  // don't access requestAnimationFrame eagerly outside method
  // this allows basic testing of user code without JSDOM
  // bunder will eval and remove ternary when the user's app is built
  tick: (
    /** @param {any} _ */
    (r) => requestAnimationFrame(r)
  ),
  now: () => zs(),
  tasks: /* @__PURE__ */ new Set()
};
function dr() {
  const r = lt.now();
  lt.tasks.forEach((e) => {
    e.c(r) || (lt.tasks.delete(e), e.f());
  }), lt.tasks.size !== 0 && lt.tick(dr);
}
function qs(r) {
  let e;
  return lt.tasks.size === 0 && lt.tick(dr), {
    promise: new Promise((t) => {
      lt.tasks.add(e = { c: r, f: t });
    }),
    abort() {
      lt.tasks.delete(e);
    }
  };
}
function ie(r, e) {
  r.dispatchEvent(new CustomEvent(e));
}
function Rs(r) {
  if (r === "float") return "cssFloat";
  if (r === "offset") return "cssOffset";
  if (r.startsWith("--")) return r;
  const e = r.split("-");
  return e.length === 1 ? e[0] : e[0] + e.slice(1).map(
    /** @param {any} word */
    (t) => t[0].toUpperCase() + t.slice(1)
  ).join("");
}
function gn(r) {
  const e = {}, t = r.split(";");
  for (const n of t) {
    const [s, o] = n.split(":");
    if (!s || o === void 0) break;
    const a = Rs(s.trim());
    e[a] = o.trim();
  }
  return e;
}
const Ds = (r) => r;
function Xs(r, e, t, n) {
  var s = (r & Xr) !== 0, o = "both", a, i = e.inert, c = e.style.overflow, l, u;
  function d() {
    var g = E, k = C;
    st(null), B(null);
    try {
      return a ?? (a = t()(e, (n == null ? void 0 : n()) ?? /** @type {P} */
      {}, {
        direction: o
      }));
    } finally {
      st(g), B(k);
    }
  }
  var f = {
    is_global: s,
    in() {
      e.inert = i, ie(e, "introstart"), l = Qe(e, d(), u, 1, () => {
        ie(e, "introend"), l == null || l.abort(), l = a = void 0, e.style.overflow = c;
      });
    },
    out(g) {
      e.inert = !0, ie(e, "outrostart"), u = Qe(e, d(), l, 0, () => {
        ie(e, "outroend"), g == null || g();
      });
    },
    stop: () => {
      l == null || l.abort(), u == null || u.abort();
    }
  }, h = (
    /** @type {Effect} */
    C
  );
  if ((h.transitions ?? (h.transitions = [])).push(f), He) {
    var p = s;
    if (!p) {
      for (var m = (
        /** @type {Effect | null} */
        h.parent
      ); m && m.f & be; )
        for (; (m = m.parent) && !(m.f & ke); )
          ;
      p = !m || (m.f & En) !== 0;
    }
    p && Pe(() => {
      mt(() => f.in());
    });
  }
}
function Qe(r, e, t, n, s) {
  var o = n === 1;
  if (Br(e)) {
    var a, i = !1;
    return Se(() => {
      if (!i) {
        var g = e({ direction: o ? "in" : "out" });
        a = Qe(r, g, t, n, s);
      }
    }), {
      abort: () => {
        i = !0, a == null || a.abort();
      },
      deactivate: () => a.deactivate(),
      reset: () => a.reset(),
      t: () => a.t()
    };
  }
  if (t == null || t.deactivate(), !(e != null && e.duration))
    return s(), {
      abort: et,
      deactivate: et,
      reset: et,
      t: () => n
    };
  const { delay: c = 0, css: l, tick: u, easing: d = Ds } = e;
  var f = [];
  if (o && t === void 0 && (u && u(0, 1), l)) {
    var h = gn(l(0, 1));
    f.push(h, h);
  }
  var p = () => 1 - n, m = r.animate(f, { duration: c });
  return m.onfinish = () => {
    var g = (t == null ? void 0 : t.t()) ?? 1 - n;
    t == null || t.abort();
    var k = n - g, x = (
      /** @type {number} */
      e.duration * Math.abs(k)
    ), w = [];
    if (x > 0) {
      var Y = !1;
      if (l)
        for (var $ = Math.ceil(x / 16.666666666666668), b = 0; b <= $; b += 1) {
          var j = g + k * d(b / $), S = gn(l(j, 1 - j));
          w.push(S), Y || (Y = S.overflow === "hidden");
        }
      Y && (r.style.overflow = "hidden"), p = () => {
        var A = (
          /** @type {number} */
          /** @type {globalThis.Animation} */
          m.currentTime
        );
        return g + k * d(A / x);
      }, u && qs(() => {
        if (m.playState !== "running") return !1;
        var A = p();
        return u(A, 1 - A), !0;
      });
    }
    m = r.animate(w, { duration: x, fill: "forwards" }), m.onfinish = () => {
      p = () => n, u == null || u(n, 1 - n), s();
    };
  }, {
    abort: () => {
      m && (m.cancel(), m.effect = null, m.onfinish = et);
    },
    deactivate: () => {
      s = et;
    },
    reset: () => {
      n === 0 && (u == null || u(1, 0));
    },
    t: () => p()
  };
}
function _n(r, e) {
  return r === e || (r == null ? void 0 : r[wt]) === e;
}
function Fs(r = {}, e, t, n) {
  return Pe(() => {
    var s, o;
    return oe(() => {
      s = o, o = [], mt(() => {
        r !== t(...o) && (e(r, ...o), s && _n(t(...s), r) && e(null, ...s));
      });
    }), () => {
      Se(() => {
        o && _n(t(...o), r) && e(null, ...o);
      });
    };
  }), r;
}
function fr(r = !1) {
  const e = (
    /** @type {ComponentContextLegacy} */
    T
  ), t = e.l.u;
  if (!t) return;
  let n = () => kt(e.s);
  if (r) {
    let s = 0, o = (
      /** @type {Record<string, any>} */
      {}
    );
    const a = /* @__PURE__ */ me(() => {
      let i = !1;
      const c = e.s;
      for (const l in c)
        c[l] !== o[l] && (o[l] = c[l], i = !0);
      return i && s++, s;
    });
    n = () => P(a);
  }
  t.b.length && ys(() => {
    kn(e, n), Ae(t.b);
  }), Re(() => {
    const s = mt(() => t.m.map(Kr));
    return () => {
      for (const o of s)
        typeof o == "function" && o();
    };
  }), t.a.length && Re(() => {
    kn(e, n), Ae(t.a);
  });
}
function kn(r, e) {
  if (r.l.s)
    for (const t of r.l.s) P(t);
  e();
}
function Ws(r, e) {
  var o;
  var t = (
    /** @type {Record<string, Function[] | Function>} */
    (o = r.$$events) == null ? void 0 : o[e.type]
  ), n = _e(t) ? t.slice() : t == null ? [] : [t];
  for (var s of n)
    s.call(this, e);
}
function Hs(r) {
  T === null && tr(), Xt && T.l !== null ? Js(T).m.push(r) : Re(() => {
    const e = mt(r);
    if (typeof e == "function") return (
      /** @type {() => void} */
      e
    );
  });
}
function Us(r, e, { bubbles: t = !1, cancelable: n = !1 } = {}) {
  return new CustomEvent(r, { detail: e, bubbles: t, cancelable: n });
}
function Qs() {
  const r = T;
  return r === null && tr(), (e, t, n) => {
    var o;
    const s = (
      /** @type {Record<string, Function | Function[]>} */
      (o = r.s.$$events) == null ? void 0 : o[
        /** @type {any} */
        e
      ]
    );
    if (s) {
      const a = _e(s) ? s.slice() : [s], i = Us(
        /** @type {string} */
        e,
        t,
        n
      );
      for (const c of a)
        c.call(r.x, i);
      return !i.defaultPrevented;
    }
    return !0;
  };
}
function Js(r) {
  var e = (
    /** @type {ComponentContextLegacy} */
    r.l
  );
  return e.u ?? (e.u = { a: [], b: [], m: [] });
}
function hr(r, e, t) {
  if (r == null)
    return e(void 0), et;
  const n = mt(
    () => r.subscribe(
      e,
      // @ts-expect-error
      t
    )
  );
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
const Nt = [];
function vr(r, e = et) {
  let t = null;
  const n = /* @__PURE__ */ new Set();
  function s(i) {
    if (Nn(r, i) && (r = i, t)) {
      const c = !Nt.length;
      for (const l of n)
        l[1](), Nt.push(l, r);
      if (c) {
        for (let l = 0; l < Nt.length; l += 2)
          Nt[l][0](Nt[l + 1]);
        Nt.length = 0;
      }
    }
  }
  function o(i) {
    s(i(
      /** @type {T} */
      r
    ));
  }
  function a(i, c = et) {
    const l = [i, c];
    return n.add(l), n.size === 1 && (t = e(s, o) || et), i(
      /** @type {T} */
      r
    ), () => {
      n.delete(l), n.size === 0 && t && (t(), t = null);
    };
  }
  return { set: s, update: o, subscribe: a };
}
function Vs(r) {
  let e;
  return hr(r, (t) => e = t)(), e;
}
let ce = !1, Je = Symbol();
function Gs(r, e, t) {
  const n = t[e] ?? (t[e] = {
    store: null,
    source: /* @__PURE__ */ we(void 0),
    unsubscribe: et
  });
  if (n.store !== r && !(Je in t))
    if (n.unsubscribe(), n.store = r, r == null)
      n.source.v = void 0, n.unsubscribe = et;
    else {
      var s = !0;
      n.unsubscribe = hr(r, (o) => {
        s ? n.source.v = o : N(n.source, o);
      }), s = !1;
    }
  return Je in t ? Vs(r) : P(n.source);
}
function Bs() {
  const r = {};
  function e() {
    Wn(() => {
      for (var t in r)
        r[t].unsubscribe();
      Kt(r, Je, {
        enumerable: !1,
        value: !0
      });
    });
  }
  return [r, e];
}
function Ks(r) {
  var e = ce;
  try {
    return ce = !1, [r(), ce];
  } finally {
    ce = e;
  }
}
function bn(r) {
  for (var e = C, t = C; e !== null && !(e.f & (ot | St)); )
    e = e.parent;
  try {
    return B(e), r();
  } finally {
    B(t);
  }
}
function L(r, e, t, n) {
  var j;
  var s = (t & Ar) !== 0, o = !Xt || (t & zr) !== 0, a = (t & Rr) !== 0, i = (t & Dr) !== 0, c = !1, l;
  a ? [l, c] = Ks(() => (
    /** @type {V} */
    r[e]
  )) : l = /** @type {V} */
  r[e];
  var u = wt in r || Yn in r, d = a && (((j = bt(r, e)) == null ? void 0 : j.set) ?? (u && e in r && ((S) => r[e] = S))) || void 0, f = (
    /** @type {V} */
    n
  ), h = !0, p = !1, m = () => (p = !0, h && (h = !1, i ? f = mt(
    /** @type {() => V} */
    n
  ) : f = /** @type {V} */
  n), f);
  l === void 0 && n !== void 0 && (d && o && as(), l = m(), d && d(l));
  var g;
  if (o)
    g = () => {
      var S = (
        /** @type {V} */
        r[e]
      );
      return S === void 0 ? m() : (h = !0, p = !1, S);
    };
  else {
    var k = bn(
      () => (s ? me : qn)(() => (
        /** @type {V} */
        r[e]
      ))
    );
    k.f |= Zr, g = () => {
      var S = P(k);
      return S !== void 0 && (f = /** @type {V} */
      void 0), S === void 0 ? f : S;
    };
  }
  if (!(t & qr))
    return g;
  if (d) {
    var x = r.$$legacy;
    return function(S, A) {
      return arguments.length > 0 ? ((!o || !A || x || c) && d(A ? g() : S), S) : g();
    };
  }
  var w = !1, Y = !1, $ = /* @__PURE__ */ we(l), b = bn(
    () => /* @__PURE__ */ me(() => {
      var S = g(), A = P($);
      return w ? (w = !1, Y = !0, A) : (Y = !1, $.v = S);
    })
  );
  return s || (b.equals = Ge), function(S, A) {
    if (arguments.length > 0) {
      const W = A ? P(b) : o && a ? nt(S) : S;
      return b.equals(W) || (w = !0, N($, W), p && f !== void 0 && (f = W), mt(() => P(b))), S;
    }
    return P(b);
  };
}
function Zs(r) {
  return new to(r);
}
var ct, G;
class to {
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(e) {
    /** @type {any} */
    Ee(this, ct);
    /** @type {Record<string, any>} */
    Ee(this, G);
    var o;
    var t = /* @__PURE__ */ new Map(), n = (a, i) => {
      var c = /* @__PURE__ */ we(i);
      return t.set(a, c), c;
    };
    const s = new Proxy(
      { ...e.props || {}, $$events: {} },
      {
        get(a, i) {
          return P(t.get(i) ?? n(i, Reflect.get(a, i)));
        },
        has(a, i) {
          return i === Yn ? !0 : (P(t.get(i) ?? n(i, Reflect.get(a, i))), Reflect.has(a, i));
        },
        set(a, i, c) {
          return N(t.get(i) ?? n(i, c), c), Reflect.set(a, i, c);
        }
      }
    );
    Te(this, G, (e.hydrate ? Is : lr)(e.component, {
      target: e.target,
      anchor: e.anchor,
      props: s,
      context: e.context,
      intro: e.intro ?? !1,
      recover: e.recover
    })), (!((o = e == null ? void 0 : e.props) != null && o.$$host) || e.sync === !1) && O(), Te(this, ct, s.$$events);
    for (const a of Object.keys(H(this, G)))
      a === "$set" || a === "$destroy" || a === "$on" || Kt(this, a, {
        get() {
          return H(this, G)[a];
        },
        /** @param {any} value */
        set(i) {
          H(this, G)[a] = i;
        },
        enumerable: !0
      });
    H(this, G).$set = /** @param {Record<string, any>} next */
    (a) => {
      Object.assign(s, a);
    }, H(this, G).$destroy = () => {
      Ls(H(this, G));
    };
  }
  /** @param {Record<string, any>} props */
  $set(e) {
    H(this, G).$set(e);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(e, t) {
    H(this, ct)[e] = H(this, ct)[e] || [];
    const n = (...s) => t.call(this, ...s);
    return H(this, ct)[e].push(n), () => {
      H(this, ct)[e] = H(this, ct)[e].filter(
        /** @param {any} fn */
        (s) => s !== n
      );
    };
  }
  $destroy() {
    H(this, G).$destroy();
  }
}
ct = new WeakMap(), G = new WeakMap();
let pr;
typeof HTMLElement == "function" && (pr = class extends HTMLElement {
  /**
   * @param {*} $$componentCtor
   * @param {*} $$slots
   * @param {*} use_shadow_dom
   */
  constructor(e, t, n) {
    super();
    /** The Svelte component constructor */
    Z(this, "$$ctor");
    /** Slots */
    Z(this, "$$s");
    /** @type {any} The Svelte component instance */
    Z(this, "$$c");
    /** Whether or not the custom element is connected */
    Z(this, "$$cn", !1);
    /** @type {Record<string, any>} Component props data */
    Z(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    Z(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    Z(this, "$$p_d", {});
    /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
    Z(this, "$$l", {});
    /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
    Z(this, "$$l_u", /* @__PURE__ */ new Map());
    /** @type {any} The managed render effect for reflecting attributes */
    Z(this, "$$me");
    this.$$ctor = e, this.$$s = t, n && this.attachShadow({ mode: "open" });
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  addEventListener(e, t, n) {
    if (this.$$l[e] = this.$$l[e] || [], this.$$l[e].push(t), this.$$c) {
      const s = this.$$c.$on(e, t);
      this.$$l_u.set(t, s);
    }
    super.addEventListener(e, t, n);
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  removeEventListener(e, t, n) {
    if (super.removeEventListener(e, t, n), this.$$c) {
      const s = this.$$l_u.get(t);
      s && (s(), this.$$l_u.delete(t));
    }
  }
  async connectedCallback() {
    if (this.$$cn = !0, !this.$$c) {
      let t = function(o) {
        return (a) => {
          const i = document.createElement("slot");
          o !== "default" && (i.name = o), D(a, i);
        };
      };
      var e = t;
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const n = {}, s = eo(this);
      for (const o of this.$$s)
        o in s && (o === "default" && !this.$$d.children ? (this.$$d.children = t(o), n.default = !0) : n[o] = t(o));
      for (const o of this.attributes) {
        const a = this.$$g_p(o.name);
        a in this.$$d || (this.$$d[a] = he(a, o.value, this.$$p_d, "toProp"));
      }
      for (const o in this.$$p_d)
        !(o in this.$$d) && this[o] !== void 0 && (this.$$d[o] = this[o], delete this[o]);
      this.$$c = Zs({
        component: this.$$ctor,
        target: this.shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: n,
          $$host: this
        }
      }), this.$$me = ms(() => {
        oe(() => {
          var o;
          this.$$r = !0;
          for (const a of ve(this.$$c)) {
            if (!((o = this.$$p_d[a]) != null && o.reflect)) continue;
            this.$$d[a] = this.$$c[a];
            const i = he(
              a,
              this.$$d[a],
              this.$$p_d,
              "toAttribute"
            );
            i == null ? this.removeAttribute(this.$$p_d[a].attribute || a) : this.setAttribute(this.$$p_d[a].attribute || a, i);
          }
          this.$$r = !1;
        });
      });
      for (const o in this.$$l)
        for (const a of this.$$l[o]) {
          const i = this.$$c.$on(o, a);
          this.$$l_u.set(a, i);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  /**
   * @param {string} attr
   * @param {string} _oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(e, t, n) {
    var s;
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = he(e, n, this.$$p_d, "toProp"), (s = this.$$c) == null || s.$set({ [e]: this.$$d[e] }));
  }
  disconnectedCallback() {
    this.$$cn = !1, Promise.resolve().then(() => {
      !this.$$cn && this.$$c && (this.$$c.$destroy(), this.$$me(), this.$$c = void 0);
    });
  }
  /**
   * @param {string} attribute_name
   */
  $$g_p(e) {
    return ve(this.$$p_d).find(
      (t) => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e
    ) || e;
  }
});
function he(r, e, t, n) {
  var o;
  const s = (o = t[r]) == null ? void 0 : o.type;
  if (e = s === "Boolean" && typeof e != "boolean" ? e != null : e, !n || !t[r])
    return e;
  if (n === "toAttribute")
    switch (s) {
      case "Object":
      case "Array":
        return e == null ? null : JSON.stringify(e);
      case "Boolean":
        return e ? "" : null;
      case "Number":
        return e ?? null;
      default:
        return e;
    }
  else
    switch (s) {
      case "Object":
      case "Array":
        return e && JSON.parse(e);
      case "Boolean":
        return e;
      // conversion already handled above
      case "Number":
        return e != null ? +e : e;
      default:
        return e;
    }
}
function eo(r) {
  const e = {};
  return r.childNodes.forEach((t) => {
    e[
      /** @type {Element} node */
      t.slot || "default"
    ] = !0;
  }), e;
}
function Ut(r, e, t, n, s, o) {
  let a = class extends pr {
    constructor() {
      super(r, t, s), this.$$p_d = e;
    }
    static get observedAttributes() {
      return ve(e).map(
        (i) => (e[i].attribute || i).toLowerCase()
      );
    }
  };
  return ve(e).forEach((i) => {
    Kt(a.prototype, i, {
      get() {
        return this.$$c && i in this.$$c ? this.$$c[i] : this.$$d[i];
      },
      set(c) {
        var d;
        c = he(i, c, e), this.$$d[i] = c;
        var l = this.$$c;
        if (l) {
          var u = (d = bt(l, i)) == null ? void 0 : d.get;
          u ? l[i] = c : l.$set({ [i]: c });
        }
      }
    });
  }), n.forEach((i) => {
    Kt(a.prototype, i, {
      get() {
        var c;
        return (c = this.$$c) == null ? void 0 : c[i];
      }
    });
  }), r.element = /** @type {any} */
  a, a;
}
class dt {
  constructor() {
    this.nextChar = void 0;
  }
  static getInstance() {
    return dt.instance || (dt.instance = new dt()), dt.instance;
  }
  setNextChar(e) {
    this.nextChar = e;
  }
  getNextChar() {
    return this.nextChar;
  }
}
const Ne = ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅣ", "ㅐ", "ㅔ", "ㅒ", "ㅖ"], y = {
  canvas: {
    width: 300,
    height: 500
  },
  paths: {
    guide: {
      color: "rgba(255, 140, 0, 0.8)",
      width: 4,
      dash: [5, 5]
    },
    drawing: {
      color: "#0000FF",
      width: 32,
      cap: "round",
      join: "round"
    },
    background: {
      color: "#ffffff",
      widthOffset: 60
    }
  },
  startPoint: {
    color: "#f08759",
    radius: 15,
    textColor: "#ffffff"
  },
  tolerance: 10,
  minStrokeLength: 50,
  animation: {
    duration: 2e3,
    pathColor: "rgba(255, 140, 0, 0.8)",
    arrowColor: "#FF4500",
    arrowSize: 12
  }
}, It = {
  WORD_MODE: {
    calculateCoords: (r, e, t = 0, n = 0) => ({
      stroke1: {
        type: "none",
        start: { x: t, y: n },
        end: { x: t, y: n }
      }
    }),
    strokes: 0
  },
  _: {
    calculateCoords: (r, e, t = 0, n = 0) => ({
      stroke1: {
        type: "none",
        start: { x: t, y: n },
        end: { x: t, y: n }
      }
    }),
    strokes: 0
  },
  ㄱ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.25, o = r / 2, a = e * 0.25, i = e * 0.75, c = dt.getInstance().getNextChar();
      return c && Ne.includes(c) ? {
        stroke1: {
          type: "path",
          start: { x: t + s, y: n + a },
          middle: { x: t + r - s, y: n + a },
          end: { x: t + s * 1.2, y: n + i },
          commands: [
            { type: "M", x: t + s, y: n + a },
            { type: "L", x: t + r - s, y: n + a },
            {
              type: "Q",
              control: {
                x: t + o + s * 0.6,
                y: n + (a + i) / 2
              },
              end: { x: t + s * 1.2, y: n + i }
            }
          ]
        }
      } : {
        stroke1: {
          type: "line",
          start: { x: t + r * 0.25, y: n + e * 0.25 },
          middle: { x: t + r * 0.75, y: n + e * 0.25 },
          end: { x: t + r * 0.75, y: n + e * 0.75 }
        }
      };
    },
    strokes: 1
  },
  ㄴ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.25, o = e * 0.25, a = e * 0.75;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + o },
          middle: { x: t + s, y: n + a },
          end: { x: t + r - s, y: n + a }
        }
      };
    },
    strokes: 1
  },
  ㄷ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.25, o = e * 0.25, a = e * 0.75;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + o },
          end: { x: t + r - s, y: n + o }
        },
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + o },
          middle: { x: t + s, y: n + a },
          end: { x: t + r - s, y: n + a }
        }
      };
    },
    strokes: 2
  },
  ㄹ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.25, o = e * 0.25, a = e * 0.75;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + o },
          middle: { x: t + r - s, y: n + o },
          end: { x: t + r - s, y: n + (o + a) / 2 }
        },
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + (o + a) / 2 },
          end: { x: t + r - s, y: n + (o + a) / 2 }
        },
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + (o + a) / 2 },
          middle: { x: t + s, y: n + a },
          end: { x: t + r - s, y: n + a }
        }
      };
    },
    strokes: 3
  },
  ㅁ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.25, o = e * 0.25, a = e * 0.75;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + o },
          end: { x: t + s, y: n + a }
        },
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + o },
          middle: { x: t + r - s, y: n + o },
          end: { x: t + r - s, y: n + a }
        },
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + a },
          end: { x: t + r - s, y: n + a }
        }
      };
    },
    strokes: 3
  },
  ㅂ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.25, o = e * 0.25, a = e * 0.75;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + o },
          end: { x: t + s, y: n + a }
        },
        stroke2: {
          type: "line",
          start: { x: t + r - s, y: n + o },
          end: { x: t + r - s, y: n + a }
        },
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + (o + a) / 2 },
          end: { x: t + r - s, y: n + (o + a) / 2 }
        },
        stroke4: {
          type: "line",
          start: { x: t + s, y: n + a },
          end: { x: t + r - s, y: n + a }
        }
      };
    },
    strokes: 4
  },
  ㅅ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.25, o = r / 2, a = e * 0.25, i = e * 0.75;
      return {
        stroke1: {
          type: "quadratic",
          start: { x: t + o + s * 0.3, y: n + a },
          // 중앙에서 시작
          control: { x: t + o, y: n + (a + i) / 2 },
          // 왼쪽 곡선 제어점
          end: { x: t + o - s, y: n + i }
          // 왼쪽 아래 끝점
        },
        stroke2: {
          type: "quadratic",
          start: { x: t + o, y: n + (a + i) / 2 },
          // 중앙에서 시작
          control: { x: t + o, y: n + (a + i) / 2 },
          // 오른쪽 곡선 제어점
          end: { x: t + o + s, y: n + i }
          // 오른쪽 아래 끝점
        }
      };
    },
    strokes: 2
  },
  ㅇ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = t + r / 2, o = n + e * 0.5, a = r * 0.25, i = e * 0.25;
      return {
        stroke1: {
          type: "circle",
          center: { x: s, y: o },
          radiusX: a,
          radiusY: i,
          start: { x: s, y: o - i }
        }
      };
    },
    strokes: 1
  },
  ㅈ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.25, o = r / 2, a = e * 0.25, i = e * 0.75;
      return {
        stroke1: {
          type: "path",
          start: { x: t + o - s * 0.9, y: n + a },
          middle: { x: t + o + s * 0.8, y: n + a },
          // ㄱ자 모양의 꺾이는 지점
          end: { x: t + o - s, y: n + i },
          // 종료점은 곡선의 끝점
          commands: [
            { type: "M", x: t + o - s * 0.9, y: n + a },
            // 시작점
            { type: "L", x: t + o + s * 0.8, y: n + a },
            // 가로선으로 이동
            {
              type: "Q",
              // 첫 번째 곡선
              control: {
                x: t + o + s * 0.4,
                y: n + (a + i) / 2
              },
              end: { x: t + o - s, y: n + i }
            }
          ]
        },
        stroke2: {
          type: "quadratic",
          start: {
            x: t + o + s * 0.1,
            y: n + (a + i) / 2 + s * 0.1
          },
          control: {
            x: t + o + s * 0.1,
            y: n + (a + i) / 2 + s * 0.1
          },
          end: { x: t + o + s, y: n + i }
        }
      };
    },
    strokes: 2
  },
  ㅊ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.25, o = r / 2, a = e * 0.325, i = e * 0.75;
      return {
        stroke1: {
          type: "line",
          start: { x: t + o - s / 2, y: n + e * 0.2 },
          end: { x: t + o + s / 2, y: n + e * 0.2 }
        },
        stroke2: {
          type: "path",
          start: { x: t + o - s * 0.9, y: n + a },
          middle: { x: t + o + s * 0.8, y: n + a },
          end: { x: t + o - s, y: n + i },
          commands: [
            { type: "M", x: t + o - s * 0.9, y: n + a },
            // 시작점
            { type: "L", x: t + o + s * 0.8, y: n + a },
            // 가로선으로 이동
            {
              type: "Q",
              // 첫 번째 곡선
              control: {
                x: t + o + s * 0.4,
                y: n + (a + i) / 2
              },
              end: { x: t + o - s, y: n + i }
            }
          ]
        },
        stroke3: {
          type: "quadratic",
          start: {
            x: t + o + s * 0.1,
            y: n + (a + i) / 2 + s * 0.1
          },
          control: {
            x: t + o + s * 0.1,
            y: n + (a + i) / 2 + s * 0.1
          },
          end: { x: t + o + s, y: n + i }
        }
      };
    },
    strokes: 3
  },
  ㅋ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.25, o = r / 2, a = e * 0.25, i = e * 0.75, c = dt.getInstance().getNextChar();
      return c && Ne.includes(c) ? {
        stroke1: {
          type: "path",
          start: { x: t + s, y: n + a },
          middle: { x: t + r - s, y: n + a },
          end: { x: t + s * 1.2, y: n + i },
          commands: [
            { type: "M", x: t + s, y: n + a },
            { type: "L", x: t + r - s, y: n + a },
            {
              type: "Q",
              control: {
                x: t + o + s * 0.6,
                y: n + (a + i) / 2
              },
              end: { x: t + s * 1.2, y: n + i }
            }
          ]
        },
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + (a + i) / 2 - s / 3 },
          end: {
            x: t + o + s / 2,
            y: n + (a + i) / 2 - s / 3
          }
        }
      } : {
        stroke1: {
          type: "line",
          start: { x: t + r * 0.25, y: n + e * 0.25 },
          middle: { x: t + r * 0.75, y: n + e * 0.25 },
          end: { x: t + r * 0.75, y: n + e * 0.75 }
        },
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + (a + i) / 2 },
          end: { x: t + r - s, y: n + (a + i) / 2 }
        }
      };
    },
    strokes: 2
  },
  ㅌ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.25, o = e * 0.25, a = e * 0.75;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + o },
          end: { x: t + r - s, y: n + o }
        },
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + (o + a) / 2 },
          end: { x: t + r - s, y: n + (o + a) / 2 }
        },
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + o },
          middle: { x: t + s, y: n + a },
          end: { x: t + r - s, y: n + a }
        }
      };
    },
    strokes: 3
  },
  ㅍ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.225, o = r * 0.5, a = e * 0.25, i = e * 0.75;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + a },
          end: { x: t + r - s, y: n + a }
        },
        stroke2: {
          type: "line",
          start: { x: t + o - s * 0.5, y: n + a },
          end: { x: t + o - s * 0.5, y: n + i }
        },
        stroke3: {
          type: "line",
          start: { x: t + o + s * 0.5, y: n + a },
          end: { x: t + o + s * 0.5, y: n + i }
        },
        stroke4: {
          type: "line",
          start: { x: t + s, y: n + i },
          end: { x: t + r - s, y: n + i }
        }
      };
    },
    strokes: 4
  },
  ㅎ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.25, o = t + r / 2, a = y.paths.drawing.width, i = e * 0.2, l = e * 0.85 - i, u = Math.min(r * 0.225, e * 0.175), d = Math.min(
        r * 0.175,
        u * 1.25 * (1 + (1 - e / r))
      ), f = Math.min(e * 0.175, u), h = (l - (a * 3 + f * 2)) / 2, p = i, m = p + a + h, g = m + a + h, k = g + f;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s * 1.5, y: n + p },
          end: { x: t + r - s * 1.5, y: n + p }
          // start: { x: x + centerX - firstLineWidth / 2, y: y + firstStrokeY },
          // end: { x: x + centerX + firstLineWidth / 2, y: y + firstStrokeY }
        },
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + m },
          end: { x: t + r - s, y: n + m }
          // start: { x: x + centerX - secondLineWidth / 2, y: y + secondStrokeY },
          // end: { x: x + centerX + secondLineWidth / 2, y: y + secondStrokeY }
        },
        stroke3: {
          type: "circle",
          center: { x: o, y: n + k },
          radiusX: d,
          radiusY: f,
          start: { x: o, y: n + g }
        }
      };
    },
    strokes: 3
  },
  ㄲ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.15, o = r * 0.5, a = r * 0.05, i = e * 0.25, c = e * 0.75, l = dt.getInstance().getNextChar();
      return l && Ne.includes(l) ? {
        stroke1: {
          type: "path",
          start: { x: t + s, y: n + i },
          middle: { x: t + o - a, y: n + i },
          end: { x: t + o - a - r * 0.2, y: n + c },
          commands: [
            { type: "M", x: t + s, y: n + i },
            { type: "L", x: t + o - a, y: n + i },
            {
              type: "Q",
              control: {
                x: t + o - a,
                y: n + (i + c) / 2
              },
              end: { x: t + o - a - r * 0.2, y: n + c }
            }
          ]
        },
        stroke2: {
          type: "path",
          start: { x: t + o + a, y: n + i },
          middle: { x: t + r - s, y: n + i },
          end: {
            x: t + r - s - r * 0.2,
            y: n + c
          },
          commands: [
            { type: "M", x: t + o + a, y: n + i },
            { type: "L", x: t + r - s, y: n + i },
            {
              type: "Q",
              control: { x: t + r - s, y: n + (i + c) / 2 },
              end: {
                x: t + r - s - r * 0.2,
                y: n + c
              }
            }
          ]
        }
      } : {
        // 첫 번째 ㄱ
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + i },
          middle: { x: t + o - a, y: n + i },
          end: { x: t + o - a, y: n + c }
        },
        // 두 번째 ㄱ
        stroke2: {
          type: "line",
          start: { x: t + o + a, y: n + i },
          middle: { x: t + r - s, y: n + i },
          end: { x: t + r - s, y: n + c }
        }
      };
    },
    strokes: 2
  },
  ㄸ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.15, o = r * 0.5, a = r * 0.06, i = e * 0.25, c = e * 0.75;
      return {
        // 첫 번째 ㄷ
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + i },
          end: { x: t + o - a, y: n + i }
        },
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + i },
          middle: { x: t + s, y: n + c },
          end: { x: t + o - a, y: n + c }
        },
        // 두 번째 ㄷ
        stroke3: {
          type: "line",
          start: { x: t + o + a, y: n + i },
          end: { x: t + r - s, y: n + i }
        },
        stroke4: {
          type: "line",
          start: { x: t + o + a, y: n + i },
          middle: { x: t + o + a, y: n + c },
          end: { x: t + r - s, y: n + c }
        }
      };
    },
    strokes: 4
  },
  ㅃ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.15, o = r * 0.5, a = r * 0.06, i = e * 0.25, c = e * 0.75;
      return {
        // 첫 번째 ㅂ
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + i },
          end: { x: t + s, y: n + c }
        },
        stroke2: {
          type: "line",
          start: { x: t + o - a, y: n + i },
          end: { x: t + o - a, y: n + c }
        },
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        stroke4: {
          type: "line",
          start: { x: t + s, y: n + c },
          end: { x: t + o - a, y: n + c }
        },
        // 두 번째 ㅂ
        stroke5: {
          type: "line",
          start: { x: t + o + a, y: n + i },
          end: { x: t + o + a, y: n + c }
        },
        stroke6: {
          type: "line",
          start: { x: t + r - s, y: n + i },
          end: { x: t + r - s, y: n + c }
        },
        stroke7: {
          type: "line",
          start: { x: t + o + a, y: n + (i + c) / 2 },
          end: { x: t + r - s, y: n + (i + c) / 2 }
        },
        stroke8: {
          type: "line",
          start: { x: t + o + a, y: n + c },
          end: { x: t + r - s, y: n + c }
        }
      };
    },
    strokes: 8
  },
  ㅆ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.15, o = s + (r - s * 2) / 4, a = s + (r - s * 2) * 3 / 4, i = e * 0.25, c = e * 0.75;
      return {
        // 첫 번째 ㅅ
        stroke1: {
          type: "quadratic",
          start: { x: t + o + s * 0.4, y: n + i },
          control: { x: t + o, y: n + (i + c) / 2 },
          end: { x: t + o - s, y: n + c }
        },
        stroke2: {
          type: "quadratic",
          start: {
            x: t + o - s * 0.1,
            y: n + (i + c) / 2
          },
          control: {
            x: t + o - s * 0.1,
            y: n + (i + c) / 2
          },
          end: { x: t + o + s * 0.9, y: n + c }
        },
        // 두 번째 ㅅ
        stroke3: {
          type: "quadratic",
          start: { x: t + a + s * 0.4, y: n + i },
          control: { x: t + a, y: n + (i + c) / 2 },
          end: { x: t + a - s, y: n + c }
        },
        stroke4: {
          type: "quadratic",
          start: {
            x: t + a - s * 0.1,
            y: n + (i + c) / 2
          },
          control: {
            x: t + a - s * 0.1,
            y: n + (i + c) / 2
          },
          end: { x: t + a + s * 0.9, y: n + c }
        }
      };
    },
    strokes: 4
  },
  ㅉ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.15, o = s + (r - s * 2) / 4, a = s + (r - s * 2) * 3 / 4, i = e * 0.25, c = e * 0.75;
      return {
        // 첫 번째 ㅈ
        stroke1: {
          type: "path",
          start: { x: t + o - r * 0.15, y: n + i },
          middle: { x: t + o + r * 0.125, y: n + i },
          // ㄱ자 모양의 꺾이는 지점
          end: { x: t + s, y: n + c },
          // 종료점은 곡선의 끝점
          commands: [
            { type: "M", x: t + o - r * 0.15, y: n + i },
            // 시작점
            { type: "L", x: t + o + r * 0.125, y: n + i },
            // 가로선으로 이동
            {
              type: "Q",
              // 첫 번째 곡선
              control: {
                x: t + o + s * 0.2,
                y: n + (i + c) / 2
              },
              end: { x: t + s, y: n + c }
            }
          ]
        },
        stroke2: {
          type: "quadratic",
          start: {
            x: t + o + s * 0.2,
            y: n + (i + c) / 2
          },
          control: {
            x: t + o + s * 0.2,
            y: n + (i + c) / 2
          },
          end: { x: t + (o + s * 0.9), y: n + c }
        },
        stroke3: {
          type: "path",
          start: { x: t + a - r * 0.125, y: n + i },
          middle: { x: t + a + r * 0.18, y: n + i },
          // ㄱ자 모양의 꺾이는 지점
          end: { x: t + r * 0.5, y: n + c },
          // 종료점은 곡선의 끝점
          commands: [
            { type: "M", x: t + a - r * 0.125, y: n + i },
            // 시작점
            { type: "L", x: t + a + r * 0.12, y: n + i },
            // 가로선으로 이동
            {
              type: "Q",
              // 첫 번width * 0.5째 곡선
              control: {
                x: t + a + s * 0.2,
                y: n + (i + c) / 2
              },
              end: { x: t + r * 0.5, y: n + c }
            }
          ]
        },
        stroke4: {
          type: "quadratic",
          start: {
            x: t + a + s * 0.2,
            y: n + (i + c) / 2
          },
          control: {
            x: t + a + s * 0.2,
            y: n + (i + c) / 2
          },
          end: { x: t + r - s, y: n + c }
        }
      };
    },
    strokes: 4
  },
  ㅏ: {
    calculateCoords: (r, e, t, n, s) => {
      t = t || 0, n = n || 0, s = s || 0;
      const o = s * r;
      t += o;
      const a = r * 0.5, i = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: {
            x: t + a - r * 0.125,
            y: n + i - e * 0.3
          },
          end: { x: t + a - r * 0.125, y: n + i + e * 0.3 }
        },
        stroke2: {
          type: "line",
          start: { x: t + a - r * 0.125, y: n + i },
          end: { x: t + a + r * 0.125, y: n + i }
        }
      };
    },
    strokes: 2
  },
  ㅑ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: {
            x: t + s - r * 0.125,
            y: n + o - e * 0.3
          },
          end: {
            x: t + s - r * 0.125,
            y: n + o + e * 0.3
          }
        },
        stroke2: {
          type: "line",
          start: {
            x: t + s - r * 0.125,
            y: n + o - e * 0.08
          },
          end: {
            x: t + s + r * 0.125,
            y: n + o - e * 0.08
          }
        },
        stroke3: {
          type: "line",
          start: {
            x: t + s - r * 0.125,
            y: n + o + e * 0.08
          },
          end: {
            x: t + s + r * 0.125,
            y: n + o + e * 0.08
          }
        }
      };
    },
    strokes: 3
  },
  ㅓ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s - r * 0.125, y: n + o },
          end: { x: t + s + r * 0.125, y: n + o }
        },
        stroke2: {
          type: "line",
          start: {
            x: t + s + r * 0.125,
            y: n + o - e * 0.3
          },
          end: { x: t + s + r * 0.125, y: n + o + e * 0.3 }
        }
      };
    },
    strokes: 2
  },
  ㅕ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: {
            x: t + s - r * 0.125,
            y: n + o - e * 0.08
          },
          end: {
            x: t + s + r * 0.125,
            y: n + o - e * 0.08
          }
        },
        stroke2: {
          type: "line",
          start: {
            x: t + s - r * 0.125,
            y: n + o + e * 0.08
          },
          end: {
            x: t + s + r * 0.125,
            y: n + o + e * 0.08
          }
        },
        stroke3: {
          type: "line",
          start: {
            x: t + s + r * 0.125,
            y: n + o - e * 0.3
          },
          end: { x: t + s + r * 0.125, y: n + o + e * 0.3 }
        }
      };
    },
    strokes: 3
  },
  ㅗ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + o - e * 0.125 },
          end: { x: t + s, y: n + o + e * 0.125 }
        },
        stroke2: {
          type: "line",
          start: {
            x: t + s - r * 0.3,
            y: n + o + e * 0.125
          },
          end: { x: t + s + r * 0.3, y: n + o + e * 0.125 }
        }
      };
    },
    strokes: 2
  },
  ㅛ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: {
            x: t + s - r * 0.08,
            y: n + o - e * 0.125
          },
          end: {
            x: t + s - r * 0.08,
            y: n + +o + e * 0.125
          }
        },
        stroke2: {
          type: "line",
          start: {
            x: t + s + r * 0.08,
            y: n + o - e * 0.125
          },
          end: {
            x: t + s + r * 0.08,
            y: n + +o + e * 0.125
          }
        },
        stroke3: {
          type: "line",
          start: {
            x: t + s - r * 0.3,
            y: n + o + e * 0.125
          },
          end: { x: t + s + r * 0.3, y: n + o + e * 0.125 }
        }
      };
    },
    strokes: 3
  },
  ㅜ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: {
            x: t + s - r * 0.3,
            y: n + o - e * 0.125
          },
          end: { x: t + s + r * 0.3, y: n + o - e * 0.125 }
        },
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + o - e * 0.125 },
          end: { x: t + s, y: n + o + e * 0.125 }
        }
      };
    },
    strokes: 2
  },
  ㅠ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: {
            x: t + s - r * 0.3,
            y: n + o - e * 0.125
          },
          end: { x: t + s + r * 0.3, y: n + o - e * 0.125 }
        },
        stroke2: {
          type: "line",
          start: {
            x: t + s - r * 0.08,
            y: n + o - e * 0.125
          },
          end: {
            x: t + s - r * 0.08,
            y: n + o + e * 0.125
          }
        },
        stroke3: {
          type: "line",
          start: {
            x: t + s + r * 0.08,
            y: n + o - e * 0.125
          },
          end: {
            x: t + s + r * 0.08,
            y: n + o + e * 0.125
          }
        }
      };
    },
    strokes: 3
  },
  ㅡ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s - r * 0.3, y: n + o },
          end: { x: t + s + r * 0.3, y: n + o }
        }
      };
    },
    strokes: 1
  },
  ㅣ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + o - e * 0.3 },
          end: { x: t + s, y: n + o + e * 0.3 }
        }
      };
    },
    strokes: 1
  },
  ㅐ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: {
            x: t + s - r * 0.125,
            y: n + o - e * 0.3
          },
          end: { x: t + s - r * 0.125, y: n + o + e * 0.3 }
        },
        stroke2: {
          type: "line",
          start: { x: t + s - r * 0.125, y: n + o },
          end: { x: t + s + r * 0.125, y: n + o }
        },
        stroke3: {
          type: "line",
          start: {
            x: t + s + r * 0.125,
            y: n + o - e * 0.3
          },
          end: { x: t + s + r * 0.125, y: n + o + e * 0.3 }
        }
      };
    },
    strokes: 3
  },
  ㅔ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s - r * 0.15, y: n + o },
          end: { x: t + s, y: n + o }
        },
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + o - e * 0.3 },
          end: { x: t + s, y: n + o + e * 0.3 }
        },
        stroke3: {
          type: "line",
          start: {
            x: t + s + r * 0.15,
            y: n + o - e * 0.3
          },
          end: { x: t + s + r * 0.15, y: n + o + e * 0.3 }
        }
      };
    },
    strokes: 3
  },
  ㅒ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: {
            x: t + s - r * 0.125,
            y: n + o - e * 0.3
          },
          end: { x: t + s - r * 0.125, y: n + o + e * 0.3 }
        },
        stroke2: {
          type: "line",
          start: {
            x: t + s - r * 0.125,
            y: n + o - e * 0.1
          },
          end: { x: t + s + r * 0.125, y: n + o - e * 0.1 }
        },
        stroke3: {
          type: "line",
          start: {
            x: t + s - r * 0.125,
            y: n + o + e * 0.1
          },
          end: { x: t + s + r * 0.125, y: n + o + e * 0.1 }
        },
        stroke4: {
          type: "line",
          start: {
            x: t + s + r * 0.125,
            y: n + o - e * 0.3
          },
          end: { x: t + s + r * 0.125, y: n + o + e * 0.3 }
        }
      };
    },
    strokes: 4
  },
  ㅖ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.5, o = e * 0.5;
      return {
        stroke1: {
          type: "line",
          start: {
            x: t + s - r * 0.15,
            y: n + o - e * 0.1
          },
          end: { x: t + s, y: n + o - e * 0.1 }
        },
        stroke2: {
          type: "line",
          start: {
            x: t + s - r * 0.15,
            y: n + o + e * 0.1
          },
          end: { x: t + s, y: n + o + e * 0.1 }
        },
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + o - e * 0.3 },
          end: { x: t + s, y: n + o + e * 0.3 }
        },
        stroke4: {
          type: "line",
          start: {
            x: t + s + r * 0.15,
            y: n + o - e * 0.3
          },
          end: { x: t + s + r * 0.15, y: n + o + e * 0.3 }
        }
      };
    },
    strokes: 4
  },
  // 복합 모음들의 좌표 계산 함수
  ㅘ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.125, o = r - s * 2, a = o * 0.65, i = o * 0.35, c = s + a / 2, l = s + a + i / 2, u = e * 0.5, d = e * 0.25, f = e * 0.75;
      return {
        stroke1: {
          // ㅗ의 세로 획
          type: "line",
          start: { x: t + c, y: n + u + s },
          end: { x: t + c, y: n + f }
        },
        stroke2: {
          // ㅗ의 가로 획
          type: "line",
          start: {
            x: t + c - s * 7 / 4,
            y: n + f
          },
          end: { x: t + c + s * 7 / 4, y: n + f }
        },
        stroke3: {
          // ㅏ의 세로 획
          type: "line",
          start: {
            x: t + l - s / 4,
            y: n + d - s / 2
          },
          end: { x: t + l - s / 4, y: n + f + s / 2 }
        },
        stroke4: {
          // ㅏ의 가로 획
          type: "line",
          start: { x: t + l - s / 4, y: n + u },
          end: { x: t + l + s * 3 / 4, y: n + u }
        }
      };
    },
    strokes: 4
  },
  ㅝ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.125, o = r - s * 2, a = o * 0.65, i = o * 0.35, c = s + a / 2, l = s + a + i / 2, u = e * 0.5, d = e * 0.25, f = e * 0.75;
      return {
        stroke1: {
          // ㅜ의 가로 획
          type: "line",
          start: {
            x: t + c - s * 5 / 4,
            y: n + u + s * 3 / 4
          },
          end: {
            x: t + c + s * 9 / 4,
            y: n + u + s * 3 / 4
          }
        },
        stroke2: {
          // ㅜ의 세로 획
          type: "line",
          start: {
            x: t + c + s / 2,
            y: n + u + s * 3 / 4
          },
          end: { x: t + c + s / 2, y: n + f + s / 2 }
        },
        stroke3: {
          // ㅓ의 가로 획
          type: "line",
          start: {
            x: t + l - s * 3 / 4,
            y: n + u + s * 7 / 4
          },
          end: {
            x: t + l + s / 4,
            y: n + u + s * 7 / 4
          }
        },
        stroke4: {
          // ㅓ의 세로 획
          type: "line",
          start: {
            x: t + l + s / 4,
            y: n + d - s / 2
          },
          end: { x: t + l + s / 4, y: n + f + s / 2 }
        }
      };
    },
    strokes: 4
  },
  ㅙ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.125, o = r - s * 2, a = o * 0.65, i = o * 0.35, c = s + a / 2, l = s + a - r * 0.02 + i / 2, u = e * 0.25, d = e * 0.5, f = e * 0.75;
      return {
        stroke1: {
          // ㅗ의 세로 획
          type: "line",
          start: { x: t + c, y: n + d + s },
          end: { x: t + c, y: n + f }
        },
        stroke2: {
          // ㅗ의 가로 획
          type: "line",
          start: {
            x: t + c - s * 7 / 4,
            y: n + f
          },
          end: { x: t + c + s * 7 / 4, y: n + f }
        },
        stroke3: {
          // ㅏ의 세로 획
          type: "line",
          start: {
            x: t + l - s / 4,
            y: n + u - s / 2
          },
          end: { x: t + l - s / 4, y: n + f + s / 2 }
        },
        stroke4: {
          // ㅏ의 가로 획
          type: "line",
          start: { x: t + l - s / 4, y: n + d },
          end: { x: t + l + s * 3 / 4, y: n + d }
        },
        stroke5: {
          // ㅐ의 두 번째 세로 획
          type: "line",
          start: {
            x: t + l + s * 3 / 4,
            y: n + u - s / 2
          },
          end: {
            x: t + l + s * 3 / 4,
            y: n + f + s / 2
          }
        }
      };
    },
    strokes: 5
  },
  ㅞ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.125, o = r - s * 2, a = o * 0.65, i = o * 0.35, c = s + a / 2, l = s + a + i / 2, u = e * 0.5, d = e * 0.25, f = e * 0.75;
      return {
        stroke1: {
          // ㅜ의 가로 획
          type: "line",
          start: {
            x: t + c - s * 7 / 4,
            y: n + u + s * 3 / 4
          },
          end: {
            x: t + c + s * 7 / 4,
            y: n + u + s * 3 / 4
          }
        },
        stroke2: {
          // ㅜ의 세로 획
          type: "line",
          start: {
            x: t + c,
            y: n + u + s * 3 / 4
          },
          end: { x: t + c, y: n + f + s / 2 }
        },
        stroke3: {
          // ㅓ의 가로 획
          type: "line",
          start: {
            x: t + l - s * 5 / 4,
            y: n + u + s * 7 / 4
          },
          end: {
            x: t + l - s * 2 / 5,
            y: n + u + s * 7 / 4
          }
        },
        stroke4: {
          type: "line",
          start: {
            x: t + l - s * 2 / 5,
            y: n + d - s / 2
          },
          end: {
            x: t + l - s * 2 / 5,
            y: n + f + s / 2
          }
        },
        stroke5: {
          // ㅔ의 두 번째 세로 획
          type: "line",
          start: {
            x: t + l + s * 3 / 5,
            y: n + d - s / 2
          },
          end: {
            x: t + l + s * 3 / 5,
            y: n + f + s / 2
          }
        }
      };
    },
    strokes: 5
  },
  ㅚ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.125, o = r - s * 2, a = o * 0.65, i = o * 0.35, c = s + a / 2, l = s + a - r * 0.02 + i / 2, u = e * 0.25, d = e * 0.5, f = e * 0.75;
      return {
        stroke1: {
          // ㅗ의 세로 획
          type: "line",
          start: { x: t + s / 2 + c, y: n + d + s },
          end: { x: t + s / 2 + c, y: n + f }
        },
        stroke2: {
          // ㅗ의 가로 획
          type: "line",
          start: {
            x: t + s / 2 + c - s * 7 / 4,
            y: n + f
          },
          end: {
            x: t + s / 2 + c + s * 7 / 4,
            y: n + f
          }
        },
        stroke3: {
          type: "line",
          start: {
            x: t + s / 2 + l,
            y: n + u - s / 2
          },
          end: { x: t + s / 2 + l, y: n + f + s / 2 }
        }
      };
    },
    strokes: 3
  },
  ㅟ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.125, o = r - s * 2, a = o * 0.65, i = o * 0.35, c = s + a / 2, l = s + a - r * 0.02 + i / 2, u = e * 0.25, d = e * 0.5, f = e * 0.75;
      return {
        stroke1: {
          // ㅜ의 가로 획
          type: "line",
          start: {
            x: t + s / 2 + c - s * 7 / 4,
            y: n + d + s * 3 / 4
          },
          end: {
            x: t + s / 2 + c + s * 7 / 4,
            y: n + d + s * 3 / 4
          }
        },
        stroke2: {
          // ㅜ의 세로 획
          type: "line",
          start: {
            x: t + s / 2 + c,
            y: n + d + s * 3 / 4
          },
          end: { x: t + s / 2 + c, y: n + f + s / 2 }
        },
        stroke3: {
          type: "line",
          start: {
            x: t + s / 2 + l,
            y: n + u - s / 2
          },
          end: { x: t + s / 2 + l, y: n + f + s / 2 }
        }
      };
    },
    strokes: 3
  },
  ㅢ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.125, o = r - s * 2, a = o * 0.65, i = o * 0.35, c = s + a / 2, l = s + a - r * 0.02 + i / 2, u = e * 0.25, d = e * 0.75;
      return {
        stroke1: {
          // ㅜ의 가로 획
          type: "line",
          start: {
            x: t + s / 2 + c - s * 7 / 4,
            y: n + d
          },
          end: {
            x: t + s / 2 + c + s * 7 / 4,
            y: n + d
          }
        },
        stroke2: {
          type: "line",
          start: {
            x: t + s / 2 + l,
            y: n + u - s / 2
          },
          end: { x: t + s / 2 + l, y: n + d + s / 2 }
        }
      };
    },
    strokes: 2
  },
  ㄳ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.2, o = r * 0.5, a = s + (r - s * 2) * 3 / 4, i = r * 0.06, c = e * 0.25, l = e * 0.75;
      return {
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + c },
          middle: { x: t + o - i, y: n + c },
          end: { x: t + o - i, y: n + l }
        },
        stroke2: {
          type: "quadratic",
          start: { x: t + a + s * 0.4, y: n + c },
          control: { x: t + a, y: n + (c + l) / 2 },
          end: { x: t + o + i, y: n + l }
        },
        stroke3: {
          type: "quadratic",
          start: {
            x: t + a + i - s * 0.1,
            y: n + (c + l) / 2
          },
          control: {
            x: t + a + i - s * 0.1,
            y: n + (c + l) / 2
          },
          end: { x: t + a + s * 0.9, y: n + l }
        }
      };
    },
    strokes: 3
  },
  // ㄵ (ㄴ+ㅈ)
  ㄵ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.2, o = r * 0.5, a = s + (r - s * 2) * 3 / 4, i = r * 0.06, c = e * 0.25, l = e * 0.75;
      return {
        // ㄴ
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + c },
          middle: { x: t + s, y: n + l },
          end: { x: t + o - i, y: n + l }
        },
        // ㅈ
        stroke2: {
          type: "path",
          start: { x: t + o + i, y: n + c },
          middle: { x: t + a + s * 0.6, y: n + c },
          // ㄱ자 모양의 꺾이는 지점
          end: { x: t + o + i, y: n + l },
          // 종료점은 곡선의 끝점
          commands: [
            { type: "M", x: t + o + i, y: n + c },
            // 시작점
            { type: "L", x: t + a + s * 0.6, y: n + c },
            // 가로선으로 이동
            {
              type: "Q",
              // 첫 번width * 0.5째 곡선
              control: {
                x: t + a + s * 0.6,
                y: n + (c + l) / 2
              },
              end: { x: t + o + i, y: n + l }
            }
          ]
        },
        stroke3: {
          type: "quadratic",
          start: {
            x: t + a + s * 0.35,
            y: n + (c + l) / 2
          },
          control: {
            x: t + a + s * 0.35,
            y: n + (c + l) / 2
          },
          end: { x: t + r - s, y: n + l }
        }
      };
    },
    strokes: 3
  },
  // ㄶ (ㄴ+ㅎ)
  ㄶ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.2, o = r * 0.5, a = r * 0.06, i = e * 0.25, c = e * 0.75, l = r * 0.25, u = r * 0.75, d = y.paths.drawing.width, f = e * 0.2, p = e * 0.85 - f, m = Math.min(r * 0.225 / 2, e * 0.175), g = Math.min(r * 0.2 / 2, m * 1.25), k = Math.min(e * 0.175, m * 1.25), x = (p - (d * 3 + k * 2)) / 2, w = f, Y = w + d + x, $ = Y + d + x, b = $ + k, j = l, S = l * 1.25;
      return {
        // ㄴ
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + i },
          middle: { x: t + s, y: n + c },
          end: { x: t + o - a, y: n + c }
        },
        // ㅎ의 가로획들
        stroke2: {
          type: "line",
          start: { x: t + u - j / 2, y: n + w },
          end: { x: t + u + j / 2, y: n + w }
        },
        stroke3: {
          type: "line",
          start: {
            x: t + u - S / 2,
            y: n + Y
          },
          end: { x: t + u + S / 2, y: n + Y }
        },
        stroke4: {
          type: "circle",
          center: { x: t + u, y: n + b },
          radiusX: g,
          radiusY: k,
          start: { x: t + u, y: n + $ }
        }
      };
    },
    strokes: 4
  },
  // ㄺ (ㄹ+ㄱ)
  ㄺ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.2, o = r * 0.5, a = r * 0.06, i = e * 0.25, c = e * 0.75;
      return {
        // ㄹ의 첫 번째 획
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + i },
          middle: { x: t + o - a, y: n + i },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        // ㄹ의 두 번째 획
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        // ㄹ의 세 번째 획
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          middle: { x: t + s, y: n + c },
          end: { x: t + o - a, y: n + c }
        },
        // ㄱ
        stroke4: {
          type: "line",
          start: { x: t + o + a, y: n + i },
          middle: { x: t + r - s, y: n + i },
          end: { x: t + r - s, y: n + c }
        }
      };
    },
    strokes: 4
  },
  // ㄻ (ㄹ+ㅁ)
  ㄻ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.2, o = r * 0.5, a = r * 0.06, i = e * 0.25, c = e * 0.75;
      return {
        // ㄹ의 첫 번째 획
        // ㄹ의 첫 번째 획
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + i },
          middle: { x: t + o - a, y: n + i },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        // ㄹ의 두 번째 획
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        // ㄹ의 세 번째 획
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          middle: { x: t + s, y: n + c },
          end: { x: t + o - a, y: n + c }
        },
        // ㅁ의 왼쪽 세로선
        stroke4: {
          type: "line",
          start: { x: t + o + a, y: n + i },
          end: { x: t + o + a, y: n + c }
        },
        // ㅁ의 오른쪽 세로선
        stroke5: {
          type: "line",
          start: { x: t + o + a, y: n + i },
          middle: { x: t + r - s, y: n + i },
          end: { x: t + r - s, y: n + c }
        },
        // ㅁ의 아래 가로선
        stroke6: {
          type: "line",
          start: { x: t + o + a, y: n + c },
          end: { x: t + r - s, y: n + c }
        }
      };
    },
    strokes: 6
  },
  ㄼ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.2, o = r * 0.5, a = r * 0.06, i = e * 0.25, c = e * 0.75;
      return {
        // ㄹ의 첫 번째 획 (가로+세로)
        // ㄹ의 첫 번째 획
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + i },
          middle: { x: t + o - a, y: n + i },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        // ㄹ의 두 번째 획
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        // ㄹ의 세 번째 획
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          middle: { x: t + s, y: n + c },
          end: { x: t + o - a, y: n + c }
        },
        // ㅂ의 왼쪽 세로
        stroke4: {
          type: "line",
          start: { x: t + o + a, y: n + i },
          end: { x: t + o + a, y: n + c }
        },
        // ㅂ의 오른쪽 세로선
        stroke5: {
          type: "line",
          start: { x: t + r - s, y: n + i },
          end: { x: t + r - s, y: n + c }
        },
        // ㅂ의 위위 가로선
        stroke6: {
          type: "line",
          start: { x: t + o + a, y: n + (i + c) / 2 },
          end: { x: t + r - s, y: n + (i + c) / 2 }
        },
        // ㅂ의 아래 가로
        stroke7: {
          type: "line",
          start: { x: t + o + a, y: n + c },
          end: { x: t + r - s, y: n + c }
        }
      };
    },
    strokes: 7
  },
  // ㄽ (ㄹ+ㅅ)
  ㄽ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.2, o = r * 0.5, a = s + (r - s * 2) * 3 / 4, i = r * 0.06, c = e * 0.25, l = e * 0.75;
      return {
        // ㄹ의 첫 번째 획 (가로+세로)
        // ㄹ의 첫 번째 획
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + c },
          middle: { x: t + o - i, y: n + c },
          end: { x: t + o - i, y: n + (c + l) / 2 }
        },
        // ㄹ의 두 번째 획
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + (c + l) / 2 },
          end: { x: t + o - i, y: n + (c + l) / 2 }
        },
        // ㄹ의 세 번째 획
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + (c + l) / 2 },
          middle: { x: t + s, y: n + l },
          end: { x: t + o - i, y: n + l }
        },
        // ㅅ의 왼쪽 사선
        stroke4: {
          type: "quadratic",
          start: { x: t + a + s * 0.4, y: n + c },
          control: { x: t + a, y: n + (c + l) / 2 },
          end: { x: t + o + i, y: n + l }
        },
        stroke5: {
          type: "quadratic",
          start: {
            x: t + a + i - s * 0.1,
            y: n + (c + l) / 2
          },
          control: {
            x: t + a + i - s * 0.1,
            y: n + (c + l) / 2
          },
          end: { x: t + a + s * 0.9, y: n + l }
        }
      };
    },
    strokes: 5
  },
  // ㄾ (ㄹ+ㅌ)
  ㄾ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.2, o = r * 0.5, a = r * 0.06, i = e * 0.25, c = e * 0.75;
      return {
        // ㄹ의 첫 번째 획 (가로+세로)
        // ㄹ의 첫 번째 획
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + i },
          middle: { x: t + o - a, y: n + i },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        // ㄹ의 두 번째 획
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        // ㄹ의 세 번째 획
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          middle: { x: t + s, y: n + c },
          end: { x: t + o - a, y: n + c }
        },
        // ㅌ의 위 가로
        stroke4: {
          type: "line",
          start: { x: t + o + a, y: n + i },
          end: { x: t + r - s, y: n + i }
        },
        // ㅌ의 중간 가로
        stroke5: {
          type: "line",
          start: { x: t + o + a, y: n + (i + c) / 2 },
          end: { x: t + r - s, y: n + (i + c) / 2 }
        },
        // ㅌ의 아래 가로와 세로
        stroke6: {
          type: "line",
          start: { x: t + o + a, y: n + i },
          middle: { x: t + o + a, y: n + c },
          end: { x: t + r - s, y: n + c }
        }
      };
    },
    strokes: 6
  },
  // ㄿ (ㄹ+ㅍ)
  ㄿ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.2, o = r * 0.5, a = r * 0.06, i = e * 0.25, c = e * 0.75;
      return {
        // ㄹ의 첫 번째 획 (가로+세로)
        // ㄹ의 첫 번째 획
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + i },
          middle: { x: t + o - a, y: n + i },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        // ㄹ의 두 번째 획
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        // ㄹ의 세 번째 획
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          middle: { x: t + s, y: n + c },
          end: { x: t + o - a, y: n + c }
        },
        // ㅍ의 위 가로
        stroke4: {
          type: "line",
          start: { x: t + o + a, y: n + i },
          end: { x: t + r - s, y: n + i }
        },
        // ㅍ의 왼쪽 세로
        stroke5: {
          type: "line",
          start: { x: t + o + a + a, y: n + i },
          end: { x: t + o + a + a, y: n + c }
        },
        // ㅍ의 오른쪽 세로
        stroke6: {
          type: "line",
          start: { x: t + r - s - a / 2, y: n + i },
          end: { x: t + r - s - a / 2, y: n + c }
        },
        // ㅍ의 아래 가로
        stroke7: {
          type: "line",
          start: { x: t + o + a, y: n + c },
          end: { x: t + r - s, y: n + c }
        }
      };
    },
    strokes: 7
  },
  // ㄾ (ㄹ+ㅌ)
  ㅀ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.2, o = r * 0.5, a = r * 0.06, i = e * 0.25, c = e * 0.75, l = r * 0.25, u = r * 0.75, d = y.paths.drawing.width, f = e * 0.2, p = e * 0.85 - f, m = Math.min(r * 0.225 / 2, e * 0.175), g = Math.min(r * 0.2 / 2, m * 1.25), k = Math.min(e * 0.175, m * 1.25), x = (p - (d * 3 + k * 2)) / 2, w = f, Y = w + d + x, $ = Y + d + x, b = $ + k, j = l, S = l * 1.25;
      return {
        // ㄹ의 첫 번째 획 (가로+세로)
        // ㄹ의 첫 번째 획
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + i },
          middle: { x: t + o - a, y: n + i },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        // ㄹ의 두 번째 획
        stroke2: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          end: { x: t + o - a, y: n + (i + c) / 2 }
        },
        // ㄹ의 세 번째 획
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + (i + c) / 2 },
          middle: { x: t + s, y: n + c },
          end: { x: t + o - a, y: n + c }
        },
        // ㅎ의 가로획들
        stroke4: {
          type: "line",
          start: { x: t + u - j / 2, y: n + w },
          end: { x: t + u + j / 2, y: n + w }
        },
        stroke5: {
          type: "line",
          start: {
            x: t + u - S / 2,
            y: n + Y
          },
          end: { x: t + u + S / 2, y: n + Y }
        },
        stroke6: {
          type: "circle",
          center: { x: t + u, y: n + b },
          radiusX: g,
          radiusY: k,
          start: { x: t + u, y: n + $ }
        }
      };
    },
    strokes: 6
  },
  // ㄾ (ㄹ+ㅌ)
  ㅄ: {
    calculateCoords: (r, e, t, n) => {
      t = t || 0, n = n || 0;
      const s = r * 0.2, o = r * 0.5, a = s + (r - s * 2) * 3 / 4, i = r * 0.06, c = e * 0.25, l = e * 0.75;
      return {
        // ㅂ의 첫 번째 획 (가로+세로)
        stroke1: {
          type: "line",
          start: { x: t + s, y: n + c },
          end: { x: t + s, y: n + l }
        },
        stroke2: {
          type: "line",
          start: { x: t + o - i, y: n + c },
          end: { x: t + o - i, y: n + l }
        },
        stroke3: {
          type: "line",
          start: { x: t + s, y: n + (c + l) / 2 },
          end: { x: t + o - i, y: n + (c + l) / 2 }
        },
        stroke4: {
          type: "line",
          start: { x: t + s, y: n + l },
          end: { x: t + o - i, y: n + l }
        },
        // ㅅ의 왼쪽 사선
        stroke5: {
          type: "quadratic",
          start: { x: t + a + s * 0.4, y: n + c },
          control: { x: t + a, y: n + (c + l) / 2 },
          end: { x: t + o + i, y: n + l }
        },
        stroke6: {
          type: "quadratic",
          start: {
            x: t + a + i - s * 0.1,
            y: n + (c + l) / 2
          },
          control: {
            x: t + a + i - s * 0.1,
            y: n + (c + l) / 2
          },
          end: { x: t + a + s * 0.9, y: n + l }
        }
      };
    },
    strokes: 6
  }
}, vt = {
  ㄱ: [{ x: 0, y: 0 }],
  ㄴ: [{ x: 0, y: 0 }],
  ㄷ: [
    { x: 0, y: 0 },
    { x: 0, y: 1 }
  ],
  ㄹ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 1 }
  ],
  ㅁ: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅂ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0.67, y: 0 },
    { x: 0.67, y: 0 }
  ],
  ㅅ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅇ: [{ x: 0, y: 0 }],
  ㅈ: [
    { x: 0, y: 0 },
    { x: 0.33, y: 0.33 }
  ],
  ㅊ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0.33, y: 0.33 }
  ],
  ㅋ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅌ: [
    { x: 0, y: 0 },
    { x: 0.67, y: 0 },
    { x: 0, y: 1 }
  ],
  ㅍ: [
    { x: 0, y: 0 },
    { x: 0, y: 0.67 },
    { x: 0, y: 0.67 },
    { x: 0, y: 0 }
  ],
  ㅎ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㄲ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㄸ: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 0, y: 1 }
  ],
  ㅃ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0.67, y: 0 },
    { x: 0.67, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0.67, y: 0 },
    { x: 0.67, y: 0 }
  ],
  ㅆ: [
    { x: 0, y: 0 },
    { x: 0.33, y: 0.33 },
    { x: 0, y: 0 },
    { x: 0.33, y: 0.33 }
  ],
  ㅉ: [
    { x: 0, y: 0 },
    { x: 0.125, y: 0.125 },
    { x: 0, y: 0 },
    { x: 0.125, y: 0.125 }
  ],
  ㅏ: [
    { x: 0, y: 0 },
    { x: 0.67, y: 0 }
  ],
  ㅑ: [
    { x: 0, y: 0 },
    { x: 0.67, y: 0 },
    { x: 0.67, y: 0 }
  ],
  ㅓ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅕ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅗ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅛ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅜ: [
    { x: 0, y: 0 },
    { x: 0, y: 0.67 }
  ],
  ㅠ: [
    { x: 0, y: 0 },
    { x: 0, y: 0.67 },
    { x: 0, y: 0.67 }
  ],
  ㅡ: [{ x: 0, y: 0 }],
  ㅣ: [{ x: 0, y: 0 }],
  ㅐ: [
    { x: 0, y: 0 },
    { x: 0.6, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅔ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅒ: [
    { x: 0, y: 0 },
    { x: 0.67, y: 0 },
    { x: 0.67, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅖ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅘ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0.67, y: 0 }
  ],
  ㅙ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0.67, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅚ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅝ: [
    { x: 0, y: 0 },
    { x: 0, y: 0.67 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅞ: [
    { x: 0, y: 0 },
    { x: 0, y: 0.67 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅟ: [
    { x: 0, y: 0 },
    { x: 0, y: 0.67 },
    { x: 0, y: 0 }
  ],
  ㅢ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㄳ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㄵ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0.33, y: 0.33 }
  ],
  ㄶ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㄺ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 0 }
  ],
  ㄻ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 }
  ],
  ㄼ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 0 }
  ],
  ㄽ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 0.33, y: 0.33 }
  ],
  ㄾ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 }
  ],
  ㄿ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 0, y: 0.67 },
    { x: 0, y: 0.67 },
    { x: 0, y: 0 }
  ],
  ㅀ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ],
  ㅄ: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
    { x: 0.33, y: 0.33 }
  ]
}, wn = (r, e, t) => {
  const n = r[0] - e.x, s = r[1] - e.y, o = t.x - e.x, a = t.y - e.y, i = n * o + s * a, c = o * o + a * a;
  let l = -1;
  c !== 0 && (l = i / c);
  let u, d;
  l < 0 ? (u = e.x, d = e.y) : l > 1 ? (u = t.x, d = t.y) : (u = e.x + l * o, d = e.y + l * a);
  const f = r[0] - u, h = r[1] - d;
  return Math.sqrt(f * f + h * h);
};
class Jt {
  constructor(e, t, n, s = 1) {
    this.charIndex = 0, this._tolerance = e, this.currentChar = t, this.strokeNum = n, this.widthPerChar = y.canvas.width / s;
  }
  setCurrentChar(e) {
    this.currentChar = e;
  }
  setStrokeNum(e) {
    this.strokeNum = e;
  }
  // 좌표를 자모 인덱스에 따라 조정하는 새로운 유틸리티 메서드
  adjustCoordinateForChar(e) {
    const t = this.charIndex * this.widthPerChar;
    return [e[0] - t, e[1]];
  }
  findNearestPointIndex(e, t) {
    let n = 1 / 0, s = 0;
    return e.forEach((o, a) => {
      const i = Math.hypot(o[0] - t.x, o[1] - t.y);
      i < n && (n = i, s = a);
    }), s;
  }
  checkStartPoint(e, t, n, s, o) {
    const a = e[0], i = {
      x: t.x + this.charIndex * this.widthPerChar,
      y: t.y
    };
    let c = i, l = { x: 0, y: 0 };
    if (s && o !== void 0) {
      const h = vt[s];
      console.log("Offsets found:", { currentChar: s, strokeNum: o, offsets: h }), h != null && h[o - 1] && (l = h[o - 1], console.log("Found offset:", l));
    }
    if (l.x !== 0 || l.y !== 0) {
      const h = y.startPoint.radius * 2, p = {
        x: i.x + l.x * h,
        // adjustedStartPoint 사용
        y: i.y + l.y * h
      }, m = wn(
        a,
        i,
        // 조정된 시작점
        p
      ), g = m < (n || this._tolerance);
      return console.log("시작점 평가 상세정보:", {
        문자: s,
        획번호: o,
        오프셋적용여부: !0,
        오프셋: {
          x: l.x,
          y: l.y,
          실제거리_x: l.x * h,
          실제거리_y: l.y * h
        },
        좌표: {
          시작: [a[0], a[1]],
          기준선: {
            시작: [i.x, i.y],
            끝: [p.x, p.y]
          }
        },
        거리: {
          선까지의거리: m,
          허용: n || this._tolerance,
          차이: (n || this._tolerance) - m
        },
        결과: g ? "성공" : "실패"
      }), g;
    }
    const u = Math.hypot(
      a[0] - c.x,
      a[1] - c.y
    ), d = n || this._tolerance, f = u < d;
    return console.log("시작점 평가 상세정보:", {
      문자: s,
      획번호: o,
      오프셋적용여부: !1,
      오프셋: {
        x: l.x,
        y: l.y,
        실제거리_x: l.x * y.startPoint.radius * 2,
        실제거리_y: l.y * y.startPoint.radius * 2
      },
      좌표: {
        시작: [a[0], a[1]],
        기준: [c.x, c.y],
        원래기준: [t.x, t.y]
      },
      거리: {
        실제: u,
        허용: d,
        차이: d - u
      },
      결과: f ? "성공" : "실패"
    }), f;
  }
  checkMiddlePoint(e, t, n) {
    const o = e.map((a) => [
      a[0] - this.charIndex * this.widthPerChar,
      a[1]
    ]).some(
      (a) => Math.hypot(a[0] - t.x, a[1] - t.y) < (n || this._tolerance)
    );
    return console.log("중간점 평가:", {
      기준좌표: [t.x, t.y],
      tolerance: n || this._tolerance,
      통과여부: o
    }), o;
  }
  checkEndPoint(e, t, n) {
    const s = e[e.length - 1], o = [
      s[0] - this.charIndex * this.widthPerChar,
      s[1]
    ], a = Math.hypot(
      o[0] - t.x,
      o[1] - t.y
    ) < (n || this._tolerance);
    return console.log("끝점 평가:", {
      실제좌표: [o[0], o[1]],
      기준좌표: [t.x, t.y],
      거리: Math.hypot(s[0] - t.x, s[1] - t.y),
      tolerance: n || this._tolerance,
      통과여부: a
    }), a;
  }
  checkPathDeviation(e, t, n, s, o, a, i) {
    console.log("PathDeviation 평가 시작:", {
      시작점: t,
      중간점: i,
      끝점: n,
      점개수: e.length,
      문자정보: {
        문자: o,
        획번호: a
      }
    });
    const c = s || this._tolerance;
    let l = t;
    if (o && a !== void 0) {
      const u = vt[o];
      if (u != null && u[a - 1]) {
        const d = u[a - 1];
        if (d.x !== 0 || d.y !== 0) {
          const f = y.startPoint.radius * 2;
          l = {
            x: t.x + d.x * f,
            y: t.y + d.y * f
          };
        }
      }
    }
    for (let u = 1; u < e.length - 1; u++)
      if (wn(e[u], l, n) > c * 1.5)
        return !1;
    return !0;
  }
  calculateStrokeLength(e) {
    let t = 0;
    for (let n = 1; n < e.length; n++)
      t += Math.hypot(
        e[n][0] - e[n - 1][0],
        e[n][1] - e[n - 1][1]
      );
    return t;
  }
  normalizeAngle(e) {
    for (; e > Math.PI; ) e -= 2 * Math.PI;
    for (; e < -Math.PI; ) e += 2 * Math.PI;
    return e;
  }
  checkCircularityEllipse(e, t, n, s, o) {
    const a = e.every((l) => {
      const u = Math.hypot(
        (l[0] - t.x) / n,
        (l[1] - t.y) / s
      );
      return Math.abs(u - 1) < (o || this._tolerance) / Math.min(n, s);
    });
    let i = null, c = 0;
    for (let l = 1; l < e.length; l++) {
      const u = Math.atan2(
        (e[l][1] - t.y) / s,
        (e[l][0] - t.x) / n
      );
      if (i !== null) {
        const d = this.normalizeAngle(u - i);
        if (Math.abs(d) > Math.PI / 3)
          return !1;
        c += d;
      }
      i = u;
    }
    return a && Math.abs(c) >= Math.PI * 1.33;
  }
  checkCurveDeviation(e, t, n, s, o) {
    let a = 0, i = 0;
    for (let u = 0; u < e.length; u++) {
      const d = e[u];
      let f = 1 / 0;
      for (let h = 0; h <= 1; h += 0.02) {
        const p = this.getBezierPoint(t, n, s, h), m = Math.hypot(
          d[0] - p.x,
          d[1] - p.y
        );
        f = Math.min(f, m);
      }
      a = Math.max(a, f), f > (o || this._tolerance) * 1.5 && i++;
    }
    const c = (o || this._tolerance) * 2, l = 0.2;
    return console.log("Curve deviation check:", {
      maxDeviation: a,
      maxDeviationAllowed: c,
      deviationPoints: i,
      totalPoints: e.length,
      deviationRatio: i / e.length
    }), a <= c && i / e.length < l;
  }
  getBezierPoint(e, t, n, s) {
    const o = Math.pow(1 - s, 2) * e.x + 2 * (1 - s) * s * t.x + Math.pow(s, 2) * n.x, a = Math.pow(1 - s, 2) * e.y + 2 * (1 - s) * s * t.y + Math.pow(s, 2) * n.y;
    return { x: o, y: a };
  }
  // 타입별 평가 메서드
  evaluateLine(e, t, n) {
    let s = { x: 0, y: 0 }, o = !1, a = {
      start: t.start,
      end: t.middle || t.end
    };
    if (this.currentChar && this.strokeNum !== void 0) {
      const i = vt[this.currentChar];
      if (i != null && i[this.strokeNum - 1] && (s = i[this.strokeNum - 1], s.x !== 0 || s.y !== 0)) {
        o = !0;
        const c = y.startPoint.radius * 2;
        a.start = {
          x: t.start.x + s.x * c,
          y: t.start.y + s.y * c
        };
      }
    }
    if (console.log("Effective path calculation:", {
      currentChar: this.currentChar,
      strokeNum: this.strokeNum,
      offsetApplied: o,
      offsetInfo: s,
      originalStart: t.start,
      effectiveStart: a.start
    }), t.middle) {
      const i = this.checkStartPoint(
        e,
        t.start,
        void 0,
        this.currentChar,
        this.strokeNum
      ), c = this.checkMiddlePoint(e, t.middle), l = this.checkEndPoint(e, t.end), u = this.findNearestPointIndex(e, t.middle), d = e.slice(0, u + 1), f = e.slice(u), h = this.checkPathDeviation(
        d,
        a.start,
        // 수정된 부분
        t.middle,
        this._tolerance,
        this.currentChar,
        this.strokeNum
      ), p = this.checkPathDeviation(
        f,
        t.middle,
        t.end,
        this._tolerance
      );
      return console.log("Line 평가 상세정보:", {
        문자: this.currentChar,
        획번호: this.strokeNum,
        오프셋적용여부: o,
        오프셋: {
          x: s.x,
          y: s.y,
          실제거리_x: s.x * y.startPoint.radius * 2,
          실제거리_y: s.y * y.startPoint.radius * 2
        },
        경로: {
          시작점: [a.start.x, a.start.y],
          중간점: [t.middle.x, t.middle.y],
          끝점: [t.end.x, t.end.y]
        },
        평가결과: {
          시작점: i,
          중간점: c,
          끝점: l,
          첫번째경로: h,
          두번째경로: p,
          정확도: this._tolerance
        }
      }), {
        startOk: i && !n,
        middleOk: c && !n,
        endOk: l && !n,
        firstPathOk: h && !n,
        secondPathOk: p && !n
      };
    } else {
      const i = this.checkStartPoint(
        e,
        t.start,
        void 0,
        this.currentChar,
        this.strokeNum
      ), c = this.checkEndPoint(e, t.end), l = this.checkPathDeviation(
        e,
        a.start,
        // 수정된 부분
        t.end,
        this._tolerance,
        this.currentChar,
        this.strokeNum
      );
      return console.log("Line 평가 상세정보:", {
        문자: this.currentChar,
        획번호: this.strokeNum,
        오프셋적용여부: o,
        오프셋: {
          x: s.x,
          y: s.y,
          실제거리_x: s.x * y.startPoint.radius * 2,
          실제거리_y: s.y * y.startPoint.radius * 2
        },
        경로: {
          시작점: [a.start.x, a.start.y],
          끝점: [t.end.x, t.end.y]
        },
        평가결과: {
          시작점: i,
          끝점: c,
          경로: l,
          정확도: this._tolerance
        }
      }), {
        startOk: i && !n,
        middleOk: !0,
        endOk: c && !n,
        firstPathOk: l && !n,
        secondPathOk: !0
      };
    }
  }
  evaluateCircle(e, t, n) {
    const s = this.checkStartPoint(
      e,
      t.start,
      this._tolerance * 1
    ), o = Math.hypot(
      e[e.length - 1][0] - e[0][0],
      e[e.length - 1][1] - e[0][1]
    ) < this._tolerance * 1.5, a = e.some((b) => Math.hypot(
      (b[0] - t.center.x) / t.radiusX,
      (b[1] - t.center.y) / t.radiusY
    ) > 0.4), i = this.calculateStrokeLength(e), l = 2 * Math.PI * Math.min(t.radiusX, t.radiusY) * 0.8, u = e.every((b) => {
      const j = Math.hypot(
        (b[0] - t.center.x) / t.radiusX,
        (b[1] - t.center.y) / t.radiusY
      );
      return Math.abs(j - 1) < this._tolerance * 1.1 / Math.min(t.radiusX, t.radiusY);
    });
    let d = null, f = 0, h = 0, p = e[0], m = 0;
    for (let b = 0; b < e.length; b++) {
      const j = e[b], S = Math.hypot(
        j[0] - p[0],
        j[1] - p[1]
      );
      m = Math.max(m, S);
      const A = Math.atan2(
        j[1] - t.center.y,
        j[0] - t.center.x
      );
      if (d !== null) {
        const W = this.normalizeAngle(A - d);
        f += Math.abs(W), Math.abs(W) > h && (h = Math.abs(W));
      }
      d = A, p = j;
    }
    const g = Math.PI * 1.5, k = Math.abs(f) >= g, x = m < this._tolerance * 2, w = h < Math.PI / 4;
    console.log("Circle evaluation details:", {
      startOk: s,
      endOk: o,
      hasMinSize: a,
      strokeLength: i,
      minRequiredLength: l,
      radiusOk: u,
      angleChanges: f,
      completionThreshold: g,
      isComplete: k,
      maxAngleGap: h,
      maxPointGap: m,
      isContinuous: x,
      hasNaturalFlow: w,
      isDrawingBroken: n
    });
    const Y = i >= l && u && !n && x && w;
    return {
      startOk: s && !n,
      middleOk: a && !n,
      endOk: o && !n,
      firstPathOk: Y,
      secondPathOk: k && o && !n
    };
  }
  evaluateQuadratic(e, t, n) {
    const s = this.checkStartPoint(
      e,
      t.start,
      void 0,
      this.currentChar,
      this.strokeNum
    ), o = this.checkEndPoint(e, t.end);
    let a = t.start;
    if (this.currentChar && this.strokeNum !== void 0) {
      const f = vt[this.currentChar];
      if (f != null && f[this.strokeNum - 1]) {
        const h = f[this.strokeNum - 1];
        if (h.x !== 0 || h.y !== 0) {
          const p = y.startPoint.radius * 2;
          a = {
            x: t.start.x + h.x * p,
            y: t.start.y + h.y * p
          };
        }
      }
    }
    const i = this.checkCurveDeviation(
      e,
      a,
      t.control,
      t.end,
      this._tolerance
    ), c = this.calculateStrokeLength(e), l = Math.hypot(
      a.x - t.end.x,
      a.y - t.end.y
    ), u = l * 0.8, d = c >= u;
    return console.log("곡선 길이 체크:", {
      실제길이: c,
      직선거리: l,
      최소필요길이: u,
      통과여부: d,
      곡선검사: i
    }), {
      startOk: s && !n,
      middleOk: !0,
      endOk: o && !n,
      firstPathOk: i && d && !n,
      secondPathOk: !0
    };
  }
  evaluatePath(e, t, n) {
    const s = t.start, o = t.middle || {
      x: t.commands[1].x,
      y: t.commands[1].y
    }, a = t.end;
    console.log("Path evaluation points:", {
      start: s,
      middle: o,
      end: a
    });
    const i = this.checkStartPoint(e, s), c = this.checkMiddlePoint(e, o), l = this.checkEndPoint(e, a), u = this.findNearestPointIndex(e, o), d = e.slice(0, u + 1), f = this.checkPathDeviation(
      d,
      s,
      o,
      this._tolerance * 1.2
    ), h = e.slice(u), p = this.calculateStrokeLength(h), m = Math.hypot(
      a.x - o.x,
      a.y - o.y
    ), g = m * 0.8, k = 0.8 - this._tolerance / 100, x = p >= g * k;
    console.log("Curve length evaluation:", {
      curveLength: p,
      directLength: m,
      expectedCurveLength: g,
      minLengthRatio: k,
      requiredLength: g * k,
      hasSufficientCurve: x
    });
    let w = 0;
    for (let b = 1; b < h.length; b++) {
      const j = Math.hypot(
        h[b][0] - h[b - 1][0],
        h[b][1] - h[b - 1][1]
      );
      w = Math.max(w, j);
    }
    const Y = w < this._tolerance * 2, $ = a && this.checkCurveDeviation(
      h,
      o,
      t.commands[2].control,
      a,
      this._tolerance * 1.2
    ) && x && h.length > e.length * 0.3 && Y && // 곡선 연속성 조건 추가
    !n;
    return console.log("Path evaluation results:", {
      pathStartOk: i,
      splitPointOk: c,
      endPointOk: l,
      straightPathOk: f,
      curveOk: $,
      straightPartLength: d.length,
      curvePartLength: h.length,
      curveLength: p,
      expectedCurveLength: g,
      hasSufficientCurve: x,
      maxGap: w,
      isCurveContinuous: Y,
      isDrawingBroken: n
    }), {
      startOk: i && !n,
      middleOk: c && !n,
      endOk: l && !n,
      firstPathOk: f && !n,
      secondPathOk: $ && !n
    };
  }
  // private findNearestPointIndex(points: Array<[number, number]>, target: Point): number {
  //   let minDist = Infinity;
  //   let minIndex = 0;
  //   points.forEach((point, index) => {
  //     const dist = Math.hypot(point[0] - target.x, point[1] - target.y);
  //     if (dist < minDist) {
  //       minDist = dist;
  //       minIndex = index;
  //     }
  //   });
  //   return minIndex;
  // }
}
class yr {
  constructor(e) {
    this.canvas = e, this.ctx = e.getContext("2d"), this.historyCanvas = document.createElement("canvas"), this.historyCanvas.width = e.width, this.historyCanvas.height = e.height, this.historyCtx = this.historyCanvas.getContext("2d");
  }
  drawRect(e) {
    this.ctx.save(), this.ctx.strokeStyle = "yellow", this.ctx.lineWidth = 1, this.ctx.strokeRect(e.x + 2, e.y + 2, e.w - 4, e.h - 4), this.ctx.restore();
  }
  // Core drawing methods
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawStartPoint(e, t, n) {
    this.ctx.fillStyle = y.startPoint.color, this.ctx.beginPath(), this.ctx.arc(e, t, y.startPoint.radius, 0, Math.PI * 2), this.ctx.fill();
    const s = Math.max(12, Math.floor(y.startPoint.radius * 1.2));
    this.ctx.fillStyle = y.startPoint.textColor, this.ctx.font = `${s}px Arial`, this.ctx.textAlign = "center", this.ctx.textBaseline = "middle", this.ctx.fillText(n.toString(), e, t);
  }
  drawEndPoint(e, t) {
    this.ctx.save(), this.ctx.fillStyle = y.startPoint.color, this.ctx.beginPath(), this.ctx.arc(e, t, y.startPoint.radius * 0.5, 0, Math.PI * 2), this.ctx.fill(), this.ctx.restore();
  }
  drawStrokePath(e) {
    this.ctx.save(), this.ctx.strokeStyle = y.paths.background.color, this.ctx.lineWidth = y.paths.guide.width + y.paths.background.widthOffset, this.ctx.lineCap = "round", this.ctx.lineJoin = "round", this.drawPathDetails(e), this.ctx.stroke(), this.ctx.strokeStyle = y.paths.guide.color, this.ctx.lineWidth = y.paths.guide.width, this.ctx.setLineDash(y.paths.guide.dash), this.drawPathDetails(e), this.ctx.stroke(), this.ctx.restore();
  }
  drawPathDetails(e) {
    for (let t = 1; t <= Object.keys(e).length; t++) {
      const n = e[`stroke${t}`];
      if (n) {
        if (this.ctx.save(), this.ctx.beginPath(), n.type === "circle") {
          this.ctx.ellipse(
            n.center.x,
            n.center.y,
            n.radiusX,
            n.radiusY,
            0,
            0,
            Math.PI * 2
          );
          continue;
        } else
          switch (this.ctx.moveTo(n.start.x, n.start.y), n.type) {
            case "quadratic":
              this.ctx.quadraticCurveTo(
                n.control.x,
                n.control.y,
                n.end.x,
                n.end.y
              );
              break;
            case "path":
              this.drawCommandPath(n.commands);
              break;
            default:
              n.middle && this.ctx.lineTo(n.middle.x, n.middle.y), this.ctx.lineTo(n.end.x, n.end.y);
          }
        this.ctx.stroke();
      }
    }
  }
  drawCommandPath(e) {
    e.forEach((t) => {
      switch (t.type) {
        case "M":
          this.ctx.moveTo(t.x ?? 0, t.y ?? 0);
          break;
        case "L":
          this.ctx.lineTo(t.x ?? 0, t.y ?? 0);
          break;
        case "Q":
          t.control && t.end && this.ctx.quadraticCurveTo(
            t.control.x,
            t.control.y,
            t.end.x,
            t.end.y
          );
          break;
      }
    });
  }
  // User stroke methods
  drawUserStroke(e) {
    if (!(e.length < 2)) {
      this.ctx.beginPath(), this.ctx.setLineDash([]), this.ctx.moveTo(e[0][0], e[0][1]);
      for (let t = 1; t < e.length; t++)
        this.ctx.lineTo(e[t][0], e[t][1]);
      this.ctx.stroke();
    }
  }
  addStrokeToHistory(e) {
    this.historyCtx.strokeStyle = y.animation.pathColor, this.historyCtx.lineWidth = y.paths.drawing.width, this.historyCtx.lineCap = y.paths.drawing.cap, this.historyCtx.lineJoin = y.paths.drawing.join, this.historyCtx.beginPath();
    const t = e[0];
    this.historyCtx.moveTo(t[0], t[1]);
    for (let n = 1; n < e.length; n++) {
      const s = e[n];
      this.historyCtx.lineTo(s[0], s[1]);
    }
    this.historyCtx.stroke();
  }
  // drawHistory() {
  //   this.ctx.drawImage(this.historyCanvas, 0, 0)
  //   console.log('Drawing history:', {
  //     historyCanvas: this.historyCanvas,
  //     mainCanvas: this.canvas,
  //     historyContext: this.historyCtx,
  //     mainContext: this.ctx
  //   })
  // }
  drawHistory() {
    this.ctx.drawImage(this.historyCanvas, 0, 0);
  }
  // Canvas size management
  updateCanvasSize(e, t) {
    this.canvas.width = e, this.canvas.height = t, this.historyCanvas.width = e, this.historyCanvas.height = t;
  }
  drawLineWithArrow(e, t, n, s, o) {
    this.ctx.beginPath(), this.ctx.moveTo(e, t), this.ctx.lineTo(n, s), this.ctx.stroke(), this.drawArrow(n, s, o);
  }
  // Animation methods
  drawArrow(e, t, n) {
    const s = y.animation.arrowSize * 2;
    this.ctx.save(), this.ctx.translate(e, t), this.ctx.rotate(n), this.ctx.fillStyle = y.animation.arrowColor, this.ctx.beginPath(), this.ctx.moveTo(0, 0), this.ctx.lineTo(-s * 2, -s), this.ctx.lineTo(-s * 1.5, 0), this.ctx.lineTo(-s * 2, s), this.ctx.closePath(), this.ctx.fill(), this.ctx.restore();
  }
  getAngle(e, t, n, s) {
    return Math.atan2(s - t, n - e);
  }
  setAnimationStyle(e) {
    this.ctx.save(), this.ctx.strokeStyle = e, this.ctx.lineWidth = y.paths.drawing.width, this.ctx.lineCap = "round", this.ctx.lineJoin = "round", this.ctx.setLineDash([]);
  }
  drawCompleteLine(e, t, n, s) {
    this.ctx.beginPath(), this.ctx.moveTo(e, t), this.ctx.lineTo(n, s), this.ctx.stroke();
  }
  drawCircle(e, t, n, s, o, a) {
    this.ctx.beginPath(), this.ctx.ellipse(
      e,
      t,
      n,
      s,
      0,
      o,
      a,
      !0
    ), this.ctx.stroke();
  }
  drawQuadraticCurve(e, t, n, s, o, a) {
    this.ctx.beginPath(), this.ctx.moveTo(e, t), this.ctx.quadraticCurveTo(n, s, o, a), this.ctx.stroke();
  }
  restoreContext() {
    this.ctx.restore();
  }
  drawStrokes(e, t) {
    const n = t ?? Object.keys(e).length;
    this.ctx.save(), this.ctx.strokeStyle = y.paths.drawing.color, this.ctx.lineWidth = y.paths.drawing.width, this.ctx.lineCap = y.paths.drawing.cap, this.ctx.lineJoin = y.paths.drawing.join;
    for (let s = 1; s <= n; s++) {
      const o = e[`stroke${s}`];
      if (o)
        switch (o.type) {
          case "circle":
            this.drawCircle(
              o.center.x,
              o.center.y,
              o.radiusX,
              o.radiusY,
              0,
              Math.PI * 2
            );
            break;
          case "quadratic":
            this.drawQuadraticCurve(
              o.start.x,
              o.start.y,
              o.control.x,
              o.control.y,
              o.end.x,
              o.end.y
            );
            break;
          case "path":
            o.commands && (this.drawCompleteLine(
              o.commands[0].x,
              o.commands[0].y,
              o.commands[1].x,
              o.commands[1].y
            ), o.commands[2] && this.drawQuadraticCurve(
              o.commands[1].x,
              o.commands[1].y,
              o.commands[2].control.x,
              o.commands[2].control.y,
              o.commands[2].end.x,
              o.commands[2].end.y
            ));
            break;
          default:
            o.middle ? (this.drawCompleteLine(
              o.start.x,
              o.start.y,
              o.middle.x,
              o.middle.y
            ), this.drawCompleteLine(
              o.middle.x,
              o.middle.y,
              o.end.x,
              o.end.y
            )) : this.drawCompleteLine(
              o.start.x,
              o.start.y,
              o.end.x,
              o.end.y
            );
        }
    }
    this.ctx.restore();
  }
  restore() {
    this.ctx.restore();
  }
}
class no {
  constructor() {
    this.correctSound = null, this.initAudio();
  }
  initAudio() {
    this.correctSound = new Audio(
      "https://kr.object.ncloudstorage.com/tesis/media/correct.mp3"
    ), document.addEventListener(
      "touchstart",
      () => {
        this.correctSound && (this.correctSound.load(), this.correctSound.play().then(() => {
          var e;
          (e = this.correctSound) == null || e.pause(), this.correctSound && (this.correctSound.currentTime = 0);
        }).catch((e) => {
          console.log("오디오 초기화 실패:", e);
        }));
      },
      { once: !0 }
    );
  }
  playSound() {
    this.correctSound && (this.correctSound.currentTime = 0, this.correctSound.play().catch((e) => {
      console.error("오디오 재생 실패:", e);
    }));
  }
}
class ne {
  constructor(e, t, n, s) {
    this._x = e, this.y = t, this.w = n, this.h = s;
  }
  get x() {
    return this._x;
  }
  setX(e) {
    this._x = e;
  }
}
class Ie extends ne {
  constructor() {
    super(0, 0, 0, 0);
  }
}
class v {
  //
  constructor(e, t, n, s, o) {
    this.offsetX = e, this.offsetY = t, this.width = n, this.height = s, this.coords = o;
  }
}
class _ {
  constructor(e) {
    this.regions = e;
  }
  getRect(e, t) {
    return this.regions.map(
      (n) => new ne(
        n.offsetX * e,
        n.offsetY * t,
        n.width * e,
        n.height * t
      )
    );
  }
}
const en = class en {
  static resolvePattern(e) {
    if (e.length === 1)
      return new mr();
    const [t, n, s] = e, o = s === "_";
    for (const [a, i] of Object.entries(this.PATTERN_MAP.simple))
      if (this.includesAny(n, a)) {
        const c = o ? i.empty : i.filled;
        return console.log("simple ", c), this.createPattern(c);
      }
    for (const [a, i] of Object.entries(this.PATTERN_MAP.complex))
      if (this.includesAny(n, a)) {
        const c = this.findMatchingRule(i.rules, t, s, o);
        if (c) {
          const l = o ? c.empty : c.filled;
          return console.log("complex ", l), this.createPattern(l);
        }
      }
    throw new Error(`Unable to resolve pattern for jamos: ${e.join(",")}`);
  }
  static includesAny(e, t) {
    return t.split(",").includes(e);
  }
  static findMatchingRule(e, t, n, s) {
    for (const o of e)
      if (o.cho === "*" || o.cho && this.includesAny(t, o.cho) || o.jong && !s && this.includesAny(n, o.jong))
        return o;
    return null;
  }
  static createPattern(e) {
    const t = Or[e];
    if (!t)
      throw new Error(`Pattern class not found: ${e}`);
    return new t();
  }
};
en.PATTERN_MAP = {
  simple: {
    "ㅏ,ㅑ,ㅣ": { empty: "Pattern20", filled: "Pattern30" },
    "ㅓ,ㅕ": { empty: "Pattern21", filled: "Pattern31" },
    "ㅐ,ㅒ": { empty: "Pattern25", filled: "Pattern35" },
    "ㅔ,ㅖ": { empty: "Pattern26", filled: "Pattern36" }
  },
  complex: {
    "ㅗ,ㅛ": {
      rules: [
        { cho: "ㄱ,ㅋ", empty: "Pattern221", filled: "Pattern321" },
        { cho: "ㅅ,ㅈ,ㅊ", empty: "Pattern222", filled: "Pattern322" },
        { cho: "ㅎ", empty: "Pattern223", filled: "Pattern323" },
        { cho: "*", empty: "Pattern22", filled: "Pattern32" }
      ]
    },
    "ㅜ,ㅠ": {
      rules: [
        { cho: "*", jong: "*", empty: "Pattern23", filled: "Pattern33" },
        {
          cho: "*",
          jong: "ㄴ,ㅂ,ㅅ,ㅆ",
          empty: "Pattern23",
          filled: "Pattern331"
        }
      ]
    },
    ㅡ: {
      rules: [
        { cho: "ㄱ,ㅋ", jong: "*", empty: "Pattern241", filled: "Pattern34" },
        {
          cho: "ㄱ,ㅋ",
          jong: "ㄹ,ㅂ,ㅊ,ㅎ",
          empty: "Pattern241",
          filled: "Pattern341"
        },
        { cho: "ㅅ,ㅈ", jong: "*", empty: "Pattern242", filled: "Pattern34" },
        {
          cho: "ㅅ,ㅈ",
          jong: "ㄹ,ㅂ,ㅊ,ㅎ",
          empty: "Pattern242",
          filled: "Pattern341"
        },
        {
          cho: "ㄹ,ㅂ,ㅊ,ㅎ",
          jong: "*",
          empty: "Pattern243",
          filled: "Pattern342"
        },
        { cho: "ㄹ,ㅂ,ㅊ,ㅎ", jong: "ㄹ,ㅂ,ㅊ,ㅎ", filled: "Pattern343" },
        { cho: "*", jong: "*", empty: "Pattern24", filled: "Pattern34" },
        {
          cho: "*",
          jong: "ㄹ,ㅂ,ㅊ,ㅎ",
          empty: "Pattern24",
          filled: "Pattern341"
        }
      ]
    },
    "ㅘ,ㅙ": {
      rules: [
        {
          cho: "ㄱ,ㅋ,ㄲ,ㅅ,ㅆ,ㅈ,ㅈ,ㅊ,ㅎ",
          empty: "Pattern272",
          filled: "Pattern372"
        },
        { cho: "*", empty: "Pattern271", filled: "Pattern371" }
      ]
    },
    "ㅚ,ㅢ": {
      rules: [
        {
          cho: "ㄱ,ㅋ,ㄲ,ㅅ,ㅆ,ㅈ,ㅈ,ㅊ,ㅎ",
          empty: "Pattern274",
          filled: "Pattern374"
        },
        { cho: "*", empty: "Pattern273", filled: "Pattern373" }
      ]
    },
    "ㅝ,ㅟ": {
      rules: [
        {
          cho: "ㄱ,ㅋ,ㄲ,ㅅ,ㅆ,ㅈ,ㅈ,ㅊ,ㅎ",
          empty: "Pattern281",
          filled: "Pattern381"
        },
        { cho: "*", empty: "Pattern28", filled: "Pattern38" }
      ]
    },
    ㅞ: {
      rules: [
        {
          cho: "ㄱ,ㅋ,ㄲ,ㅅ,ㅆ,ㅈ,ㅈ,ㅊ,ㅎ",
          empty: "Pattern291",
          filled: "Pattern391"
        },
        { cho: "*", empty: "Pattern29", filled: "Pattern39" }
      ]
    }
  }
};
let re = en;
class mr extends _ {
  constructor() {
    super([new v(0, 0, 1, 1)]);
  }
  get count() {
    return 1;
  }
}
class ro extends _ {
  constructor() {
    super([
      new v(0.02, 0.05, 0.65, 0.9),
      new v(0.5, 0, 0.5, 1)
    ]);
  }
}
class so extends _ {
  constructor() {
    super([
      new v(0.02, 0.05, 0.65, 0.9),
      new v(0.45, 0, 0.5, 1)
    ]);
  }
}
class oo extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.8, 0.75),
      new v(0, 0.45, 1, 0.6)
    ]);
  }
}
class ao extends _ {
  constructor() {
    super([
      new v(0.05, 0, 0.9, 0.85),
      new v(0, 0.32, 1, 0.8)
    ]);
  }
}
class io extends _ {
  constructor() {
    super([
      new v(0.05, 0, 0.9, 0.85),
      new v(0, 0.45, 1, 0.6)
    ]);
  }
}
class co extends _ {
  constructor() {
    super([
      new v(0.05, 0, 0.9, 0.8),
      new v(0, 0.525, 1, 0.5)
    ]);
  }
}
class lo extends _ {
  constructor() {
    super([
      new v(0.1, 0.03, 0.8, 0.6),
      new v(0, 0.25, 1, 1)
    ]);
  }
}
class uo extends _ {
  constructor() {
    super([
      new v(0.1, 0.05, 0.8, 0.65),
      new v(0, 0.375, 1, 0.8)
    ]);
  }
}
class fo extends _ {
  constructor() {
    super([
      new v(0.1, 0.05, 0.825, 0.75),
      new v(0, 0.375, 1, 0.8)
    ]);
  }
}
class ho extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.8, 0.75),
      new v(0, 0.375, 1, 0.8)
    ]);
  }
}
class vo extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.8, 0.8),
      new v(0, 0.375, 1, 0.8)
    ]);
  }
}
class po extends _ {
  constructor() {
    super([
      new v(0.02, 0.05, 0.6, 0.9),
      new v(0.4, 0, 0.65, 1)
    ]);
  }
}
class yo extends _ {
  constructor() {
    super([
      new v(0.02, 0.05, 0.6, 0.9),
      new v(0.3, 0, 0.8, 1)
    ]);
  }
}
class mo extends _ {
  constructor() {
    super([new v(0.05, 0.08, 0.65, 0.6), new v(0, 0, 1, 1)]);
  }
}
class xo extends _ {
  constructor() {
    super([new v(0.05, 0.03, 0.65, 0.7), new v(0, 0, 1, 1)]);
  }
}
class go extends _ {
  constructor() {
    super([new v(0.1, 0.08, 0.65, 0.6), new v(0, 0, 1, 1)]);
  }
}
class _o extends _ {
  constructor() {
    super([new v(0.1, 0.03, 0.65, 0.7), new v(0, 0, 1, 1)]);
  }
}
class ko extends _ {
  constructor() {
    super([new v(0.12, 0.08, 0.6, 0.5), new v(0, 0, 1, 1)]);
  }
}
class bo extends _ {
  constructor() {
    super([new v(0.12, 0.05, 0.6, 0.55), new v(0, 0, 1, 1)]);
  }
}
class wo extends _ {
  constructor() {
    super([new v(0.05, 0.08, 0.6, 0.5), new v(0, 0, 1, 1)]);
  }
}
class Po extends _ {
  constructor() {
    super([new v(0.05, 0.08, 0.6, 0.5), new v(0, 0, 1, 1)]);
  }
}
class So extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.6, 0.65),
      new v(0.5, 0, 0.5, 0.65),
      new v(0.1, 0.55, 0.8, 0.45)
    ]);
  }
}
class Co extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.6, 0.65),
      new v(0.45, 0, 0.5, 0.65),
      new v(0.1, 0.55, 0.8, 0.45)
    ]);
  }
}
class $o extends _ {
  constructor() {
    super([
      new v(0.1, 0.05, 0.8, 0.45),
      new v(0, 0.335, 1, 0.33),
      new v(0.1, 0.55, 0.8, 0.45)
    ]);
  }
}
class jo extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.8, 0.55),
      new v(0, 0.335, 1, 0.33),
      new v(0.1, 0.55, 0.8, 0.45)
    ]);
  }
}
class Mo extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.8, 0.5),
      new v(0, 0.335, 1, 0.33),
      new v(0.1, 0.55, 0.8, 0.45)
    ]);
  }
}
class Eo extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.8, 0.5),
      new v(0, 0.335, 1, 0.33),
      new v(0.1, 0.55, 0.8, 0.45)
    ]);
  }
}
class To extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.8, 0.5),
      new v(0, 0.375, 1, 0.33),
      new v(0.1, 0.55, 0.8, 0.45)
    ]);
  }
}
class Yo extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.8, 0.5),
      new v(0, 0.275, 1, 0.6),
      new v(0.1, 0.55, 0.8, 0.45)
    ]);
  }
}
class Oo extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.8, 0.5),
      new v(0, 0.35, 1, 0.35),
      new v(0.1, 0.55, 0.8, 0.45)
    ]);
  }
}
class No extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.8, 0.5),
      new v(0, 0.325, 1, 0.35),
      new v(0.1, 0.5, 0.8, 0.5)
    ]);
  }
}
class Io extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.8, 0.6),
      new v(0, 0.355, 1, 0.35),
      new v(0.1, 0.55, 0.8, 0.45)
    ]);
  }
}
class Lo extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.8, 0.5),
      new v(0, 0.325, 1, 0.35),
      new v(0.1, 0.525, 0.8, 0.5)
    ]);
  }
}
class Ao extends _ {
  constructor() {
    super([
      new v(0.05, 0.05, 0.6, 0.6),
      new v(0.4, 0, 0.65, 0.65),
      new v(0.1, 0.55, 0.9, 0.45)
    ]);
  }
}
class zo extends _ {
  constructor() {
    super([
      new v(0.05, 0.05, 0.6, 0.6),
      new v(0.3, 0, 0.8, 0.7),
      new v(0.1, 0.55, 0.9, 0.45)
    ]);
  }
}
class qo extends _ {
  constructor() {
    super([
      new v(0.05, 0.03, 0.65, 0.5),
      new v(0, 0, 1, 0.7),
      new v(0.05, 0.55, 0.9, 0.45)
    ]);
  }
}
class Ro extends _ {
  constructor() {
    super([
      new v(0.05, 0, 0.65, 0.5),
      new v(0, 0, 1, 0.7),
      new v(0.05, 0.55, 0.9, 0.45)
    ]);
  }
}
class Do extends _ {
  constructor() {
    super([
      new v(0.1, 0.03, 0.65, 0.5),
      new v(0.025, 0, 0.95, 0.7),
      new v(0.05, 0.55, 0.9, 0.45)
    ]);
  }
}
class Xo extends _ {
  constructor() {
    super([
      new v(0.1, 0, 0.6, 0.5),
      new v(0.025, 0, 0.95, 0.7),
      new v(0.05, 0.55, 0.9, 0.45)
    ]);
  }
}
class Fo extends _ {
  constructor() {
    super([
      new v(0.09, 0.02, 0.65, 0.45),
      new v(0.025, 0.02, 0.95, 0.7),
      new v(0.05, 0.6, 0.9, 0.4)
    ]);
  }
}
class Wo extends _ {
  constructor() {
    super([
      new v(0.09, 0.02, 0.65, 0.45),
      new v(0.025, 0.02, 0.95, 0.7),
      new v(0.05, 0.575, 0.9, 0.45)
    ]);
  }
}
class Ho extends _ {
  constructor() {
    super([
      new v(0.05, 0.02, 0.65, 0.4),
      new v(0.025, 0.02, 0.95, 0.7),
      new v(0.05, 0.575, 0.9, 0.45)
    ]);
  }
}
class Uo extends _ {
  constructor() {
    super([
      new v(0.05, 0.02, 0.65, 0.45),
      new v(0.025, 0.02, 0.95, 0.7),
      new v(0.05, 0.575, 0.9, 0.45)
    ]);
  }
}
class xr {
  constructor(e) {
    this.chars = e, this.patterns = e.flatMap((t) => re.resolvePattern(t));
  }
  getRect(e, t) {
    const n = e / this.patterns.length;
    return this.patterns.flatMap((s, o) => {
      const a = s.getRect(n, t);
      for (a.forEach((i) => {
        i.setX(i.x + o * n);
      }); a.length < 3; ) {
        const i = new ne(
          a[0].x,
          // 같은 x 위치 사용
          a[0].y + a[0].h,
          // 마지막 rect 아래에 위치
          a[0].w,
          // 같은 너비 사용
          0
          // 높이는 0으로 설정
        );
        a.push(i);
      }
      return a;
    });
  }
}
class Qo {
  constructor(e) {
    this.canvas = e, this.listeners = [], this.charState = dt.getInstance(), this.currentStroke = [], this.strokeHistory = [], this.isCompleted = !0, this.isDrawingBroken = !1, this.currentStrokeNumber = 1, this._error = !1, this.isDrawing = !1, this.startTime = 0, this.jamos = [], this.rects = [], this._jamoIndex = 0, this._pathes = [], this._strokes = [], this.mode = "jamo", this.currentEvalResult = null, this.drawingService = new yr(e), this.audioService = new no(), this.evaluator = new Jt(
      y.tolerance,
      void 0,
      void 0,
      1
    );
  }
  setPhoneme(e) {
    if (JSON.stringify(this.jamos) === JSON.stringify(e))
      return;
    this.jamos = e;
    const t = re.resolvePattern(e);
    if (t) {
      this.rects = t.getRect(y.canvas.width, y.canvas.height), this.evaluator = new Jt(
        y.tolerance,
        void 0,
        void 0,
        1
      ), this._pathes = this.rects.map(({ x: n, y: s, w: o, h: a }, i) => {
        const c = this.jamos[i], l = this.jamos[i + 1];
        return this.charState.setNextChar(l), It[c].calculateCoords(o, a, n, s);
      }), this._strokes = this.jamos.map((n) => It[n].strokes);
      for (let n = 1; n < this._strokes.length; n++)
        this._strokes[n] += this._strokes[n - 1];
      this.initialize();
    }
  }
  //   private setNextChar(char: Jamo | undefined) {
  //     nextCharValue = char
  //   }
  // Public interface methods
  initialize() {
    const { canvas: e } = this;
    e.width = y.canvas.width, e.height = y.canvas.height, this.resetState(), this.drawingService.clearCanvas(), this.drawPathes(), this.drawStartPoints(), this.startTime = Date.now(), this._jamoIndex = 0;
  }
  setMode(e) {
    this.mode = e.startsWith("jamo") ? "jamo" : e.startsWith("char") ? "char" : "word";
  }
  updateCanvasSize(e) {
    const t = y.canvas.width, n = y.canvas.height, s = e / 600;
    if (this.updateConfigSizes(s), this.mode === "word" && this.rects.length > 0) {
      const i = Math.ceil(this.jamos.length / 3);
      y.canvas.width = e * i, y.canvas.height = e, this.drawingService.updateCanvasSize(e * i, e);
    } else
      y.canvas.width = e, y.canvas.height = e, this.drawingService.updateCanvasSize(e, e);
    if (this.rects.length === 0) {
      this.reinitializeWithState();
      return;
    }
    const o = y.canvas.width / t, a = y.canvas.height / n;
    this.rects = this.rects.map((i) => i instanceof Ie ? i : this.mode === "word" ? new ne(
      i.x * o,
      i.y,
      i.w * o,
      i.h
    ) : new ne(
      i.x * o,
      i.y * a,
      i.w * o,
      i.h * a
    )), this._pathes = this.rects.map((i, c) => {
      const l = this.jamos[c];
      if (l === "_") return null;
      const u = this.jamos[c + 1];
      return this.charState.setNextChar(u), i instanceof Ie ? null : this.calculateCharCoords(l, i);
    }), this.reinitializeWithState();
  }
  reinitializeWithState() {
    const { canvas: e } = this;
    e.width = y.canvas.width, e.height = y.canvas.height, this.drawingService.clearCanvas(), this.drawPathes(), this.drawStartPoints(), this.strokeHistory.length > 0 && this.drawingService.drawHistory();
  }
  updateTolerance(e) {
    y.tolerance = e, this.evaluator = new Jt(e), this.initialize();
  }
  setPattern(e, t) {
    y.canvas.width;
    const n = y.canvas.height;
    this.mode = "word", this.jamos = t.flatMap((a) => a);
    const s = t.length, o = n * s;
    y.canvas.width = o, this.rects = e.getRect(o, y.canvas.height), this.evaluator = new Jt(
      y.tolerance,
      void 0,
      void 0,
      t.length
      // 전체 글자 수 전달
    ), this.setupPathesAndStrokes(), this.reinitializeWithState();
  }
  // Event binding
  bindEventListener(e) {
    const t = { passive: !1 };
    this.canvas.addEventListener(
      "touchstart",
      (n) => this.handleStart(n),
      t
    ), this.canvas.addEventListener(
      "touchmove",
      (n) => this.handleMove(n),
      t
    ), this.canvas.addEventListener("touchend", (n) => this.handleEnd(n), t), this.canvas.addEventListener("mousedown", (n) => this.handleStart(n)), this.canvas.addEventListener("mousemove", (n) => this.handleMove(n)), this.canvas.addEventListener("mouseup", (n) => this.handleEnd(n)), this.canvas.addEventListener("mouseleave", (n) => this.handleEnd(n)), document.addEventListener(
      "touchstart",
      () => {
        window.speechSynthesis && window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
      },
      { once: !0 }
    ), this.updateCanvasSize(500), e && this.listeners.push(e);
  }
  // Event handlers
  handleStart(e) {
    e.preventDefault();
    const t = this.getCoordinates(e);
    console.log("HandleStart coords:", t), console.log("Current jamo index:", this._jamoIndex), console.log("Current jamos:", this.jamos), console.log("Current paths:", this._pathes), console.log("Current CONFIG.tolerance:", y.tolerance), this.isNearStrokeStart(t.x, t.y) && (this._error && (this.drawingService.clearCanvas(), this.drawPathes(), this.drawStartPoints(), this.redrawHistory()), this.drawingService.setAnimationStyle(y.paths.drawing.color), this.isDrawing = !0, this.isDrawingBroken = !1, this.currentStroke = [[t.x, t.y]], this.startTime = Date.now(), this.notifyListeners({
      success: !0,
      stroke: { current: 0, total: this.totalStrokes }
    }));
  }
  handleMove(e) {
    if (e.preventDefault(), !this.isDrawing) return;
    const t = this.getCoordinates(e);
    this.currentStroke.push([t.x, t.y]), this.drawingService.drawUserStroke(this.currentStroke);
  }
  handleEnd(e) {
    if (e.preventDefault(), !this.isDrawing) return;
    const t = this.evaluateStroke();
    this.currentEvalResult = t, console.log("Evaluation result:", t), t.success ? this.handleSuccessfulStroke() : (this._error = !0, this.showFailFeedback()), this.isDrawing = !1, this.currentStroke = [];
  }
  // Helper methods
  updateConfigSizes(e) {
    y.paths.guide.width = Math.max(2, Math.floor(4 * e)), y.paths.drawing.width = Math.max(8, Math.floor(32 * e)), y.paths.background.widthOffset = Math.max(
      15,
      Math.floor(60 * e)
    ), y.startPoint.radius = Math.max(4, Math.floor(15 * e)), y.animation.arrowSize = Math.max(3, Math.floor(12 * e)), y.minStrokeLength = Math.max(25, Math.floor(50 * e));
  }
  setupPathesAndStrokes() {
    this._pathes = this.rects.map((e, t) => {
      const n = this.jamos[t];
      if (n === "_") return null;
      const s = this.jamos[t + 1];
      return this.charState.setNextChar(s), e instanceof Ie ? null : this.calculateCharCoords(n, e);
    }), this._strokes = this.jamos.map(
      (e) => e === "_" ? 0 : this.getStrokeCount(e)
    );
    for (let e = 1; e < this._strokes.length; e++)
      this._strokes[e] += this._strokes[e - 1];
  }
  // private redrawHistory() {
  //   this.strokeHistory.forEach((stroke) =>
  //     this.drawingService.drawUserStroke(stroke)
  //   )
  // }
  redrawHistory() {
    this.drawingService.setAnimationStyle(y.paths.drawing.color), this.strokeHistory.forEach((e) => {
      this.drawingService.drawUserStroke(e);
    }), this.drawingService.restore();
  }
  notifyListeners(e) {
    this.listeners.forEach((t) => t(e));
  }
  // Drawing methods
  drawPathes() {
    this.jamos.length !== 0 && this._pathes.forEach((e, t) => {
      this.drawPath(e, this.jamos[t]);
    });
  }
  drawStartPoints() {
    this._pathes.forEach((e, t) => {
      if (!e) return;
      const n = t === 0 ? 0 : this._strokes[t - 1], s = this.jamos[t];
      if (s === "_" || !s || !(s in vt)) return;
      const o = vt[s];
      if (!o) return;
      const i = y.startPoint.radius * 2;
      o.forEach((c, l) => {
        const u = l + 1, d = e[`stroke${u}`];
        if (!(d != null && d.start)) return;
        const f = d.start.x + c.x * i, h = d.start.y + c.y * i;
        this.drawingService.drawStartPoint(f, h, u + (n || 0));
      });
    });
  }
  drawPath(e, t) {
    if (!e || t === "_") return;
    const n = this.jamos[this._jamoIndex + 1];
    this.charState.setNextChar(n), this.drawingService.drawStrokePath(e), this.drawEndPoints(e, t);
  }
  drawEndPoints(e, t) {
    if (!t) return;
    let n = this.getStrokeCount(t);
    for (let s = 1; s <= n; s++) {
      const o = e[`stroke${s}`];
      o && (o.type === "circle" ? this.drawingService.drawEndPoint(o.start.x, o.start.y) : this.drawingService.drawEndPoint(
        o.end ? o.end.x : o.middle.x,
        o.end ? o.end.y : o.middle.y
      ));
    }
  }
  // State management methods
  resetState() {
    this.isDrawing = !1, this.currentStroke = [], this.strokeHistory = [], this.isCompleted = !1, this.isDrawingBroken = !1, this.currentStrokeNumber = 1, this._error = !1;
  }
  handleSuccessfulStroke() {
    this.strokeHistory.push([...this.currentStroke]), this.drawingService.addStrokeToHistory(this.currentStroke), this.currentStrokeNumber < this.totalStrokes ? this.showRunningFeedback() : (this.isCompleted = this.mode === "jamo" ? this._jamoIndex + 1 === this.jamos.length : !0, this.isCompleted && this.showSuccessFeedback(), this.currentStrokeNumber = 0), this._strokes[this._jamoIndex] === this.currentStrokeNumber && this._jamoIndex++, this.currentStrokeNumber++;
  }
  evaluateStroke() {
    const { currentStroke: e, isDrawingBroken: t } = this;
    if (e.length < 2)
      return {
        success: !1,
        stroke: {
          current: this.currentStrokeNumber,
          total: this.totalStrokes
        }
      };
    if (!this.currentChar) throw new Error("No current character");
    const n = Math.ceil(this.jamos.length / 3);
    this.evaluator = new Jt(
      y.tolerance,
      this.currentChar,
      this.revisedStrokeNum,
      n
    );
    const s = this._pathes[this._jamoIndex], o = s == null ? void 0 : s[`stroke${this.revisedStrokeNum}`];
    if (console.log("Evaluate Stroke Debug:", {
      jamoIndex: this._jamoIndex,
      revisedStrokeNum: this.revisedStrokeNum,
      coords: s,
      currentStrokeCoords: o
    }), !o)
      return {
        success: !1,
        stroke: {
          current: this.currentStrokeNumber,
          total: this.totalStrokes
        }
      };
    this.evaluator.setCurrentChar(this.currentChar), this.evaluator.setStrokeNum(this.revisedStrokeNum);
    let a;
    try {
      return a = this.evaluator[o.type === "circle" ? "evaluateCircle" : o.type === "quadratic" ? "evaluateQuadratic" : o.type === "path" ? "evaluatePath" : "evaluateLine"](e, o, t), {
        success: Object.values(a).every(
          (c) => c === !0
        ),
        stroke: {
          current: this.currentStrokeNumber,
          total: this.totalStrokes,
          type: o.type
          // 획 타입 추가
        },
        detail: a
      };
    } catch (i) {
      return console.error("Stroke evaluation error:", {
        error: i,
        currentChar: this.currentChar,
        strokeNum: this.revisedStrokeNum,
        coords: o
      }), {
        success: !1,
        stroke: {
          current: this.currentStrokeNumber,
          total: this.totalStrokes
        }
      };
    }
  }
  isNearStrokeStart(e, t) {
    if (console.log("isNearStrokeStart called:", { x: e, y: t }), console.log("Current char:", this.currentChar), console.log("Current stroke number:", this.revisedStrokeNum), console.log("Current tolerance:", y.tolerance), !this.currentChar) return !1;
    const n = y.tolerance, o = y.startPoint.radius * 2;
    let a = this.revisedStrokeNum, i = this.jamos[this._jamoIndex], c = this._pathes[this._jamoIndex];
    for (; i === "_"; ) {
      if (this._jamoIndex++, this._jamoIndex >= this.jamos.length)
        return !1;
      i = this.jamos[this._jamoIndex], c = this._pathes[this._jamoIndex];
    }
    console.log("After skipping empty chars:", {
      newIndex: this._jamoIndex,
      newChar: i,
      coords: c
    });
    const l = c == null ? void 0 : c[`stroke${a}`];
    if (!l || !this.currentChar || !(i in vt)) return !1;
    const u = vt[i], d = u == null ? void 0 : u[a - 1];
    if (!d) return !1;
    const f = l.start, h = d.x * o, p = d.y * o;
    return Math.hypot(e - (f.x + h), t - (f.y + p)) < n;
  }
  // Feedback methods
  showSuccessFeedback() {
    const e = {
      success: !0,
      stroke: {
        current: this.currentStrokeNumber,
        total: this.totalStrokes
      }
    };
    this.notifyListeners(e), this.audioService.playSound();
  }
  showFailFeedback() {
    var t, n;
    const e = {
      success: !1,
      stroke: {
        current: this.currentStrokeNumber,
        total: this.totalStrokes,
        type: (t = this._pathes[this._jamoIndex][`stroke${this.revisedStrokeNum}`]) == null ? void 0 : t.type
      },
      detail: (n = this.currentEvalResult) == null ? void 0 : n.detail
    };
    this.notifyListeners(e);
  }
  showRunningFeedback() {
    var t;
    const e = {
      success: !0,
      stroke: {
        current: this.currentStrokeNumber,
        total: this.totalStrokes,
        type: (t = this._pathes[this._jamoIndex][`stroke${this.revisedStrokeNum}`]) == null ? void 0 : t.type
      }
    };
    this.notifyListeners(e);
  }
  getCoordinates(e) {
    const t = this.canvas.getBoundingClientRect(), n = e instanceof TouchEvent ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
    return {
      x: n.x - t.left,
      y: n.y - t.top
    };
  }
  calculateCharCoords(e, t) {
    return e === "_" ? null : It[e].calculateCoords(t.w, t.h, t.x, t.y);
  }
  getStrokeCount(e) {
    return It[e].strokes;
  }
  // Getters and utility methods
  get currentChar() {
    return this.jamos[this._jamoIndex];
  }
  get totalStrokes() {
    return this.jamos.map((e) => this.getStrokeCount(e)).reduce((e, t) => e + t, 0);
  }
  get revisedStrokeNum() {
    let e = this.currentStrokeNumber;
    const t = Math.floor(this._jamoIndex / 3);
    if (t > 0) {
      const n = t * 3 - 1;
      return this._jamoIndex % 3 === 1 ? e - this._strokes[t * 3] : this._jamoIndex % 3 === 2 ? e - this._strokes[t * 3 + 1] : e - this._strokes[n];
    } else {
      if (this._jamoIndex === 1)
        return e - this._strokes[0];
      if (this._jamoIndex === 2)
        return e - this._strokes[1];
    }
    return e;
  }
  get configuration() {
    return y;
  }
  get currentJamoIndex() {
    return this._jamoIndex;
  }
  get strokesArray() {
    return this._strokes;
  }
  get characterPath() {
    return this.currentChar ? It[this.currentChar] : void 0;
  }
  get pathes() {
    return this._pathes;
  }
}
const Jo = (r) => r;
function Vo(r, { delay: e = 0, duration: t = 400, easing: n = Jo } = {}) {
  const s = +getComputedStyle(r).opacity;
  return {
    delay: e,
    duration: t,
    easing: n,
    css: (o) => `opacity: ${o * s}`
  };
}
var Go = /* @__PURE__ */ at('<section class="kw-success svelte-yv2hqz"><button aria-label="success" class="svelte-yv2hqz"></button></section>');
const Bo = {
  hash: "svelte-yv2hqz",
  code: ".kw-success.svelte-yv2hqz {position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:100%;height:100%;display:flex;justify-content:center;align-items:center;overflow:hidden;}.kw-success.svelte-yv2hqz button:where(.svelte-yv2hqz) {border-radius:8px;border:1px solid transparent;padding:0.6em 1.2em;cursor:pointer;transition:border-color 0.25s;position:absolute;inset:0;padding:0;display:flex;justify-content:center;align-items:center;background-color:transparent;background-image:var(--feedback-img-path);background-size:contain;background-position:center;background-repeat:no-repeat;margin:2px;}.kw-success.svelte-yv2hqz button:where(.svelte-yv2hqz):hover {border-color:#646cff;}.kw-success.svelte-yv2hqz button:where(.svelte-yv2hqz):active {transform:translate(2px, 2px);}"
};
function gr(r, e) {
  Et(e, !1), Ht(r, Bo);
  const t = ze();
  let n = L(e, "image", 12), s = L(e, "ratio", 12, 1), o = L(e, "size", 12, 0);
  ue(
    () => (kt(o()), kt(s())),
    () => {
      N(t, Math.min(o(), 500) * s());
    }
  ), Hn();
  var a = Go(), i = q(a);
  return z(a), At(() => {
    mn(a, "style", `--feedback-size: ${o() ?? ""}px; --max-img-size: ${P(t) ?? ""}px`), mn(i, "style", `--feedback-img-path: url(${n() ?? ""})`);
  }), ut("click", i, function(c) {
    Ws.call(this, e, c);
  }), Xs(3, a, () => Vo, () => ({ duration: 150 })), D(r, a), Tt({
    get image() {
      return n();
    },
    set image(c) {
      n(c), O();
    },
    get ratio() {
      return s();
    },
    set ratio(c) {
      s(c), O();
    },
    get size() {
      return o();
    },
    set size(c) {
      o(c), O();
    }
  });
}
Ut(gr, { image: {}, ratio: {}, size: {} }, [], [], !0);
var Ko = /* @__PURE__ */ at('<div class="canvas-container svelte-8oajsz"><canvas width="500" height="500" class="svelte-8oajsz"></canvas> <!></div>');
const Zo = {
  hash: "svelte-8oajsz",
  code: ".canvas-container.svelte-8oajsz {position:relative;width:100%;overflow-x:auto;}.canvas-container.svelte-8oajsz canvas:where(.svelte-8oajsz) {display:block;margin:0 auto;background-color:#2f2f2f;}"
};
function _r(r, e) {
  Et(e, !0), Ht(r, Zo);
  const t = L(e, "ready", 7), n = L(e, "end", 7), s = L(e, "feedback", 7), o = L(e, "chars", 7);
  let a, i = Ye(void 0), c = { showFeedback: !1, image: "" }, l = Ye(nt(c.showFeedback)), u = Ye(nt(c.image)), d = 500;
  const f = () => {
    N(l, !1), N(u, ""), s() && s()(void 0);
  }, h = (x) => {
    n() && n()(x), N(l, nt(x.success && x.stroke.current === x.stroke.total)), N(u, "https://kr.object.ncloudstorage.com/tesis/media/o0.png"), s() && s()(x);
  };
  Hs(() => {
    N(i, nt(new Qo(a, { char: o()[0] }))), P(i).bindEventListener(h), t() && t()(P(i));
  });
  var p = Ko(), m = q(p);
  Fs(m, (x) => a = x, () => a);
  var g = X(m, 2);
  {
    var k = (x) => {
      gr(x, {
        size: d,
        get image() {
          return P(u);
        },
        ratio: 0.7,
        $$events: { click: f }
      });
    };
    xt(g, (x) => {
      P(i) && P(l) && x(k);
    });
  }
  return z(p), D(r, p), Tt({
    get ready() {
      return t();
    },
    set ready(x) {
      t(x), O();
    },
    get end() {
      return n();
    },
    set end(x) {
      n(x), O();
    },
    get feedback() {
      return s();
    },
    set feedback(x) {
      s(x), O();
    },
    get chars() {
      return o();
    },
    set chars(x) {
      o(x), O();
    }
  });
}
Ut(_r, { ready: {}, end: {}, feedback: {}, chars: {} }, [], [], !0);
const ta = () => {
}, ea = (r, e) => {
  r.update((t) => (e(t), t));
};
class na {
  constructor() {
  }
  subscribe(e) {
    return this.store.subscribe(e);
  }
  update(e) {
    ea(this.store, e || ta);
  }
  set() {
    this.update();
  }
}
const kr = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ"
], br = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ"
], wr = [
  "_",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ"
];
function ra(r) {
  const e = r.charCodeAt(0);
  if (e < 44032 || e > 55203)
    throw new Error("한글 음절이 아닙니다.");
  const t = e - 44032, n = Math.floor(t / (21 * 28)), s = Math.floor(t % (21 * 28) / 28), o = t % 28;
  return [kr[n], br[s], wr[o]];
}
function sa(r) {
  return r.split("").map((e) => ra(e));
}
function oa(r) {
  if (r.length < 2 || r.length > 3)
    return null;
  const e = kr.indexOf(r[0]), t = br.indexOf(r[1]), n = r[2] ? wr.indexOf(r[2]) : 0;
  return e !== -1 && t !== -1 && n !== -1 ? String.fromCharCode(44032 + e * 21 * 28 + t * 28 + n) : null;
}
class aa extends na {
  constructor(e = []) {
    super(), this.words = e, this.store = vr(this), this.index = 0, e.length === 0 && e.push("한글");
  }
  get currentWord() {
    return this.words[this.index];
  }
  reset(e, t = 0) {
    this.words.splice(0, this.words.length), this.words.push(...e), this.index = t, this.update();
  }
  selectAt(e) {
    let t = Math.max(e, 0);
    t = Math.min(t, this.words.length - 1), this.index !== t && (this.index = t, this.update());
  }
  movePrev() {
    const e = Math.max(0, this.index - 1), t = e < this.index;
    return t && (this.index = e, this.update()), t;
  }
  moveNext() {
    const e = Math.min(this.words.length - 1, this.index + 1), t = e > this.index;
    return t && (this.index = e, this.update()), t;
  }
  getCurrentPattern() {
    return new xr(sa(this.currentWord));
  }
}
var ia = /* @__PURE__ */ at('<div class="tol-control svelte-1oo3hln"><label for="" class="svelte-1oo3hln">정확도</label> <button id="decreaseTol" class="tol-button svelte-1oo3hln">-</button> <span id="tolValue" class="svelte-1oo3hln"> </span> <button id="increaseTol" class="tol-button svelte-1oo3hln">+</button></div>');
const ca = {
  hash: "svelte-1oo3hln",
  code: ".tol-control.svelte-1oo3hln {display:flex;align-items:center;gap:0.1rem;margin:0.5rem 1rem;font-size:0.9rem;font-weight:bold;justify-content:center;}.tol-control.svelte-1oo3hln label:where(.svelte-1oo3hln) {color:#110f0f;}.tol-control.svelte-1oo3hln .tol-button:where(.svelte-1oo3hln) {width:24px;height:24px;border-radius:50%;border:1px solid #e5e7eb;color:#374151;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:1rem 1rem;}.tol-control.svelte-1oo3hln .tol-button:where(.svelte-1oo3hln):hover {border:none;}.tol-control.svelte-1oo3hln .tol-button:where(.svelte-1oo3hln):hover:not(:disabled) {background:#f3f4f6;}.tol-control.svelte-1oo3hln .tol-button:where(.svelte-1oo3hln):disabled {opacity:0.5;cursor:not-allowed;}.tol-control.svelte-1oo3hln .tol-button#decreaseTol:where(.svelte-1oo3hln) {background:rgba(255, 102, 102, 0.2117647059);}.tol-control.svelte-1oo3hln .tol-button#increaseTol:where(.svelte-1oo3hln) {background:rgba(183, 240, 161, 0.2117647059);}.tol-control.svelte-1oo3hln #tolValue:where(.svelte-1oo3hln) {min-width:36px;color:#374151;font-weight:500;text-align:center;}"
};
function Pr(r, e) {
  Et(e, !1), Ht(r, ca);
  let t = L(e, "tol", 12, 10), n = L(e, "min", 12, 10), s = L(e, "max", 12, 40), o = L(e, "step", 12, 5);
  const a = () => {
    t() - o() >= n() && t(t() - o());
  }, i = () => {
    t() + o() <= s() && t(t() + o());
  };
  var c = ia(), l = X(q(c), 2), u = X(l, 2), d = q(u, !0);
  z(u);
  var f = X(u, 2);
  return z(c), At(() => {
    l.disabled = t() <= n(), Bt(d, t() / 5 - 1), f.disabled = t() >= s();
  }), ut("click", l, a), ut("click", f, i), D(r, c), Tt({
    get tol() {
      return t();
    },
    set tol(h) {
      t(h), O();
    },
    get min() {
      return n();
    },
    set min(h) {
      n(h), O();
    },
    get max() {
      return s();
    },
    set max(h) {
      s(h), O();
    },
    get step() {
      return o();
    },
    set step(h) {
      o(h), O();
    }
  });
}
Ut(Pr, { tol: {}, min: {}, max: {}, step: {} }, [], [], !0);
var la = /* @__PURE__ */ at('<span class="success svelte-15mtgd7">잘했어!</span>'), ua = /* @__PURE__ */ at("<span> </span>"), da = /* @__PURE__ */ at('<span class="error detail svelte-15mtgd7"> </span>'), fa = /* @__PURE__ */ at('<div class="error-content svelte-15mtgd7"><img src="https://kr.object.ncloudstorage.com/tesis/media/x0.png" alt="실패" class="svelte-15mtgd7"> <div class="error-messages svelte-15mtgd7"><span class="error svelte-15mtgd7"><!></span> <!></div></div>'), ha = /* @__PURE__ */ at('<div class="fb svelte-15mtgd7"><!></div>');
const va = {
  hash: "svelte-15mtgd7",
  code: ".fb.svelte-15mtgd7 {display:flex;align-items:center;gap:5px;font-size:1.5rem;font-weight:bold;min-height:4.5rem;}.fb.svelte-15mtgd7 .error-content:where(.svelte-15mtgd7) {display:flex;align-items:center;gap:8px;}.fb.svelte-15mtgd7 img:where(.svelte-15mtgd7) {height:3.5rem;width:3.5rem;vertical-align:middle;}.fb.svelte-15mtgd7 .error-messages:where(.svelte-15mtgd7) {display:flex;flex-direction:column;gap:0.3rem;}.fb.svelte-15mtgd7 .error:where(.svelte-15mtgd7) {color:#ef4444;}.fb.svelte-15mtgd7 .error.detail:where(.svelte-15mtgd7) {font-size:1.2rem;}.fb.svelte-15mtgd7 .success:where(.svelte-15mtgd7) {color:#22c55e;}"
};
function Sr(r, e) {
  Et(e, !1), Ht(r, va);
  let t = L(e, "result", 12, void 0);
  function n(i) {
    if (!i) return "";
    const c = [];
    return i.startOk || c.push("시작점"), i.firstPathOk || c.push("첫번째 선"), i.middleOk || c.push("중간점"), i.secondPathOk || c.push("두번째 선"), i.endOk || c.push("끝점"), c.length === 0 ? "" : `${c.join(", ")}을 더 정확하게!`;
  }
  fr();
  var s = ha(), o = q(s);
  {
    var a = (i) => {
      var c = Oe(), l = le(c);
      {
        var u = (f) => {
          var h = Oe(), p = le(h);
          {
            var m = (k) => {
              var x = la();
              D(k, x);
            }, g = (k) => {
              var x = ua(), w = q(x);
              z(x), At(() => Bt(w, `${t().stroke.current + 1}번째 획을 써보세요.`)), D(k, x);
            };
            xt(p, (k) => {
              t().stroke.current === t().stroke.total ? k(m) : k(g, !1);
            });
          }
          D(f, h);
        }, d = (f) => {
          var h = fa(), p = X(q(h), 2), m = q(p), g = q(m);
          {
            var k = ($) => {
              var b = yn("선을 다시!");
              D($, b);
            }, x = ($) => {
              var b = yn();
              At(() => Bt(b, `${t().stroke.current ?? ""}번째 획을 다시!`)), D($, b);
            };
            xt(g, ($) => {
              t().stroke.type === "circle" ? $(k) : $(x, !1);
            });
          }
          z(m);
          var w = X(m, 2);
          {
            var Y = ($) => {
              var b = Oe();
              const j = /* @__PURE__ */ qn(() => n(t().detail));
              var S = le(b);
              {
                var A = (W) => {
                  var Yt = da(), ae = q(Yt, !0);
                  z(Yt), At(() => Bt(ae, P(j))), D(W, Yt);
                };
                xt(S, (W) => {
                  P(j) && t().stroke.type != "circle" && W(A);
                });
              }
              D($, b);
            };
            xt(w, ($) => {
              t().detail && $(Y);
            });
          }
          z(p), z(h), D(f, h);
        };
        xt(l, (f) => {
          t().success ? f(u) : f(d, !1);
        });
      }
      D(i, c);
    };
    xt(o, (i) => {
      t() && t().stroke.current > 0 && i(a);
    });
  }
  return z(s), D(r, s), Tt({
    get result() {
      return t();
    },
    set result(i) {
      t(i), O();
    }
  });
}
Ut(Sr, { result: {} }, [], [], !0);
class pa {
  constructor() {
    if (this.isSpeaking = !1, this.speechQueue = [], this.speech = null, !window.speechSynthesis) {
      console.log("TTS not supported");
      return;
    }
    this.speech = new SpeechSynthesisUtterance(), this.speech.lang = "ko-KR", this.speech.volume = 1, this.speech.rate = 0.85, this.speech.pitch = 1, this.speech.onstart = () => this.isSpeaking = !0, this.speech.onend = () => {
      if (this.isSpeaking = !1, this.speechQueue.length > 0) {
        const e = this.speechQueue.shift();
        e && this.speak(e);
      }
    };
  }
  speak(e) {
    if (this.speech) {
      window.speechSynthesis.cancel(), this.speech.text = e;
      try {
        window.speechSynthesis.speak(this.speech);
      } catch (t) {
        console.error("TTS error:", t);
      }
    }
  }
}
const Pn = new pa();
class ya {
  constructor(e, t) {
    if (this.handler = e, this.pathes = t, this.baseTime = 100, this.strokeSpeedFactors = {
      line: {
        single: 1,
        // 한 번에 그리는 직선
        double: 1.5
        // 꺾인 선(2단계로 그리는 선)
      },
      circle: 1.2,
      // 원형
      quadratic: 1.3,
      // 곡선
      path: {
        horizontal: 0.8,
        // 가로선
        curve: 1.2
        // 곡선 부분
      }
    }, this.currentChar = "", this.lastAnimatedIndex = -1, this.completedStrokes = [], this.isAnimating = !1, this.animationFrameId = null, this.startTime = Date.now(), this.drawingService = new yr(e.canvas), !e.jamos || !Array.isArray(e.jamos))
      throw new Error("Handler jamos is not properly initialized");
  }
  calculateStrokeLength(e) {
    switch (e.type) {
      case "line":
        return e.middle ? this.getLineLength(e.start, e.middle) + this.getLineLength(e.middle, e.end) : this.getLineLength(e.start, e.end);
      case "circle":
        return Math.PI * 2 * Math.max(e.radiusX, e.radiusY);
      case "quadratic":
        return this.getQuadraticCurveLength(
          e.start,
          e.control,
          e.end
        );
      case "path":
        return this.getPathLength(e.commands);
      default:
        return 100;
    }
  }
  getLineLength(e, t) {
    return Math.sqrt(
      Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2)
    );
  }
  getQuadraticCurveLength(e, t, n) {
    let o = 0, a = e;
    for (let i = 1; i <= 10; i++) {
      const c = i / 10, l = {
        x: Math.pow(1 - c, 2) * e.x + 2 * (1 - c) * c * t.x + Math.pow(c, 2) * n.x,
        y: Math.pow(1 - c, 2) * e.y + 2 * (1 - c) * c * t.y + Math.pow(c, 2) * n.y
      };
      o += this.getLineLength(a, l), a = l;
    }
    return o;
  }
  getPathLength(e) {
    let t = 0, n = { x: 0, y: 0 };
    return e.forEach((s) => {
      switch (s.type) {
        case "M":
          n = { x: s.x ?? 0, y: s.y ?? 0 };
          break;
        case "L":
          s.x !== void 0 && s.y !== void 0 && (t += this.getLineLength(n, { x: s.x, y: s.y }), n = { x: s.x, y: s.y });
          break;
        case "Q":
          s.control && s.end && (t += this.getQuadraticCurveLength(
            n,
            s.control,
            s.end
          ), n = s.end);
          break;
      }
    }), t;
  }
  getStrokeDuration(e) {
    const t = this.calculateStrokeLength(e);
    let n = 1;
    switch (e.type) {
      case "line":
        n = e.middle ? this.strokeSpeedFactors.line.double : this.strokeSpeedFactors.line.single;
        break;
      case "circle":
        n = this.strokeSpeedFactors.circle;
        break;
      case "quadratic":
        n = this.strokeSpeedFactors.quadratic;
        break;
      case "path":
        n = 1;
        break;
    }
    return this.baseTime * n * (t / 100);
  }
  animate(e, t, n) {
    const { handler: s } = this;
    if (t === "_") return;
    if (!s.jamos || !n) {
      console.error("Required data is missing");
      return;
    }
    let o = s.jamos.indexOf(t);
    if (o === -1) {
      console.error("Current character not found in handler.jamos.");
      return;
    }
    o === 0 && s.currentJamoIndex === 2 && (o = 2);
    const a = o > 0 ? s.strokesArray[o - 1] : 0, c = 1 / (s.strokesArray[o] - a), l = Math.floor(e / c), u = (e - l * c) / c, d = l + 1;
    if (n[`stroke${d}`]) {
      const f = n[`stroke${d}`];
      let h = [];
      switch (f.type) {
        case "line":
          h = this.animateLine(f, u);
          break;
        case "circle":
          h = this.animateCircle(f, u);
          break;
        case "quadratic":
          h = this.animateQuadratic(f, u);
          break;
        case "path":
          h = this.animatePath(f, u);
          break;
      }
      this.drawingService.drawUserStroke(h), u === 1 && this.completedStrokes.push(h);
    }
    this.drawingService.restore(), this.lastAnimatedIndex = o;
  }
  animateLine(e, t) {
    const n = [];
    if (e.middle)
      if (t <= 0.5) {
        const s = t * 2;
        n.push([e.start.x, e.start.y]);
        for (let o = 0; o <= s; o += 0.02) {
          const a = e.start.x + (e.middle.x - e.start.x) * o, i = e.start.y + (e.middle.y - e.start.y) * o;
          n.push([a, i]);
        }
        s >= 0.9 && n.push([e.middle.x, e.middle.y]);
      } else {
        const s = (t - 0.5) * 2;
        n.push([e.start.x, e.start.y]), n.push([e.middle.x, e.middle.y]);
        for (let o = 0; o <= s; o += 0.02) {
          const a = e.middle.x + (e.end.x - e.middle.x) * o, i = e.middle.y + (e.end.y - e.middle.y) * o;
          n.push([a, i]);
        }
        s >= 0.9 && n.push([e.end.x, e.end.y]);
      }
    else {
      n.push([e.start.x, e.start.y]);
      for (let s = 0; s <= t; s += 0.02) {
        const o = e.start.x + (e.end.x - e.start.x) * s, a = e.start.y + (e.end.y - e.start.y) * s;
        n.push([o, a]);
      }
      t >= 0.9 && n.push([e.end.x, e.end.y]);
    }
    return n;
  }
  animateCircle(e, t) {
    const n = [], s = -Math.PI / 2, o = s - Math.PI * 2 * t;
    for (let a = s; a >= o; a -= 0.05) {
      const i = e.center.x + Math.cos(a) * e.radiusX, c = e.center.y + Math.sin(a) * e.radiusY;
      n.push([i, c]);
    }
    if (t >= 0.9) {
      const a = e.center.x + Math.cos(o) * e.radiusX, i = e.center.y + Math.sin(o) * e.radiusY;
      n.push([a, i]);
    }
    return n;
  }
  animateQuadratic(e, t) {
    const n = [];
    n.push([e.start.x, e.start.y]);
    for (let s = 0; s <= t; s += 0.02) {
      const o = Math.pow(1 - s, 2) * e.start.x + 2 * (1 - s) * s * e.control.x + Math.pow(s, 2) * e.end.x, a = Math.pow(1 - s, 2) * e.start.y + 2 * (1 - s) * s * e.control.y + Math.pow(s, 2) * e.end.y;
      n.push([o, a]);
    }
    return t >= 0.9 && n.push([e.end.x, e.end.y]), n;
  }
  animatePath(e, t) {
    const n = [], s = e.commands;
    if (t <= 0.5) {
      const o = t * 2;
      n.push([s[0].x, s[0].y]);
      const a = s[0].x + (s[1].x - s[0].x) * o;
      n.push([a, s[0].y]);
      for (let i = 0; i <= o; i += 0.02) {
        const c = s[0].x + (s[1].x - s[0].x) * i;
        n.push([c, s[0].y]);
      }
      o >= 0.8 && n.push([s[1].x, s[1].y]);
    } else {
      const o = (t - 0.5) * 2;
      n.push([s[0].x, s[0].y]), n.push([s[1].x, s[1].y]);
      for (let a = 0; a <= o; a += 0.02) {
        const i = Math.pow(1 - a, 2) * s[1].x + 2 * (1 - a) * a * s[2].control.x + Math.pow(a, 2) * s[2].end.x, c = Math.pow(1 - a, 2) * s[1].y + 2 * (1 - a) * a * s[2].control.y + Math.pow(a, 2) * s[2].end.y;
        n.push([i, c]);
      }
      o >= 0.9 && n.push([s[2].end.x, s[2].end.y]);
    }
    return n;
  }
  // private getPointOnLine(
  //   startX: number,
  //   startY: number,
  //   endX: number,
  //   endY: number,
  //   progress: number
  // ): [number, number] {
  //   return [
  //     startX + (endX - startX) * progress,
  //     startY + (endY - startY) * progress
  //   ]
  // }
  handleTTS(e) {
    if (this.handler.mode === "jamo") {
      const t = this.handler.jamos[e];
      this.currentChar !== t && (Pn.speak(t), this.currentChar = t);
    } else {
      const t = Math.floor(e / 3) * 3, n = this.handler.jamos.slice(t, t + 3);
      if (n[0] && n[1]) {
        const s = oa(n);
        s && this.currentChar !== s && (Pn.speak(s), this.currentChar = s);
      }
    }
  }
  start() {
    const { handler: e } = this, { jamos: t } = e;
    this.isAnimating && (this.animationFrameId && cancelAnimationFrame(this.animationFrameId), this.drawingService.clearCanvas(), e.drawPathes(), e.drawStartPoints()), this.startTime = Date.now(), this.lastAnimatedIndex = -1, this.completedStrokes = [];
    const n = t.map((a, i) => {
      const c = this.pathes[i];
      let l = 0, u = 0;
      if (c && typeof c == "object") {
        const d = It[a];
        if (d) {
          u = d.strokes;
          for (let f = 1; f <= u; f++) {
            const h = c[`stroke${f}`];
            h && (l += this.getStrokeDuration(h));
          }
        }
        u > 1 && (l += (u - 1) * 100);
      }
      return {
        start: 0,
        duration: l
      };
    });
    let s = 0;
    n.forEach((a) => {
      a.start = s, s += a.duration + 150;
    });
    const o = () => {
      const a = Date.now() - this.startTime;
      let i = n.findLastIndex((f) => f.start <= a);
      i === -1 && (i = 0);
      const c = n[i], l = Math.min((a - c.start) / c.duration, 1), u = i % 3;
      let d;
      switch (u) {
        case 0:
          d = "#FFD700CC";
          break;
        case 1:
          d = "#9ACD32CC";
          break;
        case 2:
          d = "#FFD700CC";
          break;
        default:
          d = y.paths.drawing.color;
      }
      this.drawingService.setAnimationStyle(d), i !== this.lastAnimatedIndex && (this.handleTTS(i), this.lastAnimatedIndex = i), this.animate(l, e.jamos[i], this.pathes[i]), e.drawStartPoints(), l >= 1 && i === t.length - 1 ? (this.isAnimating = !1, this.animationFrameId = null, setTimeout(() => {
        e.drawPathes(), e.drawStartPoints();
      }, 1e3)) : requestAnimationFrame(o);
    };
    o();
  }
  get duration() {
    const { handler: e } = this, { jamos: t } = e;
    let n = 0;
    return t.forEach((s, o) => {
      const a = this.pathes[o];
      let i = 0, c = 0;
      for (let l = 1; l <= Object.keys(a).length; l++) {
        const u = a[`stroke${l}`];
        u && (i += this.getStrokeDuration(u), c++);
      }
      i += (c - 1) * 100, n += i + 150;
    }), n;
  }
}
var ma = /* @__PURE__ */ at('<div class="size-control svelte-1dj2gjq"><label for="" class="svelte-1dj2gjq">크기</label> <button id="decreaseSize" class="size-button svelte-1dj2gjq">-</button> <span id="sizeValue" class="svelte-1dj2gjq"> </span> <button id="increaseSize" class="size-button svelte-1dj2gjq">+</button></div>');
const xa = {
  hash: "svelte-1dj2gjq",
  code: ".size-control.svelte-1dj2gjq {display:flex;align-items:center;gap:0.1rem;margin:0.5rem 1rem;font-size:0.9rem;font-weight:bold;justify-content:center;}.size-control.svelte-1dj2gjq label:where(.svelte-1dj2gjq) {color:#110f0f;}.size-control.svelte-1dj2gjq .size-button:where(.svelte-1dj2gjq) {width:24px;height:24px;border-radius:50%;border:1px solid #e5e7eb;color:#374151;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:1rem 1rem;}.size-control.svelte-1dj2gjq .size-button:where(.svelte-1dj2gjq):hover {border:none;}.size-control.svelte-1dj2gjq .size-button:where(.svelte-1dj2gjq):hover:not(:disabled) {background:#f3f4f6;}.size-control.svelte-1dj2gjq .size-button:where(.svelte-1dj2gjq):disabled {opacity:0.5;cursor:not-allowed;}.size-control.svelte-1dj2gjq .size-button#decreaseSize:where(.svelte-1dj2gjq) {background:rgba(255, 102, 102, 0.2117647059);}.size-control.svelte-1dj2gjq .size-button#increaseSize:where(.svelte-1dj2gjq) {background:rgba(183, 240, 161, 0.2117647059);}.size-control.svelte-1dj2gjq #sizeValue:where(.svelte-1dj2gjq) {min-width:20px;color:#374151;font-weight:500;text-align:center;}"
};
function Cr(r, e) {
  Et(e, !1), Ht(r, xa);
  let t = L(e, "size", 12, 500), n = L(e, "min", 12, 200), s = L(e, "max", 12, 600), o = L(e, "step", 12, 100);
  const a = () => {
    console.log("사이즈 감소"), t() - o() >= n() - 100 && t(t() - o());
  }, i = () => {
    console.log("사이즈 증가"), t() + o() <= s() && t(t() + o());
  };
  var c = ma(), l = X(q(c), 2), u = X(l, 2), d = q(u, !0);
  z(u);
  var f = X(u, 2);
  return z(c), At(() => {
    l.disabled = t() <= n(), Bt(d, t() / 100 - 1), f.disabled = t() >= s();
  }), ut("click", l, a), ut("click", f, i), D(r, c), Tt({
    get size() {
      return t();
    },
    set size(h) {
      t(h), O();
    },
    get min() {
      return n();
    },
    set min(h) {
      n(h), O();
    },
    get max() {
      return s();
    },
    set max(h) {
      s(h), O();
    },
    get step() {
      return o();
    },
    set step(h) {
      o(h), O();
    }
  });
}
Ut(Cr, { size: {}, min: {}, max: {}, step: {} }, [], [], !0);
var ga = /* @__PURE__ */ at('<div class="control-section svelte-1mru6f5"><!> <div class="button-container svelte-1mru6f5"><button class="prev-button svelte-1mru6f5">이전</button> <button class="guide-button svelte-1mru6f5">미리보기</button> <button class="clear-button svelte-1mru6f5">지우기</button> <button class="next-button svelte-1mru6f5">다음</button></div> <!></div> <div class="main-content svelte-1mru6f5"><div class="canvas-section svelte-1mru6f5"><div class="main-canvas svelte-1mru6f5"><!> <!></div></div></div>', 1);
const _a = {
  hash: "svelte-1mru6f5",
  code: `.control-section.svelte-1mru6f5 {display:flex;justify-content:center;}.control-section.svelte-1mru6f5 .button-container:where(.svelte-1mru6f5) {display:flex;gap:1rem;margin:0.5rem;align-items:center;justify-content:center;--color-gray: #4b5563;--color-orange: #f97316;--color-blue: #3b82f6;}.control-section.svelte-1mru6f5 .button-container:where(.svelte-1mru6f5) button:where(.svelte-1mru6f5) {padding:0.5rem 1rem;color:white;border:none;border-radius:0.25rem;cursor:pointer;transition:opacity 0.2s;}.control-section.svelte-1mru6f5 .button-container:where(.svelte-1mru6f5) button:where(.svelte-1mru6f5):hover {opacity:0.9;}.control-section.svelte-1mru6f5 .button-container:where(.svelte-1mru6f5) button:where(.svelte-1mru6f5):disabled {opacity:0.5;cursor:not-allowed;}.control-section.svelte-1mru6f5 .button-container:where(.svelte-1mru6f5) .prev-button:where(.svelte-1mru6f5),
.control-section.svelte-1mru6f5 .button-container:where(.svelte-1mru6f5) .next-button:where(.svelte-1mru6f5) {background-color:var(--color-gray);}.control-section.svelte-1mru6f5 .button-container:where(.svelte-1mru6f5) .guide-button:where(.svelte-1mru6f5) {background-color:var(--color-orange);}.control-section.svelte-1mru6f5 .button-container:where(.svelte-1mru6f5) .clear-button:where(.svelte-1mru6f5) {background-color:var(--color-blue);}.main-content.svelte-1mru6f5 {--color-background: #f4f4b5;}.main-content.svelte-1mru6f5 .canvas-section:where(.svelte-1mru6f5) {display:flex;position:relative;flex-direction:column;flex-wrap:nowrap;}.main-content.svelte-1mru6f5 .canvas-section:where(.svelte-1mru6f5) .main-canvas:where(.svelte-1mru6f5) {position:relative;background-color:var(--color-background);border-radius:0.5rem;display:flex;justify-content:center;flex-direction:column;align-items:center;width:100%;box-sizing:border-box;padding:16px;}`
};
function ka(r, e) {
  Et(e, !1), Ht(r, _a);
  const [t, n] = Bs(), s = () => Gs(d, "$activeChars", t);
  let o = L(e, "words", 28, () => ["나무"]), a = L(e, "index", 12, 0), i = L(e, "canvasSize", 12, 300), c = L(e, "tolerance", 12, 40);
  const l = new aa();
  let u = ze(), d = vr([]), f = ze(void 0);
  const h = Qs(), p = (M) => {
    N(f, M), M || k();
  }, m = () => {
    N(f, void 0);
  }, g = (M) => {
    P(u).initialize();
    const Qt = l.getCurrentPattern();
    P(u).setPattern(Qt, Qt.chars), m(), h("dir", M);
  }, k = () => {
    l.moveNext() && g(1);
  }, x = () => {
    l.movePrev() && g(-1);
  }, w = () => {
    new ya(P(u), P(u).pathes).start();
  }, Y = (M) => {
    l.reset(M, a());
    const Qt = l.getCurrentPattern();
    P(u).setPattern(Qt, Qt.chars);
  }, $ = (M) => {
    l.selectAt(M);
  }, b = (M) => {
    P(u) && (P(u).updateCanvasSize(M), Y(o()));
  };
  ue(
    () => (P(u), kt(c()), kt(o())),
    () => {
      P(u) && (P(u).updateTolerance(c()), P(u).updateCanvasSize(300), Y(o()));
    }
  ), ue(() => kt(a()), () => {
    $(a());
  }), ue(() => kt(i()), () => {
    b(i());
  }), Hn(), fr();
  var j = ga(), S = le(j), A = q(S);
  Cr(A, {
    get size() {
      return i();
    },
    set size(M) {
      i(M);
    },
    $$legacy: !0
  });
  var W = X(A, 2), Yt = q(W), ae = X(Yt, 2), nn = X(ae, 2), $r = X(nn, 2);
  z(W);
  var jr = X(W, 2);
  Pr(jr, {
    get tol() {
      return c();
    },
    set tol(M) {
      c(M);
    },
    $$legacy: !0
  }), z(S);
  var rn = X(S, 2), sn = q(rn), on = q(sn), an = q(on);
  Sr(an, {
    get result() {
      return P(f);
    }
  });
  var Mr = X(an, 2);
  _r(Mr, {
    ready: (M) => N(u, M),
    feedback: p,
    get chars() {
      return s();
    }
  }), z(on), z(sn), z(rn), ut("click", Yt, x), ut("click", ae, w), ut("click", nn, () => {
    var M;
    (M = P(u)) == null || M.initialize(), m();
  }), ut("click", $r, k), D(r, j);
  var Er = Tt({
    get words() {
      return o();
    },
    set words(M) {
      o(M), O();
    },
    get index() {
      return a();
    },
    set index(M) {
      a(M), O();
    },
    get canvasSize() {
      return i();
    },
    set canvasSize(M) {
      i(M), O();
    },
    get tolerance() {
      return c();
    },
    set tolerance(M) {
      c(M), O();
    }
  });
  return n(), Er;
}
customElements.define("ko-writing-node", Ut(
  ka,
  {
    words: {},
    index: {},
    canvasSize: {},
    tolerance: {}
  },
  [],
  [],
  !1
));
//# sourceMappingURL=ko-writing.js.map
