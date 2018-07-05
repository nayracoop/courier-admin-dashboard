<template>
  <b-form>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="myAddresses">Direcciones guardadas</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
          <b-form-select id="myAddresses" :plain="true" :options="['Nayra','Agregar nueva dirección']" value="Dirección predeterminada">
          </b-form-select>
          <b-list-group class="info-address">
            <b-list-item>Depósito San Justo, Román Ramos</b-list-item>
            <b-list-item>Tata 242, 2c, 1182 Caseros, Buenos Aires</b-list-item>
            <b-list-item>AR</b-list-item>
            <b-list-item>nayracoop@gmail.com, 01150461094</b-list-item>
          </b-list-group>
          <b-link href="#">Editar dirección
            <i class="fa fa-pencil"></i>
          </b-link>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-form-group>
          <label for="country">País</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
          <b-form-select id="country" :plain="true" :options="['Argentina','Bolivia']" value="5">
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="addressName">Nombre de la dirección</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Ingrese un nombre para identificar la dirección"></i>
          <b-form-input type="text" id="addressName" placeholder="Ej: Depósito San Justo" :value="_"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="contactName">Nombre del contacto</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre de contacto"></i>
          <b-form-input type="text" id="contactName" placeholder="Ej: Román Ramos" :value="_"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="address">Dirección</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Calle y número del proveedor"></i>
          <b-form-input type="text" id="address" placeholder="Ej: Balbín 2422" :value="_"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="province">Provincia</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
          <b-form-input type="text" id="province" placeholder="Ej: Buenos Aires" :value="Provincia"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="country">Localidad</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
          <b-form-input type="text" id="country" placeholder="Ej: San Justo" :value="_"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="region">Código postal</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
          <b-form-input type="text" id="region" placeholder="Ej: 1182" :value="_"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="email">Email</label>
          <b-form-input id="email" type="email" autocomplete="email" placeholder="Ej: envios@empresa.com"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="phone">Teléfono</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de teléfono del proveedor"></i>
          <b-form-input type="tel" id="phone" placeholder="Ej: 4892-1242 " :value="_"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
export default {
  name: 'c-address'
}
</script>
