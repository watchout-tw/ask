var mxCommon = {
  props: {
    common: {
      type: Object,
      validator: function(data) {
        return true;
      }
    }
  },
};
Vue.component('w-footer', {
  mixins: [mxCommon],
  props: {
    data: {
      type: Object,
      validator: function(data) {
        return true;
      }
    },
  },
  computed: {
    social: function() {
      var arr = this.data.social;
      var result = [];
      var types = {};
      for(var i = 0; i < arr.length; i++) {
        var cur = arr[i];
        if(!(cur.type in types)) {
          types[cur.type] = {type: cur.type, items: []};
          result.push(types[cur.type]);
        }
        types[cur.type].items.push(cur);
      }
      return result;
    },
  },
  template: `
  <footer>
    <img class="island" src="asset/island.png" />
    <div class="social">
      <div v-for="group in social" class="group d-flex flex-row justify-content-around" :type="group.type">
        <a v-for="item in group.items" :href="item.link" class="link a-block" target="social">
          <div class="image">
            <img :src="item.image" />
            <div class="type"></div>
          </div>
          <div class="message">{{ item.message }}</div>
        </a>
      </div>
    </div>
    <div class="other">
      <div v-for="item in data.other" class="item"><a :href="item.link" class="a-text">{{ item.title }}</a></div>
    </div>
    <a class="wo a-block" :href="common.home"><img src="asset/wo/full/black.png" /></a>
  </footer>
  `
});
Vue.component('w-support', {
  mixins: [mxCommon],
  template: `
  <div class="support">
    <a class="button" :href="common.support" target="support"></a>
    <a class="close" href="#" @click.stop.prevent="close">×</a>
  </div>
  `,
  methods: {
    close: function(event) {
      $(this.$el).hide();
    }
  }
});
