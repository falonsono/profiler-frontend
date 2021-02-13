<template>
	<div class="input-container">
		<div class="mb-5">
			Please enter the username you want to see the profile from:
		</div>
		<v-text-field hide-details="auto" ref="userTxt" v-model="username" @keyup.enter="loadProfile">
			<v-label slot="prepend">
				github.com/
			</v-label>
			
			<v-btn icon color="blue-grey" slot="append" @click="loadProfile">
				<v-icon>mdi-arrow-right-bold-circle</v-icon>
			</v-btn>
		</v-text-field>
	</div>
</template>

<script>
  export default {
    name: 'MainPage',
    data: () => ({
      username: null
    }),
    mounted(){
			this.$refs.userTxt.focus();
    },
		methods:{
			loadProfile(){
				if(this.username){
					this.$router.push({ path: `/profile/${this.username}`});
				} else{
					this.$store.commit("showSnackbar", {
            text: "Please provide an username!",
            color: "error",
          });
				}
			}
		}
  }
</script>
<style scoped>
	.v-text-field .v-label {
		max-width: 100%;
	}
	.input-container {
		display: table-cell;
		width: 700px;
		height: 400px;
		padding: 0px 120px;
		vertical-align: middle;
		text-align: center;
	}
</style>