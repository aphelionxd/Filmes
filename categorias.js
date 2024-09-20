const API_KEY = 'e1ffe579c28e70c958ddb9caf25bfe78'; // Sua chave de API
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const MOVIES_PER_PAGE = 20; // Número de filmes por página
let currentPage = 1;
let totalPages = 1;

// Função para buscar filmes com filtros
async function fetchMovies(page, genre, year, rating) {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc&page=${page}`;
    
    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&primary_release_year=${year}`;
    if (rating) url += `&certification_country=BR&certification=${rating}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        const data = await response.json();
        totalPages = data.total_pages;
        return data.results;
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        return [];
    }
}

// Função para exibir filmes
function displayMovies(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = ''; // Limpa a lista de filmes

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie');
        const moviePoster = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'placeholder.jpg';
        movieItem.innerHTML = `
            <img src="${moviePoster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Avaliação: ${movie.vote_average}</p>
            <button onclick="goToDetails(${movie.id})">Mais Detalhes</button>
        `;
        movieList.appendChild(movieItem);
    });
}

// Função para redirecionar para a página de detalhes
function goToDetails(movieId) {
    window.location.href = `detalhes.html?id=${movieId}`;
}

// Função para configurar a paginação
function setupPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Limpa a paginação

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.innerText = i;
        pageBtn.classList.add('page-btn');
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            loadMovies();
            setupPagination();
        });
        pagination.appendChild(pageBtn);
    }
}

// Função para carregar filmes
async function loadMovies() {
    const genre = document.getElementById('genre').value;
    const year = document.getElementById('year').value;
    const rating = document.getElementById('rating').value;
    const movies = await fetchMovies(currentPage, genre, year, rating);
    displayMovies(movies);
    setupPagination();
}

// Adiciona evento ao botão de filtros
document.getElementById('applyFilters').addEventListener('click', () => {
    currentPage = 1; // Reinicia para a primeira página ao aplicar filtros
    loadMovies();
});

// Inicializa a lista de filmes na primeira carga
loadMovies();
