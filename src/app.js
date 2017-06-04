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
    video: function() {
      return {
        youtube: this.e.youtube,
        facebook: this.e.facebook,
        livehousein: this.e.livehousein,
      }[this.e.primary];
    },
    youtubeID: function() {
      return this.e.youtube.split('/').pop();
    },
    player: function() {
      return {
        styles: {
          backgroundImage: 'url(asset/events/' + this.e.keyVisual + ')'
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
      var url, html;
      if(this.e.primary == 'youtube') {
        url = 'https://www.youtube.com/embed/' + this.youtubeID + '?autoplay=1';
        html = '<iframe class="content embed-responsive-item" src="' + url + '" frameborder="0" allowfullscreen></iframe>';
      }
      else if(this.e.primary == 'facebook') {
        url = this.e.facebook;
        html = '<div id="fb-root"></div><script>(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6"; fjs.parentNode.insertBefore(js, fjs); }(document, "script", "facebook-jssdk"));</script>'
          + '<div class="fb-video" data-href="' + url + '" data-allowfullscreen="true" data-width="960" style="position:absolute;top:0;"></div>';
      }
      else if(this.e.primary == 'livehousein') {
        url = this.e.livehousein;
        html = '<iframe width="960" height="350" src="' + url + '" frameborder="0" allowfullscreen></iframe>';
      }
      $('.player > .content').replaceWith(html);
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
    signupType: function() {
      return !!this.e.type && this.e.type.includes('online') ? 'online' : '';
    }
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
              <guest v-for="g in e.guests" :key="g.name" :g="g"></guest><a class="guest signup" :class="signupType" :href="e.signup" target="signup"><div class="photo"></div></a>
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
      <a class="link a-block" v-if="this.video" :href="this.video" target="video"><div class="logo logo-small woo"></div><div class="label"><span class="a-target">影片</span></div></a>
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
        return that.getEventStartTime(b) - that.getEventStartTime(a); // sort date DESC
      });

      // Join tables & sort events into groups
      var twoDays = 2*24*60*60;
      var now = Math.round(new Date().getTime()/1000);
      var events = { // event groups
        live: -1,
        soon: -1,
        next: -1,
        nextCandidates: [],
        history: [],
      };
      var matchID = function(element) { // helper function to match IDs
        return (this.id === element.id);
      };
      db.events.forEach(function(e, i) {
        // map guests
        if(!!e.guests && e.guests.length > 0) {
          e.guests = e.guests.map(function(id) {
            return db.guests.find(matchID, {id: id}); // send id to helper function
          });
        }

        // map organizers
        if(!!e.organizers && e.organizers.length > 0) {
          e.organizers = e.organizers.map(function(id) {
            return db.partners.find(matchID, {id: id});
          });
        }

        // sort into event groups
        e.time = {};
        e.time.start = that.getEventStartTime(e);
        e.time.end = that.getEventEndTime(e);

        if(e.time.end < now) { // event has ended
          events.history.push(i);
        }
        else { // event has not ended
          if(e.time.start <= now) { // event has started
            events.live = i;
          }
          else { // event has not started
            events.nextCandidates.push(i);
            if(e.time.start <= now + twoDays) {
              events.soon = i;
            }
          }
        }
      });
      events.next = events.nextCandidates.pop();
      if(events.next == events.soon && events.live == -1) {
        events.next = events.next - 1;
      }

      // set
      // https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
      this.$set(this.now, 'status', (events.live > -1 ? 'LIVE' : 'SOON'));
      this.$set(this.now, 'event', (events.live > -1 ? db.events[events.live] : events.soon > -1 ? db.events[events.soon] : null));
      this.$set(this.next, 'event', (events.next > -1 > 0 ? db.events[events.next] : null));
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
      title: '給問預告',
    },
    intro: {
      title: '什麼是給問？',
      content: ['給問擂台是沃草2017年系列活動，以「直接、公開、對話」等原則，嘗試建構出政治人物與公民直接溝通的平台。另外，透過分組討論的互動方式，也能讓公民理解代議政治的內涵。', '這是一場模擬代議政治的社會實驗，期待實驗成果成為公民社會茁壯的養分。'],
    },
    history: {
      title: '給問歷史',
    },
  },
});
