
var sUrl = window.location.href;
console.log(sUrl);
var oUrl = new URL(sUrl);
console.log(oUrl);
var sKnjiga = oUrl.searchParams.get("knjiga_key");
console.log(sKnjiga);
var OknjigaRef = oDb.ref('knjige/' + sKnjiga);

OknjigaRef.once('value', function (oOdgovorPosluzitelja) {
    var oKnjiga1 = oOdgovorPosluzitelja.val();

    if (!oKnjiga1) {
        window.location.href = 'index.html';
        return;
    }
    var a = oKnjiga1.autori.join(', ');
    var b = oKnjiga1.zanrovi.join(', ')
 $('#h212').html(oKnjiga1.naslov)
    $('#knjiga-tekst').html(oKnjiga1.opis);

    var imageRef = firebase.storage().refFromURL(oKnjiga1.slika);
    imageRef.getDownloadURL().then(function (imageUrl) {
        $('#image').attr('src', imageUrl)
    });
    $('#p-id').html('Id knjige: ' + oKnjiga1.id)
    $('#p-naziv').html('Naslov knjige: '+ oKnjiga1.naslov)
    $('#p-autor').html('Autor/i: ' + a)
    $('#p-isbn').html('ISBN: ' + oKnjiga1.isbn)
    $('#p-broj-stranica').html('Broj stranica: '+ oKnjiga1.broj_stranica)
    $('#zanr').html('Zanrov/ovi: '+b)
    $('#p-d').html(oKnjiga1.dostupnost ? 'Dostupno' : 'Nije dostupno')
    $(document).ready(function () {

        $('#btnUredi').click(function () {
            ModalUrediKnjigu(sKnjiga);
        });
        $('#btnObrisi').click(function () {
            ObrisiKnjigu(sKnjiga);
        });
        $('#btnDodaj1').click(function ()
        {
          DodajKnjigu();
        })
        $('#btnIznajmi').click(function () {
            $('#modalUredi').modal('show');
        });
        $('#btnVrati').click(function () {
            $('#modalUredi').modal('show');
        });

    });

    if (oKnjiga1.dostupnost !== false) {
      div = $('#rowdiv').append(
          '<div class="col-3"><button class="btn" data-isbn="' +
          oKnjiga1.isbn +
          '" onclick="ModalPosudi(\'' + sKnjiga + '\', \'filterBooks\')">Posudi</button></div>'
      );
  } else {
      div = $('#rowdiv').append(
          '<div class="col-3"><button class="btn" id="btnVrati" onClick="VratiKnjigu(\'' + sKnjiga + '\')">Vrati</button></div>'
      );
  }
  

    oDbKnjiga.once('value', function (oOdgovorPosluzitelja) {
        var foundMatchingBook = false;
        oOdgovorPosluzitelja.forEach(function (oKnjigaSnapshot) {
            var oKnjiga = oKnjigaSnapshot.val();
            if (oKnjiga1.isbn === oKnjiga.isbn && oKnjiga1.id !== oKnjiga.id) {
                foundMatchingBook = true;
            }
        });

        if (foundMatchingBook) {
            divz= document.getElementById('c2');
            divz.style.display = 'block';
            divz.style.display = "flex"; 
            filterBooks(oKnjiga1.isbn, oKnjiga1.id);
        } else {
            document.getElementById('c2').style.display = 'none';
        }
    });
});
function DodajKnjigu() {
  var oDbKnjiga = firebase.database().ref('knjige'); 

  OknjigaRef.once('value', function(oO)
  {
oKnjiga1 = oO.val();
 
  var kljuc = firebase.database().ref().child('knjige').push().key;
  var newBookRef = oDbKnjiga.push();
  newBookRef.set({
      autori: oKnjiga1.autori,
      broj_stranica: oKnjiga1.broj_stranica,
      dostupnost: true, 
      isbn: oKnjiga1.isbn,
      naslov: oKnjiga1.naslov,
      opis: oKnjiga1.opis,
      slika: oKnjiga1.slika,
      id:kljuc,
      zanrovi: oKnjiga1.zanrovi
    });
      
     location.reload();
  });

 
  alert('Knjiga uspješno dodana!');
}

    function filterBooks(clickedIsbn, id) {
        var oTablicaKnjiga = $('#bookTable1 tbody');
        var nRbr = 1;
    
        oDbKnjiga.on('value', function (oOdgovorPosluzitelja) {
            oOdgovorPosluzitelja.forEach(function (oKnjigaSnapshot) {
                var oKnjiga = oKnjigaSnapshot.val();
    
                if (clickedIsbn === oKnjiga.isbn && oKnjiga.id !== id) {
                    var link = 'img/a.png';
                    alternateLink = 'img/b.png';
    
                    var imageRef = firebase.storage().refFromURL(oKnjiga.slika);
                    imageRef.getDownloadURL().then(function (imageUrl) {
                        if (nRbr % 2 === 0) {
                            link = alternateLink;
                        }
                        var posudi_vrati = oKnjiga.dostupnost
                        ? '<button class="btn btn-primary btn-posudi" data-isbn="' +
                          oKnjiga.isbn +
                          '" onclick="ModalPosudi(\'' + oKnjigaSnapshot.key + '\', \'filterBooks\')">Posudi</button>'
                        : '<button class="btn btn-warning btn-vrati" data-isbn="' +
                          oKnjiga.isbn +
                          '" onClick="VratiKnjigu(\'' + oKnjigaSnapshot.key + '\', \'filterBooks\')">Vrati</button>';


                        var autori = oKnjiga.autori.join(', ');
                        var zanrovi = oKnjiga.zanrovi.join(', ');
    
                        var postojecir = oTablicaKnjiga.find('tr[data-knjiga-key="' + oKnjigaSnapshot.key + '"]');
    
                        if (postojecir.length > 0) {
                            postojecir.html(
                                '<tr data-knjiga-key="' + oKnjigaSnapshot.key + '">'+
                                '<td>' + nRbr++ + '.</td>' +
                                '<td><img src="' + imageUrl + '" alt="Slika" style="max-width: 100px; max-height: 100px;"></td>' +
                                '<td><a href="knjiga.html?knjiga_key=' + oKnjigaSnapshot.key + '" style="text-decoration: none; color: inherit; cursor: pointer;" onmousedown="this.style.color=\'black\'" onmouseup="this.style.color=\'inherit\'">' + oKnjiga.naslov + '</a></td>' +
                  '<td>' + oKnjiga.autor + '</td>'+                  
                                '<td>' + autori + '</td>' +
                                '<td>' + zanrovi + '</td>' +
                                 '<td>' + oKnjiga.isbn + '</td>' +
                                '<td>' + (oKnjiga.dostupnost ? 'Dostupno' : 'Nije dostupno') + '</td>' +
                                '<td>' + oKnjiga.broj_stranica + '</td>' +
                                '<td><button class="button" style="background-color: transparent; border:none; outline:none;" onClick="ModalUrediKnjigu(\'' + oKnjigaSnapshot.key + '\')"><i class="fa-solid fa-pen" style="color: #994f1d;"></i></button></td>' +
                                '<td><button class="button" style="background-color: transparent; border:none; outline:none;" onClick=" ObrisiKnjigu1(\'' + oKnjigaSnapshot.key + '\')"><i class="fa-solid fa-eraser" style="color: #994f1d;"></i></button></td>' +
                                '<td>' + posudi_vrati +'</td>' + '</tr>'
                            );
                        } else {
                            oTablicaKnjiga.sort().append(
                                '<tr data-knjiga-key="' + oKnjigaSnapshot.key + '">' +
                                '<td>' + nRbr++ + '.</td>' +
                                '<td><img src="' + imageUrl + '" alt="Slika" style="max-width: 100px; max-height: 100px;"></td>' +
                                '<td><a href="knjiga.html?knjiga_key=' + oKnjigaSnapshot.key + '" style="text-decoration: none; color: inherit; cursor: pointer;" onmousedown="this.style.color=\'black\'" onmouseup="this.style.color=\'inherit\'">' + oKnjiga.naslov + '</a></td>' +
                                '<td>' + autori + '</td>' +
                                '<td>' + zanrovi +'</td>' +
                                '<td>' + oKnjiga.isbn + '</td>' +
                                '<td>' + (oKnjiga.dostupnost ? 'Dostupno' : 'Nije dostupno') + '</td>' +
                                '<td>' + oKnjiga.broj_stranica + '</td>' +
                                '<td><button class="button" style="background-color: transparent; border:none; outline:none;" onClick="ModalUrediKnjigu(\'' + oKnjigaSnapshot.key + '\')"><i class="fa-solid fa-pen" style="color: #994f1d;"></i></button></td>' +
                                '<td><button class="button" style="background-color: transparent; border:none; outline:none;" onClick=" ObrisiKnjigu1(\'' + oKnjigaSnapshot.key + '\')"><i class="fa-solid fa-eraser" style="color: #994f1d;"></i></button></td>' +
                                 '<td>' + posudi_vrati + '</td>'  +'</tr>'
                            );
                        }
                    }).catch(function (error) {
                        console.error('Error getting image download URL:', error);
                    });
                }
            });
        });
    }
    

    function VratiKnjigu(sKnjiga) {
      console.log(sKnjiga)
      var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);
  
      oKnjigaRef.once('value', function (oOdgovorPosluzitelja) {
          var oKnjiga = oOdgovorPosluzitelja.val();
  
          if (oKnjiga.dostupnost === false) {
              oKnjiga.dostupnost = true;
              oKnjigaRef.update(oKnjiga).then(function () {
                  alert('Knjiga uspješno vraćena');
                  anzurirajPosudi(sKnjiga);
                  
              }).catch(function (error) {
                  alert('Greška pri ažuriranju dostupnosti knjige: ' + error.message);
              });
              
          } else {
              alert('Knjiga nije posuđena, stoga je nemoguće vratiti je.');
          }
      });
  }
  
  function anzurirajPosudi(sKnjiga) {
      var oPosudbaRef = oDb.ref('posudbe');
  
      oPosudbaRef.once('value', function (oPosudbas) {
          oPosudbas.forEach(function (posudbaSnapshot) {
              var oPosudba = posudbaSnapshot.val();
              opKey = posudbaSnapshot.key;
  
              if (sKnjiga === oPosudba.id_knjige) {
                  var trenutniDatumVrijeme = new Date();
                  var trenutniDatum = trenutniDatumVrijeme.toLocaleDateString();
                  var trenutniDatumo = new Date(trenutniDatum);
                  var ocekivaniD = new Date(oPosudba.ocekivani_datum_vracanja);
  
                  if (ocekivaniD > trenutniDatumo) {
                      oPosudba.datum_vracanja = trenutniDatum;
                      oPosudba.vracena = true;
                      oPosudba.vracena_poslije_ocekivanog_datuma = true;
  
                  } else {
  
                      oPosudba.datum_vracanja = trenutniDatum;
                      oPosudba.vracena = true;
                      oPosudba.vracena_prije_ocekivanog_datuma = true;
  
                  }
                  oPosudbaRef.child(opKey).update(oPosudba).then(function () {
                      console.log('Posudba uspješno ažurirana');
                      location.reload();
                  }).catch(function (error) {
                      console.error('Greška pri ažuriranju posudbe:', error);
                  });
              }
          });
      });
  }
  

 /*Modal uredi knjigu*/

function ModalUrediKnjigu(sKnjiga) {
  var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);
  oKnjigaRef.once('value', function(oOdgovorPosluzitelja) {
    var oKnjiga = oOdgovorPosluzitelja.val();

    $('#diva').empty();
    var autori = oKnjiga.autori.join(', ');
    $('#naziv-id1').val(oKnjiga.naslov).prop('readOnly', true);
    $('#autor-id1').val(autori).prop('readOnly', true);
    $('#ISBN-id1').val(oKnjiga.isbn).prop('readOnly', true);
    $('#Broj-id1').val(oKnjiga.broj_stranica).prop('readOnly', true);
    $('#opis-id1').val(oKnjiga.opis);
    var zanrovi = oKnjiga.zanrovi.join(', ');
    $('#zanrovi').val(zanrovi);

    $('#dostupnost-id1').prop('checked', oKnjiga.dostupnost);
    $('#submitBtn1').attr('onclick', 'SpremiUredjenuKnjigu("' + sKnjiga + '")');

    console.log( $('submitBtn1'))

    $('#modalAnzuriranje').modal('show');
  });
}





function SpremiUredjenuKnjigu(sKnjiga) {
  var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);

  // Dohvati podatke iz HTML-a
  var naziv = $('#naziv-id1').val();
  var autor = $('#autor-id1').val();  
  var ISBN = $('#ISBN-id1').val();
  var brojStranica = $('#Broj-id1').val();
  var opis = $('#opis-id1').val();
  var dostupnost = $('#dostupnost-id1').prop('checked');
  var zanrovi = $('#zanrovi').val();  

  var fileInput = document.querySelector('#slika-id1');
  var novaSlika = fileInput.files[0];

  oKnjigaRef.once('value', function (oOdgovorPosluzitelja) {
    var oKnjiga = oOdgovorPosluzitelja.val();

    if (!opis || !naziv || !autor || !ISBN || !brojStranica || !zanrovi) {
     
      var opis1 = oKnjiga.opis;
      var autori1 = oKnjiga.autor.join(', ');
      var naziv1 = oKnjiga.naslov;
      var ISBN1 = oKnjiga.isbn;
      var brojStr1 = oKnjiga.brojStranica;
      var zanrovi1 = oKnjiga.zanrovi.join(', ');
    } else {
      
      var opis1 = opis;
      var autori1 = autor.split(', ');  
      var naziv1 = naziv;
      var ISBN1 = ISBN;
      var brojStr1 = brojStranica;
      var zanrovi1 = zanrovi.split(', ');  
    }

    if (novaSlika) {
      var storageRef = firebase.storage().ref('vuv-knjiznica/' + sKnjiga);
      var originalnoImeFajla = novaSlika.name;
      var uploadTask = storageRef.child(originalnoImeFajla).put(novaSlika);

      uploadTask.on(
        'state_changed',
        function (snapshot) {},
        function (error) {
          alert('Greška pri otpremanju slike:', error);
        },
        function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            oKnjiga.slika = downloadURL;
            oKnjiga.naslov = naziv1;
            oKnjiga.autori = autori1;
            oKnjiga.isbn = ISBN1;
            oKnjiga.broj_stranica = brojStr1;
            oKnjiga.opis = opis1;
            oKnjiga.dostupnost = dostupnost;
            oKnjiga.zanrovi = zanrovi1;

            oKnjigaRef.update(oKnjiga).then(function () {
              alert('Knjiga uspješno ažurirana');
              a();
              $('#modalAnzuriranje').modal('hide');
            }).catch(function (error) {
              alert('Greška pri ažuriranju knjige u bazi podataka:', error);
            });
          });
        }
      );
    } else {
      oKnjiga.naslov = naziv1;
      oKnjiga.autori = autori1;
      oKnjiga.isbn = ISBN1;
      oKnjiga.broj_stranica = brojStr1;
      oKnjiga.opis = opis1;
      oKnjiga.dostupnost = dostupnost;
      oKnjiga.zanrovi = zanrovi1;

      oKnjigaRef.update(oKnjiga).then(function () {
        alert('Knjiga uspješno ažurirana');
        a();
        $('#modalAnzuriranje').modal('hide');
      }).catch(function (error) {
        alert('Greška pri ažuriranju knjige u bazi podataka:', error);
      });
    }
  });
}


function ObrisiKnjigu(sKnjiga)
{
  var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);
  oKnjigaRef.once('value', function (oOdgovorPosluzitelja) 
  {
    var oKnjiga = oOdgovorPosluzitelja.val();
      if(oKnjiga.dostupnost === true){
        $('#ap').html(oKnjiga.naslov); 
        $('#ObrisiKnjigu').attr('onclick', 'Obrisi("' + sKnjiga + '")');
        $('#ModalObrisi').modal('show');  
    }
      else{
    alert('Ne možete obrisati knjigu koja je posuđena')  }
    console.log(sKnjiga)
  });
}


function Obrisi(sKnjiga) {
  var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);
  
  // Remove the book from the database
  oKnjigaRef.remove()
    .then(function() {
      // The book is successfully deleted
      alert('Knjiga uspješno obrisana');

      // Hide the modal
      $('#ModalObrisi').modal('hide'); 

      // Redirect to the index page
      window.location.href = 'index.html'; // Change 'index.html' to your actual index page
    })
    .catch(function(error) {
      // Handle any errors that occur during the deletion
      console.error('Error deleting book:', error);
      alert('Došlo je do pogreške prilikom brisanja knjige.');
    });

  console.log(sKnjiga);
}


function VratiKnjigu(sKnjiga) {
  var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);
console.log(sKnjiga)
  oKnjigaRef.once('value', function(oOdgovorPosluzitelja) {
    var oKnjiga = oOdgovorPosluzitelja.val();

    if (oKnjiga.dostupnost === false) { 
      oKnjiga.dostupnost = true; 
      oKnjigaRef.update(oKnjiga).then(function() {
        alert('Knjiga uspješno vraćena');
        anzurirajPosudi(sKnjiga)
        a();
      }).catch(function(error) {
        alert('Greška pri ažuriranju dostupnosti knjige:', error);
      });
    } else {
      alert('Knjiga nije posuđena, stoga je nemoguće vratiti je.');
    }
  });
}


function anzurirajPosudi(sKnjiga) {
var oPosudbaRef = oDb.ref('posudbe');

oPosudbaRef.once('value', function(oPosudbas){
  oPosudbas.forEach(function(posudbaSnapshot)
  {
    oPosudba = posudbaSnapshot.val()
    opKey= posudbaSnapshot.key;
    if(sKnjiga === oPosudba.id_knjige)
    {
      var trenutniDatumVrijeme = new Date();
      var trenutniDatum = trenutniDatumVrijeme.toLocaleDateString();
      var trenutniDatumo=new Date(trenutniDatum);
      var ocekivaniD = new Date(oPosudba.ocekivani_datum_vracanja)
      if(ocekivaniD > trenutniDatumo)
      {
        oPosudba.datum_vracanja=trenutniDatum;
        oPosudba.vracena=true;
        oPosudba.vracena_poslije_ocekivanog_datuma=true;

      }
      else
      {
        
        oPosudba.datum_vracanja=trenutniDatum;
        oPosudba.vracena=true;
        oPosudba.vracena_prije_ocekivanog_datuma=true;

      }
      oPosudbaRef.child(opKey).update(oPosudba);

    }
  })
})


}


function ModalPosudi(sKnjiga) {
oKnjiga = oDb.ref("knjige/" + sKnjiga);

oKnjiga.once('value', function (oOdgovorPosluzitelja) {
  var knjiga = oOdgovorPosluzitelja.val();
  var nKnjige = knjiga.naslov;
  var trenutniDatumVrijeme = new Date();
  var trenutniDatum = trenutniDatumVrijeme.toLocaleDateString();
  
  
 
  trenutniDatumVrijeme.setMonth(trenutniDatumVrijeme.getMonth() + 1);
  var datumPovratka = trenutniDatumVrijeme.toLocaleDateString();

  
  $("#naziv-id8").val(nKnjige).prop('readOnly', true);
  $("#datum-id").val(trenutniDatum).prop('readOnly', true);
  $("#datum-povratka-id").val(datumPovratka).prop('readOnly', true);
  ispuniDropdown(sKnjiga)
  $('#submiPosudi').attr('onclick', 'PosudiKnjigu("' + sKnjiga + '", "' +knjiga.isbn + '")');


  $("#ModalPosudi").modal("show");
});
}


function PosudiKnjigu(sknjiga,isbn) {

  
  var datumIznajmljivanja = $("#datum-id").val();
  var ocekivaniDatumVracanja = $("#datum-povratka-id").val();
  var oibKorisnika = $("#oib-dropdown").val(); 

  var novaPosudba = {
    datum_iznajmljivanja: datumIznajmljivanja,
    datum_vracanja: "Nije vraćena", 
    id_knjige: sknjiga, 
    ocekivani_datum_vracanja: ocekivaniDatumVracanja,
    key_korisnika: oibKorisnika,
    vracena: false,
    vracena_poslije_ocekivanog_datuma: false,
    vracena_prije_ocekivanog_datuma: false,
    isbn_knjige :isbn
  };
  
  var oPosudbe = firebase.database().ref('posudbe');

  oPosudbe.push(novaPosudba, function(error) {
    if (error) {
      console.error("Pogreška:", error);
    } else {
      console.log("Uspješno posuđno");
      a()
      osvjeziKnjge(sknjiga);
      $("#ModalPosudi").modal("hide");
    }
  });
}

$.fn.modal.Constructor.prototype._enforceFocus = function() {};
$(document).ready(function() {
    $('.js-example-basic-single').select2();
});

function ispuniDropdown(sknjiga) {
    var oKorisnici = oDb.ref("korisnici");
    var oibDropdown = $("#oib-dropdown");

   

    oibDropdown.empty();
    oKorisnici.once('value', function (oOdgovorPosluzitelja) {
        oOdgovorPosluzitelja.forEach(function (korisnikSnapshot) {
            var korisnikKey = korisnikSnapshot.key;
            var oKorisnik = korisnikSnapshot.val();
                oibDropdown.append("<option value='" + korisnikKey + "'>" + oKorisnik.broj_clanske_iskaznice + " ," + oKorisnik.ime + " " + oKorisnik.prezime + "</option>");
                 
        });
    });
}



  
function osvjeziKnjge(sKnjiga)
{
  var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);
  console.log(sKnjiga)
    oKnjigaRef.once('value', function(oOdgovorPosluzitelja) {
      var oKnjiga = oOdgovorPosluzitelja.val();
      oKnjiga.dostupnost=false;
      oKnjigaRef.update(oKnjiga);
    
    })

}

function a()
{
  location.reload()
}

function ObrisiKnjigu1(sKnjiga)
{
  var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);
  oKnjigaRef.once('value', function (oOdgovorPosluzitelja) 
  {
    var oKnjiga = oOdgovorPosluzitelja.val();
      if(oKnjiga.dostupnost === true){
        $('#ap').html(oKnjiga.naslov); 
        $('#ObrisiKnjigu').attr('onclick', 'Obrisi1("' + sKnjiga + '")');
        $('#ModalObrisi').modal('show');  
    }
      else{
    alert('Ne možete obrisati knjigu koja je posuđena')  }
    console.log(sKnjiga)
  });
}


function Obrisi1(sKnjiga) {
  var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);
  
  oKnjigaRef.remove()
    .then(function() {
      alert('Knjiga uspješno obrisana');

      $('#ModalObrisi').modal('hide'); 

      a();
    })
    .catch(function(error) {
      // Handle any errors that occur during the deletion
      console.error('Error deleting book:', error);
      alert('Došlo je do pogreške prilikom brisanja knjige.');
    });

  console.log(sKnjiga);
}