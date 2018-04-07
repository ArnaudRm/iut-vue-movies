import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";

Vue.use(Vuex);

const BASE_URL = 'http://localhost:3000/api/';


// root state object.
// each Vuex instance is just a single state tree.
const state = {
    movie_to_add: {},
    movie_to_edit: null,
    search: "",
    movies: [],
    generated_id: 0,
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
    deleteMovie(state, movie) {

    },
    getMovies() {
        const url = `${BASE_URL}movie`;
        axios(url, {
            method: 'GET',
        })
            .then(res => {
                state.movies = res.data;
            })
            .catch(err => {
                console.log("error :", err)
            });
    },
    remove(state, index) {
        state.movies.splice(index, 1);
    },
    edit(state, movie) {
        state.movie_to_edit = movie;
    },
    save(state) {
        state.movie_to_edit = null;
    },
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
    newMovie: ({commit}) => commit('newMovie'),
    getMovies: ({commit}) => commit('getMovies'),
    remove: ({commit}) => commit('removeMovie'),
    edit: ({commit}) => commit('editMovie'),
    save: ({commit}) => commit('saveMovie'),
};

// getters are functions
const getters = {
    search_movies: state => state.movies.filter(m => m.title.toLowerCase().indexOf(state.search.toLowerCase()) != -1),
    moviesExist: state => state.movies.length !== 0,

};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});
