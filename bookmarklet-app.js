function getDefaultData() {
  services = []
  return { 
    services
  }
}

var vm = new Vue({
  el: '#app',
  data: getDefaultData(),
  methods: {
  },
  mounted() {
    // setup and populate db
    const db = new Dexie("bookmarklets");
    console.log('something')
    db.version(1).stores({
      services: 'name,userid,id,secretkey'
    })
    // put data to db
    db.services.put({name: "Zapier", userid: "204265", id: "1p9m8u", secretkey: "" }).then (function(){
      return db.services.get('Zapier')
    }).then(function (service) {
      console.dir(service)
      services.push(service)
    }).catch(function(error) {
      console.error(error)
    })
  }

})