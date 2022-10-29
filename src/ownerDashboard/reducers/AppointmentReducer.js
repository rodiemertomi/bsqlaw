import create from 'zustand'

const UseAppointmentStore = create(set => ({
  eventTimeStart: '',
  eventTimeEnd: '',
  eventName: '',
  eventDesc: '',
  eventDateStart: '',
  eventDateEnd: '',
  event: {},
  client: '',

  setEventTimeStart: newEventTimeStart =>
    set(() => ({
      eventTimeStart: newEventTimeStart,
    })),
  setEventTimeEnd: newEventTimeEnd =>
    set(() => ({
      eventTimeEnd: newEventTimeEnd,
    })),
  setEventName: newEventName =>
    set(() => ({
      eventName: newEventName,
    })),
  setEventDesc: newEventDesc =>
    set(() => ({
      eventDesc: newEventDesc,
    })),
  setEventDateStart: newEventDateStart =>
    set(() => ({
      eventDateStart: newEventDateStart,
    })),
  setEventDateEnd: newEventDateEnd =>
    set(() => ({
      eventDateEnd: newEventDateEnd,
    })),
  setClient: newClient =>
    set(() => ({
      client: newClient,
    })),
  setEvent: (
    newClient,
    newEventName,
    newEventDesc,
    newEventStart,
    newEventEnd,
    newEventDateStart,
    newEventDateEnd
  ) =>
    set(() => ({
      event: {
        client: newClient,
        eventName: newEventName,
        eventDesc: newEventDesc,
        eventStart: newEventStart,
        eventEnd: newEventEnd,
        eventDateStart: newEventDateStart,
        eventDateEnd: newEventDateEnd,
      },
    })),
}))

export default UseAppointmentStore
