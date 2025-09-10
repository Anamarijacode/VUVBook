var sUrl = window.location.href;
console.log(sUrl);
var oUrl = new URL(sUrl);
console.log(oUrl);
var sKorisnik = oUrl.searchParams.get("korisnik_key");
console.log(sKorisnik);
var oKorisnikRef = oDb.ref('korisnici/' + sKorisnik);

oKorisnikRef.once('value', function (oOdgovorPosluzitelja) {
    var oKorisnik = oOdgovorPosluzitelja.val();
    var sKey = oOdgovorPosluzitelja.key;

   
$('#h22').html(oKorisnik.ime + ' ' + oKorisnik.prezime)
    $('#ime-prezime').html('Ime i prezime: ' +oKorisnik.ime + " " + oKorisnik.prezime);
    $('#p-OIB').html('OIB: ' +oKorisnik.oib);
    $('#p-BrojClanskeIskaznice').html('Broj člasnke iskaznice: ' +oKorisnik.broj_clanske_iskaznice );
    $('#p-datumUclanjenja').html('Datum učlanjenja: ' + oKorisnik.datum_uclanjenja);
    $('#p-datumPrekidaClanstva').html('Datum prekida članstva: ' +oKorisnik.datum_isteka_clanstva )



    $('#povijest').empty();
    var provjera = false;

    oDbPosudbe.once('value', function (oOdgovorPosluzitelja) {
        oOdgovorPosluzitelja.forEach(function (oPosudbaSnapshot) {
          
            var oPosudba = oPosudbaSnapshot.val();
            if(oPosudba.vracena === true){

            if (oPosudba.key_korisnika === sKey) {
                $('#povijest').append(
                    '<p>Knjiga ID: ' + oPosudba.id_knjige + '</p>' +
                    '<p>Datum iznajmljivanja: ' + oPosudba.datum_iznajmljivanja + '</p>' +
                    '<p>Očekivani datum vraćanja: ' + oPosudba.ocekivani_datum_vracanja + '</p>' +
                    '<p>Vraćena: ' + 'Da' + '</p>' +
                    '<p>Vraćena prije očekivanog datuma: ' + (oPosudba.vracena_prije_ocekivanog_datuma ? 'Da' : 'Ne') + '</p>' +
                    '<p>Vraćena poslije očekivanog datuma: ' + (oPosudba.vracena_poslije_ocekivanog_datuma ? 'Da' : 'Ne') + '</p>' +
                    '<hr>'
                );
                provjera = true;
            }
          }
          else
          {
            if (oPosudba.key_korisnika === sKey) {
              $('#povijest').append(
                  '<p>Knjiga ID: ' + oPosudba.id_knjige + '</p>' +
                  '<p>Datum iznajmljivanja: ' + oPosudba.datum_iznajmljivanja + '</p>' +
                  '<p>Očekivani datum vraćanja: ' + oPosudba.ocekivani_datum_vracanja + '</p>' +
                  '<p>Vraćena: ' + 'Ne' + '</p>' +
                  '<p>Vraćena prije očekivanog datuma: ' + (oPosudba.vracena_prije_ocekivanog_datuma ? 'Da' : 'Ne') + '</p>' +
                  '<p>Vraćena poslije očekivanog datuma: ' + (oPosudba.vracena_poslije_ocekivanog_datuma ? 'Da' : 'Ne') + '</p>' +
                  '<div class="col-3"><button class="btn" id="btnVrati" onClick="VratiKnjigu(\'' + oPosudba.id_knjige + '\')">Vrati</button></div>'+
                  '<hr>'
              );
              provjera = true;
          }

          }
        });
        if(!provjera)
        {
          $('#povijest').append('<p>Nema dostupne povijesti posudbi.</p>');
        }
    });
    

    $(document).ready(function () {

        $('#btnUredi').click(function () {
            ModalUrediKorisnika(sKorisnik);
        });
        $('#btnObrisi').click(function () {
            ObrisiKorisnika(sKorisnik);
        });
        $('#btnIznajmi').click(function () {
            $('#modalUredi').modal('show');
        });
        $('#btnVrati').click(function () {
            $('#modalUredi').modal('show');
        });
        $('#pk').click(function ()
        {
          
        })

    });

   
});
function VratiKnjigu(sKnjiga) {
  console.log(sKnjiga)
  var oKnjigaRef = oDb.ref('knjige/' + sKnjiga);

  oKnjigaRef.once('value', function (oOdgovorPosluzitelja) {
      var oKnjiga = oOdgovorPosluzitelja.val();

      if (oKnjiga.dostupnost === false) {
          oKnjiga.dostupnost = true;
          oKnjigaRef.update(oKnjiga).then(function () {
              alert('Knjiga uspješno vraćena');
              anzurirajPosudi(sKnjiga)
              
          }).catch(function (error) {
              alert('Greška pri ažuriranju dostupnosti knjige: ' + error.message);
          });
          
      } else {
          alert('Knjiga nije posuđena, stoga je nemoguće vratiti je.');
      }
  });}
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
                    location.reload();
                }).catch(function (error) {
                    console.error('Greška pri ažuriranju posudbe:', error);
                });
            }
        });
    });
}

function ModalUrediKorisnika(sKorisnik) {
    var oKorisnikRef = oDb.ref('korisnici/' + sKorisnik);
    oKorisnikRef.once('value', function(oOdgovorPosluzitelja) {
        var oKorisnik = oOdgovorPosluzitelja.val();

        $('#diva-korisnik').empty();

        $('#ime-id').val(oKorisnik.ime);
        $('#prezime-id').val(oKorisnik.prezime);
        $('#oib-id').val(oKorisnik.oib).prop('readOnly', true);
        $('#broj_clanske_iskaznice-id').val(oKorisnik.broj_clanske_iskaznice).prop('readOnly', true);
        $('#datum_uclanjenja-id').val(oKorisnik.datum_uclanjenja).prop('readOnly', true);
        $('#datum_isteka_clanstva-id').val(oKorisnik.datum_isteka_clanstva).prop('readOnly', true);

        $('#submitBtn-korisnik1').attr('onclick', 'SpremiUredjenogKorisnika("' + sKorisnik + '")');
        $('#pc').attr('onclick', 'ProduziClanstvo("' +sKorisnik+ '")');
        $('#pk').attr('onclick', 'Prekinic("' +sKorisnik+'")')


        $('#modalAnzuriranjeKorisnik').modal('show');
    });
}
function ProduziClanstvo(sKorisnik) {
  var oKorisnikRef = oDb.ref('korisnici/' + sKorisnik);

  oKorisnikRef.once('value', function (oOdgovorPosluzitelja) {
      var oKorisnik = oOdgovorPosluzitelja.val();

      var currentDate = new Date();
      var newExpirationDate = new Date(oKorisnik.datum_isteka_clanstva);
      newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1);



      oKorisnikRef.update({
          datum_isteka_clanstva: newExpirationDate.toLocaleDateString()
      });

      $('#datum_isteka_clanstva-id').val(newExpirationDate);

      $('#modalAnzuriranjeKorisnik').modal('hide');
      location.reload();
  });
}

function formatDate(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1; 
  var yyyy = date.getFullYear();

  if (dd < 10) {
      dd = '0' + dd;
  }

  if (mm < 10) {
      mm = '0' + mm;
  }

  return dd + '.' + mm + '.' + yyyy;
}






function SpremiUredjenogKorisnika(sKorisnik) {
    var oKorisnikRef = oDb.ref('korisnici/' + sKorisnik);

    var ime = $('#ime-id').val();
    var prezime = $('#prezime-id').val();
    var oib = $('#oib-id').val();
    var brojClanskeIskaznice = $('#broj_clanske_iskaznice-id').val();
    var datumUclanjenja = $('#datum_uclanjenja-id').val();
    var datumIstekaClanstva = $('#datum_isteka_clanstva-id').val();

    
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
        location.reload();
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
      $('#ap').html(oKorisnik.ime + ' ' + oKorisnik.prezime);
      $('#ObrisiKorisnika').attr('onclick', 'Obrisi("' + sKorisnik + '")');
      $('#ModalObrisi').modal('show');
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
        window.location.href = 'index.html';
        $('#ModalObrisi').modal('hide');
      })
      .catch(function(error) {
        console.error('Error removing user: ', error);
      });
  });
}
function Prekinic(sKorisnik) {
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
          alert('Ne možete prekinuti članstvo za osobu koja nije vratila knjigu!');
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
      $('#ap').html(oKorisnik.ime + ' ' + oKorisnik.prezime);
      $('#prekinik').attr('onclick', 'Prekinicl("' + sKorisnik + '")');
      $('#ModalObrisi1').modal('show');
    });
  }
}

function Prekinicl(sKorisnik) {
  var oKorisnikRef = oDb.ref('korisnici/' + sKorisnik);
  var oPosudbaRef = oDb.ref('posudbe/');

  oPosudbaRef.orderByChild('key_korisnika').equalTo(sKorisnik).once('value', function(snapshotPosudbe) {
    snapshotPosudbe.forEach(function(childSnapshot) {
      childSnapshot.ref.remove();
    });

    oKorisnikRef.remove()
      .then(function() {
        alert('Članstvo uspješno prekinuto');
        window.location.href = 'index.html';
        $('#ModalObrisi').modal('hide');
      })
      .catch(function(error) {
        console.error('Error removing user: ', error);
      });
  });
}