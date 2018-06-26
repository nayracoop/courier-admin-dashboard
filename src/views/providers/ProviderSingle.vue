<template>
  <div class="animated fadeIn">
    <b-row>
        <b-col sm="12">
        <h2>UPS ARGENTINA</h2>
        </b-col>
    </b-row>
    <b-row class="actions-bar">
        <b-col sm="12">
        <b-button variant="outline-primary">Imprimir</b-button>
        <b-button variant="outline-primary">Adjuntar</b-button>
        <b-button variant="outline-primary">Ver historial</b-button>
        </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="name">Nombre</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social de tu cliente"></i>
            <b-form-input type="text" id="name" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
            <label for="code" v-b-tooltip.hover title="Código identificatorio que asignaste a tu cliente. Campo opcional">Código</label>
            <b-form-input type="text" id="code" placeholder=""></b-form-input>
          </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
            <b-form-group
            label="Tipo de identificación"
            label-for="idType"
            :label-cols="3"
            :horizontal="false">
            <b-form-select id="idType"
              :plain="true"
              :options="['Sin identificar / venta global diaria','DNI', 'CUIL', 'CUIT']"
              value="Sin identificar / venta global diaria">
            </b-form-select>
            </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="idNumber" v-b-tooltip.hover title="Número del DNI, CUIT, CUIL, etc">N° de identificación</label>
            <b-form-input type="text" pattern="[0-9]" id="idNumber" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
              label="Categoría fiscal"
              label-for="ivaCond"
              :label-cols="3"
              :horizontal="false"
              v-b-tooltip.hover title="Condición frente al Impuesto al Valor Agregado de tu cliente"
              >
            <b-form-select id="ivaCond"
              :plain="true"
              :options="['Consumidor final','Exento', 'Exterior', 'IVA no alcanzado', 'Monotributista', 'Responsable inscripto']"
              value="Sin identificar / venta global diaria">
            </b-form-select>
            </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
            label="Es cliente?"
            label-for="isClient"
            :label-cols="3"
            :horizontal="false">
            <b-form-checkbox-group id="isClient">
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" class="custom-control-input" id="isClientOk" value="1">
                <label class="custom-control-label" for="isClientOk">Sí</label>
              </div>
            </b-form-checkbox-group>
          </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
            label="Recibe retenciones?"
            label-for="ret?"
            :label-cols="3"
            :horizontal="false">
            <b-form-checkbox-group id="ret?">
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" class="custom-control-input" id="retOk" value="1">
                <label class="custom-control-label" for="retOk">Sí</label>
              </div>
            </b-form-checkbox-group>
          </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
            label="Es banco?"
            label-for="isBank"
            :label-cols="3"
            :horizontal="false">
            <b-form-checkbox-group id="isBank">
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" class="custom-control-input" id="isBankOk" value="1">
                <label class="custom-control-label" for="isBankOk">Sí</label>
              </div>
            </b-form-checkbox-group>
          </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
            label="Email"
            label-for="email"
            :horizontal="false">
            <b-form-input id="email" type="email" autocomplete="email"></b-form-input>
          </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="phone" v-b-tooltip.hover title="">Teléfono</label>
            <b-form-input type="tel" id="phone" pattern="[0-9]" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="address" v-b-tooltip.hover title="">Domicilio</label>
            <b-form-input type="text" id="address" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="country" v-b-tooltip.hover title="">País</label>
            <b-form-input type="text" id="country" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
            label="Provincia"
            label-for="state"
            :label-cols="3"
            :horizontal="false">
            <b-form-select id="state"
              :plain="true"
              :options="['Buenos Aires','Catamarca', 'Chaco', 'Chubut']"
              value="">
            </b-form-select>
            </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="region" v-b-tooltip.hover title="">Localidad</label>
            <b-form-input type="text" id="region" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
            label="Cuenta contable"
            label-for=""
            :label-cols="3"
            :horizontal="false">
            <b-form-select id=""
              :plain="true"
              :options="['Crear cuenta contable']"
              value="">
            </b-form-select>
            </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
            label="Lista de precios de compra"
            label-for="pricesList"
            :label-cols="3"
            :horizontal="false">
            <b-form-select id="pricesListate"
              :plain="true"
              :options="['Crear lista de precio']"
              value="">
            </b-form-select>
            </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12">
              <b-form-group
            label="Observaciones"
            label-for="notes"
            :label-cols="3"
            :horizontal="false">
            <b-form-textarea id="notes" no-resize="true" :textarea="true" :rows="4"></b-form-textarea>
          </b-form-group>
            </b-col>
          </b-row>
          <b-row class="actions-bar">
                <b-col sm="12">
              <b-button variant="primary">Guardar</b-button>
              <b-button variant="outline-primary">Eliminar</b-button>
              <b-button variant="outline-primary">Cerrar</b-button>
                </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.actions-bar{
  margin-top: 0px;
  margin-bottom: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
  border-top: 1px solid #ebebebeb;
  border-bottom: 1px solid #ebebebeb;
}
.actions-bar button{
  margin-right: 10px;
}
</style>
