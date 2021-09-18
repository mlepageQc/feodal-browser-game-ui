<template>
  <header>
    <button v-if="currentUser" @click="logout">Log out</button>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import { logout } from '@/api/SessionApi'

export default defineComponent({
  computed: {
    ...mapState('session', [
      'currentUser'
    ])
  },
  methods: {
    async logout (): Promise<void> {
      await logout()
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
