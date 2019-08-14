function getDefaultData() {
  db = new Dexie("bookmarklets")
  db.version(1).stores({
    services: 'id,value'
  }) 
  selectedService = Number
  services  = []
  serviceTemplates = [
    { 
      serviceName: 'JSONbin.io', 
      name: '',
      content: [
        {
          type: 'secretKey',
          value: '',
          label: 'secret_key'
        },
        {
          type: 'collectionID',
          value: '',
          label: 'collection_id'
        }
      ]
    },
    { 
      serviceName: 'Sanity.io',
      name: '',
      content: [
        {
          type: 'projectID',
          value: '',
          label: 'project_id'
        },
        {
          type: 'datasetName',
          value: '',
          label: 'dataset_name'
        },
        {
          type: 'tokenwithWriteAccess',
          value: '',
          label: 'token_with_write_access'
        }
      ]
    },
    { 
      serviceName: 'Zapier.com',
      name: '',
      content: [
        {
          type: 'webhook',
          value: '',
          label: 'Webhook'
        }
      ]
    }
  ]
  return { 
    db,
    selectedService,
    services,
    serviceTemplates
  }
}

let bookmarklets = new Vue({
  el: '#bookmarklets',
  data: getDefaultData(),
  methods: {
    // READ from db
    readFromDB: function() {
      db.services.toArray().then (function(){
        return db.services.toArray()
      }).then(function(services) {
        bookmarklets.services = stringParse(services)
      }).catch(function(error) {
        console.error(error)
      })
    },

    // WRITE when user wants to create new or edit old
    // If ID not set, generate ID
    // Fire off a READ at the end
    writeToDB: function(formInput) {
      console.log('Writing to DB')
      db.services.put({id: '423lsdj4s', content: '{"name": "Zapier to Norch", "webhook": "https://hooks.zapier.com/hooks/catch/204265/"}'}).then (function(){
        return db.services.toArray()
      }).then(function (service) {
        bookmarklets.services = service
      }).catch(function(error) {
        console.error(error)
      })
    },

    // Delete ID
    // Fire off a READ at the end
    deleteFromDB: function(id) {
      console.log('Deleting from DB')
      readFromDB()
    },

    // Show edit mode for ID and hide view mode
    showEdit: function(id) {
      console.log('Show edit')
    },

    // Hide edit mode for ID and show view mode
    hideEdit: function(id) {
      console.log('Hide edit')
    }
  },
  mounted: function() {
    this.readFromDB()
  }
})


// Helper functions:
// - ID hashing

// - Stringify objects before storing

// - Parse strings to objects before populating data model
// loop through stuff
const stringParse = function(array){
  for (var i = 0; i < array.length; i++) {
    // JSON.parse strings of content
    array[i].content = JSON.parse(array[i].content)
  }
  return array
}

// Bookmarklet JavaScript generating
// Stitching together embedded scripts for the bookmarklets
const zapierScript = function(template) {
  const bookmarklet = ''
  return bookmarklet
}