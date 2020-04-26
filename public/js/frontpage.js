$(document).ready(function() {
       
    const $galleryList = $("#gallery-list");
    const $artWorks = $(".art-works");
    let currentUser;
    let gallery = null;
    const dataObject = {
        dataList: []
    }

    //Makes call to API with data from forms on search page
   
    function getArtReqs(event) {
        event.preventDefault();
        dataObject.dataList = [];
        let searchKey = $("#searchInput").val().trim();
        let departmentId = $("#departmentSelect option:selected").attr("data-id")


        const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${departmentId}&hasImages=true&q=${searchKey}`;

        $.ajax({
            method: "GET",
            url: url
        }).then(function(response) {
            $(".art-works").empty();
            
            getArtPiece(response.objectIDs);
            resultsWait();
        }
    
    )
    
};

//Used to delay return of data from Met API

function resultsWait() {
    let secondsLeft = 1;
    let timerInterval = setInterval(()=> {
        secondsLeft--;

        if(secondsLeft === 0) {
            clearInterval(timerInterval);
            let pageData = pagination(state.page, state.rows).querySet;
            let pageNumber = pagination(state.page, state.rows).pages;
            pageButtons(pageNumber);
            createArtworkDiv(pageData);
            
        }
    }, 1200);
}

//sends artpiece info to the database

function getArtPiece(arr) {
    
        for(let i = 0; i < arr.length; i++){
        let artUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${arr[i]}`

        $.ajax({
            method: "GET",
            url: artUrl
        }).then(function(response) {

            let artObject = {
                            image: response.primaryImageSmall,
                            title: response.title,
                            artist: response.artistDisplayName,
                            date: response.objectDate
                        };
            
           dataObject.dataList.push(artObject);
        })
    }
    return dataObject;
    }

    //

    function createArtworkDiv (data) {
        for(let i = 0; i < data.length; i++){
        let artworkDiv = $("<div>");
            artworkDiv.attr({"class": "card"}).css("width", "40rem");
    
        let artworkImg = $("<img>");
            artworkImg.attr({"src": data[i].image,
                             "class": "card-img-top art-image",
                             "alt": "artwork"
                             });
    
        let artworkTitle = $("<h4>");
            artworkTitle.text(data[i].title).attr({"class": "card-text art-title"});
        
        let artworkArtist = $("<h4>");
            artworkArtist.text(data[i].artist).attr({"class": "card-text art-artist"});
    
        let artworkDate = $("<p>");
            artworkDate.text(data[i].date).attr({"class": "card-text art-date"})
    
        let saveButton = $("<button>");
            saveButton.text("Save to Gallery").attr({"class": "btn btn-primary save",
                                                     "type": "button"
                                                     })

        artworkDiv.append(artworkImg);
        artworkDiv.append(artworkTitle);
        artworkDiv.append(artworkArtist);
        artworkDiv.append(artworkDate);
        artworkDiv.append(saveButton);
    
        $(".art-works").append(artworkDiv);
     }
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
            picture: $(this).siblings().attr("src"),
            title: $(this).siblings(".art-title").text(),
            artist: $(this).siblings(".art-artist").text(),
            date: $(this).siblings(".art-date").text(),
            gallery: gallery
        }

        console.log(newPiece);

        $.ajax("/api/collection",{ 
            method: "POST",
            data: newPiece
        }).then(() => {
             
            
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

    var state = {
        
        'page': 1,
        'rows': 5
    }

  function pagination(page, rows) {
        
        var trimStart = (page - 1) * rows;
        var trimEnd = trimStart + rows;
        
        var trimmedData = dataObject.dataList.slice(trimStart, trimEnd);

        var pages = Math.ceil(dataObject.dataList.length / rows);

        return {
            'querySet': trimmedData,
            'pages': pages
        }
    }
    
    function pageButtons(pages) {
        let wrapper = $('#button-row');
        $('.art-works').empty();
        wrapper.empty();
        for(let page = 1; page <= pages; page++){
            let button = $("<button>")
                button.val(page).attr({"class": "page btn btn-sm btn-info"}).text(page);
            wrapper.append(button);
        }

        $('.page').on('click', function() {
            $('.art-works').empty();
            state.page = $(this).val();

            let pageData = pagination(state.page, state.rows).querySet;
            createArtworkDiv(pageData);
        })
    }

    // function logOut() {
    //     $.get("/logout")
    // }
   


    $(document).on("click", "#runButton", getArtReqs);
    $(document).on("click", "#addGallery", saveName);
    $($artWorks).on('click', ".save", sendToCollection);
    $(document).on('click', ".galleryButton", renderGalleryButtons);
    $(document).on("click", "#viewGalleriesButton", viewGalleries);
    // $(document).on("click", ".signin", logOut);

    getUser();
    getGalleries();

});