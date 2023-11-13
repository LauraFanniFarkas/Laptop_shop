
//Read
function renderLaptop() {

    let laptopHTML = "";
    let laptopLista = document.getElementById("laptop-lista");    
    let xhr = new XMLHttpRequest();
    console.log(xhr);
    xhr.open('GET', 'http://localhost:3000/laptopok', true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            let laptopok = JSON.parse(xhr.responseText);
            console.log(laptopok);




            laptopok.forEach((laptop) => {
                laptopHTML += `
        <div class="col">
            <div class="m-2 p-2 ${laptop.raktaron ? "bg-success" : "bg-danger"}">
            <h2>${laptop.nev}</h2>
            <p>${laptop.ara}</p>
            <button class="btn btn-danger" onclick="torles(${laptop.id})">Törlés</button>
            <button class="btn btn-primary" onclick="modositas(${laptop.id})">Módosítás</button>
            </div>
        </div>
        `
            });
            laptopLista.innerHTML = laptopHTML;
        } else {
            console.error('Hiba történt', xhr.status, xhr.statusText)
        }
    };
    xhr.send();


    document.getElementById("laptop-lista").innerHTML = laptopHTML;
}

//Create művelet
document.getElementById("ujtermek").onclick = function () {
    // console.log("Szia");
    let newFormHTML = `
    <h4>Áru Hozzáadása</h4>
    <form id="uj-laptop" class="p-5">
        <label  class="w-100">
        <h5>Termék neve</h5>     </label>
        <input class="form-control" type="text" name="nev">   

        <label class="w-100">
        <h5>Termék ára</h5>  </label>
        <input class="form-control" type="number" name="ara">      

        <label  class="w-100">
        <h5>Van e raktáron?</h5>  </label>
        <input  type="checkbox" name="raktaron">
        <br>
        <button class="btn btn-primary" type="submit">Küldés</button>
    </form>
    `;
    let ujElem = document.getElementById('uj');
    ujElem.innerHTML = newFormHTML;
    document.getElementById("ujtermek").style.display = 'none';

    //az űrlap elemek mentése változókba
    let ujLaptopForm = document.getElementById("uj-laptop")
    ujLaptopForm.onsubmit = function (event) {
        event.preventDefault();
        let nev = event.target.elements.nev.value;

        let ara = event.target.elements.ara.value;

        let raktaron = event.target.elements.raktaron.checked;


        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/laptopok', true);
        xhr.setRequestHeader('Content-Type', 'application/JSON;charset=UTF-8')

        xhr.onload = function () {
            if (xhr.status === 201) {
                renderLaptop();
                ujElem.innerHTML = "";
                document.getElementById("ujtermek").style.display = 'block';
            }
        }

        // a mentett adatok tömbhöz hozzáadása
        xhr.send(JSON.stringify({
            nev: nev,
            ara: ara,
            raktaron: raktaron
        }));


        document.getElementById("uj").innerHTML = "";
        document.getElementById("ujtermek").style.display = 'block';
        mentesLocalStoragebe()
        renderLaptop();
    }
}

//Törlés
function torles(id){
    let xhr = new XMLHttpRequest();
        xhr.open('DELETE', 'http://localhost:3000/laptopok', true);
        xhr.onload=function(){
            if(xhr.status === 200 || xhr.status === 204){
                renderLaptop();
            }else{
                console.error('Hiba történt', xhr.status, xhr.statusText)
            }
        };
        xhr.send();
}

function torles(index) {
    allapot.laptopok.splice(index, 1);//törlés az index alapján
    mentesLocalStoragebe(); //mentés localstorage-be újra
    renderLaptop(); //frissítjük a böngészőt
}

//Módosítás
function modositas(index) {
    //módosítandó termék adatai
    let laptop = allapot.laptopok[index];
    console.log(laptop.raktaron);
    //űrlap a módosításhoz
    let modositasFormHTML = `
    <h4>Termék adatainak módosítása:</h4>
    <form id="modositas-laptop" class="p-5">
        <label  class="w-100">
        <h5>Termék neve</h5>     </label>
        <input class="form-control" type="text" name="nev" value="${laptop.nev}">   

        <label class="w-100">
        <h5>Termék ára</h5>  </label>
        <input class="form-control" type="number" name="ara" value="${laptop.ara}">      

        <label  class="w-100">
        <h5>Van e raktáron?</h5>  </label>
        <input  type="checkbox" name="raktaron" ${laptop.raktaron ? 'checked' : ''}>
        <br>
        <button class="btn btn-primary" type="submit">Küldés</button>
    </form>
    `;
    document.getElementById("uj").innerHTML = modositasFormHTML;
    document.getElementById("ujtermek").style.display = 'none';

    document.getElementById("modositas-laptop").onsubmit = function (event) {
        event.preventDefault();
        let nev = event.target.elements.nev.value;
        console.log(nev);
        let ara = event.target.elements.ara.value;
        console.log(ara);
        let raktaron = event.target.elements.raktaron.checked;
        console.log(raktaron);

        allapot.laptopok[index] = {
            nev: nev,
            ara: ara,
            raktaron: raktaron
        };
        document.getElementById("uj").innerHTML = "";
        document.getElementById("ujtermek").style.display = 'block';
        mentesLocalStoragebe()
        renderLaptop();
    }
}


window.onload = renderLaptop();