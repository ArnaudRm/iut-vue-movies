<template>
  <div class="star-rating">
      <label
        class="star-rating__star" v-for="rating in ratings"
        :class="{'is-selected': ((value >= rating) && value != null), 'is-hover': ((value_t >= rating) && value_t != null), 'is-disabled': disabled}"
        v-on:click="set(rating)"
        v-on:mouseover="star_over(rating)"
        v-on:mouseout="star_out"
      >
        <input
          class="star-rating star-rating__checkbox"
          type="radio"
          :value="rating"
          :name="name"
          v-model="value"
          :disabled="disabled"
        >
        ★
      </label>
    </div>
</template>


<script>

export default {

  props: {
    name: String,
    id: String,
    disabled: Boolean,
    required: Boolean,
    defaultValue: null,
  },
  data() {
    return {
      temp_value: null,
      value: this.defaultValue,
      value_t: null,
      ratings: [1, 2, 3, 4, 5],
    };
  },
  methods: {

    star_over(index) {
      if (!this.disabled) {
        this.temp_value = this.value_t;
        this.value_t = index;
      }
    },
    star_out() {
      if (!this.disabled) {
        this.value_t = this.temp_value;
      }
    },
    set(value) {
      if (!this.disabled) {
        this.temp_value = value;
        this.value = value;
      }
    },
  },
    watch: {
        value(val) {
            this.$emit('input', val);
        }
    },

  created() {
    if (this.defaultValue !== undefined) {
      this.value = this.defaultValue;
    }
  },
};

</script>

<style scoped>
  /* Generals */
  pre {
    background: #eee;
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 3px;
  }

  .star-rating__checkbox {
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
  }

  .star-rating__star {
    display: inline-block;
    padding: 10px;
    vertical-align: middle;
    line-height: 1;
    font-size: 2em;
    color: #ABABAB;
    transition: color .3s ease-out;
  }

  .star-rating__star:hover {
    cursor: pointer;
  }

  .star-rating__star.is-selected,
  .star-rating__star.is-hover {
    color: #FFD700;
  }

  .star-rating__star.is-disabled:hover {
    cursor: default;
  }
</style>
