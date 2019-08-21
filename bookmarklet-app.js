function getDefaultData() {
  // Initialize DB
  db = new Dexie("bookmarklets")
  db.version(1).stores({
    services: 'id,value'
  })
  // Script objects for Bookmarklet scripts
  scripts = {
    'jsonbinio': '',
    'sanityio': '',
    'zapiercom': ''
  }
  // Array to hold stuff read from DB
  services  = []
  // Temporary object to put to DB
  servicesTemp = {}
  // Templates for 
  // A: Render input form
  // B: Keep data to put to serviceTemp 
  serviceTemplates = [
    { 
      serviceName: 'JSONbin.io', 
      name: '',
      show: false,
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
      show: false,
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
      show: false,
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
    scripts,
    services,
    servicesTemp,
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
    addBookmarklet: function(index) {
      console.log('Writing to DB')

      // Transforming input into object to write to DB
      // This stuff can be done better !!!
      let id = ''
      let contentObj = {}
      this.servicesTemp = {name: serviceTemplates[index].name, serviceName: serviceTemplates[index].serviceName}
      for (let i = 0; i < serviceTemplates[index].content.length; i++) {
        delete serviceTemplates[index].content[i].label
        let key = serviceTemplates[index].content[i].type
        let value = serviceTemplates[index].content[i].value
        contentObj = {[key]: value}
        this.servicesTemp = {...this.servicesTemp, ...contentObj}
      }
      hashedID = this.hashCode(JSON.stringify(this.servicesTemp))
      this.servicesTemp = {id: hashedID, content: JSON.stringify(this.servicesTemp)}

      // Put stuff to indexedDB
      db.services.put(this.servicesTemp).then (function(){
        return db.services.toArray()
      }).then(function (service) {
        bookmarklets.services = service
      }).catch(function(error) {
        console.error(error)
      })

      // Clean up data
      this.resetData()
    },
    generateScript: function(serviceName, id) {
      if (serviceName === 'JSONbin.io') {
        console.log('Hello ' + serviceName + ' - ID: ' + id)
      }
      else if (serviceName === 'Sanity.io') {
        console.log('Hello ' + serviceName + ' - ID: ' + id)
      }
      else if (serviceName === 'Zapier.com') {
        console.log('Hello ' + serviceName + ' - ID: ' + id)
        // this.randomNumber = Math.floor((Math.random() * 10) + 1);

        var GREETING = "Hi, I'm ";
        var NAME = "Rob";
        return this.scripts.zapiercom = 'javascript: (' + function(greeting, name) { 
          alert(greeting + name);
          alert(name + greeting + name);
        } + ')(' + JSON.stringify(GREETING) + ',' + JSON.stringify(NAME) + ')';
      //   return this.scripts.zapiercom = `
      //   javascript: (function () {
      //     var test = 'something variable: ` + this.randomNumber + `';
      //     var bookmarklet = document.createElement('script');
      //     bookmarklet.setAttribute('text',
      //       alert(test)
      //     );
      //     document.body.appendChild(bookmarklet);
      //   }());
      // `
      }
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
    },
    resetData: function() {
      var def = getDefaultData()
      Object.assign(this.$data, def)
    },
    hashCode: function(str) {
      return str.split('').reduce((prevHash, currVal) =>
        (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
    },
    showService: function(index) {
      for (let i = 0; i < serviceTemplates.length; i++) {
        serviceTemplates[i].show = false
      }
      serviceTemplates[index].show = true
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