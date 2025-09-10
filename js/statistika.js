var OknjigaRef = oDb.ref("knjige");
var oDbPosudbeRef = oDb.ref("posudbe");
var oKorisnici = oDb.ref('korisnici');

window.onload = a;

function a() {
    var oTablicaKnjiga = $('#bookTable123 tbody');
    oTablicaKnjiga.empty();
    var nRb = 1;
    var seenISBNs = {};

    OknjigaRef.once('value').then(function (knjigeSnapshot) {
        var knjigePromises = [];

        knjigeSnapshot.forEach(function (oK) {
            knjigePromises.push(new Promise(function (resolve, reject) {
                var oKnjiga = oK.val();
                var imageUrl;

                var imageRef = firebase.storage().refFromURL(oKnjiga.slika);
                imageRef.getDownloadURL().then(function (url) {
                    imageUrl = url;

                    oDbPosudbeRef.once('value').then(function (posudbeSnapshot) {
                        var ukupno = 0;

                        posudbeSnapshot.forEach(function (oP) {
                            var oPosudba = oP.val();

                            if (oKnjiga.isbn === oPosudba.isbn_knjige) {
                                ukupno++;
                            }
                        });

                        if (!seenISBNs[oKnjiga.isbn]) {
                            seenISBNs[oKnjiga.isbn] = true;

                            var autori = oKnjiga.autori.join(', ');

                            resolve({
                                'imageUrl': imageUrl,
                                'naslov': oKnjiga.naslov,
                                'autori': autori,
                                'ukupno': ukupno
                            });
                        } else {
                            resolve(null);
                        }
                    }).catch(reject);
                }).catch(reject);
            }));
        });

        Promise.all(knjigePromises).then(function (knjige) {
            
            knjige = knjige.filter(Boolean);

            
            knjige.sort(function (a, b) {
                return b.ukupno - a.ukupno;
            });

           
            knjige.forEach(function (oKnjiga) {
                var link = 'img/a.png';
                var alternateLink = 'img/b.png';
                
                if (nRb % 2 === 0) {
                    link = alternateLink;
                    console.log(nRb%2)
                }
            
                oTablicaKnjiga.append(
                    '<tr>' +
                    '<td style="background-image: url(\'' + link + '\'); background-size: cover; background-color: rgb(153, 79, 29);"></td>' +
                    '<td>' + nRb + '.</td>' +
                    '<td><img src="' + oKnjiga.imageUrl + '" alt="Slika" style="max-width: 100px; max-height: 100px;"></td>' +
                    '<td>' + oKnjiga.naslov + '</td>' +
                    '<td>' + oKnjiga.autori + '</td>' +
                    '<td>' + oKnjiga.ukupno + '</td>' +
                    '<td style="background-image: url(\'' + link + '\'); background-size: cover; background-color: rgb(153, 79, 29);"></td>' +
                    '</tr>'
                );
                nRb++;
                console.log(nRb)
            });
        }).catch(function (error) {
            console.error('Pogreška:', error);
        });
    }).catch(function (error) {
        console.error('Pogreška:', error);
    });
}



//Korisnisi


function b() {
    var oTablicaKorisnici = $('#korisnikTable12 tbody');
    oTablicaKorisnici.empty();
    var nRb = 0;
    var seenMembershipNumbers = {};

    var oKorisniciRef = oDb.ref('korisnici');
    var oDbPosudbeRef = oDb.ref("posudbe"); 

    oKorisniciRef.once('value').then(function (korisniciSnapshot) {
        var korisniciPromises = [];

        korisniciSnapshot.forEach(function (oK) {
            korisniciPromises.push(new Promise(function (resolve, reject) {
                var oKorisnik = oK.val();

                
                oDbPosudbeRef.orderByChild("key_korisnika").equalTo(oK.key).once('value').then(function (posudbeSnapshot) {
                    var brojPosudivanja = posudbeSnapshot.numChildren(); 

                    resolve({
                        'ime': oKorisnik.ime,
                        'prezime': oKorisnik.prezime,
                        'broj_clanske_iskaznice': oKorisnik.broj_clanske_iskaznice,
                        'broj_posudivanja': brojPosudivanja
                    });
                }).catch(function (error) {
                    reject(error);
                });
            }));
        });

        Promise.all(korisniciPromises).then(function (korisnici) {

            korisnici = korisnici.filter(Boolean);

            korisnici.sort(function (a, b) {
                return b.broj_posudivanja - a.broj_posudivanja;
            });
          

            korisnici.forEach(function (oKorisnik) {
                var link = 'img/a.png';
                var alternateLink = 'img/b.png';
                nRb++
                if (nRb % 2 === 0) {
                    link = alternateLink;
                  }

                oTablicaKorisnici.append(
                    '<tr>' +
                    '<td style="background-image: url(\'' + link + '\'); background-size: cover; background-color: rgb(153, 79, 29);"></td>'+
                    '<td>' + nRb + '.</td>' +
                    '<td>' + oKorisnik.ime + '</td>' +
                    '<td>' + oKorisnik.prezime + '</td>' +
                    '<td>' + oKorisnik.broj_clanske_iskaznice + '</td>' +
                    '<td>' + oKorisnik.broj_posudivanja + '</td>' +
                    '<td style="background-image: url(\'' + link + '\'); background-size: cover; background-color: rgb(153, 79, 29);"></td>'+
                    '</tr>'
                );
            });
        }).catch(function (error) {
            console.error('Pogreška:', error);
        });
    }).catch(function (error) {
        console.error('Pogreška:', error);
    });
}


///



//TOP 10
function C() {
    var oTablicaKnjiga = $('#bookTable456 tbody');
    oTablicaKnjiga.empty();
    var nRb = 0;
    var seenISBNs = {};

    OknjigaRef.once('value').then(function (knjigeSnapshot) {
        var knjigePromises = [];

        knjigeSnapshot.forEach(function (oK) {
            knjigePromises.push(new Promise(function (resolve, reject) {
                var oKnjiga = oK.val();
                var imageUrl;

                var imageRef = firebase.storage().refFromURL(oKnjiga.slika);
                imageRef.getDownloadURL().then(function (url) {
                    imageUrl = url;

                    oDbPosudbeRef.once('value').then(function (posudbeSnapshot) {
                        var ukupno = 0;

                        posudbeSnapshot.forEach(function (oP) {
                            var oPosudba = oP.val();

                            if (oKnjiga.isbn === oPosudba.isbn_knjige) {
                                ukupno++;
                            }
                        });

                        if (!seenISBNs[oKnjiga.isbn]) {
                            seenISBNs[oKnjiga.isbn] = true;

                            var autori = oKnjiga.autori.join(', ');

                            resolve({
                                'imageUrl': imageUrl,
                                'naslov': oKnjiga.naslov,
                                'autori': autori,
                                'ukupno': ukupno
                            });
                        } else {
                            resolve(null);
                        }
                    }).catch(reject);
                }).catch(reject);
            }));
        });

        Promise.all(knjigePromises).then(function (knjige) {
            
            knjige = knjige.filter(Boolean);

            
            knjige.sort(function (a, b) {
                return b.ukupno - a.ukupno;
            });

            knjige.slice(0, 10).forEach(function (oKnjiga) {
                var link = 'img/a.png';
                var alternateLink = 'img/b.png';
                nRb++
                if (nRb % 2 === 0) {
                    link = alternateLink;
                  }
                oTablicaKnjiga.append(
                    '<tr>' +'<td style="background-image: url(\'' + link + '\'); background-size: cover; background-color: rgb(153, 79, 29);"></td>'+
                    '<td>' + nRb + '.</td>' +
                    '<td><img src="' + oKnjiga.imageUrl + '" alt="Slika" style="max-width: 100px; max-height: 100px;"></td>' +
                    '<td>' + oKnjiga.naslov + '</td>' +
                    '<td>' + oKnjiga.autori + '</td>' +
                    '<td>' + oKnjiga.ukupno + '</td>' +
                    '<td style="background-image: url(\'' + link + '\'); background-size: cover; background-color: rgb(153, 79, 29);"></td>'+
                    '</tr>'
                );
            });
        }).catch(function (error) {
            console.error('Pogreška:', error);
        });
    }).catch(function (error) {
        console.error('Pogreška:', error);
    });
}



//TOP 10 KORISNIKA



    
function d() {
    var oTablicaKorisnici = $('#userTable789 tbody');
    oTablicaKorisnici.empty();
    var nRb = 0;
    var seenMembershipNumbers = {};

    var oKorisniciRef = oDb.ref('korisnici');
    var oDbPosudbeRef = oDb.ref("posudbe"); 

    oKorisniciRef.once('value').then(function (korisniciSnapshot) {
        var korisniciPromises = [];

        korisniciSnapshot.forEach(function (oK) {
            korisniciPromises.push(new Promise(function (resolve, reject) {
                var oKorisnik = oK.val();

                oDbPosudbeRef.orderByChild("key_korisnika").equalTo(oK.key).once('value').then(function (posudbeSnapshot) {
                    var brojPosudivanja = posudbeSnapshot.numChildren(); 

                    resolve({
                        'ime': oKorisnik.ime,
                        'prezime': oKorisnik.prezime,
                        'broj_clanske_iskaznice': oKorisnik.broj_clanske_iskaznice,
                        'broj_posudivanja': brojPosudivanja
                    });
                }).catch(function (error) {
                    reject(error);
                });
            }));
        });

        Promise.all(korisniciPromises).then(function (korisnici) {
            
            korisnici.sort(function (a, b) {
                return b.broj_posudivanja - a.broj_posudivanja;
            });

            korisnici.slice(0, 10).forEach(function (oKorisnik) {
                var link = 'img/a.png';
                var alternateLink = 'img/b.png';
                nRb++
                if (nRb % 2 === 0) {
                    link = alternateLink;
                  }
                oTablicaKorisnici.append(

                    '<tr>' +'<td style="background-image: url(\'' + link + '\'); background-size: cover; background-color: rgb(153, 79, 29);"></td>'+
                    '<td>' + nRb + '.</td>' +
                    '<td>' + oKorisnik.ime + '</td>' +
                    '<td>' + oKorisnik.prezime + '</td>' +
                    '<td>' + oKorisnik.broj_clanske_iskaznice + '</td>' +
                    '<td>' + oKorisnik.broj_posudivanja + '</td>' +
                    '<td style="background-image: url(\'' + link + '\'); background-size: cover; background-color: rgb(153, 79, 29);"></td>'+
                    '</tr>'
                );
            });
        }).catch(function (error) {
            console.error('Pogreška:', error);
        });
    }).catch(function (error) {
        console.error('Pogreška:', error);
    });
}
