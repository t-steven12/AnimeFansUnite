document.addEventListener('DOMContentLoaded', binder);

function binder(){

    document.getElementById("viewFavs").addEventListener('click',function(e){
      console.log("AJAX to view user's favorite animes...");
      var request = new XMLHttpRequest();
        request.open("GET", "http://flip3.engr.oregonstate.edu:41988/fav_animes?userId=" + document.getElementById("userId").value, true);
        request.addEventListener('load', function() {
            if(request.status>= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                var favAnimesTabBody = document.getElementById("userFavAnimes");
                for(var i = 0; i < response.length; i++)
                {
                    var row = document.createElement("tr");
                    favAnimesTabBody.appendChild(row);
                    var userId = document.createElement("td");
                    userId.textContent = response[i]["UserID"];
                    row.appendChild(userId);
                    var animeId = document.createElement("td");
                    animeId.textContent = response[i]["AnimeID"];
                    row.appendChild(animeId);
                    var title = document.createElement("td");
                    title.textContent = response[i]["AnimeTitle"];
                    row.appendChild(title);
                }
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
        request.send(null);
    });

    //AJAX request to insert a user
/*    document.getElementById('addTitles').addEventListener('click', function(e) {
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
    });*/
}