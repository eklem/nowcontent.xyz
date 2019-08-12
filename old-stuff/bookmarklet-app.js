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
    // READ from db - always do when mounted()
    // Populate services data model
    readFromDB: function() {
      console.log('Reading from DB')
    },
    // WRITE when user wants to create new or edit old
    // If ID not set, generate ID
    // Fire off a READ at the end
    writeToDB: function() {
      console.log('Writing to DB')
    },

    // Delete ID
    // Fire off a READ at the end
    deleteFromDB: function() {
      console.log('Deleting from DB')
    },

    // Show edit mode for ID and hide view mode
    showEdit: function() {
      console.log('Show edit')
    },

    // Hide edit mode for ID and show view mode
    hideEdit: function() {
      console.log('Hide edit')
    }
  },
  mounted() {
    // setup and populate db
    const db = new Dexie("bookmarklets")
    db.version(1).stores({
      services: 'id,value'
    })
    // put data to db
    db.services.put({id: '1', content: '{"name": "Zapier to Norch", "webhook": "https://hooks.zapier.com/hooks/catch/204265/1p9m8u/"}'}).then (function(){
      return db.services.get('1')
    }).then(function (service) {
      console.log(service.content)
      let zap = JSON.parse(service.content)
      console.log(zap.name)
      console.log(zap.webhook)
      services.push(service)
    }).catch(function(error) {
      console.error(error)
    })
  }
})


// Helper functions:
// - ID hashing

// - Stringify objects before storing

// - Parse strings to objects before populating data model