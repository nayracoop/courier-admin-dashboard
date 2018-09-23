<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <div class="clearfix">
            <h1 class="float-left display-3 mr-4">404</h1>
            <h4 class="pt-3">Oops! Acá no hay nada.</h4>
            <p class="text-muted">La página que estás buscando no existe.</p>
          </div>
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col md="6">
          <div class="clearfix">
            <b-button variant="outline-primary" @click="$router.push({name:'Home'})">Ir al inicio <i class="fa fa-home ml-1"></i></b-button>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404'
}
</script>
