module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*" // Match any network id
    },
    live: {
      host: "localhost",
      port: 9545,
      network_id: "*"// Match any network id
    
    },
    local: {
      host: "192.168.1.155",
      port: 8102,
      network_id: "*",// Match any network id
      gas:"2000000"
    }
  }
}
