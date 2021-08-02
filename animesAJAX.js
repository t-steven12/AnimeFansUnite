document.addEventListener('DOMContentLoaded', binder);

function binder() {

    getAnimes();

    //Request to retrieve table
    function getAnimes(){
        console.log("AJAX to retrieve Animes table");
        var request = new XMLHttpRequest();
        request.open("GET", "http://flip3.engr.oregonstate.edu:41988/animes", true);
        request.addEventListener('load', function() {
            if(request.status>= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                var animeList = document.getElementById("animeList");
                for(var i = 0; i < response.length; i++)
                {
                    var row = document.createElement("tr");
                    animeList.appendChild(row);
                    var id = document.createElement("td");
                    id.textContent = response[i]["AnimeID"];
                    row.appendChild(id);
                    var title = document.createElement("td");
                    title.textContent = response[i]["Title"];
                    row.appendChild(title);
                    var artist = document.createElement("td");
                    artist.textContent = response[i]["Artist"];
                    row.append(artist);
                }
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
        request.send(null);
    }

    //AJAX request to insert a user
    document.getElementById('addAnime').addEventListener('click', function(e) {
        console.log("Adding anime...");
        var request = new XMLHttpRequest();
        var carePackage = {"title": document.getElementById("titlesList").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("POST","http://flip3.engr.oregonstate.edu:41988/users", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response[0]);
                var row = document.createElement("tr");
                document.getElementById("animeList").appendChild(row);
                var id = document.createElement("td");
                id.textContent = response[0]["AnimeID"];
                row.appendChild(id);
                var title = document.createElement("td");
                title.textContent = response[0]["Title"];
                row.appendChild(title);
                var artist = document.createElement("td");
                artist.textContent = response[0]["Artist"];
                row.appendChild(artist);
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });
}