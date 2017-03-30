var events = {
  now: Factory.event(),
  next: Factory.event(),
  history: [
    Factory.event(),
    Factory.event(),
    Factory.event(),
    Factory.event(),
  ],
};

Vue.component('guest', {
  props: {
    g: {
      type: Object,
      validator: function(data) {
        return true;
      }
    }
  },
  template: `
  <li class="guest d-inline-block align-top">
    <div class="photo"></div>
    <label class="name">{{ g.name }}</label>
    <label class="job">{{ g.job }}</label>
  </li>
  `,
});

Vue.component('partner', {
  props: {
    p: {
      type: Object,
      validator: function(data) {
        return true;
      }
    }
  },
  template: `
  <li>{{ p.name }}</li>
  `,
});

var mxEvent = {
  props: {
    e: {
      type: Object,
      validator: function(data) {
        return true;
      }
    }
  },
  computed: {
    youtubeID: function() {
      return this.e.livestream.split('/').pop();
    },
    player: function() {
      return {
        styles: {
          backgroundImage: 'url(https://' + 'img.youtube.com/vi/' + this.youtubeID + '/maxresdefault.jpg)'
        },
      };
    },
  },
};
Vue.component('event-with-player', {
  mixins: [mxEvent],
  template: `
  <div class="event event-with-player">
    <div class="player">
      <div class="embed-responsive embed-responsive-16by9">
        <iframe class="embed-responsive-item" :style="player.styles"></iframe>
      </div>
    </div>
    <div class="info">
      <time :datetime="e.date">{{ e.date }}</time>
      <time :datetime="e.start">{{ e.start }}</time>
      <time :datetime="e.end">{{ e.end }}</time>
      <h3>{{ e.title }}</h3>
    </div>
    <div v-if="e.partners.length > 0" class="partners">
      <ul class="list list-naked"><label>合作夥伴</label>
        <partner v-for="p in e.partners" :key="p.name" :p="p"></partner>
      </ul>
    </div>
  </div>
  `,
});

Vue.component('event-wide', {
  mixins: [mxEvent],
  template: `
  <div class="event event-wide container-fluid container-960">
    <div class="row">
      <div class="col col-md-4 info">
        <h2 class="title">{{ e.title }}</h2>
        <time :datetime="e.date">{{ e.date }}</time>
        <time :datetime="e.start">{{ e.start }}</time>
        <time :datetime="e.end">{{ e.end }}</time>
        <div class="pgroup">
          {{ e.description }}
        </div>
        <div v-if="e.partners.length > 0" class="partners">
          <ul class="list list-naked"><label>合作夥伴</label>
            <partner v-for="p in e.partners" :key="p.name" :p="p"></partner>
          </ul>
        </div>
      </div>
      <div class="col">
        <div class="guests">
          <ul class="list list-naked">
            <guest v-for="g in e.guests" :key="g.name" :g="g"></guest><a class="guest d-inline-block align-top signup" :href="e.signup" target="signup"><div class="photo"></div></a>
          </ul>
        </div>
      </div>
    </div>
  </div>
  `,
});

Vue.component('event-in-list', {
  mixins: [mxEvent],
  template: `
  <div class="event event-in-list">
    <time :datetime="e.date">{{ e.date }}</time>
    <h3>{{ e.title }}</h3>
    <div class="guests" :nofg="e.guests.length">
      <ul class="list list-naked">
        <guest v-for="g in e.guests" :key="g.name" :g="g"></guest>
      </ul>
    </div>
    <div class="links">
      <a v-if="e.livestream" :href="e.livestream"><div class="logo logo-small woo"></div><span>直播</span></a>
      <a v-if="e.report" :href="e.report"><div class="logo logo-small musou"></div><span>報導</span></a>
      <a v-if="e.transcript" :href="e.transcript"><div class="icon icon-small transcript"></div><span>逐字稿</span></a>
    </div>
  </div>
  `,
});

var app = new Vue({
  el: '#app',
  data: {
    generatedAt: new Date(),
    status: 'SOON',
    cover: {
      title: '沃草給問擂台',
      styles: {
          backgroundImage: 'url(asset/key_visual.png)',
      }
    },
    now: events.now,
    next: events.next,
    intro: {
      title: '什麼是給問？',
      content: '生如正動實分友時況；愛相氣還算民西毒期先師經運向才管不的後些十？公自本般；自一覺半，的真明義養，我我社白但送改準行品高表也景、理天天廣人性眾十率親想的南。數這東，都為由體當安火，坐中西我在那者不共一小支爸公眼國一參人我！了的出一北失全整求預率眼，輕的？',
    },
    history: {
      title: '歷史紀錄',
      events: events.history,
    }
  }
});
