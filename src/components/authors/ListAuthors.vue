<template>
  <div class="full-height">

    <div class="contextbar border-bottom border-tertiary background-lightgrey">
      <div class="row padding">
        <input type="text" style="margin:0;" placeholder="Search..." v-model="text" v-on:keyup="search" />
        <button class="button button-small margin-left border-none background-grey hover-shadow-outline" v-on:click="clearSearch" v-if="text.length > 0"><i class="icon-cross"></i></button>

        <div class="right margin-left">
        <span class="button button-small dropdown border-none background-grey hover-shadow-outline">&#9662;
          <div class="dropdown-body padding border round text-left shadow background-white">
            <span class="text-darkgrey">View Options</span>
            <hr class="margin"/>

            <input type="radio" group="size" id="comfort" v-model="option.mode" value="0" />
            <label for="comfort"><span class="text-small">Comfortable Size</span></label>
            <input type="radio" group="size" id="compact" v-model="option.mode" value="1" />
            <label for="compact"><span class="text-small">Compact Size</span></label>
            <hr class="margin"/>

            <input type="checkbox" id="showThumb" v-model="option.showThumb" />
            <label for="showThumb"><span class="text-small"><i class="icon-image"></i>&nbsp;Show Profile Picture</span></label>
            <input type="checkbox" id="showDesc" v-model="option.showDesc" />
            <label for="showDesc"><span class="text-small"><i class="icon-eye"></i>&nbsp;Show Descriptions</span></label>
            <input type="checkbox" id="showUser" v-model="option.showUser" />
            <label for="showUser"><span class="text-small"><i class="icon-user"></i>&nbsp;Show Username</span></label>
            <input type="checkbox" id="showRole" v-model="option.showRole" />
            <label for="showRole"><span class="text-small"><i class="icon-price-tag"></i>&nbsp;Show Role</span></label>
            <input type="checkbox" id="showConflicts" v-model="option.showConflicts" />
            <label for="showConflicts"><span class="text-small"><i class="icon-power"></i>&nbsp;Show Save Conflicts</span></label>
          </div>
        </span>
        </div>
        <button class="button button-primary right" v-on:click="newAuthor"><i class="icon-plus"></i>&nbsp;New</button>
      </div>
    </div>

    <div id="author-list" class="background-white border-left border-right border-tertiary full-height scrollable text-left">

      <p class="super-center text-center" v-if="authors === null || authors.length < 1">
        <span v-if="text === null || text.length == 0">
          <i class="icon-users text-grey text-largest"></i><br/>
          <em class="text-darkgrey">No authors found.</em>
        </span>
        <span v-if="text !== null && text.length > 0">
          <i class="icon-search text-grey text-largest"></i><br/>
          <em class="text-darkgrey">No results found for '{{ text }}'.</em>
        </span>
      </p>
      <p class="super-center text-center animated fadeIn" v-if="message.length > 0">
        <i class="icon-notification text-red text-largest"></i><br/>
        <em class="text-red text-bold">{{ message }}</em>
      </p>

      <div v-for="author in authors" class="author-item" v-bind:class="{ 'active': currentAuthor !== null && author._id === currentAuthor._id }">
        <router-link :to="{ name:'view-author', params:{ id:author._id }}">
          <div class="row padding-left border-bottom border-tertiary margin-none" v-bind:class="{ 'padding': option.mode == 0 }">
            <p class="margin-none text-nowrap">
              <span v-if="option.showConflicts && author._conflicts !== 'undefined' && author._conflicts != null && author._conflicts.length > 0"
                class="icon-power text-danger right margin-right" title="Save conflict!">
              </span>
              <span v-if="option.showThumb" class="text-small text-nowrap" title="profile picture">
                <img v-if="author.thumbnail.length > 0" class="left margin-right background-white circle border" height="25" width="25" alt="" :src="author.thumbnail" />
                <div v-if="author.thumbnail.length == 0" class="left margin-right background-white circle border" style="height:25px;width:25px"></div>
              </span>
              {{ author.name | shorten(45) }}<br/>
              <span v-if="option.showDesc" class="text-darkgrey text-nowrap">{{ author.description | shorten(60) }}<br/></span>
              <span v-if="option.showUser" class="text-darkgrey text-nowrap" title="username">{{ author._id || '?' }}</span>
              <span v-if="option.showUser && option.showRole" class="text-grey">&nbsp;|&nbsp;</span>
              <span v-if="option.showRole" class="text-small text-nowrap" title="role">
                <code>{{ author.role || '?' }}</code>
              </span>
            </p>
          </div>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'author-list',
  data () {
    return {
      text: '',
      option: {
        mode: 0,
        showDesc: true,
        showThumb: true,
        showUser: false,
        showRole: false,
        showConflicts: true
      },
      message: ''
    }
  },
  computed: mapGetters({
    authors: 'getAllAuthors',
    currentAuthor: 'getCurrentAuthor'
  }),
  created () {
    this.clearSearch()
  },
  methods: {
    clearSearch () {
      this.text = ''
      this.message = ''
      this.search()
    },
    newAuthor () {
      this.$store.dispatch('setCurrentAuthor', null)
      this.$router.push('/new-author')
    },
    search () {
      this.text = this.text.toLowerCase()

      this.$store.dispatch('searchAllAuthors', this.text).then(result => {
        // successful search
      }).catch(err => {
        // failed search
        console.log(err)
        this.message = err
      })
    }
  }
}
</script>

<style>
#author-list a {
  color: initial;
}
#author-list {
  height: calc(100% - 6.5rem);
}
#author-list .author-item {
  transition: all 0.3s ease;
  overflow: hidden;
}
#author-list .author-item.active {
  background: var(--primary);
}
#author-list .author-item.active code {
  background: transparent;
}
#author-list .author-item.active, #author-list .author-item.active a, #author-list .author-item.active span {
  color: var(--white);
}
#author-list .author-item:hover {
  background: var(--light-grey);
}
#author-list .author-item.active:hover {
  background: var(--primary);
}
</style>
