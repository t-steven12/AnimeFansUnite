document.addEventListener('DOMContentLoaded', binder);

function binder(){

    getTitles();

    function getTitles(){
        console.log("AJAX to retrieve Titles table...");
        var request = new XMLHttpRequest();
        request.open("GET", "http://flip3.engr.oregonstate.edu:41988/titles", true);
        request.addEventListener('load', function() {
            if(request.status>= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                var titlesTabBody = document.getElementById("titlesBody");
                for(var i = 0; i < response.length; i++)
                {
                    var row = document.createElement("tr");
                    titlesTabBody.appendChild(row);
                    var titleName = document.createElement("td");
                    titleName.textContent = response[i]["Titles"];
                    row.appendChild(titleName);
                    var artistName = document.createElement("td");
                    artistName.textContent = response[i]["Artists"];
                    row.appendChild(artistName);
                    var artistOption = document.createElement("option");
                    artistOption.value = response[i]["Artists"];
                    document.getElementById("artistOptions").appendChild(artistOption);
                    var newArtistOption = document.createElement("option");
                    newArtistOption.value = response[i]["Artists"];
                    document.getElementById("newArtistOptions").appendChild(newArtistOption);
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
    document.getElementById('addTitles').addEventListener('click', function(e) {
        console.log("Adding title...");
        var request = new XMLHttpRequest();
        var carePackage = {"title_name": document.getElementById("title").value, "artist": document.getElementById("artistName").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("POST","http://flip3.engr.oregonstate.edu:41988/titles", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response[0]);
                var row = document.createElement("tr");
                document.getElementById("titlesBody").appendChild(row);
                var theTitle = document.createElement("td");
                theTitle.textContent = response[0]["Titles"];
                row.appendChild(theTitle);
                var theArtist = document.createElement("td");
                theArtist.textContent = response[0]["Artists"];
                row.appendChild(theArtist);
            }
            else
            {
                alert("Title could not be added!");
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });
}