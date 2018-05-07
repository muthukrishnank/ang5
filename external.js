var myExtObject = (function() {

  return {
      
    getAssignmentData: function(mode) {
        getRestAssignmentData(mode);
    },   
    getDiscussionData: function(mode) {
        getRestDiscussionData(mode);
    }  
     
  }

})(myExtObject||{})
