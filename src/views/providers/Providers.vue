<template>

  <div class="home-global">
    <h1>PROVEEDORES</h1>
    <c-provider-list type="all" />
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
