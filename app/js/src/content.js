
/*
==================================================================
    SHOW MAIN CONTENT RESULTS
==================================================================
*/

function showContentResults(results) {

    // RETURN IF NO DATA PRESENT
    if (!results.length) return;

    // RESET CONTENT
    resetMediaResults();
    resetMyLists();

    // MAP OVER DATA
    results.map(result => {

        // EXTRACT RESULTS
        const tmdbId = result.id;
        const title = result.title || result.name || 'Unknown';
        const rating = result.vote_average || '0';
        const genreIds = result.genre_ids || [];
        let poster = `${POSTER}${result.poster_path}`;
        let mediaType;
        let genreNames = '';
        
        // IF POSTER FAILS
        if (result.poster_path == null) poster = DEFAULT_POSTER;

        // GET MEDIA TYPE
        if (result.hasOwnProperty('adult')) {genreType = state.movieGenres; mediaType = 'movie';}
        else {genreType = state.tvGenres; mediaType = 'tv';} 

         // GET GENRES 
         genreIds.forEach(genre => {
            genreType.forEach(id => {
                if (genre == id[0]) {
                    genreNames += `${id[1]} / `;
                }
            });
        });

        // REMOVE TRAILING SLASH
        genreNames = genreNames.replace(/\s\/\s$/gim, '');


        // CHECK IF IN COLLECTION
        let isInCollectionColor = '#222';
        let isInCollection = checkIfInCollection(tmdbId);
        if (isInCollection) isInCollectionColor = 'crimson';

        // CREATE HTML TO RETURN
        mainContent.innerHTML += `
            <div class="media-item" onclick="fetchMediaData('${mediaType}',${tmdbId})">
                <i class="material-icons is-in-collection" style="color: ${isInCollectionColor}" data-tmdbid="${tmdbId}">collections</i>
                <img class="media-poster" src="${poster}" alt="${title}">
                <span class="more-information">More Information</span>
                <div><span class="title">${title}</span><span class="rating">${rating}</span></div>
                <div><p class="genres">${genreNames}</p></div>
            </div>
        `;
    });

    // HOVER ANIMATION
    onMediaHover();
};



/*
==================================================================
    SHOW FULL MEDIA CONTENT 
==================================================================
*/

function showFullMediaContent(result) {

    // EXTRACT RESULTS & SET BACKUP IF FAILURE
    const tmdbId = result.id || '0';
    const title = result.title || result.name || 'Unknown';
    const tagline = result.tagline || `NO. SEASONS: ${result.number_of_seasons}  ~  NO. EPISODES: ${result.number_of_episodes}` || '';
    const overview = result.overview || '';
    const rating = result.vote_average || '0';
    let date = result.release_date || result.first_air_date || '';
    let status = result.status || '';
    let backdrop = `${BACKDROP}${result.backdrop_path}`;
    let poster = `${POSTER}${result.poster_path}`;
    let trailer = []; 

    // CHANGE DATE TO EUROPEAN FORMAT 
    // IF ARTWORK FAILS, SET THE DEFAULT ARTWORK
    if (date) date = date.split('-').reverse().join('-');
    if (result.backdrop_path == null) backdrop = DEFAULT_BACKDROP;
    if (result.poster_path == null) poster = DEFAULT_POSTER;

    // GET TRAILER & GET FOR UNDEFINED
    // RETURN NEW ARRAY AND FILTER BASED ON VIDEO TYPE
    if (result.videos.results.length != 0) {
        trailer = result.videos.results.map(video => {
            if (video.type == 'Trailer') {
                return `https://www.youtube.com/watch?v=${video.key}`;
            }
        }).filter(video => {
            if (video != 'undefined') {
                return video;
            }
        });
    } 
    
    // IF NO TRAILERS EXIST - REDIRECT TO YOUTUBE WITH QUERY
    else {
        trailer[0] = `https://www.youtube.com/results?search_query=${title}`;
    }

    // CREATE HTML TO RETURN
    fullMediaContent.innerHTML = `
        <p class="content-title">MEDIA DETAILS
            <i class="material-icons close-media-content" onclick="resetFullMediaContent(); checkIfCollectionChanged(${tmdbId})">close</i>
        </p>

        <!-- MEDIA BACKDROP -->
        <div id="media-showcase" style="background-image: url('${backdrop}')">
            <a class="download-fanart" href="${backdrop}"target="_blank">DOWNLOAD FANART<br />
                <i class="material-icons download-icon">cloud_download</i>
            </a>
            <h1 id="media-title">${title}</h1>
        </div>

        <!-- MEDIA DETAILS -->
        <div id="media-details">
            <img width="140" id="media-poster" src="${poster}" alt="${title}">
            <div id="media-details-bar">
                <a href="${trailer[0]}" target=_blank">Trailer</a>
                <span>${rating}</span><span>${status}</span><span>${date}</span>
                <span class="from-collection" onclick="updateList(${tmdbId},'#from-full-media-collection')">Add/Remove from Collection</span>

                <!-- ADD REMOVE ITEM FROM COLLECTION -->
                <div id="from-full-media-collection"></div>
            </div>
            <p id="media-tagline">${tagline}</p>
            <p id="media-overview">${overview}</p>
        </div>
    `;
    fullMediaContent.style.display = 'block';

    // PASS CONTENT TO STATE FOR ADDING TO A LIST
    state.media = result;

    // ANIMATION ON RENDER
    fadeIn('#full-media-content');
};



 

function showSearchResults(results) {

    
    if (!results.length) return;
    
    
    for (let i = 0; i < 6; i++) {
 
        if (results[i].media_type == 'movie' || results[i].media_type == 'tv') {

            
            let mediaType = results[i].media_type || 'movie';
            let title = results[i].title || results[i].name;
            let date = results[i].release_date || results[i].first_air_date || '';
 
            if (date)  date = date.slice(0,4);
 
            searchResults.innerHTML += `
                <p onclick="fetchMediaData('${mediaType}',${results[i].id});resetSearchResults();resetSearchInputValue()">
                    ${title} (${date})
                </p>
            `;
        };
    };
};

 
function showMyLists() {

     
    resetUserLists();
    myLists.style.display = 'block';

    
    if (Object.keys(state.mylists).length !== 0) {

         let i = 1;
 
         for(let lists in state.mylists) {

            
            let list = state.mylists[lists];

            
            let userList = `
            <div class="userlist"  id="list-${lists}-${i}">
                <div class="list-titlebar">
                    <h2>${lists}</h2>
                    <p class="delete-list" onclick="deleteList('${lists}', '#list-${lists}-${i}')">
                        Delete List
                        <i class="material-icons delete-list-icon">delete</i>
                    </p>
                </div>
            `;

          
            for (let i = 0; i < list.length; i++) {

                 
                const tmdbId = list[i].id;
                const title = list[i].title || list[i].name || 'Unknown';
                const rating = list[i].vote_average || '0';
                let date = list[i].release_date || list[i].first_air_date || '';
                let mediaType;

                 
                if (date)  date = date.slice(0,4);

                 
                if (list[i].hasOwnProperty('adult')) mediaType = 'movie';
                else  mediaType = 'tv'; 

               
                userList += `
                    <div class="list-item" id="list-item-${lists}-${i}">
                        <div onclick="deleteItemFromList('${lists}','${tmdbId}','#list-item-${lists}-${i}', true)">
                            <i class="list-item-delete material-icons delete-list-icon">delete</i>
                        </div>
                        <div class="list-item-rating">${rating}</div>
                        <div class="list-item-title" onclick="fetchMediaData('${mediaType}',${tmdbId})">
                            <span class="list-title">${title}</span>  (${date})
                        </div>
                    </div>
                `;
            } ;
            userList += `</div>`;
            userLists.innerHTML += userList;
            i++; 
        };
    }
    else {

         
        showNoListsText();
    }
};


 

function showNoListsText() {
    userLists.innerHTML = `
        <p class="list-heading">
            You don't have any created lists<br />
            <span class="show-sample-lists" onclick="sampleLists()">Click here</span> 
            for sample lists
        </p>
    `;
};

 
function sampleLists() {
    localStorage.setItem('movielist:userlists', sampleData);
    parseLocalStorageLists();
    showMyLists();
    fadeIn('#user-lists');
};



 
function pagination(primary, secondary, totalPages, page) {
    resetPagination();

  
    let totalBoxes = 5;
    let start;
    let end;

    
    if (totalPages <= totalBoxes) {
        start = 1;
        end = totalPages;
    } 
    else {
         
        if (page <= 3) {
            start = 1;
            end = 5
        }
         
        else if (page > 3 && page < (totalPages - 2)) {
            start = page - 2;
            end = page + 2;
        }
        
        else {
            start = totalPages - 4;
            end = totalPages;
        };
    };

    
    mainPagination.innerHTML += `
        <span class="pagination-box" onclick="fetchTMDbData('${primary}','${secondary}',${1})">first</span>
    `;

    
    let i = 0;

     
    while ((start + i) <= end) {
        mainPagination.innerHTML += `
            <span class="pagination-box" onclick="fetchTMDbData('${primary}','${secondary}',${start + i})">${start + i}</span>
        `;
        i++;
    };
 
    mainPagination.innerHTML += `
        <span class="pagination-box" onclick="fetchTMDbData('${primary}','${secondary}',${totalPages})">last</span>
    `;

    
    const paginationBox = document.querySelectorAll('.pagination-box');
    for (let i in paginationBox) {
        if (page == paginationBox[i].innerText) {
            paginationBox[i].style.backgroundColor = '#333';
        };
    };
};



 
function checkIfCollectionChanged(tmdbId) {
    const icons = document.querySelectorAll('.is-in-collection');
    icons.forEach(icon => {
        const dataTmdbId = parseInt(icon.dataset.tmdbid) || 0;

        if (dataTmdbId == tmdbId) {
            const isInCollection = checkIfInCollection(tmdbId);
            if (isInCollection) icon.style.color = 'crimson';
            else icon.style.color = '#222';
        }
    });
};











