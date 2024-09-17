const API_KEY = 'e1ffe579c28e70c958ddb9caf25bfe78';  // Sua chave de API
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const TRAILER_URL = 'https://www.youtube.com/watch?v=';

// Obtém o ID do filme da URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

async function getMovieDetails(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR&append_to_response=videos`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }
        const movie = await response.json();
        displayMovieDetails(movie);
    } catch (error) {
        console.error('Erro ao buscar os detalhes do filme:', error);
    }
}

function displayMovieDetails(movie) {
    const movieDetails = document.getElementById('movieDetails');

    // Procura pelo vídeo que seja um trailer
    const trailer = movie.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    const trailerEmbed = trailer ? `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : '<p>Trailer não disponível.</p>';

    const moviePoster = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'placeholder.jpg';

    movieDetails.innerHTML = `
        <h1>${movie.title}</h1>
        <img src="${moviePoster}" alt="${movie.title}">
        <p><strong>Sinopse:</strong> ${movie.overview}</p>
        <p><strong>Data de lançamento:</strong> ${movie.release_date}</p>
        <p><strong>Classificação:</strong> ${movie.vote_average}</p>
        <div class="trailer-container">
            <h3>Trailer:</h3>
            ${trailerEmbed}
        </div>
    `;
}

// Chama a função para buscar detalhes do filme
getMovieDetails(movieId);
