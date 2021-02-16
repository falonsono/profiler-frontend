<template>
  <div v-if="user">
    <v-btn
      icon
      color="blue-grey"
      @click="backHome"
      v-if="!isLoading"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <div class="ml-5" v-if="!isLoading">
      <v-row>
        <div>
          <h2 class="blue--text mt-3 ml-4">{{ user.login }}´s profile</h2>
          <span class="blue--text ma-4">{{ user.location }}</span>
        </div>
        <v-btn icon color="green" class="mt-1 ml-2" @click="getProfile">
          <v-icon>mdi-cached</v-icon>
        </v-btn>
      </v-row>
      <v-row class="mt-1">
        <v-col :cols="3">
          <v-avatar class="profile" color="grey" size="140" tile>
            <v-img :src="user.avatar_url"></v-img>
          </v-avatar>
        </v-col>
        <v-col>
          <div class="text-align-left sidepanel">
            <p class="title"><b>{{ user.followers }}</b> followers</p>
            <p class="title"><b>{{ user.public_repos }}</b> public repositories</p>
            <p class="title"><b>{{ totalStars }}</b> stars</p>
            <p class="title"><b>{{ totalWatchers }}</b> watchers</p>
            <p class="title"><b>{{ totalForks }}</b> forks</p>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col :cols="4">
          <v-simple-table dense dark height="200px">
            <template v-slot:default>
              <tbody>
                <tr v-for="item in languages" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td class="td-80">{{ ((item.count * 100) / totalRepos).toFixed(2) }}%</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>

        <v-col :cols="8">
          <div>
            <h3>
              <span class="indigo--text">Notes:</span>
            </h3>
            <v-row>
              <v-col>
                <v-btn
                  class="ma-1"
                  outlined
                  small
                  color="indigo"
                  @click.stop="dialog = true"
                >
                  Add
                </v-btn>
              </v-col>
              <v-col class="text-right">
                <v-btn
                  class="ma-1"
                  outlined
                  small
                  color="red"
                  @click="removeAllNotes"
                >
                  Remove All
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <v-simple-table dense v-if="notes.length > 0" height="150px">
            <template v-slot:default>
              <tbody>
                <tr
                  v-for="(item,index) in notes"
                  :key="item.id"
                  style="background-color: #ffffb9"
                >
                  <td class="td-20">{{ index + 1 }}</td>
                  <td>{{ item.description }}</td>
                  <td class="td-20" style="padding:0">
                    <v-btn icon color="red" @click="removeNote(item.id)">
                      <v-icon x-small>mdi-close</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <p v-else class="mt-2">No notes.. yet</p>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="font-weight-light">Add Note</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              label="Note text"
              :rules="rules"
              v-model="noteText"
              @keyup.enter="addNote"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="addNote" :disabled="!valid">Save</v-btn>
          <v-btn color="red darken-1" text @click="dialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isLoading" hide-overlay persistent width="300">
      <v-card color="blue-grey" dark>
        <v-card-text>
          Loading profile..
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "MainPage",
  props: ["username"],
  data: () => ({
    dialog: false,
		valid: true,
    isLoading: false,
    user: null,
    totalWatchers: 0,
    totalForks: 0,
    totalStars: 0,
    totalRepos: 0,
    languages: [],
    noteText: "",
    rules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 3) || "Min 3 characters",
    ],
    notes: [],
  }),
  mounted() {
    if (!this.username) {
      this.$router.push("/");
    }
    this.getProfile();
  },
  watch: {
    dialog: function(value) {
      if (value && this.$refs.form) {
        this.noteText = '';
				this.$refs.form.resetValidation();
      }
    },
  },
  methods: {
    backHome(){
      this.$router.push('/');
    },
    removeNote(id) {
      this.$store.dispatch("deleteNote", id).then((response) => {
        console.log(response);
        this.getNotes(this.user);
        this.$store.commit("showSnackbar", {
          text: "Note deleted!",
          color: "success",
        });
      });
    },
    removeAllNotes(){
      this.$store.dispatch("deleteAllNotes", this.user.login).then((response) => {
        console.log(response);
        this.getNotes(this.user);
        this.$store.commit("showSnackbar", {
          text: `All Notes from user ${this.user.login} deleted!`,
          color: "success",
        });
      });
    },
    initVariables() {
      this.languages = [];
      this.totalWatchers = 0;
      this.totalForks = 0;
      this.totalStars = 0;
      self.totalRepos = 0;
    },
    getNotes(user) {
      this.$store.dispatch("getNotes", user.login).then((response) => {
        console.log(response);
        this.notes = response;
      });
    },
    addNote() {
			
      this.$store
        .dispatch("saveNote", {
          description: this.noteText,
          username: this.user.login,
        })
        .then((response) => {
          console.log(response);
          this.dialog = false;
          this.noteText = "";
          this.getNotes(this.user);

          if(response.success){
            this.$store.commit("showSnackbar", {
              text: "Note added!",
              color: "success",
            });
          }
          
        });
    },
    getProfile() {
      this.initVariables();

      let self = this;
      this.isLoading = true;
      this.$store.dispatch("getUser", this.username).then((response) => {
        if (response.status == 404) {
          this.$store.commit("showSnackbar", {
            text: "Profile not found!",
            color: "error",
          });
          this.$router.push("/", () => {});
          return;
        }

        self.user = response;

        //retrieve users notes from DB
        this.getNotes(self.user);

        this.$store.dispatch("getUserRepos", this.username).then((response) => {
          let repos = response;

          repos.forEach((repo) => {
            self.totalWatchers += repo.watchers_count;
            self.totalForks += repo.forks_count;
            self.totalStars += repo.stargazers_count;

            if (repo.language) {
              let language = self.languages.find(
                (x) => x.name == repo.language
              );

              if (language) {
                self.languages.find((language) => language.name == repo.language).count++;
              } else {
                self.languages.push({ name: repo.language, count: 1 });
              }
            } else {
              //language not set or unknown
              if (self.languages.find((language) => language.name == "Unknown")) {
                self.languages.find((language) => language.name == "Unknown").count++;
              } else {
                self.languages.push({ name: "Unknown", count: 1 });
              }
            }

            self.totalRepos++;
          });
          self.languages = self.languages.sort((a, b) =>
            a.count < b.count ? 1 : -1
          );

          this.isLoading = false;
        });
      });
      this.isLoading = true;
    },
  },
};
</script>
<style scoped>
.sidepanel p {
  line-height: 14px;
}
.td-20 {
  width:20px;
}
.td-80{
  width:80px;
}
</style>