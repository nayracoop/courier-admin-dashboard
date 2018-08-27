<template>

  <div class="home-global">
    <c-provider-list></c-provider-list>
  </div>

</template>
<script>
import CProviderList from '@/components/ProviderList'

export default {
  name: 'v-providers',
  components: {
    CProviderList
  }
}
</script>
