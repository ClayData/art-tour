$(document).ready(function() {
    
    const $galleryList = $("#gallery-list");
    let currentUser;
    let gallery = null;
    let count = 0;

    function getArtReqs() {
        
        let searchKey = $("#searchInput").val().trim();
        let departmentId = $("#departmentSelect option:selected").attr("data-id")


        const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${departmentId}&hasImages=true&q=${searchKey}`;

        $.ajax({
            method: "GET",
            url: url
        }).then(function(response) {
            $(".art-works").empty();
            for(let i = 0; i < 10; i++){
                getArtPiece(response.objectIDs[count]);
                count++;
            }
        }
    )};

    function getArtPiece(id) {

        let artUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`

        $.ajax({
            method: "GET",
            url: artUrl
        }).then(function(response) {

            let artObject = response;

            createArtworkDiv(artObject);
                return;
        })
    }

    function createArtworkDiv (data) {
        let artworkDiv = $("<div>");
            artworkDiv.attr({"class": "card"}).css("width", "40rem");
    
        let artworkImg = $("<img>");
            artworkImg.attr({"src": data.primaryImageSmall,
                             "class": "card-img-top",
                             "alt": "artwork"});
    
        let artworkTitle = $("<h4>");
            artworkTitle.text(data.title).attr({"class": "card-text"});
        
        let artworkArtist = $("<h4>");
            artworkArtist.text(data.artistDisplayName).attr({"class": "card-text"});
    
        let artworkDate = $("<p>");
            artworkDate.text(data.objectDate).attr({"class": "card-text"})
    
        let saveButton = $("<button>");
            saveButton.text("Save to Gallery").attr({"id": "save",
                                                     "class": "btn btn-primary",
                                                     "type": "button"})

        artworkDiv.append(artworkImg);
        artworkDiv.append(artworkTitle);
        artworkDiv.append(artworkArtist);
        artworkDiv.append(artworkDate);
        // artworkDiv.append(saveButton);
    
        $(".art-works").append(artworkDiv);

        
    }

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

        var delBtn = $("<i class='fas fa-trash-alt float-right text-danger delete-gallery'>");
            delBtn.attr({"id": data.name});

        galleryOption.append(delBtn);
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


    function setUser(data) {
        currentUser = data.id;
        console.log(currentUser);
    }
    

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

    $($galleryList).on("click", ".delete-gallery",function() {
        let result = confirm("Are you sure you want to delete this gallery?");

        if(result){
        $.ajax({
            url:"/api/gallery/" + this.id,
            method: "DELETE"
        }).then(() => getGalleries());
    }
    });


    $(document).on("click", "#runButton", getArtReqs);
    $(document).on("click", "#addGallery", saveName);
    $(document).on('click', "#save", sendToCollection);
    $(document).on('click', ".galleryButton", renderGalleryButtons);
    $(document).on("click", "#viewGalleriesButton", viewGalleries);
    

    getUser();
    getGalleries();

});