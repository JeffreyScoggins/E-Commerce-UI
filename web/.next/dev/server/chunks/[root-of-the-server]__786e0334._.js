module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/serverAuth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAuthCookies",
    ()=>clearAuthCookies,
    "getAccessToken",
    ()=>getAccessToken,
    "getRefreshToken",
    ()=>getRefreshToken,
    "setAuthCookies",
    ()=>setAuthCookies
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
async function getAccessToken() {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return jar.get(ACCESS_COOKIE)?.value;
}
async function getRefreshToken() {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return jar.get(REFRESH_COOKIE)?.value;
}
async function setAuthCookies(access, refresh) {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const base = {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: ("TURBOPACK compile-time value", "development") === "production"
    };
    jar.set(ACCESS_COOKIE, access, {
        ...base,
        maxAge: 60 * 15
    });
    jar.set(REFRESH_COOKIE, refresh, {
        ...base,
        maxAge: 60 * 60 * 24 * 7
    });
}
async function clearAuthCookies() {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    jar.delete(ACCESS_COOKIE);
    jar.delete(REFRESH_COOKIE);
}
}),
"[project]/app/api/cart/items/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/serverAuth.ts [app-route] (ecmascript)");
;
;
async function refreshAccess(base, refresh) {
    const r = await fetch(`${base}/auth/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refresh
        }),
        cache: "no-store"
    });
    const data = await r.json().catch(()=>({}));
    if (!r.ok || !data?.access) return null;
    return data.access;
}
async function djangoAuthedFetch(path, init) {
    const base = process.env.DJANGO_API_BASE ?? "http://127.0.0.1:8000/api";
    let access = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAccessToken"])();
    const refresh = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRefreshToken"])();
    if (!access) return {
        status: 401,
        json: {
            detail: "Unauthorized"
        }
    };
    let res = await fetch(`${base}${path}`, {
        ...init,
        headers: {
            ...init.headers || {},
            Authorization: `Bearer ${access}`
        },
        cache: "no-store"
    });
    if (res.status === 401 && refresh) {
        const newAccess = await refreshAccess(base, refresh);
        if (!newAccess) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearAuthCookies"])();
            return {
                status: 401,
                json: {
                    detail: "Unauthorized"
                }
            };
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setAuthCookies"])(newAccess, refresh);
        access = newAccess;
        res = await fetch(`${base}${path}`, {
            ...init,
            headers: {
                ...init.headers || {},
                Authorization: `Bearer ${access}`
            },
            cache: "no-store"
        });
    }
    const json = await res.json().catch(()=>({}));
    return {
        status: res.status,
        json
    };
}
async function POST(req) {
    const body = await req.json().catch(()=>({}));
    const out = await djangoAuthedFetch("/cart/items/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(out.json, {
        status: out.status
    });
}
async function PATCH(req) {
    const body = await req.json().catch(()=>({}));
    const out = await djangoAuthedFetch("/cart/items/", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(out.json, {
        status: out.status
    });
}
async function DELETE(req) {
    const body = await req.json().catch(()=>({}));
    const out = await djangoAuthedFetch("/cart/items/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(out.json, {
        status: out.status
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__786e0334._.js.map