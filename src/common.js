var CommonData = {
  links: {
    home: 'https://watchout.tw/',
    support: 'https://watchout.tw/#support',
  },
  support: {
    style: {
      backgroundImage: 'url(https://watchout.tw/asset/support.png)',
    },
  },
  footer: {
    island: {
      image: 'https://watchout.tw/asset/island.png',
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
        image: 'https://watchout.tw/asset/goodfriend.png',
        message: '阿草好朋友',
        link: 'https://store.line.me/stickershop/product/1024870/zh-Hant',
      },
      {
        type: 'LINE',
        image: 'https://watchout.tw/asset/goodcitizen.png',
        message: '阿草督督好',
        link: 'https://store.line.me/stickershop/product/1224270/zh-Hant',
      },
    ],
    cluster: [
      {
        title: '沃草產品',
        links: [
          {
            title: '國會無雙',
            link: 'https://musou.tw/',
          },
          {
            title: '給問擂台',
            link: 'https://ask.watchout.tw/',
          },
          {
            title: '公民學院',
            link: 'https://citizenedu.tw/',
          },
        ],
      },
      {
        title: '關於沃草',
        links: [
          {
            title: '2014 透明報告',
            link: 'https://watchout.tw/transparency/2014',
          },
          {
            title: '歷年影響力報告',
            link: 'https://watchout.tw/impact/',
          },
          {
            title: '聯絡我們',
            link: 'https://watchout.tw/contact',
          },
          {
            title: '授權條款',
            link: 'https://watchout.tw/license',
          },
        ],
      },
    ],
    wo: {
      black: 'https://watchout.tw/asset/wo/full/black.png',
      white: 'https://watchout.tw/asset/wo/full/white.png',
    },
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
    <img class="island" :src="common.footer.island.image" />
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
    <div class="cluster d-flex flex-row justify-content-center">
      <div v-for="group in common.footer.cluster" class="group">
        <h4>{{ group.title }}</h4>
        <div v-for="item in group.links" class="item"><a :href="item.link" class="a-text">{{ item.title }}</a></div>
      </div>
    </div>
  </footer>
  `
});
Vue.component('w-support', {
  mixins: [mxCommon],
  template: `
  <div class="support">
    <a class="button" :style="common.support.style" :href="common.links.support" target="support"></a>
    <a class="close" href="#" @click.stop.prevent="close">×</a>
  </div>
  `,
  methods: {
    close: function(event) {
      $(this.$el).hide();
    }
  }
});
