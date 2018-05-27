<template>
    <v-container justify-start>
        <h1>{{ movie.title }}</h1>
        <v-layout row wrap>
            <div>
                <div>
                    <img
                            class="movie-poster"
                            :src="imageSrc"
                    />
                </div>
                <div class="mt-3 mb-3">
                    <p class="subheading mb-0 ml-2">Votre note</p>
                    <star-rating
                            :key="movie.rate"
                            :defaultValue="movie.rate"
                            v-model="movie.rate"
                            disabled
                            id="rate"
                            name="rate"
                            ref="rate"
                    ></star-rating>
                </div>
                <router-link :to="{path: `/movie/${movie.id}/edit`}" tag="span">
                    <v-btn color="primary">
                        Modifier
                    </v-btn>
                </router-link>
                <router-link :to="{path: `/movie/${movie.id}/edit`}" tag="span">
                    <v-btn color="error" @click.stop="dialog = true">
                        Supprimer
                    </v-btn>
                </router-link>
            </div>

            <v-layout column class="ml-3">
                <div>
                    <span class="grey--text subheading">Date de sortie</span> <span>{{movie.date}}</span><br>
                    <span class="grey--text subheading">Réalisé par</span> <span>{{movie.director}}</span> <span
                        class="caption grey--text">({{movie.directorCountry}}, Né en {{movie.directorYear}})</span><br>
                    <span class="grey--text subheading">Genre</span> <span>{{movie.genre}}</span><br>
                </div>
                <div class="movie-synopsis">
                    <h3 class="headline mb-2">Synopsis</h3>
                    <p>
                        {{movie.synopsis}}
                    </p>
                </div>
            </v-layout>
        </v-layout>
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <div>
                        <h4>Suppression du film {{movie.title}}</h4>
                        <p style="margin-top:16px">Etes-vous sur de vouloir supprimer le film ? </p>
                    </div>
                </v-card-title>
                <v-card-actions>
                    <v-btn color="error" @click="remove">Supprimer</v-btn>
                    <v-btn @click.stop="dialog=false">Annuler</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    const redirectTo = (router, name, params) => {
        router.push({
            name,
            params,
        })
    };

    export default {
        data() {
            return {
                movieId: this.$route.params.id,
                imageSrc: '',
                movie: {
                    director: {}
                },
                dialog: false,
            };
        },
        methods: {
            ...mapActions([
                'getMovie',
                'deleteMovie',
            ]),
            remove() {
                this.deleteMovie(this.movie);
                redirectTo(this.$router, 'Movies',{snackbar:true, snackbarText: 'Film supprimé'});
            }
        },
        computed: {
            ...mapGetters([
                'getMovieById',
            ]),
        },
        mounted() {
            this.movieId = this.$route.params.id;
            const movieFromStore = this.getMovieById(this.movieId);
            if (movieFromStore) {
                this.movie = movieFromStore;
                this.imageSrc = require(`../../static/uploads/${this.movie.image}`);
            } else {
                this.getMovie(this.movieId)
                    .then((movie) => {
                        this.movie = movie;
                        this.imageSrc = require(`../../static/uploads/${this.movie.image}`);
                    });
            }
        }
    };
</script>

<style>
    .movie-poster {
        max-height: 300px;
        max-width: 350px;
        margin: 0 8px;
    }

    .movie-synopsis {
        margin-top: 32px;
        max-width: 400px;
    }

</style>
