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
                    artistName.textContent = response[i]["Artist"];
                    row.appendChild(artistName);
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
    document.getElementById('addArtists').addEventListener('click', function(e) {
        console.log("Adding artist...");
        var request = new XMLHttpRequest();
        var carePackage = {"f_name": document.getElementById("fname").value, "l_name": document.getElementById("lname").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("POST","http://flip3.engr.oregonstate.edu:41988/artists", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response[0]);
                var row = document.createElement("tr");
                document.getElementById("artistsBody").appendChild(row);
                var artistId = document.createElement("td");
                artistId.textContent = response[0]["artist_id"];
                row.appendChild(artistId);
                var fName = document.createElement("td");
                fName.textContent = response[0]["f_name"];
                row.appendChild(fName);
                var lName = document.createElement("td");
                lName.textContent = response[0]["l_name"];
                row.appendChild(lName);
            }
            else
            {
                alert("Artist could not be added!");
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });
}