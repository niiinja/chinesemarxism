// Meaning-based search, run entirely in the visitor's browser.
// The model (BAAI bge-small-en-v1.5, quantised) and the article fingerprints are served with the site;
// nothing the visitor types is sent anywhere.

// Where the model files live. They are served from this site under models/ (see README).
// If your host cannot serve the 34 MB model file, set USE_REMOTE_MODEL to true: it is then
// downloaded from huggingface.co instead (the visitor's browser contacts Hugging Face once).
const USE_REMOTE_MODEL = false;

let meta, vectors, extractor, loading;

export function isReady() { return !!extractor && !!vectors; }

export async function loadEngine(onProgress = () => {}) {
  if (isReady()) return;
  if (loading) return loading;
  loading = (async () => {
    const [m, buf] = await Promise.all([
      fetch('data/embeddings.json', { cache: 'no-cache' }).then((r) => r.json()),
      fetch('data/embeddings.bin', { cache: 'no-cache' }).then((r) => r.arrayBuffer()),
    ]);
    meta = m; vectors = new Int8Array(buf);
    const { pipeline, env } = await import('./vendor/transformers.min.js');
    env.allowLocalModels = !USE_REMOTE_MODEL;
    env.allowRemoteModels = USE_REMOTE_MODEL;
    env.localModelPath = new URL('../models/', import.meta.url).href;
    env.backends.onnx.wasm.wasmPaths = new URL('./vendor/', import.meta.url).href;
    env.backends.onnx.wasm.numThreads = 1;
    const files = {};
    extractor = await pipeline('feature-extraction', meta.model, {
      dtype: 'q8',
      progress_callback: (p) => {
        if (p.status === 'progress' && p.total) {
          files[p.file] = [p.loaded, p.total];
          const [l, t] = Object.values(files).reduce((a, [x, y]) => [a[0] + x, a[1] + y], [0, 0]);
          onProgress(Math.min(99, Math.round((l / t) * 100)));
        }
      },
    });
    onProgress(100);
  })();
  try { await loading; } catch (e) { loading = null; throw e; }
}

// returns Float32Array of cosine similarities, one per article in index.json order
export async function scores(query) {
  const out = await extractor(meta.queryPrefix + query, { pooling: meta.pooling, normalize: true });
  const q = out.data; const d = meta.dim; const n = meta.count;
  const s = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let acc = 0; const o = i * d;
    for (let j = 0; j < d; j++) acc += q[j] * vectors[o + j];
    s[i] = acc / meta.scale;
  }
  return s;
}
