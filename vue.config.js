module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/sitzplatzplaner/" : "/",
    configureWebpack: {
      devtool: "source-map",
    },
  };