(function(){
    firebase.auth().onAuthStateChanged(user => {
        /*if(user)
        {
            
        }
        else
        {
           var newURL = window.location.origin + "/login.html" 
             window.location.replace(newURL);
        }*/
    });
    
})();