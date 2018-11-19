<template>
  <!-- componente lista de usuarios -->
  <c-user-list></c-user-list>
</template>

<script>
import CUserList from '@/components/UserList'

export default {
  name: 'v-users',
  components: {
    CUserList
  }
}
</script>
