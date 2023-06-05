function reveal_nilai() {
  console.log("reveal_nilai");
  var row_tabel_kelas = $("table tr")
    .contents()
    .filter(function () {
      return this.nodeType === 8;
    }); //get the comments

  if (abcd.length != 0) {
    row_tabel_kelas.replaceWith(function () {
      return this.data;
    });
  } else {
    window.location.reload();
  }
}

//get element by id
var btn = document.getElementById("reveal-btn");
btn.addEventListener("click", reveal_nilai);
