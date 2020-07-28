const artworksURL= "http://localhost:3000/api/v1/artworks"
const artistsURL= "http://localhost:3000/api/v1/artists"

//Index.html Body Sections
const landingDisplay = document.querySelector('#landing-display')
const artworkContainer = document.querySelector('#artwork-container')
const artistContainer = document.querySelector('#artist-container')
const createArtistForm= document.querySelector("#new-artist-form-container")

//Index.html Nav Bar Links
const home= document.querySelector("#home")
const showArt= document.querySelector("#showArt")
const showArtists= document.querySelector("#showArtists")
const showForm= document.querySelector("#showForm")
let artists= false
let art= false
let form= false
let homeV= false

//Event Listener Buttons
const likeButton= document.getElementById("like-button")
const artCard= document.querySelector(".card mb-4 shadow-sm")

//Event Listeners to Change Layout of HTML Page, based on Nav Selection
home.addEventListener('click', () => {
  homev= !homev
  if (homeV) {
    artworkContainer.style.display = 'none';
    artistContainer.style.display = 'none';
    createArtistForm.style.display = 'none';
    landingDisplay.style.display= 'block';
    }
  else {}
  })

showArt.addEventListener('click', () => {
  art = !art
  getArtworks()
  if (art) {
    artworkContainer.style.display = 'auto';
    artistContainer.style.display = 'none';
    createArtistForm.style.display = 'none';
    landingDisplay.style.display= 'none';
    }
  else {
    artworkContainer.style.display = 'none' }
  })

showArtists.addEventListener('click', () => {
  artists = !artists
  getArtists()
  if (artists) {
    artistContainer.style.display = 'block';
    artworkContainer.style.display = 'none';
    createArtistForm.style.display = 'none';
    landingDisplay.style.display= 'none';
    }
  else {
    artistContainer.style.display = 'none'}
  })

showForm.addEventListener('click', () => {
  form = !form
  showArtistForm()
  if (form) {
    createArtistForm.style.display = 'block';
      artworkContainer.style.display = 'none';
      artistContainer.style.display = 'none';
      landingDisplay.style.display= 'none';
    }
  else {
    createArtistForm.style.display = 'none'}
  })

//Fetch Calls to DB for Index

function getArtworks() {
  fetch(artworksURL)
  .then(response => response.json())
  .then(artworks => {
    artworks.data.forEach(artwork => {
      let newArtwork= new Artwork(artwork, artwork.attributes)
      document.querySelector('#artwork-container').innerHTML += newArtwork.renderArtworkCard()
    });
  })
}

function getArtists(){
  fetch(artistsURL)
  .then(response => response.json())
  .then(artists => {
    artists.data.forEach(artist => {
      let newArtist= new Artist(artist, artist.attributes)})

      const artistArray= Artist.all

      artistArray.forEach(element => {
      const artistCard= `
      <div class="accordion" id="accordion">
      <div class="col-md-4">
      <div class="card mb-4 shadow-sm">
          <div id= "${element.id}">
          <h5 class="card-title">${element.name}</h5>
          <div class="card-body">

            <h2 class="mb-0">
              <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapse1${element.id}" aria-expanded="true" aria-controls="collapseOne">
                Add Artwork
              </button>
            </h2>
            <div id="collapse1${element.id}" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
              <div class="card-body">
                <form id="create-artwork-form" data-id= "${element.id}" style="">
                <h2>Add an Artwork</h2>
                <label for="name">Title:</label>
                <input id="input-title" type="text" name="title" value="" class="input-text">
                <br><br>
                <label for="name">Year:</label>
                <input id="input-year" type="text" name="year" value="" class="input-text">
                <br><br>
                <label for="name">Image URL:</label>
                <input id="input-image-url" type="text" name="image_url" value="" class="input-text">
                <br><br>
                <label for="description">Description:</label>
                <textarea id="input-description" name="description:" value=""></textarea>
                <br><br>
                <input id="create-artwork-button" type="submit" name="submit" value="Add Artwork" class="submit">
                </form>
                </div>
            </div>


              <h2 class="mb-0">
                <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapse${element.id}" aria-expanded="true" aria-controls="collapseOne">
                  Biography
                </button>
              </h2>
              <div id="collapse${element.id}" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                <div class="card-body">
                  ${element.biography}</div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
            </div>
          </div>
        </div>
      </div>`


    const main= document.querySelector('#artist-container')
    const divElement = document.createElement('div');
    divElement.innerHTML += artistCard;
    main.appendChild(divElement)
    divElement.addEventListener("submit", function(e){
      const id = e.target.dataset.id;
      const artist = Artist.findById(id);
      createArtworkFormHandler(e, artist)})
    });
  });
}

function createArtworkFormHandler(e, artist){
  console.log(e, artist)
  e.preventDefault();
  const artistId= artist.id
  const artworkTitle= document.querySelector("#input-title").value
  const artworkYear= document.querySelector("#input-year").value
  const artworkImage= document.querySelector("#input-image-url").value
  const artworkDescription= document.querySelector("#input-description").value
  postArtworkFetch(artistId, artworkTitle, artworkYear, artworkImage, artworkDescription)
}

function postArtworkFetch(artist_id, title, year, image_url, description){
  const bodyData= {artist_id, title, year, image_url, description}
  debugger
  fetch(artworksURL, {
     method: "POST",
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify(bodyData)
   })
   .then(response => response.json())
   .then(artwork => {console.log(artwork);

     const artworkDisplay= `

      <h3>New Artwork Added!</h3>
      `

   document.querySelector('#show-created-artwork').innerHTML += artworkDisplay
  })
}

//New Artist Form

function showArtistForm() {

    const newForm = `
    <form id="create-artist-form" style="">
    <h2>Add an Artist</h2>
    <label for="name">Name:</label>
    <input id="input-name" type="text" name="name" value="" class="input-text">
    <br><br>
    <label for="biography">Biography:</label>
    <textarea id="input-biography" name="Biography:" value=""></textarea>
    <br><br>
    <input id="create-button" type="submit" name="submit" value="Add Artist" class="submit">
    </form>`

    document.getElementById("new-artist-form-container").innerHTML += newForm
  }

//New Artist Create

const create= document.querySelector("#create-button")
createArtistForm.addEventListener("submit", (e) => createFormHandler(e))

function createFormHandler(e){
  e.preventDefault();
  const artistName= document.querySelector("#input-name").value
  const artistBio= document.querySelector("#input-biography").value
  postFetch(artistName, artistBio)
}

function postFetch(name, biography) {
  const bodyData= {name, biography}
  fetch(artistsURL, {
     method: "POST",
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify(bodyData)
   })
   .then(response => response.json())
   .then(artist => {console.log(artist);

     const artistDisplay= `
     <br>
      <h3>New Artist Added!</h3>
      <div data-id=${artist.Id}>
      <p>${artist.name}</p>
      <p>${artist.biography}</p>
      </div>`

   document.querySelector('#show-created-artist').innerHTML += artistDisplay
  })
}

//Like an Artwork

artworkContainer.addEventListener("click", (e) =>{
      const id = e.target.dataset.id;
      const artwork = Artwork.findById(id);
      likes(e, artwork)
})

  function likes(e, artwork){
    e.preventDefault()
    let updateLikes = parseInt(artwork.likes + 1)

    fetch(`http://localhost:3000/api/v1/artworks/${artwork.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"

      },
      body: JSON.stringify({
        likes: updateLikes,

      })
    })
    .then(res => res.json())
    .then(
      document.getElementById(artwork.id).querySelector("#Likes").innerHTML= `Likes: ${updateLikes}`
    )
  }

//Get Artworks, Display Three Random, Give Users Ability to Like and See Description

function getArtworkData() {
    fetch(artworksURL)
    .then(response => response.json())
    .then(artworks => {
      artworks.data.forEach(artwork => {
        let newArtwork= new Artwork(artwork, artwork.attributes)})

          const array= Artwork.all

          const subarray= _.sample(array, 3)
          console.log(subarray)
          subarray.forEach(element => {

          const artCard= `
          <div class="accordion" id="accordion">
          <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
              <div id= "${element.id}">
              <img src="${element.image_url}" class="card-img-top" alt="...">
              <h5 class="card-title">${element.title}</h5>
              <div class="card-body">
                <p class="card-text">
                  ${element.artist.name}<br>
                  ${element.year}<br></p>
                  <div id="Likes">Likes: ${element.likes}</div>
                  <button id="like-button" class="btn btn-link" data-id=${element.id}>♡</button>

                  <h2 class="mb-0">
                    <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapse${element.id}" aria-expanded="true" aria-controls="collapseOne">
                      Learn More
                    </button>
                  </h2>

                  <div id="collapse${element.id}" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                    <div class="card-body">
                      ${element.description}</div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center">
                </div>
              </div>
            </div>
          </div>`

          const main= document.querySelector('#landing-display')
          const divElement = document.createElement('div');
          divElement.innerHTML += artCard;
          main.appendChild(divElement)
          divElement.addEventListener("click", function(e){

            const id = e.target.dataset.id;
            const artwork = Artwork.findById(id);
            likes(e, artwork)});
      });
    })
  }

  //Homepage

  getArtworkData()
