
document.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
      Login();
  }
});


function Login() {
  var emailOne = document.getElementById('email').value;
  var passwordOne = document.getElementById('password').value;
  var nemaEmailaElement = document.getElementById('nema-emaila');
  var nemaLozinkeElement = document.getElementById('nema-lozinke');
  var errorMessageElement = document.getElementById('error-message');

  if (emailOne && passwordOne) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailOne)) {
      nemaEmailaElement.textContent = 'Unesite validan email.';
      nemaLozinkeElement.textContent = '';
      errorMessageElement.textContent = '';
      return;
    }

    auth.signInWithEmailAndPassword(emailOne, passwordOne)
      .then((user) => {
        window.open('../index.html', '_self');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        errorMessageElement.textContent = 'Pogrešna lozinka ili email.';
        nemaLozinkeElement.textContent = '';
        nemaEmailaElement.textContent = '';
      });
  } else {
    if (!passwordOne) {
      nemaLozinkeElement.textContent = 'Molimo vas unesite lozinku';
    } else if (!emailOne) {
      nemaEmailaElement.textContent = 'Molimo vas unesite email';
    } else {
      errorMessageElement.textContent = 'Molimo vas da popunite oba polja.';
    }
  }
}
