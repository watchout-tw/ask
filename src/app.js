Vue.component('guest', {
  props: {
    g: {
      type: Object,
      validator: function(data) {
        return true;
      }
    }
  },
  computed: {
    styles: function() {
      var photoURL = null;
      if(!!this.g.photo) {
        if(this.g.photo.indexOf('http') >= 0)
          photoURL = this.g.photo + this.g.name + '.jpg';
        else
          photoURL = 'asset/guests/' + this.g.photo;
      }
      return {
        photo: photoURL ? { backgroundImage: 'url(' + photoURL + ')' } : {}
      }
    },
  },
  template: `
  <li class="guest">
    <div class="photo" :style="styles.photo"></div>
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
    <div class="player-container">
      <div class="player embed-responsive embed-responsive-16by9" @click="play">
        <div class="content embed-responsive-item" :style="player.styles"></div>
        <div class="play"></div>
      </div>
    </div>
    <div class="container-fluid container-960">
      <div class="d-sm-flex justify-content-between">
        <div class="info">
          <h2 class="title">{{ e.title }}</h2>
          <date :dateString="e.date"></date>
          <time-period :start="e.start" :end="e.end"></time-period>
        </div>
        <div class="organizers text-sm-right" v-if="!!e.organizers && e.organizers.length > 0">
          <ul class="list list-unstyled"><label>合作夥伴</label>
            <partner v-for="p in e.organizers" :key="p.name" :p="p"></partner>
          </ul>
        </div>
      </div>
    </div>
  </div>
  `,
  methods: {
    play: function(event) {
      var url = 'https://www.youtube.com/embed/' + this.youtubeID + '?autoplay=1';
      $('.player > .content').replaceWith('<iframe class="content embed-responsive-item" src="' + url + '" frameborder="0" allowfullscreen></iframe>');
      $('.player > .play').fadeOut();
    },
  }
});
Vue.component('event-with-signup', {
  mixins: [mxEvent],
  computed: {
    newline: function() {
      return "\n";
    },
  },
  template: `
  <div class="event event-with-signup">
    <div class="container-fluid container-960">
      <div class="row">
        <div class="col-md-auto col-lg-4">
          <div class="info">
            <h2 class="title">{{ e.title }}</h2>
            <date :dateString="e.date" class="date-large"></date>
            <time-period :start="e.start" :end="e.end" class="time-large"></time-period>
          </div>
          <div class="description pgroup">
            <p v-for="paragraph in e.description.split(this.newline)">{{ paragraph }}</p>
          </div>
          <div v-if="!!e.organizers && e.organizers.length > 0" class="organizers">
            <ul class="list list-unstyled"><label>合作夥伴</label>
              <partner v-for="p in e.organizers" :key="p.name" :p="p"></partner>
            </ul>
          </div>
        </div>
        <div class="col-md col-lg-8">
          <div v-if="!!e.guests && e.guests.length > 0" class="guests">
            <ul class="list list-unstyled d-flex flex-row flex-wrap justify-content-center justify-content-md-start">
              <guest v-for="g in e.guests" :key="g.name" :g="g"></guest><a class="guest signup" :href="e.signup" target="signup"><div class="photo"></div></a>
            </ul>
          </div>
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
    <div v-if="!!e.guests && e.guests.length > 0" class="guests">
      <ul class="list list-unstyled d-flex flex-row flex-wrap justify-content-end">
        <guest v-for="g in e.guests" :key="g.name" :g="g" :class="classes.guest"></guest>
      </ul>
    </div>
    <div class="links d-flex" :class="classes.links">
      <a class="link a-block" v-if="e.livestream" :href="e.livestream" target="livestream"><div class="logo logo-small woo"></div><div class="label"><span class="a-target">直播</span></div></a>
      <a class="link a-block" v-if="e.report" :href="e.report" target="report"><div class="logo logo-small musou"></div><div class="label"><span class="a-target">報導</span></div></a>
      <a class="link a-block" v-if="e.transcript" :href="e.transcript" target="transcript"><div class="icon icon-small transcript"></div><div class="label"><span class="a-target">逐字稿</span></div></a>
    </div>
  </div>
  `,
});

// list (in order) tables (JSON files)
var tables = [
  {
    name: 'events',
    validator: function(r) {
      return !!r.fields.title && !!r.fields.date && !!r.fields.start && !!r.fields.end;
    },
  },
  {
    name: 'guests',
    validator: function(r) {
      return !!r.fields.name;
    },
  },
  {
    name: 'partners',
    validator: function(r) {
      return !!r.fields.name;
    },
  }
];
var app = new Vue({
  el: '#app',
  methods: {
    // do not use arrow function here
    getEventStartTime: function(e) {
      return Math.round(new Date(e.date + 'T' + (e.start.length < 5 ? '0' : '') + e.start + "+08:00").getTime()/1000);
    },
    getEventEndTime: function(e) {
      return Math.round(new Date(e.date + 'T' + (e.end.length < 5 ? '0' : '') + e.end + "+08:00").getTime()/1000);
    },
    getSuccess: function(responses) {
      var that = this;

      // get db ready
      var db = {};
      tables.forEach(function(table, i) {
        db[table.name] = responses[i].body.records.filter(table.validator).map(function(r) {
          return Object.assign(r.fields, {id: r.id}); // add id to fields
        });
      });

      // Sort events by start time
      db.events.sort(function(a, b) {
        return that.getEventStartTime(b) - that.getEventStartTime(a);
      });

      // Join tables & sort events into groups
      var time = { // helper variables
        twoDays: 2*24*60*60,
        now: Math.round(new Date().getTime()/1000),
        start: 0,
        end: 0,
      };
      var events = { // event groups
        isLive: false,
        now: null,
        next: null,
        history: [],
      };
      var matchID = function(element) { // helper function to match IDs
        return (this.id === element.id);
      };
      db.events.forEach(function(e, i) {
        // join guests
        if(!!e.guests && e.guests.length > 0) {
          e.guests = e.guests.map(function(id) {
            return db.guests.find(matchID, {id: id}); // send id to helper function
          });
        }

        // join organizers
        if(!!e.organizers && e.organizers.length > 0) {
          e.organizers = e.organizers.map(function(id) {
            return db.partners.find(matchID, {id: id});
          });
        }

        // sort according to time
        time.start = that.getEventStartTime(e);
        time.end = that.getEventEndTime(e);
        if(time.now >= time.start && time.now <= time.end) { // live event
          events.now = i;
          events.isLive = true;
        }
        else if(time.now < time.start) { // future event
          if(time.start - time.now <= time.twoDays) {
            events.now = i;
            events.isLive = false;
          }
          else {
            events.next = i;
          }
        }
        else {
          events.history.push(i);
        }
      });

      // set
      // https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
      this.$set(this.now, 'status', (events.isLive ? 'LIVE' : 'SOON'));
      this.$set(this.now, 'event', (events.now != null ? db.events[events.now] : null));
      this.$set(this.next, 'event', (events.next != null ? db.events[events.next] : null));
      this.$set(this.history, 'events', events.history.map(function(k) {
        return db.events[k];
      }));
    },
    getError: function(responses) {
      console.error(responses);
    },
  },
  created: function() { // do not use arrow function here
    // load all tables (JSON files)
    Promise.all(tables.map(function(table) {
      return Vue.http.get('data/' + table.name + '.json');
    })).then(this.getSuccess, this.getError);
  },
  data: {
    common: CommonData,
    generatedAt: new Date(),
    cover: {
      title: '沃草給問擂台',
    },
    now: {
      title: 'NOW',
    },
    next: {
      title: 'NEXT',
    },
    intro: {
      title: '什麼是給問？',
      content: ['生如正動實分友時況；愛相氣還算民西毒期先師經運向才管不的後些十？公自本般；自一覺半，的真明義養，我我社白但送改準行品高表也景、理天天廣人性眾十率親想的南。數這東，都為由體當安火，坐中西我在那者不共一小支爸公眼國一參人我！了的出一北失全整求預率眼，輕的？'],
    },
    history: {
      title: '歷史紀錄',
    },
  },
});
