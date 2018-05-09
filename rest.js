function getRestAssignmentData(mode){
 console.log("getRestAssignmentData", mode);

 createDbObjectStore("assignments", "name", 2).then(function (db){

  if(mode == 'Online'){
    
      var txt;
      var xhttp = new XMLHttpRequest();
      var cntntId = '2265';
      var  course_id='744';
      var urlLogin = 'https://emeademo.blackboard.com';
      
      //xhttp.open('GET', urlLogin + '/webapps/blackboard/bboffline/app/api/getDiscussion/'+ course_id, true); 
      xhttp.open('GET', urlLogin + '/webapps/blackboard/bboffline/app/api/getAssignmentData/'+ course_id +'/'+ cntntId, true); 
      
      xhttp.send();
      xhttp.onreadystatechange = function () {
          if (xhttp.readyState == 4) {
              if (xhttp.status == 200) {
                  txt = xhttp.responseText;
                  var json = JSON.parse(txt);
                  console.log(json);
                  document.getElementById('assignmentResult').innerHTML = '<h3>Showing Online result: <h3><h4>' + JSON.stringify(json) + '</h4>';
  
                  var request = db.transaction(["assignments"], "readwrite")
                .objectStore("assignments")
                .add(json);
                db.close();                
                request.onsuccess = function(event) {
                  // alert("Assignment has been added to your database.");
                };
         
                request.onerror = function(event) {
                   // alert("Unable to add Assignment! ");       
                };
                  
              }else{
                document.getElementById('assignmentResult').innerHTML = "<h3 style='color:  red;'>Please connect to an internet to fetch the data</h4>";
              }
          }
      };   

  }else{
/*     var db; 
    var request = window.indexedDB.open("newDatabase", 1);
   
   request.onerror = function(event) {
     console.log("error: ");
   };

   request.onsuccess = function(event) {
     db = request.result;
     console.log("success: "+ db); */
     var objectStore = db.transaction("assignments").objectStore("assignments");
  
  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
          console.log(cursor.key);
          console.log(cursor.value);
          document.getElementById('assignmentResult').innerHTML = '<h3>Showing Offline result: <h3> <h4>' + JSON.stringify(cursor.value) + '</h4>';
          cursor.continue();
          db.close();
    }
    
    };     

 //  };

  }
});

}

function createDbObjectStore( storeKey, storeValue ){
  return new Promise(function(resolve, reject) {
    var db;
    var request = window.indexedDB.open( "newDatabase" );
   
    request.onerror = function(event) {
      console.log("error: ");
      reject("failed");
    };
   
    request.onsuccess = function(event) {
      db = request.result;
      console.log("success: "+ db);

      if(!db.objectStoreNames.contains(storeKey)){
        db.close();
        var secondRequest = window.indexedDB.open( "newDatabase", db.version + 1 );
      
        secondRequest.onupgradeneeded = function(event) {
          var db = event.target.result;
          console.log("storeKey: ", storeKey);
          console.log("storeValue: ", storeValue);
          var objectStore = db.createObjectStore(storeKey, {keyPath: storeValue});
          resolve(db);
        }
      
      }else{
        resolve(db);
      }
    };
    
  });
}

function getRestDiscussionData(mode){
    console.log("getRestDiscussionData");
    
    createDbObjectStore("discussions", "crsForumMainId", 3).then(function (db){
    
      console.log("Db retrieval success: ", db);
      if(mode == 'Online'){

        var txt;
        var xhttp = new XMLHttpRequest();
        var cntntId = '2265';
        var  course_id='744';
        var urlLogin = 'https://emeademo.blackboard.com';
    
        var crsForumMainId = ''; 
        var discForumIds = [];
        var discForumSub = [];
        var discForumMsg = [];
        var discForumPostedOP = [];
        var discDtcreated = [];
        var discDtmodified = []; 
        var discMsgMain = [];      
        var discMainForumPk1 = []; 
        var discForumMmId=[];
        var discAttachmentData=[];
        var courseId = '';

        xhttp.open('GET', urlLogin + '/webapps/blackboard/bboffline/app/api/getDiscussion/'+ course_id, true); 
        //xhttp.open('GET', urlLogin + '/webapps/blackboard/bboffline/app/api/getAssignmentData/'+ course_id +'/'+ cntntId, true); 
        
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
                    txt = xhttp.responseText;
                    var json = JSON.parse(txt);
                    console.log(json);
    
                    for( var i=0;i<json.length;i++ ){
                     
                          crsForumMainId = json[i]["forum_pk1"];
                          discForumMmId.push(json[i]["mmpk1"]);//post pk1
                          discForumSub.push(json[i]["subject"]);                           
                          discForumPostedOP.push(json[i]["posted_name"]);
                          discDtcreated.push(json[i]["dtcreated"]);
                          discDtmodified.push(json[i]["dtmodified"]);
                          discMsgMain.push(json[i]["msgmain_pk1"]);//parent pk1 (thread)
                          discMainForumPk1.push(json[i]["forum_pk1"]);// main forum pk1
                          discAttachmentData.push(json[i]["attachment_data"]);//attachment_data
                    
                  }

                    var crsForumObj = { crsForumMainId: crsForumMainId
                      , discForumSub: discForumSub
                      , discForumMsg: discForumMmId 
                      , discForumPostedOP: discForumPostedOP 
                      , discDtcreated: discDtcreated   
                      , discDtmodified: discDtmodified   
                      , discMsgMain: discMsgMain 
                      , discForumMmId: discForumMmId
                      , discMainForumPk1:discMainForumPk1
                      , discAttachmentData:discAttachmentData
                      , courseId: course_id
                  };

                    var request = db.transaction(["discussions"], "readwrite")
                  .objectStore("discussions")
                  .add(crsForumObj);
                  db.close();                 
                  request.onsuccess = function(event) {
                    // alert("Assignment has been added to your database.");
                  };
           
                  request.onerror = function(event) {
                     // alert("Unable to add Assignment! ");       
                  };
                    
                  document.getElementById('assignmentResult').innerHTML = '<h3>Showing Online result: <h3><h4>' + JSON.stringify(crsForumObj) + '</h4>';
                }else{
                  document.getElementById('assignmentResult').innerHTML = "<h3 style='color:  red;'>Please connect to an internet to fetch the data</h4>";
                }
            }
        };   
  
    }else{
     /*  var db; 
      var request = window.indexedDB.open("newDatabase", 1);
     
     request.onerror = function(event) {
       console.log("error: ");
     };
  
     request.onsuccess = function(event) {
       db = request.result;
       console.log("success: "+ db); */
       var objectStore = db.transaction("discussions").objectStore("discussions");
    
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
              console.log(cursor.key);
              console.log(cursor.value);
              document.getElementById('assignmentResult').innerHTML = '<h3>Showing Offline result: <h3> <h4>' + JSON.stringify(cursor.value) + '</h4>';
              cursor.continue();
              db.close();
        }
        
        };     
  
//     };
  
    }  

    });
}