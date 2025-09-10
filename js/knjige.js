var selectedFilter = 'sve';

function filterBooks(filter) {
  var oTablicaKnjiga = $('#bookTable tbody');
  oTablicaKnjiga.empty();

  var seenISBNs = {};

  oDbKnjiga.once('value').then(function (oOdgovorPosluzitelja) {
    var nRbr = 1;

    oOdgovorPosluzitelja.forEach(function (oKnjigaSnapshot) {
      var oKnjiga = oKnjigaSnapshot.val();

      if (
        ((filter === 'dostupno' && oKnjiga.dostupnost) ||
          (filter === 'nedostupno' && !oKnjiga.dostupnost) ||
          filter === 'sve' && oKnjiga.dostupnost) &&
        !seenISBNs[oKnjiga.isbn]
      ) {
        seenISBNs[oKnjiga.isbn] = true;

        var link = nRbr % 2 === 0 ? 'img/b.png' : 'img/a.png';

        var imageRef = firebase.storage().refFromURL(oKnjiga.slika);

        imageRef.getDownloadURL().then(function (imageUrl) {
          var autori = oKnjiga.autori.join(', ');
          var zanrovi = oKnjiga.zanrovi.join(', ');

          var posudi_vrati = oKnjiga.dostupnost
            ? '<button class="btn btn-primary btn-posudi" data-isbn="' +
              oKnjiga.isbn +
              '" onclick="ModalPosudi(\'' +
              oKnjigaSnapshot.key +
              '\', \'filterBooks\')">Posudi</button>'
            : '<button class="btn btn-warning btn-vrati" data-isbn="' +
              oKnjiga.isbn +
              '" onClick="VratiKnjigu(\'' +
              oKnjigaSnapshot.key +
              '\', \'filterBooks\')">Vrati</button>';

          oTablicaKnjiga.append(
            '<tr data-knjiga-key="' +
              oKnjigaSnapshot.key +
              '">' +
              '<td style="background-image: url(\'' +
              link +
              '\'); background-size: cover; background-color: rgb(153, 79, 29);"></td>' +
              '<td>' +
              nRbr++ +
              '.</td>' +
              '<td><img src="' +
              imageUrl +
              '" alt="Slika" style="max-width: 100px; max-height: 100px;"></td>' +
              '<td><a href="knjiga.html?knjiga_key=' +
              oKnjigaSnapshot.key +
              '" style="text-decoration: none; color: inherit; cursor: pointer;" onmousedown="this.style.color=\'black\'" onmouseup="this.style.color=\'inherit\'">' +
              oKnjiga.naslov +
              '</a></td>' +
              '<td>' +
              autori +
              '</td>' +
              '<td>' +
              zanrovi +
              '</td>' +
              '<td>' +
              oKnjiga.isbn +
              '</td>' +
              '<td>' +
              (oKnjiga.dostupnost ? 'Dostupno' : 'Nije dostupno') +
              '</td>' +
              '<td>' +
              oKnjiga.broj_stranica +
              '</td>' +
              '<td>' +
              posudi_vrati +
              '</td>' +
              '<td><button type="button" class="btn " onClick="ModalUrediKnjigu(\'' +
              oKnjigaSnapshot.key +
              '\', \'filterBooks\')"><i class="fa-solid fa-pen" style="color: #994f1d;"></i></button></td>' +
              '<td><button type="button" class="btn " onClick="ObrisiKnjigu(\'' +
              oKnjigaSnapshot.key +
              '\', \'filterBooks\')"><i class="fa-solid fa-eraser" style="color: #994f1d;"></i></button></td>' +
              '<td style="background-image: url(\'' +
              link +
              '\'); background-size: cover; background-color: rgb(153, 79, 29);"></td>' +
              '</tr>'
          );
        })
        .catch(function (error) {
          console.error('Error getting image download URL:', error);
        });
      }
    });
  })
  .catch(function (error) {
    console.error('Error fetching data from Firebase:', error);
  });
}

filterBooks(selectedFilter);

$('#d1').on('click', function () {
  selectedFilter = 'dostupno';
  filterBooks(selectedFilter);
});

$('#d2').on('click', function () {
  selectedFilter = 'nedostupno';
  filterBooks(selectedFilter);
});

$('#d3').on('click', function () {
  selectedFilter = 'sve';
  filterBooks(selectedFilter);
});




//FILTER TABLICSA SA PRETRAŽIVANJEM
function pretraziBazu() {
  var izraz = document.getElementById('inputs').value.toLowerCase();
  filterBooks1(izraz);
}

function filterBooks1(filter) {
  var oTablicaKnjiga = $('#bookTable1 tbody');
  var errorAlertShown = false;  
  oTablicaKnjiga.empty();
  var nRbr = 1;
  var seenISBNs = {};

  oDbKnjiga.once('value', function (oOdgovorPosluzitelja) {
    var imaRezultata = false;

    oOdgovorPosluzitelja.forEach(function (oKnjigaSnapshot) {
  var oKnjiga = oKnjigaSnapshot.val();

  var autori = oKnjiga.autori.join(', ');  
  var autorLowerCase = autori.toLowerCase(); 
  var naslovLowerCase = oKnjiga.naslov.toLowerCase();
  var zanrovi = oKnjiga.zanrovi.join(', ')
  var zanrovil = zanrovi.toLowerCase();
  var isbnl = oKnjiga.isbn.toLowerCase();
  var brojStr = oKnjiga.broj_stranica.toString();

  if (autorLowerCase.includes(filter) || naslovLowerCase.includes(filter) || zanrovil.includes(filter) || isbnl.includes(filter) || brojStr.includes(filter)) {
    if (!seenISBNs[oKnjiga.isbn] && oKnjiga.dostupnost) {
      seenISBNs[oKnjiga.isbn] = true;
      imaRezultata = true;

      var link = 'img/a.png';
      alternateLink = 'img/b.png';

      var imageRef = firebase.storage().refFromURL(oKnjiga.slika);
      imageRef
        .getDownloadURL()
        .then(function (imageUrl){ 
          if (nRbr % 2 === 0) {
            link = alternateLink;
          }

          posudi_vrati = oKnjiga.dostupnost
  ? '<td class="action-column"><button class="btn  btn-posudi" data-isbn="' +
    oKnjiga.isbn +
    '" onclick="ModalPosudi(\'' + oKnjigaSnapshot.key + '\', \'filterBooks1\')">Posudi</button></td>'
  : '<td class="action-column"><button class="btn btn-warning btn-vrati" data-isbn="' +
    oKnjiga.isbn +
    '" onClick="VratiKnjigu(\'' + oKnjigaSnapshot.key + '\', \'filterBooks1\')">Vrati</button></td>';

    var autori = oKnjiga.autori.join(', ');
    var zanrovi = oKnjiga.zanrovi.join(', ');

          oTablicaKnjiga.append(
            '<tr data-knjiga-key="' +
              oKnjigaSnapshot.key +
              '">' +
              '<td>' + nRbr++ + '.</td>' +
              '<td><img src="' +
              imageUrl +
              '" alt="Slika" style="max-width: 100px; max-height: 100px;"></td>' +
              '<td><a href="knjiga.html?knjiga_key=' +
              oKnjigaSnapshot.key +
              '" style="text-decoration: none; color: inherit; cursor: pointer;" onmousedown="this.style.color=\'black\'" onmouseup="this.style.color=\'inherit\'">' +
              oKnjiga.naslov +
              '</a></td>' +
              '<td>' +
              autori +'</td>' + '<td>' + zanrovi +'</td>'+
              '<td>' +
              oKnjiga.isbn +
              '</td>' +
              '<td>' +
              (oKnjiga.dostupnost ? 'Dostupno' : 'Nije dostupno') +
              '</td>' +
              '<td>' +
              oKnjiga.broj_stranica +
              '</td>' +'</td>' +posudi_vrati+ 
              '<td><button type="button" class="btn " onClick="ModalUrediKnjigu(\'' +
                  oKnjigaSnapshot.key +
                  '\', \'filterBooks1\')"><i class="fa-solid fa-pen" style="color: #994f1d;"></i></button></td>'
              +  "<td><button type='button' class='btn ' onClick='ObrisiKnjigu(\""+oKnjigaSnapshot.key+"\", \"filterBooks1\")'><i class='fa-solid fa-eraser' style='color: #994f1d;'></i></button></td>"
              +
            '</tr>'
          );
        })
        .catch(function (error) {
          if (!errorAlertShown) {
              alert('Pogreška:', error);
              errorAlertShown = true; 
          }
      });
    }
  }

    });

    
    var divNemaRezultata = document.getElementById("nema-rezultata");
    var divZaglavlje = document.getElementById("c2");

    if (imaRezultata || filter === "") {
      divNemaRezultata.style.display = "none";
      divZaglavlje.style.display = "flex";  
    } else {
      divZaglavlje.style.display = "none"; 
      divNemaRezultata.style.display = "flex";
      divNemaRezultata.style.justifyContent = "center";
      divNemaRezultata.style.alignItems = "center";

       
    }
  });
}

$(document).ready(function(){
  $('#inputs').keypress(function(event){
    if(event.which === 13) {
      var inputValue = $(this).val();
      filterBooks1(inputValue);
    }
  });
});
$(document).ready(function(){
  $('#inputs1').keypress(function(event){
    if(event.which === 13) {
      var inputValue = $(this).val();
      filterBooks1(inputValue);
    }
  });
});



function dodaj()
{
  $('#naziv-id').val('');
   $('#autor-id').val('');
   $('#ISBN-id').val(''); 
   $('#Broj-id').val('');
   $('#opis-id').val('');
   $('#dostupnost-id').prop('checked', false);
 $('#zanrovi-id').val('');
}
function DodajNovuKnjigu() {
  var naziv = $('#naziv-id').val();
  var autori = $('#autor-id').val().split(',').map(author => author.trim());
  var ISBN = $('#ISBN-id').val(); 
  var brojStranica = $('#Broj-id').val();
  var opis = $('#opis-id').val();
  var dostupnost = $('#dostupnost-id').prop('checked', true);
  var zanrovi = $('#zanrovi-id').val().split(',').map(genre => genre.trim());

  var isbnPattern = /^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1,6}$/;
  if (!isbnPattern.test(ISBN)) {
    alert('Neispravan format ISBN-a. ISBN mora imati 13 znamenki s crtama između.');
    return;
  }

  if (!naziv || autori.length === 0 || !ISBN || !brojStranica || !opis) {
    alert('Sva polja moraju biti popunjena.');
    return;
  }

  ISBN = ISBN.replace(/(\d{3})(\d{1,5})(\d{1,7})(\d{1,7})(\d{1,6})/, '$1-$2-$3-$4-$5');

  
  firebase.database().ref('knjige').orderByChild('isbn').equalTo(ISBN).once('value')
    .then(function(snapshot) {
      if (snapshot.exists()) {
        
        alert('Knjiga s istim ISBN-om već postoji. Ako želite dodati kopiju knjige molimo Vas posjeditie stranicu knjige');
        dodaj();
        $('#ModalDodaj').modal('hide');
        return
      }

      
      var kljuc = firebase.database().ref().child('knjige').push().key;

      var storageRef = firebase.storage().ref('vuv-knjiznica/' + kljuc);
      var fileInput = document.querySelector('#slika-id');
      var fajl = fileInput.files[0];

      if (fajl) {
        var originalnoImeFajla = fajl.name;
        var uploadTask = storageRef.child(originalnoImeFajla).put(fajl);

        uploadTask.on(
          'state_changed',
          function (snapshot) {},
          function (error) {
            alert('Greška pri otpremanju slike:', error);
          },
          function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              var newBook = {
                autori: autori,
                broj_stranica: brojStranica,
                dostupnost: dostupnost,
                isbn: ISBN,
                naslov: naziv,
                opis: opis,
                slika: downloadURL,
                id: kljuc,
                zanrovi: zanrovi
              };

              firebase
                .database().ref('knjige/' + kljuc)
                .set(newBook)
                .then(function () {
                  alert('Knjiga uspješno dodana');
                  filterBooks(selectedFilter);
                  dodaj();
                  $('#ModalDodaj').modal('hide');
                })
                .catch(function (error) {
                  alert('Greška pri dodavanju knjige u bazu podataka:', error);
                });
            });
          }
        );
      } else {
        alert('Nijedan dokument nije izabran');
      }
    })
    .catch(function(error) {
      alert('Greška pri provjeri ISBN-a:', error);
    });
}





/*Modal uredi knjigu*/

function ModalUrediKnjigu(sKnjiga, tablica) {
  var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);
  oKnjigaRef.once('value', function (oOdgovorPosluzitelja) {
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
    $('#submitBtn1').attr('onclick', 'SpremiUredjenuKnjigu("' + sKnjiga + '", "' + tablica + '")');

    console.log($('submitBtn1'))

    $('#modalAnzuriranje').modal('show');
  });
}





function SpremiUredjenuKnjigu(sKnjiga, tablica) {
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
  if(!zanrovi)
  {
    alert('Žanr ne smije biti prazan')
  }
  if(!opis)
  {
    alert('Opis ne smije biti prazan')
  }

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
              osvjeziTablice(tablica);
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
        osvjeziTablice(tablica);
        $('#modalAnzuriranje').modal('hide');
      }).catch(function (error) {
        alert('Greška pri ažuriranju knjige u bazi podataka:', error);
      });
    }
  });
}


function ObrisiKnjigu(sKnjiga, tablica)
{
  var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);
  oKnjigaRef.once('value', function (oOdgovorPosluzitelja) 
  {
    var oKnjiga = oOdgovorPosluzitelja.val();
      if(oKnjiga.dostupnost === true){
        $('#ap').html(oKnjiga.naslov); 
        $('#ObrisiKnjigu').attr('onclick', 'Obrisi1("' + sKnjiga + '", "' + tablica +'")');
        $('#ModalObrisi').modal('show');  
    }
      else{
    alert('Ne možete obrisati knjigu koja je posuđena')  }
    console.log(sKnjiga)
  });
}


function Obrisi1(sKnjiga, tablica) {
  var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);
  oKnjigaRef.remove();
  alert('Knjiga uspješno obrisana');
  osvjeziTablice(tablica);
  $('#ModalObrisi').modal('hide');  
  console.log(sKnjiga);
}


  function VratiKnjigu(sKnjiga, tablica) {
    var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);
  console.log(sKnjiga)
    oKnjigaRef.once('value', function(oOdgovorPosluzitelja) {
      var oKnjiga = oOdgovorPosluzitelja.val();
  
      if (oKnjiga.dostupnost === false) { 
        oKnjiga.dostupnost = true; 
        oKnjigaRef.update(oKnjiga).then(function() {
          alert('Knjiga uspješno vraćena');
          anzurirajPosudi(sKnjiga)
          osvjeziTablice(tablica);
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

function osvjeziTablice(tablica) {
  if (tablica === 'filterBooks') {
    filterBooks(selectedFilter);
  } else if (tablica === 'filterBooks1') {
    filterBooks1(document.getElementById('inputs').value.toLowerCase());
  }
}

function ModalPosudi(sKnjiga, tablica) {
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
    $('#submiPosudi').attr('onclick', 'PosudiKnjigu("' + sKnjiga + '", "' + tablica +'", "' +knjiga.isbn + '")');


    $("#ModalPosudi").modal("show");
  });
}


function PosudiKnjigu(sknjiga,tablica,isbn) {

  
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
      osvjeziKnjge(sknjiga);
      osvjeziTablice(tablica);
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
