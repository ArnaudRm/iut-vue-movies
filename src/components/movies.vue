<template>
    <v-layout
            column
            v-if="moviesExist"
    >
        <h1>Liste des films</h1>
        <v-flex>
            <v-text-field
                    name="search"
                    label="Rechercher un film ..."
                    single-line
                    v-model="$store.state.search"
                    prepend-icon="search"
            />
        </v-flex>

        <v-flex xs12>
            <transition-group
                    name="staggered-fade"
                    tag="ul"
                    class="movies"
                    v-bind:css="false"
                    v-on:before-enter="beforeEnter"
                    v-on:enter="enter"
                    v-on:leave="leave"
            >

                <movie-item
                        v-for="(movie, index) in search_movies"
                        v-bind:key="movie.id"
                        :key="index"
                        v-bind:movie="movie"
                />
            </transition-group>
        </v-flex>
    </v-layout>
    <div v-else>Aucun films...</div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {

        computed: mapGetters([
            'search_movies',
            'moviesExist',
        ]),

        methods: {
            ...mapActions([
                'getMovies',
            ]),

            beforeEnter(el) {
                el.style.opacity = 0;
            },
            enter(el, done) {
                const delay = el.dataset.index * 150;
                setTimeout(() => {
                    Velocity(
                        el,
                        {opacity: 1},
                        {complete: done},
                    );
                }, delay);
            },
            leave(el, done) {
                const delay = el.dataset.index * 150;
                setTimeout(() => {
                    Velocity(
                        el,
                        {opacity: 0},
                        {complete: done},
                    );
                }, delay);
            },
        },
        mounted() {
            console.log('ici');
            this.$store.commit('getMovies');
        },
    };

</script>

<style>
    .movies {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>
