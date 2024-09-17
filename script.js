const API_KEY = 'e1ffe579c28e70c958ddb9caf25bfe78';  // Sua chave de API
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Função para buscar filmes
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Evita o reload da página
    const query = document.getElementById('searchInput').value;
    searchMovies(query);  // Aqui chamamos a função searchMovies
});

// Função searchMovies para buscar filmes na API TMDB
async function searchMovies(query) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            displayMovies(data.results);  // Chama a função que exibe os filmes
        } else {
            displayErrorMessage("Nenhum filme encontrado.");
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        displayErrorMessage("Ocorreu um erro ao buscar os filmes.");
    }
}
// Função para associar ícones de classificação indicativa
function getClassificationIcon(certification) {
    switch(certification) {
        case 'L':
            return './assets/l.png';
        case '10':
            return './assets/10.svg';
        case '12':
            return './assets/12.png';
        case '14':
            return './assets/14.png';
        case '16':
            return './assets/16.png';
        case '18':
            return './assets/18.png';
        default:
            return './assets/interrogação.png'; // Caso não tenha classificação disponível
    }
}

// Descrição da classificação
function getClassificationDescription(certification) {
    switch(certification) {
        case 'L':
            return 'Livre para todos os públicos';
        case '10':
            return 'Não recomendado para menores de 10 anos';
        case '12':
            return 'Não recomendado para menores de 12 anos';
        case '14':
            return 'Não recomendado para menores de 14 anos';
        case '16':
            return 'Não recomendado para menores de 16 anos';
        case '18':
            return 'Não recomendado para menores de 18 anos';
        default:
            return 'Classificação indicativa não disponível';
    }
}

// Função para buscar a classificação indicativa de um filme
async function fetchCertification(movieId) {
    const url = `${BASE_URL}/movie/${movieId}/release_dates?api_key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }
        const data = await response.json();
        const certification = data.results.find(country => country.iso_3166_1 === 'BR')?.release_dates[0]?.certification || 'N/A';
        return certification;
    } catch (error) {
        console.error('Erro ao buscar classificação indicativa:', error);
        return 'N/A';
    }
}

// Função para buscar detalhes do filme, incluindo gêneros
async function fetchMovieDetails(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }
        const movie = await response.json();
        return movie;
    } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
    }
}

// Exibir os filmes na página
async function displayMovies(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = '';  // Limpa a lista de filmes

    for (const movie of movies) {
        // Buscar detalhes do filme e classificação indicativa
        const movieDetails = await fetchMovieDetails(movie.id);
        const certification = await fetchCertification(movie.id);

        // Pegar o primeiro gênero
        const genre = movieDetails.genres.length ? movieDetails.genres[0].name : 'Gênero desconhecido';

        // Ícone e descrição da classificação
        const ratingIcon = getClassificationIcon(certification);
        const ratingDescription = getClassificationDescription(certification);

        const movieItem = document.createElement('div');
        movieItem.classList.add('movie');
        
        const moviePoster = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'placeholder.jpg';  // Imagem placeholder caso não tenha poster
        
        movieItem.innerHTML = `
            <img src="${moviePoster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Gênero: ${genre}</p>
            <div class="classification">
                <img src="${ratingIcon}" alt="Classificação ${certification}">
                <p>${ratingDescription}</p>
            </div>
            <button onclick="goToDetails(${movie.id})">Mais Detalhes</button>
        `;
        movieList.appendChild(movieItem);
    }
}

function displayErrorMessage(message) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = `<p>${message}</p>`;
}

function goToDetails(movieId) {
    // Redireciona para a página de detalhes, passando o ID do filme como parâmetro na URL
    window.location.href = `detalhes.html?id=${movieId}`;
}