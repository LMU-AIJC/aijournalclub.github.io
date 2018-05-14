const date_parser = (d) => {
  let date = d.split('.')
  return new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]))
}
window.onload = function() {
  const app = new Vue({
    el: '#app',
    data: {
      schedules: schedules,
      messages: messages
    },
    methods: {
      haslink: (meeting) => {
        return meeting.link === null ? false : true
      },
      isAnnouncementValid: (announcement) => {
        const today = new Date()
        return date_parser(announcement.termination) <= today ? false : true
      }
    },
    computed: {
      validMessages: function () {
        return messages.filter(this.isAnnouncementValid)
      },
      events: () => {
        const f = (rule) => {
          return (meeting) => {
            date = date_parser(meeting.date)
            const today = new Date()
            today.setHours(0, 0, 0, 0) // only compare date
            return rule(date, today)
          }
        }
        const compare = (m1, m2) => {
          let date1 = date_parser(m1.date)
          let date2 = date_parser(m2.date)
          return (date1 > date2) ? -1 : (date1 < date2 ? 1 : 0)
        }
        return [
          {
            header: 'Upcoming',
            schedules: schedules.filter(f((a, b) => a >= b ? true : false)).sort(compare)
          },
          {
            header: 'Finished',
            schedules: schedules.filter(f((a, b) => a < b ? true : false)).sort(compare)
          }
        ]
      }
    }
  })
}
