<template>
  <header>
    <button v-if="currentUser" @click="logout">Log out</button>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapActions } from 'vuex'

export default defineComponent({
  computed: {
    ...mapState('session', [
      'currentUser'
    ])
  },
  methods: {
    ...mapActions('session', [
      'destroy'
    ]),
    async logout (): Promise<void> {
      await this.destroy()
      localStorage.removeItem('jwt')
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
