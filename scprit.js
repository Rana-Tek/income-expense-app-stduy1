const gelirVal = document.getElementById("gelir-val")
const giderForm = document.getElementById("giderForm")
const tableBody = document.getElementById("table-body")
const gelirEkle = document.getElementById("ekle")
const kalanDiv = document.getElementById("kalan")
const myDate = document.getElementById("giderTarih")
const alertDiv = document.getElementById("alert")
const temizle = document.getElementById("temizle")

myDate.max = `${new Date().toLocaleDateString("en-ca").replaceAll(".","-")}T23:59:00`;
const month = new Date().getMonth() < 9 ? "0" + (Number(new Date().getMonth())+1) : (Number(new Date().getMonth())+1);
myDate.min = `${new Date().getFullYear()}-${month}-01T00:00:00`

let gelir = Number(localStorage.getItem("gelir")) || 0
gelirEkle.addEventListener("click", () => {
    gelir = gelir + Number(gelirVal.value)
    localStorage.setItem("gelir", gelir)
    gelirVal.value = ""
    kalanHesapla()
})

let inStatic = {
    id: "",
    yer: "",
    tarih: "",
    miktar: "",

}

let arr = []

window.addEventListener("load", () => {
    arr = JSON.parse(localStorage.getItem("harcamalar")) || []
    if(arr.length > 0){
        arr.forEach(element => getCreateElem(item));
    }
    kalanHesapla()
})

const changeArea = (e) =>{
    e.preventDefault();
    inStatic = {...inStatic,[e.target.name]:e.target.value}
}

giderForm.addEventListener("submit", (e) => {
e.preventDefault()
inStatic = {...inStatic,id:new Date().getTime()}
arr.push(inStatic)
localStorage.setItem("harcamalar", JSON.stringify(arr))
getCreateElem(inStatic)
kalanHesapla()
inStatic = {
    id: "",
    yer: "",
    tarih: "",
    miktar: "",
}
giderForm.reset()
})

function getCreateElem(item, i) {
const newElement =`
<td>${new Date(item.tarih).toLocaleString("tr-TR")}</td>
      <td class="text-capitalize">${item.yer}</td>
      <td>${item.miktar} ₺</td>
      <td class="silme">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" role="button" class="bi bi-trash3" viewBox="0 0 16 16">
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
        </svg>
    </td>
`
const tr = document.createElement("tr")
tr.setAttribute("id", item.id)
tr.innerHTML = newElement;
tableBody.prepend(tr)
}

tableBody.addEventListener("click", (e) => {
    if(e.target.classList.contains("bi-trash3")){
     
        const id = e.target.parentElement.parentElement.getAttribute("id");
    e.target.parentElement.parentElement.remove();
    arr = arr.filter((gider) => gider.id != id); 
    localStorage.setItem("harcamalar", JSON.stringify(arr));
    kalanHesapla();
    let myAlertDiv = `
      <div
        class="alert alert-danger w-50 d-flex justify-content-between"
        role="alert">
        <span>Harcama başarıyla silindi!</span>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"></button>
      </div>
    `
    alertDiv.innerHTML = myAlertDiv;
    setTimeout(() => {
      alertDiv.innerHTML = "";
    }, 10000);
  }
});

giderForm.childNodes.forEach((item) => item.addEventListener("change", changeArea))


function kalanHesapla () {
    const totalHarcama = arr.reduce((acc, it) => acc + Number(it.miktar), 0)
    const kalanMiktar = gelir - totalHarcama
    kalanDiv.innerHTML = `
    <tr>
  <th><span>Gelir miktarınız:</span></th>
  <td><span> ${gelir} ₺ </span></td>
  </tr>
  <tr>
  <th><span>Gider Miktarınız:</span></th>
  <td><span> ${totalHarcama} ₺ </span></td>
  </tr>
  <tr>
  <th><span>Kalan:</span></th>
  <td><span> ${kalanMiktar} ₺ </span></td>`
}

temizle.addEventListener("click", ()=>{
    arr = []
    localStorage.clear()
    kalanHesapla()
    tableBody.innerHTML = ""
    kalanDiv.innerHTML = ""
})