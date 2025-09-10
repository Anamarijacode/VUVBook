
function SignOut() {
    firebase.auth().signOut().then(function() {
      console.log("Korisnik odjavljen.");
    }).catch(function(error) {
      console.error("Greška prilikom odjave:", error);
    });
  }
  