const WorkerPlugin = require("worker-plugin")

module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/sitzplatzplaner/" : "/",
    configureWebpack: {
      devtool: "source-map",
      output: {
        globalObject: "this"
      },
      plugins: [
        new WorkerPlugin()
      ]
    },
};