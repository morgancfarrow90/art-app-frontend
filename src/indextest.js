const artworksURL= "http://localhost:3000/api/v1/artworks"
const artistsURL= "http://localhost:3000/api/v1/artists"

//Index.html Body Sections
const landingDisplay = document.querySelector('#landing-display')
const artistContainer = document.querySelector('#artist-container')
const createArtistForm= document.querySelector("#new-artist-form-container")
const showArtist= document.querySelector("#show-created-artist")
const searchBar= document.querySelector(".search-container")
const clearSearch= document.querySelector("#clear-button")
const updateArtist= document.querySelector("#update-artist")
const updateArtwork= document.querySelector("#update-artwork")


//Event Listener Buttons
const likeButton= document.getElementById("like-button")

//Fetch Calls to DB for Index
function getArtworks() {
  fetch(artworksURL)
  .then(response => response.json())
  .then(artworks => {
    artworks.data.forEach(artwork => {
      let newArtwork= new Artwork(artwork, artwork.attributes)
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

      artistArray.forEach(element => {artistMenuCard(element)})
  });
}

//New Artwork Create

function createArtworkFormHandler(e, artist){

  console.log(e, artist)
  e.preventDefault();
  const artistId= artist.id
  const likes= "0"
  const artworkTitle= document.querySelector("#input-title"+artistId).value
  const artworkYear= document.querySelector("#input-year"+artistId).value
  const artworkImage= document.querySelector("#input-image-url"+artistId).value
  const artworkDescription= document.querySelector("#input-description"+artistId).value
  postArtworkFetch(artistId, likes, artworkTitle, artworkYear, artworkImage, artworkDescription)
}

function postArtworkFetch(artist_id, likes, title, year, image_url, description){
  const bodyData= {artist_id, likes, title, year, image_url, description}

  fetch(artworksURL, {
     method: "POST",
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify(bodyData)
   })
   .then(response => response.json())
   .then(artwork => {console.log(artwork);

     const artist= Artist.findById(`${artwork.artist_id}`)
     const artistName= artist.name

     const artworkDisplay= `
     <div data-id=${artwork.id}>
     <h3>New Artwork Added!</h3>
     <img src="${artwork.image_url}" alt="...">
     <p>Title: ${artwork.title}</p>
     <p>Year: ${artwork.year}</p>
     <p>Artist: ${artistName} </p>
     <p>Likes: ${artwork.likes}</p>
     <p>Description: ${artwork.description}</p>
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
      <h3>Artist Saved!</h3>
      <div data-id=${artist.Id}>
      <p>Name: ${artist.name}</p>
      <p>Biography: <br>${artist.biography}</p>
      </div>`

   document.querySelector('#show-created-artist').innerHTML += artistDisplay
  })
}

//Like an Artwork, Patch to DB to Update Likes

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

          <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
          <div class="accordion" id="accordion">
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
            main.innerHTML += artCard;
            main.addEventListener("click", function(e){
              const id = e.target.dataset.id;
              const artwork = Artwork.findById(id);
              likes(e, artwork)});
      });
    })
  }

//Artists Search Bar

searchBar.addEventListener("submit", function(e) {
  e.preventDefault();
  const searchEntry= document.querySelector("#search-entry").value
  console.log(searchEntry)
  filterForResults(searchEntry)
})

clearSearch.addEventListener("click", function(e) {
  e.preventDefault();
  const searchEntry= ""
  console.log(searchEntry)
  filterForResults(searchEntry)
})

function filterForResults(searchEntry){

  const array= Artist.all
  let results = []
  results= array.filter(el => el.name.toLowerCase().indexOf(searchEntry.toLowerCase()) !== -1)
  console.log(results)
  artistContainer.innerHTML = "";
  results.forEach(element => {artistMenuCard(element)})
}

//Artist Card

function artistMenuCard(element){
  let elementId= element.id

  const artistCard= `
  <div class= "col-md-12">
  <div class="card mb-1 shadow-sm" style="w-100 p-3">
  <div class="accordion" id="accordion">
      <div id= "${element.id}">
      <h5 class="card-title" id="artist-name">${element.name} </h5>
      <div class="card-body">

        <h2 class="mb-0">
          <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapse1${element.id}" aria-expanded="true" aria-controls="collapseOne">
            Add Artwork
          </button>
        </h2>

        <div id="collapse1${element.id}" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
          <div class="card-body">
            <form id="create-artwork-form" class="form${element.id}" data-id="${element.id}" style="">
            <h2>Add an Artwork</h2>
            <label for="name">Title:</label>
            <input id="input-title${element.id}" type="text" name="title" value="" class="input-text">
            <br><br>
            <label for="name">Year:</label>
            <input id="input-year${element.id}" type="text" name="year" value="" class="input-text">
            <br><br>
            <label for="name">Image URL:</label>
            <input id="input-image-url${element.id}" type="text" name="image_url" value="" class="input-text">
            <br><br>
            <label for="description">Description:</label>
            <textarea id="input-description${element.id}" name="description:" value=""></textarea>
            <br><br>
            <input id="create-artwork-button" type="submit" name="submit" value="Add Artwork" class="submit">
            </form>
            </div>
        </div>

          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapse2${element.id}" aria-expanded="true" aria-controls="collapseOne">
              Biography
            </button>
          </h2>
          <div id="collapse2${element.id}" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
            <div class="card-body">
              ${element.biography}

              <button class="btn btn-link btn-block text-left" type="button" id="editArtist${element.id}">Edit</button>

              <button class="btn btn-link btn-block text-left" type="button" id="deleteArtist${element.id}">Delete</button>
              </div>
          </div>

          <h2 class="mb-0">
            <button id= "showLink${element.id}" class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapse3${element.id}" aria-expanded="true" aria-controls="collapseOne">
              See All Artworks
            </button>
          </h2>
          <div id="collapse3${element.id}" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
            <div class="card-body">
            </div>
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
      const showLink= document.querySelector("#showLink"+elementId)
      showLink.addEventListener("click", function(e){
        artistShow(elementId)
      })
      const editArtistLink= document.querySelector("#editArtist"+elementId)
      editArtistLink.addEventListener("click", function(e){
        artistEdit(elementId)
      })
      const deleteArtistLink= document.querySelector("#deleteArtist"+elementId)
      deleteArtistLink.addEventListener("click", function(e){
        artistDelete(e, elementId)
      })

}

//Edit Artist

updateArtist.addEventListener("submit", function(e){
  const id = e.target.dataset.id;
  const artist = Artist.findById(id);
  artistEditFormHandler(e, artist)
})

function artistEdit(elementId){
  let artist= Artist.findById(elementId);
  document.querySelector("#update-artist").innerHTML = artist.renderUpdateForm()
}

function artistEditFormHandler(e, artist){
  console.log(e, artist)
  e.preventDefault()
  const artistId= artist.id
  const artistName= document.querySelector("#update-name").value
  const artistBio= document.querySelector("#update-bio").value
  updateFetch(artistName, artistBio, artistId)}

function updateFetch(name, biography, artistId) {
    const bodyData= {name, biography}

    fetch(`http://localhost:3000/api/v1/artists/${artistId}`, {
       method: "PUT",
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(bodyData)
     })
     .then(response => response.json())
     .then(artist => {console.log(artist);

       const artistDisplay= `
       <br>
        <h3>Edits Saved!</h3>
        <div data-id=${artist.Id}>
        <p>Name: ${artist.name}</p>
        <p>Biography: <br>${artist.biography}</p>
        </div>`

     document.querySelector('#show-created-artist').innerHTML += artistDisplay
    })
  }


//Delete Artist

function artistDelete(e, elementId){
  console.log(e, elementId)
  fetch(artistsURL + '/' + elementId, {method: 'DELETE'})

  const message= `<h3>Artist Deleted!</h3>`
  document.querySelector('#show-created-artist').innerHTML += message
}

//Show all artworks by Artist
function artistShow(elementId){
  let artistArtworks= []
  let allArtworks= Artwork.all

  allArtworks.map(function(artwork, id) {
  if (artwork.artist.id == elementId) {
     artistArtworks.push(artwork)}
  })

  artistArtworks.forEach(artwork=> {
    let artworkId= artwork.id
    const showCard= `

    <img src="${artwork.image_url}"<br>
    <h5 class="card-title">${artwork.title}</h5>
    <div class="card-body">
      <p class="card-text">
        ${artwork.artist.name}<br>
        Likes: ${artwork.likes}<br>
        ${artwork.year}<br>
        ${artwork.description}</p>
        </div>

        <button class="btn btn-link btn-block text-left" type="button" id="editArtwork${artwork.id}">Edit</button>

        <button class="btn btn-link btn-block text-left" type="button" id="deleteArtwork${artwork.id}">Delete</button>
        `

        const showAll= document.querySelector("#collapse3"+elementId)
        const divElement = document.createElement('div');
        divElement.innerHTML += showCard;
        showAll.appendChild(divElement)


        //document.querySelector("#collapse3"+elementId).innerHTML += showCard
        const editArtworkLink= document.querySelector("#editArtwork"+artworkId)

        editArtworkLink.addEventListener("click", function(e){
          console.log(e);
          artworkEdit(e, artworkId)
        })

        const deleteArtworkLink= document.querySelector("#deleteArtwork"+artworkId)
        deleteArtworkLink.addEventListener("click", function(e){
          artworkDelete(e, artworkId)
        })
      })
}

//Edit Artwork

function artworkEdit(e, artworkId){
  let artwork= Artwork.findById(artworkId);
  document.querySelector("#update-artwork").innerHTML = artwork.renderUpdateForm()
}

updateArtwork.addEventListener("submit", function(e){
  const id = e.target.dataset.id;
  const artwork = Artwork.findById(id);
  artworkEditFormHandler(e, artwork)
})

function artworkEditFormHandler(e, artwork){
  console.log(e, artwork)
  e.preventDefault();
  const artworkId= artwork.id
  const artworkTitle= document.querySelector("#update-title").value
  const artworkYear= document.querySelector("#update-year").value
  const artworkImage= document.querySelector("#update-image").value
  const artworkDescription= document.querySelector("#update-description").value

  patchArtwork(artworkId, artworkTitle, artworkYear, artworkImage, artworkDescription)
}

function patchArtwork(artworkId, title, year, image_url, description){
  const bodyData= {title, year, image_url, description}
  fetch(`http://localhost:3000/api/v1/artworks/${artworkId}`, {
    method: "PATCH",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(bodyData)
  })
  .then(response => response.json())
  .then(artwork => {
    console.log(artwork);

    const artist= Artist.findById(`${artwork.artist_id}`);
    const artistName= artist.name;

    const artworkDisplay= `
    <div data-id=${artwork.id}>
    <h3>Entry Saved!</h3>
    <img src="${artwork.image_url}" alt="...">
    <p>Title: ${artwork.title}</p>
    <p>Year: ${artwork.year}</p>
    <p>Artist: ${artistName} </p>
    <p>Likes: ${artwork.likes}</p>
    <p>Description: ${artwork.description}</p>`

  document.querySelector('#show-created-artist').innerHTML += artworkDisplay
 })
};

//Delete Artwork - add link, event listener for delete

function artworkDelete(e, artworkId){
    console.log(e, artworkId)
    fetch(artworksURL + '/' + artworkId, {method: 'DELETE'})

    const message= `<h3>Artwork Deleted!</h3>`
    document.querySelector('#show-created-artwork').innerHTML += message
}

  //Homepage

  getArtworkData()
  getArtists()
  showArtistForm()
