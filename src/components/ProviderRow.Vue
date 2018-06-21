<template>
  <div class="provider-preview">
    <c-provider-meta
      :provider="provider"
      :isPreview="true">
    </c-provider-meta>
    <router-link
      :to="{ name: 'provider', params: { 'id': provider.id }}"
      class="preview-link">
      <h1>{{provider.name}}</h1>
      <p>{{provider.description}}</p>
      <span>Editar...</span>
    </router-link>
  </div>
</template>

<script>
import CProviderMeta from '@/components/ProviderMeta'

export default {
  name: 'c-provider-row',
  props: {
    provider: { type: Object, required: true }
  },
  components: {
    CProviderMeta
  }
}
</script>
