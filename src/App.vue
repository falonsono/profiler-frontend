<template>
  <v-app>
    <v-main style="background-color: #15415d">
      <v-container bg fill-height grid-list-md text-xs-center>
        <v-layout row wrap align-center justify-center>
          <v-card height="550" width="700" outlined >
            <v-card-title>
              <v-icon large left> mdi-github </v-icon>
              <span class="title font-weight-light">Github Profiler</span>
            </v-card-title>

            <v-card-text>
              <router-view></router-view>
            </v-card-text>
          </v-card>
        </v-layout>
      </v-container>
      
      <v-snackbar 
          v-model="snackbar.visible"
          :bottom="snackbar.y === 'bottom'"
          :color="snackbar.color"
          :left="snackbar.x === 'left'"
          :multi-line="snackbar.mode === 'multi-line'"
          :right="snackbar.x === 'right'"
          :timeout="snackbar.timeout"
          :top="snackbar.y === 'top'"
          :vertical="snackbar.mode === 'vertical'"
        >
        {{ snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar.visible = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>

    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "App",
  data: () => ({
  }),
  computed:{
    ...mapGetters(['snackbar']),
  }
};
</script>
