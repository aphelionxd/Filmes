const API_KEY = 'e1ffe579c28e70c958ddb9caf25bfe78';  // Sua chave de API
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const MOVIES_PER_PAGE = 50; // Número de filmes por página

let currentPage = 1;
const totalPages = 2; // Total de páginas (100 filmes / 50 filmes por página)

async function getTopRatedMovies(page) {
    const url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=pt-BR&page=${page}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        return { results: [], total_pages: 1 };
    }
}

function displayMovies(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = movies.map(movie => `
        <div class="movie-card">
            <a href="detalhes.html?id=${movie.id}">
                <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p><strong>Avaliação:</strong> ${movie.vote_average}</p>
                    <button>Detalhes</button>
                </div>
            </a>
        </div>
    `).join('');
}

function setupPagination() {
    const pagination = document.getElementById('pagination');
    let pages = '';
    for (let i = 1; i <= totalPages; i++) {
        pages += `<a href="#" class="page-btn" data-page="${i}">${i}</a>`;
    }
    pagination.innerHTML = pages;

    // Adiciona a classe 'active' ao botão da página atual
    document.querySelectorAll('.page-btn').forEach(button => {
        if (parseInt(button.dataset.page) === currentPage) {
            button.classList.add('active');
        }
    });
}

document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('page-btn')) {
        e.preventDefault();
        currentPage = parseInt(e.target.dataset.page);
        loadMovies();
        setupPagination(); // Atualiza a paginação após a mudança de página
    }
});

async function loadMovies() {
    const data = await getTopRatedMovies(currentPage);
    displayMovies(data.results);
}

setupPagination();
loadMovies();
