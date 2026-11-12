var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
!function () {
    "use strict";
    var e = window.CactusClassicContent, t = window.CactusClassicDiscovery, n = window.CactusClassicPrivacy, a = window.CactusClassicSettings, i = window.CactusClassicNavigation, o = !1, r = 0, l = 0, s = 0, d = !1, c = null, u = [], p = {}, f = !1, m = window.CactusClassicDownloads, v = null, h = null, g = function (e) { return document.getElementById(e); }, y = "home", b = 1, w = "", C = 0, E = null, S = null, k = null, I = null, _ = null, T = { tags: "", year: "", originalCountry: "", audio: "" }, L = null, x = !1, A = {}, P = "", N = {}, q = null, D = null, O = "", M = !1, R = null, z = !1, j = {};
    function U(e, t) { j[e] = t; for (var n = Object.keys(j); n.length > 240;)
        delete j[n.shift()]; }
    var B = {}, F = {};
    function H(e, t) { var n = String(e.contentId) + "|" + String(null == e.type ? "" : e.type), a = B[n]; if (!t && a && a.expires > Date.now())
        return Promise.resolve(a.data); if (F[n])
        return F[n]; var i = ee("getItem", [e.contentId, e.type, !!t]).then(function (e) { B[n] = { data: e, expires: Date.now() + 6e4 }; for (var t = Object.keys(B); t.length > 30;)
        delete B[t.shift()]; return delete F[n], e; }, function (e) { throw delete F[n], e; }); return F[n] = i, i; }
    var K = [["Inicio", "home"], ["Continuar viendo", "lib:continue"], ["Mi lista", "lib:fav"], ["Explorar", "masnew_explorar"], ["Películas", "masnew_movies"], ["Series", "masnew_series"], ["Kids", "masnew_kids"], ["Anime y animación", "masnew_anime"], ["En vivo", "masnew_live"]], V = { masnew_free: !0, masnew_featured: "Recomendaciones", masnew_search: "Tendencias" }, J = {}, W = window.CACTUS_CLASSIC_SERVER || window.XUPER_SERVER || "";
    function G() { return o && n.isUnlocked(); }
    function $(t) { return e.allowed(t, G() ? "adult" : "general"); }
    function Y(t) { return e.title(t, a.prefs.titles); }
    function Q(t, n) { if (!t || "object" != typeof t)
        return t; if (Array.isArray(t))
        return t.map(function (e) { return Q(e, n); }); var a = Object.assign({}, t), i = e.audience(t, n); Object.keys(a).forEach(function (e) { a[e] && "object" == typeof a[e] && (a[e] = Q(a[e], "anime" === n && "adult" !== i ? "anime" : i)); }); var o = a.contentId || a.liveAddressList || a.code ? e.normalize(a, i) : a; return "anime" === n && a.contentId && (o.kind = "anime"), o; }
    function X() { Ee(), n.lock(), o = !1, O = "", C++, r++, l++, Et(), he(), g("hero").replaceChildren(), g("hero").hidden = !0, g("grid").replaceChildren(), g("query").value = "", w = ""; var e = g("adult-tools"); e && e.remove(); }
    var cactusCatalogTicket=0,cactusCatalogAll=false,cactusShelfTitle="";
    function cactusSectionName(){return {masnew_movies:"Películas",masnew_series:"Series",masnew_anime:"Anime y animación",masnew_kids:"Kids"}[y]||"Catálogo";}
    function cactusAllLabel(){return {masnew_movies:"Ver todas las películas",masnew_series:"Ver todas las series",masnew_anime:"Ver todos los animes",masnew_kids:"Ver todo Kids"}[y]||"Todo el catálogo";}
    function cactusShowCategory(code,label,all){
        O=code||"";cactusShelfTitle=label||"";cactusCatalogAll=!!all;x=true;b=1;
        T={tags:"",year:"",originalCountry:"",audio:""};g("heading").textContent=all?cactusSectionName():label||cactusSectionName();ye();window.scrollTo(0,0);
        var generation=C+1;return we(false).then(function(){if(generation===C)i.focus(g("grid").querySelector(".card")||g("more")||g("viewShelves"));});
    }
    function cactusOpenAll(){
        if(M)return Promise.resolve();var section=y,ticket=++cactusCatalogTicket,button=g("viewAll");button.disabled=true;
        return ee("getCategories",[section]).catch(function(){return [];}).then(function(categories){
            if(y!==section||ticket!==cactusCatalogTicket)return;
            var all=(categories||[]).find(function(row){return /^(all|tod[oa]s?)(?:\s|$)/i.test(String(row.name||row.alias||"").trim());});
            return cactusShowCategory(all&&all.code,cactusSectionName(),true);
        }).then(function(value){button.disabled=false;return value;},function(error){button.disabled=false;throw error;});
    }
    function Z(e, t) {
        return __awaiter(this, void 0, void 0, function () { var r; return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(a.dismiss(), i.closeMenu(!1), "masnew_adult" !== e || G())) return [3 /*break*/, 1];
                    G() && "masnew_adult" !== e && 0 !== e.indexOf("adult:") && X();
                    return [3 /*break*/, 3];
                case 1:
                    X(), g("status").hidden = !0;
                    return [4 /*yield*/, a.pin("access")];
                case 2:
                    if (!(_a.sent()))
                        return [2 /*return*/, (y = "home", b = 1, void we(!1))];
                    if (!(o = n.isUnlocked()))
                        return [2 /*return*/];
                    _a.label = 3;
                case 3:
                    cocoStopLive(), Et(), y = e, w = "", b = 1, O="",cactusShelfTitle="",cactusCatalogAll=false,++cactusCatalogTicket,x = !1, T = { tags: "", year: "", originalCountry: "", audio: "" }, L = null, g("query").value = "", g("heading").textContent = t || "Explorar", window.scrollTo(0, 0);
                    r = C + 1;
                    return [4 /*yield*/, we(!1)];
                case 4:
                    _a.sent(), C === r && i.tv && i.focus(g("hero").querySelector("button") || g("grid").querySelector("button") || g("query"));
                    return [2 /*return*/];
            }
        }); });
    }
    function ee(t,a){return window.CactusExternal?window.CactusExternal.request(t,a,cactusBaseRequest):cactusBaseRequest(t,a);}
    function cactusBaseRequest(t, a) {
        return __awaiter(this, void 0, void 0, function () { var i, o, r, _a, _b, l; return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (a = a || [], G() && /^(progressGet|progressSave|progressClear)$/.test(t))
                        return [2 /*return*/, null];
                    if (G() && "continueList" === t)
                        return [2 /*return*/, []];
                    if (G() && /^(favList|favStatus|favToggle)$/.test(t))
                        return [2 /*return*/, n.library(t, a)];
                    i = G();
                    return [4 /*yield*/, fetch(W + "/api/" + t, { method: "POST", headers: { "Content-Type": "application/json", "X-CactusClassic-Profile": window.CactusClassicProfiles.id() }, body: JSON.stringify(a || []) })];
                case 1:
                    o = _c.sent();
                    return [4 /*yield*/, o.json()];
                case 2:
                    r = _c.sent();
                    if (!o.ok)
                        throw new Error(r.error || "No se pudo conectar");
                    _a = i || "favList" !== t && "continueList" !== t;
                    if (_a) return [3 /*break*/, 4];
                    _b = r;
                    return [4 /*yield*/, Promise.all((r.data || []).map(function (t) {
                            return __awaiter(this, void 0, void 0, function () { var n, a; return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (t.audience)
                                            return [2 /*return*/, t];
                                        n = t.contentId;
                                        p[n] || (p[n] = ee("getItem", [n, t.type]).then(function (e) { return e.assetData || e; }).catch(function () { return delete p[n], null; }));
                                        return [4 /*yield*/, p[n]];
                                    case 1:
                                        a = _a.sent();
                                        return [2 /*return*/, a ? Object.assign({}, t, { audience: e.audience(a) }) : null];
                                }
                            }); });
                        }))];
                case 3:
                    _a = (_b.data = (_c.sent()).filter(Boolean));
                    _c.label = 4;
                case 4:
                    _a;
                    l = i && "search" !== t ? "adult" : "masnew_kids" === a[0] ? "kids" : "masnew_anime" === a[0] ? "anime" : null;
                    return [2 /*return*/, Q(r.data, l)];
            }
        }); });
    }
    function te(e, t) { g("status").hidden = !1, g("status-title").textContent = e, g("status-text").textContent = t; }
    function ne(e, t) { if (g("grid").setAttribute("aria-busy", e ? "true" : "false"), t) {
        var n = g("more");
        n.setAttribute("aria-disabled", String(e)), n.textContent = e ? "Cargando…" : "Cargar más";
    }
    else
        g("loading").hidden = !e; }
    function ae(e, t) { var n = [], a = {}; return function e(i) { if (i && "object" == typeof i)
        if (t(i)) {
            var o = i.contentId || i.liveId || i.columnCode || i.code || i.name;
            a[o] || (a[o] = !0, n.push(i));
        }
        else
            Object.keys(i).forEach(function (t) { e(i[t]); }); }(e), n; }
    // Coco v0.5: navegación para TV, preservando todos los destinos originales.
    // Anime está SIEMPRE como acceso principal, nunca en el grupo Explorar.
    function ie(e) {
        e = e.filter(function(x){ return x[1] !== "downloads"; });
        if (f && !i.tv) e.splice(Math.min(3,e.length),0,["Descargas","downloads"]);
        u = e;
        var nav = g("sections"), sets = {}, seen = {}, allowed = [], ordered = [];
        nav.replaceChildren();
        e.forEach(function(entry){
            if (entry[1] === "masnew_adult" && !a.prefs.adult) return;
            if (!seen[entry[1]]) { seen[entry[1]] = true; allowed.push(entry); sets[entry[1]] = entry; }
        });
        var top = ["home","masnew_live","masnew_movies","masnew_series","masnew_anime","animeonline","masnew_kids"];
        var saved = ["lib:continue","lib:fav","downloads"];
        var used = {};
        function label(text) {
            var el = document.createElement("p"); el.className="coco-menu-heading";
            el.textContent=text; el.setAttribute("aria-hidden","true"); nav.appendChild(el);
        }
        function iconSvg(code) {
            var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
            svg.setAttribute("viewBox","0 0 24 24");svg.setAttribute("width","21");svg.setAttribute("height","21");
            svg.setAttribute("fill","none");svg.setAttribute("stroke","currentColor");
            svg.setAttribute("stroke-width","1.9");svg.setAttribute("stroke-linecap","round");svg.setAttribute("stroke-linejoin","round");
            svg.setAttribute("aria-hidden","true");svg.classList.add("coco-nav-icon");
            var paths={
               "home":'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-7h6v7"/>',
               "masnew_live":'<rect x="3" y="6" width="18" height="15" rx="2"/><path d="m8 2 4 4 4-4M7 16h7m-7-5h9"/>',
               "masnew_movies":'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M7 4l3 5m4-5 3 5m-9 4 5 3-5 3z"/>',
               "masnew_series":'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M8 9h8M8 13h5M8 17h5"/>',
               "masnew_anime":'<path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7zM19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7z"/>',
               "masnew_kids":'<path d="m12 3 2.7 5.8 6.3.7-4.7 4.2 1.3 6.3L12 17l-5.6 3 1.3-6.3L3 9.5l6.3-.7z"/>',
               "lib:continue":'<path d="M3 12a9 9 0 1 0 2.5-6.2L3 8"/><path d="M3 3v5h5m4-1v5l4 3"/>',
               "lib:fav":'<path d="M6 3h12v18l-6-4-6 4z"/>',
               "masnew_explorar":'<circle cx="12" cy="12" r="9"/><path d="m15 9-2 4-4 2 2-4z"/>',
               "downloads":'<path d="M12 3v12m-4-4 4 4 4-4M5 19h14"/>',
               "masnew_adult":'<path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6z"/>',
               "animeonline":'<path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z"/>'
            };
            svg.innerHTML=paths[code] || '<circle cx="12" cy="12" r="8"/><path d="M9 12h6"/>';
            return svg;
        }
        function add(entry) {
            var code=entry[1];if (used[code]) return;
            used[code]=true;ordered.push(code);
            var b=document.createElement("button"), t=document.createElement("span");
            b.className="coco-menu-item"; b.dataset.code=code;
            b.appendChild(iconSvg(code));t.className="coco-menu-text";
            t.textContent = code === "masnew_anime" ? "Anime y animación" : code === "masnew_kids" ? "Kids" : entry[0];
            b.appendChild(t);b.setAttribute("aria-label",t.textContent);
            b.onclick=function(){ Z(code, t.textContent); };
            nav.appendChild(b);
        }
        label("PRINCIPAL");
        top.forEach(function(code){
            // Mostramos Anime como única opción, salvo que solo esté disponible JKAnime.
            if (code === "animeonline" && sets["masnew_anime"]) return;
            if (sets[code]) add(sets[code]);
        });
        label("MI CONTENIDO");saved.forEach(function(code){ if(sets[code]) add(sets[code]); });
        label("DESCUBRIR");
        if (sets["masnew_explorar"]) add(sets["masnew_explorar"]);
        allowed.forEach(function(entry){ if (!used[entry[1]]) add(entry); });
        // Evitar una sección vacía si el servidor solo publica el catálogo local.
        nav.setAttribute("data-coco-v05","true");
    }
    function oe(e) { var t = [e.poster, e.posterUrl, e.imageUrl, e.picUrl, e.picture]; return (e.posterList || []).forEach(function (e) { t.push(e.fileUrl); }), t.find(function (e) { return "string" == typeof e && /^https?:\/\//.test(e); }); }
    function re(e, t, n) { var a = de("div", "card-slot"), o = de("button", "card-remove", "✕"); return o.setAttribute("aria-label", "Quitar «" + Y(t) + "» de Continuar viendo"), o.title = "Quitar de Continuar viendo", o.onclick = function (e) {
        return __awaiter(this, void 0, void 0, function () { var r, l, s, d, e_1; return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.stopPropagation(), o.disabled = !0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (G())
                        return [2 /*return*/];
                    return [4 /*yield*/, ee("progressClear", [t.contentId])];
                case 2:
                    if (_a.sent(), n !== C)
                        return [2 /*return*/];
                    r = a.parentElement, l = a.nextElementSibling || a.previousElementSibling, s = document.activeElement === o;
                    if (a.remove(), r && r.classList.contains("shelf-row") && !r.querySelector(".card")) {
                        d = r.previousElementSibling;
                        d && d.classList.contains("shelf-title") && d.remove(), r.remove();
                    }
                    g("grid").querySelector(".card") || (g("status").hidden = !1, te("Nada que continuar", "Lo que empieces a ver aparecerá aquí para retomarlo.")), s && i.focus(l && l.querySelector(".card") || g("grid").querySelector(".card") || g("query")), i.ensure();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    o.disabled = !1;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        }); });
    }, a.append(e, o), a; }
    // Coco TV: solo los canales reales (liveAddressList) omiten la ficha previa.
    // Siempre conservamos una ventana de peliculas y series sin modificar.
    var cocoLiveChannels = [], cocoLivePosition = -1, cocoLivePlaying = false, cocoLiveTicket = 0, cocoLiveLastKey = 0;
    function cocoIsChannel(item) { return !!(item && Array.isArray(item.liveAddressList) && item.liveAddressList.length); }
    function cocoCurrentLiveView() { return document.documentElement.classList.contains("coco-live-view"); }
    function cocoZapBanner() { var el = g("coco-zap-banner"); if (!el) { el = document.createElement("div"); el.id = "coco-zap-banner"; el.className = "coco-zap-banner"; el.hidden = true; el.setAttribute("role", "status"); document.body.appendChild(el); } return el; }
    function cocoUpdatePlayerButtons() {
        var el = g("coco-ch-controls");
        if (!el) return;
        el.hidden = !cocoLivePlaying || cocoLiveChannels.length < 2 || g("player").hidden;
        var name = g("coco-ch-label");
        if (name && cocoLivePosition >= 0 && cocoLiveChannels[cocoLivePosition]) name.textContent = Y(cocoLiveChannels[cocoLivePosition]);
    }
    function cocoLiveBuildList(item) {
        var result = [], buttons = g("grid").querySelectorAll(".card");
        [].forEach.call(buttons, function(btn) {
            var t = btn._item;
            if (cocoIsChannel(t) && result.indexOf(t) < 0) result.push(t);
        });
        if (result.indexOf(item) < 0) result.push(item);
        cocoLiveChannels = result;
        cocoLivePosition = cocoLiveChannels.indexOf(item);
    }
    function cocoChannelError(message) {
        var b = cocoZapBanner();
        b.textContent = message || "No se pudo sintonizar este canal. Selecciona otro canal.";
        b.hidden = false;
        setTimeout(function() { if (!cocoLivePlaying) b.hidden = true; }, 5500);
    }
    function cocoStartChannel(item, newList) {
        if (!cocoIsChannel(item)) return st(item);
        if (newList || cocoLiveChannels.indexOf(item) < 0) cocoLiveBuildList(item);
        else cocoLivePosition = cocoLiveChannels.indexOf(item);
        cocoLivePlaying = true;
        var ticket = ++cocoLiveTicket;
        var banner = cocoZapBanner();
        banner.textContent = "Sintonizando: " + Y(item) + "...";
        banner.hidden = false;
        // st() prepara la ficha y guarda E; la ocultamos antes del siguiente cuadro.
        var start = st(item);
        g("detail").hidden = true;
        g("scrim").hidden = true;
        document.documentElement.classList.remove("modal-open");
        return Promise.resolve(start).then(function() {
            if (ticket !== cocoLiveTicket || !cocoLivePlaying || !E) return;
            // gt() sigue siendo exactamente el mismo reproductor probado en v0.3.
            return gt(E).then(function() {
                if (ticket !== cocoLiveTicket) return;
                banner.hidden = true;
                if (g("player").hidden) {
                    cocoLivePlaying = false;
                    cocoUpdatePlayerButtons();
                    cocoChannelError(window.CactusLastPlayError || ("No se pudo abrir " + Y(item) + ". Prueba otro canal."));
                } else cocoUpdatePlayerButtons();
            });
        }).catch(function(err) {
            if (ticket !== cocoLiveTicket) return;
            cocoLivePlaying = false;
            cocoUpdatePlayerButtons();
            cocoChannelError(err && err.message ? err.message : "No se pudo sintonizar el canal.");
        });
    }
    function cocoSwitchChannel(delta) {
        if (!cocoLivePlaying || cocoLiveChannels.length < 2) return;
        var next = (cocoLivePosition + delta + cocoLiveChannels.length) % cocoLiveChannels.length;
        cocoStartChannel(cocoLiveChannels[next], false);
    }
    function cocoStopLive() {
        if (!cocoLivePlaying) return false;
        cocoLivePlaying = false;
        ++cocoLiveTicket;
        cocoZapBanner().hidden = true;
        cocoUpdatePlayerButtons();
        g("detail").hidden = true;
        g("scrim").hidden = true;
        document.documentElement.classList.remove("modal-open");
        return true;
    }
    // CH+/CH- LG webOS: 427 / 428. Flechas funcionan si el sistema entrega el evento.
    // Captura: evita que navigation.js mueva el foco durante la reproduccion.
    window.addEventListener("keydown", function(ev) {
        if (!cocoLivePlaying || g("player").hidden && cocoZapBanner().hidden || ev.metaKey || ev.ctrlKey || ev.altKey) return;
        var kc = ev.keyCode || ev.which, key = ev.key || "", step = 0;
        if (kc === 427 || key === "ChannelUp" || key === "PageUp") step = 1;
        else if (kc === 428 || key === "ChannelDown" || key === "PageDown") step = -1;
        else if (kc === 38 || key === "ArrowUp") step = 1;
        else if (kc === 40 || key === "ArrowDown") step = -1;
        if (!step) return;
        ev.preventDefault(); ev.stopPropagation();
        if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
        if (Date.now() - cocoLiveLastKey < 250) return;
        cocoLiveLastKey = Date.now();
        cocoSwitchChannel(step);
    }, true);
    (function() {
        var ui = g("player-ui"); if (!ui) return;
        var block = document.createElement("div"); block.id = "coco-ch-controls"; block.className = "coco-ch-controls"; block.hidden = true;
        var prev = document.createElement("button"); prev.className = "ghost coco-ch-btn"; prev.textContent = "\u25c0 CH-"; prev.setAttribute("aria-label", "Canal anterior"); prev.onclick = function() { cocoSwitchChannel(-1); };
        var txt = document.createElement("span"); txt.id = "coco-ch-label"; txt.className = "coco-ch-name";
        var next = document.createElement("button"); next.className = "ghost coco-ch-btn"; next.textContent = "CH+ \u25b6"; next.setAttribute("aria-label", "Canal siguiente"); next.onclick = function() { cocoSwitchChannel(1); };
        block.appendChild(prev); block.appendChild(txt); block.appendChild(next);
        ui.appendChild(block);
    })();
    function cocoFolderArtworkKey(item) {
  if(item&&item.code==='cactus-external-live')return 'deportes';
  var title = String(item && (item.name || item.title) || "").toLowerCase();
  title = title.replace(/[áà]/g,"a").replace(/[éè]/g,"e").replace(/[íì]/g,"i").replace(/[óò]/g,"o").replace(/[úùü]/g,"u").replace(/ñ/g,"n");
  title = title.replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  if (title === "usa" || title === "ee-uu" || title === "estados-unidos-de-america") title = "estados-unidos";
  if (title === "espana") title = "espana";
  if (title === "tv-gratis" || title === "canales-gratis") title = "vivo-gratis";
  if (title === "cine-series" || title === "peliculas-y-series") title = "cine-y-series";
  if (title === "popular") title = "mas-popular";
  return title;
}
    function le(t) { if(t && window.CactusProgress && !t._continueSection && /^(masnew_movies|masnew_series|masnew_anime)$/.test(y)) t._continueSection=window.CactusProgress.category(t,y); if (!$(t))
        return document.createDocumentFragment(); var n = document.createElement("button"); n.className = "card", document.documentElement.classList.contains("coco-live-view") && (n.className += t.code && !t.contentId && !t.liveAddressList ? " coco-live-folder" : " coco-live-channel"), n._item = t, n.dataset.contentId = t.contentId || t.liveId || t.code || "";
        if (document.documentElement.classList.contains("coco-live-view") && t.code && !t.contentId && !t.liveAddressList) {
            var cocoFolderKey = cocoFolderArtworkKey(t);
            if (/^(?:peru|mexico|chile|colombia|ecuador|venezuela|bolivia|uruguay|paraguay|panama|puerto-rico|espana|costa-rica|estados-unidos|argentina|brasil|republica-dominicana|canada|guatemala|honduras|el-salvador|nicaragua|centroamerica|lista-de-canales|canales|deportes|vivo-gratis|cine-y-series|mas-popular)$/.test(cocoFolderKey)) {
                n.className += " coco-folder-illustrated coco-folder-" + cocoFolderKey;
            }
        }
        var i = document.createElement("div"); i.className = "poster", i.setAttribute("aria-hidden", "true"), i.appendChild(de("span", "poster-letter", (t.name || t.title || "C").slice(0, 1))), t.tmdbPoster && t.contentId && !j[t.contentId] && U(t.contentId, { poster: t.tmdbPoster }); var o = j[t.contentId], r = o && o.poster || De(t); if (r) {
        var l = document.createElement("img");
        l.className = "poster-art", l.alt = "", l.width = 300, l.height = 450, l.loading = "lazy", l.decoding = "async", l.src = r;
        var s = function () { l.remove(), /^anime:/.test(t.contentId || "") && setTimeout(function () { n.isConnected && Je(C); }, 150); };
        l.onerror = function () { var e = De(t); e && l.src !== e ? (l.src = e, l.onerror = s) : s(); }, i.appendChild(l);
    } if (t.position > 0 && t.duration > 0) {
        var d = document.createElement("div");
        d.className = "progress";
        var c = document.createElement("i");
        c.style.width = Math.min(100, t.position / t.duration * 100) + "%", d.appendChild(c), i.appendChild(d);
    } var u = document.createElement("strong"); u.textContent = e.title(t, a.prefs.titles), t.episode > 1 && (u.textContent += " · Ep " + t.episode), n.append(i, u), /^anime:/.test(t.contentId || "") && n.appendChild(de("small", "provider-label", "JKAnime")); var p = e.normalize(t).year, f = [{ movie: "Película", series: "Serie", trailer: "Tráiler" }[e.mediaType(t)], p].filter(Boolean); document.documentElement.classList.contains("coco-live-view") && (f = [t.code && !t.contentId && !t.liveAddressList ? "Explorar canales" : "Canal en vivo"]), f.length && n.appendChild(de("small", "card-meta", f.join(" · "))); if(t.position>5&&t.duration>0)n.appendChild(de("small","continue-time","Continuar · "+dt(t.position))); var m = null; function v() { !t.contentId || /^anime:/.test(t.contentId) || G() || "adult" === e.audience(t) || j["d:" + t.contentId] || (clearTimeout(m), m = setTimeout(function () { var e = C; H(t).then(function (t) { if (e !== C || !n.isConnected)
        return null; var a = t && t.assetData || t; return a && $(a) ? ee("artwork", [a]) : null; }).then(function (a) { a && e === C && n.isConnected && (U("d:" + t.contentId, a), j[t.contentId] || n.querySelector(".poster-art") || (U(t.contentId, a), je([n]))); }).catch(function () { }); }, 350)); } return n.onfocus = v, n.onmouseenter = v, n.onblur = function () { clearTimeout(m); }, n.onmouseleave = function () { clearTimeout(m); }, n.onclick = function () { cocoCurrentLiveView() && cocoIsChannel(t) ? cocoStartChannel(t, true) : t.code && !t.contentId ? Z("1" === t.type && "masnew_live" !== t.code ? "live:" + t.id : t.code, t.name || "Explorar") : st(t); }, n; }
    function se(t, n, a, i, o) { if (o = o || {}, a = a || g("grid"), (n = e.uniqueCards(n.filter($))).length) {
        var r = document.createElement("h3");
        if (r.className = "shelf-title", r.textContent = t, a.appendChild(r), i || o.section) {
            var l = de("button", "shelf-all", "Ver todo");
            l.setAttribute("aria-label", "Ver todo: " + t), l.onclick = function () { if(o.section){if(/^masnew_(movies|series|anime|kids)$/.test(o.section))Z(o.section,t).then(cactusOpenAll);else Z(o.section,t);}else cactusShowCategory(i,t,false); }, r.appendChild(l);
        }
        var s = document.createElement("div");
        s.className = "shelf-row", s.setAttribute("aria-label",t), n.forEach(function (e) { if(o.section && /^(masnew_movies|masnew_series|masnew_anime)$/.test(o.section) && !e._continueSection)e._continueSection=o.section; var t = le(e); s.appendChild(o.continue ? re(t, e, C) : t); });
        if(l){s._shelfAll=l;l._shelfRow=s;var more=de("button","shelf-more","Ver todo →");more.setAttribute("aria-label","Ver todo: "+t);more.onclick=l.onclick;s.appendChild(more);}a.appendChild(s);
    } }
    function de(e, t, n) { var a = document.createElement(e); return t && (a.className = t), null != n && (a.textContent = n), a; }
    function cactusRenderContinue(items) {
        var grid=g("grid"),old=g("cactus-continue"),selected=/^(masnew_movies|masnew_series|masnew_anime)$/.test(y);
        if(old){if(old.contains(document.activeElement))return;old.remove();}
        if(w || x || T.tags || T.year || T.originalCountry || T.audio || !(y==="home"||selected))return;
        items=(items||[]).filter(function(item){return $(item)&&(!selected||window.CactusProgress.category(item)===y);});
        if(!items.length)return;
        var section=de("section","home-shelf cactus-continue");section.id="cactus-continue";section.setAttribute("aria-label","Continuar viendo");
        se("Continuar viendo",items.slice(0,30),section,null,{continue:true});grid.insertBefore(section,grid.firstChild);
    }
    function cactusRefreshContinue(){var version=C;ee("continueList",[]).then(function(items){if(version===C)cactusRenderContinue(items);}).catch(function(){});}
    function cactusResumeDetail(){var item=E;if(!item||cocoIsChannel(item))return;ee("progressGet",[item.contentId]).then(function(p){if(E!==item||!g("player").hidden)return;item._resume=p&&p.position||0;if(p)item.episode=p.episode||1;Ze(item,p);g("play").textContent=p?"▶ Continuar "+dt(p.position)+(item.episode>1?" · Ep "+item.episode:""):"▶ Reproducir";}).catch(function(){});}
    window.addEventListener('cactus-progress-closed',function(){cactusRefreshContinue();cactusResumeDetail();});
    function ce(t) { var n = {}; [].forEach.call(g("grid").querySelectorAll(".card"), function (e) { n[e.dataset.contentId] = !0; }), e.uniqueCards((t || []).filter($)).forEach(function (e) { var t = String(e.contentId || ""); t && n[t] || (t && (n[t] = !0), g("grid").appendChild(le(e))); }); }
    function ue(e) { var t = e.posterList || [], n = t.find(function (e) { return "poster" === e.fileType; }) || t.find(function (e) { return "stage" === e.fileType; }); return n && n.fileUrl; }
    function pe(e, t) { var n = t.logoUrl || t.contentLogo || (t.posterList || []).filter(function (e) { return "logo" === e.fileType; }).map(function (e) { return e.fileUrl; })[0]; "string" == typeof n && /^https?:\/\//.test(n) && ve(e, n, Y(t)); }
    function fe(e) { if (e.classList.contains("text-title") && e.isConnected) {
        e.style.fontSize = "";
        var t = parseFloat(getComputedStyle(e).fontSize), n = document.createRange();
        for (n.selectNodeContents(e); t > 22 && (n.getBoundingClientRect().height > e.clientHeight + 1 || n.getBoundingClientRect().width > e.clientWidth + 1);)
            t -= 2, e.style.fontSize = t + "px";
    } }
    var me = {};
    function ve(e, t, n) { var a = document.createElement("img"); a.className = "content-logo", a.alt = n || "", a.crossOrigin = "anonymous", e._logoUrl = t, a.onload = function () { if (e.isConnected && e._logoUrl === t) {
        if (void 0 === me[t]) {
            var n = !1;
            try {
                var i = document.createElement("canvas");
                i.width = 64, i.height = 32;
                var o = i.getContext("2d");
                o.drawImage(a, 0, 0, 64, 32);
                for (var r = o.getImageData(0, 0, 64, 32).data, l = 0, s = 0, d = 0, c = 0; c < r.length; c += 4)
                    r[c + 3] < 128 || (l++, s += .2126 * r[c] + .7152 * r[c + 1] + .0722 * r[c + 2], d += Math.max(r[c], r[c + 1], r[c + 2]) - Math.min(r[c], r[c + 1], r[c + 2]));
                n = l > 0 && s / l < 85 && d / l < 35;
            }
            catch (e) { }
            me[t] = n;
            var u = Object.keys(me);
            u.length > 80 && delete me[u[0]];
        }
        me[t] && (a.style.filter = "brightness(0) invert(1)"), e.classList.remove("text-title"), e.style.fontSize = "", e.replaceChildren(a);
    } }, a.onerror = function () { }, a.decoding = "async", a.src = t; }
    function he() { S && (clearInterval(S), S = null); }
    function ge(n) {
        return __awaiter(this, void 0, void 0, function () { function m() {
            return __awaiter(this, void 0, void 0, function () { function r(e) { var t = e._art || j["d:" + e.contentId]; return (t && t.logo ? 2 : 0) + (t && t.backdrop || ue(e) ? 1 : 0); } var o; return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        o = t.select(d.filter(function (e) { return e.index >= 0; }).map(function (e) { return e.collection ? e.collection.featured : []; }), 10);
                        return [4 /*yield*/, Promise.race([We(o, n), new Promise(function (e) { setTimeout(e, 2500); })])];
                    case 1:
                        _a.sent(), n === C && function (t) { t = t.filter(function (t) { return "adult" !== e.audience(t); }), he(); var n = g("hero"); if (n.classList.remove("is-loading"), n.replaceChildren(), n.hidden = !t.length, t.length) {
                            var o = de("div", "hero-bg"), r = de("div", "hero-bg hero-bg-previous"), l = de("div", "hero-content"), s = de("div", "hero-dots");
                            n.append(r, o, l, s);
                            var d = 0, c = 0, u = Date.now(), p = !1, f = -8e3, m = !1, v = de("div", "hero-copy"), h = de("div", "hero-actions"), y = de("button", "play", "▶ Reproducir"), b = de("button", "info", "Más información");
                            y.onclick = function () {
                                return __awaiter(this, void 0, void 0, function () { var e; return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            e = t[d];
                                            return [4 /*yield*/, st(e)];
                                        case 1:
                                            _a.sent(), !E || E.contentId !== e.contentId || g("play").disabled || g("play").hidden || gt(E);
                                            return [2 /*return*/];
                                    }
                                }); });
                            }, b.onclick = function () { st(t[d]); }, h.append(y, b), l.append(v, h), n.onkeydown = function () { m = !0, k(); }, n.onpointermove = k, n.onpointerdown = function () { m = !1, k(); }, n.ontouchstart = n.onpointerdown, n.onfocusin = k, n._repaint = function () { var e = u; I(d), u = e; }, n.onmouseleave = k, n.onfocusout = k;
                            var w = de("button", "hero-pause", "Ⅱ");
                            w.setAttribute("aria-label", "Pausar destacados"), w.setAttribute("aria-pressed", "false"), w.onclick = function () { p = !p, w.textContent = p ? "▶" : "Ⅱ", w.setAttribute("aria-label", p ? "Reanudar destacados" : "Pausar destacados"), w.setAttribute("aria-pressed", String(p)), k(); }, s.appendChild(w), t.forEach(function (e, t) { _(t); }), w.hidden = t.length < 2, n._addItems = function (n) { var a = []; return n.forEach(function (n) { t.length >= 5 || "adult" === e.audience(n) || t.some(function (e) { return e.contentId === n.contentId; }) || (t.push(n), a.push(n), _(t.length - 1)); }), w.hidden = t.length < 2, a; };
                            var C = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
                            S = setInterval(function () { if (t.length < 2 || p || document.hidden || a.prefs.reduced || C && C.matches || i.scope() !== document)
                                u = Date.now();
                            else {
                                var e = m;
                                try {
                                    e = e || document.activeElement.matches(":focus-visible");
                                }
                                catch (e) { }
                                if (!i.tv && e && n.contains(document.activeElement))
                                    u = Date.now();
                                else if (!(Date.now() - f < 8e3 || Date.now() - u < 5e3)) {
                                    var o = n.getBoundingClientRect();
                                    o.bottom < 0 || o.top > window.innerHeight ? u = Date.now() : I(d + 1);
                                }
                            } }, 1e3), I(0);
                        } function k() { f = Date.now(), u = f; } function I(i) { u = Date.now(), d = (i + t.length) % t.length; var l = t[d]; n._item = l; var p = l._art || j["d:" + l.contentId] || null, f = p && p.backdrop || ue(l) || oe(l), m = ++c; function h(e) { m === c && n.contains(o) && o._url !== e && (r.style.backgroundImage = o.style.backgroundImage, r.classList.add("on"), o.classList.remove("on"), o._url = e, o.style.backgroundImage = e ? 'url("' + e + '")' : "", setTimeout(function () { m === c && (o.classList.add("on"), r.classList.remove("on")); }, 30)); } if (f && o._url !== f) {
                            var g = new Image;
                            g.onload = function () { h(f); }, g.onerror = function () { var e = ue(l) || oe(l); e && e !== f ? (f = e, g.onerror = function () { h(""); }, g.src = f) : h(""); }, g.src = f;
                        }
                        else
                            f || h(""); if (t.length > 1) {
                            var y = t[(d + 1) % t.length], b = y._art || j["d:" + y.contentId], w = b && b.backdrop || ue(y) || oe(y);
                            w && ((new Image).src = w);
                        } var C = String(e.normalize(l).year || ""), E = e.normalize(l).genres.slice(0, 3).join(" · "); v.replaceChildren(), v.appendChild(de("div", "hero-eyebrow", "DESTACADO")); var S = Y(l).replace(/\s+T1$/, ""), k = de("h2", "hero-title text-title", S); k.setAttribute("aria-label", S), k.classList.toggle("long-title", S.length > 42), p && p.logo ? ve(k, p.logo, S) : pe(k, l), v.appendChild(k), requestAnimationFrame(function () { fe(k); }); var I = de("div", "hero-meta"), _ = e.normalize(l).rating || p && p.rating, T = p && p.rating && 10 === p.rating.scale ? p.rating : _ && 10 === _.scale ? _ : null; T && Number(T.value) >= 8 && I.appendChild(de("span", "match", "Muy bien valorada")), _ && I.appendChild(de("span", "score", e.ratingLabel(_))), /^\d{4}$/.test(C) && I.appendChild(de("span", "", C)); var L = Oe(l.quality); L && I.appendChild(de("span", "badge", L)), l.duration && I.appendChild(de("span", "", l.duration)), E && I.appendChild(de("span", "genres", E)), [l.ageRating || l.classification, Oe(l.language || l.audio)].filter(Boolean).forEach(function (e) { I.appendChild(de("span", "", e)); }), v.appendChild(I); var x = de("p", "secondary-title", "ambos" === a.prefs.titles && l.latinTitle && l.latinTitle !== Y(l) ? l.latinTitle : ""); v.appendChild(x), v.appendChild(de("p", "hero-desc", l.description || p && p.overview || "")), [].forEach.call(s.querySelectorAll(".hero-dot"), function (e, t) { e.setAttribute("aria-current", t === d ? "true" : "false"); }); } function _(e) { var n = de("button", "hero-dot"); n.setAttribute("aria-label", "Destacado " + (e + 1) + ": " + Y(t[e])), n.onclick = function () { k(), I(e); }, s.insertBefore(n, w); } }(o.map(function (e, t) { return { it: e, i: t }; }).sort(function (e, t) { return r(t.it) - r(e.it) || e.i - t.i; }).slice(0, 5).map(function (e) { return e.it; }));
                        return [2 /*return*/];
                }
            }); });
        } function v() {
            return __awaiter(this, void 0, void 0, function () { var e, a, t_1, i; return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(c < d.length && n === C)) return [3 /*break*/, 6];
                        e = d[c++];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ee("getNextColumns", [e.code, 1, e.size])];
                    case 2:
                        a = _a.sent();
                        if (n !== C)
                            return [2 /*return*/];
                        e.collection = t.collect(a, e.code), 0 === e.index && e.collection.recent.length && se("Novedades de cine", e.collection.recent.slice(0, 12), e.target), se(e.label, e.collection.items.slice(0, 18), e.target, null, { section: e.code });
                        return [3 /*break*/, 4];
                    case 3:
                        t_1 = _a.sent();
                        if (n !== C)
                            return [2 /*return*/];
                        e.target.appendChild(de("h3", "shelf-title", e.label)), e.target.appendChild(de("p", "provider-notice", "No se pudo cargar esta selección."));
                        i = de("button", "", "Volver a intentar");
                        i.onclick = function () { we(!1); }, e.target.appendChild(i);
                        return [3 /*break*/, 4];
                    case 4:
                        e.ready = !0, !u && d.every(function (e) { return e.index < 0 || e.ready; }) && (u = m()), Je(n);
                        _a.label = 5;
                    case 5: return [3 /*break*/, 0];
                    case 6: return [2 /*return*/];
                }
            }); });
        } var o, r, l, s, d, c, u, p, f, e_2; return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    he(), g("hero").replaceChildren(), g("hero").hidden = !1, g("hero").classList.add("is-loading");
                    o = Object.keys(V).filter(function (e) { return "string" == typeof V[e] && J[e]; });
                    return [4 /*yield*/, Promise.all([ee("continueList", []).catch(function () { return []; }), ee("favList", []).catch(function () { return []; })])];
                case 1:
                    r = _a.sent();
                    if (!(n === C)) return [3 /*break*/, 8];
                    l = r[0] || [], s = r[1] || [];
                    cactusRenderContinue(l), s.length && se("Mi lista", s, null, null, { section: "lib:fav" });
                    d = [["Películas", "masnew_movies"], ["Series", "masnew_series"], ["Anime y animación", "masnew_anime"], ["Kids", "masnew_kids"]].map(function (e, t) { return { label: e[0], code: e[1], size: 5, index: t }; }).concat(o.map(function (e) { return { label: V[e], code: e, size: 3, index: -1 }; })), c = 0;
                    d.forEach(function (e) { e.target = de("section", "home-shelf"), e.target.setAttribute("aria-label", e.label), g("grid").appendChild(e.target); });
                    u = null;
                    return [4 /*yield*/, Promise.all([v(), v()])];
                case 2:
                    if (!(_a.sent(), n === C)) return [3 /*break*/, 8];
                    p = d.map(function (e) { return e.collection ? e.collection.featured : []; });
                    se("Valoradas en el catálogo", e.uniqueCards([].concat.apply([], p)).filter(function (e) { return Number(e.score) > 0; }).sort(function (e, t) { return Number(t.score) - Number(e.score); }).slice(0, 12)), u || (u = m());
                    return [4 /*yield*/, u];
                case 3:
                    if (!(_a.sent(), n === C)) return [3 /*break*/, 8];
                    Je(n);
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, ee("getSection", ["masnew_live", 1, 48])];
                case 5:
                    f = _a.sent();
                    if (n !== C)
                        return [2 /*return*/];
                    se("En vivo", ae(f, function (e) { return !!(e.liveAddressList || e.code && e.name); }));
                    return [3 /*break*/, 7];
                case 6:
                    e_2 = _a.sent();
                    return [3 /*break*/, 7];
                case 7:
                    Je(n);
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        }); });
    }
    function ye() { var e = A[y], t = x || !!(T.tags || T.year || T.originalCountry || T.audio); g("viewAll").textContent = cactusAllLabel()+(e?" · "+e.toLocaleString("es-419"):""), "masnew_adult" === y && (g("viewAll").textContent = "Catálogo por categoría"), g("viewShelves").textContent = "masnew_adult" === y ? "Categorías" : "Destacado", g("viewAll").setAttribute("aria-pressed", String(t)), g("viewShelves").setAttribute("aria-pressed", String(!t)); }
    function be() { O="";cactusShelfTitle="";cactusCatalogAll=false; T = { tags: g("fGenre").value, year: g("fYear").value, originalCountry: g("fCountry").value, audio: g("fAudio").value }, b = 1, ye(), we(!1); }
    function we(t) {
        return __awaiter(this, void 0, void 0, function () {
            var n, o, r, l, s, d, c, u, p, f, v, h, E, S, k, I, _, z, j, U, B, F, H, K, V, J, _a, W, Q, X, ie, oe, _b, ue, pe, _c, fe, me, ve, be, Ee, Se, ke, e_3, Ie;
            var _d;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        m && m.stop();
                        n = ++C, o = document.activeElement, r = t ? Array.from(g("grid").querySelectorAll(".card")) : [];
                        M = !0, R = null, g("more").hidden = !t, g("retry").hidden = !0, t || (Ve && Ve.disconnect(), He = "function" == typeof WeakSet ? new WeakSet : null, g("grid").replaceChildren());
                        l = "home" === y && !w;
                        document.body.classList.toggle("home-view", l), document.documentElement.classList.toggle("coco-live-view", !w && ("masnew_live" === y || 0 === y.indexOf("live:"))), g("home-brand").hidden = !l;
                        s = !w && ("lib:fav" === y || "lib:continue" === y || "adult:fav" === y || "adult:continue" === y), d = "animeonline" === y, c = "downloads" === y && !w, u = !(c || d || w || s || l || "masnew_live" === y || 0 === y.indexOf("live:")), p = T.tags || T.year || T.originalCountry || T.audio, f = u && (p || x);
                        l || (he(), g("hero").hidden = !0, g("hero").replaceChildren());
                        v = G() ? "Buscar en Adultos" : d ? "Buscar en JKAnime" : "Buscar películas y series";
                        g("search").querySelector("label").textContent = v, g("query").placeholder = v;
                        S = g("anime-tools"), k = y + ":" + String(!!w);
                        if (S && S.dataset.view !== k && (S.remove(), S = null), !S && ("masnew_anime" === y || d)) {
                            if ((S = de("div", "anime-tools")).id = "anime-tools", S.dataset.view = k, S.setAttribute("role", "group"), S.setAttribute("aria-label", "Catálogos de anime"), [["Catálogo de animación", "masnew_anime"], ["JKAnime", "animeonline"]].forEach(function (e) { var t = de("button", "", e[0]); t.setAttribute("aria-pressed", String(y === e[1])), t.onclick = function () { Z(e[1], e[0]); }, S.appendChild(t); }), d && !w) {
                                I = de("label", "", "Mostrar "), _ = de("select");
                                _.id = "anime-type", _.setAttribute("aria-label", "Contenido de JKAnime"), [["", "Todo el catálogo"], ["peliculas", "Películas"], ["animes", "Series"], ["especiales", "Especiales"], ["ovas", "OVA"], ["onas", "ONA"], ["latest", "Novedades"]].forEach(function (e) { var t = de("option", "", e[1]); t.value = e[0], _.appendChild(t); }), _.value = P, _.onchange = function () { P = _.value; var e = g("anime-filters"); e && (e.hidden = "latest" === P), b = 1, we(!1); }, I.appendChild(_), S.appendChild(I);
                                z = de("div", "anime-filters");
                                z.id = "anime-filters", z.hidden = "latest" === P, S.appendChild(z), h = z, E = q ? Promise.resolve(q) : ee("animeFilters", []).then(function (e) { return q = e || {}; }), E.then(function (e) { document.body.contains(h) && (Qe.forEach(function (t) { var n = e[t[0]]; if (n && n.length) {
                                    var a = de("label", "", t[1] + " "), i = de("select");
                                    i.setAttribute("aria-label", t[1] + " en JKAnime");
                                    var o = de("option", "", t[2]);
                                    o.value = "", i.appendChild(o), n.forEach(function (e) { var t = de("option", "", Xe[e.value] || e.label); t.value = e.value, i.appendChild(t); }), i.value = N[t[0]] || "", i.onchange = function () { i.value ? N[t[0]] = i.value : delete N[t[0]], clearTimeout(D), D = setTimeout(function () { b = 1, we(!1); }, 450); }, a.appendChild(i), h.appendChild(a);
                                } }), i && i.ensure()); }).catch(function () { });
                            }
                            g("grid").before(S);
                        }
                        j = g("adult-tools");
                        if (j && !G() && (j.remove(), j = null), G() && !j) {
                            U = de("div", "adult-tools");
                            U.id = "adult-tools", [["Explorar", "masnew_adult"], ["Mi lista", "adult:fav"]].forEach(function (e) { var t = de("button", "", e[0]); t.onclick = function () { Z(e[1], e[0]); }, U.appendChild(t); }), g("grid").before(U);
                        }
                        g("pageTitle").hidden = l, g("search-summary").hidden = !w, g("search-summary").textContent = w ? "Para «" + w + "»" : "", g("grid").classList.toggle("shelves", l || u && !f), g("filters").hidden = !0, g("clearFilters").hidden = !(u && p), t || (g("status").hidden = !0), ne(!0, t);
                        B = "masnew_adult" === y;
                        ["fGenre", "fYear", "fCountry", "fAudio"].forEach(function (e) { g(e).parentElement.hidden = B||!!O&&!cactusCatalogAll; });
                        F = g("adult-category");
                        if (!(!F || B && f || (F.remove(), F = null), u && !B ? function (t) {
                            return __awaiter(this, void 0, void 0, function () { function a(t, n, a, i) { var o = g(t); o.replaceChildren(); var r = document.createElement("option"); r.value = "", r.textContent = i, o.appendChild(r), (n || []).forEach(function (n) { var i = a ? n[a] : n, r = "key" === a ? n.value : n, l = document.createElement("option"); l.value = i, l.textContent = "fGenre" === t ? e.genre(r) : r, o.appendChild(l); }), o.value = ""; } var n, e_4; return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(ye(), L !== t)) return [3 /*break*/, 5];
                                        L = t, T = { tags: "", year: "", originalCountry: "", audio: "" };
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, ee("filterOptions", [t])];
                                    case 2:
                                        n = _a.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_4 = _a.sent();
                                        n = {};
                                        return [3 /*break*/, 4];
                                    case 4:
                                        L === t && (a("fGenre", n.tags, null, "Todos"), a("fYear", n.year, null, "Todos"), a("fCountry", n.originalCountry, null, "Todos"), a("fAudio", n.audio, "key", "Todos"));
                                        _a.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            }); });
                        }(y) : ye(), n === C)) return [3 /*break*/, 29];
                        g("filters").hidden = !u, document.querySelectorAll("nav button").forEach(function (e) { e.setAttribute("aria-current", (e.dataset.code === y || d && "masnew_anime" === e.dataset.code) && !w ? "page" : "false"); });
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 27, 28, 29]);
                        H = "masnew_live" === y || 0 === y.indexOf("live:");
                        if (!c) return [3 /*break*/, 3];
                        return [4 /*yield*/, m.render(g("grid"), { api: ee, el: de, title: Y, current: function () { return n === C; }, play: Ye })];
                    case 2:
                        if (_f.sent(), n !== C)
                            return [2 /*return*/];
                        g("status").hidden = !0, g("more").hidden = !0;
                        return [3 /*break*/, 26];
                    case 3:
                        if (!l) return [3 /*break*/, 5];
                        return [4 /*yield*/, ge(n)];
                    case 4:
                        if (_f.sent(), n !== C)
                            return [2 /*return*/];
                        g("status").hidden = !0, g("more").hidden = !0, g("grid").querySelector(".card") || g("grid").querySelector(".provider-notice") || (te("Todavía no hay contenido", "No hay títulos disponibles para mostrar en Inicio."), R = function () { return we(!1); }, g("retry").hidden = !1);
                        return [3 /*break*/, 26];
                    case 5:
                        if (!s) return [3 /*break*/, 7];
                        return [4 /*yield*/, ee(/:fav$/.test(y) ? "favList" : "continueList", [])];
                    case 6:
                        K = _f.sent();
                        if (n !== C)
                            return [2 /*return*/];
                        V = /:continue$/.test(y);
                        (K = (K || []).filter($)).forEach(function (e) { var t = le(e); V && e.contentId ? g("grid").appendChild(re(t, e, n)) : g("grid").appendChild(t); }), g("status").hidden = (K || []).length > 0, (K || []).length || te(/:fav$/.test(y) ? "Tu lista está vacía" : "Nada que continuar", /:fav$/.test(y) ? "Marca títulos con ★ para guardarlos aquí." : "Lo que empieces a ver aparecerá aquí para retomarlo."), g("more").hidden = !0;
                        return [3 /*break*/, 26];
                    case 7:
                        if (!d) return [3 /*break*/, 12];
                        if (!w) return [3 /*break*/, 9];
                        _d = {};
                        return [4 /*yield*/, ee("animeSearch", [w])];
                    case 8:
                        _a = (_d.items = _f.sent(), _d.hasMore = !1, _d);
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, ee("animeBrowse", [b, { mode: "latest" === P ? "latest" : "directory", type: "latest" === P ? "" : P, filters: "latest" === P ? null : N }])];
                    case 10:
                        _a = _f.sent();
                        _f.label = 11;
                    case 11:
                        J = _a;
                        if (n !== C)
                            return [2 /*return*/];
                        ce(J.items), g("status").hidden = !!g("grid").querySelector(".card"), g("status").hidden || te(w ? "Sin resultados" : "Sin títulos disponibles", w ? "No se encontraron títulos en JKAnime." : "El proveedor no devolvió títulos en esta página."), g("more").hidden = !J.hasMore;
                        return [3 /*break*/, 26];
                    case 12:
                        if (!w) return [3 /*break*/, 14];
                        1 !== b || G() || Ce(w, n, !1);
                        return [4 /*yield*/, ee("search", [w, b, 30, { translate: !1 }])];
                    case 13:
                        W = _f.sent();
                        if (n !== C)
                            return [2 /*return*/];
                        Q = W.alsoKnownAs;
                        delete W.alsoKnownAs;
                        X = e.uniqueCards(ae(W, function (e) { return !(!e.contentId && !e.liveAddressList); }).filter($));
                        X.forEach(function (e) { g("grid").appendChild(le(e)); }), (Q || []).forEach(function (t) { var n = e.uniqueCards((t.resourceList || []).filter($)); n.length && (X = X.concat(n), g("grid").appendChild(de("p", "search-more", "También en el catálogo como «" + t.term + "»")), n.forEach(function (e) { g("grid").appendChild(le(e)); })); }), g("status").hidden = X.length > 0 || t || !!g("grid").querySelector(".anime-results .card"), X.length || t || g("grid").querySelector(".anime-results .card") || te("Sin resultados", "No se encontraron títulos para «" + w + "».");
                        ie = function (e) { var t = 0; return ["programResult", "seriesResult", "resourceResult"].forEach(function (n) { var a = e && e[n]; a && Number(a.totalSize) > 0 && (t += Number(a.totalSize)); }), t; }(W);
                        g("more").hidden = ie ? 30 * b >= ie : X.length < 30, 1 !== b || G() || !1 === a.prefs.translate || function (e, t) {
                            return __awaiter(this, void 0, void 0, function () { var n, a, i, e_5; return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        n = de("section", "search-alternates");
                                        n.setAttribute("aria-label", "Otros títulos"), n.appendChild(de("p", "muted", "Buscando también por títulos alternativos…")), g("grid").appendChild(n);
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, ee("searchAlternates", [e])];
                                    case 2:
                                        a = _a.sent();
                                        if (t !== C)
                                            return [2 /*return*/];
                                        n.replaceChildren();
                                        i = {};
                                        [].forEach.call(g("grid").querySelectorAll(".card"), function (e) { i[e.dataset.contentId] = !0; }), (a || []).forEach(function (e) { var t = (e.resourceList || []).filter(function (e) { return !(!$(e) || i[e.contentId]) && (i[e.contentId] = !0, !0); }); if (t.length) {
                                            n.appendChild(de("p", "search-more", "También en el catálogo como «" + e.term + "»"));
                                            var a = de("div", "anime-grid");
                                            t.forEach(function (e) { a.appendChild(le(e)); }), n.appendChild(a);
                                        } }), n.querySelector(".card") ? (g("status").hidden = !0, Je(t)) : n.remove();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_5 = _a.sent();
                                        t === C && n.remove();
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            }); });
                        }(w, n), 1 === b && ie && ie <= 30 && function (e, t, n) {
                            return __awaiter(this, void 0, void 0, function () { var a, i, e_6, o, r, l; return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (t.length < 2)
                                            return [2 /*return*/];
                                        i = function (e, t) { var n = {}, a = {}; return ut(e).split(/[^a-z0-9]+/).forEach(function (e) { e && (n[e] = !0); }), t.forEach(function (e) { var t = {}; ut(e.name || e.title || "").split(/[^a-z0-9]+/).forEach(function (e) { e.length < 4 || n[e] || t[e] || (t[e] = !0, a[e] = (a[e] || 0) + 1); }); }), Object.keys(a).filter(function (e) { return a[e] > 1; }).sort(function (e, t) { return a[t] - a[e]; })[0] || null; }(e, t);
                                        if (!i)
                                            return [2 /*return*/];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, ee("search", [i, 1, 60])];
                                    case 2:
                                        a = _a.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_6 = _a.sent();
                                        return [2 /*return*/];
                                    case 4:
                                        if (n !== C)
                                            return [2 /*return*/];
                                        o = ae(a, function (e) { return !(!e.contentId && !e.liveAddressList); }).filter($), r = {};
                                        if (t.forEach(function (e) { r[e.contentId] = !0; }), 2 * o.filter(function (e) { return r[e.contentId]; }).length < t.length)
                                            return [2 /*return*/];
                                        l = o.filter(function (e) { return !r[e.contentId]; });
                                        if (!l.length)
                                            return [2 /*return*/];
                                        g("grid").appendChild(de("p", "search-more", l.length + (1 === l.length ? " título más, guardado en el catálogo como «" : " títulos más, guardados en el catálogo como «") + i + "»")), l.forEach(function (e) { g("grid").appendChild(le(e)); });
                                        return [2 /*return*/];
                                }
                            }); });
                        }(w, X, n);
                        return [3 /*break*/, 26];
                    case 14:
                        if(!t&&!w&&u&&!f&&!G())cactusRefreshContinue();
                        if (!H) return [3 /*break*/, 19];
                        if (!(0 === y.indexOf("live:"))) return [3 /*break*/, 16];
                        return [4 /*yield*/, ee("getChannels", [{ columnId: Number(y.slice(5)), pageNum: b, pageSize: 48 }])];
                    case 15:
                        _b = _f.sent();
                        return [3 /*break*/, 18];
                    case 16: return [4 /*yield*/, ee("getSection", [y, b, 48])];
                    case 17:
                        _b = _f.sent();
                        _f.label = 18;
                    case 18:
                        oe = _b;
                        if (n !== C)
                            return [2 /*return*/];
                        ue = ae(oe, function (e) { return !!(e.contentId || e.liveAddressList || e.code && e.name); });
                        ue.forEach(function (e) { g("grid").appendChild(le(e)); }), g("status").hidden = ue.length > 0 || t, ue.length || t || te("Todavía no hay contenido", "El servicio no devolvió canales."), g("more").hidden = !0;
                        return [3 /*break*/, 26];
                    case 19:
                        if (!f) return [3 /*break*/, 24];
                        if (!(B||O)) return [3 /*break*/, 21];
                        return [4 /*yield*/, function (e) {
                                return __awaiter(this, void 0, void 0, function () { var t, n_1; return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            t = C;
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, ee("getCategoryContents", [y, O, b, 48])];
                                        case 2: return [2 /*return*/, _a.sent()];
                                        case 3:
                                            n_1 = _a.sent();
                                            if (t !== C || !B || !O || e || !/categoría.*no.*disponible/i.test(n_1.message || ""))
                                                throw n_1;
                                            return [2 /*return*/, (O = "", b = 1, ee("getCategoryContents", [y, "", 1, 48]))];
                                        case 4: return [2 /*return*/];
                                    }
                                }); });
                            }(t)];
                    case 20:
                        _c = _f.sent();
                        return [3 /*break*/, 23];
                    case 21: return [4 /*yield*/, ee("filterContent", [y, { tags: T.tags, year: T.year, originalCountry: T.originalCountry, audio: T.audio, pageNum: b, pageSize: 48 }])];
                    case 22:
                        _c = _f.sent();
                        _f.label = 23;
                    case 23:
                        pe = _c;
                        if (n !== C)
                            return [2 /*return*/];
                        if (B) {
                            O = pe.category;
                            fe = F || de("label", "", "Categoría ");
                            fe.id = "adult-category";
                            me = fe.querySelector("select") || de("select");
                            me.id = "adult-category-select", me.setAttribute("aria-label", "Categoría de Adultos"), me.replaceChildren(), (pe.categories || []).forEach(function (e) { var t = de("option", "", e.name); t.value = e.code, me.appendChild(t); }), me.value = O, me.onchange = function () { O = me.value, b = 1, we(!1); }, fe.appendChild(me);
                            ve = fe.querySelector(".muted");
                            ve && ve.remove(), null != pe.totalSize && fe.appendChild(de("span", "muted", " " + Number(pe.totalSize).toLocaleString("es-419") + " títulos")), g("filters").appendChild(fe);
                        }
                        be = e.uniqueCards(e.sectionItems(pe && pe.assetList, y)).filter($);
                        pe && pe.totalSize && !p && (!O||cactusCatalogAll) && (A[y] = Number(pe.totalSize), ye()), ce(be), g("status").hidden = be.length > 0 || t, g("more").hidden = null != pe.hasMore ? !pe.hasMore : null != pe.totalSize ? 48 * b >= Number(pe.totalSize) : (pe.assetList || []).length < 48, be.length || t || te("Sin resultados", g("more").hidden ? "Ningún título con esos filtros. Prueba otra combinación." : "Esta página no contiene títulos para esta selección. Usa Cargar más para continuar.");
                        return [3 /*break*/, 26];
                    case 24:
                        "masnew_anime" === y && 1 === b && Ce("", n, !0);
                        Ee = 4; // Primera tanda de filas; el total del catálogo es solo un contador.
                        return [4 /*yield*/, ee("getNextColumns", [y, b, Ee])];
                    case 25:
                        Se = _f.sent();
                        if (n !== C)
                            return [2 /*return*/];
                        ke = Se && Se.recommendList || [];
                        ie = 0;
                        ke.forEach(function (t) { var n = e.sectionItems(t.assetList, y).filter($).slice(0, 18); ie += n.length, se(t.name || t.alias || "", n, null, t.code || null); }), g("status").hidden = ie > 0 || t || !!g("grid").querySelector(".anime-results .card"), ie || t || g("grid").querySelector(".anime-results .card") || te("Todavía no hay contenido", "El servicio no devolvió títulos para esta sección."), g("more").hidden = !ke.length || (null != Se.totalSize ? b * Ee >= Number(Se.totalSize) : ke.length < Ee), u && !B && "masnew_series" !== y && void 0 === A[y] && function (e) {
                            return __awaiter(this, void 0, void 0, function () { var t, t_2; return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        A[e] = null;
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, ee("filterContent", [e, { tags: "", year: "", originalCountry: "", audio: "", pageNum: 1, pageSize: 1 }])];
                                    case 2:
                                        t = _a.sent();
                                        A[e] = Number(t && t.totalSize) || null;
                                        return [3 /*break*/, 4];
                                    case 3:
                                        t_2 = _a.sent();
                                        A[e] = null;
                                        return [3 /*break*/, 4];
                                    case 4:
                                        y === e && ye();
                                        return [2 /*return*/];
                                }
                            }); });
                        }(y);
                        _f.label = 26;
                    case 26: return [3 /*break*/, 29];
                    case 27:
                        e_3 = _f.sent();
                        if (n !== C)
                            return [2 /*return*/];
                        R = function () { return we(t); }, g("more").hidden = !0, te(d ? "JKAnime no está disponible" : "No se pudo cargar la biblioteca", e_3.message), g("retry").hidden = !1;
                        return [3 /*break*/, 29];
                    case 28:
                        if (n === C) {
                            if (M = !1, ne(!1, t), t && (o === g("more") || o === g("retry")) && (document.activeElement === o || document.activeElement === document.body)) {
                                Ie = Array.from(g("grid").querySelectorAll(".card")).find(function (e) { return r.indexOf(e) < 0; });
                                i.focus(R ? g("retry") : Ie || (g("more").hidden ? r[r.length - 1] : g("more")));
                            }
                            i.ensure(), Je(n);
                        }
                        return [7 /*endfinally*/];
                    case 29: return [2 /*return*/];
                }
            });
        });
    }
    function Ce(t, n, a) {
        return __awaiter(this, void 0, void 0, function () {
            var i, o, r, _a, l, s, e_7, d;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        i = de("section", "anime-results");
                        i.setAttribute("aria-label", "JKAnime");
                        o = de("p", "muted", "Consultando JKAnime…");
                        i.appendChild(o), g("grid").appendChild(i);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 7]);
                        if (!t) return [3 /*break*/, 3];
                        _b = {};
                        return [4 /*yield*/, ee("animeSearch", [t])];
                    case 2:
                        _a = (_b.items = _c.sent(), _b);
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, ee("animeBrowse", [1, { mode: "latest" }])];
                    case 4:
                        _a = _c.sent();
                        _c.label = 5;
                    case 5:
                        r = _a;
                        if (n !== C)
                            return [2 /*return*/];
                        l = e.uniqueCards((r.items || []).filter($));
                        if (i.replaceChildren(), !l.length)
                            return [2 /*return*/, void i.remove()];
                        i.appendChild(de("h3", "shelf-title", "JKAnime"));
                        s = de("div", a ? "shelf-row" : "anime-grid");
                        l.forEach(function (e) { s.appendChild(le(e)); }), i.appendChild(s), g("status").hidden = !0, r.pending && function (e, t, n) {
                            return __awaiter(this, void 0, void 0, function () { var a, i, e_8; return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, ee("animeBrowse", [e, { wait: !0 }])];
                                    case 1:
                                        a = _a.sent();
                                        if (t !== C)
                                            return [2 /*return*/];
                                        i = {};
                                        (a.items || []).forEach(function (e) { i[e.contentId] = e; }), [].forEach.call((n || g("grid")).querySelectorAll(".card"), function (e) { var t = e._item, n = t && i[t.contentId]; if (n && JSON.stringify(n) !== JSON.stringify(t)) {
                                            var a = document.activeElement === e, o = le(n);
                                            e.replaceWith(o), a && o.focus({ preventScroll: !0 });
                                        } });
                                        return [3 /*break*/, 3];
                                    case 2:
                                        e_8 = _a.sent();
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            }); });
                        }(1, n, s), Je(n);
                        return [3 /*break*/, 7];
                    case 6:
                        e_7 = _c.sent();
                        if (n !== C)
                            return [2 /*return*/];
                        o.textContent = /^JKAnime\b/.test(e_7.message) ? e_7.message : "JKAnime: " + e_7.message, o.className = "provider-notice";
                        d = de("button", "", "Volver a intentar");
                        d.onclick = function () { i.remove(), Ce(t, n, a); }, i.appendChild(d);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function Ee() { if(window.CactusExternalPlayer)window.CactusExternalPlayer.stop(); if(window.CactusProgress)window.CactusProgress.suspend(); ["audio","subs"].forEach(function(id){var select=g(id);select.replaceChildren();select.parentElement.hidden=true;}); clearTimeout(cactusAutoTimer); cactusAutoTimer = null; if (cactusCompletionListener) { g("video").removeEventListener("ended", cactusCompletionListener); cactusCompletionListener = null; } if (window.CactusVODBrowser) window.CactusVODBrowser.stop(); if (window.CactusAVPlay) window.CactusAVPlay.stop(); if (_) {
        var e = _;
        _ = null, e.cleanup && e.cleanup(), vt({ action: "stop" });
    } if (h && (clearTimeout(h), h = null), k && (clearTimeout(k), k = null), I && (clearInterval(I), I = null), v) {
        var t = v;
        v = null, ee("playStop", [t]).catch(function () { });
    } var n = g("video"); n._trackCleanup && n._trackCleanup(), n._captions && (n._captions.destroy(), n._captions = null); try {
        n.pause();
    }
    catch (e) { } n._progressCleanup && n._progressCleanup(), n._watchCleanup && n._watchCleanup(), n._autoNextCleanup && n._autoNextCleanup(), ke(), n._hls && (n._hls.destroy(), n._hls = null), n.querySelectorAll("track").forEach(function (e) { e.remove(); }), n.removeAttribute("src"), n.load(), ke(), Se(), g("player").hidden = !0, yt(!1), document.documentElement.classList.toggle("modal-open", !g("detail").hidden), g("vspin").hidden = !0, g("tracks").hidden = !0, g("pip").hidden = !0, function () { Ae = {}, Te && (clearTimeout(Te), Te = null); Pe(); }(), Le(), g("play-status").textContent = ""; }
    function Se() { try {
        document.fullscreenElement ? document.exitFullscreen() : document.webkitFullscreenElement && document.webkitExitFullscreen();
    }
    catch (e) { } }
    function ke() { var e = g("video"); window.CactusClassicNativePip && window.webkit.messageHandlers.cactus-classicPip.postMessage("exit"); try {
        document.pictureInPictureElement === e ? document.exitPictureInPicture().catch(function () { }) : "picture-in-picture" === e.webkitPresentationMode && e.webkitSetPresentationMode("inline");
    }
    catch (e) { } }
    g("viewAll").onclick = cactusOpenAll, g("viewShelves").onclick = function () { var e = T.tags || T.year || T.originalCountry || T.audio; (x || e || O) && (O="",cactusShelfTitle="",cactusCatalogAll=false,g("heading").textContent=cactusSectionName(),x = !1, ["fGenre", "fYear", "fCountry", "fAudio"].forEach(function (e) { g(e).value = ""; }), T = { tags: "", year: "", originalCountry: "", audio: "" }, b = 1, ye(), window.scrollTo(0, 0), we(!1)); }, ["fGenre", "fYear", "fCountry", "fAudio"].forEach(function (e) { var t = g(e); t && (t.onchange = be); }), g("clearFilters").onclick = function () { ["fGenre", "fYear", "fCountry", "fAudio"].forEach(function (e) { g(e).value = ""; }), T = { tags: "", year: "", originalCountry: "", audio: "" }, b = 1, ye(), we(!1); };
    var Ie = null, _e = !1, Te = null;
    function Le() { Ie && (clearTimeout(Ie), Ie = null), g("player").classList.remove("idle"); }
    function xe() { Le(), g("player").hidden || _e || (Ie = setTimeout(function () { _e || g("video").paused || !g("video").videoWidth || g("player").classList.add("idle"); }, 3e3)); }
    var Ae = {};
    function Pe() { var e = Object.keys(Ae), t = g("player-note"); t.replaceChildren(), e.forEach(function (e) { t.appendChild(de("span", "note-line", Ae[e])); }), t.hidden = !e.length; }
    function Ne(e, t, n) { t ? Ae[e] = t : delete Ae[e], Pe(), t && !n && (Te && clearTimeout(Te), Te = setTimeout(function () { Te = null, delete Ae[e], Pe(); }, 6e3)); }
    function qe(e) { var t = /(\d+)\s*[*x×]\s*(\d+)/i.exec(e && e.size || ""); return t ? Number(t[1]) : 0; }
    function De(e) { var t = e.posterList || [], n = t.filter(function (e) { return "icon" === e.fileType; }), a = n.filter(function (e) { return qe(e) >= 200; })[0] || t.filter(function (e) { return "poster" === e.fileType && qe(e) >= 200; })[0] || t.filter(function (e) { return "poster" === e.fileType || "stage" === e.fileType; })[0] || n[0]; return a && a.fileUrl || oe(e); }
    function Oe(e) { return "string" != typeof e || /^\d+$/.test(e) ? null : e; }
    function Me(t) { var n = g("detail-extra"); n.replaceChildren(); var i = e.languages(t.audioInfo), o = e.languages(t.subsInfo); function r(e) { return e.map(function (e) { return e.label; }).join(" · "); } [["Duración", t.duration], ["Clasificación", t.ageRating || t.classification], ["País", Oe(t.originalCountry)], ["Audio · catálogo", r(i) || Oe(t.language || t.audio)], ["Subtítulos · catálogo", r(o)], ["Calidad", Oe(t.quality)], ["Dirección", t.director], ["Reparto", t.actorDisplay]].forEach(function (e) { if (e[1]) {
        var t = de("div", "fact");
        t.append(de("span", "fact-k", e[0]), de("span", "fact-v", String(e[1]))), n.appendChild(t);
    } }), n.hidden = !n.childNodes.length, n.parentElement.hidden = n.hidden, g("detail").querySelector(".detail-body").classList.toggle("no-facts", n.hidden), function (t, n) { function i(t, n, i) { var o = a.prefs["prefSubs" === t ? "subs" : "audio"], r = "prefSubs" === t ? [n,["es","Español · preferido"],["en","Inglés · preferido"],["auto","El primero disponible"]] : [n,["es","Español · preferido"],["en","Inglés · preferido"]]; i.forEach(function (e) { if(!r.some(function(v){return v[0]===e.code;}))r.push([e.code, e.label]); }); var l = g(t); l.replaceChildren(), r.forEach(function (e) { var t = document.createElement("option"); t.value = e[0], t.textContent = e[1], l.appendChild(t); }); var s = r.filter(function (e) { return e[0] === o; })[0] || r.filter(function (t) { return i.some(function (n) { return n.code === t[0] && n.label === e.language(o); }); })[0]; l.value = s ? s[0] : n[0]; } i("prefSubs", ["off", "Desactivados"], n), i("prefAudio", ["original", "Predeterminado del vídeo"], t); }(i, o); }
    function Re(t) { if ($(t)) {
        var n = t._art || j["d:" + t.contentId] || j[t.contentId] || null, i = g("detailBg"), o = n && n.backdrop || ue(t) || De(t), l = r, s = i._version = (i._version || 0) + 1;
        i.dataset.contentId !== String(t.contentId) && (i.style.backgroundImage = "", i.classList.remove("on"), i.dataset.contentId = String(t.contentId)), g("detail-title")._logoUrl = "", g("detail-title").textContent = Y(t), n && n.logo ? ve(g("detail-title"), n.logo, Y(t)) : pe(g("detail-title"), t);
        var d = e.normalize(t);
        if (g("detail-original").textContent = "ambos" === a.prefs.titles && d.latinTitle && d.latinTitle !== Y(t) ? d.latinTitle : d.originalTitle && d.originalTitle !== Y(t) ? "Título original: " + d.originalTitle : "", Me(t), g("anime-version").hidden = !/^anime:/.test(t.contentId || ""), g("play-prefs").hidden = /^anime:/.test(t.contentId || ""), o) {
            var c = new Image;
            c.onload = function () { l !== r || s !== i._version || g("detail").hidden || (i.style.backgroundImage = 'url("' + o + '")', i.classList.add("on")); }, c.onerror = function () { var e = ue(t) || De(t); l === r && s === i._version && e && e !== o && (c.onerror = null, c.src = e, o = e); }, c.src = o;
        }
        var u = g("detail-meta");
        u.replaceChildren();
        var p = e.normalize(t).rating || n && n.rating;
        p && (u.appendChild(de("span", "score", e.ratingLabel(p))), p.votes && u.appendChild(de("span", "", Number(p.votes).toLocaleString("es-419") + " votos")));
        var f = String(e.normalize(t).year || "");
        /^\d{4}$/.test(f) && u.appendChild(de("span", "", f));
        var m = t.liveAddressList ? "En vivo" : "0" === String(t.type) || "teleplay" === t.programType ? "Serie" : "Película";
        u.appendChild(de("span", "tag", m)), e.normalize(t).genres.slice(0, 4).forEach(function (e) { u.appendChild(de("span", "genres", e.trim())); });
    } }
    function ze(e) { return { contentId: e.contentId, name: e.name || e.title, title: e.title, alias: e.alias, originalTitle: e.originalTitle, releaseTime: e.releaseTime, year: e.year, type: e.type, programType: e.programType, mediaType: e.mediaType, kind: e.kind, keyWords: e.keyWords, seriesTitle: e.seriesTitle, provider: e.provider }; }
    function je(e) { e.forEach(function (e) { var t = e._item, n = t && j[t.contentId]; if (n && n.poster) {
        var a = e.querySelector(".poster");
        if (a && a._artPending !== n.poster) {
            var i = a.querySelector(".poster-art:not(.is-leaving)");
            if (!i || i.dataset.artApplied !== n.poster && i.src !== n.poster) {
                a._artPending = n.poster;
                var o = document.createElement("img");
                o.className = "poster-art is-entering", o.alt = "", o.decoding = "async", o.dataset.artApplied = n.poster, o.onload = function () { a._artPending === n.poster && (a._artPending = null, a.appendChild(o), requestAnimationFrame(function () { o.classList.remove("is-entering"); }), i && (i.classList.add("is-leaving"), setTimeout(function () { i.remove(); }, 400))); }, o.onerror = function () { a._artPending === n.poster && (a._artPending = null); }, o.src = n.poster;
            }
            else
                i.dataset.artApplied = n.poster;
        }
    } }); }
    var Ue = !1, Be = !1, Fe = {}, He = "function" == typeof WeakSet ? new WeakSet : null;
    function Ke(e) { Fe[e] = Date.now() + 6e4; for (var t = Object.keys(Fe); t.length > 240;)
        delete Fe[t.shift()]; }
    var Ve = "function" == typeof IntersectionObserver ? new IntersectionObserver(function (e) { e.some(function (e) { return e.isIntersecting; }) && Je(C); }, { rootMargin: "400px" }) : null;
    function Je(e) {
        return __awaiter(this, void 0, void 0, function () { var t, n, a, i, o, e_9; return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!G() && e === C)) return [3 /*break*/, 9];
                    t = [].slice.call(g("grid").querySelectorAll(".card"));
                    if (!(je(t), Ve && He && t.forEach(function (e) { He.has(e) || (He.add(e), Ve.observe(e)); }), Ue)) return [3 /*break*/, 1];
                    Be = !0;
                    return [3 /*break*/, 9];
                case 1:
                    n = [], a = {};
                    if (!(t.forEach(function (e) { var t = e._item; if (t && t.contentId) {
                        var i = e.querySelector(".poster-art");
                        if (!(/^anime:/.test(t.contentId) && i || j[t.contentId] || Fe[t.contentId] > Date.now() || a[t.contentId])) {
                            var o = e.getBoundingClientRect();
                            o.bottom < -400 || o.top > window.innerHeight + 400 || o.right < 0 || o.left > window.innerWidth + 200 || (a[t.contentId] = !0, n.push(ze(t)));
                        }
                    } }), n.length)) return [3 /*break*/, 9];
                    Ue = !0;
                    i = [];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, 8, 9]);
                    _a.label = 3;
                case 3:
                    if (!(n.length && e === C)) return [3 /*break*/, 6];
                    i = n.splice(0, 24);
                    return [4 /*yield*/, ee("artworkMany", [i])];
                case 4:
                    o = _a.sent();
                    i.forEach(function (e) { var t = e.contentId; o && o[t] ? j["d:" + t] || U(t, o[t]) : Ke(t); }), e === C && je([].slice.call(g("grid").querySelectorAll(".card")));
                    _a.label = 5;
                case 5: return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_9 = _a.sent();
                    i.forEach(function (e) { Ke(e.contentId); });
                    return [3 /*break*/, 9];
                case 8:
                    Ue = !1, Be && (Be = !1, setTimeout(function () { Je(C); }, 150));
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        }); });
    }
    function We(e, t) {
        return __awaiter(this, void 0, void 0, function () { function a() {
            return __awaiter(this, void 0, void 0, function () { var a, i, o, _a, e_10, r; return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(n < e.length && n < 10 && t === C)) return [3 /*break*/, 12];
                        a = e[n++];
                        if (!(a && a.contentId && !/^anime:/.test(a.contentId))) return [3 /*break*/, 11];
                        if (!j["d:" + a.contentId]) return [3 /*break*/, 1];
                        i = j["d:" + a.contentId];
                        return [3 /*break*/, 10];
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, ee("artwork", [ze(a)]).catch(function () { return null; })];
                    case 2:
                        if (!(!(i = _b.sent()) || !i.logo)) return [3 /*break*/, 7];
                        if (!a.keyWords) return [3 /*break*/, 3];
                        _a = a;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, H(a)];
                    case 4:
                        _a = (_b.sent()).assetData || a;
                        _b.label = 5;
                    case 5:
                        o = _a;
                        if (t !== C)
                            return [2 /*return*/];
                        return [4 /*yield*/, ee("artwork", [ze(Object.assign({}, a, o))])];
                    case 6:
                        i = (_b.sent()) || i;
                        _b.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        e_10 = _b.sent();
                        i = null;
                        return [3 /*break*/, 9];
                    case 9:
                        i && U("d:" + a.contentId, i);
                        _b.label = 10;
                    case 10:
                        if (t !== C)
                            return [2 /*return*/];
                        if (i) {
                            a._art = i;
                            r = g("hero");
                            r._item === a && r._repaint && r._repaint();
                        }
                        _b.label = 11;
                    case 11: return [3 /*break*/, 0];
                    case 12: return [2 /*return*/];
                }
            }); });
        } var n; return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!G()) return [3 /*break*/, 2];
                    n = 0;
                    return [4 /*yield*/, Promise.all([a(), a(), a()])];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        }); });
    }
    function Ge(e) { d = e, g("detail").classList.toggle("is-loading-season", e), g("episodes").setAttribute("aria-busy", String(e)), g("play").disabled = e, g("fav").disabled = e, g("episodes").querySelectorAll("button").forEach(function (t) { t.disabled = e; }); }
    function $e(t) { var n = f && !i.tv && !G() && !t._downloadId && ["movie", "series"].indexOf(e.mediaType(t)) >= 0; if (g("download").hidden = !n, g("download-tools").hidden = !n, g("download-status").textContent = "", n) {
        var a = e.episodes(t.simpleProgramList), o = g("download-episode");
        o.replaceChildren(), a.forEach(function (e) { var t = de("option", "", "Episodio " + e.number); t.value = String(e.number), o.appendChild(t); }), o.value = String(t.episode || 1), g("download-episode-label").hidden = "series" !== e.mediaType(t), g("download").disabled = d || "series" === e.mediaType(t) && !a.length, g("download").onclick = function () {
            return __awaiter(this, void 0, void 0, function () { var n, a, e_11; return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        n = g("download");
                        n.disabled = !0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        a = function (e) { var t = ft(e); return ["name", "title", "originalTitle", "latinTitle", "description", "year", "kind", "provider", "mediaType", "programType", "audience"].forEach(function (n) { null != e[n] && (t[n] = e[n]); }), t.posterList = (e.posterList || []).slice(0, 2), t; }(Object.assign({}, t, { episode: "series" === e.mediaType(t) && Number(o.value) || 1 }));
                        return [4 /*yield*/, ee("downloadStart", [a])];
                    case 2:
                        if (_a.sent(), E !== t)
                            return [2 /*return*/];
                        g("download-status").textContent = "Agregada a Descargas. Puedes ver el progreso desde el menú.";
                        return [3 /*break*/, 5];
                    case 3:
                        e_11 = _a.sent();
                        E === t && (g("download-status").textContent = e_11.message);
                        return [3 /*break*/, 5];
                    case 4:
                        E === t && (n.disabled = !1);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            }); });
        };
    } }
    function Ye(e) {
        return __awaiter(this, void 0, void 0, function () { var t, n, _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    t = Object.assign({}, e.item, { _downloadId: e.id });
                    return [4 /*yield*/, ee("progressGet", [t.contentId]).catch(function () { return null; })];
                case 1:
                    n = _b.sent();
                    _a = "downloads" === y;
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, st(t, { data: { assetData: t }, progress: n })];
                case 2:
                    _a = (_b.sent(), E && E._downloadId === e.id && gt(E));
                    _b.label = 3;
                case 3:
                    _a;
                    return [2 /*return*/];
            }
        }); });
    }
    var Qe = [["genero", "Género", "Todos"], ["estado", "Estado", "Todos"], ["fecha", "Año", "Todos"], ["categoria", "Versión", "Todas"], ["filtro", "Orden", "Recientes"]], Xe = { latino: "Español latino", nombre: "Por nombre", popularidad: "Más populares" };
    function Ze(t, n) { if (t._downloadId)
        return g("series-panel").hidden = !0, g("episodes").hidden = !0, void (g("play").hidden = !1); var a = g("episodes"), o = e.episodes(t.simpleProgramList), r = e.seasons(t), l = "0" === String(t.type) || "teleplay" === t.programType || o.length > 1; g("series-panel").hidden = !l, a.hidden = !o.length, a.replaceChildren(); var s = g("season-select"); s.replaceChildren(), r.forEach(function (e) { var t = de("option", "", e.label); t.value = e.contentId, s.appendChild(t); }), s.value = String(t.contentId), g("season-control").hidden = r.length < 2; var c = !o.length && /^anime:/.test(t.contentId || "") && t.status ? t.status + ": el proveedor todavía no ha publicado ningún episodio." : "No hay episodios disponibles todavía."; g("episode-count").textContent = o.length ? 1 === o.length ? "1 episodio" : o.length + " episodios" : c; var u = g("episodes-retry"); if (u.hidden = !t.episodesError, u.onclick = function () { st(t, { refresh: !0 }); }, t.episodesError ? g("episode-count").textContent = t.episodesError : t.episodesPending && (g("episode-count").textContent = o.length + " de " + t.episodesTotal + " episodios · Cargando el resto…"), l) {
        g("play").hidden = !o.length;
        var p = n && n.position > 5 && (t.episodesPending || o.some(function (e) { return e.number === Number(n.episode || 1); }));
        o.length && !p && (t.episode = o[0].number, t._resume = 0, g("play").textContent = "▶ Reproducir Ep " + t.episode);
        var f = 100, m = g("range-control"), v = g("range-select");
        m.hidden = o.length <= f, v.replaceChildren();
        var h = 0;
        if (!m.hidden) {
            for (var y = p ? Number(n.episode || 1) : o[0] && o[0].number, b = 0; b < o.length; b += f) {
                var w = Math.min(b + f, o.length) - 1, C = de("option", "", "Episodios " + o[b].number + "–" + o[w].number);
                C.value = String(b), v.appendChild(C), o[b].number <= y && y <= o[w].number && (h = b);
            }
            v.value = String(h), v.onchange = function () { S(Number(v.value) || 0), i && i.ensure(); };
        }
        S(h);
    } function S(i) { var r = null; a.replaceChildren(), setTimeout(function () { E === t && lt(t); }, 0), o.slice(i, i + f).forEach(function (i) { var o = i.item, l = i.number, s = o.seasonNumber || o.season; s && s !== r && (a.appendChild(de("h3", "season-heading", "Temporada " + s)), r = s); var c = de("button", "episode has-still"); c.dataset.episode = String(l), s && (c.dataset.season = String(s)); var u = de("div", "episode-media"); u.setAttribute("aria-hidden", "true"), u.appendChild(de("span", "episode-placeholder", "▶")), c.appendChild(u), c._episode = o; var f = e.episodeLabel(o, l, t), m = f.slice(("Episodio " + l).length).replace(/^ · /, ""); c.appendChild(de("span", "episode-title", "Episodio " + l)), m && c.appendChild(de("span", "episode-subtitle", m)), c.setAttribute("aria-label", f + (p && Number(n.episode || 1) === l ? " · Continuar " + dt(n.position) : "")), p && Number(n.episode || 1) === l && (c.classList.add("resume"), c.appendChild(de("span", "episode-resume", "Continuar · " + dt(n.position)))), c.onclick = function () { d || gt(Object.assign({}, t, { episode: l, _resume: p && Number(n.episode || 1) === l ? n.position : 0 })); }, a.appendChild(c); }); } }
    function et(t, n, a) {
        return __awaiter(this, void 0, void 0, function () { var i, o, l, s, d, c, u, p, f, e_12; return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(/^anime:jk:/.test(t.contentId || "") && (ee("animeSeasons", [t.contentId]).then(function (n) { if (E === t && a === r && n.length) {
                        t.sameSeasonSeriesList = n;
                        var i = g("season-select");
                        i.replaceChildren(), e.seasons(t).forEach(function (e) { var t = de("option", "", e.label); t.value = e.contentId, i.appendChild(t); }), i.value = String(t.contentId), g("season-control").hidden = n.length < 2;
                    } }).catch(function () { }), t.episodesPending))) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ee("animeEpisodes", [t.contentId])];
                case 2:
                    i = _a.sent();
                    if (E !== t || a !== r)
                        return [2 /*return*/];
                    t.simpleProgramList = i.episodes, t.episodesPending = i.pending, t.episodesTotal = i.total;
                    o = document.activeElement, l = o && o.dataset && o.dataset.episode, s = g("detail").querySelector(".detail-scroll"), d = s.scrollTop, c = t.episode, u = t._resume;
                    if (Ze(t, n), t.episode = c, t._resume = u, window.CactusQuality&&window.CactusQuality.bind(t,gt),$e(t), s.scrollTop = d, l) {
                        p = g("episodes").querySelector('[data-episode="' + l + '"]');
                        p && p.focus({ preventScroll: !0 });
                    }
                    f = g("video")._playingItem;
                    f && f.contentId === t.contentId && (f.simpleProgramList = i.episodes, g("player").hidden || _ || wt(g("video"), f));
                    return [3 /*break*/, 4];
                case 3:
                    e_12 = _a.sent();
                    if (E !== t || a !== r)
                        return [2 /*return*/];
                    g("episode-count").textContent = "No se pudo completar la lista. Los episodios cargados siguen disponibles.", g("episodes-retry").hidden = !1, g("episodes-retry").onclick = function () { this.hidden = !0, et(t, n, a); };
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        }); });
    }
    g("season-select").onchange = function () {
        return __awaiter(this, void 0, void 0, function () { var t, n, a, i, o, d, c, u, e_13; return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t = g("season-select"), n = E;
                    if (!n) return [3 /*break*/, 5];
                    a = e.seasons(n).find(function (e) { return e.contentId === t.value; });
                    if (!a) return [3 /*break*/, 5];
                    t.focus({ preventScroll: !0 });
                    i = ++s, o = r;
                    if (a.contentId === String(n.contentId))
                        return [2 /*return*/, (Ge(!1), void (g("season-status").textContent = ""))];
                    l++, Ge(!0), g("season-status").classList.remove("sr-only"), g("season-status").textContent = "Cargando " + a.label.toLowerCase() + "…";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, Promise.all([ee("getItem", [a.contentId, "0"]), ee("progressGet", [a.contentId]).catch(function () { return null; })])];
                case 2:
                    d = _a.sent();
                    if (i !== s || o !== r || E !== n || g("detail").hidden)
                        return [2 /*return*/];
                    c = d[0].assetData || d[0];
                    if (!c.contentId || String(c.contentId) !== a.contentId || !$(c))
                        throw new Error("Temporada no disponible");
                    u = Object.assign({ type: "0", audience: n.audience }, c);
                    (u.sameSeasonSeriesList || []).length || (u.sameSeasonSeriesList = n.sameSeasonSeriesList);
                    return [4 /*yield*/, st(u, { seasonSwitch: !0, data: d[0], progress: d[1] })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_13 = _a.sent();
                    if (i !== s || o !== r || E !== n)
                        return [2 /*return*/];
                    t.value = String(n.contentId), Ge(!1), g("season-status").textContent = "No se pudo cargar la temporada. Vuelve a elegirla para reintentar.";
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        }); });
    };
    var tt = 0, nt = { AUTO: "Automática", SUB: "Japonés · subtitulado", LAT: "Español latino" };
    function at(e) { var t = g("anime-language"); if (t) {
        var n = e && e.animeLanguages || [], i = ["AUTO"].concat(n);
        t.replaceChildren(), i.forEach(function (e) { var n = document.createElement("option"); n.value = e, n.textContent = nt[e] || e, t.appendChild(n); });
        var o = e.animePreferred || a.prefs.animeLanguage || "AUTO";
        t.value = i.indexOf(o) >= 0 ? o : "AUTO";
        var r = t.closest("label");
        r && (r.hidden = !1);
        var l = g("anime-version").querySelector(".muted");
        l && (l.textContent = e.animeChecked ? (e.animeMovie ? "Película" : "Episodio " + e.animeChecked) + ": " + (n.length ? n.map(function (e) { return nt[e]; }).join(" · ") + ". Se comprueba el servidor al reproducir." : "sin servidores de reproducción disponibles.") : "Las versiones se comprueban por episodio. Los subtítulos de la versión japonesa están integrados en el vídeo.");
    } }
    function it(e) {
        return __awaiter(this, void 0, void 0, function () { var t, n, a, i, e_14, o; return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(/^anime:/.test(e.contentId || "") && (e.episodesError || Number(e.episodesTotal) || (e.simpleProgramList || []).length))) return [3 /*break*/, 4];
                    t = E, n = r, a = ++tt;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ee("animeVersions", [e.contentId, e.episode || 1])];
                case 2:
                    i = _a.sent();
                    if (E !== t || r !== n || a !== tt)
                        return [2 /*return*/];
                    at({ animeLanguages: i.languages, animeChecked: i.episode, animeMovie: "1" === String(e.type), animePreferred: g("anime-language").value }), e._checkedLanguages = i.languages, e._checkedEpisode = i.episode;
                    return [3 /*break*/, 4];
                case 3:
                    e_14 = _a.sent();
                    if (E === t && r === n && a === tt) {
                        o = g("anime-version").querySelector(".muted");
                        o && (o.textContent = "No se pudo comprobar el idioma de este episodio. Se volverá a intentar al reproducir.");
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        }); });
    }
    var ot = /(?:\bT\s?(\d{1,2})\b|\bTemp\.?\s?(\d{1,2})\b|\bTemporada\s?(\d{1,2})\b|\bS(\d{1,2})\b)/i;
    function rt(t, n, a) {
        return __awaiter(this, void 0, void 0, function () { var i, _a, e_15, o, l, s, d, e_16; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(!G() && "adult" !== e.audience(t))) return [3 /*break*/, 10];
                    i = j["d:" + t.contentId];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    _a = i;
                    if (_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, ee("artwork", [n])];
                case 2:
                    _a = (i = _b.sent());
                    _b.label = 3;
                case 3:
                    _a;
                    return [3 /*break*/, 5];
                case 4:
                    e_15 = _b.sent();
                    return [2 /*return*/];
                case 5:
                    if (!(i && E === t && a === r)) return [3 /*break*/, 10];
                    t._art = i, U("d:" + t.contentId, i), U(t.contentId, i), Re(t), lt(t);
                    o = g("description").textContent;
                    if (!(!i.overview || o && !/^Sinopsis no disponible/.test(o) || (g("description").textContent = i.overview), "tv" === i.type && i.tmdbId)) return [3 /*break*/, 10];
                    s = Number(n.seasonNumber) || Number(t.seasonNumber) || function (e) { var t = ot.exec(String(e || "")); if (!t)
                        return 0; for (var n = 1; n < t.length; n++)
                        if (t[n])
                            return Number(t[n]) || 0; return 0; }(n.name || t.name || t.title) || Number(t.simpleProgramList && t.simpleProgramList[0] && t.simpleProgramList[0].seasonNumber) || 1;
                    if (/^anime:/.test(t.contentId || "")) {
                        d = (i.seasons || []).filter(function (e) { return e.season === s; })[0];
                        if (!d || Number(t.episodesTotal || (t.simpleProgramList || []).length) !== d.episodes)
                            return [2 /*return*/];
                    }
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, ee("artworkEpisodes", [i.tmdbId, s])];
                case 7:
                    l = _b.sent();
                    return [3 /*break*/, 9];
                case 8:
                    e_16 = _b.sent();
                    return [2 /*return*/];
                case 9:
                    l && l.length && E === t && a === r && (t._stills = {}, l.forEach(function (e) { t._stills[e.episode] = { still: e.still, name: e.name, overview: e.overview }; }), lt(t));
                    _b.label = 10;
                case 10: return [2 /*return*/];
            }
        }); });
    }
    function lt(e) { e && g("episodes").querySelectorAll(".episode").forEach(function (t) { var n = (e._stills || {})[Number(t.dataset.episode)] || {}, a = t._episode || {}, i = e._art || {}, o = t.querySelector(".episode-media"); if (o) {
        var r = [a.still, a.imageUrl, n.still, i.backdrop, ue(e), i.poster, De(e)].filter(function (e, t, n) { return "string" == typeof e && /^https?:\/\//.test(e) && n.indexOf(e) === t; }), l = r.join("|");
        if (r.length && o.dataset.sources !== l) {
            o.dataset.sources = l;
            var s = o.querySelector("img");
            s && s.remove();
            var d = document.createElement("img"), c = 0;
            d.className = "episode-still", d.alt = "", d.loading = "lazy", d.decoding = "async", d.width = 320, d.height = 180, d.onerror = function () { ++c < r.length ? d.src = r[c] : d.remove(); }, d.src = r[0], o.appendChild(d);
        }
        var u = new RegExp("^\\s*(episod(e|io)\\s*)?" + Number(t.dataset.episode) + "\\s*$", "i");
        if (n.name && !u.test(n.name) && !t.querySelector(".episode-subtitle")) {
            var p = t.querySelector(".episode-title");
            p && p.after(de("span", "episode-subtitle", n.name));
        }
    } }); }
    function st(t, n) {
        return __awaiter(this, void 0, void 0, function () { var o, u, p, f, m, v, _a, h, y, b, w, C, e_17, S; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(n = n || {}, $(t))) return [3 /*break*/, 6];
                    l++, s++;
                    o = ++r, u = g("detail").querySelector(".detail-scroll"), p = document.activeElement === g("season-select"), f = n.seasonSwitch ? g("season-select").getBoundingClientRect().top : 0;
                    n.seasonSwitch || (c = document.activeElement), Ee(), Ge(!1), g("season-status").textContent = "", n.seasonSwitch || (g("anime-language").value = a.prefs.animeLanguage || "AUTO"), E = t = Object.assign({}, t, { episode: t._downloadId && Number(t.episode) || 1, _resume: 0 }), g("play").textContent = "▶ Reproducir", g("detail").hidden = !1, g("scrim").hidden = !1, document.documentElement.classList.add("modal-open"), window.CactusQuality&&window.CactusQuality.bind(t,gt), $e(t), g("download").disabled = !0, n.seasonSwitch || (u.scrollTop = 0), g("detail-title").textContent = Y(t), g("description").textContent = t.description || t.introduction || "Sinopsis no disponible en español", g("play-status").textContent = "";
                    m = g("episodes");
                    if (!(m.hidden = !0, m.replaceChildren(), g("series-panel").hidden = !0, g("episodes-retry").hidden = !0, g("play").hidden = !1, n.seasonSwitch || (g("play").disabled = !1, i.focus(g("play"))), g("play").dataset.cactusLoading = t.contentId ? "1" : "0", g("play").setAttribute("aria-disabled", t.contentId ? "true" : "false"), g("play").textContent = t.contentId ? "Cargando…" : "▶ Reproducir", tt++, at({}), Re(t), function (e) {
                        return __awaiter(this, void 0, void 0, function () { function a(e) { t.setAttribute("aria-pressed", e ? "true" : "false"), t.textContent = e ? "★ En mi lista" : "☆ Mi lista"; } var t, n, e_18; return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    t = g("fav");
                                    if (!(t.hidden = !e.contentId, e.contentId)) return [3 /*break*/, 5];
                                    a(!1), t.disabled = !0, t.onclick = null;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, ee("favStatus", [e.contentId])];
                                case 2:
                                    n = _a.sent();
                                    if (E !== e)
                                        return [2 /*return*/];
                                    a(n.favorited);
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_18 = _a.sent();
                                    return [3 /*break*/, 4];
                                case 4:
                                    E === e && (t.disabled = d, t.onclick = function () {
                                        return __awaiter(this, void 0, void 0, function () { var n, e_19; return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!!t.disabled) return [3 /*break*/, 5];
                                                    t.disabled = !0;
                                                    _a.label = 1;
                                                case 1:
                                                    _a.trys.push([1, 3, 4, 5]);
                                                    return [4 /*yield*/, ee("favToggle", [{ contentId: e.contentId, type: e.type, name: e.name || e.title, posterList: e.posterList, audience: e.audience, originalTitle: e.originalTitle, latinTitle: e.latinTitle }])];
                                                case 2:
                                                    n = _a.sent();
                                                    E === e && a(n.favorited);
                                                    return [3 /*break*/, 5];
                                                case 3:
                                                    e_19 = _a.sent();
                                                    g("play-status").textContent = "No se pudo guardar en tu lista. " + e_19.message;
                                                    return [3 /*break*/, 5];
                                                case 4:
                                                    E === e && (t.disabled = d);
                                                    return [7 /*endfinally*/];
                                                case 5: return [2 /*return*/];
                                            }
                                        }); });
                                    });
                                    _a.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        }); });
                    }(t), t.contentId)) return [3 /*break*/, 6];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    if (!n.data) return [3 /*break*/, 2];
                    _a = [n.data, n.progress];
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, Promise.all([H(t, n.refresh), ee("progressGet", [t.contentId]).catch(function () { return null; })])];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    v = _a;
                    if (E !== t || o !== r)
                        return [2 /*return*/];
                    h = v[0], y = v[1], b = h.assetData || h;
                    y && y.position > 5 && (!t._downloadId || Number(y.episode || 1) === Number(t.episode || 1)) && (t._resume = y.position, t._downloadId || (t.episode = Number(y.episode) || 1), g("play").textContent = "▶ Continuar " + dt(y.position) + (t.episode > 1 ? " · Ep " + t.episode : "")), g("description").textContent = b.description || h.introduction || h.introduce || g("description").textContent, at({});
                    w = e.normalize(Object.assign({}, t, b), t.audience);
                    if (!$(w))
                        return [2 /*return*/, void Et()];
                    if (E = t = Object.assign(t, w), Re(t), t._downloadId || t.rating || G() || ee("metadataLookup", [{ contentId: t.contentId, originalTitle: t.originalTitle, latinTitle: t.latinTitle, name: t.name, type: t.type, kind: t.kind, year: t.year, country: t.country || t.originalCountry, duration: t.duration, externalIds: t.externalIds, audience: t.audience }, a.prefs.providers]).then(function (e) { e && E === t && o === r && Re(Object.assign({}, t, { rating: e.rating })); }).catch(function () { }), g("play").disabled = !1, g("play").dataset.cactusLoading = "0", g("play").setAttribute("aria-disabled", "false"), y && y.position > 5 || (g("play").textContent = "▶ Reproducir"), Ze(t, y), $e(t), t._downloadId || (et(t, y, o), it(t), rt(t, b, o)), n.seasonSwitch) {
                        p ? (u.scrollTop += g("season-select").getBoundingClientRect().top - f, i.focus(g("season-select"))) : i.ensure();
                        C = e.seasons(t).find(function (e) { return e.contentId === String(t.contentId); });
                        g("season-status").classList.add("sr-only"), g("season-status").textContent = C ? C.label + " · " + g("episode-count").textContent : "";
                    }
                    return [3 /*break*/, 6];
                case 5:
                    e_17 = _b.sent();
                    if (E === t && o === r) {
                        g("play").disabled = !0, g("play-status").textContent = "No se pudo cargar la ficha. " + e_17.message;
                        S = de("button", "", "Volver a intentar");
                        S.onclick = function () { st(t); }, g("play-status").appendChild(S);
                    }
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        }); });
    }
    function dt(e) { e = Math.floor(e || 0); var t = Math.floor(e / 3600), n = Math.floor(e % 3600 / 60), a = e % 60; return (t ? t + ":" : "") + (t ? String(n).padStart(2, "0") : n) + ":" + String(a).padStart(2, "0"); }
    function ct(e, t, n) { e.replaceChildren(), t.forEach(function (t) { var n = document.createElement("option"); n.value = t.value, n.textContent = t.label, t.selected && (n.selected = !0), e.appendChild(n); }), e.onchange = function () { n(e.value); }; }
    function ut(e) { return String(e || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    function pt(t, n, a) { if (!/^anime:/.test((t._playingItem || {}).contentId || "")) {
        var i = [];
        t._applyingTrackPreferences = !0;
        try {
            o(g("audio"), g("prefAudio").value, "original", "audio"), o(g("subs"), g("prefSubs").value, "off", "subs");
        }
        finally {
            t._applyingTrackPreferences = !1;
        }
        Ne("pistas", i.length ? "La copia no ofrece la preferencia elegida: " + i.join(" · ") + ". Puedes elegir entre sus pistas disponibles." : "", !!i.length);
    } function o(n, a, o, r) { if (!(n.parentElement.hidden || t._manualTracks && t._manualTracks[r])) {
        var l = null;
        [].forEach.call(n.options, function (t) { null === l && (a === o && "-1" === t.value || "auto" === a && "-1" !== t.value || function (t, n) { var a = ut(t), i = ut(n); if (!a || !i)
            return !1; if (a === i || 0 === a.indexOf(i))
            return !0; var o = ut(e.language(i)); return !!o && (0 === a.indexOf(o) || 0 === o.indexOf(a)); }(t.textContent, a)) && (l = t.value); }), "original" !== a && (null !== l ? (t._appliedTrackPreferences = t._appliedTrackPreferences || {}, n.value === l && t._appliedTrackPreferences[r] || (n.value = l, n.onchange && n.onchange(), t._appliedTrackPreferences[r] = !0)) : t.readyState >= 1 && i.push(e.language(a)));
    } } }
    function ft(e) { var t = { contentId: e.contentId, type: e.type, episode: e.episode, qualityId:e._cactusQualityId||"" }; return Array.isArray(e.liveAddressList) && e.liveAddressList.length && (t.liveAddressList = e.liveAddressList), /^anime:/.test(e.contentId || "") && (t.animeLanguage = g("anime-language").value), i.tv && "nativo" === a.prefs.videoMode && (t.videoMode = "nativo"), t; }
    var mt = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers["cactus-classicPlayer"];
    function vt(e) { try {
        mt.postMessage(e);
    }
    catch (e) { } }
    function ht(t, n, a) { var i = { position: 0, duration: 0, ended: !1 }, o = null; function r() { _ === i && (_ = null, window.removeEventListener("cactus-classic-native-player", s), o && o(), l === a && (l++, v && (ee("playStop", [v]).catch(function () { }), v = null)), yt(!1), document.documentElement.classList.toggle("modal-open", !g("detail").hidden)); } function s(n) { var a = n.detail || {}; return "time" === a.type ? (i.position = a.position || 0, i.duration = a.duration || 0, void (o && o(!0))) : "ended" === a.type ? (i.ended = !0, r(), void function (t, n) { var a = e.episodes(t.simpleProgramList || []), i = Number(t.episode || 1), o = -1; a.forEach(function (e, t) { o < 0 && e.number === i && (o = t); }); var r = o >= 0 ? a[o + 1] : null; if (!(n.duration > 0 && n.position >= n.duration - 15))
        return void (g("play-status").textContent = "La reproducción se cortó antes del final. Vuelve a abrir el episodio para retomarlo."); r && E && gt(Object.assign({}, t, { episode: r.number, _resume: 0 })); }(t, i)) : "error" === a.type ? (r(), void (g("play-status").textContent = "El reproductor no pudo abrir este vídeo.")) : void ("closed" !== a.type || r()); } window.addEventListener("cactus-classic-native-player", s), i.cleanup = function () { window.removeEventListener("cactus-classic-native-player", s), o && o(); }, _ = i, yt(!0), o = function (e, t) { var n = 0, a = "adult" === t.audience, i = window.CactusClassicProfiles.id(); function o(e, t) { i === window.CactusClassicProfiles.id() && (a || ee(e, t).catch(function () { })); } function r() { return { contentId: t.contentId, type: t.type, name: t.name || t.title, posterList: t.posterList, audience: t.audience, originalTitle: t.originalTitle, latinTitle: t.latinTitle }; } return function (a) { var i = e.position, l = e.duration; e.ended ? o("progressClear", [t.contentId]) : i > 5 && isFinite(l) && l && (a && Math.abs(i - n) < 9 || (n = i, o("progressSave", [{ item: r(), position: i, duration: l, episode: t.episode || 1 }]))); }; }(i, t), vt({ action: "play", url: new URL(W + n.url, location.href).href, position: Number(t._resume) || 0, audio: /^anime:/.test(t.contentId) ? "original" : g("prefAudio").value, subtitles: /^anime:/.test(t.contentId) ? "off" : g("prefSubs").value, title: Y(t) + ("0" === String(t.type) || t.episode > 1 ? " · Ep " + t.episode : "") }), g("play-status").textContent = ""; }
    function gt(t) { window.CactusQuality&&window.CactusQuality.bind(t,gt);
        return __awaiter(this, void 0, void 0, function () { var a, o, r, s, c, _a, u, p, f, m, y, e_20; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!($(t) && E && !d)) return [3 /*break*/, 10];
                    a = ++l, o = G(), r = E;
                    Ee(), window.CactusLastPlayError = "", g("play-status").textContent = "Preparando reproducción…";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    s = ft(t);
                    if (!(!t._downloadId && /^anime:/.test(t.contentId || ""))) return [3 /*break*/, 3];
                    return [4 /*yield*/, it(t)];
                case 2:
                    if (_b.sent(), a !== l || E !== r)
                        return [2 /*return*/];
                    if (t._checkedEpisode === Number(t.episode || 1) && "AUTO" !== s.animeLanguage && t._checkedLanguages.indexOf(s.animeLanguage) < 0)
                        throw new Error("El episodio " + (t.episode || 1) + " no ofrece la versión elegida. Selecciona una de las versiones disponibles.");
                    _b.label = 3;
                case 3:
                    if (!t._downloadId) return [3 /*break*/, 5];
                    return [4 /*yield*/, ee("downloadPlay", [t._downloadId])];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, ee("play", [s])];
                case 6:
                    _a = _b.sent();
                    _b.label = 7;
                case 7:
                    c = _a;
                    if (a !== l || !E || E !== r || E.contentId !== t.contentId || o && !G())
                        return [2 /*return*/, void (c.playbackId && ee("playStop", [c.playbackId]).catch(function () { }))];
                    v = c.playbackId || null; g("video")._playingItem=t;
                    if(window.CactusProgress)window.CactusProgress.begin(cocoIsChannel(t)?null:t,y,ee);
                    cactusAttachCompletion(t);
                    if(c.engine==='cactus-external-live'&&window.CactusExternalPlayer)return [2 /*return*/,window.CactusExternalPlayer.start(c,{title:Y(t),item:t}).catch(function(error){var message=error&&error.message||'No se pudo abrir el canal';window.CactusLastPlayError=message;g('play-status').textContent=message;if(cocoIsChannel(t))cocoChannelError(message);})];
                    if (mt && (!c.progressive || !(c.subtitles || []).length))
                        return [2 /*return*/, void ht(t, c, l)];
                    u = g("video");
                    !function (e) { var t = g("player"); t.hidden = !1, t.classList.remove("idle"), yt(!0), document.documentElement.classList.add("modal-open"), g("player-title").textContent = Y(e) + ("0" === String(e.type) || e.episode > 1 ? " · Ep " + e.episode : ""), g("vspin").hidden = !1, xe(); }(t), u._hls && (u._hls.destroy(), u._hls = null);
                    p = i.tv && (c.subtitles || []).length > 0;
                    if (function (e, t) { [].slice.call(e.querySelectorAll("track")).forEach(function (e) { e.remove(); }), (t || []).forEach(function (t, n) { var a = document.createElement("track"); a.kind = "subtitles", a.src = W + t.url, a.srclang = t.lang || "und", a.label = t.label || t.lang || "Sub " + (n + 1), e.appendChild(a); }); }(u, p ? [] : c.progressive || "native-ts" === c.mode ? c.subtitles : []), p && (u._captions = window.CactusClassicSubtitles.create(u, g("subtitle-layer"), c.subtitles.map(function (e) { return Object.assign({}, e, { url: W + e.url }); }), { onStatus: function (e) { Ne("subtitulos", e, !!e); } })), c.progressive)
                        u.src = W + c.url;
                    else if (function (e) { return !((!i || !i.tv) && (!e.canPlayType("application/vnd.apple.mpegurl") || !/apple/i.test(navigator.vendor || "") && window.Hls && Hls.isSupported())); }(u))
                        u.src = W + c.url;
                    else {
                        if (!window.Hls || !Hls.isSupported())
                            return [2 /*return*/, void (g("play-status").textContent = "Este navegador no reproduce HLS.")];
                        f = new Hls({ maxBufferLength: 30 });
                        u._hls = f, f.on(Hls.Events.ERROR, function (e, t) { if (t.fatal) {
                            var n = /[Cc]odec|[Bb]uffer/.test(t.details || "") ? "Este navegador no decodifica HEVC/H.265. Ábrelo en Safari o en la aplicación de escritorio; en el televisor se ve de forma nativa." : "Error de reproducción: " + t.details;
                            bt(), g("play-status").textContent = n;
                        } }), f.loadSource(W + c.url), f.attachMedia(u);
                    }
                    !function (t, n, a) { var i = g("tracks"), o = g("audio"), r = g("subs"), l = "", s = ""; function d(t, n) { return e.language(t.lang || t.language) || t.name || t.label || "Audio " + (n + 1) + " · idioma no identificado"; } function c(e) { var t = ""; return [].forEach.call(e.options, function (n) { t || n.value !== e.value || (t = n.textContent); }), t; } function u(e, n, a) { if (a && t._manualTracks[n]) {
                        var i = null;
                        [].forEach.call(e.options, function (e) { null === i && e.textContent === a && (i = e.value); }), null !== i && (e.value = i, e.onchange && e.onchange());
                    } } function p() { t._captions && [].forEach.call(t.textTracks || [], function (e) { "subtitles" !== e.kind && "captions" !== e.kind || (e.mode = "disabled"); }); var e = a && a.audioTracks && a.audioTracks.length ? a.audioTracks : t.audioTracks || [], n = t._captions ? t._captions.tracks : a && a.subtitleTracks && a.subtitleTracks.length ? a.subtitleTracks : [].filter.call(t.textTracks || [], function (e) { return "subtitles" === e.kind || "captions" === e.kind; }), p = [].map.call(e, d).join("|"), f = [].map.call(n, d).join("|"), m = !1; if (p !== l) {
                        l = p, m = !0;
                        var v = c(o);
                        ct(o, [].map.call(e, function (e, t) { return { value: String(t), label: d(e, t), selected: a ? t === a.audioTrack : e.enabled }; }), function (n) { if (t._applyingTrackPreferences || (t._manualTracks.audio = !0), a && a.audioTracks.length)
                            a.audioTrack = Number(n);
                        else
                            for (var i = 0; i < e.length; i++)
                                e[i].enabled = String(i) === n; }), u(o, "audio", v);
                    } if (o.parentElement.hidden = !e.length, f !== s) {
                        s = f, m = !0;
                        var h = c(r);
                        ct(r, [{ value: "-1", label: "Desactivados", selected: !0 }].concat([].map.call(n, function (e, t) { return { value: String(t), label: d(e, t) }; })), function (e) { if (t._applyingTrackPreferences || (t._manualTracks.subs = !0), t._captions)
                            t._captions.select(Number(e));
                        else if (a && a.subtitleTracks.length)
                            a.subtitleTrack = Number(e), a.subtitleDisplay = Number(e) >= 0;
                        else
                            for (var i = 0; i < n.length; i++)
                                n[i].mode = String(i) === e ? "showing" : "disabled"; }), u(r, "subs", h);
                    } r.parentElement.hidden = !n.length, i.hidden = o.parentElement.hidden && r.parentElement.hidden, m && pt(t); } t._manualTracks = {}, t._appliedTrackPreferences = {}; var f = ["loadedmetadata", "loadeddata", "canplay"]; f.forEach(function (e) { t.addEventListener(e, p); }); var m = [t.audioTracks, t.textTracks]; m.forEach(function (e) { e && e.addEventListener && e.addEventListener("addtrack", p); }), a && (a.on(Hls.Events.AUDIO_TRACKS_UPDATED, p), a.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, p)), p(), t._trackCleanup = function () { f.forEach(function (e) { t.removeEventListener(e, p); }), m.forEach(function (e) { e && e.removeEventListener && e.removeEventListener("addtrack", p); }), a && (a.off(Hls.Events.AUDIO_TRACKS_UPDATED, p), a.off(Hls.Events.SUBTITLE_TRACKS_UPDATED, p)), t._trackCleanup = null; }; }(u, c.subtitles, u._hls), c.versionLabel && Ne("version", c.versionLabel + (c.burnedSubtitles ? " · no se pueden desactivar" : ""), !0);
                    m = function () { pt(u, c.subtitles, u._hls); };
                    m(), u.addEventListener("loadeddata", m, { once: !0 }), k = setTimeout(function () { k = null, g("player").hidden || function (e) { /^anime:/.test(e.contentId || "") || g("audio").parentElement.hidden && "original" !== g("prefAudio").value && Ne("audio", "El reproductor no expone las pistas de audio de esta copia. No se pudo confirmar el idioma elegido.", !0); }(t); }, 3500), function (e, t, n) { e._watchCleanup && e._watchCleanup(); var a = Date.now(), i = 0, o = 0, r = null, l = null, s = 0, d = 0, c = 0, u = function () { null === l && (l = Date.now() - a, m()); }, p = function (n) { "waiting" === n.type ? i++ : o++; var a = f(); ee("diagnosticsNote", ["reproduccion.corte", { tipo: "waiting" === n.type ? "espera" : "parada", segundo: Math.round(e.currentTime), bufferS: null == a ? -1 : a, modo: t.mode || "?", esperas: i, cortes: o }]).catch(function () { }); }; function f() { try {
                        for (var t = e.buffered, n = 0; n < t.length; n++)
                            if (e.currentTime >= t.start(n) - .1 && e.currentTime <= t.end(n) + .1)
                                return Math.round(t.end(n) - e.currentTime);
                    }
                    catch (e) { } return null; } function m(a) { var r = { modo: t.mode || "?", episodio: n.episode || 1 }; null !== l && (r.primerFrameMs = l), e.videoWidth && (r.resolucion = e.videoWidth + "x" + e.videoHeight); var c = f(); null !== c && (r.bufferS = c), r.esperas = i, r.cortes = o, d > 0 && (r.videoReloj = Math.round(s / d * 1e3) / 1e3), ee("diagnosticsNote", ["reproduccion." + (a ? a.tipo : "inicio"), Object.assign(r, a && a.datos || {})]).catch(function () { }); } var v = Date.now(), h = e.currentTime, g = !1, y = function () { g = !0; }; e.addEventListener("seeking", y), e.addEventListener("seeked", y), r = setInterval(function () { var t = (Date.now() - v) / 1e3, n = e.currentTime - h, a = !g && !e.paused && !e.ended && t > 0 && n >= 0 && n <= 2 * t; v = Date.now(), h = e.currentTime, g = !1, a && (s += n, d += t, ++c % 3 == 0 && m({ tipo: "avance", datos: { ultimos30s: Math.round(n / t * 1e3) / 1e3 } })); }, 1e4), e.addEventListener("loadeddata", u), e.addEventListener("playing", u), e.addEventListener("waiting", p), e.addEventListener("stalled", p), e._watchCleanup = function () { clearInterval(r), e.removeEventListener("loadeddata", u), e.removeEventListener("playing", u), e.removeEventListener("waiting", p), e.removeEventListener("stalled", p), e.removeEventListener("seeking", y), e.removeEventListener("seeked", y), null !== l && m({ tipo: "fin", datos: { vistoS: Math.round(e.currentTime) } }), e._watchCleanup = null; }; }(u, c, t);
                    return [4 /*yield*/, function (e, t, n) { return new Promise(function (a, i) { var o = !1; function r(t) { o || (o = !0, clearTimeout(h), h = null, e.removeEventListener("loadedmetadata", l), e.removeEventListener("playing", l), e.removeEventListener("error", s), t ? i(t) : a()); } function l() { r(); } function s() { r(new Error("El reproductor rechazó el formato de vídeo.")); } e.addEventListener("loadedmetadata", l), e.addEventListener("playing", l), e.addEventListener("error", s), h = setTimeout(function () { r(new Error("El vídeo no respondió en 12 segundos. Revisa la conexión y vuelve a intentar.")); }, n), t && "function" == typeof t.catch && t.catch(function (e) { r(e); }); }); }(u, u.play(), 12e3)];
                case 8:
                    if (_b.sent(), a !== l || !E)
                        return [2 /*return*/];
                    if (u.focus(), xe(), window.CactusProgress && window.CactusProgress.ready(), "vod" === c.kind && t._resume > 0) {
                        y = function () { if (u.duration && u.duration > t._resume + 2)
                            try {
                                u.currentTime = t._resume;
                            }
                            catch (e) { } };
                        u.readyState >= 1 ? y() : u.addEventListener("loadedmetadata", y, { once: !0 });
                    }
                    g("play-status").textContent = "vod" === c.kind ? "Reproduciendo (VOD)" : "Reproduciendo (en vivo)";
                    return [3 /*break*/, 10];
                case 9:
                    e_20 = _b.sent();
                    a === l && E && (bt(), window.CactusLastPlayError = e_20.message || "No se pudo iniciar la reproducción.", g("play-status").textContent = window.CactusLastPlayError, cocoIsChannel(t) && cocoChannelError(window.CactusLastPlayError));
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        }); });
    }
    // Acciones compartidas: usa los capítulos del catálogo y el flujo de autorización existente.
    var cactusNextBusy = false, cactusAutoTimer = null, cactusCompletionListener = null;
    function cactusAttachCompletion(item) {
        var video = g("video");
        if (cactusCompletionListener) video.removeEventListener("ended", cactusCompletionListener);
        cactusCompletionListener = function () {
            if (video._playingItem !== item || !isFinite(video.duration) || video.duration <= 0 || video.currentTime < video.duration - 15) return;
            window.CactusPlaybackActions.completed();
        };
        video.addEventListener("ended", cactusCompletionListener);
    }
    function cactusNextEpisode() {
        var current = g("video")._playingItem;
        if (cactusNextBusy || !E || d || g("player").hidden || !current || current.contentId !== E.contentId || !$(current) || cocoIsChannel(current)) return null;
        var episodes = e.episodes(current.simpleProgramList || []), number = Number(current.episode || 1);
        for (var index = 0; index < episodes.length - 1; index++) if (episodes[index].number === number) return episodes[index + 1];
        return null;
    }
    window.CactusPlaybackActions = {
        getNext: cactusNextEpisode,
        completed: function () {
            var following = cactusNextEpisode(), item = g("video")._playingItem;
            if (!following || cactusAutoTimer) return;
            g("play-status").textContent = "Siguiente: Episodio " + following.number + " · empieza en 3 segundos";
            cactusAutoTimer = setTimeout(function () {
                cactusAutoTimer = null;
                if (g("video")._playingItem !== item || !cactusNextEpisode()) return;
                window.CactusPlaybackActions.next().catch(function () { g("play-status").textContent = "No se pudo abrir el siguiente episodio. Puedes reintentarlo."; });
            }, 3000);
        },
        next: function () {
            var following = cactusNextEpisode(), current = g("video")._playingItem;
            if (!following) return Promise.resolve(false);
            clearTimeout(cactusAutoTimer); cactusAutoTimer = null;
            cactusNextBusy = true;
            function finish() { cactusNextBusy = false; window.dispatchEvent(new Event("cactus-playback-actions")); }
            return Promise.resolve(gt(Object.assign({}, current, { episode: following.number, _resume: 0 }))).then(function () { finish(); return true; }, function (err) { finish(); throw err; });
        }
    };
    // Pedir otra tanda solo cuando la persona se acerca al final, nunca recorrer el catálogo completo.
    var cactusMoreFrame = null, cactusMoreScroll = 0;
    function cactusMaybeMore() {
        if (cactusMoreFrame) return;
        cactusMoreFrame = requestAnimationFrame(function () {
            cactusMoreFrame = null;
            var more = g("more"), position = window.scrollY || document.documentElement.scrollTop || 0;
            if (position < 100) cactusMoreScroll = 0;
            if (M || R || more.hidden || !g("player").hidden || !g("detail").hidden || position < cactusMoreScroll + 100) return;
            if (more.getBoundingClientRect().top > window.innerHeight + 300) return;
            cactusMoreScroll = position; more.click();
        });
    }
    window.addEventListener("scroll", cactusMaybeMore, { passive: true });
    g("grid").addEventListener("focusin", cactusMaybeMore);
    function yt(e) { if (i.tv) {
        var t = g("hero").querySelectorAll(".hero-bg");
        [].forEach.call(t, function (t) { e ? t.style.backgroundImage && "none" !== t.style.backgroundImage && (t._parked = t.style.backgroundImage, t.style.backgroundImage = "") : t._parked && (t.style.backgroundImage = t._parked, t._parked = null); });
        var n = g("detailBg");
        e ? n.style.backgroundImage && (n._parked = n.style.backgroundImage, n.style.backgroundImage = "") : n._parked && (n.style.backgroundImage = n._parked, n._parked = null);
    } }
    function bt() { var wasLive = cocoStopLive(); l++, Ee(), cactusRefreshContinue(), cactusResumeDetail(), wasLive ? i.restore() : g("detail").hidden || g("play").focus(); }
    var Ct = 15;
    function Et() { r++, l++, s++, Ge(!1), g("series-panel").hidden = !0, g("season-status").textContent = "", g("detail").hidden = !0, Ee(), g("scrim").hidden = !0, document.documentElement.classList.remove("modal-open"), E = null, g("detailBg").style.backgroundImage = "", g("detail-title")._logoUrl = "", g("detail-title").textContent = "", g("description").textContent = "", g("detail-meta").replaceChildren(), g("episodes").replaceChildren(), g("detail-extra").replaceChildren(), g("detail-original").textContent = "", g("play-status").textContent = "", c && c.isConnected && c.getClientRects().length && c.focus(), c = null; }
    g("close").onclick = Et, g("scrim").onclick = Et, document.addEventListener("keydown", function (e) { if (!(e.defaultPrevented || "Escape" !== e.key && 461 !== e.keyCode))
        if (window.CactusClassicProfiles.dismiss())
            e.preventDefault();
        else {
            if (!a.dismiss())
                return g("player").hidden&&g("detail").hidden&&(x||O)?(g("viewShelves").click(),void e.preventDefault()):document.activeElement === g("query") ? (g("query").blur(), i.openMenu(!0), void e.preventDefault()) : g("player").hidden ? g("detail").hidden ? "home" !== y || w ? (Z("home", "Inicio"), void e.preventDefault()) : void (461 === e.keyCode && (window.parent !== window ? (e.preventDefault(), window.parent.postMessage({ type: "cactus-classic:back", token: new URLSearchParams(location.search).get("launch") }, "*")) : window.webOS && webOS.platformBack && (e.preventDefault(), webOS.platformBack()))) : (Et(), void e.preventDefault()) : (bt(), void e.preventDefault());
            e.preventDefault();
        } }), g("play").onclick = function () { E && "1" !== g("play").dataset.cactusLoading && gt(E); }, g("player-close").onclick = bt, function () { var e = g("video"), t = g("pip"), n = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.cactus-classicPip; function a() { t.hidden = g("player").hidden || !e.videoWidth; } function o() { return !!n && (document.fullscreenElement ? document.exitFullscreen() : document.webkitFullscreenElement && document.webkitExitFullscreen && document.webkitExitFullscreen(), n.postMessage("enter"), !0); } function r() { t.textContent = window.CactusClassicNativePip || document.pictureInPictureElement === e || "picture-in-picture" === e.webkitPresentationMode ? "⧉ Volver a la ventana" : "⧉ Miniatura"; } i.tv || !n && !0 !== document.pictureInPictureEnabled && "function" != typeof e.webkitSetPresentationMode ? t.hidden = !0 : (["loadeddata", "resize", "playing", "timeupdate", "emptied"].forEach(function (t) { e.addEventListener(t, a); }), t.onclick = function () {
        return __awaiter(this, void 0, void 0, function () { var t, e_21; return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (document.pictureInPictureElement === e || "picture-in-picture" === e.webkitPresentationMode)
                        return [2 /*return*/, void ke()];
                    if (window.CactusClassicNativePip)
                        return [2 /*return*/, void n.postMessage("exit")];
                    t = document.pictureInPictureEnabled && e.requestPictureInPicture ? "estandar" : !e.webkitSetPresentationMode || e.webkitSupportsPresentationMode && !e.webkitSupportsPresentationMode("picture-in-picture") ? null : "webkit";
                    if (!("estandar" === t)) return [3 /*break*/, 2];
                    return [4 /*yield*/, e.requestPictureInPicture()];
                case 1: return [2 /*return*/, (_a.sent(), void Ne("pip", ""))];
                case 2:
                    if ("webkit" === t)
                        return [2 /*return*/, (e.webkitSetPresentationMode("picture-in-picture"), setTimeout(function () { "picture-in-picture" === e.webkitPresentationMode || o() || Ne("pip", "La miniatura no está disponible para este vídeo."); }, 400), void Ne("pip", ""))];
                    if (o())
                        return [2 /*return*/];
                    throw new Error("PiP no disponible");
                case 3:
                    e_21 = _a.sent();
                    o() || Ne("pip", "La miniatura no está disponible para este vídeo.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        }); });
    }, e.addEventListener("enterpictureinpicture", r), e.addEventListener("leavepictureinpicture", r), e.addEventListener("webkitpresentationmodechanged", r), window.addEventListener("cactus-classic-pip-change", r)); }(), function () { var e = g("player"), t = g("player-ui"), n = g("video"); ["mousemove", "pointerdown", "touchstart", "keydown"].forEach(function (t) { e.addEventListener(t, xe); }), t.addEventListener("mouseenter", function () { _e = !0, Le(); }), t.addEventListener("mouseleave", function () { _e = !1, xe(); }), t.addEventListener("focusin", function () { _e = !0, Le(); }), t.addEventListener("focusout", function () { _e = !1, xe(); }), n.addEventListener("pause", Le), n.addEventListener("play", xe); var a = null; function i() { a && (clearTimeout(a), a = null); var t = g("vspin"); t.hidden || (t.classList.add("is-settling"), setTimeout(function () { e.hidden || n.paused || (t.hidden = !0), t.classList.remove("is-settling"); }, 350)); } ["waiting", "stalled"].forEach(function (t) { n.addEventListener(t, function () { !function (t) { if (!(e.hidden || !n.currentSrc && !n._hls || n.paused || n.ended || a)) {
        var i = n.currentTime;
        a = setTimeout(function () { a = null, e.hidden || n.paused || n.ended || n.currentTime > i + .05 || (g("vspin").hidden = !1, g("vspin").classList.remove("is-settling"), g("play-status").textContent = t); }, 700);
    } }("stalled" === t ? "La conexión se detuvo; intentando continuar…" : "Cargando el siguiente tramo…"); }); }), n.addEventListener("timeupdate", function () { e.hidden || n.paused || i(); }), n.addEventListener("playing", function () { e.hidden || (i(), g("play-status").textContent = "Reproduciendo"); }), n.addEventListener("error", function () { g("player").hidden || !n.currentSrc && !n._hls || (bt(), g("play-status").textContent = "El reproductor no pudo abrir este vídeo."); }); var o = null; function r() { if (!(e.hidden || n.paused || n.readyState < 2))
        return n.videoWidth ? (o && (clearTimeout(o), o = null), void Ne("codec", "")) : void (o || (o = setTimeout(function () { o = null, e.hidden || n.paused || n.videoWidth || (Ne("codec", "Este navegador no decodifica la imagen de este título (normalmente HEVC/H.265). El audio sí se oye: ábrelo en Safari o en el televisor para ver el vídeo.", !0), Le()); }, 4e3))); o && (clearTimeout(o), o = null); } ["loadeddata", "playing", "resize"].forEach(function (e) { n.addEventListener(e, r); }), document.addEventListener("keydown", function (t) { if (!(e.hidden || t.metaKey || t.ctrlKey || t.altKey)) {
        var n = document.activeElement && document.activeElement.tagName;
        "INPUT" !== n && "SELECT" !== n && ("f" === t.key || "F" === t.key ? (t.preventDefault(), function () { var e = g("player"); try {
            document.fullscreenElement || document.webkitFullscreenElement ? Se() : e.requestFullscreen ? e.requestFullscreen().catch(function () { }) : e.webkitRequestFullscreen && e.webkitRequestFullscreen();
        }
        catch (e) { } }()) : "p" !== t.key && "P" !== t.key || g("pip").hidden || (t.preventDefault(), g("pip").click()));
    } }); }(), ["subs", "audio"].forEach(function (e) { var t = g("subs" === e ? "prefSubs" : "prefAudio"); t.value = a.prefs[e], t.selectedIndex < 0 && t.options.length && (t.value = t.options[0].value), t.onchange = function () { a.set(e, t.value); }; }), g("anime-language").onchange = function () { a.set("animeLanguage", g("anime-language").value); }, g("search").onsubmit = function (e) { e.preventDefault(), O="",cactusCatalogAll=false,cactusShelfTitle="",x=false,w = g("query").value.trim(), b = 1, g("heading").textContent = w ? "Resultados" : "Explorar", window.scrollTo(0, 0), we(!1); }, g("more").onclick = function () { M || this.disabled || (b++, we(!0)); };
    var St = [["Inicio", "home"], ["Continuar viendo", "lib:continue"], ["Mi lista", "lib:fav"]];
    function kt() {
        return __awaiter(this, void 0, void 0, function () { var e, t, n, _a, a, o, e_22; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    te("Preparando Cactus TV", "Conectando con el servicio…"), g("retry").hidden = !0;
                    return [4 /*yield*/, ee("runtimeStatus").catch(function () { return {}; })];
                case 1:
                    e = _b.sent();
                    f = !!e.downloads && !i.tv, ie(u.length ? u : K);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 6, , 8]);
                    return [4 /*yield*/, ee("init")];
                case 3:
                    _b.sent(), g("connection").textContent = "Conectado", g("indicator").style.background = "#66D19E";
                    _a = ae;
                    return [4 /*yield*/, ee("getSections")];
                case 4:
                    t = _a.apply(void 0, [_b.sent(), function (e) { return !(!e.columnCode && !e.code || !e.name && !e.columnName); }]), n = { masnew_live: "En vivo", masnew_featured: "Recomendaciones", masnew_movies: "Películas", masnew_series: "Series", masnew_kids: "Kids", masnew_anime: "Anime y animación", masnew_explorar: "Explorar", masnew_free: "Gratis", masnew_adult: "Adultos", masnew_search: "Tendencias" };
                    J = {}, t.forEach(function (e) { J[e.columnCode || e.code] = !0; });
                    a = St.concat(t.filter(function (e) { return !V[e.columnCode || e.code]; }).map(function (e) { var t = e.columnCode || e.code; return [n[t] || e.name || e.columnName, t]; }));
                    a.some(function (e) { return "masnew_anime" === e[1]; }) || a.push(["Anime y animación", "masnew_anime"]), ie(a);
                    o = a.find(function (e) { return e[1] === y; });
                    o && (g("heading").textContent = o[0]);
                    return [4 /*yield*/, we(!1)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 6:
                    e_22 = _b.sent();
                    g("connection").textContent = "Catálogo local", g("indicator").style.background = "#D6B76D", J = {}, ie([["Continuar viendo", "lib:continue"], ["Mi lista", "lib:fav"], ["Anime", "animeonline"]]), 0 !== y.indexOf("lib:") && (y = f ? "downloads" : "animeonline"), g("heading").textContent = "downloads" === y ? "Descargas" : "animeonline" === y ? "Anime" : "lib:fav" === y ? "Mi lista" : "Continuar viendo";
                    return [4 /*yield*/, we(!1)];
                case 7:
                    _b.sent(), g("connection").title = e_22.message;
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        }); });
    }
    g("retry").onclick = function () { M || (R ? R() : "Conectado" === g("connection").textContent ? (b = 1, we(!1)) : kt()); }, a.configure({ api: ee, lock: function () { G() ? (X(), y = "home", b = 1, we(!1)) : n.lock(); }, changed: function () { ie(u.length ? u : K), document.querySelectorAll(".card").forEach(function (e) { e._item && (e.querySelector("strong").textContent = Y(e._item) + (e._item.episode > 1 ? " · Ep " + e._item.episode : "")); }), E && Re(E); var e = g("hero"); e._item && e._repaint && e._repaint(); } }), document.addEventListener("visibilitychange", function () { document.hidden && (a.dismiss(), n.lock()), document.hidden && o ? (X(), y = "home", b = 1, z = !0) : !document.hidden && z ? (z = !1, Z("home", "Inicio")) : !document.hidden && "home" === y && g("player").hidden && g("detail").hidden && !a.isOpen() && i.scope() === document && g("hero")._item && g("hero")._repaint && g("hero")._repaint(); });
    var It = null;
    function _t() { It || (It = requestAnimationFrame(function () { It = null; var e = g("hero").querySelector(".hero-title"); e && fe(e); })); }
    window.addEventListener("resize", _t), document.fonts && document.fonts.ready && document.fonts.ready.then(_t), window.addEventListener("pagehide", function () { m && m.stop(), Ee(), G() && X(), n.lock(); }), ie(K), window.parent !== window && window.parent.postMessage({ type: "cactus-classic:ready", token: new URLSearchParams(location.search).get("launch") }, "*"), window.CactusClassicProfiles.configure({ api: ee, beforeChange: function () { X(); }, changed: function () { return Z("home", "Inicio"); } }).then(kt).catch(function (e) { te("No se pudo abrir la biblioteca local", e.message), g("retry").hidden = !1; });
}();
