const API_KEY = 'e1ffe579c28e70c958ddb9caf25bfe78';  // Sua chave de API
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Evita o reload da página
    const query = document.getElementById('searchInput').value;
    searchMovies(query);
});

async function searchMovies(query) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            displayMovies(data.results);
        } else {
            displayErrorMessage("Nenhum filme encontrado.");
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        displayErrorMessage("Ocorreu um erro ao buscar os filmes.");
    }
}

function displayMovies(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = '';  // Limpa a lista de filmes
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie');
        
        const moviePoster = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'placeholder.jpg';  // Imagem placeholder caso não tenha poster
        
        movieItem.innerHTML = `
            <img src="${moviePoster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="goToDetails(${movie.id})">Mais Detalhes</button>
        `;
        movieList.appendChild(movieItem);
    });
}



function displayErrorMessage(message) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = `<p>${message}</p>`;
}

function goToDetails(movieId) {
    // Redireciona para a página de detalhes, passando o ID do filme como parâmetro na URL
    window.location.href = `detalhes.html?id=${movieId}`;
}