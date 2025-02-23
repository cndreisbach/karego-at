module.exports = {
  name: 'Clinton',
  defaultLat: '36.074',
  defaultLng: '-78.894',
  timezone: 'America/New_York',
  greetings: {
    beforeDawn: 'Good early morning',
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    night: 'Good evening',
  },
  use12HourTime: false,
  weather: {
    icons: 'Nord',
    unit: 'C',
  },
  language: 'en',
  countdowns: [
    { date: '2021-08-20', title: 'first date' },
    { date: '2025-03-14', title: 'spring break' },
    { date: '2025-04-27', title: 'first anniversary' },
  ],
  bookmarkGroups1: [
    {
      icon: 'zap',
      title: 'Quick Links',
      links: [
        ['Email', 'https://app.hey.com'],
        ['Calendar', 'https://calendar.google.com/calendar/r'],
        ['BCP Daily', 'https://bcpdaily.karego.at'],
        [
          'Songbook',
          'https://docs.google.com/document/d/1hnF369WBtUN8AD09qGJUIGThdy4Ssb8gj0xpockxLzw/edit?tab=t.0',
        ],
      ],
    },
  ],
  bookmarkGroups2: [
    {
      icon: 'loader',
      title: 'Distractions',
      links: [
        ['Reader', 'https://read.readwise.io/'],
        ['Marginalia', 'https://search.marginalia.nu/explore/random'],
        ['Lobsters', 'https://lobste.rs'],
      ],
    },
    {
      icon: 'headphones',
      title: 'Sounds',
      links: [
        ['Pocket Casts', 'https://play.pocketcasts.com/podcasts'],
        ['A Soft Murmur', 'https://asoftmurmur.com/'],
        [
          'Aircraft Cabin',
          'https://mynoise.net/NoiseMachines/cabinNoiseGenerator.php',
        ],
        ['generative.fm', 'https://play.generative.fm/browse'],
        ['Radio Garden', 'https://radio.garden/search'],
        ['earth.fm', 'https://earth.fm/'],
      ],
    },
  ],
}
