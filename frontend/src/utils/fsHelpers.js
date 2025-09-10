export function unwrapFields(fields = {}) {
  const parse = (v) => {
    if (v == null) return null;
    if ("stringValue" in v) return v.stringValue;
    if ("integerValue" in v) return Number(v.integerValue);
    if ("doubleValue" in v) return v.doubleValue;
    if ("booleanValue" in v) return v.booleanValue;
    if ("timestampValue" in v) return v.timestampValue;
    if ("nullValue" in v) return null;
    if ("arrayValue" in v) return (v.arrayValue.values || []).map(parse);
    if ("mapValue" in v) return unwrapFields(v.mapValue.fields || {});
    return v;
  };
  const out = {};
  for (const [k, v] of Object.entries(fields)) out[k] = parse(v);
  return out;
}

// برعکس برای نوشتن:
export function wrapFields(obj = {}) {
  const wrap = (val) => {
    if (val === null || val === undefined) return { nullValue: null };
    if (Array.isArray(val)) return { arrayValue: { values: val.map(wrap) } };
    if (typeof val === "boolean") return { booleanValue: val };
    if (typeof val === "number") {
      return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
    }
    if (typeof val === "string") return { stringValue: val };
    if (typeof val === "object") return { mapValue: { fields: wrapFields(val) } };
    return { stringValue: String(val) };
  };
  const out = {};
  for (const [k, v] of Object.entries(obj)) out[k] = wrap(v);
  return out;
}