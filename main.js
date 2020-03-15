let id_token;

window.addEventListener("load", function (event) {

    var info = document.getElementById("info");
    info.style.visibility = "hidden";
    var wrapper = document.getElementById("wrapper");
    wrapper.style.visibility = "hidden";

    fetch('http://sallefy.eu-west-3.elasticbeanstalk.com/api/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "password": "pweb1", "rememberMe": true, "username": "pweb1" })
    })
        .then(res => res.json())
        .then(data => {
            id_token = data.id_token;
            fetch('http://sallefy.eu-west-3.elasticbeanstalk.com/api/playlists/8', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + data.id_token
                }
            })
                .then(res => res.json())
                .then(data => {
                    var linkInfo = "test";
                    var container = document.getElementById("container");
                    var element;
                    this.console.log(data.tracks)
                    for (var i = 0; i < data.tracks.length; i++) {
                        if (element != this.undefined) {
                            element = element + "<div class='album' onclick='showInfo(" + data.tracks[i].id + ")'><img class='album__cover' src=" + data.tracks[i].thumbnail +
                                " alt='Album'><div class='album__details'><div class='album__artist'>" + data.tracks[i].name +
                                "</div><div class='album__name'>" + data.tracks[i].genres[0].name +
                                "</div></div></div>"
                        } else {
                            element = "<div class='album' onclick='showInfo(" + data.tracks[0].id + ")'><img class='album__cover' src=" + data.tracks[0].thumbnail +
                                " alt='Album'><div class='album__details'><div class='album__artist'>" + data.tracks[0].name +
                                "</div><div class='album__name'>" + data.tracks[0].genres[0].name +
                                "</div></div></div>"
                        }
                        container.innerHTML = '<div class="albums">' + element + '</div>';
                    }

                })
                .catch(err => { console.log(err) })

        })
        .catch(err => { console.log(err) })



});

function showInfo(data) {
    fetch('http://sallefy.eu-west-3.elasticbeanstalk.com/api/tracks/' + data, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + id_token
        }
    })
        .then(res => res.json())
        .then(data => {


            if (info.style.visibility == "hidden") {
                songInfo = "<div class='album'><h2 id = 'name' class='h2 center'>" + data.name + "</h2><h3 class='center'>Released: " + data.released + "</h3> <h3 class='center'>Duration: " + data.duration + "</h3><h3 class='center'>Owner: " + data.owner.firstName + data.owner.lastName + ' / ' + data.owner.email + "</h3><h3 class='center'>Genre: " + data.genres[0].name + "</h3></div>"
                info.innerHTML = songInfo;
                info.style.visibility = "visible";
            } else {
                var name = document.getElementById("name").innerHTML;
                if (data.name == name) {
                    info.style.visibility = "hidden";
                } else {
                    songInfo = "<div class='album'><h2 id = 'name' class='h2 center'>" + data.name + "</h2><h3 class='center'>Released: " + data.released + "</h3> <h3 class='center'>Duration: " + data.duration + "</h3><h3 class='center'>Owner: " + data.owner.firstName + data.owner.lastName + ' / ' + data.owner.email + "</h3><h3 class='center'>Genre: " + data.genres[0].name + "</h3></div>"
                    info.innerHTML = songInfo;
                }
            }

        })
        .catch(err => { console.log(err) })
}

function showSubmit() {
    var wrapper = document.getElementById("wrapper");
    if (wrapper.style.visibility == "hidden") {
        wrapper.style.visibility = "visible";
    } else {
        wrapper.style.visibility = "hidden";
    }

}

function submitSong() {
    var login = document.getElementById("login").value;
    var email = document.getElementById("email").value;
    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;
    var track = document.getElementById("track").value;
    var url = document.getElementById("url").value;
    var thumbnail = document.getElementById("thumbnail").value;
    var genre = document.getElementById("genre").value;
    var duration = document.getElementById("duration").value;

    console.log(duration);
    var dataObject = {
        "color": "null",
        "duration": parseInt(duration),
        "genres": [
            {
                "id": 8,
                "name": genre
            }
        ],
        "name": track,
        "owner": {
            "activated": true,
            "authorities": [
                "string"
            ],
            "createdDate": "2020-02-28T10:04:58.504Z",
            "email": email,
            "firstName": name,
            "followers": 0,
            "following": 0,
            "imageUrl": "string",
            "langKey": "string",
            "lastModifiedBy": "string",
            "lastModifiedDate": "2020-02-28T10:04:58.504Z",
            "lastName": surname,
            "login": login,
            "playlists": 8,
            "tracks": 0
        },
        "released": "2020-02-28T10:04:58.504Z",
        "thumbnail": thumbnail,
        "url": url
    }

    fetch('http://sallefy.eu-west-3.elasticbeanstalk.com/api/tracks/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + id_token
        },
        body: JSON.stringify(dataObject)
    })
        .then((response) => {
            if (response.ok) {
                alert("Track added succesfully!")
            } else {
                throw new Error('Something went wrong, check the data you submited is correct!');
            }
        })
        .catch(err => {
            alert(err)
        })

}
