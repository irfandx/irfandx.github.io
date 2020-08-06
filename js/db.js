let dbPromised = idb.open("football-PWA", 1, function(upgradeDb) {
  let teamsObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "id"
  });
  teamsObjectStore.createIndex("name", "name", { unique: false });
});

//fungsi untuk menyimpan artikel baru (objek di kirim dari hasil parsing json, metod add untuk simpan artikel)
function saveForLater(team) {
  dbPromised
    .then(function(db) {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      console.log(team);
      store.add(team); //mayerorror
      return tx.complete;
    })
    .then(function() {
      console.log("Team ini berhasil di simpan.");
    });
}
//fungsi getAll() untuk mengambil seluruh data dari Indexed DB
function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function(teams) {
        resolve(teams);
      });
  });
}
//fungsi getById untuk mengambil satu data dari database berdasarkan id
function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.get(id);
      })
      .then(function(team) {
        resolve(team);
      });
  });
}
//fungsi delete untuk menghapus data dari indexdb
function deleteFavorite(data) {
   dbPromised.then(function(db) {
      var tx = db.transaction('teams', 'readwrite');
      var store = tx.objectStore('teams');
      store.delete(data);
      return tx.complete;
  }).then(function() {
     console.log("team di hapus.");
     getSavedTeams();
  }).catch(function(err) {
      console.log(err);
  })
}
