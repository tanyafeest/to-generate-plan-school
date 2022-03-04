let worker = new Worker('./AlgorithmWorker.js', { type: 'module' });

const send = (message) => worker.postMessage({
  message
})

export default {
  worker,
  send,
}