# Art-Tour
Virtual art collection

live site: https://art-tour.herokuapp.com/

This application utilizes the New York Met Art Gallery api to create a virtual art gallery experience. Users can click through different pieces of art that are housed within the Met. An image of the piece, the creator, it's title and date of creation are shown on the page. Users may create their own gallery by entering a gallery name into the upper left text box. Then by clicking on the newly created button from the submission, that gallery will be active and art may be saved to it. A user can then go view a gallery by clicking on the View Galleries button and they will be taken to the galleries page. There the user must click on a gallery and all the artwork in it will be shown. Art is saved in a MySQL database along with gallery names. The Sequelize ORM is used for querying the db. Styling is done with bootstrap and additional css. 




### Log-in / Sign-up: 

Users log in or sign up depending on if they have visited the site before. The authentication is done with Passport.js and if a user is authenticated or just signed up, on submission they will be redirected to the search page. 

![](images/art_tour_signup.png)

### Search 

This page allows users to search the Met API by selecting what department they want to search and entering in a keyword. The works are then returned and loaded onto the page. There will be five "cards" of art loaded and then pagination buttons are located at the bottom to look through more fo the returned art pieces.

![](images/art_tour_search.png)

### Create a Gallery 

On the sidebar of the search page a user may enter in a gallery name and then on submit the name will be displayed along the side of the page. These galleries are only visible to the user that made them. Users then select the gallery by clicking on it and may add art to the gallery by clicking on the save button on the different art pieces. To view the gallery the user must hit the view galleries button below the gallery list.

![](images/art_tour_create.png)

### Looking at the Galleries

Once on the galleries page the need only click on the gallery to view it.

![](images/art_tour_gallery.png)

### Technology
* jQuery
* bootstrap
* MySql
* Sequelize
* Passport.js
* Express
* Node
