module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
    live: {
      host: "192.168.1.155",
      port: 8501,
      network_id: "*", // Match any network id
      gas:"2000000"
    }
  }
}
