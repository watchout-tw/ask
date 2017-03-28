var events = {
  live: Factory.event(),
  next: Factory.event(),
  history: [
    Factory.event(), Factory.event()
  ],
};
for(var e of events.history) {
  e.tag = 'li';
}

Vue.component('event', {
  template: `
  <li class="event">
    <h3>{{ e.title }}</h3>
    <time :datetime="e.date">{{ e.date }}</time>
    <time :datetime="e.start">{{ e.start }}</time>
    <time :datetime="e.end">{{ e.end }}</time>
    <div class="pgroup">
      {{ e.description }}
    </div>
    <div class="partners">
      <ul class="list-naked"><label>合作夥伴</label>
        <li v-for="partner in e.partners">{{ partner.name }}</li>
      </ul>
    </div>
  </li>`,
  props: {
    e: {
      type: Object,
      validator: function(value) {
        return true;
      }
    }
  },
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
    live: events.live,
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
