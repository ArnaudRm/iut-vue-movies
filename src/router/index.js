import Vue from 'vue';
import Router from 'vue-router';
import MovieItemComponent from '../components/movieitem';
import Movies from '../components/movies';
import NewMovie from '../components/newmovie';
import MovieDetails from '../components/MovieDetails';
import StarRating from '../components/starRating';

Vue.use(Router);
Vue.component('movie-item', MovieItemComponent);
Vue.component('new-movie', NewMovie);
Vue.component('movies', Movies);
Vue.component('star-rating', StarRating);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Movies',
            component: Movies,
        },
        {
            path: '/new',
            name: 'newMovie',
            component: NewMovie,
        },
        {
            path: '/movie/:id',
            name: 'movieDetails',
            component: MovieDetails,
        },
    ],
});
