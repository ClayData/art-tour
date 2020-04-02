const idsUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

let numIds;
let ids;
let gallery;

$.ajax({
    method: "GET",
    url: idsUrl
}).then(function(idResponse) {
    numIds = idResponse.total;
    ids = idResponse.objectIDs;
    
    getArt(numIds);

    $("#runButton").on("click", getArt);
});

function getArt() {
    const randIndex = Math.floor(Math.random()*numIds);
    const url = "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + ids[randIndex];

    $.ajax({
        method: "GET",
        url: url
    }).then(function(response) {
        let image = "";
        try {
            image = response.primaryImageSmall;
        }
        catch (error) {
            //pass (primaryImageSmall does not exist)
        }

        if(image != "") {
            artObject = response;

            $("#image").attr("src", artObject.primaryImageSmall);
            $("#title").text(artObject.title);
            $("#artist").text(artObject.artistDisplayName);
            $("#date").text(artObject.objectDate);

            return;
        }
        getArt();
    });
};

function getGallery () {
    $.get("/api/gallery", renderGalleryList);
}

function renderGalleryList(data) {
        let rowsToAdd = [];
        for (let i = 0; i < data.length; i++){
        rowsToAdd.push(createGalleryRow(data[i]));
        }

        $("#gallery-list").empty();
        $("#gallery-list").prepend(rowsToAdd);
        console.log("getting rows")
}

function createGalleryRow(data) {
    var galleryOption = $("<a>");
        galleryOption.attr({"class": "btn list-group-item list-group-item-action",
                            "type": "button",
                            "href": `/collection?${data.name}`});
        galleryOption.text(data.name);

    var activeCheck = $("<input>");
        activeCheck.attr({"type": "checkbox",
                            "class": "activeCheck",
                            "name": "checkbox"});

        galleryOption.append(activeCheck);
    return galleryOption;
}

function saveName(event) {
    event.preventDefault();
        gallery = $('#galleryName').val();
        console.log(gallery)

        let newGal = {
            name: gallery
        };

        $.ajax("/api/gallery",{ 
            method: "POST",
            data: newGal
        }).then(() => {
            console.log("added gallery name to table");
            getGallery();
        })
        event.stopImmediatePropagation();
    };

function sendToCollection (event) {
    event.preventDefault();
    let newPiece = {
        picture: $("#image").attr("src"),
        title: $("#title").text(),
        artist: $("#artist").text(),
        date: $("#date").text(),
        gallery: gallery
    }

    $.ajax("/api/collection",{ 
        method: "POST",
        data: newPiece
    }).then(() => {
        console.log("added art piece to table");
        
    })
    event.stopImmediatePropagation();
}

getGallery();

$(".activeCheck").change(function(){
    console.log("listening")
    if($(".activeCheck").is(":checked")){
        gallery = $(this).text();
    }
    console.log("jkdjfldsjl");
});

$(document).on("click", "#addGallery", saveName);
$(document).on('click', "#save",sendToCollection);