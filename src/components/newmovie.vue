<template>
    <v-flex xs12 sm8>
        <h1>Ajouter un film</h1>

        <div v-if="submitSuccedded">
            <v-alert type="success" :value="true">
                Film ajouté à la liste
            </v-alert>
            <v-btn
                    raised
                    color="info"
                    @click="resetFlashMessage"
                    :disabled="!valid"
            >
                Ajouter un autre film
            </v-btn>
        </div>

        <v-form v-else v-model="valid" ref="form" lazy-validation>
            <v-text-field
                    label="Titre"
                    v-model="movie_to_add.title"
                    :rules="titleRules"
                    required
            ></v-text-field>
            <v-select
                    label="Genre"
                    :items="genres"
                    v-model="movie_to_add.genre"
                    item-value="text"
            ></v-select>
            <v-text-field
                label="Réalisateur"
                v-model="movie_to_add.director.name"
                required
        ></v-text-field>
            <v-text-field
                    label="Année naissance réalisateur"
                    v-model="movie_to_add.director.year"
                    :rules="yearRules"
                    required
            ></v-text-field>
            <v-text-field
                    label="Nationalité réalisateur"
                    v-model="movie_to_add.director.country"
                    required
            ></v-text-field>
            <v-text-field
                    label="Année"
                    v-model="movie_to_add.year"
                    :rules="yearRules"
                    required
            ></v-text-field>
            <v-text-field
                    type="number"
                    label="Synopsis"
                    v-model="movie_to_add.synopsis"
                    :rules="synopsisRules"
                    :counter="500"
                    required
                    multi-line
            ></v-text-field>
            <v-layout row>
                <v-flex xs12 sm6>
                    <img :src="imageSrc" style="width:100%">
                </v-flex>
                <v-flex xs12 sm6 smOffset1>
                    <input
                            name="movieImage"
                            type="file"
                            accept="image/*"
                            v-on:change="uploadImage"
                            :rules="imageRules"
                            required
                    />
                </v-flex>
            </v-layout>
            <label for="rate">Note</label>
            <star-rating
                    id="rate"
                    name="rate"
                    ref="rate"
            ></star-rating>
            <v-btn
                    raised
                    color="info"
                    @click="submit"
                    :disabled="!valid"
            >
                Ajouter
            </v-btn>
        </v-form>

    </v-flex>
</template>

<script>
    import {mapActions} from 'vuex';
    import axios from 'axios';

    export default {
        data: () => ({
            movie_to_add: {
                director:{}
            },
            image: null,
            imageSrc: 'http://www.relaymark.com/wp-content/uploads/2016/04/img2-placeholder.jpg',
            movieImageName: '',
            valid: false,
            submitSuccedded: false,
            genres: [
                {text: 'Action'},
                {text: 'Science-fiction'},
                {text: 'Horreur'},
                {text: 'Guerre'},
                {text: 'Thriller'},
                {text: 'Amour'},
            ],
            titleRules: [
                v => !!v || 'Titre obligatoire',
                v => (v && v.length >= 2) || 'Le titre doit faire au moins 2 caractères',
            ],
            yearRules: [
                v => !!v || 'Année obligatoire',
                v => /^\d{4}$/.test(v) || 'Veuillez renseigner une année valide',
            ],
            synopsisRules: [
                v => !!v || 'Synopsis obligatoire',
                v => (v && v.length >= 10) || 'Le synopsis doit faire au moins 10 caractères',
                v => (v && v.length <= 500) || 'Le synopsis fait 500 caractères maximum',
            ],
            imageRules: [
                v => !!v || 'Image obligatoire',
            ],
        }),

        methods: {
            ...mapActions([
                'newMovie',
            ]),
            uploadImage(e) {
                const files = e.target.files;
                if (files.length === 0) {
                    return;
                }

                const data = new FormData();
                const reader = new FileReader();
                data.append('movieImage', files[0]);
                reader.onload = (e) => {
                    this.imageSrc = e.target.result;
                };

                const BASE_URL = 'http://localhost:3000';

                axios.post(`${BASE_URL}/uploads`, data,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    },
                ).then((response) => {
                    console.log(response);
                    this.movieImageName = response.data.movieImageName;
                    reader.readAsDataURL(files[0]);
                }).catch((error) => {
                    console.log(error);
                });
            },
            resetFlashMessage() {
                this.submitSuccedded = false;
            },
            submit() {
                if (this.$refs.form.validate()) {
                    const movie = Object.assign({}, this.movie_to_add);
                    movie.movieImageName = this.movieImageName;
                    movie.rate = this.$refs.rate.value;
                    this.$store.commit('newMovie', movie);
                    this.$refs.form.reset();
                    this.submitSuccedded = true;
                    this.imageSrc = 'http://www.relaymark.com/wp-content/uploads/2016/04/img2-placeholder.jpg';
                }
            },
        },
    };

</script>
