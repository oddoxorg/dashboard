<template>
<div class="full-height">

  <div class="contextbar border-bottom border-tertiary background-lightgrey">
    <div class="four columns tabs">
      <button class="tab button" v-bind:class="{ 'active': tab == 0 }" v-on:click="setTab(0)">Profile</button>
      <button class="tab button" v-bind:class="{ 'active': tab == 1 }" v-on:click="setTab(1)">Preview</button>
      <button class="tab button" v-bind:class="{ 'active': tab == 2 }" v-on:click="setTab(2)">Account</button>
      <button class="tab button" v-bind:class="{ 'active': tab == 3 }" v-on:click="setTab(3)"><i class="icon-cog"></i></button>
    </div>
    <div class="eight columns padding text-right" v-if="author !== null">
      <code v-if="message.length > 0">{{ message }}</code>&nbsp;
      <button class="button button-primary" v-on:click="save"><i class="icon-checkmark"></i>&nbsp;{{ newFlag ? 'Create' : 'Save' }}</button>
      <button class="button" v-on:click="close">Cancel</button>
    </div>
  </div>

  <div id="author-edit" class="border-left border-right border-tertiary background-white scrollable">

    <p class="super-center text-center text-darkgrey" v-if="loading">
      <i class="icon-spinner9 animated spin"></i><br/>
      <em>Loading...</em>
    </p>
    <p class="super-center text-center" v-if="author === null && message.length > 0">
      <i class="icon-notification text-danger text-largest"></i><br/>
      <em class="text-danger text-bold">{{ message }}</em>
    </p>

    <div class="full-height padding-large" v-if="author !== null && !loading">

      <div class="row full-height" v-if="tab == 0">
        <!-- Profile -->
        <div class="row">
          <label for="name">Display Name</label>
          <input type="text" id="name" class="text-medium" style="width:30%;min-width:25rem;" v-model="author.name" placeholder="My Name" />
        </div>
        <div class="row padding-top">
          <label for="desc">Short Description</label>
          <textarea id="desc" class="full-width" placeholder="A short description about me..." v-model="author.description"></textarea>
        </div>
        <div class="row padding-top">
          <label>About Me / Long Description</label>
          <wysiwyg v-model="author.content" />
        </div>
      </div>
      <div class="row full-height" v-if="tab == 1">
        <!-- Preview -->
        <img v-if="author.thumbnail.length > 0" class="margin-bottom-large shadow round left margin-right-large" height="150" width="150" alt="Profile Picture" :src="author.thumbnail" />
        <h1 v-if="author.name.length > 0">{{ author.name }}</h1>
        <div v-if="author.content.length > 0" v-html="author.content"></div>
        <p v-if="author.content.length < 1" class="super-center text-center">
          <i class="icon-radio-unchecked text-lightgrey text-largest"></i><br/>
          <em class="text-grey">Nothing to show yet!</em>
        </p>
      </div>
      <div class="row full-height" v-if="tab == 2">
        <!-- Account -->
        <h4>{{ author.name }}</h4>
        <div class="row">
          <img v-if="author.thumbnail.length > 0" class="round border margin-right left" height="65" width="65" alt="" :src="author.thumbnail" />
          <label for="thumbnail"><i class="icon-image"></i>&nbsp;Profile Picture</label>
          <input type="text" id="thumbnail" style="width:25rem;" v-if="author.thumbnail !== null" v-model="author.thumbnail" />
        </div>
        <div class="row padding-top">
          <div class="six columns">
            <label for="username"><i class="icon-user"></i>&nbsp;Username</label>
            <input type="text" id="username" class="" v-model="author._id" />
            <br/>
            <span class="text-darkgrey">https://{{ 'mydomain.com/author/' }}{{ author._id || ''}}</span>
          </div>
          <div class="six columns">
            <label for="role"><i class="icon-clipboard"></i>&nbsp;Role</label>
            <select id="role" class="" v-model="author.role" :disabled="!authToken.serverAdmin">
              <option value="admin">Admin</option>
              <option value="author">Author</option>
            </select>
          </div>
        </div>
        <div class="row padding-top">
          <label for="email"><i class="icon-envelop"></i>&nbsp;Email Address</label>
          <input type="text" id="email" style="width:50%;min-width:25rem;" v-model="author.email" />
        </div>
        <hr/>
        <div class="row padding-top padding-bottom">
          <h3>Security</h3>
          <button class="button">Change Password</button>
          <button class="button">Reset Password</button>

          <br/><br/>
        </div>

      </div>
      <div class="row full-height" v-if="tab == 3">
        <!-- Advanced -->
        <h4>{{ author.name }}</h4>
        <div class="row">
          <p>
            <i class="icon-clock"></i>&nbsp;Created: <code>{{ author.createDate || 'null' }}</code><br/>
            <i class="icon-clock"></i>&nbsp;Modified: <code>{{ author.modifyDate || 'null' }}</code><br/>
          </p>
        </div>
        <hr/>
        <div class="row padding-top padding-bottom">
          <h3>Danger Zone</h3>
          <p>Careful! These actions may permanently destroy data.</p>
          <button class="button button-danger" v-on:click="destroy"><i class="icon-cross"></i>&nbsp;Delete</button>
        </div>
      </div>
    </div>

  </div>
</div>

</div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'author-edit',
  data () {
    return {
      author: {},
      newFlag: false,
      tab: 0,
      message: '',
      loading: true,
      preview: false
    }
  },
  computed: mapGetters({
    authToken: 'getAuthToken',
    currentAuthor: 'getCurrentAuthor'
  }),
  created () {
    this.read()
  },
  watch: {
    '$route': 'read'
  },
  methods: {
    accessCheck () {
      if (this.$route.params.id !== null && this.$route.params.id !== undefined) {
        // is user trying to edit themselves?
        if (this.$route.params.id === this.authToken.username) {
          // console.log('Authorized: User can edit themselves.')
          return true
        } else if (!this.authToken.serverAdmin) {
          // only server admins can edit other authors
          console.log('Unauthorized. User cannot edit other users.')
          return false
        } else if (this.authToken.serverAdmin) {
          // console.log('Authorized: Server admin can edit other users.')
          return true
        }
      } else if (this.authToken.serverAdmin) {
        // only server admins can create new authors
        return true
      }
      console.log('Unauthorized. You are not a server administrator.')
      return false
    },
    read () {
      // quick access check
      if (!this.accessCheck()) {
        this.$router.push('/unauthorized')
        return
      }
      // load author if possible
      if (this.$route.params.id !== null && this.$route.params.id !== undefined) {
        // edit author
        this.$store.dispatch('setCurrentAuthor', this.$route.params.id).then(() => {
          this.loading = false
          this.author = JSON.parse(JSON.stringify(this.currentAuthor))
        }).catch((err) => {
          this.loading = false
          this.message = err
        })
      } else {
        // new author
        this.$store.dispatch('setCurrentAuthor', null).then(() => {
          this.loading = false
          this.newFlag = true
          this.author = {
            _id: '',
            name: '',
            email: '',
            role: 'author',
            createDate: new Date().toJSON(),
            modifyDate: '',
            thumbnail: '',
            description: '',
            content: ''
          }
        }).catch((err) => {
          this.loading = false
          this.message = err
        })
      }
    },
    setTab (tabIndex) {
      this.tab = tabIndex
    },
    close () {
      if (this.newFlag) {
        this.$router.push('/author')
      } else {
        this.$router.push('/author/' + this.author._id)
      }
    },
    save () {
      if (this.author._id.length < 1) {
        // can't save new author
        this.message = 'Enter Username before Saving'
        this.setTab(2)
        return
      }
      if (this.author.name.length < 1) {
        this.author.name = 'Anonymous'
      }

      // get time ISO-8601
      this.author.modifyDate = new Date().toJSON()

      this.$store.dispatch('updateAuthor', this.author).then((result) => {
        // check if creating new author
        if (this.newFlag) {
          // create new user also
          let newUser = {
            _id: 'org.couchdb.user:' + this.author._id,
            name: this.author._id,
            roles: [ this.author.role ],
            type: 'user',
            password: 'oddox' /* default password */
          }
          this.$store.dispatch('updateUser', newUser).then(() => {
            if (this.author.role === 'admin') {
              console.log('Created admin: ' + this.author._id)
            } else {
              console.log('Created author: ' + this.author._id)
            }
            this.message = 'Created (' + moment(this.syncTime).fromNow() + ')'
            // retrieve new _id and _rev
            this.author._id = result.id
            this.author._rev = result.rev
            this.newFlag = false
          }).catch((err) => {
            console.log(err)
            this.message = err
          })
        } else {
          console.log('Saved author: ' + this.author._id)
          this.message = 'Saved (' + moment(this.syncTime).fromNow() + ')'
          // retrieve new _id and _rev
          this.author._id = result.id
          this.author._rev = result.rev
        }
      }).catch((err) => {
        console.log(err)
        this.message = err
      })
    },
    destroy () {
      if (this.newFlag) {
        // can't delete new author
        return
      }
      let warnDelete = 'Are you sure you want to delete this author?\nIt cannot be undone if you do.'
      if (this.author._id === this.authToken.username) {
        warnDelete = 'Are you sure you want to delete your account?\nIt cannot be undone and you will be immediately logged out.'
      }

      if (confirm(warnDelete)) {
        this.$store.dispatch('deleteAuthor', this.currentAuthor).then(() => {
          // remove by id
          let userid = 'org.couchdb.user:' + this.author._id
          // this is a special remove.
          // It removes a doc with just the _id and not _rev.
          // Reason for this is, we don't want to bother opening and reading
          // each user doc everytime we make simple edits to authors profile.
          this.$store.dispatch('deleteUser', userid).then(() => {
            console.log('Deleted author: ' + this.author._id)
            if (this.author._id === this.authToken.username) {
              // Logout
              // user deleted themselves
              console.log('Logging out...')
              this.$store.dispatch('logout').then(result => {
                // on successful logout
                console.log('Logged out.')
                this.$router.push('/logout')
              }).catch(err => {
                // failed logout
                console.log(err)
              })
            } else {
              // else
              // server admin deleted user
              this.author = null
              this.message = 'Author was deleted'
              setTimeout(() => {
                this.$router.push('/author')
              }, 2500)
            }
          }).catch((err) => {
            console.log(err)
            this.message = err
          })
        }).catch((err) => {
          console.log(err)
          this.message = err
        })
      }
    }
  }
}
</script>

<style>
#author-edit {
  height: calc(100% - 6.5rem);
}
</style>
