module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "45.64.195.251",
      port: 8546,
      network_id: "*" // Match any network id
    },
    live: {
      host: "45.64.195.251",
      port: 8546,
      network_id: "*",// Match any network id
      gas:"2000000"
    },
    local: {
      host: "192.168.1.155",
      port: 8102,
      network_id: "*",// Match any network id
      gas:"2000000"
    }
  }
}
