function getDefaultData() {
  // Initialize DB
  db = new Dexie("bookmarklets")
  db.version(1).stores({
    services: 'id,value'
  })
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
          type: 'tokenWithWriteAccess',
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
      if (serviceName === 'JSONbin.io') {
        console.log('Hello ' + serviceName + ' - ID: ' + id)
        let script = 'javascript: (' + function(collectionID, secretKey) {
          var url = window.location.href;
          var title = document.title;
          var body = document.body.innerText;
          var req = new XMLHttpRequest();
          req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
              console.log(req.responseText);
            }
          };
          req.open('POST', 'https://api.jsonbin.io/b', true);
          req.setRequestHeader('Content-Type', 'application/json');
          req.setRequestHeader('secret-key', secretKey);
          req.setRequestHeader('collection-id', collectionID);
          var sendObj = JSON.stringify({'url': url, 'title': title, 'body': body});
          req.send(sendObj);
        } + ')(' + JSON.stringify(content.collectionID) + ',' + JSON.stringify(content.secretKey) + ')';
        console.log(script)
        return script
      }
      else if (serviceName === 'Sanity.io') {
        console.log('Hello ' + serviceName + ' - ID: ' + id)
        let script = 'javascript: (' + function(projectID, datasetName, tokenWithWriteAccess) {
          var url = window.location.href;
          var title = document.title;
          var body = document.body.innerText;
          var req = new XMLHttpRequest();
          req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
              console.log(req.responseText);
            }
          };
          let endpointUrl = 'https://' + projectID + '.api.sanity.io/v1/data/mutate/' + datasetName;
          let bearerToken = 'Bearer ' + tokenWithWriteAccess;
          req.open('POST', endpointUrl, true);
          req.setRequestHeader('Content-Type', 'application/json');
          req.setRequestHeader('Authorization', bearerToken);
          var sendObj = JSON.stringify([{ createOrReplace: { '_id': url, 'title': title, 'body': body } }]);
          req.send(sendObj);
        } + ')(' + JSON.stringify(content.projectID) + ',' + JSON.stringify(content.datasetName) + ',' + JSON.stringify(content.tokenWithWriteAccess) + ')';
        console.log(script)
        return script
      }
      else if (serviceName === 'Zapier.com') {
        console.log('Hello ' + serviceName + ' - ID: ' + id)
        let script = 'javascript: (' + function(webhook) {
          var iframe = document.createElement('iframe');
          iframe.name = 'response';
          iframe.style.visibility = 'hidden';
          document.body.appendChild(iframe);
          var form = document.createElement('form');
          form.style.visibility = 'hidden';
          form.method = 'post';
          form.action = webhook;
          form.target = 'response';
          input_url = document.createElement('input');
          input_url.name = 'url';
          input_url.value = window.location.href;
          form.appendChild(input_url);
          input_title = document.createElement('input');
          input_title.name = 'title';
          input_title.value = document.title;
          form.appendChild(input_title);
          input_body = document.createElement('input');
          input_body.name = 'body';
          console.dir(document.body.innerText);
          input_body.value = document.body.innerText;
          form.appendChild(input_body);
          document.body.appendChild(form);
          form.submit();
        } + ')(' + JSON.stringify(content.webhook) + ')';
        console.log(script)
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
