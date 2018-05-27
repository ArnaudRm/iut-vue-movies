<template>
    <v-flex xs12 sm8>
        <h1>{{renderTitle}}</h1>
        <v-form @submit.prevent="handleSubmit" ref="form">
            <v-text-field
                    name="title"
                    label="Titre"
                    v-model="movie.title"
                    :rules="titleRules"
                    required
            ></v-text-field>
            <v-select
                    name="genre"
                    label="Genre"
                    :items="genres"
                    v-model="movie.genre"
                    item-value="text"
            ></v-select>
            <v-text-field
                    name="director"
                    label="Réalisateur"
                    v-model="movie.director"
                    required
            ></v-text-field>
            <v-text-field
                    name="directorYear"
                    label="Année naissance réalisateur"
                    v-model="movie.directorYear"
                    required
                    type="number"
            ></v-text-field>
            <v-select
                    name="directorCountry"
                    label="Pays réalisateur"
                    :items="countries"
                    v-model="movie.directorCountry"
                    item-value="text"
            ></v-select>
            <v-flex>
                <label for="datepicker">Date de sortie</label>
            </v-flex>
            <v-date-picker
                    id="datepicker"
                    v-model="movie.date"
            ></v-date-picker>

            <v-text-field
                    name="synopsis"
                    label="Synopsis"
                    v-model="movie.synopsis"
                    required
                    :key="previousMovie.synopsis"
                    :rules="synopsisRules"
                    :counter="500"
                    multi-line
            ></v-text-field>
            <v-layout column>
                <label for="file">Affiche du film</label>
                <v-flex xs12 sm6>
                    <img :src="imageSrc" style="max-height: 400px">
                </v-flex>
                <v-flex xs12>
                    <v-layout column align-center>
                        {{inputFileContent}}
                        <v-btn raised color="primary">
                            <v-icon right dark>attachment</v-icon>
                            <span class="button-label">
                                Séléctionner un fichier
                            </span>
                            <input
                                    class="input-file"
                                    id="file"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    v-on:change="uploadImage"
                                    :rules="imageRules"
                            />
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
            <label for="rate">Note</label>
                <star-rating
                        :key="previousMovie.rate"
                        :defaultValue="previousMovie.rate"
                        v-model="movie.rate"
                        id="rate"
                            name="rate"
                ></star-rating>
            <v-btn
                    raised
                    color="info"
                    type="submit"
            >
                {{submitBtnText}}
            </v-btn>
        </v-form>
    </v-flex>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    const defaultImage = require('../../static/placeholder.png');
    const redirectTo = (router, name, params) => {
        router.push({
            name,
            params,
        })
    };

    const formRules = {
        titleRules: [
            v => !!v || 'Titre obligatoire',
            v => (v && v.length >= 2) || 'Le titre doit faire au moins 2 caractères',
        ],
        synopsisRules: [
            v => !!v || 'Synopsis obligatoire',
            v => (v && v.length >= 10) || 'Le synopsis doit faire au moins 10 caractères',
            v => (v && v.length <= 500) || 'Le synopsis fait 500 caractères maximum',
        ],
        imageRules: [
            v => !!v || 'Image obligatoire',
        ],
    };

    const genres = {
        genres: [
            {text: 'Action'},
            {text: 'Science-fiction'},
            {text: 'Horreur'},
            {text: 'Guerre'},
            {text: 'Thriller'},
            {text: 'Amour'},
        ],
    };

    const countries = {
        countries: [
            {text: 'France'},
            {text: 'Angleterre'},
            {text: 'US'},
        ],
    };

    export default {
        props: ['isEditForm'],
        data: () => ({
            inputFileContent: '',
            imageUploaded: false,
            previousMovie: {},
            movie: {},
            imageSrc: null,
            movieImageName: '',
            ...formRules,
            ...countries,
            ...genres,
        }),

        methods: {

            ...mapActions([
                'getMovie',
                'editMovie',
                'addMovie',
            ]),
            uploadImage(e) {
                const {files} = e.target;
                if (files.length === 0) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imageSrc = e.target.result;
                    this.imageUploaded = true;
                    this.inputFileContent = `Fichier choisi : ${files[0].name}`;
                };
                reader.readAsDataURL(files[0]);
            },
            handleSubmit(e) {
                if (this.$refs.form.validate()) {
                    const movie = new FormData(e.target);
                    movie.append('genre', this.movie.genre);
                    movie.append('date', this.movie.date);
                    movie.append('directorCountry', this.movie.directorCountry);
                    if (this.isEditForm) {
                        movie.append('id', this.movie.id);
                        if (!this.imageUploaded) {
                            movie.append('image', this.previousMovie.image);
                        }
                        this.editMovie(movie).then(() => {
                            redirectTo(this.$router, 'Movies',{snackbar:true, snackbarText: 'Film modifié'});
                        });
                    } else {
                        this.addMovie(movie);
                        redirectTo(this.$router, 'Movies',{snackbar:true, snackbarText: 'Film ajouté'});
                    }
                    this.$refs.form.reset();
                }
            },
            fillFormFields() {
                for (const [index, data] of Object.entries(this.movie)) {
                    this.movie[index] = data;
                }
            },
            initForm(){
                if(this.getMovieById(this.$route.params.id) === undefined){
                    fetch("/api/movie?id=" + this.$route.params.id).then(res => res.json())
                        .then(obj => {
                            console.log('OBJ',obj);
                            this.previousMovie = obj;
                            this.imageSrc = require(`../../static/uploads/${this.previousMovie.image}`);
                            this.movie = Object.assign({}, this.previousMovie );
                        })
                        .catch(err => {
                            console.warning("fail api : ", err)
                        })
                }else {
                    this.previousMovie = this.getMovieById(this.$route.params.id);
                    this.imageSrc = require(`../../static/uploads/${this.previousMovie.image}`)
                    this.movie = Object.assign({}, this.previousMovie );
                }
                this.fillFormFields();
            }
        },
        computed: {
            ...mapGetters([
                'getMovieById'
            ]),
            renderTitle() {
                    return this.isEditForm ? `Éditer le film : ${this.previousMovie.title}` : 'Ajouter un film';
            },
            submitBtnText() {
                return this.isEditForm ? 'Modifier' : 'Ajouter';
            }
        },
        mounted() {
            console.log('mounted')
            if (this.isEditForm) {
                console.log('editform')
                this.initForm();
            } else {
                this.imageSrc = defaultImage;
            }
        },

        // Because Vue doesn't re-render component on route change between edit and new movie
        beforeRouteLeave(to, from, next) {
            this.$refs.form.reset();
            this.imageSrc = defaultImage;
            this.previousMovie = {};
            next();
        },
    };

</script>

<style>
    .input-file {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        padding: 14px 0;
        cursor: pointer;
    }

    .button-label {
        margin-left: 16px;
    }
</style>
