<template>
        <b-form>
            <b-row>
                <b-col sm="6">
                    <b-form-group>
                    <label for="country">País</label>
                    <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
                    <b-form-input type="text" id="country" placeholder="" :value="1"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="6">
                    <b-form-group>
                        <label for=""></label>
                        <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
                        <b-form-select id=""
                        :plain="true"
                        :options="pepep"
                        value="2">
                        </b-form-select>
                    </b-form-group>
                </b-col>
            </b-row><b-row>
                <b-col sm="6">
                    <b-form-group>
                    <label for="country">País</label>
                    <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
                    <b-form-input type="text" id="country" placeholder="" :value="1"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="6">
                    <b-form-group>
                        <label for=""></label>
                        <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
                        <b-form-select id=""
                        :plain="true"
                        :options="pepep"
                        value="3">
                        </b-form-select>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="6">
                    <b-form-group>
                    <label for="country">País</label>
                    <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
                    <b-form-input type="text" id="country" placeholder="" :value="1"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="6">
                    <b-form-group>
                        <label for=""></label>
                        <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
                        <b-form-select id=""
                        :plain="true"
                        :options="pepep"
                        value="4">
                        </b-form-select>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="6">
                    <b-form-group>
                    <label for="country">País</label>
                    <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
                    <b-form-input type="text" id="country" placeholder="" :value="1"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="6">
                    <b-form-group>
                        <label for=""></label>
                        <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
                        <b-form-select id=""
                        :plain="true"
                        :options="pepep"
                        value="5">
                        </b-form-select>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-form>
</template>

<script>
export default {
    name: 'c-shipping-from'
}
</script>