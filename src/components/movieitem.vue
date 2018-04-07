<template>
    <v-card
            :class="movieClass"
            class="flex xs12 sm6 md4"
            raised
    >
        <v-card-media style="height: 200px" v-bind:src="getImage()">
        </v-card-media>
        <v-card-title primary-title>
            <div class="movie-title-container">
                <h3 class="headline mb-0">{{ movie.title }}</h3>
                <h4 class="movie-year">({{ movie.year }})</h4>
                <star-rating
                        v-bind:defaultValue="movie.rate"
                        disabled
                        id="rate"
                        name="rate"
                        ref="rate"
                ></star-rating>
            </div>
        </v-card-title>
        <v-card-actions>
            <v-btn
                    flat
                    color="info"
                    v-on:click="handleDetails(movie.id)"
            >
                Détails
            </v-btn>
            <v-btn flat color="error" v-on:click="deleteMovie">Supprimer</v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="show = !show">
                <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
            </v-btn>
        </v-card-actions>
        <v-slide-y-transition>
            <v-card-text v-show="show">
                {{ movie.synopsis }}
            </v-card-text>
        </v-slide-y-transition>

    </v-card>
</template>

<script>
    export default {
        props: {
            movie: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                show: false,
            };
        },
        methods: {
            deleteMovie() {
                this.$store.commit('deleteMovie', this.key);
            },

            handleDetails(movieId) {
                this.$router.push({ path : `/movie/${movieId}`});
            },
            getImage() {
                const src = this.movie.url || require(`../static/uploads/${movie.image}`) || require('../static/placeholder.png');
                return src;
            }
        },
        computed: {
            movieClass() {
                return this.$vuetify.breakpoint.smAndDown ? 'movie-card-sm' : 'movie-card';
            },
        },
    };
</script>

<style>

    .movie-card {
        max-width: 350px;
        margin-left: 16px;
        margin-top: 16px;
    }

    .movie-title-container {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .movie-year {
        color: #dedede;
    }

    .movie-card-sm {
        margin-top: 16px;
    }

    .synopsis {
        margin: 16px 0;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

</style>
