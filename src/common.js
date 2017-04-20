var CommonData = {
  links: {
    home: 'https://watchout.tw/',
    support: 'https://watchout.tw/#support',
  },
  footer: {
    island: {
      image: 'asset/island.png',
    },
    social: [
      {
        type: 'facebook',
        image: 'https://graph.facebook.com/WatchoutTW/picture?type=large',
        message: '追蹤我們的最新動態！',
        link: 'https://facebook.com/WatchoutTW/',
      },
      {
        type: 'LINE',
        image: 'asset/goodfriend.png',
        message: '阿草好朋友',
        link: 'https://store.line.me/stickershop/product/1024870/zh-Hant',
      },
      {
        type: 'LINE',
        image: 'asset/goodcitizen.png',
        message: '阿草督督好',
        link: 'https://store.line.me/stickershop/product/1224270/zh-Hant',
      },
    ],
    other: [
      {
        title: '2014 透明報告',
        image: '',
        link: 'http://watchout.tw/transparency/2014',
      },
      {
        title: '歷年影響力報告',
        image: '',
        link: 'http://watchout.tw/impact/',
      },
      {
        title: '聯絡我們',
        image: '',
        link: 'http://watchout.tw/contact',
      },
      {
        title: '授權條款',
        image: '',
        link: 'http://watchout.tw/license',
      }
    ],
  },
};
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
  computed: {
    cptSocialGroups: function() {
      var arr = this.common.footer.social;
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
      <div v-for="group in cptSocialGroups" class="group d-flex flex-row justify-content-around" :type="group.type">
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
      <div v-for="item in common.footer.other" class="item"><a :href="item.link" class="a-text">{{ item.title }}</a></div>
    </div>
    <a class="wo a-block" :href="common.home"><img src="asset/wo/full/black.png" /></a>
  </footer>
  `
});
Vue.component('w-support', {
  mixins: [mxCommon],
  template: `
  <div class="support">
    <a class="button" :href="common.links.support" target="support"></a>
    <a class="close" href="#" @click.stop.prevent="close">×</a>
  </div>
  `,
  methods: {
    close: function(event) {
      $(this.$el).hide();
    }
  }
});
