<template>
  <div class="provider-meta">
    <!-- <router-link
      :to="{ name: 'profile', params: { 'username': article.author.username } }">
      <img :src="article.author.image"/>
    </router-link> -->
    <div class="info">
      <!-- <router-link
        :to="{ name: 'profile', params: { 'username': article.author.username } }"
        class="author">
        {{ article.author.username }}
      </router-link> -->
      <span class="name">{{ provider.name }}</span>
    </div>
    <!-- v-if="actions" -->
    <template>
      <!-- <c-provider-actions
      :provider="provider"
      ></c-provider-actions> -->
    </template>
    <!-- :canModify="isCurrentUser()" -->
    <!-- <template v-else>
      <button
      class="btn btn-sm pull-xs-right"
      v-if="!actions"
      v-on:click="toggleFavorite"
      :class="{
        'btn-primary': article.favorited,
        'btn-outline-primary': !article.favorited
        }">
        <i class="ion-heart"></i>
        <span class="counter">
          {{ article.favoritesCount }}
        </span>
      </button>
    </template> -->
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import CProviderActions from '@/components/ProviderActions'

export default {
  name: 'c-provider-meta',
  // components: {
  //   CProviderActions
  // },
  props: {
    provider: {
      type: Object,
      required: true
    }
  //   actions: {
  //     type: Boolean,
  //     required: false,
  //     default: false
  //   }
  }
  // computed: {
  //   ...mapGetters([
  //     'currentUser',
  //     'isAuthenticated'
  //   ])
  // },
  // methods: {
  //   isCurrentUser () {
  //     if (this.currentUser.username && this.article.author.username) {
  //       return this.currentUser.username === this.article.author.username
  //     }
  //     return false
  //   },
  //   toggleFavorite () {
  //     if (!this.isAuthenticated) {
  //       this.$router.push({name: 'login'})
  //       return
  //     }
  //     const action = this.article.favorited
  //       ? FAVORITE_REMOVE
  //       : FAVORITE_ADD
  //     this.$store.dispatch(action, this.article.slug)
  //   }
  // }
}
</script>
