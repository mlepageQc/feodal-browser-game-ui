<template>
  <header>
    <button v-if="currentUser" @click="onLogout">Log out</button>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { removeItem } from '@/lib/local-storage'
import { mapState, mapActions } from 'vuex'

export default defineComponent({
  computed: {
    ...mapState('session', [
      'currentUser'
    ])
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    async onLogout (): Promise<void> {
      await this.logout()
      removeItem('jwt')
      this.$router.push({ name: 'login' })
    }
  }
})
</script>

<style lang="scss">
  header {
    background: teal;
    min-height: 50px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-bottom: 1px solid black;
  }
</style>
