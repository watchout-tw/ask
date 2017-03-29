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
for(var e of events.history) {
  e.tag = 'li';
}

Vue.component('guest', {
  template: `
  <li class="guest d-inline-block align-top">
    <div class="photo"></div>
    <label class="name">{{ g.name }}</label>
    <label class="job">{{ g.job }}</label>
  </li>
  `,
  props: {
    g: {
      type: Object,
      validator: function(data) {
        return true;
      }
    }
  }
});

Vue.component('partner', {
    template: `
    <li>{{ p.name }}</li>
    `,
    props: {
      p: {
        type: Object,
        validator: function(data) {
          return true;
        }
      }
    }
});

var app = new Vue({
  el: '#app',
  data: {
    generatedAt: new Date(),
    status: 'LIVE',
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
