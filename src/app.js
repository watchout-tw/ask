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
  <li class="guest">
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

Vue.component('date', {
  props: {
    dateString: String,
  },
  computed: {
    dateArray: function() {
      var digit = this.dateString.split('-').map(function(d) { return parseInt(d); });
      return { y: digit[0], m: digit[1], d: digit[2] };
    },
  },
  template: `
  <time class="date" :datetime="dateString"><span>{{ dateArray.y }}</span><span class="date-separator">/</span><span>{{ dateArray.m }}</span><span class="date-separator">/</span><span>{{ dateArray.d }}</span></time>
  `,
});
Vue.component('time-period', {
  props: {
    start: String,
    end: String,
  },
  computed: {
    timeString: function() {
      return this.start + '-' + this.end;
    },
    humanFriendlyString: function() {
      start = this.start.split(':').map(function(d) { return parseInt(d); });
      end = this.end.split(':').map(function(d) { return parseInt(d); });
      start = { h: start[0] - (start[0] > 12 ? 12 : 0), m: start[1], pm: start[0] >= 12 };
      end = { h: end[0] - (end[0] > 12 ? 12 : 0), m: end[1], pm: end[0] >= 12 };
      return (
        start.h + (start.m > 0 ? ':' + (start.m < 10 ? '0' : '') + start.m : '') + (start.pm != end.pm ? (start.pm ? 'pm' : 'am') : '') + '-' +
        end.h + (end.m > 0 ? ':' + (end.m < 10 ? '0' : '') + end.m : '') + (end.pm ? 'pm' : 'am')
      );
    }
  },
  template: `
  <time class="time" :datetime="timeString">{{ humanFriendlyString }}</time>
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
      <h2 class="title">{{ e.title }}</h2>
      <date :dateString="e.date"></date>
      <time-period :start="e.start" :end="e.end"></time-period>
    </div>
    <div v-if="e.partners.length > 0" class="partners">
      <ul class="list list-unstyled"><label>合作夥伴</label>
        <partner v-for="p in e.partners" :key="p.name" :p="p"></partner>
      </ul>
    </div>
  </div>
  `,
});
Vue.component('event-with-signup', {
  mixins: [mxEvent],
  template: `
  <div class="event event-with-signup container-fluid container-960">
    <div class="row">
      <div class="col-lg-4">
        <div class="info">
          <h2 class="title">{{ e.title }}</h2>
          <date :dateString="e.date" class="date-large"></date>
          <time-period :start="e.start" :end="e.end" class="time-large"></time-period>
        </div>
        <div class="description pgroup">
          {{ e.description }}
        </div>
        <div v-if="e.partners.length > 0" class="partners">
          <ul class="list list-unstyled"><label>合作夥伴</label>
            <partner v-for="p in e.partners" :key="p.name" :p="p"></partner>
          </ul>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="guests">
          <ul class="list list-unstyled d-flex flex-row flex-wrap justify-content-start">
            <guest v-for="g in e.guests" :key="g.name" :g="g"></guest><a class="guest signup" :href="e.signup" target="signup"><div class="photo"></div></a>
          </ul>
        </div>
      </div>
    </div>
  </div>
  `,
});
Vue.component('event-in-list', {
  mixins: [mxEvent],
  computed: {
    classes: function() {
      var flag = this.e.guests.length%3;
      return {
        event: {
          'guest-one': (this.e.guests.length == 1),
        },
        guest: {
          'photo-large': (this.e.guests.length == 1),
          'photo-small': (this.e.guests.length > 2),
        },
        links: {
          'flex-row': !flag,
          'flex-column': flag,
          'contained': flag,
        },
      };
    }
  },
  template: `
  <div class="event event-in-list" :class="classes.event">
    <div class="info">
      <date :dateString="e.date"></date>
      <h3 class="title">{{ e.title }}</h3>
    </div>
    <div class="guests">
      <ul class="list list-unstyled d-flex flex-row flex-wrap justify-content-end">
        <guest v-for="g in e.guests" :key="g.name" :g="g" :class="classes.guest"></guest>
      </ul>
    </div>
    <div class="links d-flex" :class="classes.links">
      <a class="link" v-if="e.livestream" :href="e.livestream" target="livestream"><div class="logo logo-small woo"></div><span>直播</span></a>
      <a class="link" v-if="e.report" :href="e.report" target="report"><div class="logo logo-small musou"></div><span>報導</span></a>
      <a class="link" v-if="e.transcript" :href="e.transcript" target="transcript"><div class="icon icon-small transcript"></div><span>逐字稿</span></a>
    </div>
  </div>
  `,
});

var app = new Vue({
  el: '#app',
  data: {
    generatedAt: new Date(),
    cover: {
      title: '沃草給問擂台',
      image: 'key_visual.png',
    },
    now: {
      title: 'NOW',
      status: 'LIVE',
      event: events.now,
    },
    next: {
      title: 'NEXT',
      event: events.next,
    },
    intro: {
      title: '什麼是給問？',
      content: '生如正動實分友時況；愛相氣還算民西毒期先師經運向才管不的後些十？公自本般；自一覺半，的真明義養，我我社白但送改準行品高表也景、理天天廣人性眾十率親想的南。數這東，都為由體當安火，坐中西我在那者不共一小支爸公眼國一參人我！了的出一北失全整求預率眼，輕的？',
    },
    history: {
      title: '歷史紀錄',
      events: events.history,
    }
  },
  computed: {
    styles: function() {
      return {
        cover: {
          backgroundImage: 'url(asset/' + this.cover.image + ')'
        }
      };
    }
  }
});
