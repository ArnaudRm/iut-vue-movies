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
            <div class="movies">
                <movie-item
                        v-for="(movie, index) in search_movies"
                        v-bind:key="movie.id"
                        :key="index"
                        v-bind:movie="movie"
                />
            </div>
        </v-flex>
        <v-snackbar
                :timeout="timeout"
                :top="y === 'top'"
                :bottom="y === 'bottom'"
                :right="x === 'right'"
                :left="x === 'left'"
                :vertical="mode === 'vertical'"
                v-model="snackbar"
        >
            {{snabckbarText}}
            <v-btn flat color="pink" @click.native="snackbar = false">Fermer</v-btn>
        </v-snackbar>
        </v-layout>
    <div v-else>Aucun films...</div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {

        data() {
            return {
                snackbar: false,
                snabckbarText: '',
                y: 'top',
                x: null,
                mode: '',
                timeout: 6000,
                text: 'Film ajouté !'
            };
        },
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
            this.getMovies();
            const {
                snackbar,
                snackbarText,
            } = this.$route.params;
            if(snackbar){
                this.snackbar = true;
                this.snabckbarText  = snackbarText;
            }
        },
    };

</script>

<style>
    .movies {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
    }
</style>
