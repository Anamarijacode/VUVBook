/*KORISNICI*/


function pretraziBazuk() {
    var izraz = document.getElementById('inputs1').value.toLowerCase();
    filterKorisnika(izraz);
  }
  function filterKorisnika(filter) {
    var oTablicaKorisnici = $('#korisnikTable tbody');
    oTablicaKorisnici.empty();
    var nRbr = 1;
  
    ODbKorisnik.once('value', function (oOdgovorPosluzitelja) {
      var imaRezultata1 = false;
  
      oOdgovorPosluzitelja.forEach(function (oKorisnikSnapshot) {
        var oKorisnik = oKorisnikSnapshot.val();
  
        var autorLowerCase = oKorisnik.ime.toLowerCase();
        var naslovLowerCase = oKorisnik.prezime.toLowerCase();
        var oib = oKorisnik.oib.toString();
  
        if (autorLowerCase.includes(filter) || naslovLowerCase.includes(filter) || oib.includes(filter)) {
          imaRezultata1 = true;
  
          oTablicaKorisnici.append(
            '<tr data-knjiga-key="' +
              oKorisnikSnapshot.key +
              '">' +
              '<td>' + nRbr++ + '.</td>' +
              '<td><a href="korisnik.html?korisnik_key=' +
              oKorisnikSnapshot.key +
              '" style="text-decoration: none; color: inherit; cursor: pointer;" onmousedown="this.style.color=\'black\'" onmouseup="this.style.color=\'inherit\'">' +
              oKorisnik.oib +
              '</a></td>' +
              '<td>' +
              oKorisnik.ime +
              '</td>' +
              '<td>' +
              oKorisnik.prezime +
              '</td>' +
              "<td><button type='button' class='btn ' onClick='ModalUrediKorisnika(\""+oKorisnikSnapshot.key+"\")'><i class='fa-solid fa-pen' style='color: #994f1d;'></i></button></td>"
              +"<td><button type='button' class='btn ' onClick='ObrisiKorisnika(\""+oKorisnikSnapshot.key+"\")'><i class='fa-solid fa-eraser' style='color: #994f1d;'></i></button></td>"+
              '</tr>'
          );
        }
      });
  
      var divNemaRezultata = document.getElementById("nemarezultata1");
      var divZaglavlje = document.getElementById("c3");
  
      console.log("imaRezultata:", imaRezultata1);
      console.log("filter:", filter);
  
      if (imaRezultata1 || filter === "") {
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
  

  // modal dodaj
 
  $('#modalDodajKorisnika').on('show.bs.modal', function (event) {
    $('#datum-uclanjenja-id').val(DohvatiTrenutniDatum()).prop('readOnly', true);
    $('#datum-isteka-id').val(DohvatiDatumZaGodinuDana()).prop('readOnly', true);
    $('#brojClanskeIskaznice-id').val(generirajBrojClanskeIskaznice()).prop('readOnly', true)
});

function modalprijavi()
{
  $('#ime-id').val('');
  $('#oib-id').val('');
  $('#prezime-id').val('');
}
async function DodajNovogKorisnika() {
 
  var ime = $('#ime-id').val().trim();
  var oib = $('#oib-id').val().trim();
  var prezime = $('#prezime-id').val().trim();

  if (!ime || !oib || !prezime) {
      alert('Molimo ispunite sva polja.');
      return;
  }

  if (!isValidName(ime) || !isValidName(prezime)) {
      alert('Imena i prezimena trebaju počinjati velikim početnim slovom.');
      return;
  }

  var brojClanskeIskaznice = generirajBrojClanskeIskaznice();

  var datumIstekaClanstva = DohvatiDatumZaGodinuDana();
  var datumUclanjenja = DohvatiTrenutniDatum();

  var isDuplikat = await provjeriDuplikatOIB(oib);
  if (isDuplikat) {
      return;
  }

  var novi = {
      broj_clanske_iskaznice: brojClanskeIskaznice,
      datum_isteka_clanstva: datumIstekaClanstva,
      datum_uclanjenja: datumUclanjenja,
      ime: ime,
      oib: oib,
      prezime: prezime
  };

  var korisniciRef = firebase.database().ref('korisnici');

  
  try {
      await korisniciRef.push(novi);
      alert('Novi korisnik uspješno dodan');
      modalprijavi();
      $('#modalDodajKorisnika').modal('hide');
  } catch (error) {
      console.error('Greška prilikom dodavanja novog korisnika: ', error);
  }
}

function isValidName(name) {
  var nameRegex = /^[A-Z][a-z]*$/;
  return nameRegex.test(name);
}





function DohvatiTrenutniDatum() {
    var danas = new Date();
    var dan = danas.getDate();
    var mjesec = danas.getMonth() + 1; 
    var godina = danas.getFullYear();

    
    if (dan < 10) {
        dan = '0' + dan;
    }

    if (mjesec < 10) {
        mjesec = '0' + mjesec;
    }

    return dan + '.' + mjesec + '.' + godina;
}
function DohvatiDatumZaGodinuDana() {
  var danas = new Date();
  danas.setFullYear(danas.getFullYear() + 1);

  var dan = danas.getDate();
  var mjesec = danas.getMonth() + 1; 
  var godina = danas.getFullYear();

  
  if (dan < 10) {
      dan = '0' + dan;
  }

  if (mjesec < 10) {
      mjesec = '0' + mjesec;
  }

  return dan + '.' + mjesec + '.' + godina;
}



function generirajBrojClanskeIskaznice() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var randomBroj = '';
    for (var i = 0; i < 8; i++) {
        randomBroj += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomBroj;
}


function provjeriDuplikatOIB(oib) {
  return new Promise(function (resolve, reject) {
      if (oib.length !== 11) {
          alert('OIB mora biti duljine 11 znamenki.');
          resolve(true);
      }

      if (!/^\d+$/.test(oib)) {
          alert('OIB smije sadržavati samo brojeve.');
          resolve(true);
      }

      var duplikat = false;
      var korisniciRef = firebase.database().ref('korisnici');

      korisniciRef.once('value', function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
              var existingOIB = childSnapshot.val().oib;
              if (existingOIB === oib) {
                  duplikat = true;
              }
          });

          if (duplikat) {
              alert('Osoba s istim OIB-om već postoji. Molimo unesite drugi OIB.');
          }

          resolve(duplikat);
      });
  });
}



$(document).ready(function(){
  $('#inputs1').keypress(function(event){
    if(event.which === 13) {
      var filter = $(this).val();
      filterKorisnika(filter) ;
    }
  });
});
function ModalUrediKorisnika(sKorisnik) {
  var oKorisnikRef = oDb.ref('korisnici/' + sKorisnik);
  oKorisnikRef.once('value', function(oOdgovorPosluzitelja) {
      var oKorisnik = oOdgovorPosluzitelja.val();

      $('#diva-korisnik').empty();

      $('#ime-id1').val(oKorisnik.ime);
      $('#prezime-id1').val(oKorisnik.prezime);
      $('#oib-id1').val(oKorisnik.oib).prop('readOnly', true);
      $('#broj_clanske_iskaznice-id1').val(oKorisnik.broj_clanske_iskaznice).prop('readOnly', true);
      $('#datum_uclanjenja-id1').val(oKorisnik.datum_uclanjenja).prop('readOnly', true);
      $('#datum_isteka_clanstva-id1').val(oKorisnik.datum_isteka_clanstva).prop('readOnly', true);

      $('#submitBtn-korisnik1').attr('onclick', 'SpremiUredjenogKorisnika("' + sKorisnik + '")');

      $('#modalAnzuriranjeKorisnik').modal('show');
  });
}


function SpremiUredjenogKorisnika(sKorisnik) {
  var oKorisnikRef = oDb.ref('korisnici/' + sKorisnik);

  var ime = $('#ime-id1').val();
  var prezime = $('#prezime-id1').val();
  var oib = $('#oib-id1').val();
  var brojClanskeIskaznice = $('#broj_clanske_iskaznice-id1').val();
  var datumUclanjenja = $('#datum_uclanjenja-id1').val();
  var datumIstekaClanstva = $('#datum_isteka_clanstva-id1').val();

  
  if (!ime || !prezime || !oib || !brojClanskeIskaznice || !datumUclanjenja || !datumIstekaClanstva) {
      alert('Sva polja moraju biti popunjena.');
      return;
  }

  
  oKorisnikRef.update({
      ime: ime,
      prezime: prezime,
      oib: oib,
      broj_clanske_iskaznice: brojClanskeIskaznice,
      datum_uclanjenja: datumUclanjenja,
      datum_isteka_clanstva: datumIstekaClanstva
  }).then(function () {
      alert('Korisnik uspješno ažuriran');
      $('#modalAnzuriranjeKorisnik').modal('hide');
      pretraziBazuk();
  }).catch(function (error) {
      alert('Greška pri ažuriranju korisnika u bazi podataka:', error);
  });
}
  
function ObrisiKorisnika(sKorisnik) {
  var oKorisnikRef = oDb.ref('korisnici/' + sKorisnik);
  var oPosudbaRef = oDb.ref('posudbe');

  var alertShown = false;

  oPosudbaRef.once('value', function(snapshotPosudbe) {
    var canDeleteUser = true;

    snapshotPosudbe.forEach(function(posudbaSnapshot) {
      var posudba = posudbaSnapshot.val();

      if (posudba.key_korisnika === sKorisnik && !posudba.vracena) {
        canDeleteUser = false;

        if (!alertShown) {
          alert('Ne možete obrisati osobu koja nije vratila knjigu!');
          alertShown = true;
        }
        return;
      }
    });

    if (canDeleteUser) {
      dohvatiKorisnika();
    }
  });

  function dohvatiKorisnika() {
    oKorisnikRef.once('value', function(oOdgovorPosluzitelja) {
      var oKorisnik = oOdgovorPosluzitelja.val();
      $('#ap1').html(oKorisnik.ime + ' ' + oKorisnik.prezime);
      $('#ObrisiKorisnika12').attr('onclick', 'Obrisi("' + sKorisnik + '")');
      $('#ModalObrisi1').modal('show');
    });
  }
}

function Obrisi(sKorisnik) {
  var oKorisnikRef = oDb.ref('korisnici/' + sKorisnik);
  var oPosudbaRef = oDb.ref('posudbe/');

  oPosudbaRef.orderByChild('key_korisnika').equalTo(sKorisnik).once('value', function(snapshotPosudbe) {
    snapshotPosudbe.forEach(function(childSnapshot) {
      childSnapshot.ref.remove();
    });

    oKorisnikRef.remove()
      .then(function() {
        alert('Korisnik uspješno obrisan');
        pretraziBazuk();
        $('#ModalObrisi1').modal('hide');
      })
      .catch(function(error) {
        console.error('Error removing user: ', error);
      });
  });
}
