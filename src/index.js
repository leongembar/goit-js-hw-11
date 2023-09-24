import axios from "axios";
import Notiflix from 'notiflix';

const refs = {
    searchForm: document.querySelector('.search-form'),
    search: document.querySelector('.search'),
    submitBtn: document.querySelector('.submit'),
    container: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more'),

}

let pageN = 1;
let searchQuery = null;
const perPage = 20;
let totalHits = 0;
let dataTotal = 0;

async function submitClick(e){    
    e.preventDefault();
    refs.container.innerHTML ="";
    pageN =1;
    totalHits=0;

    const form = e.currentTarget;
    searchQuery = form.elements.searchQuery.value;

    await fetchAndRenderPhoto(searchQuery);
    hiddenBtn();

}

async function fetchAndRenderPhoto(termin){
    try {
        
        const data = await fetchPhoto(termin);
        dataTotal = data.total;      
        if(dataTotal === 0){
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return
        }
        totalHits = data.totalHits;
        renderCard(data.hits, refs.container);        
        pageN +=1;

    }
    catch(error){
        Notiflix.Notify.failure("Oops! Something went wrong! Try reloading the page!");

    }
}

async function fetchPhoto(termin){
    const searchParams = new URLSearchParams({
        key: '39640384-6498a04e948bd684624ed17d4',
        q: termin,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: pageN,
      });

    const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);
    return response.data;

}

function renderCard(array, container){
    const markupCart = array.map(({webformatURL, largeImageUR, tags, likes, views, comments, downloads }) =>
            `
            <div class="photo-card">
                <img src="${webformatURL}" width="400" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes ${likes}</b>
                    </p>
                    <p class="info-item">
                      <b>Views ${views}</b>
                    </p>
                    <p class="info-item">
                      <b>Comments ${comments}</b>
                    </p>
                    <p class="info-item">
                      <b>Downloads ${downloads}</b>
                    </p>
                </div>
            </div>
            `
    ).join("");
    container.insertAdjacentHTML("beforeend", markupCart);

}

refs.searchForm.addEventListener("submit", submitClick);


refs.loadBtn.addEventListener("click", ((e)=>{
    e.preventDefault();
    fetchAndRenderPhoto(searchQuery)
    hiddenBtn();
}));

function hiddenBtn(){
    if (pageN*perPage >= totalHits){
        refs.loadBtn.classList.add('load-more-hidden');
        if (dataTotal !== 0 ){
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        }
        
    }
    else {
        refs.loadBtn.classList.remove('load-more-hidden');
    }
}


// const isRequired = action === "add" ? "required" : "";

// refs.loader.classList.add('loader-hidden');
// refs.catCart.classList.remove('cat-hidden'); 