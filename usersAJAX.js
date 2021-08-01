document.addEventListener('DOMContentLoaded', binder);

function binder() {

    getOverHere();

    //Request to retrieve table
    function getOverHere(){
        console.log("AJAX to retrieve table");
        var request = new XMLHttpRequest();
        request.open("GET", "http://flip3.engr.oregonstate.edu:41988", true);
        request.send(null);
        request.addEventListener('load', function() {
            if(request.status>= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                var usersTabBody = document.getElementById("usersBody");
                for(var i = 0; i < response.length; i++)
                {
                    var row = document.createElement("tr");
                    usersTabBody.appendChild(row);
                    var id = document.createElement("td");
                    id.textContent = response[i]["user_id"];
                    row.appendChild(id);
                    var fName = document.createElement("td");
                    fName.textContent = response[i]["f_name"];
                    row.appendChild(fName);
                    var lName = document.createElement("td");
                    lName.textContent = response[i]["l_name"];
                }
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
    }

    //AJAX request to insert a user
    document.getElementById('addUser').addEventListener('click', function(e) {
        console.log("Adding user...");
        var request = new XMLHttpRequest();
        var carePackage = {"f_name": document.getElementById("firstName").value, "l_name": document.getElementById("lastName").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("POST","http://flip3.engr.oregonstate.edu:41988", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
                //console.log(response[0]);
                var response = JSON.parse(request.responseText);
                var row = document.createElement("tr");
                document.getElementById("usersBody").appendChild(row);
                var fName = document.createElement("td");
                fName.textContent = response[0]["f_name"];
                row.appendChild(fName);
                var lName = document.createElement("td");
                lName.textContent = response[0]["l_name"];
                row.appendChild(lName);
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