https://sentry.io/organizations/sentry/issues/2633415861/events/effd77faa184466e8dd952414507cb02/?project=11276

Function name
old: callback
new: Sentry
best: Sentry.captureException

---

https://sentry.io/organizations/sentry/issues/2633415861/events/effd77faa184466e8dd952414507cb02/?project=11276 - 2nd frame from the top `/_static/dist/sentry/chunks/vendors-node_modules_sentry_hub_esm_exports_js-node_modules_moment_moment_js.73c4372079be997209fd.js`

https://s1.sentry-cdn.com/_static/dist/sentry/chunks/vendors-node_modules_sentry_hub_esm_exports_js-node_modules_moment_moment_js.73c4372079be997209fd.js

When resolved with `SmCache` in examples dir with `RUST_BACKTRACE=1 cargo run -- --source-file ~/Desktop/vendor.js --sourcemap-file ~/Desktop/vendor.js.map --line 2 --column 2041`
it loops forever and panics — `'The parser seems to be recursing forever'`

---

https://sentry.io/organizations/sentry/issues/3472706309/events/7344d38a0f554dacb4410c61443263c2/json/ - 2nd exeception, 4th frame
 
Function name
old: errorCb
new: <anonymous>

Possibly functional chaining not handled?