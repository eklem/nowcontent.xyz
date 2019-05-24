function getDefaultData() {
  services = []
  return { 
    services
  }
}

new Vue({
  el: '#app',
  data: getDefaultData(),
  methods: {
    mounted() {
      console.log(services)
      vm.services.push({userid: '204265', id: '1p9m8u'})
      console.log(services)
    }
  }
})


      // //read and populate
      // const db2 = new Dexie("bookmarklets");
      // console.log('something')
      // db2.version(1).stores({
      //   services: 'name,userid,id,secretkey'
      // })
      
      // db2.services.put({name: "Zapier", userid: "204265", id: "1p9m8u", secretkey: "" }).then (function(){
      //   //
      //   // Then when data is stored, read from it
      //   //
      //   let service = db2.services.get('Zapier')
      //   this.services.push(service)
      // })