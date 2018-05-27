import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";

Vue.use(Vuex);

const BASE_URL = '/api/movie';


// root state object.
// each Vuex instance is just a single state tree.
const state = {
    search: "",
    movies: [],
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
    addMovie(state, movie) {
        state.movies.push(movie);
    },
    getMovies(state, movies) {
        state.movies = movies;
    },
    getMovie(state, movie) {
        state.movies.push(...movie);
    },
    deleteMovie(state, movieId) {
        const index = state.movies.findIndex(m => m.id === movieId);
        state.movies.splice(index, 1);
    },
    editMovie(state, {id, movie}) {
        const index = state.movies.findIndex(m => m.id === id);
        state.movies.splice(index, 1);
        state.movies.push(movie);
    },
    save(state) {
        state.movie_to_edit = null;
    },
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
    addMovie: ({commit}, movie) => {
        fetch(BASE_URL, {
            method: 'POST',
            body: movie,
        })
            .then(res => {
                commit('addMovie', res.data);
            })
            .catch(err => {
                console.log("error :", err)
            });
    },
    getMovies: ({commit}) => {
        axios(BASE_URL, {
            method: 'GET',
        })
            .then(res => {
                commit('getMovies', res.data);
            })
            .catch(err => {
                console.log("error :", err)
            });
    },
    getMovie: ({commit}, movieId) => {
        const url = `${BASE_URL}?id=${movieId}`;
        return new Promise((resolve, reject) => {
            axios(url, {
                method: 'GET',
            })
                .then(res => {
                    commit('getMovie', res.data);
                    resolve(res.data);  // Let the calling function know that http is done. You may send some data back
                })
                .catch(err => {
                    console.log("error :", err);
                    reject(err);
                });
        })
    },
    deleteMovie: ({commit}, movie) => {
        const url = `${BASE_URL}?id=${movie.id}`;
        axios(url, {
            method: 'DELETE',
        })
            .then(res => {
                console.log(res.data);
                commit('deleteMovie', res.data);
            })
            .catch(err => {
                console.log("error :", err)
            });
    },
    editMovie: ({commit}, movie) => {
        const id = movie.get('id');
        commit('editMovie', {id, movie});
        return new Promise((resolve, reject) =>{
            const url = `${BASE_URL}?id=${id}`;
            axios(url, {
                method: 'PUT',
                data: movie
            })
                .then(res => {
                    console.log(id);
                    console.log(res.data);
                    commit('editMovie', res.data);
                    resolve();
                })
                .catch(err => {
                    reject(err);
                    console.log("error :", err)
                });
        });

    },
};

// getters are functions
const getters = {
    search_movies: state => {
        return state.movies.filter(m => m.title.toLowerCase().indexOf(state.search.toLowerCase().trim()) != -1);
    },
    moviesExist: state => {
        return state.movies.length !== 0
    },
    getMovieById: state => movieId => {
        return state.movies.find(m => m.id === movieId)
    },
    movies: state => {
        return state.movies;
    }
};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});
