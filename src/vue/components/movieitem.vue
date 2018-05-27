<template>
    <v-scale-transition >
        <v-card
                class="flex xs12 sm6 md4 movie-card"
                raised
        >

            <v-card-media style="height: 200px" v-bind:src="getImage()">
            </v-card-media>
            <v-card-title primary-title>
                <div class="movie-title-container">
                    <h3 class="headline mb-0">{{ movie.title }}</h3>
                    <h4 class="movie-year">({{ movieYear }})</h4>
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
            </v-card-title>

            <v-card-actions>
                <router-link :to="{path: `/movie/${movie.id}`}" tag="span">
                    <v-btn color="default">
                        Détails
                    </v-btn>
                </router-link>
                <router-link :to="{path: `/movie/${movie.id}/edit`}" tag="span">
                    <v-btn color="primary">
                        Modifier
                    </v-btn>
                </router-link>
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
    </v-scale-transition>
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
            handleDetails(movieId) {
                this.$router.push({path: `/movie/${movieId}`});
            },
            getImage() {
                let src;
                if (this.movie.image) {
                    src = require(`../../static/uploads/${this.movie.image}`)
                } else {
                    src = require('../../static/placeholder.png');
                }
                return src;
            }
        },
        computed: {
            movieClass() {
                return this.$vuetify.breakpoint.smAndDown ? 'movie-card-sm' : 'movie-card';
            },
            movieYear() {
                console.log(this.movie);
                return new Date(this.movie.date).getFullYear();
            }

        },
    };
</script>

<style>

    .movie-title-container {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .movie-card {
        margin-bottom: 10px;
    }

    .movie-year {
        color: #dedede;
    }

</style>
