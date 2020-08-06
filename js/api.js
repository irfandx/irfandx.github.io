const base_url = "https://api.football-data.org/v2/";

const token = 'be36a32c8fc14495a67c0e75120cdbf8';

let url_scorer = `${base_url}competitions/PL/scorers?limit=10`;

let fetchApi = url => {
    return fetch(url, {
        method: "get",
        mode: "cors",
        headers: {
            'X-Auth-Token': token
        }
    });
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error request API : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error API req : " + error);
};

// Blok kode untuk melakukan request data json
function getTeams() {
    if ("caches" in window) {
        caches.match(base_url + "teams").then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    let teamsHTML = "";
                    data.teams.forEach(function(team) {
                        teamsHTML += `
                                      <div class="card">
                                        <div class="card-content grey lighten-3">
                                          <p>${team.name}</p>
                                          <a href="./team-detail.html?id=${team.id}">
                                          <span class="card-title truncate">${team.shortName}</span>
                                          </a>
                                          <p>${team.venue}</p>
                                        </div>
                                      </div>
                                    `;
                    });
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById("teams").innerHTML = teamsHTML;
                });
            }
        });
    }

    fetchApi(base_url + "teams")
        .then(status)
        .then(json)
        .then(function(data) {
            // Objek/array JavaScript dari response.json() masuk lewat data.

            // Menyusun komponen card artikel secara dinamis
            let teamsHTML = "";
            data.teams.forEach(function(team) {
                teamsHTML += `
                              <div class="card">
                                <div class="card-content grey lighten-3">
                                  <p>${team.name}</p>
                                  <a href="./team-detail.html?id=${team.id}">
                                    <span class="card-title truncate">${team.shortName}</span>
                                  </a>
                                  <p>${team.venue}</p>
                                </div>
                              </div>
                            `;
            });
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("teams").innerHTML = teamsHTML;
        })
        .catch(error);
}
//ahir fungsi getTeams

//fungsi top scorers
function getTopScorer() {
    if ("caches" in window) {
        caches.match(url_scorer).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    let topscorerHTML = "";
                    data.scorers.forEach(function(scorer) {
                        topscorerHTML += `
                                        <div class="divider"></div>
                                         <div class="section">
                                           <p>${scorer.player.name} || Record : ${scorer.numberOfGoals} <br>
                                              ${scorer.team.name}
                                            </p>
                                         </div>
                                    `;
                    });
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById("topScorer").innerHTML = topscorerHTML;
                });
            }
        });
    }

    fetchApi(url_scorer)
        .then(status)
        .then(json)
        .then(function(data) {
            // Objek/array JavaScript dari response.json() masuk lewat data.

            // Menyusun komponen card artikel secara dinamis
            let topscorersHTML = "";
            data.scorers.forEach(function(scorer) {
                topscorersHTML += `
                                      <div class="divider"></div>
                                       <div class="section">
                                         <p>${scorer.player.name} || Record : ${scorer.numberOfGoals} <br>
                                            ${scorer.team.name}
                                          </p>
                                       </div>
                            `;
            });
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("topScorer").innerHTML = topscorersHTML;
        })
        .catch(error);
}

//fungsi getTeambyid --> indexdb
function getTeamById() {
    return new Promise(function(resolve, reject) {
        // Ambil nilai query parameter (?id=)
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        if ("caches" in window) {
            caches.match(base_url + "teams/" + idParam).then(function(response) {
                if (response) {
                    response.json().then(function(data) {
                        let teamHTML = `
                        <div class="card">
                          <div class="card-image waves-effect waves-block waves-light">
                            <img src="${data.crestUrl}" />
                          </div>
                          <div class="card-content">
                            <span class="card-title">${data.name}</span>
                            <table class="striped">
                              <tbody>
                                  <tr>
                                    <td>Address</td>
                                    <td>${data.address}</td>
                                  </tr>
                                  <tr>
                                    <td>E-mail</td>
                                    <td>${data.email}</td>
                                  </tr>
                                  <tr>
                                    <td>Phone</td>
                                    <td>${data.phone}</td>
                                  </tr>
                                  <tr>
                                    <td>Venue</td>
                                    <td>${data.Venue}</td>
                                  </tr>
                                  <tr>
                                    <td>Website</td>
                                    <td>${data.website}</td>
                                  </tr>
                                </tbody>
                              </table>
                          </div>
                        </div>
                                    `;
                        // Sisipkan komponen card ke dalam elemen dengan id #content
                        document.getElementById("body-content").innerHTML = teamHTML;
                        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                        resolve(data);
                    });
                }
            });
        }
        /////////////////////
        fetchApi(base_url + "teams/" + idParam)
            .then(status)
            .then(json)
            .then(function(data) {
                // Objek JavaScript dari response.json() masuk lewat variabel data.
                console.log(data);
                // Menyusun komponen card artikel secara dinamis
                let teamHTML = `
                              <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                  <img src="${data.crestUrl}" />
                                </div>
                                <div class="card-content">
                                  <span class="card-title">${data.name}</span>
                                  <table class="striped">
                                    <tbody>
                                        <tr>
                                          <td>Address</td>
                                          <td>${data.address}</td>
                                        </tr>
                                        <tr>
                                          <td>E-mail</td>
                                          <td>${data.email}</td>
                                        </tr>
                                        <tr>
                                          <td>Phone</td>
                                          <td>${data.phone}</td>
                                        </tr>
                                        <tr>
                                          <td>Venue</td>
                                          <td>${data.Venue}</td>
                                        </tr>
                                        <tr>
                                          <td>Website</td>
                                          <td>${data.website}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                </div>
                              </div>

                              `;
                // Sisipkan komponen card ke dalam elemen dengan id #content
                document.getElementById("body-content").innerHTML = teamHTML;
                // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                resolve(data);
            });
    });
}
///////////////////////////////////////////////////////////////////////////
//fungsi getSavedteams() yang akan mengambil seluruh artikel di Indexed DB
//melalui fungsi getAll() lalu menampilkannya
function getSavedTeams() {
    getAll().then(function(teams) {
        console.log(teams);
        // Menyusun komponen card artikel secara dinamis
        let teamsHTML = "";
        //blok kode if mengecek apabila data idb kosong
        if (!teams.length){
          teamsHTML = `<h4><center>Belum ada team favorit yang Tersimpan</center></h4><img class="responsive-img" src="/images/nodatasaved.png">`
        }else {


        teams.forEach(function(team) {
            teamsHTML += `
                        <div class="card">
                        <a href="./team-detail.html?id=${team.id}&saved=true">
                          <div class="card-image waves-effect waves-block waves-light">
                            <img src="${team.crestUrl}" />
                          </div>
                        </a>
                          <div class="card-content">
                            <span class="card-title"><center>${team.name}</center></span>
                          </div>
                          <table class="centered">
                            <tbody>
                              <tr>
                              <td><a class="waves-effect waves-light btn-small" href="./team-detail.html?id=${team.id}&saved=true">detail</a></td>
                              <td><a class="waves-effect waves-light btn-small" id="btndel" value="DeleteFavorit" onclick="deleteFavorite(${team.id})">delete</a></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        `;
        });
      };
        // Sisipkan komponen card ke dalam elemen dengan id #body-content
        document.getElementById("body-content").innerHTML = teamsHTML;
    });
}

//fungsi getSavedteamById mengambil data dari database dan menampilkannya di halaman detail.
function getSavedTeamById() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    getById(idParam).then(function(team) {
        let teamHTML = '';
        teamHTML = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${team.crestUrl}" />
              </div>
              <div class="card-content">
              <span class="card-title">${team.name}</span>
              </div>
              <table class="centered">
                <tbody>
                  <tr>
                  <td><a class="waves-effect waves-light btn-small" href="./team-detail.html?id=${team.id}&saved=true">detail</a></td>
                  <td><a class="waves-effect waves-light btn-small" id="btndel" value="DeleteFavorit" onclick="deleteFavoriteTeamIn(${team.id})">delete</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
                `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = teamHTML;
    });
}
