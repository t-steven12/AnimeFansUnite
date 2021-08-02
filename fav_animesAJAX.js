document.addEventListener('DOMContentLoaded', binder);

function binder(){

    document.getElementById('viewFavs').addEventListener('click', function(e) {
        console.log("AJAX to view user's favorite animes...");
        var request = new XMLHttpRequest();
        var carePackage = {"userId": document.getElementById("userId").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("POST","http://flip3.engr.oregonstate.edu:41988/fav_animes", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
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
                alert("User not found!");
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });

    //AJAX request to insert a user
    document.getElementById('favoriteAnAnime').addEventListener('click', function(e) {
        console.log("AJAX to favorite an anime...");
        var request = new XMLHttpRequest();
        var carePackage = {"uId": document.getElementById("userIdFav").value, "aId": document.getElementById("animeIdToFav").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("POST","http://flip3.engr.oregonstate.edu:41988/favoritingAnime", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response[0]);
                var uId = response[0]["UserID"];
                var aId = response[0]["AnimeID"];
                var animeTitle = response[0]["AnimeTitle"];
                alert("UserID#: " + uId + "\n\n" + "Successfully favorited:\n" + "Anime ID: " + aId + "\n" + "Anime Title: " + animeTitle);
            }
            else
            {
                alert("Anime could not be favorited!");
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });
}