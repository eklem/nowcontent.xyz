function getDefaultData() {
  // Initialize DB
  db = new Dexie("bookmarklets")
  db.version(1).stores({
    services: 'id,value'
  })
  // Modal for adding a bookmarklet
  modal = {show: false}
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
          label: 'Secret key'
        },
        {
          type: 'collectionID',
          value: '',
          label: 'Collection ID'
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
          label: 'Project ID'
        },
        {
          type: 'datasetName',
          value: '',
          label: 'Dataset name'
        },
        {
          type: 'tokenWithWriteAccess',
          value: '',
          label: 'Token with write access'
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
    modal,
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
        console.log(JSON.stringify(bookmarklets.services))
      }).catch(function(error) {
        console.error(error)
      })
    },

    // Bookmarklet JavaScript generating
    // Stitching together embedded scripts for the bookmarklets
    generateScript: function(index, id, serviceName, content) {
      console.log('index: ' + index + ' ID: ' + id + ' Service name: ' + serviceName + ' content: ' + JSON.stringify(content))
      // JSONbin.io endpoint script
      if (serviceName === 'JSONbin.io') {
        let script = 'javascript: (' + function(collectionID, secretKey) {
          var url = window.location.href;
          var title = document.title;
          var body = document.body.innerText;
          var endpointUrl = 'https://api.jsonbin.io/b';
          var sendObj = JSON.stringify({'url': url, 'title': title, 'body': body});
          fetch(endpointUrl, {
            method: 'post',
            headers: {
              'Content-type': 'application/json',
              'secret-key': secretKey,
              'collection-id': collectionID
            },
            body: sendObj
          })
            .then(response => response.json())
            .then(result => alert('Content added to JSONbin.io\nCollection: ' + collectionID + '\n\n' + JSON.stringify(result)))
            .catch(error => alert('Adding content failed.\nIs the bookmarklet set up right?\n\n' + JSON.stringify(error)));
        } + ')(' + JSON.stringify(content.collectionID) + ',' + JSON.stringify(content.secretKey) + ')';
        return script
      }
      // Sanity.io endpoint script
      else if (serviceName === 'Sanity.io') {
        let script = 'javascript: (' + function(projectID, datasetName, tokenWithWriteAccess) {
          let url = window.location.href;
          let id = url.split('').reduce((prevHash, currVal) =>
            (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
          let title = document.title;
          let body = document.body.innerText;
          let endpointUrl = 'https://' + projectID + '.api.sanity.io/v1/data/mutate/' + datasetName;
          let bearerToken = 'Bearer ' + tokenWithWriteAccess;
          const sendObj  = JSON.stringify({mutations: [{
            createOrReplace: {
              _id: id,
              _type: 'document',
              url: url,
              title: title,
              body: body
            }
          }]});
          fetch(endpointUrl, {
            method: 'post',
            headers: {
              'Content-type': 'application/json',
              'Authorization': bearerToken
            },
            body: sendObj
          })
            .then(response => response.json())
            .then(result => alert('Content added to Sanity.io\nProject: ' + projectID + ' - Dataset: ' + datasetName + '\n\n' + result))
            .catch(error => alert('Adding content failed.\nIs the bookmarklet set up right?\n\n' + error));
        } + ')(' + JSON.stringify(content.projectID) + ',' + JSON.stringify(content.datasetName) + ',' + JSON.stringify(content.tokenWithWriteAccess) + ')';
        return script
      }
      // Zapier.com endpoint script
      else if (serviceName === 'Zapier.com') {
        let script = 'javascript: (' + function(webhook) {
          var url = window.location.href;
          var title = document.title;
          var body = document.body.innerText;
          var sendObj = JSON.stringify({'url': url, 'title': title, 'body': body});
          fetch(webhook, {
            method: 'post',
            body: sendObj,
          })
            .then(response => response.json())
            .then(result => alert('Content added to Zapier.com\nWebhook: ' + webhook + '\n\n' + JSON.stringify(result)))
            .catch(error => alert('Adding content failed.\nIs the bookmarklet set up right?\n\n' + error));
        } + ')(' + JSON.stringify(content.webhook) + ')';
        return script
      }
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
      hashedID = hashCode(JSON.stringify(this.servicesTemp))
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

    // Delete ID
    // Fire off a READ at the end
    deleteFromDB: function(primaryKey) {
      console.log('Deleting from DB')
      db.services.delete(primaryKey).then(() => {
        console.log("Bookmarkleet successfully deleted");
      }).catch((err) => {
          console.error("Could not delete bookmarklet");
      }).finally(() => {
        this.resetData()
      });
    },
    resetData: function() {
      var def = getDefaultData()
      Object.assign(this.$data, def)
      this.readFromDB()
    },
    showService: function(index) {
      for (let i = 0; i < serviceTemplates.length; i++) {
        serviceTemplates[i].show = false
      }
      serviceTemplates[index].show = true
    },
    showModal: function(show) {
      modal.show = show
    }
  },
  mounted: function() {
    this.readFromDB()
  }
})


// Helper functions:
// - ID hashing
const hashCode = function(str){
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

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
