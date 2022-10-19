import create from 'zustand'

const UseAppointmentStore = create(set => ({
  eventTimeStart: '',
  eventTimeEnd: '',
  eventName: '',
  eventDesc: '',
  eventDateStart: '',
  eventDateEnd: '',
  info: false,
  event: {},

  setEventTimeStart: newEventTimeStart =>
    set(state => ({
      eventTimeStart: newEventTimeStart,
    })),
  setEventTimeEnd: newEventTimeEnd =>
    set(state => ({
      eventTimeEnd: newEventTimeEnd,
    })),
  setEventName: newEventName =>
    set(state => ({
      eventName: newEventName,
    })),
  setEventDesc: newEventDesc =>
    set(state => ({
      eventDesc: newEventDesc,
    })),
  setEventDateStart: newEventDateStart =>
    set(state => ({
      eventDateStart: newEventDateStart,
    })),
  setEventDateEnd: newEventDateEnd =>
    set(state => ({
      eventDateEnd: newEventDateEnd,
    })),

  setInfo: info =>
    set(state => ({
      info: !state.info,
    })),
  setEvent: (
    newEventStart,
    newEventEnd,
    newEventName,
    newEventDesc,
    newEventDateStart,
    newEventDateEnd,
    newInfo
  ) =>
    set(() => ({
      event: {
        eventStart: newEventStart,
        eventEnd: newEventEnd,
        eventDesc: newEventDesc,
        eventName: newEventName,
        eventDateStart: newEventDateStart,
        eventDateEnd: newEventDateEnd,
        info: newInfo,
      },
    })),
}))

export default UseAppointmentStore
