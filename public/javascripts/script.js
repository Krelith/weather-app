// Sets bold text across appropriate cells in each table
let cell = document.getElementsByTagName('td');

function embolden(){
    for (let i = 0; i < cell.length; i++){
        if (i % 9 == 0 || i >= 0 && i < 10 || i > 80 && i < 90 || i > 161 && i < 171 || i > 242 && i < 252 || i > 323 && i < 333){
            cell[i].style.fontWeight = "bold";
        }
        if (i % 9 == 0 && i % 81 == 0){
            cell[i].style.backgroundColor = "#fff";
            cell[i].style.color = "#2980b9";
        }
    }
}

embolden();