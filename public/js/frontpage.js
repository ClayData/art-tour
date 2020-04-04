$(document).ready(function() {
    const idsUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

    let numIds;
    let ids;
    let gallery = null;

    $.ajax({
        method: "GET",
        url: idsUrl
    }).then(function(idResponse) {
        numIds = idResponse.total;
        ids = idResponse.objectIDs;
        
        getArt();

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
                $("#saveAlert").text("");
                
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

    function getGalleries () {
        $.get("/api/gallery/" + currentUser, renderGalleryList);
    }

    function renderGalleryList(data) {
            let rowsToAdd = [];
            for (let i = 0; i < data.length; i++){
                rowsToAdd.push(createGalleryRow(data[i]));
            }

            $("#gallery-list").empty();
            $("#gallery-list").prepend(rowsToAdd);
            
    }

    function createGalleryRow(data) {
        var galleryOption = $("<button>");
            galleryOption.attr({"class": "galleryButton btn btn-group btn-light",
                                "type": "button", "data-isActive": "false"});
            galleryOption.text(data.name);
        return galleryOption;
    }

    function saveName(event) {
        event.preventDefault();
            let newGal = {
                name: $('#galleryName').val(),
                user: currentUser
            };

            $.ajax("/api/gallery",{ 
                method: "POST",
                data: newGal
            }).then(() => {
                getGalleries();
            });
            //event.stopImmediatePropagation();
        };

    function getUser() {
        $.get("/api/user", setUser)
    }

    let currentUser;

    function setUser(data) {
        currentUser = data.id;
        console.log(currentUser);
    }
    getUser();

    function sendToCollection (event) {
        event.preventDefault();

        if(gallery === null) {
            $("#saveAlert").text("Please select a gallery to save to");
            return;
        }

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
             
            getArt();
        });
        $("#saveAlert").text(`Saved to ${gallery}`);
        //event.stopImmediatePropagation();
    }

    function renderGalleryButtons() {
        $(".galleryButton").css("border-style", "none");
        $(".galleryButton").attr("data-isActive", "false");

        $(this).css("border-style", "solid");
        $(this).attr("data-isActive", "true");

        gallery = $(this).text();
    }

    function viewGalleries() {
        window.location.href = "/collection";
    }

    $(document).on("click", "#addGallery", saveName);
    $(document).on('click', "#save", sendToCollection);
    $(document).on('click', ".galleryButton", renderGalleryButtons);
    $(document).on("click", "#viewGalleriesButton", viewGalleries);

    getGalleries();
});